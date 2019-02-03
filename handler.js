const { config, init, read_from_file, write_schedule } = require("./helper");

const flexsearch = require("flexsearch").create(config ? config.preset || {

    async: true,
    cache: config.cache,
    threshold: config.threshold,
    depth: config.depth,
    limit: config.limit,
    encode: config.encode,
    tokenize: config.tokenize,
    filter: config.filter,
    stemmer: config.stemmer

} : null);

const index_map = {};
const connection = {};
const state = {};
const pool = [];

init(flexsearch, index_map);

if(config.autosave || (config.autosave === 0)){

    read_from_file();
}

module.exports = {

    flexsearch: flexsearch,
    index_map: index_map,
    pool: pool,
    connection: connection,
    state: state,

    master: async function(worker, message, handle){

        if(config.debug){

            console.log(message);
        }

        const current_task = message.task;

        (state[current_task] || (state[current_task] = [])).push(message.response);

        if((state[current_task].length + 1) === pool.length){

            try{

                if(message.job === "search"){

                    // TODO: sort results, return array of relevance [0...9] and apply in main thread

                    connection[current_task].json([].concat.apply([], state[current_task]));
                }
                else{

                    connection[current_task].json(merge(state[current_task]));
                }
            }
            catch(err){

                if(config.debug){

                    console.error(err);
                }
            }

            delete connection[current_task];
            delete state[current_task];
        }
    },

    slave: async function(message){

        if(config.debug){

            console.log(message);
        }

        switch(message.job){

            case "search":
                process.send({
                    job: "search",
                    response: await flexsearch.search(message.query),
                    task: message.task
                });
                break;

            case "add":
                flexsearch.add(
                    message.id,
                    message.content,
                    message.write && write_schedule
                );
                break;

            case "update":
                flexsearch.update(
                    message.id,
                    message.content,
                    message.write && write_schedule
                );
                break;

            case "remove":
                flexsearch.remove(
                    message.id,
                    message.write && write_schedule
                );
                break;

            case "info":
                process.send({
                    job: "info",
                    response: flexsearch.info(),
                    task: message.task
                });
                break;
        }
    }
};

function merge(arr){

    const merged = arr[0];

    if(arr.length > 1){

        const keys = Object.keys(merged);

        for(let x = 1; x < arr.length; x++){

            for(let i = 0; i < keys.length; i++){

                const key = keys[i];

                if(key !== "id"){

                    if(typeof merged[key] === "number"){

                        merged[key] += arr[x][key];
                    }
                }
            }
        }
    }

    merged.worker = pool.length - 1;

    return merged;
}