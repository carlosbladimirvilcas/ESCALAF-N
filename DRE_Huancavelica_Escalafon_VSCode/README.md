# DRE Huancavelica - Sistema Escalafón

Proyecto organizado para abrir en Visual Studio Code.

## Ejecutar
1. Abra esta carpeta en Visual Studio Code.
2. Para usar solamente las pantallas, ejecute `npm start` y visite `http://127.0.0.1:3000`.
3. Para usar MySQL, publique la carpeta mediante Apache/PHP (por ejemplo, dentro de `C:\xampp\htdocs`) y active Apache y MySQL.
4. Visite `http://localhost/DRE_Huancavelica_Escalafon_VSCode/conexion.html` para comprobar la conexión.

## Conexión MySQL
- Base configurada: `vgallardo`.
- Configuración: `api/config.php`.
- Valores iniciales para XAMPP: servidor `127.0.0.1`, puerto `3306`, usuario `root` y contraseña vacía.
- Si MySQL usa otra contraseña, modifique únicamente `password` en `api/config.php` o defina las variables de entorno `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` y `DB_PASSWORD`.
- El servidor Node incluido solo publica archivos estáticos y no ejecuta PHP; la conexión requiere Apache/PHP.

No necesita instalar paquetes. También puede abrir `index.html` directamente en el navegador.

## Pantallas
- `index.html`: acceso/login
- `dashboard.html`: panel del administrador
- `requerimientos.html`: creación y notificación de requerimientos
- `bandeja-solicitudes.html`: bandeja de solicitudes y expedientes
- `acciones-formativas.html`: programación y seguimiento de capacitaciones
- `resoluciones-licencias.html`: actos resolutivos, licencias y permisos
- `reportes-exportacion.html`: generación y exportación de reportes
- `control-usuarios.html`: usuarios, roles y accesos
- `auditoria-trazabilidad.html`: registro de operaciones del sistema
- `configuracion-institucional.html`: parámetros institucionales
- `servidores.html`: gestión de servidores públicos
- `legajo.html`: legajo digital y gestión documental
- `traslado.html`: traslado de legajos
- `auditoria.html`: auditoría, usuarios y configuración
- `ficha.html`: ficha de escalafón
- `portal-servidor.html`: portal del servidor público

## Nota
Las pantallas originales fueron entregadas como HTML separados. Esta versión las integra como un proyecto navegable. No incluye todavía backend, autenticación real ni conexión a base de datos; esas partes se pueden conectar después.
