const env = require("./env");
const { config } = require("./helper");
const app = require("express")();
const controller = require("./controller");
const compression = require("compression");
const { json } = require("body-parser");

/* Enforce SSL
-----------------------------------------------*/

if(config.force_ssl) {

    app.use(function(req, res, next){

        if(req.secure ||
          (req.protocol === "https") ||
          (req.get("x-forwarded-proto") === "https")){

            next();
        }
        else{

            res.redirect("https://" + req.headers.host + req.url);
        }
    });
}

/* Compression
-----------------------------------------------*/

app.use(compression({

    filter: function(req, res){

        return req.headers["x-no-compression"] ?

            false
        :
            compression.filter(req, res);
    }
}));

/* CORS
-----------------------------------------------*/

app.use(function(req, res, next){

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //req.env = env;

    next();
});

/* Body Parser
-----------------------------------------------*/

app.use(json());

/* Routes
-----------------------------------------------*/

app.get("/", controller.index);
app.post("/add", controller.add);
app.post("/add/:id/:content", controller.add);
app.post("/update", controller.update);
app.post("/update/:id/:content", controller.update);
app.get("/search", controller.search);
app.get("/search/:query", controller.search);
app.post("/remove", controller.remove);
app.post("/remove/:id", controller.remove);

/* Start HTTPS Server
-----------------------------------------------*/

if(config.https || config.force_ssl){

    const { readFileSync } = require("fs");
    const { createServer } = require("https");

    createServer({

        key: readFileSync("cert/" + env + ".pem", "utf8"),
        cert: readFileSync("cert/" + env + ".crt", "utf8")

    }, app).listen(443, function(err){

        if(err) throw err;

        console.info("Server@" + process.pid + " listening on https://localhost");
    });
}

/* Start HTTP Server
-----------------------------------------------*/

if(!config.force_ssl){

    app.listen(config.port, function(err){

        if(err) throw err;

        console.info("Server@" + process.pid + " listening on http://localhost" + (("" + config.port) !== "80" ? ":" + config.port : ""));
    });
}
