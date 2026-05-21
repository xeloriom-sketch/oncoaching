<?php
require_once 'config.php';

// Déjà connecté → dashboard
if (isLoggedIn()) {
    header('Location: dashboard.php');
    exit();
}

$ip    = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$error = '';
$lockoutRemaining = 0;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrf($_POST['csrf_token'] ?? '')) {
        $error = 'Token de sécurité invalide. Rechargez la page.';
    } elseif (isLockedOut($ip)) {
        $data = getLoginAttempts($ip);
        $lockoutRemaining = LOCKOUT_DURATION - (time() - $data['last']);
        $error = "Trop de tentatives. Réessayez dans " . ceil($lockoutRemaining / 60) . " min.";
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
            $attempts = getLoginAttempts($ip);
            $remaining = MAX_LOGIN_ATTEMPTS - $attempts['count'];
            logEvent('LOGIN_FAILED', "user=$username");
            if ($remaining > 0) {
                $error = "Identifiants incorrects. Il vous reste $remaining tentative(s).";
            } else {
                $error = "Compte verrouillé pour " . ceil(LOCKOUT_DURATION / 60) . " minutes.";
            }
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
    <title>ON Coaching — Admin</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
            --bg:        #0a0a0f;
            --surface:   #111118;
            --border:    rgba(255,255,255,0.07);
            --border-h:  rgba(255,255,255,0.15);
            --accent:    #6c8cff;
            --accent2:   #a78bfa;
            --text:      #e8e8f0;
            --muted:     #7070a0;
            --error:     #ff6b6b;
            --success:   #4ade80;
        }

        html, body {
            height: 100%;
            background: var(--bg);
            color: var(--text);
            font-family: 'DM Sans', sans-serif;
            font-weight: 300;
        }

        /* Background mesh */
        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background:
                radial-gradient(ellipse 60% 50% at 20% 20%, rgba(108,140,255,0.08) 0%, transparent 60%),
                radial-gradient(ellipse 50% 40% at 80% 80%, rgba(167,139,250,0.06) 0%, transparent 60%);
            pointer-events: none;
            z-index: 0;
        }

        .login-wrap {
            position: relative;
            z-index: 1;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }

        .login-card {
            width: 100%;
            max-width: 420px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 3rem 2.5rem;
            box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03);
            animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        .login-logo {
            text-align: center;
            margin-bottom: 2.5rem;
        }

        .login-logo .brand {
            font-family: 'Instrument Serif', serif;
            font-size: 2rem;
            color: var(--text);
            letter-spacing: -0.02em;
        }

        .login-logo .brand span {
            background: linear-gradient(135deg, var(--accent), var(--accent2));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .login-logo .sub {
            font-size: 0.8rem;
            color: var(--muted);
            letter-spacing: 0.15em;
            text-transform: uppercase;
            margin-top: 0.25rem;
        }

        .divider {
            height: 1px;
            background: var(--border);
            margin-bottom: 2rem;
        }

        .field {
            margin-bottom: 1.25rem;
        }

        .field label {
            display: block;
            font-size: 0.78rem;
            color: var(--muted);
            letter-spacing: 0.1em;
            text-transform: uppercase;
            font-weight: 500;
            margin-bottom: 0.5rem;
        }

        .field-inner {
            position: relative;
        }

        .field-inner svg {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            width: 16px;
            height: 16px;
            color: var(--muted);
            pointer-events: none;
        }

        .field input {
            width: 100%;
            background: rgba(255,255,255,0.04);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 0.85rem 1rem 0.85rem 2.75rem;
            color: var(--text);
            font-family: 'DM Sans', sans-serif;
            font-size: 0.95rem;
            font-weight: 400;
            transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
            outline: none;
        }

        .field input:focus {
            border-color: var(--accent);
            background: rgba(108,140,255,0.06);
            box-shadow: 0 0 0 3px rgba(108,140,255,0.12);
        }

        .field input::placeholder { color: rgba(255,255,255,0.2); }

        .toggle-pass {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--muted);
            cursor: pointer;
            padding: 0;
            line-height: 1;
            transition: color 0.2s;
        }
        .toggle-pass:hover { color: var(--text); }

        .alert {
            padding: 0.85rem 1rem;
            border-radius: 10px;
            font-size: 0.87rem;
            margin-bottom: 1.25rem;
            display: flex;
            align-items: center;
            gap: 0.6rem;
            animation: shake 0.4s ease;
        }

        @keyframes shake {
            0%,100% { transform: translateX(0); }
            20%,60%  { transform: translateX(-4px); }
            40%,80%  { transform: translateX(4px); }
        }

        .alert-error {
            background: rgba(255,107,107,0.1);
            border: 1px solid rgba(255,107,107,0.25);
            color: var(--error);
        }

        .btn-login {
            width: 100%;
            padding: 0.95rem;
            background: linear-gradient(135deg, var(--accent), var(--accent2));
            border: none;
            border-radius: 10px;
            color: #fff;
            font-family: 'DM Sans', sans-serif;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
            margin-top: 0.5rem;
            letter-spacing: 0.02em;
            box-shadow: 0 4px 20px rgba(108,140,255,0.3);
        }

        .btn-login:hover {
            opacity: 0.92;
            transform: translateY(-1px);
            box-shadow: 0 8px 30px rgba(108,140,255,0.4);
        }

        .btn-login:active { transform: translateY(0); }

        .btn-login:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .security-note {
            text-align: center;
            margin-top: 1.75rem;
            font-size: 0.75rem;
            color: var(--muted);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
        }
    </style>
</head>
<body>
<div class="login-wrap">
    <div class="login-card">
        <div class="login-logo">
            <div class="brand"><span>ON</span> Coaching</div>
            <div class="sub">Espace administration</div>
        </div>
        <div class="divider"></div>

        <?php if ($error): ?>
        <div class="alert alert-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <?= htmlspecialchars($error) ?>
        </div>
        <?php endif; ?>

        <form method="POST" autocomplete="off" id="loginForm">
            <input type="hidden" name="csrf_token" value="<?= $csrf ?>">

            <div class="field">
                <label>Identifiant</label>
                <div class="field-inner">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <input type="text" name="username" placeholder="admin" required
                           value="<?= htmlspecialchars($_POST['username'] ?? '') ?>"
                           <?= isLockedOut($ip) ? 'disabled' : '' ?>>
                </div>
            </div>

            <div class="field">
                <label>Mot de passe</label>
                <div class="field-inner">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <input type="password" name="password" id="passwordInput" placeholder="••••••••" required
                           <?= isLockedOut($ip) ? 'disabled' : '' ?>>
                    <button type="button" class="toggle-pass" onclick="togglePass()" tabindex="-1">
                        <svg id="eyeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                </div>
            </div>

            <button type="submit" class="btn-login" <?= isLockedOut($ip) ? 'disabled' : '' ?>>
                Se connecter
            </button>
        </form>

        <div class="security-note">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Connexion sécurisée · Session 1h
        </div>
    </div>
</div>

<script>
function togglePass() {
    const input = document.getElementById('passwordInput');
    const icon = document.getElementById('eyeIcon');
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
