<?php
// Activer l'affichage des erreurs PHP pour le debug (retirer en prod)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");

// Vérifie que la méthode est POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Méthode non autorisée"]);
    exit;
}

// Lecture et décodage des données JSON envoyées
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["message" => "Aucune donnée reçue"]);
    exit;
}

// Sécurisation et validation des champs
$name    = htmlspecialchars(trim($data['name'] ?? ''));
$email   = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone   = htmlspecialchars(trim($data['phone'] ?? ''));
$subject = htmlspecialchars(trim($data['subject'] ?? ''));
$message = htmlspecialchars(trim($data['message'] ?? ''));
$service = htmlspecialchars(trim($data['service'] ?? ''));

if (!$name || !$email || !$subject || !$message) {
    http_response_code(400);
    echo json_encode(["message" => "Champs requis manquants"]);
    exit;
}

// Destinataire
$to = "contact@oncoaching.fr";

// Construction du sujet et du corps de l'e-mail
$mailSubject = "[Contact OM Coaching] $subject - Service: $service";
$mailBody  = "Nom : $name\n";
$mailBody .= "Email : $email\n";
$mailBody .= "Téléphone : $phone\n";
$mailBody .= "Service : $service\n\n";
$mailBody .= "Message :\n$message\n";

// Construction CORRECTE des headers, respecte le domaine
$headers  = "From: Contact OM Coaching <no-reply@oncoaching.fr>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Tentative d’envoi du mail
if (mail($to, $mailSubject, $mailBody, $headers)) {
    echo json_encode(["message" => "Email envoyé avec succès"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erreur lors de l'envoi de l'email"]);
}
?>
