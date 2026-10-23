<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function responderIngreso(bool $ok, array $data = [], int $status = 200): never {
    http_response_code($status);
    echo json_encode(['ok' => $ok] + $data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

try {
    require_once __DIR__ . '/conexion.php';
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') responderIngreso(false, ['mensaje' => 'Método no permitido.'], 405);
    $valor = static fn(string $campo): string => trim((string)($_POST[$campo] ?? ''));
    $dni = $valor('dni');
    $codmod = $valor('codmod');
    $tipoResolucion = $valor('tipo_resolucion');
    $numeroResolucion = $valor('numero_resolucion');
    $fechaResolucion = $valor('fecha_resolucion');
    $regimen = $valor('regimen');
    $accion = $valor('accion');
    $motivo = $valor('motivo');
    $fechaInicio = $valor('fecha_inicio');
    $fechaFin = $valor('fecha_fin');
    $centroLaboral = $valor('centro_laboral');
    $cargo = $valor('cargo');
    $condicion = $valor('condicion');
    $estado = $valor('estado') ?: 'APROBADO';
    $folios = $valor('folios');
    if (!preg_match('/^\d{8}$/', $dni) || $codmod === '' || $tipoResolucion === '' || $numeroResolucion === '' || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fechaResolucion) || $regimen === '' || $accion === '' || $motivo === '' || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fechaInicio) || $centroLaboral === '' || $cargo === '') {
        responderIngreso(false, ['mensaje' => 'Complete todos los campos obligatorios.'], 422);
    }
    if (!isset($_FILES['documento']) || $_FILES['documento']['error'] !== UPLOAD_ERR_OK) responderIngreso(false, ['mensaje' => 'Adjunte el documento PDF.'], 422);
    if ((int)$_FILES['documento']['size'] > 2 * 1024 * 1024) responderIngreso(false, ['mensaje' => 'El documento supera el máximo de 2 MB.'], 422);
    if (strtolower(pathinfo((string)$_FILES['documento']['name'], PATHINFO_EXTENSION)) !== 'pdf') responderIngreso(false, ['mensaje' => 'El documento debe estar en formato PDF.'], 422);

    $directorio = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'ingresos';
    if (!is_dir($directorio) && !mkdir($directorio, 0775, true) && !is_dir($directorio)) throw new RuntimeException('No se pudo crear la carpeta de documentos.');
    $archivo = $dni . '-' . date('YmdHis') . '-' . bin2hex(random_bytes(4)) . '.pdf';
    if (!move_uploaded_file($_FILES['documento']['tmp_name'], $directorio . DIRECTORY_SEPARATOR . $archivo)) throw new RuntimeException('No se pudo guardar el documento.');
    $rutaDocumento = 'uploads/ingresos/' . $archivo;

    $db = obtenerConexion();
    $db->exec("CREATE TABLE IF NOT EXISTS ingreso_registro (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        codmod VARCHAR(30) NOT NULL, dni VARCHAR(8) NOT NULL,
        tipo_resolucion VARCHAR(150) NOT NULL, numero_resolucion VARCHAR(100) NOT NULL,
        fecha_resolucion DATE NOT NULL, documento VARCHAR(255) NOT NULL, folios INT NULL,
        regimen VARCHAR(200) NOT NULL, accion VARCHAR(100) NOT NULL, motivo VARCHAR(255) NOT NULL,
        fecha_inicio DATE NOT NULL, fecha_fin DATE NULL, centro_laboral VARCHAR(255) NOT NULL,
        cargo VARCHAR(200) NOT NULL, condicion VARCHAR(100) NULL, estado VARCHAR(30) NOT NULL DEFAULT 'APROBADO',
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_ingreso_dni (dni), INDEX idx_ingreso_codmod (codmod)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    $stmt = $db->prepare('INSERT INTO ingreso_registro (codmod,dni,tipo_resolucion,numero_resolucion,fecha_resolucion,documento,folios,regimen,accion,motivo,fecha_inicio,fecha_fin,centro_laboral,cargo,condicion,estado) VALUES (:codmod,:dni,:tipo_resolucion,:numero_resolucion,:fecha_resolucion,:documento,:folios,:regimen,:accion,:motivo,:fecha_inicio,:fecha_fin,:centro_laboral,:cargo,:condicion,:estado)');
    $stmt->execute(['codmod'=>$codmod,'dni'=>$dni,'tipo_resolucion'=>$tipoResolucion,'numero_resolucion'=>$numeroResolucion,'fecha_resolucion'=>$fechaResolucion,'documento'=>$rutaDocumento,'folios'=>$folios===''?null:(int)$folios,'regimen'=>$regimen,'accion'=>$accion,'motivo'=>$motivo,'fecha_inicio'=>$fechaInicio,'fecha_fin'=>$fechaFin===''?null:$fechaFin,'centro_laboral'=>$centroLaboral,'cargo'=>$cargo,'condicion'=>$condicion?:null,'estado'=>$estado]);
    responderIngreso(true, ['mensaje'=>'Registro de ingreso guardado correctamente.','registro'=>[
        'id'=>(int)$db->lastInsertId(),'accion'=>$accion,'motivo'=>$motivo,'fechaInicio'=>date('d/m/Y',strtotime($fechaInicio)),
        'fechaFin'=>$fechaFin===''?'':date('d/m/Y',strtotime($fechaFin)),'estado'=>$estado,'resolucion'=>$numeroResolucion,
        'fechaResolucion'=>date('d/m/Y',strtotime($fechaResolucion)),'tipoResolucion'=>$tipoResolucion,'centroLaboral'=>$centroLaboral,
        'cargo'=>$cargo,'condicion'=>$condicion,'documento'=>$rutaDocumento,'folios'=>$folios
    ]]);
} catch (Throwable $error) {
    responderIngreso(false, ['mensaje'=>'No se pudo guardar el registro de ingreso.','detalle'=>$error->getMessage()], 500);
}
