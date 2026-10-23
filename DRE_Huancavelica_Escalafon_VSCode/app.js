(function () {
  'use strict';

  const page = location.pathname.split('/').pop() || 'index.html';
  const instituteCenterFallbacks = {
    '0421412':['PEDAGÓGICO HUANCAVELICA','SUPERIOR PEDAGÓGICA - ISP'],
    '0688069':['PEDAGÓGICO EDUCACIÓN FÍSICA','SUPERIOR PEDAGÓGICA - ISP'],
    '0688051':['TECNOLÓGICO HUANCAVELICA','SUPERIOR TECNOLÓGICA - IST'],
    '1058742':['TECNOLÓGICO AURAHUA','SUPERIOR TECNOLÓGICA - IST'],
    '1060110':['TECNOLÓGICO MANUEL SCORZA TORRE','SUPERIOR TECNOLÓGICA - IST'],
    '1058155':['TECNOLÓGICO CASTROVIRREYNA','SUPERIOR TECNOLÓGICA - IST'],
    '0803908':['TECNOLÓGICO CHURCAMPA','SUPERIOR TECNOLÓGICA - IST'],
    '1389956':['TECNOLÓGICO COLCABAMBA','SUPERIOR TECNOLÓGICA - IST'],
    '1350404':['TECNOLÓGICO SAN PEDRO','SUPERIOR TECNOLÓGICA - IST'],
    '1059245':['TECNOLÓGICO SAN JUAN BAUTISTA','SUPERIOR TECNOLÓGICA - IST'],
    '1403575':['TECNOLÓGICO VIRGEN DE COCHARCAS','SUPERIOR TECNOLÓGICA - IST'],
    '1403559':['TECNOLÓGICO LIRCAY','SUPERIOR TECNOLÓGICA - IST'],
    '1348697':['TECNOLÓGICO NUEVO OCCORO','SUPERIOR TECNOLÓGICA - IST'],
    '0743336':['TECNOLÓGICO PAMPAS','SUPERIOR TECNOLÓGICA - IST'],
    '1716323':['TECNOLÓGICO PAUCARÁ','SUPERIOR TECNOLÓGICA - IST'],
    '1389949':['TECNOLÓGICO PAZOS','SUPERIOR TECNOLÓGICA - IST'],
    '1280668':['TECNOLÓGICO LA CANTUTA','SUPERIOR TECNOLÓGICA - IST'],
    '1058650':['TECNOLÓGICO TICRAPO','SUPERIOR TECNOLÓGICA - IST'],
    '1389980':['TECNOLÓGICO SAN JOSÉ','SUPERIOR TECNOLÓGICA - IST']
  };
  const getInstituteCenterFallback = code => {
    const item = instituteCenterFallbacks[String(code || '').trim()];
    return item ? {codigo:String(code).trim(),nombre:item[0].replace(/^(PEDAGÓGICO|TECNOLÓGICO)\s+/,''),iged:'DRE HUANCAVELICA',nivel:item[1],modalidad:'SUP'} : null;
  };
  document.addEventListener('click', event => {
    const searchButton = event.target.closest?.('.run-center-search');
    if (!searchButton) return;
    const centerModal = searchButton.closest('.center-search-overlay');
    const code = centerModal?.querySelector('.center-code-filter')?.value.trim() || '';
    const institute = getInstituteCenterFallback(code);
    if (!centerModal || !institute) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const resultsBody = centerModal.querySelector('.center-results-body');
    if (resultsBody) {
      resultsBody.innerHTML = `<button type="button" data-code="${institute.codigo}"><span>${institute.codigo}</span><span>${institute.nombre}</span><span>${institute.iged}</span><span>${institute.nivel}</span><span>${institute.modalidad}</span></button>`;
    }
    const totals = centerModal.querySelectorAll('.center-results footer b');
    if (totals[0]) totals[0].textContent = '1';
    if (totals[1]) totals[1].textContent = '1';
  }, true);
  document.addEventListener('dblclick', event => {
    const resultRow = event.target.closest?.('.center-results-body button[data-code]');
    if (!resultRow) return;
    const institute = getInstituteCenterFallback(resultRow.dataset.code);
    const centerModal = resultRow.closest('.center-search-overlay');
    const displacementPanels = document.querySelectorAll('#displacement-detail-fields fieldset');
    const originPanel = centerModal?.dataset.displacementTarget === 'destination' ? displacementPanels[1] : displacementPanels[0];
    if (!institute || !centerModal || !originPanel) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const originCode = originPanel.querySelector('input[placeholder="Código modular IE"]');
    if (originCode) originCode.value = institute.codigo;
    const originCenter = originPanel.querySelector('[data-origin-center]');
    const originRegion = originPanel.querySelector('[data-origin-region]');
    const originIged = originPanel.querySelector('[data-origin-iged]');
    if (originCenter) originCenter.textContent = institute.nombre;
    if (originRegion) originRegion.textContent = 'DIRECCIÓN REGIONAL DE EDUCACIÓN HUANCAVELICA';
    if (originIged) originIged.textContent = institute.iged;
    const centerHidden = originPanel.querySelector('[data-center-hidden]');
    if (centerHidden) centerHidden.value = institute.nombre;
    centerModal.remove();
  }, true);
  const routes = {
    'resumen-general': 'dashboard.html', 'servidores-publicos': 'servidores.html',
    'ficha-de-escalafon': 'ficha.html', 'legajo-digital': 'legajo.html',
    'traslado-de-legajos': 'traslado.html', 'auditoria-y-trazabilidad': 'auditoria-trazabilidad.html',
    'control-de-usuarios': 'control-usuarios.html', 'configuracion-institucional': 'configuracion-institucional.html',
    'requerimientos': 'requerimientos.html', 'bandeja-de-solicitudes': 'bandeja-solicitudes.html',
    'acciones-formativas': 'acciones-formativas.html', 'resoluciones-y-licencias': 'resoluciones-licencias.html',
    'reportes-y-exportacion': 'reportes-exportacion.html', 'login': 'index.html'
  };
  const activeRouteByPage = {
    'dashboard.html': 'resumen-general',
    'servidores.html': 'servidores-publicos',
    'ficha.html': 'ficha-de-escalafon',
    'legajo.html': 'legajo-digital',
    'traslado.html': 'traslado-de-legajos',
    'auditoria.html': 'auditoria-y-trazabilidad'
    ,'requerimientos.html': 'requerimientos'
    ,'bandeja-solicitudes.html': 'bandeja-de-solicitudes'
    ,'acciones-formativas.html': 'acciones-formativas'
    ,'resoluciones-licencias.html': 'resoluciones-y-licencias'
    ,'reportes-exportacion.html': 'reportes-y-exportacion'
    ,'control-usuarios.html': 'control-de-usuarios'
    ,'auditoria-trazabilidad.html': 'auditoria-y-trazabilidad'
    ,'configuracion-institucional.html': 'configuracion-institucional'
  };

  const standaloneContent = {
    'acciones-formativas.html': `<section class="space-y-6"><div><p class="text-sm text-on-surface-variant">Desarrollo y Acciones</p><h1 class="text-3xl font-bold text-primary">Acciones Formativas</h1><p class="mt-2 text-on-surface-variant">Registro y seguimiento de capacitaciones del personal docente y administrativo.</p></div><div class="grid md:grid-cols-3 gap-4"><article class="bg-white rounded-xl p-5 shadow-sm"><p class="text-sm text-on-surface-variant">Capacitaciones activas</p><strong class="text-3xl text-primary">12</strong></article><article class="bg-white rounded-xl p-5 shadow-sm"><p class="text-sm text-on-surface-variant">Participantes</p><strong class="text-3xl text-primary">486</strong></article><article class="bg-white rounded-xl p-5 shadow-sm"><p class="text-sm text-on-surface-variant">Certificados emitidos</p><strong class="text-3xl text-primary">351</strong></article></div><div class="bg-white rounded-xl p-6 shadow-sm"><div class="flex justify-between items-center mb-4"><h2 class="text-xl font-bold">Programación formativa</h2><button type="button" class="px-4 py-2 rounded-lg bg-secondary text-white">Agregar capacitación</button></div><table class="w-full text-left"><thead><tr><th class="p-3">Actividad</th><th>Modalidad</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead><tbody><tr class="border-t"><td class="p-3">Gestión del legajo digital</td><td>Virtual</td><td>18/11/2026</td><td>Programada</td><td><button type="button" title="Ver detalle">Ver</button></td></tr><tr class="border-t"><td class="p-3">Normativa escalafonaria</td><td>Presencial</td><td>02/12/2026</td><td>Inscripciones</td><td><button type="button" title="Ver detalle">Ver</button></td></tr></tbody></table></div></section>`,
    'resoluciones-licencias.html': `<section class="space-y-6"><div><p class="text-sm text-on-surface-variant">Desarrollo y Acciones</p><h1 class="text-3xl font-bold text-primary">Resoluciones y Licencias</h1><p class="mt-2 text-on-surface-variant">Consulta, registro y control de actos resolutivos, licencias y permisos.</p></div><div class="bg-white rounded-xl p-6 shadow-sm"><form class="grid md:grid-cols-4 gap-4 items-end"><label class="text-sm">Número de resolución<input name="resolucion" class="block w-full mt-1 p-2 rounded-lg bg-surface-container-low" placeholder="RD N°..."></label><label class="text-sm">Servidor<input name="servidor" class="block w-full mt-1 p-2 rounded-lg bg-surface-container-low" placeholder="DNI o nombres"></label><label class="text-sm">Tipo<select name="tipo" class="block w-full mt-1 p-2 rounded-lg bg-surface-container-low"><option>Todos</option><option>Resolución</option><option>Licencia</option><option>Permiso</option></select></label><button class="px-4 py-2 rounded-lg bg-primary text-white" type="submit">Buscar</button></form></div><div class="bg-white rounded-xl p-6 shadow-sm"><div class="flex justify-between mb-4"><h2 class="text-xl font-bold">Registro de actos administrativos</h2><button type="button" class="px-4 py-2 rounded-lg bg-secondary text-white">Nueva resolución</button></div><table class="w-full text-left"><thead><tr><th class="p-3">Documento</th><th>Servidor</th><th>Tipo</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead><tbody><tr class="border-t"><td class="p-3">RD N° 1482-2026</td><td>Gladys Palomino Rojas</td><td>Reasignación</td><td>08/09/2026</td><td>Vigente</td><td><button type="button" title="Ver PDF">Ver PDF</button></td></tr><tr class="border-t"><td class="p-3">RD N° 1391-2026</td><td>Carlos Quispe Huamán</td><td>Licencia</td><td>02/09/2026</td><td>Aprobada</td><td><button type="button" title="Ver detalle">Detalle</button></td></tr></tbody></table></div></section>`,
    'reportes-exportacion.html': `<section class="space-y-6"><div><p class="text-sm text-on-surface-variant">Desarrollo y Acciones</p><h1 class="text-3xl font-bold text-primary">Reportes y Exportación</h1><p class="mt-2 text-on-surface-variant">Generación de reportes institucionales y exportación de información consolidada.</p></div><div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4"><article class="bg-white rounded-xl p-6 shadow-sm"><h2 class="font-bold text-lg">Padrón de servidores</h2><p class="my-3 text-sm text-on-surface-variant">Relación consolidada por UGEL, régimen laboral y estado.</p><button type="button" title="Exportar padrón" class="px-4 py-2 rounded-lg bg-primary text-white">Exportar CSV</button></article><article class="bg-white rounded-xl p-6 shadow-sm"><h2 class="font-bold text-lg">Estado de legajos</h2><p class="my-3 text-sm text-on-surface-variant">Avance de digitalización, documentos faltantes y observaciones.</p><button type="button" title="Descargar informe" class="px-4 py-2 rounded-lg bg-primary text-white">Descargar reporte</button></article><article class="bg-white rounded-xl p-6 shadow-sm"><h2 class="font-bold text-lg">Trámites y solicitudes</h2><p class="my-3 text-sm text-on-surface-variant">Indicadores de atención, plazos y resultados por periodo.</p><button type="button" title="Exportar trámites" class="px-4 py-2 rounded-lg bg-primary text-white">Exportar CSV</button></article></div><div class="bg-white rounded-xl p-6 shadow-sm"><h2 class="text-xl font-bold mb-4">Generar reporte personalizado</h2><form class="grid md:grid-cols-4 gap-4 items-end"><label class="text-sm">Desde<input name="desde" type="date" class="block w-full mt-1 p-2 rounded-lg bg-surface-container-low"></label><label class="text-sm">Hasta<input name="hasta" type="date" class="block w-full mt-1 p-2 rounded-lg bg-surface-container-low"></label><label class="text-sm">Formato<select name="formato" class="block w-full mt-1 p-2 rounded-lg bg-surface-container-low"><option>CSV</option><option>PDF</option></select></label><button class="px-4 py-2 rounded-lg bg-secondary text-white" type="submit">Generar reporte</button></form></div></section>`,
    'control-usuarios.html': `<section class="space-y-6"><div><p class="text-sm text-on-surface-variant">Seguridad y Sistema</p><h1 class="text-3xl font-bold text-primary">Control de Usuarios</h1><p class="mt-2 text-on-surface-variant">Administración de accesos, perfiles y estado de las cuentas institucionales.</p></div><div class="grid md:grid-cols-3 gap-4"><article class="bg-white p-5 rounded-xl shadow-sm"><p>Usuarios activos</p><strong class="text-3xl">84</strong></article><article class="bg-white p-5 rounded-xl shadow-sm"><p>Administradores</p><strong class="text-3xl">12</strong></article><article class="bg-white p-5 rounded-xl shadow-sm"><p>Accesos bloqueados</p><strong class="text-3xl">3</strong></article></div><div class="bg-white p-6 rounded-xl shadow-sm"><div class="flex justify-between mb-4"><h2 class="text-xl font-bold">Usuarios del sistema</h2><button type="button" class="px-4 py-2 rounded-lg bg-secondary text-white">Nuevo usuario</button></div><table class="w-full text-left"><thead><tr><th class="p-3">Usuario</th><th>Rol</th><th>Dependencia</th><th>Estado</th><th>Acciones</th></tr></thead><tbody><tr class="border-t"><td class="p-3">Juan Carlos Ramos</td><td>Administrador</td><td>DRE Huancavelica</td><td>Activo</td><td><button type="button" title="Ver detalle">Administrar</button></td></tr><tr class="border-t"><td class="p-3">María Quispe Soto</td><td>Especialista</td><td>UGEL Tayacaja</td><td>Activo</td><td><button type="button" title="Ver detalle">Administrar</button></td></tr></tbody></table></div></section>`,
    'auditoria-trazabilidad.html': `<section class="space-y-6"><div><p class="text-sm text-on-surface-variant">Seguridad y Sistema</p><h1 class="text-3xl font-bold text-primary">Auditoría y Trazabilidad</h1><p class="mt-2 text-on-surface-variant">Registro verificable de operaciones realizadas dentro del sistema.</p></div><div class="bg-white p-6 rounded-xl shadow-sm"><form class="grid md:grid-cols-4 gap-4 items-end"><label class="text-sm">Usuario<input name="usuario" class="block w-full mt-1 p-2 rounded-lg bg-surface-container-low" placeholder="Nombre o usuario"></label><label class="text-sm">Fecha<input name="fecha" type="date" class="block w-full mt-1 p-2 rounded-lg bg-surface-container-low"></label><label class="text-sm">Módulo<select name="modulo" class="block w-full mt-1 p-2 rounded-lg bg-surface-container-low"><option>Todos</option><option>Legajos</option><option>Solicitudes</option><option>Usuarios</option></select></label><button class="px-4 py-2 rounded-lg bg-primary text-white" type="submit">Consultar</button></form></div><div class="bg-white p-6 rounded-xl shadow-sm"><h2 class="text-xl font-bold mb-4">Eventos recientes</h2><table class="w-full text-left"><thead><tr><th class="p-3">Fecha y hora</th><th>Usuario</th><th>Operación</th><th>Módulo</th><th>Resultado</th></tr></thead><tbody><tr class="border-t"><td class="p-3">10/09/2026 11:42</td><td>jramos</td><td>Consulta de legajo</td><td>Legajos</td><td>Correcto</td></tr><tr class="border-t"><td class="p-3">10/09/2026 11:35</td><td>mquispe</td><td>Aprobación documental</td><td>Solicitudes</td><td>Correcto</td></tr></tbody></table></div></section>`,
    'configuracion-institucional.html': `<section class="space-y-6"><div><p class="text-sm text-on-surface-variant">Seguridad y Sistema</p><h1 class="text-3xl font-bold text-primary">Configuración Institucional</h1><p class="mt-2 text-on-surface-variant">Parámetros generales de la Dirección Regional de Educación.</p></div><form class="bg-white p-6 rounded-xl shadow-sm space-y-5"><div class="grid md:grid-cols-2 gap-5"><label>Nombre institucional<input name="institucion" value="Dirección Regional de Educación Huancavelica" class="block w-full mt-1 p-3 rounded-lg bg-surface-container-low"></label><label>Correo institucional<input name="correo" type="email" value="mesa.partes@dreh.gob.pe" class="block w-full mt-1 p-3 rounded-lg bg-surface-container-low"></label><label>Teléfono<input name="telefono" value="067 451234" class="block w-full mt-1 p-3 rounded-lg bg-surface-container-low"></label><label>Zona horaria<select name="zona" class="block w-full mt-1 p-3 rounded-lg bg-surface-container-low"><option>America/Lima</option></select></label><label>Plazo predeterminado de atención<input name="plazo" type="number" value="15" min="1" class="block w-full mt-1 p-3 rounded-lg bg-surface-container-low"></label><label>Formato correlativo<input name="correlativo" value="DREH-{AÑO}-{NÚMERO}" class="block w-full mt-1 p-3 rounded-lg bg-surface-container-low"></label></div><div class="flex justify-end"><button type="submit" class="px-5 py-2.5 rounded-lg bg-primary text-white">Guardar configuración</button></div></form></section>`
  };

  document.querySelectorAll('[data-path]').forEach(a => {
    const route = routes[a.dataset.path];
    if (route) a.setAttribute('href', route);
  });

  // Escalafón no gestiona solicitudes: retirar estos accesos del menú general.
  document.querySelectorAll('[data-path="requerimientos"], [data-path="bandeja-de-solicitudes"]').forEach(link => link.remove());
  const activeRoute = activeRouteByPage[page];
  document.querySelectorAll('aside nav [data-path]').forEach(link => {
    const isActive = link.dataset.path === activeRoute;
    link.removeAttribute('aria-current');
    link.classList.remove('bg-primary-container', 'text-on-primary');
    link.classList.add('text-on-surface-variant');
    if (isActive) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('bg-primary-container', 'text-on-primary');
      link.classList.remove('text-on-surface-variant');
    }
  });
  if (standaloneContent[page]) {
    const root = document.querySelector('main > div');
    if (root) root.innerHTML = standaloneContent[page];
  }

  const globalServerSearch = document.querySelector('header input[type="text"]');
  if (globalServerSearch) {
    globalServerSearch.dataset.databaseSearch = 'true';
    globalServerSearch.placeholder = 'Buscar por DNI, nombre o apellido...';
    globalServerSearch.setAttribute('aria-label', 'Buscar servidor por DNI, nombre o apellido');
    globalServerSearch.setAttribute('autocomplete', 'off');
    const searchContainer = globalServerSearch.parentElement;
    if (searchContainer) searchContainer.style.position = 'relative';
    const resultsPanel = document.createElement('div');
    resultsPanel.hidden = true;
    resultsPanel.setAttribute('role', 'listbox');
    resultsPanel.style.cssText = 'position:absolute;top:calc(100% + 8px);left:0;right:0;z-index:1000;max-height:360px;overflow:auto;background:#fff;border:1px solid #d3e4fe;border-radius:12px;box-shadow:0 16px 36px rgba(15,42,74,.2);padding:6px;';
    searchContainer?.appendChild(resultsPanel);
    let searchTimer;
    let activeRequest;

    const hideResults = () => { resultsPanel.hidden = true; };
    const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
    const openServer = async server => {
      const selected = {
        nombreRegistro: `${server.apellidoPaterno} ${server.apellidoMaterno}, ${server.nombres}`.trim(),
        dni: server.dni || '',
        codigo: server.codigo || '',
        cargo: server.codigoCargo ? `Código de cargo: ${server.codigoCargo}` : '',
        institucion: '', ubicacion: '', detalleCargo: '', regimen: '', condicion: '', foto: ''
      };
      try {
        const response = await fetch(`api/servidor-detalle.php?dni=${encodeURIComponent(server.dni)}`, {cache:'no-store'});
        const data = await response.json();
        if (response.ok && data.ok) Object.assign(selected, data.servidor);
      } catch (_) {}
      sessionStorage.setItem('dre_admin_selected_server', JSON.stringify(selected));
      window.location.href = 'gestion-servidor.html';
    };
    const renderResults = results => {
      resultsPanel.innerHTML = '';
      if (!results.length) {
        resultsPanel.innerHTML = '<div style="padding:16px;text-align:center;color:#5b677a">No se encontraron servidores.</div>';
        resultsPanel.hidden = false;
        return;
      }
      results.forEach(server => {
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('role', 'option');
        button.style.cssText = 'display:block;width:100%;padding:11px 12px;border:0;border-radius:9px;background:#fff;text-align:left;cursor:pointer;color:#0b1c30;';
        button.innerHTML = `<strong style="display:block;font-size:13px">${escapeHtml(server.apellidoPaterno)} ${escapeHtml(server.apellidoMaterno)}, ${escapeHtml(server.nombres)}</strong><span style="display:flex;gap:14px;margin-top:4px;font-size:12px;color:#52647d"><span>DNI: ${escapeHtml(server.dni)}</span><span>Código: ${escapeHtml(server.codigo || 'No registrado')}</span></span>`;
        button.addEventListener('mouseenter', () => { button.style.background = '#eff4ff'; });
        button.addEventListener('mouseleave', () => { button.style.background = '#fff'; });
        button.addEventListener('click', () => openServer(server));
        resultsPanel.appendChild(button);
      });
      resultsPanel.hidden = false;
    };
    const searchDatabase = () => {
      clearTimeout(searchTimer);
      const query = globalServerSearch.value.trim();
      if (query.length < 2) { activeRequest?.abort(); hideResults(); return; }
      searchTimer = setTimeout(async () => {
        activeRequest?.abort();
        activeRequest = new AbortController();
        resultsPanel.innerHTML = '<div style="padding:16px;text-align:center;color:#5b677a">Buscando…</div>';
        resultsPanel.hidden = false;
        try {
          const response = await fetch(`api/buscar-servidores.php?q=${encodeURIComponent(query)}`, {cache:'no-store', signal:activeRequest.signal});
          const data = await response.json();
          if (!response.ok || !data.ok) throw new Error(data.mensaje || 'Error de búsqueda');
          renderResults(data.resultados || []);
        } catch (error) {
          if (error.name === 'AbortError') return;
          resultsPanel.innerHTML = `<div style="padding:16px;text-align:center;color:#a31d2d">${escapeHtml(error.message)}</div>`;
          resultsPanel.hidden = false;
        }
      }, 250);
    };
    globalServerSearch.addEventListener('input', searchDatabase);
    globalServerSearch.addEventListener('keydown', event => { if (event.key === 'Escape') hideResults(); });
    document.addEventListener('click', event => { if (!searchContainer?.contains(event.target)) hideResults(); });
  }
  if (page === 'dashboard.html') {
    fetch('api/padron.php?accion=estadisticas', {cache:'no-store'})
      .then(response => response.json())
      .then(data => {
        if (!data.ok) return;
        const stats = data.estadisticas;
        const cards = [...document.querySelectorAll('main .grid.grid-cols-1 > div')].slice(0, 6);
        const values = [stats.total, stats.docentes, stats.administrativos, stats.conDni, stats.conCodigo, stats.total - stats.conDni];
        cards.forEach((card, index) => {
          const value = card.querySelector('.text-headline-lg');
          if (value) value.textContent = Number(values[index] || 0).toLocaleString('es-PE');
        });
        const summary = cards[0]?.querySelectorAll('strong');
        if (summary?.[0]) summary[0].textContent = Number(stats.docentes).toLocaleString('es-PE');
        if (summary?.[1]) summary[1].textContent = Number(stats.administrativos).toLocaleString('es-PE');
      })
      .catch(() => {});
  }
  if (page === 'servidores.html') {
    const filterForm = document.getElementById('filter-form');
    const filterPanel = filterForm?.closest('section');
    if (filterPanel) filterPanel.remove();

    const serverTableBody = document.querySelector('tbody');
    if (serverTableBody) {
      serverTableBody.innerHTML = `<tr><td colspan="6" class="px-space-md py-12 text-center text-on-surface-variant"><span class="material-symbols-outlined text-4xl block mb-2">database</span><strong class="block text-on-surface mb-1">No hay servidores registrados</strong><span>Cargue la base de datos para visualizar la información.</span></td></tr>`;
    }
    const serverPagination = document.querySelector('.shadow-inner nav');
    if (serverPagination) {
      serverPagination.innerHTML = `<button class="p-1.5 rounded-lg text-on-surface-variant opacity-40" disabled type="button"><span class="material-symbols-outlined text-base">first_page</span></button><button class="p-1.5 rounded-lg text-on-surface-variant opacity-40" disabled type="button"><span class="material-symbols-outlined text-base">chevron_left</span></button><span class="px-2 text-on-surface-variant">Sin páginas</span><button class="p-1.5 rounded-lg text-on-surface-variant opacity-40" disabled type="button"><span class="material-symbols-outlined text-base">chevron_right</span></button><button class="p-1.5 rounded-lg text-on-surface-variant opacity-40" disabled type="button"><span class="material-symbols-outlined text-base">last_page</span></button>`;
    }

    const serverSearch = document.querySelector('header input[type="text"]');
    if (serverSearch && !serverSearch.dataset.databaseSearch) {
      serverSearch.dataset.serverSearch = 'true';
      serverSearch.placeholder = 'Buscar por DNI, nombre o apellido...';
      serverSearch.setAttribute('aria-label', 'Buscar servidor por DNI, nombre o apellido');
      const normalize = value => (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();
      const rows = [...document.querySelectorAll('tbody tr')].filter(row => row.cells[0]?.querySelector('.font-bold'));
      const resultBadge = [...document.querySelectorAll('span')].find(el => /Servidores$/.test(el.textContent.trim()));
      const searchServers = () => {
        const query = normalize(serverSearch.value);
        let visible = 0;
        rows.forEach(row => {
          const firstCell = row.cells[0];
          const fullName = normalize(firstCell?.querySelector('.font-bold')?.textContent);
          const dni = (firstCell?.innerText.match(/DNI:\s*(\d{8})/i) || [])[1] || '';
          const matches = !query || dni.includes(query) || fullName.includes(query);
          row.hidden = !matches;
          if (matches) visible++;
        });
        if (resultBadge) resultBadge.textContent = `${visible} ${visible === 1 ? 'Servidor' : 'Servidores'}`;
      };
      serverSearch.addEventListener('input', searchServers);
      serverSearch.addEventListener('search', searchServers);
    }
    document.querySelectorAll('tbody tr').forEach(row => {
      const nameElement = row.cells[0]?.querySelector('.font-bold');
      if (!nameElement) return;
      nameElement.setAttribute('role', 'link');
      nameElement.setAttribute('tabindex', '0');
      nameElement.title = 'Abrir ficha del servidor';
      const openServer = () => {
        const firstCell = row.cells[0];
        const dni = (firstCell.innerText.match(/DNI:\s*(\d{8})/i) || [])[1] || '';
        const codigo = (firstCell.innerText.match(/CM:\s*(\d+)/i) || [])[1] || '';
        const selected = {
          nombreRegistro: nameElement.textContent.trim(),
          dni,
          codigo,
          institucion: row.cells[1]?.querySelector('.font-semibold')?.textContent.trim() || '',
          ubicacion: row.cells[1]?.innerText.split('\n').slice(1).join(' ').trim(),
          cargo: row.cells[2]?.querySelector('.font-bold,.font-semibold')?.textContent.trim() || '',
          detalleCargo: row.cells[2]?.innerText.split('\n').slice(1).join(' ').trim(),
          regimen: row.cells[3]?.innerText.split('\n')[0]?.trim() || '',
          condicion: row.cells[3]?.innerText.split('\n').slice(1).join(' ').trim(),
          foto: firstCell.querySelector('img')?.src || ''
        };
        sessionStorage.setItem('dre_admin_selected_server', JSON.stringify(selected));
        window.location.href = 'gestion-servidor.html';
      };
      nameElement.addEventListener('click', openServer);
      nameElement.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openServer(); }
      });
    });

    let registryPage = 1;
    const pageSize = document.getElementById('table-pagesize');
    const registryFooter = document.querySelector('.shadow-inner .font-body-sm');
    const registryPagination = document.querySelector('.shadow-inner nav');
    const registryCards = [...document.querySelectorAll('main .grid.grid-cols-2 > div')].slice(0, 5);
    const safeText = value => String(value ?? '').replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
    const selectRegistryServer = async server => {
      let selected = {
        nombreRegistro: `${server.apellidoPaterno} ${server.apellidoMaterno}, ${server.nombres}`,
        dni: server.dni || '', codigo: server.codigo || '',
        cargo: server.codigoCargo ? `Código de cargo: ${server.codigoCargo}` : '',
        institucion: '', ubicacion: '', detalleCargo: '',
        regimen: server.regimen || server.tipo || '', condicion: server.condicion || 'Registro importado', foto: ''
      };
      try {
        const response = await fetch(`api/servidor-detalle.php?dni=${encodeURIComponent(server.dni)}`, {cache:'no-store'});
        const data = await response.json();
        if (response.ok && data.ok) selected = data.servidor;
      } catch (_) {}
      sessionStorage.setItem('dre_admin_selected_server', JSON.stringify(selected));
      window.location.href = 'gestion-servidor.html';
    };
    const updateRegistryCards = stats => {
      const values = [stats.total, stats.docentes, stats.administrativos, stats.conDni, stats.conCodigo];
      const labels = ['Total Servidores', 'Docentes', 'Administrativos', 'Con DNI', 'Con código'];
      registryCards.forEach((card, index) => {
        const label = card.querySelector('.uppercase');
        const value = card.querySelector('.text-headline-lg');
        const percent = value?.nextElementSibling;
        if (label) label.textContent = labels[index];
        if (value) value.textContent = Number(values[index] || 0).toLocaleString('es-PE');
        if (percent) percent.textContent = index ? `/ ${stats.total ? ((values[index] / stats.total) * 100).toFixed(1) : 0}%` : 'Datos de vgallardo';
      });
    };
    const loadRegistry = async (pageNumber = 1) => {
      const perPage = parseInt(pageSize?.value, 10) || 10;
      serverTableBody.innerHTML = '<tr><td colspan="6" class="px-space-md py-12 text-center text-on-surface-variant">Cargando servidores…</td></tr>';
      try {
        const response = await fetch(`api/padron.php?pagina=${pageNumber}&porPagina=${perPage}`, {cache:'no-store'});
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.mensaje || 'Error al cargar el padrón');
        registryPage = data.paginacion.pagina || 1;
        updateRegistryCards(data.estadisticas);
        const resultBadge = [...document.querySelectorAll('span')].find(element => /Servidores$/.test(element.textContent.trim()));
        if (resultBadge) resultBadge.textContent = `${Number(data.paginacion.total).toLocaleString('es-PE')} Servidores`;
        const pageDescription = resultBadge?.nextElementSibling;
        if (pageDescription) pageDescription.textContent = `| Página ${data.paginacion.pagina} de ${data.paginacion.paginas}`;
        if (!data.registros.length) {
          serverTableBody.innerHTML = '<tr><td colspan="6" class="px-space-md py-12 text-center text-on-surface-variant"><strong>No se encontraron servidores</strong></td></tr>';
        } else {
          serverTableBody.innerHTML = data.registros.map((server, index) => `<tr class="hover:bg-surface-container-low/70 transition-colors ${index % 2 ? 'bg-surface' : 'bg-surface-container-lowest'}"><td class="py-3 px-space-md"><button type="button" class="db-server-open text-left"><strong class="block text-on-surface">${safeText(server.apellidoPaterno)} ${safeText(server.apellidoMaterno)}, ${safeText(server.nombres)}</strong><span class="text-xs text-on-surface-variant">DNI: ${safeText(server.dni || 'No registrado')} · CM: ${safeText(server.codigo || 'No registrado')}</span></button></td><td class="py-3 px-space-md"><strong>Empresa ${safeText(server.empresa || 'No registrada')}</strong><span class="block text-xs text-on-surface-variant">Información importada</span></td><td class="py-3 px-space-md"><strong>Código ${safeText(server.codigoCargo || 'No registrado')}</strong><span class="block text-xs text-on-surface-variant">Cargo del padrón</span></td><td class="py-3 px-space-md text-center"><span class="px-2 py-1 rounded-full bg-surface-container-high text-primary">Tipo ${safeText(server.tipo || '—')}</span></td><td class="py-3 px-space-md text-center"><span class="text-on-tertiary-container">Registrado</span></td><td class="py-3 px-space-md text-right"><button type="button" class="db-server-open p-2 rounded-lg text-primary hover:bg-surface-container" title="Abrir ficha"><span class="material-symbols-outlined">assignment_ind</span></button></td></tr>`).join('');
          [...serverTableBody.rows].forEach((row, index) => row.querySelectorAll('.db-server-open').forEach(button => button.addEventListener('click', () => selectRegistryServer(data.registros[index]))));
        }
        const start = data.paginacion.total ? (data.paginacion.pagina - 1) * data.paginacion.porPagina + 1 : 0;
        const end = Math.min(data.paginacion.pagina * data.paginacion.porPagina, data.paginacion.total);
        if (registryFooter) registryFooter.innerHTML = `Mostrando <strong>${start}</strong>–<strong>${end}</strong> de <strong>${Number(data.paginacion.total).toLocaleString('es-PE')}</strong> servidores`;
        if (registryPagination) {
          registryPagination.innerHTML = `<button type="button" data-page="${registryPage - 1}" ${registryPage <= 1 ? 'disabled' : ''} class="p-2 disabled:opacity-30"><span class="material-symbols-outlined">chevron_left</span></button><strong class="px-3">${registryPage} / ${data.paginacion.paginas}</strong><button type="button" data-page="${registryPage + 1}" ${registryPage >= data.paginacion.paginas ? 'disabled' : ''} class="p-2 disabled:opacity-30"><span class="material-symbols-outlined">chevron_right</span></button>`;
          registryPagination.querySelectorAll('[data-page]:not([disabled])').forEach(button => button.addEventListener('click', () => loadRegistry(Number(button.dataset.page))));
        }
      } catch (error) {
        serverTableBody.innerHTML = `<tr><td colspan="6" class="px-space-md py-12 text-center text-error">${safeText(error.message)}</td></tr>`;
      }
    };
    pageSize?.addEventListener('change', () => loadRegistry(1));
    loadRegistry(1);
  }
  if (page === 'gestion-servidor.html') {
    let server = null;
    try { server = JSON.parse(sessionStorage.getItem('dre_admin_selected_server') || 'null'); } catch (_) {}
    if (!server) { window.location.replace('servidores.html'); return; }
    const currentDetailVersion = '20261022-regimen-administrativo-v136';
    if (server.dni && server.detalleVersion !== currentDetailVersion) {
      document.body.innerHTML = '<main style="min-height:100vh;display:grid;place-items:center;font-family:Arial,sans-serif;color:#0f2a4a"><div style="text-align:center"><strong style="display:block;font-size:18px;margin-bottom:8px">Cargando expediente completo…</strong><span>Consultando la base de datos vgallardo</span></div></main>';
      fetch(`api/servidor-detalle.php?dni=${encodeURIComponent(server.dni)}`, {cache:'no-store'})
        .then(response => response.json().then(data => ({response, data})))
        .then(({response, data}) => {
          if (!response.ok || !data.ok) throw new Error(data.mensaje || 'No se pudo cargar el expediente.');
          data.servidor.detalleCargado = true;
          data.servidor.detalleVersion = currentDetailVersion;
          sessionStorage.setItem('dre_admin_selected_server', JSON.stringify(data.servidor));
          window.location.reload();
        })
        .catch(error => {
          document.body.innerHTML = `<main style="min-height:100vh;display:grid;place-items:center;font-family:Arial,sans-serif;color:#8b1724"><div style="text-align:center"><strong style="display:block;font-size:18px;margin-bottom:8px">No se pudo cargar el expediente</strong><span>${String(error.message).replace(/[&<>]/g, '')}</span><br><a href="servidores.html" style="display:inline-block;margin-top:18px">Volver al padrón</a></div></main>`;
        });
      return;
    }
    const nameParts = server.nombreRegistro.split(',');
    const surnames = (nameParts[0] || '').trim().split(/\s+/);
    const names = server.nombres || (nameParts[1] || '').trim();
    const detail = (label, value) => `<div><strong>${label}</strong><span>${value || 'No registrado'}</span></div>`;
    document.documentElement.classList.add('admin-server-document');
    document.body.className = 'admin-server-page app-ready';
    document.body.innerHTML = `<header class="admin-server-top"><a href="servidores.html">☰</a><div class="admin-server-brand"><img src="logoDRE.jpg" alt="Logo DRE Huancavelica"><div><strong>DREHuancavelica</strong><small>GESTIÓN DE ESCALAFÓN</small></div></div><span>DRE HUANCAVELICA</span></header><div class="admin-server-breadcrumb"><span>Gestión de Escalafón</span><a href="servidores.html">Inicio / Servidores Públicos</a></div><main class="admin-server-layout"><aside class="admin-server-menu"><a class="active" href="#filiacion">I&nbsp;&nbsp; Filiación e Identificación</a><a href="#academica">II&nbsp;&nbsp; Situación académica</a><a href="#ingreso">III&nbsp;&nbsp; Ingreso o reingreso</a><a href="#trayectoria">IV&nbsp;&nbsp; Trayectoria laboral</a><a href="#asignaciones">V&nbsp;&nbsp; Asignaciones e incentivos</a><a href="#retiro">VI&nbsp;&nbsp; Retiro y régimen pensionario</a><a href="#premios">VII&nbsp;&nbsp; Premios y estímulos</a><a href="#sanciones">VIII&nbsp;&nbsp; Sanciones</a><a href="#licencias">IX&nbsp;&nbsp; Licencias y vacaciones</a><a href="#otros">X&nbsp;&nbsp; Otros</a><a href="#informe">▣&nbsp;&nbsp; Informe escalafonario</a><a href="#reporte">▣&nbsp;&nbsp; Reporte hoja de vida</a></aside><section class="admin-server-content"><fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs"><a class="active">Datos generales</a><a>Datos domiciliarios</a><a>Datos de familiares</a><a>Acreditación de lengua nativa</a><a>Declaración jurada y boleta de datos</a></nav><fieldset class="admin-server-card"><legend>Datos personales</legend><div class="admin-personal-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Nombres',names)}${detail('Primer apellido',surnames[0])}${detail('Segundo apellido',surnames.slice(1).join(' '))}${detail('Estado civil','No registrado')}${detail('Sexo','No registrado')}<div class="admin-server-photo">${server.foto ? `<img src="${server.foto}" alt="Foto de ${server.nombreRegistro}">` : '<span>👤</span>'}<small>Fotografía institucional</small><button type="button">CONSULTAR RENIEC</button></div></div></fieldset><fieldset class="admin-server-card"><legend>Dirección principal</legend><div class="admin-summary-grid">${detail('Dirección','No registrado')}${detail('Departamento / Provincia / Distrito',server.ubicacion)}</div></fieldset><fieldset class="admin-server-card"><legend>Fecha y lugar de nacimiento</legend><div class="admin-summary-grid">${detail('Fecha de nacimiento','No registrado')}${detail('País','Perú')}${detail('Departamento / Provincia / Distrito','No registrado')}</div></fieldset><fieldset class="admin-server-card"><legend>Fallecido</legend><label class="admin-input-field"><span>Fecha de fallecimiento</span><input type="date"></label></fieldset><fieldset class="admin-server-card"><legend>Validado por RENIEC</legend><div class="admin-toggle-row"><label class="admin-switch"><input type="checkbox"><span></span></label><strong>NO</strong>${detail('Fecha de cotejo','No registrado')}</div></fieldset><fieldset class="admin-server-card"><legend>Datos de contacto</legend><div class="admin-contact-grid"><label><span>Teléfono principal</span><input type="tel" placeholder="No registrado"></label><label><span>Teléfono móvil</span><input type="tel" placeholder="No registrado"></label><label class="wide"><span>Correo electrónico laboral</span><input type="email" placeholder="No registrado"></label><label class="wide"><span>Correo electrónico personal</span><input type="email" placeholder="No registrado"></label></div></fieldset><fieldset class="admin-server-card"><legend>Datos de contacto en caso de emergencia</legend><div class="admin-contact-grid three"><label><span>Nombre</span><input placeholder="No registrado"></label><label><span>Teléfono fijo</span><input type="tel" placeholder="No registrado"></label><label><span>Teléfono móvil</span><input type="tel" placeholder="No registrado"></label></div></fieldset><fieldset class="admin-server-card"><legend>Licenciado de la FF. AA.</legend><div class="admin-toggle-row"><label class="admin-switch"><input type="checkbox" data-target="ffaa-details"><span></span></label><strong>NO</strong></div><div id="ffaa-details" class="admin-conditional" hidden><label><span>Constancia FF. AA. *</span><input required placeholder="Número de constancia"></label><label><span>Documento sustentatorio</span><input type="file" accept="application/pdf"></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div></fieldset><fieldset class="admin-server-card"><legend>Datos de discapacidad</legend><div class="admin-toggle-row"><label class="admin-switch"><input type="checkbox" data-target="disability-details"><span></span></label><strong>NO</strong></div><div id="disability-details" class="admin-disability" hidden><div class="admin-disability-grid"><label><span>Entidad emisora de resolución o constancia *</span><select required><option value="">Seleccione una entidad</option><option>COMISIÓN NACIONAL ASESORA PARA LA INTEGRACIÓN DE PERSONAS DISCAPACITADAS</option><option>MINISTERIO DE DEFENSA</option><option>MINISTERIO DE SALUD</option><option>MINISTERIO DEL INTERIOR</option><option>SEGURO SOCIAL DE SALUD</option></select></label><label><span>Número de resolución o constancia *</span><input required placeholder="Número de resolución"></label><label><span>Fecha de emisión de resolución o constancia *</span><input required type="date"></label><label><span>Discapacidad *</span><select required><option value="">Seleccione discapacidad</option><option>AUDITIVA</option><option>DEL HABLA</option><option>DEL USO DE BRAZOS Y/O MANOS</option><option>DEL USO DE PIERNAS Y/O PIES</option><option>MENTAL O INTELECTUAL</option><option>VISUAL</option></select></label><label><span>Grado *</span><select required><option value="">Seleccione grado</option><option>PARCIAL</option><option>TOTAL</option></select></label><label><span>Documento sustentatorio</span><input type="file" accept="application/pdf"></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label><label class="full"><span>Anotaciones</span><textarea maxlength="250" rows="3" placeholder="Anotaciones"></textarea></label></div><button class="admin-add-disability" type="button">✚ AGREGAR</button><div class="admin-disability-table"><div>N°</div><div>Entidad emisora de resolución o constancia</div><div>Número de resolución o constancia</div><div>Fecha de emisión</div><div>Número de carné CONADIS</div><div>Discapacidad</div><div>Grado</div><div>Acciones</div></div></div></fieldset><div class="admin-server-actions"><a href="servidores.html">← RETORNAR</a><button id="save-admin-server" type="button">▣ GUARDAR</button></div></section></main>`;
    const setRenderedDetail = (scope, label, value) => {
      if (!value) return;
      [...scope.querySelectorAll('div')].forEach(item => {
        if (item.children.length === 2 && item.querySelector(':scope > strong')?.textContent.trim() === label) {
          const output = item.querySelector(':scope > span');
          if (output && output.textContent !== String(value)) output.textContent = value;
        }
      });
    };
    const summaryScope = document.querySelector('.admin-server-summary');
    if (summaryScope) {
      setRenderedDetail(summaryScope, 'Centro laboral', `${server.centroCodigo || server.codigo || ''} - ${server.institucion || 'No registrado'}`);
      setRenderedDetail(summaryScope, 'Cargo', server.cargo);
      setRenderedDetail(summaryScope, 'Régimen laboral', server.regimen);
      setRenderedDetail(summaryScope, 'Condición', server.condicion);
      setRenderedDetail(summaryScope, 'Situación laboral', server.situacionLaboral);
    }
    const generalCards = document.querySelectorAll('.admin-server-card');
    [...generalCards].find(card => card.querySelector('legend')?.textContent.trim() === 'Validado por RENIEC')?.remove();
    const personalScope = generalCards[0];
    if (personalScope) {
      setRenderedDetail(personalScope, 'Nombres', server.nombres || names);
      setRenderedDetail(personalScope, 'Primer apellido', server.primerApellido || surnames[0]);
      setRenderedDetail(personalScope, 'Segundo apellido', server.segundoApellido || surnames.slice(1).join(' '));
      setRenderedDetail(personalScope, 'Estado civil', server.estadoCivil);
      setRenderedDetail(personalScope, 'Sexo', server.sexo);
    }
    if (generalCards[1]) {
      setRenderedDetail(generalCards[1], 'Dirección', server.direccion);
      setRenderedDetail(generalCards[1], 'Departamento / Provincia / Distrito', server.ubicacionDomicilio || server.ubicacion);
    }
    if (generalCards[2]) {
      setRenderedDetail(generalCards[2], 'Fecha de nacimiento', server.fechaNacimiento);
      setRenderedDetail(generalCards[2], 'País', server.paisNacimiento || server.nacionalidad);
      setRenderedDetail(generalCards[2], 'Departamento / Provincia / Distrito', server.lugarNacimiento);
    }
    const contactCard = [...generalCards].find(card => card.querySelector('legend')?.textContent.trim() === 'Datos de contacto');
    if (contactCard) {
      const inputs = contactCard.querySelectorAll('input');
      if (inputs[0]) inputs[0].value = server.telefonoPrincipal || '';
      if (inputs[1]) inputs[1].value = server.telefonoMovil || '';
      if (inputs[2]) inputs[2].value = server.correoLaboral || '';
      if (inputs[3]) inputs[3].value = server.correoPersonal || '';
    }
    const emergencyCard = [...generalCards].find(card => card.querySelector('legend')?.textContent.trim() === 'Datos de contacto en caso de emergencia');
    if (emergencyCard) {
      const inputs = emergencyCard.querySelectorAll('input');
      if (inputs[0]) inputs[0].value = server.emergenciaNombre || '';
      if (inputs[1]) inputs[1].value = server.emergenciaTelefonoFijo || '';
      if (inputs[2]) inputs[2].value = server.emergenciaTelefonoMovil || '';
    }
    document.querySelectorAll('.admin-switch input').forEach(input => input.addEventListener('change', () => {
      input.closest('.admin-toggle-row').querySelector('strong').textContent = input.checked ? 'SÍ' : 'NO';
      const target = input.dataset.target && document.getElementById(input.dataset.target);
      if (target) target.hidden = !input.checked;
    }));
    document.querySelector('.admin-add-disability').addEventListener('click', () => alert('Registro de discapacidad agregado a la ficha.'));
    document.getElementById('save-admin-server').addEventListener('click', async () => {
      const contactInputs=[...document.querySelectorAll('.admin-server-card')].find(card=>card.querySelector('legend')?.textContent.trim()==='Datos de contacto')?.querySelectorAll('input')||[];
      const emergencyInputs=[...document.querySelectorAll('.admin-server-card')].find(card=>card.querySelector('legend')?.textContent.trim()==='Datos de contacto en caso de emergencia')?.querySelectorAll('input')||[];
      const fechaFallecimiento=[...document.querySelectorAll('.admin-server-card')].find(card=>card.querySelector('legend')?.textContent.trim()==='Fallecido')?.querySelector('input')?.value||'';
      const payload={dni:server.dni,telefono_principal:contactInputs[0]?.value||'',telefono_movil:contactInputs[1]?.value||'',correo_laboral:contactInputs[2]?.value||'',correo_personal:contactInputs[3]?.value||'',emergencia_nombre:emergencyInputs[0]?.value||'',emergencia_telefono_fijo:emergencyInputs[1]?.value||'',emergencia_telefono_movil:emergencyInputs[2]?.value||'',fecha_fallecimiento:fechaFallecimiento};
      try{const response=await fetch('api/datos-generales.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const result=await response.json();if(!response.ok||!result.ok)throw new Error(result.mensaje||'No se pudo guardar.');alert(result.mensaje);}catch(error){alert(error.message||'No se pudo guardar.');}
    });
    const adminContent = document.querySelector('.admin-server-content');
    const recordValue = value => String(value ?? '').trim() || 'No registrado';
    const saveStatusToDatabase = (key,status) => fetch('api/estado-registro.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({dni:server.dni,clave:key,estado})}).catch(error=>console.error('No se pudo guardar el estado',error));
    const loadStatusFromDatabase = (key,apply) => fetch(`api/estado-registro.php?dni=${encodeURIComponent(server.dni)}&clave=${encodeURIComponent(key)}`,{cache:'no-store'}).then(response=>response.json()).then(result=>{if(result.ok&&result.estado){localStorage.setItem(key,result.estado);apply(result.estado);}}).catch(()=>{});
    const appendDatabaseDelete = (actionsCell,record,row,onDeleted) => {
      if (!actionsCell || !record || (!record._persisted && !(record._deleteSource && record._deleteKey))) return;
      const button=document.createElement('button');
      button.type='button'; button.className='record-delete'; button.title='Eliminar registro'; button.setAttribute('aria-label','Eliminar registro'); button.textContent='🗑';
      button.addEventListener('click',async event=>{
        event.stopPropagation();
        if(!confirm('¿Eliminar este registro de la base de datos?')) return;
        const persisted=Boolean(record._persisted);
        const isHistoricalAcademic=record._deleteSource==='alfa5_formacion';
        const isHistoricalIngress=record._deleteSource==='alfa3_ingreso';
        const endpoint=persisted?'api/asignaciones-registro.php':(isHistoricalAcademic?'api/formacion-historica.php':(isHistoricalIngress?'api/ingreso-historico.php':'api/eliminar-registro-historico.php'));
        const payload=persisted?{id:record.id,dni:server.dni}:(isHistoricalAcademic?{dni:server.dni,nivel:record._deleteKey}:(isHistoricalIngress?{dni:server.dni,tipo:record._deleteKey}:{dni:server.dni,source:record._deleteSource,key:record._deleteKey}));
        const response=await fetch(endpoint,{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
        const result=await response.json();
        if(!response.ok||!result.ok){alert(result.mensaje||'No se pudo eliminar.');return;}
        row?.remove(); onDeleted?.();
      });
      actionsCell.prepend(button);
    };
    const fillRealTable = (selector, records, cellBuilder) => {
      const table = adminContent.querySelector(selector);
      if (!table || table.dataset.realDataHydrated) return;
      table.dataset.realDataHydrated = 'true';
      const pagination = table.querySelector('.ingress-pagination');
      const head = Array.from(table.children).find(child => /-head(?:\s|$)/.test(child.className));
      Array.from(table.children).forEach(child => { if (child !== head && child !== pagination) child.remove(); });
      const data = Array.isArray(records) ? records : [];
      if (!data.length) {
        const empty = document.createElement('div');
        empty.className = 'ascent-empty';
        empty.textContent = 'No se encontraron registros';
        table.insertBefore(empty, pagination);
      } else {
        data.forEach((record,index) => {
          const row = document.createElement('div');
          row.className = `${head?.className.replace(/-head/g,'-row') || 'real-record-row'} real-db-row`;
          row.style.display = 'grid';
          if (head) row.style.gridTemplateColumns = getComputedStyle(head).gridTemplateColumns;
          const headers = head ? [...head.querySelectorAll('span')].map(cell => cell.textContent.trim().toUpperCase()) : [];
          const stateIndex = headers.findIndex(title => title === 'ESTADO');
          const actionIndex = headers.map((title,i) => (/^ACCIONES?$/.test(title) ? i : -1)).filter(i => i >= 0).pop() ?? -1;
          const values = cellBuilder(record,index);
          const statusKey = `dre-status:${server.dni}:${selector}:${record.id || record.resolucion || record.documento || record.motivo || index}`;
          values.forEach((value,cellIndex) => {
            const cell = document.createElement('span');
            if (cellIndex === stateIndex) {
              const savedStatus = localStorage.getItem(statusKey);
              const databaseStatus = String(value || '').trim().toUpperCase();
              cell.textContent = savedStatus ? (savedStatus === 'ANULADO' || savedStatus === 'DESAPROBADO' ? 'ANULADO' : 'APROBADO') : (databaseStatus === 'ANULADO' || databaseStatus === 'DESAPROBADO' ? 'ANULADO' : 'APROBADO');
              cell.className = `record-status ${cell.textContent === 'ANULADO' ? 'rejected' : 'approved'}`;
            } else if (cellIndex === actionIndex) {
              cell.className = 'record-actions';
              const rejectButton = document.createElement('button');
              rejectButton.type = 'button';
              rejectButton.className = 'record-toggle-status';
              rejectButton.title = 'Cambiar estado';
              rejectButton.setAttribute('aria-label','Cambiar estado');
              rejectButton.textContent = '−';
              const editButton = document.createElement('button');
              editButton.type = 'button';
              editButton.className = 'record-edit';
              const editLabel = selector === '.benefits-table' ? 'Modificar' : 'Editar registro';
              editButton.title = editLabel;
              editButton.setAttribute('aria-label',editLabel);
              editButton.textContent = '✎';
              rejectButton.addEventListener('click', () => {
                const statusCell = row.querySelector('.record-status');
                if (!statusCell) return;
                const nextStatus = statusCell.textContent === 'ANULADO' ? 'APROBADO' : 'ANULADO';
                statusCell.textContent = nextStatus;
                statusCell.className = `record-status ${nextStatus === 'ANULADO' ? 'rejected' : 'approved'}`;
                localStorage.setItem(statusKey,nextStatus);
                saveStatusToDatabase(statusKey,nextStatus);
              });
              editButton.addEventListener('click', () => {
                if (selector === '.benefits-table') {
                  table.dispatchEvent(new CustomEvent('benefit-edit-record',{detail:{record,index}}));
                  return;
                }
                if (selector === '.cessations-table') {
                  table.dispatchEvent(new CustomEvent('cessation-edit-record',{detail:{record,index}}));
                  return;
                }
                if (selector === '.unpaid-table') {
                  table.dispatchEvent(new CustomEvent('unpaid-edit-record',{detail:{record,index}}));
                  return;
                }
                adminContent.querySelectorAll('.real-db-row.editing').forEach(item => item.classList.remove('editing'));
                row.classList.add('editing');
                const form = adminContent.querySelector('form');
                form?.scrollIntoView({behavior:'smooth',block:'start'});
                form?.querySelector('input:not([type="hidden"]),select,textarea')?.focus();
              });
              cell.append(rejectButton,editButton);
              if (selector === '.cessations-table' || selector === '.unpaid-table') {
                const cancellationButton = document.createElement('button');
                cancellationButton.type = 'button';
                cancellationButton.className = 'record-request-cancellation';
                cancellationButton.title = 'Solicitar anulación';
                cancellationButton.setAttribute('aria-label','Solicitar anulación');
                cancellationButton.textContent = '➤';
                cancellationButton.addEventListener('click', () => {
                  const cancellation = modal('Solicitar la anulación del registro', `<form id="cessation-cancellation-form" class="cessation-cancellation-form"><fieldset><legend>Datos de la solicitud</legend><label class="cancellation-reason"><span>Motivo de la solicitud <b>*</b></span><textarea required maxlength="250" rows="3"></textarea><small>250</small></label><div class="cancellation-file-row"><label><span>Documento</span><input type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span class="sr-only">Folios</span><input type="number" min="1" placeholder="Folios" aria-label="Folios"></label></div><button class="cancellation-save" type="submit">▣ GUARDAR</button></fieldset></form>`, []);
                  cancellation.querySelector('.app-modal').classList.add('cancellation-request-modal');
                  const cancellationForm = cancellation.querySelector('#cessation-cancellation-form');
                  cancellationForm.addEventListener('submit', async event => {
                    event.preventDefault();
                    if (!cancellationForm.reportValidity()) return;
                    const data=new FormData();data.append('dni',server.dni);data.append('modulo',selector==='.cessations-table'?'CESE':'LICENCIA SIN GOCE');data.append('registro',String(record.id||record._deleteKey||record.resolucion||index));data.append('motivo',cancellationForm.querySelector('textarea').value.trim());data.append('folios',cancellationForm.querySelector('input[type="number"]').value);const file=cancellationForm.querySelector('input[type="file"]').files[0];if(file)data.append('documento',file);
                    try{const response=await fetch('api/solicitud-anulacion.php',{method:'POST',body:data});const result=await response.json();if(!response.ok||!result.ok)throw new Error(result.mensaje||'No se pudo registrar.');cancellation.remove();alert(result.mensaje);}catch(error){alert(error.message||'No se pudo registrar la solicitud.');}
                  });
                });
                cell.insertBefore(cancellationButton,editButton);
              }
              if(record._persisted || (record._deleteSource && record._deleteKey)){
                const deleteButton=document.createElement('button');
                deleteButton.type='button';
                deleteButton.className='record-delete';
                deleteButton.title='Eliminar registro';
                deleteButton.textContent='🗑';
                deleteButton.addEventListener('click',async()=>{
                  if(!confirm('¿Eliminar este registro de la base de datos?')) return;
                  const isPersisted=Boolean(record._persisted);
                  const endpoint=isPersisted?'api/asignaciones-registro.php':'api/eliminar-registro-historico.php';
                  const payload=isPersisted
                    ?{id:record.id,dni:server.dni}
                    :{dni:server.dni,source:record._deleteSource,key:record._deleteKey};
                  const response=await fetch(endpoint,{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
                  const result=await response.json();
                  if(!response.ok||!result.ok){alert(result.mensaje||'No se pudo eliminar.');return;}
                  row.remove();
                  const remaining=table.querySelectorAll('.real-db-row').length;
                  const totals=pagination?.querySelectorAll('strong')||[];
                  if(totals[0])totals[0].textContent=`Total: ${remaining} registro${remaining===1?'':'s'}`;
                  if(totals[1])totals[1].textContent=`Total: ${remaining?1:0} página${remaining===1?'':'s'}`;
                  if(!remaining){const empty=document.createElement('div');empty.className='ascent-empty';empty.textContent='No se encontraron registros';table.insertBefore(empty,pagination);}
                });
                cell.prepend(deleteButton);
              }
              if(selector === '.unpaid-table'){
                rejectButton.remove();
                const requestButton=cell.querySelector('.record-request-cancellation');
                const deleteButton=cell.querySelector('.record-delete');
                cell.append(editButton);
                if(requestButton) cell.append(requestButton);
                if(deleteButton) cell.append(deleteButton);
              }
            } else {
              cell.textContent = recordValue(value);
            }
            row.appendChild(cell);
          });
          if(selector==='.benefits-table'){
            row.title='Doble clic para ver el detalle';
            row.addEventListener('dblclick',event=>{
              if(event.target.closest('button'))return;
              table.dispatchEvent(new CustomEvent('benefit-view-record',{detail:{record,row}}));
            });
          }
          loadStatusFromDatabase(statusKey,status=>{const statusCell=row.querySelector('.record-status');if(statusCell){statusCell.textContent=status;statusCell.className=`record-status ${status==='ANULADO'?'rejected':'approved'}`;}});
          table.insertBefore(row,pagination);
        });
      }
      const totals = pagination?.querySelectorAll('strong') || [];
      if (totals[0]) totals[0].textContent = `Total: ${data.length} registro${data.length === 1 ? '' : 's'}`;
      if (totals[1]) totals[1].textContent = `Total: ${data.length ? 1 : 0} página${data.length === 1 ? '' : 's'}`;
    };
    const hydrateRealServerRecords = () => {
      fillRealTable('.ascent-table',server.ascensos,(r,i)=>[i+1,r.accion,r.motivo,server.regimen,r.inicio,r.fin,r.escalaAnterior,r.nuevaEscala,r.resolucion,r.estado,'▦']);
      fillRealTable('.benefits-table',server.beneficios,(r,i)=>[i+1,r.accion,r.motivo,server.regimen,r.resolucion,r.fechaResolucion,r.importe,r.estado,'▦']);
      fillRealTable('.bereavement-table',server.subsidios,(r,i)=>[i+1,r.accion,server.regimen,r.resolucion,r.fechaResolucion,r.fechaFallecimiento,r.importe,r.estado,'▦']);
      fillRealTable('.pension-table',server.afiliacionesPension,(r,i)=>[i+1,r.regimen,r.afp,r.tipoComision,r.cuspp,r.fechaAfiliacion,r.fechaDesafiliacion,r.fechaDevengue,r.estado,'▦']);
      fillRealTable('.cessations-table',server.ceses,(r,i)=>[i+1,r.accion,r.motivo,server.regimen,r.resolucion,r.fechaCese,r.estado,'▦']);
      fillRealTable('.cts-table',server.cts,(r,i)=>[i+1,r.accion,r.motivo,server.regimen,r.resolucion,r.fechaCese,r.tiempo,r.estado,'▦']);
      fillRealTable('.awards-table',server.meritos,(r,i)=>[i+1,r.tipo,r.motivo,'No registrado','No registrado',r.fecha,r.resolucion,r.estado,'▦']);
      fillRealTable('.sanctions-table',[],()=>[]);
      fillRealTable('.administrative-table',server.sancionesAdministrativas,(r,i)=>[i+1,r.sancion,r.resolucion,r.fechaResolucion,r.dias,'No registrado','No registrado',r.estado,'▦']);
      fillRealTable('.leave-table',[],()=>[]);
      fillRealTable('.unpaid-table',server.licenciasSinGoce,(r,i)=>[i+1,r.accion,r.motivo,server.regimen,r.dias,formatTableDate(r.inicio),formatTableDate(r.fin),r.resolucion,r.estado,'▦']);
      fillRealTable('.paid-table',server.licenciasConGoce,(r,i)=>[i+1,r.accion,r.motivo,server.regimen,r.dias,r.inicio,r.fin,r.resolucion,r.estado,'▦']);
      fillRealTable('.process-table',server.observacionesRegistros,(r,i)=>[i+1,r.motivo,r.resolucion,r.fecha,'No registrado','No registrado','▦']);
      fillRealTable('.experience-table',server.experienciaLaboral,(r,i)=>[i+1,r.sector,r.entidad,r.cargo,r.funciones,r.inicio,r.fin,r.documento,r.estado,'▦']);
      fillRealTable('.otherdocs-table',server.otrosDocumentos,(r,i)=>[i+1,r.tipo,r.fecha,r.entidad,r.asunto,r.estado,'▦']);
      fillRealTable('.pension-type-table',server.tiposPension,(r,i)=>[i+1,r.tipoPension,r.numeroResolucion,r.fechaResolucion,r.tipoPensionista,r.beneficiario,r.estado,'▦']);
    };
    const updateCentroLaboralEnSeccion = () => {
      const summary = adminContent?.querySelector('.admin-server-summary');
      if (summary) {
        setRenderedDetail(summary, 'Centro laboral', `${server.centroCodigo || server.codigo || ''} - ${server.institucion || 'No registrado'}`);
        setRenderedDetail(summary, 'Situación laboral', server.situacionLaboral || 'No registrado');
      }
    };
    new MutationObserver(updateCentroLaboralEnSeccion).observe(adminContent, {childList:true, subtree:true});
    const addServerSummaryPhoto = () => {
      const summary = adminContent.querySelector('.admin-server-summary');
      if (!summary) return;
      if ((!window.location.hash || window.location.hash === '#filiacion') && !server.fallecido) {
        summary.querySelector('.admin-summary-photo')?.remove();
        summary.classList.remove('has-summary-photo');
        return;
      }
      if (summary.querySelector('.admin-summary-photo')) return;
      const photo = document.createElement('div');
      photo.className = 'admin-summary-photo';
      if (server.fallecido) {
        photo.classList.add('deceased');
        const deceasedImage = document.createElement('img');
        deceasedImage.src = 'assets/fallecido-sin-fondo.png';
        deceasedImage.alt = 'Servidor fallecido';
        deceasedImage.className = 'deceased-image';
        photo.appendChild(deceasedImage);
      } else if (server.foto) {
        const image = document.createElement('img');
        image.src = server.foto;
        image.alt = `Fotografía de ${server.nombreRegistro}`;
        image.addEventListener('error', () => {
          image.remove();
          photo.textContent = '👤';
        });
        photo.appendChild(image);
      } else {
        photo.textContent = '👤';
      }
      summary.classList.add('has-summary-photo');
      summary.appendChild(photo);
    };
    const addSelectTooltips = () => {
      adminContent.querySelectorAll('select').forEach(select => {
        select.querySelectorAll('option').forEach(option => { if (!option.title) option.title = option.textContent.trim(); });
        select.title = select.selectedOptions[0]?.title || select.selectedOptions[0]?.textContent.trim() || '';
        if (select.dataset.fullTextBound) return;
        select.dataset.fullTextBound = 'true';
        select.addEventListener('change', () => {
          select.title = select.selectedOptions[0]?.title || select.selectedOptions[0]?.textContent.trim() || '';
        });
      });
    };
    const genericFormTables={
      'address-form':'.address-table','academic-form':'.academic-records','training-form':'.training-table','production-form':'.production-table','languages-form':'.languages-table',
      'displacement-form':'.displacement-table','ascent-form':'.ascent-table','pension-form':'.pension-table','cessations-form':'.cessations-table','cts-form':'.cts-table',
      'awards-form':'.awards-table','trips-form':'.trips-table','sanctions-form':'.sanctions-table','administrative-sanctions-form':'.administrative-table','appeals-form':'.appeals-table',
      'leave-form':'.leave-table','unpaid-form':'.unpaid-table','paid-form':'.paid-table','experience-form':'.experience-table','process-form':'.process-table',
      'commissions-form':'.commissions-table','nonworking-form':'.nonworking-table','otherdocs-form':'.otherdocs-table','preventive-form':'.preventive-table','declaration-form':'.declaration-table'
    };
    const normalizeField=text=>String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9%]+/g,' ').trim().toLowerCase();
    const comparableDate=value=>{
      const text=String(value||'').trim();
      let match=text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if(match)return `${match[1]}-${match[2]}-${match[3]}`;
      match=text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      return match?`${match[3]}-${match[2]}-${match[1]}`:'';
    };
    const validateDateSequence=({resolutionDate='',startDate='',endDate=''}={})=>{
      const resolution=comparableDate(resolutionDate);
      const start=comparableDate(startDate);
      const end=comparableDate(endDate);
      if(start&&end&&end<start){alert('Operación denegada: la Fecha fin no puede ser menor que la Fecha de inicio.');return false;}
      if(resolution&&start&&start>resolution){alert('Operación denegada: la Fecha de inicio no puede ser posterior a la Fecha de resolución.');return false;}
      return true;
    };
    document.addEventListener('submit',event=>{
      const form=event.target;
      if(!(form instanceof HTMLFormElement))return;
      const labeled=[...form.querySelectorAll('label')].map(label=>({name:normalizeField(label.querySelector(':scope > span')?.textContent||''),control:label.querySelector('input[type="date"]')})).filter(item=>item.control);
      const dateValue=(...names)=>labeled.find(item=>names.includes(item.name))?.control.value||'';
      const valid=validateDateSequence({resolutionDate:dateValue('fecha de resolucion','fecha resolucion'),startDate:dateValue('fecha de inicio'),endDate:dateValue('fecha fin','fecha de fin','fecha de termino')});
      if(!valid){event.preventDefault();event.stopImmediatePropagation();}
    },true);
    const formatTableDate=value=>{
      const match=String(value||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);
      return match?`${match[3]}/${match[2]}/${match[1]}`:value;
    };
    const resolutionInitials=value=>{
      const ignored=new Set(['DE','DEL','LA','LAS','EL','LOS']);
      const words=String(value||'').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').match(/[A-Z0-9]+/g)||[];
      const initials=words.filter(word=>!ignored.has(word)).map(word=>word.charAt(0));
      return initials.length?`${initials.join('.')}.`:'';
    };
    const collectGenericForm=form=>{
      const datos={}; const ordered=[];
      form.querySelectorAll('input,select,textarea').forEach((control,index)=>{
        if(control.type==='file'||control.type==='submit'||control.type==='reset'||control.type==='button'||(control.type==='radio'&&!control.checked)||(control.type==='checkbox'&&!control.checked)) return;
        const label=control.dataset.saveLabel||control.closest('label')?.querySelector(':scope > span')?.textContent?.replace(/\s*\*\s*$/,'').trim()||control.name||control.id||`Campo ${index+1}`;
        const value=control.type==='checkbox'?'SÍ':String(control.value||'').trim();
        if(value!==''){datos[label]=value;ordered.push({label,value});}
      });
      form.querySelectorAll('[data-static-save-label]').forEach(element=>{
        const label=element.dataset.staticSaveLabel;
        const value=String(element.textContent||'').trim();
        if(label&&value&&value!=='No registrado'){datos[label]=value;ordered.push({label,value});}
      });
      if(form.id==='displacement-form'){
        const higherCenterData=code=>{
          const pedagogical=new Set(['0421412','0688069']);
          const technological=new Set(['0688051','1058742','1060110','1058155','0803908','1389956','1350404','1059245','1403575','1403559','1348697','0743336','1716323','1389949','1280668','1058650','1389980']);
          if(pedagogical.has(code))return ['EDUCACIÓN SUPERIOR','SUPERIOR PEDAGÓGICA - ISP'];
          if(technological.has(code))return ['EDUCACIÓN SUPERIOR','SUPERIOR TECNOLÓGICA - IST'];
          return [];
        };
        const displacementDatum=label=>Object.entries(datos).find(([name])=>normalizeField(name)===normalizeField(label))?.[1]||'';
        ['Origen','Destino'].forEach(side=>{
          const code=String(displacementDatum(`Codigo modular IE - ${side}`)).trim();
          const centerData=higherCenterData(code);
          if(centerData.length){datos[`Modalidad educativa - ${side}`]=centerData[0];datos[`Nivel educativo - ${side}`]=centerData[1];}
        });
      }
      return {datos,ordered};
    };
    const genericHeaderValue=(header,record,index)=>{
      const h=normalizeField(header); if(h==='n'||h==='nro'||h==='numero') return String(index+1);
      if(h==='estado') return record.estado||'APROBADO';
      const entries=Object.entries(record.datos||{}).map(([label,value])=>({label,value,n:normalizeField(label)}));
      const aliases={accion:['accion'],motivo:['motivo accion','motivo'],regimen:['regimen laboral','regimen'],'tipo comision':['tipo de comision','tipo comision'],cussp:['numero cuspp','cuspp','cussp'],cuspp:['numero cuspp','cuspp','cussp'],'dias horas':['cantidad dias','cantidad','dias horas'],resolucion:['numero resolucion','numero de resolucion','numero documento'],documento:['tipo de documento','documento de acreditacion'],importe:['importe','monto'],entidad:['institucion que emite','institucion','entidad'],asunto:['asunto'],cargo:['cargo'],folios:['folios']};
      let terms=aliases[h]||[h.replace(/^f /,'fecha ')];
      if(h.startsWith('f ')) terms=['fecha '+h.slice(2),'fecha de '+h.slice(2)];
      if(h.startsWith('fec ')) terms=['fecha '+h.slice(4),'fecha de '+h.slice(4)];
      const found=entries.find(entry=>terms.some(term=>entry.n===term||entry.n.includes(term)));
      return found?.value||'No registrado';
    };
    const updateGenericTotals=table=>{
      const pagination=table.querySelector('.ingress-pagination'); if(!pagination)return;
      const count=[...table.children].filter(child=>/-row(?:\s|$)/.test(child.className)&&!/-head(?:\s|$)/.test(child.className)).length;
      const totals=pagination.querySelectorAll('strong');
      if(totals[0])totals[0].textContent=`Total: ${count} registro${count===1?'':'s'}`;
      if(totals[1])totals[1].textContent=`Total: ${count?1:0} página${count===1?'':'s'}`;
    };
    const loadGenericFormRecords=async(form)=>{
      const selector=genericFormTables[form.id]; if(!selector||form.dataset.dbRecordsLoading)return;
      const table=adminContent.querySelector(selector); if(!table)return;
      form.dataset.dbRecordsLoading='true';
      try{
        const response=await fetch(`api/formularios-registro.php?dni=${encodeURIComponent(server.dni)}&codmod=${encodeURIComponent(server.codigoAnterior||server.codigo)}&formulario=${encodeURIComponent(form.id)}`,{cache:'no-store'});
        const result=await response.json(); if(!response.ok||!result.ok)throw new Error(result.mensaje||'No se pudieron cargar los registros.');
        table.querySelectorAll('.generic-db-row').forEach(row=>row.remove());
        const head=[...table.children].find(child=>/-head(?:\s|$)/.test(child.className)); const pagination=table.querySelector('.ingress-pagination');
        const headers=head?[...head.querySelectorAll(':scope > span')].map(cell=>cell.textContent.trim()):[];
        (result.registros||[]).forEach((record,index)=>{
          table.querySelector('.ascent-empty,.academic-empty,.legajo-table-empty')?.remove();
          const row=document.createElement('div'); row.className=`${head?.className.replace(/-head/g,'-row')||'generic-row'} generic-db-row`; row.style.display='grid';
          if(head)row.style.gridTemplateColumns=getComputedStyle(head).gridTemplateColumns;
          headers.forEach(header=>{const cell=document.createElement('span');
            if(/^acciones?$/i.test(header)){cell.className='record-actions';const del=document.createElement('button');del.type='button';del.className='record-delete';del.title='Eliminar';del.setAttribute('aria-label','Eliminar');del.textContent='🗑';del.addEventListener('click',async()=>{if(!confirm('¿Eliminar este registro de la base de datos?'))return;const res=await fetch('api/formularios-registro.php',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:record.id,dni:server.dni,formulario:form.id})});const out=await res.json();if(!res.ok||!out.ok){alert(out.mensaje||'No se pudo eliminar.');return;}row.remove();updateGenericTotals(table);});const toggle=document.createElement('button');toggle.type='button';toggle.className='record-toggle-status';toggle.title='Cambiar estado';toggle.textContent='−';toggle.addEventListener('click',async()=>{const status=row.querySelector('.record-status');if(!status)return;const next=status.textContent==='ANULADO'?'APROBADO':'ANULADO';const res=await fetch('api/formularios-registro.php',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:record.id,dni:server.dni,formulario:form.id,estado:next})});const out=await res.json();if(!res.ok||!out.ok){alert(out.mensaje||'No se pudo cambiar el estado.');return;}status.textContent=next;status.className=`record-status ${next==='ANULADO'?'rejected':'approved'}`;});if(form.id==='paid-form'){const edit=document.createElement('button');edit.type='button';edit.className='record-edit';edit.title='Modificar';edit.setAttribute('aria-label','Modificar');edit.textContent='✎';edit.addEventListener('click',()=>table.dispatchEvent(new CustomEvent('paid-edit-record',{detail:{record}})));cell.append(edit,del,toggle);}else if(form.id==='unpaid-form'){const edit=document.createElement('button');edit.type='button';edit.className='record-edit';edit.title='Modificar';edit.setAttribute('aria-label','Modificar');edit.textContent='✎';edit.addEventListener('click',()=>table.dispatchEvent(new CustomEvent('unpaid-edit-record',{detail:{record}})));const request=document.createElement('button');request.type='button';request.className='record-request-cancellation';request.title='Solicitar';request.setAttribute('aria-label','Solicitar');request.textContent='➤';request.addEventListener('click',()=>{const cancellation=modal('Solicitar la anulación del registro',`<form id="unpaid-cancellation-form" class="cessation-cancellation-form"><fieldset><legend>Datos de la solicitud</legend><label class="cancellation-reason"><span>Motivo de la solicitud <b>*</b></span><textarea required maxlength="250" rows="3"></textarea><small>250</small></label><div class="cancellation-file-row"><label><span>Documento</span><input type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span class="sr-only">Folios</span><input type="number" min="1" placeholder="Folios" aria-label="Folios"></label></div><button class="cancellation-save" type="submit">▣ GUARDAR</button></fieldset></form>`,[]);cancellation.querySelector('.app-modal').classList.add('cancellation-request-modal');const requestForm=cancellation.querySelector('#unpaid-cancellation-form');const textarea=requestForm.querySelector('textarea');const counter=requestForm.querySelector('.cancellation-reason small');textarea.addEventListener('input',()=>{counter.textContent=String(250-textarea.value.length);});requestForm.addEventListener('submit',async event=>{event.preventDefault();if(!requestForm.reportValidity())return;const data=new FormData();data.append('dni',server.dni);data.append('modulo','LICENCIA SIN GOCE');data.append('registro',String(record.id));data.append('motivo',textarea.value.trim());data.append('folios',requestForm.querySelector('input[type="number"]').value);const file=requestForm.querySelector('input[type="file"]').files[0];if(file)data.append('documento',file);try{const response=await fetch('api/solicitud-anulacion.php',{method:'POST',body:data});const result=await response.json();if(!response.ok||!result.ok)throw new Error(result.mensaje||'No se pudo registrar.');cancellation.remove();alert(result.mensaje);}catch(error){alert(error.message||'No se pudo registrar la solicitud.');}});});cell.append(edit,request,del);}else if(form.id==='displacement-form'){const edit=document.createElement('button');edit.type='button';edit.className='record-edit displacement-record-edit';edit.title='Modificar';edit.setAttribute('aria-label','Modificar');edit.textContent='✎';edit.addEventListener('click',event=>{event.stopPropagation();table.dispatchEvent(new CustomEvent('displacement-edit-record',{detail:{record}}));});cell.append(edit,del,toggle);}else{cell.append(del,toggle);}}
            else {let value=genericHeaderValue(header,record,index);const normalizedHeader=normalizeField(header);if(form.id==='paid-form'&&(normalizedHeader==='f inicio'||normalizedHeader==='f fin')){const match=String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);if(match)value=`${match[3]}/${match[2]}/${match[1]}`;}cell.textContent=value;if(normalizedHeader==='estado')cell.className=`record-status ${cell.textContent==='ANULADO'?'rejected':'approved'}`;}
            if((form.id==='unpaid-form'||form.id==='leave-form')&&/^(f inicio|f fin)$/.test(normalizeField(header))) cell.textContent=formatTableDate(cell.textContent);
            if((form.id==='experience-form'||form.id==='commissions-form')&&/^(f inicio|f fin)$/.test(normalizeField(header))) cell.textContent=formatTableDate(cell.textContent);
            if(form.id==='otherdocs-form'&&normalizeField(header)==='fec documento') cell.textContent=formatTableDate(cell.textContent);
            row.append(cell);
          });
          if(form.id==='experience-form'){
            const documentIndex=headers.findIndex(header=>normalizeField(header)==='documento');
            const documentCell=[...row.children][documentIndex];
            if(documentCell){
              const documentNumber=genericHeaderValue('Número de documento',record,index);
              const documentDate=genericHeaderValue('Fecha de documento',record,index);
              documentCell.textContent=documentNumber==='No registrado'?'S/N':documentNumber;
              if(documentDate!=='No registrado'){
                const dateLine=document.createElement('small');
                dateLine.textContent=`Fecha: ${formatTableDate(documentDate)}`;
                documentCell.append(dateLine);
              }
            }
            row.title='Doble clic para seleccionar';
            row.addEventListener('dblclick',event=>{
              if(event.target.closest('button'))return;
              table.querySelectorAll('.experience-row.experience-selected').forEach(current=>current.classList.remove('experience-selected'));
              row.classList.add('experience-selected');
              table.dispatchEvent(new CustomEvent('experience-view-record',{detail:{record,row}}));
            });
          }
          if(form.id==='displacement-form'){
            row.title='Doble clic para ver el detalle';
            row.addEventListener('dblclick',event=>{
              if(event.target.closest('button'))return;
              table.querySelectorAll('.displacement-row.displacement-selected').forEach(current=>{current.classList.remove('displacement-selected');current.style.background='';});
              row.classList.add('displacement-selected');
              row.style.background='#ffb66b';
              document.querySelector('.displacement-record-detail')?.remove();
              const entries=Object.entries(record.datos||{});
              const valueFor=(...labels)=>{
                for(const label of labels){
                  const target=normalizeField(label);
                  const found=entries.find(([name,value])=>(normalizeField(name)===target||normalizeField(name).includes(target))&&String(value||'').trim());
                  if(found)return String(found[1]);
                }
                return 'No registrado';
              };
              const mainLabels=['Tipo de resolución','Número resolución','Fecha de resolución','Régimen laboral','Acción','Motivo acción','Documento','Folios'];
              const mainNames=new Set(mainLabels.map(normalizeField));
              const escapeDetail=value=>String(value??'').replace(/[&<>'"]/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
              const renderItems=items=>items.map(([label,value])=>`<div><strong>${escapeDetail(label)}</strong><span>${escapeDetail(value||'No registrado')}</span></div>`).join('');
              const savedDocument=Array.isArray(record.documentos)?record.documentos[0]:'';
              const mainItems=mainLabels.map(label=>[label,label==='Documento'?(savedDocument||'No registrado'):valueFor(label)]);
              const renderMainItems=()=>mainItems.map(([label,value])=>label==='Documento'&&savedDocument?`<div><strong>Documento</strong><a href="${escapeDetail(savedDocument)}" target="_blank" rel="noopener">↗ ARCHIVO</a></div>`:`<div><strong>${escapeDetail(label)}</strong><span>${escapeDetail(value)}</span></div>`).join('');
              const recordedOriginCode=valueFor('Código modular IE - Origen');
              const recordedCode=valueFor('Código modular IE - Destino','Código modular IE');
              const recordedCenterOrigin=valueFor('Centro origen','Centro de origen');
              const recordedCenterDestination=valueFor('Centro destino','Centro de destino');
              const commonCondition=valueFor('Condición Laboral','Condición laboral');
              const commonSituation=valueFor('Situación Laboral','Situación laboral');
              const pedagogicalCenterCodes=new Set(['0421412','0688069']);
              const technologicalCenterCodes=new Set(['0688051','1058742','1060110','1058155','0803908','1389956','1350404','1059245','1403575','1403559','1348697','0743336','1716323','1389949','1280668','1058650','1389980']);
              const effectiveOriginCode=recordedOriginCode!=='No registrado'?recordedOriginCode:String(server.codigo||'');
              const originIsHigherEducation=pedagogicalCenterCodes.has(effectiveOriginCode)||technologicalCenterCodes.has(effectiveOriginCode);
              const originModality=valueFor('Modalidad educativa - Origen')!=='No registrado'?valueFor('Modalidad educativa - Origen'):(originIsHigherEducation?'EDUCACIÓN SUPERIOR':'No registrado');
              const originLevel=valueFor('Nivel educativo - Origen')!=='No registrado'?valueFor('Nivel educativo - Origen'):(pedagogicalCenterCodes.has(effectiveOriginCode)?'SUPERIOR PEDAGÓGICA - ISP':technologicalCenterCodes.has(effectiveOriginCode)?'SUPERIOR TECNOLÓGICA - IST':'No registrado');
              const isHigherEducationCenter=pedagogicalCenterCodes.has(recordedCode)||technologicalCenterCodes.has(recordedCode);
              const destinationModality=valueFor('Modalidad educativa - destino','Modalidad educativa')!=='No registrado'?valueFor('Modalidad educativa - destino','Modalidad educativa'):(isHigherEducationCenter?'EDUCACIÓN SUPERIOR':'No registrado');
              const destinationLevel=valueFor('Nivel educativo - destino','Nivel educativo')!=='No registrado'?valueFor('Nivel educativo - destino','Nivel educativo'):(pedagogicalCenterCodes.has(recordedCode)?'SUPERIOR PEDAGÓGICA - ISP':technologicalCenterCodes.has(recordedCode)?'SUPERIOR TECNOLÓGICA - IST':'No registrado');
              const originItems=[
                ['Código de plaza',valueFor('Código de plaza - origen')],
                ['Código modular IE',recordedOriginCode],
                ['Centro laboral',recordedCenterOrigin],
                ['Región',valueFor('Región - origen')],
                ['Instancia de gestión educativa descentralizada',valueFor('Instancia de gestión educativa descentralizada - origen')],
                ['USE / Zona / Subregión',valueFor('USE / Zona / Subregión - origen')],
                ['Condición laboral',valueFor('Condición Laboral - origen')],
                ['Situación laboral',valueFor('Situación Laboral - origen')],
                ['Modalidad educativa',originModality],
                ['Nivel educativo',originLevel],
                ['Grupo Ocupacional / Categoría',[valueFor('Grupo ocupacional - origen'),valueFor('Categoría Remunerativa - origen')].filter(value=>value!=='No registrado').join(' / ')||'No registrado'],
                ['Cargo',valueFor('Cargo - origen')],
                ['Jornada laboral',valueFor('Jornada Laboral - origen')]
              ];
              const destinationItems=[
                ['Código de plaza',valueFor('Código de plaza - destino','Código de plaza')],
                ['Código modular IE',recordedCode],
                ['Centro laboral',recordedCenterDestination],
                ['Región',valueFor('Región - destino','Región')!=='No registrado'?valueFor('Región - destino','Región'):(isHigherEducationCenter?'DIRECCIÓN REGIONAL DE EDUCACIÓN HUANCAVELICA':'No registrado')],
                ['Instancia de gestión educativa descentralizada',valueFor('Instancia de gestión educativa descentralizada - destino','Instancia de gestión educativa descentralizada')!=='No registrado'?valueFor('Instancia de gestión educativa descentralizada - destino','Instancia de gestión educativa descentralizada'):(isHigherEducationCenter?'DRE HUANCAVELICA':'No registrado')],
                ['USE / Zona / Subregión',valueFor('USE / Zona / Subregión - destino','USE / Zona / Subregión')],
                ['Condición laboral',valueFor('Condición Laboral - destino','Condición Laboral')],
                ['Situación laboral',valueFor('Situación Laboral - destino','Situación Laboral')],
                ['Modalidad educativa',destinationModality],
                ['Nivel educativo',destinationLevel],
                ['Grupo Ocupacional / Categoría',[valueFor('Grupo ocupacional - destino','Grupo ocupacional'),valueFor('Categoría Remunerativa - destino','Categoría Remunerativa')].filter(value=>value!=='No registrado').join(' / ')||'No registrado'],
                ['Cargo',valueFor('Cargo - destino','Cargo')],
                ['Jornada laboral',valueFor('Jornada Laboral - destino','Jornada Laboral')]
              ];
              const detailView=document.createElement('section');
              detailView.className='displacement-record-detail';
              detailView.innerHTML=`<fieldset class="admin-server-card"><legend>Datos principales de la resolución</legend><div class="commission-detail-grid">${renderMainItems()}</div></fieldset><fieldset class="admin-server-card"><legend>Detalle de la resolución</legend><div class="displacement-detail-dates">${renderItems([['Fecha inicio',valueFor('Fecha inicio')],['Fecha fin',valueFor('Fecha fin')]])}</div><div class="displacement-origin-destination"><fieldset class="admin-server-card"><legend>Datos de Origen</legend><div class="displacement-location-detail">${renderItems(originItems)}</div></fieldset><fieldset class="admin-server-card"><legend>Datos de Destino</legend><div class="displacement-location-detail">${renderItems(destinationItems)}</div></fieldset></div><div class="displacement-detail-bottom">${renderItems([['¿Por mandato judicial?',valueFor('¿Por mandato judicial?','Por mandato judicial')],['Anotaciones',valueFor('Anotaciones')]])}</div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="commission-detail-actions"><button type="button" class="displacement-detail-return">← RETORNAR</button><button type="button" class="displacement-detail-cancel">⌫ CANCELAR</button></div>`;
              form.hidden=true;
              table.closest('fieldset').insertAdjacentElement('afterend',detailView);
              const closeDetail=()=>{row.classList.remove('displacement-selected');row.style.background='';detailView.remove();form.hidden=false;};
              detailView.querySelector('.displacement-detail-return').addEventListener('click',closeDetail);
              detailView.querySelector('.displacement-detail-cancel').addEventListener('click',closeDetail);
              detailView.scrollIntoView({behavior:'smooth',block:'start'});
            });
          }
          if(form.id==='commissions-form'){
            const startValue=genericHeaderValue('Fecha de inicio',record,index);
            const endValue=genericHeaderValue('Fecha fin',record,index);
            const daysIndex=headers.findIndex(header=>normalizeField(header)==='dias');
            if(/^\d{4}-\d{2}-\d{2}$/.test(startValue)&&/^\d{4}-\d{2}-\d{2}$/.test(endValue)&&daysIndex>=0){
              const startDate=new Date(`${startValue}T00:00:00Z`);
              const endDate=new Date(`${endValue}T00:00:00Z`);
              row.children[daysIndex].textContent=String(Math.floor((endDate-startDate)/86400000)+1);
            }
            const actions=row.querySelector('.record-actions');
            const edit=document.createElement('button');
            edit.type='button';
            edit.className='record-edit';
            edit.title='Modificar';
            edit.setAttribute('aria-label','Modificar');
            edit.textContent='✎';
            edit.addEventListener('click',()=>table.dispatchEvent(new CustomEvent('commission-edit-record',{detail:{record}})));
            actions?.prepend(edit);
            row.title='Doble clic para ver el detalle';
            row.addEventListener('dblclick',event=>{
              if(event.target.closest('button'))return;
              table.dispatchEvent(new CustomEvent('commission-view-record',{detail:{record,row}}));
            });
          }
          if(form.id==='otherdocs-form'){
            row.title='Doble clic para ver el detalle';
            row.addEventListener('dblclick',event=>{
              if(event.target.closest('button'))return;
              table.querySelectorAll('.otherdocs-row.otherdocs-selected').forEach(current=>current.classList.remove('otherdocs-selected'));
              row.classList.add('otherdocs-selected');
              table.dispatchEvent(new CustomEvent('otherdocs-view-record',{detail:{record,row}}));
            });
          }
          if(form.id==='awards-form'){
            const entityCell=[...row.children][headers.findIndex(header=>normalizeField(header)==='entidad emisora')];
            if(entityCell) entityCell.textContent=genericHeaderValue('IGED',record,index);
            const actionsCell=row.querySelector('.record-actions');
            if(actionsCell&&!actionsCell.querySelector('.record-edit')){
              const editButton=document.createElement('button');
              editButton.type='button';
              editButton.className='record-edit';
              editButton.title='Modificar';
              editButton.setAttribute('aria-label','Modificar');
              editButton.textContent='✎';
              actionsCell.prepend(editButton);
            }
            row.title='Doble clic para ver el detalle';
            row.addEventListener('dblclick',event=>{
              if(event.target.closest('button'))return;
              table.dispatchEvent(new CustomEvent('award-view-record',{detail:{record,row}}));
            });
          }
          if(form.id==='pension-form'){
            const actionsCell=row.querySelector('.record-actions');
            if(actionsCell&&!actionsCell.querySelector('.record-change-pension')){
              const changeButton=document.createElement('button');
              changeButton.type='button';
              changeButton.className='record-edit record-change-pension';
              changeButton.title='Cambiar sistema pensionario';
              changeButton.setAttribute('aria-label','Cambiar sistema pensionario');
              changeButton.textContent='↻';
              changeButton.addEventListener('click',()=>table.dispatchEvent(new CustomEvent('pension-change-record',{detail:{record,row}})));
              actionsCell.prepend(changeButton);
            }
            row.title='Doble clic para ver el detalle';
            row.addEventListener('dblclick',event=>{
              if(event.target.closest('button'))return;
              table.dispatchEvent(new CustomEvent('pension-view-record',{detail:{record,row}}));
            });
          }
          if(form.id==='unpaid-form'){
            const requestButton=row.querySelector('.record-request-cancellation');
            requestButton?.setAttribute('title','Solicitar anulación');
            requestButton?.setAttribute('aria-label','Solicitar anulación');
            const unpaidStatus=row.querySelector('.record-status');
            if(unpaidStatus){
              unpaidStatus.textContent=unpaidStatus.textContent==='ANULADO'?'ANULADO':'APROBADO';
              unpaidStatus.className=`record-status ${unpaidStatus.textContent==='ANULADO'?'rejected':'approved'}`;
            }
          }
          if(form.id==='paid-form'){
            const currentToggle=row.querySelector('.record-toggle-status');
            if(currentToggle){
              const paidToggle=currentToggle.cloneNode(true);
              paidToggle.title='Cambiar estado: APROBADO / ANULADO';
              paidToggle.setAttribute('aria-label','Cambiar estado: APROBADO / ANULADO');
              paidToggle.addEventListener('click',async()=>{
                const status=row.querySelector('.record-status');
                if(!status)return;
                const next=status.textContent==='ANULADO'?'APROBADO':'ANULADO';
                const response=await fetch('api/formularios-registro.php',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:record.id,dni:server.dni,formulario:'paid-form',estado:next})});
                const result=await response.json();
                if(!response.ok||!result.ok){alert(result.mensaje||'No se pudo cambiar el estado.');return;}
                status.textContent=next;
                status.className=`record-status ${next==='ANULADO'?'rejected':'approved'}`;
              });
              currentToggle.replaceWith(paidToggle);
            }
            const paidStatus=row.querySelector('.record-status');
            if(paidStatus){
              paidStatus.textContent=paidStatus.textContent==='ANULADO'?'ANULADO':'APROBADO';
              paidStatus.className=`record-status ${paidStatus.textContent==='ANULADO'?'rejected':'approved'}`;
            }
          }
          if(form.id==='leave-form'){
            const actionsCell=row.querySelector('.record-actions');
            if(actionsCell&&!actionsCell.querySelector('.record-edit')){
              const editButton=document.createElement('button');
              editButton.type='button';
              editButton.className='record-edit vacation-record-edit';
              editButton.title='Modificar';
              editButton.setAttribute('aria-label','Modificar');
              editButton.textContent='✎';
              editButton.addEventListener('click',()=>{
                table.dispatchEvent(new CustomEvent('vacation-edit-record',{detail:{record}}));
              });
              actionsCell.prepend(editButton);
            }
            const vacationStatus=row.querySelector('.record-status');
            if(vacationStatus){
              vacationStatus.textContent=vacationStatus.textContent==='ANULADO'?'ANULADO':'APROBADO';
              vacationStatus.className=`record-status ${vacationStatus.textContent==='ANULADO'?'rejected':'approved'}`;
            }
          }
          if(form.id==='leave-form'||form.id==='unpaid-form'||form.id==='paid-form'||form.id==='commissions-form'||form.id==='awards-form'){
            const resolutionCell=[...row.children][headers.findIndex(header=>normalizeField(header)==='resolucion')];
            if(resolutionCell){
              const type=genericHeaderValue('Tipo de resolución',record,index);
              const number=genericHeaderValue('Resolución',record,index);
              const date=genericHeaderValue('Fecha de resolución',record,index);
              resolutionCell.textContent=`${resolutionInitials(type)} - ${number}`;
              const dateLine=document.createElement('small');
              dateLine.textContent=`Fecha: ${formatTableDate(date)}`;
              resolutionCell.append(dateLine);
            }
          }
          table.insertBefore(row,pagination);
        }); updateGenericTotals(table);
      }catch(error){console.error(error);delete form.dataset.dbRecordsLoading;}
    };
    const hydrateGenericForms=()=>adminContent.querySelectorAll('form').forEach(form=>loadGenericFormRecords(form));
    document.addEventListener('submit',async event=>{
      const form=event.target; if(!(form instanceof HTMLFormElement)||!genericFormTables[form.id])return;
      event.preventDefault();event.stopImmediatePropagation(); if(!form.reportValidity())return;
      const {datos,ordered}=collectGenericForm(form); const table=adminContent.querySelector(genericFormTables[form.id]);
      const head=[...table?.children||[]].find(child=>/-head(?:\s|$)/.test(child.className)); const headers=head?[...head.querySelectorAll(':scope > span')].map(cell=>cell.textContent.trim()):[];
      const resumen={};headers.forEach((header,index)=>{resumen[header]=genericHeaderValue(header,{datos,estado:'APROBADO'},index);});
      const payload=new FormData();payload.append('dni',server.dni);payload.append('codmod',server.codigoAnterior||server.codigo);payload.append('formulario',form.id);payload.append('datos',JSON.stringify(datos));payload.append('resumen',JSON.stringify(resumen));payload.append('estado','APROBADO');
      form.querySelectorAll('input[type="file"]').forEach((input,index)=>{if(input.files[0])payload.append(`archivo_${index}`,input.files[0]);});
      const button=form.querySelector('button[type="submit"]');if(button)button.disabled=true;
      try{const response=await fetch('api/formularios-registro.php',{method:'POST',body:payload});const result=await response.json();if(!response.ok||!result.ok)throw new Error(result.mensaje||'No se pudo guardar.');delete form.dataset.dbRecordsLoading;await loadGenericFormRecords(form);form.reset();alert(result.mensaje);}catch(error){alert(error.message||'No se pudo guardar el registro.');}finally{if(button)button.disabled=false;}
    },true);
    addServerSummaryPhoto();
    addSelectTooltips();
    hydrateRealServerRecords();
    hydrateGenericForms();
    new MutationObserver(() => {
      addServerSummaryPhoto();
      addSelectTooltips();
      hydrateRealServerRecords();
      hydrateGenericForms();
    }).observe(adminContent, { childList: true, subtree: true });
    const academicMenu = document.querySelector('.admin-server-menu a[href="#academica"]');
    const ingressMenu = document.querySelector('.admin-server-menu a[href="#ingreso"]');
    const trajectoryMenu = document.querySelector('.admin-server-menu a[href="#trayectoria"]');
    const benefitsMenu = document.querySelector('.admin-server-menu a[href="#asignaciones"]');
    const pensionMenu = document.querySelector('.admin-server-menu a[href="#retiro"]');
    const awardsMenu = document.querySelector('.admin-server-menu a[href="#premios"]');
    const sanctionsMenu = document.querySelector('.admin-server-menu a[href="#sanciones"]');
    const leaveMenu = document.querySelector('.admin-server-menu a[href="#licencias"]');
    const othersMenu = document.querySelector('.admin-server-menu a[href="#otros"]');
    const reportMenu = document.querySelector('.admin-server-menu a[href="#informe"]');
    const obsoleteResumeMenu = document.querySelector('.admin-server-menu a[href="#reporte"]');
    obsoleteResumeMenu?.remove();
    const resumeMenu = reportMenu;
    const filiationMenu = document.querySelector('.admin-server-menu a[href="#filiacion"]');
    const academicCountries = ['AFGANISTÁN','ALBANIA','ALEMANIA','ANDORRA','ANGOLA','ANTIGUA Y BARBUDA','ARABIA SAUDITA','ARGELIA','ARGENTINA','ARMENIA','AUSTRALIA','AUSTRIA','AZERBAIYÁN','BAHAMAS','BAHREIN','BANGLADESH','BARBADOS','BÉLGICA','BELICE','BENÍN','BIELORRUSIA','BOLIVIA','BOSNIA Y HERZEGOVINA','BOTSUANA','BRASIL','BRUNÉI','BULGARIA','BURKINA FASO','BURUNDI','BUTÁN','CABO VERDE','CAMBOYA','CAMERÚN','CANADÁ','CHAD','CHILE','CHINA','CHIPRE','COLOMBIA','COMORAS','CONGO, REPÚBLICA DEL','COREA DEL NORTE','COREA DEL SUR','COSTA RICA','CÔTE D’IVOIRE','CROACIA','CUBA','DINAMARCA','DJIBOUTI','DOMINICA','ECUADOR','EGIPTO','EL SALVADOR','EMIRATOS ÁRABES UNIDOS','ERITREA','ESLOVAQUIA','ESLOVENIA','ESPAÑA','ESTADOS UNIDOS','ESTONIA','ESWATINI','ETIOPÍA','FILIPINAS','FINLANDIA','FRANCIA','GABÓN','GAMBIA','GEORGIA','GHANA','GRANADA','GRECIA','GUATEMALA','GUINEA','GUINEA ECUATORIAL','GUINEA-BISSAU','GUYANA','HAITÍ','HONDURAS','HUNGRÍA','INDIA','INDONESIA','IRAK','IRÁN','IRLANDA','ISLANDIA','ISLAS COOK','ISLAS DE FIJI','ISLAS FEROE','ISLAS MARSHALL','ISLAS SALOMÓN','ISRAEL','ITALIA','JAMAICA','JAPÓN','JORDANIA','KAZAJISTÁN','KENIA','KIRIBATI','KUWAIT','KIRGUISTÁN','LAOS','LESOTO','LETONIA','LÍBANO','LIBERIA','LIBIA','LITUANIA','LOS PAÍSES BAJOS','LUXEMBURGO','MACEDONIA DEL NORTE','MADAGASCAR','MALASIA','MALAUI','MALDIVAS','MALÍ','MALTA','MARRUECOS','MAURICIO','MAURITANIA','MÉXICO','MICRONESIA','MOLDOVA','MÓNACO','MONGOLIA','MONTENEGRO','MOZAMBIQUE','MYANMAR','NAMIBIA','NAURU','NEPAL','NICARAGUA','NÍGER','NIGERIA','NIUE','NORUEGA','NUEVA ZELANDA','OMÁN','PAKISTÁN','PALAOS','PANAMÁ','PAPÚA NUEVA GUINEA','PARAGUAY','PERÚ','POLONIA','PORTUGAL','QATAR','REINO UNIDO','REPÚBLICA CENTROAFRICANA','REPÚBLICA CHECA','REPÚBLICA DEMOCRÁTICA DEL CONGO','REPÚBLICA DOMINICANA','RUANDA','RUMANIA','RUSIA','SAINT KITTS Y NEVIS','SAMOA','SANTA LUCÍA','SAN MARINO','SAN VICENTE Y LAS GRANADINAS','SANTO TOMÉ Y PRÍNCIPE','SENEGAL','SERBIA','SEYCHELLES','SIERRA LEONA','SINGAPUR','SIRIA','SOMALIA','SRI LANKA','SUDÁFRICA','SUDÁN','SUDÁN DEL SUR','SUECIA','SUIZA','SURINAM','TANZANIA','TAYIKISTÁN','TAILANDIA','TIMOR ORIENTAL','TOGO','TOKELAU','TONGA','TRINIDAD Y TOBAGO','TÚNEZ','TURQUÍA','TUVALU','UCRANIA','UGANDA','URUGUAY','UZBEKISTÁN','VANUATU','VENEZUELA','VIETNAM','YEMEN','ZAMBIA','ZIMBABUE'];
    const academicCountryOptions = academicCountries.map(country => `<option${country === 'PERÚ' ? ' selected' : ''}>${country}</option>`).join('');
    const academicDepartments = ['AMAZONAS','ÁNCASH','APURÍMAC','AREQUIPA','AYACUCHO','CAJAMARCA','CALLAO','CUSCO','HUANCAVELICA','HUÁNUCO','ICA','JUNÍN','LA LIBERTAD','LAMBAYEQUE','LIMA','LORETO','MADRE DE DIOS','MOQUEGUA','PASCO','PIURA','PUNO','SAN MARTÍN','TACNA','TUMBES','UCAYALI'];
    const setupAcademicLevelFields = () => {
      const form = document.getElementById('academic-form');
      const formationGrid = form?.querySelector('.academic-form-grid');
      if (!form || !formationGrid) return;
      const baseLabels = [...formationGrid.children].filter(element => element.tagName === 'LABEL');
      const levelSelect = baseLabels[0]?.querySelector('select');
      const countryLabel = baseLabels[1];
      const centerLabel = baseLabels[2];
      if (!levelSelect || !countryLabel || !centerLabel) return;

      levelSelect.id = 'academic-level';
      centerLabel.classList.add('academic-center-name');
      countryLabel.insertAdjacentHTML('beforebegin', '<label id="academic-sublevel" hidden><span>Modalidad *</span><select><option value="">Seleccione modalidad</option></select></label>');
      centerLabel.insertAdjacentHTML('afterend', `<label id="academic-center-code" class="academic-center-code" hidden><span>Código modular - Centro de estudios *</span><input placeholder="Buscar código modular o centro de estudios"></label><label id="academic-department-field" hidden><span>Departamento *</span><select id="academic-department"><option value="">Seleccione departamento</option>${academicDepartments.map(item => `<option>${item}</option>`).join('')}</select></label><label id="academic-province-field" hidden><span>Provincia</span><select id="academic-province" disabled><option value="">Seleccione provincia</option></select></label><label id="academic-district-field" hidden><span>Distrito</span><select id="academic-district" disabled><option value="">Seleccione distrito</option></select></label>`);

      const sublevel = document.getElementById('academic-sublevel');
      const sublevelSelect = sublevel.querySelector('select');
      const centerCode = document.getElementById('academic-center-code');
      const locationFields = ['academic-department-field','academic-province-field','academic-district-field'].map(id => document.getElementById(id));
      const advancedFieldsets = [...form.querySelectorAll(':scope > fieldset')].slice(1);
      const studyLabels = [...advancedFieldsets[0].querySelectorAll('.academic-form-grid > label')];
      const originalStudyFields = studyLabels.map(label => label.innerHTML);
      const specialtyLevelSelect = advancedFieldsets[1].querySelector('.academic-form-grid > label select');
      const originalSpecialtyLevelOptions = specialtyLevelSelect.innerHTML;
      const specialtyGrid = advancedFieldsets[1].querySelector('.academic-form-grid');
      const specialtyLabels = [...specialtyGrid.querySelectorAll(':scope > label')];
      const careerLabel = specialtyLabels[1];
      const originalCareerField = careerLabel.innerHTML;
      const generalProgramLabel = specialtyLabels[2];
      const originalGeneralProgramField = generalProgramLabel.innerHTML;
      const professionalProgramLabel = specialtyLabels[3];
      const originalProfessionalProgramField = professionalProgramLabel.innerHTML;
      const programLabel = specialtyLabels[4];
      const originalProgramField = programLabel.innerHTML;
      const titleGrid = advancedFieldsets[2].querySelector('.academic-form-grid');
      const titleLabels = [...titleGrid.querySelectorAll(':scope > label')];
      const titleLabel = titleLabels[0];
      const titleSpecialtyLabel = titleLabels[1];
      const originalTitleField = titleLabel.innerHTML;

      const resetTechnicalTitleFields = () => {
        document.getElementById('technical-second-specialty')?.remove();
        careerLabel.innerHTML = originalCareerField;
        generalProgramLabel.innerHTML = originalGeneralProgramField;
        professionalProgramLabel.innerHTML = originalProfessionalProgramField;
        programLabel.innerHTML = originalProgramField;
        titleLabel.innerHTML = originalTitleField;
        titleSpecialtyLabel.hidden = false;
      };
      const updateTechnicalTitleFields = situation => {
        resetTechnicalTitleFields();
        if (!situation) return;
        careerLabel.innerHTML = '<span>Carrera *</span><select required><option value="">Seleccione carrera</option><option>0 - SERVICIOS</option><option>1 - EDUCACIÓN</option><option>2 - ARTE Y HUMANIDADES</option><option>3 - CIENCIAS SOCIALES, PERIODISMO E INFORMACIÓN</option><option>4 - CIENCIAS ADMINISTRATIVAS Y DERECHO</option><option>5 - CIENCIAS NATURALES, MATEMÁTICAS Y ESTADÍSTICA</option><option>6 - TECNOLOGÍA DE LA INFORMACIÓN Y LA COMUNICACIÓN</option><option>7 - INGENIERÍA, INDUSTRIA Y CONSTRUCCIÓN</option><option>8 - AGRICULTURA, SILVICULTURA, PESCA Y VETERINARIA</option><option>9 - SALUD Y BIENESTAR</option></select>';
        const careerSelect = careerLabel.querySelector('select');
        careerSelect.addEventListener('change', () => {
          if (careerSelect.value === '0 - SERVICIOS') {
            generalProgramLabel.innerHTML = '<span>Programa General *</span><select required><option value="">Seleccione programa general</option><option>01 - SERVICIOS PERSONALES</option><option>02 - SERVICIOS DE HIGIENE Y SALUD OCUPACIONAL</option><option>03 - SERVICIOS DE SEGURIDAD</option><option>04 - SERVICIOS DE TRANSPORTE</option></select>';
            const generalProgramSelect = generalProgramLabel.querySelector('select');
            generalProgramSelect.addEventListener('change', () => {
              if (generalProgramSelect.value === '01 - SERVICIOS PERSONALES') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>011 - PELUQUERÍA Y TRATAMIENTOS DE BELLEZA</option><option>012 - HOTELERÍA, RESTAURANTES Y GASTRONOMÍA</option><option>013 - DEPORTE</option><option>014 - VIAJES, TURISMO Y ACTIVIDADES RECREATIVAS</option></select>';
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '011 - PELUQUERÍA Y TRATAMIENTOS DE BELLEZA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>011014 - COSMETOLOGÍA</option><option>011024 - PELUQUERÍA</option><option>011994 - OTROS PROGRAMAS EN PELUQUERÍA Y TRATAMIENTOS DE BELLEZA</option></select>';
                  } else if (professionalProgramSelect.value === '012 - HOTELERÍA, RESTAURANTES Y GASTRONOMÍA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>012014 - ADMINISTRACIÓN DE HOSTELERÍA</option><option>012014 - ADMINISTRACIÓN DE HOTELES</option><option>012024 - ADMINISTRACIÓN DE RESTAURANTES</option><option>012034 - AVIACIÓN COMERCIAL</option><option>012044 - BAR Y COCTELERÍA</option><option>012044 - BAR Y COCTELERÍA</option><option>012054 - COCINA</option><option>012064 - COCINA Y REPOSTERÍA</option><option>012074 - COCINA Y RESTAURANTES</option><option>012084 - HOSTELERÍA</option><option>012094 - PASTELERÍA</option><option>012104 - PASTELERÍA Y PANADERÍA</option><option>012114 - PASTELERÍA Y TURISMO</option><option>012124 - SERVICIO DE RESTAURANTE Y BAR</option><option>012134 - SERVICIOS HOTELEROS Y COCINA</option><option>012994 - OTROS PROGRAMAS EN HOTELERÍA, RESTAURANTES Y GASTRONOMÍA</option></select>';
                  } else if (professionalProgramSelect.value === '013 - DEPORTE') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>013014 - DEPORTES</option><option>013024 - DIRECCIÓN TÉCNICA EN FUTBOL</option><option>013994 - OTROS PROGRAMAS EN DEPORTE</option></select>';
                  } else if (professionalProgramSelect.value === '014 - VIAJES, TURISMO Y ACTIVIDADES RECREATIVAS') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>014014 - ADMINISTRACIÓN TURÍSTICA</option><option>014024 - GUÍA DE TURISTAS</option><option>014994 - OTROS PROGRAMAS EN VIAJES, TURISMO Y ACTIVIDADES RECREATIVAS</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '02 - SERVICIOS DE HIGIENE Y SALUD OCUPACIONAL') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>021 - SANEAMIENTO DE LA COMUNIDAD</option><option>022 - SALUD Y PROTECCIÓN LABORAL</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '021 - SANEAMIENTO DE LA COMUNIDAD') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>021994 - OTROS PROGRAMAS EN SANEAMIENTO DE LA COMUNIDAD</option></select>';
                  } else if (professionalProgramSelect.value === '022 - SALUD Y PROTECCIÓN LABORAL') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>022014 - PREVENCIÓN DE LA SEGURIDAD Y SALUD EN EL TRABAJO</option><option>022024 - PREVENCIÓN DE RIESGO, SEGURIDAD Y SALUD OCUPACIONAL</option><option>022034 - SEGURIDAD Y SALUD EN EL TRABAJO</option><option>022994 - OTROS PROGRAMAS EN SALUD Y PROTECCIÓN LABORAL</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '03 - SERVICIOS DE SEGURIDAD') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>031 - EDUCACIÓN MILITAR Y DE DEFENSA</option><option>032 - PROTECCIÓN DE LAS PERSONAS Y DE PROPIEDAD</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '031 - EDUCACIÓN MILITAR Y DE DEFENSA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>031994 - OTROS PROGRAMAS EN EDUCACIÓN MILITAR Y DEFENSA</option></select>';
                  } else if (professionalProgramSelect.value === '032 - PROTECCIÓN DE LAS PERSONAS Y DE PROPIEDAD') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>032014 - INVESTIGACIÓN PRIVADA</option><option>032994 - OTROS PROGRAMAS EN PROTECCIÓN DE LAS PERSONAS Y DE LA PROPIEDAD</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '04 - SERVICIOS DE TRANSPORTE') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>041 - SERVICIOS DE TRANSPORTE</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '041 - SERVICIOS DE TRANSPORTE') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>041014 - TRANSPORTES TERRESTRES Y OPERACIÓN DE EQUIPOS PESADOS</option><option>041024 - OPERACIÓN DE MAQUINARIA PESADA</option><option>041994 - OTROS PROGRAMAS EN SERVICIOS DE TRANSPORTE</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else {
                professionalProgramLabel.innerHTML = originalProfessionalProgramField;
                programLabel.innerHTML = originalProgramField;
              }
            });
          } else if (careerSelect.value === '1 - EDUCACIÓN') {
            generalProgramLabel.innerHTML = '<span>Programa General *</span><select required><option value="">Seleccione programa general</option><option>11 - EDUCACIÓN INICIAL Y PRIMARIA</option><option>12 - EDUCACIÓN SECUNDARIA</option><option>13 - EDUCACIÓN SUPERIOR Y TECNOLÓGICA</option><option>14 - EDUCACIÓN ESPECIAL</option><option>15 - EDUCACIÓN FÍSICA</option><option>16 - EDUCACIÓN ARTÍSTICA</option><option>19 - OTROS PROGRAMAS DE EDUCACIÓN</option></select>';
            professionalProgramLabel.innerHTML = originalProfessionalProgramField;
            programLabel.innerHTML = originalProgramField;
            const generalProgramSelect = generalProgramLabel.querySelector('select');
            generalProgramSelect.addEventListener('change', () => {
              if (generalProgramSelect.value === '11 - EDUCACIÓN INICIAL Y PRIMARIA') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>111 - EDUCACIÓN INICIAL</option><option>112 - EDUCACIÓN PRIMARIA</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '111 - EDUCACIÓN INICIAL') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>111994 - OTROS PROGRAMAS EN EDUCACIÓN INICIAL</option></select>';
                  } else if (professionalProgramSelect.value === '112 - EDUCACIÓN PRIMARIA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>112994 - OTROS PROGRAMAS EN EDUCACIÓN PRIMARIA</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '12 - EDUCACIÓN SECUNDARIA') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>121 - EDUCACIÓN SECUNDARIA</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '121 - EDUCACIÓN SECUNDARIA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>121994 - OTROS PROGRAMAS EN EDUCACIÓN SECUNDARIA</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '13 - EDUCACIÓN SUPERIOR Y TECNOLÓGICA') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>131 - EDUCACIÓN SUPERIOR Y TECNOLÓGICA</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '131 - EDUCACIÓN SUPERIOR Y TECNOLÓGICA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>131994 - OTROS PROGRAMAS EN EDUCACIÓN SUPERIOR Y TECNOLÓGICA</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '14 - EDUCACIÓN ESPECIAL') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>141 - EDUCACIÓN ESPECIAL</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '141 - EDUCACIÓN ESPECIAL') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>141994 - OTROS PROGRAMAS EN EDUCACIÓN ESPECIAL</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '15 - EDUCACIÓN FÍSICA') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>151 - EDUCACIÓN FÍSICA</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '151 - EDUCACIÓN FÍSICA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>151994 - OTROS PROGRAMAS EN EDUCACIÓN ARTÍSTICA</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '16 - EDUCACIÓN ARTÍSTICA') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>161 - EDUCACIÓN ARTÍSTICA</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '161 - EDUCACIÓN ARTÍSTICA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>161994 - OTROS PROGRAMAS EN EDUCACIÓN TECNOLÓGICA</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '19 - OTROS PROGRAMAS DE EDUCACIÓN') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>191 - GESTIÓN Y CALIDAD EDUCATIVA</option><option>199 - OTROS PROGRAMAS EN EDUCACIÓN</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '191 - GESTIÓN Y CALIDAD EDUCATIVA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>191994 - OTROS PROGRAMAS EN GESTIÓN Y CALIDAD EDUCATIVA</option></select>';
                  } else if (professionalProgramSelect.value === '199 - OTROS PROGRAMAS EN EDUCACIÓN') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>199994 - OTROS PROGRAMAS EN EDUCACIÓN</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else {
                professionalProgramLabel.innerHTML = originalProfessionalProgramField;
                programLabel.innerHTML = originalProgramField;
              }
            });
          } else if (careerSelect.value === '2 - ARTE Y HUMANIDADES') {
            generalProgramLabel.innerHTML = '<span>Programa General *</span><select required><option value="">Seleccione programa general</option><option>21 - ARTE</option><option>22 - HUMANIDADES</option><option>23 - IDIOMAS</option></select>';
            professionalProgramLabel.innerHTML = originalProfessionalProgramField;
            programLabel.innerHTML = originalProgramField;
            const generalProgramSelect = generalProgramLabel.querySelector('select');
            generalProgramSelect.addEventListener('change', () => {
              if (generalProgramSelect.value === '21 - ARTE') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>211 - TÉCNICAS AUDIOVISUALES Y DE PRODUCCIÓN PARA MEDIOS DE COMUNICACIÓN</option><option>212 - DISEÑO INDUSTRIAL, DE MODAS E INTERIORES</option><option>213 - ARTE</option><option>214 - ARTESANÍA Y MANUALIDADES</option><option>215 - MÚSICA Y ARTES ESCÉNICAS</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '211 - TÉCNICAS AUDIOVISUALES Y DE PRODUCCIÓN PARA MEDIOS DE COMUNICACIÓN') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>211014 - DIRECCIÓN DE RADIO Y TELEVISIÓN</option><option>211024 - OPERACIÓN DE EQUIPOS DE GRABACIÓN Y MEZCLA</option><option>211034 - OPERACIÓN DE EQUIPOS DE RADIO Y TELEVISIÓN</option><option>211044 - OPERACIÓN DE SISTEMAS DE DIFUSIÓN SONORA</option><option>211054 - PRENSISTA OFFSET</option><option>211064 - PRENSISTA SERÍGRAFO</option><option>211074 - PREPRENSISTA</option><option>211084 - PUBLICIDAD Y MEDIOS DIGITALES</option><option>211994 - OTROS PROGRAMAS TÉCNICAS AUDIOVISUALES Y DE PRODUCCIÓN PARA MEDIOS DE COMUNICACIÓN</option></select>';
                  } else if (professionalProgramSelect.value === '212 - DISEÑO INDUSTRIAL, DE MODAS E INTERIORES') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>212014 - DIBUJANTE TÉCNICO MECÁNICO</option><option>212024 - PATRONAJE</option><option>212994 - OTROS PROGRAMAS EN DISEÑO INDUSTRIAL, DE MODAS E INTERIORES</option></select>';
                  } else if (professionalProgramSelect.value === '213 - ARTE') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>213994 - OTROS PROGRAMAS EN ARTE</option></select>';
                  } else if (professionalProgramSelect.value === '214 - ARTESANÍA Y MANUALIDADES') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>214014 - CARPINTERÍA</option><option>214024 - CARPINTERÍA Y EBANISTERÍA</option><option>214034 - DISEÑO DE PIEZAS DE JOYERÍA EN LA LÍNEA ARTESANAL EN METALES PRECIOSOS (ORO, PLATA)</option><option>214044 - EBANISTERÍA</option><option>214054 - FABRICACIÓN ARTESANAL DE PRODUCTOS DE MADERA</option><option>214064 - JOYERÍA</option><option>214074 - PRODUCCIÓN DE CERÁMICA UTILITARIA</option><option>214994 - OTROS PROGRAMAS EN ARTESANÍA Y MANUALIDADES</option></select>';
                  } else if (professionalProgramSelect.value === '215 - MÚSICA Y ARTES ESCÉNICAS') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>215994 - OTROS PROGRAMAS EN MÚSICA Y ARTES ESCÉNICAS</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '22 - HUMANIDADES') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>221 - RELIGIÓN Y TEOLOGÍA</option><option>222 - HISTORIA Y ARQUEOLOGÍA</option><option>223 - FILOSOFÍA Y ÉTICA</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '221 - RELIGIÓN Y TEOLOGÍA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>221014 - LITERATURA BÍBLICA</option><option>221024 - TEOLOGÍA PASTORAL</option><option>221994 - OTROS PROGRAMAS EN RELIGIÓN Y TEOLOGÍA</option></select>';
                  } else if (professionalProgramSelect.value === '222 - HISTORIA Y ARQUEOLOGÍA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>222994 - OTROS PROGRAMAS EN HISTORIA Y ARQUEOLOGÍA</option></select>';
                  } else if (professionalProgramSelect.value === '223 - FILOSOFÍA Y ÉTICA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>223994 - OTROS PROGRAMAS EN FILOSOFÍA Y ÉTICA</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '23 - IDIOMAS') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>231 - IDIOMAS</option><option>232 - LINGÜÍSTICA Y LITERATURA</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '231 - IDIOMAS') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>231994 - OTROS PROGRAMAS EN IDIOMAS</option></select>';
                  } else if (professionalProgramSelect.value === '232 - LINGÜÍSTICA Y LITERATURA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>232994 - OTROS PROGRAMAS EN LINGÜÍSTICA Y LITERATURA</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else {
                professionalProgramLabel.innerHTML = originalProfessionalProgramField;
                programLabel.innerHTML = originalProgramField;
              }
            });
          } else if (careerSelect.value === '3 - CIENCIAS SOCIALES, PERIODISMO E INFORMACIÓN') {
            generalProgramLabel.innerHTML = '<span>Programa General *</span><select required><option value="">Seleccione programa general</option><option>31 - CIENCIAS SOCIALES Y DEL COMPORTAMIENTO</option><option>32 - PERIODISMO E INFORMACIÓN</option></select>';
            professionalProgramLabel.innerHTML = originalProfessionalProgramField;
            programLabel.innerHTML = originalProgramField;
            const generalProgramSelect = generalProgramLabel.querySelector('select');
            generalProgramSelect.addEventListener('change', () => {
              if (generalProgramSelect.value === '31 - CIENCIAS SOCIALES Y DEL COMPORTAMIENTO') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>311 - ECONOMÍA</option><option>312 - CIENCIAS POLÍTICAS</option><option>313 - PSICOLOGÍA</option><option>314 - SOCIOLOGÍA Y ESTUDIOS CULTURALES</option><option>315 - ANTROPOLOGÍA</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '311 - ECONOMÍA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>311994 - OTROS PROGRAMAS EN ECONOMÍA</option></select>';
                  } else if (professionalProgramSelect.value === '312 - CIENCIAS POLÍTICAS') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>312994 - OTROS PROGRAMAS EN CIENCIAS POLÍTICAS</option></select>';
                  } else if (professionalProgramSelect.value === '313 - PSICOLOGÍA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>313014 - CONSEJERÍA DE ORIENTACIÓN PSICOANALÍTICA</option><option>313024 - PSICOTERAPIA PSICOANALÍTICA</option><option>313994 - OTROS PROGRAMAS EN PSICOLOGÍA</option></select>';
                  } else if (professionalProgramSelect.value === '314 - SOCIOLOGÍA Y ESTUDIOS CULTURALES') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>314994 - OTROS PROGRAMAS EN PROMOCIÓN COMUNAL</option></select>';
                  } else if (professionalProgramSelect.value === '315 - ANTROPOLOGÍA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>315994 - OTROS PROGRAMAS EN ANTROPOLOGÍA</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '32 - PERIODISMO E INFORMACIÓN') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>321 - PERIODISMO Y LOCUCIÓN</option><option>322 - CIENCIAS DE LA COMUNICACIÓN</option><option>323 - BIBLIOTECOLOGÍA Y ARCHIVO</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '321 - PERIODISMO Y LOCUCIÓN') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>321014 - LOCUCIÓN Y COMUNICACIÓN DE RADIO Y TELEVISIÓN</option><option>321994 - OTROS PROGRAMAS EN PERIODISMO Y LOCUCIÓN</option></select>';
                  } else if (professionalProgramSelect.value === '322 - CIENCIAS DE LA COMUNICACIÓN') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>322014 - PRODUCCIÓN RADIAL Y TELEVISIVA</option><option>322024 - PROGRAMACIÓN DE SISTEMAS DE INFORMACIÓN</option><option>322994 - OTROS PROGRAMAS EN CIENCIAS DE LA COMUNICACIÓN</option></select>';
                  } else if (professionalProgramSelect.value === '323 - BIBLIOTECOLOGÍA Y ARCHIVO') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>323994 - OTROS PROGRAMAS EN BIBLIOTECOLOGÍA Y ARCHIVO</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else {
                professionalProgramLabel.innerHTML = originalProfessionalProgramField;
                programLabel.innerHTML = originalProgramField;
              }
            });
          } else if (careerSelect.value === '4 - CIENCIAS ADMINISTRATIVAS Y DERECHO') {
            generalProgramLabel.innerHTML = '<span>Programa General *</span><select required><option value="">Seleccione programa general</option><option>41 - ADMINISTRACIÓN Y COMERCIO</option><option>42 - DERECHO</option></select>';
            professionalProgramLabel.innerHTML = originalProfessionalProgramField;
            programLabel.innerHTML = originalProgramField;
            const generalProgramSelect = generalProgramLabel.querySelector('select');
            generalProgramSelect.addEventListener('change', () => {
              if (generalProgramSelect.value === '41 - ADMINISTRACIÓN Y COMERCIO') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>411 - CONTABILIDAD E IMPUESTOS</option><option>412 - GESTIÓN FINANCIERA, ADMINISTRACIÓN BANCARIA Y SEGUROS</option><option>413 - GESTIÓN Y ADMINISTRACIÓN</option><option>414 - MARKETING Y PUBLICIDAD</option><option>415 - SECRETARIADO Y TRABAJO DE OFICINA</option><option>416 - NEGOCIOS INTERNACIONALES</option><option>417 - ADMINISTRACIÓN PÚBLICA</option><option>418 - COMPETENCIAS LABORALES</option><option>419 - OTROS PROGRAMAS EN ADMINISTRACIÓN Y COMERCIO</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '411 - CONTABILIDAD E IMPUESTOS') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>411014 - CONTABILIDAD</option><option>411024 - CONTABILIDAD OPERATIVA</option><option>411994 - OTROS PROGRAMAS EN CONTABILIDAD E IMPUESTOS</option></select>';
                  } else if (professionalProgramSelect.value === '412 - GESTIÓN FINANCIERA, ADMINISTRACIÓN BANCARIA Y SEGUROS') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>412014 - ASESORAMIENTO OPERATIVO Y COMERCIAL DE PRODUCTOS BANCARIOS Y FINANCIEROS</option><option>412994 - OTROS PROGRAMAS EN GESTIÓN FINANCIERA, ADMINISTRACIÓN BANCARIA Y SEGUROS</option></select>';
                  } else if (professionalProgramSelect.value === '413 - GESTIÓN Y ADMINISTRACIÓN') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>413014 - ADMINISTRACIÓN DE PEQUEÑOS NEGOCIOS</option><option>413024 - ADMINISTRACIÓN DE SERVICIOS</option><option>413034 - GESTIÓN EMPRESARIAL</option><option>413044 - GESTIÓN Y ADMINISTRACIÓN DE PEQUEÑOS NEGOCIOS</option><option>413054 - TÉCNICO TRILINGÜE EN GESTIÓN EMPRESARIAL</option><option>413994 - OTROS PROGRAMAS EN ADMINISTRACIÓN DE EMPRESAS</option></select>';
                  } else if (professionalProgramSelect.value === '414 - MARKETING Y PUBLICIDAD') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>414994 - OTROS PROGRAMAS EN MARKETING Y PUBLICIDAD</option></select>';
                  } else if (professionalProgramSelect.value === '415 - SECRETARIADO Y TRABAJO DE OFICINA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>415994 - OTROS PROGRAMAS EN SECRETARIADO Y TRABAJO DE OFICINA</option></select>';
                  } else if (professionalProgramSelect.value === '416 - NEGOCIOS INTERNACIONALES') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>416014 - COMERCIO INTERNACIONAL</option><option>416024 - NEGOCIOS - COMERCIO INTERNACIONAL</option><option>416024 - NEGOCIOS EN COMERCIO INTERNACIONAL</option><option>416994 - OTROS PROGRAMAS EN NEGOCIOS INTERNACIONALES</option></select>';
                  } else if (professionalProgramSelect.value === '417 - ADMINISTRACIÓN PÚBLICA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>417994 - OTROS PROGRAMAS EN ADMINISTRACIÓN PÚBLICA</option></select>';
                  } else if (professionalProgramSelect.value === '418 - COMPETENCIAS LABORALES') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>418994 - OTROS PROGRAMAS EN COMPETENCIAS LABORALES</option></select>';
                  } else if (professionalProgramSelect.value === '419 - OTROS PROGRAMAS EN ADMINISTRACIÓN Y COMERCIO') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>418014 - COMERCIO</option><option>418024 - COMERCIO Y PRODUCCIÓN</option><option>418034 - NEGOCIOS - COMERCIO Y PRODUCCIÓN</option><option>418034 - NEGOCIOS EN COMERCIO Y PRODUCCIÓN</option><option>418044 - GESTIÓN DE LOGÍSTICA Y DE ALMACENES</option><option>418054 - LOGÍSTICA Y ALMACENES</option><option>418064 - ORGANIZACIÓN DE EVENTOS Y ESPECTÁCULOS</option><option>418994 - OTROS PROGRAMAS EN ADMINISTRACIÓN</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '42 - DERECHO') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>421 - DERECHO PÚBLICO</option><option>422 - DERECHO PRIVADO</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '421 - DERECHO PÚBLICO') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>421994 - OTROS PROGRAMAS EN DERECHO PÚBLICO</option></select>';
                  } else if (professionalProgramSelect.value === '422 - DERECHO PRIVADO') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>422994 - OTROS PROGRAMAS EN DERECHO PRIVADO</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else {
                professionalProgramLabel.innerHTML = originalProfessionalProgramField;
                programLabel.innerHTML = originalProgramField;
              }
            });
          } else if (careerSelect.value === '5 - CIENCIAS NATURALES, MATEMÁTICAS Y ESTADÍSTICA') {
            generalProgramLabel.innerHTML = '<span>Programa General *</span><select required><option value="">Seleccione programa general</option><option>51 - CIENCIAS BIOLÓGICAS Y AFINES</option><option>52 - MEDIO AMBIENTE</option><option>53 - CIENCIAS FÍSICAS Y QUÍMICAS</option><option>54 - MATEMÁTICAS Y ESTADÍSTICA</option></select>';
            professionalProgramLabel.innerHTML = originalProfessionalProgramField;
            programLabel.innerHTML = originalProgramField;
            const generalProgramSelect = generalProgramLabel.querySelector('select');
            generalProgramSelect.addEventListener('change', () => {
              if (generalProgramSelect.value === '51 - CIENCIAS BIOLÓGICAS Y AFINES') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>511 - BIOLOGÍA</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '511 - BIOLOGÍA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>511994 - OTROS PROGRAMAS EN BIOLOGÍA</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '52 - MEDIO AMBIENTE') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>521 - ECOLOGÍA Y MEDIO AMBIENTE</option><option>522 - RECURSOS HÍDRICOS</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '521 - ECOLOGÍA Y MEDIO AMBIENTE') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>521014 - MEDIO AMBIENTE</option><option>521994 - OTROS PROGRAMAS EN ECOLOGÍA Y MEDIO AMBIENTE</option></select>';
                  } else if (professionalProgramSelect.value === '522 - RECURSOS HÍDRICOS') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>522994 - OTROS PROGRAMAS EN RECURSOS HÍDRICOS</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '53 - CIENCIAS FÍSICAS Y QUÍMICAS') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>531 - QUÍMICA</option><option>532 - CIENCIAS DE LA TIERRA</option><option>533 - FÍSICA</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '531 - QUÍMICA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>531994 - OTROS PROGRAMAS EN QUÍMICA</option></select>';
                  } else if (professionalProgramSelect.value === '532 - CIENCIAS DE LA TIERRA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>532014 - GEOLOGÍA Y EXPLORACIÓN</option><option>532994 - OTROS PROGRAMAS EN CIENCIAS DE LA TIERRA</option></select>';
                  } else if (professionalProgramSelect.value === '533 - FÍSICA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>533994 - OTROS PROGRAMAS EN FÍSICA</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '54 - MATEMÁTICAS Y ESTADÍSTICA') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>541 - MATEMÁTICA</option><option>542 - ESTADÍSTICA</option><option>543 - INVESTIGACIÓN OPERATIVA</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '541 - MATEMÁTICA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>541994 - OTROS PROGRAMAS EN MATEMÁTICA</option></select>';
                  } else if (professionalProgramSelect.value === '542 - ESTADÍSTICA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>542994 - OTROS PROGRAMAS EN ESTADÍSTICA</option></select>';
                  } else if (professionalProgramSelect.value === '543 - INVESTIGACIÓN OPERATIVA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>543994 - OTROS PROGRAMAS EN INVESTIGACIÓN OPERATIVA</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else {
                professionalProgramLabel.innerHTML = originalProfessionalProgramField;
                programLabel.innerHTML = originalProgramField;
              }
            });
          } else if (careerSelect.value === '6 - TECNOLOGÍA DE LA INFORMACIÓN Y LA COMUNICACIÓN') {
            generalProgramLabel.innerHTML = '<span>Programa General *</span><select required><option value="">Seleccione programa general</option><option>61 - INFORMÁTICA</option></select>';
            professionalProgramLabel.innerHTML = originalProfessionalProgramField;
            programLabel.innerHTML = originalProgramField;
            const generalProgramSelect = generalProgramLabel.querySelector('select');
            generalProgramSelect.addEventListener('change', () => {
              if (generalProgramSelect.value === '61 - INFORMÁTICA') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>611 - CIENCIAS DE LA COMPUTACIÓN</option><option>612 - SISTEMAS Y CÓMPUTO</option><option>613 - TELECOMUNICACIONES</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '611 - CIENCIAS DE LA COMPUTACIÓN') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>611014 - COMPUTACIÓN</option><option>611994 - OTROS PROGRAMAS EN CIENCIAS DE LA COMPUTACIÓN</option></select>';
                  } else if (professionalProgramSelect.value === '612 - SISTEMAS Y CÓMPUTO') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>612014 - ADMINISTRACIÓN DE BASE DE DATOS</option><option>612024 - ADMINISTRACIÓN DE REDES</option><option>612034 - DESARROLLO DE REDES</option><option>612044 - DESARROLLO DE SOFTWARE</option><option>612054 - MANTENIMIENTO DE EQUIPO DE CÓMPUTO</option><option>612064 - OPERACIÓN DE COMPUTADORAS</option><option>612074 - TÉCNICAS DE INGENIERÍA DE SISTEMAS DE INFORMACIÓN</option><option>612994 - OTROS PROGRAMAS EN SISTEMAS Y CÓMPUTO</option></select>';
                  } else if (professionalProgramSelect.value === '613 - TELECOMUNICACIONES') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>613014 - PLATAFORMAS Y SERVICIOS DE TECNOLOGÍAS DE LA INFORMACIÓN</option><option>613024 - REDES Y COMUNICACIONES</option><option>613034 - SISTEMAS DE TELECOMUNICACIONES DE VOZ Y DATOS</option><option>613994 - OTROS PROGRAMAS EN TELECOMUNICACIONES</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else {
                professionalProgramLabel.innerHTML = originalProfessionalProgramField;
                programLabel.innerHTML = originalProgramField;
              }
            });
          } else if (careerSelect.value === '7 - INGENIERÍA, INDUSTRIA Y CONSTRUCCIÓN') {
            generalProgramLabel.innerHTML = '<span>Programa General *</span><select required><option value="">Seleccione programa general</option><option>71 - INGENIERÍA Y PROFESIONES AFINES</option><option>72 - INDUSTRIA Y PRODUCCIÓN</option><option>73 - ARQUITECTURA Y CONSTRUCCIÓN</option></select>';
            professionalProgramLabel.innerHTML = originalProfessionalProgramField;
            programLabel.innerHTML = originalProgramField;
            const generalProgramSelect = generalProgramLabel.querySelector('select');
            generalProgramSelect.addEventListener('change', () => {
              if (generalProgramSelect.value === '71 - INGENIERÍA Y PROFESIONES AFINES') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>711 - ELECTRICIDAD Y ENERGÍA</option><option>712 - ELECTRÓNICA Y AUTOMATIZACIÓN</option><option>713 - MECÁNICA Y METALÚRGICA</option><option>714 - VEHÍCULOS, BARCOS Y AERONAVES MOTORIZADAS</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '711 - ELECTRICIDAD Y ENERGÍA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>711014 - ELECTRICIDAD</option><option>711024 - ELECTRICIDAD INDUSTRIAL</option><option>711034 - INSTALACIONES ELECTROTÉCNICAS</option><option>711044 - MANTENIMIENTO DE MAQUINARIAS Y REDES ELÉCTRICAS</option><option>711044 - MANTENIMIENTO DE MÁQUINAS Y REDES ELÉCTRICAS</option><option>711054 - MANTENIMIENTO DE SISTEMAS ELÉCTRICOS</option><option>711064 - MANTENIMIENTO ELÉCTRICO E INSTRUMENTACIÓN</option><option>711994 - OTROS PROGRAMAS EN ELECTRICIDAD Y ENERGÍA</option></select>';
                  } else if (professionalProgramSelect.value === '712 - ELECTRÓNICA Y AUTOMATIZACIÓN') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>712014 - ELECTRÓNICA</option><option>712024 - ELECTRÓNICA DE CONSUMO</option><option>712034 - EQUIPOS ELECTRÓNICOS DE CONSUMO</option><option>712044 - INSTRUMENTACIÓN INDUSTRIAL</option><option>712054 - MANTENIMIENTO DE PLANTAS INDUSTRIALES</option><option>712064 - MANTENIMIENTO DE SISTEMAS ELECTRÓNICOS</option><option>712074 - MANTENIMIENTO ELECTRÓNICO INDUSTRIAL</option><option>712084 - REFRIGERACIÓN Y AIRE ACONDICIONADO</option><option>712994 - OTROS PROGRAMAS EN ELECTRÓNICA Y AUTOMATIZACIÓN</option></select>';
                  } else if (professionalProgramSelect.value === '713 - MECÁNICA Y METALÚRGICA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>713014 - CONSTRUCCIONES METÁLICAS</option><option>713024 - ELECTRICISTA AUTOMOTRIZ</option><option>713034 - ELECTROMECÁNICA</option><option>713044 - MANTENIMIENTO DE EQUIPO PESADO</option><option>713054 - MATRICERÍA</option><option>713064 - MECÁNICA AUTOMOTRIZ</option><option>713074 - MECÁNICA DE EQUIPOS PESADOS</option><option>713084 - MECÁNICA DE PLANTA</option><option>713094 - MECÁNICA DE PRODUCCIÓN</option><option>713104 - MECÁNICA INDUSTRIAL</option><option>713114 - MECÁNICO DE MAQUINARIA AGRÍCOLA</option><option>713124 - MECÁNICO DE MOTORES MENORES</option><option>713134 - MECÁNICO DE REFRIGERACIÓN Y AIRE ACONDICIONADO</option><option>713144 - MECATRÓNICA AUTOMOTRIZ</option><option>713154 - PROCESOS METALÚRGICOS Y QUÍMICOS</option><option>713164 - SERVICIO DE MANTENIMIENTO DE EQUIPO PESADO</option><option>713174 - SOLDADOR ESTRUCTURAL</option><option>713184 - SOLDADOR TUBERO</option><option>713994 - OTROS PROGRAMAS EN MECÁNICA Y METALÚRGICA</option></select>';
                  } else if (professionalProgramSelect.value === '714 - VEHÍCULOS, BARCOS Y AERONAVES MOTORIZADAS') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>714994 - OTROS PROGRAMAS EN VEHÍCULOS, BARCOS Y AERONAVES MOTORIZADAS</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '72 - INDUSTRIA Y PRODUCCIÓN') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>721 - INDUSTRIAS ALIMENTARIAS</option><option>722 - INDUSTRIA Y PRODUCTOS TRANSFORMADOS (EXCEPTO ALIMENTOS, TEXTIL, AGRO, MINAS Y PETRÓLEO)</option><option>723 - PRODUCCIÓN TEXTIL Y CONFECCIONES</option><option>724 - MINERÍA Y EXTRACCIÓN</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '721 - INDUSTRIAS ALIMENTARIAS') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>721014 - CONFITERÍA INDUSTRIAL</option><option>721024 - CONSERVACIÓN DE CARNES, PRODUCTOS HIDROBIOLÓGICOS Y VEGETALES</option><option>721034 - EXTRACCIÓN DE ACEITES, GRASAS Y AZÚCAR</option><option>721044 - INDUSTRIAS LÁCTEAS</option><option>721054 - MOLINERÍA Y PROCESAMIENTO DE GRANOS Y TUBÉRCULOS</option><option>721064 - OPERADOR DE PROCESOS EN LA INDUSTRIA ALIMENTARIA</option><option>721074 - PANADERÍA Y PASTELERÍA INDUSTRIAL</option><option>721084 - PANIFICACIÓN</option><option>721094 - PANIFICADOR INDUSTRIAL</option><option>721104 - PRODUCCIÓN INDUSTRIAL DE VINOS, PISCOS Y OTROS PRODUCTOS AFINES</option><option>721994 - OTROS PROGRAMAS EN INDUSTRIAS ALIMENTARIAS</option></select>';
                  } else if (professionalProgramSelect.value === '722 - INDUSTRIA Y PRODUCTOS TRANSFORMADOS (EXCEPTO ALIMENTOS, TEXTIL, AGRO, MINAS Y PETRÓLEO)') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>722994 - OTROS PROGRAMAS EN INDUSTRIA Y PRODUCTOS TRANSFORMADOS (EXCEPTO ALIMENTOS, TEXTIL, AGRO, MINAS Y PETRÓLEO)</option></select>';
                  } else if (professionalProgramSelect.value === '723 - PRODUCCIÓN TEXTIL Y CONFECCIONES') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>723024 - CONFECCIÓN INDUSTRIAL</option><option>723034 - CONFECCIÓN TEXTIL</option><option>723044 - CONFECCIONISTA DE PRENDAS DE VESTIR</option><option>723054 - CONTROLISTA DE CALIDAD TEXTIL</option><option>723064 - CURTIEMBRE Y PELETERÍA</option><option>723074 - ELECTROMECÁNICO TEXTIL EN HILANDERÍA</option><option>723084 - FABRICACIÓN DE PRENDAS DE VESTIR</option><option>723094 - INDUSTRIA DEL CALZADO</option><option>723104 - INDUSTRIA DEL VESTIDO</option><option>723114 - MECÁNICO DE MANTENIMIENTO DE MÁQUINAS DE CONFECCIÓN TEXTIL</option><option>723124 - MECÁNICO TEXTIL EN GÉNERO PUNTO</option><option>723134 - MECÁNICO TEXTIL EN HILANDERÍA</option><option>723144 - MECÁNICO TEXTIL EN TEJEDURÍA PLANA</option><option>723154 - SASTRERÍA</option><option>723164 - TEJIDO A MANO</option><option>723174 - TEJIDO A MANO Y A MÁQUINA DE TEJER</option><option>723184 - TEJIDO A MÁQUINA</option><option>723194 - TINTORERÍA Y ACABADO TEXTIL</option><option>723994 - OTROS PROGRAMAS EN PRODUCCIÓN TEXTIL Y CONFECCIONES</option></select>';
                  } else if (professionalProgramSelect.value === '724 - MINERÍA Y EXTRACCIÓN') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>724014 - CONCENTRACIÓN DE MINERALES POR SEPARACIÓN FÍSICA</option><option>724024 - EXPLOTACIÓN DE MINAS</option><option>724034 - OPERACIONES DE PERFORACIÓN</option><option>724044 - PROCESAMIENTO DE MINERALES</option><option>724054 - SECCIONES DELGADAS Y PULIDAS</option><option>724064 - SEGURIDAD MINERA E INDUSTRIAL</option><option>724994 - OTROS PROGRAMAS EN MINERÍA Y EXTRACCIÓN</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '73 - ARQUITECTURA Y CONSTRUCCIÓN') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>731 - ARQUITECTURA Y URBANISMO</option><option>732 - CONSTRUCCIÓN E INGENIERÍA CIVIL</option><option>733 - INGENIERÍA SANITARIA</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '731 - ARQUITECTURA Y URBANISMO') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>731014 - DIBUJO DE ARQUITECTURA Y OBRAS CIVILES</option><option>731024 - DIBUJO DE CONSTRUCCIÓN CIVIL</option><option>731994 - OTROS PROGRAMAS EN ARQUITECTURA Y URBANISMO</option></select>';
                  } else if (professionalProgramSelect.value === '732 - CONSTRUCCIÓN E INGENIERÍA CIVIL') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>732014 - ADMINISTRACIÓN DE LA CONSTRUCCIÓN</option><option>732024 - ALBAÑILERÍA</option><option>732034 - GASFITERÍA</option><option>732044 - MANTENIMIENTO BÁSICO DE CASA Y EDIFICIOS</option><option>732054 - PLANEAMIENTO Y CONTROL DE PROYECTOS DE CONSTRUCCIÓN</option><option>732064 - TOPOGRAFÍA</option><option>732074 - TOPOGRAFÍA CIVIL Y MINERA</option><option>732994 - OTROS PROGRAMAS EN CONSTRUCCIÓN E INGENIERÍA CIVIL</option></select>';
                  } else if (professionalProgramSelect.value === '733 - INGENIERÍA SANITARIA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>733994 - OTROS PROGRAMAS EN INGENIERÍA SANITARIA</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else {
                professionalProgramLabel.innerHTML = originalProfessionalProgramField;
                programLabel.innerHTML = originalProgramField;
              }
            });
          } else if (careerSelect.value === '8 - AGRICULTURA, SILVICULTURA, PESCA Y VETERINARIA') {
            generalProgramLabel.innerHTML = '<span>Programa General *</span><select required><option value="">Seleccione programa general</option><option>81 - AGRICULTURA</option><option>82 - SILVICULTURA</option><option>83 - PESCA</option><option>84 - VETERINARIA</option></select>';
            professionalProgramLabel.innerHTML = originalProfessionalProgramField;
            programLabel.innerHTML = originalProgramField;
            const generalProgramSelect = generalProgramLabel.querySelector('select');
            generalProgramSelect.addEventListener('change', () => {
              if (generalProgramSelect.value === '81 - AGRICULTURA') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>811 - PRODUCCIÓN AGRÍCOLA Y GANADERA</option><option>812 - HORTICULTURA</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '811 - PRODUCCIÓN AGRÍCOLA Y GANADERA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>811014 - AVICULTURA Y CRIANZA DE ANIMALES MENORES</option><option>811024 - CAFICULTURA ORGÁNICA</option><option>811034 - FRUTICULTURA</option><option>811044 - VITICULTURA Y ENOLOGÍA</option><option>811994 - OTROS PROGRAMAS EN PRODUCCIÓN AGRÍCOLA Y GANADERA</option></select>';
                  } else if (professionalProgramSelect.value === '812 - HORTICULTURA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>812014 - HORTICULTURA</option><option>812024 - JARDINERÍA Y FLORICULTURA</option><option>812994 - OTROS PROGRAMAS EN HORTICULTURA</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '82 - SILVICULTURA') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>821 - SILVICULTURA</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '821 - SILVICULTURA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>821014 - CONSERVACIÓN Y APROVECHAMIENTO RACIONAL DE RECURSOS FORESTALES</option><option>821994 - OTROS PROGRAMAS EN SILVICULTURA</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '83 - PESCA') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>831 - PESCA</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '831 - PESCA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>831014 - NAVEGACIÓN Y PESCA</option><option>831994 - OTROS PROGRAMAS EN PESCA</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '84 - VETERINARIA') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>841 - VETERINARIA</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '841 - VETERINARIA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>841994 - OTROS PROGRAMAS EN VETERINARIA</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else {
                professionalProgramLabel.innerHTML = originalProfessionalProgramField;
                programLabel.innerHTML = originalProgramField;
              }
            });
          } else if (careerSelect.value === '9 - SALUD Y BIENESTAR') {
            generalProgramLabel.innerHTML = '<span>Programa General *</span><select required><option value="">Seleccione programa general</option><option>91 - SALUD</option><option>92 - BIENESTAR</option></select>';
            professionalProgramLabel.innerHTML = originalProfessionalProgramField;
            programLabel.innerHTML = originalProgramField;
            const generalProgramSelect = generalProgramLabel.querySelector('select');
            generalProgramSelect.addEventListener('change', () => {
              if (generalProgramSelect.value === '91 - SALUD') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>911 - ODONTOLOGÍA</option><option>912 - MEDICINA</option><option>913 - ENFERMERÍA</option><option>914 - OBSTETRICIA</option><option>915 - TECNOLOGÍA DE DIAGNÓSTICO Y TRATAMIENTO MÉDICO</option><option>916 - TERAPIA Y REHABILITACIÓN</option><option>917 - FARMACIA</option><option>918 - NUTRICIÓN</option><option>919 - OTROS PROGRAMAS EN SALUD</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '911 - ODONTOLOGÍA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>911994 - OTROS PROGRAMAS EN ODONTOLOGÍA</option></select>';
                  } else if (professionalProgramSelect.value === '912 - MEDICINA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>912014 - ALTO RIESGO</option><option>912994 - OTROS PROGRAMAS EN MEDICINA</option></select>';
                  } else if (professionalProgramSelect.value === '913 - ENFERMERÍA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>913994 - OTROS PROGRAMAS EN ENFERMERÍA</option></select>';
                  } else if (professionalProgramSelect.value === '914 - OBSTETRICIA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>914994 - OTROS PROGRAMAS EN OBSTETRICIA</option></select>';
                  } else if (professionalProgramSelect.value === '915 - TECNOLOGÍA DE DIAGNÓSTICO Y TRATAMIENTO MÉDICO') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>915994 - OTROS PROGRAMAS EN TECNOLOGÍA DE DIAGNÓSTICO Y TRATAMIENTO MÉDICO</option></select>';
                  } else if (professionalProgramSelect.value === '916 - TERAPIA Y REHABILITACIÓN') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>916994 - OTROS PROGRAMAS EN TERAPIA Y REHABILITACIÓN</option></select>';
                  } else if (professionalProgramSelect.value === '917 - FARMACIA') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>917014 - FARMACIA</option><option>917994 - OTROS PROGRAMAS EN FARMACIA</option></select>';
                  } else if (professionalProgramSelect.value === '918 - NUTRICIÓN') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>918994 - OTROS PROGRAMAS EN NUTRICIÓN</option></select>';
                  } else if (professionalProgramSelect.value === '919 - OTROS PROGRAMAS EN SALUD') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>919994 - OTROS PROGRAMAS EN SALUD</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else if (generalProgramSelect.value === '92 - BIENESTAR') {
                professionalProgramLabel.innerHTML = '<span>Programa Profesional *</span><select required><option value="">Seleccione programa profesional</option><option>921 - ASISTENCIA A ADULTOS MAYORES Y DISCAPACITADOS</option><option>922 - ASISTENCIA A LA INFANCIA Y SERVICIOS PARA JÓVENES</option><option>923 - TRABAJO SOCIAL</option></select>';
                programLabel.innerHTML = originalProgramField;
                const professionalProgramSelect = professionalProgramLabel.querySelector('select');
                professionalProgramSelect.addEventListener('change', () => {
                  if (professionalProgramSelect.value === '921 - ASISTENCIA A ADULTOS MAYORES Y DISCAPACITADOS') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>921994 - OTROS PROGRAMAS EN ASISTENCIA A ADULTOS MAYORES Y DISCAPACITADOS</option></select>';
                  } else if (professionalProgramSelect.value === '922 - ASISTENCIA A LA INFANCIA Y SERVICIOS PARA JÓVENES') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>922994 - OTROS PROGRAMAS EN ASISTENCIA A LA INFANCIA Y SERVICIOS PARA JÓVENES</option></select>';
                  } else if (professionalProgramSelect.value === '923 - TRABAJO SOCIAL') {
                    programLabel.innerHTML = '<span>Programa *</span><select required><option value="">Seleccione programa</option><option>923994 - OTROS PROGRAMAS EN TRABAJO SOCIAL</option></select>';
                  } else {
                    programLabel.innerHTML = originalProgramField;
                  }
                });
              } else {
                professionalProgramLabel.innerHTML = originalProfessionalProgramField;
                programLabel.innerHTML = originalProgramField;
              }
            });
          } else {
            generalProgramLabel.innerHTML = originalGeneralProgramField;
            professionalProgramLabel.innerHTML = originalProfessionalProgramField;
            programLabel.innerHTML = originalProgramField;
          }
        });
        if (situation !== 'TITULADO') return;
        specialtyGrid.insertAdjacentHTML('afterbegin', '<label id="technical-second-specialty" class="full academic-second-specialty"><input type="checkbox"> Título de segunda especialidad</label>');
        titleLabel.innerHTML = '<span>Título *</span><input required placeholder="Título">';
        titleSpecialtyLabel.hidden = true;
      };

      const configurePrimaryStudyFields = isPrimary => {
        if (!isPrimary) {
          if (form.dataset.primaryStudyConfigured === 'true') {
            studyLabels.forEach((label, index) => { label.innerHTML = originalStudyFields[index]; });
            form.dataset.primaryStudyConfigured = 'false';
          }
          return;
        }
        form.dataset.primaryStudyConfigured = 'true';
        studyLabels[0].innerHTML = '<span>Situación académica *</span><select required><option value="">Seleccione situación académica</option><option>INCOMPLETO</option><option>COMPLETO</option></select>';
        const startYears = Array.from({length: 51}, (_, index) => 2025 - index);
        studyLabels[1].innerHTML = `<span>Año de inicio *</span><select id="primary-start-year" required><option value="">Seleccione año de inicio</option>${startYears.map(year => `<option>${year}</option>`).join('')}</select>`;
        studyLabels[2].innerHTML = '<span>Año final *</span><select id="primary-end-year" required disabled><option value="">Seleccione primero el año de inicio</option></select>';
        const startYear = document.getElementById('primary-start-year');
        const endYear = document.getElementById('primary-end-year');
        startYear.addEventListener('change', () => {
          const selectedYear = Number(startYear.value);
          if (!selectedYear) {
            endYear.innerHTML = '<option value="">Seleccione primero el año de inicio</option>';
            endYear.disabled = true;
            return;
          }
          const endYears = Array.from({length: 2026 - selectedYear + 1}, (_, index) => 2026 - index);
          endYear.innerHTML = '<option value="">Seleccione año final</option>' + endYears.map(year => `<option>${year}</option>`).join('');
          endYear.disabled = false;
        });
      };
      const configureTechnicalProductiveFields = isTechnical => {
        if (!isTechnical) {
          if (form.dataset.technicalStudyConfigured === 'true') {
            resetTechnicalTitleFields();
            studyLabels.forEach((label, index) => { label.innerHTML = originalStudyFields[index]; });
            specialtyLevelSelect.value = '';
            form.dataset.technicalStudyConfigured = 'false';
          }
          return;
        }
        form.dataset.technicalStudyConfigured = 'true';
        studyLabels[0].innerHTML = '<span>Situación académica *</span><select required><option value="">Seleccione situación académica</option><option>INCOMPLETO</option><option>EGRESADO</option><option>TITULADO</option></select>';
        const technicalSituation = studyLabels[0].querySelector('select');
        technicalSituation.addEventListener('change', () => updateTechnicalTitleFields(technicalSituation.value));
        const startYears = Array.from({length: 36}, (_, index) => 2025 - index);
        studyLabels[1].innerHTML = `<span>Año de inicio *</span><select id="technical-start-year" required><option value="">Seleccione año de inicio</option>${startYears.map(year => `<option>${year}</option>`).join('')}</select>`;
        studyLabels[2].innerHTML = '<span>Año final *</span><select id="technical-end-year" required disabled><option value="">Seleccione primero el año de inicio</option></select>';
        const startYear = document.getElementById('technical-start-year');
        const endYear = document.getElementById('technical-end-year');
        startYear.addEventListener('change', () => {
          const selectedYear = Number(startYear.value);
          if (!selectedYear) {
            endYear.innerHTML = '<option value="">Seleccione primero el año de inicio</option>';
            endYear.disabled = true;
            return;
          }
          const endYears = Array.from({length: 2026 - selectedYear + 1}, (_, index) => 2026 - index);
          endYear.innerHTML = '<option value="">Seleccione año final</option>' + endYears.map(year => `<option>${year}</option>`).join('');
          endYear.disabled = false;
        });
        specialtyLevelSelect.value = 'TÉCNICO';
      };
      const configureSuperiorStudyFields = isSuperior => {
        document.getElementById('superior-achieved-degree')?.remove();
        document.getElementById('superior-second-specialty')?.remove();
        studyLabels[0].parentElement.classList.remove('academic-study-with-degree');
        if (!isSuperior) {
          if (form.dataset.superiorStudyConfigured === 'true') {
            studyLabels.forEach((label, index) => { label.innerHTML = originalStudyFields[index]; });
            form.dataset.superiorStudyConfigured = 'false';
          }
          return;
        }
        form.dataset.superiorStudyConfigured = 'true';
        const superiorType = sublevelSelect.value;
        const situations = superiorType === 'UNIVERSITARIO'
          ? ['INCOMPLETO', 'EGRESADO', 'CON GRADO', 'TITULADO']
          : ['PEDAGÓGICO', 'TECNOLÓGICO', 'ARTÍSTICO'].includes(superiorType)
            ? ['INCOMPLETO', 'EGRESADO', 'TITULADO', 'BACHILLER', 'BACHILLER TÉCNICO']
            : [];
        studyLabels[0].innerHTML = `<span>Situación académica *</span><select required><option value="">Seleccione situación académica</option>${situations.map(item => `<option>${item}</option>`).join('')}</select>`;
        const superiorSituation = studyLabels[0].querySelector('select');
        const updateAchievedDegree = () => {
          document.getElementById('superior-achieved-degree')?.remove();
          document.getElementById('superior-second-specialty')?.remove();
          const studyGrid = studyLabels[0].parentElement;
          studyGrid.classList.remove('academic-study-with-degree');
          if (['UNIVERSITARIO', 'PEDAGÓGICO', 'TECNOLÓGICO', 'ARTÍSTICO'].includes(superiorType) && superiorSituation.value === 'TITULADO') {
            specialtyGrid.insertAdjacentHTML('afterbegin', '<label id="superior-second-specialty" class="full academic-second-specialty"><input type="checkbox"> Título de segunda especialidad</label>');
          }
          if (superiorType !== 'UNIVERSITARIO' || superiorSituation.value !== 'CON GRADO') return;
          studyLabels[1].insertAdjacentHTML('beforebegin', '<label id="superior-achieved-degree"><span>Grado alcanzado *</span><select required><option value="">Seleccione grado alcanzado</option><option>BACHILLER</option></select></label>');
          studyGrid.classList.add('academic-study-with-degree');
        };
        superiorSituation.addEventListener('change', updateAchievedDegree);
        const startYears = Array.from({length: 76}, (_, index) => 2025 - index);
        studyLabels[1].innerHTML = `<span>Año de inicio *</span><select id="superior-start-year" required><option value="">Seleccione año de inicio</option>${startYears.map(year => `<option>${year}</option>`).join('')}</select>`;
        studyLabels[2].innerHTML = '<span>Año final *</span><select id="superior-end-year" required disabled><option value="">Seleccione primero el año de inicio</option></select>';
        const startYear = document.getElementById('superior-start-year');
        const endYear = document.getElementById('superior-end-year');
        startYear.addEventListener('change', () => {
          const selectedYear = Number(startYear.value);
          if (!selectedYear) {
            endYear.innerHTML = '<option value="">Seleccione primero el año de inicio</option>';
            endYear.disabled = true;
            return;
          }
          const endYears = Array.from({length: 2026 - selectedYear + 1}, (_, index) => 2026 - index);
          endYear.innerHTML = '<option value="">Seleccione año final</option>' + endYears.map(year => `<option>${year}</option>`).join('');
          endYear.disabled = false;
        });
      };
      const configurePostgraduateStudyFields = isPostgraduate => {
        document.getElementById('postgraduate-study-level')?.remove();
        studyLabels[0].parentElement.classList.remove('academic-study-four-columns');
        if (!isPostgraduate) {
          if (form.dataset.postgraduateStudyConfigured === 'true') {
            studyLabels.forEach((label, index) => { label.innerHTML = originalStudyFields[index]; });
            specialtyLevelSelect.innerHTML = originalSpecialtyLevelOptions;
            specialtyLevelSelect.disabled = false;
            specialtyLevelSelect.required = true;
            form.dataset.postgraduateStudyConfigured = 'false';
          }
          return;
        }
        form.dataset.postgraduateStudyConfigured = 'true';
        studyLabels[0].innerHTML = '<span>Situación académica *</span><select required><option value="">Seleccione situación académica</option><option>INCOMPLETO</option><option>EGRESADO</option><option>CON GRADO</option></select>';
        studyLabels[1].insertAdjacentHTML('beforebegin', '<label id="postgraduate-study-level"><span>Nivel de estudio *</span><select required><option value="">Seleccione nivel de estudio</option><option>DOCTORADO</option><option>MAGISTER</option><option>PHD</option></select></label>');
        const postgraduateSituation = studyLabels[0].querySelector('select');
        const postgraduateStudyLevel = document.getElementById('postgraduate-study-level');
        const postgraduateStudyLevelSelect = postgraduateStudyLevel.querySelector('select');
        const updatePostgraduateSpecialtyLevel = () => {
          const selectedLevel = postgraduateStudyLevelSelect.value;
          if (selectedLevel === 'DOCTORADO') {
            specialtyLevelSelect.innerHTML = '<option>DOCTORADO</option>';
            specialtyLevelSelect.disabled = false;
          } else if (selectedLevel === 'MAGISTER') {
            specialtyLevelSelect.innerHTML = '<option>MAESTRÍA</option>';
            specialtyLevelSelect.disabled = false;
          } else if (selectedLevel === 'PHD') {
            specialtyLevelSelect.innerHTML = '<option value="">Seleccione nivel</option><option>DOCTORADO</option><option>MAESTRÍA</option>';
            specialtyLevelSelect.disabled = false;
          } else {
            specialtyLevelSelect.innerHTML = '<option value="">Nivel</option>';
            specialtyLevelSelect.disabled = true;
          }
          specialtyLevelSelect.required = !specialtyLevelSelect.disabled;
        };
        postgraduateStudyLevelSelect.addEventListener('change', updatePostgraduateSpecialtyLevel);
        updatePostgraduateSpecialtyLevel();
        postgraduateSituation.addEventListener('change', () => {
          const isDegree = postgraduateSituation.value === 'CON GRADO';
          postgraduateStudyLevel.querySelector('span').textContent = `${isDegree ? 'Grado alcanzado' : 'Nivel de estudio'} *`;
          postgraduateStudyLevel.querySelector('select').options[0].textContent = isDegree ? 'Seleccione grado alcanzado' : 'Seleccione nivel de estudio';
        });
        studyLabels[0].parentElement.classList.add('academic-study-four-columns');
        const startYears = Array.from({length: 76}, (_, index) => 2025 - index);
        studyLabels[1].innerHTML = `<span>Año de inicio *</span><select id="postgraduate-start-year" required><option value="">Seleccione año de inicio</option>${startYears.map(year => `<option>${year}</option>`).join('')}</select>`;
        studyLabels[2].innerHTML = '<span>Año final *</span><select id="postgraduate-end-year" required disabled><option value="">Seleccione primero el año de inicio</option></select>';
        const startYear = document.getElementById('postgraduate-start-year');
        const endYear = document.getElementById('postgraduate-end-year');
        startYear.addEventListener('change', () => {
          const selectedYear = Number(startYear.value);
          if (!selectedYear) {
            endYear.innerHTML = '<option value="">Seleccione primero el año de inicio</option>';
            endYear.disabled = true;
            return;
          }
          const endYears = Array.from({length: 2026 - selectedYear + 1}, (_, index) => 2026 - index);
          endYear.innerHTML = '<option value="">Seleccione año final</option>' + endYears.map(year => `<option>${year}</option>`).join('');
          endYear.disabled = false;
        });
      };

      const setVisible = (element, visible, required = false) => {
        element.hidden = !visible;
        element.querySelectorAll('input,select,textarea').forEach(control => {
          control.disabled = !visible;
          if (required) control.required = visible;
        });
      };
      const updateSuperiorSpecialtyLevel = () => {
        const usesTechnicalLevels = levelSelect.value === 'SUPERIOR'
          && ['TECNOLÓGICO', 'ARTÍSTICO'].includes(sublevelSelect.value);
        if (usesTechnicalLevels) {
          specialtyLevelSelect.innerHTML = '<option value="">Seleccione nivel</option><option>AUXILIAR</option><option>PROFESIONAL TÉCNICO</option><option>TÉCNICO</option>';
          specialtyLevelSelect.dataset.superiorCustomOptions = 'true';
          return;
        }
        const usesProfessionalLevel = levelSelect.value === 'SUPERIOR'
          && ['UNIVERSITARIO', 'PEDAGÓGICO'].includes(sublevelSelect.value);
        if (usesProfessionalLevel) {
          specialtyLevelSelect.innerHTML = '<option>PROFESIONAL</option>';
          specialtyLevelSelect.dataset.superiorCustomOptions = 'true';
          specialtyLevelSelect.value = 'PROFESIONAL';
          return;
        }
        if (specialtyLevelSelect.dataset.superiorCustomOptions === 'true') {
          specialtyLevelSelect.innerHTML = originalSpecialtyLevelOptions;
          specialtyLevelSelect.dataset.superiorCustomOptions = 'false';
        }
        if (levelSelect.value === 'TÉCNICO PRODUCTIVA') specialtyLevelSelect.value = 'TÉCNICO';
      };
      const updateLevel = () => {
        const level = levelSelect.value;
        const isPrimary = level === 'PRIMARIA';
        const isSecondary = level === 'SECUNDARIA';
        const isTechnical = level === 'TÉCNICO PRODUCTIVA';
        const isSuperior = level === 'SUPERIOR';
        const isPostgraduate = level === 'SUPERIOR POSGRADO';
        const usesLocation = isPrimary || isSecondary;
        const usesCode = isTechnical || isSuperior || isPostgraduate;
        const usesSublevel = isSecondary || isSuperior;

        configureTechnicalProductiveFields(false);
        configurePrimaryStudyFields(false);
        configureSuperiorStudyFields(false);
        configurePostgraduateStudyFields(false);
        sublevel.querySelector('span').textContent = `${isSecondary ? 'Secundaria' : 'Superior'} *`;
        sublevelSelect.innerHTML = isSecondary
          ? '<option value="">Seleccione tipo de secundaria</option><option>SECUNDARIA BACHILLERATO</option><option>SECUNDARIA COMÚN</option><option>SECUNDARIA NO ESCOLARIZADA</option><option>SECUNDARIA TÉCNICA</option>'
          : '<option value="">Seleccione tipo de superior</option><option>UNIVERSITARIO</option><option>PEDAGÓGICO</option><option>TECNOLÓGICO</option><option>ARTÍSTICO</option>';
        setVisible(sublevel, usesSublevel, true);
        setVisible(centerLabel, !level || usesLocation, true);
        setVisible(centerCode, usesCode, true);
        locationFields.forEach((field, index) => setVisible(field, usesLocation, index === 0));
        advancedFieldsets.forEach(fieldset => {
          fieldset.hidden = false;
          fieldset.querySelectorAll('input,select,textarea').forEach(control => { control.disabled = false; });
        });
        if (isTechnical) configureTechnicalProductiveFields(true);
        if (isPrimary || isSecondary) configurePrimaryStudyFields(true);
        if (isSuperior) configureSuperiorStudyFields(true);
        updateSuperiorSpecialtyLevel();
        if (isPostgraduate) configurePostgraduateStudyFields(true);
        specialtyLabels[0].hidden = false;
        specialtyLabels[0].style.visibility = '';
        if (!isPostgraduate) {
          specialtyLevelSelect.disabled = false;
          specialtyLevelSelect.required = true;
        }
      };
      sublevelSelect.addEventListener('change', () => {
        updateSuperiorSpecialtyLevel();
        if (levelSelect.value === 'SUPERIOR') configureSuperiorStudyFields(true);
      });
      levelSelect.addEventListener('change', updateLevel);
      updateLevel();

      const departmentSelect = document.getElementById('academic-department');
      const provinceSelect = document.getElementById('academic-province');
      const districtSelect = document.getElementById('academic-district');
      const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();
      const reset = (select, text) => { select.innerHTML = `<option value="">${text}</option>`; select.disabled = true; };
      const loadUbigeo = async () => {
        let data = null;
        try { data = JSON.parse(localStorage.getItem('dre-ubigeo-peru-v1')); } catch (_) { data = null; }
        if (!data?.departments?.length || !data?.provinces?.length || !data?.districts?.length) {
          const base = 'https://raw.githubusercontent.com/RitchieRD/ubigeos-peru-data/main/json/';
          const responses = await Promise.all(['1_ubigeo_departamentos.json','2_ubigeo_provincias.json','3_ubigeo_distritos.json'].map(file => fetch(base + file)));
          if (responses.some(response => !response.ok)) throw new Error('No se pudo cargar el UBIGEO.');
          const json = await Promise.all(responses.map(response => response.json()));
          data = { departments: json[0].ubigeo_departamentos, provinces: json[1].ubigeo_provincias, districts: json[2].ubigeo_distritos };
          try { localStorage.setItem('dre-ubigeo-peru-v1', JSON.stringify(data)); } catch (_) {}
        }
        departmentSelect.addEventListener('change', () => {
          const department = data.departments.find(item => normalize(item.departamento) === normalize(departmentSelect.value));
          reset(districtSelect, 'Seleccione distrito');
          if (!department) return reset(provinceSelect, 'Seleccione provincia');
          const provinces = data.provinces.filter(item => String(item.departamento_id) === String(department.id)).sort((a,b) => a.provincia.localeCompare(b.provincia,'es'));
          provinceSelect.innerHTML = '<option value="">Seleccione provincia</option>' + provinces.map(item => `<option value="${item.id}">${item.provincia}</option>`).join('');
          provinceSelect.disabled = false;
        });
        provinceSelect.addEventListener('change', () => {
          if (!provinceSelect.value) return reset(districtSelect, 'Seleccione distrito');
          const districts = data.districts.filter(item => String(item.provincia_id) === String(provinceSelect.value)).sort((a,b) => a.distrito.localeCompare(b.distrito,'es'));
          districtSelect.innerHTML = '<option value="">Seleccione distrito</option>' + districts.map(item => `<option value="${item.ubigeo}">${item.distrito}</option>`).join('');
          districtSelect.disabled = false;
        });
      };
      loadUbigeo().catch(error => console.error(error));
    };
    const showAdminAcademic = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      academicMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs academic-tabs"><a class="active">Datos de formación académica y de títulos</a><a>Datos de capacitaciones</a><a>Datos de producción intelectual</a><a>Datos de idiomas</a></nav><fieldset class="admin-server-card"><legend>Registros de formación académica y títulos</legend><div class="academic-records"><div class="academic-records-head"><span>N°</span><span>Nivel educativo</span><span>Centro de estudios</span><span>Especialidad</span><span>Situación académica</span><span>Grado alcanzado</span><span>Año inicio</span><span>Año fin</span><span>Estado</span><span>Acciones</span></div><div class="academic-empty">No se encontraron registros</div></div></fieldset><form id="academic-form"><fieldset class="admin-server-card"><legend>Datos de formación académica</legend><div class="academic-form-grid"><label><span>Nivel educativo *</span><select required><option value="">Seleccione nivel educativo</option><option>PRIMARIA</option><option>SECUNDARIA</option><option>TÉCNICO PRODUCTIVA</option><option>SUPERIOR</option><option>SUPERIOR POSGRADO</option></select></label><label><span>País *</span><select required>${academicCountryOptions}</select></label><label><span>Centro de estudios *</span><input required placeholder="Centro de estudios"></label></div></fieldset><fieldset class="admin-server-card"><legend>Datos de estudio</legend><div class="academic-form-grid"><label><span>Situación académica</span><select><option value="">Seleccione situación</option><option>COMPLETO</option><option>EGRESADO</option><option>TITULADO</option><option>CON GRADO</option></select></label><label><span>Año de inicio</span><input type="number" min="1950" max="2100" placeholder="Año"></label><label><span>Año final</span><input type="number" min="1950" max="2100" placeholder="Año"></label></div></fieldset><fieldset class="admin-server-card"><legend>Especialidad</legend><div class="academic-form-grid"><label><span>Nivel *</span><select required><option value="">Seleccione nivel</option><option>TÉCNICO</option><option>BACHILLER</option><option>LICENCIADO</option><option>MAESTRÍA</option><option>DOCTORADO</option></select></label><label><span>Carrera</span><input placeholder="Carrera"></label><label><span>Programa general</span><input placeholder="Programa general"></label><label><span>Programa profesional</span><input placeholder="Programa profesional"></label><label><span>Programa</span><input placeholder="Programa"></label></div></fieldset><fieldset class="admin-server-card"><legend>Datos del título y el registro</legend><div class="academic-form-grid"><label><span>Título</span><input placeholder="Título"></label><label><span>Especialidad</span><input placeholder="Especialidad"></label><label><span>Fecha de expedición</span><input type="date"></label><div class="academic-radio full"><strong>Tipo centro</strong><label><input type="radio" name="center-type" value="UGEL"> UGEL</label><label><input type="radio" name="center-type" value="DRE"> DRE</label><label><input type="radio" name="center-type" value="MINEDU"> MINEDU</label><label><input type="radio" name="center-type" value="SUNEDU"> SUNEDU</label></div><label><span>Centro de registro</span><input placeholder="Centro de registro"></label><label><span>Nro. de registro</span><input placeholder="Número de registro"></label><label><span>Fecha de registro</span><input type="date"></label><label><span>Fecha de resolución</span><input type="date"></label><label><span>Número de resolución</span><input placeholder="Número de resolución"></label></div></fieldset><div class="academic-file-row"><label><strong>Documento *</strong><input required type="file" accept="application/pdf"></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div><p class="admin-required">(*) Datos obligatorios</p><div class="academic-actions"><button id="return-academic" type="button">← RETORNAR</button><span></span><button id="clear-academic" type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      setupAcademicLevelFields();
      const academicRecords = Array.isArray(server.formacionAcademica) ? server.formacionAcademica : [];
      const academicTable = adminContent.querySelector('.academic-records');
      const academicEmpty = academicTable?.querySelector('.academic-empty');
      if (academicRecords.length && academicEmpty) {
        academicEmpty.remove();
        academicRecords.forEach((record,index) => academicTable.insertAdjacentHTML('beforeend', `<div class="academic-records-row" data-academic-index="${index}" title="Doble clic para ver el detalle"><span>${index+1}</span><span>${record.nivel||'No registrado'}</span><span>${record.centro||'No registrado'}</span><span>${record.especialidad||'No registrado'}</span><span>${record.situacion||'No registrado'}</span><span>${record.grado||'No registrado'}</span><span>${record.inicio||'No registrado'}</span><span>${record.fin||'No registrado'}</span><span>APROBADO</span><span></span></div>`));
      }
      bindAcademicStatusButtons('.academic-records-row', 'formacion');
      const academicForm = document.getElementById('academic-form');
      academicTable?.querySelectorAll('.academic-records-row').forEach(row => row.addEventListener('dblclick', () => {
        academicTable.querySelectorAll('.academic-records-row').forEach(item => item.removeAttribute('data-selected'));
        row.setAttribute('data-selected','true');
        const record = academicRecords[Number(row.dataset.academicIndex)];
        const academicValue = value => value || 'No registrado';
        academicForm.innerHTML = `<fieldset class="admin-server-card"><legend>Datos de formación académica</legend><div class="admin-summary-grid">${detail('Nivel educativo',academicValue(record.nivel))}${detail('País',academicValue(record.pais))}${detail('Centro de estudios',academicValue(record.centro))}${detail('Departamento',academicValue(record.departamento))}${detail('Provincia',academicValue(record.provincia))}${detail('Distrito',academicValue(record.distrito))}</div></fieldset><fieldset class="admin-server-card"><legend>Datos de estudio</legend><div class="admin-summary-grid">${detail('Situación académica',academicValue(record.situacion))}${detail('Grado alcanzado',academicValue(record.grado))}${detail('Año inicio',academicValue(record.inicio))}${detail('Año final',academicValue(record.fin))}</div></fieldset><fieldset class="admin-server-card"><legend>Datos de definición de la carrera</legend><div class="admin-summary-grid">${detail('Grupo de carrera',academicValue(record.grupoCarrera))}${detail('Nivel',academicValue(record.nivelCarrera))}${detail('Especialidad',academicValue(record.especialidad))}</div></fieldset><fieldset class="admin-server-card"><legend>Datos del título y el registro</legend><div class="admin-summary-grid">${detail('Título',academicValue(record.titulo||record.grado))}${detail('Especialidad',academicValue(record.especialidad))}${detail('Fecha de expedición',academicValue(record.fechaExpedicion))}${detail('Centro de registro',academicValue(record.centroRegistro))}${detail('Nro. de registro',academicValue(record.numeroRegistro))}${detail('Fecha de registro',academicValue(record.fechaRegistro))}${detail('Fecha de resolución',academicValue(record.fechaResolucion))}${detail('Resolución de registro',academicValue(record.numeroResolucion))}</div></fieldset><div class="academic-file-row">${detail('Documento',academicValue(record.documento))}${detail('Folios',academicValue(record.folios))}</div><div class="academic-actions"><button id="return-academic-detail" type="button">← RETORNAR</button><span></span><button id="cancel-academic-detail" type="button">⌫ CANCELAR</button></div>`;
        document.getElementById('return-academic-detail')?.addEventListener('click', showAdminAcademic);
        document.getElementById('cancel-academic-detail')?.addEventListener('click', showAdminAcademic);
      }));
      document.getElementById('return-academic').addEventListener('click', () => { window.location.href = 'gestion-servidor.html'; });
      document.getElementById('academic-form').addEventListener('submit', event => { event.preventDefault(); alert('Formación académica guardada correctamente.'); });
      document.querySelectorAll('.academic-tabs a')[1].addEventListener('click', showAdminTraining);
      document.querySelectorAll('.academic-tabs a')[2].addEventListener('click', showAdminIntellectualProduction);
      document.querySelectorAll('.academic-tabs a')[3].addEventListener('click', showAdminLanguages);
      window.location.hash = 'academica';
    };
    const academicTabs = active => `<nav class="admin-server-tabs academic-tabs"><a class="${active===0?'active':''}">Datos de formación académica y de títulos</a><a class="${active===1?'active':''}">Datos de capacitaciones</a><a class="${active===2?'active':''}">Datos de producción intelectual</a><a class="${active===3?'active':''}">Datos de idiomas</a></nav>`;
    const bindAcademicTabs = () => {
      const tabs=document.querySelectorAll('.academic-tabs a');
      tabs[0]?.addEventListener('click',showAdminAcademic);
      tabs[1]?.addEventListener('click',showAdminTraining);
      tabs[2]?.addEventListener('click',showAdminIntellectualProduction);
      tabs[3]?.addEventListener('click',showAdminLanguages);
    };
    const bindAcademicStatusButtons = (rowSelector, section) => {
      adminContent.querySelectorAll(rowSelector).forEach((row, index) => {
        const cells = row.querySelectorAll(':scope > span');
        const statusCell = cells[cells.length - 2];
        const actionsCell = cells[cells.length - 1];
        if (!statusCell || !actionsCell) return;
        actionsCell.classList.add('record-actions','academic-record-actions');
        const recordIndex = row.dataset.academicIndex ?? row.dataset.trainingIndex ?? row.dataset.productionIndex ?? row.dataset.languageIndex ?? index;
        const storageKey = `dre-academic-status:${server.dni}:${section}:${recordIndex}`;
        const renderStatus = status => {
          const normalized = status === 'ANULADO' || status === 'DESAPROBADO' ? 'ANULADO' : 'APROBADO';
          statusCell.textContent = normalized;
          statusCell.classList.toggle('academic-status-cancelled', normalized === 'ANULADO');
          statusCell.classList.toggle('academic-status-approved', normalized === 'APROBADO');
          return normalized;
        };
        let currentStatus = renderStatus(localStorage.getItem(storageKey) || 'APROBADO');
        actionsCell.innerHTML = '<button class="academic-status-toggle" type="button" title="Cambiar estado" aria-label="Cambiar estado">⊖</button>';
        actionsCell.querySelector('button')?.addEventListener('click', event => {
          event.stopPropagation();
          currentStatus = renderStatus(currentStatus === 'ANULADO' ? 'APROBADO' : 'ANULADO');
          localStorage.setItem(storageKey, currentStatus);
          saveStatusToDatabase(storageKey,currentStatus);
        });
        loadStatusFromDatabase(storageKey,status=>{currentStatus=renderStatus(status);});
        const sectionRecords={formacion:server.formacionAcademica,capacitaciones:server.capacitaciones,idiomas:server.idiomasAcademicos};
        appendDatabaseDelete(actionsCell,(sectionRecords[section]||[])[Number(recordIndex)],row);
      });
    };
    const showAdminTraining = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link=>link.classList.remove('active')); academicMenu.classList.add('active');
      const trainingRecords=Array.isArray(server.capacitaciones)?server.capacitaciones:[];
      const records=trainingRecords.map(item=>[item.tipo,item.institucion,item.tema,item.documento,item.inicio,item.fin,item.emision,item.horas]);
      const rows=records.length?records.map((r,i)=>`<div class="training-row" data-training-index="${i}" title="Doble clic para ver el detalle"><span>${i+1}</span>${r.map(v=>`<span>${v||'No registrado'}</span>`).join('')}<span>APROBADO</span><span></span></div>`).join(''):'<div class="ascent-empty">No se encontraron registros</div>';
      adminContent.innerHTML=`${serverSummary()}${academicTabs(1)}<fieldset class="admin-server-card"><legend>Registros de capacitación</legend><div class="training-table"><div class="training-head"><span>N°</span><span>Tipo de estudios</span><span>Institución</span><span>Tema</span><span>Documento de acreditación</span><span>F. inicio</span><span>F. fin</span><span>F. emisión</span><span>Duración en horas</span><span>Estado</span><span>Acciones</span></div>${rows}<div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 36 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>2</button><button>3</button><button>4</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 4 páginas</strong></div></div></fieldset><form id="training-form"><fieldset class="admin-server-card"><legend>Datos de capacitación</legend><div class="academic-detail-grid"><label><span>Tipo de Estudios *</span><select required><option value="">Seleccione tipo de estudios</option><option>ACTUALIZACIÓN</option><option>CAPACITACIÓN</option><option>CURSO</option><option>DIPLOMADO</option><option>DIPLOMADO DE POSGRADO</option><option>ESPECIALIZACIÓN</option><option>OTROS</option><option>PROGRAMA</option><option>SEMINARIO</option><option>TALLER</option></select></label><label><span>Tema</span><input></label><label><span>Fecha de inicio</span><input type="date"></label><label><span>Fecha fin</span><input type="date"></label><label><span>Tipo de participación</span><select><option>PARTICIPANTE</option><option>PONENTE</option><option>ORGANIZADOR</option></select></label><label><span>Institución</span><input></label><label><span>País</span><select><option>PERÚ</option></select></label><label><span>Ciudad</span><input></label><label><span>Documento de acreditación</span><select><option>CONSTANCIA</option><option>CERTIFICADO</option><option>DIPLOMA</option></select></label><label><span>Número de registro</span><input></label><label><span>Fecha de emisión</span><input type="date"></label><label><span>Duración en horas</span><input type="number"></label><label><span>Créditos</span><input type="number" step="0.1"></label><label><span>Semestre</span><select><option value="">Seleccione semestre</option><option>I</option><option>II</option></select></label><label><span>Modalidad</span><select><option>PRESENCIAL</option><option>VIRTUAL</option><option>SEMIPRESENCIAL</option></select></label><label class="full"><span>Observación</span><textarea maxlength="250" rows="3"></textarea></label><label><span>Documento *</span><input required type="file" accept="application/pdf"></label><label><span>Folios</span><input type="number" min="1"></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="address-actions"><button type="button" class="return-academic">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      const trainingTotals = adminContent.querySelectorAll('.training-table .ingress-pagination strong');
      if(trainingTotals[0]) trainingTotals[0].textContent=`Total: ${records.length} registros`;
      if(trainingTotals[1]) trainingTotals[1].textContent=`Total: ${records.length?1:0} páginas`;
      bindAcademicStatusButtons('.training-row', 'capacitaciones');
      const trainingLabels = [...document.querySelectorAll('#training-form .academic-detail-grid > label')];
      const trainingTypeLabel = trainingLabels[0];
      const trainingTypeSelect = trainingTypeLabel.querySelector('select');
      const updateTrainingTypeDescription = () => {
        document.getElementById('training-type-description')?.remove();
        if (trainingTypeSelect.value !== 'OTROS') return;
        trainingTypeLabel.insertAdjacentHTML('afterend', '<label id="training-type-description"><span>Descripción del tipo de estudio *</span><input required maxlength="250"></label>');
      };
      trainingTypeSelect.addEventListener('change', updateTrainingTypeDescription);
      const themeLabel = trainingLabels.find(label => label.querySelector('span')?.textContent.trim() === 'Tema');
      themeLabel.querySelector('span').textContent = 'Tema *';
      themeLabel.querySelector('input').required = true;
      const accreditationLabel = trainingLabels.find(label => label.querySelector('span')?.textContent.trim() === 'Documento de acreditación');
      accreditationLabel.querySelector('span').textContent = 'Documento de acreditación *';
      accreditationLabel.querySelector('select').required = true;
      accreditationLabel.querySelector('select').innerHTML = '<option value="">Seleccione documento de acreditación</option><option>CERTIFICADO</option><option>CONSTANCIA</option><option>DIPLOMA</option><option>OTRO</option>';
      document.getElementById('training-form').addEventListener('reset', () => setTimeout(updateTrainingTypeDescription));
      const trainingForm=document.getElementById('training-form');
      adminContent.querySelectorAll('.training-row').forEach(row=>row.addEventListener('dblclick',()=>{
        adminContent.querySelectorAll('.training-row').forEach(item=>item.removeAttribute('data-selected'));
        row.setAttribute('data-selected','true');
        const record=trainingRecords[Number(row.dataset.trainingIndex)];
        const value=data=>data||'No registrado';
        trainingForm.innerHTML=`<fieldset class="admin-server-card"><legend>Datos de capacitación</legend><div class="admin-summary-grid">${detail('Tipo de Estudios',value(record.tipo))}${detail('Tema',value(record.tema))}${detail('Fecha de inicio',value(record.inicio))}${detail('Fecha fin',value(record.fin))}${detail('Tipo de participación',value(record.participacion))}${detail('Institución',value(record.institucion))}${detail('País','No registrado')}${detail('Ciudad','No registrado')}${detail('Documento de acreditación',value(record.documento))}${detail('Número de registro','No registrado')}${detail('Fecha de emisión',value(record.emision))}${detail('Duración en horas',value(record.horas))}${detail('Créditos',value(record.credito))}${detail('Semestre','No registrado')}${detail('Modalidad','No registrado')}${detail('Observación','No registrado')}</div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="address-actions"><button id="return-training-detail" type="button">← RETORNAR</button><span></span><button id="cancel-training-detail" type="button">⌫ CANCELAR</button></div>`;
        document.getElementById('return-training-detail')?.addEventListener('click',showAdminTraining);
        document.getElementById('cancel-training-detail')?.addEventListener('click',showAdminTraining);
      }));
      bindAcademicTabs(); document.querySelector('.return-academic').addEventListener('click',()=>window.location.href='gestion-servidor.html'); trainingForm.addEventListener('submit',e=>{e.preventDefault();alert('Capacitación guardada correctamente.');}); window.location.hash='capacitaciones';
    };
    const showAdminIntellectualProduction = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link=>link.classList.remove('active')); academicMenu.classList.add('active');
      adminContent.innerHTML=`${serverSummary()}${academicTabs(2)}<fieldset class="admin-server-card"><legend>Registros de producción intelectual</legend><div class="production-table"><div class="production-head"><span>N°</span><span>Tipo de producción</span><span>Título</span><span>F. publicación</span><span>Editorial</span><span>Registro de INDECOPI</span><span>Número de depósito legal - BN</span><span>Estado</span><span>Acciones</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 0 páginas</strong></div></div></fieldset><form id="production-form"><fieldset class="admin-server-card"><legend>Datos de producción intelectual</legend><div class="academic-detail-grid"><label><span>Tipo de producción *</span><select required><option value="">Seleccione tipo</option><option>LIBRO</option><option>ARTÍCULO</option><option>INVESTIGACIÓN</option><option>MATERIAL EDUCATIVO</option></select></label><label class="double"><span>Título *</span><input required></label><label><span>Fecha publicación *</span><input required type="date"></label><label><span>Editorial</span><input></label><label><span>Edición</span><input></label><label class="full"><span>Descripción/resumen</span><textarea maxlength="200" rows="3"></textarea></label><label><span>Registro INDECOPI</span><input></label><label><span>Depósito legal BN</span><input></label><label><span>ISBN</span><input></label><label><span>Páginas</span><input type="number"></label><label class="double"><span>Enlace web</span><input type="url" placeholder="https://"></label><label class="full"><span>Anotaciones</span><textarea maxlength="250" rows="3"></textarea></label><label><span>Documento *</span><input required type="file" accept="application/pdf"></label><label><span>Folios</span><input type="number" min="1"></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="address-actions"><button type="button" class="return-academic">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      const productionTypeSelect = document.querySelector('#production-form .academic-detail-grid > label select');
      productionTypeSelect.innerHTML = '<option value="">Seleccione tipo de producción</option><option>ARTÍCULOS O PUBLICACIONES EN LA WEB</option><option>ARTÍCULOS Y OTROS SIMILARES</option><option>DISPOSITIVOS</option><option>INVENCIONES DE BIOTECNOLOGÍA RELACIONADAS CON ORGANISMOS VIVOS Y MATERIAL CON INFORMACIÓN GENÉTICA</option><option>INVENCIONES DE MEJORA QUE CONSISTEN EN UNA MEJORA INCREMENTAL A UN PRODUCTO, SISTEMA O PROCESO YA EXISTENTE</option><option>INVENCIONES DE PROCESO ORIENTADAS A PROCEDIMIENTOS</option><option>INVENCIONES DE PRODUCTO ORIENTADAS A ESTRUCTURAS FÍSICAS Y OBJETOS TANGIBLES</option><option>INVENCIONES DE SOFTWARE</option><option>INVESTIGACIÓN APLICADA ANALÍTICA O DOCUMENTAL</option><option>INVESTIGACIÓN APLICADA DE CAMPO O EXPERIMENTAL</option><option>INVESTIGACIÓN PURA ANALÍTICA O DOCUMENTAL</option><option>INVESTIGACIÓN PURA DE CAMPO O EXPERIMENTAL</option><option>LIBROS</option><option>NORMAS</option><option>PERIÓDICOS</option><option>PONENCIAS PUBLICADAS</option><option>REGLAMENTOS</option><option>REVISTA CIENTÍFICA</option><option>REVISTAS</option>';
      bindAcademicTabs(); document.querySelector('.return-academic').addEventListener('click',()=>window.location.href='gestion-servidor.html'); document.getElementById('production-form').addEventListener('submit',e=>{e.preventDefault();alert('Producción intelectual guardada correctamente.');}); window.location.hash='produccion-intelectual';
    };
    const showAdminLanguages = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link=>link.classList.remove('active')); academicMenu.classList.add('active');
      const languageRecords=Array.isArray(server.idiomasAcademicos)?server.idiomasAcademicos:[];
      const records=languageRecords.map(item=>[item.tipo,item.idioma,item.escritura,item.oral]);
      const rows=records.length?records.map((r,i)=>`<div class="languages-row" data-language-index="${i}" title="Doble clic para ver el detalle"><span>${i+1}</span>${r.map(v=>`<span>${v||'No registrado'}</span>`).join('')}<span>No registrado</span><span>No registrado</span><span>No registrado</span><span>No registrado</span><span>APROBADO</span><span></span></div>`).join(''):'<div class="ascent-empty">No se encontraron registros</div>';
      adminContent.innerHTML=`${serverSummary()}${academicTabs(3)}<fieldset class="admin-server-card"><legend>Registros de idiomas del servidor</legend><div class="languages-table"><div class="languages-head"><span>N°</span><span>Tipo de idioma</span><span>Idioma</span><span>Dominio escritura</span><span>Dominio oral</span><span>Lugar de aprendizaje</span><span>Nivel de certificación</span><span>Fecha de certificación</span><span>Archivo</span><span>Estado</span><span>Acciones</span></div>${rows}<div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 3 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 1 página</strong></div></div></fieldset><form id="languages-form"><div class="language-fields"><fieldset class="admin-server-card"><legend>Tipo idioma</legend><div class="academic-detail-grid two"><label><span>Tipo idioma *</span><select required><option value="">Seleccione tipo</option><option>EXTRANJERO</option><option>NATIVO</option></select></label><label><span>Idioma</span><select><option>INGLÉS</option><option>PORTUGUÉS</option><option>CASTELLANO</option></select></label></div></fieldset><fieldset class="admin-server-card"><legend>Nivel de conocimiento</legend><div class="academic-detail-grid two"><label><span>Escritura *</span><select required><option>BÁSICO</option><option>INTERMEDIO</option><option>AVANZADO</option></select></label><label><span>Oral *</span><select required><option>BÁSICO</option><option>INTERMEDIO</option><option>AVANZADO</option></select></label></div></fieldset></div><fieldset class="admin-server-card"><legend>Centro de aprendizaje</legend><div class="academic-detail-grid"><label class="double"><span>Lugar de aprendizaje</span><input></label><label><span>Fecha de certificación</span><input type="date"></label><label class="full"><span>Anotaciones</span><textarea maxlength="250" rows="3"></textarea></label><label><span>Documento *</span><input required type="file" accept="application/pdf"></label><label><span>Folios</span><input type="number" min="1"></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="address-actions"><button type="button" class="return-academic">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      const languageTotals = adminContent.querySelectorAll('.languages-table .ingress-pagination strong');
      if(languageTotals[0]) languageTotals[0].textContent=`Total: ${records.length} registros`;
      if(languageTotals[1]) languageTotals[1].textContent=`Total: ${records.length?1:0} páginas`;
      bindAcademicStatusButtons('.languages-row', 'idiomas');
      const languageSelects = document.querySelectorAll('#languages-form select');
      languageSelects[0].innerHTML = '<option value="">Seleccione tipo de idioma</option><option>MATERNO</option><option>SECUNDARIO</option>';
      const languageCatalog = ['ACHUAR','AIMARA','ALBANES','ALEMÁN','AMAHUACA','AMARICO','ANCASH QICHWA','ARABELA','ASHANINKA','ASHENINKA','AWAJÚN','BORA','BULGARO','CAHUAPANA','CAPANAHUA','CASHINAHUA','CASTELLANO','CAUQUI','CHAMICURO','CHANKA QICHWA','CHINO','CHINO - CANTONES','CHINO - MANDARIN','CHOLON','CULINA','ESE EJA','ESLOVACO','ESLOVENO','ESTONIO','FARCI','FRANCES','GEROGIANO','GRIEGO','HARAKBUT','HEBREO','IKITU','IÑAPARI','INDONESIO','INGLES','INKA WASI KAÑARIS QICHWA','IQUITU','ISCONAHUA','ITALIANO','JAPONES','JAQARU','KAKATAIBO','KAKINTE','KANDOZI-CHAPRA','KAPANAWA','KASHAMARKA QICHWA','KAWKI','KICHWA','KUKAMA-KUKAMIRIA','KUKUMA KUKAMIRIA','MADIJA','MAIJKI','MAIJUNA','MARINAHUA','MASTANAHUA','MATSÉS','MATSIGENKA','MOCHICA','MUNICHE','MURUI-MUINANI','MURUI-MUINAMI','NAHUA','NANTI','NEPALES','NOMATSIGENGA','OCAINA','OMAGUA','OREJON','OTRO EXTRANJERO','OTRO NACIONAL','PORTUGUES','QUECHUA','QUECHUA - ANCASH','QUECHUA - CAJAMARCA','QUECHUA - CHANKA','QUECHUA - COLLAO','QUECHUA - HUANUCO','QUECHUA - INKA WASI KAÑARIS','QUECHUA - PASCO YARU','QUECHUA - WANKA YARU','QUECHUA AMAZONICO','QUECHUA CENTRAL','QUECHUA NORTEÑO','QUECHUA SUREÑO','QULLAW QICHWA','REMO','RESIGARO','RUMANO','RUSO','SECOYA','SHARANAHUA','SHAWI','SHIPIBO-KONIBO','SHIWILU','SINGALES','TAUSHIRO','TIKUNA (TICUNA)','URARINA','URO','WAMPIS','WANKA QICHWA','YAGUA','YAMINAHUA','YANESHA','YINE','YORA (NAHUA)'];
      languageSelects[1].innerHTML = '<option value="">Seleccione idioma</option>' + languageCatalog.map(language => `<option>${language}</option>`).join('');
      const knowledgeOptions = '<option value="">Seleccione nivel</option><option>AVANZADO</option><option>BÁSICO</option><option>INTERMEDIO</option>';
      languageSelects[2].innerHTML = knowledgeOptions;
      languageSelects[3].innerHTML = knowledgeOptions;
      const languagesForm=document.getElementById('languages-form');
      adminContent.querySelectorAll('.languages-row').forEach(row=>row.addEventListener('dblclick',()=>{
        adminContent.querySelectorAll('.languages-row').forEach(item=>item.removeAttribute('data-selected'));
        row.setAttribute('data-selected','true');
        const record=languageRecords[Number(row.dataset.languageIndex)];
        const value=data=>data||'No registrado';
        languagesForm.innerHTML=`<div class="language-fields"><fieldset class="admin-server-card"><legend>Tipo idioma</legend><div class="admin-summary-grid">${detail('Tipo idioma',value(record.tipo))}${detail('Idioma',value(record.idioma))}</div></fieldset><fieldset class="admin-server-card"><legend>Nivel de conocimiento</legend><div class="admin-summary-grid">${detail('Escritura',value(record.escritura))}${detail('Oral',value(record.oral))}</div></fieldset></div><fieldset class="admin-server-card"><legend>Centro de aprendizaje</legend><div class="admin-summary-grid">${detail('Lugar de aprendizaje',value(record.lugar))}${detail('Fecha de certificación','No registrado')}${detail('Anotaciones','No registrado')}${detail('Documento','No registrado')}${detail('Folios','No registrado')}</div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="address-actions"><button id="return-language-detail" type="button">← RETORNAR</button><span></span><button id="cancel-language-detail" type="button">⌫ CANCELAR</button></div>`;
        const languageCenterGrid=languagesForm.querySelector(':scope > fieldset.admin-server-card > .admin-summary-grid');
        languageCenterGrid?.classList.add('language-center-grid');
        const languageCenterItems=languageCenterGrid?[...languageCenterGrid.children]:[];
        languageCenterItems.slice(0,3).forEach(item=>{const output=item.querySelector('span');if(output)output.textContent='';});
        languageCenterItems.slice(-2).forEach(item=>item.remove());
        languageCenterGrid?.insertAdjacentHTML('beforeend','<div class="language-document-field"><strong>Documento *</strong><div class="language-file-control"><input required type="file" accept="application/pdf"><button type="button" class="remove-language-file" title="Quitar archivo" aria-label="Quitar archivo" hidden>×</button></div><small>Formato: PDF, Peso máximo 2MB</small></div><label class="language-folios-field"><input type="number" min="1" placeholder="Folios" aria-label="Folios"></label>');
        const languageFileInput=languageCenterGrid?.querySelector('.language-file-control input');
        const removeLanguageFile=languageCenterGrid?.querySelector('.remove-language-file');
        languageFileInput?.addEventListener('change',()=>{if(removeLanguageFile)removeLanguageFile.hidden=!languageFileInput.files?.length;});
        removeLanguageFile?.addEventListener('click',()=>{if(languageFileInput)languageFileInput.value='';removeLanguageFile.hidden=true;});
        document.getElementById('return-language-detail')?.addEventListener('click',showAdminLanguages);
        document.getElementById('cancel-language-detail')?.addEventListener('click',showAdminLanguages);
      }));
      bindAcademicTabs(); document.querySelector('.return-academic').addEventListener('click',()=>window.location.href='gestion-servidor.html'); languagesForm.addEventListener('submit',e=>{e.preventDefault();alert('Idioma guardado correctamente.');}); window.location.hash='idiomas';
    };
    const showAdminIngress = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      ingressMenu.classList.add('active');
      const ingressRows = (Array.isArray(server.ingresos) ? server.ingresos : []).map(row => [row.accion || 'No registrado', row.motivo || 'No registrado', row.fechaInicio || 'No registrado', row.fechaFin || 'No registrado', row.estado || 'APROBADO', row.resolucion || 'No registrado', row.fechaResolucion || 'No registrado', row.tipoResolucion || 'No registrado', row.centroLaboral || server.institucion || 'No registrado', row.cargo || server.cargo || 'No registrado', row.condicion || server.condicion || 'No registrado']);
      const rows = ingressRows.length ? ingressRows.map((row,index) => `<div class="ingress-row"><span>${index + 1}</span><span>${row[0]}</span><span>${row[1]}</span><span>${server.regimen}</span><span>${row[2]}</span><span>${row[3]}</span><span>${row[8]}</span><span>${row[9]}</span><span>${row[5]}</span><span class="ingress-status">${row[4]}</span><span class="ingress-row-actions"><button class="edit-ingress-action" data-ingress-index="${index}" type="button" title="Modificar" aria-label="Modificar">✎</button><button class="edit-ingress-center" data-ingress-index="${index}" type="button" title="Modificar centro" aria-label="Modificar centro">♜</button><button class="cancel-ingress-action" data-ingress-index="${index}" type="button" title="Anular" aria-label="Anular">⊖</button></span></div>`).join('') : '<div class="academic-empty">No se encontraron registros</div>';
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs"><a class="active">Datos de ingreso</a></nav><fieldset class="admin-server-card"><legend>Acciones de ingreso</legend><div class="ingress-table"><div class="ingress-head"><span>N°</span><span>Acción</span><span>Motivo</span><span>Régimen</span><span>F. inicio</span><span>F. fin</span><span>Centro laboral</span><span>Cargo</span><span>Resolución</span><span>Estado</span><span>Acciones</span></div>${rows}<div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option><option>20 Filas</option></select></label><strong>Total: 5 registros</strong><div><button type="button">&lt;&lt;</button><button type="button">&lt;</button><button class="active" type="button">1</button><button type="button">&gt;</button><button type="button">&gt;&gt;</button></div><strong>Total: 1 página</strong></div></div></fieldset><form id="ingress-form"><fieldset class="admin-server-card"><legend>Datos principales de la resolución</legend><div class="ingress-form-grid"><label><span>Tipo de resolución *</span><select required><option value="">Seleccione tipo de resolución</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN DIRECTORAL</option><option>RESOLUCIÓN JEFATURAL</option></select></label><label><span>Número resolución (######-año-IGED) *</span><input required placeholder="Número de resolución"></label><label><span>Fecha de resolución *</span><input required type="date"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label><span></span><label><span>Régimen laboral</span><select id="ingress-regime"><option value="">Seleccione régimen laboral</option><option>LEY N° 29944</option><option>D.L. N° 276</option><option>LEY N° 30512</option><option>D.L. N° 1057 CAS</option></select></label><label><span>Acción</span><select id="ingress-action"><option value="">Seleccione acción</option><option>NOMBRAMIENTO</option><option>CONTRATO</option><option>REINGRESO</option><option>REASIGNACIÓN</option></select></label><label><span>Motivo acción</span><select id="ingress-reason"><option value="">Seleccione motivo</option><option>CONCURSO PÚBLICO PARA INGRESO</option><option>CONCURSO PÚBLICO PARA CONTRATACIÓN</option><option>REINGRESO AL SERVICIO</option></select></label></div></fieldset><fieldset class="admin-server-card ingress-detail"><legend>Detalle de la resolución</legend><p id="ingress-detail-message">Seleccione el motivo acción para continuar con el formulario de registro</p><div id="ingress-detail-fields" class="ingress-form-grid" hidden><label><span>Fecha de inicio *</span><input type="date"></label><label><span>Fecha de fin</span><input type="date"></label><label><span>Centro laboral *</span><input value="${server.institucion}"></label><label><span>Cargo *</span><input value="${server.cargo}"></label><label><span>Condición</span><input value="${server.condicion}"></label><label><span>Estado</span><select><option>APROBADO</option><option>MODIFICADO</option><option>ANULADO</option></select></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="ingress-actions"><button id="return-ingress" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      const ingressResolutionType = document.querySelector('#ingress-form .ingress-form-grid label select');
      const ingressTotals = document.querySelectorAll('.ingress-pagination strong');
      if (ingressTotals[0]) ingressTotals[0].textContent = `Total: ${ingressRows.length} registros`;
      if (ingressTotals[1]) ingressTotals[1].textContent = `Total: ${ingressRows.length ? 1 : 0} página${ingressRows.length === 1 ? '' : 's'}`;
      ingressResolutionType.innerHTML = '<option value="">Seleccione tipo de resolución</option><option>DECRETO DIRECTORAL</option><option>RESOLUCION DE ALCALDIA</option><option>RESOLUCION DIRECTORAL</option><option>RESOLUCION DIRECTORAL USE</option><option>RESOLUCION DE LA DIRECCION DEPARTAMENTAL</option><option>RESOLUCION DIRECTORAL REGIONAL</option><option>RESOLUCION DIRECTORAL REGIONAL SECTORIAL</option><option>RESOLUCION DIRECTORAL SUPERIOR</option><option>RESOLUCION DIRECTORAL SUB REGIONAL SECTORIAL</option><option>RESOLUCION DIRECTORAL SUB REGIONAL</option><option>RESOLUCION DIRECTORAL ZONAL</option><option>RESOLUCION DE GERENCIA REGIONAL</option><option>RESOLUCION DE GERENCIA SECTORIAL REGIONAL</option><option>RESOLUCION EJECUTIVA REGIONAL</option><option>RESOLUCION JEFATURAL</option><option>RESOLUCION MINISTERIAL</option><option>RESOLUCION REGIONAL SECTORIAL</option><option>RESOLUCION DE SECRETARIA GENERAL</option><option>RESOLUCION SECTORIAL REGIONAL</option><option>RESOLUCION SERVIR</option><option>RESOLUCION VICEMINISTERIAL</option><option>RESOLUCION ADMINISTRATIVA</option><option>RESOLUCION SUPREMA</option>';
      document.querySelectorAll('.edit-ingress-action').forEach(button=>button.addEventListener('click',()=>{
        const index=Number(button.dataset.ingressIndex);
        const record=ingressRows[index];
        const modal=document.createElement('div');
        modal.className='ingress-modifier-overlay';
        modal.innerHTML=`<section class="ingress-modifier-modal" role="dialog" aria-modal="true" aria-label="Modificatoria de la acción"><header><strong>Modificatoria de la acción</strong><button class="close-ingress-modifier" type="button" aria-label="Cerrar">×</button></header><div class="ingress-modifier-body"><label class="modifier-action-type"><span>Tipo de acción *</span><select required><option value="">Seleccione tipo de acción</option><option>DAR POR CONCLUIDO</option><option>DECLARAR NULO</option><option>DEJAR SIN EFECTO</option><option>LIMITAR</option><option>MODIFICAR / RECTIFICAR</option></select></label><fieldset><legend>Datos de la acción</legend><div class="admin-summary-grid">${detail('Tipo de resolución','RESOLUCIÓN DE LA DIRECCIÓN REGIONAL')}${detail('Número de resolución',`R.D.R. N° 000${274+index}-202${5-index}`)}${detail('Fecha de resolución','No registrado')}${detail('Régimen',server.regimen)}${detail('Acción',record[0])}${detail('Motivo acción',record[1])}</div></fieldset><fieldset><legend>Datos principales de la resolución de modificatoria</legend><div class="ingress-form-grid modifier-resolution-grid"><label><span>Tipo de resolución *</span><select required><option value="">Seleccione tipo de resolución</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN DIRECTORAL</option></select></label><label><span>Número resolución (######-año-IGED) *</span><input required placeholder="Número de resolución"></label><label><span>Fecha resolución *</span><input required type="date"></label><label class="modifier-document"><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label class="modifier-folios"><input type="number" min="1" placeholder="Folios" aria-label="Folios"></label></div></fieldset><fieldset><legend>Detalle de la resolución de modificatoria</legend><p>Seleccione un tipo de acción para continuar con el formulario de registro</p></fieldset></div></section>`;
        document.body.appendChild(modal);
        const modifierActionSelect=modal.querySelector('.modifier-action-type select');
        const modifierDetailFieldset=modal.querySelectorAll('.ingress-modifier-body > fieldset')[2];
        const renderModifierDetail=()=>{
          if(!modifierDetailFieldset) return;
          const selectedAction=modifierActionSelect?.value;
          if(selectedAction==='MODIFICAR / RECTIFICAR'){
            const fieldOptions=['APELLIDO MATERNO DEL SERVIDOR','APELLIDO PATERNO DEL SERVIDOR','CARGO','CÓDIGO DE PLAZA','CÓDIGO MODULAR IE','ESCALA / CATEGORÍA / NIVEL / GRUPO','FECHA DE FIN','FECHA DE INICIO','JORNADA','NOMBRES DEL SERVIDOR'];
            modifierDetailFieldset.innerHTML=`<legend>Detalle de la resolución de modificatoria</legend><div class="modifier-rectify-detail"><label><select class="modifier-field-select"><option value="">Campo a modificar</option>${fieldOptions.map(option=>`<option>${option}</option>`).join('')}</select></label><div class="modifier-field-editor"></div><label class="modifier-notes"><span>Anotaciones</span><strong class="modifier-notes-count">250</strong><textarea maxlength="250" placeholder="Anotaciones"></textarea></label></div>`;
            const fieldSelect=modifierDetailFieldset.querySelector('.modifier-field-select');
            const fieldEditor=modifierDetailFieldset.querySelector('.modifier-field-editor');
            const cargoOptions=['COORDINADOR','COORDINADOR ACADÉMICO','COORDINADOR ÁREA TÉCNICA','COORDINADOR DE ACTIVIDADES EXT. EDUCATIVA','COORDINADOR DE ÁREA ACADÉMICA','COORDINADOR DE ÁREA DE CALIDAD','COORDINADOR DE FORMACIÓN GENERAL','DIRECTOR ACADÉMICO','DIRECTOR DE INSTITUTO SUPERIOR','DIRECTOR GENERAL','DOCENTE ALTAMENTE ESPECIALIZADO','DOCENTE ESTABLE','DOCENTE ESTABLE I','DOCENTE ESTABLE II','DOCENTE EXTRAORDINARIO','DOCENTE SUPERIOR','ESPECIALISTA EN EDUCACIÓN','JEFE DE ACTIVIDADES PRODUCTIVA Y EMPRESARIALES','JEFE DE ÁREA ACADÉMICA','JEFE DE ÁREA ACADÉMICA DE PRODUCCIÓN','JEFE DE ÁREA TÉCNICA','JEFE DE ARTE Y CULTURA','JEFE DE DEPARTAMENTO','JEFE DE DPTO. ACADÉMICO','JEFE DE DPTO. ADMINISTRATIVO','JEFE DE DPTO. COMPUTACIÓN E INFORMÁTICA','JEFE DE DPTO. DE CIENCIA Y TECNOLOGÍA','JEFE DE DPTO. DE FORMACIÓN PROFESIONAL','JEFE DE LA UNIDAD ACADÉMICA','JEFE DE LA UNIDAD ADMINISTRATIVA','JEFE DE PRODUCCIÓN','JEFE DE TALLER','JEFE DEL ÁREA ACADÉMICA','PROF. INST. TECN. SUP.','PROFESOR','PROFESOR (FUNCIONES DE DIRECTOR)','SECRETARIO ACADÉMICO','SECRETARIO DOCENTE','SUB DIRECTOR (COORDINACIÓN)','SUB-DIRECTOR ACADÉMICO','SUB-DIRECTOR DE ÁREAS TÉCNICAS','SUB-DIRECTOR DE FORMACIÓN GENERAL','SUB-DIRECTOR I.E.','SUPERVISOR DE EDUCACIÓN RELIGIOSA'];
            const renderFieldEditor=()=>{
              const selectedField=fieldSelect?.value;
              if(!fieldEditor) return;
              if(!selectedField){fieldEditor.innerHTML='';return;}
              const currentValues={
                'APELLIDO MATERNO DEL SERVIDOR':server.segundoApellido,
                'APELLIDO PATERNO DEL SERVIDOR':server.primerApellido,
                'CARGO':server.cargo,
                'CÓDIGO DE PLAZA':server.trayectoriaActual?.codigoPlaza,
                'CÓDIGO MODULAR IE':server.centroCodigo,
                'ESCALA / CATEGORÍA / NIVEL / GRUPO':server.trayectoriaActual?.escalaCategoria,
                'FECHA DE FIN':record[3],
                'FECHA DE INICIO':record[2],
                'JORNADA':server.horasLaborales,
                'NOMBRES DEL SERVIDOR':server.nombres
              };
              const currentValue=currentValues[selectedField]||'No registrado';
              const scaleOptions=['PRIMER NIVEL MAGISTERIAL','SEGUNDO NIVEL MAGISTERIAL','TERCER NIVEL MAGISTERIAL','CUARTO NIVEL MAGISTERIAL','QUINTO NIVEL MAGISTERIAL','II NIVEL SOLO PARA EFECTOS DE PAGO','SIN NIVEL MAGISTERIAL','SIN NIVEL ADMINISTRATIVO','SIN NIVEL - GRUPO. REM. "A"','SIN NIVEL - GRUPO. REM. "B"','SIN NIVEL - GRUPO. REM. "C"','SIN NIVEL - GRUPO. REM. "D"','SIN NIVEL - GRUPO. REM. "E"'];
              const jornadaOptions=['SIN JORNADA',...Array.from({length:30},(_,hour)=>`${hour+1} HORA${hour?'S':''}`),'32 HORAS','33 HORAS','36 HORAS','40 HORAS','42 HORAS','45 HORAS','46 HORAS','47 HORAS','48 HORAS','OTRA (Especificar)'];
              let replacement='<input class="modifier-new-value" required placeholder="Debe decir">';
              if(selectedField==='CARGO') replacement=`<select class="modifier-new-value" required><option value="">Debe decir</option>${cargoOptions.map(cargo=>`<option>${cargo}</option>`).join('')}</select>`;
              if(selectedField==='CÓDIGO MODULAR IE') replacement='<span class="modifier-center-picker"><input class="modifier-new-value" required placeholder="Debe decir" readonly><button class="open-center-search" type="button" title="Buscar centro de trabajo" aria-label="Buscar centro de trabajo">⌕</button></span>';
              if(selectedField==='ESCALA / CATEGORÍA / NIVEL / GRUPO') replacement=`<select class="modifier-new-value" required><option value="">Debe decir</option>${scaleOptions.map(value=>`<option>${value}</option>`).join('')}</select>`;
              if(selectedField==='FECHA DE FIN'||selectedField==='FECHA DE INICIO') replacement='<input class="modifier-new-value" type="date" required aria-label="Debe decir">';
              if(selectedField==='JORNADA') replacement=`<select class="modifier-new-value modifier-new-workday" required><option value="">Debe decir</option>${jornadaOptions.map(value=>`<option>${value}</option>`).join('')}</select>`;
              fieldEditor.innerHTML=`<label class="modifier-current-value"><span>Dice *</span><strong>${currentValue}</strong></label><label class="modifier-new-value-label"><span>Debe decir *</span>${replacement}</label><div class="modifier-add-row"><button class="modifier-add-field" type="button">✚ AGREGAR</button></div>`;
              fieldEditor.querySelector('.modifier-new-workday')?.addEventListener('change',event=>{
                fieldEditor.querySelector('.modifier-other-workday')?.remove();
                if(event.target.value!=='OTRA (Especificar)') return;
                event.target.insertAdjacentHTML('afterend','<input class="modifier-other-workday" type="number" min="1" max="168" required placeholder="Cantidad de horas">');
              });
              fieldEditor.querySelector('.open-center-search')?.addEventListener('click',()=>{
                const centerModal=document.createElement('div');
                centerModal.className='ingress-modifier-overlay center-search-overlay';
                centerModal.innerHTML='<section class="center-search-modal" role="dialog" aria-modal="true"><header><strong>Centros de trabajo</strong><button class="close-center-search" type="button" aria-label="Cerrar">×</button></header><div class="center-search-body"><nav><button class="active" type="button">Búsqueda de centros de trabajo vigente</button><button type="button">Búsqueda de centros de trabajo no vigente</button></nav><fieldset><legend>Filtros de búsqueda</legend><div class="center-search-filters"><select><option>DRE</option></select><select><option>UGEL</option></select><select><option>Modalidad educativa</option></select><select><option>Nivel educativo</option></select><input class="center-code-filter" placeholder="Código modular I.E."><input class="center-name-filter" placeholder="Institución educativa"></div><div class="center-search-buttons"><button class="clear-center-search" type="button">⌫ LIMPIAR</button><button class="run-center-search" type="button">⌕ BUSCAR</button></div></fieldset><fieldset><legend>Resultados de la búsqueda</legend><div class="center-results"><div class="center-results-head"><span>CÓDIGO MODULAR</span><span>CENTRO LABORAL</span><span>IGED</span><span>NIVEL EDUCATIVO</span><span>MODALIDAD</span></div><div class="center-results-body"><p>No se encontraron registros.</p></div><footer><span>Mostrar: 10 Filas</span><strong>Total: <b>0</b> registros</strong><span>1</span><strong>Total: <b>0</b> páginas</strong></footer></div></fieldset></div></section>';
                document.body.appendChild(centerModal);
                const centerSearchTabs=centerModal.querySelectorAll('.center-search-body > nav button');
                centerSearchTabs.forEach((tab,index)=>tab.addEventListener('click',()=>{
                  centerSearchTabs.forEach(item=>item.classList.remove('active'));
                  tab.classList.add('active');
                  centerModal.dataset.searchStatus=index===0?'vigente':'no-vigente';
                }));
                centerModal.dataset.searchStatus='vigente';
                const centerFilterSelects=centerModal.querySelectorAll('.center-search-filters select');
                const dreCatalog=['DIRECCIÓN REGIONAL DE EDUCACIÓN AMAZONAS','DIRECCIÓN REGIONAL DE EDUCACIÓN ANCASH','DIRECCIÓN REGIONAL DE EDUCACIÓN APURÍMAC','DIRECCIÓN REGIONAL DE EDUCACIÓN AREQUIPA','DIRECCIÓN REGIONAL DE EDUCACIÓN AYACUCHO','DIRECCIÓN REGIONAL DE EDUCACIÓN CAJAMARCA','DIRECCIÓN REGIONAL DE EDUCACIÓN CALLAO','DIRECCIÓN REGIONAL DE EDUCACIÓN CUSCO','DIRECCIÓN REGIONAL DE EDUCACIÓN HUANCAVELICA','DIRECCIÓN REGIONAL DE EDUCACIÓN HUÁNUCO','DIRECCIÓN REGIONAL DE EDUCACIÓN ICA','DIRECCIÓN REGIONAL DE EDUCACIÓN JUNÍN','DIRECCIÓN REGIONAL DE EDUCACIÓN LA LIBERTAD','DIRECCIÓN REGIONAL DE EDUCACIÓN LAMBAYEQUE','DIRECCIÓN REGIONAL DE EDUCACIÓN LIMA METROPOLITANA','DIRECCIÓN REGIONAL DE EDUCACIÓN LIMA PROVINCIAS','DIRECCIÓN REGIONAL DE EDUCACIÓN LORETO','DIRECCIÓN REGIONAL DE EDUCACIÓN MADRE DE DIOS','DIRECCIÓN REGIONAL DE EDUCACIÓN MOQUEGUA','DIRECCIÓN REGIONAL DE EDUCACIÓN PASCO','DIRECCIÓN REGIONAL DE EDUCACIÓN PIURA','DIRECCIÓN REGIONAL DE EDUCACIÓN PUNO','DIRECCIÓN REGIONAL DE EDUCACIÓN SAN MARTÍN','DIRECCIÓN REGIONAL DE EDUCACIÓN TACNA','DIRECCIÓN REGIONAL DE EDUCACIÓN TUMBES','DIRECCIÓN REGIONAL DE EDUCACIÓN UCAYALI','MINISTERIO DE DEFENSA'];
                const modalityCatalog=['EDUCACIÓN BÁSICA ALTERNATIVA','EDUCACIÓN BÁSICA ESPECIAL','EDUCACIÓN BÁSICA REGULAR','EDUCACIÓN SUPERIOR','EDUCACIÓN TÉCNICA - PRODUCTIVA','NO ESPECIFICADO','SEDE ADMINISTRATIVA'];
                const limaUgelCatalog=['DIRECCIÓN REGIONAL DE EDUCACIÓN LIMA METROPOLITANA','INSTITUTO PEDAGÓGICO NACIONAL DE MONTERRICO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 01 SAN JUAN DE MIRAFLORES','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 02 RÍMAC','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 03 BREÑA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 04 COMAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 05 SAN JUAN DE LURIGANCHO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 06 ATE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 07 SAN BORJA'];
                const ugelCatalogs={
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN AMAZONAS':['DIRECCIÓN REGIONAL DE EDUCACIÓN AMAZONAS','UGEL INTERCULTURAL BILINGÜE CENEPA','UGEL INTERCULTURAL BILINGÜE RÍO SANTIAGO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL BAGUA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL BONGARÁ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHACHAPOYAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CONDORCANQUI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL IBIRI-IMAZA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LUYA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL RODRÍGUEZ DE MENDOZA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL UTCUBAMBA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN ANCASH':['DIRECCIÓN REGIONAL DE EDUCACIÓN ANCASH','UNIDAD DE GESTIÓN EDUCATIVA LOCAL AIJA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ANTONIO RAYMONDI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ASUNCIÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL BOLOGNESI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CARHUAZ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CARLOS FERMIN FITZCARRALD','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CASMA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CORONGO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUARAZ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUARI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUARMEY','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUAYLAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MARISCAL LUZURIAGA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL OCROS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PALLASCA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL POMABAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL RECUAY','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SANTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SIHUAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL YUNGAY'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN APURÍMAC':['DIRECCIÓN REGIONAL DE EDUCACIÓN APURÍMAC','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ABANCAY','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ANDAHUAYLAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ANTABAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL AYMARAES','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHINCHEROS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL COTABAMBAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL GRAU','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCARAMA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN AREQUIPA':['COLEGIO MILITAR FRANCISCO BOLOGNESI','DIRECCIÓN REGIONAL DE EDUCACIÓN AREQUIPA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL AREQUIPA NORTE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL AREQUIPA SUR','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CAMANÁ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CARAVELÍ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CASTILLA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CAYLLOMA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CONDESUYOS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ISLAY','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LA JOYA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LA UNIÓN'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN AYACUCHO':['DIRECCIÓN REGIONAL DE EDUCACIÓN AYACUCHO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CANGALLO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUAMANGA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCASANCOS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LA MAR','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LUCANAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PARINACOCHAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PÁUCAR DEL SARASARA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SUCRE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL VÍCTOR FAJARDO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL VILCASHUAMÁN'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN CAJAMARCA':['DIRECCIÓN REGIONAL DE EDUCACIÓN CAJAMARCA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CAJABAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CAJAMARCA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CELENDÍN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHOTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CONTUMAZÁ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CUTERVO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUALGAYOC','UNIDAD DE GESTIÓN EDUCATIVA LOCAL JAÉN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN IGNACIO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN MARCOS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN MIGUEL','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN PABLO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SANTA CRUZ'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN CALLAO':['DIRECCIÓN REGIONAL DE EDUCACIÓN CALLAO','MILITAR LEONCIO PRADO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL VENTANILLA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN CUSCO':['DIRECCIÓN REGIONAL DE EDUCACIÓN CUSCO','ESCUELA DE BELLAS ARTES DIEGO QUISPE TITO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ACOMAYO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ANTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CALCA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CANAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CANCHIS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHUMBIVILCAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CUSCO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ESPINAR','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LA CONVENCIÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PARURO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PAUCARTAMBO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PICHARI-KIMBIRI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL QUISPICANCHI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL URUBAMBA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN HUANCAVELICA':['DIRECCIÓN REGIONAL DE EDUCACIÓN HUANCAVELICA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ACOBAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ANGARAES','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CASTROVIRREYNA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHURCAMPA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCAVELICA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUAYTARÁ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SURCUBAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TAYACAJA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN HUÁNUCO':['DIRECCIÓN REGIONAL DE EDUCACIÓN HUÁNUCO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL AMBO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL DOS DE MAYO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUACAYBAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUAMALÍES','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUÁNUCO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LAURICOCHA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LEONCIO PRADO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MARAÑÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PACHITEA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PUERTO INCA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL YAROWILCA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN ICA':['UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHINCHA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ICA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL NAZCA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PALPA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PISCO'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN JUNÍN':['DIRECCIÓN REGIONAL DE EDUCACIÓN JUNÍN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHANCHAMAYO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHUPACA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CONCEPCIÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCAYO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL JAUJA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL JUNÍN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PANGOA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PICHANAQUI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL RÍO ENE - MANTARO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL RÍO TAMBO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SATIPO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TARMA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL YAULI'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN LA LIBERTAD':['COLEGIO MILITAR RAMON CASTILLA','DIRECCIÓN REGIONAL DE EDUCACIÓN LA LIBERTAD','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 01 EL PORVENIR','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 02 LA ESPERANZA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 03 TRUJILLO NOR OESTE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 04 TRUJILLO SUR ESTE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ASCOPE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL BOLÍVAR','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHEPÉN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL GRAN CHIMÚ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL JULCÁN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL OTUZCO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PACASMAYO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PATAZ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SÁNCHEZ CARRIÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SANTIAGO DE CHUCO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TRUJILLO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL VIRÚ'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN LAMBAYEQUE':['COLEGIO MILITAR ELIAS AGUIRRE','DIRECCIÓN REGIONAL DE EDUCACIÓN LAMBAYEQUE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHICLAYO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL FERREÑAFE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LAMBAYEQUE'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN LIMA METROPOLITANA':limaUgelCatalog
                  ,'DIRECCIÓN REGIONAL DE EDUCACIÓN LIMA PROVINCIAS':['DIRECCIÓN REGIONAL DE EDUCACIÓN LIMA PROVINCIAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 08 CAÑETE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 09 HUAURA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 10 HUARAL','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 11 CAJATAMBO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 12 CANTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 13 YAUYOS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 14 OYÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 15 HUAROCHIRÍ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 16 BARRANCA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN LORETO':['DIRECCIÓN REGIONAL DE EDUCACIÓN LORETO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ALTO AMAZONAS - SAN LORENZO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ALTO AMAZONAS - YURIMAGUAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LORETO - NAUTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MAYNAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PUTUMAYO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL RAMÓN CASTILLA - CABALLOCOCHA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL REQUENA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL UCAYALI - CONTAMANA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN MADRE DE DIOS':['DIRECCIÓN REGIONAL DE EDUCACIÓN MADRE DE DIOS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MANU','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TAHUAMANU','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TAMBOPATA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN MOQUEGUA':['DIRECCIÓN REGIONAL DE EDUCACIÓN MOQUEGUA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL GENERAL SÁNCHEZ CERRO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ILO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MARISCAL NIETO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN IGNACIO DE LOYOLA-ICHUÑA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN PASCO':['DIRECCIÓN REGIONAL DE EDUCACIÓN PASCO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL DANIEL ALCIDES CARRIÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL OXAPAMPA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PASCO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PUERTO BERMÚDEZ'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN PIURA':['COLEGIO MILITAR PEDRO RUIZ GALLO','DIRECCIÓN REGIONAL DE EDUCACIÓN PIURA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL AYABACA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHULUCANAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCABAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUARMACA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LA UNIÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MORROPÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PAITA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PIURA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SECHURA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SULLANA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TALARA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TAMBOGRANDE'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN PUNO':['DIRECCIÓN REGIONAL DE EDUCACIÓN PUNO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL AZÁNGARO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CARABAYA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHUCUITO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CRUCERO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL EL COLLAO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCANÉ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LAMPA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MELGAR','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MOHO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PUNO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN ANTONIO DE PUTINA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN ROMÁN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SANDIA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL YUNGUYO'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN SAN MARTÍN':['DIRECCIÓN REGIONAL DE EDUCACIÓN SAN MARTÍN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL BELLAVISTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL EL DORADO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUALLAGA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LAMAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MARISCAL CÁCERES','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MOYOBAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PICOTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL RIOJA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN MARTÍN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TOCACHE'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN TACNA':['DIRECCIÓN REGIONAL DE EDUCACIÓN TACNA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CANDARAVE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL JORGE BASADRE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TACNA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TARATA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN TUMBES':['DIRECCIÓN REGIONAL DE EDUCACIÓN TUMBES','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CONTRALMIRANTE VILLAR','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TUMBES','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ZARUMILLA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN UCAYALI':['DIRECCIÓN REGIONAL DE EDUCACIÓN UCAYALI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ATALAYA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CORONEL PORTILLO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PADRE ABAD','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PURÚS'],
                  'MINISTERIO DE DEFENSA':['CENTRO DE ADMINISTRACION DE SERVICIOS EDUCATIVOS (FAP-UE005)','COPERE (EP-UE003)','DIRECCION DE BINESTAR DE LA MARINA (MGP-UE004)','MINISTERIO DE DEFENSA']
                };
                if(centerFilterSelects[0]) centerFilterSelects[0].innerHTML='<option value="">DRE</option>'+dreCatalog.map(item=>`<option>${item}</option>`).join('');
                if(centerFilterSelects[2]) centerFilterSelects[2].innerHTML='<option value="">Modalidad educativa</option>'+modalityCatalog.map(item=>`<option>${item}</option>`).join('');
                const educationLevelCatalogs={
                  'EDUCACIÓN BÁSICA ALTERNATIVA':['EBA - AVANZADO','EBA - INICIAL E INTERMEDIO','EBA - PRIMARIA DE ADULTOS','EBA - SECUNDARIA DE ADULTOS'],
                  'EDUCACIÓN BÁSICA ESPECIAL':['EBE - EDUCACIÓN ESPECIAL','EBE - INICIAL','EBE - PRIMARIA'],
                  'EDUCACIÓN BÁSICA REGULAR':['EBR - INICIAL - CUNA','EBR - INICIAL - CUNA - JARDÍN','EBR - INICIAL - JARDÍN','EBR - PRIMARIA','EBR - SECUNDARIA'],
                  'EDUCACIÓN SUPERIOR':['EDUCACIÓN SUPERIOR ARTÍSTICA - ESCUELAS','ESCUELA SUPERIOR PEDAGÓGICA','ESCUELA SUPERIOR TECNOLÓGICA','FORMACIÓN ARTÍSTICA','SUPERIOR PEDAGÓGICA - ISP','SUPERIOR TECNOLÓGICA - IST'],
                  'EDUCACIÓN TÉCNICA - PRODUCTIVA':['CETPRO','CICLO MEDIO','NIVEL BÁSICO'],
                  'NO ESPECIFICADO':['NO ESPECIFICADO'],
                  'SEDE ADMINISTRATIVA':['ADMINISTRACIÓN']
                };
                const renderEducationLevels=()=>{
                  if(!centerFilterSelects[3]) return;
                  const levels=educationLevelCatalogs[centerFilterSelects[2]?.value]||[];
                  centerFilterSelects[3].innerHTML='<option value="">Nivel educativo</option>'+levels.map(item=>`<option>${item}</option>`).join('');
                };
                centerFilterSelects[2]?.addEventListener('change',renderEducationLevels);
                const renderUgelCatalog=()=>{
                  if(!centerFilterSelects[1]) return;
                  const options=ugelCatalogs[centerFilterSelects[0]?.value]||[];
                  centerFilterSelects[1].innerHTML='<option value="">UGEL</option>'+options.map(item=>`<option>${item}</option>`).join('');
                };
                centerFilterSelects[0]?.addEventListener('change',renderUgelCatalog);
                const closeCenter=()=>centerModal.remove();
                centerModal.querySelector('.close-center-search')?.addEventListener('click',closeCenter);
                centerModal.addEventListener('click',event=>{if(event.target===centerModal)closeCenter();});
                centerModal.querySelector('.clear-center-search')?.addEventListener('click',()=>centerModal.querySelectorAll('input').forEach(input=>input.value=''));
                centerModal.querySelector('.run-center-search')?.addEventListener('click',async()=>{
                  const code=centerModal.querySelector('.center-code-filter')?.value.trim()||'';
                  const name=centerModal.querySelector('.center-name-filter')?.value.trim()||'';
                  const response=await fetch(`api/centros-trabajo.php?codigo=${encodeURIComponent(code)}&nombre=${encodeURIComponent(name)}`,{cache:'no-store'});
                  const data=await response.json();
                  const body=centerModal.querySelector('.center-results-body');
                  let records=Array.isArray(data.registros)?data.registros:[];
                  const instituteFallback=getInstituteCenterFallback(code);
                  if(!records.length&&instituteFallback) records=[instituteFallback];
                  body.innerHTML=records.length?records.map(item=>`<button type="button" data-code="${item.codigo}"><span>${item.codigo}</span><span>${item.nombre}</span><span>${item.iged}</span><span>${item.nivel||'No registrado'}</span><span>${item.modalidad||'No registrado'}</span></button>`).join(''):'<p>No se encontraron registros.</p>';
                  centerModal.querySelectorAll('.center-results-body button').forEach(button=>button.addEventListener('click',()=>{const input=fieldEditor.querySelector('.modifier-new-value');if(input)input.value=button.dataset.code||'';closeCenter();}));
                  centerModal.querySelectorAll('.center-results footer b').forEach(value=>value.textContent=String(records.length));
                });
              });
            };
            fieldSelect?.addEventListener('change',renderFieldEditor);
            const notes=modifierDetailFieldset.querySelector('textarea');
            const counter=modifierDetailFieldset.querySelector('.modifier-notes-count');
            notes?.addEventListener('input',()=>{if(counter)counter.textContent=String(250-notes.value.length);});
            return;
          }
          const actionsWithEndDate=['DAR POR CONCLUIDO','LIMITAR'];
          const actionsWithNotesOnly=['DECLARAR NULO','DEJAR SIN EFECTO'];
          if(!actionsWithEndDate.includes(selectedAction)&&!actionsWithNotesOnly.includes(selectedAction)){
            modifierDetailFieldset.innerHTML='<legend>Detalle de la resolución de modificatoria</legend><p>Seleccione un tipo de acción para continuar con el formulario de registro</p>';
            return;
          }
          const requiresEndDate=actionsWithEndDate.includes(selectedAction);
          const endDateField=requiresEndDate?'<label><span>Fecha de término *</span><input class="modifier-end-date" type="date" required></label>':'';
          modifierDetailFieldset.innerHTML=`<legend>Detalle de la resolución de modificatoria</legend><div class="modifier-concluded-detail ${requiresEndDate?'':'modifier-null-detail'}">${endDateField}<label class="modifier-notes"><span>Anotaciones</span><strong class="modifier-notes-count">250</strong><textarea maxlength="250" placeholder="Anotaciones"></textarea></label><div class="modifier-save-row"><button class="save-ingress-modifier" type="button">▣ GUARDAR</button></div></div>`;
          const notes=modifierDetailFieldset.querySelector('textarea');
          const counter=modifierDetailFieldset.querySelector('.modifier-notes-count');
          notes?.addEventListener('input',()=>{if(counter)counter.textContent=String(250-notes.value.length);});
          modifierDetailFieldset.querySelector('.save-ingress-modifier')?.addEventListener('click',async()=>{
            const endDate=modifierDetailFieldset.querySelector('.modifier-end-date');
            if(endDate&&!endDate.value){endDate.focus();return;}
            const datos={'Registro objetivo':String(record[7]||record[5]||index),'Tipo de acción':selectedAction};
            modal.querySelectorAll('label').forEach((label,i)=>{const control=label.querySelector('input,select,textarea');if(!control||control.type==='file'||!control.value)return;const nombre=label.querySelector('span')?.textContent.replace(/\s*\*\s*$/,'').trim()||`Campo ${i+1}`;datos[nombre]=control.value;});
            const payload=new FormData();payload.append('dni',server.dni);payload.append('codmod',server.codigoAnterior||server.codigo);payload.append('formulario','modifier-form');payload.append('datos',JSON.stringify(datos));payload.append('resumen','{}');modal.querySelectorAll('input[type="file"]').forEach((input,i)=>{if(input.files[0])payload.append(`archivo_${i}`,input.files[0]);});
            try{const response=await fetch('api/formularios-registro.php',{method:'POST',body:payload});const result=await response.json();if(!response.ok||!result.ok)throw new Error(result.mensaje||'No se pudo guardar.');alert('Modificatoria guardada correctamente en la base de datos.');modal.remove();}catch(error){alert(error.message||'No se pudo guardar la modificatoria.');}
          });
        };
        modifierActionSelect?.addEventListener('change',renderModifierDetail);
        const modifierSummaryValues=modal.querySelectorAll('.admin-summary-grid > div > span');
        if(modifierSummaryValues[0]) modifierSummaryValues[0].textContent=record[7];
        if(modifierSummaryValues[1]) modifierSummaryValues[1].textContent=record[5];
        if(modifierSummaryValues[2]) modifierSummaryValues[2].textContent=record[6];
        const modifierResolutionType=modal.querySelector('.modifier-resolution-grid select');
        if(modifierResolutionType) modifierResolutionType.innerHTML=ingressResolutionType.innerHTML;
        const close=()=>modal.remove();
        modal.querySelector('.close-ingress-modifier')?.addEventListener('click',close);
        modal.addEventListener('click',event=>{if(event.target===modal)close();});
      }));
      document.querySelectorAll('.edit-ingress-center').forEach(button=>button.addEventListener('click',()=>{
        const index=button.dataset.ingressIndex;
        const editButton=document.querySelector(`.edit-ingress-action[data-ingress-index="${index}"]`);
        editButton?.click();
        const modifierModal=document.querySelector('.ingress-modifier-overlay:not(.center-search-overlay)');
        const actionSelect=modifierModal?.querySelector('.modifier-action-type select');
        if(actionSelect){
          actionSelect.value='MODIFICAR / RECTIFICAR';
          actionSelect.dispatchEvent(new Event('change',{bubbles:true}));
        }
        const fieldSelect=modifierModal?.querySelector('.modifier-field-select');
        if(fieldSelect){
          fieldSelect.value='CÓDIGO MODULAR IE';
          fieldSelect.dispatchEvent(new Event('change',{bubbles:true}));
        }
        modifierModal?.querySelector('.open-center-search')?.click();
        modifierModal?.remove();
      }));
      document.querySelectorAll('.cancel-ingress-action').forEach(button=>button.addEventListener('click',()=>{
        const index=Number(button.dataset.ingressIndex);
        const statusCell=button.closest('.ingress-row')?.querySelector('.ingress-status');
        if(!statusCell) return;
        const nextStatus=statusCell.textContent.trim()==='ANULADO'?'APROBADO':'ANULADO';
        statusCell.textContent=nextStatus;
        statusCell.classList.toggle('ingress-status-cancelled',nextStatus==='ANULADO');
        localStorage.setItem(`dre-ingress-status:${server.dni}:${index}`,nextStatus);
        saveStatusToDatabase(`dre-ingress-status:${server.dni}:${index}`,nextStatus);
      }));
      document.querySelectorAll('.ingress-row').forEach((row,index)=>{
        const savedStatus=localStorage.getItem(`dre-ingress-status:${server.dni}:${index}`);
        const statusCell=row.querySelector('.ingress-status');
        if(savedStatus==='ANULADO'||savedStatus==='DESAPROBADO'||savedStatus==='APROBADO'){statusCell.textContent=savedStatus==='DESAPROBADO'?'ANULADO':savedStatus;statusCell.classList.toggle('ingress-status-cancelled',statusCell.textContent==='ANULADO');}
        loadStatusFromDatabase(`dre-ingress-status:${server.dni}:${index}`,status=>{statusCell.textContent=status;statusCell.classList.toggle('ingress-status-cancelled',status==='ANULADO');});
        appendDatabaseDelete(row.querySelector('.ingress-row-actions'),server.ingresos?.[index],row);
      });
      document.querySelectorAll('.ingress-row').forEach((rowElement,index)=>rowElement.addEventListener('dblclick',event=>{
        if(event.target.closest('button')) return;
        document.querySelectorAll('.ingress-row').forEach(row=>row.classList.remove('ingress-selected'));
        rowElement.classList.add('ingress-selected');
        const record=ingressRows[index];
        if(!record) return;
        document.getElementById('ingress-record-detail')?.remove();
        const detailPanel=document.createElement('section');
        detailPanel.id='ingress-record-detail';
        detailPanel.innerHTML=`<fieldset class="admin-server-card"><legend>Datos principales de la resolución</legend><div class="admin-summary-grid">${detail('Tipo de resolución',record[7])}${detail('Número de resolución',record[5])}${detail('Fecha de resolución',record[6])}${detail('Régimen laboral',server.regimen)}${detail('Acción',record[0])}${detail('Motivo acción',record[1])}${detail('Documento','No registrado')}${detail('Folios','No registrado')}</div></fieldset><fieldset class="admin-server-card"><legend>Detalle de la resolución</legend><div class="admin-summary-grid">${detail('Código de plaza','No registrado')}${detail('Código modular IE',server.centroCodigo)}${detail('Centro laboral',server.institucion)}${detail('Región',server.ubicacion)}${detail('Instancia de gestión educativa descentralizada','No registrado')}${detail('Modalidad educativa','No registrado')}${detail('Nivel educativo','No registrado')}${detail('Escala / Categoría / Nivel / Grupo','No registrado')}${detail('Situación laboral',server.situacionLaboral)}${detail('Condición laboral',server.condicion)}${detail('USE / Zona / Subregión','No registrado')}${detail('Cargo',server.cargo)}${detail('Jornada laboral',server.horasLaborales)}${detail('¿Por mandato judicial?','No registrado')}${detail('Fecha inicio',record[2])}${detail('Fecha fin',record[3])}${detail('Anotaciones','No registrado')}</div></fieldset><div class="ingress-record-detail-actions"><button type="button">← RETORNAR</button><button type="button">⌫ CANCELAR</button></div>`;
        const ingressForm=document.getElementById('ingress-form');
        ingressForm.before(detailPanel);
        ingressForm.hidden=true;
        detailPanel.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{detailPanel.remove();ingressForm.hidden=false;rowElement.classList.remove('ingress-selected');}));
      }));
      document.getElementById('return-ingress').addEventListener('click', () => { window.location.href = 'gestion-servidor.html'; });
      document.getElementById('ingress-reason').addEventListener('change', event => {
        const fields = document.getElementById('ingress-detail-fields');
        fields.hidden = !event.target.value;
        document.getElementById('ingress-detail-message').hidden = Boolean(event.target.value);
      });
      document.getElementById('ingress-form').addEventListener('submit', async event => {
        event.preventDefault();
        const form=event.currentTarget;
        const labels=[...form.querySelectorAll('label')];
        const control=title=>labels.find(label=>label.querySelector('span')?.textContent.trim().startsWith(title))?.querySelector('input,select,textarea');
        const documentInput=control('Documento');
        const detailControls=document.getElementById('ingress-detail-fields')?.querySelectorAll('input,select')||[];
        const data=new FormData();
        data.append('dni',server.dni||''); data.append('codmod',server.codigo||server.dni||'');
        data.append('tipo_resolucion',control('Tipo de resolución')?.value||'');
        data.append('numero_resolucion',control('Número resolución')?.value||'');
        data.append('fecha_resolucion',control('Fecha de resolución')?.value||'');
        data.append('folios',control('Folios')?.value||'');
        data.append('regimen',document.getElementById('ingress-regime')?.value||'');
        data.append('accion',document.getElementById('ingress-action')?.value||'');
        data.append('motivo',document.getElementById('ingress-reason')?.value||'');
        data.append('fecha_inicio',detailControls[0]?.value||''); data.append('fecha_fin',detailControls[1]?.value||'');
        data.append('centro_laboral',detailControls[2]?.value||''); data.append('cargo',detailControls[3]?.value||'');
        data.append('condicion',detailControls[4]?.value||''); data.append('estado',detailControls[5]?.value||'APROBADO');
        if(documentInput?.files?.[0]) data.append('documento',documentInput.files[0]);
        const saveButton=form.querySelector('button[type="submit"]');
        if(saveButton){saveButton.disabled=true;saveButton.textContent='GUARDANDO...';}
        try {
          const response=await fetch('api/ingreso.php',{method:'POST',body:data});
          const result=await response.json();
          if(!response.ok||!result.ok) throw new Error(result.mensaje||'No se pudo guardar el registro.');
          if(!Array.isArray(server.ingresos)) server.ingresos=[];
          server.ingresos.unshift(result.registro);
          alert(result.mensaje);
          showAdminIngress();
        } catch(error) {
          alert(error.message||'No se pudo guardar el registro de ingreso.');
          if(saveButton){saveButton.disabled=false;saveButton.textContent='▣ GUARDAR';}
        }
      });
      window.location.hash = 'ingreso';
    };
    const showAdminTrajectory = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      trajectoryMenu.classList.add('active');
      const trajectoryDetail = (label,value,status = 'match') => `<div><strong>${label}</strong><span class="trajectory-${status}">${value || 'No registrado'}</span></div>`;
      const isSuperior = (server.cargo || '').includes('Superior');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs trajectory-tabs"><a class="active">Situación laboral actual</a><a>Datos de desplazamiento</a><a>Ascenso</a></nav><fieldset class="admin-server-card trajectory-card"><legend>Situación laboral actual</legend><div class="trajectory-grid">${trajectoryDetail('Último movimiento','INGRESO')}${trajectoryDetail('Dirección regional de educación','DIRECCIÓN REGIONAL DE EDUCACIÓN HUANCAVELICA')}${trajectoryDetail('Unidad de gestión educativa local',server.ubicacion || 'UGEL HUANCAVELICA')}${trajectoryDetail('Código de plaza',server.cm || server.codigo)}${trajectoryDetail('Modalidad educativa',isSuperior ? 'EDUCACIÓN SUPERIOR' : 'EDUCACIÓN BÁSICA REGULAR')}${trajectoryDetail('Nivel educativo',isSuperior ? 'SUPERIOR TECNOLÓGICA - IST' : 'SECUNDARIA')}${trajectoryDetail('Condición laboral',server.condicion)}${trajectoryDetail('Situación laboral','EN ACTIVIDAD', 'difference')}${trajectoryDetail('Código modular IE',server.codigo)}${trajectoryDetail('Centro laboral',server.institucion)}${trajectoryDetail('Escala / Categoría / Nivel / Grupo',server.escala || 'ESCALA MAGISTERIAL IV')}${trajectoryDetail('Cargo',server.cargo,'difference')}${trajectoryDetail('Jornada','30 HORAS')}</div><div class="trajectory-legend"><strong>Leyenda:</strong><ul><li><span class="trajectory-match">Información en color verde:</span> información coincide entre escalafón y NEXUS</li><li><span class="trajectory-difference">Información en color rojo:</span> información no coincide (escalafón | NEXUS)</li></ul></div></fieldset><div class="trajectory-actions"><button id="return-trajectory" type="button">← RETORNAR</button></div>`;
      const trayectoria=server.trayectoriaActual || {};
      const valoresTrayectoria={
        'Último movimiento':trayectoria.ultimoMovimiento,
        'Dirección regional de educación':trayectoria.direccionRegional,
        'Unidad de gestión educativa local':trayectoria.unidadGestion,
        'Código de plaza':trayectoria.codigoPlaza,
        'Modalidad educativa':trayectoria.modalidadEducativa,
        'Nivel educativo':trayectoria.nivelEducativo,
        'Condición laboral':trayectoria.condicionLaboral,
        'Situación laboral':trayectoria.situacionLaboral,
        'Código modular IE':trayectoria.codigoModularIE,
        'Centro laboral':trayectoria.centroLaboral,
        'Escala / Categoría / Nivel / Grupo':trayectoria.escalaCategoria,
        'Cargo':trayectoria.cargo,
        'Jornada':trayectoria.jornada ? `${trayectoria.jornada} HORAS` : ''
      };
      document.querySelectorAll('.trajectory-grid > div').forEach(item=>{
        const label=item.querySelector('strong')?.textContent.trim();
        const value=item.querySelector('span');
        if(label && value && Object.prototype.hasOwnProperty.call(valoresTrayectoria,label)) value.textContent=valoresTrayectoria[label] || 'No registrado';
      });
      document.getElementById('return-trajectory').addEventListener('click', () => { window.location.href = 'gestion-servidor.html'; });
      document.querySelectorAll('.trajectory-tabs a')[1].addEventListener('click', showAdminDisplacement);
      document.querySelectorAll('.trajectory-tabs a')[2].addEventListener('click', showAdminAscent);
      window.location.hash = 'trayectoria';
    };
    const trajectoryResolutionOptions = '<option value="">Seleccione tipo de resolución</option><option>DECRETO DIRECTORAL</option><option>RESOLUCION DE ALCALDIA</option><option>RESOLUCION DIRECTORAL</option><option>RESOLUCION DIRECTORAL USE</option><option>RESOLUCION DE LA DIRECCION DEPARTAMENTAL</option><option>RESOLUCION DIRECTORAL REGIONAL</option><option>RESOLUCION DIRECTORAL REGIONAL SECTORIAL</option><option>RESOLUCION DIRECTORAL SUPERIOR</option><option>RESOLUCION DIRECTORAL SUB REGIONAL SECTORIAL</option><option>RESOLUCION DIRECTORAL SUB REGIONAL</option><option>RESOLUCION DIRECTORAL ZONAL</option><option>RESOLUCION DE GERENCIA REGIONAL</option><option>RESOLUCION DE GERENCIA SECTORIAL REGIONAL</option><option>RESOLUCION EJECUTIVA REGIONAL</option><option>RESOLUCION JEFATURAL</option><option>RESOLUCION MINISTERIAL</option><option>RESOLUCION REGIONAL SECTORIAL</option><option>RESOLUCION DE SECRETARIA GENERAL</option><option>RESOLUCION SECTORIAL REGIONAL</option><option>RESOLUCION SERVIR</option><option>RESOLUCION VICEMINISTERIAL</option><option>RESOLUCION ADMINISTRATIVA</option><option>RESOLUCION SUPREMA</option><option>RESOLUCION DIRECTORAL ADMINISTRATIVA</option>';
    const ascentResolutionOptions = trajectoryResolutionOptions.replace('<option>RESOLUCION DIRECTORAL ADMINISTRATIVA</option>', '');
    const withholdingResolutionOptions = '<option value="">Seleccione tipo de resolución</option><option>OFICIO</option><option>CARTA</option><option>INFORME</option>' + ascentResolutionOptions.replace('<option value="">Seleccione tipo de resolución</option>', '').replace('<option>RESOLUCION SUPREMA</option>', '<option>RESOLUCION JUDICIAL</option><option>RESOLUCION SUPREMA</option>');
    const showAdminDisplacement = () => {
      const displacementData = (Array.isArray(server.desplazamientos) ? server.desplazamientos : []).map(row => [row.accion || 'No registrado', row.motivo || 'No registrado', row.fechaInicio || 'No registrado', row.fechaFin || 'No registrado', row.cargo || 'No registrado', row.centroOrigen || 'No registrado', row.centroDestino || 'No registrado', row.estado || 'APROBADO', row.resolucion || 'No registrado', row.fechaResolucion || 'No registrado', row.codigoModularDestino || 'No registrado']);
      const displacementRows = displacementData.length ? displacementData.map((row,index) => `<div class="displacement-row" data-displacement-index="${index}"><span>${index + 1}</span><span>${row[0]}</span><span>${row[1]}</span><span>${server.regimen}</span><span>${row[2]}</span><span>${row[3]}</span><span>${row[4]}</span><span>${row[5]}</span><span>${row[6]}</span><span>${row[8]}${row[9] !== 'No registrado' ? `<small>Fecha: ${row[9]}</small>` : ''}</span><span class="displacement-status">${row[7]}</span><span class="displacement-row-actions"><button class="displacement-edit" type="button" title="Modificar" aria-label="Modificar">✎</button><button class="displacement-center" type="button" title="Modificar centro" aria-label="Modificar centro">♜</button><button class="displacement-cancel" type="button" title="Anular" aria-label="Anular">⊖</button></span></div>`).join('') : '<div class="ascent-empty">No se encontraron registros</div>';
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs trajectory-tabs"><a>Situación laboral actual</a><a class="active">Datos de desplazamiento</a><a>Ascenso</a></nav><fieldset class="admin-server-card"><legend>Registro de desplazamiento</legend><div class="displacement-table"><div class="displacement-head"><span>N°</span><span>Acción</span><span>Motivo</span><span>Régimen</span><span>Fecha inicio</span><span>Fecha fin</span><span>Cargo</span><span>Centro origen</span><span>Centro destino</span><span>Resolución</span><span>Estado</span><span>Acciones</span></div>${displacementRows}<div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 4 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 1 página</strong></div></div></fieldset><form id="displacement-form"><fieldset class="admin-server-card"><legend>Datos principales de la resolución</legend><div class="ingress-form-grid"><label><span>Tipo de resolución *</span><select required><option value="">Seleccione tipo de resolución</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN DIRECTORAL</option></select></label><label><span>Número resolución (######-año-IGED) *</span><input required placeholder="Número de resolución"></label><label><span>Fecha de resolución *</span><input required type="date"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label><span></span><label><span>Régimen laboral</span><select><option value="">Seleccione régimen laboral</option><option>LEY N° 29944</option><option>LEY N° 30512</option><option>D.L. N° 276</option></select></label><label><span>Acción</span><select><option value="">Seleccione acción</option><option>ENCARGATURA</option><option>DESTAQUE</option><option>REASIGNACIÓN</option><option>PERMUTA</option></select></label><label><span>Motivo acción</span><select id="displacement-reason"><option value="">Seleccione motivo</option><option>DE PUESTO</option><option>POR NECESIDAD INSTITUCIONAL</option><option>POR UNIDAD FAMILIAR</option></select></label></div></fieldset><fieldset class="admin-server-card ingress-detail"><legend>Detalle de la resolución</legend><p id="displacement-detail-message">Seleccione el motivo acción para continuar con el formulario de registro</p><div id="displacement-detail-fields" class="ingress-form-grid" hidden><label><span>Fecha inicio *</span><input type="date"></label><label><span>Fecha fin</span><input type="date"></label><label><span>Cargo *</span><input value="${server.cargo}"></label><label><span>Centro de origen *</span><input value="${server.institucion}"></label><label><span>Centro de destino *</span><input placeholder="Centro de destino"></label><label><span>Estado</span><select><option>APROBADO</option><option>MODIFICADO</option></select></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="displacement-actions"><button id="return-displacement" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      const displacementTotals=document.querySelectorAll('.displacement-table .ingress-pagination strong');
      if(displacementTotals[0]) displacementTotals[0].textContent=`Total: ${displacementData.length} registros`;
      if(displacementTotals[1]) displacementTotals[1].textContent=`Total: ${displacementData.length ? 1 : 0} página${displacementData.length === 1 ? '' : 's'}`;
      document.querySelector('#displacement-form .ingress-form-grid label select').innerHTML = trajectoryResolutionOptions;
      const displacementForm = document.getElementById('displacement-form');
      const displacementMainGrid = displacementForm.querySelector('.ingress-form-grid');
      const displacementField = label => [...displacementMainGrid.querySelectorAll('label')].find(item => item.querySelector('span')?.textContent.trim().replace(/\s*\*$/, '') === label)?.querySelector('select, input');
      const displacementRegime = displacementField('Régimen laboral');
      const displacementAction = displacementField('Acción');
      const displacementReason = document.getElementById('displacement-reason');
      const displacementDetail = document.getElementById('displacement-detail-fields');
      const displacementMessage = document.getElementById('displacement-detail-message');
      const administrativeRegime = 'DECRETO LEGISLATIVO 276 - CARRERA ADMINISTRATIVA';
      const promotionAction = 'ASCENSO DE CARGO';
      const designationAction = 'DESIGNACIÓN';
      const secondmentAction = 'DESTAQUE';
      const secondmentReasons = ['POR NECESIDAD INSTITUCIONAL','POR RAZONES DE SALUD','POR UNIDAD FAMILIAR'];
      const actingAction = 'ENCARGATURA';
      const actingReasons = ['DE FUNCIONES','DE PUESTO'];
      const exchangeAction = 'PERMUTA';
      const exchangeReason = 'A SOLICITUD';
      const reassignmentAction = 'REASIGNACIÓN';
      const reassignmentReasons = ['POR INTERÉS PERSONAL','POR RACIONALIZACIÓN','POR RAZONES DE SALUD','POR UNIDAD FAMILIAR'];
      const setSelectOptions = (select, placeholder, values) => {
        select.innerHTML = `<option value="">${placeholder}</option>${values.map(value => `<option>${value}</option>`).join('')}`;
      };
      const renderPromotionDetail = () => {
        displacementDetail.className = '';
        displacementDetail.style.cssText = 'display:block;grid-column:1/-1';
        displacementDetail.innerHTML = `<div class="ingress-form-grid"><label><span>Fecha inicio *</span><input required type="date"></label></div><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:10px"><fieldset class="admin-server-card"><legend>Datos de Origen</legend><div class="ingress-form-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))"><label style="grid-column:1/-1"><span>Código modular IE</span><input value="${server.codigo || ''}" placeholder="Código modular IE"></label><label><span>Centro laboral</span><input value="${server.institucion || ''}" readonly></label><label><span>Región</span><input value="HUANCAVELICA" readonly></label><label style="grid-column:1/-1"><span>Instancia de gestión educativa descentralizada</span><input value="DRE HUANCAVELICA" readonly></label><label><span>Condición Laboral *</span><select required><option>${server.condicion || 'NOMBRADO'}</option><option>NOMBRADO</option><option>CONTRATADO</option></select></label><label><span>Situación Laboral *</span><select required><option>EN ACTIVIDAD</option><option>CESANTE</option></select></label><label><span>Código de plaza</span><input placeholder="Código de plaza"></label><label><span>USE / Zona / Subregión</span><input placeholder="USE / Zona / Subregión"></label><label><span>Grupo ocupacional *</span><input required placeholder="Grupo ocupacional"></label><label><span>Categoría Remunerativa</span><input placeholder="Categoría Remunerativa"></label><label style="grid-column:1/-1"><span>Cargo</span><select><option>${server.cargo || 'Seleccione cargo'}</option></select></label><label style="grid-column:1/-1"><span>Jornada Laboral</span><select><option value="">Seleccione jornada laboral</option></select></label></div></fieldset><fieldset class="admin-server-card"><legend>Datos de Destino</legend><div class="ingress-form-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))"><label style="grid-column:1/-1"><span>Código modular IE</span><input placeholder="Código modular IE"></label><label><span>Centro laboral</span><input readonly></label><label><span>Región</span><input readonly></label><label style="grid-column:1/-1"><span>Instancia de gestión educativa descentralizada</span><input readonly></label><label><span>Condición laboral</span><input value="NOMBRADO" readonly></label><label><span>Situación Laboral</span><input value="EN ACTIVIDAD" readonly></label><label><span>Código de plaza</span><input placeholder="Código de plaza"></label><label><span>USE / Zona / Subregión</span><input placeholder="USE / Zona / Subregión"></label><label><span>Grupo ocupacional *</span><input required placeholder="Grupo ocupacional"></label><label><span>Categoría Remunerativa</span><input placeholder="Categoría Remunerativa"></label><label style="grid-column:1/-1"><span>Cargo</span><select><option value="">Seleccione cargo</option></select></label><label style="grid-column:1/-1"><span>Jornada Laboral</span><select><option value="">Seleccione jornada laboral</option></select></label></div></fieldset></div><div style="display:grid;grid-template-columns:245px minmax(0,1fr);gap:12px;align-items:start;margin-top:10px"><div style="display:flex;align-items:center;gap:10px;padding:8px 0"><span>¿Por mandato judicial?</span><label class="admin-switch" aria-label="Por mandato judicial"><input type="checkbox"><span></span></label><small>SI</small></div><label style="position:relative;display:flex;flex-direction:column;gap:6px;min-width:0"><span style="color:#0a9f3b">Anotaciones</span><textarea maxlength="250" rows="4" style="display:block;width:100%;min-height:64px;box-sizing:border-box;resize:vertical;border:0;border-bottom:1px solid #31ad65;background:#f0f0f0;padding:11px 12px;font:inherit"></textarea><small style="position:absolute;right:8px;top:2px;color:#25343d">250</small></label></div>`;
        const displacementDateGrid = displacementDetail.querySelector(':scope > .ingress-form-grid');
        displacementDateGrid?.insertAdjacentHTML('beforeend','<label><span>Fecha fin *</span><input required type="date" readonly></label>');
        const displacementStartDate = displacementDateGrid?.querySelector('label:first-child input[type="date"]');
        const displacementEndDate = displacementDateGrid?.querySelector('label:nth-child(2) input[type="date"]');
        const updateDisplacementEndDate = () => {
          const year = displacementStartDate?.value.slice(0,4);
          if (displacementEndDate) displacementEndDate.value = /^\d{4}$/.test(year || '') ? `${year}-12-31` : '';
        };
        displacementStartDate?.addEventListener('input', updateDisplacementEndDate);
        displacementStartDate?.addEventListener('change', updateDisplacementEndDate);
        updateDisplacementEndDate();
        const originPanelForDisplay = displacementDetail.querySelector('fieldset:first-of-type');
        const originStaticFields = [
          ['Centro laboral','origin-center'],
          ['Región','origin-region'],
          ['Instancia de gestión educativa descentralizada','origin-iged']
        ];
        originStaticFields.forEach(([labelText,dataName]) => {
          const label = [...(originPanelForDisplay?.querySelectorAll('label') || [])].find(item => item.querySelector('span')?.textContent.trim() === labelText);
          const input = label?.querySelector('input');
          if (!label || !input) return;
          const field = document.createElement('div');
          field.style.cssText = `display:flex;flex-direction:column;gap:5px;${labelText.startsWith('Instancia') ? 'grid-column:1/-1' : ''}`;
          field.innerHTML = `<strong>${labelText}</strong><span data-${dataName}></span>${labelText === 'Centro laboral' ? '<input type="hidden" name="Centro origen" data-center-hidden value="">' : ''}`;
          label.replaceWith(field);
        });
        const destinationPanelForDisplay = displacementDetail.querySelectorAll('fieldset')[1];
        const originUseInput=[...(originPanelForDisplay?.querySelectorAll('label')||[])].find(item=>item.querySelector('span')?.textContent.trim()==='USE / Zona / Subregión')?.querySelector('input');
        if(originUseInput) originUseInput.dataset.saveLabel='USE / Zona / Subregión - Origen';
        const destinationUseInput=[...(destinationPanelForDisplay?.querySelectorAll('label')||[])].find(item=>item.querySelector('span')?.textContent.trim()==='USE / Zona / Subregión')?.querySelector('input');
        if(destinationUseInput) destinationUseInput.dataset.saveLabel='USE / Zona / Subregión - Destino';
        const destinationStaticFields = [
          ['Centro laboral','origin-center',''],
          ['Región','origin-region',''],
          ['Instancia de gestión educativa descentralizada','origin-iged',''],
          ['Condición laboral','destination-condition','NOMBRADO'],
          ['Situación Laboral','destination-situation','EN ACTIVIDAD']
        ];
        destinationStaticFields.forEach(([labelText,dataName,defaultValue]) => {
          const label = [...(destinationPanelForDisplay?.querySelectorAll('label') || [])].find(item => item.querySelector('span')?.textContent.trim() === labelText);
          const input = label?.querySelector('input');
          if (!label || !input) return;
          const field = document.createElement('div');
          field.style.cssText = `display:flex;flex-direction:column;gap:5px;${labelText.startsWith('Instancia') ? 'grid-column:1/-1' : ''}`;
          field.innerHTML = `<strong>${labelText}</strong><span data-${dataName}>${input.value || defaultValue}</span>${labelText === 'Centro laboral' ? `<input type="hidden" name="Centro destino" data-center-hidden value="${input.value}">` : ''}`;
          label.replaceWith(field);
        });
        const occupationalCategories = {
          'DIRECTIVO / FUNCIONARIO':['F1','F2','F3','F4','F5','F6'],
          'PROFESIONAL':['SPE','SPD','SPC','SPB','SPA'],
          'TECNICO':['STE','STD','STC','STB','STA'],
          'AUXILIAR':['SAE','SAD','SAC','SAB','SAA']
        };
        [...displacementDetail.querySelectorAll('fieldset')].forEach(panel => {
          const labels = [...panel.querySelectorAll('label')];
          const groupLabel = labels.find(item => item.querySelector('span')?.textContent.trim().startsWith('Grupo ocupacional'));
          const categoryLabel = labels.find(item => item.querySelector('span')?.textContent.trim() === 'Categoría Remunerativa');
          const groupInput = groupLabel?.querySelector('input');
          const categoryInput = categoryLabel?.querySelector('input');
          if (!groupLabel || !categoryLabel || !groupInput || !categoryInput) return;
          groupInput.readOnly = true;
          const groupPicker = document.createElement('span');
          groupPicker.style.cssText = 'display:grid;grid-template-columns:minmax(0,1fr) 38px;gap:0';
          groupInput.before(groupPicker);
          groupPicker.appendChild(groupInput);
          const groupSearch = document.createElement('button');
          groupSearch.type = 'button';
          groupSearch.textContent = '⌕';
          groupSearch.title = 'Buscar grupo ocupacional y categoría remunerativa';
          groupSearch.style.cssText = 'border:0;border-bottom:1px solid #777;background:#f0f0f0;color:#33414e;font-size:18px;cursor:pointer';
          groupPicker.appendChild(groupSearch);
          const categoryValue = document.createElement('span');
          categoryValue.dataset.remunerativeCategory = '';
          categoryValue.textContent = categoryInput.value;
          categoryValue.style.cssText = 'display:block;min-height:20px;padding-top:7px';
          categoryInput.replaceWith(categoryValue);
          groupSearch.addEventListener('click', () => {
            const pickerModal = document.createElement('div');
            pickerModal.className = 'ingress-modifier-overlay occupational-group-overlay';
            pickerModal.innerHTML = `<section class="center-search-modal" role="dialog" aria-modal="true"><header><strong>Grupo Ocupacional y Categoría Remunerativa</strong><button class="close-occupational-picker" type="button" aria-label="Cerrar">×</button></header><div class="center-search-body"><nav><button class="active" type="button">Búsqueda de grupo ocupacional</button></nav><fieldset><legend>Filtros de búsqueda</legend><label style="display:block;margin-bottom:10px">Categoría no acorde al grupo ocupacional<br><span style="display:inline-flex;align-items:center;gap:8px"><input type="checkbox"> SI</span></label><div class="center-search-filters"><select class="occupational-group"><option value="">Grupo ocupacional *</option>${Object.keys(occupationalCategories).map(item => `<option>${item}</option>`).join('')}</select><select class="remunerative-category"><option value="">Categoría remunerativa *</option></select></div><div class="center-search-buttons"><button class="clear-occupational-picker" type="button">⌫ LIMPIAR</button><button class="select-occupational-picker" type="button">⌕ SELECCIONAR</button></div></fieldset></div></section>`;
            document.body.appendChild(pickerModal);
            const groupSelect = pickerModal.querySelector('.occupational-group');
            const categorySelect = pickerModal.querySelector('.remunerative-category');
            const renderCategories = () => {
              categorySelect.innerHTML = '<option value="">Categoría remunerativa *</option>' + (occupationalCategories[groupSelect.value] || []).map(item => `<option>${item}</option>`).join('');
            };
            groupSelect.addEventListener('change', renderCategories);
            pickerModal.querySelector('.close-occupational-picker').addEventListener('click', () => pickerModal.remove());
            pickerModal.querySelector('.clear-occupational-picker').addEventListener('click', () => { groupSelect.value=''; renderCategories(); });
            pickerModal.querySelector('.select-occupational-picker').addEventListener('click', () => {
              if (!groupSelect.value || !categorySelect.value) return;
              groupInput.value = groupSelect.value;
              categoryValue.textContent = categorySelect.value;
              pickerModal.remove();
            });
          });
        });
        const displacementLocationPanels = [...displacementDetail.querySelectorAll('fieldset')];
        displacementLocationPanels.forEach(panel => {
          panel.querySelectorAll('input').forEach(input => { input.value = ''; });
          panel.querySelectorAll('select').forEach(select => {
            if (!select.querySelector('option[value=""]')) select.insertAdjacentHTML('afterbegin', '<option value="">Seleccione</option>');
            select.value = '';
          });
        });
        const originLaborLabels = [...(originPanelForDisplay?.querySelectorAll('label') || [])];
        const laborCondition = originLaborLabels.find(item => item.querySelector('span')?.textContent.trim().startsWith('Condición Laboral'))?.querySelector('select');
        const laborSituation = originLaborLabels.find(item => item.querySelector('span')?.textContent.trim().startsWith('Situación Laboral'))?.querySelector('select');
        const laborSituationsByCondition = {
          'CON PROPINA':[],
          'CONTRATADO':['CON LICENCIA CON GOCE','CON LICENCIA SIN GOCE','CON SANCIÓN','DE BAJA','EN ABANDO DE CARGO','EN ACTIVIDAD','ENCARGADO','INHABILITADO','PENSIONISTA','SEPARACIÓN PREVENTIVA','SUSPENSIÓN CON CONTRAPRESTACIÓN','SUSPENSIÓN SIN CONTRAPRESTACIÓN'],
          'CONTRATO A PLAZO INDETERMINADO':['CON LICENCIA CON GOCE','CON LICENCIA SIN GOCE','CON SANCIÓN','DE BAJA','DESIGNADO','DESTACADO','EN ABANDO DE CARGO','EN ACTIVIDAD','ENCARGADO','PENSIONISTA','REASIGNADO A OTRA IGED','SEPARACIÓN PREVENTIVA'],
          'NOMBRADO':['CESADO','CON LICENCIA CON GOCE','CON LICENCIA SIN GOCE','CON SANCIÓN','DE BAJA','DESIGNADO','DESTACADO','DESTITUIDO','EN ABANDO DE CARGO','EN ACTIVIDAD','ENCARGADO','INHABILITADO','PENSIONISTA','REASIGNADO A OTRA IGED','RETIRADO','SEPARACIÓN PREVENTIVA']
        };
        if (laborCondition && laborSituation) {
          laborCondition.innerHTML = '<option value="">Condición Laboral *</option>' + ['CON PROPINA','CONTRATADO','CONTRATO A PLAZO INDETERMINADO','NOMBRADO'].map(item => `<option>${item}</option>`).join('');
          const renderLaborSituations = () => {
            laborSituation.innerHTML = '<option value="">Situación Laboral *</option>' + (laborSituationsByCondition[laborCondition.value] || []).map(item => `<option>${item}</option>`).join('');
          };
          laborCondition.addEventListener('change', renderLaborSituations);
          renderLaborSituations();
        }
        const administrativeCargoOptions = `ABOGADO|ABOGADO I|ABOGADO II|ABOGADO III|ADMINISTRADOR|ALMACENERO|ANALISTA ADMINISTRATIVO E INSTITUCIONAL|ANALISTA DE SISTEMAS PAD|ANALISTA DE SISTEMAS PAD II|ANTROPÓLOGO|ANTROPÓLOGO II|ARQUITECTO|ARTESANO|ARTESANO I|ARTESANO II|ARTESANO III|ASESOR LEGAL|ASISTENTE ADMINISTRATIVO II|ASISTENTE DE SERVICIOS EN INFRAESTRUCTURA|ASISTENTE DE SISTEMA ADMINISTRATIVO|ASISTENTE DE SISTEMA ADMINISTRATIVO I|ASISTENTE DE SISTEMA ADMINISTRATIVO II|ASISTENTE EN SERV. DE EDUCACIÓN Y CULTURA|ASISTENTE EN SERV. DE EDUCACIÓN Y CULTURA I|ASISTENTE EN SERV. DE EDUCACIÓN Y CULTURA II|ASISTENTE SOCIAL|ASISTENTE SOCIAL I|ASISTENTE SOCIAL II|ASISTENTE SOCIAL IV|AUDITOR|AUDITOR I|AUDITOR II|AUDITOR III|AUDITOR INTERNO|AUX. MANT. LIMP. LOCAL II|AUXILIAR AGROPECUARIO|AUXILIAR AGROPECUARIO I|AUXILIAR DE ARTESANÍA|AUXILIAR DE BIBLIOTECA|AUXILIAR DE BIBLIOTECA I|AUXILIAR DE BIBLIOTECA II|AUXILIAR DE CONTABILIDAD|AUXILIAR DE CONTABILIDAD II|AUXILIAR DE ENFERMERÍA|AUXILIAR DE ENFERMERÍA II|AUXILIAR DE FISIOTERAPIA|AUXILIAR DE FORMACIÓN DEL NIÑO|AUXILIAR DE LABORATORIO|AUXILIAR DE LABORATORIO I|AUXILIAR DE LABORATORIO II|AUXILIAR DE MECÁNICA|AUXILIAR DE NUTRICIÓN|AUXILIAR DE NUTRICIÓN I|AUXILIAR DE NUTRICIÓN II|AUXILIAR DE OFICINA|AUXILIAR DE OFICINA I|AUXILIAR DE OFICINA II|AUXILIAR DE OFICINA III|AUXILIAR DE PUBLICACIONES|AUXILIAR DE PUBLICACIONES II|AUXILIAR DE PUBLICACIONES III|AUXILIAR DE SECRETARÍA|AUXILIAR DE SISTEMA ADMINISTRATIVO|AUXILIAR DE SISTEMA ADMINISTRATIVO I|AUXILIAR DE SISTEMA ADMINISTRATIVO II|AUXILIAR DE VIDEOTECA|BIBLIOTECARIO|BIBLIOTECARIO I|BIBLIOTECARIO II|BIBLIOTECARIO III|CAJERO|CAJERO I|CAJERO II|CARPINTERO|CHOFER|CHOFER I|CHOFER II|CHOFER III|COCINERO|CONTADOR|CONTADOR I|CONTADOR II|CONTADOR III|COORDINADOR ACADÉMICO|COORDINADOR DE RED|COORDINADOR RED RURAL|DIBUJANTE|DIGITADOR|DIRECTOR DE ASESORÍA JURÍDICA|DIRECTOR DE AUDITORÍA|DIRECTOR DE GESTIÓN ADMINISTRATIVA|DIRECTOR DE GESTIÓN INSTITUCIONAL|DIRECTOR DE GESTIÓN PEDAGÓGICA|DIRECTOR DE PROGRAMA SECTORIAL|DIRECTOR DE PROGRAMA SECTORIAL I|DIRECTOR DE PROGRAMA SECTORIAL II|DIRECTOR DE PROGRAMA SECTORIAL III|DIRECTOR DE PROGRAMA SECTORIAL IV|DIRECTOR DE SISTEMA ADMINISTRATIVO|DIRECTOR DE SISTEMA ADMINISTRATIVO I|DIRECTOR DE SISTEMA ADMINISTRATIVO II|DIRECTOR DE SISTEMA ADMINISTRATIVO III|ECONOMISTA|ECONOMISTA II|ELECTRICISTA|ENFERMERA|ESPECIALISTA|ESPECIALISTA ADMINISTRATIVO|ESPECIALISTA ADMINISTRATIVO I|ESPECIALISTA ADMINISTRATIVO II|ESPECIALISTA ADMINISTRATIVO III|ESPECIALISTA ADMINISTRATIVO IV|ESPECIALISTA EN ABASTECIMIENTO II|ESPECIALISTA EN ACTIV. PRODUCTIVAS|ESPECIALISTA EN ÁREAS TÉCNICAS|ESPECIALISTA EN ARTES GRÁFICAS|ESPECIALISTA EN AUDITORÍA|ESPECIALISTA EN CAPACITACIÓN|ESPECIALISTA EN CAPACITACIÓN I|ESPECIALISTA EN CAPACITACIÓN II|ESPECIALISTA EN CAPACITACIÓN III|ESPECIALISTA EN CULTURA Y DEPORTE|ESPECIALISTA EN EDUCACIÓN - ADMINISTRATIVO|ESPECIALISTA EN EDUCACIÓN II|ESPECIALISTA EN FINANZAS|ESPECIALISTA EN FINANZAS I|ESPECIALISTA EN FINANZAS II|ESPECIALISTA EN FINANZAS III|ESPECIALISTA EN FINANZAS IV|ESPECIALISTA EN INSPECTORÍA|ESPECIALISTA EN INSPECTORÍA I|ESPECIALISTA EN INSPECTORÍA II|ESPECIALISTA EN INSPECTORÍA III|ESPECIALISTA EN INSPECTORÍA IV|ESPECIALISTA EN INVESTIGACIÓN EDUCATIVA|ESPECIALISTA EN PLANIFICACIÓN|ESPECIALISTA EN PROCESOS ADMINISTRATIVOS DISCIPLINARIOS|ESPECIALISTA EN PROMOCIÓN SOCIAL|ESPECIALISTA EN RACIONALIZACIÓN|ESPECIALISTA EN RACIONALIZACIÓN I|ESPECIALISTA EN RACIONALIZACIÓN II|ESPECIALISTA EN RACIONALIZACIÓN IV|ESPECIALISTA EN RED|ESPECIALISTA EN RED I|ESPECIALISTA EN RED II|ESTADÍSTICO|ESTADÍSTICO I|ESTADÍSTICO II|ESTADÍSTICO III|ESTADÍSTICO IV|FISIOTERAPEUTA|FOTÓGRAFO II|INGENIERO|INGENIERO I|INGENIERO II|INGENIERO III|INGENIERO IV|JEFE ADMINISTRATIVO II|JEFE DE ÁREA ADMINISTRATIVA|JEFE DE DEPARTAMENTO DE ADMINISTRACIÓN|JEFE DE DPTO. ADMINISTRATIVO|JEFE DE GESTIÓN ADMINISTRATIVA|JEFE DE GESTIÓN INSTITUCIONAL|JEFE DE GESTIÓN PEDAGÓGICA|LABORATORISTA|MECÁNICO|MECÁNICO ELECTRICISTA|MÉDICO (ADM)|MOTORISTA|NUTRICIONISTA (ADM)|OFICINISTA|OFICINISTA I|OFICINISTA II|OFICINISTA III|OPERADOR DE EQUIPO DE IMPRENTA|OPERADOR DE EQUIPO MÉDICO|OPERADOR DE EQUIPO MÉDICO I|OPERADOR DE RADIO|OPERADOR PAD|OPERADOR PAD I|OPERADOR PAD II|OPERADOR PAD III|OTRO (Especificar)|PERIODISTA|PERIODISTA I|PERIODISTA II|PERIODISTA III|PLANIFICADOR|PLANIFICADOR I|PLANIFICADOR II|PLANIFICADOR III|PLANIFICADOR IV|PR.PRACI TV|PROGRAMADOR DE SISTEMAS PAD|PROGRAMADOR DE SISTEMAS PAD I|PROGRAMADOR DE SISTEMAS PAD II|PROGRAMADOR DE SISTEMAS PAD III|PROMOTOR DE TUTORÍA Y ORIENTACIÓN EDUCATIVA|PROMOTORA EDUCATIVA COMUNAL|PSICÓLOGO (ADM)|RELACIONISTA PÚBLICO|RELACIONISTA PÚBLICO I|RELACIONISTA PÚBLICO II|SECRETARIA|SECRETARIA I|SECRETARIA II|SECRETARIA III|SECRETARIA IV|SECRETARIO GENERAL|SOPORTE TÉCNICO|SUB-DIRECTOR ADMINISTRATIVO|SUB-DIRECTOR DE ÁREA ADMINISTRATIVA|SUPERVISOR DE CONSERVACIÓN Y SERVICIOS|SUPERVISOR DE CONSERVACIÓN Y SERVICIOS I|SUPERVISOR DE CONSERVACIÓN Y SERVICIOS II|TALLER DE MANT. PAD|TÉCNICO|TÉCNICO ADMINISTRATIVO|TÉCNICO ADMINISTRATIVO I|TÉCNICO ADMINISTRATIVO II|TÉCNICO ADMINISTRATIVO III|TÉCNICO AGROPECUARIO|TÉCNICO DE CAMPO|TÉCNICO EN ABASTECIMIENTO|TÉCNICO EN ABASTECIMIENTO II|TÉCNICO EN ARCHIVO I|TÉCNICO EN ARCHIVO II|TÉCNICO EN ARCHIVO V|TÉCNICO EN ARTES GRÁFICAS|TÉCNICO EN ARTES GRÁFICAS I (MODELO VIVO)|TÉCNICO EN BIBLIOTECA|TÉCNICO EN BIBLIOTECA I|TÉCNICO EN BIBLIOTECA II|TÉCNICO EN BIBLIOTECA III|TÉCNICO EN CAPACITACIÓN Y DIFUSIÓN|TÉCNICO EN CARPINTERÍA|TÉCNICO EN CONTABILIDAD|TÉCNICO EN CONTABILIDAD I|TÉCNICO EN ENFERMERÍA|TÉCNICO EN FINANZAS|TÉCNICO EN FINANZAS I|TÉCNICO EN FINANZAS II|TÉCNICO EN IMPRESIONES|TÉCNICO EN IMPRESIONES I|TÉCNICO EN INGENIERÍA I|TÉCNICO EN INGENIERÍA II|TÉCNICO EN LABORATORIO|TÉCNICO EN LABORATORIO I|TÉCNICO EN LABORATORIO II|TÉCNICO EN LABORATORIO III|TÉCNICO EN NUTRICIÓN|TÉCNICO EN PERSONAL|TÉCNICO EN PERSONAL I|TÉCNICO EN PERSONAL II|TÉCNICO EN SEGURIDAD|TÉCNICO EN SEGURIDAD I|TÉCNICO EN SEGURIDAD II|TERAPISTA|TESORERO|TESORERO I|TESORERO II|TESORERO III|TOPÓGRAFO|TRABAJADOR DE SERVICIO|TRABAJADOR DE SERVICIO I|TRABAJADOR DE SERVICIO II|TRABAJADOR DE SERVICIO III`.split('|');
        displacementLocationPanels.forEach(panel => {
          const cargoSelect = [...panel.querySelectorAll('label')].find(item => item.querySelector('span')?.textContent.trim().startsWith('Cargo'))?.querySelector('select');
          if (cargoSelect) cargoSelect.innerHTML = '<option value="">Cargo *</option>' + administrativeCargoOptions.map(item => `<option>${item}</option>`).join('');
          const workdaySelect = [...panel.querySelectorAll('label')].find(item => item.querySelector('span')?.textContent.trim().startsWith('Jornada Laboral'))?.querySelector('select');
          if (workdaySelect) workdaySelect.innerHTML = '<option value="">Jornada Laboral *</option><option>40 HORAS</option><option>OTRA (Especificar)</option>';
        });
        const originCodeLabel = displacementDetail.querySelector('fieldset:first-of-type .ingress-form-grid label:first-child');
        const originCodeInput = originCodeLabel?.querySelector('input');
        if (originCodeLabel && originCodeInput) {
          const originCodeRow = document.createElement('span');
          originCodeRow.style.cssText = 'display:grid;grid-template-columns:minmax(0,1fr) 38px;gap:6px';
          originCodeInput.before(originCodeRow);
          originCodeRow.appendChild(originCodeInput);
          const originSearchButton = document.createElement('button');
          originSearchButton.type = 'button';
          originSearchButton.title = 'Buscar código modular IE';
          originSearchButton.setAttribute('aria-label', 'Buscar código modular IE');
          originSearchButton.textContent = '⌕';
          originSearchButton.style.cssText = 'border:0;border-bottom:1px dotted #777;background:#f0f0f0;color:#33414e;font-size:18px;cursor:pointer';
          originCodeRow.appendChild(originSearchButton);
          originSearchButton.addEventListener('click', () => {
            const centerModal = document.createElement('div');
            centerModal.className = 'ingress-modifier-overlay center-search-overlay';
            centerModal.innerHTML = '<section class="center-search-modal" role="dialog" aria-modal="true"><header><strong>Centros de trabajo</strong><button class="close-center-search" type="button" aria-label="Cerrar">×</button></header><div class="center-search-body"><nav><button class="active" type="button">Búsqueda de centros de trabajo vigente</button><button type="button">Búsqueda de centros de trabajo no vigente</button></nav><fieldset><legend>Filtros de búsqueda</legend><div class="center-search-filters"><select><option>DRE</option></select><select><option>UGEL</option></select><select><option>Modalidad educativa</option></select><select><option>Nivel educativo</option></select><input class="center-code-filter" placeholder="Código modular I.E."><input class="center-name-filter" placeholder="Institución educativa"></div><div class="center-search-buttons"><button class="clear-center-search" type="button">⌫ LIMPIAR</button><button class="run-center-search" type="button">⌕ BUSCAR</button></div></fieldset><fieldset><legend>Resultados de la búsqueda</legend><div class="center-results"><div class="center-results-head"><span>CÓDIGO MODULAR</span><span>CENTRO LABORAL</span><span>IGED</span><span>NIVEL EDUCATIVO</span><span>MODALIDAD</span></div><div class="center-results-body"><p>No se encontraron registros.</p></div><footer><span>Mostrar: <select><option>10 Filas</option></select></span><strong>Total: <b>0</b> registros</strong><span>&lt;&lt;&nbsp;&nbsp; &lt;&nbsp;&nbsp; 1&nbsp;&nbsp; &gt;&nbsp;&nbsp; &gt;&gt;</span><strong>Total: <b>0</b> páginas</strong></footer></div></fieldset></div></section>';
            document.body.appendChild(centerModal);
            const centerFilterSelects = centerModal.querySelectorAll('.center-search-filters select');
            const dreOptions = ['AMAZONAS','ANCASH','APURÍMAC','AREQUIPA','AYACUCHO','CAJAMARCA','CALLAO','CUSCO','HUANCAVELICA','HUÁNUCO','ICA','JUNÍN','LA LIBERTAD','LAMBAYEQUE','LIMA METROPOLITANA','LIMA PROVINCIAS','LORETO','MADRE DE DIOS','MOQUEGUA','PASCO','PIURA','PUNO','SAN MARTÍN','TACNA','TUMBES','UCAYALI'].map(region => `DIRECCIÓN REGIONAL DE EDUCACIÓN ${region}`).concat('MINISTERIO DE DEFENSA');
            const ugelOptions = {
              'DIRECCIÓN REGIONAL DE EDUCACIÓN AMAZONAS':'DIRECCIÓN REGIONAL DE EDUCACIÓN AMAZONAS|UGEL INTERCULTURAL BILINGÜE CENEPA|UGEL INTERCULTURAL BILINGÜE RÍO SANTIAGO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL BAGUA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL BONGARÁ|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHACHAPOYAS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CONDORCANQUI|UNIDAD DE GESTIÓN EDUCATIVA LOCAL IBIRI-IMAZA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL LUYA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL RODRÍGUEZ DE MENDOZA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL UTCUBAMBA',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN ANCASH':'DIRECCIÓN REGIONAL DE EDUCACIÓN ANCASH|UNIDAD DE GESTIÓN EDUCATIVA LOCAL AIJA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL ANTONIO RAYMONDI|UNIDAD DE GESTIÓN EDUCATIVA LOCAL ASUNCIÓN|UNIDAD DE GESTIÓN EDUCATIVA LOCAL BOLOGNESI|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CARHUAZ|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CARLOS FERMIN FITZCARRALD|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CASMA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CORONGO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUARAZ|UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUARI|UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUARMEY|UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUAYLAS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL MARISCAL LUZURIAGA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL OCROS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PALLASCA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL POMABAMBA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL RECUAY|UNIDAD DE GESTIÓN EDUCATIVA LOCAL SANTA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL SIHUAS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL YUNGAY',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN APURÍMAC':'DIRECCIÓN REGIONAL DE EDUCACIÓN APURÍMAC|UNIDAD DE GESTIÓN EDUCATIVA LOCAL ABANCAY|UNIDAD DE GESTIÓN EDUCATIVA LOCAL ANDAHUAYLAS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL ANTABAMBA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL AYMARAES|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHINCHEROS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL COTABAMBAS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL GRAU|UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCARAMA',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN AREQUIPA':'COLEGIO MILITAR FRANCISCO BOLOGNESI|DIRECCIÓN REGIONAL DE EDUCACIÓN AREQUIPA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL AREQUIPA NORTE|UNIDAD DE GESTIÓN EDUCATIVA LOCAL AREQUIPA SUR|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CAMANÁ|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CARAVELÍ|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CASTILLA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CAYLLOMA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CONDESUYOS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL ISLAY|UNIDAD DE GESTIÓN EDUCATIVA LOCAL LA JOYA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL LA UNIÓN',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN AYACUCHO':'DIRECCIÓN REGIONAL DE EDUCACIÓN AYACUCHO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CANGALLO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUAMANGA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCASANCOS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANTA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL LA MAR|UNIDAD DE GESTIÓN EDUCATIVA LOCAL LUCANAS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PARINACOCHAS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PÁUCAR DEL SARASARA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL SUCRE|UNIDAD DE GESTIÓN EDUCATIVA LOCAL VÍCTOR FAJARDO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL VILCASHUAMÁN',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN CAJAMARCA':'DIRECCIÓN REGIONAL DE EDUCACIÓN CAJAMARCA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CAJABAMBA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CAJAMARCA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CELENDÍN|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHOTA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CONTUMAZÁ|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CUTERVO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUALGAYOC|UNIDAD DE GESTIÓN EDUCATIVA LOCAL JAÉN|UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN IGNACIO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN MARCOS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN MIGUEL|UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN PABLO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL SANTA CRUZ',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN CALLAO':'DIRECCIÓN REGIONAL DE EDUCACIÓN CALLAO|MILITAR LEONCIO PRADO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL VENTANILLA',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN CUSCO':'DIRECCIÓN REGIONAL DE EDUCACIÓN CUSCO|ESCUELA DE BELLAS ARTES DIEGO QUISPE TITO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL ACOMAYO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL ANTA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CALCA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CANAS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CANCHIS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHUMBIVILCAS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CUSCO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL ESPINAR|UNIDAD DE GESTIÓN EDUCATIVA LOCAL LA CONVENCIÓN|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PARURO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PAUCARTAMBO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PICHARI-KIMBIRI|UNIDAD DE GESTIÓN EDUCATIVA LOCAL QUISPICANCHI|UNIDAD DE GESTIÓN EDUCATIVA LOCAL URUBAMBA',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN HUANCAVELICA':'DIRECCIÓN REGIONAL DE EDUCACIÓN HUANCAVELICA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL ACOBAMBA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL ANGARAES|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CASTROVIRREYNA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHURCAMPA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCAVELICA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUAYTARÁ|UNIDAD DE GESTIÓN EDUCATIVA LOCAL SURCUBAMBA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL TAYACAJA',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN HUÁNUCO':'DIRECCIÓN REGIONAL DE EDUCACIÓN HUÁNUCO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL AMBO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL DOS DE MAYO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUACAYBAMBA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUAMALÍES|UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUÁNUCO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL LAURICOCHA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL LEONCIO PRADO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL MARAÑÓN|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PACHITEA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PUERTO INCA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL YAROWILCA',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN ICA':'UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHINCHA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL ICA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL NAZCA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PALPA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PISCO',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN JUNÍN':'DIRECCIÓN REGIONAL DE EDUCACIÓN JUNÍN|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHANCHAMAYO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHUPACA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CONCEPCIÓN|UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCAYO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL JAUJA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL JUNÍN|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PANGOA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PICHANAQUI|UNIDAD DE GESTIÓN EDUCATIVA LOCAL RÍO ENE - MANTARO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL RÍO TAMBO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL SATIPO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL TARMA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL YAULI',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN LA LIBERTAD':'COLEGIO MILITAR RAMON CASTILLA|DIRECCIÓN REGIONAL DE EDUCACIÓN LA LIBERTAD|UNIDAD DE GESTIÓN EDUCATIVA LOCAL 01 EL PORVENIR|UNIDAD DE GESTIÓN EDUCATIVA LOCAL 02 LA ESPERANZA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL 03 TRUJILLO NOR OESTE|UNIDAD DE GESTIÓN EDUCATIVA LOCAL 04 TRUJILLO SUR ESTE|UNIDAD DE GESTIÓN EDUCATIVA LOCAL ASCOPE|UNIDAD DE GESTIÓN EDUCATIVA LOCAL BOLÍVAR|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHEPÉN|UNIDAD DE GESTIÓN EDUCATIVA LOCAL GRAN CHIMÚ|UNIDAD DE GESTIÓN EDUCATIVA LOCAL JULCÁN|UNIDAD DE GESTIÓN EDUCATIVA LOCAL OTUZCO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PACASMAYO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PATAZ|UNIDAD DE GESTIÓN EDUCATIVA LOCAL SÁNCHEZ CARRIÓN|UNIDAD DE GESTIÓN EDUCATIVA LOCAL SANTIAGO DE CHUCO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL TRUJILLO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL VIRÚ',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN LAMBAYEQUE':'COLEGIO MILITAR ELIAS AGUIRRE|DIRECCIÓN REGIONAL DE EDUCACIÓN LAMBAYEQUE|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHICLAYO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL FERREÑAFE|UNIDAD DE GESTIÓN EDUCATIVA LOCAL LAMBAYEQUE',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN LIMA METROPOLITANA':'DIRECCIÓN REGIONAL DE EDUCACIÓN LIMA METROPOLITANA|INSTITUTO PEDAGÓGICO NACIONAL DE MONTERRICO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL 01 SAN JUAN DE MIRAFLORES|UNIDAD DE GESTIÓN EDUCATIVA LOCAL 02 RÍMAC|UNIDAD DE GESTIÓN EDUCATIVA LOCAL 03 BREÑA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL 04 COMAS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL 05 SAN JUAN DE LURIGANCHO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL 06 ATE|UNIDAD DE GESTIÓN EDUCATIVA LOCAL 07 SAN BORJA',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN LIMA PROVINCIAS':'DIRECCIÓN REGIONAL DE EDUCACIÓN LIMA PROVINCIAS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL 08 CAÑETE|UNIDAD DE GESTIÓN EDUCATIVA LOCAL 09 HUAURA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL 10 HUARAL|UNIDAD DE GESTIÓN EDUCATIVA LOCAL 11 CAJATAMBO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL 12 CANTA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL 13 YAUYOS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL 14 OYÓN|UNIDAD DE GESTIÓN EDUCATIVA LOCAL 15 HUAROCHIRÍ|UNIDAD DE GESTIÓN EDUCATIVA LOCAL 16 BARRANCA',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN LORETO':'DIRECCIÓN REGIONAL DE EDUCACIÓN LORETO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL ALTO AMAZONAS - SAN LORENZO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL ALTO AMAZONAS - YURIMAGUAS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL LORETO - NAUTA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL MAYNAS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PUTUMAYO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL RAMÓN CASTILLA - CABALLOCOCHA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL REQUENA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL UCAYALI - CONTAMANA',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN MADRE DE DIOS':'DIRECCIÓN REGIONAL DE EDUCACIÓN MADRE DE DIOS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL MANU|UNIDAD DE GESTIÓN EDUCATIVA LOCAL TAHUAMANU|UNIDAD DE GESTIÓN EDUCATIVA LOCAL TAMBOPATA',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN MOQUEGUA':'DIRECCIÓN REGIONAL DE EDUCACIÓN MOQUEGUA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL GENERAL SÁNCHEZ CERRO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL ILO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL MARISCAL NIETO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN IGNACIO DE LOYOLA-ICHUÑA',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN PASCO':'DIRECCIÓN REGIONAL DE EDUCACIÓN PASCO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL DANIEL ALCIDES CARRIÓN|UNIDAD DE GESTIÓN EDUCATIVA LOCAL OXAPAMPA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PASCO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PUERTO BERMÚDEZ',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN PIURA':'COLEGIO MILITAR PEDRO RUIZ GALLO|DIRECCIÓN REGIONAL DE EDUCACIÓN PIURA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL AYABACA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHULUCANAS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCABAMBA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUARMACA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL LA UNIÓN|UNIDAD DE GESTIÓN EDUCATIVA LOCAL MORROPÓN|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PAITA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PIURA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL SECHURA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL SULLANA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL TALARA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL TAMBOGRANDE',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN PUNO':'DIRECCIÓN REGIONAL DE EDUCACIÓN PUNO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL AZÁNGARO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CARABAYA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHUCUITO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CRUCERO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL EL COLLAO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCANÉ|UNIDAD DE GESTIÓN EDUCATIVA LOCAL LAMPA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL MELGAR|UNIDAD DE GESTIÓN EDUCATIVA LOCAL MOHO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PUNO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN ANTONIO DE PUTINA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN ROMÁN|UNIDAD DE GESTIÓN EDUCATIVA LOCAL SANDIA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL YUNGUYO',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN SAN MARTÍN':'DIRECCIÓN REGIONAL DE EDUCACIÓN SAN MARTÍN|UNIDAD DE GESTIÓN EDUCATIVA LOCAL BELLAVISTA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL EL DORADO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUALLAGA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL LAMAS|UNIDAD DE GESTIÓN EDUCATIVA LOCAL MARISCAL CÁCERES|UNIDAD DE GESTIÓN EDUCATIVA LOCAL MOYOBAMBA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PICOTA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL RIOJA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN MARTÍN|UNIDAD DE GESTIÓN EDUCATIVA LOCAL TOCACHE',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN TACNA':'DIRECCIÓN REGIONAL DE EDUCACIÓN TACNA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CANDARAVE|UNIDAD DE GESTIÓN EDUCATIVA LOCAL JORGE BASADRE|UNIDAD DE GESTIÓN EDUCATIVA LOCAL TACNA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL TARATA',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN TUMBES':'DIRECCIÓN REGIONAL DE EDUCACIÓN TUMBES|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CONTRALMIRANTE VILLAR|UNIDAD DE GESTIÓN EDUCATIVA LOCAL TUMBES|UNIDAD DE GESTIÓN EDUCATIVA LOCAL ZARUMILLA',
              'DIRECCIÓN REGIONAL DE EDUCACIÓN UCAYALI':'DIRECCIÓN REGIONAL DE EDUCACIÓN UCAYALI|UNIDAD DE GESTIÓN EDUCATIVA LOCAL ATALAYA|UNIDAD DE GESTIÓN EDUCATIVA LOCAL CORONEL PORTILLO|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PADRE ABAD|UNIDAD DE GESTIÓN EDUCATIVA LOCAL PURÚS',
              'MINISTERIO DE DEFENSA':'CENTRO DE ADMINISTRACION DE SERVICIOS EDUCATIVOS (FAP-UE005)|COPERE (EP-UE003)|DIRECCION DE BINESTAR DE LA MARINA (MGP-UE004)|MINISTERIO DE DEFENSA'
            };
            centerFilterSelects[0].innerHTML = '<option value="">DRE</option>' + dreOptions.map(item => `<option>${item}</option>`).join('');
            const renderOriginUgelOptions = () => {
              const options = (ugelOptions[centerFilterSelects[0].value] || '').split('|').filter(Boolean);
              centerFilterSelects[1].innerHTML = '<option value="">UGEL</option>' + options.map(item => `<option>${item}</option>`).join('');
            };
            centerFilterSelects[0].addEventListener('change', renderOriginUgelOptions);
            const modalityOptions = ['EDUCACIÓN BÁSICA ALTERNATIVA','EDUCACIÓN BÁSICA ESPECIAL','EDUCACIÓN BÁSICA REGULAR','EDUCACIÓN SUPERIOR','EDUCACIÓN TÉCNICA - PRODUCTIVA','NO ESPECIFICADO','SEDE ADMINISTRATIVA'];
            const educationLevelOptions = {
              'EDUCACIÓN BÁSICA ALTERNATIVA':['EBA - AVANZADO','EBA - INICIAL E INTERMEDIO','EBA - PRIMARIA DE ADULTOS','EBA - SECUNDARIA DE ADULTOS'],
              'EDUCACIÓN BÁSICA ESPECIAL':['EBE - EDUCACIÓN ESPECIAL','EBE - INICIAL','EBE - PRIMARIA'],
              'EDUCACIÓN BÁSICA REGULAR':['EBR - INICIAL - CUNA','EBR - INICIAL - CUNA - JARDÍN','EBR - INICIAL - JARDÍN','EBR - PRIMARIA','EBR - SECUNDARIA'],
              'EDUCACIÓN SUPERIOR':['EDUCACIÓN SUPERIOR ARTÍSTICA - ESCUELAS','ESCUELA SUPERIOR PEDAGÓGICA','ESCUELA SUPERIOR TECNOLÓGICA','FORMACIÓN ARTÍSTICA','SUPERIOR PEDAGÓGICA - ISP','SUPERIOR TECNOLÓGICA - IST'],
              'EDUCACIÓN TÉCNICA - PRODUCTIVA':['CETPRO','CICLO MEDIO','NIVEL BÁSICO'],
              'NO ESPECIFICADO':['NO ESPECIFICADO'],
              'SEDE ADMINISTRATIVA':['ADMINISTRACIÓN']
            };
            centerFilterSelects[2].innerHTML = '<option value="">Modalidad educativa</option>' + modalityOptions.map(item => `<option>${item}</option>`).join('');
            const renderOriginEducationLevels = () => {
              const modality = centerFilterSelects[2].value;
              const levels = educationLevelOptions[modality] || [];
              centerFilterSelects[3].innerHTML = '<option value="">Nivel educativo</option>' + levels.map(item => `<option>${item}</option>`).join('');
              if (modality === 'NO ESPECIFICADO') centerFilterSelects[3].value = 'NO ESPECIFICADO';
              if (modality === 'SEDE ADMINISTRATIVA') centerFilterSelects[3].value = 'ADMINISTRACIÓN';
            };
            centerFilterSelects[2].addEventListener('change', renderOriginEducationLevels);
            centerModal.querySelector('.center-code-filter').value = originCodeInput.value.trim();
            const closeCenterModal = () => centerModal.remove();
            centerModal.querySelector('.close-center-search').addEventListener('click', closeCenterModal);
            centerModal.addEventListener('click', event => { if (event.target === centerModal) closeCenterModal(); });
            const centerTabs = centerModal.querySelectorAll('.center-search-body > nav button');
            centerTabs.forEach(tab => tab.addEventListener('click', () => {
              centerTabs.forEach(item => item.classList.remove('active'));
              tab.classList.add('active');
            }));
            centerModal.querySelector('.run-center-search').addEventListener('click', async () => {
              const code = centerModal.querySelector('.center-code-filter').value.trim();
              const name = centerModal.querySelector('.center-name-filter').value.trim();
              const resultsBody = centerModal.querySelector('.center-results-body');
              if (!code && !name && !centerFilterSelects[0].value && !centerFilterSelects[1].value && !centerFilterSelects[2].value && !centerFilterSelects[3].value) {
                resultsBody.innerHTML = '<p>Ingrese al menos un criterio de búsqueda.</p>';
                return;
              }
              resultsBody.innerHTML = '<p>Buscando centros de trabajo…</p>';
              try {
                const response = await fetch(`api/centros-trabajo.php?codigo=${encodeURIComponent(code)}&nombre=${encodeURIComponent(name)}`, {cache:'no-store'});
                const data = await response.json();
                if (!response.ok || !data.ok) throw new Error(data.mensaje || 'No fue posible realizar la búsqueda.');
                let records = Array.isArray(data.registros) ? data.registros : [];
                const normalized = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
                const instituteFallbacks = {
                  '0421412': {codigo:'0421412', nombre:'PEDAGÓGICO HUANCAVELICA', lugar:'CERCADO', nivel:'SUPERIOR PEDAGÓGICA - ISP'},
                  '0688069': {codigo:'0688069', nombre:'PEDAGÓGICO EDUCACIÓN FÍSICA', lugar:'YAÑANACO', nivel:'SUPERIOR PEDAGÓGICA - ISP'},
                  '0688051': {codigo:'0688051', nombre:'TECNOLÓGICO HUANCAVELICA', lugar:'ASCENSIÓN', nivel:'SUPERIOR TECNOLÓGICA - IST'},
                  '1058742': {codigo:'1058742', nombre:'TECNOLÓGICO AURAHUA', lugar:'AURAHUA', nivel:'SUPERIOR TECNOLÓGICA - IST'},
                  '1060110': {codigo:'1060110', nombre:'TECNOLÓGICO MANUEL SCORZA TORRE', lugar:'ACOBAMBA', nivel:'SUPERIOR TECNOLÓGICA - IST'},
                  '1058155': {codigo:'1058155', nombre:'TECNOLÓGICO CASTROVIRREYNA', lugar:'CASTROVIRREYNA', nivel:'SUPERIOR TECNOLÓGICA - IST'},
                  '0803908': {codigo:'0803908', nombre:'TECNOLÓGICO CHURCAMPA', lugar:'CHURCAMPA', nivel:'SUPERIOR TECNOLÓGICA - IST'},
                  '1389956': {codigo:'1389956', nombre:'TECNOLÓGICO COLCABAMBA', lugar:'COLCABAMBA', nivel:'SUPERIOR TECNOLÓGICA - IST'},
                  '1350404': {codigo:'1350404', nombre:'TECNOLÓGICO SAN PEDRO', lugar:'CORIS', nivel:'SUPERIOR TECNOLÓGICA - IST'},
                  '1059245': {codigo:'1059245', nombre:'TECNOLÓGICO SAN JUAN BAUTISTA', lugar:'HUAYTARÁ', nivel:'SUPERIOR TECNOLÓGICA - IST'},
                  '1403575': {codigo:'1403575', nombre:'TECNOLÓGICO VIRGEN DE COCHARCAS', lugar:'JULCAMARCA', nivel:'SUPERIOR TECNOLÓGICA - IST'},
                  '1403559': {codigo:'1403559', nombre:'TECNOLÓGICO LIRCAY', lugar:'LIRCAY', nivel:'SUPERIOR TECNOLÓGICA - IST'},
                  '1348697': {codigo:'1348697', nombre:'TECNOLÓGICO NUEVO OCCORO', lugar:'NUEVO OCCORO', nivel:'SUPERIOR TECNOLÓGICA - IST'},
                  '0743336': {codigo:'0743336', nombre:'TECNOLÓGICO PAMPAS', lugar:'PAMPAS', nivel:'SUPERIOR TECNOLÓGICA - IST'},
                  '1716323': {codigo:'1716323', nombre:'TECNOLÓGICO PAUCARÁ', lugar:'PAUCARÁ', nivel:'SUPERIOR TECNOLÓGICA - IST'},
                  '1389949': {codigo:'1389949', nombre:'TECNOLÓGICO PAZOS', lugar:'PAZOS', nivel:'SUPERIOR TECNOLÓGICA - IST'},
                  '1280668': {codigo:'1280668', nombre:'TECNOLÓGICO LA CANTUTA', lugar:'SECCLLA', nivel:'SUPERIOR TECNOLÓGICA - IST'},
                  '1058650': {codigo:'1058650', nombre:'TECNOLÓGICO TICRAPO', lugar:'TICRAPO', nivel:'SUPERIOR TECNOLÓGICA - IST'},
                  '1389980': {codigo:'1389980', nombre:'TECNOLÓGICO SAN JOSÉ', lugar:'TINTAY PUNCO', nivel:'SUPERIOR TECNOLÓGICA - IST'}
                };
                const fallback = instituteFallbacks[code];
                if (!records.length && fallback && (!name || normalized(fallback.nombre).includes(normalized(name)))) {
                  records = [{...fallback, iged:'DRE HUANCAVELICA', modalidad:'SUP'}];
                }
                if (centerFilterSelects[1].value) records = records.filter(item => normalized(item.iged).includes(normalized(centerFilterSelects[1].value)));
                if (centerFilterSelects[2].value) records = records.filter(item => normalized(item.modalidad).includes(normalized(centerFilterSelects[2].value)));
                if (centerFilterSelects[3].value) records = records.filter(item => normalized(item.nivel).includes(normalized(centerFilterSelects[3].value)));
                resultsBody.innerHTML = records.length ? records.map(item => `<button type="button" data-code="${item.codigo}"><span>${item.codigo}</span><span>${item.nombre}</span><span>${item.iged}</span><span>${item.nivel || 'No registrado'}</span><span>${item.modalidad || 'No registrado'}</span></button>`).join('') : '<p>No se encontraron registros.</p>';
                const totals = centerModal.querySelectorAll('.center-results footer b');
                if (totals[0]) totals[0].textContent = String(records.length);
                if (totals[1]) totals[1].textContent = records.length ? '1' : '0';
              } catch (error) {
                resultsBody.innerHTML = `<p>${error.message}</p>`;
              }
            });
            centerModal.querySelector('.clear-center-search').addEventListener('click', () => {
              centerModal.querySelectorAll('.center-search-filters input').forEach(input => { input.value = ''; });
              centerModal.querySelectorAll('.center-search-filters select').forEach(select => { select.selectedIndex = 0; });
              centerModal.querySelector('.center-results-body').innerHTML = '<p>No se encontraron registros.</p>';
              centerModal.querySelectorAll('.center-results footer b').forEach(total => { total.textContent = '0'; });
            });
          });
          const destinationCodeLabel = destinationPanelForDisplay?.querySelector('.ingress-form-grid label:first-child');
          const destinationCodeInput = destinationCodeLabel?.querySelector('input');
          if (destinationCodeLabel && destinationCodeInput && !destinationCodeLabel.querySelector('.destination-center-search')) {
            const destinationCodeRow = document.createElement('span');
            destinationCodeRow.style.cssText = 'display:grid;grid-template-columns:minmax(0,1fr) 38px;gap:6px';
            destinationCodeInput.before(destinationCodeRow);
            destinationCodeRow.appendChild(destinationCodeInput);
            const destinationSearchButton = document.createElement('button');
            destinationSearchButton.type = 'button';
            destinationSearchButton.className = 'destination-center-search';
            destinationSearchButton.textContent = '⌕';
            destinationSearchButton.title = 'Buscar código modular IE de destino';
            destinationSearchButton.style.cssText = 'border:0;border-bottom:1px dotted #777;background:#f0f0f0;color:#33414e;font-size:18px;cursor:pointer';
            destinationCodeRow.appendChild(destinationSearchButton);
            destinationSearchButton.addEventListener('click', () => {
              originSearchButton.click();
              const openedModal = [...document.querySelectorAll('.center-search-overlay')].at(-1);
              if (!openedModal) return;
              openedModal.dataset.displacementTarget = 'destination';
              const codeFilter = openedModal.querySelector('.center-code-filter');
              if (codeFilter) codeFilter.value = destinationCodeInput.value.trim();
            });
          }
        }
        const markPanelFieldsForSave=(panel,side)=>{
          panel?.querySelectorAll('label').forEach(label=>{
            const caption=label.querySelector(':scope > span')?.textContent?.replace(/\s*\*\s*$/,'').trim();
            const saveCaption=caption?.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
            const control=label.querySelector('input:not([type="checkbox"]),select,textarea');
            if(saveCaption&&control)control.dataset.saveLabel=`${saveCaption} - ${side}`;
            const category=label.querySelector('[data-remunerative-category]');
            if(saveCaption&&category)category.dataset.staticSaveLabel=`${saveCaption} - ${side}`;
          });
          panel?.querySelectorAll('.ingress-form-grid > div').forEach(field=>{
            const caption=field.querySelector(':scope > strong')?.textContent.trim();
            const saveCaption=caption?.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
            const value=[...field.children].find(child=>child.tagName==='SPAN'&&!child.querySelector('input,select,textarea'));
            if(saveCaption&&value)value.dataset.staticSaveLabel=`${saveCaption} - ${side}`;
          });
        };
        markPanelFieldsForSave(originPanelForDisplay,'Origen');
        markPanelFieldsForSave(destinationPanelForDisplay,'Destino');
        displacementDetail.hidden = false;
        displacementMessage.hidden = true;
      };
      const renderDesignationDetail = () => {
        renderPromotionDetail();
        const destinationSituation = displacementDetail.querySelector('[data-destination-situation]');
        if (destinationSituation) destinationSituation.textContent = 'DESIGNADO';
      };
      const renderSecondmentDetail = () => {
        renderPromotionDetail();
        const destinationSituation = displacementDetail.querySelector('[data-destination-situation]');
        if (destinationSituation) destinationSituation.textContent = 'DESTACADO';
        const dateInputs = displacementDetail.querySelectorAll(':scope > .ingress-form-grid input[type="date"]');
        const endDate = dateInputs[1];
        if (endDate) {
          const editableEndDate = endDate.cloneNode(true);
          editableEndDate.readOnly = false;
          editableEndDate.required = false;
          editableEndDate.value = '';
          endDate.replaceWith(editableEndDate);
          const label = editableEndDate.closest('label')?.querySelector('span');
          if (label) label.textContent = 'Fecha fin';
        }
      };
      const renderActingDetail = () => {
        renderPromotionDetail();
        const destinationSituation = displacementDetail.querySelector('[data-destination-situation]');
        if (destinationSituation) destinationSituation.textContent = 'ENCARGADO';
        const dateInputs = displacementDetail.querySelectorAll(':scope > .ingress-form-grid input[type="date"]');
        const endDate = dateInputs[1];
        if (endDate) {
          const editableEndDate = endDate.cloneNode(true);
          editableEndDate.readOnly = false;
          editableEndDate.required = false;
          editableEndDate.value = '';
          endDate.replaceWith(editableEndDate);
          const label = editableEndDate.closest('label')?.querySelector('span');
          if (label) label.textContent = 'Fecha fin';
        }
      };
      const renderExchangeDetail = () => {
        renderPromotionDetail();
        const destinationSituation = displacementDetail.querySelector('[data-destination-situation]');
        if (destinationSituation) destinationSituation.textContent = 'EN ACTIVIDAD';
        const dateInputs = displacementDetail.querySelectorAll(':scope > .ingress-form-grid input[type="date"]');
        dateInputs[1]?.closest('label')?.remove();
      };
      const renderReassignmentDetail = () => {
        renderExchangeDetail();
      };
      const configureDisplacementActions = () => {
        if (displacementRegime.value === administrativeRegime) {
          setSelectOptions(displacementAction, 'Seleccione acción', ['ASCENSO DE CARGO','DESIGNACIÓN','DESTAQUE','ENCARGATURA','PERMUTA','REASIGNACIÓN','REUBICACIÓN','ROTACIÓN']);
        }
      };
      setSelectOptions(displacementRegime, 'Seleccione régimen laboral', [administrativeRegime, 'LEY 29944 - LEY DE REFORMA MAGISTERIAL']);
      if (String(server.regimen || '').includes('276')) displacementRegime.value = administrativeRegime;
      configureDisplacementActions();
      displacementRegime.addEventListener('change', () => {
        configureDisplacementActions();
        setSelectOptions(displacementReason, 'Seleccione motivo acción', []);
        displacementDetail.hidden = true;
        displacementDetail.style.cssText = '';
        displacementMessage.hidden = false;
      });
      const syncDisplacementReason = () => {
        const selectedAction = displacementAction.value;
        if (displacementRegime.value === administrativeRegime && (selectedAction === promotionAction || selectedAction === designationAction)) {
          setSelectOptions(displacementReason, 'Seleccione motivo acción', [selectedAction]);
          displacementReason.value = selectedAction;
          if (selectedAction === designationAction) renderDesignationDetail();
          else renderPromotionDetail();
        } else if (displacementRegime.value === administrativeRegime && selectedAction === exchangeAction) {
          setSelectOptions(displacementReason, 'Seleccione motivo acción', [exchangeReason]);
          displacementReason.value = exchangeReason;
          renderExchangeDetail();
        } else if (displacementRegime.value === administrativeRegime && selectedAction === secondmentAction) {
          setSelectOptions(displacementReason, 'Seleccione motivo acción', secondmentReasons);
          displacementDetail.hidden = true;
          displacementDetail.style.cssText = '';
          displacementMessage.hidden = false;
        } else if (displacementRegime.value === administrativeRegime && selectedAction === actingAction) {
          setSelectOptions(displacementReason, 'Seleccione motivo acción', actingReasons);
          displacementDetail.hidden = true;
          displacementDetail.style.cssText = '';
          displacementMessage.hidden = false;
        } else if (displacementRegime.value === administrativeRegime && selectedAction === reassignmentAction) {
          setSelectOptions(displacementReason, 'Seleccione motivo acción', reassignmentReasons);
          displacementDetail.hidden = true;
          displacementDetail.style.cssText = '';
          displacementMessage.hidden = false;
        } else {
          setSelectOptions(displacementReason, 'Seleccione motivo acción', []);
          displacementDetail.hidden = true;
          displacementDetail.style.cssText = '';
          displacementMessage.hidden = false;
        }
      };
      displacementAction.addEventListener('change', syncDisplacementReason);
      displacementAction.addEventListener('input', syncDisplacementReason);
      requestAnimationFrame(() => requestAnimationFrame(syncDisplacementReason));
      setTimeout(syncDisplacementReason, 150);
      document.querySelectorAll('.trajectory-tabs a')[0].addEventListener('click', showAdminTrajectory);
      document.querySelectorAll('.trajectory-tabs a')[2].addEventListener('click', showAdminAscent);
      document.getElementById('return-displacement').addEventListener('click', showAdminTrajectory);
      displacementReason.addEventListener('change', event => {
        if (displacementRegime.value === administrativeRegime && (event.target.value === promotionAction || event.target.value === designationAction)) {
          if (event.target.value === designationAction) renderDesignationDetail();
          else renderPromotionDetail();
          return;
        }
        if (displacementRegime.value === administrativeRegime && displacementAction.value === secondmentAction && secondmentReasons.includes(event.target.value)) {
          renderSecondmentDetail();
          return;
        }
        if (displacementRegime.value === administrativeRegime && displacementAction.value === actingAction && actingReasons.includes(event.target.value)) {
          renderActingDetail();
          return;
        }
        if (displacementRegime.value === administrativeRegime && displacementAction.value === exchangeAction && event.target.value === exchangeReason) {
          renderExchangeDetail();
          return;
        }
        if (displacementRegime.value === administrativeRegime && displacementAction.value === reassignmentAction && reassignmentReasons.includes(event.target.value)) {
          renderReassignmentDetail();
          return;
        }
        document.getElementById('displacement-detail-fields').hidden = !event.target.value;
        document.getElementById('displacement-detail-message').hidden = Boolean(event.target.value);
      });
      const openDisplacementModification = row => {
          const resolutionNumber = row[8];
          const modification = modal('Modificatoria de la acción', `<div class="action-modification"><label class="modification-action-type"><span>Tipo de acción <b>*</b></span><select id="modification-action"><option value="">Seleccione tipo de acción</option><option>DAR POR CONCLUIDO</option><option>DECLARAR NULO</option><option>DEJAR SIN EFECTO</option><option>LIMITAR</option><option>MODIFICAR / RECTIFICAR</option></select></label><fieldset><legend>Datos de la resolución a modificar</legend><div class="modification-current-data"><div><strong>Tipo de resolución</strong><span>RESOLUCIÓN DIRECTORAL REGIONAL</span></div><div><strong>Número de resolución</strong><span>${resolutionNumber}</span></div><div><strong>Fecha de resolución</strong><span>${row[2]}</span></div><div><strong>Régimen</strong><span>${server.regimen}</span></div><div><strong>Acción</strong><span>${row[0]}</span></div><div><strong>Motivo acción</strong><span>${row[1]}</span></div></div></fieldset><fieldset><legend>Datos principales de la resolución de modificatoria</legend><div class="modification-form-grid"><label><span>Tipo de resolución <b>*</b></span><select>${trajectoryResolutionOptions}</select></label><label><span>Número resolución (######-año-IGED) <b>*</b></span><input placeholder="Número de resolución"></label><label><span>Fecha resolución <b>*</b></span><input type="date"></label><label><span>Documento <b>*</b></span><input type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div></fieldset><fieldset><legend>Detalle de la resolución de modificatoria</legend><p id="modification-detail-message">Seleccione un tipo de acción para continuar con el formulario de registro</p><div id="modification-detail-fields" hidden><label class="modification-notes"><span>Anotaciones</span><span class="modification-count">250</span><textarea id="modification-notes" maxlength="250" placeholder="Anotaciones"></textarea></label></div></fieldset></div>`, [{label:'Cancelar'}, {label:'Guardar', primary:true, run:close => close()}]);
          modification.querySelector('.app-modal').classList.add('action-modification-modal');
          const currentModificationValues=modification.querySelectorAll('.modification-current-data span');
          if(currentModificationValues[0]) currentModificationValues[0].textContent=row._resolutionType||'No registrado';
          if(currentModificationValues[1]) currentModificationValues[1].textContent=row[8];
          if(currentModificationValues[2]) currentModificationValues[2].textContent=row[9];
          const displacementFieldOptions=['APELLIDO MATERNO DEL SERVIDOR','APELLIDO PATERNO DEL SERVIDOR','CARGO - DESTINO','CARGO - ORIGEN','CENTRO LABORAL - ORIGEN','CÓDIGO DE PLAZA - DESTINO','CÓDIGO DE PLAZA - ORIGEN','CÓDIGO MODULAR IE - DESTINO','CÓDIGO MODULAR IE - ORIGEN','ESCALA / CATEGORÍA / NIVEL / GRUPO - DESTINO','ESCALA / CATEGORÍA / NIVEL / GRUPO - ORIGEN','FECHA DE FIN','FECHA DE INICIO','JORNADA - DESTINO','JORNADA - ORIGEN','MODALIDAD EDUCATIVA - ORIGEN','NIVEL EDUCATIVO - ORIGEN','NOMBRES DEL SERVIDOR'];
          const displacementCargoOptions=['COORDINADOR','COORDINADOR ACADÉMICO','COORDINADOR ÁREA TÉCNICA','COORDINADOR DE ACTIVIDADES EXT. EDUCATIVA','COORDINADOR DE ÁREA ACADÉMICA','COORDINADOR DE ÁREA DE CALIDAD','COORDINADOR DE ÁREA DE PRÁCTICA PRE PROFESIONAL E INVESTIGACIÓN','COORDINADOR DE FORMACIÓN GENERAL','COORDINADOR DE O.B.E.','COORDINADOR DE PROGRAMA ACADÉMICO','COORDINADOR DE PROGRAMA ACADÉMICO DE SECUNDARIA','COORDINADOR PEDAGÓGICO','COORDINADOR PROGR. ACADÉMICO FORM. EN SERVICIO','DIRE. INS. TEC. SUPERIOR','DIRECTOR ACADÉMICO','DIRECTOR DE INSTITUTO SUPERIOR','DIRECTOR GENERAL','DIRECTOR I.E.','DOCENTE ALTAMENTE ESPECIALIZADO','DOCENTE ESTABLE','DOCENTE ESTABLE I','DOCENTE ESTABLE II','DOCENTE EXTRAORDINARIO','DOCENTE SUPERIOR','ESPECIALISTA EN EDUCACIÓN','JEFE DE ACTIVIDADES PRODUCTIVA Y EMPRESARIALES','JEFE DE ÁREA ACADÉMICA','JEFE DE ÁREA ACADÉMICA DE PRODUCCIÓN','JEFE DE ÁREA ACADÉMICA DE EDUCACIÓN PRIMARIA','JEFE DE ÁREA ACADÉMICA DE FORMACIÓN EN SERVICIOS','JEFE DE ÁREA ACADÉMICA DE ADMINISTRACIÓN Y CONTABILIDAD','JEFE DE ÁREA ACADÉMICA DE CONTABILIDAD','JEFE DE ÁREA ACADÉMICA DE EDUCACIÓN INICIAL','JEFE DE ÁREA ACADÉMICA DE EDUCACIÓN SECUNDARIA','JEFE DE ÁREA ACADÉMICA DE ELECTRÓNICA Y ELÉCTRICA INDUSTRIAL','JEFE DE ÁREA ACADÉMICA DE ENFERMERÍA TÉCNICA','JEFE DE ÁREA ACADÉMICA DE INDUSTRIA ALIMENTARIA','JEFE DE ÁREA ACADÉMICA DE MATEMÁTICA','JEFE DE ÁREA ACADÉMICA DE MECÁNICA DE PRODUCCIÓN','JEFE DE ÁREA ACADÉMICA DE METALURGIA - QUÍMICA INDUSTRIAL','JEFE DE ÁREA ADMINISTRATIVA','JEFE DE ÁREA DE FORMACIÓN CONTINUA','JEFE DE ÁREA DE SERV. ESTUDIANTILES Y PROY. SOCIAL','JEFE DE ÁREA TÉCNICA','JEFE DE ARTE Y CULTURA','JEFE DE DEPARTAMENTO','JEFE DE DPTO. ACADÉMICO','JEFE DE DPTO. ADMINISTRATIVO','JEFE DE DPTO. COMPUTACIÓN E INFORMÁTICA','JEFE DE DPTO. DE CIENCIA Y TECNOLOGÍA','JEFE DE DPTO. DE EDUCACIÓN INICIAL','JEFE DE DPTO. DE FORM. GENERAL Y PROFESIONAL','JEFE DE DPTO. DE FORM. PROFESIONAL - PRIMARIA','JEFE DE DPTO. DE FORM. PROFESIONAL - SECUNDARIA','JEFE DE DPTO. DE FORMACIÓN PROFESIONAL','JEFE DE DPTO. DE HUMANIDADES','JEFE DE DPTO. EDUCACIÓN','JEFE DE DPTO. FORM. EN SERVICIO','JEFE DE DPTO. FORMACIÓN GENERAL','JEFE DE DPTO. PROD. E INVESTIGACIÓN','JEFE DE LA UNIDAD ACADÉMICA','JEFE DE LA UNIDAD ADMINISTRATIVA','JEFE DE LA UNIDAD DE ADMINISTRACIÓN','JEFE DE PRODUCCIÓN','JEFE DE TALLER','JEFE DE TALLER DE COMPUTACIÓN E INFORMÁTICA','JEFE DE TALLER DE CONTABILIDAD','JEFE DE TALLER DE EBANISTERÍA','JEFE DE TALLER DE ELECTRICIDAD','JEFE DE TALLER DE ELECTRÓNICA','JEFE DE TALLER DE FUNDICIÓN','JEFE DE TALLER DE INDUSTRIA ALIMENTARIA','JEFE DE TALLER DE INDUSTRIA DEL VESTIDO','JEFE DE TALLER DE MECAN. AUTOMOTRIZ','JEFE DE TALLER DE MECÁNICA','JEFE DE TALLER DE MECÁNICA DE PRODUCCIÓN','JEFE DE TALLER DE SOLDADURA','JEFE DE TALLER DE TURISMO','JEFE DE TALLER MECANOGRAFÍA / CONTABILIDAD','JEFE DE UNIDAD ACADÉMICA','JEFE DE UNIDAD DE BIENESTAR Y EMPLEABILIDAD','JEFE DE UNIDAD DE FORMACIÓN CONTINUA','JEFE DE UNIDAD DE INVESTIGACIÓN','JEFE DEL ÁREA ACADÉMICA','JEFE DEL ÁREA ACADÉMICA DE COMPUTACIÓN E INFORMÁTICA','JEFE DEL ÁREA ACADÉMICA DE EDUCACIÓN FÍSICA','JEFE DEL ÁREA ACADÉMICA DE INGLES','JEFE DEL ÁREA ACADÉMICA DE PRODUCCIÓN AGROPECUARIA','JEFE DEL ÁREA DE FORMACIÓN EN SERVICIO','JEFE DEL ÁREA DE PRODUCCIÓN','PROF. INST. TECN. SUP.','PROFESOR','PROFESOR (FUNCIONES DE DIRECTOR)','PROFESOR (TÉCNICO DEPORTIVO - WIÑAQ)','SECRETARIO ACADÉMICO','SECRETARIO DOCENTE','SUB DIRECTOR (COORDINACIÓN)','SUB-DIRECTOR ACADÉMICO','SUB-DIRECTOR DE ÁREAS TÉCNICAS','SUB-DIRECTOR DE FORMACIÓN GENERAL','SUB-DIRECTOR I.E.','SUPERVISOR DE EDUCACIÓN RELIGIOSA'];
          const modificationAction=modification.querySelector('#modification-action');
          const renderDisplacementModification=()=>{
            const detailFields=modification.querySelector('#modification-detail-fields');
            const detailMessage=modification.querySelector('#modification-detail-message');
            const selectedAction=modificationAction.value;
            detailFields.hidden=!selectedAction;
            detailMessage.hidden=Boolean(selectedAction);
            if(selectedAction==='MODIFICAR / RECTIFICAR'){
              detailFields.innerHTML=`<div class="displacement-modification-grid"><label class="displacement-modification-field"><span>Campo a modificar</span><select><option value="">Campo a modificar</option>${displacementFieldOptions.map(option=>`<option>${option}</option>`).join('')}</select></label><div class="displacement-field-editor"></div><label class="modification-notes"><span>Anotaciones</span><span class="modification-count">250</span><textarea id="modification-notes" maxlength="250" placeholder="Anotaciones"></textarea></label></div>`;
              const fieldSelect=detailFields.querySelector('.displacement-modification-field select');
              const fieldEditor=detailFields.querySelector('.displacement-field-editor');
              fieldSelect?.addEventListener('change',async()=>{
                const selectedField=fieldSelect.value;
                if(!selectedField){fieldEditor.innerHTML='';return;}
                const currentValues={'APELLIDO MATERNO DEL SERVIDOR':server.segundoApellido,'APELLIDO PATERNO DEL SERVIDOR':server.primerApellido,'CARGO - DESTINO':row[4],'CARGO - ORIGEN':row[4],'CENTRO LABORAL - ORIGEN':row[5],'CÓDIGO MODULAR IE - DESTINO':row[10],...(row._currentValues||{})};
                const currentValue=currentValues[selectedField]||'No registrado';
                let replacement='<input class="displacement-new-value" required placeholder="Debe decir">';
                if(selectedField==='CARGO - DESTINO'||selectedField==='CARGO - ORIGEN'){
                  replacement=`<select class="displacement-new-value" required><option value="">Debe decir</option>${displacementCargoOptions.map(cargo=>`<option>${cargo}</option>`).join('')}</select>`;
                }
                if(selectedField==='CÓDIGO MODULAR IE - DESTINO'){
                  replacement='<span class="modifier-center-picker"><input class="displacement-new-value" required placeholder="Debe decir" readonly><button class="open-displacement-center-search" type="button" title="Buscar centro de trabajo" aria-label="Buscar centro de trabajo">⌕</button></span>';
                }
                fieldEditor.innerHTML=`<label><span>Dice *</span><strong>${currentValue}</strong></label><label><span>Debe decir *</span>${replacement}</label><div><button type="button" class="displacement-add-field">✚ AGREGAR</button></div>`;
                fieldEditor.querySelector('.open-displacement-center-search')?.addEventListener('click',()=>{
                  const centerModal=document.createElement('div');
                  centerModal.className='ingress-modifier-overlay center-search-overlay';
                  centerModal.innerHTML='<section class="center-search-modal" role="dialog" aria-modal="true"><header><strong>Centros de trabajo</strong><button class="close-center-search" type="button" aria-label="Cerrar">×</button></header><div class="center-search-body"><nav><button class="active" type="button">Búsqueda de centros de trabajo vigente</button><button type="button">Búsqueda de centros de trabajo no vigente</button></nav><fieldset><legend>Filtros de búsqueda</legend><div class="center-search-filters"><select><option>DRE</option></select><select><option>UGEL</option></select><select><option>Modalidad educativa</option></select><select><option>Nivel educativo</option></select><input class="center-code-filter" placeholder="Código modular I.E."><input class="center-name-filter" placeholder="Institución educativa"></div><div class="center-search-buttons"><button class="clear-center-search" type="button">⌫ LIMPIAR</button><button class="run-center-search" type="button">⌕ BUSCAR</button></div></fieldset><fieldset><legend>Resultados de la búsqueda</legend><div class="center-results"><div class="center-results-head"><span>CÓDIGO MODULAR</span><span>CENTRO LABORAL</span><span>IGED</span><span>NIVEL EDUCATIVO</span><span>MODALIDAD</span></div><div class="center-results-body"><p>No se encontraron registros.</p></div><footer><span>Mostrar: <select><option>10 Filas</option></select></span><strong>Total: <b>0</b> registros</strong><span>&lt;&lt;&nbsp;&nbsp; &lt;&nbsp;&nbsp; 1&nbsp;&nbsp; &gt;&nbsp;&nbsp; &gt;&gt;</span><strong>Total: <b>0</b> páginas</strong></footer></div></fieldset></div></section>';
                  document.body.appendChild(centerModal);
                  const centerFilterSelects=centerModal.querySelectorAll('.center-search-filters select');
                const dreCatalog=['DIRECCIÓN REGIONAL DE EDUCACIÓN AMAZONAS','DIRECCIÓN REGIONAL DE EDUCACIÓN ANCASH','DIRECCIÓN REGIONAL DE EDUCACIÓN APURÍMAC','DIRECCIÓN REGIONAL DE EDUCACIÓN AREQUIPA','DIRECCIÓN REGIONAL DE EDUCACIÓN AYACUCHO','DIRECCIÓN REGIONAL DE EDUCACIÓN CAJAMARCA','DIRECCIÓN REGIONAL DE EDUCACIÓN CALLAO','DIRECCIÓN REGIONAL DE EDUCACIÓN CUSCO','DIRECCIÓN REGIONAL DE EDUCACIÓN HUANCAVELICA','DIRECCIÓN REGIONAL DE EDUCACIÓN HUÁNUCO','DIRECCIÓN REGIONAL DE EDUCACIÓN ICA','DIRECCIÓN REGIONAL DE EDUCACIÓN JUNÍN','DIRECCIÓN REGIONAL DE EDUCACIÓN LA LIBERTAD','DIRECCIÓN REGIONAL DE EDUCACIÓN LAMBAYEQUE','DIRECCIÓN REGIONAL DE EDUCACIÓN LIMA METROPOLITANA','DIRECCIÓN REGIONAL DE EDUCACIÓN LIMA PROVINCIAS','DIRECCIÓN REGIONAL DE EDUCACIÓN LORETO','DIRECCIÓN REGIONAL DE EDUCACIÓN MADRE DE DIOS','DIRECCIÓN REGIONAL DE EDUCACIÓN MOQUEGUA','DIRECCIÓN REGIONAL DE EDUCACIÓN PASCO','DIRECCIÓN REGIONAL DE EDUCACIÓN PIURA','DIRECCIÓN REGIONAL DE EDUCACIÓN PUNO','DIRECCIÓN REGIONAL DE EDUCACIÓN SAN MARTÍN','DIRECCIÓN REGIONAL DE EDUCACIÓN TACNA','DIRECCIÓN REGIONAL DE EDUCACIÓN TUMBES','DIRECCIÓN REGIONAL DE EDUCACIÓN UCAYALI','MINISTERIO DE DEFENSA'];
                const modalityCatalog=['EDUCACIÓN BÁSICA ALTERNATIVA','EDUCACIÓN BÁSICA ESPECIAL','EDUCACIÓN BÁSICA REGULAR','EDUCACIÓN SUPERIOR','EDUCACIÓN TÉCNICA - PRODUCTIVA','NO ESPECIFICADO','SEDE ADMINISTRATIVA'];
                const limaUgelCatalog=['DIRECCIÓN REGIONAL DE EDUCACIÓN LIMA METROPOLITANA','INSTITUTO PEDAGÓGICO NACIONAL DE MONTERRICO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 01 SAN JUAN DE MIRAFLORES','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 02 RÍMAC','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 03 BREÑA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 04 COMAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 05 SAN JUAN DE LURIGANCHO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 06 ATE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 07 SAN BORJA'];
                const ugelCatalogs={
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN AMAZONAS':['DIRECCIÓN REGIONAL DE EDUCACIÓN AMAZONAS','UGEL INTERCULTURAL BILINGÜE CENEPA','UGEL INTERCULTURAL BILINGÜE RÍO SANTIAGO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL BAGUA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL BONGARÁ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHACHAPOYAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CONDORCANQUI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL IBIRI-IMAZA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LUYA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL RODRÍGUEZ DE MENDOZA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL UTCUBAMBA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN ANCASH':['DIRECCIÓN REGIONAL DE EDUCACIÓN ANCASH','UNIDAD DE GESTIÓN EDUCATIVA LOCAL AIJA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ANTONIO RAYMONDI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ASUNCIÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL BOLOGNESI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CARHUAZ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CARLOS FERMIN FITZCARRALD','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CASMA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CORONGO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUARAZ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUARI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUARMEY','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUAYLAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MARISCAL LUZURIAGA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL OCROS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PALLASCA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL POMABAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL RECUAY','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SANTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SIHUAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL YUNGAY'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN APURÍMAC':['DIRECCIÓN REGIONAL DE EDUCACIÓN APURÍMAC','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ABANCAY','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ANDAHUAYLAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ANTABAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL AYMARAES','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHINCHEROS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL COTABAMBAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL GRAU','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCARAMA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN AREQUIPA':['COLEGIO MILITAR FRANCISCO BOLOGNESI','DIRECCIÓN REGIONAL DE EDUCACIÓN AREQUIPA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL AREQUIPA NORTE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL AREQUIPA SUR','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CAMANÁ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CARAVELÍ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CASTILLA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CAYLLOMA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CONDESUYOS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ISLAY','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LA JOYA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LA UNIÓN'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN AYACUCHO':['DIRECCIÓN REGIONAL DE EDUCACIÓN AYACUCHO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CANGALLO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUAMANGA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCASANCOS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LA MAR','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LUCANAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PARINACOCHAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PÁUCAR DEL SARASARA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SUCRE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL VÍCTOR FAJARDO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL VILCASHUAMÁN'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN CAJAMARCA':['DIRECCIÓN REGIONAL DE EDUCACIÓN CAJAMARCA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CAJABAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CAJAMARCA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CELENDÍN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHOTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CONTUMAZÁ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CUTERVO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUALGAYOC','UNIDAD DE GESTIÓN EDUCATIVA LOCAL JAÉN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN IGNACIO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN MARCOS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN MIGUEL','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN PABLO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SANTA CRUZ'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN CALLAO':['DIRECCIÓN REGIONAL DE EDUCACIÓN CALLAO','MILITAR LEONCIO PRADO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL VENTANILLA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN CUSCO':['DIRECCIÓN REGIONAL DE EDUCACIÓN CUSCO','ESCUELA DE BELLAS ARTES DIEGO QUISPE TITO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ACOMAYO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ANTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CALCA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CANAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CANCHIS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHUMBIVILCAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CUSCO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ESPINAR','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LA CONVENCIÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PARURO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PAUCARTAMBO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PICHARI-KIMBIRI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL QUISPICANCHI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL URUBAMBA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN HUANCAVELICA':['DIRECCIÓN REGIONAL DE EDUCACIÓN HUANCAVELICA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ACOBAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ANGARAES','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CASTROVIRREYNA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHURCAMPA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCAVELICA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUAYTARÁ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SURCUBAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TAYACAJA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN HUÁNUCO':['DIRECCIÓN REGIONAL DE EDUCACIÓN HUÁNUCO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL AMBO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL DOS DE MAYO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUACAYBAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUAMALÍES','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUÁNUCO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LAURICOCHA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LEONCIO PRADO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MARAÑÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PACHITEA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PUERTO INCA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL YAROWILCA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN ICA':['UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHINCHA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ICA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL NAZCA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PALPA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PISCO'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN JUNÍN':['DIRECCIÓN REGIONAL DE EDUCACIÓN JUNÍN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHANCHAMAYO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHUPACA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CONCEPCIÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCAYO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL JAUJA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL JUNÍN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PANGOA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PICHANAQUI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL RÍO ENE - MANTARO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL RÍO TAMBO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SATIPO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TARMA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL YAULI'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN LA LIBERTAD':['COLEGIO MILITAR RAMON CASTILLA','DIRECCIÓN REGIONAL DE EDUCACIÓN LA LIBERTAD','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 01 EL PORVENIR','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 02 LA ESPERANZA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 03 TRUJILLO NOR OESTE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 04 TRUJILLO SUR ESTE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ASCOPE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL BOLÍVAR','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHEPÉN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL GRAN CHIMÚ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL JULCÁN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL OTUZCO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PACASMAYO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PATAZ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SÁNCHEZ CARRIÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SANTIAGO DE CHUCO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TRUJILLO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL VIRÚ'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN LAMBAYEQUE':['COLEGIO MILITAR ELIAS AGUIRRE','DIRECCIÓN REGIONAL DE EDUCACIÓN LAMBAYEQUE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHICLAYO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL FERREÑAFE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LAMBAYEQUE'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN LIMA METROPOLITANA':limaUgelCatalog
                  ,'DIRECCIÓN REGIONAL DE EDUCACIÓN LIMA PROVINCIAS':['DIRECCIÓN REGIONAL DE EDUCACIÓN LIMA PROVINCIAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 08 CAÑETE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 09 HUAURA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 10 HUARAL','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 11 CAJATAMBO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 12 CANTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 13 YAUYOS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 14 OYÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 15 HUAROCHIRÍ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 16 BARRANCA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN LORETO':['DIRECCIÓN REGIONAL DE EDUCACIÓN LORETO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ALTO AMAZONAS - SAN LORENZO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ALTO AMAZONAS - YURIMAGUAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LORETO - NAUTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MAYNAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PUTUMAYO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL RAMÓN CASTILLA - CABALLOCOCHA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL REQUENA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL UCAYALI - CONTAMANA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN MADRE DE DIOS':['DIRECCIÓN REGIONAL DE EDUCACIÓN MADRE DE DIOS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MANU','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TAHUAMANU','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TAMBOPATA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN MOQUEGUA':['DIRECCIÓN REGIONAL DE EDUCACIÓN MOQUEGUA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL GENERAL SÁNCHEZ CERRO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ILO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MARISCAL NIETO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN IGNACIO DE LOYOLA-ICHUÑA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN PASCO':['DIRECCIÓN REGIONAL DE EDUCACIÓN PASCO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL DANIEL ALCIDES CARRIÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL OXAPAMPA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PASCO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PUERTO BERMÚDEZ'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN PIURA':['COLEGIO MILITAR PEDRO RUIZ GALLO','DIRECCIÓN REGIONAL DE EDUCACIÓN PIURA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL AYABACA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHULUCANAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCABAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUARMACA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LA UNIÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MORROPÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PAITA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PIURA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SECHURA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SULLANA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TALARA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TAMBOGRANDE'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN PUNO':['DIRECCIÓN REGIONAL DE EDUCACIÓN PUNO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL AZÁNGARO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CARABAYA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHUCUITO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CRUCERO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL EL COLLAO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCANÉ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LAMPA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MELGAR','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MOHO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PUNO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN ANTONIO DE PUTINA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN ROMÁN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SANDIA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL YUNGUYO'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN SAN MARTÍN':['DIRECCIÓN REGIONAL DE EDUCACIÓN SAN MARTÍN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL BELLAVISTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL EL DORADO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUALLAGA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LAMAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MARISCAL CÁCERES','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MOYOBAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PICOTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL RIOJA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN MARTÍN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TOCACHE'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN TACNA':['DIRECCIÓN REGIONAL DE EDUCACIÓN TACNA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CANDARAVE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL JORGE BASADRE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TACNA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TARATA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN TUMBES':['DIRECCIÓN REGIONAL DE EDUCACIÓN TUMBES','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CONTRALMIRANTE VILLAR','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TUMBES','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ZARUMILLA'],
                  'DIRECCIÓN REGIONAL DE EDUCACIÓN UCAYALI':['DIRECCIÓN REGIONAL DE EDUCACIÓN UCAYALI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ATALAYA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CORONEL PORTILLO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PADRE ABAD','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PURÚS'],
                  'MINISTERIO DE DEFENSA':['CENTRO DE ADMINISTRACION DE SERVICIOS EDUCATIVOS (FAP-UE005)','COPERE (EP-UE003)','DIRECCION DE BINESTAR DE LA MARINA (MGP-UE004)','MINISTERIO DE DEFENSA']
                };
                if(centerFilterSelects[0]) centerFilterSelects[0].innerHTML='<option value="">DRE</option>'+dreCatalog.map(item=>`<option>${item}</option>`).join('');
                if(centerFilterSelects[2]) centerFilterSelects[2].innerHTML='<option value="">Modalidad educativa</option>'+modalityCatalog.map(item=>`<option>${item}</option>`).join('');
                const educationLevelCatalogs={
                  'EDUCACIÓN BÁSICA ALTERNATIVA':['EBA - AVANZADO','EBA - INICIAL E INTERMEDIO','EBA - PRIMARIA DE ADULTOS','EBA - SECUNDARIA DE ADULTOS'],
                  'EDUCACIÓN BÁSICA ESPECIAL':['EBE - EDUCACIÓN ESPECIAL','EBE - INICIAL','EBE - PRIMARIA'],
                  'EDUCACIÓN BÁSICA REGULAR':['EBR - INICIAL - CUNA','EBR - INICIAL - CUNA - JARDÍN','EBR - INICIAL - JARDÍN','EBR - PRIMARIA','EBR - SECUNDARIA'],
                  'EDUCACIÓN SUPERIOR':['EDUCACIÓN SUPERIOR ARTÍSTICA - ESCUELAS','ESCUELA SUPERIOR PEDAGÓGICA','ESCUELA SUPERIOR TECNOLÓGICA','FORMACIÓN ARTÍSTICA','SUPERIOR PEDAGÓGICA - ISP','SUPERIOR TECNOLÓGICA - IST'],
                  'EDUCACIÓN TÉCNICA - PRODUCTIVA':['CETPRO','CICLO MEDIO','NIVEL BÁSICO'],
                  'NO ESPECIFICADO':['NO ESPECIFICADO'],
                  'SEDE ADMINISTRATIVA':['ADMINISTRACIÓN']
                };
                const renderEducationLevels=()=>{
                  if(!centerFilterSelects[3]) return;
                  const levels=educationLevelCatalogs[centerFilterSelects[2]?.value]||[];
                  centerFilterSelects[3].innerHTML='<option value="">Nivel educativo</option>'+levels.map(item=>`<option>${item}</option>`).join('');
                };
                centerFilterSelects[2]?.addEventListener('change',renderEducationLevels);
                const renderUgelCatalog=()=>{
                  if(!centerFilterSelects[1]) return;
                  const options=ugelCatalogs[centerFilterSelects[0]?.value]||[];
                  centerFilterSelects[1].innerHTML='<option value="">UGEL</option>'+options.map(item=>`<option>${item}</option>`).join('');
                };
                centerFilterSelects[0]?.addEventListener('change',renderUgelCatalog);
                  const closeCenter=()=>centerModal.remove();
                  centerModal.querySelector('.close-center-search')?.addEventListener('click',closeCenter);
                  centerModal.addEventListener('click',event=>{if(event.target===centerModal)closeCenter();});
                  const tabs=centerModal.querySelectorAll('.center-search-body > nav button');
                  centerModal.dataset.searchStatus='vigente';
                  tabs.forEach((tab,index)=>tab.addEventListener('click',()=>{
                    tabs.forEach(item=>item.classList.remove('active'));
                    tab.classList.add('active');
                    centerModal.dataset.searchStatus=index===0?'vigente':'no-vigente';
                  }));
                  centerModal.querySelector('.clear-center-search')?.addEventListener('click',()=>{
                    centerModal.querySelectorAll('input').forEach(input=>input.value='');
                    centerModal.querySelectorAll('select').forEach(select=>select.selectedIndex=0);
                  });
                  centerModal.querySelector('.run-center-search')?.addEventListener('click',async()=>{
                    const code=centerModal.querySelector('.center-code-filter')?.value.trim()||'';
                    const name=centerModal.querySelector('.center-name-filter')?.value.trim()||'';
                    const body=centerModal.querySelector('.center-results-body');
                    try{
                      const response=await fetch(`api/centros-trabajo.php?codigo=${encodeURIComponent(code)}&nombre=${encodeURIComponent(name)}`,{cache:'no-store'});
                      const data=await response.json();
                      let records=Array.isArray(data.registros)?data.registros:[];
                      const instituteFallback=getInstituteCenterFallback(code);
                      if(!records.length&&instituteFallback) records=[instituteFallback];
                      body.innerHTML=records.length?records.map(item=>`<button type="button" data-code="${item.codigo}"><span>${item.codigo}</span><span>${item.nombre}</span><span>${item.iged}</span><span>${item.nivel||'No registrado'}</span><span>${item.modalidad||'No registrado'}</span></button>`).join(''):'<p>No se encontraron registros.</p>';
                      centerModal.querySelectorAll('.center-results-body button').forEach(button=>button.addEventListener('click',()=>{const input=fieldEditor.querySelector('.displacement-new-value');if(input)input.value=button.dataset.code||'';closeCenter();}));
                      const totals=centerModal.querySelectorAll('.center-results footer b');
                      if(totals[0])totals[0].textContent=String(records.length);
                      if(totals[1])totals[1].textContent=String(records.length?1:0);
                    }catch(_){if(body)body.innerHTML='<p>No se pudo realizar la búsqueda.</p>';}
                  });
                });
              });
            }else if(selectedAction){
              detailFields.innerHTML='<label class="modification-notes"><span>Anotaciones</span><span class="modification-count">250</span><textarea id="modification-notes" maxlength="250" placeholder="Anotaciones"></textarea></label>';
            }
            detailFields.querySelector('#modification-notes')?.addEventListener('input',notesEvent=>{
              const count=detailFields.querySelector('.modification-count');
              if(count) count.textContent=250-notesEvent.target.value.length;
            });
          };
          modificationAction.addEventListener('change',renderDisplacementModification);
      };
      document.querySelectorAll('.displacement-edit').forEach((button, index) => {
        button.addEventListener('click', event => {
          event.stopPropagation();
          openDisplacementModification(displacementData[index]);
        });
      });
      document.querySelector('.displacement-table')?.addEventListener('displacement-edit-record',event=>{
        const record=event.detail?.record;
        if(!record)return;
        const data=record.datos||{};
        const normalized=Object.fromEntries(Object.entries(data).map(([key,value])=>[normalizeField(key),value]));
        const value=(...labels)=>labels.map(label=>normalized[normalizeField(label)]).find(item=>item!==undefined&&item!==null&&String(item).trim()!=='')||'No registrado';
        const row=[
          value('Acción'),
          value('Motivo acción'),
          value('Fecha inicio'),
          value('Fecha fin'),
          value('Cargo - Destino','Cargo'),
          value('Centro laboral - Origen','Centro origen'),
          value('Centro laboral - Destino','Centro destino'),
          '',
          value('Número resolución (######-año-IGED)','Número resolución'),
          value('Fecha de resolución','Fecha resolución'),
          value('Código modular IE - Destino')
        ];
        row._resolutionType=value('Tipo de resolución');
        row._currentValues={
          'CARGO - DESTINO':value('Cargo - Destino'),
          'CARGO - ORIGEN':value('Cargo - Origen'),
          'CENTRO LABORAL - ORIGEN':value('Centro laboral - Origen'),
          'CÓDIGO DE PLAZA - DESTINO':value('Código de plaza - Destino'),
          'CÓDIGO DE PLAZA - ORIGEN':value('Código de plaza - Origen'),
          'CÓDIGO MODULAR IE - DESTINO':value('Código modular IE - Destino'),
          'CÓDIGO MODULAR IE - ORIGEN':value('Código modular IE - Origen'),
          'ESCALA / CATEGORÍA / NIVEL / GRUPO - DESTINO':value('Grupo ocupacional - Destino','Categoría Remunerativa - Destino'),
          'ESCALA / CATEGORÍA / NIVEL / GRUPO - ORIGEN':value('Grupo ocupacional - Origen','Categoría Remunerativa - Origen'),
          'FECHA DE FIN':value('Fecha fin'),
          'FECHA DE INICIO':value('Fecha inicio'),
          'JORNADA - DESTINO':value('Jornada Laboral - Destino'),
          'JORNADA - ORIGEN':value('Jornada Laboral - Origen'),
          'MODALIDAD EDUCATIVA - ORIGEN':value('Modalidad educativa - Origen'),
          'NIVEL EDUCATIVO - ORIGEN':value('Nivel educativo - Origen')
        };
        openDisplacementModification(row);
      });
      document.querySelectorAll('.displacement-center').forEach((button,index)=>button.addEventListener('click',event=>{
        event.stopPropagation();
        const editButton=document.querySelectorAll('.displacement-edit')[index];
        editButton?.click();
        const modification=document.querySelector('.app-modal-wrap');
        const fieldSelect=modification?.querySelector('.displacement-modification-field select');
        if(fieldSelect){
          fieldSelect.value='CÓDIGO MODULAR IE - DESTINO';
          fieldSelect.dispatchEvent(new Event('change',{bubbles:true}));
        }
        modification?.querySelector('.open-displacement-center-search')?.click();
        modification?.remove();
      }));
      document.querySelectorAll('.displacement-row').forEach((row,index)=>{
        const statusCell=row.querySelector('.displacement-status');
        const storageKey=`dre-displacement-status:${server.dni}:${index}`;
        const savedStatus=localStorage.getItem(storageKey);
        if(savedStatus==='APROBADO'||savedStatus==='ANULADO'||savedStatus==='DESAPROBADO') statusCell.textContent=savedStatus==='DESAPROBADO'?'ANULADO':savedStatus;
        statusCell.classList.toggle('displacement-status-cancelled',statusCell.textContent.trim()==='ANULADO');
        row.querySelector('.displacement-cancel')?.addEventListener('click',()=>{
          const nextStatus=statusCell.textContent.trim()==='ANULADO'?'APROBADO':'ANULADO';
          statusCell.textContent=nextStatus;
          statusCell.classList.toggle('displacement-status-cancelled',nextStatus==='ANULADO');
          localStorage.setItem(storageKey,nextStatus);
          saveStatusToDatabase(storageKey,nextStatus);
        });
        loadStatusFromDatabase(storageKey,status=>{statusCell.textContent=status;statusCell.classList.toggle('displacement-status-cancelled',status==='ANULADO');});
        appendDatabaseDelete(row.querySelector('.displacement-row-actions'),server.desplazamientos?.[index],row);
      });
      document.getElementById('displacement-form').addEventListener('submit', event => { event.preventDefault(); alert('Desplazamiento guardado correctamente.'); });
      window.location.hash = 'trayectoria-desplazamiento';
    };
    const showAdminAscent = () => {
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs trajectory-tabs"><a>Situación laboral actual</a><a>Datos de desplazamiento</a><a class="active">Ascenso</a></nav><fieldset class="admin-server-card"><legend>Acciones de ascenso</legend><div class="ascent-table"><div class="ascent-head"><span>N°</span><span>Acción</span><span>Motivo</span><span>Régimen</span><span>F. inicio</span><span>F. fin</span><span>Escala anterior</span><span>Nueva escala</span><span>Resolución</span><span>Estado</span><span>Acciones</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 0 páginas</strong></div></div></fieldset><form id="ascent-form"><fieldset class="admin-server-card"><legend>Datos principales de la resolución</legend><div class="ingress-form-grid"><label><span>Tipo de resolución *</span><select required><option value="">Seleccione tipo de resolución</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN DIRECTORAL</option></select></label><label><span>Número resolución (######-año-IGED) *</span><input required placeholder="Número de resolución"></label><label><span>Fecha de resolución *</span><input required type="date"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label><span></span><label><span>Régimen laboral</span><select><option value="">Seleccione régimen laboral</option><option>LEY N° 29944</option><option>LEY N° 30512</option><option>D.L. N° 276</option></select></label><label><span>Acción</span><select><option value="">Seleccione acción</option><option>ASCENSO</option><option>PROGRESIÓN</option></select></label><label><span>Motivo acción</span><select id="ascent-reason"><option value="">Seleccione motivo</option><option>CONCURSO PÚBLICO DE ASCENSO</option><option>ASCENSO DE ESCALA</option><option>PROGRESIÓN EN LA CARRERA</option></select></label></div></fieldset><fieldset class="admin-server-card ingress-detail"><legend>Detalle de la resolución</legend><p id="ascent-detail-message">Seleccione el motivo acción para continuar con el formulario de registro</p><div id="ascent-detail-fields" class="ingress-form-grid" hidden><label><span>Fecha de inicio *</span><input type="date"></label><label><span>Fecha de fin</span><input type="date"></label><label><span>Escala anterior *</span><select><option>PRIMERA ESCALA</option><option>SEGUNDA ESCALA</option><option>TERCERA ESCALA</option><option>CUARTA ESCALA</option></select></label><label><span>Nueva escala *</span><select><option>SEGUNDA ESCALA</option><option>TERCERA ESCALA</option><option>CUARTA ESCALA</option><option>QUINTA ESCALA</option></select></label><label><span>Estado</span><select><option>APROBADO</option><option>MODIFICADO</option></select></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="ascent-actions"><button id="return-ascent" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      document.querySelector('#ascent-form .ingress-form-grid label select').innerHTML = ascentResolutionOptions;
      document.querySelectorAll('.trajectory-tabs a')[0].addEventListener('click', showAdminTrajectory);
      document.querySelectorAll('.trajectory-tabs a')[1].addEventListener('click', showAdminDisplacement);
      document.getElementById('return-ascent').addEventListener('click', showAdminTrajectory);
      document.getElementById('ascent-reason').addEventListener('change', event => {
        document.getElementById('ascent-detail-fields').hidden = !event.target.value;
        document.getElementById('ascent-detail-message').hidden = Boolean(event.target.value);
      });
      document.getElementById('ascent-form').addEventListener('submit', event => { event.preventDefault(); alert('Ascenso guardado correctamente.'); });
      window.location.hash = 'trayectoria-ascenso';
    };
    const loadAssignmentRecords=async(selector,section,legacy,builder)=>{
      const response=await fetch(`api/asignaciones-registro.php?dni=${encodeURIComponent(server.dni)}&codmod=${encodeURIComponent(server.codigoAnterior||server.codigo)}&seccion=${encodeURIComponent(section)}`,{cache:'no-store'});
      const result=await response.json();
      const persisted=(Array.isArray(result.registros)?result.registros:[]).map(record=>({...record,_persisted:true}));
      const table=adminContent.querySelector(selector);
      if(table) delete table.dataset.realDataHydrated;
      fillRealTable(selector,[...(Array.isArray(legacy)?legacy:[]),...persisted],builder);
    };
    const saveAssignmentRecord=async(form,section,values,refresh)=>{
      if(!form.reportValidity()) return;
      const data=new FormData();
      data.append('dni',server.dni);data.append('codmod',server.codigoAnterior||server.codigo);data.append('seccion',section);
      Object.entries(values).forEach(([key,value])=>data.append(key,value??''));
      const files=form.querySelectorAll('input[type="file"]');
      if(files[0]?.files[0]) data.append('documento',files[0].files[0]);
      if(files[1]?.files[0]) data.append('acta_defuncion',files[1].files[0]);
      const response=await fetch('api/asignaciones-registro.php',{method:'POST',body:data});
      const result=await response.json();
      if(!response.ok||!result.ok){alert(result.mensaje||'No se pudo guardar el registro.');return;}
      alert('Registro guardado correctamente en la base de datos.');
      refresh();
    };
    const showAdminBenefits = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      benefitsMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs benefits-tabs"><a class="active">Datos de beneficios</a><a>Subsidio por luto sepelio</a><a>Retenciones judiciales</a><a>Datos de modificaciones</a><a>Pagos indebidos</a></nav><fieldset class="admin-server-card"><legend>Acciones de beneficios</legend><div class="benefits-table"><div class="benefits-head"><span>N°</span><span>Acción</span><span>Motivo</span><span>Régimen</span><span>Resolución</span><span>F. resolución</span><span>Importe</span><span>Estado</span><span>Acciones</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 0 páginas</strong></div></div></fieldset><form id="benefits-form"><fieldset class="admin-server-card"><legend>Datos principales de la resolución</legend><div class="ingress-form-grid"><label><span>Tipo de resolución *</span><select required><option value="">Seleccione tipo de resolución</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN DIRECTORAL</option><option>RESOLUCIÓN JEFATURAL</option></select></label><label><span>Número resolución (######-año-IGED) *</span><input required placeholder="Número de resolución"></label><label><span>Fecha de resolución *</span><input required type="date"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label><span></span><label><span>Régimen laboral</span><select><option value="">Seleccione régimen laboral</option><option>LEY N° 29944</option><option>LEY N° 30512</option><option>D.L. N° 276</option><option>D.L. N° 1057 CAS</option></select></label><label><span>Acción</span><select><option value="">Seleccione acción</option><option>ASIGNACIÓN</option><option>INCENTIVO</option><option>BONIFICACIÓN</option><option>BENEFICIO</option></select></label><label><span>Motivo acción</span><select id="benefits-reason"><option value="">Seleccione motivo</option><option>ASIGNACIÓN POR TIEMPO DE SERVICIOS</option><option>INCENTIVO POR DESEMPEÑO</option><option>BONIFICACIÓN EXTRAORDINARIA</option><option>COMPENSACIÓN</option></select></label></div></fieldset><fieldset class="admin-server-card ingress-detail"><legend>Detalle de la resolución</legend><p id="benefits-detail-message">Seleccione el motivo acción para continuar con el formulario de registro</p><div id="benefits-detail-fields" class="ingress-form-grid" hidden><label><span>Fecha de inicio *</span><input type="date"></label><label><span>Fecha de fin</span><input type="date"></label><label><span>Importe *</span><input type="number" min="0" step="0.01" placeholder="S/ 0.00"></label><label><span>Concepto *</span><input placeholder="Concepto del beneficio"></label><label><span>Estado</span><select><option>APROBADO</option><option>MODIFICADO</option><option>ANULADO</option></select></label><label><span>Observaciones</span><input placeholder="Observaciones"></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="benefits-actions"><button id="return-benefits" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      document.querySelector('#benefits-form .ingress-form-grid label select').innerHTML = ascentResolutionOptions;
      const benefitsForm=document.getElementById('benefits-form');
      const benefitsMain=[...benefitsForm.querySelectorAll('.ingress-form-grid')[0].querySelectorAll('label')];
      const benefitControl=label=>benefitsMain.find(item=>item.querySelector('span')?.textContent.trim().startsWith(label))?.querySelector('input,select,textarea');
      const benefitRegime=benefitControl('Régimen laboral');
      const benefitAction=benefitControl('Acción');
      const benefitReason=benefitControl('Motivo acción');
      const benefitResolutionDate=benefitControl('Fecha de resolución');
      const benefitServerRegime=String(server.regimen||'')
        .replace(/\s+(NOMBRADOS?|CONTRATADOS?)\s*$/i,'')
        .trim();
      benefitRegime.required=true;
      benefitRegime.innerHTML='<option value="">Seleccione régimen laboral</option><option>DECRETO LEGISLATIVO 276 - CARRERA ADMINISTRATIVA</option><option>LEY 29944 - LEY DE REFORMA MAGISTERIAL</option>';
      benefitAction.required=true;
      const benefitActionsByRegime={
        'DECRETO LEGISLATIVO 276 - CARRERA ADMINISTRATIVA':['OTORGAR BONIFICACIÓN FAMILIAR','OTORGAR BONIFICACIÓN PERSONAL','OTORGAR CRÉDITO DEVENGADO','OTORGAR GRATIFICACIÓN POR TIEMPO DE SERVICIOS','OTORGAR INCENTIVO POR EXCELENCIA PROFESIONAL Y DESEMPEÑO DESTACADO','OTORGAR REMUNERACIÓN VACACIONAL TRUNCA','OTORGAR VACACIONES TRUNCAS','REINTEGRO'],
        'LEY 30328 - CONTRATO DE SERVICIO DOCENTE':['OTORGAR CRÉDITO DEVENGADO','OTORGAR VACACIONES TRUNCAS','REINTEGRO'],
        'LEY 29944 - LEY DE REFORMA MAGISTERIAL':['OTORGAR ASIGNACIÓN POR TIEMPO DE SERVICIOS','OTORGAR CRÉDITO DEVENGADO','OTORGAR INCENTIVO POR EXCELENCIA PROFESIONAL Y DESEMPEÑO DESTACADO','OTORGAR REMUNERACIÓN VACACIONAL TRUNCA','REINTEGRO'],
      };
      if(benefitServerRegime&&!benefitActionsByRegime[benefitServerRegime]){
        benefitActionsByRegime[benefitServerRegime]=['OTORGAR ASIGNACIÓN POR TIEMPO DE SERVICIOS','OTORGAR CRÉDITO DEVENGADO','OTORGAR REMUNERACIÓN VACACIONAL TRUNCA','REINTEGRO'];
      }
      const renderBenefitActions=()=>{
        const actions=benefitActionsByRegime[benefitRegime.value]||[];
        benefitAction.innerHTML='<option value="">Seleccione acción</option>'+actions.map(action=>`<option>${action}</option>`).join('');
        benefitReason.innerHTML='<option value="">Seleccione motivo</option>';
        document.getElementById('benefits-detail-fields').hidden=true;
        document.getElementById('benefits-detail-message').hidden=false;
      };
      benefitReason.required=true;
      const benefitReasonMap={
        'BONIFICACIÓN':['BONIFICACIÓN FAMILIAR','BONIFICACIÓN PERSONAL'],
        'CRÉDITO DEVENGADO':['CRÉDITO DEVENGADO'],
        'OTORGAMIENTO':['POR INCREMENTO DE PAGO DE DOCTORADO','POR INCREMENTO DE PAGO DE MAESTRÍA','POR PAGO DE DOCTORADO','POR PAGO DE MAESTRÍA'],
        'OTORGAR ASIGNACIÓN POR TIEMPO DE SERVICIOS':['OTORGAR ASIGNACIÓN POR TIEMPO DE SERVICIOS POR 20 AÑOS','OTORGAR ASIGNACIÓN POR TIEMPO DE SERVICIOS POR 25 AÑOS','OTORGAR ASIGNACIÓN POR TIEMPO DE SERVICIOS POR 30 AÑOS'],
        'OTORGAR BONIFICACIÓN FAMILIAR':['OTORGAR BONIFICACIÓN FAMILIAR'],
        'OTORGAR BONIFICACIÓN PERSONAL':['OTORGAR BONIFICACIÓN PERSONAL'],
        'OTORGAR GRATIFICACIÓN POR TIEMPO DE SERVICIOS':['OTORGAR GRATIFICACIÓN POR TIEMPO DE SERVICIOS POR 25 AÑOS','OTORGAR GRATIFICACIÓN POR TIEMPO DE SERVICIOS POR 30 AÑOS'],
        'OTORGAR INCENTIVO POR EXCELENCIA PROFESIONAL Y DESEMPEÑO DESTACADO':['OTORGAR INCENTIVO POR EXCELENCIA PROFESIONAL Y DESEMPEÑO DESTACADO'],
        'OTORGAR REMUNERACIÓN VACACIONAL TRUNCA':['OTORGAR REMUNERACIÓN VACACIONAL TRUNCA'],
        'OTORGAR VACACIONES TRUNCAS':['OTORGAR VACACIONES TRUNCAS'],
        'REINTEGRO':['REINTEGRO']
      };
      const automaticSameReasonActions=new Set([
        'OTORGAR INCENTIVO POR EXCELENCIA PROFESIONAL Y DESEMPEÑO DESTACADO',
        'OTORGAR REMUNERACIÓN VACACIONAL TRUNCA',
        'OTORGAR VACACIONES TRUNCAS',
        'REINTEGRO'
      ]);
      const administrativeSameReasonActions=new Set([
        'OTORGAR BONIFICACIÓN FAMILIAR',
        'OTORGAR BONIFICACIÓN PERSONAL',
        'OTORGAR CRÉDITO DEVENGADO',
        'OTORGAR VACACIONES TRUNCAS',
        'REINTEGRO'
      ]);
      const renderBenefitReasons=()=>{
        let reasons=benefitReasonMap[benefitAction.value]||[];
        const administrativeAutomaticReason=benefitRegime.value==='DECRETO LEGISLATIVO 276 - CARRERA ADMINISTRATIVA'
          && administrativeSameReasonActions.has(benefitAction.value);
        if(benefitAction.value==='OTORGAR ASIGNACIÓN POR TIEMPO DE SERVICIOS'&&benefitRegime.value.startsWith('LEY 29944')) reasons=reasons.filter(reason=>!reason.includes('20 AÑOS'));
        if(benefitAction.value==='OTORGAR CRÉDITO DEVENGADO') reasons=['OTORGAR CRÉDITO DEVENGADO','OTROS','POR CONTRATO','POR DEUDA','POR ENCARGATURA','POR INTERESES','POR PREPARACIÓN DE CLASES','POR REINTEGRO'];
        if(administrativeAutomaticReason) reasons=[benefitAction.value];
        if(automaticSameReasonActions.has(benefitAction.value)) reasons=[benefitAction.value];
        benefitReason.innerHTML='<option value="">Seleccione motivo</option>'+reasons.map(reason=>`<option>${reason}</option>`).join('');
        if(administrativeAutomaticReason||automaticSameReasonActions.has(benefitAction.value)||benefitAction.value==='OTORGAR CRÉDITO DEVENGADO'||reasons.length===1) benefitReason.value=reasons[0]||'';
        renderBenefitDetail();
      };
      const renderBenefitDetail=()=>{
        const fields=document.getElementById('benefits-detail-fields');
        const message=document.getElementById('benefits-detail-message');
        if(!benefitReason.value){fields.hidden=true;message.hidden=false;fields.innerHTML='';return;}
        const payment='<label><span>Tipo de pago *</span><select required><option>PAGO OCASIONAL</option><option>PAGO ORDINARIO</option></select></label>';
        const currency='<label><span>Tipo de moneda *</span><select required><option value=""></option><option>DÓLARES AMERICANOS</option><option>INTIS</option><option selected>SOL</option></select></label>';
        const amount='<label><span>Monto *</span><input required type="text" inputmode="decimal" pattern="(?:\\d+|\\d{1,3}(?:,\\d{3})+)(?:\\.\\d{1,2})?" title="Ingrese un monto válido, por ejemplo 6,659.52" placeholder="Ejemplo: 6,659.52"></label>';
        const notes='<label class="full"><span>Anotaciones</span><textarea maxlength="250" rows="3" placeholder="Anotaciones"></textarea><small>250</small></label>';
        const benefitDate='<label><span>Fecha cumplimiento del beneficio *</span><input required type="date"></label>';
        const paymentReason='<label><span>Motivo de pago *</span><input required maxlength="250" placeholder="Motivo de pago"></label>';
        if(benefitReason.value==='BONIFICACIÓN FAMILIAR') fields.innerHTML=`${payment}<label><span>Fecha a partir de *</span><input required type="date"></label><label><span>Número de dependientes *</span><select required><option value="">Seleccione</option>${Array.from({length:10},(_,i)=>`<option>${i+1}</option>`).join('')}</select></label>${currency}${amount}${notes}`;
        else if(benefitReason.value==='BONIFICACIÓN PERSONAL') fields.innerHTML=`${payment}${benefitDate}<label><span>Porcentaje *</span><select required><option value="">Seleccione</option>${[5,10,15,20,25,30,35,40].map(value=>`<option>${value}</option>`).join('')}</select></label>${currency}${amount}${notes}`;
        else if(benefitAction.value==='OTORGAMIENTO') fields.innerHTML=`${currency}${amount}${notes}`;
        else if(benefitAction.value==='OTORGAR CRÉDITO DEVENGADO') fields.innerHTML=benefitReason.value==='OTORGAR CRÉDITO DEVENGADO'?`${payment}${benefitDate}${currency}${amount}${paymentReason}${notes}`:`${currency}${amount}${notes}`;
        else if(['OTORGAR INCENTIVO POR EXCELENCIA PROFESIONAL Y DESEMPEÑO DESTACADO','OTORGAR REMUNERACIÓN VACACIONAL TRUNCA','OTORGAR VACACIONES TRUNCAS'].includes(benefitAction.value)) fields.innerHTML=`${payment}${benefitDate}${currency}${amount}${notes}`;
        else if(['OTORGAR ASIGNACIÓN POR TIEMPO DE SERVICIOS','OTORGAR GRATIFICACIÓN POR TIEMPO DE SERVICIOS'].includes(benefitAction.value)) fields.innerHTML=`${payment}${benefitDate}${currency}${amount}${notes}`;
        else if(benefitAction.value==='REINTEGRO') fields.innerHTML=`${currency}${amount}${paymentReason}${notes}`;
        else fields.innerHTML=`${payment}${benefitDate}${currency}${amount}${paymentReason}${notes}`;
        fields.hidden=false;message.hidden=true;
      };
      benefitAction.addEventListener('change',renderBenefitReasons);
      benefitRegime.addEventListener('change',renderBenefitActions);
      benefitReason.addEventListener('change',renderBenefitDetail);
      const setBenefitServerRegime=()=>{
        if(!benefitResolutionDate.value||!benefitServerRegime||![...benefitRegime.options].some(option=>option.value===benefitServerRegime))return;
        benefitRegime.value=benefitServerRegime;
        renderBenefitActions();
      };
      benefitResolutionDate.addEventListener('change',setBenefitServerRegime);
      benefitResolutionDate.addEventListener('input',setBenefitServerRegime);
      document.getElementById('return-benefits').addEventListener('click', () => { window.location.href = 'gestion-servidor.html'; });
      const benefitsTable=document.querySelector('.benefits-table');
      benefitsTable.addEventListener('benefit-edit-record',event=>{
        const record=event.detail.record||{};
        const benefitValue=(...keys)=>{for(const key of keys){const value=record[key];if(value!==undefined&&value!==null&&String(value).trim()!=='')return String(value).trim();}return 'No registrado';};
        const escapeBenefit=value=>String(value??'').replace(/[&<>'"]/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
        const currentFields={
          'FECHA CUMPLE BENEFICIO':formatTableDate(benefitValue('fecha_beneficio','fechaBeneficio')),
          'MONTO':benefitValue('importe'),
          'TIPO DE MONEDA':benefitValue('tipo_moneda','tipoMoneda'),
          'TIPO DE PAGO':benefitValue('tipo_pago','tipoPago')
        };
        const modification=modal('Modificatoria de la acción',`<div class="action-modification benefit-modification"><label class="modification-action-type"><span>Tipo de acción <b>*</b></span><select id="benefit-modification-action" required><option value=""></option><option>DECLARAR NULO</option><option>DEJAR SIN EFECTO</option><option>MODIFICAR / RECTIFICAR</option></select></label><fieldset><legend>Datos de la resolución a modificar</legend><div class="modification-current-data"><div><strong>Tipo de resolución</strong><span>${escapeBenefit(benefitValue('tipo_resolucion','tipoResolucion'))}</span></div><div><strong>Número de resolución</strong><span>${escapeBenefit(benefitValue('numero_resolucion','resolucion'))}</span></div><div><strong>Fecha de resolución</strong><span>${escapeBenefit(formatTableDate(benefitValue('fecha_resolucion','fechaResolucion')))}</span></div><div><strong>Régimen</strong><span>${escapeBenefit(benefitValue('regimen'))}</span></div><div><strong>Acción</strong><span>${escapeBenefit(benefitValue('accion'))}</span></div><div><strong>Motivo acción</strong><span>${escapeBenefit(benefitValue('motivo','concepto'))}</span></div></div></fieldset><fieldset><legend>Datos principales de la resolución de modificatoria</legend><div class="modification-form-grid"><label><span>Tipo de resolución <b>*</b></span><select required>${ascentResolutionOptions}</select></label><label><span>Número resolución (######-año-IGED) <b>*</b></span><input required placeholder="Número de resolución"></label><label><span>Fecha resolución <b>*</b></span><input required type="date"></label><label><span>Documento <b>*</b></span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div></fieldset><fieldset><legend>Detalle de la resolución de modificatoria</legend><p id="benefit-modification-message">Seleccione un tipo de acción para continuar con el formulario de registro</p><div id="benefit-modification-detail" hidden></div></fieldset></div>`,[]);
        modification.querySelector('.app-modal').classList.add('action-modification-modal','unpaid-modification-modal');
        const typeSelect=modification.querySelector('#benefit-modification-action');
        const message=modification.querySelector('#benefit-modification-message');
        const detail=modification.querySelector('#benefit-modification-detail');
        const notesAndSave=()=>`<label class="modification-notes"><span>Anotaciones</span><span class="modification-count">250</span><textarea maxlength="250" placeholder="Anotaciones"></textarea></label><button class="unpaid-modification-save benefit-modification-save" type="button">▣ GUARDAR</button>`;
        const bindBenefitSave=()=>{
          const notes=detail.querySelector('textarea');const counter=detail.querySelector('.modification-count');
          notes?.addEventListener('input',()=>{if(counter)counter.textContent=String(250-notes.value.length);});
          detail.querySelector('.benefit-modification-save')?.addEventListener('click',()=>{modification.remove();alert('Modificatoria guardada correctamente.');});
        };
        typeSelect.addEventListener('change',()=>{
          const selected=typeSelect.value;
          message.hidden=Boolean(selected);detail.hidden=!selected;
          if(!selected){detail.innerHTML='';return;}
          if(selected!=='MODIFICAR / RECTIFICAR'){detail.innerHTML=notesAndSave();bindBenefitSave();return;}
          detail.innerHTML=`<div class="cessation-rectification-fields"><label><span>Campo a modificar</span><select id="benefit-modification-field"><option value=""></option>${Object.keys(currentFields).map(field=>`<option>${field}</option>`).join('')}</select></label><div class="cessation-says"><span>Dice</span><strong id="benefit-current-value">—</strong></div><label><span>Debe decir <b>*</b></span><span id="benefit-new-control"><input required></span></label><button type="button">✚ AGREGAR</button></div>${notesAndSave()}`;
          const fieldSelect=detail.querySelector('#benefit-modification-field');const current=detail.querySelector('#benefit-current-value');const controlHost=detail.querySelector('#benefit-new-control');
          fieldSelect.addEventListener('change',()=>{const field=fieldSelect.value;current.textContent=currentFields[field]||'—';if(field==='FECHA CUMPLE BENEFICIO')controlHost.innerHTML='<input required type="date">';else if(field==='TIPO DE MONEDA')controlHost.innerHTML='<select required><option value=""></option><option>DÓLARES AMERICANOS</option><option>INTIS</option><option>SOL</option></select>';else if(field==='TIPO DE PAGO')controlHost.innerHTML='<select required><option value=""></option><option>PAGO OCASIONAL</option><option>PAGO ORDINARIO</option></select>';else controlHost.innerHTML='<input required inputmode="decimal">';});
          bindBenefitSave();
        });
      });
      benefitsTable.addEventListener('benefit-view-record',event=>{
        const record=event.detail.record||{};
        const selectedRow=event.detail.row;
        const firstValue=(...keys)=>{for(const key of keys){const value=record[key];if(value!==undefined&&value!==null&&String(value).trim()!=='')return String(value).trim();}return 'No registrado';};
        const escapeDetail=input=>String(input??'').replace(/[&<>'"]/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
        const resolutionType=firstValue('tipo_resolucion','tipoResolucion');
        const resolutionNumber=firstValue('numero_resolucion','resolucion','numeroResolucion');
        const resolutionDate=firstValue('fecha_resolucion','fechaResolucion');
        const documentPath=firstValue('documento');
        const resolutionParts=resolutionNumber.match(/^(\d{6})-(\d{4})-(.+)$/);
        const resolutionPrefix=resolutionInitials(resolutionType).replace(/\./g,'');
        const resolutionEntity=resolutionParts?.[3].normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9]/gi,'').toUpperCase();
        const documentName=resolutionParts&&resolutionPrefix?`${resolutionPrefix}-${resolutionEntity}-${resolutionParts[2]}-${resolutionParts[1]}.pdf`:documentPath.split('/').pop();
        const rawAmount=firstValue('importe');
        const amountNumber=Number(rawAmount.replace(/,/g,''));
        const formattedAmount=Number.isFinite(amountNumber)?amountNumber.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):rawAmount;
        benefitsTable.querySelectorAll('.benefits-row.benefit-selected').forEach(row=>row.classList.remove('benefit-selected'));
        selectedRow.classList.add('benefit-selected');
        document.querySelector('.benefit-detail-view')?.remove();
        benefitsForm.hidden=true;
        const detailView=document.createElement('div');
        detailView.className='benefit-detail-view';
        detailView.innerHTML=`<fieldset class="admin-server-card"><legend>Datos principales de la resolución</legend><div class="commission-detail-grid"><div><strong>Tipo de resolución</strong><span>${escapeDetail(resolutionType)}</span></div><div><strong>Número resolución</strong><span>${escapeDetail(resolutionNumber)}</span></div><div><strong>Fecha resolución</strong><span>${escapeDetail(formatTableDate(resolutionDate))}</span></div><div><strong>Régimen laboral</strong><span>${escapeDetail(firstValue('regimen')==='No registrado'?server.regimen:firstValue('regimen'))}</span></div><div><strong>Acción</strong><span>${escapeDetail(firstValue('accion'))}</span></div><div><strong>Motivo acción</strong><span>${escapeDetail(firstValue('motivo','concepto'))}</span></div><div><strong>Documento</strong>${documentPath!=='No registrado'?`<a href="${escapeDetail(documentPath)}" target="_blank" rel="noopener">↗ ${escapeDetail(documentName)}</a>`:'<span>No registrado</span>'}</div><div><strong>Folios</strong><span>${escapeDetail(firstValue('folios'))}</span></div></div></fieldset><fieldset class="admin-server-card"><legend>Detalle de la resolución</legend><div class="commission-detail-grid"><div><strong>Tipo de pago</strong><span>${escapeDetail(firstValue('tipo_pago','tipoPago'))}</span></div><div><strong>Fecha cumplimiento del beneficio</strong><span>${escapeDetail(formatTableDate(firstValue('fecha_beneficio','fechaBeneficio')))}</span></div><div><strong>Tipo de moneda</strong><span>${escapeDetail(firstValue('tipo_moneda','tipoMoneda'))}</span></div><div><strong>Monto</strong><span>${escapeDetail(formattedAmount)}</span></div><div class="commission-detail-full"><strong>Anotaciones</strong><span>${escapeDetail(firstValue('observaciones'))}</span></div></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="commission-detail-actions"><button type="button" class="benefit-detail-return">← RETORNAR</button><button type="button" class="benefit-detail-cancel">⌫ CANCELAR</button></div>`;
        benefitsForm.insertAdjacentElement('beforebegin',detailView);
        const closeDetail=()=>{selectedRow.classList.remove('benefit-selected');detailView.remove();benefitsForm.hidden=false;};
        detailView.querySelector('.benefit-detail-return').addEventListener('click',closeDetail);
        detailView.querySelector('.benefit-detail-cancel').addEventListener('click',closeDetail);
      });
      loadAssignmentRecords('.benefits-table','beneficio',server.beneficios,(r,i)=>[i+1,r.accion,r.motivo||r.concepto,r.regimen||server.regimen,r.resolucion||r.numero_resolucion,r.fechaResolucion||r.fecha_resolucion,r.importe,r.estado,'']);
      document.getElementById('benefits-form').addEventListener('submit', event => {
        event.preventDefault();const form=event.currentTarget;const main=form.querySelectorAll('.ingress-form-grid')[0].querySelectorAll('select,input');const detailLabels=[...form.querySelectorAll('#benefits-detail-fields label')];
        const detailValue=label=>detailLabels.find(item=>item.querySelector('span')?.textContent.trim().startsWith(label))?.querySelector('input,select,textarea')?.value||'';
        saveAssignmentRecord(form,'beneficio',{tipo_resolucion:main[0].value,numero_resolucion:main[1].value,fecha_resolucion:main[2].value,folios:main[4].value,regimen:benefitRegime.value,accion:benefitAction.value,motivo:benefitReason.value,tipo_pago:detailValue('Tipo de pago'),fecha_beneficio:detailValue('Fecha'),numero_dependientes:detailValue('Número de dependientes'),tipo_moneda:detailValue('Tipo de moneda'),importe:detailValue('Monto').replace(/,/g,''),porcentaje_beneficio:detailValue('Porcentaje'),motivo_pago:detailValue('Motivo de pago'),observaciones:detailValue('Anotaciones'),estado:'APROBADO'},showAdminBenefits);
      });
      document.querySelectorAll('.benefits-tabs a')[1].addEventListener('click', showAdminBereavement);
      document.querySelectorAll('.benefits-tabs a')[2].addEventListener('click', showAdminWithholdings);
      document.querySelectorAll('.benefits-tabs a')[3].addEventListener('click', showAdminModifications);
      document.querySelectorAll('.benefits-tabs a')[4].addEventListener('click', showAdminImproperPayments);
      window.location.hash = 'asignaciones';
    };
    const showAdminBereavement = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      benefitsMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs benefits-tabs"><a>Datos de beneficios</a><a class="active">Subsidio por luto sepelio</a><a>Retenciones judiciales</a><a>Datos de modificaciones</a><a>Pagos indebidos</a></nav><fieldset class="admin-server-card"><legend>Registro de subsidios por luto / sepelio</legend><div class="bereavement-table"><div class="bereavement-head"><span>N°</span><span>Acción</span><span>Régimen</span><span>Resolución</span><span>F. resolución</span><span>F. fallecimiento</span><span>Importe</span><span>Estado</span><span>Acciones</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 0 páginas</strong></div></div></fieldset><form id="bereavement-form"><fieldset class="admin-server-card"><legend>Datos principales de la resolución</legend><div class="ingress-form-grid"><label><span>Tipo de resolución *</span><select required><option value="">Seleccione tipo de resolución</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN DIRECTORAL</option><option>RESOLUCIÓN JEFATURAL</option></select></label><label><span>Número resolución (######-año-IGED) *</span><input required placeholder="Número de resolución"></label><label><span>Fecha de resolución *</span><input required type="date"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label><span></span><label><span>Régimen laboral</span><select><option value="">Seleccione régimen laboral</option><option>LEY N° 29944</option><option>LEY N° 30512</option><option>D.L. N° 276</option><option>D.L. N° 1057 CAS</option></select></label><label><span>Acción</span><select><option value="">Seleccione acción</option><option>SUBSIDIO</option><option>BENEFICIO</option></select></label><label><span>Motivo acción</span><select id="bereavement-reason"><option value="">Seleccione motivo</option><option>SUBSIDIO POR LUTO</option><option>SUBSIDIO POR SEPELIO</option><option>SUBSIDIO POR LUTO Y SEPELIO</option></select></label></div></fieldset><fieldset class="admin-server-card ingress-detail"><legend>Detalle de la resolución</legend><p id="bereavement-detail-message">Seleccione el motivo acción para continuar con el formulario de registro</p><div id="bereavement-detail-fields" class="ingress-form-grid" hidden><label><span>Nombre del fallecido *</span><input placeholder="Nombres y apellidos"></label><label><span>Parentesco *</span><select><option>CÓNYUGE</option><option>PADRE</option><option>MADRE</option><option>HIJO(A)</option></select></label><label><span>Fecha de fallecimiento *</span><input type="date"></label><label><span>Importe *</span><input type="number" min="0" step="0.01" placeholder="S/ 0.00"></label><label><span>Acta o partida de defunción</span><input type="file" accept="application/pdf"></label><label><span>Estado</span><select><option>APROBADO</option><option>MODIFICADO</option><option>ANULADO</option></select></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="bereavement-actions"><button id="return-bereavement" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      document.querySelector('#bereavement-form .ingress-form-grid label select').innerHTML = ascentResolutionOptions;
      document.querySelectorAll('.benefits-tabs a')[0].addEventListener('click', showAdminBenefits);
      document.querySelectorAll('.benefits-tabs a')[2].addEventListener('click', showAdminWithholdings);
      document.querySelectorAll('.benefits-tabs a')[3].addEventListener('click', showAdminModifications);
      document.querySelectorAll('.benefits-tabs a')[4].addEventListener('click', showAdminImproperPayments);
      document.getElementById('return-bereavement').addEventListener('click', showAdminBenefits);
      document.getElementById('bereavement-reason').addEventListener('change', event => {
        document.getElementById('bereavement-detail-fields').hidden = !event.target.value;
        document.getElementById('bereavement-detail-message').hidden = Boolean(event.target.value);
      });
      loadAssignmentRecords('.bereavement-table','subsidio',server.subsidios,(r,i)=>[i+1,r.accion,r.regimen||server.regimen,r.resolucion||r.numero_resolucion,r.fechaResolucion||r.fecha_resolucion,r.fechaFallecimiento||r.fecha_fallecimiento,r.importe,r.estado,'']);
      document.getElementById('bereavement-form').addEventListener('submit', event => {
        event.preventDefault();const form=event.currentTarget;const main=form.querySelectorAll('.ingress-form-grid')[0].querySelectorAll('select,input');const detail=form.querySelectorAll('.ingress-form-grid')[1].querySelectorAll('select,input');
        saveAssignmentRecord(form,'subsidio',{tipo_resolucion:main[0].value,numero_resolucion:main[1].value,fecha_resolucion:main[2].value,folios:main[4].value,regimen:main[5].value,accion:main[6].value,motivo:main[7].value,nombre_fallecido:detail[0].value,parentesco:detail[1].value,fecha_fallecimiento:detail[2].value,importe:detail[3].value,estado:detail[5].value},showAdminBereavement);
      });
      window.location.hash = 'subsidio-luto-sepelio';
    };
    const showAdminWithholdings = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      benefitsMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs benefits-tabs"><a>Datos de beneficios</a><a>Subsidio por luto sepelio</a><a class="active">Retenciones judiciales</a><a>Datos de modificaciones</a><a>Pagos indebidos</a></nav><fieldset class="admin-server-card"><legend>Registro de retenciones judiciales</legend><div class="withholdings-table"><div class="withholdings-head"><span>N°</span><span>Resolución</span><span>F. resolución</span><span>Tipo retención</span><span>Monto fijo mensual</span><span>% fijo mensual</span><span>Estado</span><span>Acciones</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 0 páginas</strong></div></div></fieldset><form id="withholdings-form"><fieldset class="admin-server-card"><legend>Datos principales de la resolución</legend><div class="withholdings-form-grid"><label><span>Tipo de resolución *</span><select id="withholding-resolution-type" required><option value="">Seleccione tipo de resolución</option><option>RESOLUCIÓN DIRECTORAL SUB REGIONAL</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN JUDICIAL</option></select></label><label><span>Número de resolución (######-año-entidad emisora) *</span><input required placeholder="Número de resolución"></label><label><span>Fecha de la resolución *</span><input required type="date"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div></fieldset><fieldset class="admin-server-card ingress-detail"><legend>Detalle de la resolución</legend><p id="withholding-detail-message">Seleccione el tipo de resolución para continuar con el formulario de registro</p><div id="withholding-detail-fields" class="ingress-form-grid" hidden><label><span>Tipo de retención *</span><select><option>ALIMENTOS</option><option>EMBARGO JUDICIAL</option><option>OTRA RETENCIÓN</option></select></label><label><span>Modalidad *</span><select id="withholding-mode"><option>MONTO FIJO</option><option>PORCENTAJE</option></select></label><label><span>Monto fijo mensual</span><input type="number" min="0" step="0.01" placeholder="S/ 0.00"></label><label><span>Porcentaje fijo mensual</span><input type="number" min="0" max="100" step="0.01" placeholder="0 %"></label><label><span>Fecha de inicio *</span><input type="date"></label><label><span>Estado</span><select><option>VIGENTE</option><option>SUSPENDIDO</option><option>FINALIZADO</option></select></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="withholdings-actions"><button id="return-withholdings" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      document.getElementById('withholding-resolution-type').innerHTML = withholdingResolutionOptions;
      document.querySelectorAll('.benefits-tabs a')[0].addEventListener('click', showAdminBenefits);
      document.querySelectorAll('.benefits-tabs a')[1].addEventListener('click', showAdminBereavement);
      document.querySelectorAll('.benefits-tabs a')[3].addEventListener('click', showAdminModifications);
      document.querySelectorAll('.benefits-tabs a')[4].addEventListener('click', showAdminImproperPayments);
      document.getElementById('return-withholdings').addEventListener('click', showAdminBenefits);
      document.getElementById('withholding-resolution-type').addEventListener('change', event => {
        document.getElementById('withholding-detail-fields').hidden = !event.target.value;
        document.getElementById('withholding-detail-message').hidden = Boolean(event.target.value);
      });
      loadAssignmentRecords('.withholdings-table','retencion',[],(r,i)=>[i+1,r.numero_resolucion,r.fecha_resolucion,r.tipo_retencion,r.monto_fijo,r.porcentaje,r.estado,'']);
      document.getElementById('withholdings-form').addEventListener('submit', event => {
        event.preventDefault();const form=event.currentTarget;const main=form.querySelector('.withholdings-form-grid').querySelectorAll('select,input');const detail=form.querySelector('.ingress-form-grid').querySelectorAll('select,input');
        saveAssignmentRecord(form,'retencion',{tipo_resolucion:main[0].value,numero_resolucion:main[1].value,fecha_resolucion:main[2].value,folios:main[4].value,tipo_retencion:detail[0].value,modalidad_retencion:detail[1].value,monto_fijo:detail[2].value,porcentaje:detail[3].value,fecha_inicio:detail[4].value,estado:detail[5].value},showAdminWithholdings);
      });
      window.location.hash = 'retenciones-judiciales';
    };
    const showAdminModifications = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      benefitsMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs benefits-tabs"><a>Datos de beneficios</a><a>Subsidio por luto sepelio</a><a>Retenciones judiciales</a><a class="active">Datos de modificaciones</a><a>Pagos indebidos</a></nav><fieldset class="admin-server-card"><legend>Acciones de modificaciones</legend><div class="modifications-table"><div class="modifications-head"><span>N°</span><span>Acción</span><span>Motivo</span><span>Régimen</span><span>Resolución</span><span>Acción modificada</span><span>Resolución modificada</span><span>Estado</span><span>Acción</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 0 páginas</strong></div></div></fieldset><fieldset class="admin-server-card modification-detail"><legend>Datos de la resolución modificada</legend><p>Haga doble clic sobre un registro para ver el detalle.</p><div id="modification-selected-detail" hidden></div></fieldset><div class="modification-actions"><button id="return-modifications" type="button">← RETORNAR</button><span></span><button id="cancel-modifications" type="button">⌫ CANCELAR</button></div>`;
      document.querySelectorAll('.benefits-tabs a')[0].addEventListener('click', showAdminBenefits);
      document.querySelectorAll('.benefits-tabs a')[1].addEventListener('click', showAdminBereavement);
      document.querySelectorAll('.benefits-tabs a')[2].addEventListener('click', showAdminWithholdings);
      document.querySelectorAll('.benefits-tabs a')[4].addEventListener('click', showAdminImproperPayments);
      document.getElementById('return-modifications').addEventListener('click', showAdminBenefits);
      document.getElementById('cancel-modifications').addEventListener('click', () => {
        document.getElementById('modification-selected-detail').hidden = true;
        alert('Selección cancelada.');
      });
      window.location.hash = 'datos-modificaciones';
    };
    const showAdminImproperPayments = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      benefitsMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs benefits-tabs"><a>Datos de beneficios</a><a>Subsidio por luto sepelio</a><a>Retenciones judiciales</a><a>Datos de modificaciones</a><a class="active">Pagos indebidos</a></nav><fieldset class="admin-server-card"><legend>Registro de pagos indebidos</legend><div class="improper-table"><div class="improper-head"><span>N°</span><span>Régimen</span><span>Resolución</span><span>Motivo de pago</span><span>Monto</span><span>Estado</span><span>Acciones</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 0 páginas</strong></div></div></fieldset><form id="improper-form"><fieldset class="admin-server-card"><legend>Datos principales de la resolución</legend><div class="ingress-form-grid"><label><span>Tipo de resolución *</span><select required><option value="">Seleccione tipo de resolución</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN DIRECTORAL</option><option>RESOLUCIÓN JEFATURAL</option></select></label><label><span>Número resolución (######-año-IGED) *</span><input required placeholder="Número de resolución"></label><label><span>Fecha de resolución *</span><input required type="date"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label><span></span><label><span>Régimen laboral</span><select><option value="">Seleccione régimen laboral</option><option>LEY N° 29944</option><option>LEY N° 30512</option><option>D.L. N° 276</option><option>D.L. N° 1057 CAS</option></select></label><label><span>Acción</span><select><option value="">Seleccione acción</option><option>RECUPERACIÓN</option><option>DESCUENTO</option><option>DEVOLUCIÓN</option></select></label><label><span>Motivo acción</span><select id="improper-reason"><option value="">Seleccione motivo</option><option>PAGO EN EXCESO</option><option>PAGO DUPLICADO</option><option>PAGO SIN SUSTENTO</option><option>OTRO PAGO INDEBIDO</option></select></label></div></fieldset><fieldset class="admin-server-card ingress-detail"><legend>Detalle de la resolución</legend><p id="improper-detail-message">Seleccione el motivo acción para continuar con el formulario de registro</p><div id="improper-detail-fields" class="ingress-form-grid" hidden><label><span>Periodo inicial *</span><input type="month"></label><label><span>Periodo final *</span><input type="month"></label><label><span>Monto total *</span><input type="number" min="0" step="0.01" placeholder="S/ 0.00"></label><label><span>Número de cuotas</span><input type="number" min="1" placeholder="Cuotas"></label><label><span>Monto por cuota</span><input type="number" min="0" step="0.01" placeholder="S/ 0.00"></label><label><span>Estado</span><select><option>PENDIENTE</option><option>EN RECUPERACIÓN</option><option>CANCELADO</option></select></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="improper-actions"><button id="return-improper" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      document.querySelector('#improper-form .ingress-form-grid label select').innerHTML = ascentResolutionOptions;
      document.querySelectorAll('.benefits-tabs a')[0].addEventListener('click', showAdminBenefits);
      document.querySelectorAll('.benefits-tabs a')[1].addEventListener('click', showAdminBereavement);
      document.querySelectorAll('.benefits-tabs a')[2].addEventListener('click', showAdminWithholdings);
      document.querySelectorAll('.benefits-tabs a')[3].addEventListener('click', showAdminModifications);
      document.getElementById('return-improper').addEventListener('click', showAdminBenefits);
      document.getElementById('improper-reason').addEventListener('change', event => {
        document.getElementById('improper-detail-fields').hidden = !event.target.value;
        document.getElementById('improper-detail-message').hidden = Boolean(event.target.value);
      });
      loadAssignmentRecords('.improper-table','pago_indebido',[],(r,i)=>[i+1,r.regimen||server.regimen,r.numero_resolucion,r.motivo,r.importe,r.estado,'']);
      document.getElementById('improper-form').addEventListener('submit', event => {
        event.preventDefault();const form=event.currentTarget;const main=form.querySelectorAll('.ingress-form-grid')[0].querySelectorAll('select,input');const detail=form.querySelectorAll('.ingress-form-grid')[1].querySelectorAll('select,input');
        saveAssignmentRecord(form,'pago_indebido',{tipo_resolucion:main[0].value,numero_resolucion:main[1].value,fecha_resolucion:main[2].value,folios:main[4].value,regimen:main[5].value,accion:main[6].value,motivo:main[7].value,periodo_inicial:detail[0].value,periodo_final:detail[1].value,importe:detail[2].value,numero_cuotas:detail[3].value,monto_cuota:detail[4].value,estado:detail[5].value},showAdminImproperPayments);
      });
      window.location.hash = 'pagos-indebidos';
    };
    const showAdminPension = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      pensionMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs pension-tabs"><a class="active">Datos de sistema pensionario</a><a>Datos de ceses</a><a>CTS Nombrado o contratado</a><a>Tipo de pensión</a></nav><fieldset class="admin-server-card"><legend>Sistema pensionario del servidor</legend><div class="pension-table"><div class="pension-head"><span>N°</span><span>Régimen</span><span>AFP</span><span>Tipo comisión</span><span>CUSSP</span><span>Fecha afiliación</span><span>Fecha desafiliación</span><span>Fecha devengue</span><span>Estado</span><span>Acciones</span></div><div class="pension-row"><span>1</span><span>DECRETO LEY 25897 - SISTEMA PRIVADO DE PENSIONES</span><span>INTEGRA</span><span>POR SALDO</span><span>579931LEAON2</span><span>19/03/2021</span><span>—</span><span>31/03/2021</span><span>APROBADO</span><span><button type="button">↻</button><button type="button">−</button><button type="button">▦</button></span></div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 1 registro</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 1 página</strong></div></div></fieldset><form id="pension-form"><fieldset class="admin-server-card"><legend>Datos del sistema pensionario</legend><div class="pension-form-grid"><label><span>Régimen pensionario *</span><select required><option value="">Seleccione régimen pensionario</option><option>DECRETO LEY 25897 - SISTEMA PRIVADO DE PENSIONES</option><option>DECRETO LEY 19990 - SISTEMA NACIONAL DE PENSIONES</option><option>DECRETO LEY 20530</option><option>SIN RÉGIMEN PENSIONARIO</option></select></label><label><span>Fecha afiliación *</span><input required type="date"></label><label><span>Fecha devengue *</span><input required type="date"></label><label class="full"><span>Anotaciones</span><textarea maxlength="250" rows="3" placeholder="Anotaciones"></textarea><small>250</small></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="pension-actions"><button id="return-pension" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      const pensionGrid = document.querySelector('#pension-form .pension-form-grid');
      const pensionRegimes = '<option value="">Seleccione régimen pensionario</option><option>DECRETO LEY 20530 - REGIMEN DE PENSIONES</option><option>DECRETO LEY 25897 - SISTEMA PRIVADO DE PENSIONES</option><option>DECRETO LEY 19990 - SISTEMA NACIONAL DE PENSIONES</option>';
      const renderPensionFields = regime => {
        const isPrivate = regime === 'DECRETO LEY 25897 - SISTEMA PRIVADO DE PENSIONES';
        const is20530 = regime === 'DECRETO LEY 20530 - REGIMEN DE PENSIONES';
        const dateFields = is20530
          ? '<label><span>Fecha de vigencia *</span><input required type="date"></label>'
          : '<label><span>Fecha afiliación *</span><input required type="date"></label><label><span>Fecha devengue *</span><input required type="date"></label>';
        const privateFields = isPrivate
          ? '<label><span>AFP *</span><select required><option value="">Seleccione AFP</option><option>INTEGRA</option><option>PROFUTURO</option><option>PRIMA</option><option>HABITAT</option></select></label><label><span>Tipo de comisión *</span><select required><option value="">Seleccione tipo de comisión</option><option>POR FLUJO</option><option>MIXTA</option><option>POR SALDO</option><option>NO REGISTRADO</option></select></label><label><span>Número CUSPP *</span><input required></label>'
          : '';
        pensionGrid.innerHTML = `<label><span>Régimen pensionario *</span><select id="pension-regime" required>${pensionRegimes}</select></label>${dateFields}${privateFields}<label class="full"><span>Anotaciones</span><textarea maxlength="250" rows="3" placeholder="Anotaciones"></textarea><small>250</small></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label>`;
        const regimeSelect = document.getElementById('pension-regime');
        regimeSelect.value = regime;
        regimeSelect.addEventListener('change', event => renderPensionFields(event.target.value));
      };
      renderPensionFields('');
      const pensionTable = document.querySelector('.pension-table');
      pensionTable.addEventListener('pension-change-record', event => {
        const record = event.detail.record || {};
        const entries = Object.entries(record.datos || {}).map(([label,value]) => ({normalized:normalizeField(label),value}));
        const value = (...terms) => entries.find(entry => terms.some(term => entry.normalized === normalizeField(term)))?.value || 'No registrado';
        const escapeDetail = input => String(input ?? '').replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
        const changeModal = modal('Cambiar sistema pensionario',`<form id="pension-change-form" class="pension-change-form"><fieldset><legend>Datos del régimen pensionario a concluir</legend><div class="pension-change-current"><div><strong>Rég. pensionario</strong><span>${escapeDetail(value('Régimen pensionario'))}</span></div><div><strong>AFP</strong><span>${escapeDetail(value('AFP'))}</span></div><div><strong>Tipo de comisión</strong><span>${escapeDetail(value('Tipo de comisión'))}</span></div><div><strong>Número CUSPP</strong><span>${escapeDetail(value('Número CUSPP'))}</span></div><div><strong>Fecha afiliación</strong><span>${escapeDetail(formatTableDate(value('Fecha afiliación')))}</span></div><div><strong>Fecha devengue</strong><span>${escapeDetail(formatTableDate(value('Fecha devengue','Fecha de vigencia')))}</span></div></div></fieldset><fieldset class="pension-change-validity"><legend>Vigencia del sistema pensionario</legend><label><span>Fecha a dar por concluido <b>*</b></span><input type="date" required></label><button type="submit">▣ GUARDAR</button></fieldset></form>`,[]);
        changeModal.querySelector('.app-modal').classList.add('pension-change-modal');
        const changeForm = changeModal.querySelector('#pension-change-form');
        changeForm.addEventListener('submit',async submitEvent => {
          submitEvent.preventDefault();
          if(!changeForm.reportValidity())return;
          const date=changeForm.querySelector('input[type="date"]').value;
          const saveButton=changeForm.querySelector('button[type="submit"]');
          saveButton.disabled=true;
          try{
            const response=await fetch('api/formularios-registro.php',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:record.id,dni:server.dni,formulario:'pension-form',estado:record.estado||'APROBADO',datos:{'Fecha desafiliación':date}})});
            const result=await response.json();
            if(!response.ok||!result.ok)throw new Error(result.mensaje||'No se pudo concluir el sistema pensionario.');
            changeModal.remove();
            const pensionForm=document.getElementById('pension-form');
            delete pensionForm.dataset.dbRecordsLoading;
            await loadGenericFormRecords(pensionForm);
          }catch(error){alert(error.message||'No se pudo concluir el sistema pensionario.');}
          finally{saveButton.disabled=false;}
        });
      });
      pensionTable.addEventListener('pension-view-record', event => {
        const record = event.detail.record || {};
        const selectedRow = event.detail.row;
        const entries = Object.entries(record.datos || {}).map(([label,value]) => ({normalized:normalizeField(label),value}));
        const value = (...terms) => entries.find(entry => terms.some(term => entry.normalized === normalizeField(term)))?.value || 'No registrado';
        const escapeDetail = input => String(input ?? '').replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
        const documentPath = Array.isArray(record.documentos) ? record.documentos[0] : '';
        pensionTable.querySelectorAll('.pension-row.pension-selected').forEach(row => row.classList.remove('pension-selected'));
        selectedRow.classList.add('pension-selected');
        document.querySelector('.pension-detail-view')?.remove();
        const form = document.getElementById('pension-form');
        form.hidden = true;
        const detailView = document.createElement('div');
        detailView.className = 'pension-detail-view';
        detailView.innerHTML = `<fieldset class="admin-server-card"><legend>Datos del sistema pensionario</legend><div class="commission-detail-grid"><div><strong>Rég. pensionario</strong><span>${escapeDetail(value('Régimen pensionario'))}</span></div><div><strong>AFP</strong><span>${escapeDetail(value('AFP'))}</span></div><div><strong>Tipo de comisión</strong><span>${escapeDetail(value('Tipo de comisión'))}</span></div><div><strong>Número CUSPP</strong><span>${escapeDetail(value('Número CUSPP'))}</span></div><div><strong>Fecha afiliación</strong><span>${escapeDetail(formatTableDate(value('Fecha afiliación')))}</span></div><div><strong>Fecha desafiliación</strong><span>${escapeDetail(formatTableDate(value('Fecha desafiliación')))}</span></div><div><strong>Fecha devengue</strong><span>${escapeDetail(formatTableDate(value('Fecha devengue','Fecha de vigencia')))}</span></div><div class="commission-detail-full"><strong>Anotaciones</strong><span>${escapeDetail(value('Anotaciones'))}</span></div><div><strong>Documento *</strong><input class="pension-detail-file" type="file" accept="application/pdf"><small>Formato: PDF, Peso: máximo 2MB</small></div><div><strong>Folios</strong><span>${escapeDetail(value('Folios'))}</span></div></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="commission-detail-actions"><button type="button" class="pension-detail-return">← RETORNAR</button><button type="button" class="pension-detail-cancel">⌫ CANCELAR</button></div>`;
        form.insertAdjacentElement('beforebegin',detailView);
        const pensionFileInput = detailView.querySelector('.pension-detail-file');
        const pensionAddFile = document.createElement('button');
        pensionAddFile.type = 'button';
        pensionAddFile.className = 'pension-detail-add-file';
        pensionAddFile.textContent = '↥ AGREGAR ARCHIVO...';
        pensionFileInput.hidden = true;
        pensionFileInput.insertAdjacentElement('beforebegin',pensionAddFile);
        pensionAddFile.addEventListener('click',() => pensionFileInput.click());
        pensionFileInput.addEventListener('change',() => {
          pensionAddFile.textContent = pensionFileInput.files[0]?.name || '↥ AGREGAR ARCHIVO...';
        });
        const closeDetail = () => {
          selectedRow.classList.remove('pension-selected');
          detailView.remove();
          form.hidden = false;
        };
        detailView.querySelector('.pension-detail-return').addEventListener('click',closeDetail);
        detailView.querySelector('.pension-detail-cancel').addEventListener('click',closeDetail);
      });
      document.getElementById('return-pension').addEventListener('click', () => { window.location.href = 'gestion-servidor.html'; });
      document.getElementById('pension-form').addEventListener('submit', event => { event.preventDefault(); alert('Datos del sistema pensionario guardados correctamente.'); });
      document.querySelectorAll('.pension-tabs a')[1].addEventListener('click', showAdminCessations);
      document.querySelectorAll('.pension-tabs a')[2].addEventListener('click', showAdminCts);
      document.querySelectorAll('.pension-tabs a')[3].addEventListener('click', showAdminPensionType);
      window.location.hash = 'retiro';
    };
    const showAdminCessations = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      pensionMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs pension-tabs"><a>Datos de sistema pensionario</a><a class="active">Datos de ceses</a><a>CTS Nombrado o contratado</a><a>Tipo de pensión</a></nav><fieldset class="admin-server-card"><legend>Registros de ceses definitivos</legend><div class="cessations-table"><div class="cessations-head"><span>N°</span><span>Acción</span><span>Motivo</span><span>Régimen</span><span>Resolución</span><span>F. cese</span><span>Estado</span><span>Acciones</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 0 páginas</strong></div></div></fieldset><form id="cessations-form"><fieldset class="admin-server-card"><legend>Datos principales de la resolución</legend><div class="ingress-form-grid"><label><span>Tipo de resolución *</span><select required><option value="">Seleccione tipo de resolución</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN DIRECTORAL</option><option>RESOLUCIÓN JEFATURAL</option></select></label><label><span>Número resolución (######-año-IGED) *</span><input required placeholder="Número de resolución"></label><label><span>Fecha de resolución *</span><input required type="date"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label><span></span><label><span>Régimen laboral</span><select><option value="">Seleccione régimen laboral</option><option>LEY N° 29944</option><option>LEY N° 30512</option><option>D.L. N° 276</option><option>D.L. N° 1057 CAS</option></select></label><label><span>Acción</span><select><option value="">Seleccione acción</option><option>CESE DEFINITIVO</option><option>RETIRO</option><option>DESTITUCIÓN</option></select></label><label><span>Motivo acción</span><select id="cessation-reason"><option value="">Seleccione motivo</option><option>LÍMITE DE EDAD</option><option>RENUNCIA</option><option>FALLECIMIENTO</option><option>INCAPACIDAD PERMANENTE</option><option>DESTITUCIÓN</option></select></label></div></fieldset><fieldset class="admin-server-card ingress-detail"><legend>Detalle de la resolución</legend><p id="cessation-detail-message">Seleccione el motivo acción para continuar con el formulario de registro</p><div id="cessation-detail-fields" class="ingress-form-grid" hidden><label><span>Fecha de cese *</span><input type="date"></label><label><span>Fecha de notificación</span><input type="date"></label><label><span>Tiempo de servicios</span><input placeholder="Años, meses y días"></label><label><span>Situación final</span><select><option>CESADO</option><option>RETIRADO</option><option>DESTITUIDO</option></select></label><label><span>Estado</span><select><option>APROBADO</option><option>MODIFICADO</option><option>ANULADO</option></select></label><label><span>Observaciones</span><input placeholder="Observaciones"></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="cessations-actions"><button id="return-cessations" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      document.querySelector('#cessations-form .ingress-form-grid label select').innerHTML = ascentResolutionOptions;
      const cessationRegime = [...document.querySelectorAll('#cessations-form .ingress-form-grid label')].find(label => label.querySelector('span')?.textContent.trim() === 'Régimen laboral')?.querySelector('select');
      cessationRegime.innerHTML = '<option value="">Seleccione régimen laboral</option><option>LEY 24029 - LEY DEL PROFESORADO</option><option>LEY 29944 - LEY DE REFORMA MAGISTERIAL</option>';
      cessationRegime.required = true;
      cessationRegime.closest('label').querySelector('span').textContent = 'Régimen laboral *';
      const cessationAction = [...document.querySelectorAll('#cessations-form .ingress-form-grid label')].find(label => label.querySelector('span')?.textContent.trim() === 'Acción')?.querySelector('select');
      const cessationReason = document.getElementById('cessation-reason');
      const cessationDetailFields = document.getElementById('cessation-detail-fields');
      const cessationDetailMessage = document.getElementById('cessation-detail-message');
      cessationAction.required = true;
      cessationReason.required = true;
      cessationAction.closest('label').querySelector('span').textContent = 'Acción *';
      cessationReason.closest('label').querySelector('span').textContent = 'Motivo acción *';
      const cessationActions = {
        'LEY 24029 - LEY DEL PROFESORADO': [['CESE_DEFINITIVO_GENERAL','CESE DEFINITIVO'],['CESE_DEFINITIVO_RENUNCIA','CESE DEFINITIVO'],['DESTITUCIÓN','DESTITUCIÓN']],
        'LEY 29944 - LEY DE REFORMA MAGISTERIAL': [['CESE_DEFINITIVO_29944','CESE DEFINITIVO']]
      };
      const cessationReasons = {
        'CESE_DEFINITIVO_GENERAL': ['CESE A SOLICITUD','CESE POR FALLECIMIENTO','CESE POR INCAPACIDAD FISICA O MENTAL','CESE POR LIMITE DE EDAD','RETIRO DEL SERVICIO POR LA 2da. DISPOSICIÓN COMPLEMENTARIA'],
        'CESE_DEFINITIVO_RENUNCIA': ['RENUNCIA'],
        'CESE_DEFINITIVO_29944': ['DESTITUCIÓN','FALLECIMIENTO','INCAPACIDAD PERMANENTE(FISICA O MENTAL)','LIMITE DE EDAD','NO HABER APROBADO LA EVALUACIÓN DE DESEMPEÑO DOCENTE','RENUNCIA'],
        'DESTITUCIÓN': ['SANCIÓN']
      };
      const renderCessationDetail = () => {
        const reason = cessationReason.value;
        if (!reason) {
          cessationDetailFields.hidden = true;
          cessationDetailMessage.hidden = false;
          cessationDetailFields.innerHTML = '';
          return;
        }
        const serviceRequired = !['RENUNCIA','NO HABER APROBADO LA EVALUACIÓN DE DESEMPEÑO DOCENTE'].includes(reason);
        const requiredMark = serviceRequired ? ' *' : '';
        const requiredAttribute = serviceRequired ? ' required' : '';
        cessationDetailFields.innerHTML = `<label><span>Fecha de cese *</span><input required type="date"></label><fieldset class="cessation-service-time"><legend>Tiempo de servicio</legend><div><label><span>Años${requiredMark}</span><input${requiredAttribute} type="number" min="0"></label><label><span>Meses${requiredMark}</span><input${requiredAttribute} type="number" min="0" max="11"></label><label><span>Días${requiredMark}</span><input${requiredAttribute} type="number" min="0" max="31"></label></div></fieldset><label class="full cessation-notes"><span>Anotaciones</span><textarea maxlength="250" rows="3" placeholder="Anotaciones"></textarea><small>250</small></label>`;
        cessationDetailFields.hidden = false;
        cessationDetailMessage.hidden = true;
      };
      const renderCessationReasons = () => {
        const reasons = cessationReasons[cessationAction.value] || [];
        cessationReason.innerHTML = '<option value="">Seleccione motivo</option>' + reasons.map(reason => `<option>${reason}</option>`).join('');
        if (reasons.length === 1) cessationReason.value = reasons[0];
        renderCessationDetail();
      };
      const renderCessationActions = () => {
        const actions = cessationActions[cessationRegime.value] || [];
        cessationAction.innerHTML = '<option value="">Seleccione acción</option>' + actions.map(([value,label]) => `<option value="${value}">${label}</option>`).join('');
        if (actions.length === 1) cessationAction.value = actions[0][0];
        renderCessationReasons();
      };
      cessationRegime.addEventListener('change', renderCessationActions);
      cessationAction.addEventListener('change', renderCessationReasons);
      renderCessationActions();
      document.querySelectorAll('.pension-tabs a')[0].addEventListener('click', showAdminPension);
      document.querySelectorAll('.pension-tabs a')[2].addEventListener('click', showAdminCts);
      document.querySelectorAll('.pension-tabs a')[3].addEventListener('click', showAdminPensionType);
      document.getElementById('return-cessations').addEventListener('click', showAdminPension);
      cessationReason.addEventListener('change', renderCessationDetail);
      document.getElementById('cessations-form').addEventListener('reset', () => setTimeout(renderCessationActions));
      document.querySelector('.cessations-table').addEventListener('cessation-edit-record', event => {
        const record = event.detail.record || {};
        const modification = modal('Modificatoria de la acción', `<div class="action-modification cessation-modification"><label class="modification-action-type"><span>Tipo de acción <b>*</b></span><select id="cessation-modification-action" required><option value="">Seleccione tipo de acción</option><option>DECLARAR NULO</option><option>DEJAR SIN EFECTO</option><option>MODIFICAR / RECTIFICAR</option></select></label><fieldset><legend>Datos de la resolución a modificar</legend><div class="modification-current-data"><div><strong>Tipo de resolución</strong><span>${record.tipoResolucion || 'RESOLUCIÓN DIRECTORAL REGIONAL'}</span></div><div><strong>Número de resolución</strong><span>${record.resolucion || 'No registrado'}</span></div><div><strong>Fecha de resolución</strong><span>${record.fechaResolucion || 'No registrado'}</span></div><div><strong>Régimen</strong><span>${record.regimen || server.regimen || 'No registrado'}</span></div><div><strong>Acción</strong><span>${record.accion || 'No registrado'}</span></div><div><strong>Motivo acción</strong><span>${record.motivo || 'No registrado'}</span></div></div></fieldset><fieldset><legend>Datos principales de la resolución de modificatoria</legend><div class="modification-form-grid"><label><span>Tipo de resolución <b>*</b></span><select required>${ascentResolutionOptions}</select></label><label><span>Número resolución (######-año-IGED) <b>*</b></span><input required placeholder="Número de resolución"></label><label><span>Fecha resolución <b>*</b></span><input required type="date"></label><label><span>Documento <b>*</b></span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div></fieldset><fieldset><legend>Detalle de la resolución de modificatoria</legend><p id="cessation-modification-message">Seleccione un tipo de acción para continuar con el formulario de registro</p><div id="cessation-modification-detail" hidden><div id="cessation-rectification-fields" class="cessation-rectification-fields" hidden><label><span>Campo a modificar</span><select id="cessation-field"><option value=""></option><option>AÑOS</option><option>APELLIDO MATERNO DEL SERVIDOR</option><option>APELLIDO PATERNO DEL SERVIDOR</option><option>DÍAS</option><option>FECHA DE CESE</option><option>MESES</option><option>NOMBRES DEL SERVIDOR</option></select></label><div class="cessation-says"><span>Dice</span><strong id="cessation-current-value">—</strong></div><label><span>Debe decir <b>*</b></span><input id="cessation-new-value" required></label><button id="cessation-add-change" type="button">✚ AGREGAR</button><div id="cessation-added-changes" class="cessation-added-changes"></div></div><label class="modification-notes"><span>Anotaciones</span><span class="modification-count">250</span><textarea maxlength="250" placeholder="Anotaciones"></textarea></label></div></fieldset></div>`, [{label:'Cancelar'}, {label:'Guardar', primary:true, run:close => close()}]);
        modification.querySelector('.app-modal').classList.add('action-modification-modal');
        const type = modification.querySelector('#cessation-modification-action');
        const message = modification.querySelector('#cessation-modification-message');
        const detail = modification.querySelector('#cessation-modification-detail');
        const rectification = modification.querySelector('#cessation-rectification-fields');
        const field = modification.querySelector('#cessation-field');
        const currentValue = modification.querySelector('#cessation-current-value');
        const newValue = modification.querySelector('#cessation-new-value');
        const addedChanges = modification.querySelector('#cessation-added-changes');
        const timeValue = unit => record[unit] || String(record.tiempo || '').match(new RegExp(`(\\d+)\\s*${unit === 'anios' ? 'AÑOS' : unit === 'meses' ? 'MESES' : 'DÍAS'}`,'i'))?.[1] || '0';
        const currentValues = {
          'AÑOS': timeValue('anios'),
          'APELLIDO MATERNO DEL SERVIDOR': server.segundoApellido || 'No registrado',
          'APELLIDO PATERNO DEL SERVIDOR': server.primerApellido || 'No registrado',
          'DÍAS': timeValue('dias'),
          'FECHA DE CESE': record.fechaCese || 'No registrado',
          'MESES': timeValue('meses'),
          'NOMBRES DEL SERVIDOR': server.nombres || 'No registrado'
        };
        type.addEventListener('change', () => {
          const selected = Boolean(type.value);
          message.hidden = selected;
          detail.hidden = !selected;
          rectification.hidden = type.value !== 'MODIFICAR / RECTIFICAR';
        });
        field.addEventListener('change', () => {
          currentValue.textContent = currentValues[field.value] ?? '—';
          newValue.type = field.value === 'FECHA DE CESE' ? 'date' : field.value === 'AÑOS' || field.value === 'MESES' || field.value === 'DÍAS' ? 'number' : 'text';
          newValue.value = '';
        });
        modification.querySelector('#cessation-add-change').addEventListener('click', () => {
          if (!field.value || !newValue.value.trim()) { alert('Seleccione el campo e ingrese el nuevo valor.'); return; }
          const item = document.createElement('div');
          item.innerHTML = `<strong>${field.value}</strong><span>${currentValue.textContent} → ${newValue.value}</span>`;
          addedChanges.appendChild(item);
          newValue.value = '';
        });
      });
      document.getElementById('cessations-form').addEventListener('submit', event => { event.preventDefault(); alert('Cese guardado correctamente.'); });
      window.location.hash = 'datos-ceses';
    };
    const showAdminCts = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      pensionMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs pension-tabs"><a>Datos de sistema pensionario</a><a>Datos de ceses</a><a class="active">CTS nombrado o contratado</a><a>Tipo de pensión</a></nav><fieldset class="admin-server-card"><legend>Registros de CTS nombrado o contratado</legend><div class="cts-table"><div class="cts-head"><span>N°</span><span>Acción</span><span>Motivo</span><span>Régimen</span><span>Resolución</span><span>F. cese</span><span>Tiempo de servicio</span><span>Estado</span><span>Acciones</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 0 páginas</strong></div></div></fieldset><form id="cts-form"><fieldset class="admin-server-card"><legend>Datos principales de la resolución</legend><div class="ingress-form-grid"><label><span>Tipo de resolución *</span><select required><option value="">Seleccione tipo de resolución</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN DIRECTORAL</option><option>RESOLUCIÓN JEFATURAL</option></select></label><label><span>Número resolución (######-año-IGED) *</span><input required placeholder="Número de resolución"></label><label><span>Fecha de resolución *</span><input required type="date"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label><span></span><label><span>Régimen laboral</span><select><option value="">Seleccione régimen laboral</option><option>LEY N° 29944</option><option>LEY N° 30512</option><option>D.L. N° 276</option><option>D.L. N° 1057 CAS</option></select></label><label><span>Acción</span><select><option value="">Seleccione acción</option><option>RECONOCIMIENTO DE CTS</option><option>LIQUIDACIÓN DE CTS</option><option>PAGO DE CTS</option></select></label><label><span>Motivo acción</span><select id="cts-reason"><option value="">Seleccione motivo</option><option>CESE DEFINITIVO</option><option>TÉRMINO DE CONTRATO</option><option>RENUNCIA</option><option>FALLECIMIENTO</option></select></label></div></fieldset><fieldset class="admin-server-card ingress-detail"><legend>Detalle de la resolución</legend><p id="cts-detail-message">Seleccione el motivo acción para continuar con el formulario de registro</p><div id="cts-detail-fields" class="ingress-form-grid" hidden><label><span>Fecha de cese *</span><input type="date"></label><label><span>Tiempo de servicios *</span><input placeholder="Años, meses y días"></label><label><span>Remuneración computable *</span><input type="number" min="0" step="0.01" placeholder="S/ 0.00"></label><label><span>Monto de CTS *</span><input type="number" min="0" step="0.01" placeholder="S/ 0.00"></label><label><span>Tipo de servidor</span><select><option>NOMBRADO</option><option>CONTRATADO</option></select></label><label><span>Estado</span><select><option>APROBADO</option><option>PENDIENTE</option><option>ANULADO</option></select></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="cts-actions"><button id="return-cts" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      document.querySelector('#cts-form .ingress-form-grid label select').innerHTML = ascentResolutionOptions;
      document.querySelectorAll('.pension-tabs a')[0].addEventListener('click', showAdminPension);
      document.querySelectorAll('.pension-tabs a')[1].addEventListener('click', showAdminCessations);
      document.querySelectorAll('.pension-tabs a')[3].addEventListener('click', showAdminPensionType);
      document.getElementById('return-cts').addEventListener('click', showAdminPension);
      document.getElementById('cts-reason').addEventListener('change', event => {
        document.getElementById('cts-detail-fields').hidden = !event.target.value;
        document.getElementById('cts-detail-message').hidden = Boolean(event.target.value);
      });
      document.getElementById('cts-form').addEventListener('submit', event => { event.preventDefault(); alert('CTS guardada correctamente.'); });
      window.location.hash = 'cts';
    };
    const showAdminPensionType = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      pensionMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs pension-tabs"><a>Datos de sistema pensionario</a><a>Datos de ceses</a><a>CTS nombrado o contratado</a><a class="active">Tipo de pensión</a></nav><fieldset class="admin-server-card"><legend>Registros del tipo de pensión</legend><div class="pension-type-table"><div class="pension-type-head"><span>N°</span><span>Tipo de pensión</span><span>Nro. resolución</span><span>Fecha resolución</span><span>Tipo de pensionista</span><span>Beneficiario</span><span>Estado</span><span>Acciones</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 0 páginas</strong></div></div></fieldset><form id="pension-type-form"><fieldset class="admin-server-card"><legend>Datos principales de la resolución</legend><div class="pension-form-grid"><label><span>Tipo de resolución *</span><select required><option value="">Seleccione tipo de resolución</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN DIRECTORAL</option><option>RESOLUCIÓN JEFATURAL</option><option>RESOLUCIÓN ADMINISTRATIVA</option></select></label><label><span>Número de resolución *</span><input required placeholder="Número de resolución"></label><label><span>Fecha de la resolución *</span><input required type="date"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label><span></span><label><span>Tipo de pensión *</span><select required><option value="">Seleccione tipo de pensión</option><option>JUBILACIÓN</option><option>CESANTÍA</option><option>INVALIDEZ</option><option>SOBREVIVENCIA</option><option>VIUDEZ</option><option>ORFANDAD</option><option>ASCENDENCIA</option></select></label><label><span>Tipo de pensionista *</span><select id="pensioner-type" required><option value="">Seleccione tipo de pensionista</option><option>TITULAR</option><option>BENEFICIARIO</option><option>SOBREVIVIENTE</option></select></label><span></span><label id="pension-beneficiary-field" class="full" hidden><span>Beneficiario *</span><input placeholder="Apellidos y nombres del beneficiario"></label><label class="full"><span>Anotaciones</span><textarea maxlength="250" rows="3" placeholder="Anotaciones"></textarea><small>250</small></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="pension-actions"><button id="return-pension-type" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      document.querySelector('#pension-type-form .pension-form-grid label select').innerHTML = meritResolutionOptions;
      const pensionTypeGrid = document.querySelector('#pension-type-form .pension-form-grid');
      const pensionKindSelect = [...pensionTypeGrid.querySelectorAll('label')].find(label => label.querySelector('span')?.textContent.trim() === 'Tipo de pensión *')?.querySelector('select');
      pensionKindSelect.id = 'pension-kind';
      pensionKindSelect.innerHTML = '<option value=""></option><option>PENSIÓN DEFINITIVA</option><option>PENSIÓN PROVISIONAL</option>';
      const pensionerType = document.getElementById('pensioner-type');
      pensionerType.innerHTML = '<option value=""></option><option>FALLECIDO</option><option>TITULAR</option>';
      const beneficiaryField = document.getElementById('pension-beneficiary-field');
      beneficiaryField.classList.remove('full');
      beneficiaryField.innerHTML = '<span>Beneficiario *</span><select id="pension-beneficiary"><option value=""></option></select>';
      beneficiaryField.insertAdjacentHTML('beforebegin','<label id="survivor-pension-field" hidden><span>Pensión de sobrevivencia *</span><select id="survivor-pension"><option value=""></option><option>PENSIÓN ASCENDENCIA</option><option>PENSIÓN ORFANDAD</option><option>PENSIÓN VIUDEZ</option></select></label>');
      document.querySelectorAll('.pension-tabs a')[0].addEventListener('click', showAdminPension);
      document.querySelectorAll('.pension-tabs a')[1].addEventListener('click', showAdminCessations);
      document.querySelectorAll('.pension-tabs a')[2].addEventListener('click', showAdminCts);
      document.getElementById('return-pension-type').addEventListener('click', showAdminPension);
      document.getElementById('pensioner-type').addEventListener('change', event => {
        const survivorField = document.getElementById('survivor-pension-field');
        const survivorSelect = document.getElementById('survivor-pension');
        const isDeceased = event.target.value === 'FALLECIDO';
        survivorField.hidden = !isDeceased;
        survivorSelect.required = isDeceased;
        if (!isDeceased) survivorSelect.value = '';
        survivorSelect.dispatchEvent(new Event('change'));
      });
      document.getElementById('survivor-pension').addEventListener('change', event => {
        const field = document.getElementById('pension-beneficiary-field');
        const select = document.getElementById('pension-beneficiary');
        const relation = event.target.value;
        const needsBeneficiary = ['PENSIÓN ASCENDENCIA','PENSIÓN ORFANDAD','PENSIÓN VIUDEZ'].includes(relation);
        const family = Array.isArray(server.familiares) ? server.familiares : [];
        const matches = family.filter(person => {
          const kinship = String(person.parentesco || '').toUpperCase();
          if (relation === 'PENSIÓN ASCENDENCIA') return /PADRE|MADRE/.test(kinship);
          if (relation === 'PENSIÓN ORFANDAD') return /HIJO|HIJA|HIJO\(A\)/.test(kinship);
          return /CONYUGE|CONYUGUE|CÓNYUGE|ESPOS|PAREJA/.test(kinship);
        });
        select.innerHTML = '<option value=""></option>' + matches.map(person => `<option>${person.nombre}</option>`).join('');
        field.hidden = !needsBeneficiary;
        select.required = needsBeneficiary;
        if (!needsBeneficiary) select.value = '';
      });
      document.getElementById('pension-type-form').addEventListener('reset', () => {
        document.getElementById('survivor-pension-field').hidden = true;
        document.getElementById('pension-beneficiary-field').hidden = true;
        document.getElementById('survivor-pension').required = false;
        document.getElementById('pension-beneficiary').required = false;
      });
      document.getElementById('pension-type-form').addEventListener('submit', async event => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.reportValidity()) return;
        const labelControl = text => [...form.querySelectorAll('label')].find(label => label.querySelector('span')?.textContent.trim() === text)?.querySelector('input,select,textarea');
        const data = new FormData();
        data.append('codmod',server.codigoAnterior || server.codigo || '');
        data.append('dni',server.dni || '');
        data.append('tipo_resolucion',labelControl('Tipo de resolución *')?.value || '');
        data.append('numero_resolucion',labelControl('Número de resolución *')?.value || '');
        data.append('fecha_resolucion',labelControl('Fecha de la resolución *')?.value || '');
        data.append('documento',labelControl('Documento *')?.files?.[0] || '');
        data.append('folios',labelControl('Folios')?.value || '');
        data.append('tipo_pension',document.getElementById('pension-kind').value);
        data.append('tipo_pensionista',document.getElementById('pensioner-type').value);
        data.append('pension_sobrevivencia',document.getElementById('survivor-pension').value);
        data.append('beneficiario',document.getElementById('pension-beneficiary').value);
        data.append('anotaciones',labelControl('Anotaciones')?.value || '');
        const saveButton = form.querySelector('button[type="submit"]');
        saveButton.disabled = true;
        try {
          const response = await fetch('api/tipo-pension.php',{method:'POST',body:data});
          const result = await response.json();
          if (!response.ok || !result.ok) throw new Error(result.mensaje || 'No se pudo guardar el registro.');
          if (!Array.isArray(server.tiposPension)) server.tiposPension = [];
          server.tiposPension.unshift(result.registro);
          const table = adminContent.querySelector('.pension-type-table');
          if (table) delete table.dataset.realDataHydrated;
          hydrateRealServerRecords();
          form.reset();
          alert(result.mensaje);
        } catch (error) {
          alert(error.message || 'No se pudo guardar el tipo de pensión.');
        } finally {
          saveButton.disabled = false;
        }
      });
      window.location.hash = 'tipo-pension';
    };
    const meritResolutionOptions = '<option value="">Seleccione tipo de resolución</option><option>DECRETO DIRECTORAL</option><option>RESOLUCION ADMINISTRATIVA</option><option>RESOLUCION ADMINISTRATIVA DIRECTORAL</option><option>RESOLUCION DE ALCALDIA</option><option>RESOLUCION DE GERENCIA REGIONAL</option><option>RESOLUCION DE GERENCIA SECTORIAL REGIONAL</option><option>RESOLUCION DE LA DIRECCION DEPARTAMENTAL</option><option>RESOLUCION DE SECRETARIA GENERAL</option><option>RESOLUCION DEL ORGANO INSTRUCTOR</option><option>RESOLUCION DEL ORGANO SANCIONADOR</option><option>RESOLUCION DIRECTORAL</option><option>RESOLUCION DIRECTORAL ADMINISTRATIVA</option><option>RESOLUCION DIRECTORAL REGIONAL</option><option>RESOLUCION DIRECTORAL REGIONAL SECTORIAL</option><option>RESOLUCION DIRECTORAL SUB REGIONAL</option><option>RESOLUCION DIRECTORAL SUB REGIONAL SECTORIAL</option><option>RESOLUCION DIRECTORAL SUPERIOR</option><option>RESOLUCION DIRECTORAL USE</option><option>RESOLUCION DIRECTORAL ZONAL</option><option>RESOLUCION EJECUTIVA REGIONAL</option><option>RESOLUCION JEFATURAL</option><option>RESOLUCION JUDICIAL</option><option>RESOLUCION MINISTERIAL</option><option>RESOLUCION REGIONAL SECTORIAL</option><option>RESOLUCION SECTORIAL REGIONAL</option><option>RESOLUCION SERVIR</option><option>RESOLUCION SUPREMA</option><option>RESOLUCION VICEMINISTERIAL</option>';
    const showAdminAwards = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      awardsMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs awards-tabs"><a class="active">Gestionar datos de méritos</a><a>Viajes de estudios becas y pasantías</a></nav><fieldset class="admin-server-card"><legend>Registros de méritos</legend><div class="awards-table"><div class="awards-head"><span>N°</span><span>Tipo de mérito</span><span>Mérito</span><span>Instancia</span><span>Entidad emisora</span><span>F. inicio</span><span>Resolución</span><span>Estado</span><span>Acciones</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 0 páginas</strong></div></div></fieldset><form id="awards-form"><fieldset class="admin-server-card"><legend>Datos principales de la resolución</legend><div class="awards-form-grid"><label><span>Tipo de resolución *</span><select required><option value="">Seleccione tipo de resolución</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN DIRECTORAL</option><option>RESOLUCIÓN JEFATURAL</option></select></label><label><span>Número de resolución (######-año-IGED)</span><input placeholder="Número de resolución"></label><label><span>Fecha de resolución *</span><input required type="date"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div></fieldset><fieldset class="admin-server-card"><legend>Detalle de la resolución</legend><div class="awards-form-grid"><label><span>Tipo de mérito *</span><select required><option value="">Seleccione tipo de mérito</option><option>RECONOCIMIENTO</option><option>FELICITACIÓN</option><option>CONDECORACIÓN</option><option>PREMIO</option></select></label><label><span>Mérito</span><select><option value="">Seleccione mérito</option><option>DESEMPEÑO DESTACADO</option><option>INNOVACIÓN PEDAGÓGICA</option><option>TRAYECTORIA PROFESIONAL</option><option>APORTE INSTITUCIONAL</option></select></label><span></span><label><span>Instancia *</span><select required><option value="">Seleccione instancia</option><option>MINEDU</option><option>DRE HUANCAVELICA</option><option>UGEL</option><option>INSTITUCIÓN EDUCATIVA</option></select></label><label><span>Entidad emisora</span><input placeholder="Entidad emisora"></label><label><span>Fecha de inicio</span><input type="date"></label><label class="full"><span>Anotaciones</span><textarea maxlength="250" rows="3" placeholder="Anotaciones"></textarea><small>250</small></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="awards-actions"><button id="return-awards" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      document.querySelector('#awards-form .awards-form-grid label select').innerHTML = meritResolutionOptions;
      const awardDetailGrid = document.querySelectorAll('#awards-form .awards-form-grid')[1];
      const awardTypeOptions = '<option value=""></option><option>FELICITACIONES</option><option>CONDECORACIONES</option><option>RECONOCIMIENTO</option><option>RECONOCIMIENTO Y FELICITACIÓN</option>';
      const recognitionInstanceOptions = '<option value=""></option><option>MINEDU</option><option>OTRA INSTANCIA</option><option>REGION</option>';
      const regionOptions = '<option value=""></option><option>AMAZONAS</option><option>ANCASH</option><option>APURIMAC</option><option>AREQUIPA</option><option>AYACUCHO</option><option>CAJAMARCA</option><option>CALLAO</option><option>CUSCO</option><option>HUANCAVELICA</option><option>HUANUCO</option><option>ICA</option><option>JUNIN</option><option>LA LIBERTAD</option><option>LAMBAYEQUE</option><option>LIMA</option><option>LORETO</option><option>MADRE DE DIOS</option><option>MOQUEGUA</option><option>NO DEFINIDO</option><option>PASCO</option><option>PIURA</option><option>PUNO</option><option>SAN MARTIN</option><option>TACNA</option><option>TUMBES</option><option>UCAYALI</option>';
      const awardIgedByRegion = {
        'AMAZONAS':['DIRECCIÓN REGIONAL DE EDUCACIÓN AMAZONAS','UGEL INTERCULTURAL BILINGÜE CENEPA','UGEL INTERCULTURAL BILINGÜE RIO SANTIAGO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL BAGUA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL BONGARÁ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHACHAPOYAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CONDORCANQUI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL IBIR-IMAZA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LUYA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL RODRÍGUEZ DE MENDOZA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL UTCUBAMBA'],
        'ANCASH':['DIRECCIÓN REGIONAL DE EDUCACIÓN ANCASH','UNIDAD DE GESTIÓN EDUCATIVA LOCAL AIJA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ANTONIO RAYMONDI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ASUNCIÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL BOLOGNESI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CARHUAZ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CARLOS FERMIN FITZCARRALD','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CASMA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CORONGO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUARAZ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUARI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUARMEY','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUAYLAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MARISCAL LUZURIAGA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL OCROS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PALLASCA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL POMABAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL RECUAY','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SANTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SIHUAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL YUNGAY'],
        'APURIMAC':['DIRECCIÓN REGIONAL DE EDUCACIÓN APURÍMAC','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ABANCAY','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ANDAHUAYLAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ANTABAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL AYMARAES','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHINCHEROS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL COTABAMBAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL GRAU','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCARAMA'],
        'AREQUIPA':['COLEGIO MILITAR FRANCISCO BOLOGNESI','DIRECCIÓN REGIONAL DE EDUCACIÓN AREQUIPA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL AREQUIPA NORTE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL AREQUIPA SUR','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CAMANÁ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CARAVELÍ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CASTILLA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CAYLLOMA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CONDESUYOS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ISLAY','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LA JOYA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LA UNIÓN'],
        'AYACUCHO':['DIRECCIÓN REGIONAL DE EDUCACIÓN AYACUCHO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CANGALLO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUAMANGA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCASANCOS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LA MAR','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LUCANAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PARINACOCHAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PAUCAR DEL SARASARA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SUCRE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL VICTOR FAJARDO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL VILCASHUAMÁN'],
        'CAJAMARCA':['DIRECCIÓN REGIONAL DE EDUCACIÓN CAJAMARCA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CAJABAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CAJAMARCA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CELENDÍN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHOTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CONTUMAZÁ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CUTERVO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUALGAYOC','UNIDAD DE GESTIÓN EDUCATIVA LOCAL JAEN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN IGNACIO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN MARCOS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN MIGUEL','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN PABLO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SANTA CRUZ'],
        'CALLAO':['DIRECCIÓN REGIONAL DE EDUCACIÓN CALLAO','MILITAR LEONCIO PRADO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL VENTANILLA'],
        'CUSCO':['DIRECCIÓN REGIONAL DE EDUCACIÓN CUSCO','ESCUELA DE BELLAS ARTES DIEGO QUISPE TITO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ACOMAYO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ANTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CALCA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CANAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CANCHIS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHUMBIVILCAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CUSCO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ESPINAR','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LA CONVENCIÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PARURO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PAUCARTAMBO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PICHARI-KIMBIRI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL QUISPICANCHI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL URUBAMBA'],
        'HUANCAVELICA':['DIRECCIÓN REGIONAL DE EDUCACIÓN HUANCAVELICA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ACOBAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ANGARAES','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CASTROVIRREYNA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHURCAMPA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCAVELICA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUAYTARÁ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SURCUBAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TAYACAJA'],
        'HUANUCO':['DIRECCIÓN REGIONAL DE EDUCACIÓN HUÁNUCO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL AMBO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL DOS DE MAYO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUACAYBAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUAMALÍES','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUÁNUCO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LAURICOCHA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LEONCIO PRADO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MARAÑÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PACHITEA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PUERTO INCA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL YAROWILCA'],
        'ICA':['DIRECCIÓN REGIONAL DE EDUCACIÓN ICA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHINCHA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ICA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL NAZCA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PALPA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PISCO'],
        'JUNIN':['DIRECCIÓN REGIONAL DE EDUCACIÓN JUNÍN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHANCHAMAYO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHUPACA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CONCEPCIÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCAYO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL JAUJA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL JUNIN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PANGOA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PICHANAQUI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL RIO ENE - MANTARO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL RIO TAMBO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SATIPO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TARMA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL YAULI'],
        'LA LIBERTAD':['COLEGIO MILITAR RAMON CASTILLA','DIRECCIÓN REGIONAL DE EDUCACIÓN LA LIBERTAD','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 01 EL PORVENIR','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 02 LA ESPERANZA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 03 TRUJILLO NOR OESTE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 04 TRUJILLO SUR ESTE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ASCOPE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL BOLÍVAR','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHEPÉN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL GRAN CHIMÚ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL JULCÁN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL OTUZCO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PACASMAYO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PATAZ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SÁNCHEZ CARRIÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SANTIAGO DE CHUCO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TRUJILLO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL VIRÚ'],
        'LAMBAYEQUE':['COLEGIO MILITAR ELIAS AGUIRRE','DIRECCIÓN REGIONAL DE EDUCACIÓN LAMBAYEQUE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHICLAYO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL FERREÑAFE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LAMBAYEQUE'],
        'LIMA':['CENTRO DE ADMINISTRACION DE SERVICIOS EDUCATIVOS (FAP-UE005)','COLEGIO MILITAR LEONCIO PRADO','COPERE (EP-UE003)','DIRECCION DE BIENESTAR DE LA MARINA (MGP-UE004)','DIRECCIÓN REGIONAL DE EDUCACIÓN LIMA METROPOLITANA','DIRECCIÓN REGIONAL DE EDUCACIÓN LIMA PROVINCIAS','INSTITUTO PEDAGÓGICO NACIONAL DE MONTERRICO','MINISTERIO DE DEFENSA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 01 SAN JUAN DE MIRAFLORES','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 02 RÍMAC','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 03 BREÑA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 04 COMAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 05 SAN JUAN DE LURIGANCHO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 06 ATE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 07 SAN BORJA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 08 CAÑETE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 09 HUAURA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 10 HUARAL','UNIDAD DE GESTIÓN EDUCATIVA LOCAL 11 CAJATAMBO'],
        'LORETO':['DIRECCIÓN REGIONAL DE EDUCACIÓN LORETO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ALTO AMAZONAS - SAN LORENZO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ALTO AMAZONAS - YURIMAGUAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LORETO - NAUTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MAYNAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PUTUMAYO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL RAMÓN CASTILLA - CABALLOCOCHA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL REQUENA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL UCAYALI - CONTAMANA'],
        'MADRE DE DIOS':['DIRECCIÓN REGIONAL DE EDUCACIÓN MADRE DE DIOS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MANU','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TAHUAMANU','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TAMBOPATA'],
        'MOQUEGUA':['DIRECCIÓN REGIONAL DE EDUCACIÓN MOQUEGUA','DIRECCIÓN REGIONAL DE EDUCACIÓN MOQUEGUA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL GENERAL SÁNCHEZ CERRO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ILO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MARISCAL NIETO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN IGNACIO DE LOYOLA-ICHUÑA'],
        'PASCO':['DIRECCIÓN REGIONAL DE EDUCACIÓN PASCO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL DANIEL ALCIDES CARRIÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL OXAPAMPA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PASCO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PUERTO BERMÚDEZ'],
        'PIURA':['COLEGIO MILITAR PEDRO RUIZ GALLO','DIRECCIÓN REGIONAL DE EDUCACIÓN PIURA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL AYABACA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHULUCANAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCABAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUARMACA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LA UNIÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MORROPÓN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PAITA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PIURA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SECHURA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SULLANA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TALARA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TAMBOGRANDE'],
        'PUNO':['DIRECCIÓN REGIONAL DE EDUCACIÓN PUNO','DIRECCIÓN REGIONAL DE EDUCACIÓN PUNO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL AZÁNGARO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CARABAYA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CHUCUITO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CRUCERO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL EL COLLAO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUANCANÉ','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LAMPA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MELGAR','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MOHO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PUNO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN ANTONIO DE PUTINA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN ROMÁN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SANDIA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL YUNGUYO'],
        'SAN MARTIN':['DIRECCIÓN REGIONAL DE EDUCACIÓN SAN MARTÍN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL BELLAVISTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL EL DORADO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL HUALLAGA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL LAMAS','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MARISCAL CÁCERES','UNIDAD DE GESTIÓN EDUCATIVA LOCAL MOYOBAMBA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PICOTA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL RIOJA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL SAN MARTÍN','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TOCACHE'],
        'TACNA':['DIRECCIÓN REGIONAL DE EDUCACIÓN TACNA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CANDARAVE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL JORGE BASADRE','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TACNA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TARATA'],
        'TUMBES':['DIRECCIÓN REGIONAL DE EDUCACIÓN TUMBES','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CONTRALMIRANTE VILLAR','UNIDAD DE GESTIÓN EDUCATIVA LOCAL TUMBES','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ZARUMILLA'],
        'UCAYALI':['DIRECCIÓN REGIONAL DE EDUCACIÓN UCAYALI','UNIDAD DE GESTIÓN EDUCATIVA LOCAL ATALAYA','UNIDAD DE GESTIÓN EDUCATIVA LOCAL CORONEL PORTILLO','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PADRE ABAD','UNIDAD DE GESTIÓN EDUCATIVA LOCAL PURUS']
      };
      const renderAwardDetail = (selectedType = '', selectedInstance = '', selectedRegion = '') => {
        const previousType = awardDetailGrid.querySelector('#award-type')?.value || '';
        const previousValues = {};
        if (previousType === selectedType) awardDetailGrid.querySelectorAll('label').forEach(label => { const name=normalizeField(label.querySelector(':scope > span')?.textContent||'');const control=label.querySelector('input,select,textarea');if(name&&control)previousValues[name]=control.value; });
        const regionIgedOptions = (awardIgedByRegion[selectedRegion] || []).map(item => `<option>${item}</option>`).join('');
        const regionFields = selectedInstance === 'REGION' ? `<label><span>Región <b>*</b></span><select id="award-region" required>${regionOptions}</select></label><label><span>IGED <b>*</b></span><select id="award-iged" required><option value=""></option>${regionIgedOptions}</select></label>` : '';
        let dependentFields = `<label><span>Mérito</span><select disabled><option value=""></option></select></label><span></span><label><span>Instancia <b>*</b></span><select id="award-instance" required>${recognitionInstanceOptions}</select></label>${selectedInstance === 'OTRA INSTANCIA' ? '<label class="full"><span>Descripción Otra Instancia</span><input></label>' : ''}${regionFields}`;
        if (selectedType === 'FELICITACIONES') {
          dependentFields = `<label><span>Mérito <b>*</b></span><select required><option value=""></option><option>FELICITACIONES</option><option>AGRADECIMIENTO</option></select></label><span></span><label><span>Instancia <b>*</b></span><select id="award-instance" required>${recognitionInstanceOptions}</select></label>${selectedInstance === 'OTRA INSTANCIA' ? '<label class="full"><span>Descripción Otra Instancia</span><input></label>' : ''}${regionFields}`;
        } else if (selectedType === 'CONDECORACIONES') {
          dependentFields = `<label><span>Mérito <b>*</b></span><select required><option value=""></option><option>PALMA MAGISTERIAL</option></select></label><label><span>Tipo de palma <b>*</b></span><select required><option value=""></option><option>AMAUTA</option><option>MAESTRO</option><option>EDUCADOR</option></select></label><label><span>Instancia <b>*</b></span><select id="award-instance" required>${recognitionInstanceOptions}</select></label><label><span>Fecha de inicio <b>*</b></span><input required type="date"></label>${selectedInstance === 'OTRA INSTANCIA' ? '<label class="full"><span>Descripción Otra Instancia</span><input></label>' : ''}${regionFields}`;
        } else if (selectedType === 'RECONOCIMIENTO') {
          dependentFields = `<label><span>Mérito <b>*</b></span><select required><option value=""></option><option>RECONOCIMIENTO</option></select></label><span></span><label><span>Instancia <b>*</b></span><select id="award-instance" required>${recognitionInstanceOptions}</select></label>${selectedInstance === 'OTRA INSTANCIA' ? '<label class="full"><span>Descripción Otra Instancia</span><input></label>' : ''}${regionFields}`;
        } else if (selectedType === 'RECONOCIMIENTO Y FELICITACIÓN') {
          dependentFields = `<label><span>Mérito <b>*</b></span><select required><option value=""></option><option>RECONOCIMIENTO Y FELICITACIÓN</option></select></label><span></span><label><span>Instancia <b>*</b></span><select id="award-instance" required>${recognitionInstanceOptions}</select></label>${selectedInstance === 'OTRA INSTANCIA' ? '<label class="full"><span>Descripción Otra Instancia</span><input></label>' : ''}${regionFields}`;
        }
        awardDetailGrid.innerHTML = `<label><span>Tipo de mérito <b>*</b></span><select id="award-type" required>${awardTypeOptions}</select></label>${dependentFields}<label class="full"><span>Anotaciones</span><textarea maxlength="250" rows="3"></textarea><small>250</small></label>`;
        const typeSelect = awardDetailGrid.querySelector('#award-type');
        typeSelect.value = selectedType;
        awardDetailGrid.querySelectorAll('label').forEach(label => { const name=normalizeField(label.querySelector(':scope > span')?.textContent||'');const control=label.querySelector('input,select,textarea');if(control&&previousValues[name]!==undefined&&control.id!=='award-type'&&control.id!=='award-instance'&&control.id!=='award-region'&&control.id!=='award-iged')control.value=previousValues[name]; });
        typeSelect.addEventListener('change', () => renderAwardDetail(typeSelect.value));
        const instanceSelect = awardDetailGrid.querySelector('#award-instance');
        if (instanceSelect) {
          instanceSelect.value = selectedInstance;
          instanceSelect.addEventListener('change', () => renderAwardDetail(selectedType, instanceSelect.value, ''));
        }
        const regionSelect = awardDetailGrid.querySelector('#award-region');
        if (regionSelect) {
          regionSelect.value = selectedRegion;
          regionSelect.addEventListener('change', () => renderAwardDetail(selectedType, selectedInstance, regionSelect.value));
        }
        const notes = awardDetailGrid.querySelector('textarea');
        const counter = awardDetailGrid.querySelector('label.full small');
        notes.addEventListener('input', () => { counter.textContent = String(250 - notes.value.length); });
      };
      renderAwardDetail();
      const awardsTable = document.querySelector('.awards-table');
      awardsTable.addEventListener('award-view-record', event => {
        const record = event.detail.record || {};
        const selectedRow = event.detail.row;
        const entries = Object.entries(record.datos || {}).map(([label,value]) => ({normalized:normalizeField(label),value}));
        const value = (...terms) => entries.find(entry => terms.some(term => entry.normalized === normalizeField(term)))?.value || 'No registrado';
        const escapeDetail = input => String(input ?? '').replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
        const resolutionType = value('Tipo de resolución');
        const resolutionNumber = value('Número de resolución (######-año-IGED)','Número de resolución','Número resolución');
        const resolutionDate = value('Fecha de resolución');
        const documentPath = Array.isArray(record.documentos) ? record.documentos[0] : '';
        const resolutionParts = String(resolutionNumber).match(/^(\d{6})-(\d{4})-(.+)$/);
        const resolutionPrefix = resolutionInitials(resolutionType).replace(/\./g,'');
        const resolutionEntity = resolutionParts?.[3].normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9]/gi,'').toUpperCase();
        const documentName = documentPath ? (resolutionParts && resolutionPrefix ? `${resolutionPrefix}-${resolutionEntity}-${resolutionParts[2]}-${resolutionParts[1]}.pdf` : documentPath.split('/').pop()) : 'No registrado';
        awardsTable.querySelectorAll('.awards-row.award-selected').forEach(row => row.classList.remove('award-selected'));
        selectedRow.classList.add('award-selected');
        document.querySelector('.award-detail-view')?.remove();
        const form = document.getElementById('awards-form');
        form.hidden = true;
        const detailView = document.createElement('div');
        detailView.className = 'award-detail-view';
        detailView.innerHTML = `<fieldset class="admin-server-card"><legend>Datos principales de la resolución</legend><div class="commission-detail-grid"><div><strong>Tipo de resolución</strong><span>${escapeDetail(resolutionType)}</span></div><div><strong>Número de resolución</strong><span>${escapeDetail(resolutionNumber)}</span></div><div><strong>Fecha de resolución</strong><span>${escapeDetail(formatTableDate(resolutionDate))}</span></div><div><strong>Documento</strong>${documentPath?`<a href="${escapeDetail(documentPath)}" target="_blank" rel="noopener">↗ ${escapeDetail(documentName)}</a>`:`<span>${escapeDetail(documentName)}</span>`}</div><div><strong>Folios</strong><span>${escapeDetail(value('Folios'))}</span></div></div></fieldset><fieldset class="admin-server-card"><legend>Detalle de la resolución</legend><div class="commission-detail-grid"><div><strong>Tipo de mérito</strong><span>${escapeDetail(value('Tipo de mérito'))}</span></div><div><strong>Mérito</strong><span>${escapeDetail(value('Mérito'))}</span></div><div class="commission-detail-full"><strong>Instancia</strong><span>${escapeDetail(value('Instancia'))}</span></div><div class="commission-detail-full"><strong>Entidad Emisora</strong><span>${escapeDetail(value('IGED'))}</span></div><div class="commission-detail-full"><strong>Anotaciones</strong><span>${escapeDetail(value('Anotaciones'))}</span></div></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="commission-detail-actions"><button type="button" class="award-detail-return">← RETORNAR</button><button type="button" class="award-detail-cancel">⌫ CANCELAR</button></div>`;
        form.insertAdjacentElement('beforebegin',detailView);
        const closeDetail = () => {
          selectedRow.classList.remove('award-selected');
          detailView.remove();
          form.hidden = false;
        };
        detailView.querySelector('.award-detail-return').addEventListener('click',closeDetail);
        detailView.querySelector('.award-detail-cancel').addEventListener('click',closeDetail);
      });
      document.getElementById('return-awards').addEventListener('click', () => { window.location.href = 'gestion-servidor.html'; });
      document.getElementById('awards-form').addEventListener('submit', event => { event.preventDefault(); alert('Mérito guardado correctamente.'); });
      document.querySelectorAll('.awards-tabs a')[1].addEventListener('click', showAdminStudyTrips);
      window.location.hash = 'premios';
    };
    const showAdminStudyTrips = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      awardsMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs awards-tabs"><a>Gestionar datos de méritos</a><a class="active">Viajes de estudios becas y pasantías</a></nav><fieldset class="admin-server-card"><legend>Registros de viajes de estudios, becas y pasantías</legend><div class="trips-table"><div class="trips-head"><span>N°</span><span>Tipo</span><span>País</span><span>F. inicio</span><span>F. fin</span><span>Resolución</span><span>Estado</span><span>Acciones</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 0 páginas</strong></div></div></fieldset><form id="trips-form"><fieldset class="admin-server-card"><legend>Datos principales de la resolución</legend><div class="awards-form-grid"><label><span>Tipo de resolución *</span><select required><option value="">Seleccione tipo de resolución</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN DIRECTORAL</option><option>RESOLUCIÓN JEFATURAL</option></select></label><label><span>Número resolución (######-año-IGED) *</span><input required placeholder="Número de resolución"></label><label><span>Fecha de resolución *</span><input required type="date"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div></fieldset><fieldset class="admin-server-card"><legend>Detalle de la resolución</legend><div class="awards-form-grid"><label><span>Tipo *</span><select required><option value="">Seleccione tipo</option><option>VIAJE DE ESTUDIOS</option><option>BECA</option><option>PASANTÍA</option><option>INTERCAMBIO</option></select></label><label><span>País</span><select><option>PERÚ</option><option>ARGENTINA</option><option>BRASIL</option><option>CHILE</option><option>COLOMBIA</option><option>ESPAÑA</option><option>MÉXICO</option><option>OTRO</option></select></label><span></span><label><span>Fecha de inicio</span><input type="date"></label><label><span>Fecha fin</span><input type="date"></label><label><span>Institución organizadora</span><input placeholder="Institución"></label><label class="full"><span>Anotaciones</span><textarea maxlength="250" rows="3" placeholder="Anotaciones"></textarea><small>250</small></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="trips-actions"><button id="return-trips" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      const tripFormGrids = document.querySelectorAll('#trips-form .awards-form-grid');
      tripFormGrids[0].querySelector('label select').innerHTML = meritResolutionOptions;
      tripFormGrids[1].querySelector('label select').innerHTML = '<option value="">Seleccione tipo</option><option>BECA</option><option>PASANTÍA</option><option>VIAJE DE ESTUDIO</option><option>VIAJE DE REPRESENTACIÓN</option>';
      document.querySelectorAll('.awards-tabs a')[0].addEventListener('click', showAdminAwards);
      document.getElementById('return-trips').addEventListener('click', showAdminAwards);
      document.getElementById('trips-form').addEventListener('submit', event => { event.preventDefault(); alert('Viaje, beca o pasantía guardado correctamente.'); });
      window.location.hash = 'viajes-becas-pasantias';
    };
    const showAdminSanctions = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      sanctionsMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs sanctions-tabs"><a class="active">Sanciones judiciales</a><a>Sanciones administrativas</a><a>Recursos administrativos</a></nav><fieldset class="admin-server-card"><legend>Registros de sanción judicial</legend><div class="sanctions-table"><div class="sanctions-head"><span>N°</span><span>Causa y/o motivo</span><span>Resolución</span><span>F. notificación</span><span>Días</span><span>F. inicio</span><span>F. fin</span><span>Estado</span><span>Acciones</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 0 páginas</strong></div></div></fieldset><form id="sanctions-form"><fieldset class="admin-server-card"><legend>Datos de la resolución</legend><div class="sanctions-form-grid"><label><span>Tipo de resolución *</span><select required><option>RESOLUCIÓN DIRECTORAL SUB REGIONAL</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN JUDICIAL</option></select></label><label><span>Número resolución (######-año-IGED) *</span><input required placeholder="Número de resolución"></label><label><span>Fecha de resolución *</span><input required type="date"></label><label><span>Institución que emite la resolución *</span><input required placeholder="Institución emisora"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div></fieldset><fieldset class="admin-server-card"><legend>Datos de sanción judicial</legend><div class="sanctions-form-grid"><div class="sanction-radio full"><strong>Tipo de sanción: *</strong><label><input type="radio" name="judicial-sanction-type" value="Destitución" required> Destitución</label><label><input type="radio" name="judicial-sanction-type" value="Otros"> Otros</label></div><label class="wide"><span>Causa y/o motivo *</span><input required placeholder="Causa y/o motivo"></label><label><span>Fecha de notificación</span><input type="date"></label><label><span>Días de sanción</span><input type="number" min="0" placeholder="Días"></label><label><span>Fecha de inicio</span><input type="date"></label><label><span>Fecha fin</span><input type="date"></label><label class="full"><span>Anotaciones</span><textarea maxlength="250" rows="3" placeholder="Anotaciones"></textarea><small>250</small></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="sanctions-actions"><button id="return-sanctions" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      document.querySelector('#sanctions-form .sanctions-form-grid label select').innerHTML = meritResolutionOptions;
      document.getElementById('return-sanctions').addEventListener('click', () => { window.location.href = 'gestion-servidor.html'; });
      document.getElementById('sanctions-form').addEventListener('submit', event => { event.preventDefault(); alert('Sanción judicial guardada correctamente.'); });
      document.querySelectorAll('.sanctions-tabs a')[1].addEventListener('click', showAdminAdministrativeSanctions);
      document.querySelectorAll('.sanctions-tabs a')[2].addEventListener('click', showAdminAdministrativeAppeals);
      window.location.hash = 'sanciones';
    };
    const showAdminAdministrativeSanctions = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      sanctionsMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs sanctions-tabs"><a>Sanciones judiciales</a><a class="active">Sanciones administrativas</a><a>Recursos administrativos</a></nav><fieldset class="admin-server-card"><legend>Registros de sanciones administrativas</legend><div class="administrative-table"><div class="administrative-head"><span>N°</span><span>Sanción</span><span>Resolución</span><span>F. notificación al servidor</span><span>Días</span><span>F. inicio</span><span>F. fin</span><span>Estado</span><span>Acciones</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 0 páginas</strong></div></div></fieldset><fieldset class="admin-server-card"><legend>Sanción proviene de una instauración de proceso administrativo</legend><div class="administrative-toggle"><label class="admin-switch"><input id="administrative-process" type="checkbox"><span></span></label><strong id="administrative-process-label">NO</strong></div></fieldset><form id="administrative-sanctions-form"><fieldset class="admin-server-card"><legend>Datos de la resolución</legend><div class="sanctions-form-grid"><label><span>Tipo de resolución *</span><select required><option>RESOLUCIÓN DEL ÓRGANO SANCIONADOR</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN DIRECTORAL</option></select></label><label><span>Número resolución (######-año-IGED) *</span><input required placeholder="Número de resolución"></label><label><span>Fecha de resolución *</span><input required type="date"></label><label><span>Institución que emite la resolución *</span><input required placeholder="Institución emisora"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div></fieldset><fieldset class="admin-server-card"><legend>Datos de la sanción administrativa</legend><div class="sanctions-form-grid"><label><span>Régimen laboral</span><select><option value="">Seleccione régimen laboral</option><option>LEY N° 29944</option><option>LEY N° 30512</option><option>D.L. N° 276</option><option>D.L. N° 1057 CAS</option></select></label><label><span>Tipo de sanción administrativa</span><select><option value="">Seleccione tipo de sanción</option><option>AMONESTACIÓN ESCRITA</option><option>SUSPENSIÓN</option><option>CESE TEMPORAL</option><option>DESTITUCIÓN</option></select></label><span></span><label><span>Fecha de notificación al servidor</span><input type="date"></label><span></span><span></span><label><span>Cantidad días</span><input type="number" min="0" placeholder="Cantidad de días"></label><label><span>Fecha de inicio</span><input type="date"></label><label><span>Fecha de fin</span><input type="date"></label><label class="full"><span>Anotaciones</span><textarea maxlength="250" rows="3" placeholder="Anotaciones"></textarea><small>250</small></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="sanctions-actions"><button id="return-administrative" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      document.querySelector('#administrative-sanctions-form .sanctions-form-grid label select').innerHTML = meritResolutionOptions;
      document.querySelector('.administrative-toggle').insertAdjacentHTML('beforeend', '<label id="administrative-process-picker" class="administrative-process-picker" hidden><span>Instauración de proceso administrativo</span><select><option value=""></option></select></label>');
      document.querySelectorAll('.sanctions-tabs a')[0].addEventListener('click', showAdminSanctions);
      document.querySelectorAll('.sanctions-tabs a')[2].addEventListener('click', showAdminAdministrativeAppeals);
      document.getElementById('return-administrative').addEventListener('click', showAdminSanctions);
      document.getElementById('administrative-process').addEventListener('change', event => {
        const enabled = event.target.checked;
        document.getElementById('administrative-process-label').textContent = enabled ? 'SÍ' : 'NO';
        const processPicker = document.getElementById('administrative-process-picker');
        processPicker.hidden = !enabled;
        processPicker.querySelector('select').required = enabled;
      });
      document.getElementById('administrative-sanctions-form').addEventListener('submit', event => { event.preventDefault(); alert('Sanción administrativa guardada correctamente.'); });
      window.location.hash = 'sanciones-administrativas';
    };
    const showAdminAdministrativeAppeals = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      sanctionsMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs sanctions-tabs"><a>Sanciones judiciales</a><a>Sanciones administrativas</a><a class="active">Recursos administrativos</a></nav><fieldset class="admin-server-card"><legend>Registros de recurso administrativo</legend><div class="appeals-table"><div class="appeals-head"><span>N°</span><span>Resultado apelación</span><span>Resolución</span><span>F. notificación al servidor</span><span>Días</span><span>F. inicio</span><span>F. fin</span><span>Estado</span><span>Acciones</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 0 páginas</strong></div></div></fieldset><fieldset class="admin-server-card"><legend>El recurso proviene de una sanción administrativa</legend><div class="administrative-toggle"><label class="admin-switch"><input id="appeal-from-sanction" type="checkbox"><span></span></label><strong id="appeal-from-sanction-label">NO</strong></div></fieldset><form id="appeals-form"><fieldset class="admin-server-card"><legend>Datos de la resolución</legend><div class="sanctions-form-grid"><label><span>Tipo de resolución *</span><select required><option>RESOLUCIÓN DEL ÓRGANO SANCIONADOR</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN DEL TRIBUNAL</option></select></label><label><span>Número resolución (######-año-IGED) *</span><input required placeholder="Número de resolución"></label><label><span>Fecha de resolución *</span><input required type="date"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div></fieldset><fieldset class="admin-server-card"><legend>Datos del recurso administrativo</legend><div class="sanctions-form-grid"><label><span>Tipo de recurso *</span><select required><option value="">Seleccione tipo de recurso</option><option>RECONSIDERACIÓN</option><option>APELACIÓN</option><option>REVISIÓN</option></select></label><label><span>Resultado *</span><select required><option value="">Seleccione resultado</option><option>FUNDADO</option><option>INFUNDADO</option><option>IMPROCEDENTE</option><option>FUNDADO EN PARTE</option></select></label><label><span>Fecha de notificación al servidor</span><input type="date"></label><label><span>Cantidad días</span><input type="number" min="0" placeholder="Días"></label><label><span>Fecha de inicio</span><input type="date"></label><label><span>Fecha de fin</span><input type="date"></label><label class="full"><span>Anotaciones</span><textarea maxlength="250" rows="3" placeholder="Anotaciones"></textarea><small>250</small></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="sanctions-actions"><button id="return-appeals" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GRABAR</button></div></form>`;
      document.querySelector('#appeals-form .sanctions-form-grid label select').innerHTML = meritResolutionOptions;
      document.querySelector('.administrative-toggle').insertAdjacentHTML('beforeend', '<label id="appeal-sanction-picker" class="administrative-process-picker" hidden><span>Sanciones administrativas</span><select><option value=""></option></select></label>');
      document.querySelectorAll('.sanctions-tabs a')[0].addEventListener('click', showAdminSanctions);
      document.querySelectorAll('.sanctions-tabs a')[1].addEventListener('click', showAdminAdministrativeSanctions);
      document.getElementById('return-appeals').addEventListener('click', showAdminSanctions);
      document.getElementById('appeal-from-sanction').addEventListener('change', event => {
        const enabled = event.target.checked;
        document.getElementById('appeal-from-sanction-label').textContent = enabled ? 'SÍ' : 'NO';
        const sanctionPicker = document.getElementById('appeal-sanction-picker');
        sanctionPicker.hidden = !enabled;
        sanctionPicker.querySelector('select').required = enabled;
      });
      document.getElementById('appeals-form').addEventListener('submit', event => { event.preventDefault(); alert('Recurso administrativo grabado correctamente.'); });
      window.location.hash = 'recursos-administrativos';
    };
    const setupAutomaticLeaveData = (formId, automaticAction, automaticReason = '') => {
      const form = document.getElementById(formId);
      if (!form) return;
      const primaryGrid = form.querySelector('fieldset .ingress-form-grid');
      const labels = primaryGrid ? [...primaryGrid.querySelectorAll(':scope > label')] : [];
      const findLabel = text => labels.find(label => label.querySelector(':scope > span')?.textContent.trim() === text);
      const documentInput = primaryGrid?.querySelector('input[type="file"]');
      const regimeLabel = findLabel('Régimen laboral');
      const actionLabel = findLabel('Acción');
      const reasonLabel = findLabel('Motivo acción');
      if (!documentInput || !regimeLabel || !actionLabel) return;

      const makeAutomaticInput = label => {
        const select = label.querySelector('select');
        const input = document.createElement('input');
        input.type = 'text';
        input.readOnly = true;
        input.value = '';
        input.className = 'automatic-leave-field';
        if (select?.id) input.id = select.id;
        select?.replaceWith(input);
        return input;
      };
      const regimeInput = makeAutomaticInput(regimeLabel);
      const actionInput = makeAutomaticInput(actionLabel);
      const reasonInput = automaticReason && reasonLabel ? makeAutomaticInput(reasonLabel) : null;

      const updateVisibility = () => {
        const hasDocument = documentInput.files && documentInput.files.length > 0;
        regimeLabel.hidden = false;
        actionLabel.hidden = false;
        regimeLabel.style.display = '';
        actionLabel.style.display = '';
        regimeInput.value = hasDocument ? (server.regimen || 'NO REGISTRADO') : '';
        actionInput.value = hasDocument ? automaticAction : '';
        if (reasonInput) {
          reasonInput.value = hasDocument ? automaticReason : '';
          reasonInput.dispatchEvent(new Event('change', {bubbles:true}));
        }
      };
      documentInput.addEventListener('change', updateVisibility);
      form.addEventListener('reset', () => setTimeout(updateVisibility, 0));
      updateVisibility();
    };
    const showAdminLeave = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      leaveMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs leave-tabs"><a class="active">Vacaciones</a><a>Licencias sin goce de remuneraciones</a><a>Licencias con goce de remuneraciones</a></nav><fieldset class="admin-server-card"><legend>Datos de vacaciones</legend><div class="leave-table"><div class="leave-head"><span>N°</span><span>Acción</span><span>Motivo</span><span>Régimen</span><span>F. inicio</span><span>F. fin</span><span>Resolución</span><span>Estado</span><span>Acciones</span></div><div class="leave-row"><span>1</span><span>VACACIONES</span><span>APROBAR ROL DE VACACIONES</span><span>${server.regimen}</span><span>30/01/2026</span><span>28/02/2026</span><span>R.D.R. N° 000132-2026-DRE HUANCAVELICA<small>Fecha: 05/02/2026</small></span><span>APROBADO</span><span><button type="button">✎</button><button type="button">−</button><button type="button">▦</button></span></div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 1 registro</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 1 página</strong></div></div></fieldset><form id="leave-form"><fieldset class="admin-server-card"><legend>Datos principales de la resolución</legend><div class="ingress-form-grid"><label><span>Tipo de resolución *</span><select required><option value="">Seleccione tipo de resolución</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN DIRECTORAL</option><option>RESOLUCIÓN JEFATURAL</option></select></label><label><span>Número resolución (######-año-IGED) *</span><input required placeholder="Número de resolución"></label><label><span>Fecha de resolución *</span><input required type="date"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label><span></span><label><span>Régimen laboral</span><select><option value="">Seleccione régimen laboral</option><option>LEY N° 29944</option><option>LEY N° 30512</option><option>D.L. N° 276</option><option>D.L. N° 1057 CAS</option></select></label><label><span>Acción</span><select><option value="">Seleccione acción</option><option>VACACIONES</option><option>ADELANTO DE VACACIONES</option><option>REPROGRAMACIÓN</option></select></label><label><span>Motivo acción</span><select id="leave-reason"><option value="">Seleccione motivo</option><option>APROBAR ROL DE VACACIONES</option><option>GOCE VACACIONAL</option><option>REPROGRAMACIÓN DEL PERIODO VACACIONAL</option></select></label></div></fieldset><fieldset class="admin-server-card ingress-detail"><legend>Detalle de la resolución</legend><p id="leave-detail-message">Seleccione el motivo acción para continuar con el formulario de registro</p><div id="leave-detail-fields" class="ingress-form-grid" hidden><label><span>Fecha de inicio *</span><input type="date"></label><label><span>Fecha de fin *</span><input type="date"></label><label><span>Días de vacaciones</span><input type="number" min="1" placeholder="Días"></label><label><span>Periodo vacacional</span><input placeholder="Ejemplo: 2025-2026"></label><label><span>Estado</span><select><option>APROBADO</option><option>MODIFICADO</option><option>ANULADO</option></select></label><label><span>Observaciones</span><input placeholder="Observaciones"></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="leave-actions"><button id="return-leave" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      document.querySelector('#leave-form .ingress-form-grid label select').innerHTML = ascentResolutionOptions;
      const vacationResolutionInput = [...document.querySelectorAll('#leave-form fieldset:first-child .ingress-form-grid label')]
        .find(label => label.querySelector(':scope > span')?.textContent.includes('Número resolución'))?.querySelector('input');
      if (vacationResolutionInput) {
        vacationResolutionInput.pattern = '\\d{6}-\\d{4}-.+';
        vacationResolutionInput.title = 'Ingrese 6 números, 4 números del año y la entidad. Ejemplo: 001223-2026-DRE HUANCAVELICA';
        vacationResolutionInput.addEventListener('keydown', event => {
          if (event.key !== 'Backspace' || vacationResolutionInput.selectionStart !== vacationResolutionInput.selectionEnd) return;
          const caret = vacationResolutionInput.selectionStart;
          if (caret === vacationResolutionInput.value.length && vacationResolutionInput.value.endsWith('-')) {
            event.preventDefault();
            vacationResolutionInput.value = vacationResolutionInput.value.slice(0, -2);
            vacationResolutionInput.dispatchEvent(new Event('input', {bubbles:true}));
          }
        });
        vacationResolutionInput.addEventListener('input', () => {
          const plain = vacationResolutionInput.value.toUpperCase().replace(/-/g, '');
          const leadingDigits = plain.match(/^\d{0,10}/)?.[0] || '';
          if (leadingDigits.length < 6) {
            vacationResolutionInput.value = leadingDigits;
            return;
          }
          const firstPart = leadingDigits.slice(0, 6);
          const yearPart = leadingDigits.slice(6, 10);
          if (yearPart.length < 4) {
            vacationResolutionInput.value = `${firstPart}-${yearPart}`;
            return;
          }
          const entity = plain.slice(10).replace(/[^A-Z0-9 ]/g, '');
          vacationResolutionInput.value = `${firstPart}-${yearPart}-${entity}`;
        });
      }
      setupAutomaticLeaveData('leave-form', 'VACACIONES', 'APROBAR ROL DE VACACIONES');
      const vacationDetailFields = document.getElementById('leave-detail-fields');
      vacationDetailFields.innerHTML = `<label><span>Fecha de inicio *</span><input class="vacation-start-date" required type="date"></label><label><span>Fecha fin</span><input class="vacation-end-date" type="date"></label><label><span>Cantidad días</span><input class="vacation-days" type="number" min="1" placeholder="Cantidad días" readonly></label><label class="full"><span>Anotaciones</span><small class="vacation-notes-count">250</small><textarea maxlength="250" rows="3" placeholder="Anotaciones"></textarea></label>`;
      const vacationStartDate = vacationDetailFields.querySelector('.vacation-start-date');
      const vacationEndDate = vacationDetailFields.querySelector('.vacation-end-date');
      const vacationDays = vacationDetailFields.querySelector('.vacation-days');
      const updateVacationDays = () => {
        vacationDays.value = '';
        if (!vacationStartDate.value || !vacationEndDate.value) return;
        const start = Date.parse(`${vacationStartDate.value}T00:00:00Z`);
        const end = Date.parse(`${vacationEndDate.value}T00:00:00Z`);
        if (end < start) return;
        vacationDays.value = String(Math.floor((end - start) / 86400000) + 1);
      };
      vacationStartDate.addEventListener('change', updateVacationDays);
      vacationEndDate.addEventListener('change', updateVacationDays);
      const vacationNotes = vacationDetailFields.querySelector('textarea');
      const vacationNotesCount = vacationDetailFields.querySelector('.vacation-notes-count');
      vacationNotes.addEventListener('input', () => { vacationNotesCount.textContent = String(250 - vacationNotes.value.length); });
      document.getElementById('return-leave').addEventListener('click', () => { window.location.href = 'gestion-servidor.html'; });
      document.getElementById('leave-reason').addEventListener('change', event => {
        document.getElementById('leave-detail-fields').hidden = !event.target.value;
        document.getElementById('leave-detail-message').hidden = Boolean(event.target.value);
      });
      document.querySelector('.leave-table').addEventListener('vacation-edit-record', event => {
        const record = event.detail.record || {};
        const data = record.datos || {};
        const value = (...terms) => {
          const entries = Object.entries(data).map(([label,item]) => ({label:normalizeField(label),item}));
          return entries.find(entry => terms.some(term => entry.label === normalizeField(term)))?.item || 'No registrado';
        };
        const escapeHtml = item => String(item ?? '').replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
        const modification = modal('Modificatoria de la acción', `<div class="action-modification vacation-modification"><label class="modification-action-type"><span>Tipo de acción <b>*</b></span><select id="vacation-modification-action" required><option value=""></option><option>DECLARAR NULO</option><option>DEJAR SIN EFECTO</option><option>MODIFICAR / RECTIFICAR</option></select></label><fieldset><legend>Datos de la resolución a modificar</legend><div class="modification-current-data"><div><strong>Tipo de resolución</strong><span>${escapeHtml(value('Tipo de resolución'))}</span></div><div><strong>Número de resolución</strong><span>${escapeHtml(value('Número resolución (######-año-IGED)','Número resolución','Número de resolución'))}</span></div><div><strong>Fecha de resolución</strong><span>${escapeHtml(formatTableDate(value('Fecha de resolución')))}</span></div><div><strong>Régimen</strong><span>${escapeHtml(value('Régimen laboral'))}</span></div><div><strong>Acción</strong><span>${escapeHtml(value('Acción'))}</span></div><div><strong>Motivo acción</strong><span>${escapeHtml(value('Motivo acción'))}</span></div></div></fieldset><fieldset><legend>Datos principales de la resolución de modificatoria</legend><div class="modification-form-grid"><label><span>Tipo de resolución <b>*</b></span><select required>${ascentResolutionOptions}</select></label><label><span>Número resolución (######-año-IGED) <b>*</b></span><input required placeholder="Número de resolución"></label><label><span>Fecha resolución <b>*</b></span><input required type="date"></label><label><span>Documento <b>*</b></span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div></fieldset><fieldset><legend>Detalle de la resolución de modificatoria</legend><p id="vacation-modification-message">Seleccione un tipo de acción para continuar con el formulario de registro</p><div id="vacation-modification-detail" hidden></div></fieldset></div>`, []);
        modification.querySelector('.app-modal').classList.add('action-modification-modal','unpaid-modification-modal');
        const type = modification.querySelector('#vacation-modification-action');
        const message = modification.querySelector('#vacation-modification-message');
        const detail = modification.querySelector('#vacation-modification-detail');
        const vacationStartValue = value('Fecha de inicio');
        const vacationEndValue = value('Fecha fin','Fecha de fin');
        let vacationPendingCorrection = null;
        type.addEventListener('change', () => {
          message.hidden = Boolean(type.value);
          detail.hidden = !type.value;
          if (!type.value) { detail.innerHTML = ''; return; }
          vacationPendingCorrection = null;
          const field = type.value === 'MODIFICAR / RECTIFICAR' ? '<div class="cessation-rectification-fields"><label><span>Campo a modificar</span><select id="vacation-modification-field"><option value=""></option><option>FECHA DE FIN</option><option>FECHA DE INICIO</option></select></label><div class="cessation-says"><span>Dice</span><strong id="vacation-current-value">—</strong></div><label><span>Debe decir <b>*</b></span><input id="vacation-new-value" type="date"></label><button id="vacation-add-change" type="button">✚ AGREGAR</button><div id="vacation-added-changes" class="cessation-added-changes"></div></div>' : '';
          detail.innerHTML = `${field}<label class="modification-notes"><span>Anotaciones</span><span class="modification-count">250</span><textarea maxlength="250" placeholder="Anotaciones"></textarea></label><button id="vacation-modification-save" class="unpaid-modification-save" type="button">▣ GUARDAR</button>`;
          const fieldSelect=detail.querySelector('#vacation-modification-field');
          const currentValue=detail.querySelector('#vacation-current-value');
          const newValue=detail.querySelector('#vacation-new-value');
          fieldSelect?.addEventListener('change',()=>{
            const stored=fieldSelect.value==='FECHA DE FIN'?vacationEndValue:fieldSelect.value==='FECHA DE INICIO'?vacationStartValue:'';
            currentValue.textContent=stored?formatTableDate(stored):'—';
            newValue.value='';
            vacationPendingCorrection=null;
          });
          detail.querySelector('#vacation-add-change')?.addEventListener('click',()=>{
            if(!fieldSelect.value||!newValue.value){(!fieldSelect.value?fieldSelect:newValue).focus();return;}
            vacationPendingCorrection={label:fieldSelect.value==='FECHA DE FIN'?'Fecha fin':'Fecha de inicio',value:newValue.value};
            detail.querySelector('#vacation-added-changes').innerHTML=`<div><strong>${fieldSelect.value}</strong><span>${currentValue.textContent} → ${formatTableDate(newValue.value)}</span></div>`;
            newValue.value='';
          });
          detail.querySelector('#vacation-modification-save').addEventListener('click',async()=>{
            const required=[...modification.querySelectorAll('[required]')].find(control=>!control.value);
            if(required){required.focus();required.reportValidity?.();return;}
            const primaryGrid=modification.querySelector('.modification-form-grid');
            const primaryLabels=[...primaryGrid.querySelectorAll(':scope > label')];
            const primaryValue=text=>primaryLabels.find(label=>label.querySelector(':scope > span')?.textContent.includes(text))?.querySelector('input,select')?.value||'';
            const updates={
              'Tipo de resolución':primaryValue('Tipo de resolución'),
              'Número resolución (######-año-IGED)':primaryValue('Número resolución'),
              'Fecha de resolución':primaryValue('Fecha resolución')
            };
            if(vacationPendingCorrection)updates[vacationPendingCorrection.label]=vacationPendingCorrection.value;
            const directVacationField=detail.querySelector('#vacation-modification-field');
            const directVacationValue=detail.querySelector('#vacation-new-value');
            if(directVacationField?.value&&directVacationValue?.value)updates[directVacationField.value==='FECHA DE FIN'?'Fecha fin':'Fecha de inicio']=directVacationValue.value;
            if(!validateDateSequence({resolutionDate:updates['Fecha de resolución'],startDate:updates['Fecha de inicio']||vacationStartValue,endDate:updates['Fecha fin']||vacationEndValue}))return;
            try{
              const updateResponse=await fetch('api/formularios-registro.php',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:record.id,dni:server.dni,formulario:'leave-form',estado:'APROBADO',datos:updates})});
              const updateResult=await updateResponse.json();
              if(!updateResponse.ok||!updateResult.ok)throw new Error(updateResult.mensaje||'No se pudo modificar el registro.');
              const auditData=new FormData();
              auditData.append('dni',server.dni);auditData.append('codmod',server.codigoAnterior||server.codigo);auditData.append('formulario','modifier-form');auditData.append('estado','APROBADO');auditData.append('datos',JSON.stringify({'Registro objetivo':String(record.id||''),'Tipo de acción':type.value,'Resolución modificada':value('Número resolución (######-año-IGED)','Número resolución','Número de resolución'),...updates}));auditData.append('resumen','{}');
              const documentInput=primaryGrid.querySelector('input[type="file"]');
              if(documentInput?.files[0])auditData.append('archivo_0',documentInput.files[0]);
              const auditResponse=await fetch('api/formularios-registro.php',{method:'POST',body:auditData});
              const auditResult=await auditResponse.json();
              if(!auditResponse.ok||!auditResult.ok)throw new Error(auditResult.mensaje||'No se pudo guardar la nueva resolución.');
              modification.remove();
              const vacationForm=document.getElementById('leave-form');
              if(vacationForm){delete vacationForm.dataset.dbRecordsLoading;await loadGenericFormRecords(vacationForm);}
              alert('Modificatoria guardada correctamente.');
            }catch(error){alert(error.message||'No se pudo guardar la modificatoria.');}
          });
        });
      });
      document.getElementById('leave-form').addEventListener('submit', event => { event.preventDefault(); alert('Vacaciones guardadas correctamente.'); });
      document.querySelectorAll('.leave-tabs a')[1].addEventListener('click', showAdminUnpaidLeave);
      document.querySelectorAll('.leave-tabs a')[2].addEventListener('click', showAdminPaidLeave);
      window.location.hash = 'licencias';
    };
    const showAdminUnpaidLeave = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      leaveMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs leave-tabs"><a>Vacaciones</a><a class="active">Licencias sin goce de remuneraciones</a><a>Licencias con goce de remuneraciones</a></nav><fieldset class="admin-server-card"><legend>Datos de licencias sin goce de remuneraciones</legend><div class="unpaid-table"><div class="unpaid-head"><span>N°</span><span>Acción</span><span>Motivo</span><span>Régimen</span><span>Días</span><span>F. inicio</span><span>F. fin</span><span>Resolución</span><span>Estado</span><span>Acciones</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 0 páginas</strong></div></div></fieldset><form id="unpaid-form"><fieldset class="admin-server-card"><legend>Datos principales de la resolución</legend><div class="ingress-form-grid"><label><span>Tipo de resolución *</span><select required><option value="">Seleccione tipo de resolución</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN DIRECTORAL</option><option>RESOLUCIÓN JEFATURAL</option></select></label><label><span>Número resolución (######-año-IGED) *</span><input required placeholder="Número de resolución"></label><label><span>Fecha de resolución *</span><input required type="date"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label><span></span><label><span>Régimen laboral</span><select><option value="">Seleccione régimen laboral</option><option>LEY N° 29944</option><option>LEY N° 30512</option><option>D.L. N° 276</option><option>D.L. N° 1057 CAS</option></select></label><label><span>Acción</span><select><option value="">Seleccione acción</option><option>LICENCIA SIN GOCE</option><option>AMPLIACIÓN DE LICENCIA</option><option>REINCORPORACIÓN</option></select></label><label><span>Motivo acción</span><select id="unpaid-reason"><option value="">Seleccione motivo</option><option>MOTIVOS PARTICULARES</option><option>ESTUDIOS NO OFICIALIZADOS</option><option>DESEMPEÑO DE FUNCIONES PÚBLICAS</option><option>OTRA LICENCIA SIN GOCE</option></select></label></div></fieldset><fieldset class="admin-server-card ingress-detail"><legend>Detalle de la resolución</legend><p id="unpaid-detail-message">Seleccione el motivo acción para continuar con el formulario de registro</p><div id="unpaid-detail-fields" class="ingress-form-grid" hidden><label><span>Cantidad de días *</span><input type="number" min="1" placeholder="Días"></label><label><span>Fecha de inicio *</span><input type="date"></label><label><span>Fecha de fin *</span><input type="date"></label><label><span>Documento sustentatorio</span><input type="file" accept="application/pdf"></label><label><span>Estado</span><select><option>APROBADO</option><option>MODIFICADO</option><option>ANULADO</option></select></label><label><span>Observaciones</span><input placeholder="Observaciones"></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="leave-actions"><button id="return-unpaid" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      document.querySelector('#unpaid-form .ingress-form-grid label select').innerHTML = ascentResolutionOptions;
      const unpaidResolutionInput = [...document.querySelectorAll('#unpaid-form fieldset:first-child .ingress-form-grid label')]
        .find(label => label.querySelector(':scope > span')?.textContent.includes('Número resolución'))?.querySelector('input');
      if (unpaidResolutionInput) {
        unpaidResolutionInput.pattern = '\\d{6}-\\d{4}-.+';
        unpaidResolutionInput.title = 'Ingrese 6 números, 4 números del año y la entidad. Ejemplo: 001223-2026-DRE HUANCAVELICA';
        unpaidResolutionInput.addEventListener('keydown', event => {
          if (event.key !== 'Backspace' || unpaidResolutionInput.selectionStart !== unpaidResolutionInput.selectionEnd) return;
          const caret = unpaidResolutionInput.selectionStart;
          if (caret === unpaidResolutionInput.value.length && unpaidResolutionInput.value.endsWith('-')) {
            event.preventDefault();
            unpaidResolutionInput.value = unpaidResolutionInput.value.slice(0, -2);
            unpaidResolutionInput.dispatchEvent(new Event('input', {bubbles:true}));
          }
        });
        unpaidResolutionInput.addEventListener('input', () => {
          const plain = unpaidResolutionInput.value.toUpperCase().replace(/-/g, '');
          const leadingDigits = plain.match(/^\d{0,10}/)?.[0] || '';
          if (leadingDigits.length < 6) {
            unpaidResolutionInput.value = leadingDigits;
            return;
          }
          const firstPart = leadingDigits.slice(0, 6);
          const yearPart = leadingDigits.slice(6, 10);
          if (yearPart.length < 4) {
            unpaidResolutionInput.value = `${firstPart}-${yearPart}`;
            return;
          }
          const entity = plain.slice(10).replace(/[^A-Z0-9 ]/g, '');
          unpaidResolutionInput.value = `${firstPart}-${yearPart}-${entity}`;
        });
      }
      document.getElementById('unpaid-reason').innerHTML = `<option value="">Seleccione motivo</option><option>POR CAPACITACIÓN NO OFICIALIZADA</option><option>POR DESEMPEÑO DE FUNCIONES PÚBLICAS O CARGO DE CONFIANZA</option><option>POR DESEMPEÑO DEL PUESTO DE DIRECTOR GENERAL EN UN IES O UNA EEST</option><option>POR ENFERMEDAD DE PADRES HIJOS Y CÓNYUGE</option><option>POR MOTIVOS PARTICULARES</option>`;
      setupAutomaticLeaveData('unpaid-form', 'LICENCIA SIN GOCE DE REMUNERACIONES');
      document.querySelectorAll('.leave-tabs a')[0].addEventListener('click', showAdminLeave);
      document.querySelectorAll('.leave-tabs a')[2].addEventListener('click', showAdminPaidLeave);
      document.getElementById('return-unpaid').addEventListener('click', showAdminLeave);
      document.getElementById('unpaid-reason').addEventListener('change', event => {
        const detailFields = document.getElementById('unpaid-detail-fields');
        const detailMessage = document.getElementById('unpaid-detail-message');
        if (!event.target.value) {
          detailFields.hidden = true;
          detailMessage.hidden = false;
          detailMessage.textContent = 'Seleccione el motivo acción para continuar con el formulario de registro';
          return;
        }
        detailFields.innerHTML = `<label><span>Fecha de inicio *</span><input class="unpaid-start-date" required type="date"></label><label><span>Fecha fin</span><input class="unpaid-end-date" type="date"></label><label><span>Cantidad días</span><input class="unpaid-days" type="number" min="1" placeholder="Cantidad días" readonly></label><label class="full"><span>Anotaciones</span><small class="unpaid-notes-count">250</small><textarea maxlength="250" rows="3" placeholder="Anotaciones"></textarea></label>`;
        detailFields.hidden = false;
        detailMessage.hidden = true;
        const notes = detailFields.querySelector('textarea');
        const counter = detailFields.querySelector('.unpaid-notes-count');
        notes?.addEventListener('input', () => { if (counter) counter.textContent = String(250 - notes.value.length); });
        const startDate = detailFields.querySelector('.unpaid-start-date');
        const endDate = detailFields.querySelector('.unpaid-end-date');
        const days = detailFields.querySelector('.unpaid-days');
        const updateDays = () => {
          days.value = '';
          if (!startDate.value || !endDate.value) return;
          const start = Date.parse(`${startDate.value}T00:00:00Z`);
          const end = Date.parse(`${endDate.value}T00:00:00Z`);
          if (end < start) return;
          days.value = String(Math.floor((end - start) / 86400000) + 1);
        };
        startDate.addEventListener('change', updateDays);
        endDate.addEventListener('change', updateDays);
      });
      document.querySelector('.unpaid-table').addEventListener('unpaid-edit-record', event => {
        const record = event.detail.record || {};
        const recordData = record.datos || {};
        const unpaidRecordValue = (...terms) => {
          const entries = Object.entries(recordData).map(([label,value]) => ({normalized:normalizeField(label),value}));
          return entries.find(entry => terms.some(term => entry.normalized === normalizeField(term)))?.value || 'No registrado';
        };
        const resolutionType = record.tipoResolucion || unpaidRecordValue('Tipo de resolución');
        const resolutionNumber = record.resolucion || unpaidRecordValue('Número resolución (######-año-IGED)', 'Número de resolución', 'Número resolución');
        const resolutionDate = record.fechaResolucion || unpaidRecordValue('Fecha de resolución');
        const regime = record.regimen || unpaidRecordValue('Régimen laboral');
        const action = record.accion || unpaidRecordValue('Acción');
        const reason = record.motivo || unpaidRecordValue('Motivo acción');
        const startValue = record.inicio || unpaidRecordValue('Fecha de inicio');
        const endValue = record.fin || unpaidRecordValue('Fecha fin', 'Fecha de fin');
        const escapeUnpaidHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
        const modification = modal('Modificatoria de la acción', `<div class="action-modification unpaid-modification"><label class="modification-action-type"><span>Tipo de acción <b>*</b></span><select id="unpaid-modification-action" required><option value=""></option><option>DAR POR CONCLUIDO</option><option>DECLARAR NULO</option><option>DEJAR SIN EFECTO</option><option>MODIFICAR / RECTIFICAR</option></select></label><fieldset><legend>Datos de la resolución a modificar</legend><div class="modification-current-data"><div><strong>Tipo de resolución</strong><span>${escapeUnpaidHtml(resolutionType)}</span></div><div><strong>Número de resolución</strong><span>${escapeUnpaidHtml(resolutionNumber)}</span></div><div><strong>Fecha de resolución</strong><span>${escapeUnpaidHtml(resolutionDate)}</span></div><div><strong>Régimen</strong><span>${escapeUnpaidHtml(regime)}</span></div><div><strong>Acción</strong><span>${escapeUnpaidHtml(action)}</span></div><div><strong>Motivo acción</strong><span>${escapeUnpaidHtml(reason)}</span></div></div></fieldset><fieldset><legend>Datos principales de la resolución de modificatoria</legend><div class="modification-form-grid"><label><span>Tipo de resolución <b>*</b></span><select required>${ascentResolutionOptions}</select></label><label><span>Número resolución (######-año-IGED) <b>*</b></span><input required placeholder="Número de resolución"></label><label><span>Fecha resolución <b>*</b></span><input required type="date"></label><label><span>Documento <b>*</b></span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div></fieldset><fieldset class="unpaid-modification-detail"><legend>Detalle de la resolución de modificatoria</legend><p id="unpaid-modification-message">Seleccione un tipo de acción para continuar con el formulario de registro</p><div id="unpaid-modification-fields" hidden><div id="unpaid-rectification-fields" class="cessation-rectification-fields" hidden><label><span>Campo a modificar</span><select id="unpaid-field"><option value=""></option><option>FECHA DE FIN</option><option>FECHA DE INICIO</option></select></label><div class="cessation-says"><span>Dice</span><strong id="unpaid-current-value">—</strong></div><label><span>Debe decir <b>*</b></span><input id="unpaid-new-value" type="date"></label><button id="unpaid-add-change" type="button">✚ AGREGAR</button><div id="unpaid-added-changes" class="cessation-added-changes"></div></div><label class="modification-notes"><span>Anotaciones</span><span class="modification-count">250</span><textarea maxlength="250" placeholder="Anotaciones"></textarea></label><button id="unpaid-modification-save" class="unpaid-modification-save" type="button">▣ GUARDAR</button></div></fieldset></div>`, []);
        const modalPanel = modification.querySelector('.app-modal');
        modalPanel.classList.add('action-modification-modal','unpaid-modification-modal');
        const unpaidCurrentResolutionValues = modification.querySelectorAll('.modification-current-data span');
        if (unpaidCurrentResolutionValues[2]) unpaidCurrentResolutionValues[2].textContent = formatTableDate(resolutionDate);
        const type = modification.querySelector('#unpaid-modification-action');
        const message = modification.querySelector('#unpaid-modification-message');
        const fields = modification.querySelector('#unpaid-modification-fields');
        const rectification = modification.querySelector('#unpaid-rectification-fields');
        const field = modification.querySelector('#unpaid-field');
        const currentValue = modification.querySelector('#unpaid-current-value');
        const newValue = modification.querySelector('#unpaid-new-value');
        const addedChanges = modification.querySelector('#unpaid-added-changes');
        const saveButton = modification.querySelector('#unpaid-modification-save');
        let unpaidPendingCorrection = null;
        type.addEventListener('change', () => {
          const selected = Boolean(type.value);
          message.hidden = selected;
          fields.hidden = !selected;
          rectification.hidden = type.value !== 'MODIFICAR / RECTIFICAR';
          saveButton.hidden = false;
          fields.querySelector('.unpaid-conclusion-date')?.remove();
          if (type.value === 'DAR POR CONCLUIDO') {
            const conclusionDate = document.createElement('label');
            conclusionDate.className = 'unpaid-conclusion-date';
            conclusionDate.innerHTML = '<span>Fecha de término <b>*</b></span><input required type="date">';
            fields.insertBefore(conclusionDate, fields.querySelector('.modification-notes'));
          }
        });
        field.addEventListener('change', () => {
          currentValue.textContent = field.value === 'FECHA DE FIN' ? formatTableDate(endValue) : field.value === 'FECHA DE INICIO' ? formatTableDate(startValue) : '—';
          newValue.value = '';
          unpaidPendingCorrection = null;
        });
        modification.querySelector('#unpaid-add-change').addEventListener('click', () => {
          if (!field.value || !newValue.value) { alert('Seleccione el campo e ingrese la nueva fecha.'); return; }
          const item = document.createElement('div');
          unpaidPendingCorrection = {label:field.value === 'FECHA DE FIN' ? 'Fecha fin' : 'Fecha de inicio',value:newValue.value};
          item.innerHTML = `<strong>${field.value}</strong><span>${currentValue.textContent} → ${formatTableDate(newValue.value)}</span>`;
          addedChanges.appendChild(item);
          newValue.value = '';
        });
        saveButton.addEventListener('click', async () => {
          if (!type.value) { alert('Seleccione el tipo de acción.'); return; }
          const required = [...modification.querySelectorAll('[required]')].find(control => !control.value);
          if (required) { required.focus(); required.reportValidity?.(); return; }
          const primaryGrid = modification.querySelector('.modification-form-grid');
          const primaryLabels = [...primaryGrid.querySelectorAll(':scope > label')];
          const primaryValue = text => primaryLabels.find(label => label.querySelector(':scope > span')?.textContent.includes(text))?.querySelector('input,select')?.value || '';
          const updates = {
            'Tipo de resolución': primaryValue('Tipo de resolución'),
            'Número resolución (######-año-IGED)': primaryValue('Número resolución'),
            'Fecha de resolución': primaryValue('Fecha resolución')
          };
          if (unpaidPendingCorrection) updates[unpaidPendingCorrection.label] = unpaidPendingCorrection.value;
          if (field.value && newValue.value) updates[field.value === 'FECHA DE FIN' ? 'Fecha fin' : 'Fecha de inicio'] = newValue.value;
          if (!validateDateSequence({resolutionDate:updates['Fecha de resolución'],startDate:updates['Fecha de inicio']||startValue,endDate:updates['Fecha fin']||endValue})) return;
          try {
            const updateResponse = await fetch('api/formularios-registro.php',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:record.id,dni:server.dni,formulario:'unpaid-form',estado:'APROBADO',datos:updates})});
            const updateResult = await updateResponse.json();
            if(!updateResponse.ok||!updateResult.ok) throw new Error(updateResult.mensaje||'No se pudo modificar el registro.');
            const auditData = new FormData();
            auditData.append('dni',server.dni);auditData.append('codmod',server.codigoAnterior||server.codigo);auditData.append('formulario','modifier-form');auditData.append('estado','APROBADO');
            auditData.append('datos',JSON.stringify({'Registro objetivo':String(record.id||''),'Tipo de acción':type.value,'Resolución modificada':resolutionNumber,...updates}));auditData.append('resumen','{}');
            const documentInput = primaryGrid.querySelector('input[type="file"]');
            if(documentInput?.files[0]) auditData.append('archivo_0',documentInput.files[0]);
            const auditResponse = await fetch('api/formularios-registro.php',{method:'POST',body:auditData});
            const auditResult = await auditResponse.json();
            if(!auditResponse.ok||!auditResult.ok) throw new Error(auditResult.mensaje||'No se pudo guardar la nueva resolución.');
            modification.remove();
            const unpaidForm=document.getElementById('unpaid-form');
            if(unpaidForm){delete unpaidForm.dataset.dbRecordsLoading;await loadGenericFormRecords(unpaidForm);}
            alert('Modificatoria guardada correctamente.');
          } catch(error) { alert(error.message||'No se pudo guardar la modificatoria.'); }
        });
      });
      document.getElementById('unpaid-form').addEventListener('submit', event => { event.preventDefault(); alert('Licencia sin goce guardada correctamente.'); });
      window.location.hash = 'licencias-sin-goce';
    };
    const showAdminPaidLeave = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      leaveMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs leave-tabs"><a>Vacaciones</a><a>Licencias sin goce de remuneraciones</a><a class="active">Licencias con goce de remuneraciones</a></nav><fieldset class="admin-server-card"><legend>Datos de licencias con goce de remuneraciones</legend><div class="paid-table"><div class="paid-head"><span>N°</span><span>Acción</span><span>Motivo</span><span>Régimen</span><span>Días/horas</span><span>F. inicio</span><span>F. fin</span><span>Resolución</span><span>Estado</span><span>Acciones</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 0 páginas</strong></div></div></fieldset><form id="paid-form"><fieldset class="admin-server-card"><legend>Datos principales de la resolución</legend><div class="ingress-form-grid"><label><span>Tipo de resolución *</span><select required><option value="">Seleccione tipo de resolución</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN DIRECTORAL</option><option>RESOLUCIÓN JEFATURAL</option></select></label><label><span>Número resolución (######-año-IGED) *</span><input required placeholder="Número de resolución"></label><label><span>Fecha de resolución *</span><input required type="date"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label><span></span><label><span>Régimen laboral</span><select><option value="">Seleccione régimen laboral</option><option>LEY N° 29944</option><option>LEY N° 30512</option><option>D.L. N° 276</option><option>D.L. N° 1057 CAS</option></select></label><label><span>Acción</span><select><option value="">Seleccione acción</option><option>LICENCIA CON GOCE</option><option>PERMISO CON GOCE</option><option>AMPLIACIÓN DE LICENCIA</option></select></label><label><span>Motivo acción</span><select id="paid-reason"><option value="">Seleccione motivo</option><option>ENFERMEDAD O ACCIDENTE</option><option>MATERNIDAD</option><option>PATERNIDAD</option><option>FALLECIMIENTO DE FAMILIAR</option><option>CAPACITACIÓN OFICIALIZADA</option><option>CITACIÓN JUDICIAL</option></select></label></div></fieldset><fieldset class="admin-server-card ingress-detail"><legend>Detalle de la resolución</legend><p id="paid-detail-message">Seleccione el motivo acción para continuar con el formulario de registro</p><div id="paid-detail-fields" class="ingress-form-grid" hidden><label><span>Unidad de tiempo *</span><select><option>DÍAS</option><option>HORAS</option></select></label><label><span>Cantidad *</span><input type="number" min="1" placeholder="Días u horas"></label><label><span>Fecha de inicio *</span><input type="date"></label><label><span>Fecha de fin *</span><input type="date"></label><label><span>Documento sustentatorio</span><input type="file" accept="application/pdf"></label><label><span>Estado</span><select><option>APROBADO</option><option>MODIFICADO</option><option>ANULADO</option></select></label><label class="full"><span>Observaciones</span><textarea rows="3" placeholder="Observaciones"></textarea></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="leave-actions"><button id="return-paid" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      document.querySelector('#paid-form .ingress-form-grid label select').innerHTML = ascentResolutionOptions;
      const paidResolutionInput = [...document.querySelectorAll('#paid-form fieldset:first-child .ingress-form-grid label')]
        .find(label => label.querySelector(':scope > span')?.textContent.includes('Número resolución'))?.querySelector('input');
      if (paidResolutionInput) {
        paidResolutionInput.pattern = '\\d{6}-\\d{4}-.+';
        paidResolutionInput.title = 'Ingrese 6 números, 4 números del año y la entidad. Ejemplo: 001223-2026-DRE HUANCAVELICA';
        paidResolutionInput.addEventListener('keydown', event => {
          if (event.key !== 'Backspace' || paidResolutionInput.selectionStart !== paidResolutionInput.selectionEnd) return;
          const caret = paidResolutionInput.selectionStart;
          if (caret === paidResolutionInput.value.length && paidResolutionInput.value.endsWith('-')) {
            event.preventDefault();
            paidResolutionInput.value = paidResolutionInput.value.slice(0, -2);
            paidResolutionInput.dispatchEvent(new Event('input', {bubbles:true}));
          }
        });
        paidResolutionInput.addEventListener('input', () => {
          const plain = paidResolutionInput.value.toUpperCase().replace(/-/g, '');
          const leadingDigits = plain.match(/^\d{0,10}/)?.[0] || '';
          if (leadingDigits.length < 6) {
            paidResolutionInput.value = leadingDigits;
            return;
          }
          const firstPart = leadingDigits.slice(0, 6);
          const yearPart = leadingDigits.slice(6, 10);
          if (yearPart.length < 4) {
            paidResolutionInput.value = `${firstPart}-${yearPart}`;
            return;
          }
          const entity = plain.slice(10).replace(/[^A-Z0-9 ]/g, '');
          paidResolutionInput.value = `${firstPart}-${yearPart}-${entity}`;
        });
      }
      document.getElementById('paid-reason').innerHTML = `<option value="">Seleccione motivo</option><option>CITACIÓN EXPRESA, JUDICIAL, MILITAR O POLICIAL</option><option>LICENCIA CON GOCE DE REMUNERACIONES</option><option>POR DESEMPEÑO DE CONSEJERO REGIONAL</option><option>POR ADOPCIÓN</option><option>POR BECAS DE ESTUDIOS</option><option>POR CAPACITACIÓN ORGANIZADA POR EL MINISTERIO DE EDUCACIÓN O LOS GOBIERNOS REGIONALES</option><option>POR DESCANSO PRE Y POST NATAL</option><option>POR ENFERMEDAD GRAVE, TERMINAL O POR ACCIDENTE GRAVE DE FAMILIAR</option><option>POR ENFERMEDAD O ACCIDENTE O INCAPACIDAD TEMPORAL</option><option>POR ESTUDIOS DE POST GRADO, ESPECIALIZACIÓN O PERFECCIONAMIENTO, SIEMPRE QUE CUENTE CON AUSPICIO DEL MINEDU O GOBIERNO REGIONAL</option><option>POR FALLECIMIENTO DE PADRES, CÓNYUGE E HIJOS</option><option>POR PATERNIDAD</option><option>POR REPRESENTACIÓN OFICIAL DEL ESTADO PERUANO</option><option>POR REPRESENTACIÓN SINDICAL</option><option>POR SINIESTROS</option>`;
      setupAutomaticLeaveData('paid-form', 'LICENCIA CON GOCE DE REMUNERACIONES');
      document.querySelectorAll('.leave-tabs a')[0].addEventListener('click', showAdminLeave);
      document.querySelectorAll('.leave-tabs a')[1].addEventListener('click', showAdminUnpaidLeave);
      document.getElementById('return-paid').addEventListener('click', showAdminLeave);
      document.querySelector('.paid-table').addEventListener('paid-edit-record', event => {
        const record = event.detail.record || {};
        const recordData = record.datos || {};
        const recordValue = (...terms) => {
          const entries = Object.entries(recordData).map(([label,value]) => ({normalized:normalizeField(label),value}));
          return entries.find(entry => terms.some(term => entry.normalized === normalizeField(term)))?.value || 'No registrado';
        };
        const resolutionType = recordValue('Tipo de resolución');
        const resolutionNumber = recordValue('Número resolución (######-año-IGED)', 'Número de resolución', 'Número resolución');
        const resolutionDate = recordValue('Fecha de resolución');
        const regime = recordValue('Régimen laboral');
        const action = recordValue('Acción');
        const reason = recordValue('Motivo acción');
        const escapeModificationHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
        const modification = modal('Modificatoria de la acción', `<div class="action-modification paid-modification"><label class="modification-action-type"><span>Tipo de acción <b>*</b></span><select id="paid-modification-action" required><option value=""></option><option>DAR POR CONCLUIDO</option><option>DECLARAR NULO</option><option>DEJAR SIN EFECTO</option><option>MODIFICAR / RECTIFICAR</option></select></label><fieldset><legend>Datos de la resolución a modificar</legend><div class="modification-current-data"><div><strong>Tipo de resolución</strong><span>${escapeModificationHtml(resolutionType)}</span></div><div><strong>Número de resolución</strong><span>${escapeModificationHtml(resolutionNumber)}</span></div><div><strong>Fecha de resolución</strong><span>${escapeModificationHtml(resolutionDate)}</span></div><div><strong>Régimen</strong><span>${escapeModificationHtml(regime)}</span></div><div><strong>Acción</strong><span>${escapeModificationHtml(action)}</span></div><div><strong>Motivo acción</strong><span>${escapeModificationHtml(reason)}</span></div></div></fieldset><fieldset><legend>Datos principales de la resolución de modificatoria</legend><div class="modification-form-grid"><label><span>Tipo de resolución <b>*</b></span><select required>${ascentResolutionOptions}</select></label><label><span>Número resolución (######-año-IGED) <b>*</b></span><input required placeholder="Número de resolución"></label><label><span>Fecha resolución <b>*</b></span><input required type="date"></label><label><span>Documento <b>*</b></span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div></fieldset><fieldset class="unpaid-modification-detail"><legend>Detalle de la resolución de modificatoria</legend><p id="paid-modification-message">Seleccione un tipo de acción para continuar con el formulario de registro</p><div id="paid-modification-fields" hidden></div></fieldset></div>`, []);
        modification.querySelector('.app-modal').classList.add('action-modification-modal','unpaid-modification-modal');
        const paidCurrentResolutionValues = modification.querySelectorAll('.modification-current-data span');
        if (paidCurrentResolutionValues[2]) paidCurrentResolutionValues[2].textContent = formatTableDate(resolutionDate);
        const typeSelect = modification.querySelector('#paid-modification-action');
        const message = modification.querySelector('#paid-modification-message');
        const fields = modification.querySelector('#paid-modification-fields');
        const renderDetail = () => {
          const selected = typeSelect.value;
          message.hidden = Boolean(selected);
          fields.hidden = !selected;
          if (!selected) { fields.innerHTML = ''; return; }
          const endDate = selected === 'DAR POR CONCLUIDO' ? '<label><span>Fecha de término <b>*</b></span><input required type="date"></label>' : '';
          const correction = selected === 'MODIFICAR / RECTIFICAR' ? '<div class="cessation-rectification-fields"><label><span>Campo a modificar</span><select id="paid-modification-field"><option value=""></option><option>FECHA DE FIN</option><option>FECHA DE INICIO</option></select></label><div class="cessation-says"><span>Dice</span><strong id="paid-current-value">—</strong></div><label><span>Debe decir <b>*</b></span><span id="paid-new-value-holder"><input id="paid-new-value" type="date"></span></label><button id="paid-add-change" type="button">✚ AGREGAR</button><div id="paid-added-changes" class="cessation-added-changes"></div></div>' : '';
          fields.innerHTML = `${selected === 'MODIFICAR / RECTIFICAR' ? correction : `<div class="cessation-rectification-fields">${endDate}</div>`}<label class="modification-notes"><span>Anotaciones</span><span class="modification-count">250</span><textarea maxlength="250" placeholder="Anotaciones"></textarea></label><button id="paid-modification-save" class="unpaid-modification-save" type="button" ${selected === 'MODIFICAR / RECTIFICAR' ? 'hidden' : ''}>▣ GUARDAR</button>`;
          fields.querySelector('#paid-modification-save').hidden = false;
          const notes = fields.querySelector('textarea');
          const count = fields.querySelector('.modification-count');
          notes?.addEventListener('input', () => { if (count) count.textContent = String(250 - notes.value.length); });
          const fieldSelect = fields.querySelector('#paid-modification-field');
          let pendingCorrection = null;
          fieldSelect?.addEventListener('change', () => {
            const currentValue = fields.querySelector('#paid-current-value');
            const valueHolder = fields.querySelector('#paid-new-value-holder');
            const fieldMap = {'MOTIVO ACCIÓN':'Motivo acción','FECHA DE INICIO':'Fecha de inicio','FECHA DE FIN':'Fecha fin'};
            const storedValue = fieldSelect.value ? String(recordValue(fieldMap[fieldSelect.value])) : '';
            const dateMatch = storedValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
            currentValue.textContent = fieldSelect.value ? (dateMatch ? `${dateMatch[3]}/${dateMatch[2]}/${dateMatch[1]}` : storedValue) : '—';
            valueHolder.innerHTML = fieldSelect.value === 'MOTIVO ACCIÓN' ? `<select id="paid-new-value">${document.getElementById('paid-reason').innerHTML}</select>` : '<input id="paid-new-value" type="date">';
            valueHolder.querySelector('#paid-new-value').value = '';
            pendingCorrection = null;
          });
          fields.querySelector('#paid-add-change')?.addEventListener('click', () => {
            const fieldSelect = fields.querySelector('#paid-modification-field');
            const currentValue = fields.querySelector('#paid-current-value');
            const newValue = fields.querySelector('#paid-new-value');
            if (!fieldSelect.value || !newValue.value) { (!fieldSelect.value ? fieldSelect : newValue).focus(); return; }
            const [year,month,day] = newValue.value.split('-');
            const addedChanges = fields.querySelector('#paid-added-changes');
            const displayedNewValue = fieldSelect.value === 'MOTIVO ACCIÓN' ? newValue.value : `${day}/${month}/${year}`;
            const fieldMap = {'MOTIVO ACCIÓN':'Motivo acción','FECHA DE INICIO':'Fecha de inicio','FECHA DE FIN':'Fecha fin'};
            pendingCorrection = {label:fieldMap[fieldSelect.value],value:newValue.value};
            addedChanges.innerHTML = `<div><strong>${fieldSelect.value}</strong><span>${currentValue.textContent} → ${displayedNewValue}</span></div>`;
            fields.querySelector('#paid-modification-save').hidden = false;
          });
          fields.querySelector('#paid-modification-save').addEventListener('click', async () => {
            const required = [...modification.querySelectorAll('[required]')].find(control => !control.value);
            if (required) { required.focus(); required.reportValidity?.(); return; }
            const datos = {'Registro objetivo':String(record.id || ''),'Tipo de acción':selected,'Resolución modificada':resolutionNumber};
            modification.querySelectorAll('label').forEach((label,index) => { const control=label.querySelector('input,select,textarea');if(!control||control.type==='file'||!control.value)return;const name=label.querySelector(':scope > span')?.textContent.replace(/\s*\*\s*$/,'').trim()||`Campo ${index+1}`;datos[name]=control.value; });
            const primaryGrid = modification.querySelector('.modification-form-grid');
            const primaryLabels = [...primaryGrid.querySelectorAll(':scope > label')];
            const primaryValue = text => primaryLabels.find(label => label.querySelector(':scope > span')?.textContent.includes(text))?.querySelector('input,select')?.value || '';
            const paidRecordUpdates = {
              'Tipo de resolución': primaryValue('Tipo de resolución'),
              'Número resolución (######-año-IGED)': primaryValue('Número resolución'),
              'Fecha de resolución': primaryValue('Fecha resolución')
            };
            if (pendingCorrection) paidRecordUpdates[pendingCorrection.label] = pendingCorrection.value;
            const directPaidField=fields.querySelector('#paid-modification-field');
            const directPaidValue=fields.querySelector('#paid-new-value');
            if(directPaidField?.value&&directPaidValue?.value)paidRecordUpdates[directPaidField.value==='FECHA DE FIN'?'Fecha fin':'Fecha de inicio']=directPaidValue.value;
            if(!validateDateSequence({resolutionDate:paidRecordUpdates['Fecha de resolución'],startDate:paidRecordUpdates['Fecha de inicio']||recordValue('Fecha de inicio'),endDate:paidRecordUpdates['Fecha fin']||recordValue('Fecha fin','Fecha de fin')}))return;
            const payload = new FormData();
            payload.append('dni',server.dni);payload.append('codmod',server.codigoAnterior||server.codigo);payload.append('formulario','modifier-form');payload.append('datos',JSON.stringify(datos));payload.append('resumen','{}');payload.append('estado','APROBADO');
            modification.querySelectorAll('input[type="file"]').forEach((input,index) => { if(input.files[0])payload.append(`archivo_${index}`,input.files[0]); });
            try { if(selected==='MODIFICAR / RECTIFICAR'){const updateResponse=await fetch('api/formularios-registro.php',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:record.id,dni:server.dni,formulario:'paid-form',estado:'APROBADO',datos:paidRecordUpdates})});const updateResult=await updateResponse.json();if(!updateResponse.ok||!updateResult.ok)throw new Error(updateResult.mensaje||'No se pudo modificar el registro.');}const response=await fetch('api/formularios-registro.php',{method:'POST',body:payload});const result=await response.json();if(!response.ok||!result.ok)throw new Error(result.mensaje||'No se pudo guardar.');modification.remove();const paidForm=document.getElementById('paid-form');if(paidForm){delete paidForm.dataset.dbRecordsLoading;await loadGenericFormRecords(paidForm);}alert('Modificatoria guardada correctamente.'); } catch(error) { alert(error.message||'No se pudo guardar la modificatoria.'); }
          });
        };
        typeSelect.addEventListener('change', renderDetail);
      });
      document.getElementById('paid-reason').addEventListener('change', event => {
        const reason = event.target.value;
        const detailFields = document.getElementById('paid-detail-fields');
        const detailMessage = document.getElementById('paid-detail-message');
        const unconfigured = reason === 'LICENCIA CON GOCE DE REMUNERACIONES';
        const noDetail = reason === 'POR BECAS DE ESTUDIOS';
        if (!reason) {
          detailFields.hidden = true;
          detailMessage.hidden = false;
          detailMessage.textContent = 'Seleccione el motivo acción para continuar con el formulario de registro';
          return;
        }
        if (unconfigured) {
          detailFields.hidden = true;
          detailMessage.hidden = false;
          detailMessage.textContent = 'Este motivo de acción aún no ha sido configurado.';
          return;
        }
        if (noDetail) {
          detailFields.hidden = true;
          detailMessage.hidden = true;
          return;
        }

        const includesSubsidizedDays = reason === 'CITACIÓN EXPRESA, JUDICIAL, MILITAR O POLICIAL'
          || reason === 'POR PATERNIDAD'
          || reason === 'POR ENFERMEDAD O ACCIDENTE O INCAPACIDAD TEMPORAL';
        detailFields.innerHTML = `<label><span>Fecha de inicio *</span><input required type="date"></label><label><span>Fecha fin</span><input type="date"></label><label><span>Cantidad días</span><input type="number" min="1" placeholder="Cantidad días"></label>${includesSubsidizedDays ? '<label><span>Días a cargo del sector</span><input type="number" min="0" placeholder="Días a cargo del sector"></label><label><span>Días subsidiados</span><input readonly value="-"></label><span></span>' : ''}<label class="full"><span>Anotaciones</span><small class="paid-notes-count">250</small><textarea maxlength="250" rows="3" placeholder="Anotaciones"></textarea></label>`;
        detailFields.hidden = false;
        detailMessage.hidden = true;
        const dateInputs = detailFields.querySelectorAll('input[type="date"]');
        const startDateInput = dateInputs[0];
        const endDateInput = dateInputs[1];
        const dayCountInput = detailFields.querySelector('input[placeholder="Cantidad días"]');
        const sectorDaysInput = detailFields.querySelector('input[placeholder="Días a cargo del sector"]');
        const subsidizedInput = includesSubsidizedDays ? [...detailFields.querySelectorAll('label')].find(label => label.querySelector(':scope > span')?.textContent.trim() === 'Días subsidiados')?.querySelector('input') : null;
        let subsidizedDisplay = null;
        if (subsidizedInput) {
          subsidizedDisplay = document.createElement('strong');
          subsidizedDisplay.className = 'paid-subsidized-value';
          subsidizedDisplay.textContent = '-';
          subsidizedInput.before(subsidizedDisplay);
          subsidizedInput.type = 'hidden';
          subsidizedInput.readOnly = false;
          subsidizedInput.value = '';
        }
        const updateSubsidizedDays = () => {
          if (!sectorDaysInput || !subsidizedInput || !subsidizedDisplay) return;
          const totalDays = Number.parseInt(dayCountInput.value, 10);
          const sectorDays = Number.parseInt(sectorDaysInput.value, 10);
          if (!Number.isInteger(totalDays) || !Number.isInteger(sectorDays) || sectorDays < 0 || sectorDays > totalDays) {
            subsidizedInput.value = '';
            subsidizedDisplay.textContent = '-';
            return;
          }
          const subsidizedDays = totalDays - sectorDays;
          subsidizedInput.value = String(subsidizedDays);
          subsidizedDisplay.textContent = String(subsidizedDays);
        };
        const parseLocalDate = value => {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
          const [year, month, day] = value.split('-').map(Number);
          return new Date(Date.UTC(year, month - 1, day));
        };
        const formatLocalDate = date => date.toISOString().slice(0, 10);
        const calculateDaysFromDates = () => {
          const start = parseLocalDate(startDateInput.value);
          const end = parseLocalDate(endDateInput.value);
          if (!start || !end || end < start) {
            dayCountInput.value = '';
            updateSubsidizedDays();
            return;
          }
          dayCountInput.value = String(Math.floor((end - start) / 86400000) + 1);
          updateSubsidizedDays();
        };
        const calculateEndFromDays = () => {
          const start = parseLocalDate(startDateInput.value);
          const days = Number.parseInt(dayCountInput.value, 10);
          if (!start || !Number.isInteger(days) || days < 1) return;
          const end = new Date(start.getTime());
          end.setUTCDate(end.getUTCDate() + days - 1);
          endDateInput.value = formatLocalDate(end);
        };
        startDateInput.addEventListener('change', () => {
          if (dayCountInput.value) calculateEndFromDays();
          else calculateDaysFromDates();
        });
        endDateInput.addEventListener('change', calculateDaysFromDates);
        dayCountInput.addEventListener('input', () => {
          calculateEndFromDays();
          updateSubsidizedDays();
        });
        sectorDaysInput?.addEventListener('input', updateSubsidizedDays);
        const notes = detailFields.querySelector('textarea');
        const counter = detailFields.querySelector('.paid-notes-count');
        notes?.addEventListener('input', () => { if (counter) counter.textContent = String(250 - notes.value.length); });
      });
      document.getElementById('paid-form').addEventListener('submit', event => { event.preventDefault(); alert('Licencia con goce guardada correctamente.'); });
      window.location.hash = 'licencias-con-goce';
    };
    const showAdminOthers = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      othersMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs others-tabs"><a class="active">Experiencia profesional</a><a>Instauración de proceso</a><a>Participación en comisiones</a><a>Periodo no laborado</a><a>Otros documentos</a><a>Medidas preventivas</a></nav><fieldset class="admin-server-card"><legend>Registros de experiencia profesional - público</legend><div class="experience-table"><div class="experience-head"><span>N°</span><span>Sector</span><span>Entidad</span><span>Cargo</span><span>Funciones desempeñadas</span><span>F. inicio</span><span>F. fin</span><span>Documento</span><span>Estado</span><span>Acciones</span></div><div class="experience-row"><span>1</span><span>PRIVADO</span><span>CLÍNICA DANIEL ALCIDES CARRIÓN</span><span>ENCARGADO DEL ÁREA DE INFORMÁTICA</span><span>ÁREA DE INFORMÁTICA Y SISTEMAS Y JEFATURA DE PERSONAL</span><span>02/01/2009</span><span>30/06/2010</span><span>S/N<small>Fecha: 13/07/2010</small></span><span>APROBADO</span><span><button type="button">−</button><button type="button">▦</button></span></div><div class="experience-row"><span>2</span><span>PRIVADO</span><span>XEON COMPUTER</span><span>SOPORTE TÉCNICO</span><span>SERVICIOS PERSONALES EN EL ÁREA DE SOPORTE TÉCNICO</span><span>01/07/2003</span><span>31/12/2008</span><span>S/N<small>Fecha: 01/01/2009</small></span><span>APROBADO</span><span><button type="button">−</button><button type="button">▦</button></span></div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 2 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 1 página</strong></div></div></fieldset><form id="experience-form"><fieldset class="admin-server-card"><legend>Datos de experiencia laboral</legend><div class="experience-form-grid"><div class="experience-sector full"><strong>Sector: *</strong><label><input type="radio" name="experience-sector" value="Público" required> Público</label><label><input type="radio" name="experience-sector" value="Privado"> Privado</label></div><label class="wide"><span>Entidad *</span><input required placeholder="Entidad"></label><label><span>Cargo *</span><input required placeholder="Cargo"></label><label><span>Número de documento *</span><input required placeholder="Número de documento"></label><label><span>Fecha de documento</span><input type="date"></label><span></span><label><span>Fecha de inicio</span><input type="date"></label><label><span>Fecha fin</span><input type="date"></label><span></span><label class="full"><span>Funciones desempeñadas</span><textarea maxlength="200" rows="3" placeholder="Funciones desempeñadas"></textarea><small>200</small></label><label class="full"><span>Anotaciones</span><textarea maxlength="250" rows="3" placeholder="Anotaciones"></textarea><small>250</small></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="experience-actions"><button id="return-experience" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      const experienceTable = document.querySelector('.experience-table');
      experienceTable.querySelectorAll('.experience-row').forEach(row => row.remove());
      const experiencePagination = experienceTable.querySelector('.ingress-pagination');
      experiencePagination.insertAdjacentHTML('beforebegin', '<div class="ascent-empty">No se encontraron registros</div>');
      const experienceTotals = experiencePagination.querySelectorAll('strong');
      experienceTotals[0].textContent = 'Total: 0 registros';
      experienceTotals[1].textContent = 'Total: 0 páginas';
      experienceTable.addEventListener('experience-view-record', event => {
        const record = event.detail.record || {};
        const selectedRow = event.detail.row;
        const entries = Object.entries(record.datos || {}).map(([label,value]) => ({normalized:normalizeField(label),value}));
        const value = (...terms) => entries.find(entry => terms.some(term => entry.normalized === normalizeField(term)))?.value || 'No registrado';
        const escapeHtml = input => String(input ?? '').replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
        const documentNumber = value('Número de documento');
        const documentPath = Array.isArray(record.documentos) ? record.documentos[0] : '';
        const documentName = documentPath ? `${String(documentNumber==='No registrado'?'S-N':documentNumber).replace(/[\\/:*?"<>|]/g,'-')}.pdf` : 'No registrado';
        document.querySelector('.experience-detail-view')?.remove();
        const form = document.getElementById('experience-form');
        form.hidden = true;
        const detailView = document.createElement('div');
        detailView.className = 'experience-detail-view';
        detailView.innerHTML = `<fieldset><legend>Datos de experiencia laboral</legend><div class="commission-detail-grid"><div><strong>Sector</strong><span>${escapeHtml(value('experience-sector','Sector'))}</span></div><div><strong>Entidad</strong><span>${escapeHtml(value('Entidad'))}</span></div><div><strong>Cargo</strong><span>${escapeHtml(value('Cargo'))}</span></div><div><strong>Número de documento</strong><span>${escapeHtml(documentNumber)}</span></div><div><strong>Fecha de documento</strong><span>${escapeHtml(formatTableDate(value('Fecha de documento')))}</span></div><div><strong>Funciones desempeñadas</strong><span>${escapeHtml(value('Funciones desempeñadas'))}</span></div><div><strong>Fecha inicio</strong><span>${escapeHtml(formatTableDate(value('Fecha de inicio')))}</span></div><div><strong>Fecha fin</strong><span>${escapeHtml(formatTableDate(value('Fecha fin','Fecha de fin')))}</span></div><div><strong>Anotaciones</strong><span>${escapeHtml(value('Anotaciones'))}</span></div><div><strong>Documento</strong>${documentPath?`<a href="${escapeHtml(documentPath)}" target="_blank" rel="noopener">↗ ${escapeHtml(documentName)}</a>`:`<span>${escapeHtml(documentName)}</span>`}</div><div><strong>Folios</strong><span>${escapeHtml(value('Folios'))}</span></div></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="commission-detail-actions"><button type="button" class="experience-detail-return">← RETORNAR</button><button type="button" class="experience-detail-cancel">⌫ CANCELAR</button></div>`;
        form.insertAdjacentElement('beforebegin',detailView);
        const closeDetail = () => {
          selectedRow.classList.remove('experience-selected');
          detailView.remove();
          form.hidden = false;
        };
        detailView.querySelector('.experience-detail-return').addEventListener('click',closeDetail);
        detailView.querySelector('.experience-detail-cancel').addEventListener('click',closeDetail);
      });
      document.getElementById('return-experience').addEventListener('click', () => { window.location.href = 'gestion-servidor.html'; });
      document.getElementById('experience-form').addEventListener('submit', event => { event.preventDefault(); alert('Experiencia profesional guardada correctamente.'); });
      document.querySelectorAll('.others-tabs a')[1].addEventListener('click', showAdminProcessInitiation);
      document.querySelectorAll('.others-tabs a')[2].addEventListener('click', showAdminCommissions);
      document.querySelectorAll('.others-tabs a')[3].addEventListener('click', showAdminNonWorkingPeriod);
      document.querySelectorAll('.others-tabs a')[4].addEventListener('click', showAdminOtherDocuments);
      document.querySelectorAll('.others-tabs a')[5].addEventListener('click', showAdminPreventiveMeasures);
      window.location.hash = 'otros';
    };
    const showAdminProcessInitiation = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      othersMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs others-tabs"><a>Experiencia profesional</a><a class="active">Instauración de proceso</a><a>Participación en comisiones</a><a>Periodo no laborado</a><a>Otros documentos</a><a>Medidas preventivas</a></nav><fieldset class="admin-server-card"><legend>Registros de instauración de proceso</legend><div class="process-table"><div class="process-head"><span>N°</span><span>Descripción del proceso</span><span>Resolución</span><span>Fecha notificación</span><span>Descripción de la acción</span><span>Estado</span><span>Acciones</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 0 páginas</strong></div></div></fieldset><fieldset class="admin-server-card"><legend>Instauración de proceso a archivar</legend><div class="administrative-toggle"><label class="admin-switch"><input id="archive-process" type="checkbox"><span></span></label><strong id="archive-process-label">NO</strong></div></fieldset><form id="process-form"><fieldset class="admin-server-card"><legend>Datos de resolución</legend><div class="process-form-grid"><label><span>Tipo de resolución *</span><select required><option>RESOLUCIÓN DEL ÓRGANO SANCIONADOR</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN DIRECTORAL</option></select></label><label><span>Número resolución (######-año-IGED) *</span><input required placeholder="Número de resolución"></label><label><span>Fecha de resolución *</span><input required type="date"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div></fieldset><fieldset class="admin-server-card"><legend>Datos del proceso administrativo</legend><div class="process-form-grid"><label class="wide"><span>Descripción *</span><input required placeholder="Descripción del proceso"></label><label><span>Fecha de notificación *</span><input required type="date"></label><label class="full"><span>Anotaciones</span><textarea maxlength="250" rows="3" placeholder="Anotaciones"></textarea><small>250</small></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="process-actions"><button id="return-process" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      document.querySelector('#process-form .process-form-grid label select').innerHTML = meritResolutionOptions;
      document.querySelector('.administrative-toggle').insertAdjacentHTML('beforeend', '<div id="archive-process-fields" class="archive-process-fields" hidden><label><span>Instauración de proceso administrativo *</span><select><option value=""></option></select></label><label><span>Tipo de archivamiento *</span><select><option value=""></option></select></label></div>');
      document.querySelectorAll('#archive-process-fields select')[1].innerHTML = '<option value=""></option><option>ABSOLVER</option><option>ARCHIVAR</option><option>NO HA LUGAR</option><option>PRESCRIBIR</option>';
      document.querySelectorAll('.others-tabs a')[0].addEventListener('click', showAdminOthers);
      document.querySelectorAll('.others-tabs a')[2].addEventListener('click', showAdminCommissions);
      document.querySelectorAll('.others-tabs a')[3].addEventListener('click', showAdminNonWorkingPeriod);
      document.querySelectorAll('.others-tabs a')[4].addEventListener('click', showAdminOtherDocuments);
      document.querySelectorAll('.others-tabs a')[5].addEventListener('click', showAdminPreventiveMeasures);
      document.getElementById('return-process').addEventListener('click', showAdminOthers);
      document.getElementById('archive-process').addEventListener('change', event => {
        const enabled = event.target.checked;
        document.getElementById('archive-process-label').textContent = enabled ? 'SÍ' : 'NO';
        const archiveFields = document.getElementById('archive-process-fields');
        archiveFields.hidden = !enabled;
        archiveFields.querySelectorAll('select').forEach(select => { select.required = enabled; });
      });
      document.getElementById('process-form').addEventListener('submit', event => { event.preventDefault(); alert('Instauración de proceso guardada correctamente.'); });
      window.location.hash = 'instauracion-proceso';
    };
    const showAdminCommissions = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      othersMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs others-tabs"><a>Experiencia profesional</a><a>Instauración de proceso</a><a class="active">Participación en comisiones</a><a>Periodo no laborado</a><a>Otros documentos</a><a>Medidas preventivas</a></nav><fieldset class="admin-server-card"><legend>Registros de participación en comisiones</legend><div class="commissions-table"><div class="commissions-head"><span>N°</span><span>Participación</span><span>Resolución</span><span>Días</span><span>F. inicio</span><span>F. fin</span><span>Estado</span><span>Acciones</span></div><div class="commissions-row"><span>1</span><span>PARTICIPACIÓN EN COMITÉS</span><span>R.D.R. N° 000230-2026-DRE HUANCAVELICA<small>Fecha: 02/03/2026</small></span><span>305</span><span>02/03/2026</span><span>31/12/2026</span><span>APROBADO</span><span><button>✎</button><button>−</button><button>▦</button></span></div><div class="commissions-row"><span>2</span><span>PARTICIPACIÓN EN COMITÉS</span><span>R.D.R. N° 000222-2026-DRE HUANCAVELICA<small>Fecha: 24/02/2026</small></span><span>311</span><span>24/02/2026</span><span>31/12/2026</span><span>APROBADO</span><span><button>✎</button><button>−</button><button>▦</button></span></div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 2 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 1 página</strong></div></div></fieldset><form id="commissions-form"><fieldset class="admin-server-card"><legend>Datos de la resolución</legend><div class="process-form-grid"><label><span>Tipo de resolución *</span><select required><option>RESOLUCIÓN DEL ÓRGANO SANCIONADOR</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN DIRECTORAL</option></select></label><label><span>Número resolución (######-año-IGED) *</span><input required placeholder="Número de resolución"></label><label><span>Fecha de resolución</span><input type="date"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div></fieldset><fieldset class="admin-server-card"><legend>Datos de participación en comisión</legend><div class="process-form-grid"><label><span>Tipo de participación *</span><select required><option value=""></option><option>OTROS</option><option>PARTICIPACIÓN EN COMISIONES</option><option>PARTICIPACIÓN EN COMITÉS</option></select></label><span></span><span></span><label><span>Fecha de inicio</span><input type="date"></label><label><span>Fecha fin</span><input type="date"></label><label><span>Cantidad días</span><input type="number" min="0" placeholder="Días"></label><label class="full"><span>Anotaciones</span><textarea maxlength="250" rows="3" placeholder="Anotaciones"></textarea><small>250</small></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="process-actions"><button id="return-commissions" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GRABAR</button></div></form>`;
      document.querySelector('#commissions-form .process-form-grid label select').innerHTML = meritResolutionOptions;
      const commissionsTable = document.querySelector('.commissions-table');
      commissionsTable.querySelectorAll('.commissions-row').forEach(row => row.remove());
      const commissionsPagination = commissionsTable.querySelector('.ingress-pagination');
      commissionsPagination.insertAdjacentHTML('beforebegin', '<div class="ascent-empty">No se encontraron registros</div>');
      const commissionsTotals = commissionsPagination.querySelectorAll('strong');
      commissionsTotals[0].textContent = 'Total: 0 registros';
      commissionsTotals[1].textContent = 'Total: 0 páginas';
      commissionsTable.addEventListener('commission-view-record', event => {
        const record = event.detail.record || {};
        const selectedRow = event.detail.row;
        const entries = Object.entries(record.datos || {}).map(([label,value]) => ({normalized:normalizeField(label),value}));
        const value = (...terms) => entries.find(entry => terms.some(term => entry.normalized === normalizeField(term)))?.value || 'No registrado';
        const escapeHtml = input => String(input ?? '').replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
        const startDate = value('Fecha de inicio');
        const endDate = value('Fecha fin','Fecha de fin');
        let days = value('Cantidad días');
        if(/^\d{4}-\d{2}-\d{2}$/.test(startDate)&&/^\d{4}-\d{2}-\d{2}$/.test(endDate)){
          days=String(Math.floor((new Date(`${endDate}T00:00:00Z`)-new Date(`${startDate}T00:00:00Z`))/86400000)+1);
        }
        const documentPath = Array.isArray(record.documentos) ? record.documentos[0] : '';
        const detailResolutionType = value('Tipo de resolución');
        const detailResolutionNumber = value('Número resolución (######-año-IGED)','Número de resolución','Número resolución');
        const resolutionParts = String(detailResolutionNumber).match(/^(\d{6})-(\d{4})-(.+)$/);
        const resolutionPrefix = resolutionInitials(detailResolutionType).replace(/\./g,'');
        const resolutionEntity = resolutionParts?.[3].normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9]/gi,'').toUpperCase();
        const documentName = documentPath
          ? (resolutionParts && resolutionPrefix ? `${resolutionPrefix}-${resolutionEntity}-${resolutionParts[2]}-${resolutionParts[1]}.pdf` : documentPath.split('/').pop())
          : 'No registrado';
        document.querySelectorAll('.commissions-row.commission-selected').forEach(row => row.classList.remove('commission-selected'));
        selectedRow.classList.add('commission-selected');
        document.querySelector('.commission-detail-view')?.remove();
        const form = document.getElementById('commissions-form');
        form.hidden = true;
        const detailView = document.createElement('div');
        detailView.className = 'commission-detail-view';
        detailView.innerHTML = `<fieldset><legend>Datos de la resolución</legend><div class="commission-detail-grid"><div><strong>Tipo resolución</strong><span>${escapeHtml(detailResolutionType)}</span></div><div><strong>Número de resolución</strong><span>${escapeHtml(detailResolutionNumber)}</span></div><div><strong>Fecha de resolución</strong><span>${escapeHtml(formatTableDate(value('Fecha de resolución')))}</span></div><div><strong>Documento</strong>${documentPath?`<a href="${escapeHtml(documentPath)}" target="_blank" rel="noopener">↗ ${escapeHtml(documentName)}</a>`:`<span>${escapeHtml(documentName)}</span>`}</div><div><strong>Folios</strong><span>${escapeHtml(value('Folios'))}</span></div></div></fieldset><fieldset><legend>Datos de participación en comisión</legend><div class="commission-detail-grid"><div class="commission-detail-full"><strong>Tipo de participación</strong><span>${escapeHtml(value('Tipo de participación'))}</span></div><div><strong>Fecha de inicio</strong><span>${escapeHtml(formatTableDate(startDate))}</span></div><div><strong>Fecha fin</strong><span>${escapeHtml(formatTableDate(endDate))}</span></div><div><strong>Cantidad días</strong><span>${escapeHtml(days)}</span></div><div class="commission-detail-full"><strong>Anotaciones</strong><span>${escapeHtml(value('Anotaciones'))}</span></div></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="commission-detail-actions"><button type="button" class="commission-detail-return">← RETORNAR</button><button type="button" class="commission-detail-cancel">⌫ CANCELAR</button></div>`;
        form.insertAdjacentElement('beforebegin',detailView);
        const closeDetail = () => {
          selectedRow.classList.remove('commission-selected');
          detailView.remove();
          form.hidden = false;
        };
        detailView.querySelector('.commission-detail-return').addEventListener('click',closeDetail);
        detailView.querySelector('.commission-detail-cancel').addEventListener('click',closeDetail);
      });
      commissionsTable.addEventListener('commission-edit-record', event => {
        const record = event.detail.record || {};
        const recordData = record.datos || {};
        const recordValue = (...terms) => {
          const entries = Object.entries(recordData).map(([label,value]) => ({normalized:normalizeField(label),value}));
          return entries.find(entry => terms.some(term => entry.normalized === normalizeField(term)))?.value || 'No registrado';
        };
        const resolutionType = recordValue('Tipo de resolución');
        const resolutionNumber = recordValue('Número resolución (######-año-IGED)', 'Número de resolución', 'Número resolución');
        const resolutionDate = recordValue('Fecha de resolución');
        const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
        const modification = modal('Modificatoria de la acción', `<div class="action-modification paid-modification"><label class="modification-action-type"><span>Tipo de acción <b>*</b></span><select id="commission-modification-action" required><option value=""></option><option>DECLARAR NULO</option><option>DEJAR SIN EFECTO</option><option>MODIFICAR / RECTIFICAR</option></select></label><fieldset><legend>Datos de la resolución a modificar</legend><div class="modification-current-data"><div><strong>Tipo de resolución</strong><span>${escapeHtml(resolutionType)}</span></div><div><strong>Número de resolución</strong><span>${escapeHtml(resolutionNumber)}</span></div><div><strong>Fecha de resolución</strong><span>${escapeHtml(formatTableDate(resolutionDate))}</span></div></div></fieldset><fieldset><legend>Datos principales de la resolución de modificatoria</legend><div class="modification-form-grid"><label><span>Tipo de resolución <b>*</b></span><select required>${ascentResolutionOptions}</select></label><label><span>Número resolución (######-año-IGED) <b>*</b></span><input required placeholder="Número de resolución"></label><label><span>Fecha resolución <b>*</b></span><input required type="date"></label><label><span>Documento <b>*</b></span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div></fieldset><fieldset class="unpaid-modification-detail"><legend>Detalle de la resolución de modificatoria</legend><p id="commission-modification-message">Seleccione un tipo de acción para continuar con el formulario de registro</p><div id="commission-modification-fields" hidden></div></fieldset></div>`, []);
        modification.querySelector('.app-modal').classList.add('action-modification-modal','unpaid-modification-modal');
        const typeSelect = modification.querySelector('#commission-modification-action');
        const message = modification.querySelector('#commission-modification-message');
        const fields = modification.querySelector('#commission-modification-fields');
        const participationOptions = '<option value=""></option><option>OTROS</option><option>PARTICIPACIÓN EN COMISIONES</option><option>PARTICIPACIÓN EN COMITÉS</option>';
        const renderDetail = () => {
          const selected = typeSelect.value;
          message.hidden = Boolean(selected);
          fields.hidden = !selected;
          if (!selected) { fields.innerHTML = ''; return; }
          const freeModification = selected === 'MODIFICAR / RECTIFICAR';
          const primaryGrid = modification.querySelector('.modification-form-grid');
          primaryGrid.querySelectorAll('input,select').forEach(control => { control.required = !freeModification && control.type !== 'number'; });
          primaryGrid.querySelectorAll('b').forEach(mark => { mark.hidden = freeModification; });
          const correction = selected === 'MODIFICAR / RECTIFICAR' ? `<div class="cessation-rectification-fields"><label><span>Campo a modificar</span><select id="commission-modification-field"><option value=""></option><option>FECHA DE FIN</option><option>FECHA DE INICIO</option><option>TIPO DE PARTICIPACIÓN</option></select></label><div class="cessation-says"><span>Dice</span><strong id="commission-current-value">—</strong></div><label><span>Debe decir <b>*</b></span><span id="commission-new-value-holder"><input id="commission-new-value" type="date"></span></label><button id="commission-add-change" type="button">✚ AGREGAR</button><div id="commission-added-changes" class="cessation-added-changes"></div></div>` : '';
          fields.innerHTML = `${correction}<label class="modification-notes"><span>Anotaciones</span><span class="modification-count">250</span><textarea maxlength="250" placeholder="Anotaciones"></textarea></label><button id="commission-modification-save" class="unpaid-modification-save" type="button">▣ GUARDAR</button>`;
          const notes = fields.querySelector('textarea');
          notes.addEventListener('input', () => { fields.querySelector('.modification-count').textContent = String(250 - notes.value.length); });
          const fieldSelect = fields.querySelector('#commission-modification-field');
          fieldSelect?.addEventListener('change', () => {
            const fieldMap = {'FECHA DE FIN':['Fecha fin','Fecha de fin'],'FECHA DE INICIO':['Fecha de inicio'],'TIPO DE PARTICIPACIÓN':['Tipo de participación']};
            const current = fieldSelect.value ? String(recordValue(...fieldMap[fieldSelect.value])) : '—';
            fields.querySelector('#commission-current-value').textContent = /FECHA/.test(fieldSelect.value) ? formatTableDate(current) : current;
            fields.querySelector('#commission-new-value-holder').innerHTML = fieldSelect.value === 'TIPO DE PARTICIPACIÓN' ? `<select id="commission-new-value">${participationOptions}</select>` : '<input id="commission-new-value" type="date">';
          });
          fields.querySelector('#commission-add-change')?.addEventListener('click', () => {
            const newValue = fields.querySelector('#commission-new-value');
            if (!fieldSelect.value || !newValue?.value) { (!fieldSelect.value ? fieldSelect : newValue)?.focus(); return; }
            const displayed = /FECHA/.test(fieldSelect.value) ? formatTableDate(newValue.value) : newValue.value;
            fields.querySelector('#commission-added-changes').innerHTML = `<div><strong>${fieldSelect.value}</strong><span>${fields.querySelector('#commission-current-value').textContent} → ${displayed}</span></div>`;
          });
          fields.querySelector('#commission-modification-save').addEventListener('click', async () => {
            const required = [...modification.querySelectorAll('[required]')].find(control => !control.value);
            if (required) { required.focus(); required.reportValidity?.(); return; }
            const primaryLabels = [...primaryGrid.querySelectorAll(':scope > label')];
            const primaryValue = text => primaryLabels.find(label => label.querySelector(':scope > span')?.textContent.includes(text))?.querySelector('input,select')?.value || '';
            const updates = {};
            const newResolutionType = primaryValue('Tipo de resolución');
            const newResolutionNumber = primaryValue('Número resolución');
            const newResolutionDate = primaryValue('Fecha resolución');
            if (newResolutionType) updates['Tipo de resolución'] = newResolutionType;
            if (newResolutionNumber) updates['Número resolución (######-año-IGED)'] = newResolutionNumber;
            if (newResolutionDate) updates['Fecha de resolución'] = newResolutionDate;
            const selectedField = fields.querySelector('#commission-modification-field')?.value;
            const newValue = fields.querySelector('#commission-new-value')?.value;
            if (selected === 'MODIFICAR / RECTIFICAR') {
              if (selectedField && !newValue) { fields.querySelector('#commission-new-value')?.focus(); return; }
              if (selectedField) {
                const updateMap = {'FECHA DE FIN':'Fecha fin','FECHA DE INICIO':'Fecha de inicio','TIPO DE PARTICIPACIÓN':'Tipo de participación'};
                updates[updateMap[selectedField]] = newValue;
              }
              const effectiveStart = updates['Fecha de inicio']||recordValue('Fecha de inicio');
              const effectiveEnd = updates['Fecha fin']||recordValue('Fecha fin','Fecha de fin');
              if (!validateDateSequence({resolutionDate:updates['Fecha de resolución']||recordValue('Fecha de resolución'),startDate:effectiveStart,endDate:effectiveEnd})) return;
              if (/^\d{4}-\d{2}-\d{2}$/.test(effectiveStart) && /^\d{4}-\d{2}-\d{2}$/.test(effectiveEnd) && (selectedField === 'FECHA DE INICIO' || selectedField === 'FECHA DE FIN')) {
                const startDate = new Date(`${effectiveStart}T00:00:00Z`);
                const endDate = new Date(`${effectiveEnd}T00:00:00Z`);
                updates['Cantidad días'] = String(Math.floor((endDate - startDate) / 86400000) + 1);
              }
            }
            const datos = {'Registro objetivo':String(record.id || ''),'Tipo de acción':selected,'Resolución modificada':resolutionNumber,'Anotaciones':notes.value};
            const payload = new FormData();
            payload.append('dni',server.dni);payload.append('codmod',server.codigoAnterior||server.codigo);payload.append('formulario','modifier-form');payload.append('datos',JSON.stringify(datos));payload.append('resumen','{}');payload.append('estado','APROBADO');
            modification.querySelectorAll('input[type="file"]').forEach((input,index) => { if(input.files[0])payload.append(`archivo_${index}`,input.files[0]); });
            try {
              if (selected === 'MODIFICAR / RECTIFICAR' && Object.keys(updates).length) {
                const updateResponse = await fetch('api/formularios-registro.php',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:record.id,dni:server.dni,formulario:'commissions-form',estado:'APROBADO',datos:updates})});
                const updateResult = await updateResponse.json();
                if(!updateResponse.ok||!updateResult.ok) throw new Error(updateResult.mensaje||'No se pudo modificar el registro.');
              }
              const response = await fetch('api/formularios-registro.php',{method:'POST',body:payload});
              const result = await response.json();
              if(!response.ok||!result.ok) throw new Error(result.mensaje||'No se pudo guardar.');
              modification.remove();
              const form = document.getElementById('commissions-form');
              delete form.dataset.dbRecordsLoading;
              await loadGenericFormRecords(form);
              alert('Modificatoria guardada correctamente.');
            } catch(error) { alert(error.message||'No se pudo guardar la modificatoria.'); }
          });
        };
        typeSelect.addEventListener('change', renderDetail);
      });
      document.querySelectorAll('.others-tabs a')[0].addEventListener('click', showAdminOthers);
      document.querySelectorAll('.others-tabs a')[1].addEventListener('click', showAdminProcessInitiation);
      document.querySelectorAll('.others-tabs a')[3].addEventListener('click', showAdminNonWorkingPeriod);
      document.querySelectorAll('.others-tabs a')[4].addEventListener('click', showAdminOtherDocuments);
      document.querySelectorAll('.others-tabs a')[5].addEventListener('click', showAdminPreventiveMeasures);
      document.getElementById('return-commissions').addEventListener('click', showAdminOthers);
      const commissionResolutionNumber = document.querySelector('#commissions-form input[placeholder^="Número resolución"]');
      commissionResolutionNumber.addEventListener('input', () => {
        const raw = commissionResolutionNumber.value.toUpperCase().replace(/[^0-9A-ZÁÉÍÓÚÜÑ ]/g, '');
        const match = raw.match(/^(\d{0,6})(\d{0,4})(.*)$/);
        if (!match) return;
        const [, number, year, suffix] = match;
        commissionResolutionNumber.value = number
          + (number.length === 6 ? '-' : '')
          + year
          + (year.length === 4 ? '-' : '')
          + suffix.replace(/^\s+/, '');
      });
      const commissionDetail = document.querySelectorAll('#commissions-form .process-form-grid')[1];
      const [commissionStartDate, commissionEndDate] = commissionDetail.querySelectorAll('input[type="date"]');
      const commissionDays = commissionDetail.querySelector('input[type="number"]');
      commissionDays.readOnly = true;
      const updateCommissionDays = () => {
        commissionEndDate.min = commissionStartDate.value;
        if (!commissionStartDate.value || !commissionEndDate.value || commissionEndDate.value < commissionStartDate.value) {
          commissionDays.value = '';
          return;
        }
        const start = new Date(`${commissionStartDate.value}T00:00:00Z`);
        const end = new Date(`${commissionEndDate.value}T00:00:00Z`);
        commissionDays.value = Math.floor((end - start) / 86400000) + 1;
      };
      commissionStartDate.addEventListener('input', updateCommissionDays);
      commissionEndDate.addEventListener('input', updateCommissionDays);
      commissionStartDate.addEventListener('change', updateCommissionDays);
      commissionEndDate.addEventListener('change', updateCommissionDays);
      document.getElementById('commissions-form').addEventListener('submit', event => { event.preventDefault(); alert('Participación en comisión grabada correctamente.'); });
      window.location.hash = 'participacion-comisiones';
    };
    const showAdminNonWorkingPeriod = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      othersMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs others-tabs"><a>Experiencia profesional</a><a>Instauración de proceso</a><a>Participación en comisiones</a><a class="active">Periodo no laborado</a><a>Otros documentos</a><a>Medidas preventivas</a></nav><fieldset class="admin-server-card"><legend>Registros de Periodo No Laborado</legend><div class="nonworking-table"><div class="nonworking-head"><span>N°</span><span>Motivo</span><span>Documento</span><span>Fec. documento</span><span>Fec. inicio</span><span>Fec. fin</span><span>Estado</span><span>Acciones</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 0 páginas</strong></div></div></fieldset><form id="nonworking-form"><fieldset class="admin-server-card"><legend>Datos de Periodo No Laborado</legend><div class="nonworking-form-grid"><label><span>Motivo *</span><select required><option value="">Seleccione motivo</option><option>INASISTENCIA INJUSTIFICADA</option><option>HUELGA</option><option>SUSPENSIÓN SIN GOCE</option><option>ABANDONO DE CARGO</option><option>OTRO</option></select></label><label><span>Tipo documento *</span><select required><option value="">Seleccione tipo de documento</option><option>RESOLUCIÓN</option><option>MEMORANDO</option><option>OFICIO</option><option>INFORME</option></select></label><span></span><label><span>Fecha documento</span><input type="date"></label><label><span>Número documento *</span><input required placeholder="Número de documento"></label><span></span><label><span>Fecha de inicio</span><input type="date"></label><label><span>Fecha fin</span><input type="date"></label><label><span>Cantidad días</span><input type="number" min="0" placeholder="Días"></label><label class="full"><span>Anotaciones</span><textarea maxlength="250" rows="3" placeholder="Anotaciones"></textarea><small>250</small></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="nonworking-actions"><button id="return-nonworking" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      const nonWorkingDocumentOptions = '<option value=""></option><option>OFICIO</option><option>CARTA</option><option>INFORME</option><option>DECRETO DIRECTORAL</option><option>RESOLUCION DE ALCALDIA</option><option>RESOLUCION DIRECTORAL</option><option>RESOLUCION DIRECTORAL USE</option><option>RESOLUCION DE LA DIRECCION DEPARTAMENTAL</option><option>RESOLUCION DIRECTORAL REGIONAL</option><option>RESOLUCION DIRECTORAL REGIONAL SECTORIAL</option><option>RESOLUCION DIRECTORAL SUPERIOR</option><option>RESOLUCION DIRECTORAL SUB REGIONAL</option><option>RESOLUCION DIRECTORAL SUB REGIONAL SECTORIAL</option><option>RESOLUCION DIRECTORAL ZONAL</option><option>RESOLUCION DE GERENCIA REGIONAL</option><option>RESOLUCION DE GERENCIA SECTORIAL REGIONAL</option><option>RESOLUCION EJECUTIVA REGIONAL</option><option>RESOLUCION JEFATURAL</option><option>RESOLUCION MINISTERIAL</option><option>RESOLUCION REGIONAL SECTORIAL</option><option>RESOLUCION DE SECRETARIA GENERAL</option><option>RESOLUCION SECTORIAL REGIONAL</option><option>RESOLUCION SERVIR</option><option>RESOLUCION VICEMINISTERIAL</option><option>RESOLUCION DEL ORGANO SANCIONADOR</option><option>RESOLUCION DEL ORGANO INSTRUCTOR</option><option>RESOLUCION ADMINISTRATIVA</option><option>RESOLUCION JUDICIAL</option><option>RESOLUCION SUPREMA</option><option>RESOLUCION DIRECTORAL ADMINISTRATIVA</option><option>RESOLUCION ADMINISTRATIVA DIRECTORAL</option>';
      document.querySelector('#nonworking-form .nonworking-form-grid').innerHTML = `<label><span>Motivo *</span><select required><option value=""></option><option>ABANDONO DE CARGO</option><option>OTRO</option></select></label><label><span>Tipo Documento *</span><select required>${nonWorkingDocumentOptions}</select></label><span></span><label><span>Fecha documento *</span><input required type="date"></label><label><span>Número documento *</span><input required></label><span></span><label><span>Fecha de inicio</span><input type="date"></label><label><span>Fecha fin</span><input type="date"></label><label><span>Cantidad días</span><input type="number" min="0"></label><label class="full"><span>Anotaciones</span><textarea maxlength="250" rows="3"></textarea><small>250</small></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso: máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1"></label>`;
      document.querySelectorAll('.others-tabs a')[0].addEventListener('click', showAdminOthers);
      document.querySelectorAll('.others-tabs a')[1].addEventListener('click', showAdminProcessInitiation);
      document.querySelectorAll('.others-tabs a')[2].addEventListener('click', showAdminCommissions);
      document.querySelectorAll('.others-tabs a')[4].addEventListener('click', showAdminOtherDocuments);
      document.querySelectorAll('.others-tabs a')[5].addEventListener('click', showAdminPreventiveMeasures);
      document.getElementById('return-nonworking').addEventListener('click', showAdminOthers);
      document.getElementById('nonworking-form').addEventListener('submit', event => { event.preventDefault(); alert('Periodo no laborado guardado correctamente.'); });
      window.location.hash = 'periodo-no-laborado';
    };
    const showAdminOtherDocuments = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      othersMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs others-tabs"><a>Experiencia profesional</a><a>Instauración de proceso</a><a>Participación en comisiones</a><a>Periodo no laborado</a><a class="active">Otros documentos</a><a>Medidas preventivas</a></nav><fieldset class="admin-server-card"><legend>Registros de otros documentos</legend><div class="otherdocs-table"><div class="otherdocs-head"><span>N°</span><span>Documento</span><span>Fec. documento</span><span>Entidad</span><span>Asunto</span><span>Estado</span><span>Acciones</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 0 páginas</strong></div></div></fieldset><form id="otherdocs-form"><fieldset class="admin-server-card"><legend>Datos de Otros documentos</legend><div class="otherdocs-form-grid"><label><span>Tipo de documento *</span><select required><option value="">Seleccione tipo de documento</option><option>OFICIO</option><option>MEMORANDO</option><option>INFORME</option><option>RESOLUCIÓN</option><option>CARTA</option><option>CONSTANCIA</option><option>OTRO</option></select></label><label><span>Número documento *</span><input required placeholder="Número de documento"></label><label><span>Fecha documento *</span><input required type="date"></label><label class="full"><span>Institución que emite la resolución *</span><input required placeholder="Institución o entidad emisora"></label><label class="full"><span>Asunto *</span><textarea maxlength="200" rows="3" required placeholder="Asunto"></textarea><small>200</small></label><label class="full"><span>Anotaciones</span><textarea maxlength="250" rows="3" placeholder="Anotaciones"></textarea><small>250</small></label><label><span>Documento sustentatorio *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="otherdocs-actions"><button id="return-otherdocs" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      const otherDocumentOptions = '<option value="">Seleccione tipo de documento</option><option>OFICIO</option><option>CARTA</option><option>INFORME</option><option>DECRETO DIRECTORAL</option><option>RESOLUCION DE ALCALDIA</option><option>RESOLUCION DIRECTORAL</option><option>RESOLUCION DIRECTORAL USE</option><option>RESOLUCION DE LA DIRECCION DEPARTAMENTAL</option><option>RESOLUCION DIRECTORAL REGIONAL</option><option>RESOLUCION DIRECTORAL REGIONAL SECTORIAL</option><option>RESOLUCION DIRECTORAL SUPERIOR</option><option>RESOLUCION DIRECTORAL SUB REGIONAL</option><option>RESOLUCION DIRECTORAL SUB REGIONAL SECTORIAL</option><option>RESOLUCION DIRECTORAL ZONAL</option><option>RESOLUCION DE GERENCIA REGIONAL</option><option>RESOLUCION DE GERENCIA SECTORIAL REGIONAL</option><option>RESOLUCION EJECUTIVA REGIONAL</option><option>RESOLUCION JEFATURAL</option><option>RESOLUCION MINISTERIAL</option><option>RESOLUCION REGIONAL SECTORIAL</option><option>RESOLUCION DE SECRETARIA GENERAL</option><option>RESOLUCION SECTORIAL REGIONAL</option><option>RESOLUCION SERVIR</option><option>RESOLUCION VICEMINISTERIAL</option><option>RESOLUCION DEL ORGANO SANCIONADOR</option><option>RESOLUCION DEL ORGANO INSTRUCTOR</option><option>RESOLUCION ADMINISTRATIVA</option><option>RESOLUCION JUDICIAL</option><option>RESOLUCION SUPREMA</option><option>RESOLUCION DIRECTORAL ADMINISTRATIVA</option><option>RESOLUCION ADMINISTRATIVA DIRECTORAL</option>';
      document.querySelector('#otherdocs-form .otherdocs-form-grid label select').innerHTML = otherDocumentOptions;
      const otherdocsTable = document.querySelector('.otherdocs-table');
      otherdocsTable.addEventListener('otherdocs-view-record', event => {
        const record = event.detail.record || {};
        const selectedRow = event.detail.row;
        const entries = Object.entries(record.datos || {}).map(([label,value]) => ({normalized:normalizeField(label),value}));
        const value = (...terms) => entries.find(entry => terms.some(term => entry.normalized === normalizeField(term)))?.value || 'No registrado';
        const escapeHtml = input => String(input ?? '').replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
        const documentType = value('Tipo de documento');
        const documentNumber = value('Número documento','Número de documento');
        const documentPath = Array.isArray(record.documentos) ? record.documentos[0] : '';
        const resolutionParts = String(documentNumber).match(/^(\d{6})-(\d{4})[- ]?(.+)$/);
        const resolutionPrefix = resolutionInitials(documentType).replace(/\./g,'');
        const resolutionEntity = resolutionParts?.[3].normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9]/gi,'').toUpperCase();
        const documentName = documentPath
          ? (resolutionParts && resolutionPrefix ? `${resolutionPrefix}-${resolutionEntity}-${resolutionParts[2]}-${resolutionParts[1]}.pdf` : `${String(documentNumber).replace(/[\\/:*?"<>|]/g,'-')}.pdf`)
          : 'No registrado';
        document.querySelector('.otherdocs-detail-view')?.remove();
        const form = document.getElementById('otherdocs-form');
        form.hidden = true;
        const detailView = document.createElement('div');
        detailView.className = 'otherdocs-detail-view';
        detailView.innerHTML = `<fieldset><legend>Datos de Otros documentos</legend><div class="commission-detail-grid"><div><strong>Tipo de documento</strong><span>${escapeHtml(documentType)}</span></div><div><strong>Número documento</strong><span>${escapeHtml(documentNumber)}</span></div><div><strong>Fecha documento</strong><span>${escapeHtml(formatTableDate(value('Fecha documento','Fecha de documento')))}</span></div><div class="commission-detail-full"><strong>Institución que emite la resolución</strong><span>${escapeHtml(value('Institución que emite la resolución','Institución','Entidad'))}</span></div><div class="commission-detail-full"><strong>Asunto</strong><span>${escapeHtml(value('Asunto'))}</span></div><div class="commission-detail-full"><strong>Anotaciones</strong><span>${escapeHtml(value('Anotaciones'))}</span></div><div><strong>Documento</strong>${documentPath?`<a href="${escapeHtml(documentPath)}" target="_blank" rel="noopener">↗ ${escapeHtml(documentName)}</a>`:`<span>${escapeHtml(documentName)}</span>`}</div><div><strong>Folios</strong><span>${escapeHtml(value('Folios'))}</span></div></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="commission-detail-actions"><button type="button" class="otherdocs-detail-return">← RETORNAR</button><button type="button" class="otherdocs-detail-cancel">⌫ CANCELAR</button></div>`;
        form.insertAdjacentElement('beforebegin',detailView);
        const closeDetail = () => {
          selectedRow.classList.remove('otherdocs-selected');
          detailView.remove();
          form.hidden = false;
        };
        detailView.querySelector('.otherdocs-detail-return').addEventListener('click',closeDetail);
        detailView.querySelector('.otherdocs-detail-cancel').addEventListener('click',closeDetail);
      });
      document.querySelectorAll('.others-tabs a')[0].addEventListener('click', showAdminOthers);
      document.querySelectorAll('.others-tabs a')[1].addEventListener('click', showAdminProcessInitiation);
      document.querySelectorAll('.others-tabs a')[2].addEventListener('click', showAdminCommissions);
      document.querySelectorAll('.others-tabs a')[3].addEventListener('click', showAdminNonWorkingPeriod);
      document.querySelectorAll('.others-tabs a')[5].addEventListener('click', showAdminPreventiveMeasures);
      document.getElementById('return-otherdocs').addEventListener('click', showAdminOthers);
      document.getElementById('otherdocs-form').addEventListener('submit', event => { event.preventDefault(); alert('Documento guardado correctamente.'); });
      window.location.hash = 'otros-documentos';
    };
    const showAdminPreventiveMeasures = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      othersMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs others-tabs"><a>Experiencia profesional</a><a>Instauración de proceso</a><a>Participación en comisiones</a><a>Periodo no laborado</a><a>Otros documentos</a><a class="active">Medidas preventivas</a></nav><fieldset class="admin-server-card"><legend>Registros de separación preventiva</legend><div class="preventive-table"><div class="preventive-head"><span>N°</span><span>Motivo</span><span>Régimen</span><span>F. notificación</span><span>F. inicio</span><span>F. fin</span><span>Resultado</span><span>Resolución</span><span>Estado</span><span>Acciones</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 0 páginas</strong></div></div></fieldset><form id="preventive-form"><fieldset class="admin-server-card"><legend>Datos principales de la resolución</legend><div class="ingress-form-grid"><label><span>Tipo de resolución *</span><select required><option value="">Seleccione tipo de resolución</option><option>RESOLUCIÓN DIRECTORAL REGIONAL</option><option>RESOLUCIÓN DIRECTORAL</option><option>RESOLUCIÓN DEL ÓRGANO SANCIONADOR</option></select></label><label><span>Número resolución (######-año-IGED) *</span><input required placeholder="Número de resolución"></label><label><span>Fecha de resolución *</span><input required type="date"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label><span></span><label><span>Régimen laboral</span><select><option value="">Seleccione régimen laboral</option><option>LEY N° 29944</option><option>LEY N° 30512</option><option>D.L. N° 276</option><option>D.L. N° 1057 CAS</option></select></label><label><span>Acción</span><select><option value="">Seleccione acción</option><option>SEPARACIÓN PREVENTIVA</option><option>MEDIDA CAUTELAR</option><option>REUBICACIÓN TEMPORAL</option></select></label><label><span>Motivo acción</span><select id="preventive-reason"><option value="">Seleccione motivo</option><option>PROCESO ADMINISTRATIVO DISCIPLINARIO</option><option>DENUNCIA PENAL</option><option>PROTECCIÓN DEL SERVICIO EDUCATIVO</option><option>OTRO</option></select></label></div></fieldset><fieldset class="admin-server-card ingress-detail"><legend>Detalle de la resolución</legend><p id="preventive-detail-message">Seleccione el motivo acción para continuar con el formulario de registro</p><div id="preventive-detail-fields" class="ingress-form-grid" hidden><label><span>Fecha de notificación *</span><input type="date"></label><label><span>Fecha de inicio *</span><input type="date"></label><label><span>Fecha de fin</span><input type="date"></label><label><span>Resultado</span><select><option>PENDIENTE</option><option>ARCHIVADO</option><option>SANCIONADO</option><option>REINCORPORADO</option></select></label><label><span>Estado</span><select><option>VIGENTE</option><option>CONCLUIDO</option><option>ANULADO</option></select></label><label><span>Observaciones</span><input placeholder="Observaciones"></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="leave-actions"><button id="return-preventive" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      document.querySelectorAll('.others-tabs a')[0].addEventListener('click', showAdminOthers);
      document.querySelectorAll('.others-tabs a')[1].addEventListener('click', showAdminProcessInitiation);
      document.querySelectorAll('.others-tabs a')[2].addEventListener('click', showAdminCommissions);
      document.querySelectorAll('.others-tabs a')[3].addEventListener('click', showAdminNonWorkingPeriod);
      document.querySelectorAll('.others-tabs a')[4].addEventListener('click', showAdminOtherDocuments);
      document.querySelector('#preventive-form .ingress-form-grid label select').innerHTML = ascentResolutionOptions;
      document.getElementById('return-preventive').addEventListener('click', showAdminOthers);
      document.getElementById('preventive-reason').addEventListener('change', event => {
        document.getElementById('preventive-detail-fields').hidden = !event.target.value;
        document.getElementById('preventive-detail-message').hidden = Boolean(event.target.value);
      });
      document.getElementById('preventive-form').addEventListener('submit', event => { event.preventDefault(); alert('Medida preventiva guardada correctamente.'); });
      window.location.hash = 'medidas-preventivas';
    };
    const bindReportHubTabs = activeIndex => {
      const tabs = adminContent.querySelector('.report-tabs, .resume-tabs');
      if (!tabs) return;
      const labels = ['Crear informe', 'Crear informe manual', 'Historial de informes', 'Crear hoja de vida', 'Historial de hoja de vida', 'Informe escalafonario'];
      const handlers = [showAdminReport, showAdminManualReport, showAdminReportHistory, showAdminResume, showAdminResumeHistory, showAdminEscalafonSelection];
      tabs.className = 'admin-server-tabs report-tabs resume-tabs';
      tabs.innerHTML = labels.map((label, index) => `<a class="${index === activeIndex ? 'active' : ''}">${label}</a>`).join('');
      tabs.querySelectorAll('a').forEach((tab, index) => tab.addEventListener('click', handlers[index]));
    };
    const showAdminReport = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      reportMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs report-tabs"><a class="active">Crear informe</a><a>Crear informe manual</a><a>Historial de informes</a></nav><form id="report-form"><fieldset class="admin-server-card"><legend>Generación de informe escalafonario</legend><fieldset class="admin-server-card report-inner"><legend>Datos del informe escalafonario</legend><div class="report-form-grid"><label><span>Tipo de informe *</span><select required><option value="">Seleccione tipo de informe</option><option>INFORME ESCALAFONARIO</option><option>INFORME DE TIEMPO DE SERVICIOS</option><option>INFORME PARA QUINQUENIO</option><option>INFORME PARA BENEFICIOS</option></select></label><label><span>Motivo de informe</span><select><option value="">Seleccione motivo</option><option>TRÁMITE ADMINISTRATIVO</option><option>CESE O JUBILACIÓN</option><option>BENEFICIO LABORAL</option><option>OTRO</option></select></label><label class="report-notes"><span>Anotaciones</span><textarea maxlength="400" rows="3" placeholder="Anotaciones"></textarea><small>400</small></label><label><span>Fecha de generación *</span><input required type="date"></label></div></fieldset><fieldset class="admin-server-card report-inner"><legend>Expediente de solicitud de informe escalafonario</legend><div class="report-form-grid three"><label><span>Número de expediente</span><input placeholder="Número de expediente"></label><label><span>Nombre de solicitante</span><input placeholder="Nombre del solicitante"></label><label><span>Fecha de expediente *</span><input required type="date"></label></div></fieldset></fieldset><div class="report-actions"><button id="return-report" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button id="preview-report" type="button">◉ VISTA PREVIA</button><button type="submit">▣ GENERAR</button></div></form>`;
      const reportFormSelects = document.querySelectorAll('#report-form .report-form-grid select');
      reportFormSelects[0].innerHTML = '<option value=""></option><option>INFORME DE REINGRESO A LA CARRERA ...</option><option>INFORME DE DESIGNACION</option><option>INFORME DE DESTAQUE</option><option>INFORME DE ENCARGATURA</option><option>INFORME DE PERMUTA</option><option>INFORME DE REASIGNACION</option><option>INFORME DE CESE TEMPORAL EN EL CAR...</option><option>INFORME DE DESTITUCION</option><option>INFORME DE OTORGAMIENTO</option><option>INFORME DE OTORGAR SUBSIDIO POR LU...</option><option>INFORME DE RETENCIONES JUDICIALES</option><option>INFORME DE ASIGNACION DE HORAS ADI...</option><option>INFORME DE UBICACION</option><option>INFORME DE SUSPENSION TEMPORAL</option><option>INFORME DE UBICACION ESCALA MAGIST...</option><option>INFORME DE LICENCIA CON GOCE DE RE...</option><option>INFORME DE LICENCIA SIN GOCE DE RE...</option><option>INFORME DE AMONESTACION ESCRITA</option><option>INFORME DE INHABILITACION</option><option>INFORME DE VACACIONES</option><option>INFORME DE RECONOCIMIENTO DE TIEMP...</option><option>OTROS</option><option>EVALUACION ORDINARIA DE PERMANENCIA</option><option>TÉRMINO DE LA CARRERA PUBLICA ...</option>';
      const completedReportNames = {
        'INFORME DE REINGRESO A LA CARRERA ...': 'INFORME DE REINGRESO A LA CARRERA PUBLICA MAGISTERIAL',
        'INFORME DE CESE TEMPORAL EN EL CAR...': 'INFORME DE CESE TEMPORAL EN EL CARGO SIN GOCE DE REMUNERACIONES',
        'INFORME DE OTORGAR SUBSIDIO POR LU...': 'INFORME DE OTORGAR SUBSIDIO POR LUTO - SEPELIO',
        'INFORME DE ASIGNACION DE HORAS ADI...': 'INFORME DE ASIGNACION DE HORAS ADICIONALES',
        'INFORME DE UBICACION ESCALA MAGIST...': 'INFORME DE UBICACIÓN ESCALA MAGISTERIAL',
        'INFORME DE LICENCIA CON GOCE DE RE...': 'INFORME DE LICENCIA CON GOCE DE REMUNERACIONES',
        'INFORME DE LICENCIA SIN GOCE DE RE...': 'INFORME DE LICENCIA SIN GOCE DE REMUNERACIONES',
        'INFORME DE RECONOCIMIENTO DE TIEMP...': 'INFORME DE RECONOCIMIENTO DE TIEMPO DE SERVICIO COMO CONTRATADO',
        'TÉRMINO DE LA CARRERA PUBLICA ...': 'TÉRMINO DE LA CARRERA PÚBLICA DOCENTE'
      };
      reportFormSelects[0].querySelectorAll('option').forEach(option => {
        if (completedReportNames[option.textContent]) option.textContent = completedReportNames[option.textContent];
        option.title = option.textContent;
      });
      const reportReasons = {
        'INFORME DE REINGRESO A LA CARRERA PUBLICA MAGISTERIAL': ['A SOLICITUD'],
        'INFORME DE DESIGNACION': ['CONCURSO PUBLICO'],
        'INFORME DE DESTAQUE': ['NECESIDAD DE SERVICIO'],
        'INFORME DE ENCARGATURA': ['DE PUESTO', 'DE FUNCIONES'],
        'INFORME DE PERMUTA': ['PERMUTA'],
        'INFORME DE REASIGNACION': ['POR RAZONES DE SALUD', 'POR INTERES PERSONAL', 'POR UNIDAD FAMILIAR', 'POR RACIONALIZACION', 'SITUACIONES DE EMERGENCIA'],
        'INFORME DE CESE TEMPORAL EN EL CARGO SIN GOCE DE REMUNERACIONES': ['SANCION'],
        'INFORME DE DESTITUCION': ['SANCION'],
        'INFORME DE OTORGAMIENTO': ['OTORGAR ASIGNACION POR TIEMPO DE SERVICIOS POR 25 AÑOS', 'OTORGAR ASIGNACION POR TIEMPO DE SERVICIOS POR 30 AÑOS', 'OTORGAR COMPENSACION POR TIEMPO DE SERVICIOS', 'OTORGAR CREDITO DEVENGADO', 'OTORGAR INCENTIVO POR ESTUDIOS DE POST GRADO', 'OTORGAR INCENTIVO POR EXCELENCIA PROFESIONAL Y DESEMPEÑO DESTACADO', 'OTORGAR REMUNERACION VACACIONAL TRUNCA'],
        'INFORME DE OTORGAR SUBSIDIO POR LUTO - SEPELIO': ['OTORGAR SUBSIDIO POR LUTO Y SEPELIO'],
        'INFORME DE RETENCIONES JUDICIALES': ['RETENCION JUDICIAL'],
        'INFORME DE ASIGNACION DE HORAS ADICIONALES': ['ASIGNACION DE HORAS ADICIONALES'],
        'INFORME DE UBICACION': ['UBICAR COMO DOCENTE'],
        'INFORME DE SUSPENSION TEMPORAL': ['SANCION'],
        'INFORME DE UBICACIÓN ESCALA MAGISTERIAL': ['POR UBICACION'],
        'INFORME DE LICENCIA CON GOCE DE REMUNERACIONES': ['CITACION EXPRESA, JUDICIAL, MILITAR O POLICIAL', 'PATERNIDAD', 'POR DESEMPEÑO DE CONSEJERO REGIONAL', 'POR ADOPCION', 'POR ASUMIR REPRESENTACION OFICIAL DEL ESTADO PERUANO', 'POR CAPACITACION ORGANIZADA POR EL MINISTERIO DE EDUCACION O LOS GOBIERNOS REGIONA...', 'POR ENFERMEDAD GRAVE, TERMINAL O POR ACCIDENTE GRAVE DE FAMILIAR', 'POR ESTUDIOS DE POST GRADO, ESPECI...', 'POR FALLECIMIENTO DE PADRES, CONYUGE E HIJOS', 'POR INCAPACIDAD TEMPORAL PARA EL TRABAJO (ENFERMEDAD)', 'POR MATERNIDAD', 'POR REPRESENTACION SINDICAL', 'POR SINIESTROS'],
        'TÉRMINO DE LA CARRERA PÚBLICA DOCENTE': ['RENUNCIA', 'INCAPACIDAD PERMANENTE (FISICA O M...', 'SANCION', 'FALLECIMIENTO', 'LIMITE DE EDAD'],
        'EVALUACION ORDINARIA DE PERMANENCIA': ['EVALUACION ORDINARIA DE PERMANENCIA'],
        'OTROS': ['OTROS'],
        'INFORME DE RECONOCIMIENTO DE TIEMPO DE SERVICIO COMO CONTRATADO': ['RECONOCIMIENTO DE TIEMPO DE SERVIC...'],
        'INFORME DE VACACIONES': ['APROBAR ROL DE VACACIONES'],
        'INFORME DE INHABILITACION': ['INHABILITACION'],
        'INFORME DE AMONESTACION ESCRITA': ['SANCION'],
        'INFORME DE LICENCIA SIN GOCE DE REMUNERACIONES': ['POR DESEMPEÑO DE FUNCIÓN PÚBLICA O POR ASUMIR CARGOS PÚBLICOS', 'POR ENFERMEDAD GRAVE DE LOS PADRES, CONYUGE, CONVIVIENTE O HIJOS', 'POR ESTUDIOS DE POST GRADO, ESPECIALIZACIÓN O PERFECCIONAMIENTO, SIEMPRE QUE CUENTE SIN AUSPICIO DEL MINEDU O DEL GOBIERNO REGIONAL', 'POR MOTIVOS O ASUNTOS PARTICULARES', 'POR ACOMPAÑAMIENTO PEDAGOGICO']
      };
      const updateReportReasons = () => {
        const reasons = reportReasons[reportFormSelects[0].value] || [];
        reportFormSelects[1].innerHTML = '<option value=""></option>' + reasons.map(reason => `<option>${reason}</option>`).join('');
        reportFormSelects[1].querySelectorAll('option').forEach(option => { option.title = option.textContent; });
        reportFormSelects[0].title = reportFormSelects[0].selectedOptions[0]?.textContent || '';
      };
      reportFormSelects[0].addEventListener('change', updateReportReasons);
      reportFormSelects[1].addEventListener('change', () => {
        reportFormSelects[1].title = reportFormSelects[1].selectedOptions[0]?.textContent || '';
      });
      updateReportReasons();
      reportFormSelects[1].required = true;
      reportFormSelects[1].previousElementSibling.textContent = 'Motivo de informe *';
      document.getElementById('return-report').addEventListener('click', () => { window.location.href = 'gestion-servidor.html'; });
      document.getElementById('preview-report').addEventListener('click', () => alert(`Vista previa del informe escalafonario de ${server.nombreRegistro}.`));
      document.getElementById('report-form').addEventListener('submit', event => { event.preventDefault(); if (!event.currentTarget.reportValidity()) return; alert('Informe escalafonario generado correctamente.'); });
      document.querySelectorAll('.report-tabs a')[1].addEventListener('click', showAdminManualReport);
      document.querySelectorAll('.report-tabs a')[2].addEventListener('click', showAdminReportHistory);
      bindReportHubTabs(0);
      window.location.hash = 'informe';
    };
    const showAdminManualReport = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      reportMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs report-tabs"><a>Crear informe</a><a class="active">Crear informe manual</a><a>Historial de informes</a></nav><form id="manual-report-form"><fieldset class="admin-server-card manual-report-card"><legend>Generación de informe escalafonario</legend><fieldset class="admin-server-card report-inner"><legend>Datos del informe escalafonario</legend><div class="report-form-grid manual"><label><span>Tipo de informe *</span><select required><option value="">Seleccione tipo de informe</option><option>INFORME ESCALAFONARIO MANUAL</option><option>INFORME DE TIEMPO DE SERVICIOS</option><option>INFORME PARA QUINQUENIO</option><option>INFORME PARA BENEFICIOS</option></select></label><label><span>Motivo de informe *</span><select required><option value="">Seleccione motivo</option><option>TRÁMITE ADMINISTRATIVO</option><option>CESE O JUBILACIÓN</option><option>BENEFICIO LABORAL</option><option>OTRO</option></select></label><label class="report-notes"><span>Anotaciones</span><textarea maxlength="400" rows="3" placeholder="Anotaciones"></textarea><small>400</small></label></div></fieldset><fieldset class="admin-server-card report-inner"><legend>Expediente de solicitud de informe escalafonario</legend><div class="report-form-grid manual"><label><span>Número de expediente</span><input placeholder="Número de expediente"></label><label><span>Nombre de solicitante</span><input placeholder="Nombre del solicitante"></label></div></fieldset></fieldset><div class="report-actions manual-actions"><button id="return-manual-report" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GENERAR</button></div></form>`;
      const manualReportSelects = document.querySelectorAll('#manual-report-form .report-form-grid select');
      manualReportSelects[0].innerHTML = '<option value=""></option><option>INFORME DE REINGRESO A LA CARRERA PUBLICA MAGISTERIAL</option><option>INFORME DE DESIGNACION</option><option>INFORME DE DESTAQUE</option><option>INFORME DE ENCARGATURA</option><option>INFORME DE PERMUTA</option><option>INFORME DE REASIGNACION</option><option>INFORME DE CESE TEMPORAL EN EL CARGO SIN GOCE DE REMUNERACIONES</option><option>INFORME DE DESTITUCION</option><option>INFORME DE OTORGAMIENTO</option><option>INFORME DE OTORGAR SUBSIDIO POR LUTO - SEPELIO</option><option>INFORME DE RETENCIONES JUDICIALES</option><option>INFORME DE ASIGNACION DE HORAS ADICIONALES</option><option>INFORME DE UBICACION</option><option>INFORME DE SUSPENSION TEMPORAL</option><option>INFORME DE UBICACIÓN ESCALA MAGISTERIAL</option><option>INFORME DE LICENCIA CON GOCE DE REMUNERACIONES</option><option>INFORME DE LICENCIA SIN GOCE DE REMUNERACIONES</option><option>INFORME DE AMONESTACION ESCRITA</option><option>INFORME DE INHABILITACION</option><option>INFORME DE VACACIONES</option><option>INFORME DE RECONOCIMIENTO DE TIEMPO DE SERVICIO COMO CONTRATADO</option><option>OTROS</option><option>EVALUACION ORDINARIA DE PERMANENCIA</option><option>TÉRMINO DE LA CARRERA PÚBLICA DOCENTE</option><option>REINGRESO A LA CARRERA PÚBLICA DOCENTE</option>';
      manualReportSelects[1].innerHTML = '<option value=""></option>';
      manualReportSelects[0].querySelectorAll('option').forEach(option => { option.title = option.textContent; });
      const manualReportReasons = {
        'INFORME DE REINGRESO A LA CARRERA PUBLICA MAGISTERIAL': ['A SOLICITUD'],
        'INFORME DE DESIGNACION': ['CONCURSO PUBLICO'],
        'INFORME DE DESTAQUE': ['NECESIDAD DE SERVICIO'],
        'INFORME DE ENCARGATURA': ['DE PUESTO', 'DE FUNCIONES'],
        'INFORME DE PERMUTA': ['PERMUTA'],
        'INFORME DE REASIGNACION': ['POR RAZONES DE SALUD', 'POR INTERES PERSONAL', 'POR UNIDAD FAMILIAR', 'POR RACIONALIZACION', 'SITUACIONES DE EMERGENCIA'],
        'INFORME DE CESE TEMPORAL EN EL CARGO SIN GOCE DE REMUNERACIONES': ['SANCION'],
        'INFORME DE DESTITUCION': ['SANCION'],
        'INFORME DE OTORGAMIENTO': ['OTORGAR ASIGNACION POR TIEMPO DE SERVICIOS POR 25 AÑOS', 'OTORGAR ASIGNACION POR TIEMPO DE SERVICIOS POR 30 AÑOS', 'OTORGAR COMPENSACION POR TIEMPO DE SERVICIOS', 'OTORGAR CREDITO DEVENGADO', 'OTORGAR INCENTIVO POR ESTUDIOS DE POST GRADO', 'OTORGAR INCENTIVO POR EXCELENCIA PROFESIONAL Y DESEMPEÑO DESTACADO', 'OTORGAR REMUNERACION VACACIONAL TRUNCA'],
        'INFORME DE OTORGAR SUBSIDIO POR LUTO - SEPELIO': ['OTORGAR SUBSIDIO POR LUTO Y SEPELIO'],
        'INFORME DE RETENCIONES JUDICIALES': ['RETENCION JUDICIAL'],
        'INFORME DE ASIGNACION DE HORAS ADICIONALES': ['ASIGNACION DE HORAS ADICIONALES'],
        'INFORME DE UBICACION': ['UBICAR COMO DOCENTE'],
        'INFORME DE SUSPENSION TEMPORAL': ['SANCION'],
        'INFORME DE UBICACIÓN ESCALA MAGISTERIAL': ['POR UBICACIÓN'],
        'INFORME DE LICENCIA CON GOCE DE REMUNERACIONES': ['CITACION EXPRESA, JUDICIAL, MILITAR O POLICIAL', 'PATERNIDAD', 'POR DESEMPEÑO DE CONSEJERO REGIONAL', 'POR ADOPCION', 'POR ASUMIR REPRESENTACION OFICIAL DEL ESTADO PERUANO', 'POR CAPACITACION ORGANIZADA POR EL MINISTERIO DE EDUCACION O LOS GOBIERNOS REGIONALES', 'POR ENFERMEDAD GRAVE, TERMINAL O POR ACCIDENTE GRAVE DE FAMILIAR', 'POR ESTUDIOS DE POST GRADO, ESPECI...', 'POR FALLECIMIENTO DE PADRES, CONYUGE E HIJOS', 'POR INCAPACIDAD TEMPORAL PARA EL TRABAJO (ENFERMEDAD)', 'POR MATERNIDAD', 'POR REPRESENTACION SINDICAL', 'POR SINIESTROS'],
        'INFORME DE LICENCIA SIN GOCE DE REMUNERACIONES': ['POR DESEMPEÑO DE FUNCIÓN PÚBLICA O POR ASUMIR CARGOS PÚBLICOS', 'POR ENFERMEDAD GRAVE DE LOS PADRES, CONYUGE, CONVIVIENTE O HIJOS', 'POR ESTUDIOS DE POST GRADO, ESPECIALIZACIÓN O PERFECCIONAMIENTO, SIEMPRE QUE CUENTE SIN AUSPICIO DEL MINEDU O DEL GOBIERNO REGIONAL', 'POR MOTIVOS O ASUNTOS PARTICULARES', 'POR ACOMPAÑAMIENTO PEDAGOGICO'],
        'INFORME DE AMONESTACION ESCRITA': ['SANCION'],
        'INFORME DE INHABILITACION': ['INHABILITACION'],
        'INFORME DE VACACIONES': ['APROBAR ROL DE VACACIONES'],
        'INFORME DE RECONOCIMIENTO DE TIEMPO DE SERVICIO COMO CONTRATADO': ['RECONOCIMIENTO DE TIEMPO DE SERVIC...'],
        'EVALUACION ORDINARIA DE PERMANENCIA': ['EVALUACION ORDINARIA DE PERMANENCIA'],
        'TÉRMINO DE LA CARRERA PÚBLICA DOCENTE': ['RENUNCIA', 'INCAPACIDAD PERMANENTE (FISICA O MENTAL)', 'SANCION', 'FALLECIMIENTO', 'LIMITE DE EDAD'],
        'REINGRESO A LA CARRERA PÚBLICA DOCENTE': ['A SOLICITUD']
      };
      const updateManualReportReasons = () => {
        const reasons = manualReportReasons[manualReportSelects[0].value] || [];
        manualReportSelects[1].innerHTML = '<option value=""></option>' + reasons.map(reason => `<option>${reason}</option>`).join('');
        manualReportSelects[1].querySelectorAll('option').forEach(option => { option.title = option.textContent; });
        manualReportSelects[0].title = manualReportSelects[0].selectedOptions[0]?.textContent || '';
      };
      manualReportSelects[0].addEventListener('change', updateManualReportReasons);
      manualReportSelects[1].addEventListener('change', () => {
        manualReportSelects[1].title = manualReportSelects[1].selectedOptions[0]?.textContent || '';
      });
      updateManualReportReasons();
      document.querySelectorAll('.report-tabs a')[0].addEventListener('click', showAdminReport);
      document.querySelectorAll('.report-tabs a')[2].addEventListener('click', showAdminReportHistory);
      document.getElementById('return-manual-report').addEventListener('click', () => { window.location.href = 'gestion-servidor.html'; });
      document.getElementById('manual-report-form').addEventListener('submit', event => { event.preventDefault(); if (!event.currentTarget.reportValidity()) return; alert('Informe escalafonario manual generado correctamente.'); });
      bindReportHubTabs(1);
      window.location.hash = 'informe-manual';
    };
    const showAdminReportHistory = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      reportMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs report-tabs"><a>Crear informe</a><a>Crear informe manual</a><a class="active">Historial de informes</a></nav><fieldset class="admin-server-card"><legend>Informes escalafonarios del servidor</legend><div class="report-history-table"><div class="report-history-head"><span>Número</span><span>Tipo de informe</span><span>Usuario creación</span><span>Fecha creación</span><span>Exportar informe</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option><option>20 Filas</option></select></label><strong>Total: 0 registros</strong><div><button type="button">&lt;&lt;</button><button type="button">&lt;</button><button class="active" type="button">1</button><button type="button">&gt;</button><button type="button">&gt;&gt;</button></div><strong>Total: 0 páginas&nbsp;&nbsp; ↻</strong></div></div></fieldset><div class="report-history-actions"><button id="return-report-history" type="button">← RETORNAR</button></div>`;
      document.querySelectorAll('.report-tabs a')[0].addEventListener('click', showAdminReport);
      document.querySelectorAll('.report-tabs a')[1].addEventListener('click', showAdminManualReport);
      document.getElementById('return-report-history').addEventListener('click', () => { window.location.href = 'gestion-servidor.html'; });
      bindReportHubTabs(2);
      window.location.hash = 'historial-informes';
    };
    const showAdminResume = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      resumeMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs resume-tabs"><a class="active">Crear hoja de vida</a><a>Historial de hoja de vida</a></nav><form id="resume-form"><fieldset class="admin-server-card"><legend>Generación de reporte de hoja de vida</legend><fieldset class="admin-server-card report-inner"><legend>Datos del reporte de hoja de vida</legend><div class="report-form-grid"><label class="report-notes"><span>Anotaciones</span><textarea maxlength="400" rows="3" placeholder="Anotaciones"></textarea><small>400</small></label><label><span>Fecha de generación *</span><input required type="date"></label></div></fieldset><fieldset class="admin-server-card report-inner"><legend>Expediente de solicitud de reporte de hoja de vida</legend><div class="report-form-grid three"><label><span>Número de expediente</span><input placeholder="Número de expediente"></label><label><span>Nombre de solicitante</span><input placeholder="Nombre del solicitante"></label><label><span>Fecha de expediente *</span><input required type="date"></label></div></fieldset></fieldset><div class="report-actions"><button id="return-resume" type="button">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button id="preview-resume" type="button">◉ VISTA PREVIA</button><button type="submit">▣ GENERAR</button></div></form>`;
      document.querySelectorAll('.resume-tabs a')[1].addEventListener('click', showAdminResumeHistory);
      document.getElementById('return-resume').addEventListener('click', () => { window.location.href = 'gestion-servidor.html'; });
      document.getElementById('preview-resume').addEventListener('click', () => alert(`Vista previa de la hoja de vida de ${server.nombreRegistro}.`));
      document.getElementById('resume-form').addEventListener('submit', event => { event.preventDefault(); if (!event.currentTarget.reportValidity()) return; alert('Hoja de vida generada correctamente.'); });
      bindReportHubTabs(3);
      window.location.hash = 'crear-hoja-vida';
    };
    const showAdminResumeHistory = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      resumeMenu.classList.add('active');
      adminContent.innerHTML = `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset><nav class="admin-server-tabs resume-tabs"><a>Crear hoja de vida</a><a class="active">Historial de hoja de vida</a></nav><fieldset class="admin-server-card"><legend>Reportes de hoja de vida del servidor</legend><div class="resume-history-table"><div class="resume-history-head"><span>Número</span><span>Usuario creación</span><span>Fecha creación</span><span>Exportar informe</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option><option>20 Filas</option></select></label><strong>Total: 0 registros</strong><div><button type="button">&lt;&lt;</button><button type="button">&lt;</button><button class="active" type="button">1</button><button type="button">&gt;</button><button type="button">&gt;&gt;</button></div><strong>Total: 0 páginas&nbsp;&nbsp; ↻</strong></div></div></fieldset><div class="report-history-actions"><button id="return-resume-history" type="button">← RETORNAR</button></div>`;
      document.querySelectorAll('.resume-tabs a')[0].addEventListener('click', showAdminResume);
      document.getElementById('return-resume-history').addEventListener('click', () => { window.location.href = 'gestion-servidor.html'; });
      bindReportHubTabs(4);
      window.location.hash = 'historial-hoja-vida';
    };
    const showAdminEscalafonSelection = () => {
      document.querySelectorAll('.admin-server-menu a').forEach(link => link.classList.remove('active'));
      reportMenu.classList.add('active');
      const mainFields = ['TÍTULO/GRADO INSTRUCCIÓN', 'OTROS TÍTULOS', 'MAESTRÍA/DOCTORADO', 'AUTOGENERADO ESSALUD', 'SEXO', 'LIBRETA MILITAR', 'FECHA DE NACIMIENTO', 'LUGAR DE NACIMIENTO', 'ESTADO CIVIL', 'ESTUDIOS PRIMARIA', 'ESTUDIOS SECUNDARIA', 'EST. SUPERIOR PEDAGÓGICO', 'EST. SUPERIOR TECNOLÓGICO', 'ESTUDIOS UNIVERSITARIOS', 'TIEMPO SERV. ÚLTIMO CARGO', 'TIEMPO EN EL NIVEL ACTUAL', 'FECHA DE INGRESO A LA ADM. PÚBLICA', 'FECHA DE INGRESO AL SECTOR EDUC.', 'FECHA DE INGRESO AL SERVICIO', 'TIEMPO SERV. NOMBR. DOCENTE', 'TIEMPO SERV. NOMBR. ADMINISTRATIVO', 'TIEMPO SERV. NOMBR. PROF. DE LA SALUD', 'TIEMPO SERV. CONTRATADO DOCENTE', 'TIEMPO SERV. CONTRATADO ADMINISTRATIVO', 'TIEMPO SERV. CONTRATADO PROF. DE LA SALUD', 'TIEMPO SERV. EN OTRO SECTOR', 'TIEMPO RECONOCIDO SERV. MILITAR', 'TIEMPO RECONOCIDO FUNCIÓN EDIL/CONF.', 'TIEMPO RECONOCIDO POR ESTUDIOS', 'TIEMPO SEPARACIÓN SIN GOCE', 'TOTAL LICENCIAS SIN GOCE', 'CARGOS DESEMPEÑADOS', 'CARGOS SIMULTÁNEOS', 'LICENCIAS CON GOCE PRESENTE AÑO', 'LICENCIAS SIN GOCE PRESENTE AÑO', 'LICENCIAS CON GOCE OTORGADAS A LA FECHA', 'LICENCIAS SIN GOCE OTORGADAS A LA FECHA', 'PROCESO ADMINISTRATIVO', 'EDAD EN AÑOS, MESES Y DÍAS', 'N.º DE CUENTA TELEAHORRO', 'DIRECCIÓN DOMICILIARIA / TELÉFONO', 'DIRECCIÓN DOMICILIARIA 2 / TELÉFONO', 'FECHA EN QUE CUMPLE QUINQUENIO', 'IDIOMAS', 'OBSERVACIONES', 'DESTAQUES', 'CESANTÍA', 'COMPENSACIÓN POR TIEMPO DE SERV.', 'SUBSIDIOS'];
      const annexLeftFields = ['EVALUACION', 'REMUNERACION PERSONAL/FAMILIAR', 'ENCARG.', 'MERITOS', 'DEMERITOS', 'C. DE CAPAC.', 'OTROS', 'GRUPO REMUNERATIVO', 'GRATIFICACIONES', 'BENEFICIARIO', 'TIPO DE ESTUDIOS SUPERIORES', 'FOTOGRAFIA', 'ASCENSO DE NIVEL', 'LICENCIAS RECONSIDERADAS', 'RECURSO DE APELACION', 'DECLARAR FUNDADO', 'COMISIONES', 'COMITES'];
      const annexRightFields = ['MODIFICACIONES', 'NOMBRE DEL PADRE', 'NOMBRE DE LA MADRE', 'NOMBRE DE LOS HIJOS', 'NOMBRE DE LOS HERMANOS', 'DESAFILIACION A.F.P.', 'CAMBIO DE A.F.P.', 'TIEMPO SERV. CARGO DIRECT. Y/O JERARQUICO', 'TIEMPO SERV. CARGO DOCENTE'];
      const checks = (items, group) => items.map((item, index) => `<label><input type="checkbox" name="${group}" value="${index}"><span>${item}</span></label>`).join('');
      const datedAnnexFields = new Set(['ENCARG.', 'MERITOS', 'DEMERITOS', 'C. DE CAPAC.']);
      const annexColumn = (items, offset) => `<div class="escalafon-annex-column">${items.map((item, index) => datedAnnexFields.has(item)
        ? `<label class="escalafon-date-row"><input type="checkbox" name="anexo" value="${offset + index}"><span>${item}</span><input type="text" inputmode="numeric" maxlength="10" aria-label="Fecha inicial de ${item}"><b>AL</b><input type="text" inputmode="numeric" maxlength="10" aria-label="Fecha final de ${item}"></label>`
        : `<label><input type="checkbox" name="anexo" value="${offset + index}"><span>${item}</span></label>`).join('')}</div>`;
      const annexChecks = annexColumn(annexLeftFields, 0) + annexColumn(annexRightFields, annexLeftFields.length);
      adminContent.innerHTML = `${serverSummary()}<nav class="admin-server-tabs report-tabs"></nav><section class="escalafon-selection"><header><div><strong>INFORME ESCALAFONARIO</strong><span>Reporte por selección</span></div><div><label for="escalafon-resolution">N° De Resolución</label><input id="escalafon-resolution" placeholder="N° De Resolución"></div><form id="escalafon-dni-search"><label for="escalafon-dni">Ingrese su DNI</label><input id="escalafon-dni" inputmode="numeric" maxlength="8" pattern="[0-9]{8}" autocomplete="off" placeholder="Ingrese su DNI"><small>Presione Enter para buscar</small></form><div><small>Apellidos y nombres</small><b id="escalafon-person-name">Sin búsqueda</b><small id="escalafon-search-status"></small></div></header><nav class="escalafon-section-tabs"><button class="active" type="button">DATOS PRINCIPALES</button><button type="button">DATOS ANEXOS 1</button></nav><div class="escalafon-check-panel active" data-panel="0">${checks(mainFields, 'principal')}</div><div class="escalafon-check-panel" data-panel="1">${annexChecks}</div><div class="escalafon-selection-actions"><button id="configure-escalafon" type="button">⚙ CONFIGURAR IMPRESIÓN</button><span></span><button id="select-all-escalafon" type="button">SELECCIONAR TODOS</button><button id="print-escalafon" type="button">▣ IMPRIMIR</button><button id="return-escalafon" type="button">SALIR</button></div></section>`;
      bindReportHubTabs(5);
      adminContent.querySelector('label[for="escalafon-resolution"]')?.remove();
      const dniSearchForm = document.getElementById('escalafon-dni-search');
      const dniSearchInput = document.getElementById('escalafon-dni');
      const dniSearchLabel = dniSearchForm.querySelector('label');
      dniSearchLabel.textContent = 'Ingrese DNI, apellidos o nombres';
      dniSearchInput.placeholder = 'DNI, apellidos o nombres';
      dniSearchInput.removeAttribute('maxlength');
      dniSearchInput.removeAttribute('pattern');
      dniSearchInput.removeAttribute('inputmode');
      const personName = document.getElementById('escalafon-person-name');
      const searchStatus = document.getElementById('escalafon-search-status');
      dniSearchForm.hidden = true;
      personName.textContent = server.nombreRegistro;
      searchStatus.textContent = `Código modular: ${server.codigo}`;
      searchStatus.className = 'success';
      const escalafonDirectory = [
        { dni: '23298412', codigo: '0412891', nombreRegistro: 'PAUCAR CHOQUE, EDGAR MARCELINO' },
        { dni: '40182903', codigo: '0891244', nombreRegistro: 'CONDORI HUAMÁN, ROSA MARLENE' },
        { dni: '47209118', codigo: '0649102', nombreRegistro: 'QUISPE CASAS, JOSÉ ANTONIO' },
        { dni: '20049581', codigo: '1092481', nombreRegistro: 'MATAMOROS TAYPE, GLADYS BEATRIZ' },
        { dni: '19934820', codigo: '0381023', nombreRegistro: 'CÁRDENAS RAMOS, VÍCTOR MANUEL' }
      ];
      let selectedEscalafonServer = server;
      const normalizeSearch = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();
      adminContent.querySelectorAll('.escalafon-selection input[type="text"]').forEach(input => {
        input.addEventListener('input', () => { input.value = input.value.toUpperCase(); });
      });
      dniSearchForm.addEventListener('submit', event => {
        event.preventDefault();
        const query = dniSearchInput.value.trim();
        if (!query) {
          selectedEscalafonServer = null;
          personName.textContent = 'Sin búsqueda';
          searchStatus.textContent = 'Ingrese un DNI, apellido o nombre.';
          searchStatus.className = 'error';
          return;
        }
        const normalizedQuery = normalizeSearch(query);
        const match = escalafonDirectory.find(item => item.dni === query || normalizeSearch(item.nombreRegistro).includes(normalizedQuery));
        if (!match) {
          selectedEscalafonServer = null;
          personName.textContent = 'Servidor no encontrado';
          searchStatus.textContent = `No existen datos registrados para “${query}”.`;
          searchStatus.className = 'error';
          return;
        }
        selectedEscalafonServer = match.dni === server.dni ? { ...server, ...match } : match;
        personName.textContent = match.nombreRegistro;
        searchStatus.textContent = match.codigo ? `Código modular: ${match.codigo}` : 'Servidor encontrado';
        searchStatus.className = 'success';
      });
      const sectionTabs = adminContent.querySelectorAll('.escalafon-section-tabs button');
      const panels = adminContent.querySelectorAll('.escalafon-check-panel');
      sectionTabs.forEach((tab, index) => tab.addEventListener('click', () => {
        sectionTabs.forEach(item => item.classList.remove('active'));
        panels.forEach(item => item.classList.remove('active'));
        tab.classList.add('active');
        panels[index].classList.add('active');
      }));
      document.getElementById('select-all-escalafon').addEventListener('click', event => {
        const allChecks = adminContent.querySelectorAll('.escalafon-check-panel input[type="checkbox"]');
        const selectAll = [...allChecks].some(input => !input.checked);
        allChecks.forEach(input => { input.checked = selectAll; });
        event.currentTarget.textContent = selectAll ? 'QUITAR SELECCIÓN' : 'SELECCIONAR TODOS';
      });
      document.getElementById('configure-escalafon').addEventListener('click', () => alert('Configuración de impresión del informe escalafonario.'));
      document.getElementById('print-escalafon').addEventListener('click', () => {
        if (!selectedEscalafonServer) {
          alert('Primero ingrese un DNI válido y presione Enter.');
          return;
        }
        const selected = [...adminContent.querySelectorAll('.escalafon-check-panel input[type="checkbox"]:checked')];
        if (!selected.length) {
          alert('Seleccione al menos un dato para generar el informe.');
          return;
        }
        const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
        const resolution = document.getElementById('escalafon-resolution').value.trim() || 'No registrado';
        const summarizeRecords = (records, fields) => {
          const rows = Array.isArray(records) ? records : [];
          if (!rows.length) return 'No registrado';
          return rows.map((record,index) => `${index + 1}. ${fields.map(field => recordValue(record[field])).join(' | ')}`).join('\n');
        };
        const reportDatabaseValue = name => {
          if (name === 'DESTAQUES' || name === 'ENCARG.') return summarizeRecords(selectedEscalafonServer.desplazamientos,['accion','motivo','fechaInicio','fechaFin','cargo','resolucion']);
          if (name === 'ASCENSO DE NIVEL') return summarizeRecords(selectedEscalafonServer.ascensos,['motivo','inicio','fin','nuevaEscala','resolucion']);
          if (name === 'CARGOS DESEMPEÑADOS' || name.includes('TIEMPO SERV. CARGO')) return summarizeRecords(selectedEscalafonServer.experienciaLaboral,['entidad','cargo','inicio','fin','documento']);
          if (name === 'BENEFICIARIO' || name === 'GRATIFICACIONES') return summarizeRecords(selectedEscalafonServer.beneficios,['accion','motivo','resolucion','fechaResolucion']);
          if (name === 'SUBSIDIOS') return summarizeRecords(selectedEscalafonServer.subsidios,['accion','motivo','beneficiario','importe','resolucion']);
          if (name === 'CESANTÍA') return summarizeRecords(selectedEscalafonServer.ceses,['motivo','fechaCese','tiempo','resolucion']);
          if (name === 'DESAFILIACION A.F.P.' || name === 'CAMBIO DE A.F.P.') return summarizeRecords(selectedEscalafonServer.afiliacionesPension,['regimen','afp','cuspp','fechaAfiliacion','fechaDesafiliacion']);
          if (name === 'MERITOS') return summarizeRecords(selectedEscalafonServer.meritos,['tipo','motivo','fecha','resolucion']);
          if (name === 'PROCESO ADMINISTRATIVO') return summarizeRecords(selectedEscalafonServer.sancionesAdministrativas,['sancion','resolucion','fechaResolucion','dias']);
          if (name.includes('LICENCIAS CON GOCE')) return summarizeRecords(selectedEscalafonServer.licenciasConGoce,['motivo','dias','inicio','fin','resolucion']);
          if (name.includes('LICENCIAS SIN GOCE') || name === 'TIEMPO SEPARACIÓN SIN GOCE') return summarizeRecords(selectedEscalafonServer.licenciasSinGoce,['motivo','dias','inicio','fin','resolucion']);
          if (name === 'OBSERVACIONES' || name === 'OTROS') return summarizeRecords(selectedEscalafonServer.observacionesRegistros,['motivo','resolucion','fecha']);
          if (name === 'IDIOMAS') return recordValue(selectedEscalafonServer.idiomas);
          if (name === 'SEXO') return recordValue(selectedEscalafonServer.sexo);
          if (name === 'FECHA DE NACIMIENTO') return recordValue(selectedEscalafonServer.fechaNacimiento);
          if (name === 'LUGAR DE NACIMIENTO') return recordValue(selectedEscalafonServer.lugarNacimiento);
          if (name === 'ESTADO CIVIL') return recordValue(selectedEscalafonServer.estadoCivil);
          if (name.startsWith('DIRECCIÓN DOMICILIARIA')) return recordValue(selectedEscalafonServer.direccion);
          return selectedEscalafonServer.datos?.[name] || 'No registrado';
        };
        const selectedItems = selected.map(input => {
          const label = input.closest('label');
          const name = label.querySelector('span')?.textContent.trim() || '';
          const dates = [...label.querySelectorAll('input[type="text"]')].map(field => field.value.trim()).filter(Boolean);
          const value = dates.length ? `${dates[0] || ''}${dates[1] ? ` AL ${dates[1]}` : ''}` : reportDatabaseValue(name);
          return { name, value };
        });
        const sectionDefinitions = [
          { number: 1, title: 'FILIACIÓN E IDENTIFICACIÓN', matches: ['SEXO', 'FECHA DE NACIMIENTO', 'LUGAR DE NACIMIENTO', 'ESTADO CIVIL', 'AUTOGENERADO ESSALUD', 'LIBRETA MILITAR', 'DIRECCIÓN DOMICILIARIA', 'NOMBRE DEL PADRE', 'NOMBRE DE LA MADRE', 'NOMBRE DE LOS HIJOS', 'NOMBRE DE LOS HERMANOS', 'IDIOMAS'] },
          { number: 2, title: 'SITUACIÓN ACADÉMICA', matches: ['TÍTULO/GRADO INSTRUCCIÓN', 'OTROS TÍTULOS', 'MAESTRÍA/DOCTORADO', 'ESTUDIOS PRIMARIA', 'ESTUDIOS SECUNDARIA', 'EST. SUPERIOR PEDAGÓGICO', 'EST. SUPERIOR TECNOLÓGICO', 'ESTUDIOS UNIVERSITARIOS', 'TIPO DE ESTUDIOS SUPERIORES', 'C. DE CAPAC.', 'FOTOGRAFIA'] },
          { number: 3, title: 'INGRESO O REINGRESO', matches: ['FECHA DE INGRESO', 'TIEMPO SERV. NOMBR.', 'TIEMPO SERV. CONTRATADO'] },
          { number: 4, title: 'TRAYECTORIA LABORAL', matches: ['TIEMPO SERV. ÚLTIMO CARGO', 'TIEMPO EN EL NIVEL ACTUAL', 'CARGOS DESEMPEÑADOS', 'CARGOS SIMULTÁNEOS', 'ASCENSO DE NIVEL', 'ENCARG.', 'MODIFICACIONES', 'TIEMPO SERV. CARGO'] },
          { number: 5, title: 'ASIGNACIONES E INCENTIVOS', matches: ['GRUPO REMUNERATIVO', 'GRATIFICACIONES', 'BENEFICIARIO', 'SUBSIDIOS', 'COMPENSACIÓN'] },
          { number: 6, title: 'RETIRO Y RÉGIMEN PENSIONARIO', matches: ['CESANTÍA', 'DESAFILIACION A.F.P.', 'CAMBIO DE A.F.P.', 'TIEMPO RECONOCIDO'] },
          { number: 7, title: 'PREMIOS Y ESTÍMULOS', matches: ['MERITOS', 'DEMÉRITOS'] },
          { number: 8, title: 'SANCIONES', matches: ['PROCESO ADMINISTRATIVO', 'RECURSO DE APELACION', 'DECLARAR FUNDADO'] },
          { number: 9, title: 'LICENCIAS Y VACACIONES', matches: ['LICENCIAS', 'TIEMPO SEPARACIÓN SIN GOCE'] },
          { number: 10, title: 'OTROS', matches: [] }
        ];
        const groups = new Map();
        selectedItems.forEach(item => {
          const section = sectionDefinitions.find(definition => definition.matches.some(term => item.name.includes(term))) || sectionDefinitions[9];
          if (!groups.has(section.number)) groups.set(section.number, { section, items: [] });
          groups.get(section.number).items.push(item);
        });
        const detailedSections = [...groups.values()].sort((a, b) => a.section.number - b.section.number).map(({ section, items }) => `<section class="report-section"><h2>SECCIÓN ${section.number}: ${escapeHtml(section.title)}</h2>${items.map((item, index) => `<article><h3>${section.number}.${index + 1} ${escapeHtml(item.name)}</h3><h4>${section.number}.${index + 1}.1. DETALLE DE ${escapeHtml(item.name)}</h4>${item.value === 'No registrado' ? `<p class="empty">No registra información de ${escapeHtml(item.name.toLowerCase())}.</p>` : `<table><thead><tr><th>ÍTEM</th><th>DESCRIPCIÓN</th><th>INFORMACIÓN REGISTRADA</th></tr></thead><tbody><tr><td>1</td><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.value)}</td></tr></tbody></table>`}</article>`).join('')}</section>`).join('');
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          alert('El navegador bloqueó la pestaña de impresión. Habilite las ventanas emergentes e intente nuevamente.');
          return;
        }
        const issueDate = new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'medium' }).format(new Date());
        printWindow.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Informe escalafonario - ${escapeHtml(selectedEscalafonServer.dni)}</title><style>@page{size:A4;margin:16mm 14mm 18mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;color:#34404a;font-size:10px}header{text-align:center;margin-bottom:18px}.institution{display:flex;justify-content:space-between;align-items:start;color:#59636c}.institution b{font-size:11px}.year{font-style:italic}.title{margin:18px 0 2px;font-size:18px;color:#4c5660}.subtitle{font-size:11px;font-weight:bold}.report-meta{display:grid;grid-template-columns:1fr 1fr;gap:5px 30px;margin:18px 0;text-align:left}.report-meta div{display:grid;grid-template-columns:145px 1fr}.bar{margin:10px 0 6px;padding:7px 12px;background:#596675;color:#fff;font-size:13px;font-weight:bold}.work-data{width:100%;border-collapse:collapse;margin-bottom:18px}.work-data th,.work-data td{padding:4px 7px;text-align:left;border:0}.work-data th{width:34%;font-weight:normal}.report-section{break-inside:auto;margin:12px 0}.report-section h2{margin:12px 0 8px;padding:7px;text-align:center;background:#596675;color:#fff;font-size:14px}.report-section article{break-inside:avoid;margin-bottom:13px}.report-section h3{margin:0 0 6px;padding:6px 8px;background:#667384;color:#fff;font-size:13px}.report-section h4{margin:0;padding:6px 8px;background:#d9dfe5;color:#4f5963;font-size:10px}.report-section table{width:100%;border-collapse:collapse;margin-top:5px}.report-section th,.report-section td{padding:6px;border-bottom:1px solid #ccd3d9;text-align:left;font-size:9px}.report-section th{background:#e7ebef}.empty{margin:0;padding:8px;font-weight:bold}.actions{margin:16px 0;text-align:right}.actions button{padding:10px 16px;border:0;border-radius:5px;background:#087bb8;color:#fff;font-weight:bold;cursor:pointer}.footer{margin-top:30px;padding-top:8px;border-top:1px solid #c5cbd0;color:#59636c;font-size:8px}.signature{margin:45px auto 20px;width:210px;border-top:1px solid #59636c;text-align:center;padding-top:5px}@media print{.actions{display:none}.report-section h2,.report-section h3,.bar{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><header><div class="institution"><b>PERÚ - MINISTERIO DE EDUCACIÓN</b><span class="year">Dirección Regional de Educación Huancavelica</span></div><h1 class="title">INFORME ESCALAFONARIO N° ${escapeHtml(resolution)}</h1><div class="subtitle">DIRECCIÓN REGIONAL DE EDUCACIÓN HUANCAVELICA</div><div class="report-meta"><div><b>Tipo de informe:</b><span>INFORME ESCALAFONARIO</span></div><div><b>Fecha de emisión:</b><span>${escapeHtml(issueDate)}</span></div></div></header><div class="bar">SITUACIÓN LABORAL:</div><table class="work-data"><tbody><tr><th>Apellidos y nombres</th><td>: ${escapeHtml(selectedEscalafonServer.nombreRegistro)}</td></tr><tr><th>Tipo y número de documento de identidad</th><td>: D.N.I. - ${escapeHtml(selectedEscalafonServer.dni)}</td></tr><tr><th>Régimen laboral</th><td>: ${escapeHtml(selectedEscalafonServer.regimen || 'No registrado')}</td></tr><tr><th>Institución educativa/Código modular</th><td>: ${escapeHtml(selectedEscalafonServer.institucion || 'No registrado')} / ${escapeHtml(selectedEscalafonServer.codigo)}</td></tr><tr><th>Cargo actual</th><td>: ${escapeHtml(selectedEscalafonServer.cargo || 'No registrado')}</td></tr><tr><th>Situación laboral</th><td>: ${escapeHtml(selectedEscalafonServer.condicion || 'No registrado')}</td></tr></tbody></table><div class="bar">INFORMACIÓN DETALLADA DEL INFORME ESCALAFONARIO:</div>${detailedSections}<div class="signature">Responsable de escalafón</div><div class="footer">Dirección Regional de Educación Huancavelica · Fecha y hora de emisión: ${escapeHtml(issueDate)}<br>Documento generado con los datos seleccionados por el usuario.</div><div class="actions"><button onclick="window.print()">DESCARGAR EN PDF</button></div></body></html>`);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 250);
      });
      document.getElementById('return-escalafon').addEventListener('click', showAdminResumeHistory);
      window.location.hash = 'informe-escalafonario';
    };
    const filiationTabs = active => `<nav class="admin-server-tabs filiation-tabs"><a class="${active === 0 ? 'active' : ''}">Datos generales</a><a class="${active === 1 ? 'active' : ''}">Datos domiciliarios</a><a class="${active === 2 ? 'active' : ''}">Datos de familiares</a><a class="${active === 3 ? 'active' : ''}">Acreditación de lengua nativa</a><a class="${active === 4 ? 'active' : ''}">Declaración jurada y boleta de datos</a></nav>`;
    const addFiliationStatusAction = (row,key,statusCell,actionsCell) => {
      const storageKey = `dre-filiation-status:${server.dni}:${key}`;
      const savedStatus = localStorage.getItem(storageKey) || 'APROBADO';
      statusCell.textContent = savedStatus;
      statusCell.textContent = savedStatus === 'ANULADO' || savedStatus === 'DESAPROBADO' ? 'ANULADO' : 'APROBADO';
      statusCell.classList.toggle('rejected',statusCell.textContent === 'ANULADO');
      actionsCell.innerHTML = '';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'filiation-status-toggle';
      button.title = 'Cambiar estado';
      button.textContent = '−';
      button.addEventListener('click', () => {
        const nextStatus = statusCell.textContent === 'ANULADO' ? 'APROBADO' : 'ANULADO';
        statusCell.textContent = nextStatus;
        statusCell.classList.toggle('rejected',nextStatus === 'ANULADO');
        localStorage.setItem(storageKey,nextStatus);
        saveStatusToDatabase(storageKey,nextStatus);
      });
      loadStatusFromDatabase(storageKey,status=>{statusCell.textContent=status;statusCell.classList.toggle('rejected',status==='ANULADO');});
      actionsCell.appendChild(button);
    };
    const bindFiliationTabs = () => {
      const tabs = document.querySelectorAll('.filiation-tabs a');
      tabs[0]?.addEventListener('click', () => { window.location.href = 'gestion-servidor.html'; });
      tabs[1]?.addEventListener('click', showAdminAddresses);
      tabs[2]?.addEventListener('click', showAdminFamily);
      tabs[3]?.addEventListener('click', showAdminNativeLanguage);
      tabs[4]?.addEventListener('click', showAdminDeclarations);
    };
    const serverSummary = () => `<fieldset class="admin-server-summary"><legend>Datos del servidor</legend><div class="admin-summary-grid">${detail('Documento de identidad',`DNI: ${server.dni}`)}${detail('Apellidos y nombres',server.nombreRegistro)}${detail('Régimen laboral',server.regimen)}${detail('IGED','DRE HUANCAVELICA')}${detail('Centro laboral',`${server.centroCodigo || server.codigo} - ${server.institucion}`)}${detail('Cargo',server.cargo)}${detail('Condición',server.condicion)}${detail('Situación laboral','EN ACTIVIDAD')}</div></fieldset>`;
    const setupAddressUbigeo = async () => {
      const departmentSelect = document.getElementById('address-department');
      const provinceSelect = document.getElementById('address-province');
      const districtSelect = document.getElementById('address-district');
      if (!departmentSelect || !provinceSelect || !districtSelect) return;

      const normalizeName = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();
      const resetSelect = (select, message) => {
        select.innerHTML = `<option value="">${message}</option>`;
        select.disabled = true;
      };
      const fillSelect = (select, message, records, valueKey, labelKey) => {
        select.innerHTML = `<option value="">${message}</option>${records.map(record => `<option value="${record[valueKey]}">${record[labelKey]}</option>`).join('')}`;
        select.disabled = false;
      };

      resetSelect(provinceSelect, 'Seleccione provincia');
      resetSelect(districtSelect, 'Seleccione distrito');

      try {
        const cacheKey = 'dre-ubigeo-peru-v1';
        let ubigeo = null;
        try { ubigeo = JSON.parse(localStorage.getItem(cacheKey)); } catch (_) { ubigeo = null; }

        if (!ubigeo?.departments?.length || !ubigeo?.provinces?.length || !ubigeo?.districts?.length) {
          const base = 'https://raw.githubusercontent.com/RitchieRD/ubigeos-peru-data/main/json/';
          const responses = await Promise.all([
            fetch(`${base}1_ubigeo_departamentos.json`),
            fetch(`${base}2_ubigeo_provincias.json`),
            fetch(`${base}3_ubigeo_distritos.json`)
          ]);
          if (responses.some(response => !response.ok)) throw new Error('No se pudo descargar el padrón UBIGEO.');
          const [departmentsJson, provincesJson, districtsJson] = await Promise.all(responses.map(response => response.json()));
          ubigeo = {
            departments: departmentsJson.ubigeo_departamentos,
            provinces: provincesJson.ubigeo_provincias,
            districts: districtsJson.ubigeo_distritos
          };
          try { localStorage.setItem(cacheKey, JSON.stringify(ubigeo)); } catch (_) { /* La selección sigue funcionando sin caché. */ }
        }

        departmentSelect.addEventListener('change', () => {
          const department = ubigeo.departments.find(item => normalizeName(item.departamento) === normalizeName(departmentSelect.value));
          resetSelect(districtSelect, 'Seleccione distrito');
          if (!department) {
            resetSelect(provinceSelect, 'Seleccione provincia');
            return;
          }
          const provinces = ubigeo.provinces
            .filter(item => String(item.departamento_id) === String(department.id))
            .sort((a, b) => a.provincia.localeCompare(b.provincia, 'es'));
          fillSelect(provinceSelect, 'Seleccione provincia', provinces, 'id', 'provincia');
        });

        provinceSelect.addEventListener('change', () => {
          if (!provinceSelect.value) {
            resetSelect(districtSelect, 'Seleccione distrito');
            return;
          }
          const districts = ubigeo.districts
            .filter(item => String(item.provincia_id) === String(provinceSelect.value))
            .sort((a, b) => a.distrito.localeCompare(b.distrito, 'es'));
          fillSelect(districtSelect, 'Seleccione distrito', districts, 'ubigeo', 'distrito');
        });
      } catch (error) {
        resetSelect(provinceSelect, 'No se pudieron cargar las provincias');
        resetSelect(districtSelect, 'No se pudieron cargar los distritos');
        console.error(error);
      }
    };
    const showAdminAddresses = () => {
      adminContent.innerHTML = `${serverSummary()}${filiationTabs(1)}<fieldset class="admin-server-card"><legend>Registros de datos domiciliarios</legend><div class="address-table"><div class="address-head"><span>N°</span><span>Tipo de dirección</span><span>Zona</span><span>Tipo de vía</span><span>Dirección y referencia</span><span>Estado</span><span>Acciones</span></div><div class="address-row"><span>1</span><span>PRINCIPAL (RENIEC)</span><span>—</span><span>—</span><span>LORETO 1348</span><span>APROBADO</span><span><button type="button">▦</button></span></div><div class="address-row"><span>2</span><span>PRINCIPAL</span><span>URB. URBANIZACIÓN</span><span>JIRÓN</span><span>LORETO N° 1348 HUANCAYO - HUANCAYO - JUNÍN</span><span>APROBADO</span><span><button type="button">⊖</button><button type="button">▦</button></span></div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 2 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 1 página</strong></div></div></fieldset><form id="address-form"><fieldset class="admin-server-card"><legend>Datos de domicilio</legend><div class="ingress-form-grid"><label><span>Tipo de dirección *</span><select required><option value="">Seleccione tipo</option><option>PRINCIPAL</option><option>SECUNDARIA</option></select></label><label><span>Zona *</span><select required><option value="">Seleccione zona</option><option>A.H. ASENTAMIENTO HUMANO</option><option>C.H. CONJUNTO HABITACIONAL</option><option>CAS. CASERÍO</option><option>CC.NN (COMUNIDAD NATIVA)</option><option>COO. COOPERATIVA</option><option>FND. FUNDO</option><option>GRU. GRUPO</option><option>NO ESPECIFICADO</option><option>P.J. PUEBLO JOVEN</option><option>RES. RESIDENCIAL</option><option>U.V. UNIDAD VECINAL</option><option>URB. URBANIZACIÓN</option><option>Z.I. ZONA INDUSTRIAL</option></select></label><label><span>Tipo de vía *</span><select required><option value="">Seleccione vía</option><option>ALAMEDA</option><option>AVENIDA</option><option>BLOCK</option><option>CALLE</option><option>CARRETERA</option><option>JIRÓN</option><option>MALECÓN</option><option>OTROS</option><option>ÓVALO</option><option>PARQUE</option><option>PASAJE</option><option>PLAZA</option></select></label><label><span>Departamento *</span><select id="address-department" required><option value="">Seleccione departamento</option><option>AMAZONAS</option><option>ÁNCASH</option><option>APURÍMAC</option><option>AREQUIPA</option><option>AYACUCHO</option><option>CAJAMARCA</option><option>CALLAO</option><option>CUSCO</option><option>HUANCAVELICA</option><option>HUÁNUCO</option><option>ICA</option><option>JUNÍN</option><option>LA LIBERTAD</option><option>LAMBAYEQUE</option><option>LIMA</option><option>LORETO</option><option>MADRE DE DIOS</option><option>MOQUEGUA</option><option>PASCO</option><option>PIURA</option><option>PUNO</option><option>SAN MARTÍN</option><option>TACNA</option><option>TUMBES</option><option>UCAYALI</option></select></label><label><span>Provincia</span><select id="address-province" disabled><option value="">Seleccione provincia</option></select></label><label><span>Distrito</span><select id="address-district" disabled><option value="">Seleccione distrito</option></select></label><label class="full"><span>Dirección *</span><input required placeholder="Dirección"></label><label class="full"><span>Referencia</span><input placeholder="Referencia"></label><label><span>Documento *</span><input required type="file" accept="application/pdf"></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="address-actions"><button type="button" class="return-filiation">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      const addressTable = adminContent.querySelector('.address-table');
      addressTable?.querySelectorAll('.address-row').forEach(row => row.remove());
      const addressPagination = addressTable?.querySelector('.ingress-pagination');
      if (server.direccionDomiciliariaRegistro && addressPagination) {
        const row = document.createElement('div');
        row.className = 'address-row';
        const addressStatusKey = `dre-address-status:${server.dni}`;
        const addressStatus = localStorage.getItem(addressStatusKey) || server.estadoDomicilio || 'APROBADO';
        row.innerHTML = `<span>1</span><span>${server.tipoDireccion || 'PRINCIPAL'}</span><span>${server.zonaDomicilio || 'NO ESPECIFICADO'}</span><span>${server.tipoViaDomicilio || 'NO ESPECIFICADO'}</span><span>${server.direccionDomiciliariaRegistro}</span><span class="address-status">${addressStatus === 'ANULADO' || addressStatus === 'DESAPROBADO' ? 'ANULADO' : 'APROBADO'}</span><span><button class="address-status-toggle" type="button" title="Cambiar estado">−</button></span>`;
        row.querySelector('.address-status-toggle').addEventListener('click', () => {
          const statusCell = row.querySelector('.address-status');
          const nextStatus = statusCell.textContent === 'ANULADO' ? 'APROBADO' : 'ANULADO';
          statusCell.textContent = nextStatus;
          statusCell.classList.toggle('rejected',nextStatus === 'ANULADO');
          localStorage.setItem(addressStatusKey,nextStatus);
          saveStatusToDatabase(addressStatusKey,nextStatus);
        });
        loadStatusFromDatabase(addressStatusKey,status=>{statusCell.textContent=status;statusCell.classList.toggle('rejected',status==='ANULADO');});
        const addressActions = row.lastElementChild;
        addressActions.className = 'record-actions';
        const addressDelete = document.createElement('button');
        addressDelete.type = 'button';
        addressDelete.className = 'record-delete';
        addressDelete.title = 'Eliminar registro domiciliario';
        addressDelete.setAttribute('aria-label','Eliminar registro domiciliario');
        addressDelete.textContent = '🗑';
        addressDelete.addEventListener('click', async () => {
          if (!confirm('¿Eliminar este registro domiciliario de la base de datos?')) return;
          const response = await fetch('api/domicilio-registro.php',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({dni:server.dni})});
          const result = await response.json();
          if (!response.ok || !result.ok) { alert(result.mensaje || 'No se pudo eliminar el domicilio.'); return; }
          row.remove();
          server.direccionDomiciliariaRegistro = '';
          server.direccion = '';
          localStorage.removeItem(addressStatusKey);
          const totals = addressPagination?.querySelectorAll('strong') || [];
          if (totals[0]) totals[0].textContent = 'Total: 0 registros';
          if (totals[1]) totals[1].textContent = 'Total: 0 páginas';
        });
        addressActions.appendChild(addressDelete);
        row.querySelector('.address-status')?.classList.toggle('rejected',addressStatus === 'ANULADO' || addressStatus === 'DESAPROBADO');
        addressTable.insertBefore(row, addressPagination);
      }
      if (addressPagination) {
        const totals = addressPagination.querySelectorAll('strong');
        if (totals[0]) totals[0].textContent = `Total: ${server.direccionDomiciliariaRegistro ? 1 : 0} registro${server.direccionDomiciliariaRegistro ? '' : 's'}`;
        if (totals[1]) totals[1].textContent = `Total: ${server.direccionDomiciliariaRegistro ? 1 : 0} página${server.direccionDomiciliariaRegistro ? '' : 's'}`;
      }
      bindFiliationTabs(); setupAddressUbigeo(); document.querySelector('.return-filiation').addEventListener('click', () => { window.location.href='gestion-servidor.html'; }); document.getElementById('address-form').addEventListener('submit', e => { e.preventDefault(); alert('Domicilio guardado correctamente.'); }); window.location.hash='domicilios';
    };
    const showAdminFamily = () => {
      adminContent.innerHTML = `${serverSummary()}${filiationTabs(2)}<fieldset class="admin-server-card"><legend>Registros de familiares</legend><div class="family-table"><div class="family-head"><span>N°</span><span>Apellidos y nombres</span><span>Tipo documento</span><span>Nro. documento</span><span>Parentesco</span><span>Sexo</span><span>F. nacimiento</span><span>Situación</span><span>Estado</span><span>Acciones</span></div><div class="family-row"><span>1</span><span>ARANA REQUENA, IRMA</span><span>DNI</span><span>19843845</span><span>MADRE</span><span>FEMENINO</span><span>18/10/1955</span><span>FALLECIDO</span><span>APROBADO</span><span><button>⊖</button><button>▦</button></span></div><div class="family-row"><span>2</span><span>ESCOBAR MORALES, LEONCIO</span><span>DNI</span><span>20000547</span><span>PADRE</span><span>MASCULINO</span><span>10/07/1950</span><span>VIVO</span><span>APROBADO</span><span><button>⊖</button><button>▦</button></span></div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 2 registros</strong><div><button>&lt;&lt;</button><button>&lt;</button><button class="active">1</button><button>&gt;</button><button>&gt;&gt;</button></div><strong>Total: 1 página</strong></div></div></fieldset><fieldset class="admin-server-card"><legend>Datos personales del familiar</legend><div class="ingress-form-grid"><label><span>Tipo de documento *</span><select required><option value="">Seleccione tipo</option><option>DNI</option><option>CARNÉ DE EXTRANJERÍA</option></select></label><label><span>Número de documento</span><input placeholder="Número de documento"></label></div></fieldset><p class="admin-required">(*) Datos obligatorios</p><div class="address-actions"><button type="button" class="return-filiation">← RETORNAR</button><span></span><button type="button">⌫ LIMPIAR</button></div>`;
      const familyTable = adminContent.querySelector('.family-table');
      const familyPagination = familyTable?.querySelector('.ingress-pagination');
      familyTable?.querySelectorAll('.family-row').forEach(row => row.remove());
      const familiares = Array.isArray(server.familiares) ? server.familiares : [];
      const familyValue = value => String(value || 'No registrado').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
      familiares.forEach((familiar, index) => {
        const row = document.createElement('div');
        row.className = 'family-row';
        row.dataset.familyIndex = String(index);
        row.title = 'Doble clic para ver los datos del familiar';
        row.innerHTML = `<span>${familiar.numero || index + 1}</span><span>${familyValue(familiar.nombre)}</span><span>${familyValue(familiar.tipoDocumento)}</span><span>${familyValue(familiar.documento)}</span><span>${familyValue(familiar.parentesco)}</span><span>${familyValue(familiar.sexo)}</span><span>${familyValue(familiar.fechaNacimiento)}</span><span>${familyValue(familiar.situacion)}</span><span></span><span></span>`;
        addFiliationStatusAction(row,`familiar:${familiar.numero || familiar.nombre || index}`,row.children[8],row.children[9]);
        appendDatabaseDelete(row.children[9],familiar,row);
        familyTable.insertBefore(row, familyPagination);
      });
      if (!familiares.length && familyPagination) {
        const empty = document.createElement('div');
        empty.className = 'legajo-table-empty';
        empty.textContent = 'No se encontraron familiares registrados para este servidor.';
        familyTable.insertBefore(empty, familyPagination);
      }
      if (familyPagination) {
        const totals = familyPagination.querySelectorAll('strong');
        if (totals[0]) totals[0].textContent = `Total: ${familiares.length} registros`;
        if (totals[1]) totals[1].textContent = `Total: ${familiares.length ? 1 : 0} página${familiares.length ? '' : 's'}`;
        const activePage = familyPagination.querySelector('button.active');
        if (activePage && !familiares.length) activePage.remove();
      }
      const familyDetailCard = [...adminContent.querySelectorAll('.admin-server-card')].find(card => card.querySelector('legend')?.textContent.trim() === 'Datos personales del familiar');
      const renderFamilyDetail = (familiar, selectedRow) => {
        familyTable?.querySelectorAll('.family-row').forEach(row => row.removeAttribute('data-selected'));
        selectedRow?.setAttribute('data-selected', 'true');
        if (!familyDetailCard || !familiar) return;
        const fullName = String(familiar.nombre || '').split(',');
        const surnames = (fullName[0] || '').trim().split(/\s+/);
        const names = fullName.slice(1).join(',').trim();
        const firstSurname = surnames.shift() || '';
        const secondSurname = surnames.join(' ');
        const isDeceased = String(familiar.situacion || familiar.ocupacion || '').toUpperCase().includes('FALLECIDO');
        familyDetailCard.innerHTML = `<legend>Datos personales del familiar</legend><div class="admin-summary-grid family-detail-grid">${detail('Tipo de documento', familyValue(familiar.tipoDocumento))}${detail('Número de documento', familyValue(familiar.documento))}${detail('Primer apellido', familyValue(firstSurname))}${detail('Segundo apellido', familyValue(secondSurname))}${detail('Nombres', familyValue(names))}${detail('Fecha de nacimiento', familyValue(familiar.fechaNacimiento))}${detail('Sexo', familyValue(familiar.sexo))}</div><fieldset class="family-subcard"><legend>Fallecido</legend><label class="family-check"><input type="checkbox" disabled ${isDeceased ? 'checked' : ''}> ¿Es fallecido?</label></fieldset><fieldset class="family-subcard"><legend>Datos de vínculo con el titular</legend><div class="admin-summary-grid">${detail('Parentesco', familyValue(familiar.parentesco))}${detail('Observaciones', familyValue(familiar.observaciones))}</div></fieldset><fieldset class="family-subcard"><legend>Datos del acta o resolución</legend><div class="admin-summary-grid">${detail('Número de resolución', familyValue(familiar.resolucion))}${detail('Fecha de emisión', familyValue(familiar.fechaResolucion))}${detail('Caducidad', familyValue(familiar.caducidad))}</div></fieldset>`;
        const relationshipCard = familyDetailCard.querySelectorAll('.family-subcard')[1];
        if (relationshipCard) relationshipCard.innerHTML = `<legend>Datos de vínculo con el titular</legend><div class="family-relationship-grid">${detail('Parentesco', familyValue(familiar.parentesco))}<label class="family-check"><input type="checkbox" disabled> ¿Es derechohabiente?</label></div>`;
        const birthRecordCard = familyDetailCard.querySelectorAll('.family-subcard')[2];
        if (birthRecordCard) birthRecordCard.innerHTML = `<legend>Datos del acta o partida de nacimiento</legend><div class="family-record-grid"><div><strong>Número de acta o partida de nacimiento</strong><span></span></div><div><strong>Fecha de emisión</strong><span></span></div><div><strong>Documento</strong><span></span></div><div><strong>Folios</strong><span></span></div></div>`;
        const disabilityCard = document.createElement('fieldset');
        disabilityCard.className = 'family-subcard';
        disabilityCard.innerHTML = '<legend>Datos Discapacidad</legend><label class="family-check"><input type="checkbox" disabled> ¿Es discapacitado?</label>';
        familyDetailCard.appendChild(disabilityCard);
        const familyActions = adminContent.querySelector('.address-actions');
        const cancelButton = familyActions?.querySelector('button:last-child');
        if (cancelButton) cancelButton.textContent = '⌫ CANCELAR';
      };
      familyTable?.querySelectorAll('.family-row').forEach(row => {
        const showDetail = () => renderFamilyDetail(familiares[Number(row.dataset.familyIndex)], row);
        row.addEventListener('dblclick', showDetail);
      });
      bindFiliationTabs(); document.querySelector('.return-filiation').addEventListener('click', () => { window.location.href='gestion-servidor.html'; }); window.location.hash='familiares';
    };
    const showAdminNativeLanguage = () => {
      adminContent.innerHTML = `${serverSummary()}${filiationTabs(3)}<fieldset class="admin-server-card"><legend>Listado de idiomas acreditados</legend><div class="language-table"><div class="language-head"><span>Idioma</span><span>Dominio escritura</span><span>Dominio oral</span><span>Año de ingreso</span><span>Año de evaluación</span><span>Año de vencimiento</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button type="button">&lt;&lt;</button><button type="button">&lt;</button><button class="active" type="button">1</button><button type="button">&gt;</button><button type="button">&gt;&gt;</button></div><strong>Total: 0 páginas&nbsp;&nbsp; ↻</strong></div></div></fieldset><div class="report-history-actions"><button type="button" class="return-filiation">← RETORNAR</button></div>`;
      const languageTable = adminContent.querySelector('.language-table');
      const languageHead = languageTable.querySelector('.language-head');
      languageHead.insertAdjacentHTML('beforeend','<span>Estado</span><span>Acciones</span>');
      languageHead.style.gridTemplateColumns = '1fr 1.2fr 1.2fr 1fr 1fr 1fr .8fr .8fr';
      const languagePagination = languageTable.querySelector('.ingress-pagination');
      const languages = Array.isArray(server.idiomasAcademicos) ? server.idiomasAcademicos : [];
      if (languages.length) languageTable.querySelector('.ascent-empty')?.remove();
      languages.forEach((language,index) => {
        const row = document.createElement('div');
        row.className = 'language-row';
        row.style.cssText = 'display:grid;grid-template-columns:1fr 1.2fr 1.2fr 1fr 1fr 1fr .8fr .8fr;border-bottom:1px solid #ddd;background:#f8fbfd';
        row.innerHTML = `<span>${recordValue(language.idioma)}</span><span>${recordValue(language.escritura)}</span><span>${recordValue(language.oral)}</span><span>${recordValue(language.ingreso)}</span><span>${recordValue(language.evaluacion)}</span><span>${recordValue(language.vencimiento)}</span><span></span><span></span>`;
        [...row.children].forEach(cell => { cell.style.padding='11px 8px'; cell.style.fontSize='11px'; cell.style.lineHeight='1.35'; });
        addFiliationStatusAction(row,`idioma:${language.idioma || index}`,row.children[6],row.children[7]);
        row.children[7].classList.add('record-actions');
        const languageDelete = document.createElement('button');
        languageDelete.type = 'button';
        languageDelete.className = 'record-delete';
        languageDelete.title = 'Eliminar registro';
        languageDelete.setAttribute('aria-label','Eliminar registro');
        languageDelete.textContent = '🗑';
        languageDelete.addEventListener('click', async () => {
          if (!window.confirm(`¿Desea eliminar el idioma ${recordValue(language.idioma)}?`)) return;
          languageDelete.disabled = true;
          try {
            const response = await fetch('api/lengua-nativa-registro.php',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({dni:server.dni,idioma:language.idioma})});
            const result = await response.json().catch(() => ({}));
            if (!response.ok || !result.ok) throw new Error(result.mensaje || 'No se pudo eliminar el registro.');
            row.remove();
            const remaining = languageTable.querySelectorAll('.language-row').length;
            const totals = languagePagination.querySelectorAll('strong');
            if (totals[0]) totals[0].textContent = `Total: ${remaining} registros`;
            if (totals[1]) totals[1].textContent = `Total: ${remaining ? 1 : 0} páginas`;
            if (!remaining) {
              const empty = document.createElement('div');
              empty.className = 'ascent-empty';
              empty.textContent = 'No se encontraron registros';
              languageTable.insertBefore(empty,languagePagination);
              languagePagination.querySelector('button.active')?.remove();
            }
          } catch (error) {
            window.alert(error.message || 'No se pudo eliminar el registro.');
            languageDelete.disabled = false;
          }
        });
        row.children[7].prepend(languageDelete);
        languageTable.insertBefore(row,languagePagination);
      });
      const totals = languagePagination.querySelectorAll('strong');
      if (totals[0]) totals[0].textContent = `Total: ${languages.length} registros`;
      if (totals[1]) totals[1].textContent = `Total: ${languages.length ? 1 : 0} páginas`;
      bindFiliationTabs(); document.querySelector('.return-filiation').addEventListener('click', () => { window.location.href='gestion-servidor.html'; }); window.location.hash='lengua-nativa';
    };
    const showAdminDeclarations = () => {
      adminContent.innerHTML = `${serverSummary()}${filiationTabs(4)}<fieldset class="admin-server-card"><legend>Registro de declaración jurada y boleta de datos</legend><div class="declaration-table"><div class="declaration-head"><span>N°</span><span>Tipo de documento</span><span>F. emisión</span><span>Archivo</span><span>Estado</span><span>Acciones</span></div><div class="ascent-empty">No se encontraron registros</div><div class="ingress-pagination"><label>Mostrar: <select><option>10 Filas</option></select></label><strong>Total: 0 registros</strong><div><button type="button">&lt;&lt;</button><button type="button">&lt;</button><button class="active" type="button">1</button><button type="button">&gt;</button><button type="button">&gt;&gt;</button></div><strong>Total: 0 páginas&nbsp;&nbsp; ↻</strong></div></div></fieldset><form id="declaration-form"><fieldset class="admin-server-card declaration-upload"><legend>Carga de archivo</legend><div class="declaration-form-grid"><label class="declaration-type"><span>Tipo de documento *</span><select required><option value="">Seleccione tipo de documento</option><option>DECLARACIÓN JURADA</option><option>BOLETA DE DATOS PERSONALES</option><option>OTRO</option></select></label><label><span>Fecha de emisión *</span><input required type="date"></label><label class="declaration-file"><span>Documento sustentatorio *</span><input required type="file" accept="application/pdf"><small>Formato: PDF, Peso: máximo 2MB</small></label><label><span>Folios</span><input type="number" min="1" placeholder="Folios"></label><label class="declaration-notes"><span>Anotaciones</span><textarea maxlength="250" rows="3" placeholder="Anotaciones"></textarea><small>250</small></label></div></fieldset><p class="admin-required">(*) Datos Obligatorios</p><div class="address-actions"><button type="button" class="return-filiation">← RETORNAR</button><span></span><button type="reset">⌫ LIMPIAR</button><button type="submit">▣ GUARDAR</button></div></form>`;
      bindFiliationTabs(); document.querySelector('.return-filiation').addEventListener('click', () => { window.location.href='gestion-servidor.html'; }); document.getElementById('declaration-form').addEventListener('submit', e => {
        e.preventDefault();
        if (!e.currentTarget.reportValidity()) return;
        const table = adminContent.querySelector('.declaration-table');
        const pagination = table.querySelector('.ingress-pagination');
        const type = e.currentTarget.querySelector('select').value;
        const date = e.currentTarget.querySelector('input[type="date"]').value;
        const file = e.currentTarget.querySelector('input[type="file"]').files[0];
        table.querySelector('.ascent-empty')?.remove();
        const row = document.createElement('div');
        row.className = 'declaration-row';
        row.innerHTML = `<span>1</span><span>${type}</span><span>${date}</span><span>${file?.name || 'Documento PDF'}</span><span></span><span></span>`;
        addFiliationStatusAction(row,`declaracion:${type}:${date}`,row.children[4],row.children[5]);
        table.insertBefore(row,pagination);
        const totals = pagination.querySelectorAll('strong');
        if (totals[0]) totals[0].textContent = 'Total: 1 registro';
        if (totals[1]) totals[1].textContent = 'Total: 1 página';
        alert('Declaración guardada correctamente.');
      }); window.location.hash='declaracion-jurada';
    };
    academicMenu.addEventListener('click', event => { event.preventDefault(); showAdminAcademic(); });
    ingressMenu.addEventListener('click', event => { event.preventDefault(); showAdminIngress(); });
    trajectoryMenu.addEventListener('click', event => { event.preventDefault(); showAdminTrajectory(); });
    benefitsMenu.addEventListener('click', event => { event.preventDefault(); showAdminBenefits(); });
    pensionMenu.addEventListener('click', event => { event.preventDefault(); showAdminPension(); });
    awardsMenu.addEventListener('click', event => { event.preventDefault(); showAdminAwards(); });
    sanctionsMenu.addEventListener('click', event => { event.preventDefault(); showAdminSanctions(); });
    leaveMenu.addEventListener('click', event => { event.preventDefault(); showAdminLeave(); });
    othersMenu.addEventListener('click', event => { event.preventDefault(); showAdminOthers(); });
    reportMenu.addEventListener('click', event => { event.preventDefault(); showAdminReport(); });
    document.querySelectorAll('.admin-server-tabs a')[1].addEventListener('click', showAdminAddresses);
    document.querySelectorAll('.admin-server-tabs a')[2].addEventListener('click', showAdminFamily);
    document.querySelectorAll('.admin-server-tabs a')[3].addEventListener('click', showAdminNativeLanguage);
    document.querySelectorAll('.admin-server-tabs a')[4].addEventListener('click', showAdminDeclarations);
    filiationMenu.addEventListener('click', event => { event.preventDefault(); window.location.href = 'gestion-servidor.html'; });
    if (window.location.hash === '#academica') showAdminAcademic();
    if (window.location.hash === '#capacitaciones') showAdminTraining();
    if (window.location.hash === '#produccion-intelectual') showAdminIntellectualProduction();
    if (window.location.hash === '#idiomas') showAdminLanguages();
    if (window.location.hash === '#ingreso') showAdminIngress();
    if (window.location.hash === '#trayectoria') showAdminTrajectory();
    if (window.location.hash === '#trayectoria-desplazamiento') { showAdminTrajectory(); showAdminDisplacement(); }
    if (window.location.hash === '#trayectoria-ascenso') { showAdminTrajectory(); showAdminAscent(); }
    if (window.location.hash === '#asignaciones') showAdminBenefits();
    if (window.location.hash === '#subsidio-luto-sepelio') { showAdminBenefits(); showAdminBereavement(); }
    if (window.location.hash === '#retenciones-judiciales') { showAdminBenefits(); showAdminWithholdings(); }
    if (window.location.hash === '#datos-modificaciones') { showAdminBenefits(); showAdminModifications(); }
    if (window.location.hash === '#pagos-indebidos') { showAdminBenefits(); showAdminImproperPayments(); }
    if (window.location.hash === '#informe') showAdminReport();
    if (window.location.hash === '#informe-manual') showAdminManualReport();
    if (window.location.hash === '#historial-informes') showAdminReportHistory();
    if (window.location.hash === '#crear-hoja-vida') showAdminResume();
    if (window.location.hash === '#reporte') showAdminResume();
    if (window.location.hash === '#historial-hoja-vida') showAdminResumeHistory();
    if (window.location.hash === '#informe-escalafonario') showAdminEscalafonSelection();
    if (window.location.hash === '#domicilios') showAdminAddresses();
    if (window.location.hash === '#familiares') showAdminFamily();
    if (window.location.hash === '#lengua-nativa') showAdminNativeLanguage();
    if (window.location.hash === '#declaracion-jurada') showAdminDeclarations();
    if (window.location.hash === '#retiro') showAdminPension();
    if (window.location.hash === '#datos-ceses') { showAdminPension(); showAdminCessations(); }
    if (window.location.hash === '#cts') { showAdminPension(); showAdminCts(); }
    if (window.location.hash === '#tipo-pension') { showAdminPension(); showAdminPensionType(); }
    if (window.location.hash === '#premios') showAdminAwards();
    if (window.location.hash === '#viajes-becas-pasantias') { showAdminAwards(); showAdminStudyTrips(); }
    if (window.location.hash === '#sanciones') showAdminSanctions();
    if (window.location.hash === '#sanciones-administrativas') { showAdminSanctions(); showAdminAdministrativeSanctions(); }
    if (window.location.hash === '#recursos-administrativos') { showAdminSanctions(); showAdminAdministrativeAppeals(); }
    if (window.location.hash === '#licencias') showAdminLeave();
    if (window.location.hash === '#licencias-sin-goce') { showAdminLeave(); showAdminUnpaidLeave(); }
    if (window.location.hash === '#licencias-con-goce') { showAdminLeave(); showAdminPaidLeave(); }
    if (window.location.hash === '#otros') showAdminOthers();
    if (window.location.hash === '#instauracion-proceso') { showAdminOthers(); showAdminProcessInitiation(); }
    if (window.location.hash === '#participacion-comisiones') { showAdminOthers(); showAdminCommissions(); }
    if (window.location.hash === '#periodo-no-laborado') { showAdminOthers(); showAdminNonWorkingPeriod(); }
    if (window.location.hash === '#otros-documentos') { showAdminOthers(); showAdminOtherDocuments(); }
    if (window.location.hash === '#medidas-preventivas') { showAdminOthers(); showAdminPreventiveMeasures(); }
  }
  if (page === 'mi-legajo.html') {
    let publicUser = null;
    try { publicUser = JSON.parse(sessionStorage.getItem('dre_public_user') || 'null'); } catch (_) {}
    if (!publicUser) { window.location.replace('index.html'); return; }
    const registeredName = publicUser.nombreRegistro || publicUser.nombre;
    const nameParts = registeredName.split(',');
    const surnames = (nameParts[0] || '').trim().split(/\s+/);
    const givenNames = (nameParts[1] || publicUser.nombre).trim();
    const firstSurname = surnames[0] || 'No registrado';
    const secondSurname = surnames.slice(1).join(' ') || 'No registrado';
    const field = (label, value) => `<div class="legajo-field"><strong>${label}</strong><span>${value || 'No registrado'}</span></div>`;
    const emptyTable = headers => `<div class="legajo-table"><div class="legajo-table-head" style="--legajo-cols:${headers.length}">${headers.map(header => `<span>${header}</span>`).join('')}</div><div class="legajo-table-empty">No se encontraron registros</div></div>`;
    const recordsTable = (headers, rows = []) => rows.length
      ? `<div class="legajo-table"><div class="legajo-table-head" style="--legajo-cols:${headers.length}">${headers.map(header => `<span>${header}</span>`).join('')}</div>${rows.map(row => `<div class="legajo-table-row" style="--legajo-cols:${headers.length}">${row.map(value => `<span>${value || ''}</span>`).join('')}</div>`).join('')}</div>`
      : emptyTable(headers);
    document.body.className = 'app-public-ayni app-ready';
    document.body.innerHTML = `<aside class="ayni-sidebar legajo-mini-sidebar"><div class="ayni-brand"><img src="logo.svg" alt="DRE Huancavelica"></div><div class="ayni-user"><img src="assets/portal/perfil-${publicUser.dni}.jpg" alt="Foto" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="ayni-avatar-fallback">👤</span></div><nav><a href="portal-servidor.html">⌂</a><a class="active" href="mi-escalafon.html">▣</a></nav></aside><div class="ayni-shell legajo-shell"><header class="ayni-topbar"><strong>PLATAFORMA DE SERVICIOS PARA EL SERVIDOR PÚBLICO</strong><span>DRE HUANCAVELICA</span><a href="index.html">Salir</a></header><div class="ayni-breadcrumb"><a href="portal-servidor.html">Inicio</a><span>›</span><a href="mi-escalafon.html">Mi Escalafón</a><span>›</span> Mi Legajo</div><main class="legajo-main"><aside class="legajo-sections"><h2>Ver mi legajo</h2><a class="active" href="#filiacion">I&nbsp;&nbsp; Filiación e Identificación</a><a href="#academica">II&nbsp;&nbsp; Situación Académica</a><a href="#ingreso">III&nbsp;&nbsp; Ingreso o Reingreso</a><a href="#trayectoria">IV&nbsp;&nbsp; Trayectoria Laboral</a><a href="#asignaciones">V&nbsp;&nbsp; Asignaciones e Incentivos</a><a href="#retiro">VI&nbsp;&nbsp; Retiro y Régimen Pensionario</a><a href="#premios">VII&nbsp;&nbsp; Premios y Estímulos</a><a href="#sanciones">VIII&nbsp;&nbsp; Sanciones</a><a href="#licencias">IX&nbsp;&nbsp; Licencias y Vacaciones</a><a href="#otros">X&nbsp;&nbsp; Otros</a><a href="#reporte">▣&nbsp;&nbsp; Reporte de hoja de vida</a></aside><section class="legajo-content" id="filiacion"><h1>Filiación e Identificación</h1><div class="legajo-panel"><h3>Datos generales</h3><fieldset><legend>Datos personales</legend><div class="legajo-grid">${field('Tipo de documento','DNI')}${field('Número de documento',publicUser.dni)}${field('Nombres',givenNames)}${field('Primer apellido',firstSurname)}${field('Segundo apellido',secondSurname)}${field('Estado civil','No registrado')}${field('Sexo','No registrado')}<div class="legajo-photo"><img src="assets/portal/perfil-${publicUser.dni}.jpg" alt="Foto del servidor" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span>👤</span></div></div></fieldset><fieldset><legend>Fecha y lugar de nacimiento</legend><div class="legajo-grid">${field('Fecha de nacimiento','No registrado')}${field('País','Perú')}${field('Departamento / Provincia / Distrito','No registrado')}</div></fieldset><fieldset><legend>Datos laborales registrados</legend><div class="legajo-grid">${field('Institución',publicUser.institucion)}${field('UGEL',publicUser.ugel)}${field('Código modular',publicUser.codigo)}${field('Cargo',publicUser.cargo)}${field('Régimen',publicUser.regimen)}</div></fieldset><fieldset><legend>Datos de contacto</legend><div class="legajo-grid">${field('Teléfono principal','No registrado')}${field('Teléfono móvil','No registrado')}${field('Correo electrónico laboral','No registrado')}${field('Correo electrónico personal','No registrado')}</div></fieldset><fieldset><legend>Licenciado de las fuerzas armadas</legend>${field('¿Es licenciado de las fuerzas armadas?','No registrado')}</fieldset><fieldset><legend>Datos de discapacidad</legend>${emptyTable(['N°','Entidad','N° certificado','N° carné CONADIS','Fecha emisión','Discapacidad','Grado','Opción'])}</fieldset></div><div class="legajo-panel"><h3>Datos domiciliarios</h3>${emptyTable(['N°','Tipo de dirección','Tipo de vía','Dirección','Departamento / Provincia / Distrito','Opción'])}</div><div class="legajo-panel"><h3>Datos familiares</h3>${emptyTable(['N°','Nombre','DNI','Parentesco','Sexo','Fecha de nacimiento','Situación','Opción'])}</div><div class="legajo-panel"><h3>◉ &nbsp; Acreditación de lengua nativa</h3>${emptyTable(['N°','Idioma','Dominio escritura','Dominio oral','Fecha emisión','Año de vigencia','Opción'])}</div><div class="legajo-panel"><h3>▧ &nbsp; Declaración jurada</h3>${emptyTable(['N°','Tipo de documento','Fecha emisión','Archivo','Opción'])}</div></section></main><footer>© 2026 Dirección Regional de Educación Huancavelica · Plataforma del Servidor Público</footer></div>`;
    const academicLink = document.querySelector('.legajo-sections a[href="#academica"]');
    const ingresoLink = document.querySelector('.legajo-sections a[href="#ingreso"]');
    const trayectoriaLink = document.querySelector('.legajo-sections a[href="#trayectoria"]');
    const asignacionesLink = document.querySelector('.legajo-sections a[href="#asignaciones"]');
    const retiroLink = document.querySelector('.legajo-sections a[href="#retiro"]');
    const premiosLink = document.querySelector('.legajo-sections a[href="#premios"]');
    const sancionesLink = document.querySelector('.legajo-sections a[href="#sanciones"]');
    const licenciasLink = document.querySelector('.legajo-sections a[href="#licencias"]');
    const otrosLink = document.querySelector('.legajo-sections a[href="#otros"]');
    const reporteLink = document.querySelector('.legajo-sections a[href="#reporte"]');
    const filiationLink = document.querySelector('.legajo-sections a[href="#filiacion"]');
    const legajoContent = document.querySelector('.legajo-content');
    const filiationContent = legajoContent.innerHTML;
    const showAcademic = () => {
      document.querySelectorAll('.legajo-sections a').forEach(link => link.classList.remove('active'));
      academicLink.classList.add('active');
      legajoContent.id = 'academica';
      legajoContent.innerHTML = `<h1>Situación Académica</h1><div class="legajo-panel"><h3>🎓 &nbsp; Formación académica y de títulos</h3>${emptyTable(['N°','Nivel educativo','Centro de estudios','Situación académica','Grado alcanzado','Año inicio','Año fin','Grupo de carrera','Especialidad del grado','Título','Datos de colegiatura','Opción'])}</div><div class="legajo-panel"><h3>▤ &nbsp; Capacitaciones</h3>${emptyTable(['N°','Tipo de estudios','Institución','Tema','Fecha inicio','Fecha fin','Fecha emisión','Duración en horas','Créditos','Tipo de participación','Modalidad','Opción'])}</div><div class="legajo-panel"><h3>♧ &nbsp; Producción intelectual</h3>${emptyTable(['N°','Tipo de producción','Título','Fecha de publicación','Editorial','Registro de INDECOPI','Número de depósito legal - BN','Opción'])}</div><div class="legajo-panel"><h3>◉ &nbsp; Idiomas</h3>${emptyTable(['N°','Tipo de idioma','Idioma','Dominio escritura','Dominio oral','Lugar de aprendizaje','Opción'])}</div>`;
      window.location.hash = 'academica';
    };
    academicLink.addEventListener('click', event => {
      event.preventDefault();
      showAcademic();
    });
    const showIngreso = () => {
      document.querySelectorAll('.legajo-sections a').forEach(link => link.classList.remove('active'));
      ingresoLink.classList.add('active');
      legajoContent.id = 'ingreso';
      legajoContent.innerHTML = `<h1>Ingreso o Reingreso</h1><div class="legajo-panel"><h3>▣ &nbsp; Acciones de ingreso</h3>${emptyTable(['N°','Acción','Motivo','Régimen laboral','Fecha inicio','Fecha fin','Centro laboral','Cargo','Resolución','Fecha de resolución','Opción'])}</div>`;
      window.location.hash = 'ingreso';
    };
    ingresoLink.addEventListener('click', event => {
      event.preventDefault();
      showIngreso();
    });
    const showTrayectoria = () => {
      document.querySelectorAll('.legajo-sections a').forEach(link => link.classList.remove('active'));
      trayectoriaLink.classList.add('active');
      legajoContent.id = 'trayectoria';
      legajoContent.innerHTML = `<h1>Trayectoria Laboral</h1><div class="legajo-panel"><h3>⌁ &nbsp; Acciones de desplazamiento</h3>${emptyTable(['N°','Acción','Motivo','Régimen laboral','Fecha inicio','Fecha fin','Cargo','Centro origen','Centro destino','Resolución','Fecha de resolución','Opción'])}</div><div class="legajo-panel"><h3>⌁ &nbsp; Acciones de ascenso</h3>${emptyTable(['N°','Acción','Motivo','Régimen laboral','Fecha inicio','Escala anterior','Escala nueva','Resolución','Opción'])}</div>`;
      window.location.hash = 'trayectoria';
    };
    trayectoriaLink.addEventListener('click', event => {
      event.preventDefault();
      showTrayectoria();
    });
    const showAsignaciones = () => {
      document.querySelectorAll('.legajo-sections a').forEach(link => link.classList.remove('active'));
      asignacionesLink.classList.add('active');
      legajoContent.id = 'asignaciones';
      legajoContent.innerHTML = `<h1>Asignaciones e Incentivos</h1><div class="legajo-panel"><h3>▣ &nbsp; Beneficios</h3>${emptyTable(['N°','Acción','Motivo acción','Régimen laboral','Resolución','Fecha de resolución','Importe','Opción'])}</div><div class="legajo-panel"><h3>♟ &nbsp; Subsidios por luto y sepelio</h3>${emptyTable(['N°','Acción','Régimen laboral','Resolución','Fecha de resolución','Fecha de fallecimiento','Monto','Opción'])}</div><div class="legajo-panel"><h3>⚖ &nbsp; Retenciones judiciales</h3>${emptyTable(['N°','Resolución','Fecha de resolución','Tipo de retención','Monto fijo mensual','Porcentaje fijo mensual','Opción'])}</div><div class="legajo-panel"><h3>⚒ &nbsp; Pagos indebidos</h3>${emptyTable(['N°','Régimen laboral','Resolución','Motivo pago','Monto','Opción'])}</div>`;
      window.location.hash = 'asignaciones';
    };
    asignacionesLink.addEventListener('click', event => {
      event.preventDefault();
      showAsignaciones();
    });
    const showRetiro = () => {
      document.querySelectorAll('.legajo-sections a').forEach(link => link.classList.remove('active'));
      retiroLink.classList.add('active');
      legajoContent.id = 'retiro';
      const afiliaciones = publicUser.afiliacionesPensionarias || [];
      const ceses = publicUser.cesesDefinitivos || [];
      const registrosCts = publicUser.registrosCts || [];
      legajoContent.innerHTML = `<h1>Retiro y Régimen Pensionario</h1><div class="legajo-panel"><h3>▣ &nbsp; Afiliación a regímenes pensionarios</h3>${recordsTable(['N°','Régimen pensionario','AFP','Tipo de comisión','CUSPP','Fecha de afiliación','Fecha de desafiliación','Fecha de devengue','Opción'], afiliaciones)}</div><div class="legajo-panel"><h3>⌁ &nbsp; Ceses definitivos</h3>${recordsTable(['N°','Acción','Motivo','Régimen laboral','Resolución','Fecha de cese','Opción'], ceses)}</div><div class="legajo-panel"><h3>▤ &nbsp; CTS, tiempo de servicios de contrato, otros</h3>${recordsTable(['N°','Acción','Motivo','Régimen laboral','Resolución','Fecha de cese','Tiempo','Opción'], registrosCts)}</div>`;
      window.location.hash = 'retiro';
    };
    retiroLink.addEventListener('click', event => {
      event.preventDefault();
      showRetiro();
    });
    const showPremios = () => {
      document.querySelectorAll('.legajo-sections a').forEach(link => link.classList.remove('active'));
      premiosLink.classList.add('active');
      legajoContent.id = 'premios';
      const meritos = publicUser.meritos || [];
      const viajesEstudio = publicUser.viajesEstudio || [];
      legajoContent.innerHTML = `<h1>Premios y Estímulos</h1><div class="legajo-panel"><h3>☆ &nbsp; Méritos</h3>${recordsTable(['N°','Tipo de mérito','Mérito','Instancia','Entidad emisora','Resolución','Fecha de resolución','Opción'], meritos)}</div><div class="legajo-panel"><h3>⌁ &nbsp; Viajes de estudio, Becas y/o Pasantías</h3>${recordsTable(['N°','Tipo','País','Fecha inicio','Fecha fin','Resolución','Fecha de resolución','Opción'], viajesEstudio)}</div>`;
      window.location.hash = 'premios';
    };
    premiosLink.addEventListener('click', event => {
      event.preventDefault();
      showPremios();
    });
    const showSanciones = () => {
      document.querySelectorAll('.legajo-sections a').forEach(link => link.classList.remove('active'));
      sancionesLink.classList.add('active');
      legajoContent.id = 'sanciones';
      const sancionesJudiciales = publicUser.sancionesJudiciales || [];
      const sancionesAdministrativas = publicUser.sancionesAdministrativas || [];
      const recursosAdministrativos = publicUser.recursosAdministrativos || [];
      legajoContent.innerHTML = `<h1>Sanciones</h1><div class="legajo-panel"><h3>⚒ &nbsp; Sanciones judiciales</h3>${recordsTable(['N°','Causa y/o motivo','Resolución','Fecha de notificación','Días','Fecha inicio','Fecha fin','Opción'], sancionesJudiciales)}</div><div class="legajo-panel"><h3>⚒ &nbsp; Sanciones administrativas</h3>${recordsTable(['N°','Sanción','Resolución','Fecha de notificación','Días','Fecha inicio','Fecha fin','Opción'], sancionesAdministrativas)}</div><div class="legajo-panel"><h3>▣ &nbsp; Recursos administrativos</h3>${recordsTable(['N°','Resultado de apelación','Resolución','Fecha de notificación','Días','Fecha inicio','Fecha fin','Opción'], recursosAdministrativos)}</div>`;
      window.location.hash = 'sanciones';
    };
    sancionesLink.addEventListener('click', event => {
      event.preventDefault();
      showSanciones();
    });
    const showLicencias = () => {
      document.querySelectorAll('.legajo-sections a').forEach(link => link.classList.remove('active'));
      licenciasLink.classList.add('active');
      legajoContent.id = 'licencias';
      const licenciasSinGoce = publicUser.licenciasSinGoce || [];
      const licenciasConGoce = publicUser.licenciasConGoce || [];
      const vacaciones = publicUser.vacaciones || [];
      legajoContent.innerHTML = `<h1>Licencias y Vacaciones</h1><div class="legajo-panel"><h3>▤ &nbsp; Licencia sin goce de remuneraciones</h3>${recordsTable(['N°','Acción','Motivo','Régimen laboral','Días','Fecha inicio','Fecha fin','Resolución','Opción'], licenciasSinGoce)}</div><div class="legajo-panel"><h3>▤ &nbsp; Licencia con goce de remuneraciones</h3>${recordsTable(['N°','Acción','Motivo','Régimen laboral','Días','Fecha inicio','Fecha fin','Resolución','Opción'], licenciasConGoce)}</div><div class="legajo-panel"><h3>▣ &nbsp; Vacaciones</h3>${recordsTable(['N°','Acción','Motivo','Régimen laboral','Fecha inicio','Fecha fin','Resolución','Opción'], vacaciones)}</div>`;
      window.location.hash = 'licencias';
    };
    licenciasLink.addEventListener('click', event => {
      event.preventDefault();
      showLicencias();
    });
    const showOtros = () => {
      document.querySelectorAll('.legajo-sections a').forEach(link => link.classList.remove('active'));
      otrosLink.classList.add('active');
      legajoContent.id = 'otros';
      const experienciaProfesional = publicUser.experienciaProfesional || [];
      const procesosInstaurados = publicUser.procesosInstaurados || [];
      const participacionComisiones = publicUser.participacionComisiones || [];
      const periodosNoLaborados = publicUser.periodosNoLaborados || [];
      legajoContent.innerHTML = `<h1>Otros</h1><div class="legajo-panel"><h3>▣ &nbsp; Experiencia profesional</h3>${recordsTable(['N°','Sector','Entidad','Cargo','Funciones desempeñadas','Fecha inicio','Fecha fin','Documento','Fecha de documento','Opción'], experienciaProfesional)}</div><div class="legajo-panel"><h3>▤ &nbsp; Instauración de proceso</h3>${recordsTable(['N°','Descripción del proceso','Resolución','Fecha de resolución','Fecha de notificación','Descripción de la acción','Opción'], procesosInstaurados)}</div><div class="legajo-panel"><h3>▤ &nbsp; Participación en comisiones</h3>${recordsTable(['N°','Participación','Resolución','Días','Fecha inicio','Fecha fin','Opción'], participacionComisiones)}</div><div class="legajo-panel"><h3>⌁ &nbsp; Periodo no laborado</h3>${recordsTable(['N°','Motivo','Documento','Fecha documento','Fecha inicio','Fecha fin','Opción'], periodosNoLaborados)}</div>`;
      window.location.hash = 'otros';
    };
    otrosLink.addEventListener('click', event => {
      event.preventDefault();
      showOtros();
    });
    const showReporte = () => {
      document.querySelectorAll('.legajo-sections a').forEach(link => link.classList.remove('active'));
      reporteLink.classList.add('active');
      legajoContent.id = 'reporte';
      legajoContent.innerHTML = `<h1>Reporte de hoja de vida</h1><div class="legajo-panel hoja-vida-panel"><h3>▣ &nbsp; Hoja de vida</h3><div class="hoja-vida-upload"><input id="hoja-vida-file" type="file" accept=".pdf,.doc,.docx" hidden><button id="subir-hoja-vida" type="button">↑ &nbsp; Subir hoja de vida</button><span id="hoja-vida-name">Ningún archivo seleccionado</span></div></div>`;
      const fileInput = document.getElementById('hoja-vida-file');
      document.getElementById('subir-hoja-vida').addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', () => {
        document.getElementById('hoja-vida-name').textContent = fileInput.files[0]?.name || 'Ningún archivo seleccionado';
      });
      window.location.hash = 'reporte';
    };
    reporteLink.addEventListener('click', event => {
      event.preventDefault();
      showReporte();
    });
    filiationLink.addEventListener('click', event => {
      event.preventDefault();
      document.querySelectorAll('.legajo-sections a').forEach(link => link.classList.remove('active'));
      filiationLink.classList.add('active');
      legajoContent.id = 'filiacion';
      legajoContent.innerHTML = filiationContent;
      window.location.hash = 'filiacion';
    });
    if (window.location.hash === '#academica') showAcademic();
    if (window.location.hash === '#ingreso') showIngreso();
    if (window.location.hash === '#trayectoria') showTrayectoria();
    if (window.location.hash === '#asignaciones') showAsignaciones();
    if (window.location.hash === '#retiro') showRetiro();
    if (window.location.hash === '#premios') showPremios();
    if (window.location.hash === '#sanciones') showSanciones();
    if (window.location.hash === '#licencias') showLicencias();
    if (window.location.hash === '#otros') showOtros();
    if (window.location.hash === '#reporte') showReporte();
  }
  if (page === 'mi-escalafon.html') {
    let publicUser = null;
    try { publicUser = JSON.parse(sessionStorage.getItem('dre_public_user') || 'null'); } catch (_) {}
    if (!publicUser) { window.location.replace('index.html'); return; }
    document.body.className = 'app-public-ayni app-ready';
    document.body.innerHTML = `<aside class="ayni-sidebar"><div class="ayni-brand"><img src="logo.svg" alt="DRE Huancavelica"><strong>DREH</strong></div><div class="ayni-user"><img src="assets/portal/perfil-${publicUser.dni}.jpg" alt="Foto de ${publicUser.nombre}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="ayni-avatar-fallback">👤</span><strong>${publicUser.nombre}</strong><small>Servidor Público</small><small class="online">● Sesión activa</small></div><nav><span>OPCIONES</span><a href="portal-servidor.html">⌂ Inicio</a><a class="active" href="mi-escalafon.html">▣ Mi Escalafón</a></nav></aside><div class="ayni-shell"><header class="ayni-topbar"><strong>PLATAFORMA DE SERVICIOS PARA EL SERVIDOR PÚBLICO</strong><span>DRE HUANCAVELICA</span><a href="index.html" title="Cerrar sesión">Salir</a></header><div class="ayni-breadcrumb"><a href="portal-servidor.html">Inicio</a><span>›</span> Mi Escalafón</div><main class="ayni-main"><h2>OPCIONES</h2><div class="ayni-options ayni-options-three"><article><div class="ayni-card-content"><img src="assets/portal/mi-legajo.png" alt="Mi Legajo" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="ayni-card-fallback">📁</span><div><h3>Mi Legajo</h3><p>Consulta la información de tu legajo personal</p></div></div><button type="button">Ingresar ›</button></article><article><div class="ayni-card-content"><img src="assets/portal/actualizar-legajo.png" alt="Actualizar mi legajo" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="ayni-card-fallback">📝</span><div><h3>Actualizar mi legajo</h3><p>Atiende solicitudes de actualización</p></div></div><button type="button">Ingresar ›</button></article><article><div class="ayni-card-content"><img src="assets/portal/seguimiento-solicitudes.png" alt="Seguimiento de solicitudes" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="ayni-card-fallback">🔎</span><div><h3>Seguimiento de atención de solicitudes</h3><p>Revisa el estado de tus trámites</p></div></div><button type="button">Ingresar ›</button></article></div></main><footer>© 2026 Dirección Regional de Educación Huancavelica · Plataforma del Servidor Público</footer></div>`;
  }
  if (page === 'actualizar-legajo.html') {
    let publicUser = null;
    try { publicUser = JSON.parse(sessionStorage.getItem('dre_public_user') || 'null'); } catch (_) {}
    if (!publicUser) { window.location.replace('index.html'); return; }
    const parts = (publicUser.nombreRegistro || publicUser.nombre).split(',');
    const surnames = (parts[0] || '').trim().split(/\s+/);
    const names = (parts[1] || publicUser.nombre).trim();
    const updateField = (label, value = '') => `<label><span>${label}</span><input disabled value="${value}" placeholder="No registrado"></label>`;
    document.body.className = 'app-public-ayni app-ready';
    document.body.innerHTML = `<aside class="ayni-sidebar legajo-mini-sidebar"><div class="ayni-brand"><img src="logo.svg" alt="DRE Huancavelica"></div><div class="ayni-user"><img src="assets/portal/perfil-${publicUser.dni}.jpg" alt="Foto" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="ayni-avatar-fallback">👤</span></div><nav><a href="portal-servidor.html">⌂</a><a class="active" href="mi-escalafon.html">▣</a></nav></aside><div class="ayni-shell legajo-shell"><header class="ayni-topbar"><strong>PLATAFORMA DE SERVICIOS PARA EL SERVIDOR PÚBLICO</strong><span>DRE HUANCAVELICA</span><a href="index.html">Salir</a></header><div class="ayni-breadcrumb"><a href="portal-servidor.html">Inicio</a><span>›</span><a href="mi-escalafon.html">Mi Escalafón</a><span>›</span> Solicitud de actualización</div><main class="legajo-main update-main"><aside class="legajo-sections update-sections"><h2>Solicitud de actualización</h2><a class="active" href="#datos-personales">A&nbsp;&nbsp; Datos Personales</a><a href="#discapacidad">B&nbsp;&nbsp; Datos de Discapacidad</a><a href="#domiciliarios">C&nbsp;&nbsp; Datos Domiciliarios</a><a href="#familiares">D&nbsp;&nbsp; Datos Familiares</a><a href="#formacion">E&nbsp;&nbsp; Formación Académica</a><a href="#capacitaciones">F&nbsp;&nbsp; Capacitaciones</a><a href="#produccion">G&nbsp;&nbsp; Producción Intelectual</a><a href="#meritos">H&nbsp;&nbsp; Méritos</a><a href="#viajes">I&nbsp;&nbsp; Viajes de Estudio, Becas y/o Pasantías</a><a href="#experiencia">J&nbsp;&nbsp; Experiencia Profesional</a></aside><section class="legajo-content update-content"><div class="update-request"><label><input id="enable-update" type="checkbox"> Solicitar modificación</label></div><form id="personal-update-form"><fieldset><legend>Datos personales</legend><div class="update-grid">${updateField('Tipo documento','DNI')}${updateField('Número de documento',publicUser.dni)}${updateField('Nombres',names)}${updateField('Primer apellido',surnames[0] || '')}${updateField('Segundo apellido',surnames.slice(1).join(' '))}${updateField('Estado civil')}${updateField('Sexo')}<div class="update-photo"><img src="assets/portal/perfil-${publicUser.dni}.jpg" alt="Foto del servidor" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span>👤</span></div></div></fieldset><fieldset><legend>Fecha y lugar de nacimiento</legend><div class="update-grid">${updateField('Fecha nacimiento')}${updateField('País','Perú')}${updateField('Departamento / Provincia / Distrito')}</div></fieldset><fieldset><legend>Datos de contacto</legend><div class="update-grid">${updateField('Teléfono principal')}${updateField('Celular')}${updateField('Email laboral')}${updateField('Email personal')}</div></fieldset><fieldset><legend>Datos de contacto en caso de emergencia</legend><div class="update-grid">${updateField('Nombres')}${updateField('Teléfono fijo')}${updateField('Celular')}</div></fieldset><button class="update-save" type="submit" disabled>Guardar solicitud</button></form></section></main><footer>© 2026 Dirección Regional de Educación Huancavelica · Plataforma del Servidor Público</footer></div>`;
    const toggle = document.getElementById('enable-update');
    const form = document.getElementById('personal-update-form');
    toggle.addEventListener('change', () => {
      form.querySelectorAll('input,button').forEach(control => { control.disabled = !toggle.checked; });
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      alert('Solicitud de actualización guardada correctamente.');
    });
    const datosPersonalesLink = document.querySelector('.update-sections a[href="#datos-personales"]');
    const discapacidadLink = document.querySelector('.update-sections a[href="#discapacidad"]');
    const domiciliariosLink = document.querySelector('.update-sections a[href="#domiciliarios"]');
    const familiaresLink = document.querySelector('.update-sections a[href="#familiares"]');
    const formacionLink = document.querySelector('.update-sections a[href="#formacion"]');
    const capacitacionesLink = document.querySelector('.update-sections a[href="#capacitaciones"]');
    const produccionLink = document.querySelector('.update-sections a[href="#produccion"]');
    const meritosLink = document.querySelector('.update-sections a[href="#meritos"]');
    const viajesLink = document.querySelector('.update-sections a[href="#viajes"]');
    const experienciaLink = document.querySelector('.update-sections a[href="#experiencia"]');
    const updateContent = document.querySelector('.update-content');
    const showDiscapacidad = () => {
      document.querySelectorAll('.update-sections a').forEach(link => link.classList.remove('active'));
      discapacidadLink.classList.add('active');
      updateContent.innerHTML = `<div class="update-request"><label><input id="enable-disability" type="checkbox"> Solicitar modificación</label></div><fieldset class="update-table-fieldset"><legend>Datos de discapacidad</legend><div class="legajo-table"><div class="legajo-table-head" style="--legajo-cols:7"><span>N°</span><span>Entidad certificadora</span><span>Número de certificado</span><span>Nro. carné CONADIS</span><span>Fecha de emisión</span><span>Discapacidad</span><span>Grado</span></div><div class="legajo-table-empty">No se encontraron registros</div></div></fieldset>`;
      window.location.hash = 'discapacidad';
    };
    discapacidadLink.addEventListener('click', event => {
      event.preventDefault();
      showDiscapacidad();
    });
    const showDomiciliarios = () => {
      document.querySelectorAll('.update-sections a').forEach(link => link.classList.remove('active'));
      domiciliariosLink.classList.add('active');
      updateContent.innerHTML = `<div class="update-request"><label><input id="enable-address" type="checkbox" checked> Solicitar modificación</label></div><fieldset><legend>Datos de domicilio principal</legend><div class="update-grid address-grid"><label><span>Departamento *</span><input required placeholder="Escriba el departamento"></label><label><span>Provincia *</span><input required placeholder="Escriba la provincia"></label><label><span>Distrito *</span><input required placeholder="Escriba el distrito"></label><label><span>Tipo vía *</span><input required placeholder="Ej. Avenida, jirón o calle"></label><label><span>Zona *</span><input required placeholder="Escriba la zona"></label><label><span>Referencia</span><input placeholder="Escriba una referencia"></label><label class="address-wide"><span>Dirección *</span><input required placeholder="Escriba la dirección"></label></div></fieldset><button id="save-address" class="update-save" type="button">Guardar solicitud</button>`;
      document.getElementById('save-address').addEventListener('click', () => alert('Datos domiciliarios guardados correctamente.'));
      window.location.hash = 'domiciliarios';
    };
    domiciliariosLink.addEventListener('click', event => {
      event.preventDefault();
      showDomiciliarios();
    });
    const showFamiliares = () => {
      document.querySelectorAll('.update-sections a').forEach(link => link.classList.remove('active'));
      familiaresLink.classList.add('active');
      updateContent.innerHTML = `<div class="update-request"><label><input id="enable-family" type="checkbox"> Solicitar modificación</label></div><fieldset class="update-table-fieldset"><legend>Datos familiares</legend><div class="legajo-table"><div class="legajo-table-head" style="--legajo-cols:8"><span>N°</span><span>Nombre</span><span>Tipo de documento</span><span>DNI</span><span>Parentesco</span><span>Sexo</span><span>Fecha nacimiento</span><span>Situación</span></div><div class="legajo-table-empty">No se encontraron registros</div></div></fieldset>`;
      window.location.hash = 'familiares';
    };
    familiaresLink.addEventListener('click', event => {
      event.preventDefault();
      showFamiliares();
    });
    const showFormacion = () => {
      document.querySelectorAll('.update-sections a').forEach(link => link.classList.remove('active'));
      formacionLink.classList.add('active');
      updateContent.innerHTML = `<div class="update-request"><label><input id="enable-education" type="checkbox"> Solicitar modificación</label></div><fieldset class="update-table-fieldset"><legend>Datos de formación académica y títulos</legend><div class="legajo-table"><div class="legajo-table-head" style="--legajo-cols:10"><span>N°</span><span>Nivel educativo</span><span>Nivel específico</span><span>Centro de estudios</span><span>Situación académica</span><span>Grado alcanzado</span><span>Año inicio</span><span>Año fin</span><span>Título</span><span>Datos de colegiatura</span></div><div class="legajo-table-empty">No se encontraron registros</div></div></fieldset>`;
      window.location.hash = 'formacion';
    };
    formacionLink.addEventListener('click', event => {
      event.preventDefault();
      showFormacion();
    });
    const showCapacitaciones = () => {
      document.querySelectorAll('.update-sections a').forEach(link => link.classList.remove('active'));
      capacitacionesLink.classList.add('active');
      updateContent.innerHTML = `<div class="update-request"><label><input id="enable-training" type="checkbox"> Solicitar modificación</label></div><fieldset class="update-table-fieldset"><legend>Datos de capacitaciones</legend><div class="legajo-table"><div class="legajo-table-head" style="--legajo-cols:11"><span>N°</span><span>Tipo de estudios</span><span>Institución</span><span>Tipo de constancia</span><span>Fecha inicio</span><span>Fecha fin</span><span>Fecha emisión (expedición)</span><span>Duración en horas</span><span>Créditos</span><span>Tipo de participación</span><span>Modalidad</span></div><div class="legajo-table-empty">No se encontraron registros</div></div></fieldset>`;
      window.location.hash = 'capacitaciones';
    };
    capacitacionesLink.addEventListener('click', event => {
      event.preventDefault();
      showCapacitaciones();
    });
    const showProduccion = () => {
      document.querySelectorAll('.update-sections a').forEach(link => link.classList.remove('active'));
      produccionLink.classList.add('active');
      updateContent.innerHTML = `<div class="update-request"><label><input id="enable-production" type="checkbox"> Solicitar modificación</label></div><fieldset class="update-table-fieldset"><legend>Datos de producción intelectual</legend><div class="legajo-table"><div class="legajo-table-head" style="--legajo-cols:7"><span>N°</span><span>Tipo de producción</span><span>Título</span><span>Fecha publicación</span><span>Editorial</span><span>Registro de INDECOPI</span><span>Número de depósito legal - BN</span></div><div class="legajo-table-empty">No se encontraron registros</div></div></fieldset>`;
      window.location.hash = 'produccion';
    };
    produccionLink.addEventListener('click', event => {
      event.preventDefault();
      showProduccion();
    });
    const showMeritos = () => {
      document.querySelectorAll('.update-sections a').forEach(link => link.classList.remove('active'));
      meritosLink.classList.add('active');
      updateContent.innerHTML = `<div class="update-request"><label><input id="enable-merits" type="checkbox"> Solicitar modificación</label></div><fieldset class="update-table-fieldset"><legend>Datos de méritos</legend><div class="legajo-table"><div class="legajo-table-head" style="--legajo-cols:6"><span>N°</span><span>Mérito</span><span>Fecha mérito</span><span>Instancia</span><span>Entidad emisora</span><span>Resolución</span></div><div class="legajo-table-empty">No se encontraron registros</div></div></fieldset>`;
      window.location.hash = 'meritos';
    };
    meritosLink.addEventListener('click', event => {
      event.preventDefault();
      showMeritos();
    });
    const showViajes = () => {
      document.querySelectorAll('.update-sections a').forEach(link => link.classList.remove('active'));
      viajesLink.classList.add('active');
      updateContent.innerHTML = `<div class="update-request"><label><input id="enable-travel" type="checkbox"> Solicitar modificación</label></div><fieldset class="update-table-fieldset"><legend>Datos de viajes de estudio, becas y/o pasantías</legend><div class="legajo-table"><div class="legajo-table-head" style="--legajo-cols:8"><span>N°</span><span>Tipo</span><span>País</span><span>Fecha inicio</span><span>Fecha fin</span><span>Tipo resolución</span><span>Resolución</span><span>Fecha resolución</span></div><div class="legajo-table-empty">No se encontraron registros</div></div></fieldset>`;
      window.location.hash = 'viajes';
    };
    viajesLink.addEventListener('click', event => {
      event.preventDefault();
      showViajes();
    });
    const showExperiencia = () => {
      document.querySelectorAll('.update-sections a').forEach(link => link.classList.remove('active'));
      experienciaLink.classList.add('active');
      updateContent.innerHTML = `<div class="update-request"><label><input id="enable-experience" type="checkbox"> Solicitar modificación</label></div><fieldset class="update-table-fieldset"><legend>Datos de experiencia profesional</legend><div class="legajo-table"><div class="legajo-table-head" style="--legajo-cols:7"><span>N°</span><span>Sector</span><span>Entidad</span><span>Cargo</span><span>Fecha inicio</span><span>Fecha fin</span><span>Funciones desempeñadas</span></div><div class="legajo-table-empty">No se encontraron registros</div></div></fieldset>`;
      window.location.hash = 'experiencia';
    };
    experienciaLink.addEventListener('click', event => {
      event.preventDefault();
      showExperiencia();
    });
    datosPersonalesLink.addEventListener('click', event => {
      event.preventDefault();
      window.location.replace('actualizar-legajo.html');
    });
    if (window.location.hash === '#discapacidad') showDiscapacidad();
    if (window.location.hash === '#domiciliarios') showDomiciliarios();
    if (window.location.hash === '#familiares') showFamiliares();
    if (window.location.hash === '#formacion') showFormacion();
    if (window.location.hash === '#capacitaciones') showCapacitaciones();
    if (window.location.hash === '#produccion') showProduccion();
    if (window.location.hash === '#meritos') showMeritos();
    if (window.location.hash === '#viajes') showViajes();
    if (window.location.hash === '#experiencia') showExperiencia();
  }
  if (page === 'portal-servidor.html') {
    let publicUser = null;
    try { publicUser = JSON.parse(sessionStorage.getItem('dre_public_user') || 'null'); } catch (_) {}
    if (!publicUser) {
      window.location.replace('index.html');
      return;
    }
    document.body.className = 'app-public-ayni app-ready';
    document.body.innerHTML = `<aside class="ayni-sidebar"><div class="ayni-brand"><img src="logo.svg" alt="DRE Huancavelica"><strong>DREH</strong></div><div class="ayni-user"><img src="assets/portal/perfil-${publicUser.dni}.jpg" alt="Foto de ${publicUser.nombre}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="ayni-avatar-fallback">👤</span><strong>${publicUser.nombre}</strong><small>Servidor Público</small><small class="online">● Sesión activa</small></div><nav><span>OPCIONES</span><a class="active" href="portal-servidor.html">⌂ Inicio</a><a href="#mi-escalafon">▣ Mi Escalafón</a><a href="#mi-boleta">▤ Mi boleta</a></nav></aside><div class="ayni-shell"><header class="ayni-topbar"><strong>PLATAFORMA DE SERVICIOS PARA EL SERVIDOR PÚBLICO</strong><span>DRE HUANCAVELICA</span><a href="index.html" title="Cerrar sesión">Salir</a></header><div class="ayni-breadcrumb">Inicio <span>›</span> Portal del servidor</div><main class="ayni-main"><section class="ayni-welcome"><h1>Bienvenido(a), ${publicUser.nombre}</h1><p>DNI: <strong>${publicUser.dni}</strong> · Código Modular: <strong>${publicUser.codigo}</strong></p><p>${publicUser.institucion} · ${publicUser.ugel}</p></section><h2>OPCIONES</h2><div class="ayni-options"><article id="mi-escalafon"><div class="ayni-card-content"><img src="assets/portal/mi-escalafon.png" alt="Mi Escalafón" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="ayni-card-fallback">📋</span><div><h3>Mi Escalafón</h3><p>${publicUser.cargo}</p><small>${publicUser.regimen} · Legajo ${publicUser.legajo}</small></div></div><button type="button">Ingresar ›</button></article><article id="mi-boleta"><div class="ayni-card-content"><img src="assets/portal/mi-boleta.png" alt="Mi boleta" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="ayni-card-fallback">🧾</span><div><h3>Mi boleta</h3><p>Consulta de boletas del servidor</p><small>Documentos personales</small></div></div><button type="button">Ingresar ›</button></article></div></main><footer>© 2026 Dirección Regional de Educación Huancavelica · Plataforma del Servidor Público</footer></div>`;
  }
  if (page === 'mi-boleta.html') {
    let publicUser = null;
    try { publicUser = JSON.parse(sessionStorage.getItem('dre_public_user') || 'null'); } catch (_) {}
    if (!publicUser) { window.location.replace('index.html'); return; }
    document.body.className = 'app-public-ayni app-ready boleta-page';
    document.body.innerHTML = `<header class="boleta-title"><strong>Mi Boleta</strong><img src="logo.svg" alt="DRE Huancavelica"></header><aside class="boleta-sidebar"><div class="boleta-user"><img src="assets/portal/perfil-${publicUser.dni}.jpg" alt="Foto" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span>👤</span><strong>${publicUser.nombre}</strong><small>Servidor Público</small><small>${publicUser.ugel}</small></div><a class="active" href="mi-boleta.html">▣ Consulta de boleta</a><a href="portal-servidor.html">⌂ Volver al inicio</a></aside><div class="boleta-shell"><div class="boleta-top"><span>Consulta de boleta</span><a href="portal-servidor.html">${publicUser.nombre.split(' ')[0]} ▾</a></div><main class="boleta-main"><h1>Consulta de boleta</h1><section><h2>Datos personales</h2><div class="boleta-personal"><label>Nombres y apellidos:<strong>${publicUser.nombre}</strong></label><label>Tipo de documento:<strong>D.N.I.</strong></label><label>Nro. de documento:<strong>${publicUser.dni}</strong></label><label>Tipo de servidor:<strong>${publicUser.cargo}</strong></label><label>Cargo:<strong>${publicUser.cargo}</strong></label><label>Régimen:<strong>${publicUser.regimen}</strong></label></div></section><section><h2>Filtros de búsqueda:</h2><div class="boleta-filters"><label>Año:<select id="boleta-year"><option value="">- Todos -</option><option>2026</option><option>2025</option><option>2024</option></select></label><label>Mes:<select id="boleta-month"><option value="">- Todos -</option><option>Enero</option><option>Febrero</option><option>Marzo</option><option>Abril</option><option>Mayo</option><option>Junio</option><option>Julio</option><option>Agosto</option><option>Septiembre</option><option>Octubre</option><option>Noviembre</option><option>Diciembre</option></select></label></div><div class="boleta-actions"><button id="search-boleta" type="button">⌕ Buscar</button><button id="clear-boleta" type="button">⌁ Limpiar</button></div></section><section><h2>Resultados de búsqueda de boletas</h2><div id="boleta-results" class="boleta-empty">No hay registros para mostrar</div></section></main></div>`;
    const year = document.getElementById('boleta-year');
    const month = document.getElementById('boleta-month');
    document.getElementById('search-boleta').addEventListener('click', () => { document.getElementById('boleta-results').textContent = 'No hay registros para mostrar'; });
    document.getElementById('clear-boleta').addEventListener('click', () => { year.value = ''; month.value = ''; document.getElementById('boleta-results').textContent = 'No hay registros para mostrar'; });
  }
  if (page === 'seguimiento-solicitudes.html') {
    let publicUser = null;
    try { publicUser = JSON.parse(sessionStorage.getItem('dre_public_user') || 'null'); } catch (_) {}
    if (!publicUser) { window.location.replace('index.html'); return; }
    const solicitudes = publicUser.solicitudesSeguimiento || [];
    const headers = ['Nro.','Nro. de solicitud','Solicitud','Fecha de solicitud','Requiere enviar documento','Documentos requeridos','Estado de la solicitud'];
    const rows = solicitudes.length ? solicitudes.map(row => `<div class="legajo-table-row" style="--legajo-cols:7">${row.map(value => `<span>${value || ''}</span>`).join('')}</div>`).join('') : '<div class="legajo-table-empty">No se encontraron registros</div>';
    document.body.className = 'app-public-ayni app-ready';
    document.body.innerHTML = `<aside class="ayni-sidebar legajo-mini-sidebar"><div class="ayni-brand"><img src="logo.svg" alt="DRE Huancavelica"></div><div class="ayni-user"><img src="assets/portal/perfil-${publicUser.dni}.jpg" alt="Foto" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="ayni-avatar-fallback">👤</span></div><nav><a href="portal-servidor.html">⌂</a><a class="active" href="mi-escalafon.html">▣</a></nav></aside><div class="ayni-shell legajo-shell"><header class="ayni-topbar"><strong>PLATAFORMA DE SERVICIOS PARA EL SERVIDOR PÚBLICO</strong><span>DRE HUANCAVELICA</span><a href="index.html">Salir</a></header><div class="ayni-breadcrumb"><a href="portal-servidor.html">Inicio</a><span>›</span><a href="mi-escalafon.html">Mi Escalafón</a><span>›</span> Seguimiento de atención de solicitud</div><main class="tracking-main"><h1>Seguimiento de atención de solicitud</h1><div class="legajo-table tracking-table"><div class="legajo-table-head" style="--legajo-cols:7">${headers.map(header => `<span>${header}</span>`).join('')}</div>${rows}<div class="tracking-pagination"><span>Filas por tabla&nbsp; 10</span><span>0 de ${solicitudes.length}</span><button type="button" disabled>❮</button><button type="button" disabled>❯</button></div></div></main><footer>© 2026 Dirección Regional de Educación Huancavelica · Plataforma del Servidor Público</footer></div>`;
  }
  if (page === 'portal-servidor.html') {
    const escalafonCard = document.getElementById('mi-escalafon');
    const boletaCard = document.getElementById('mi-boleta');
    if (escalafonCard) {
      escalafonCard.setAttribute('role', 'link');
      escalafonCard.setAttribute('tabindex', '0');
      escalafonCard.addEventListener('click', () => { window.location.href = 'mi-escalafon.html'; });
      escalafonCard.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') window.location.href = 'mi-escalafon.html';
      });
    }
    if (boletaCard) {
      boletaCard.setAttribute('role', 'link');
      boletaCard.setAttribute('tabindex', '0');
      boletaCard.addEventListener('click', () => { window.location.href = 'mi-boleta.html'; });
      boletaCard.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') window.location.href = 'mi-boleta.html';
      });
    }
  }
  if (page === 'mi-escalafon.html') {
    const legajoCard = document.querySelector('.ayni-options-three article:first-child');
    const actualizarCard = document.querySelector('.ayni-options-three article:nth-child(2)');
    const seguimientoCard = document.querySelector('.ayni-options-three article:nth-child(3)');
    if (legajoCard) {
      legajoCard.setAttribute('role', 'link');
      legajoCard.setAttribute('tabindex', '0');
      legajoCard.addEventListener('click', () => { window.location.href = 'mi-legajo.html'; });
      legajoCard.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') window.location.href = 'mi-legajo.html';
      });
    }
    if (actualizarCard) {
      actualizarCard.setAttribute('role', 'link');
      actualizarCard.setAttribute('tabindex', '0');
      actualizarCard.addEventListener('click', () => { window.location.href = 'actualizar-legajo.html'; });
      actualizarCard.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') window.location.href = 'actualizar-legajo.html';
      });
    }
    if (seguimientoCard) {
      seguimientoCard.setAttribute('role', 'link');
      seguimientoCard.setAttribute('tabindex', '0');
      seguimientoCard.addEventListener('click', () => { window.location.href = 'seguimiento-solicitudes.html'; });
      seguimientoCard.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') window.location.href = 'seguimiento-solicitudes.html';
      });
    }
  }
  // Conserva la posición vertical del menú lateral al cambiar de página.
  // Sin esto, cada HTML nuevo reconstruye el <aside> y vuelve visualmente al inicio.
  const sidebar = document.querySelector('aside');
  if (sidebar) {
    let savedSidebarTop = 0;
    try { savedSidebarTop = Number(sessionStorage.getItem('dre_sidebar_scroll_top')) || 0; } catch (_) {}
    const restoreSidebar = () => { sidebar.scrollTop = savedSidebarTop; };
    restoreSidebar();
    requestAnimationFrame(restoreSidebar);
    sidebar.addEventListener('scroll', () => {
      try { sessionStorage.setItem('dre_sidebar_scroll_top', String(sidebar.scrollTop)); } catch (_) {}
    }, { passive: true });
    sidebar.addEventListener('click', event => {
      if (event.target.closest('a[data-path]')) {
        try { sessionStorage.setItem('dre_sidebar_scroll_top', String(sidebar.scrollTop)); } catch (_) {}
      }
    }, true);
  }
  if (document.fonts) {
    document.fonts.load('24px "Material Symbols Outlined"').then(fonts => {
      if (fonts.length) document.documentElement.classList.add('app-icons-ready');
    }).catch(() => {});
  }
  document.documentElement.classList.add('app-ready');

  function toast(message, kind = 'ok') {
    let box = document.getElementById('app-toast-box');
    if (!box) { box = document.createElement('div'); box.id = 'app-toast-box'; document.body.appendChild(box); }
    const item = document.createElement('div'); item.className = `app-toast ${kind}`; item.textContent = message;
    box.appendChild(item); requestAnimationFrame(() => item.classList.add('show'));
    setTimeout(() => { item.classList.remove('show'); setTimeout(() => item.remove(), 250); }, 2800);
  }

  function modal(title, body, actions) {
    const wrap = document.createElement('div'); wrap.className = 'app-modal-wrap';
    const actionHtml = (actions || [{ label: 'Cerrar' }]).map((a, i) => `<button type="button" data-action="${i}" class="${a.primary ? 'primary' : ''}">${a.label}</button>`).join('');
    wrap.innerHTML = `<section class="app-modal" role="dialog" aria-modal="true"><header><h2>${title}</h2><button type="button" aria-label="Cerrar" data-close>×</button></header><div class="app-modal-body">${body}</div><footer>${actionHtml}</footer></section>`;
    document.body.appendChild(wrap);
    const close = () => wrap.remove(); wrap.addEventListener('click', e => { if (e.target === wrap || e.target.closest('[data-close]')) close(); const b = e.target.closest('[data-action]'); if (b) { const a = (actions || [])[+b.dataset.action]; if (a && a.run) a.run(close); else close(); } });
    wrap.querySelector('button')?.focus(); return wrap;
  }

  function download(name, content, type = 'text/plain') {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast(`Archivo ${name} generado correctamente.`);
  }

  function rowsAsCsv() {
    const table = document.querySelector('table'); if (!table) return 'Reporte DRE Huancavelica\nSin datos tabulares';
    return [...table.rows].map(r => [...r.cells].map(c => `"${c.innerText.trim().replaceAll('"', '""')}"`).join(',')).join('\n');
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img[alt*="Logo DRE"]').forEach(image => {
      image.src = 'logoDRE.jpg';
    });
    const officialPortrait = document.querySelector('img[alt^="Retrato Oficial"]');
    const profilePortrait = document.querySelector('img[alt="Profile"]');
    if (officialPortrait && profilePortrait) officialPortrait.src = profilePortrait.src;
    document.querySelectorAll('a[href="#"]').forEach(a => { if (!a.dataset.path) a.setAttribute('href', `#${(a.textContent || 'seccion').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')}`); });

    document.querySelectorAll('button').forEach((b, i) => { if (!b.id) b.dataset.appButton = String(i); });

    document.addEventListener('click', e => {
      const button = e.target.closest('button'); if (!button || button.disabled || page === 'index.html') return;
      if (button.hasAttribute('onclick') || button.closest('.app-modal, .escalafon-selection') || button.classList.contains('tab-trigger')) return;
      const text = (button.innerText || button.title || '').trim(); const key = `${text} ${button.title || ''}`.toLowerCase();
      if (button.type === 'submit' && button.closest('form')) return;
      if (key.includes('menu')) { const side = document.querySelector('aside'); if (side) side.classList.toggle('app-sidebar-open'); return; }
      if (key.includes('notification')) { modal('Notificaciones', '<ul><li>3 legajos requieren revisión.</li><li>Hay una solicitud próxima a vencer.</li><li>La copia de seguridad fue completada.</li></ul>'); return; }
      if (/export|descarg|imprim|pdf|informe|constancia/.test(key)) { download(`reporte-${new Date().toISOString().slice(0,10)}.csv`, '\ufeff' + rowsAsCsv(), 'text/csv;charset=utf-8'); return; }
      if (/aprobar|incorporar/.test(key)) { modal('Confirmar aprobación', '<p>¿Desea aprobar e incorporar este documento al legajo digital?</p>', [{label:'Cancelar'}, {label:'Aprobar', primary:true, run:close => { close(); toast('Documento aprobado e incorporado.'); }}]); return; }
      if (/observ/.test(key)) { modal('Registrar observación', '<label>Detalle de la observación<textarea id="app-note" required placeholder="Escriba el motivo..."></textarea></label>', [{label:'Cancelar'}, {label:'Guardar', primary:true, run:close => { const v=document.getElementById('app-note').value.trim(); if(!v) return toast('Escriba una observación.','warn'); localStorage.setItem('dre_observacion',v); close(); toast('Observación registrada y notificada.'); }}]); return; }
      if (/nuevo|agregar|registrar|crear/.test(key)) { modal(text || 'Nuevo registro', '<p>Complete los datos en el formulario de la pantalla. El registro se guardará localmente en esta versión demostrativa.</p>', [{label:'Entendido', primary:true}]); return; }
      if (/anterior|siguiente|^\d+$/.test(text.toLowerCase())) { button.parentElement?.querySelectorAll('button').forEach(x => x.classList.remove('app-page-active')); button.classList.add('app-page-active'); toast(`Página ${text === 'Siguiente' ? 'siguiente' : text === 'Anterior' ? 'anterior' : text} cargada.`); return; }
      if (/refrescar|actualizar/.test(key)) { toast('Información actualizada.'); return; }
      if (/ver|detalle|revisar|historial|auditar|ficha|trazabilidad/.test(key)) { modal(text || 'Detalle', '<p>Vista de consulta habilitada. Los datos mostrados corresponden al registro seleccionado.</p><p><strong>Estado:</strong> información disponible para revisión.</p>'); return; }
      if (/reenviar|notificar|enviar|solicitud|requerimiento/.test(key)) { toast('Operación enviada correctamente.'); return; }
      if (text) toast(`${text}: acción completada.`);
    });

    document.querySelectorAll('form').forEach(form => {
      if (form.id === 'loginForm') return;
      form.addEventListener('submit', e => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const data = Object.fromEntries(new FormData(form).entries());
        const saved = JSON.parse(localStorage.getItem('dre_registros') || '[]'); saved.push({ page, date: new Date().toISOString(), data }); localStorage.setItem('dre_registros', JSON.stringify(saved));
        toast('Datos procesados y guardados correctamente.');
      });
    });

    document.querySelectorAll('input[type="search"], input[placeholder*="Buscar"], input[placeholder*="Filtrar"]').forEach(input => {
      if (input.dataset.serverSearch) return;
      input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase(); document.querySelectorAll('tbody tr').forEach(row => row.hidden = q && !row.innerText.toLowerCase().includes(q));
      });
    });
  });
})();



