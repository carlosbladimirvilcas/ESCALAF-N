<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function responder(bool $ok, array $data = [], int $status = 200): never {
    http_response_code($status);
    echo json_encode(['ok' => $ok] + $data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

try {
    require_once __DIR__ . '/conexion.php';
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') responder(false, ['mensaje' => 'Método no permitido.'], 405);

    $campos = static fn(string $nombre): string => trim((string)($_POST[$nombre] ?? ''));
    $codmod = $campos('codmod');
    $dni = $campos('dni');
    $tipoResolucion = $campos('tipo_resolucion');
    $numeroResolucion = $campos('numero_resolucion');
    $fechaResolucion = $campos('fecha_resolucion');
    $tipoPension = $campos('tipo_pension');
    $tipoPensionista = $campos('tipo_pensionista');
    $sobrevivencia = $campos('pension_sobrevivencia');
    $beneficiario = $campos('beneficiario');
    $anotaciones = $campos('anotaciones');
    $folios = $campos('folios');

    if (!preg_match('/^\d{8}$/', $dni) || $codmod === '' || $tipoResolucion === '' || $numeroResolucion === '' || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fechaResolucion) || $tipoPension === '' || $tipoPensionista === '') {
        responder(false, ['mensaje' => 'Complete todos los campos obligatorios.'], 422);
    }
    if ($tipoPensionista === 'FALLECIDO' && $sobrevivencia === '') responder(false, ['mensaje' => 'Seleccione la pensión de sobrevivencia.'], 422);
    if ($tipoPensionista === 'FALLECIDO' && $beneficiario === '') responder(false, ['mensaje' => 'Seleccione al beneficiario.'], 422);
    if (!isset($_FILES['documento']) || $_FILES['documento']['error'] !== UPLOAD_ERR_OK) responder(false, ['mensaje' => 'Adjunte el documento PDF.'], 422);
    if ((int)$_FILES['documento']['size'] > 2 * 1024 * 1024) responder(false, ['mensaje' => 'El documento supera el máximo de 2 MB.'], 422);
    $extension = strtolower(pathinfo((string)$_FILES['documento']['name'], PATHINFO_EXTENSION));
    if ($extension !== 'pdf') responder(false, ['mensaje' => 'El documento debe estar en formato PDF.'], 422);

    $directorio = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'tipo-pension';
    if (!is_dir($directorio) && !mkdir($directorio, 0775, true) && !is_dir($directorio)) throw new RuntimeException('No se pudo crear la carpeta de documentos.');
    $nombreArchivo = $dni . '-' . date('YmdHis') . '-' . bin2hex(random_bytes(4)) . '.pdf';
    $destino = $directorio . DIRECTORY_SEPARATOR . $nombreArchivo;
    if (!move_uploaded_file($_FILES['documento']['tmp_name'], $destino)) throw new RuntimeException('No se pudo guardar el documento.');
    $rutaDocumento = 'uploads/tipo-pension/' . $nombreArchivo;

    $db = obtenerConexion();
    $sql = 'INSERT INTO tipo_pension_registro (codmod,dni,tipo_resolucion,numero_resolucion,fecha_resolucion,documento,folios,tipo_pension,tipo_pensionista,pension_sobrevivencia,beneficiario,anotaciones) VALUES (:codmod,:dni,:tipo_resolucion,:numero_resolucion,:fecha_resolucion,:documento,:folios,:tipo_pension,:tipo_pensionista,:pension_sobrevivencia,:beneficiario,:anotaciones)';
    $stmt = $db->prepare($sql);
    $stmt->execute(['codmod'=>$codmod,'dni'=>$dni,'tipo_resolucion'=>$tipoResolucion,'numero_resolucion'=>$numeroResolucion,'fecha_resolucion'=>$fechaResolucion,'documento'=>$rutaDocumento,'folios'=>$folios === '' ? null : (int)$folios,'tipo_pension'=>$tipoPension,'tipo_pensionista'=>$tipoPensionista,'pension_sobrevivencia'=>$sobrevivencia ?: null,'beneficiario'=>$beneficiario ?: null,'anotaciones'=>$anotaciones ?: null]);
    responder(true, ['mensaje'=>'Tipo de pensión guardado correctamente.','registro'=>['id'=>(int)$db->lastInsertId(),'tipoPension'=>$tipoPension,'numeroResolucion'=>$numeroResolucion,'fechaResolucion'=>date('d/m/Y', strtotime($fechaResolucion)),'tipoPensionista'=>$tipoPensionista,'pensionSobrevivencia'=>$sobrevivencia,'beneficiario'=>$beneficiario,'estado'=>'REGISTRADO','documento'=>$rutaDocumento]]);
} catch (Throwable $error) {
    responder(false, ['mensaje'=>'No se pudo guardar el tipo de pensión.','detalle'=>$error->getMessage()], 500);
}
