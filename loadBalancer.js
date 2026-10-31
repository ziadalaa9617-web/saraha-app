const http = require('node:http');

const servers = [
  { host: 'localhost', port: 3001 },
  { host: 'localhost', port: 3002 },
];
let next = 0;

http
  .createServer((req, res) => {
    const target = servers[next];
    next = (next + 1) % servers.length;

    const proxy = http.request(
      { ...target, path: req.url, method: req.method, headers: req.headers },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      }
    );
    proxy.on('error', () => {
      res.writeHead(502);
      res.end('bad gateway');
    });
    req.pipe(proxy);
  })
  .listen(3000, () => console.log('load balancer on port 3000'));