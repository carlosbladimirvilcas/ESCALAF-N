<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

try {
    require_once __DIR__ . '/conexion.php';
    $dni = trim((string) ($_GET['dni'] ?? ''));
    if (!preg_match('/^[0-9]{8}$/', $dni)) throw new InvalidArgumentException('DNI inválido.');
    $db = obtenerConexion();
    $consulta = $db->prepare('SELECT * FROM alfa1 WHERE TRIM(le) = :dni LIMIT 1');
    $consulta->execute(['dni' => $dni]);
    $persona = $consulta->fetch();
    if (!$persona) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'mensaje' => 'Servidor no encontrado.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $laboral = null;
    $consultaLaboral = $db->prepare('SELECT * FROM alfa4 WHERE codmod = :codmod LIMIT 1');
    $consultaLaboral->execute(['codmod' => trim((string) $persona['codmod'])]);
    $laboral = $consultaLaboral->fetch() ?: [];

    $nacimiento = [];
    if (trim((string) $persona['CODGEONAC']) !== '') {
        $geo = $db->prepare('SELECT * FROM codgeonac WHERE CODGEO = :codigo LIMIT 1');
        $geo->execute(['codigo' => trim((string) $persona['CODGEONAC'])]);
        $nacimiento = $geo->fetch() ?: [];
    }

    $domicilio = [];
    if (trim((string) $persona['DOM_UBIGEO']) !== '') {
        $geoDomicilio = $db->prepare('SELECT * FROM codgeonac WHERE CODGEO = :codigo LIMIT 1');
        $geoDomicilio->execute(['codigo' => trim((string) $persona['DOM_UBIGEO'])]);
        $domicilio = $geoDomicilio->fetch() ?: [];
    }

    $consultaFamiliares = $db->prepare('SELECT Id, Nro, NomFamiliar, Sexo, FecNac, Ocupacion, EstadoCivil, Parentesco, ResNro, ResFecha, Caducidad, Observaciones FROM controlfamilia WHERE CodMod = :codmod ORDER BY Nro, Id');
    $consultaFamiliares->execute(['codmod' => trim((string) $persona['codmod'])]);
    $familiares = array_map(static function (array $familiar): array {
        $fecha = trim((string) ($familiar['FecNac'] ?? ''));
        $fecha = ($fecha === '' || str_starts_with($fecha, '0000-00-00')) ? '' : date('d/m/Y', strtotime($fecha));
        $sexo = mb_strtoupper(trim((string) ($familiar['Sexo'] ?? '')));
        return [
            'numero' => (int) ($familiar['Nro'] ?? 0),
            'nombre' => trim((string) ($familiar['NomFamiliar'] ?? '')),
            'tipoDocumento' => '',
            'documento' => '',
            'parentesco' => trim((string) ($familiar['Parentesco'] ?? '')),
            'sexo' => $sexo === 'F' ? 'FEMENINO' : ($sexo === 'M' ? 'MASCULINO' : $sexo),
            'fechaNacimiento' => $fecha,
            'situacion' => str_contains(mb_strtoupper(trim((string) ($familiar['Ocupacion'] ?? ''))), 'FALLECIDO') ? 'FALLECIDO' : '',
            'estado' => '',
            'ocupacion' => trim((string) ($familiar['Ocupacion'] ?? '')),
            'estadoCivil' => trim((string) ($familiar['EstadoCivil'] ?? '')),
            'resolucion' => trim((string) ($familiar['ResNro'] ?? '')),
            'fechaResolucion' => (($fechaResolucion = trim((string) ($familiar['ResFecha'] ?? ''))) === '' || str_starts_with($fechaResolucion, '0000-00-00')) ? '' : date('d/m/Y', strtotime($fechaResolucion)),
            'caducidad' => trim((string) ($familiar['Caducidad'] ?? '')),
            'observaciones' => trim((string) ($familiar['Observaciones'] ?? '')),
            '_deleteSource' => 'controlfamilia',
            '_deleteKey' => trim((string) ($familiar['Id'] ?? '')),
        ];
    }, $consultaFamiliares->fetchAll());

    $codmod = trim((string) $persona['codmod']);
    $fechaValida = static function ($valor): string {
        $valor = trim((string) $valor);
        return ($valor === '' || str_starts_with($valor, '0000-00-00')) ? '' : date('d/m/Y', strtotime($valor));
    };
    $formacion = [];
    $consultaFormacion = $db->prepare('SELECT * FROM formacion_academica_registro WHERE codmod = :codmod ORDER BY id');
    $consultaFormacion->execute(['codmod' => $codmod]);
    foreach ($consultaFormacion->fetchAll() as $fila) {
        $formacion[] = ['nivel' => $fila['nivel_educativo'], 'centro' => $fila['centro_estudios'], 'especialidad' => $fila['especialidad_titulo'] ?: $fila['carrera'], 'situacion' => $fila['situacion_academica'], 'grado' => $fila['nivel_especialidad'], 'inicio' => $fila['anio_inicio'], 'fin' => $fila['anio_fin'], 'estado' => $fila['estado'], '_deleteSource'=>'formacion_academica_registro', '_deleteKey'=>(string)$fila['id']];
    }
    $consultaAlfa5 = $db->prepare('SELECT * FROM alfa5 WHERE codmod = :codmod LIMIT 1');
    $consultaAlfa5->execute(['codmod' => $codmod]);
    $estudios = $consultaAlfa5->fetch() ?: [];
    foreach ([['PRIMARIA','primaria','Lug_Primaria','EE_SUPERIOR','FI_primaria','FF_primaria','EST_PRIM'],['SECUNDARIA','secundaria','Lug_secundaria','EE_SECUNDARIA','FI_secundaria','FF_secundaria','EST_SEC'],['SUPERIOR','SUPERIOR','LUG_SUPERIOR','EE_SUPERIOR','FI_SUPERIOR','FF_SUPERIOR','EST_SUP'],['UNIVERSITARIO','UNIVERSITARIO','LUG_UNIVERSITARIO','EE_UNIVERSITARIO','FI_UNIVERSITARIO','FF_UNIVERSITARIO','SIT_ACAD'],['TECNOLÓGICO','TECNOLOGICO','LUG_TECNOLOGICO','EE_TECNOLOGICO','FI_TECNOLOGICO','FF_TECNOLOGICO','SIT_ACAD']] as $mapa) {
        $centro = trim((string) ($estudios[$mapa[1]] ?? ''));
        if ($centro !== '' && !preg_match('/NO\s*REGISTRA/i', $centro)) $formacion[] = ['nivel'=>$mapa[0], 'centro'=>$centro, 'especialidad'=>trim((string)($estudios[$mapa[3]] ?? '')), 'situacion'=>trim((string)($estudios[$mapa[6]] ?? '')), 'grado'=>'', 'inicio'=>trim((string)($estudios[$mapa[4]] ?? '')), 'fin'=>trim((string)($estudios[$mapa[5]] ?? '')), 'estado'=>'', '_deleteSource'=>'alfa5_formacion', '_deleteKey'=>$mapa[0]];
    }
    $consultaTitulos = $db->prepare('SELECT * FROM otrostitulos WHERE CodMod = :codmod ORDER BY Id');
    $consultaTitulos->execute(['codmod' => $codmod]);
    foreach ($consultaTitulos->fetchAll() as $fila) $formacion[] = ['nivel'=>'TÍTULO', 'centro'=>trim((string)$fila['Institucion']), 'especialidad'=>trim((string)$fila['Especialidad']), 'situacion'=>'', 'grado'=>trim((string)$fila['OtrosTitulos']), 'inicio'=>'', 'fin'=>'', 'estado'=>'', '_deleteSource'=>'otrostitulos', '_deleteKey'=>(string)$fila['Id']];
    $consultaMaestrias = $db->prepare('SELECT * FROM maestria WHERE CodMod = :codmod ORDER BY Id');
    $consultaMaestrias->execute(['codmod' => $codmod]);
    foreach ($consultaMaestrias->fetchAll() as $fila) $formacion[] = ['nivel'=>trim((string)$fila['Maestria']), 'centro'=>trim((string)$fila['Institucion']), 'especialidad'=>trim((string)$fila['Especialidad']), 'situacion'=>trim((string)$fila['Situacion']), 'grado'=>'', 'inicio'=>'', 'fin'=>'', 'estado'=>'', '_deleteSource'=>'maestria', '_deleteKey'=>(string)$fila['Id']];

    $consultaCapacitaciones = $db->prepare('SELECT d.*, e.NOMBRE AS tipo_estudio_nombre, tc.NOMBRE AS tipo_capacitacion_nombre, p.NOMBRE AS participacion_nombre FROM doccap d LEFT JOIN evento e ON e.CODIGO = d.TIP_EVEN LEFT JOIN tipo_capacitacion tc ON tc.CODIGO = d.TIP_CAP LEFT JOIN partici p ON p.CODIGO = d.TIP_PART WHERE d.COD_MODU = :codmod ORDER BY d.OCURR, d.x_LLAVE');
    $consultaCapacitaciones->execute(['codmod' => $codmod]);
    $capacitaciones = array_map(static fn(array $fila): array => [
        'tipo'=>trim((string)$fila['tipo_estudio_nombre']),
        'institucion'=>trim((string)$fila['NOM_ORG']),
        'tema'=>trim((string)$fila['NOM_CAP']),
        'documento'=>'',
        'inicio'=>$fechaValida($fila['FIN_CAP']),
        'fin'=>$fechaValida($fila['FFI_CAP']),
        'emision'=>$fechaValida($fila['X_FECHA']),
        'horas'=>trim((string)$fila['DUR_CAP']),
        'estado'=>'',
        'categoria'=>trim((string)$fila['tipo_capacitacion_nombre']),
        'participacion'=>trim((string)$fila['participacion_nombre']),
        'credito'=>trim((string)$fila['CREDITO']), '_deleteSource'=>'doccap', '_deleteKey'=>trim((string)$fila['x_LLAVE'])
    ], $consultaCapacitaciones->fetchAll());
    $idiomas = [];
    $nombreIdioma = trim((string) ($estudios['COD_IDIO'] ?? ''));
    if ($nombreIdioma === '') $nombreIdioma = trim((string) ($persona['Idiomas'] ?? ''));
    if ($nombreIdioma === '') $nombreIdioma = trim((string) ($persona['IDIOMA_NOMBRE'] ?? ''));
    if ($nombreIdioma !== '') {
        foreach (preg_split('/\s*-\s*/u', $nombreIdioma, -1, PREG_SPLIT_NO_EMPTY) as $idiomaNombre) {
            $idiomas[] = ['tipo'=>'', 'idioma'=>trim($idiomaNombre), 'escritura'=>trim((string)($estudios['NIV_IDIO'] ?? '')), 'oral'=>trim((string)($estudios['NIV_IDIO'] ?? '')), 'lugar'=>trim((string)($estudios['INSTITU'] ?? ''))];
        }
    }

    $ingresos = [];
    $consultaIngreso = $db->prepare('SELECT * FROM alfa3 WHERE TRIM(LE) = :dni OR CAST(codmod AS UNSIGNED) = CAST(:codmod AS UNSIGNED) LIMIT 1');
    $consultaIngreso->execute(['dni' => $dni, 'codmod' => $codmod]);
    $registroIngreso = $consultaIngreso->fetch() ?: [];
    if ($registroIngreso) {
        $accionIngreso = $persona['NOMBRADO_ACTIVO'] != 0 ? 'NOMBRAMIENTO' : ($persona['CONTRATADO_ACTIVO'] != 0 ? 'CONTRATO' : 'INGRESO');
        if ((int) ($registroIngreso['OK_INGRESO'] ?? 0) !== 0 || trim((string) ($registroIngreso['Res_Ing'] ?? '')) !== '') {
            $ingresos[] = [
                'accion' => $accionIngreso,
                'motivo' => '',
                'fechaInicio' => $fechaValida($registroIngreso['fecing'] ?? ''),
                'fechaFin' => '',
                'resolucion' => trim((string) ($registroIngreso['Res_Ing'] ?? '')),
                'fechaResolucion' => $fechaValida($registroIngreso['Fec_Res'] ?? ''),
                'tipoResolucion' => '',
                'estado' => '',
                '_deleteSource' => 'alfa3_ingreso',
                '_deleteKey' => 'INGRESO',
            ];
        }
        if ((int) ($registroIngreso['OK_REINGRESO'] ?? 0) !== 0 || trim((string) ($registroIngreso['REINGRESO_RESOLUCION'] ?? '')) !== '') {
            $ingresos[] = [
                'accion' => 'REINGRESO',
                'motivo' => '',
                'fechaInicio' => $fechaValida($registroIngreso['REINGRESO_FECHA'] ?? ''),
                'fechaFin' => '',
                'resolucion' => trim((string) ($registroIngreso['REINGRESO_RESOLUCION'] ?? '')),
                'fechaResolucion' => $fechaValida($registroIngreso['REINGRESO_RESOLUCION_FECHA'] ?? ''),
                'tipoResolucion' => '',
                'estado' => '',
                '_deleteSource' => 'alfa3_ingreso',
                '_deleteKey' => 'REINGRESO',
            ];
        }
    }
    $db->exec("CREATE TABLE IF NOT EXISTS ingreso_registro (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,codmod VARCHAR(30) NOT NULL,dni VARCHAR(8) NOT NULL,tipo_resolucion VARCHAR(150) NOT NULL,numero_resolucion VARCHAR(100) NOT NULL,fecha_resolucion DATE NOT NULL,documento VARCHAR(255) NOT NULL,folios INT NULL,regimen VARCHAR(200) NOT NULL,accion VARCHAR(100) NOT NULL,motivo VARCHAR(255) NOT NULL,fecha_inicio DATE NOT NULL,fecha_fin DATE NULL,centro_laboral VARCHAR(255) NOT NULL,cargo VARCHAR(200) NOT NULL,condicion VARCHAR(100) NULL,estado VARCHAR(30) NOT NULL DEFAULT 'APROBADO',creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,INDEX idx_ingreso_dni (dni),INDEX idx_ingreso_codmod (codmod)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    $consultaIngresosRegistrados = $db->prepare('SELECT * FROM ingreso_registro WHERE dni=:dni OR codmod=:codmod ORDER BY id DESC');
    $consultaIngresosRegistrados->execute(['dni'=>$dni,'codmod'=>$codmod]);
    foreach ($consultaIngresosRegistrados->fetchAll() as $fila) $ingresos[] = [
        'id'=>(int)$fila['id'],'accion'=>trim((string)$fila['accion']),'motivo'=>trim((string)$fila['motivo']),
        'fechaInicio'=>$fechaValida($fila['fecha_inicio'] ?? ''),'fechaFin'=>$fechaValida($fila['fecha_fin'] ?? ''),
        'resolucion'=>trim((string)$fila['numero_resolucion']),'fechaResolucion'=>$fechaValida($fila['fecha_resolucion'] ?? ''),
        'tipoResolucion'=>trim((string)$fila['tipo_resolucion']),'estado'=>trim((string)$fila['estado']),
        'centroLaboral'=>trim((string)$fila['centro_laboral']),'cargo'=>trim((string)$fila['cargo']),
        'condicion'=>trim((string)($fila['condicion'] ?? '')),'documento'=>trim((string)$fila['documento']),'folios'=>$fila['folios'],
        '_deleteSource'=>'ingreso_registro', '_deleteKey'=>(string)$fila['id']
    ];

    $desplazamientos = [];
    $consultaDesplazamientos = $db->prepare('SELECT * FROM destaque WHERE CAST(CODMOD AS UNSIGNED) = CAST(:codmod AS UNSIGNED) ORDER BY ID');
    $consultaDesplazamientos->execute(['codmod' => $codmod]);
    foreach ($consultaDesplazamientos->fetchAll() as $fila) {
        $descripcionAccion = mb_strtoupper(trim((string) ($fila['MOTIVO_DESCRI'] ?? '')));
        $accion = str_contains($descripcionAccion, 'ENCARG') ? 'ENCARGATURA' : (str_contains($descripcionAccion, 'DESTA') ? 'DESTAQUE' : $descripcionAccion);
        $desplazamientos[] = [
            'accion' => $accion,
            'motivo' => trim((string) ($fila['DESCRIPCION'] ?? '')),
            'fechaInicio' => $fechaValida($fila['FECINICIO'] ?? ''),
            'fechaFin' => $fechaValida($fila['FECFIN'] ?? ''),
            'cargo' => trim((string) ($fila['CARDESCRI'] ?? '')),
            'codigoModularDestino' => trim((string) ($fila['DCE_CODMODCE'] ?? '')),
            'centroOrigen' => trim((string) ($fila['OCE_INSTITUCION'] ?? '')),
            'centroDestino' => trim((string) ($fila['DCE_INSTITUCION'] ?? '')),
            'resolucion' => trim((string) ($fila['RES'] ?? '')),
            'fechaResolucion' => $fechaValida($fila['FECRES'] ?? ''),
            'estado' => '', '_deleteSource'=>'destaque', '_deleteKey'=>trim((string)($fila['ID'] ?? '')),
        ];
    }

    $ascensos = [];
    $consultaCargos = $db->prepare("SELECT * FROM otroscargos WHERE CAST(CodMod AS UNSIGNED) = CAST(:codmod AS UNSIGNED) AND (UPPER(Descripcion) LIKE '%ASC%' OR UPPER(Descripcion) LIKE '%NIVEL%') ORDER BY Id");
    $consultaCargos->execute(['codmod' => $codmod]);
    foreach ($consultaCargos->fetchAll() as $fila) $ascensos[] = [
        'accion' => 'ASCENSO', 'motivo' => trim((string)($fila['Descripcion'] ?? '')), 'inicio' => $fechaValida($fila['FecInic'] ?? ''),
        'fin' => $fechaValida($fila['FecFin'] ?? ''), 'escalaAnterior' => '', 'nuevaEscala' => trim((string)($fila['Cargo'] ?? '')),
        'resolucion' => trim((string)($fila['NroRes'] ?? $fila['Res'] ?? '')), 'fechaResolucion' => trim((string)($fila['FechaRes'] ?? '')), 'estado' => '', '_deleteSource'=>'otroscargos', '_deleteKey'=>trim((string)($fila['Id'] ?? ''))
    ];

    $experienciaLaboral = [];
    $consultaExperiencia = $db->prepare('SELECT * FROM otroscargos WHERE CAST(CodMod AS UNSIGNED) = CAST(:codmod AS UNSIGNED) ORDER BY FecInic, Id');
    $consultaExperiencia->execute(['codmod' => $codmod]);
    foreach ($consultaExperiencia->fetchAll() as $fila) $experienciaLaboral[] = [
        'sector' => 'PÚBLICO',
        'entidad' => trim((string)($fila['Ce'] ?? '')),
        'cargo' => trim((string)($fila['Cargo'] ?? $fila['CarNom'] ?? '')),
        'funciones' => trim((string)($fila['Descripcion'] ?? '')),
        'inicio' => $fechaValida($fila['FecInic'] ?? ''),
        'fin' => $fechaValida($fila['FecFin'] ?? ''),
        'documento' => trim((string)($fila['NroRes'] ?? $fila['Res'] ?? '')),
        'fechaDocumento' => $fechaValida($fila['FechaRes'] ?? ''),
        'estado' => '', '_deleteSource'=>'otroscargos', '_deleteKey'=>trim((string)($fila['Id'] ?? '')),
    ];

    $beneficios = [];
    $consultaBeneficios = $db->prepare('SELECT b.*, mb.BEN_NOMBRE FROM beneficio b LEFT JOIN movimiento_beneficio mb ON mb.IDBENEFICIO=b.IDBENEFICIO WHERE CAST(b.cod_modu AS UNSIGNED)=CAST(:codmod AS UNSIGNED) ORDER BY b.ocurr, b.X_LLAVE');
    $consultaBeneficios->execute(['codmod'=>$codmod]);
    foreach ($consultaBeneficios->fetchAll() as $fila) $beneficios[] = [
        'accion'=>trim((string)($fila['BEN_NOMBRE'] ?? 'BENEFICIO')), 'motivo'=>trim((string)($fila['cod_acc'] ?? '')), 'resolucion'=>trim((string)($fila['res_com'] ?? '')),
        'fechaResolucion'=>$fechaValida($fila['fec_com'] ?? ''), 'importe'=>'', 'estado'=>'',
        '_deleteSource'=>'beneficio', '_deleteKey'=>trim((string)($fila['X_LLAVE'] ?? ''))
    ];

    $subsidios = [];
    $consultaSubsidios = $db->prepare('SELECT t.*, bt.BET_NOMBRE FROM transaccion_beneficio t LEFT JOIN transaccion_beneficio_tipo bt ON bt.IDBENTIPO=t.tip_ben WHERE CAST(t.cod_modu AS UNSIGNED)=CAST(:codmod AS UNSIGNED) ORDER BY t.ocurr, t.X_LLAVE');
    $consultaSubsidios->execute(['codmod'=>$codmod]);
    foreach ($consultaSubsidios->fetchAll() as $fila) $subsidios[] = [
        'accion'=>trim((string)($fila['BET_NOMBRE'] ?? 'BENEFICIO')), 'motivo'=>trim((string)($fila['DETALLE'] ?? '')), 'resolucion'=>trim((string)($fila['res_ben'] ?? '')),
        'fechaResolucion'=>$fechaValida($fila['fec_ben'] ?? ''), 'fechaFallecimiento'=>$fechaValida($fila['FECHA_NACIMIENTO'] ?? ''),
        'importe'=>trim((string)($fila['monto_beneficio'] ?? '')), 'beneficiario'=>trim((string)($fila['BENEFICIARIO'] ?? '')), 'estado'=>'',
        '_deleteSource'=>'transaccion_beneficio', '_deleteKey'=>trim((string)($fila['X_LLAVE'] ?? ''))
    ];

    $cts = [];
    $consultaCts = $db->prepare("SELECT * FROM transaccion_beneficio WHERE CAST(cod_modu AS UNSIGNED)=CAST(:codmod AS UNSIGNED) AND UPPER(DETALLE) LIKE '%CTS%' ORDER BY ocurr, X_LLAVE");
    $consultaCts->execute(['codmod'=>$codmod]);
    foreach ($consultaCts->fetchAll() as $fila) $cts[] = [
        'accion'=>'CTS', 'motivo'=>trim((string)($fila['DETALLE'] ?? '')), 'resolucion'=>trim((string)($fila['res_ben'] ?? '')),
        'fechaCese'=>$fechaValida($fila['fec_ben'] ?? ''), 'tiempo'=>trim((string)($fila['annio_beneficio'] ?? '')), 'estado'=>'', '_deleteSource'=>'transaccion_beneficio', '_deleteKey'=>trim((string)($fila['X_LLAVE'] ?? ''))
    ];

    $meritos = [];
    $consultaMeritos = $db->prepare('SELECT t.*, m.MME_NOMBRE FROM transaccion_merito t LEFT JOIN movimiento_merito m ON m.IDMOVMERITO=t.tip_mer WHERE CAST(t.cod_modu AS UNSIGNED)=CAST(:codmod AS UNSIGNED) ORDER BY t.ocurr, t.X_LLAVE');
    $consultaMeritos->execute(['codmod'=>$codmod]);
    foreach ($consultaMeritos->fetchAll() as $fila) $meritos[] = [
        'tipo'=>trim((string)($fila['MME_NOMBRE'] ?? '')), 'motivo'=>trim((string)($fila['DESCRIPCION'] ?? '')), 'resolucion'=>trim((string)($fila['res_mer'] ?? '')),
        'fecha'=>$fechaValida($fila['fec_mer'] ?? ''), 'accionCodigo'=>trim((string)($fila['cod_acc'] ?? '')), 'estado'=>'', '_deleteSource'=>'transaccion_merito', '_deleteKey'=>trim((string)($fila['X_LLAVE'] ?? ''))
    ];

    $sanciones = [];
    $consultaSanciones = $db->prepare('SELECT * FROM suspension WHERE CAST(CODMOD AS UNSIGNED)=CAST(:codmod AS UNSIGNED) ORDER BY X_LLAVE');
    $consultaSanciones->execute(['codmod'=>$codmod]);
    foreach ($consultaSanciones->fetchAll() as $fila) $sanciones[] = [
        'sancion'=>trim((string)($fila['MOTIVO'] ?? '')), 'resolucion'=>trim((string)($fila['RES_NUMERO'] ?? '')), 'fechaResolucion'=>$fechaValida($fila['RES_FECHA'] ?? ''),
        'anios'=>(int)($fila['ANNIO'] ?? 0), 'meses'=>(int)($fila['MES'] ?? 0), 'dias'=>(int)($fila['DIA'] ?? 0), 'estado'=>'', '_deleteSource'=>'suspension', '_deleteKey'=>trim((string)($fila['X_LLAVE'] ?? ''))
    ];

    $licenciasConGoce = [];
    $consultaConGoce = $db->prepare('SELECT * FROM liccongoce WHERE CAST(CodMod AS UNSIGNED)=CAST(:codmod AS UNSIGNED) ORDER BY Id');
    $consultaConGoce->execute(['codmod'=>$codmod]);
    foreach ($consultaConGoce->fetchAll() as $fila) $licenciasConGoce[] = [
        'accion'=>'LICENCIA CON GOCE', 'motivo'=>trim((string)($fila['Motivo'] ?? '')), 'dias'=>trim((string)($fila['TotDias'] ?? '')),
        'inicio'=>$fechaValida($fila['FecInic'] ?? ''), 'fin'=>$fechaValida($fila['FecTer'] ?? ''), 'resolucion'=>trim((string)($fila['Resol'] ?? '')), 'fechaResolucion'=>$fechaValida($fila['FecRes'] ?? ''), 'estado'=>'', '_deleteSource'=>'liccongoce', '_deleteKey'=>trim((string)($fila['Id'] ?? ''))
    ];
    $licenciasSinGoce = [];
    $consultaSinGoce = $db->prepare('SELECT * FROM licsingoce WHERE CAST(codmod AS UNSIGNED)=CAST(:codmod AS UNSIGNED) ORDER BY id');
    $consultaSinGoce->execute(['codmod'=>$codmod]);
    foreach ($consultaSinGoce->fetchAll() as $fila) $licenciasSinGoce[] = [
        'accion'=>'LICENCIA SIN GOCE', 'motivo'=>trim((string)($fila['Descripcion'] ?? '')), 'dias'=>trim((string)($fila['TotalDias'] ?? '')),
        'inicio'=>$fechaValida($fila['FecInic'] ?? ''), 'fin'=>$fechaValida($fila['FecFin'] ?? ''), 'resolucion'=>trim((string)($fila['resol'] ?? '')), 'fechaResolucion'=>$fechaValida($fila['fecres'] ?? ''), 'estado'=>'', '_deleteSource'=>'licsingoce', '_deleteKey'=>trim((string)($fila['id'] ?? ''))
    ];

    $ceses = [];
    $consultaCeses = $db->prepare('SELECT * FROM transaccion_cesante WHERE CAST(cod_modu AS UNSIGNED)=CAST(:codmod AS UNSIGNED) ORDER BY ocurr, X_LLAVE');
    $consultaCeses->execute(['codmod'=>$codmod]);
    foreach ($consultaCeses->fetchAll() as $fila) $ceses[] = [
        'accion'=>'CESE', 'motivo'=>trim((string)($fila['DESCRIPCION'] ?? '')), 'resolucion'=>trim((string)($fila['res_cese'] ?? '')),
        'fechaCese'=>$fechaValida($fila['fec_cese'] ?? ''), 'anios'=>trim((string)($fila['ANNIO_SECTOR'] ?? '')), 'meses'=>trim((string)($fila['MES_SECTOR'] ?? '')), 'dias'=>trim((string)($fila['DIA_SECTOR'] ?? '')), 'tiempo'=>trim(implode(' ', array_filter([($fila['ANNIO_SECTOR'] ?? '') !== '' ? $fila['ANNIO_SECTOR'].' AÑOS' : '', ($fila['MES_SECTOR'] ?? '') !== '' ? $fila['MES_SECTOR'].' MESES' : '', ($fila['DIA_SECTOR'] ?? '') !== '' ? $fila['DIA_SECTOR'].' DÍAS' : '']))), 'estado'=>'', '_deleteSource'=>'transaccion_cesante', '_deleteKey'=>trim((string)($fila['X_LLAVE'] ?? ''))
    ];

    $observacionesRegistros = [];
    $consultaObservaciones = $db->prepare('SELECT * FROM observaciones WHERE CAST(CODMOD AS UNSIGNED)=CAST(:codmod AS UNSIGNED) ORDER BY Id');
    $consultaObservaciones->execute(['codmod'=>$codmod]);
    foreach ($consultaObservaciones->fetchAll() as $fila) $observacionesRegistros[] = ['motivo'=>trim((string)($fila['MOTIVO'] ?? '')), 'resolucion'=>trim((string)($fila['RESOLUCION'] ?? '')), 'fecha'=>$fechaValida($fila['RESOLUCION_FECHA'] ?? ''), '_deleteSource'=>'observaciones', '_deleteKey'=>trim((string)($fila['Id'] ?? ''))];

    $otrosDocumentos = [];
    $consultaDocumentos = $db->prepare('SELECT ed.*, d.NOM_DOCUMENTO AS tipo_nombre FROM empleado_documento ed LEFT JOIN documento d ON d.COD_DOCUMENTO=ed.COD_DOCUMENTO WHERE CAST(ed.CODMOD AS UNSIGNED)=CAST(:codmod AS UNSIGNED)');
    $consultaDocumentos->execute(['codmod'=>$codmod]);
    foreach ($consultaDocumentos->fetchAll() as $fila) $otrosDocumentos[] = ['tipo'=>trim((string)($fila['tipo_nombre'] ?? $fila['NOM_DOCUMENTO'] ?? '')), 'estado'=>trim((string)($fila['OK'] ?? '')), '_deleteSource'=>'empleado_documento', '_deleteKey'=>trim((string)($fila['COD_DOCUMENTO'] ?? ''))];

    $tiposPension = [];
    $consultaTiposPension = $db->prepare('SELECT * FROM tipo_pension_registro WHERE codmod=:codmod OR dni=:dni ORDER BY id DESC');
    $consultaTiposPension->execute(['codmod'=>$codmod, 'dni'=>$dni]);
    foreach ($consultaTiposPension->fetchAll() as $fila) $tiposPension[] = [
        'id'=>(int)$fila['id'], 'tipoPension'=>trim((string)$fila['tipo_pension']), 'numeroResolucion'=>trim((string)$fila['numero_resolucion']),
        'fechaResolucion'=>$fechaValida($fila['fecha_resolucion'] ?? ''), 'tipoPensionista'=>trim((string)$fila['tipo_pensionista']),
        'pensionSobrevivencia'=>trim((string)($fila['pension_sobrevivencia'] ?? '')), 'beneficiario'=>trim((string)($fila['beneficiario'] ?? '')),
        'estado'=>trim((string)$fila['estado']), 'documento'=>trim((string)$fila['documento']), '_deleteSource'=>'tipo_pension_registro', '_deleteKey'=>trim((string)($fila['id'] ?? ''))
    ];

    $fechaNacimiento = '';
    $fechaOriginal = (string) $persona['FecNac'];
    if ($fechaOriginal !== '' && !str_starts_with($fechaOriginal, '0000-00-00')) {
        $fechaNacimiento = date('d/m/Y', strtotime($fechaOriginal));
    } elseif (preg_match('/^(\d{2})(\d{2})(\d{2})/', trim((string) $persona['cs']), $partes)) {
        $anio = (int) $partes[1];
        $anio += $anio <= (int) date('y') ? 2000 : 1900;
        if (checkdate((int) $partes[2], (int) $partes[3], $anio)) $fechaNacimiento = sprintf('%02d/%02d/%04d', $partes[3], $partes[2], $anio);
    }

    $tipoServidor = $persona['ChkDoc'] != 0 ? 'DOCENTE' : ($persona['ChkAdm'] != 0 ? 'ADMINISTRATIVO' : ($persona['ChkAux'] != 0 ? 'AUXILIAR' : ($persona['ChkPrs'] != 0 ? 'PROFESIONAL DE LA SALUD' : 'OTRO')));

    // ChkDoc identifica al servidor como docente, pero no distingue entre la
    // educación básica (Ley 29944) y la superior no universitaria (Ley 30512).
    // Para esa distinción usamos los datos laborales reales registrados en alfa4.
    $referenciaLaboral = strtoupper(implode(' ', [
        (string) ($laboral['NivModEdu'] ?? ''),
        (string) ($laboral['CARGOS_DESCRIPCION'] ?? ''),
        (string) ($laboral['CE'] ?? ''),
    ]));
    $referenciaLaboral = strtr($referenciaLaboral, [
        'Á' => 'A', 'É' => 'E', 'Í' => 'I', 'Ó' => 'O', 'Ú' => 'U', 'Ü' => 'U', 'Ñ' => 'N',
    ]);
    $esSuperiorNoUniversitaria = str_contains($referenciaLaboral, 'E.S.N.U')
        || str_contains($referenciaLaboral, 'EDUCACION SUPERIOR NO UNIVERSITARIA')
        || str_contains($referenciaLaboral, 'INSTITUTO SUP. PEDAGOGICO')
        || str_contains($referenciaLaboral, 'INSTITUTO SUPERIOR PEDAGOGICO')
        || str_contains($referenciaLaboral, 'INSTITUTO SUP. TECNOLOGICO')
        || str_contains($referenciaLaboral, 'INSTITUTO SUPERIOR TECNOLOGICO');

    if ($tipoServidor === 'ADMINISTRATIVO') {
        $regimenLaboral = 'DECRETO LEGISLATIVO 276 - CARRERA ADMINISTRATIVA';
    } elseif ($esSuperiorNoUniversitaria) {
        $regimenLaboral = 'LEY 30512 - EDUCACIÓN SUPERIOR NO UNIVERSITARIA';
    } elseif ($tipoServidor === 'DOCENTE') {
        $regimenLaboral = 'LEY N° 29944 - REFORMA MAGISTERIAL';
    } else {
        $regimenLaboral = $tipoServidor;
    }
    $condicion = trim((string) ($laboral['Condicion'] ?? ''));
    if ($condicion === '') $condicion = $persona['NOMBRADO_ACTIVO'] != 0 ? 'NOMBRADO' : ($persona['CONTRATADO_ACTIVO'] != 0 ? 'CONTRATADO' : 'REGISTRADO');
    $fallecido = ((int)($persona['CONTRATADO_FALLECIDO'] ?? 0) !== 0) || ((int)($persona['NOMBRADO_FALLECIDO'] ?? 0) !== 0);
    $situacion = $fallecido || $persona['Retirado'] != 0 || $persona['Cese'] != 0 ? 'RETIRADO' : 'EN ACTIVIDAD';
    $direccionRegional = '';
    $codigoRegional = trim((string)($laboral['cod_sedr'] ?? $persona['COD_SEDE'] ?? ''));
    if ($codigoRegional !== '') {
        $consultaRegional = $db->prepare('SELECT nombre FROM sedesadm WHERE cod_sede=:codigo LIMIT 1');
        $consultaRegional->execute(['codigo'=>$codigoRegional]);
        $direccionRegional = trim((string)($consultaRegional->fetchColumn() ?: ''));
    }
    $nivelEducativoActual = '';
    $claveNivel = trim((string)($laboral['CLAVE_NIVEL'] ?? ''));
    if ($claveNivel !== '' && !preg_match('/^[A-Za-z]{3}-\d{2}$/', $claveNivel)) {
        $consultaNivel = $db->prepare('SELECT NIVEL_DESCRIPCION FROM niveles WHERE NIVEL=:nivel LIMIT 1');
        $consultaNivel->execute(['nivel'=>$claveNivel]);
        $nivelEducativoActual = trim((string)($consultaNivel->fetchColumn() ?: ''));
    }
    $afiliacionesPension = [];
    $codigoAfp = trim((string)($persona['cod_afp'] ?? $persona['CODAFP'] ?? ''));
    $nombreAfp = trim((string)($persona['NOMAFP'] ?? ''));
    if ($nombreAfp === '' && $codigoAfp !== '') {
        $consultaAfp = $db->prepare('SELECT DES_AFP FROM afp WHERE COD_AFP=:codigo LIMIT 1');
        $consultaAfp->execute(['codigo'=>$codigoAfp]);
        $nombreAfp = trim((string)($consultaAfp->fetchColumn() ?: ''));
    }
    if ((int)($persona['CHKAFP'] ?? 0) !== 0 || ($codigoAfp !== '' && $codigoAfp !== '0')) $afiliacionesPension[] = [
        'regimen'=>'DECRETO LEY 25897 - SISTEMA PRIVADO DE PENSIONES', 'afp'=>$nombreAfp, 'tipoComision'=>'', 'cuspp'=>'', 'fechaAfiliacion'=>'',
        'fechaDesafiliacion'=>$fechaValida($persona['DESAFILIACION_FECHA'] ?? ''), 'fechaDevengue'=>'', 'estado'=>''
    ];
    $centroEducativo = [];
    $codigoCentro = trim((string) ($laboral['CodModCe'] ?? ''));
    if ($codigoCentro !== '') {
        $consultaCentro = $db->prepare('SELECT * FROM ccee WHERE CODMODCE = :codigo LIMIT 1');
        $consultaCentro->execute(['codigo' => $codigoCentro]);
        $centroEducativo = $consultaCentro->fetch() ?: [];
    }
    $codigoPlaza = trim((string) ($laboral['CODIGO_PLAZA'] ?? ''));
    if ($codigoPlaza === '' || preg_match('/^0+$/', $codigoPlaza)) $codigoPlaza = '';
    $trayectoriaActual = [
        'ultimoMovimiento' => '',
        'direccionRegional' => $direccionRegional,
        'unidadGestion' => trim((string) ($laboral['SUP_USE_ADE'] ?? $centroEducativo['SUP_USE_ADE'] ?? '')),
        'codigoPlaza' => $codigoPlaza,
        'modalidadEducativa' => trim((string) ($laboral['NivModEdu'] ?? '')),
        'nivelEducativo' => $nivelEducativoActual,
        'condicionLaboral' => strtoupper(trim((string) ($laboral['Condicion'] ?? $condicion))),
        'situacionLaboral' => $situacion,
        'codigoModularIE' => trim((string) ($centroEducativo['CODMOD'] ?? '')),
        'centroLaboral' => trim((string) ($laboral['CE'] ?? '')),
        'escalaCategoria' => trim((string) ($laboral['NivMag'] ?? '')),
        'cargo' => trim((string) ($laboral['CARGOS_DESCRIPCION'] ?? '')),
        'jornada' => trim((string) ($laboral['JLab'] ?? '')),
        'ubicacion' => trim(implode(' / ', array_filter([$laboral['DptoCe'] ?? '', $laboral['ProvCE'] ?? '', $laboral['DistritoCE'] ?? '']))),
    ];
    $apellidos = trim((string) $persona['ape']);
    $partesApellido = preg_split('/\s+/', $apellidos, 2);
    $codigoSede = trim((string) $persona['COD_SEDE']);
    if ($codigoSede === '' || preg_match('/^0+$/', $codigoSede)) {
        $codigoSede = trim((string) ($laboral['CodModCe'] ?? $persona['CODMODCE']));
    }
    $limpiarContacto = static function ($valor): string {
        $valor = trim((string) $valor);
        if ($valor === '' || preg_match('/^0+$/', $valor) || preg_match('/NO\s*REGISTRA/i', $valor)) return '';
        return $valor;
    };

    $contacto = [];
    if ($db->query("SHOW TABLES LIKE 'escalafon_contacto'")->fetchColumn()) {
        $consultaContacto = $db->prepare('SELECT * FROM escalafon_contacto WHERE dni = :dni LIMIT 1');
        $consultaContacto->execute(['dni' => trim((string) $persona['le'])]);
        $contacto = $consultaContacto->fetch() ?: [];
    }
    $detalle = [
        'nombreRegistro' => $apellidos . ', ' . trim((string) $persona['nom']),
        'dni' => trim((string) $persona['le']),
        'codigo' => trim((string) $persona['CODMOD_NUEVO']),
        'codigoAnterior' => trim((string) $persona['codmod']),
        'nombres' => trim((string) $persona['nom']),
        'primerApellido' => $partesApellido[0] ?? '',
        'segundoApellido' => $partesApellido[1] ?? '',
        'cargo' => trim((string) ($laboral['CARGOS_DESCRIPCION'] ?? $persona['NomNiv'])),
        'codigoCargo' => trim((string) ($laboral['Cargos_Codigo'] ?? $persona['ALFA4_CARGOS_CODIGO'])),
        'institucion' => trim((string) ($laboral['CE'] ?? '')),
        'centroCodigo' => $codigoSede,
        'ubicacion' => trim(implode(' / ', array_filter([$laboral['DptoCe'] ?? '', $laboral['ProvCE'] ?? '', $laboral['DistritoCE'] ?? '']))),
        'direccionCentro' => trim((string) ($laboral['Dir'] ?? '')),
        'regimen' => $regimenLaboral,
        'condicion' => strtoupper($condicion),
        'situacionLaboral' => $situacion,
        'fallecido' => $fallecido,
        'tipoServidor' => $tipoServidor,
        'estadoCivil' => strtoupper(str_replace(['(a)', '(A)'], '', trim((string) $persona['CondCiv']))),
        'sexo' => ((int) $persona['Sexo']) === 0 ? 'FEMENINO' : 'MASCULINO',
        'direccion' => trim((string) $persona['dom']),
        'tipoDireccion' => 'PRINCIPAL',
        'zonaDomicilio' => 'NO ESPECIFICADO',
        'tipoViaDomicilio' => trim((string) $persona['DOM_NOMPREFIJO']) ?: 'NO ESPECIFICADO',
        'direccionDomiciliariaRegistro' => trim((string) $persona['dom']),
        'estadoDomicilio' => 'APROBADO',
        'ubicacionDomicilio' => trim(implode(' / ', array_filter([$domicilio['DEPARTAMENTO'] ?? '', $domicilio['PROVINCIA'] ?? '', $domicilio['DISTRITO'] ?? '']))),
        'fechaNacimiento' => $fechaNacimiento,
        'paisNacimiento' => in_array(mb_strtoupper(trim((string) $persona['Nacion'])), ['PERUANA', 'PERU', 'PERÚ'], true) ? 'PERÚ' : (trim((string) $persona['Nacion']) ?: 'PERÚ'),
        'lugarNacimiento' => trim(implode(' / ', array_filter([$nacimiento['DEPARTAMENTO'] ?? $persona['dpto'], $nacimiento['PROVINCIA'] ?? $persona['prov'], $nacimiento['DISTRITO'] ?? $persona['lugnac']]))),
        'telefonoPrincipal' => $limpiarContacto($contacto['telefono_principal'] ?? $persona['Telefono']),
        'telefonoMovil' => $limpiarContacto($contacto['telefono_movil'] ?? $persona['Tel_1']),
        'correoLaboral' => $limpiarContacto($contacto['correo_laboral'] ?? $persona['email']),
        'correoPersonal' => $limpiarContacto($contacto['correo_personal'] ?? ''),
        'emergenciaNombre' => trim((string)($contacto['emergencia_nombre'] ?? '')),
        'emergenciaTelefonoFijo' => $limpiarContacto($contacto['emergencia_telefono_fijo'] ?? ''),
        'emergenciaTelefonoMovil' => $limpiarContacto($contacto['emergencia_telefono_movil'] ?? $persona['tel_referencia']),
        'idiomas' => trim((string) $persona['Idiomas']),
        'grupoSanguineo' => trim((string) $persona['GS']),
        'nacionalidad' => trim((string) $persona['Nacion']),
        'horasLaborales' => trim((string) ($laboral['JLab'] ?? $persona['N_H'])),
        'foto' => '',
        'familiares' => $familiares,
        'formacionAcademica' => $formacion,
        'capacitaciones' => $capacitaciones,
        'produccionIntelectual' => [],
        'idiomasAcademicos' => $idiomas,
        'ingresos' => $ingresos,
        'trayectoriaActual' => $trayectoriaActual,
        'desplazamientos' => $desplazamientos,
        'ascensos' => $ascensos,
        'experienciaLaboral' => $experienciaLaboral,
        'beneficios' => $beneficios,
        'subsidios' => $subsidios,
        'cts' => $cts,
        'afiliacionesPension' => $afiliacionesPension,
        'ceses' => $ceses,
        'meritos' => $meritos,
        'sancionesAdministrativas' => $sanciones,
        'licenciasConGoce' => $licenciasConGoce,
        'licenciasSinGoce' => $licenciasSinGoce,
        'observacionesRegistros' => $observacionesRegistros,
        'otrosDocumentos' => $otrosDocumentos,
        'tiposPension' => $tiposPension,
    ];

    $correcciones = require __DIR__ . '/correcciones-servidores.php';
    if (isset($correcciones[$dni])) {
        $detalle = array_replace($detalle, $correcciones[$dni]);
    }

    echo json_encode(['ok' => true, 'servidor' => $detalle], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $error) {
    error_log($error->getMessage());
    http_response_code(400);
    echo json_encode(['ok' => false, 'mensaje' => $error->getMessage()], JSON_UNESCAPED_UNICODE);
}
