<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

try {
    require_once __DIR__ . '/conexion.php';
    $conexion = obtenerConexion();
    $config = require __DIR__ . '/config.php';

    $consulta = $conexion->query(
        "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE()"
    );

    http_response_code(200);
    echo json_encode([
        'ok' => true,
        'mensaje' => 'Conexión realizada correctamente.',
        'baseDatos' => $config['database'],
        'tablas' => (int) $consulta->fetchColumn(),
        'servidor' => $config['host'],
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $error) {
    error_log($error->getMessage());
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'mensaje' => 'No fue posible conectar con la base de datos.',
        'detalle' => 'Verifique que Apache y MySQL estén activos y revise las credenciales de api/config.php.',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
