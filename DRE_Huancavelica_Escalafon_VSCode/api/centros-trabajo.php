<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
try {
    require_once __DIR__ . '/conexion.php';
    $codigo = trim((string)($_GET['codigo'] ?? ''));
    $nombre = trim((string)($_GET['nombre'] ?? ''));
    $db = obtenerConexion();
    $sql = "SELECT CODMODCE, NOMBRE, SUP_USE_ADE, `MOD`, `TIPO` FROM ccee WHERE CODMODCE <> '0000000000'";
    $params = [];
    if ($codigo !== '') { $sql .= ' AND CODMODCE LIKE :codigo'; $params['codigo'] = '%' . $codigo . '%'; }
    if ($nombre !== '') { $sql .= ' AND NOMBRE LIKE :nombre'; $params['nombre'] = '%' . $nombre . '%'; }
    $sql .= ' ORDER BY NOMBRE LIMIT 50';
    $query = $db->prepare($sql);
    $query->execute($params);
    $registros = array_map(static fn(array $row): array => [
        'codigo' => trim((string)$row['CODMODCE']),
        'nombre' => trim((string)$row['NOMBRE']),
        'iged' => trim((string)$row['SUP_USE_ADE']),
        'nivel' => trim((string)$row['TIPO']),
        'modalidad' => trim((string)$row['MOD']),
    ], $query->fetchAll());
    echo json_encode(['ok' => true, 'registros' => $registros], JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'mensaje' => 'No fue posible buscar los centros de trabajo.'], JSON_UNESCAPED_UNICODE);
}
