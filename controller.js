const { config, read_from_file, write_schedule } = require("./helper");
const flexserach_config = config.flexsearch;

const flexsearch = require("flexsearch").create(flexserach_config ? flexserach_config.preset || {

    async: flexserach_config.async,
    cache: flexserach_config.cache,
    threshold: flexserach_config.threshold,
    depth: flexserach_config.depth,
    limit: flexserach_config.limit,
    encode: flexserach_config.encode,
    tokenize: flexserach_config.tokenize,
    filter: flexserach_config.filter,
    stemmer: flexserach_config.stemmer

} : null);

if(config.autosave || (config.autosave === 0)){

    read_from_file(flexsearch);
}

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

                flexsearch.add(id, content, function(){

                    write_schedule(flexsearch);
                });

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

                        flexsearch.add(id, content, i < len - 1 ? null : function(){

                            write_schedule(flexsearch);
                        });
                    }

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

    update: function(req, res, next){

        const id = req.params.id;
        const content = req.params.content;

        if(id && content){

            try{

                flexsearch.update(id, content, function(){

                    write_schedule(flexsearch)
                });

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

                        flexsearch.update(id, content, i < len - 1 ? null : function(){

                            write_schedule(flexsearch);
                        });
                    }

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

                flexsearch.remove(id, function(){

                    write_schedule(flexsearch);
                });

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

                        flexsearch.remove(json[i], i < len - 1 ? null : function(){

                            write_schedule(flexsearch);
                        });
                    }

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
