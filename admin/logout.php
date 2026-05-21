<?php
require_once 'config.php';
logEvent('LOGOUT', 'user=' . ($_SESSION['admin_user'] ?? 'unknown'));
session_destroy();
header('Location: login.php');
exit();
