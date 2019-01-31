const env = require("./env");
const config_env = require("./config/" + env);
const defaults = require("./config/default");
const cluster = require("cluster");
const { readFile, writeFile, exists } = require("fs");
const filename = "store/" + env + (cluster.isMaster ? "" : "@" + cluster.worker.id) + ".json";

const config = (function(){

    [
        "port",
        "force_ssl",
        "https",
        "compress",
        "autosave",
        "worker",
        "secret"

    ].forEach(function(flag){

        const env_var = global.process.env[flag.toUpperCase()];

        defaults[flag] = typeof env_var === "undefined" ? config_env[flag] : env_var;
    });

    [
        "host",
        "port",
        "pass"

    ].forEach(function(flag){

        const env_var = global.process.env[flag.toUpperCase()];

        defaults.redis[flag] = typeof env_var === "undefined" ? config_env[flag] : env_var;
    });

    [
        "async",
        "cache"

    ].forEach(function(flag){

        const env_var = global.process.env[flag.toUpperCase()];

        defaults.flexsearch[flag] = typeof env_var === "undefined" ? config_env[flag] : env_var;
    });

    return defaults;
})();

let timer = null;

module.exports = {

    config: config,

    read_from_file: function(flexsearch){

        exists(filename, function(exists){

            if(exists) readFile(filename, function(err, data){

                if(err){

                    throw err;
                }

                if(data && data.length){

                    try{

                        flexsearch.import(data);
                    }
                    catch(err){

                        throw err;
                    }
                }
            });
        });
    },

    write_schedule: function(flexsearch){

        if(config.autosave || (config.autosave === 0)){

            if(timer){

                clearTimeout(timer);
            }

            timer = setTimeout(function(){

                write_to_file(flexsearch);

            }, config.autosave);
        }
        else{

            write_to_file(flexsearch);
        }
    }
};

function write_to_file(flexsearch){

    writeFile(filename, flexsearch.export(), function(err){

        if(err){

            throw err;
        }
    });
}