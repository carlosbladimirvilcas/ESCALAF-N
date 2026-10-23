<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
try {
    require_once __DIR__ . '/conexion.php';
    $db = obtenerConexion();
    $query = $db->query("SELECT DISTINCT TRIM(CARGOS_DESCRIPCION) AS cargo FROM alfa4 WHERE TRIM(COALESCE(CARGOS_DESCRIPCION,'')) <> '' ORDER BY cargo");
    $cargos = array_values(array_filter(array_map(static fn(array $row): string => preg_replace('/\s+/u', ' ', trim((string)$row['cargo'])), $query->fetchAll()), static fn(string $cargo): bool => $cargo !== '' && !str_contains(mb_strtoupper($cargo), 'NO REGISTRA')));
    echo json_encode(['ok'=>true,'cargos'=>$cargos], JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode(['ok'=>false,'mensaje'=>'No fue posible cargar el catálogo de cargos.'], JSON_UNESCAPED_UNICODE);
}
