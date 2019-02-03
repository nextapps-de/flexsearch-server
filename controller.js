const { write_schedule } = require("./helper");
const { flexsearch, pool:worker_pool, connection } = require("./handler");
const index_map = {};
let worker_index = 0;

module.exports = {

    index: function(req, res, next){

        try{

            if(worker_pool.length){

                const uid = (Math.random() * 999999999) >> 0;

                connection[uid] = res;

                for(let i = 1; i < worker_pool.length; i++){

                    worker_pool[i].send({

                        job: "info",
                        task: uid
                    });
                }
            }
            else{

                res.json(flexsearch.info());
            }
        }
        catch(err){

            next(err);
        }
    },

    add: function(req, res, next){

        const id = req.params.id;
        const content = req.params.content;

        if(id || (id === 0)){

            try{

                if(content){

                    register_task("add", id, content, write_schedule);
                }

                res.sendStatus(200);
            }
            catch(err){

                next(err);
            }
        }
        else{

            res.sendStatus(422);
        }
    },

    add_bulk: function(req, res, next){

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

                    if(id || (id === 0)){

                        if(content){

                            register_task("add", id, content, (worker_pool.length || (i === len - 1)) && write_schedule);
                        }
                    }
                }

                res.sendStatus(200);
            }
            catch(err){

                next(err);
            }
        }
        else{

            res.sendStatus(422);
        }
    },

    update: function(req, res, next){

        const id = req.params.id;
        const content = req.params.content;

        if(id || (id === 0)){

            try{

                if(content){

                    register_task("update", id, content, write_schedule);
                }

                res.sendStatus(200);
            }
            catch(err){

                next(err);
            }
        }
        else{

            res.sendStatus(404);
        }
    },

    update_bulk: function(req, res, next){

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

                    if(id || (id === 0)){

                        if(content){

                            register_task("update", id, content, (worker_pool.length || (i === len - 1)) && write_schedule);
                        }
                    }
                }

                res.sendStatus(200);
            }
            catch(err){

                next(err);
            }
        }
        else{

            res.sendStatus(422);
        }
    },

    search: async function(req, res, next){

        const query = req.params.query || req.body;

        if(query){

            try{

                if(worker_pool.length){

                    const uid = (Math.random() * 999999999) >> 0;

                    connection[uid] = res;

                    for(let i = 1; i < worker_pool.length; i++){

                        worker_pool[i].send({

                            job: "search",
                            query: query,
                            task: uid
                        });
                    }
                }
                else{

                    res.json(await flexsearch.search(query));
                }
            }
            catch(err){

                next(err);
            }
        }
        else{

            res.json([]);
        }
    },

    remove: function(req, res, next){

        const id = req.params.id;

        if(id || (id === 0)){

            try{

                register_task("remove", id, write_schedule);

                delete index_map["@" + id];

                res.sendStatus(200);
            }
            catch(err){

                next(err);
            }
        }
        else{

            res.sendStatus(422);
        }
    },

    remove_bulk: function(req, res, next){

        const json = req.body;

        if(json){

            try{

                for(let i = 0, len = json.length; i < len; i++){

                    const id = json[i];

                    if(id || (id === 0)){

                        register_task("remove", id, (worker_pool.length || (i === len - 1)) && write_schedule);

                        delete index_map["@" + id];
                    }
                }

                res.sendStatus(200);
            }
            catch(err){

                next(err);
            }
        }
        else{

            res.sendStatus(422);
        }
    }
};

function register_task(job, id, content, write){

    if(worker_pool.length){

        let current_index;

        if(!(current_index = index_map["@" + id])){

            if(++worker_index >= worker_pool.length){

                worker_index = 1;
            }

            index_map["@" + id] = current_index = worker_index;
        }

        worker_pool[current_index].send({

            job: job,
            id: id,
            content: content,
            write: (job === "remove" ? content : write) && true
        });
    }
    else{

        flexsearch[job](id, content, write);
    }
}
