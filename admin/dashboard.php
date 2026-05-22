<?php
require_once 'config.php';
requireLogin();

$pages   = PAGES;
$view    = $_GET['view'] ?? '';
$current = $_GET['page'] ?? 'index';
if ($view === 'submissions') $current = '_submissions';
elseif (!array_key_exists($current, $pages)) $current = 'index';

$pageData  = ($current !== '_submissions') ? readJson($current) ?? [] : [];
$pageLabel = ($current === '_submissions') ? 'Soumissions' : ($pages[$current]['label'] ?? 'Accueil');
$csrf      = csrfToken();

// ── Soumissions ──────────────────────────────────────────────────────────────
$submissionsFile = __DIR__ . '/../public/content/submissions.json';
$allSubmissions  = [];
if (file_exists($submissionsFile)) {
    $raw = json_decode(file_get_contents($submissionsFile), true);
    if (is_array($raw)) $allSubmissions = $raw;
}
$unreadCount = count(array_filter($allSubmissions, fn($s) => !($s['read'] ?? false)));

// ── AJAX : marquer comme lu ──────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'mark_read') {
    if (verifyCsrf($_POST['csrf_token'] ?? '')) {
        $sid = $_POST['submission_id'] ?? '';
        foreach ($allSubmissions as &$sub) {
            if ($sub['id'] === $sid) { $sub['read'] = true; break; }
        }
        unset($sub);
        file_put_contents($submissionsFile, json_encode($allSubmissions, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        header('Content-Type: application/json');
        echo json_encode(['ok' => true]);
        exit();
    }
    header('Content-Type: application/json');
    echo json_encode(['ok' => false]);
    exit();
}

// ── AJAX handlers ────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    header('Content-Type: application/json');
    if (!verifyCsrf($_POST['csrf_token'] ?? '')) {
        echo json_encode(['ok' => false, 'msg' => 'Sécurité : token invalide, rechargez la page.']);
        exit();
    }
    if ($_POST['action'] === 'save_fields') {
        $targetPage = $_POST['target_page'] ?? '';
        if (!array_key_exists($targetPage, $pages)) { echo json_encode(['ok' => false, 'msg' => 'Page inconnue']); exit(); }
        $fields = json_decode($_POST['fields'] ?? '{}', true);
        if (json_last_error() !== JSON_ERROR_NONE) { echo json_encode(['ok' => false, 'msg' => 'Données invalides']); exit(); }
        $existing = readJson($targetPage) ?? [];
        $merged   = array_replace_recursive($existing, $fields);
        $result   = writeJson($targetPage, $merged);
        logEvent('SAVE_FIELDS', "page=$targetPage user={$_SESSION['admin_user']}");
        echo json_encode(['ok' => $result, 'msg' => $result ? 'Modifications sauvegardées !' : 'Erreur lors de la sauvegarde']);
        exit();
    }
    if ($_POST['action'] === 'upload_image') {
        if (!isset($_FILES['file'])) { echo json_encode(['ok'=>false,'msg'=>'Aucun fichier reçu']); exit(); }
        $file = $_FILES['file'];
        $mime = mime_content_type($file['tmp_name']);
        if (!in_array($mime, ['image/jpeg','image/png','image/webp','image/gif'])) {
            echo json_encode(['ok'=>false,'msg'=>'Format non autorisé (JPG, PNG, WebP, GIF)']); exit();
        }
        if ($file['size'] > 5*1024*1024) { echo json_encode(['ok'=>false,'msg'=>'Fichier trop volumineux (max 5 Mo)']); exit(); }
        if (!is_dir(IMAGES_DIR)) mkdir(IMAGES_DIR, 0755, true);
        $ext  = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $safe = preg_replace('/[^a-zA-Z0-9_-]/', '', pathinfo($file['name'], PATHINFO_FILENAME));
        $name = $safe . '_' . uniqid() . '.' . $ext;
        move_uploaded_file($file['tmp_name'], IMAGES_DIR . $name);
        logEvent('UPLOAD_IMAGE', "file=$name");
        echo json_encode(['ok'=>true, 'url'=> IMAGES_URL.$name, 'filename'=>$name]);
        exit();
    }
    if ($_POST['action'] === 'delete_image') {
        $filename = basename($_POST['filename'] ?? '');
        $path = IMAGES_DIR . $filename;
        if ($filename && file_exists($path)) { unlink($path); logEvent('DELETE_IMAGE',"file=$filename"); echo json_encode(['ok'=>true]); }
        else echo json_encode(['ok'=>false,'msg'=>'Fichier introuvable']);
        exit();
    }
    echo json_encode(['ok'=>false,'msg'=>'Action inconnue']);
    exit();
}

// ── Images ───────────────────────────────────────────────────────────────────
$images = [];
if (is_dir(IMAGES_DIR)) {
    foreach (array_diff(scandir(IMAGES_DIR), ['.','..']) as $f) {
        if (in_array(strtolower(pathinfo($f, PATHINFO_EXTENSION)), ['jpg','jpeg','png','webp','gif'])) {
            $images[] = ['filename' => $f, 'url' => IMAGES_URL.$f];
        }
    }
}

// ── Stats ─────────────────────────────────────────────────────────────────────
$pageStats = [];
foreach ($pages as $key => $info) {
    $path = jsonPath($key);
    $pageStats[$key] = ['exists' => file_exists($path), 'modified' => file_exists($path) ? filemtime($path) : null];
}
$lastModifiedPage = null;
$lastModifiedTime = 0;
foreach ($pageStats as $key => $stat) {
    if ($stat['modified'] && $stat['modified'] > $lastModifiedTime) {
        $lastModifiedTime = $stat['modified'];
        $lastModifiedPage = $key;
    }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function field(string $label, string $path, $value, string $type = 'text'): void {
    $id  = 'f_' . md5($path);
    $val = htmlspecialchars((string)($value ?? ''));
    echo '<div class="field-wrap">';
    echo '<label for="'.$id.'">'.htmlspecialchars($label).'</label>';
    if ($type === 'textarea') {
        echo '<textarea id="'.$id.'" data-path="'.htmlspecialchars($path).'" rows="3">'.$val.'</textarea>';
    } else {
        echo '<input type="text" id="'.$id.'" data-path="'.htmlspecialchars($path).'" value="'.$val.'">';
    }
    echo '</div>';
}

function fieldList(string $label, string $path, array $items): void {
    $listId = 'list_'.md5($path);
    echo '<div class="field-wrap field-list">';
    echo '<label>'.htmlspecialchars($label).'</label>';
    echo '<div class="list-items" id="'.$listId.'" data-path="'.htmlspecialchars($path).'">';
    foreach ($items as $i => $item) {
        $val = htmlspecialchars(is_string($item) ? $item : json_encode($item, JSON_UNESCAPED_UNICODE));
        echo '<div class="list-item">';
        echo '<span class="drag-handle" title="Réordonner">&#8942;</span>';
        echo '<input type="text" value="'.$val.'" data-index="'.$i.'">';
        echo '<button type="button" class="btn-remove-item" onclick="removeItem(this)" title="Supprimer"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
        echo '</div>';
    }
    echo '</div>';
    echo '<button type="button" class="btn-add-item" onclick="addItem(\''.md5($path).'\')">';
    echo '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Ajouter un élément</button>';
    echo '</div>';
}

function sectionTitle(string $title, string $svgIcon = ''): void {
    echo '<div class="section-header">';
    if ($svgIcon) echo '<span class="section-icon">'.$svgIcon.'</span>';
    echo '<span>'.htmlspecialchars($title).'</span>';
    echo '</div>';
}

function get(array $data, string $path, $default = '') {
    $keys = explode('.', $path);
    $v = $data;
    foreach ($keys as $k) {
        if (!is_array($v) || !isset($v[$k])) return $default;
        $v = $v[$k];
    }
    return $v;
}

// Nav SVG icons
$navSvg = [
    '_submissions'           => '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    'index'                  => '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    'about'                  => '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    'coaching-scolaire'      => '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    'coaching-jeunes'        => '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'coaching-equipe'        => '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
    'coaching-neurofeedback' => '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 2a9 9 0 1 0 0 18A9 9 0 0 0 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
    'nos-tarifs'             => '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    'contact'                => '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
];
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ON Coaching — <?= htmlspecialchars($pageLabel) ?></title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet">
<style>
/* ── Reset ── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

/* ── Tokens ── */
:root{
  --bg:         #0b0b0c;
  --sidebar:    #0f1011;
  --sidebar-w:  256px;
  --surface:    #161618;
  --surface-h:  #1e1e20;
  --border:     rgba(255,255,255,0.07);
  --border-h:   rgba(255,255,255,0.12);
  --accent:     #1ab5c7;
  --accent-dim: rgba(26,181,199,0.1);
  --accent-glow:rgba(26,181,199,0.22);
  --text:       #e4e4e8;
  --sub:        #9090a0;
  --muted:      #5c5c68;
  --green:      #22c55e;
  --red:        #ef4444;
  --orange:     #f59e0b;
  --r:          10px;
  --r-lg:       14px;
}

html,body{height:100%;background:var(--bg);color:var(--text);font-family:'DM Sans',system-ui,sans-serif;font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased;}

/* ════════════════════
   APP LAYOUT
════════════════════ */
.app{display:flex;height:100vh;overflow:hidden;}

/* ── Overlay mobile ── */
.sidebar-overlay{
  display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);
  z-index:90;backdrop-filter:blur(3px);
}
.sidebar-overlay.show{display:block;}

/* ════════════════════
   SIDEBAR
════════════════════ */
.sidebar{
  width:var(--sidebar-w);flex-shrink:0;
  background:var(--sidebar);
  display:flex;flex-direction:column;
  border-right:1px solid var(--border);
  overflow-y:auto;overflow-x:hidden;
  scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.07) transparent;
  transition:transform 0.28s cubic-bezier(0.16,1,0.3,1);
  z-index:100;
}

@media(max-width:768px){
  .sidebar{
    position:fixed;inset:0 auto 0 0;
    transform:translateX(-100%);
    box-shadow:24px 0 48px rgba(0,0,0,0.5);
  }
  .sidebar.open{transform:translateX(0);}
}

/* Brand */
.sidebar-brand{
  padding:1.25rem 1.125rem;
  border-bottom:1px solid var(--border);
  display:flex;align-items:center;gap:0.75rem;flex-shrink:0;
}

.brand-mark{
  width:36px;height:36px;border-radius:10px;flex-shrink:0;
  background:linear-gradient(135deg,var(--accent),#0e8a99);
  display:flex;align-items:center;justify-content:center;
  font-family:'Instrument Serif',serif;font-size:0.95rem;color:#fff;
  box-shadow:0 0 20px var(--accent-glow);
}

.brand-info{min-width:0;}
.brand-name{
  font-family:'Instrument Serif',serif;font-size:1.05rem;
  color:var(--text);letter-spacing:-0.01em;display:block;line-height:1.2;
}
.brand-name span{color:var(--accent);}
.brand-sub{font-size:0.62rem;color:var(--muted);letter-spacing:0.12em;text-transform:uppercase;display:block;margin-top:2px;}

/* Nav */
.nav-group{padding:1rem 0.75rem 0.25rem;}
.nav-label{
  font-size:0.6rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;
  color:var(--muted);padding:0 0.5rem;margin-bottom:0.375rem;display:block;
}
.nav-item{
  display:flex;align-items:center;gap:0.625rem;
  padding:0.5rem 0.625rem;border-radius:8px;
  color:var(--sub);text-decoration:none;
  font-size:0.83rem;font-weight:400;
  transition:background 0.14s,color 0.14s;
  margin-bottom:1px;position:relative;
  white-space:nowrap;
}
.nav-item:hover{background:rgba(255,255,255,0.04);color:var(--text);}
.nav-item.active{
  background:var(--accent-dim);color:var(--accent);font-weight:500;
}
.nav-item.active::before{
  content:'';position:absolute;left:0;top:20%;bottom:20%;
  width:2px;border-radius:0 2px 2px 0;background:var(--accent);
}
.nav-icon{
  width:26px;height:26px;border-radius:6px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  background:rgba(255,255,255,0.04);
  transition:background 0.14s;color:inherit;
}
.nav-item:hover .nav-icon{background:rgba(255,255,255,0.06);}
.nav-item.active .nav-icon{background:var(--accent-dim);}
.nav-text{flex:1;overflow:hidden;text-overflow:ellipsis;}
.nav-badge{
  font-size:0.62rem;font-weight:700;padding:1px 7px;border-radius:20px;flex-shrink:0;
  background:rgba(26,181,199,0.15);color:var(--accent);
}
.nav-date{
  font-size:0.6rem;font-family:monospace;
  color:var(--muted);flex-shrink:0;
}

/* Sidebar footer */
.sidebar-footer{
  margin-top:auto;padding:0.875rem 0.875rem 1rem;
  border-top:1px solid var(--border);flex-shrink:0;
}
.user-card{
  display:flex;align-items:center;gap:0.625rem;
  padding:0.625rem 0.75rem;border-radius:10px;
  background:rgba(255,255,255,0.03);
  margin-bottom:0.625rem;
}
.user-avatar{
  width:30px;height:30px;border-radius:50%;flex-shrink:0;
  background:linear-gradient(135deg,var(--accent),#0e8a99);
  display:flex;align-items:center;justify-content:center;
  font-size:0.72rem;font-weight:700;color:#fff;
}
.user-name{font-size:0.8rem;font-weight:500;color:var(--text);}
.user-role{font-size:0.62rem;color:var(--muted);}

.btn-logout{
  display:flex;align-items:center;gap:0.5rem;width:100%;
  padding:0.5rem 0.75rem;border-radius:8px;
  border:1px solid var(--border);background:none;
  color:var(--sub);font-family:inherit;font-size:0.78rem;font-weight:400;
  cursor:pointer;transition:all 0.15s;
}
.btn-logout:hover{color:#f87171;border-color:rgba(239,68,68,0.25);background:rgba(239,68,68,0.05);}
.btn-logout svg{flex-shrink:0;}

/* ════════════════════
   MAIN AREA
════════════════════ */
.main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden;}

/* Topbar */
.topbar{
  height:56px;flex-shrink:0;
  background:var(--sidebar);
  border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 1.25rem;gap:1rem;
}

.topbar-left{display:flex;align-items:center;gap:0.875rem;min-width:0;}

.hamburger{
  display:none;width:34px;height:34px;border-radius:8px;
  background:none;border:1px solid var(--border);
  color:var(--sub);cursor:pointer;
  align-items:center;justify-content:center;
  transition:all 0.15s;flex-shrink:0;
}
.hamburger:hover{background:rgba(255,255,255,0.05);color:var(--text);}
@media(max-width:768px){.hamburger{display:flex;}}

.topbar-page{
  display:flex;align-items:center;gap:0.5rem;
  font-size:0.8rem;
}
.topbar-page-icon{
  width:22px;height:22px;border-radius:5px;
  background:var(--accent-dim);
  display:flex;align-items:center;justify-content:center;
  color:var(--accent);flex-shrink:0;
}
.topbar-breadcrumb{
  color:var(--muted);font-size:0.78rem;
  display:flex;align-items:center;gap:0.4rem;
}
.topbar-breadcrumb span{color:var(--text);font-weight:500;}

.topbar-right{display:flex;align-items:center;gap:0.625rem;flex-shrink:0;}

.unsaved-pill{
  display:none;align-items:center;gap:0.4rem;
  padding:0.3rem 0.75rem;border-radius:20px;
  background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);
  color:#f59e0b;font-size:0.7rem;font-weight:600;white-space:nowrap;
}
.unsaved-pill.show{display:inline-flex;}
.unsaved-dot{width:5px;height:5px;border-radius:50%;background:#f59e0b;flex-shrink:0;animation:blink 1.2s ease infinite;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.25}}

.btn-save{
  display:flex;align-items:center;gap:0.5rem;
  padding:0.5rem 1.125rem;border:none;border-radius:8px;
  background:var(--accent);color:#fff;
  font-family:inherit;font-size:0.8rem;font-weight:600;
  cursor:pointer;transition:all 0.18s;white-space:nowrap;
  box-shadow:0 2px 12px var(--accent-glow);
}
.btn-save:hover{background:#18a8b8;transform:translateY(-1px);box-shadow:0 4px 20px rgba(26,181,199,0.32);}
.btn-save:active{transform:none;}
.btn-save:disabled{opacity:0.45;cursor:not-allowed;transform:none;box-shadow:none;}
.btn-save .spinner{width:13px;height:13px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.55s linear infinite;display:none;flex-shrink:0;}
.btn-save.loading .spinner{display:block;}
.btn-save.loading .btn-label{display:none;}
@keyframes spin{to{transform:rotate(360deg)}}

/* Content */
.content{
  flex:1;overflow-y:auto;
  padding:1.375rem;
  display:flex;gap:1.125rem;align-items:flex-start;
}
.editor-col{flex:1;min-width:0;display:flex;flex-direction:column;gap:1rem;}
.side-col{width:268px;flex-shrink:0;display:flex;flex-direction:column;gap:1rem;}

@media(max-width:960px){
  .content{flex-direction:column;}
  .side-col{width:100%;}
}

/* ════════════════════
   CARDS
════════════════════ */
.card{
  background:var(--surface);border:1px solid var(--border);
  border-radius:var(--r-lg);overflow:hidden;
}

.card-head{
  padding:0.875rem 1.125rem;border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
}
.card-head-left{display:flex;align-items:center;gap:0.6rem;}
.card-head-icon{
  width:28px;height:28px;border-radius:7px;flex-shrink:0;
  background:var(--accent-dim);
  display:flex;align-items:center;justify-content:center;
  color:var(--accent);
}
.card-head h3{font-size:0.83rem;font-weight:600;color:var(--text);}
.badge{font-size:0.62rem;padding:2px 8px;border-radius:10px;background:rgba(255,255,255,0.06);color:var(--sub);font-weight:600;}

.card-body{padding:1.125rem;display:flex;flex-direction:column;gap:0.875rem;}

.section-header{
  display:flex;align-items:center;gap:0.6rem;
  padding:0.6rem 1.125rem;
  background:rgba(255,255,255,0.015);
  border-bottom:1px solid var(--border);
  color:var(--muted);font-size:0.68rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;
}
.section-icon{display:flex;align-items:center;color:var(--sub);}

/* ════════════════════
   STATS
════════════════════ */
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.875rem;}
@media(max-width:600px){.stats-grid{grid-template-columns:repeat(2,1fr);}}

.stat-card{
  background:var(--surface);border:1px solid var(--border);border-radius:var(--r);
  padding:1.125rem;display:flex;flex-direction:column;
}
.stat-icon{
  width:32px;height:32px;border-radius:8px;
  background:var(--accent-dim);
  display:flex;align-items:center;justify-content:center;
  color:var(--accent);margin-bottom:0.875rem;flex-shrink:0;
}
.stat-val{font-size:1.75rem;font-weight:700;color:var(--text);letter-spacing:-0.03em;line-height:1;font-family:'Instrument Serif',serif;}
.stat-val.accent{color:var(--accent);}
.stat-label{font-size:0.72rem;color:var(--muted);margin-top:0.3rem;}
.stat-sub{font-size:0.68rem;color:var(--sub);margin-top:0.15rem;}

/* ════════════════════
   FIELDS
════════════════════ */
.field-wrap{display:flex;flex-direction:column;gap:0.3rem;}
.field-wrap label{font-size:0.72rem;font-weight:600;color:var(--sub);letter-spacing:0.03em;}

.field-wrap input[type=text],
.field-wrap textarea{
  width:100%;padding:0.6rem 0.875rem;
  border:1px solid var(--border);border-radius:8px;
  font-family:inherit;font-size:0.875rem;
  color:var(--text);background:rgba(255,255,255,0.025);
  transition:border-color 0.16s,background 0.16s,box-shadow 0.16s;
  outline:none;resize:vertical;
}
.field-wrap input[type=text]::placeholder,
.field-wrap textarea::placeholder{color:rgba(255,255,255,0.14);}
.field-wrap input:focus,.field-wrap textarea:focus{
  border-color:var(--accent);
  background:rgba(26,181,199,0.04);
  box-shadow:0 0 0 3px var(--accent-dim);
}

.field-with-image{display:flex;gap:0.75rem;align-items:flex-end;}
.field-with-image .field-wrap{flex:1;}
.img-preview{
  width:60px;height:60px;border-radius:8px;border:1px solid var(--border);
  overflow:hidden;flex-shrink:0;background:rgba(255,255,255,0.03);
  display:flex;align-items:center;justify-content:center;color:var(--muted);
}
.img-preview img{width:100%;height:100%;object-fit:cover;display:block;}
.btn-pick{
  margin-top:0.35rem;padding:0.35rem 0.75rem;border-radius:6px;
  border:1px solid var(--border);background:rgba(255,255,255,0.03);
  color:var(--sub);font-family:inherit;font-size:0.7rem;
  cursor:pointer;transition:all 0.15s;
}
.btn-pick:hover{background:var(--accent-dim);color:var(--accent);border-color:rgba(26,181,199,0.25);}

/* Lists */
.list-items{display:flex;flex-direction:column;gap:0.3rem;margin-bottom:0.5rem;}
.list-item{display:flex;align-items:center;gap:0.4rem;}
.list-item input{
  flex:1;padding:0.525rem 0.75rem;
  border:1px solid var(--border);border-radius:7px;
  font-family:inherit;font-size:0.83rem;
  color:var(--text);background:rgba(255,255,255,0.025);
  outline:none;transition:border-color 0.15s,box-shadow 0.15s;
}
.list-item input:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-dim);}
.drag-handle{color:var(--muted);font-size:1rem;user-select:none;cursor:grab;opacity:0.4;transition:opacity 0.15s;padding:0 2px;line-height:1;}
.list-item:hover .drag-handle{opacity:0.9;}
.btn-remove-item{
  background:none;border:none;color:rgba(255,255,255,0.18);
  cursor:pointer;padding:0.25rem 0.35rem;
  border-radius:5px;transition:all 0.15s;line-height:1;
  display:flex;align-items:center;
}
.btn-remove-item:hover{color:var(--red);background:rgba(239,68,68,0.07);}
.btn-add-item{
  display:inline-flex;align-items:center;gap:0.35rem;
  padding:0.4rem 0.875rem;
  border:1px dashed rgba(26,181,199,0.2);border-radius:7px;
  background:none;color:var(--accent);
  font-family:inherit;font-size:0.75rem;font-weight:500;
  cursor:pointer;transition:all 0.15s;
}
.btn-add-item:hover{border-color:var(--accent);background:var(--accent-dim);}

/* Tabs */
.tab-list{
  display:flex;gap:0.3rem;padding:0.75rem 1.125rem;
  border-bottom:1px solid var(--border);flex-wrap:wrap;
}
.tab-btn{
  padding:0.32rem 0.875rem;border-radius:20px;
  border:1px solid transparent;background:none;
  color:var(--sub);font-family:inherit;font-size:0.775rem;font-weight:500;
  cursor:pointer;transition:all 0.14s;
}
.tab-btn:hover{background:rgba(255,255,255,0.04);color:var(--text);}
.tab-btn.active{background:var(--accent-dim);border-color:rgba(26,181,199,0.25);color:var(--accent);}
.tab-content{display:none;}.tab-content.active{display:block;}

/* ════════════════════
   MEDIA LIBRARY
════════════════════ */
.upload-zone{
  border:1.5px dashed rgba(26,181,199,0.18);border-radius:10px;
  padding:1.25rem 1rem;text-align:center;cursor:pointer;
  transition:all 0.2s;background:rgba(26,181,199,0.02);
}
.upload-zone:hover,.upload-zone.drag{border-color:var(--accent);background:var(--accent-dim);}
.uz-icon{
  width:36px;height:36px;border-radius:8px;background:var(--accent-dim);
  display:flex;align-items:center;justify-content:center;
  color:var(--accent);margin:0 auto 0.625rem;
}
.upload-zone strong{font-size:0.8rem;color:var(--text);display:block;}
.upload-zone p{font-size:0.7rem;color:var(--muted);margin-top:0.2rem;}
#fileInput{display:none;}

.img-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.375rem;margin-top:0.75rem;}
.img-thumb{
  position:relative;aspect-ratio:1;border-radius:7px;
  overflow:hidden;border:1px solid var(--border);
  cursor:pointer;transition:border-color 0.15s;background:var(--surface-h);
}
.img-thumb:hover{border-color:var(--accent);}
.img-thumb img{width:100%;height:100%;object-fit:cover;display:block;}
.img-overlay{
  position:absolute;inset:0;background:rgba(0,0,0,0.72);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:0.3rem;opacity:0;transition:opacity 0.15s;
}
.img-thumb:hover .img-overlay{opacity:1;}
.img-btn{
  padding:0.25rem 0.6rem;border-radius:5px;
  font-size:0.62rem;font-weight:700;cursor:pointer;border:none;
  font-family:inherit;
}
.img-btn-copy{background:var(--accent);color:#fff;}
.img-btn-del{background:rgba(239,68,68,0.18);color:#f87171;border:1px solid rgba(239,68,68,0.2);}

/* Help */
.help-item{
  display:flex;gap:0.625rem;align-items:flex-start;
  padding:0.625rem 0;border-bottom:1px solid var(--border);
}
.help-item:last-child{border-bottom:none;padding-bottom:0;}
.help-icon{
  width:24px;height:24px;border-radius:5px;flex-shrink:0;
  background:var(--accent-dim);color:var(--accent);
  display:flex;align-items:center;justify-content:center;
  margin-top:1px;
}
.help-text{font-size:0.78rem;color:var(--sub);line-height:1.55;}
.help-text strong{color:var(--text);display:block;margin-bottom:2px;font-size:0.78rem;}

/* ════════════════════
   SUBMISSIONS
════════════════════ */
.sub-tabs{display:flex;gap:0.4rem;margin-bottom:1.25rem;}
.sub-tab{
  padding:0.42rem 1rem;border-radius:20px;
  border:1px solid var(--border);background:none;
  color:var(--sub);font-family:inherit;font-size:0.78rem;font-weight:500;
  cursor:pointer;transition:all 0.14s;
}
.sub-tab:hover{background:rgba(255,255,255,0.04);color:var(--text);}
.sub-tab.active{background:var(--accent-dim);border-color:rgba(26,181,199,0.25);color:var(--accent);}
.sub-panel{display:none;}.sub-panel.active{display:flex;flex-direction:column;gap:0.75rem;}

.sub-card{
  background:var(--surface);border:1px solid var(--border);
  border-radius:12px;padding:1.125rem 1.25rem;
  position:relative;transition:border-color 0.15s;
}
.sub-card:hover{border-color:var(--border-h);}
.sub-card.unread{border-left:2.5px solid var(--accent);}
.new-badge{
  position:absolute;top:0.875rem;right:0.875rem;
  font-size:0.58rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
  color:var(--accent);background:var(--accent-dim);
  padding:2px 8px;border-radius:10px;
}

.sub-meta{display:flex;align-items:center;flex-wrap:wrap;gap:0.4rem 0.875rem;margin-bottom:0.625rem;}
.sub-name{font-size:0.88rem;font-weight:600;color:var(--text);}
.sub-date{font-size:0.68rem;color:var(--muted);font-family:monospace;}
.sub-tag{font-size:0.6rem;font-weight:700;padding:2px 8px;border-radius:8px;text-transform:uppercase;letter-spacing:0.05em;}
.sub-tag.rdv{background:rgba(26,181,199,0.1);color:var(--accent);}
.sub-tag.contact{background:rgba(255,255,255,0.06);color:var(--sub);}

.sub-detail{display:flex;flex-direction:column;gap:0.3rem;margin-top:0.375rem;}
.sub-row{display:flex;gap:0.5rem;font-size:0.8rem;}
.sub-row-label{color:var(--muted);min-width:108px;flex-shrink:0;}
.sub-row-val{color:var(--text);}

.sub-actions{display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid var(--border);}
.btn-action{
  display:inline-flex;align-items:center;gap:0.35rem;
  padding:0.38rem 0.8rem;border-radius:7px;
  border:1px solid var(--border);background:rgba(255,255,255,0.03);
  color:var(--sub);font-family:inherit;font-size:0.72rem;cursor:pointer;
  transition:all 0.14s;text-decoration:none;
}
.btn-action:hover{background:var(--accent-dim);color:var(--accent);border-color:rgba(26,181,199,0.25);}
.btn-action svg{flex-shrink:0;}

.creneaux{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-top:0.5rem;}
@media(max-width:500px){.creneaux{grid-template-columns:1fr;}}
.creneau{border-radius:8px;padding:0.625rem 0.875rem;font-size:0.78rem;}
.creneau.primary{background:var(--accent-dim);border:1px solid rgba(26,181,199,0.18);color:var(--accent);}
.creneau.secondary{background:rgba(255,255,255,0.03);border:1px solid var(--border);color:var(--sub);}
.creneau-label{font-size:0.58rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;opacity:0.65;display:block;margin-bottom:2px;}

.sub-stats-row{display:flex;gap:0.75rem;margin-bottom:1.25rem;flex-wrap:wrap;}
.sub-stat-item{
  flex:1;min-width:110px;
  background:var(--surface);border:1px solid var(--border);
  border-radius:10px;padding:0.875rem 1rem;
}
.sub-stat-val{font-size:1.5rem;font-weight:700;color:var(--text);line-height:1;font-family:'Instrument Serif',serif;}
.sub-stat-val.accent{color:var(--accent);}
.sub-stat-label{font-size:0.68rem;color:var(--muted);margin-top:3px;}
.sub-empty{text-align:center;padding:3rem;color:var(--muted);font-size:0.85rem;}

/* ════════════════════
   TOAST
════════════════════ */
.toast-wrap{
  position:fixed;bottom:1.375rem;right:1.375rem;
  display:flex;flex-direction:column;gap:0.5rem;
  z-index:9999;pointer-events:none;
}
.toast{
  display:flex;align-items:center;gap:0.625rem;
  padding:0.75rem 1rem;
  background:var(--surface);border:1px solid var(--border);
  border-radius:10px;font-size:0.82rem;color:var(--text);
  box-shadow:0 8px 32px rgba(0,0,0,0.55);
  animation:t-in 0.28s cubic-bezier(0.16,1,0.3,1) both;
  max-width:300px;pointer-events:auto;
}
.toast.out{animation:t-out 0.22s ease both;}
@keyframes t-in{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:none}}
@keyframes t-out{to{opacity:0;transform:translateX(12px)}}
.toast-icon{
  width:22px;height:22px;border-radius:5px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
}
.toast.success .toast-icon{background:rgba(34,197,94,0.12);color:var(--green);}
.toast.error   .toast-icon{background:rgba(239,68,68,0.1);color:var(--red);}

/* ════════════════════
   MODALS
════════════════════ */
.modal-bg{
  display:none;position:fixed;inset:0;
  background:rgba(0,0,0,0.65);z-index:200;
  align-items:center;justify-content:center;padding:1rem;
  backdrop-filter:blur(4px);
}
.modal-bg.show{display:flex;}
.modal-box{
  background:var(--surface);border:1px solid var(--border);
  border-radius:var(--r-lg);padding:1.625rem;
  max-width:400px;width:100%;
  box-shadow:0 24px 64px rgba(0,0,0,0.7);
  animation:m-in 0.2s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes m-in{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:none}}
.modal-box h3{font-size:0.95rem;font-weight:600;color:var(--text);margin-bottom:0.5rem;}
.modal-box p{font-size:0.825rem;color:var(--sub);margin-bottom:1.25rem;line-height:1.6;}
.modal-actions{display:flex;gap:0.625rem;justify-content:flex-end;}
.btn-cancel{
  padding:0.5rem 1rem;border:1px solid var(--border);border-radius:8px;
  background:none;color:var(--sub);font-family:inherit;font-size:0.825rem;cursor:pointer;
  transition:all 0.15s;
}
.btn-cancel:hover{background:rgba(255,255,255,0.04);color:var(--text);}
.btn-del-ok{
  padding:0.5rem 1rem;border-radius:8px;border:none;
  background:rgba(239,68,68,0.12);color:#f87171;
  font-family:inherit;font-size:0.825rem;font-weight:600;cursor:pointer;
  transition:all 0.15s;
}
.btn-del-ok:hover{background:rgba(239,68,68,0.22);}

.picker-grid{
  display:grid;grid-template-columns:repeat(4,1fr);gap:0.4rem;
  max-height:260px;overflow-y:auto;margin-bottom:1rem;
  scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.1) transparent;
}
.picker-item{
  aspect-ratio:1;border-radius:7px;overflow:hidden;
  border:2px solid transparent;cursor:pointer;transition:all 0.14s;
  background:var(--surface-h);
}
.picker-item:hover{border-color:var(--accent);}
.picker-item img{width:100%;height:100%;object-fit:cover;display:block;}

/* Scrollbars */
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px;}
::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.15);}

kbd{font-size:0.7rem;padding:1px 6px;border-radius:4px;border:1px solid var(--border);background:rgba(255,255,255,0.04);font-family:monospace;}
</style>
</head>
<body>
<div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
<div class="app">

<!-- ════ SIDEBAR ════ -->
<aside class="sidebar" id="sidebar">

  <div class="sidebar-brand">
    <div class="brand-mark">ON</div>
    <div class="brand-info">
      <span class="brand-name"><span>ON</span> Coaching</span>
      <span class="brand-sub">Administration</span>
    </div>
  </div>

  <div class="nav-group">
    <span class="nav-label">Messages</span>
    <a href="?view=submissions" class="nav-item <?= $current === '_submissions' ? 'active' : '' ?>">
      <span class="nav-icon"><?= $navSvg['_submissions'] ?></span>
      <span class="nav-text">Soumissions</span>
      <?php if ($unreadCount > 0): ?>
      <span class="nav-badge"><?= $unreadCount ?></span>
      <?php endif ?>
    </a>
  </div>

  <div class="nav-group">
    <span class="nav-label">Pages du site</span>
    <?php foreach ($pages as $key => $info):
      $stat = $pageStats[$key]; ?>
    <a href="?page=<?= $key ?>" class="nav-item <?= $current === $key ? 'active' : '' ?>">
      <span class="nav-icon"><?= $navSvg[$key] ?? $navSvg['index'] ?></span>
      <span class="nav-text"><?= htmlspecialchars($info['label']) ?></span>
      <?php if ($stat['modified']): ?>
      <span class="nav-date"><?= date('d/m', $stat['modified']) ?></span>
      <?php endif ?>
    </a>
    <?php endforeach ?>
  </div>

  <div class="sidebar-footer">
    <div class="user-card">
      <div class="user-avatar"><?= strtoupper(substr($_SESSION['admin_user'], 0, 1)) ?></div>
      <div>
        <div class="user-name"><?= htmlspecialchars($_SESSION['admin_user']) ?></div>
        <div class="user-role">Administrateur</div>
      </div>
    </div>
    <a href="logout.php" class="btn-logout">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      Déconnexion
    </a>
  </div>
</aside>

<!-- ════ MAIN ════ -->
<div class="main">

  <!-- TOPBAR -->
  <header class="topbar">
    <div class="topbar-left">
      <button class="hamburger" onclick="openSidebar()" aria-label="Menu">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <div class="topbar-page">
        <div class="topbar-page-icon">
          <?= $navSvg[$current] ?? $navSvg['index'] ?>
        </div>
        <div class="topbar-breadcrumb">
          Admin
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:.35"><polyline points="9 18 15 12 9 6"/></svg>
          <span><?= htmlspecialchars($pageLabel) ?></span>
        </div>
      </div>
    </div>
    <div class="topbar-right">
      <?php if ($current !== '_submissions'): ?>
      <span class="unsaved-pill" id="unsavedBadge">
        <span class="unsaved-dot"></span>
        Non sauvegardé
      </span>
      <button class="btn-save" id="saveBtn" onclick="saveAll()">
        <div class="spinner"></div>
        <span class="btn-label">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline;vertical-align:middle;margin-right:4px"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Enregistrer
        </span>
      </button>
      <?php else: ?>
      <a href="?view=submissions" class="btn-save" style="text-decoration:none;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        <span class="btn-label">Actualiser</span>
      </a>
      <?php endif ?>
    </div>
  </header>

  <!-- CONTENT -->
  <div class="content">
    <div class="editor-col">

<?php
switch ($current) {

// ── SOUMISSIONS ──────────────────────────────────────────────────────────────
case '_submissions':
$contacts = array_values(array_filter($allSubmissions, fn($s) => ($s['type'] ?? '') === 'contact'));
$rdvs     = array_values(array_filter($allSubmissions, fn($s) => ($s['type'] ?? '') === 'rdv'));

$replyIcon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';
$checkIcon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';

function renderSubDetail(array $sub): void {
    $isRdv = ($sub['type'] ?? '') === 'rdv';
    echo '<div class="sub-detail">';
    echo '<div class="sub-row"><span class="sub-row-label">Email</span><span class="sub-row-val"><a href="mailto:'.htmlspecialchars($sub['email']).'" style="color:var(--accent);text-decoration:none;">'.htmlspecialchars($sub['email']).'</a></span></div>';
    if (!empty($sub['phone'])) echo '<div class="sub-row"><span class="sub-row-label">Téléphone</span><span class="sub-row-val">'.htmlspecialchars($sub['phone']).'</span></div>';
    if (!empty($sub['service'])) echo '<div class="sub-row"><span class="sub-row-label">Service</span><span class="sub-row-val">'.htmlspecialchars($sub['service']).'</span></div>';
    if ($isRdv) {
        echo '<div class="creneaux"><div class="creneau primary"><span class="creneau-label">1er choix</span>'.htmlspecialchars($sub['preferredDate'] ?? '');
        if (!empty($sub['preferredTime'])) echo ' · '.htmlspecialchars($sub['preferredTime']);
        echo '</div>';
        if (!empty($sub['preferredDate2'])) {
            echo '<div class="creneau secondary"><span class="creneau-label">2e choix</span>'.htmlspecialchars($sub['preferredDate2']);
            if (!empty($sub['preferredTime2'])) echo ' · '.htmlspecialchars($sub['preferredTime2']);
            echo '</div>';
        }
        echo '</div>';
        if (!empty($sub['sessionFormat'])) echo '<div class="sub-row"><span class="sub-row-label">Format</span><span class="sub-row-val">'.htmlspecialchars($sub['sessionFormat']).'</span></div>';
        if (!empty($sub['note'])) echo '<div class="sub-row"><span class="sub-row-label">Note</span><span class="sub-row-val" style="white-space:pre-wrap;">'.htmlspecialchars($sub['note']).'</span></div>';
    } else {
        if (!empty($sub['subject'])) echo '<div class="sub-row"><span class="sub-row-label">Sujet</span><span class="sub-row-val">'.htmlspecialchars($sub['subject']).'</span></div>';
        if (!empty($sub['message'])) echo '<div class="sub-row"><span class="sub-row-label">Message</span><span class="sub-row-val" style="white-space:pre-wrap;">'.htmlspecialchars($sub['message']).'</span></div>';
    }
    echo '</div>';
}
?>

<div class="sub-stats-row">
  <div class="sub-stat-item">
    <div class="sub-stat-val accent"><?= count($allSubmissions) ?></div>
    <div class="sub-stat-label">Total reçus</div>
  </div>
  <div class="sub-stat-item">
    <div class="sub-stat-val"><?= $unreadCount ?></div>
    <div class="sub-stat-label">Non lus</div>
  </div>
  <div class="sub-stat-item">
    <div class="sub-stat-val"><?= count($rdvs) ?></div>
    <div class="sub-stat-label">RDV demandés</div>
  </div>
  <div class="sub-stat-item">
    <div class="sub-stat-val"><?= count($contacts) ?></div>
    <div class="sub-stat-label">Messages contact</div>
  </div>
</div>

<div class="sub-tabs">
  <button class="sub-tab active" onclick="showSubTab('all', this)">Tous (<?= count($allSubmissions) ?>)</button>
  <button class="sub-tab" onclick="showSubTab('rdv', this)">RDV (<?= count($rdvs) ?>)</button>
  <button class="sub-tab" onclick="showSubTab('contact', this)">Messages (<?= count($contacts) ?>)</button>
</div>

<!-- All -->
<div class="sub-panel active" id="subpanel-all">
  <?php if (empty($allSubmissions)): ?>
  <div class="sub-empty">Aucune soumission reçue pour le moment.</div>
  <?php else: foreach ($allSubmissions as $sub):
    $isRead = $sub['read'] ?? false;
    $isRdv  = ($sub['type'] ?? '') === 'rdv';
    $subjectLine = $isRdv ? 'Demande de RDV' : ($sub['subject'] ?? 'Votre message');
  ?>
  <div class="sub-card <?= $isRead ? '' : 'unread' ?>" id="sub-<?= htmlspecialchars($sub['id']) ?>">
    <?php if (!$isRead): ?><span class="new-badge">Nouveau</span><?php endif ?>
    <div class="sub-meta">
      <span class="sub-name"><?= htmlspecialchars($sub['name']) ?></span>
      <span class="sub-date"><?= htmlspecialchars($sub['date']) ?></span>
      <span class="sub-tag <?= $isRdv ? 'rdv' : 'contact' ?>"><?= $isRdv ? 'Rendez-vous' : 'Message' ?></span>
    </div>
    <?php renderSubDetail($sub) ?>
    <div class="sub-actions">
      <?php if (!$isRead): ?>
      <button class="btn-action" onclick="markRead('<?= htmlspecialchars($sub['id']) ?>')">
        <?= $checkIcon ?> Marquer lu
      </button>
      <?php endif ?>
      <a href="mailto:<?= htmlspecialchars($sub['email']) ?>?subject=Re:+<?= urlencode($subjectLine) ?>" class="btn-action">
        <?= $replyIcon ?> Répondre
      </a>
    </div>
  </div>
  <?php endforeach; endif ?>
</div>

<!-- RDV -->
<div class="sub-panel" id="subpanel-rdv">
  <?php if (empty($rdvs)): ?>
  <div class="sub-empty">Aucune demande de rendez-vous.</div>
  <?php else: foreach ($rdvs as $sub): ?>
  <div class="sub-card <?= ($sub['read']??false) ? '' : 'unread' ?>">
    <?php if (!($sub['read']??false)): ?><span class="new-badge">Nouveau</span><?php endif ?>
    <div class="sub-meta">
      <span class="sub-name"><?= htmlspecialchars($sub['name']) ?></span>
      <span class="sub-date"><?= htmlspecialchars($sub['date']) ?></span>
      <span class="sub-tag rdv">Rendez-vous</span>
    </div>
    <?php renderSubDetail($sub) ?>
    <div class="sub-actions">
      <a href="mailto:<?= htmlspecialchars($sub['email']) ?>?subject=Confirmation+RDV+ON+Coaching" class="btn-action"><?= $replyIcon ?> Confirmer le RDV</a>
    </div>
  </div>
  <?php endforeach; endif ?>
</div>

<!-- Contacts -->
<div class="sub-panel" id="subpanel-contact">
  <?php if (empty($contacts)): ?>
  <div class="sub-empty">Aucun message de contact.</div>
  <?php else: foreach ($contacts as $sub):
    $isRead = $sub['read'] ?? false;
  ?>
  <div class="sub-card <?= $isRead ? '' : 'unread' ?>">
    <?php if (!$isRead): ?><span class="new-badge">Nouveau</span><?php endif ?>
    <div class="sub-meta">
      <span class="sub-name"><?= htmlspecialchars($sub['name']) ?></span>
      <span class="sub-date"><?= htmlspecialchars($sub['date']) ?></span>
      <span class="sub-tag contact">Message</span>
    </div>
    <?php renderSubDetail($sub) ?>
    <div class="sub-actions">
      <?php if (!$isRead): ?>
      <button class="btn-action" onclick="markRead('<?= htmlspecialchars($sub['id']) ?>')"><?= $checkIcon ?> Marquer lu</button>
      <?php endif ?>
      <a href="mailto:<?= htmlspecialchars($sub['email']) ?>?subject=Re:+<?= urlencode($sub['subject'] ?? 'Votre message') ?>" class="btn-action"><?= $replyIcon ?> Répondre</a>
    </div>
  </div>
  <?php endforeach; endif ?>
</div>

<?php break;

// ── ACCUEIL ──────────────────────────────────────────────────────────────────
case 'index': $d = $pageData; ?>

<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg></div>
    <div class="stat-val accent"><?= count($pages) ?></div>
    <div class="stat-label">Pages gérées</div>
  </div>
  <div class="stat-card">
    <div class="stat-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
    <div class="stat-val"><?= count($images) ?></div>
    <div class="stat-label">Images uploadées</div>
  </div>
  <div class="stat-card">
    <div class="stat-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
    <?php if ($lastModifiedPage): ?>
    <div class="stat-val" style="font-size:1.1rem"><?= date('d/m/Y', $lastModifiedTime) ?></div>
    <div class="stat-label">Dernière modif.</div>
    <div class="stat-sub"><?= htmlspecialchars($pages[$lastModifiedPage]['label']) ?></div>
    <?php else: ?>
    <div class="stat-val">—</div>
    <div class="stat-label">Aucune modification</div>
    <?php endif ?>
  </div>
</div>

<div class="card">
  <div class="card-head">
    <div class="card-head-left">
      <div class="card-head-icon"><?= $navSvg['index'] ?></div>
      <h3>Bannière principale</h3>
    </div>
  </div>
  <div class="card-body">
    <?php field("Titre principal", "hero.title", get($d, 'hero.title')) ?>
    <?php field("Sous-titre", "hero.subtitle", get($d, 'hero.subtitle'), 'textarea') ?>
    <?php field("Texte bouton 1", "hero.buttonPrimary", get($d, 'hero.buttonPrimary')) ?>
    <?php field("Texte bouton 2", "hero.buttonSecondary", get($d, 'hero.buttonSecondary')) ?>
    <div class="field-with-image">
      <div class="field-wrap">
        <label>Image de la bannière</label>
        <input type="text" data-path="hero.image" value="<?= htmlspecialchars(get($d, 'hero.image')) ?>" placeholder="imgHeroicon.png">
        <button class="btn-pick" onclick="openPicker('hero.image')">Choisir depuis la médiathèque</button>
      </div>
      <div class="img-preview"><?php $i = get($d, 'hero.image'); echo $i ? '<img src="/'.$i.'" alt="">' : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'; ?></div>
    </div>
  </div>
</div>

<div class="card">
  <?php sectionTitle("Section nos services", '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>') ?>
  <div class="card-body">
    <?php field("Titre", "servicesSection.title", get($d, 'servicesSection.title')) ?>
    <?php field("Description", "servicesSection.subtitle", get($d, 'servicesSection.subtitle'), 'textarea') ?>
  </div>
  <?php foreach (get($d, 'services', []) as $i => $s): ?>
  <?php sectionTitle("Service " . ($i + 1) . " — " . ($s['title'] ?? '')) ?>
  <div class="card-body">
    <?php field("Titre", "services.$i.title", $s['title'] ?? '') ?>
    <?php field("Description", "services.$i.description", $s['description'] ?? '', 'textarea') ?>
  </div>
  <?php endforeach ?>
</div>

<div class="card">
  <?php sectionTitle("Pourquoi nous choisir ?") ?>
  <div class="card-body">
    <?php field("Titre", "whyUsSection.title", get($d, 'whyUsSection.title')) ?>
    <?php field("Description", "whyUsSection.subtitle", get($d, 'whyUsSection.subtitle'), 'textarea') ?>
  </div>
  <?php foreach (get($d, 'whyUsSection.items', []) as $i => $item): ?>
  <?php sectionTitle("Argument " . ($i + 1)) ?>
  <div class="card-body">
    <?php field("Titre", "whyUsSection.items.$i.title", $item['title'] ?? '') ?>
    <?php field("Description", "whyUsSection.items.$i.description", $item['description'] ?? '', 'textarea') ?>
  </div>
  <?php endforeach ?>
</div>

<div class="card">
  <?php sectionTitle("Appel à l'action") ?>
  <div class="card-body">
    <?php field("Titre", "cta.title", get($d, 'cta.title')) ?>
    <?php field("Sous-titre", "cta.subtitle", get($d, 'cta.subtitle'), 'textarea') ?>
    <?php field("Texte du bouton", "cta.buttonText", get($d, 'cta.buttonText')) ?>
  </div>
</div>

<?php break;

// ── À PROPOS ──────────────────────────────────────────────────────────────────
case 'about': $d = $pageData; ?>

<div class="card">
  <div class="card-head">
    <div class="card-head-left">
      <div class="card-head-icon"><?= $navSvg['about'] ?></div>
      <h3>Présentation</h3>
    </div>
  </div>
  <div class="card-body">
    <?php field("Titre de la page", "hero.title", get($d, 'hero.title')) ?>
    <?php field("Paragraphe 1", "hero.paragraph1", get($d, 'hero.paragraph1'), 'textarea') ?>
    <?php field("Paragraphe 2", "hero.paragraph2", get($d, 'hero.paragraph2'), 'textarea') ?>
    <div class="field-with-image">
      <div class="field-wrap">
        <label>Image</label>
        <input type="text" data-path="hero.image" value="<?= htmlspecialchars(get($d, 'hero.image')) ?>">
        <button class="btn-pick" onclick="openPicker('hero.image')">Choisir</button>
      </div>
      <div class="img-preview"><?php $i = get($d, 'hero.image'); echo $i ? '<img src="/'.$i.'" alt="">' : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'; ?></div>
    </div>
  </div>
</div>

<div class="card">
  <?php sectionTitle("Qui suis-je ?") ?>
  <div class="card-body">
    <?php field("Titre", "whoSection.title", get($d, 'whoSection.title')) ?>
    <?php field("Sous-titre", "whoSection.subtitle", get($d, 'whoSection.subtitle')) ?>
    <?php field("Paragraphe 1", "whoSection.paragraph1", get($d, 'whoSection.paragraph1'), 'textarea') ?>
    <?php field("Paragraphe 2", "whoSection.paragraph2", get($d, 'whoSection.paragraph2'), 'textarea') ?>
    <?php field("Titre 'Ma différence'", "whoSection.differenceTitle", get($d, 'whoSection.differenceTitle')) ?>
    <?php field("Paragraphe 3", "whoSection.paragraph3", get($d, 'whoSection.paragraph3'), 'textarea') ?>
    <?php field("Paragraphe 4", "whoSection.paragraph4", get($d, 'whoSection.paragraph4'), 'textarea') ?>
  </div>
</div>

<div class="card">
  <?php sectionTitle("Nos valeurs") ?>
  <div class="card-body">
    <?php field("Titre de section", "valuesSection.title", get($d, 'valuesSection.title')) ?>
    <?php field("Description", "valuesSection.subtitle", get($d, 'valuesSection.subtitle'), 'textarea') ?>
  </div>
  <?php foreach (get($d, 'valuesSection.values', []) as $i => $v): ?>
  <?php sectionTitle("Valeur " . ($i + 1) . " — " . ($v['title'] ?? '')) ?>
  <div class="card-body">
    <?php field("Titre", "valuesSection.values.$i.title", $v['title'] ?? '') ?>
    <?php field("Description", "valuesSection.values.$i.description", $v['description'] ?? '', 'textarea') ?>
  </div>
  <?php endforeach ?>
</div>

<div class="card">
  <?php sectionTitle("Appel à l'action") ?>
  <div class="card-body">
    <?php field("Titre", "cta.title", get($d, 'cta.title')) ?>
    <?php field("Sous-titre", "cta.subtitle", get($d, 'cta.subtitle'), 'textarea') ?>
    <?php field("Texte du bouton", "cta.buttonText", get($d, 'cta.buttonText')) ?>
  </div>
</div>

<?php break;

// ── PAGES COACHING ──────────────────────────────────────────────────────────
case 'coaching-scolaire':
case 'coaching-jeunes':
case 'coaching-equipe':
case 'coaching-neurofeedback':
  $d    = $pageData;
  $tabs = get($d, 'tabs', []);
  $pIcon = $navSvg[$current] ?? $navSvg['index'];
?>

<div class="card">
  <div class="card-head">
    <div class="card-head-left">
      <div class="card-head-icon"><?= $pIcon ?></div>
      <h3>Informations de la page</h3>
    </div>
  </div>
  <div class="card-body">
    <?php field("Titre de la page", "page.title", get($d, 'page.title')) ?>
    <?php field("Sous-titre", "page.subtitle", get($d, 'page.subtitle')) ?>
    <?php if (isset($d['page']['intro'])): field("Texte d'introduction", "page.intro", get($d, 'page.intro'), 'textarea'); endif ?>
  </div>
</div>

<?php if (!empty($tabs)): ?>
<div class="card">
  <div class="card-head">
    <div class="card-head-left">
      <div class="card-head-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
      <h3>Contenu des onglets</h3>
    </div>
    <span class="badge"><?= count($tabs) ?> onglet<?= count($tabs) > 1 ? 's' : '' ?></span>
  </div>
  <div class="tab-list">
    <?php foreach ($tabs as $i => $tab): ?>
    <button class="tab-btn <?= $i === 0 ? 'active' : '' ?>" onclick="showTab(<?= $i ?>, this)">
      <?= htmlspecialchars($tab['label'] ?? 'Onglet ' . ($i + 1)) ?>
    </button>
    <?php endforeach ?>
  </div>
  <?php foreach ($tabs as $i => $tab): ?>
  <div class="tab-content <?= $i === 0 ? 'active' : '' ?>" id="tab_<?= $i ?>">
    <div class="card-body">
      <?php field("Nom de l'onglet", "tabs.$i.label", $tab['label'] ?? '') ?>
      <?php if (isset($tab['tagline'])): field("Phrase d'accroche", "tabs.$i.tagline", $tab['tagline'], 'textarea'); endif ?>
      <?php if (isset($tab['paragraph'])): field("Texte", "tabs.$i.paragraph", $tab['paragraph'], 'textarea'); endif ?>
      <?php if (isset($tab['paragraphs'])): foreach ($tab['paragraphs'] as $pi => $p): field("Paragraphe " . ($pi + 1), "tabs.$i.paragraphs.$pi", $p, 'textarea'); endforeach; endif ?>
      <?php if (isset($tab['items'])): fieldList("Points de la liste", "tabs.$i.items", $tab['items']); endif ?>
      <?php if (isset($tab['steps'])): fieldList("Étapes", "tabs.$i.steps", $tab['steps']); endif ?>
      <?php if (isset($tab['note'])): field("Note", "tabs.$i.note", $tab['note'], 'textarea'); endif ?>
      <?php if (isset($tab['quote'])): field("Citation", "tabs.$i.quote", $tab['quote'], 'textarea'); endif ?>
    </div>
  </div>
  <?php endforeach ?>
</div>
<?php endif ?>

<div class="card">
  <?php sectionTitle("Appel à l'action") ?>
  <div class="card-body">
    <?php field("Titre", "cta.title", get($d, 'cta.title')) ?>
    <?php field("Sous-titre", "cta.subtitle", get($d, 'cta.subtitle'), 'textarea') ?>
    <?php field("Texte du bouton", "cta.buttonText", get($d, 'cta.buttonText')) ?>
  </div>
</div>

<?php break;

// ── TARIFS ───────────────────────────────────────────────────────────────────
case 'nos-tarifs': $d = $pageData; ?>

<div class="card">
  <div class="card-head">
    <div class="card-head-left">
      <div class="card-head-icon"><?= $navSvg['nos-tarifs'] ?></div>
      <h3>Coaching particuliers</h3>
    </div>
  </div>
  <div class="card-body">
    <?php field("Titre", "particuliers.title", get($d, 'particuliers.title')) ?>
    <?php field("Sous-titre", "particuliers.subtitle", get($d, 'particuliers.subtitle')) ?>
  </div>
  <?php foreach (get($d, 'particuliers.cards', []) as $i => $c): ?>
  <?php sectionTitle($c['title'] ?? 'Carte ' . ($i + 1)) ?>
  <div class="card-body">
    <?php field("Titre", "particuliers.cards.$i.title", $c['title'] ?? '') ?>
    <?php fieldList("Tarifs", "particuliers.cards.$i.items", $c['items'] ?? []) ?>
  </div>
  <?php endforeach ?>
</div>

<div class="card">
  <?php sectionTitle("Coaching entreprises") ?>
  <div class="card-body">
    <?php field("Titre", "entreprises.title", get($d, 'entreprises.title')) ?>
    <?php field("Sous-titre", "entreprises.subtitle", get($d, 'entreprises.subtitle')) ?>
    <?php fieldList("Tarifs", "entreprises.items", get($d, 'entreprises.items', [])) ?>
  </div>
</div>

<div class="card">
  <?php sectionTitle("Neurofeedback") ?>
  <div class="card-body">
    <?php field("Titre", "neurofeedback.title", get($d, 'neurofeedback.title')) ?>
    <?php field("Sous-titre", "neurofeedback.subtitle", get($d, 'neurofeedback.subtitle')) ?>
  </div>
  <?php foreach (get($d, 'neurofeedback.cards', []) as $i => $c): ?>
  <?php sectionTitle($c['title'] ?? 'Carte ' . ($i + 1)) ?>
  <div class="card-body">
    <?php field("Titre", "neurofeedback.cards.$i.title", $c['title'] ?? '') ?>
    <?php if (!empty($c['items'])): fieldList("Tarifs", "neurofeedback.cards.$i.items", $c['items']); endif ?>
    <?php if (!empty($c['description'])): field("Description", "neurofeedback.cards.$i.description", $c['description'] ?? '', 'textarea'); field("Note", "neurofeedback.cards.$i.note", $c['note'] ?? ''); endif ?>
  </div>
  <?php endforeach ?>
</div>

<div class="card">
  <?php sectionTitle("Appel à l'action") ?>
  <div class="card-body">
    <?php field("Titre", "cta.title", get($d, 'cta.title')) ?>
    <?php field("Sous-titre", "cta.subtitle", get($d, 'cta.subtitle'), 'textarea') ?>
    <?php field("Texte du bouton", "cta.buttonText", get($d, 'cta.buttonText')) ?>
  </div>
</div>

<?php break;

// ── CONTACT ───────────────────────────────────────────────────────────────────
case 'contact': $d = $pageData; ?>

<div class="card">
  <div class="card-head">
    <div class="card-head-left">
      <div class="card-head-icon"><?= $navSvg['contact'] ?></div>
      <h3>Coordonnées</h3>
    </div>
  </div>
  <div class="card-body">
    <?php field("Titre", "coordonnees.title", get($d, 'coordonnees.title')) ?>
    <?php field("Sous-titre", "coordonnees.subtitle", get($d, 'coordonnees.subtitle')) ?>
    <?php field("Adresse", "coordonnees.adresse.value", get($d, 'coordonnees.adresse.value'), 'textarea') ?>
    <?php field("Téléphone", "coordonnees.telephone.value", get($d, 'coordonnees.telephone.value')) ?>
    <?php field("Email", "coordonnees.email.value", get($d, 'coordonnees.email.value')) ?>
  </div>
</div>

<div class="card">
  <?php sectionTitle("Horaires d'ouverture") ?>
  <div class="card-body">
    <?php fieldList("Horaires (une ligne par jour)", "coordonnees.horaires.lines", get($d, 'coordonnees.horaires.lines', [])) ?>
  </div>
</div>

<div class="card">
  <?php sectionTitle("Formulaire de contact") ?>
  <div class="card-body">
    <?php field("Titre", "formulaire.title", get($d, 'formulaire.title')) ?>
    <?php field("Sous-titre", "formulaire.subtitle", get($d, 'formulaire.subtitle')) ?>
    <?php field("Texte du bouton Envoyer", "formulaire.fields.submitButton", get($d, 'formulaire.fields.submitButton')) ?>
    <?php field("Message de succès — titre", "formulaire.messages.successTitle", get($d, 'formulaire.messages.successTitle')) ?>
    <?php field("Message de succès — description", "formulaire.messages.successDescription", get($d, 'formulaire.messages.successDescription')) ?>
  </div>
</div>

<div class="card">
  <?php sectionTitle("Options du menu 'Service'") ?>
  <div class="card-body">
    <?php foreach (get($d, 'formulaire.services', []) as $i => $s): ?>
    <?php field("Option " . ($i + 1), "formulaire.services.$i.label", $s['label'] ?? '') ?>
    <?php endforeach ?>
  </div>
</div>

<?php break;
} // end switch
?>

    </div><!-- /editor-col -->

    <!-- ════ SIDE COLUMN ════ -->
    <div class="side-col">

      <!-- Media Library -->
      <div class="card">
        <div class="card-head">
          <div class="card-head-left">
            <div class="card-head-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
            <h3>Médiathèque</h3>
          </div>
          <span class="badge"><?= count($images) ?></span>
        </div>
        <div class="card-body">
          <div class="upload-zone" id="uploadZone" onclick="document.getElementById('fileInput').click()">
            <div class="uz-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <strong>Glissez une image ici</strong>
            <p>ou cliquez · JPG, PNG, WebP · Max 5 Mo</p>
          </div>
          <input type="file" id="fileInput" accept="image/*" onchange="uploadImage(this.files[0])">
          <div class="img-grid" id="imgGrid">
            <?php foreach ($images as $img): ?>
            <div class="img-thumb" data-file="<?= htmlspecialchars($img['filename']) ?>">
              <img src="<?= htmlspecialchars($img['url']) ?>" alt="" loading="lazy">
              <div class="img-overlay">
                <button class="img-btn img-btn-copy" onclick="copyUrl('<?= htmlspecialchars($img['url']) ?>',event)">Copier</button>
                <button class="img-btn img-btn-del" onclick="askDel('<?= htmlspecialchars($img['filename']) ?>',event)">Suppr.</button>
              </div>
            </div>
            <?php endforeach ?>
          </div>
        </div>
      </div>

      <!-- Help -->
      <div class="card">
        <div class="card-head">
          <div class="card-head-left">
            <div class="card-head-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h3>Comment modifier ?</h3>
          </div>
        </div>
        <div class="card-body">
          <div class="help-item">
            <div class="help-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div>
            <div class="help-text">
              <strong>Modifier un texte</strong>
              Cliquez sur le champ et tapez directement.
            </div>
          </div>
          <div class="help-item">
            <div class="help-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
            <div class="help-text">
              <strong>Changer une image</strong>
              Uploadez dans la médiathèque, puis cliquez sur "Choisir".
            </div>
          </div>
          <div class="help-item">
            <div class="help-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
            <div class="help-text">
              <strong>Listes</strong>
              Cliquez sur "+ Ajouter" pour créer un nouvel élément.
            </div>
          </div>
          <div class="help-item">
            <div class="help-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg></div>
            <div class="help-text">
              <strong>Sauvegarder</strong>
              Bouton "Enregistrer" en haut ou <kbd>Ctrl+S</kbd>
            </div>
          </div>
        </div>
      </div>

    </div><!-- /side-col -->
  </div><!-- /content -->
</div><!-- /main -->
</div><!-- /app -->

<!-- ════ MODAL: Supprimer image ════ -->
<div class="modal-bg" id="delModal">
  <div class="modal-box">
    <h3>Supprimer cette image ?</h3>
    <p>L'image sera supprimée définitivement. Cette action est irréversible.</p>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal('delModal')">Annuler</button>
      <button class="btn-del-ok" id="confirmDel">Supprimer</button>
    </div>
  </div>
</div>

<!-- ════ MODAL: Choisir image ════ -->
<div class="modal-bg" id="pickerModal">
  <div class="modal-box" style="max-width:480px;">
    <h3>Choisir une image</h3>
    <p>Cliquez sur l'image à utiliser dans ce champ.</p>
    <div class="picker-grid" id="pickerGrid">
      <?php foreach ($images as $img): ?>
      <div class="picker-item" onclick="pickImg('<?= htmlspecialchars($img['url']) ?>')">
        <img src="<?= htmlspecialchars($img['url']) ?>" alt="">
      </div>
      <?php endforeach ?>
    </div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal('pickerModal')">Fermer</button>
    </div>
  </div>
</div>

<!-- ════ TOASTS ════ -->
<div class="toast-wrap" id="toastWrap"></div>

<script>
const CSRF         = <?= json_encode($csrf) ?>;
const CURRENT_PAGE = <?= json_encode($current) ?>;
let pendingDelFile = null, pickerTarget = null, hasChanges = false;

document.querySelectorAll('[data-path]').forEach(el => el.addEventListener('input', markChanged));

function markChanged() {
  if (!hasChanges) {
    hasChanges = true;
    document.getElementById('unsavedBadge')?.classList.add('show');
  }
}

// Sidebar mobile
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
  document.body.style.overflow = '';
}

// Tabs
function showTab(idx, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab_' + idx)?.classList.add('active');
  btn.classList.add('active');
}

// Collect fields
function collectFields() {
  const result = {};
  document.querySelectorAll('[data-path]').forEach(el => {
    setNested(result, el.dataset.path.split('.'), el.value);
  });
  document.querySelectorAll('.list-items').forEach(listEl => {
    const vals = [];
    listEl.querySelectorAll('input').forEach(inp => vals.push(inp.value));
    setNested(result, listEl.dataset.path.split('.'), vals);
  });
  return result;
}

function setNested(obj, keys, val) {
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const nextIsNum = /^\d+$/.test(keys[i + 1]);
    if (!(k in cur) || typeof cur[k] !== 'object') cur[k] = nextIsNum ? [] : {};
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = val;
}

// Save
function saveAll() {
  const btn = document.getElementById('saveBtn');
  if (!btn) return;
  btn.classList.add('loading'); btn.disabled = true;
  const body = new FormData();
  body.append('action', 'save_fields');
  body.append('csrf_token', CSRF);
  body.append('target_page', CURRENT_PAGE);
  body.append('fields', JSON.stringify(collectFields()));
  fetch('dashboard.php?page=' + CURRENT_PAGE, { method: 'POST', body })
    .then(r => r.json())
    .then(data => {
      showToast(data.msg, data.ok ? 'success' : 'error');
      if (data.ok) {
        hasChanges = false;
        document.getElementById('unsavedBadge')?.classList.remove('show');
      }
    })
    .catch(() => showToast('Erreur réseau', 'error'))
    .finally(() => { btn.classList.remove('loading'); btn.disabled = false; });
}

// Lists
function addItem(listId) {
  const list = document.getElementById('list_' + listId);
  const div  = document.createElement('div');
  div.className = 'list-item';
  div.innerHTML = `<span class="drag-handle" title="Réordonner">&#8942;</span><input type="text" placeholder="Nouveau texte…"><button type="button" class="btn-remove-item" onclick="removeItem(this)" title="Supprimer"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`;
  div.querySelector('input').addEventListener('input', markChanged);
  list.appendChild(div);
  div.querySelector('input').focus();
  markChanged();
}
function removeItem(btn) { btn.closest('.list-item').remove(); markChanged(); }

// Upload image
function uploadImage(file) {
  if (!file) return;
  const body = new FormData();
  body.append('action', 'upload_image');
  body.append('csrf_token', CSRF);
  body.append('file', file);
  showToast('Upload en cours…', 'success');
  fetch('dashboard.php?page=' + CURRENT_PAGE, { method: 'POST', body })
    .then(r => r.json())
    .then(data => {
      if (data.ok) { showToast('Image uploadée !', 'success'); addToGrids(data.filename, data.url); }
      else showToast(data.msg, 'error');
    })
    .catch(() => showToast('Erreur réseau', 'error'));
  document.getElementById('fileInput').value = '';
}

function addToGrids(filename, url) {
  const thumbHtml = `<div class="img-thumb" data-file="${filename}"><img src="${url}" loading="lazy"><div class="img-overlay"><button class="img-btn img-btn-copy" onclick="copyUrl('${url}',event)">Copier</button><button class="img-btn img-btn-del" onclick="askDel('${filename}',event)">Suppr.</button></div></div>`;
  const pickerHtml = `<div class="picker-item" onclick="pickImg('${url}')"><img src="${url}"></div>`;
  document.getElementById('imgGrid').insertAdjacentHTML('afterbegin', thumbHtml);
  document.getElementById('pickerGrid').insertAdjacentHTML('afterbegin', pickerHtml);
}

// Delete image
function askDel(filename, event) {
  event?.stopPropagation();
  pendingDelFile = filename;
  document.getElementById('delModal').classList.add('show');
  document.getElementById('confirmDel').onclick = doDelete;
}
function doDelete() {
  const body = new FormData();
  body.append('action', 'delete_image');
  body.append('csrf_token', CSRF);
  body.append('filename', pendingDelFile);
  fetch('dashboard.php?page=' + CURRENT_PAGE, { method: 'POST', body })
    .then(r => r.json())
    .then(data => {
      if (data.ok) {
        document.querySelectorAll(`[data-file="${pendingDelFile}"]`).forEach(e => e.remove());
        showToast('Image supprimée', 'success');
      } else showToast(data.msg || 'Erreur', 'error');
    });
  closeModal('delModal');
}

// Picker
function openPicker(path) { pickerTarget = path; document.getElementById('pickerModal').classList.add('show'); }
function pickImg(url) {
  if (!pickerTarget) return;
  const inp = document.querySelector(`[data-path="${pickerTarget}"]`);
  if (inp) { inp.value = url.replace(/^\//, ''); markChanged(); }
  closeModal('pickerModal');
  showToast('Image sélectionnée !', 'success');
}
function copyUrl(url, event) {
  event?.stopPropagation();
  navigator.clipboard?.writeText(url);
  showToast('Lien copié !', 'success');
}

// Modals
function closeModal(id) {
  document.getElementById(id).classList.remove('show');
  pendingDelFile = null; pickerTarget = null;
}
document.querySelectorAll('.modal-bg').forEach(m =>
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('show'); })
);

// Toast
function showToast(msg, type = 'success') {
  const icons = {
    success: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
    error:   '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  };
  const wrap = document.getElementById('toastWrap');
  const el   = document.createElement('div');
  el.className = 'toast ' + type;
  el.innerHTML = `<span class="toast-icon">${icons[type] || icons.success}</span><span>${msg}</span>`;
  wrap.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 260); }, 3200);
}

// Drag & drop
const zone = document.getElementById('uploadZone');
zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('drag'); });
zone.addEventListener('dragleave', ()  => zone.classList.remove('drag'));
zone.addEventListener('drop',      e  => { e.preventDefault(); zone.classList.remove('drag'); uploadImage(e.dataTransfer.files[0]); });

// Ctrl+S
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveAll(); }
});

// Unload warning
window.addEventListener('beforeunload', e => {
  if (hasChanges) { e.preventDefault(); e.returnValue = ''; }
});

// Submissions tabs
function showSubTab(key, btn) {
  document.querySelectorAll('.sub-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.sub-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('subpanel-' + key)?.classList.add('active');
}

// Mark as read
function markRead(id) {
  const body = new FormData();
  body.append('action', 'mark_read');
  body.append('csrf_token', CSRF);
  body.append('submission_id', id);
  fetch(window.location.href, { method: 'POST', body })
    .then(r => r.json())
    .then(data => {
      if (data.ok) {
        const card = document.getElementById('sub-' + id);
        if (card) {
          card.classList.remove('unread');
          card.querySelector('.new-badge')?.remove();
          const markBtn = card.querySelector('.btn-action[onclick*="markRead"]');
          markBtn?.remove();
        }
        showToast('Marqué comme lu', 'success');
      }
    })
    .catch(() => showToast('Erreur réseau', 'error'));
}
</script>
</body>
</html>
