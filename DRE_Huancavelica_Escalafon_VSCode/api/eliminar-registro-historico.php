<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
require_once __DIR__ . '/conexion.php';
try {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'DELETE') throw new RuntimeException('Método no permitido.');
    $data=json_decode((string)file_get_contents('php://input'),true)?:[];
    $dni=trim((string)($data['dni']??''));
    $source=trim((string)($data['source']??''));
    $key=trim((string)($data['key']??''));
    $allowed=[
        'beneficio'=>['table'=>'beneficio','pk'=>'X_LLAVE','owner'=>'cod_modu'],
        'transaccion_beneficio'=>['table'=>'transaccion_beneficio','pk'=>'X_LLAVE','owner'=>'cod_modu'],
        'transaccion_merito'=>['table'=>'transaccion_merito','pk'=>'X_LLAVE','owner'=>'cod_modu'],
        'transaccion_cesante'=>['table'=>'transaccion_cesante','pk'=>'X_LLAVE','owner'=>'cod_modu'],
        'suspension'=>['table'=>'suspension','pk'=>'X_LLAVE','owner'=>'CODMOD'],
        'liccongoce'=>['table'=>'liccongoce','pk'=>'Id','owner'=>'CodMod'],
        'licsingoce'=>['table'=>'licsingoce','pk'=>'id','owner'=>'codmod'],
        'otroscargos'=>['table'=>'otroscargos','pk'=>'Id','owner'=>'CodMod'],
        'observaciones'=>['table'=>'observaciones','pk'=>'Id','owner'=>'CODMOD'],
        'empleado_documento'=>['table'=>'empleado_documento','pk'=>'COD_DOCUMENTO','owner'=>'CODMOD'],
        'tipo_pension_registro'=>['table'=>'tipo_pension_registro','pk'=>'id','owner'=>'codmod','dni'=>'dni'],
        'controlfamilia'=>['table'=>'controlfamilia','pk'=>'Id','owner'=>'CodMod'],
        'formacion_academica_registro'=>['table'=>'formacion_academica_registro','pk'=>'id','owner'=>'codmod'],
        'otrostitulos'=>['table'=>'otrostitulos','pk'=>'Id','owner'=>'CodMod'],
        'maestria'=>['table'=>'maestria','pk'=>'Id','owner'=>'CodMod'],
        'doccap'=>['table'=>'doccap','pk'=>'x_LLAVE','owner'=>'COD_MODU'],
        'ingreso_registro'=>['table'=>'ingreso_registro','pk'=>'id','owner'=>'codmod'],
        'destaque'=>['table'=>'destaque','pk'=>'ID','owner'=>'CODMOD'],
    ];
    if(!preg_match('/^\d{8}$/',$dni)||!isset($allowed[$source])||$key==='') throw new InvalidArgumentException('Solicitud inválida.');
    $db=obtenerConexion();
    $person=$db->prepare('SELECT codmod FROM alfa1 WHERE TRIM(le)=:dni LIMIT 1');
    $person->execute(['dni'=>$dni]);
    $codmod=(string)($person->fetchColumn()?:'');
    if($codmod==='') throw new RuntimeException('Servidor no encontrado.');
    $definition=$allowed[$source];
    $table=$definition['table'];
    $pk=$definition['pk'];
    $owner=$definition['owner'];
    $ownership="CAST({$owner} AS UNSIGNED)=CAST(:codmod AS UNSIGNED)";
    $parameters=['key'=>$key,'codmod'=>$codmod];
    if(isset($definition['dni'])){$ownership="({$ownership} OR {$definition['dni']}=:dni)";$parameters['dni']=$dni;}
    $check=$db->prepare("SELECT {$pk} FROM {$table} WHERE {$pk}=:key AND {$ownership} LIMIT 1");
    $check->execute($parameters);
    if(!$check->fetchColumn()) throw new RuntimeException('Registro no encontrado para este servidor.');
    $delete=$db->prepare("DELETE FROM {$table} WHERE {$pk}=:key AND {$ownership}");
    $delete->execute($parameters);
    echo json_encode(['ok'=>true],JSON_UNESCAPED_UNICODE);
} catch(Throwable $e){http_response_code(400);echo json_encode(['ok'=>false,'mensaje'=>$e->getMessage()],JSON_UNESCAPED_UNICODE);}
