const cluster = require('node:cluster');
const os = require('node:os');

if (cluster.isPrimary) {
  cluster.schedulingPolicy = cluster.SCHED_RR;
  for (let i = 0; i < os.availableParallelism(); i++) cluster.fork();
  cluster.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid} died, restarting`);
    cluster.fork();
  });
} else {
  require('./index');
}
