<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
require_once __DIR__.'/conexion.php';
try{
 $db=obtenerConexion();
 $db->exec("CREATE TABLE IF NOT EXISTS escalafon_estado_registro (dni VARCHAR(8) NOT NULL,clave VARCHAR(255) NOT NULL,estado ENUM('APROBADO','ANULADO') NOT NULL DEFAULT 'APROBADO',actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,PRIMARY KEY(dni,clave)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
 $method=$_SERVER['REQUEST_METHOD']??'GET';
 if($method==='GET'){$dni=trim((string)($_GET['dni']??''));$clave=trim((string)($_GET['clave']??''));if(!preg_match('/^\d{8}$/',$dni)||$clave==='')throw new InvalidArgumentException('Consulta inválida.');$q=$db->prepare('SELECT estado FROM escalafon_estado_registro WHERE dni=:dni AND clave=:clave');$q->execute(['dni'=>$dni,'clave'=>$clave]);echo json_encode(['ok'=>true,'estado'=>$q->fetchColumn()?:null]);exit;}
 if($method!=='POST')throw new RuntimeException('Método no permitido.');$data=json_decode((string)file_get_contents('php://input'),true)?:[];$dni=trim((string)($data['dni']??''));$clave=trim((string)($data['clave']??''));$estado=strtoupper(trim((string)($data['estado']??'')));if(!preg_match('/^\d{8}$/',$dni)||$clave===''||!in_array($estado,['APROBADO','ANULADO'],true))throw new InvalidArgumentException('Datos inválidos.');$q=$db->prepare('INSERT INTO escalafon_estado_registro(dni,clave,estado)VALUES(:dni,:clave,:estado) ON DUPLICATE KEY UPDATE estado=VALUES(estado)');$q->execute(['dni'=>$dni,'clave'=>$clave,'estado'=>$estado]);echo json_encode(['ok'=>true,'estado'=>$estado]);
}catch(Throwable $e){http_response_code(400);echo json_encode(['ok'=>false,'mensaje'=>$e->getMessage()],JSON_UNESCAPED_UNICODE);}
