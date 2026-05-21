<?php
require_once 'config.php';
requireLogin();

$pages   = PAGES;
$current = $_GET['page'] ?? 'index';
if (!array_key_exists($current, $pages)) $current = 'index';

$pageData  = readJson($current) ?? [];
$pageLabel = $pages[$current]['label'];
$csrf      = csrfToken();

// ── AJAX handlers ──────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    header('Content-Type: application/json');

    if (!verifyCsrf($_POST['csrf_token'] ?? '')) {
        echo json_encode(['ok' => false, 'msg' => 'Sécurité : token invalide, rechargez la page.']);
        exit();
    }

    // ── Sauvegarder les champs du formulaire visuel
    if ($_POST['action'] === 'save_fields') {
        $targetPage = $_POST['target_page'] ?? '';
        if (!array_key_exists($targetPage, $pages)) {
            echo json_encode(['ok' => false, 'msg' => 'Page inconnue']);
            exit();
        }
        $fields = json_decode($_POST['fields'] ?? '{}', true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            echo json_encode(['ok' => false, 'msg' => 'Données invalides']);
            exit();
        }
        $existing = readJson($targetPage) ?? [];
        $merged   = array_replace_recursive($existing, $fields);
        $result   = writeJson($targetPage, $merged);
        logEvent('SAVE_FIELDS', "page=$targetPage user={$_SESSION['admin_user']}");
        echo json_encode(['ok' => $result, 'msg' => $result ? 'Modifications sauvegardées !' : 'Erreur lors de la sauvegarde']);
        exit();
    }

    // ── Upload image
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

    // ── Supprimer image
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

// ── Images disponibles ─────────────────────────────────────────────────────────
$images = [];
if (is_dir(IMAGES_DIR)) {
    foreach (array_diff(scandir(IMAGES_DIR), ['.','..']) as $f) {
        if (in_array(strtolower(pathinfo($f, PATHINFO_EXTENSION)), ['jpg','jpeg','png','webp','gif'])) {
            $images[] = ['filename' => $f, 'url' => IMAGES_URL.$f];
        }
    }
}

// ── Stats pour le tableau de bord ─────────────────────────────────────────────
$pageStats = [];
foreach ($pages as $key => $info) {
    $path = jsonPath($key);
    $pageStats[$key] = [
        'exists'   => file_exists($path),
        'modified' => file_exists($path) ? filemtime($path) : null,
    ];
}
$lastModifiedPage = null;
$lastModifiedTime = 0;
foreach ($pageStats as $key => $stat) {
    if ($stat['modified'] && $stat['modified'] > $lastModifiedTime) {
        $lastModifiedTime = $stat['modified'];
        $lastModifiedPage = $key;
    }
}

// ── Helpers ────────────────────────────────────────────────────────────────────
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
        echo '<button type="button" class="btn-remove-item" onclick="removeItem(this)" title="Supprimer">&#10005;</button>';
        echo '</div>';
    }
    echo '</div>';
    echo '<button type="button" class="btn-add-item" onclick="addItem(\''.md5($path).'\')">+ Ajouter un élément</button>';
    echo '</div>';
}

function sectionTitle(string $title, string $icon = ''): void {
    echo '<div class="section-header"><span class="section-icon">'.$icon.'</span><h2>'.htmlspecialchars($title).'</h2></div>';
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

/* ── Design tokens ── */
:root{
    --bg:          #0b0b0c;
    --sidebar:     #111113;
    --sidebar-w:   248px;
    --surface:     #1a1a1c;
    --surface-h:   #202024;
    --border:      rgba(255,255,255,0.08);
    --border-h:    rgba(255,255,255,0.14);
    --accent:      #1ab5c7;
    --accent-dim:  rgba(26,181,199,0.12);
    --accent-glow: rgba(26,181,199,0.25);
    --text:        #e8e8ec;
    --text-muted:  #6b6b78;
    --text-sub:    #9999a8;
    --green:       #22c55e;
    --red:         #ef4444;
    --orange:      #f59e0b;
    --radius:      10px;
    --radius-lg:   14px;
}

html,body{height:100%;background:var(--bg);color:var(--text);font-family:'DM Sans',system-ui,sans-serif;font-size:14px;line-height:1.5;}
.app{display:flex;height:100vh;overflow:hidden;}

/* ════════════════════════════════
   SIDEBAR
════════════════════════════════ */
.sidebar{
    width:var(--sidebar-w);flex-shrink:0;background:var(--sidebar);
    display:flex;flex-direction:column;overflow-y:auto;
    border-right:1px solid var(--border);
    scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.08) transparent;
}

.sidebar-brand{
    padding:1.375rem 1.25rem 1.25rem;
    border-bottom:1px solid var(--border);
    display:flex;align-items:center;gap:0.75rem;flex-shrink:0;
}
.brand-logo{
    width:34px;height:34px;border-radius:8px;flex-shrink:0;
    background:linear-gradient(135deg,var(--accent),#0e8a99);
    display:flex;align-items:center;justify-content:center;
    font-family:'Instrument Serif',serif;font-size:0.9rem;font-weight:400;color:#fff;
    box-shadow:0 2px 12px var(--accent-glow);
}
.brand-text{min-width:0;}
.brand-name{
    font-family:'Instrument Serif',serif;font-size:1.05rem;
    color:var(--text);letter-spacing:-0.01em;display:block;
}
.brand-name em{font-style:normal;color:var(--accent);}
.brand-sub{font-size:0.65rem;color:var(--text-muted);letter-spacing:0.12em;text-transform:uppercase;margin-top:1px;display:block;}

.nav-section{padding:1.25rem 0.875rem 0.5rem;}
.nav-label{font-size:0.6rem;color:var(--text-muted);letter-spacing:0.14em;text-transform:uppercase;font-weight:600;padding:0 0.5rem;margin-bottom:0.5rem;display:block;}
.nav-item{
    display:flex;align-items:center;gap:0.625rem;padding:0.55rem 0.625rem;
    border-radius:8px;color:var(--text-sub);text-decoration:none;
    font-size:0.825rem;font-weight:400;transition:all 0.14s;margin-bottom:1px;
    position:relative;white-space:nowrap;overflow:hidden;
}
.nav-item:hover{background:rgba(255,255,255,0.05);color:var(--text);}
.nav-item.active{background:var(--accent-dim);color:var(--accent);font-weight:500;}
.nav-item.active::before{
    content:'';position:absolute;left:0;top:15%;bottom:15%;
    width:2.5px;background:var(--accent);border-radius:0 2px 2px 0;
}
.nav-icon{
    width:28px;height:28px;border-radius:6px;flex-shrink:0;
    display:flex;align-items:center;justify-content:center;font-size:0.8rem;
    background:rgba(255,255,255,0.04);
    transition:background 0.14s;
}
.nav-item:hover .nav-icon{background:rgba(255,255,255,0.07);}
.nav-item.active .nav-icon{background:var(--accent-dim);}
.nav-label-text{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;}
.nav-badge{
    font-size:0.58rem;padding:1px 6px;border-radius:10px;
    background:rgba(255,255,255,0.07);color:var(--text-muted);
    font-weight:600;letter-spacing:0.04em;flex-shrink:0;
}
.nav-item.active .nav-badge{background:var(--accent-dim);color:var(--accent);}

.sidebar-footer{
    margin-top:auto;padding:0.875rem;
    border-top:1px solid var(--border);flex-shrink:0;
}
.user-pill{
    display:flex;align-items:center;gap:0.625rem;
    padding:0.5rem 0.625rem;border-radius:8px;
    background:rgba(255,255,255,0.03);
    margin-bottom:0.5rem;
}
.avatar{
    width:28px;height:28px;border-radius:50%;flex-shrink:0;
    background:linear-gradient(135deg,var(--accent),#0e8a99);
    display:flex;align-items:center;justify-content:center;
    font-size:0.72rem;font-weight:700;color:#fff;
}
.user-name{font-size:0.8rem;font-weight:500;color:var(--text);}
.user-role{font-size:0.65rem;color:var(--text-muted);}
.btn-logout{
    display:flex;align-items:center;gap:0.5rem;width:100%;
    padding:0.5rem 0.75rem;border-radius:8px;
    border:1px solid var(--border);background:none;
    color:var(--text-muted);font-family:inherit;font-size:0.78rem;
    cursor:pointer;transition:all 0.15s;
}
.btn-logout:hover{color:#f87171;border-color:rgba(248,113,113,0.3);background:rgba(239,68,68,0.05);}
.btn-logout svg{flex-shrink:0;}

/* ════════════════════════════════
   MAIN AREA
════════════════════════════════ */
.main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden;}

/* TOPBAR */
.topbar{
    height:58px;flex-shrink:0;background:var(--sidebar);
    border-bottom:1px solid var(--border);
    display:flex;align-items:center;justify-content:space-between;
    padding:0 1.5rem;gap:1rem;
}
.topbar-left{display:flex;align-items:center;gap:0.875rem;min-width:0;}
.topbar-crumb{
    display:flex;align-items:center;gap:0.5rem;
    font-size:0.78rem;color:var(--text-muted);
}
.topbar-crumb span{color:var(--text);}
.topbar-dot{width:3px;height:3px;border-radius:50%;background:var(--border-h);flex-shrink:0;}
.topbar-right{display:flex;align-items:center;gap:0.75rem;flex-shrink:0;}

.unsaved-pill{
    display:none;align-items:center;gap:0.4rem;
    padding:0.3rem 0.75rem;border-radius:20px;
    background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.25);
    color:#f59e0b;font-size:0.72rem;font-weight:600;white-space:nowrap;
}
.unsaved-pill.show{display:inline-flex;}
.unsaved-dot{width:6px;height:6px;border-radius:50%;background:#f59e0b;flex-shrink:0;animation:blink 1.2s ease infinite;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}

.btn-save{
    display:flex;align-items:center;gap:0.5rem;
    padding:0.55rem 1.25rem;border:none;border-radius:8px;
    background:var(--accent);color:#fff;
    font-family:inherit;font-size:0.825rem;font-weight:600;
    cursor:pointer;transition:all 0.18s;
    box-shadow:0 2px 10px var(--accent-glow);white-space:nowrap;
}
.btn-save:hover{background:#18a8b8;box-shadow:0 4px 18px rgba(26,181,199,0.35);transform:translateY(-1px);}
.btn-save:active{transform:none;}
.btn-save:disabled{opacity:0.5;cursor:not-allowed;transform:none;box-shadow:none;}
.btn-save .spinner{width:13px;height:13px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.55s linear infinite;display:none;}
.btn-save.loading .spinner{display:block;}
.btn-save.loading .btn-label{display:none;}
@keyframes spin{to{transform:rotate(360deg)}}

/* CONTENT */
.content{flex:1;overflow-y:auto;padding:1.5rem;display:flex;gap:1.25rem;align-items:flex-start;}
.editor-col{flex:1;min-width:0;display:flex;flex-direction:column;gap:1rem;}
.side-col{width:272px;flex-shrink:0;display:flex;flex-direction:column;gap:1rem;}

/* ════════════════════════════════
   CARDS
════════════════════════════════ */
.card{
    background:var(--surface);border:1px solid var(--border);
    border-radius:var(--radius-lg);overflow:hidden;
}
.card-head{
    padding:0.875rem 1.125rem;border-bottom:1px solid var(--border);
    display:flex;align-items:center;justify-content:space-between;
    background:rgba(255,255,255,0.01);
}
.card-head-left{display:flex;align-items:center;gap:0.6rem;}
.card-head-icon{
    width:26px;height:26px;border-radius:6px;flex-shrink:0;
    background:var(--accent-dim);
    display:flex;align-items:center;justify-content:center;font-size:0.75rem;
}
.card-head h3{font-size:0.825rem;font-weight:600;color:var(--text);}
.card-head .badge{
    font-size:0.65rem;padding:2px 8px;border-radius:10px;
    background:rgba(255,255,255,0.06);color:var(--text-muted);font-weight:600;
}
.card-body{padding:1.125rem;display:flex;flex-direction:column;gap:0.875rem;}

.section-header{
    display:flex;align-items:center;gap:0.6rem;
    padding:0.6rem 1.125rem;
    background:rgba(255,255,255,0.02);
    border-bottom:1px solid var(--border);
}
.section-icon{font-size:0.8rem;opacity:0.7;}
.section-header h2{font-size:0.68rem;font-weight:600;color:var(--text-muted);letter-spacing:0.08em;text-transform:uppercase;}

/* ════════════════════════════════
   STATS (home)
════════════════════════════════ */
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.875rem;}
.stat-card{
    background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
    padding:1rem 1.125rem;display:flex;flex-direction:column;gap:0.25rem;
}
.stat-val{font-size:1.75rem;font-weight:600;color:var(--text);letter-spacing:-0.02em;line-height:1;}
.stat-label{font-size:0.72rem;color:var(--text-muted);}
.stat-accent{color:var(--accent);}
.stat-sub{font-size:0.68rem;color:var(--text-muted);margin-top:0.25rem;}

/* ════════════════════════════════
   FIELDS
════════════════════════════════ */
.field-wrap{display:flex;flex-direction:column;gap:0.3rem;}
.field-wrap label{font-size:0.75rem;font-weight:600;color:var(--text-sub);letter-spacing:0.02em;}
.field-wrap input[type=text],
.field-wrap textarea{
    width:100%;padding:0.6rem 0.875rem;
    border:1px solid var(--border);border-radius:8px;
    font-family:inherit;font-size:0.875rem;
    color:var(--text);background:rgba(255,255,255,0.03);
    transition:border-color 0.18s,background 0.18s,box-shadow 0.18s;
    outline:none;resize:vertical;
}
.field-wrap input[type=text]::placeholder,
.field-wrap textarea::placeholder{color:rgba(255,255,255,0.18);}
.field-wrap input:focus,.field-wrap textarea:focus{
    border-color:var(--accent);
    background:rgba(26,181,199,0.05);
    box-shadow:0 0 0 3px var(--accent-dim);
}
.field-with-image{display:flex;gap:0.75rem;align-items:flex-end;}
.field-with-image .field-wrap{flex:1;}
.img-preview{
    width:64px;height:64px;border-radius:8px;border:1px solid var(--border);
    overflow:hidden;flex-shrink:0;background:rgba(255,255,255,0.04);
    display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:var(--text-muted);
}
.img-preview img{width:100%;height:100%;object-fit:cover;display:block;}
.btn-pick{
    margin-top:0.35rem;padding:0.35rem 0.75rem;border-radius:6px;
    border:1px solid var(--border);background:rgba(255,255,255,0.04);
    color:var(--text-sub);font-family:inherit;font-size:0.72rem;
    cursor:pointer;transition:all 0.15s;
}
.btn-pick:hover{background:var(--accent-dim);color:var(--accent);border-color:rgba(26,181,199,0.3);}

/* LISTS */
.list-items{display:flex;flex-direction:column;gap:0.35rem;margin-bottom:0.5rem;}
.list-item{display:flex;align-items:center;gap:0.4rem;}
.list-item input{
    flex:1;padding:0.525rem 0.75rem;
    border:1px solid var(--border);border-radius:7px;
    font-family:inherit;font-size:0.825rem;
    color:var(--text);background:rgba(255,255,255,0.03);
    outline:none;transition:border-color 0.18s;
}
.list-item input:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-dim);}
.drag-handle{
    color:var(--text-muted);font-size:1rem;
    user-select:none;cursor:grab;opacity:0.5;
    transition:opacity 0.15s;padding:0 2px;
}
.list-item:hover .drag-handle{opacity:1;}
.btn-remove-item{
    background:none;border:none;color:rgba(255,255,255,0.2);
    cursor:pointer;font-size:0.8rem;padding:0.25rem 0.35rem;
    border-radius:5px;transition:all 0.15s;line-height:1;
}
.btn-remove-item:hover{color:var(--red);background:rgba(239,68,68,0.08);}
.btn-add-item{
    display:inline-flex;align-items:center;gap:0.3rem;
    padding:0.4rem 0.875rem;
    border:1px dashed rgba(26,181,199,0.25);border-radius:7px;
    background:none;color:var(--accent);
    font-family:inherit;font-size:0.775rem;font-weight:500;
    cursor:pointer;transition:all 0.15s;
}
.btn-add-item:hover{border-color:var(--accent);background:var(--accent-dim);}

/* TABS */
.tab-list{
    display:flex;gap:0.3rem;padding:0.75rem 1.125rem;
    border-bottom:1px solid var(--border);flex-wrap:wrap;
}
.tab-btn{
    padding:0.35rem 0.875rem;border-radius:20px;
    border:1px solid transparent;background:none;
    color:var(--text-muted);font-family:inherit;font-size:0.775rem;font-weight:500;
    cursor:pointer;transition:all 0.15s;
}
.tab-btn:hover{background:rgba(255,255,255,0.05);color:var(--text);}
.tab-btn.active{
    background:var(--accent-dim);
    border-color:rgba(26,181,199,0.3);
    color:var(--accent);
}
.tab-content{display:none;}.tab-content.active{display:block;}

/* ════════════════════════════════
   MEDIA LIBRARY
════════════════════════════════ */
.upload-zone{
    border:1.5px dashed rgba(26,181,199,0.2);border-radius:10px;
    padding:1.25rem 1rem;text-align:center;cursor:pointer;
    transition:all 0.2s;background:rgba(26,181,199,0.02);
}
.upload-zone:hover,.upload-zone.drag{
    border-color:var(--accent);background:var(--accent-dim);
}
.upload-zone .uz-icon{font-size:1.5rem;margin-bottom:0.375rem;display:block;}
.upload-zone strong{font-size:0.8rem;color:var(--text);display:block;}
.upload-zone p{font-size:0.7rem;color:var(--text-muted);margin-top:0.2rem;}
#fileInput{display:none;}
.img-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.4rem;margin-top:0.75rem;}
.img-thumb{
    position:relative;aspect-ratio:1;border-radius:7px;
    overflow:hidden;border:1px solid var(--border);
    cursor:pointer;transition:border-color 0.15s;background:var(--surface-h);
}
.img-thumb:hover{border-color:var(--accent);}
.img-thumb img{width:100%;height:100%;object-fit:cover;display:block;}
.img-overlay{
    position:absolute;inset:0;background:rgba(0,0,0,0.7);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:0.3rem;opacity:0;transition:opacity 0.15s;
}
.img-thumb:hover .img-overlay{opacity:1;}
.img-btn{
    padding:0.25rem 0.55rem;border-radius:5px;
    font-size:0.62rem;font-weight:700;cursor:pointer;border:none;
    font-family:inherit;
}
.img-btn-copy{background:var(--accent);color:#fff;}
.img-btn-del{background:rgba(239,68,68,0.2);color:#f87171;border:1px solid rgba(239,68,68,0.25);}

/* HELP CARD */
.help-item{display:flex;gap:0.625rem;align-items:flex-start;padding:0.625rem 0;border-bottom:1px solid var(--border);}
.help-item:last-child{border-bottom:none;padding-bottom:0;}
.help-item-icon{
    width:24px;height:24px;border-radius:5px;flex-shrink:0;
    background:var(--accent-dim);display:flex;align-items:center;
    justify-content:center;font-size:0.7rem;margin-top:1px;
}
.help-item-text{font-size:0.775rem;color:var(--text-muted);line-height:1.55;}
.help-item-text strong{color:var(--text-sub);display:block;margin-bottom:1px;}

/* ════════════════════════════════
   TOAST
════════════════════════════════ */
.toast-wrap{
    position:fixed;bottom:1.375rem;right:1.375rem;
    display:flex;flex-direction:column;gap:0.5rem;z-index:9999;
    pointer-events:none;
}
.toast{
    display:flex;align-items:center;gap:0.6rem;
    padding:0.75rem 1rem;
    background:var(--surface);border:1px solid var(--border);
    border-radius:10px;font-size:0.825rem;color:var(--text);
    box-shadow:0 8px 32px rgba(0,0,0,0.5);
    animation:t-in 0.28s cubic-bezier(0.16,1,0.3,1) both;
    max-width:300px;pointer-events:auto;
}
.toast.out{animation:t-out 0.22s ease both;}
@keyframes t-in{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:none}}
@keyframes t-out{to{opacity:0;transform:translateX(14px)}}
.toast-icon{
    width:22px;height:22px;border-radius:5px;flex-shrink:0;
    display:flex;align-items:center;justify-content:center;font-size:0.7rem;
}
.toast.success .toast-icon{background:rgba(34,197,94,0.15);color:var(--green);}
.toast.error   .toast-icon{background:rgba(239,68,68,0.12);color:var(--red);}

/* ════════════════════════════════
   MODALS
════════════════════════════════ */
.modal-bg{
    display:none;position:fixed;inset:0;
    background:rgba(0,0,0,0.65);z-index:200;
    align-items:center;justify-content:center;
    backdrop-filter:blur(4px);
}
.modal-bg.show{display:flex;}
.modal-box{
    background:var(--surface);border:1px solid var(--border);
    border-radius:var(--radius-lg);padding:1.625rem;
    max-width:400px;width:90%;
    box-shadow:0 24px 64px rgba(0,0,0,0.7);
    animation:m-in 0.2s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes m-in{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:none}}
.modal-box h3{font-size:0.95rem;font-weight:600;color:var(--text);margin-bottom:0.5rem;}
.modal-box p{font-size:0.825rem;color:var(--text-muted);margin-bottom:1.25rem;line-height:1.6;}
.modal-actions{display:flex;gap:0.625rem;justify-content:flex-end;}
.btn-cancel{
    padding:0.55rem 1rem;border:1px solid var(--border);border-radius:8px;
    background:none;color:var(--text-muted);font-family:inherit;font-size:0.825rem;cursor:pointer;
    transition:all 0.15s;
}
.btn-cancel:hover{background:rgba(255,255,255,0.05);color:var(--text);}
.btn-del-ok{
    padding:0.55rem 1rem;border-radius:8px;border:none;
    background:rgba(239,68,68,0.15);color:#f87171;
    font-family:inherit;font-size:0.825rem;font-weight:600;cursor:pointer;
    transition:all 0.15s;
}
.btn-del-ok:hover{background:rgba(239,68,68,0.25);}
.picker-grid{
    display:grid;grid-template-columns:repeat(4,1fr);gap:0.4rem;
    max-height:260px;overflow-y:auto;margin-bottom:1rem;
    scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.1) transparent;
}
.picker-item{
    aspect-ratio:1;border-radius:7px;overflow:hidden;
    border:2px solid transparent;cursor:pointer;transition:all 0.15s;
    background:var(--surface-h);
}
.picker-item:hover{border-color:var(--accent);}
.picker-item img{width:100%;height:100%;object-fit:cover;display:block;}

/* ── Scrollbars ── */
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:3px;}
::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.18);}
</style>
</head>
<body>
<div class="app">

<!-- ════ SIDEBAR ════ -->
<aside class="sidebar">
    <div class="sidebar-brand">
        <div class="brand-logo">ON</div>
        <div class="brand-text">
            <span class="brand-name"><em>ON</em> Coaching</span>
            <span class="brand-sub">Administration</span>
        </div>
    </div>

    <div class="nav-section">
        <span class="nav-label">Pages du site</span>
        <?php
        $navIcons = [
            'index'                  => '&#8962;',
            'about'                  => '&#9786;',
            'coaching-scolaire'      => '&#127891;',
            'coaching-jeunes'        => '&#127807;',
            'coaching-equipe'        => '&#128101;',
            'coaching-neurofeedback' => '&#9729;',
            'nos-tarifs'             => '&#9745;',
            'contact'                => '&#9993;',
        ];
        foreach ($pages as $key => $info):
            $stat = $pageStats[$key];
            $hasFile = $stat['exists'];
        ?>
        <a href="?page=<?= $key ?>" class="nav-item <?= $current === $key ? 'active' : '' ?>">
            <span class="nav-icon"><?= $navIcons[$key] ?? '&#9656;' ?></span>
            <span class="nav-label-text"><?= htmlspecialchars($info['label']) ?></span>
            <?php if ($hasFile && $stat['modified']): ?>
            <span class="nav-badge"><?= date('d/m', $stat['modified']) ?></span>
            <?php endif ?>
        </a>
        <?php endforeach; ?>
    </div>

    <div class="sidebar-footer">
        <div class="user-pill">
            <div class="avatar"><?= strtoupper(substr($_SESSION['admin_user'], 0, 1)) ?></div>
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
            <div class="topbar-crumb">
                Admin
                <div class="topbar-dot"></div>
                <span><?= htmlspecialchars($pageLabel) ?></span>
            </div>
        </div>
        <div class="topbar-right">
            <span class="unsaved-pill" id="unsavedBadge">
                <span class="unsaved-dot"></span>
                Non sauvegardé
            </span>
            <button class="btn-save" id="saveBtn" onclick="saveAll()">
                <div class="spinner"></div>
                <span class="btn-label">Enregistrer</span>
            </button>
        </div>
    </header>

    <!-- CONTENT -->
    <div class="content">
        <div class="editor-col">

<?php
// ════════════════════════════════════════════════
// FORMULAIRES PAR PAGE
// ════════════════════════════════════════════════
switch ($current) {

// ── ACCUEIL ──────────────────────────────────────
case 'index': $d = $pageData; ?>

<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-val stat-accent"><?= count($pages) ?></div>
        <div class="stat-label">Pages gérées</div>
    </div>
    <div class="stat-card">
        <div class="stat-val"><?= count($images) ?></div>
        <div class="stat-label">Images uploadées</div>
    </div>
    <div class="stat-card">
        <?php if ($lastModifiedPage): ?>
        <div class="stat-val" style="font-size:1rem"><?= date('d/m/Y', $lastModifiedTime) ?></div>
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
            <div class="card-head-icon">&#8962;</div>
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
            <div class="img-preview"><?php $i = get($d, 'hero.image'); echo $i ? '<img src="/'.$i.'" alt="">' : '&#128444;'; ?></div>
        </div>
    </div>
</div>

<div class="card">
    <?php sectionTitle("Section nos services", "&#128193;") ?>
    <div class="card-body">
        <?php field("Titre", "servicesSection.title", get($d, 'servicesSection.title')) ?>
        <?php field("Description", "servicesSection.subtitle", get($d, 'servicesSection.subtitle'), 'textarea') ?>
    </div>
    <?php foreach (get($d, 'services', []) as $i => $s): ?>
    <?php sectionTitle("Service " . ($i + 1) . " — " . ($s['title'] ?? ''), "&#8594;") ?>
    <div class="card-body">
        <?php field("Titre", "services.$i.title", $s['title'] ?? '') ?>
        <?php field("Description", "services.$i.description", $s['description'] ?? '', 'textarea') ?>
    </div>
    <?php endforeach ?>
</div>

<div class="card">
    <?php sectionTitle("Pourquoi nous choisir ?", "&#10022;") ?>
    <div class="card-body">
        <?php field("Titre", "whyUsSection.title", get($d, 'whyUsSection.title')) ?>
        <?php field("Description", "whyUsSection.subtitle", get($d, 'whyUsSection.subtitle'), 'textarea') ?>
    </div>
    <?php foreach (get($d, 'whyUsSection.items', []) as $i => $item): ?>
    <?php sectionTitle("Argument " . ($i + 1), "&#10003;") ?>
    <div class="card-body">
        <?php field("Titre", "whyUsSection.items.$i.title", $item['title'] ?? '') ?>
        <?php field("Description", "whyUsSection.items.$i.description", $item['description'] ?? '', 'textarea') ?>
    </div>
    <?php endforeach ?>
</div>

<div class="card">
    <?php sectionTitle("Appel à l'action (bas de page)", "&#128227;") ?>
    <div class="card-body">
        <?php field("Titre", "cta.title", get($d, 'cta.title')) ?>
        <?php field("Sous-titre", "cta.subtitle", get($d, 'cta.subtitle'), 'textarea') ?>
        <?php field("Texte du bouton", "cta.buttonText", get($d, 'cta.buttonText')) ?>
    </div>
</div>

<?php break;

// ── À PROPOS ─────────────────────────────────────
case 'about': $d = $pageData; ?>

<div class="card">
    <div class="card-head">
        <div class="card-head-left">
            <div class="card-head-icon">&#9786;</div>
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
            <div class="img-preview"><?php $i = get($d, 'hero.image'); echo $i ? '<img src="/'.$i.'" alt="">' : '&#128444;'; ?></div>
        </div>
    </div>
</div>

<div class="card">
    <?php sectionTitle("Qui suis-je ?", "&#128100;") ?>
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
    <?php sectionTitle("Nos valeurs", "&#10022;") ?>
    <div class="card-body">
        <?php field("Titre de section", "valuesSection.title", get($d, 'valuesSection.title')) ?>
        <?php field("Description", "valuesSection.subtitle", get($d, 'valuesSection.subtitle'), 'textarea') ?>
    </div>
    <?php foreach (get($d, 'valuesSection.values', []) as $i => $v): ?>
    <?php sectionTitle("Valeur " . ($i + 1) . " — " . ($v['title'] ?? ''), "&#10022;") ?>
    <div class="card-body">
        <?php field("Titre", "valuesSection.values.$i.title", $v['title'] ?? '') ?>
        <?php field("Description", "valuesSection.values.$i.description", $v['description'] ?? '', 'textarea') ?>
    </div>
    <?php endforeach ?>
</div>

<div class="card">
    <?php sectionTitle("Appel à l'action (bas de page)", "&#128227;") ?>
    <div class="card-body">
        <?php field("Titre", "cta.title", get($d, 'cta.title')) ?>
        <?php field("Sous-titre", "cta.subtitle", get($d, 'cta.subtitle'), 'textarea') ?>
        <?php field("Texte du bouton", "cta.buttonText", get($d, 'cta.buttonText')) ?>
    </div>
</div>

<?php break;

// ── PAGES COACHING AVEC ONGLETS ───────────────────
case 'coaching-scolaire':
case 'coaching-jeunes':
case 'coaching-equipe':
case 'coaching-neurofeedback':
    $d = $pageData;
    $tabs = get($d, 'tabs', []);
    $pageIcons = [
        'coaching-scolaire'      => '&#127891;',
        'coaching-jeunes'        => '&#127807;',
        'coaching-equipe'        => '&#128101;',
        'coaching-neurofeedback' => '&#9729;',
    ];
    $pIcon = $pageIcons[$current] ?? '&#9656;';
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
            <div class="card-head-icon">&#128193;</div>
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
    <?php sectionTitle("Appel à l'action (bas de page)", "&#128227;") ?>
    <div class="card-body">
        <?php field("Titre", "cta.title", get($d, 'cta.title')) ?>
        <?php field("Sous-titre", "cta.subtitle", get($d, 'cta.subtitle'), 'textarea') ?>
        <?php field("Texte du bouton", "cta.buttonText", get($d, 'cta.buttonText')) ?>
    </div>
</div>

<?php break;

// ── TARIFS ───────────────────────────────────────
case 'nos-tarifs': $d = $pageData; ?>

<div class="card">
    <div class="card-head">
        <div class="card-head-left">
            <div class="card-head-icon">&#9745;</div>
            <h3>Coaching particuliers</h3>
        </div>
    </div>
    <div class="card-body">
        <?php field("Titre", "particuliers.title", get($d, 'particuliers.title')) ?>
        <?php field("Sous-titre", "particuliers.subtitle", get($d, 'particuliers.subtitle')) ?>
    </div>
    <?php foreach (get($d, 'particuliers.cards', []) as $i => $c): ?>
    <?php sectionTitle($c['title'] ?? 'Carte ' . ($i + 1), "&#8594;") ?>
    <div class="card-body">
        <?php field("Titre", "particuliers.cards.$i.title", $c['title'] ?? '') ?>
        <?php fieldList("Tarifs", "particuliers.cards.$i.items", $c['items'] ?? []) ?>
    </div>
    <?php endforeach ?>
</div>

<div class="card">
    <?php sectionTitle("Coaching entreprises", "&#127970;") ?>
    <div class="card-body">
        <?php field("Titre", "entreprises.title", get($d, 'entreprises.title')) ?>
        <?php field("Sous-titre", "entreprises.subtitle", get($d, 'entreprises.subtitle')) ?>
        <?php fieldList("Tarifs", "entreprises.items", get($d, 'entreprises.items', [])) ?>
    </div>
</div>

<div class="card">
    <?php sectionTitle("Neurofeedback", "&#9729;") ?>
    <div class="card-body">
        <?php field("Titre", "neurofeedback.title", get($d, 'neurofeedback.title')) ?>
        <?php field("Sous-titre", "neurofeedback.subtitle", get($d, 'neurofeedback.subtitle')) ?>
    </div>
    <?php foreach (get($d, 'neurofeedback.cards', []) as $i => $c): ?>
    <?php sectionTitle($c['title'] ?? 'Carte ' . ($i + 1), "&#8594;") ?>
    <div class="card-body">
        <?php field("Titre", "neurofeedback.cards.$i.title", $c['title'] ?? '') ?>
        <?php if (!empty($c['items'])): fieldList("Tarifs", "neurofeedback.cards.$i.items", $c['items']); endif ?>
        <?php if (!empty($c['description'])): field("Description", "neurofeedback.cards.$i.description", $c['description'] ?? '', 'textarea'); field("Note", "neurofeedback.cards.$i.note", $c['note'] ?? ''); endif ?>
    </div>
    <?php endforeach ?>
</div>

<div class="card">
    <?php sectionTitle("Appel à l'action (bas de page)", "&#128227;") ?>
    <div class="card-body">
        <?php field("Titre", "cta.title", get($d, 'cta.title')) ?>
        <?php field("Sous-titre", "cta.subtitle", get($d, 'cta.subtitle'), 'textarea') ?>
        <?php field("Texte du bouton", "cta.buttonText", get($d, 'cta.buttonText')) ?>
    </div>
</div>

<?php break;

// ── CONTACT ──────────────────────────────────────
case 'contact': $d = $pageData; ?>

<div class="card">
    <div class="card-head">
        <div class="card-head-left">
            <div class="card-head-icon">&#9993;</div>
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
    <?php sectionTitle("Horaires d'ouverture", "&#128336;") ?>
    <div class="card-body">
        <?php fieldList("Horaires (une ligne par jour)", "coordonnees.horaires.lines", get($d, 'coordonnees.horaires.lines', [])) ?>
    </div>
</div>

<div class="card">
    <?php sectionTitle("Formulaire de contact", "&#9993;") ?>
    <div class="card-body">
        <?php field("Titre", "formulaire.title", get($d, 'formulaire.title')) ?>
        <?php field("Sous-titre", "formulaire.subtitle", get($d, 'formulaire.subtitle')) ?>
        <?php field("Texte du bouton Envoyer", "formulaire.fields.submitButton", get($d, 'formulaire.fields.submitButton')) ?>
        <?php field("Message de succès — titre", "formulaire.messages.successTitle", get($d, 'formulaire.messages.successTitle')) ?>
        <?php field("Message de succès — description", "formulaire.messages.successDescription", get($d, 'formulaire.messages.successDescription')) ?>
    </div>
</div>

<div class="card">
    <?php sectionTitle("Options du menu 'Service'", "&#128203;") ?>
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
                        <div class="card-head-icon">&#128444;</div>
                        <h3>Médiathèque</h3>
                    </div>
                    <span class="badge"><?= count($images) ?></span>
                </div>
                <div class="card-body">
                    <div class="upload-zone" id="uploadZone" onclick="document.getElementById('fileInput').click()">
                        <span class="uz-icon">&#128229;</span>
                        <strong>Glissez une image ici</strong>
                        <p>ou cliquez &middot; JPG, PNG, WebP &middot; Max 5 Mo</p>
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
                        <div class="card-head-icon">&#128161;</div>
                        <h3>Comment modifier ?</h3>
                    </div>
                </div>
                <div class="card-body">
                    <div class="help-item">
                        <div class="help-item-icon">&#9998;</div>
                        <div class="help-item-text">
                            <strong>Modifier un texte</strong>
                            Cliquez sur le champ et tapez directement.
                        </div>
                    </div>
                    <div class="help-item">
                        <div class="help-item-icon">&#128444;</div>
                        <div class="help-item-text">
                            <strong>Changer une image</strong>
                            Uploadez dans la médiathèque, puis cliquez sur "Choisir".
                        </div>
                    </div>
                    <div class="help-item">
                        <div class="help-item-icon">&#43;</div>
                        <div class="help-item-text">
                            <strong>Listes</strong>
                            Cliquez sur "+ Ajouter un élément" pour en créer un nouveau.
                        </div>
                    </div>
                    <div class="help-item">
                        <div class="help-item-icon">&#8679;</div>
                        <div class="help-item-text">
                            <strong>Sauvegarder</strong>
                            Bouton "Enregistrer" en haut ou <kbd style="font-size:0.7rem;padding:1px 5px;border-radius:4px;border:1px solid var(--border);background:rgba(255,255,255,0.05);">Ctrl+S</kbd>
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

// Détecter les changements
document.querySelectorAll('[data-path]').forEach(el => el.addEventListener('input', markChanged));

function markChanged() {
    if (!hasChanges) {
        hasChanges = true;
        document.getElementById('unsavedBadge').classList.add('show');
    }
}

// Onglets
function showTab(idx, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab_' + idx)?.classList.add('active');
    btn.classList.add('active');
}

// Collecter tous les champs → objet imbriqué
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

// Sauvegarder
function saveAll() {
    const btn = document.getElementById('saveBtn');
    btn.classList.add('loading'); btn.disabled = true;

    const body = new FormData();
    body.append('action',      'save_fields');
    body.append('csrf_token',  CSRF);
    body.append('target_page', CURRENT_PAGE);
    body.append('fields',      JSON.stringify(collectFields()));

    fetch('dashboard.php?page=' + CURRENT_PAGE, { method: 'POST', body })
        .then(r => r.json())
        .then(data => {
            showToast(data.msg, data.ok ? 'success' : 'error');
            if (data.ok) {
                hasChanges = false;
                document.getElementById('unsavedBadge').classList.remove('show');
            }
        })
        .catch(() => showToast('Erreur réseau', 'error'))
        .finally(() => { btn.classList.remove('loading'); btn.disabled = false; });
}

// Listes
function addItem(listId) {
    const list = document.getElementById('list_' + listId);
    const div  = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `<span class="drag-handle" title="Réordonner">&#8942;</span><input type="text" placeholder="Nouveau texte…"><button type="button" class="btn-remove-item" onclick="removeItem(this)" title="Supprimer">&#10005;</button>`;
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
    body.append('action',     'upload_image');
    body.append('csrf_token', CSRF);
    body.append('file',       file);
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

// Supprimer image
function askDel(filename, event) {
    event?.stopPropagation();
    pendingDelFile = filename;
    document.getElementById('delModal').classList.add('show');
    document.getElementById('confirmDel').onclick = doDelete;
}
function doDelete() {
    const body = new FormData();
    body.append('action',     'delete_image');
    body.append('csrf_token', CSRF);
    body.append('filename',   pendingDelFile);
    fetch('dashboard.php?page=' + CURRENT_PAGE, { method: 'POST', body })
        .then(r => r.json())
        .then(data => {
            if (data.ok) {
                document.querySelectorAll(`[data-file="${pendingDelFile}"]`).forEach(e => e.remove());
                showToast('Image supprimée', 'success');
            } else {
                showToast(data.msg || 'Erreur', 'error');
            }
        });
    closeModal('delModal');
}

// Picker image
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
    pendingDelFile = null;
    pickerTarget   = null;
}
document.querySelectorAll('.modal-bg').forEach(m =>
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('show'); })
);

// Toast
function showToast(msg, type = 'success') {
    const icons = { success: '&#10003;', error: '&#10005;' };
    const wrap = document.getElementById('toastWrap');
    const el   = document.createElement('div');
    el.className = 'toast ' + type;
    el.innerHTML = `<span class="toast-icon">${icons[type] || icons.success}</span><span>${msg}</span>`;
    wrap.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 260); }, 3200);
}

// Drag & drop upload
const zone = document.getElementById('uploadZone');
zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('drag'); });
zone.addEventListener('dragleave', ()  => zone.classList.remove('drag'));
zone.addEventListener('drop',      e  => { e.preventDefault(); zone.classList.remove('drag'); uploadImage(e.dataTransfer.files[0]); });

// Ctrl+S / Cmd+S
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveAll(); }
});

// Avertir si on quitte sans sauvegarder
window.addEventListener('beforeunload', e => {
    if (hasChanges) { e.preventDefault(); e.returnValue = ''; }
});
</script>
</body>
</html>
