<?php
ini_set('display_errors', 0);
error_reporting(0);

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Méthode non autorisée"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["message" => "Aucune donnée reçue"]);
    exit;
}

$type    = in_array($data['type'] ?? '', ['contact', 'rdv']) ? $data['type'] : 'contact';
$name    = htmlspecialchars(trim($data['name'] ?? ''));
$email   = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone   = htmlspecialchars(trim($data['phone'] ?? ''));
$service = htmlspecialchars(trim($data['service'] ?? ''));
$message = htmlspecialchars(trim($data['message'] ?? ''));

// RDV-specific fields
$preferredDate  = htmlspecialchars(trim($data['preferredDate'] ?? ''));
$preferredTime  = htmlspecialchars(trim($data['preferredTime'] ?? ''));
$preferredDate2 = htmlspecialchars(trim($data['preferredDate2'] ?? ''));
$preferredTime2 = htmlspecialchars(trim($data['preferredTime2'] ?? ''));
$sessionFormat  = htmlspecialchars(trim($data['sessionFormat'] ?? ''));

// Contact-specific fields
$subject = htmlspecialchars(trim($data['subject'] ?? ''));

if (!$name || !$email) {
    http_response_code(400);
    echo json_encode(["message" => "Champs requis manquants"]);
    exit;
}

if ($type === 'contact' && (!$subject || !$message)) {
    http_response_code(400);
    echo json_encode(["message" => "Sujet et message requis"]);
    exit;
}

if ($type === 'rdv' && !$preferredDate) {
    http_response_code(400);
    echo json_encode(["message" => "Veuillez indiquer une date souhaitée"]);
    exit;
}

$to = "contact@oncoaching.fr";
$isRdv = $type === 'rdv';
$typeLabel = $isRdv ? 'Demande de rendez-vous' : 'Message de contact';
$accentColor = '#1ab5c7';
$darkBg = '#0B0B0C';

// ── Formatage des dates ──────────────────────────────────────────────────────
function formatDate(string $d): string {
    if (!$d) return '';
    $ts = strtotime($d);
    return $ts ? strftime('%A %d %B %Y', $ts) : $d;
}

$dateFormatted  = $preferredDate  ? formatDate($preferredDate)  : '';
$date2Formatted = $preferredDate2 ? formatDate($preferredDate2) : '';

// ── Template HTML email ──────────────────────────────────────────────────────
ob_start();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title><?= $typeLabel ?> — ON Coaching</title>
</head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:48px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- HEADER -->
  <tr>
    <td style="background:<?= $darkBg ?>;border-radius:20px 20px 0 0;padding:36px 48px;text-align:center;">
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.35);font-weight:600;">ON COACHING · SANCÉ, FRANCE</p>
      <h1 style="margin:0;font-size:28px;font-weight:700;color:#fff;letter-spacing:-0.5px;">
        ON <span style="color:<?= $accentColor ?>;">Coaching</span>
      </h1>
      <div style="margin:18px auto 0;display:inline-block;background:<?= $accentColor ?>;border-radius:100px;padding:6px 20px;">
        <p style="margin:0;font-size:12px;font-weight:700;color:#fff;letter-spacing:1px;text-transform:uppercase;"><?= $typeLabel ?></p>
      </div>
    </td>
  </tr>

  <!-- BODY -->
  <tr>
    <td style="background:#ffffff;padding:40px 48px;">

      <?php if ($isRdv): ?>
      <!-- RDV banner -->
      <div style="background:linear-gradient(135deg,#e8fafb,#d1f4f8);border:1px solid #a8eaf0;border-radius:14px;padding:20px 24px;margin-bottom:32px;">
        <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:<?= $accentColor ?>;letter-spacing:2px;text-transform:uppercase;">Nouvelle demande de RDV</p>
        <p style="margin:0;font-size:22px;font-weight:700;color:<?= $darkBg ?>;"><?= $name ?> souhaite vous rencontrer</p>
      </div>
      <?php else: ?>
      <!-- Contact banner -->
      <div style="background:#f8f9fa;border-left:4px solid <?= $accentColor ?>;border-radius:0 12px 12px 0;padding:16px 20px;margin-bottom:32px;">
        <p style="margin:0 0 2px;font-size:11px;font-weight:700;color:<?= $accentColor ?>;letter-spacing:2px;text-transform:uppercase;">Nouveau message</p>
        <p style="margin:0;font-size:20px;font-weight:700;color:<?= $darkBg ?>;"><?= $subject ?></p>
      </div>
      <?php endif ?>

      <!-- Coordonnées -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td style="padding:0 0 16px;">
            <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#9ca3af;">Coordonnées</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa;border-radius:12px;overflow:hidden;">
              <tr>
                <td style="padding:14px 20px;border-bottom:1px solid #f0f0f0;">
                  <span style="font-size:12px;color:#9ca3af;display:block;margin-bottom:2px;">Nom complet</span>
                  <span style="font-size:15px;font-weight:600;color:<?= $darkBg ?>;"><?= $name ?></span>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 20px;border-bottom:1px solid #f0f0f0;">
                  <span style="font-size:12px;color:#9ca3af;display:block;margin-bottom:2px;">Email</span>
                  <a href="mailto:<?= $email ?>" style="font-size:15px;font-weight:600;color:<?= $accentColor ?>;text-decoration:none;"><?= $email ?></a>
                </td>
              </tr>
              <?php if ($phone): ?>
              <tr>
                <td style="padding:14px 20px;border-bottom:1px solid #f0f0f0;">
                  <span style="font-size:12px;color:#9ca3af;display:block;margin-bottom:2px;">Téléphone</span>
                  <a href="tel:<?= preg_replace('/\s/', '', $phone) ?>" style="font-size:15px;font-weight:600;color:<?= $darkBg ?>;text-decoration:none;"><?= $phone ?></a>
                </td>
              </tr>
              <?php endif ?>
              <?php if ($service): ?>
              <tr>
                <td style="padding:14px 20px;">
                  <span style="font-size:12px;color:#9ca3af;display:block;margin-bottom:2px;">Service souhaité</span>
                  <span style="font-size:15px;font-weight:600;color:<?= $darkBg ?>;"><?= $service ?></span>
                </td>
              </tr>
              <?php endif ?>
            </table>
          </td>
        </tr>
      </table>

      <?php if ($isRdv): ?>
      <!-- Disponibilités RDV -->
      <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#9ca3af;">Disponibilités souhaitées</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <!-- Créneau 1 -->
          <td width="48%" style="vertical-align:top;">
            <div style="background:linear-gradient(135deg,<?= $accentColor ?>,#0e8a99);border-radius:12px;padding:18px 20px;color:#fff;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;opacity:0.75;">1er choix</p>
              <p style="margin:0;font-size:16px;font-weight:700;"><?= $dateFormatted ?></p>
              <?php if ($preferredTime): ?>
              <p style="margin:6px 0 0;font-size:13px;opacity:0.85;">vers <?= $preferredTime ?></p>
              <?php endif ?>
            </div>
          </td>
          <?php if ($date2Formatted): ?>
          <td width="4%"></td>
          <!-- Créneau 2 -->
          <td width="48%" style="vertical-align:top;">
            <div style="background:#f8f9fa;border:1px solid #e5e7eb;border-radius:12px;padding:18px 20px;color:<?= $darkBg ?>;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#9ca3af;">2e choix</p>
              <p style="margin:0;font-size:16px;font-weight:700;"><?= $date2Formatted ?></p>
              <?php if ($preferredTime2): ?>
              <p style="margin:6px 0 0;font-size:13px;color:#6b7280;">vers <?= $preferredTime2 ?></p>
              <?php endif ?>
            </div>
          </td>
          <?php endif ?>
        </tr>
      </table>

      <?php if ($sessionFormat): ?>
      <div style="background:#f8f9fa;border-radius:10px;padding:14px 20px;margin-bottom:28px;display:inline-block;">
        <span style="font-size:12px;color:#9ca3af;margin-right:8px;">Format :</span>
        <span style="font-size:14px;font-weight:600;color:<?= $darkBg ?>;"><?= $sessionFormat ?></span>
      </div>
      <?php endif ?>

      <?php if ($message): ?>
      <!-- Note additionnelle -->
      <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#9ca3af;">Note additionnelle</p>
      <div style="background:#f8f9fa;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
        <p style="margin:0;font-size:15px;line-height:1.7;color:#374151;"><?= nl2br($message) ?></p>
      </div>
      <?php endif ?>

      <!-- CTA Répondre -->
      <div style="text-align:center;padding-top:8px;">
        <a href="mailto:<?= $email ?>?subject=Re: Demande de RDV — <?= urlencode($name) ?>" style="display:inline-block;background:<?= $accentColor ?>;color:#fff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:100px;text-decoration:none;letter-spacing:0.3px;">
          Confirmer le rendez-vous
        </a>
      </div>

      <?php else: ?>
      <!-- Message de contact -->
      <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#9ca3af;">Message</p>
      <div style="background:#f8f9fa;border-radius:12px;padding:24px 28px;margin-bottom:28px;">
        <p style="margin:0;font-size:15px;line-height:1.8;color:#374151;"><?= nl2br($message) ?></p>
      </div>

      <!-- CTA Répondre -->
      <div style="text-align:center;padding-top:8px;">
        <a href="mailto:<?= $email ?>?subject=Re: <?= urlencode($subject) ?>" style="display:inline-block;background:<?= $accentColor ?>;color:#fff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:100px;text-decoration:none;letter-spacing:0.3px;">
          Répondre à <?= $name ?>
        </a>
      </div>
      <?php endif ?>

    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#f8f9fa;border-radius:0 0 20px 20px;padding:24px 48px;text-align:center;border-top:1px solid #f0f0f0;">
      <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">ON Coaching · 14 rue des écureuils, 71000 Sancé, France</p>
      <p style="margin:0;font-size:11px;color:#d1d5db;">
        Site créé par <a href="https://www.alhambra-web.com" style="color:<?= $accentColor ?>;text-decoration:none;font-weight:600;">Alhambra Web</a>
        · Ce message a été généré automatiquement depuis le formulaire de contact.
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>
<?php
$htmlBody = ob_get_clean();

// ── Sujet de l'email ─────────────────────────────────────────────────────────
$mailSubject = $isRdv
    ? "[RDV OM Coaching] $name — $dateFormatted"
    : "[Contact OM Coaching] $name — $subject";

// ── Headers ──────────────────────────────────────────────────────────────────
$boundary = md5(uniqid());
$headers  = "From: ON Coaching <no-reply@oncoaching.fr>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/alternative; boundary=\"$boundary\"\r\n";

// ── Corps multipart (text/plain fallback + HTML) ──────────────────────────────
$plainText = $isRdv
    ? "Nouvelle demande de RDV\n\nNom : $name\nEmail : $email\nTéléphone : $phone\nService : $service\n\nCréneau 1 : $dateFormatted ($preferredTime)\nCréneau 2 : $date2Formatted ($preferredTime2)\nFormat : $sessionFormat\n\nNote : $message"
    : "Nouveau message de contact\n\nNom : $name\nEmail : $email\nTéléphone : $phone\nService : $service\nSujet : $subject\n\nMessage :\n$message";

$body  = "--$boundary\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: base64\r\n\r\n";
$body .= chunk_split(base64_encode($plainText)) . "\r\n";
$body .= "--$boundary\r\n";
$body .= "Content-Type: text/html; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: base64\r\n\r\n";
$body .= chunk_split(base64_encode($htmlBody)) . "\r\n";
$body .= "--$boundary--";

// ── Sauvegarde JSON ───────────────────────────────────────────────────────────
$submissionsFile = __DIR__ . '/content/submissions.json';
$submissions = [];
if (file_exists($submissionsFile)) {
    $existing = json_decode(file_get_contents($submissionsFile), true);
    if (is_array($existing)) $submissions = $existing;
}

$entry = [
    'id'        => uniqid('sub_', true),
    'type'      => $type,
    'date'      => date('Y-m-d H:i:s'),
    'read'      => false,
    'name'      => $name,
    'email'     => $email,
    'phone'     => $phone,
    'service'   => $service,
];

if ($isRdv) {
    $entry['preferredDate']  = $preferredDate;
    $entry['preferredTime']  = $preferredTime;
    $entry['preferredDate2'] = $preferredDate2;
    $entry['preferredTime2'] = $preferredTime2;
    $entry['sessionFormat']  = $sessionFormat;
    $entry['note']           = strip_tags($message);
} else {
    $entry['subject'] = $subject;
    $entry['message'] = strip_tags($message);
}

array_unshift($submissions, $entry);

$dir = dirname($submissionsFile);
if (!is_dir($dir)) mkdir($dir, 0755, true);
file_put_contents($submissionsFile, json_encode($submissions, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

// ── Envoi ─────────────────────────────────────────────────────────────────────
if (mail($to, $mailSubject, $body, $headers)) {
    echo json_encode(["message" => "Envoyé avec succès"]);
} else {
    // Même si mail() échoue, la soumission est sauvegardée
    http_response_code(500);
    echo json_encode(["message" => "Erreur lors de l'envoi — votre demande a quand même été enregistrée."]);
}
?>
