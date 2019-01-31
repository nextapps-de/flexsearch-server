const cluster = require("cluster");
const os = require("os");
const { config } = require("./helper");

if(cluster.isMaster){

    const cpus = config.worker === "auto" ? os.cpus().length : config.worker;

    for(let i = 0; i < cpus; i++){

        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal){

        if(code !== 0 && !worker.exitedAfterDisconnect){

            console.warn("Worker " + worker.id + " crashed. Starting a new worker...");

            cluster.fork();
        }
    });

    process.on("SIGUSR2", function(){

        restartWorker();
    });
}
else{

    require("./server");
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

        console.log("Exited process: " + worker.process.pid);

        cluster.fork().on("listening", function(){

            restartWorker(workerIndex + 1);
        });
    });

    worker.disconnect();
}
