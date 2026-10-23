<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

try {
    require_once __DIR__ . '/conexion.php';
    $db = obtenerConexion();
    $accion = (string) ($_GET['accion'] ?? 'listar');

    $estadisticas = static function (PDO $db): array {
        $fila = $db->query(<<<'SQL'
SELECT
    COUNT(*) AS total,
    SUM(ChkDoc <> 0) AS docentes,
    SUM(ChkAdm <> 0) AS administrativos,
    SUM(TRIM(le) REGEXP '^[0-9]{8}$' AND TRIM(le) <> '00000000') AS conDni,
    SUM(CODMOD_NUEVO IS NOT NULL AND TRIM(CODMOD_NUEVO) <> '') AS conCodigo
FROM alfa1
SQL)->fetch();
        return array_map('intval', $fila ?: []);
    };

    if ($accion === 'estadisticas') {
        echo json_encode(['ok' => true, 'estadisticas' => $estadisticas($db)], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $pagina = max(1, (int) ($_GET['pagina'] ?? 1));
    $porPagina = min(50, max(5, (int) ($_GET['porPagina'] ?? 10)));
    $busqueda = trim((string) ($_GET['q'] ?? ''));
    $parametros = [];
    $condicion = '';
    if ($busqueda !== '') {
        $condicion = " WHERE le LIKE :q1 OR ape LIKE :q2 OR nom LIKE :q3 OR CONCAT_WS(' ', ape, nom) LIKE :q4 OR CODMOD_NUEVO LIKE :q5";
        $termino = '%' . $busqueda . '%';
        $parametros = ['q1' => $termino, 'q2' => $termino, 'q3' => $termino, 'q4' => $termino, 'q5' => $termino];
    }

    $conteo = $db->prepare('SELECT COUNT(*) FROM alfa1' . $condicion);
    $conteo->execute($parametros);
    $total = (int) $conteo->fetchColumn();
    $paginas = max(1, (int) ceil($total / $porPagina));
    $pagina = min($pagina, $paginas);
    $inicio = ($pagina - 1) * $porPagina;

    $sql = "SELECT TRIM(le) AS dni, TRIM(CODMOD_NUEVO) AS codigo, TRIM(ALFA4_CARGOS_CODIGO) AS codigoCargo, TRIM(ape) AS apellidoPaterno, '' AS apellidoMaterno, TRIM(nom) AS nombres, CASE WHEN ChkDoc <> 0 THEN 'DOCENTE' WHEN ChkAdm <> 0 THEN 'ADMINISTRATIVO' WHEN ChkAux <> 0 THEN 'AUXILIAR' WHEN ChkPrs <> 0 THEN 'SALUD' ELSE 'OTRO' END AS tipo, TRIM(COD_SEDE) AS empresa, TRIM(REGIMEN) AS regimen, CASE WHEN NOMBRADO_ACTIVO <> 0 THEN 'NOMBRADO ACTIVO' WHEN CONTRATADO_ACTIVO <> 0 THEN 'CONTRATADO ACTIVO' WHEN Retirado <> 0 THEN 'RETIRADO' ELSE 'REGISTRADO' END AS condicion FROM alfa1{$condicion} ORDER BY ape, nom LIMIT :limite OFFSET :inicio";
    $consulta = $db->prepare($sql);
    foreach ($parametros as $clave => $valor) $consulta->bindValue(':' . $clave, $valor, PDO::PARAM_STR);
    $consulta->bindValue(':limite', $porPagina, PDO::PARAM_INT);
    $consulta->bindValue(':inicio', $inicio, PDO::PARAM_INT);
    $consulta->execute();

    echo json_encode([
        'ok' => true,
        'registros' => $consulta->fetchAll(),
        'paginacion' => ['pagina' => $pagina, 'porPagina' => $porPagina, 'total' => $total, 'paginas' => $total ? $paginas : 0],
        'estadisticas' => $estadisticas($db),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $error) {
    error_log($error->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'mensaje' => 'No se pudo cargar el padrón de servidores.'], JSON_UNESCAPED_UNICODE);
}
