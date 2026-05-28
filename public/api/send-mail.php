<?php
// ─────────────────────────────────────────────────────────────────────────────
// ON Coaching — Envoi email de confirmation (contact + RDV)
// Appelé par le formulaire React après l'insert Supabase
// ─────────────────────────────────────────────────────────────────────────────

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST')    { http_response_code(405); echo json_encode(['error' => 'Method not allowed']); exit; }

// ── Resend config ──────────────────────────────────────────────────────────────
$configFile = __DIR__ . '/resend-config.php';
if (file_exists($configFile)) {
    require_once $configFile;
} else {
    define('RESEND_API_KEY', '');
    define('RESEND_FROM',    'ON Coaching <noreply@oncoaching.fr>');
}

// ── Lecture du body JSON ───────────────────────────────────────────────────────
$body = json_decode(file_get_contents('php://input'), true);
if (!$body) { http_response_code(400); echo json_encode(['error' => 'Invalid JSON']); exit; }

$type    = $body['type']    ?? 'contact';
$name    = trim($body['name']    ?? '');
$email   = trim($body['email']   ?? '');
$phone   = trim($body['phone']   ?? '');
$service = trim($body['service'] ?? '');
$subject = trim($body['subject'] ?? '');
$message = trim($body['message'] ?? '');
$date    = trim($body['preferredDate'] ?? '');
$time    = trim($body['preferredTime'] ?? '');

if (!$name || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Nom ou email invalide']);
    exit;
}

// ── Config ─────────────────────────────────────────────────────────────────────
define('BRAND_NAME',    'ON Coaching');
define('BRAND_EMAIL',   'contact@oncoaching.fr');
define('BRAND_PHONE',   '+33 06 63 04 18 12');
define('BRAND_ADDRESS', '14 rue des écureuils, 71000 Sancé');
define('BRAND_SITE',    'https://www.oncoaching.fr');
define('BRAND_COLOR',   '#C4903E');
define('BRAND_NAVY',    '#1C3A52');

$serviceLabels = [
    'coaching-de-vie'       => 'Coaching scolaire & étudiant',
    'coaching-de-carriere'  => 'Coaching jeunes & jeunes adultes',
    'coaching-d-equipe'     => 'Coaching & Neurofeedback',
    'coaching-de-dirigeants'=> "Coaching d'équipe",
    'autre'                 => 'Autre',
];
$timeLabels = [
    'matin'      => 'Matin (8h–12h)',
    'apres-midi' => 'Après-midi (14h–18h)',
    'flexible'   => 'Flexible',
];

$serviceLabel = $serviceLabels[$service] ?? $service;
$timeLabel    = $timeLabels[$time]       ?? 'Flexible';
$firstName    = explode(' ', $name)[0];

// Formater la date
$dateFormatted = 'À définir';
if ($date) {
    $ts = strtotime($date);
    if ($ts) {
        setlocale(LC_TIME, 'fr_FR.UTF-8', 'fr_FR', 'fr');
        $dateFormatted = ucfirst(strftime('%A %e %B %Y', $ts));
        if ($dateFormatted === false || $dateFormatted === $date) {
            $dateFormatted = date('d/m/Y', $ts);
        }
    }
}

// ── Resend API helper ──────────────────────────────────────────────────────────
function resend_send($to, $subject, $html) {
    if (!defined('RESEND_API_KEY') || !RESEND_API_KEY) return false;
    $payload = json_encode([
        'from'    => RESEND_FROM,
        'to'      => is_array($to) ? $to : [$to],
        'subject' => $subject,
        'html'    => $html,
    ]);
    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . RESEND_API_KEY,
            'Content-Type: application/json',
        ],
        CURLOPT_TIMEOUT        => 15,
    ]);
    $resp     = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $httpCode >= 200 && $httpCode < 300;
}

// ── Helpers HTML ───────────────────────────────────────────────────────────────
function row($label, $value) {
    if (!$value) return '';
    return "
    <tr>
      <td style='padding:5px 0;font-size:12px;font-weight:600;color:#9ca3af;width:120px;vertical-align:top;'>$label</td>
      <td style='padding:5px 0;font-size:13px;color:#1C3A52;font-weight:500;'>$value</td>
    </tr>";
}

function rowLong($label, $value) {
    if (!$value) return '';
    $v = nl2br(htmlspecialchars($value));
    return "
    <tr><td colspan='2' style='padding:10px 0 4px;font-size:12px;font-weight:600;color:#9ca3af;'>$label</td></tr>
    <tr><td colspan='2' style='padding:0 0 6px;font-size:13px;color:#374151;line-height:1.6;'>$v</td></tr>";
}

function step($num, $title, $desc) {
    return "
    <table width='100%' cellpadding='0' cellspacing='0' border='0' style='margin-bottom:12px;'>
      <tr>
        <td width='36' valign='top' style='padding-top:2px;'>
          <div style='width:28px;height:28px;border-radius:50%;background:#C4903E;text-align:center;line-height:28px;font-size:12px;font-weight:800;color:#fff;'>$num</div>
        </td>
        <td style='padding-left:12px;'>
          <p style='margin:0 0 2px;font-size:13px;font-weight:700;color:#1C3A52;'>$title</p>
          <p style='margin:0;font-size:12px;color:#6b7280;line-height:1.5;'>$desc</p>
        </td>
      </tr>
    </table>";
}

function baseLayout($content, $preheader) {
    $name    = BRAND_NAME;
    $email   = BRAND_EMAIL;
    $phone   = BRAND_PHONE;
    $address = BRAND_ADDRESS;
    $site    = BRAND_SITE;
    $navy    = BRAND_NAVY;
    $gold    = BRAND_COLOR;
    $logo    = $site . '/faviconNoText.png';

    return "<!DOCTYPE html>
<html lang='fr'>
<head>
  <meta charset='UTF-8'/>
  <meta name='viewport' content='width=device-width,initial-scale=1.0'/>
  <title>$name</title>
</head>
<body style='margin:0;padding:0;background:#F4F1EC;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;'>
  <span style='display:none;font-size:1px;color:#F4F1EC;max-height:0;overflow:hidden;'>$preheader</span>
  <table width='100%' cellpadding='0' cellspacing='0' border='0' style='background:#F4F1EC;min-height:100vh;'>
    <tr><td align='center' style='padding:40px 16px;'>
      <table width='100%' cellpadding='0' cellspacing='0' border='0' style='max-width:600px;'>

        <tr>
          <td style='background:$navy;border-radius:24px 24px 0 0;padding:36px 40px 28px;text-align:center;'>
            <img src='$logo' width='48' height='48' alt='$name' style='margin-bottom:16px;border-radius:12px;'/>
            <p style='margin:0;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:$gold;'>ON COACHING</p>
            <p style='margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.4);letter-spacing:1px;'>MÂCON · SAÔNE-ET-LOIRE</p>
          </td>
        </tr>

        <tr>
          <td style='background:#ffffff;padding:40px 40px 32px;'>
            $content
          </td>
        </tr>

        <tr>
          <td style='background:#F4F1EC;border-radius:0 0 24px 24px;padding:24px 40px;text-align:center;border-top:1px solid #e8e4de;'>
            <p style='margin:0 0 8px;font-size:13px;color:#9ca3af;'>
              <a href='tel:$phone' style='color:$navy;text-decoration:none;font-weight:600;'>$phone</a>
              &nbsp;·&nbsp;
              <a href='mailto:$email' style='color:$navy;text-decoration:none;font-weight:600;'>$email</a>
            </p>
            <p style='margin:0;font-size:12px;color:#c4c4c4;'>$address</p>
            <p style='margin:12px 0 0;font-size:11px;'>
              <a href='$site' style='color:$gold;text-decoration:none;'>$site</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>";
}

// ── Template Contact ────────────────────────────────────────────────────────────
function buildContactEmail($firstName, $name, $email, $phone, $serviceLabel, $subject, $message) {
    $gold = BRAND_COLOR;
    $navy = BRAND_NAVY;
    $site = BRAND_SITE;

    $content = "
    <h1 style='margin:0 0 8px;font-size:26px;font-weight:800;color:$navy;line-height:1.2;'>
      Message bien reçu,<br/><span style='color:$gold;'>$firstName !</span>
    </h1>
    <p style='margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.6;'>
      Merci pour votre message. Nous vous répondrons dans les <strong style='color:$navy;'>24 heures</strong>.
    </p>

    <table width='100%' cellpadding='0' cellspacing='0' border='0' style='background:#F9F7F4;border-radius:16px;overflow:hidden;margin-bottom:28px;'>
      <tr><td style='padding:20px 24px;border-bottom:1px solid #f0ece6;'>
        <p style='margin:0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:$gold;'>Récapitulatif de votre message</p>
      </td></tr>
      <tr><td style='padding:16px 24px;'>
        <table width='100%' cellpadding='0' cellspacing='0' border='0'>
          " . row('Nom', htmlspecialchars($name))
           . row('Email', htmlspecialchars($email))
           . row('Téléphone', htmlspecialchars($phone))
           . row('Service', htmlspecialchars($serviceLabel))
           . row('Sujet', htmlspecialchars($subject))
           . rowLong('Message', $message) . "
        </table>
      </td></tr>
    </table>

    <div style='text-align:center;margin-bottom:28px;'>
      <a href='$site/contact' style='display:inline-block;background:$navy;color:#ffffff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:50px;text-decoration:none;'>
        Visiter notre site
      </a>
    </div>

    <table width='100%' cellpadding='0' cellspacing='0' border='0' style='background:linear-gradient(135deg,#1C3A52,#2a4f6e);border-radius:16px;overflow:hidden;'>
      <tr><td style='padding:20px 24px;'>
        <p style='margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:$gold;'>Le saviez-vous ?</p>
        <p style='margin:0;font-size:14px;color:rgba(255,255,255,0.85);line-height:1.5;'>
          Votre <strong style='color:#fff;'>1er rendez-vous est offert</strong>, sans engagement. C'est l'occasion de faire connaissance et de définir ensemble votre programme.
        </p>
      </td></tr>
    </table>";

    return baseLayout($content, "Merci $firstName, nous vous répondrons dans les 24h.");
}

// ── Template RDV ────────────────────────────────────────────────────────────────
function buildRdvEmail($firstName, $name, $email, $phone, $serviceLabel, $message, $dateFormatted, $timeLabel) {
    $gold = BRAND_COLOR;
    $navy = BRAND_NAVY;
    $phone_brand = BRAND_PHONE;

    $content = "
    <h1 style='margin:0 0 8px;font-size:26px;font-weight:800;color:$navy;line-height:1.2;'>
      Demande reçue,<br/><span style='color:$gold;'>$firstName !</span>
    </h1>
    <p style='margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.6;'>
      Votre demande de rendez-vous a bien été enregistrée. Nous vous confirmons le créneau dans les <strong style='color:$navy;'>24 heures</strong>.
    </p>

    <table width='100%' cellpadding='0' cellspacing='0' border='0' style='background:$navy;border-radius:16px;overflow:hidden;margin-bottom:24px;'>
      <tr><td style='padding:24px 28px;'>
        <p style='margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:$gold;'>Créneau souhaité</p>
        <p style='margin:0;font-size:20px;font-weight:800;color:#ffffff;line-height:1.3;'>$dateFormatted</p>
        <p style='margin:4px 0 0;font-size:14px;color:rgba(255,255,255,0.6);'>$timeLabel</p>
      </td></tr>
    </table>

    <table width='100%' cellpadding='0' cellspacing='0' border='0' style='background:#F9F7F4;border-radius:16px;overflow:hidden;margin-bottom:28px;'>
      <tr><td style='padding:20px 24px;border-bottom:1px solid #f0ece6;'>
        <p style='margin:0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:$gold;'>Vos coordonnées</p>
      </td></tr>
      <tr><td style='padding:16px 24px;'>
        <table width='100%' cellpadding='0' cellspacing='0' border='0'>
          " . row('Nom', htmlspecialchars($name))
           . row('Email', htmlspecialchars($email))
           . row('Téléphone', htmlspecialchars($phone))
           . row('Programme', htmlspecialchars($serviceLabel))
           . rowLong('Note', $message) . "
        </table>
      </td></tr>
    </table>

    <p style='margin:0 0 14px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:$navy;'>Prochaines étapes</p>
    " . step('1', 'Confirmation sous 24h', 'Nous vérifions nos disponibilités et vous confirmons le rendez-vous par email ou téléphone.')
      . step('2', 'Consultation gratuite', 'Votre 1er rendez-vous de 45 min est entièrement offert, sans engagement de votre part.')
      . step('3', 'Programme sur mesure', 'Ensemble, nous définissons un accompagnement adapté à vos besoins et objectifs.') . "

    <div style='text-align:center;margin:24px 0 8px;'>
      <a href='tel:$phone_brand' style='display:inline-block;background:$gold;color:#ffffff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:50px;text-decoration:none;'>
        📞 Appeler directement
      </a>
    </div>
    <p style='text-align:center;font-size:12px;color:#9ca3af;margin:8px 0 0;'>Ou répondez simplement à cet email</p>";

    return baseLayout($content, "Votre RDV du $dateFormatted est en cours de confirmation.");
}

// ── Template Notification Admin ────────────────────────────────────────────────
function buildAdminNotifEmail($type, $name, $email, $phone, $service, $subject, $message, $date, $time) {
    $navy = BRAND_NAVY; $gold = BRAND_COLOR;
    $typeLabel = $type === 'rdv' ? '📅 Nouveau RDV' : '💬 Nouveau message';
    $adminUrl  = BRAND_SITE . '/admin/messages';

    $rows = row('Nom', htmlspecialchars($name))
          . row('Email', htmlspecialchars($email))
          . ($phone   ? row('Téléphone', htmlspecialchars($phone))   : '')
          . ($service ? row('Service',   htmlspecialchars($service)) : '')
          . ($type === 'rdv'
              ? row('Date souhaitée', htmlspecialchars($date))
              . row('Créneau', htmlspecialchars($time))
              : row('Sujet', htmlspecialchars($subject)))
          . ($message ? rowLong('Message', $message) : '');

    $content = "
    <h1 style='margin:0 0 8px;font-size:24px;font-weight:800;color:$navy;'>$typeLabel</h1>
    <p style='margin:0 0 24px;font-size:14px;color:#6b7280;'>Reçu le " . date('d/m/Y à H:i') . "</p>
    <table width='100%' cellpadding='0' cellspacing='0' border='0' style='background:#F9F7F4;border-radius:16px;overflow:hidden;margin-bottom:24px;'>
      <tr><td style='padding:16px 24px 4px;'><table width='100%'>$rows</table></td></tr>
    </table>
    <div style='text-align:center;'>
      <a href='$adminUrl' style='display:inline-block;background:$gold;color:#fff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:50px;text-decoration:none;'>
        Voir dans l'admin
      </a>
    </div>";

    return baseLayout($content, "$typeLabel de $name");
}

// ── Construire et envoyer l'email ──────────────────────────────────────────────
if ($type === 'rdv') {
    $mailSubject = '📅 Demande de RDV confirmée — ' . BRAND_NAME;
    $htmlBody    = buildRdvEmail($firstName, $name, $email, $phone, $serviceLabel, $message, $dateFormatted, $timeLabel);
} else {
    $mailSubject = '✅ Votre message a bien été reçu — ' . BRAND_NAME;
    $htmlBody    = buildContactEmail($firstName, $name, $email, $phone, $serviceLabel, $subject, $message);
}

// Email de confirmation au client
$sent = resend_send($email, $mailSubject, $htmlBody);

// Email de notification à l'admin
$adminSubject = ($type === 'rdv' ? '📅 Nouveau RDV' : '💬 Nouveau message') . ' — ' . $name;
$adminBody    = buildAdminNotifEmail($type, $name, $email, $phone, $serviceLabel, $subject, $message, $dateFormatted, $timeLabel);
resend_send(BRAND_EMAIL, $adminSubject, $adminBody);

// Notification push admin
$pushPayload = json_encode([
    'title' => $type === 'rdv' ? '📅 Nouveau RDV — ' . $name : '💬 Nouveau message — ' . $name,
    'body'  => $type === 'rdv'
        ? "Date souhaitée : $dateFormatted · $timeLabel"
        : ($subject ?: ($message ? mb_substr($message, 0, 80) : 'Nouveau contact')),
    'url'   => '/admin/messages',
]);

$pushUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . '/send-push.php';
$pushCh = curl_init($pushUrl);
curl_setopt_array($pushCh, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POSTFIELDS     => $pushPayload,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_TIMEOUT        => 10,
]);
curl_exec($pushCh);
curl_close($pushCh);

if ($sent) {
    echo json_encode(['ok' => true, 'message' => 'Email envoyé à ' . $email]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Échec envoi email']);
}
