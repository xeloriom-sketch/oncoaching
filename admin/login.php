<?php
require_once 'config.php';

if (isLoggedIn()) {
    header('Location: dashboard.php');
    exit();
}

$ip    = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrf($_POST['csrf_token'] ?? '')) {
        $error = 'Token de sécurité invalide. Rechargez la page.';
    } elseif (isLockedOut($ip)) {
        $data = getLoginAttempts($ip);
        $rem  = ceil((LOCKOUT_DURATION - (time() - $data['last'])) / 60);
        $error = "Trop de tentatives. Réessayez dans {$rem} min.";
    } else {
        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';
        if ($username === ADMIN_USERNAME && password_verify($password, ADMIN_PASSWORD_HASH)) {
            clearAttempts($ip);
            session_regenerate_id(true);
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_user']      = $username;
            $_SESSION['last_activity']   = time();
            $_SESSION['created_at']      = time();
            logEvent('LOGIN_SUCCESS', "user=$username");
            header('Location: dashboard.php');
            exit();
        } else {
            recordFailedAttempt($ip);
            $attempts  = getLoginAttempts($ip);
            $remaining = MAX_LOGIN_ATTEMPTS - $attempts['count'];
            logEvent('LOGIN_FAILED', "user=$username");
            $error = $remaining > 0
                ? "Identifiants incorrects. Il vous reste $remaining tentative(s)."
                : "Compte verrouillé pour " . ceil(LOCKOUT_DURATION / 60) . " minutes.";
        }
    }
}

$csrf = csrfToken();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ON Coaching — Connexion</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:       #0b0b0c;
  --panel:    #111113;
  --border:   rgba(255,255,255,0.07);
  --accent:   #1ab5c7;
  --accent2:  #0e8a99;
  --text:     #e8e8ec;
  --muted:    #6b6b78;
  --sub:      #9999a8;
  --error-bg: rgba(239,68,68,0.08);
  --error:    #ef4444;
}

html, body {
  height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', system-ui, sans-serif;
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
}

/* ── Layout split ── */
.split {
  display: flex;
  min-height: 100vh;
}

/* ── Panneau gauche ── */
.panel-left {
  flex: 0 0 52%;
  position: relative;
  overflow: hidden;
  display: none;
}

@media (min-width: 900px) { .panel-left { display: flex; flex-direction: column; } }

.panel-left-bg {
  position: absolute;
  inset: 0;
  background: #0b0b0c;
  overflow: hidden;
}

/* Grille de fond */
.panel-left-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(26,181,199,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(26,181,199,0.04) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
}

/* Lueurs */
.panel-left-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 55% at 30% 25%, rgba(26,181,199,0.13) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 75% 80%, rgba(14,138,153,0.08) 0%, transparent 55%);
  pointer-events: none;
}

.panel-left-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3rem 3.5rem;
  height: 100%;
}

.left-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.left-logo-mark {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Instrument Serif', serif;
  font-size: 1rem;
  color: #fff;
  box-shadow: 0 0 24px rgba(26,181,199,0.3);
}

.left-logo-name {
  font-family: 'Instrument Serif', serif;
  font-size: 1.15rem;
  color: var(--text);
  letter-spacing: -0.01em;
}
.left-logo-name span { color: var(--accent); }

.left-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 0;
  max-width: 400px;
}

.left-eyebrow {
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.left-eyebrow::before {
  content: '';
  display: block;
  width: 20px;
  height: 1px;
  background: var(--accent);
  opacity: 0.6;
}

.left-headline {
  font-family: 'Instrument Serif', serif;
  font-size: clamp(2rem, 3vw, 2.75rem);
  line-height: 1.15;
  color: var(--text);
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
}
.left-headline em {
  font-style: italic;
  color: var(--accent);
}

.left-quote {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--sub);
  font-weight: 300;
  border-left: 2px solid rgba(26,181,199,0.3);
  padding-left: 1rem;
  margin-bottom: 2.5rem;
}

.left-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.left-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  border: 1px solid rgba(26,181,199,0.18);
  border-radius: 20px;
  font-size: 0.72rem;
  color: var(--sub);
  background: rgba(26,181,199,0.04);
}
.left-pill svg { color: var(--accent); flex-shrink: 0; }

.left-footer {
  font-size: 0.7rem;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.left-footer::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.6;
  display: block;
}

/* ── Panneau droit ── */
.panel-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  position: relative;
  background: var(--panel);
  border-left: 1px solid var(--border);
}

/* Logo mobile (visible seulement < 900px) */
.mobile-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem;
}

@media (min-width: 900px) { .mobile-logo { display: none; } }

.mobile-logo .mark {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Instrument Serif', serif;
  font-size: 1.2rem;
  color: #fff;
  margin-bottom: 0.75rem;
  box-shadow: 0 0 28px rgba(26,181,199,0.25);
}

.mobile-logo .name {
  font-family: 'Instrument Serif', serif;
  font-size: 1.4rem;
  color: var(--text);
}
.mobile-logo .name span { color: var(--accent); }

.mobile-logo .sub {
  font-size: 0.72rem;
  color: var(--muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-top: 0.2rem;
}

/* Formulaire */
.form-box {
  width: 100%;
  max-width: 380px;
  animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.form-title {
  font-size: 1.45rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.02em;
  margin-bottom: 0.35rem;
}

.form-sub {
  font-size: 0.83rem;
  color: var(--muted);
  margin-bottom: 2rem;
}

/* Alerte */
.alert {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  font-size: 0.83rem;
  margin-bottom: 1.5rem;
  animation: shake 0.4s ease;
  background: var(--error-bg);
  border: 1px solid rgba(239,68,68,0.2);
  color: var(--error);
}

.alert svg { flex-shrink: 0; margin-top: 1px; }

@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%,60%  { transform: translateX(-4px); }
  40%,80%  { transform: translateX(4px); }
}

/* Champ */
.field { margin-bottom: 1.125rem; }

.field label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--sub);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 0.45rem;
}

.field-inner { position: relative; }

.field-inner svg.icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 15px;
  color: var(--muted);
  pointer-events: none;
  transition: color 0.18s;
}

.field-inner input {
  width: 100%;
  padding: 0.8rem 0.875rem 0.8rem 2.6rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  outline: none;
  transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
}

.field-inner input:focus {
  border-color: var(--accent);
  background: rgba(26,181,199,0.05);
  box-shadow: 0 0 0 3px rgba(26,181,199,0.1);
}

.field-inner input:focus ~ .icon,
.field-inner:focus-within svg.icon { color: var(--accent); }

.field-inner input::placeholder { color: rgba(255,255,255,0.18); }

.toggle-pass {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 5px;
  line-height: 1;
  transition: color 0.15s;
}
.toggle-pass:hover { color: var(--text); }

/* Bouton */
.btn-submit {
  width: 100%;
  padding: 0.9rem;
  margin-top: 0.5rem;
  background: var(--accent);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.01em;
  box-shadow: 0 4px 20px rgba(26,181,199,0.28);
  transition: opacity 0.18s, transform 0.15s, box-shadow 0.18s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-submit:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(26,181,199,0.38);
}

.btn-submit:active { transform: translateY(0); }
.btn-submit:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }

/* Footer note */
.form-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 1.75rem;
  font-size: 0.72rem;
  color: var(--muted);
}

.form-note svg { flex-shrink: 0; }

/* Séparateur */
.divider {
  width: 100%;
  height: 1px;
  background: var(--border);
  margin: 1.5rem 0;
}
</style>
</head>
<body>
<div class="split">

  <!-- ── Panneau gauche ── -->
  <div class="panel-left">
    <div class="panel-left-bg"></div>
    <div class="panel-left-inner">

      <div class="left-logo">
        <div class="left-logo-mark">ON</div>
        <span class="left-logo-name"><span>ON</span> Coaching</span>
      </div>

      <div class="left-main">
        <div class="left-eyebrow">Espace Administration</div>
        <h1 class="left-headline">Gérez votre<br><em>contenu</em><br>en toute sérénité.</h1>
        <p class="left-quote">
          Modifiez les textes, images et informations de votre site directement depuis ce tableau de bord sécurisé.
        </p>
        <div class="left-pills">
          <span class="left-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Session sécurisée 1h
          </span>
          <span class="left-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            8 pages éditables
          </span>
          <span class="left-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
            Upload d'images
          </span>
          <span class="left-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
            Statistiques en temps réel
          </span>
        </div>
      </div>

      <div class="left-footer">
        ON Coaching — Coach Certifié ICF · Mâcon, Sancé (71)
      </div>

    </div>
  </div>

  <!-- ── Panneau droit ── -->
  <div class="panel-right">
    <div class="form-box">

      <div class="mobile-logo">
        <div class="mark">ON</div>
        <div class="name"><span>ON</span> Coaching</div>
        <div class="sub">Administration</div>
      </div>

      <h2 class="form-title">Connexion</h2>
      <p class="form-sub">Accédez à votre tableau de bord.</p>

      <?php if ($error): ?>
      <div class="alert">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>
        <?= htmlspecialchars($error) ?>
      </div>
      <?php endif; ?>

      <form method="POST" autocomplete="off" id="loginForm">
        <input type="hidden" name="csrf_token" value="<?= $csrf ?>">

        <div class="field">
          <label for="username">Identifiant</label>
          <div class="field-inner">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Identifiant"
              required
              autocomplete="username"
              value="<?= htmlspecialchars($_POST['username'] ?? '') ?>"
              <?= isLockedOut($ip) ? 'disabled' : '' ?>
            >
          </div>
        </div>

        <div class="field">
          <label for="passwordInput">Mot de passe</label>
          <div class="field-inner">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input
              type="password"
              id="passwordInput"
              name="password"
              placeholder="••••••••"
              required
              autocomplete="current-password"
              <?= isLockedOut($ip) ? 'disabled' : '' ?>
            >
            <button type="button" class="toggle-pass" onclick="togglePass()" tabindex="-1" aria-label="Afficher/masquer">
              <svg id="eyeIcon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>

        <button type="submit" class="btn-submit" <?= isLockedOut($ip) ? 'disabled' : '' ?>>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
          Se connecter
        </button>
      </form>

      <div class="divider"></div>

      <div class="form-note">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Connexion chiffrée · Session 1 heure · 5 tentatives max
      </div>

    </div>
  </div>

</div>

<script>
function togglePass() {
  const input = document.getElementById('passwordInput');
  const icon  = document.getElementById('eyeIcon');
  if (input.type === 'password') {
    input.type = 'text';
    icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
  } else {
    input.type = 'password';
    icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
  }
}
</script>
</body>
</html>
