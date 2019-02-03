const env = require("./env");
const defaults = require("./config/default");
const { isMaster, worker } = require("cluster");
const { readFile, writeFile, exists, existsSync } = require("fs");
const filename = "store/" + env + (isMaster ? "" : "@" + worker.id) + ".json";

let config_env;

const config = (function(){

    if(existsSync("../../package.json")){

        const config_package = require("../../package.json");

        if(config_package.flexsearch){

            if((config_package.flexsearch === "development") || (config_package.flexsearch === "production")){

                config_env = require("./config/" + config_package.flexsearch);
            }
            else{

                if(config_package.development || config_package.production){

                    if(config_package[env] && (config_package[env].indexOf(".json") !== -1) && existsSync("../../" + config_package[env])){

                        config_env = require("../../" + config_package[env]);
                    }
                }
                else{

                    config_env = config_package.flexsearch;
                }
            }
        }
    }

    if(!config_env && existsSync("../../flexsearch.json")){

        config_env = require("../../flexsearch.json");
    }

    if(!config_env){

        config_env = require("./config/" + env);
    }

    [
        "debug",
        "port",
        "port_ssl",
        "force_ssl",
        "https",
        "compress",
        "autosave",
        "worker"

    ].forEach(function(flag){

        const env_var = global.process.env[flag.toUpperCase()];

        defaults[flag] = (

            typeof env_var === "undefined" ?

                config_env.server[flag]
            :
                env_var
        );
    });

    /*
    [
        "host",
        "port",
        "pass"

    ].forEach(function(flag){

        const env_var = global.process.env[flag.toUpperCase()];

        defaults.redis[flag] = (

            typeof env_var === "undefined" ?

                config_env.redis[flag]
            :
                env_var
        );
    });
    */

    [
        "async",
        "cache",
        "threshold",
        "depth",
        "limit",
        "encode",
        "tokenize",
        "filter",
        "stemmer"
        //"worker"

    ].forEach(function(flag){

        const env_var = global.process.env[flag.toUpperCase()];

        defaults[flag] = (

            typeof env_var === "undefined" ?

                config_env.client[flag]
            :
                env_var
        );
    });

    return defaults;
})();

let timer = null;
let flexsearch;
let index_map;

module.exports = {

    config: config,

    init: function(_flexsearch, _index_map){

        flexsearch = _flexsearch;
        index_map = _index_map;
    },

    read_from_file: function(){

        exists(filename, function(exists){

            if(exists) readFile(filename, function(err, data){

                if(err){

                    throw err;
                }

                if(data && data.length){

                    try{

                        flexsearch.import(data);

                        const index = flexsearch.index;
                        const keys = Object.keys(index);

                        for(let i = 0, len = keys.length; i < len; i++){

                            const key = keys[i];

                            index_map[key] = index[key];
                        }

                        if(config.debug){

                            console.info("Data was loaded successfully.");
                        }
                    }
                    catch(err){

                        throw err;
                    }
                }
            });
        });
    },

    write_schedule: config.autosave || (config.autosave === 0) ? function(){

        if(timer){

            clearTimeout(timer);
        }

        timer = setTimeout(write_to_file, config.autosave);

    } : write_to_file
};

function write_to_file(){

    try{

        const json = flexsearch.export();
              json[2] = index_map;

        writeFile(filename, json, function(err){

            if(err){

                throw err;
            }

            if(config.debug){

                console.info("Data was saved successfully.");
            }
        });
    }
    catch(err){

        throw err;
    }
}
