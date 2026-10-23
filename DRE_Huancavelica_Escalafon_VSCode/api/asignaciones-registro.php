<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
require_once __DIR__ . '/conexion.php';

try {
    $db = obtenerConexion();
    $db->exec("CREATE TABLE IF NOT EXISTS asignaciones_registro (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        dni VARCHAR(8) NOT NULL, codmod VARCHAR(30) NOT NULL,
        seccion ENUM('beneficio','subsidio','retencion','pago_indebido') NOT NULL,
        tipo_resolucion VARCHAR(180) NOT NULL, numero_resolucion VARCHAR(120) NOT NULL,
        fecha_resolucion DATE NOT NULL, documento VARCHAR(255) NOT NULL, folios INT NULL,
        regimen VARCHAR(220) NULL, accion VARCHAR(120) NULL, motivo VARCHAR(255) NULL,
        fecha_inicio DATE NULL, fecha_fin DATE NULL, importe DECIMAL(12,2) NULL,
        concepto VARCHAR(255) NULL, observaciones VARCHAR(500) NULL, estado VARCHAR(60) NULL,
        nombre_fallecido VARCHAR(255) NULL, parentesco VARCHAR(80) NULL,
        fecha_fallecimiento DATE NULL, acta_defuncion VARCHAR(255) NULL,
        tipo_retencion VARCHAR(120) NULL, modalidad_retencion VARCHAR(80) NULL,
        monto_fijo DECIMAL(12,2) NULL, porcentaje DECIMAL(7,2) NULL,
        periodo_inicial VARCHAR(7) NULL, periodo_final VARCHAR(7) NULL,
        numero_cuotas INT NULL, monto_cuota DECIMAL(12,2) NULL,
        tipo_pago VARCHAR(80) NULL, fecha_beneficio DATE NULL,
        numero_dependientes INT NULL, tipo_moneda VARCHAR(80) NULL,
        porcentaje_beneficio DECIMAL(7,2) NULL,
        motivo_pago VARCHAR(255) NULL,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_asignacion_persona (dni,codmod,seccion)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    foreach ([
        'tipo_pago VARCHAR(80) NULL','fecha_beneficio DATE NULL','numero_dependientes INT NULL',
        'tipo_moneda VARCHAR(80) NULL','porcentaje_beneficio DECIMAL(7,2) NULL','motivo_pago VARCHAR(255) NULL'
    ] as $columnDefinition) $db->exec("ALTER TABLE asignaciones_registro ADD COLUMN IF NOT EXISTS {$columnDefinition}");

    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if ($method === 'GET') {
        $dni = trim((string)($_GET['dni'] ?? ''));
        $codmod = trim((string)($_GET['codmod'] ?? ''));
        $seccion = trim((string)($_GET['seccion'] ?? ''));
        $stmt = $db->prepare('SELECT * FROM asignaciones_registro WHERE (dni=:dni OR codmod=:codmod) AND seccion=:seccion ORDER BY id DESC');
        $stmt->execute(['dni'=>$dni,'codmod'=>$codmod,'seccion'=>$seccion]);
        echo json_encode(['ok'=>true,'registros'=>$stmt->fetchAll()], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($method === 'DELETE') {
        $payload = json_decode((string)file_get_contents('php://input'), true) ?: [];
        $id = (int)($payload['id'] ?? 0);
        $dni = trim((string)($payload['dni'] ?? ''));
        $stmt = $db->prepare('SELECT documento,acta_defuncion FROM asignaciones_registro WHERE id=:id AND dni=:dni LIMIT 1');
        $stmt->execute(['id'=>$id,'dni'=>$dni]);
        $row = $stmt->fetch();
        if (!$row) throw new RuntimeException('Registro no encontrado.');
        $delete = $db->prepare('DELETE FROM asignaciones_registro WHERE id=:id AND dni=:dni');
        $delete->execute(['id'=>$id,'dni'=>$dni]);
        foreach (['documento','acta_defuncion'] as $field) {
            $relative = trim((string)($row[$field] ?? ''));
            if ($relative !== '') { $path = dirname(__DIR__) . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relative); if (is_file($path)) @unlink($path); }
        }
        echo json_encode(['ok'=>true], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($method !== 'POST') throw new RuntimeException('Método no permitido.');
    $allowed = ['beneficio','subsidio','retencion','pago_indebido'];
    $seccion = trim((string)($_POST['seccion'] ?? ''));
    if (!in_array($seccion,$allowed,true)) throw new InvalidArgumentException('Sección inválida.');
    $dni = trim((string)($_POST['dni'] ?? ''));
    $codmod = trim((string)($_POST['codmod'] ?? ''));
    if (!preg_match('/^\d{8}$/',$dni)) throw new InvalidArgumentException('DNI inválido.');
    $uploadDir = dirname(__DIR__) . '/uploads/asignaciones';
    if (!is_dir($uploadDir) && !mkdir($uploadDir,0775,true) && !is_dir($uploadDir)) throw new RuntimeException('No se pudo crear la carpeta de documentos.');
    $saveFile = static function(string $name) use ($uploadDir,$dni): string {
        if (!isset($_FILES[$name]) || (int)$_FILES[$name]['error'] === UPLOAD_ERR_NO_FILE) return '';
        $file=$_FILES[$name];
        if ((int)$file['error'] !== UPLOAD_ERR_OK || (int)$file['size'] > 2097152) throw new RuntimeException('El PDF debe pesar como máximo 2 MB.');
        $mime=(new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
        if ($mime !== 'application/pdf') throw new RuntimeException('Solo se permiten archivos PDF.');
        $filename=$dni.'-'.bin2hex(random_bytes(8)).'.pdf';
        if (!move_uploaded_file($file['tmp_name'],$uploadDir.'/'.$filename)) throw new RuntimeException('No se pudo guardar el documento.');
        return 'uploads/asignaciones/'.$filename;
    };
    $documento=$saveFile('documento');
    if ($documento==='') throw new InvalidArgumentException('El documento es obligatorio.');
    $acta=$saveFile('acta_defuncion');
    $columns=['dni','codmod','seccion','tipo_resolucion','numero_resolucion','fecha_resolucion','documento','folios','regimen','accion','motivo','fecha_inicio','fecha_fin','importe','concepto','observaciones','estado','nombre_fallecido','parentesco','fecha_fallecimiento','acta_defuncion','tipo_retencion','modalidad_retencion','monto_fijo','porcentaje','periodo_inicial','periodo_final','numero_cuotas','monto_cuota','tipo_pago','fecha_beneficio','numero_dependientes','tipo_moneda','porcentaje_beneficio','motivo_pago'];
    $nullable=['folios','fecha_inicio','fecha_fin','importe','fecha_fallecimiento','monto_fijo','porcentaje','numero_cuotas','monto_cuota','fecha_beneficio','numero_dependientes','porcentaje_beneficio'];
    $values=[];
    foreach($columns as $column){
        if($column==='documento'){$values[$column]=$documento;continue;}
        if($column==='acta_defuncion'){$values[$column]=$acta;continue;}
        $value=trim((string)($_POST[$column] ?? ''));
        $values[$column]=in_array($column,$nullable,true)&&$value===''?null:$value;
    }
    $sql='INSERT INTO asignaciones_registro ('.implode(',',$columns).') VALUES (:'.implode(',:',$columns).')';
    $db->prepare($sql)->execute($values);
    echo json_encode(['ok'=>true,'id'=>(int)$db->lastInsertId()], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode(['ok'=>false,'mensaje'=>$e->getMessage()], JSON_UNESCAPED_UNICODE);
}
