<?php
/**
 * setup.php — Script d'initialisation (À SUPPRIMER APRÈS USAGE)
 *
 * Accédez à ce fichier UNE SEULE FOIS dans votre navigateur pour
 * générer votre hash bcrypt, puis supprimez ce fichier immédiatement.
 *
 * URL : https://votre-site.fr/admin/setup.php
 */

// ⚠️ CHANGEZ CE MOT DE PASSE AVANT DE LANCER LE SCRIPT
$password = 'VotreMotDePasseIci2025!';

$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Setup — ON Coaching Admin</title>
<style>
    body { font-family: monospace; background:#0a0a10; color:#e2e2f0; padding:2rem; }
    .box { background:#111; border:1px solid #333; border-radius:10px; padding:1.5rem; max-width:700px; }
    h2 { color:#6c8cff; margin-bottom:1rem; }
    .hash { background:#0a0a18; padding:1rem; border-radius:6px; word-break:break-all; color:#4ade80; font-size:0.85rem; }
    .step { margin-top:1.25rem; padding:1rem; background:#161620; border-radius:6px; border-left:3px solid #6c8cff; }
    .warn { border-left-color:#f87171; background:#1a1010; color:#f87171; }
</style>
</head>
<body>
<div class="box">
    <h2>⚙️ Setup — Hash généré</h2>
    <p>Mot de passe testé : <code><?= htmlspecialchars($password) ?></code></p>
    <p style="margin-top:0.5rem">Vérification : <?= password_verify($password, $hash) ? '<span style="color:#4ade80">✅ OK</span>' : '<span style="color:#f87171">❌ Erreur</span>' ?></p>

    <div class="step">
        <strong>1. Copiez ce hash dans config.php</strong>
        <div class="hash" style="margin-top:0.75rem"><?= $hash ?></div>
    </div>

    <div class="step">
        <strong>2. Remplacez dans config.php :</strong>
        <div class="hash" style="margin-top:0.75rem">define('ADMIN_PASSWORD_HASH', '<?= $hash ?>');</div>
    </div>

    <div class="step warn">
        <strong>⚠️ 3. SUPPRIMEZ ce fichier setup.php immédiatement !</strong><br>
        Ce fichier expose votre configuration. Ne le laissez jamais en ligne.
    </div>
</div>
</body>
</html>
