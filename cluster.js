const cluster = require("cluster");
const os = require("os");
const { config } = require("./helper");
const { master, slave, pool } = require("./handler");

if(cluster.isMaster){

    const cpus = config.worker === "auto" ? os.cpus().length : config.worker;

    for(let i = 0; i < cpus; i++){

        cluster.fork();
    }

    refresh_pool();

    cluster.on("exit", function(worker, code, signal){

        if((code !== 0) && !worker.exitedAfterDisconnect){

            console.warn("Worker " + worker.id + " crashed. Starting a new worker...");

            cluster.fork();

            refresh_pool();
        }
    });

    cluster.on("message", master);

    process.on("SIGUSR2", function(){

        restartWorker();
    });

    global.worker_pool = pool;

    require("./server");
}
else{

    require("./handler");

    process.on("message", slave);
}

function restartWorker(workerIndex){

    workerIndex || (workerIndex = 0);

    const workers = Object.values(cluster.workers);
    const worker = workers[workerIndex];

    if(!worker){

        return;
    }

    worker.on("exit", function(){

        if(!worker.exitedAfterDisconnect) {

            return;
        }

        console.info("Exited process: " + worker.process.pid);

        cluster.fork().on("listening", function(){

            restartWorker(workerIndex + 1);
        });

        refresh_pool();
    });

    worker.disconnect();
}

function refresh_pool(){

    const workers = Object.values(cluster.workers);

    for(let i = 0; i < workers.length; i++){

        const worker = workers[i];

        pool[worker.id] = worker;
    }
}