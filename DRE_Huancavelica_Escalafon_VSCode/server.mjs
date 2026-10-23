import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.cwd();
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
createServer(async (req,res) => {
  try {
    const clean = decodeURIComponent((req.url || '/').split('?')[0]);
    let file = normalize(join(root, clean === '/' ? 'index.html' : clean));
    if (!file.toLowerCase().startsWith(root.toLowerCase())) throw new Error('Ruta inválida');
    if ((await stat(file)).isDirectory()) file = join(file,'index.html');
    res.writeHead(200, {'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control':'no-cache'}); res.end(await readFile(file));
  } catch { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); res.end('Archivo no encontrado'); }
}).listen(3000, '127.0.0.1', () => console.log('Sistema listo en http://127.0.0.1:3000'));
