<?php
// send-push.php — Web Push VAPID sans Composer
// Appelé depuis send-mail.php après chaque nouveau message

header('Content-Type: application/json');

// ── Config ──────────────────────────────────────────────────────────────────
define('VAPID_PUBLIC_B64',  'BMTFnT5VkXE26vX7YeTjWT_Y5sHSaJouuo15ikIrOnEfvTO0-fp_KokaweYnll_sOFoCNS7TxFcCGcRqzw4tfU');
define('VAPID_PRIVATE_PEM', __DIR__ . '/vapid-private.pem');
define('VAPID_SUBJECT',     'mailto:contact@oncoaching.fr');
define('SUPABASE_URL',      'https://suikwvrlfyupzpzhqoln.supabase.co');
define('SUPABASE_KEY',      'sb_publishable_aoODer12FIz3bHLCjoj-dg_8xWkJ2-Z');

$body = json_decode(file_get_contents('php://input'), true) ?? [];
$title = $body['title'] ?? 'ON Coaching';
$msg   = $body['body']  ?? 'Nouveau message reçu';
$url   = $body['url']   ?? '/admin/messages';

// ── Récupérer les souscriptions depuis Supabase ──────────────────────────────
$ch = curl_init(SUPABASE_URL . '/rest/v1/push_subscriptions?select=endpoint,p256dh,auth');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'apikey: '        . SUPABASE_KEY,
        'Authorization: Bearer ' . SUPABASE_KEY,
    ],
]);
$resp = curl_exec($ch);
curl_close($ch);
$subscriptions = json_decode($resp, true) ?? [];

if (empty($subscriptions)) { echo json_encode(['ok'=>true,'sent'=>0]); exit; }

// ── VAPID JWT ────────────────────────────────────────────────────────────────
function b64url($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function vapid_jwt($audience, $subject, $pem_path) {
    $header  = b64url(json_encode(['typ'=>'JWT','alg'=>'ES256']));
    $payload = b64url(json_encode(['aud'=>$audience,'exp'=>time()+43200,'sub'=>$subject]));
    $signing = "$header.$payload";

    $key = openssl_pkey_get_private('file://' . $pem_path);
    if (!$key) return null;
    openssl_sign($signing, $derSig, $key, OPENSSL_ALGO_SHA256);

    // Convertir DER → raw (r||s, 32 octets chacun)
    $offset = 2; // skip SEQUENCE header
    $offset++; $rLen = ord($derSig[$offset++]);
    $r = substr($derSig, $offset, $rLen); $offset += $rLen;
    $offset++; $sLen = ord($derSig[$offset++]);
    $s = substr($derSig, $offset, $sLen);

    // Normaliser à 32 octets
    $r = str_pad(ltrim($r, "\x00"), 32, "\x00", STR_PAD_LEFT);
    $s = str_pad(ltrim($s, "\x00"), 32, "\x00", STR_PAD_LEFT);

    return "$signing." . b64url($r . $s);
}

// ── Payload chiffré (AES-128-GCM + ECDH) ──────────────────────────────────
function encrypt_payload($plaintext, $p256dh_b64url, $auth_b64url) {
    // Décode les clés du subscriber
    $recv_pub = base64_decode(str_pad(strtr($p256dh_b64url, '-_', '+/'), strlen($p256dh_b64url) + (4 - strlen($p256dh_b64url) % 4) % 4, '='));
    $auth_raw = base64_decode(str_pad(strtr($auth_b64url, '-_', '+/'), strlen($auth_b64url) + (4 - strlen($auth_b64url) % 4) % 4, '='));

    // Générer une paire de clés éphémère
    $local_key = openssl_pkey_new(['curve_name'=>'prime256v1','private_key_type'=>OPENSSL_KEYTYPE_EC]);
    $local_details = openssl_pkey_get_details($local_key);

    // Construire la clé publique du subscriber pour ECDH
    // recv_pub est un point non compressé (04 || x || y)
    $recv_key = openssl_pkey_get_public([
        'curve_name' => 'prime256v1',
        'x' => substr($recv_pub, 1, 32),
        'y' => substr($recv_pub, 33, 32),
    ]);

    // ECDH
    openssl_dh_compute_key($ecdh_secret, $recv_key, $local_key);

    // Clé publique locale (04 || x || y, 65 bytes)
    $local_pub_x = base64_decode($local_details['ec']['x']);
    $local_pub_y = base64_decode($local_details['ec']['y']);
    $local_pub   = "\x04" . str_pad($local_pub_x, 32, "\x00", STR_PAD_LEFT)
                           . str_pad($local_pub_y, 32, "\x00", STR_PAD_LEFT);

    // Sel aléatoire (16 bytes)
    $salt = random_bytes(16);

    // HKDF pour dériver les clés
    $ikm  = hkdf_extract($auth_raw, $ecdh_secret . $local_pub . $recv_pub . "Content-Encoding: auth\x00");
    $cek  = hkdf_expand($ikm, "Content-Encoding: aesgcm\x00" . $auth_raw, 16);
    $nonce= hkdf_expand($ikm, "Content-Encoding: nonce\x00"  . $auth_raw, 12);

    // Chiffrer avec AES-128-GCM
    $padded  = "\x00\x00" . $plaintext; // 2 bytes de padding
    $tag     = '';
    $ciphertext = openssl_encrypt($padded, 'aes-128-gcm', $cek, OPENSSL_RAW_DATA, $nonce, $tag, '', 16);

    return [
        'ciphertext' => $ciphertext . $tag,
        'salt'       => $salt,
        'dh'         => $local_pub,
    ];
}

function hkdf_extract($salt, $ikm) {
    return hash_hmac('sha256', $ikm, $salt, true);
}

function hkdf_expand($prk, $info, $length) {
    $t = '';
    $prev = '';
    for ($i = 1; strlen($t) < $length; $i++) {
        $prev = hash_hmac('sha256', $prev . $info . chr($i), $prk, true);
        $t .= $prev;
    }
    return substr($t, 0, $length);
}

// ── Envoyer les notifications ─────────────────────────────────────────────────
$payload_json = json_encode(['title'=>$title,'body'=>$msg,'url'=>$url]);
$sent = 0; $failed = 0;

foreach ($subscriptions as $sub) {
    $endpoint = $sub['endpoint'];
    $urlParts = parse_url($endpoint);
    $audience = $urlParts['scheme'].'://'.$urlParts['host'];

    $jwt = vapid_jwt($audience, VAPID_SUBJECT, VAPID_PRIVATE_PEM);
    if (!$jwt) { $failed++; continue; }

    $auth_header = 'vapid t=' . $jwt . ',k=' . VAPID_PUBLIC_B64;

    try {
        $encrypted = encrypt_payload($payload_json, $sub['p256dh'], $sub['auth']);
    } catch (\Throwable $e) {
        $failed++;
        continue;
    }

    $ch = curl_init($endpoint);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POSTFIELDS     => $encrypted['ciphertext'],
        CURLOPT_HTTPHEADER     => [
            'Authorization: '   . $auth_header,
            'Content-Type: application/octet-stream',
            'Content-Encoding: aesgcm',
            'Encryption: salt=' . b64url($encrypted['salt']),
            'Crypto-Key: dh='   . b64url($encrypted['dh']) . ';p256ecdsa=' . VAPID_PUBLIC_B64,
            'TTL: 60',
        ],
        CURLOPT_TIMEOUT        => 10,
    ]);
    curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode >= 200 && $httpCode < 300) { $sent++; }
    elseif ($httpCode === 410 || $httpCode === 404) {
        // Souscription expirée — supprimer de Supabase
        $del = curl_init(SUPABASE_URL . '/rest/v1/push_subscriptions?endpoint=eq.' . urlencode($endpoint));
        curl_setopt_array($del, [
            CURLOPT_CUSTOMREQUEST  => 'DELETE',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => ['apikey: '.SUPABASE_KEY,'Authorization: Bearer '.SUPABASE_KEY],
        ]);
        curl_exec($del); curl_close($del);
        $failed++;
    } else { $failed++; }
}

echo json_encode(['ok'=>true,'sent'=>$sent,'failed'=>$failed]);
