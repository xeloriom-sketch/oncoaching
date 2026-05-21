<?php
/**
 * CRUD API — Gestion du contenu ON Coaching
 *
 * Routes disponibles :
 *   GET    /admin/api.php?page=index          → Lire le contenu d'une page
 *   PUT    /admin/api.php?page=index          → Mettre à jour le contenu
 *   POST   /admin/api.php?action=upload       → Uploader une image
 *   DELETE /admin/api.php?action=delete-image → Supprimer une image
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ─── Configuration ────────────────────────────────────────────────────────────

define('CONTENT_DIR', __DIR__ . '/../content/');   // /content/ à la racine
define('IMAGES_DIR',  __DIR__ . '/../images/');    // /images/ à la racine
define('IMAGES_URL',  '/images/');                 // URL publique images
define('ADMIN_TOKEN', 'CHANGE_THIS_SECRET_TOKEN');        // Token d'auth

// Pages autorisées
$ALLOWED_PAGES = [
    'index',
    'about',
    'coaching-scolaire',
    'coaching-jeunes',
    'coaching-equipe',
    'coaching-neurofeedback',
    'nos-tarifs',
    'contact',
];

// Extensions d'images autorisées
$ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// ─── Auth ─────────────────────────────────────────────────────────────────────

function checkAuth(): void {
    $headers = getallheaders();
    $token = $headers['Authorization'] ?? '';
    $token = str_replace('Bearer ', '', $token);
    if ($token !== ADMIN_TOKEN) {
        http_response_code(401);
        echo json_encode(['error' => 'Non autorisé']);
        exit();
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function jsonResponse(int $code, array $data): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

function getJsonPath(string $page): string {
    return CONTENT_DIR . $page . '.json';
}

function readPage(string $page): array {
    $path = getJsonPath($page);
    if (!file_exists($path)) {
        jsonResponse(404, ['error' => "Page '$page' introuvable"]);
    }
    $content = file_get_contents($path);
    return json_decode($content, true) ?? [];
}

function writePage(string $page, array $data): void {
    if (!is_dir(CONTENT_DIR)) {
        mkdir(CONTENT_DIR, 0755, true);
    }
    $path = getJsonPath($page);
    file_put_contents($path, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

// ─── Router ───────────────────────────────────────────────────────────────────

$method = $_SERVER['REQUEST_METHOD'];
$page   = $_GET['page']   ?? null;
$action = $_GET['action'] ?? null;

// ── GET /admin/api.php?page=xxx → lire une page (pas d'auth pour lecture)
if ($method === 'GET' && $page) {
    global $ALLOWED_PAGES;
    if (!in_array($page, $ALLOWED_PAGES)) {
        jsonResponse(400, ['error' => 'Page non autorisée']);
    }
    $data = readPage($page);
    jsonResponse(200, $data);
}

// ── GET /admin/api.php?action=list-pages → liste des pages disponibles
if ($method === 'GET' && $action === 'list-pages') {
    global $ALLOWED_PAGES;
    jsonResponse(200, ['pages' => $ALLOWED_PAGES]);
}

// ── GET /admin/api.php?action=list-images → liste les images uploadées
if ($method === 'GET' && $action === 'list-images') {
    checkAuth();
    if (!is_dir(IMAGES_DIR)) {
        jsonResponse(200, ['images' => []]);
    }
    $files = array_values(array_filter(
        array_map(function($f) {
            $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
            if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif'])) return null;
            return [
                'filename' => $f,
                'url'      => IMAGES_URL . $f,
                'size'     => filesize(IMAGES_DIR . $f),
            ];
        }, scandir(IMAGES_DIR) ?: []),
        fn($f) => $f !== null
    ));
    jsonResponse(200, ['images' => $files]);
}

// ── PUT /admin/api.php?page=xxx → mettre à jour une page
if ($method === 'PUT' && $page) {
    checkAuth();
    global $ALLOWED_PAGES;
    if (!in_array($page, $ALLOWED_PAGES)) {
        jsonResponse(400, ['error' => 'Page non autorisée']);
    }
    $body = file_get_contents('php://input');
    $newData = json_decode($body, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        jsonResponse(400, ['error' => 'JSON invalide : ' . json_last_error_msg()]);
    }
    // Sauvegarde backup avant d'écraser
    $backupDir = CONTENT_DIR . 'backups/';
    if (!is_dir($backupDir)) mkdir($backupDir, 0755, true);
    $backupFile = $backupDir . $page . '_' . date('Y-m-d_H-i-s') . '.json';
    copy(getJsonPath($page), $backupFile);

    writePage($page, $newData);
    jsonResponse(200, ['success' => true, 'message' => "Page '$page' mise à jour"]);
}

// ── PATCH /admin/api.php?page=xxx → mise à jour partielle (merge)
if ($method === 'PATCH' && $page) {
    checkAuth();
    global $ALLOWED_PAGES;
    if (!in_array($page, $ALLOWED_PAGES)) {
        jsonResponse(400, ['error' => 'Page non autorisée']);
    }
    $body = file_get_contents('php://input');
    $patch = json_decode($body, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        jsonResponse(400, ['error' => 'JSON invalide']);
    }
    $existing = readPage($page);
    $merged = array_replace_recursive($existing, $patch);
    writePage($page, $merged);
    jsonResponse(200, ['success' => true, 'message' => "Page '$page' partiellement mise à jour"]);
}

// ── POST /admin/api.php?action=upload → uploader une image
if ($method === 'POST' && $action === 'upload') {
    checkAuth();
    global $ALLOWED_IMAGE_TYPES;
    if (!isset($_FILES['image'])) {
        jsonResponse(400, ['error' => 'Aucun fichier envoyé (champ: image)']);
    }
    $file = $_FILES['image'];
    if ($file['error'] !== UPLOAD_ERR_OK) {
        jsonResponse(400, ['error' => 'Erreur upload: ' . $file['error']]);
    }
    $mime = mime_content_type($file['tmp_name']);
    if (!in_array($mime, $ALLOWED_IMAGE_TYPES)) {
        jsonResponse(400, ['error' => 'Type de fichier non autorisé. Autorisés : JPG, PNG, WebP, GIF']);
    }
    if ($file['size'] > 5 * 1024 * 1024) {
        jsonResponse(400, ['error' => 'Fichier trop volumineux (max 5 Mo)']);
    }
    if (!is_dir(IMAGES_DIR)) mkdir(IMAGES_DIR, 0755, true);

    $ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
    $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '', pathinfo($file['name'], PATHINFO_FILENAME));
    $filename = $safeName . '_' . uniqid() . '.' . strtolower($ext);
    $dest     = IMAGES_DIR . $filename;

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        jsonResponse(500, ['error' => 'Impossible de déplacer le fichier uploadé']);
    }
    jsonResponse(200, [
        'success'  => true,
        'filename' => $filename,
        'url'      => IMAGES_URL . $filename,
    ]);
}

// ── DELETE /admin/api.php?action=delete-image&filename=xxx → supprimer une image
if ($method === 'DELETE' && $action === 'delete-image') {
    checkAuth();
    $filename = $_GET['filename'] ?? '';
    if (!$filename || strpos($filename, '/') !== false || strpos($filename, '..') !== false) {
        jsonResponse(400, ['error' => 'Nom de fichier invalide']);
    }
    $path = IMAGES_DIR . $filename;
    if (!file_exists($path)) {
        jsonResponse(404, ['error' => 'Fichier introuvable']);
    }
    unlink($path);
    jsonResponse(200, ['success' => true, 'message' => "Image '$filename' supprimée"]);
}

// ── 404 fallback
jsonResponse(404, ['error' => 'Route inconnue']);