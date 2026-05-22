<?php
/**
 * config.php — Configuration & sécurité centralisée
 * ON Coaching Admin Dashboard
 */

// ─── Timezone ────────────────────────────────────────────────────────────────
date_default_timezone_set('Europe/Paris');

// ─── Session sécurisée ───────────────────────────────────────────────────────
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_samesite', 'Strict');
ini_set('session.use_strict_mode', 1);
ini_set('session.gc_maxlifetime', 3600); // 1h

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// ─── Configuration ────────────────────────────────────────────────────────────

define('ADMIN_USERNAME', 'admin');

// Générer le hash avec : echo password_hash('votre_mot_de_passe', PASSWORD_BCRYPT);
define('ADMIN_PASSWORD_HASH', '$2y$12$EMbA2owj415oi8KVtO9sDuFezEVUOFPIS6gJRbBMuKPe4YkEzF1aS');

define('CONTENT_DIR', __DIR__ . '/../content/');   // /content/ à la racine
define('IMAGES_DIR',  __DIR__ . '/../images/');    // /images/ à la racine (créé auto)
define('IMAGES_URL',  '/images/');
define('LOG_FILE',    __DIR__ . '/logs/auth.log');
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOCKOUT_DURATION', 900); // 15 min

// ─── Pages disponibles ───────────────────────────────────────────────────────
define('PAGES', [
    'index'                  => ['label' => 'Accueil',               'icon' => 'home'],
    'about'                  => ['label' => 'À propos',              'icon' => 'user'],
    'coaching-scolaire'      => ['label' => 'Coaching Scolaire',     'icon' => 'graduation-cap'],
    'coaching-jeunes'        => ['label' => 'Coaching Jeunes',       'icon' => 'users'],
    'coaching-equipe'        => ['label' => 'Coaching Équipe',       'icon' => 'briefcase'],
    'coaching-neurofeedback' => ['label' => 'Neurofeedback',         'icon' => 'brain'],
    'nos-tarifs'             => ['label' => 'Nos Tarifs',            'icon' => 'tag'],
    'contact'                => ['label' => 'Contact',               'icon' => 'mail'],
]);

// ─── Helpers Auth ────────────────────────────────────────────────────────────

function isLoggedIn(): bool {
    return isset($_SESSION['admin_logged_in'])
        && $_SESSION['admin_logged_in'] === true
        && isset($_SESSION['admin_user'])
        && isset($_SESSION['last_activity'])
        && (time() - $_SESSION['last_activity']) < 3600;
}

function requireLogin(): void {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit();
    }
    // Refresh activity
    $_SESSION['last_activity'] = time();
    // Regenerate session ID périodiquement (anti-fixation)
    if (!isset($_SESSION['created_at'])) {
        $_SESSION['created_at'] = time();
    } elseif (time() - $_SESSION['created_at'] > 300) {
        session_regenerate_id(true);
        $_SESSION['created_at'] = time();
    }
}

function getLoginAttempts(string $ip): array {
    $key = 'attempts_' . md5($ip);
    return $_SESSION[$key] ?? ['count' => 0, 'last' => 0];
}

function recordFailedAttempt(string $ip): void {
    $key = 'attempts_' . md5($ip);
    $data = getLoginAttempts($ip);
    // Reset si lockout expiré
    if (time() - $data['last'] > LOCKOUT_DURATION) {
        $data['count'] = 0;
    }
    $data['count']++;
    $data['last'] = time();
    $_SESSION[$key] = $data;
}

function isLockedOut(string $ip): bool {
    $data = getLoginAttempts($ip);
    if ($data['count'] >= MAX_LOGIN_ATTEMPTS) {
        return (time() - $data['last']) < LOCKOUT_DURATION;
    }
    return false;
}

function clearAttempts(string $ip): void {
    unset($_SESSION['attempts_' . md5($ip)]);
}

function logEvent(string $event, string $detail = ''): void {
    $dir = dirname(LOG_FILE);
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $line = sprintf("[%s] [%s] %s %s\n",
        date('Y-m-d H:i:s'),
        $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        $event,
        $detail
    );
    file_put_contents(LOG_FILE, $line, FILE_APPEND | LOCK_EX);
}

function csrfToken(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCsrf(string $token): bool {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

function jsonPath(string $page): string {
    return CONTENT_DIR . $page . '.json';
}

function readJson(string $page): ?array {
    $path = jsonPath($page);
    if (!file_exists($path)) return null;
    return json_decode(file_get_contents($path), true);
}

function writeJson(string $page, array $data): bool {
    if (!is_dir(CONTENT_DIR)) mkdir(CONTENT_DIR, 0755, true);
    $backupDir = CONTENT_DIR . 'backups/';
    if (!is_dir($backupDir)) mkdir($backupDir, 0755, true);
    $existing = jsonPath($page);
    if (file_exists($existing)) {
        copy($existing, $backupDir . $page . '_' . date('Y-m-d_H-i-s') . '.json');
    }
    return (bool) file_put_contents(
        jsonPath($page),
        json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
    );
}