<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

try {
    require_once __DIR__ . '/conexion.php';
    $consulta = trim((string) ($_GET['q'] ?? ''));

    if (mb_strlen($consulta) < 2) {
        echo json_encode(['ok' => true, 'resultados' => []], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $conexion = obtenerConexion();
    $termino = '%' . $consulta . '%';
    $sql = <<<'SQL'
SELECT
    TRIM(le) AS dni,
    TRIM(CODMOD_NUEVO) AS codigo,
    TRIM(ape) AS apellidoPaterno,
    '' AS apellidoMaterno,
    TRIM(nom) AS nombres,
    TRIM(CONCAT_WS(' ', ape, nom)) AS nombreCompleto,
    TRIM(ALFA4_CARGOS_CODIGO) AS codigoCargo,
    TRIM(COD_SEDE) AS empresa,
    CASE WHEN ChkDoc <> 0 THEN 'DOCENTE' WHEN ChkAdm <> 0 THEN 'ADMINISTRATIVO' WHEN ChkAux <> 0 THEN 'AUXILIAR' WHEN ChkPrs <> 0 THEN 'SALUD' ELSE 'OTRO' END AS tipo
FROM alfa1
WHERE le LIKE :dni
   OR ape LIKE :apellidoPaterno
   OR nom LIKE :apellidoMaterno
   OR nom LIKE :nombres
   OR CONCAT_WS(' ', ape, nom) LIKE :nombreCompleto
ORDER BY (le = :dniExacto) DESC, ape, nom
LIMIT 20
SQL;
    $sentencia = $conexion->prepare($sql);
    $sentencia->execute([
        'dni' => $termino,
        'apellidoPaterno' => $termino,
        'apellidoMaterno' => $termino,
        'nombres' => $termino,
        'nombreCompleto' => $termino,
        'dniExacto' => $consulta,
    ]);

    echo json_encode([
        'ok' => true,
        'resultados' => $sentencia->fetchAll(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $error) {
    error_log($error->getMessage());
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'mensaje' => 'No se pudo consultar el padrón de servidores.',
    ], JSON_UNESCAPED_UNICODE);
}
