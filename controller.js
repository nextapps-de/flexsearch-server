const env = require("./env");
const cluster = require('cluster');
const { readFile, writeFile, exists } = require("fs");
const filename = "store/" + env + (cluster.isMaster ? "" : "@" + cluster.worker.id) + ".json";
let config = require("./config/" + env);

const flexsearch = require("./node_modules/flexsearch/flexsearch.js").create(config = config.flexsearch ? {

    preset: config.async,
    async: config.async,
    cache: config.cache,
    threshold: config.threshold,
    depth: config.depth,
    limit: config.limit

} : null);

read_from_file();

module.exports = {

    index: function(req, res, next){

        try{

            res.json(flexsearch.info());
        }
        catch(err){

            next(err);
        }
    },

    add: function(req, res, next){

        const id = req.params.id;
        const content = req.params.content;

        if(id && content){

            try{

                flexsearch.add(id, content);

                write_to_file();

                res.sendStatus(200);
            }
            catch(err){

                next(err);
            }
        }
        else{

            let json = req.body;

            if(json){

                try{

                    if(json.constructor !== Array){

                        json = [json];
                    }

                    for(let i = 0, len = json.length; i < len; i++){

                        const query = json[i];
                        const id = query.id;
                        const content = query.content;

                        flexsearch.add(id, content);
                    }

                    write_to_file();

                    res.sendStatus(200);
                }
                catch(err){

                    next(err);
                }
            }
            else{

                next();
            }
        }
    },

    search: async function(req, res, next){

        const query = req.params.query;
        const json = req.body;

        if(query || json){

            try{

                res.json(await flexsearch.search(query || json));
            }
            catch(err){

                next(err);
            }
        }
        else{

            next();
        }
    },

    remove: function(req, res, next){

        const id = req.params.id;

        if(id){

            try{

                flexsearch.remove(id);

                write_to_file();

                res.sendStatus(200);
            }
            catch(err){

                next(err);
            }
        }
        else{

            const json = req.body;

            if(json){

                try{

                    for(let i = 0, len = json.length; i < len; i++){

                        flexsearch.remove(json[i]);
                    }

                    write_to_file();

                    res.sendStatus(200);
                }
                catch(err){

                    next(err);
                }
            }
            else{

                next();
            }
        }
    }
};

function read_from_file(){

    exists(filename, function(exists) {

        if(exists) readFile(filename, function(err, data){

            if(err){

                throw err;
            }

            if(data && data.length){

                try{

                    data = JSON.parse(data);

                    flexsearch._map = data.map;
                    flexsearch._ctx = data.ctx;
                }
                catch(err){

                    throw err;
                }
            }
        });
    });
}

function write_to_file(){

    writeFile(filename, JSON.stringify({

        "map": flexsearch._map,
        "ctx": flexsearch._ctx

    }), function(err){

        if(err){

            throw err;
        }
    });
}