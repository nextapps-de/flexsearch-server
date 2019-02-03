process.env.NODE_ENV = "test";

const request = require("supertest");
const server = require("./server");

describe("FlexSearch Server (RESTful)", function(){

    it("responds to /", async function(){

        await request("http://localhost:6780")
            .get("/")
            .expect(200);
    });

    it("not responds to /notfound", async function(){

        await request("http://localhost:6780")
            .get("/notfound")
            .expect(404);
    });

    it("index content", async function(){

        await request("http://localhost:6780")
            .post("/add/0/foo")
            .send()
            .expect(200);

        await request("http://localhost:6780")
            .post("/add/1/bar")
            .send()
            .expect(200);

        await request("http://localhost:6780")
            .post("/add/2/foobar")
            .send()
            .expect(200);
    });

    it("update content", async function(){

        await request("http://localhost:6780")
            .post("/update/0/foobar")
            .send()
            .expect(200);

        await request("http://localhost:6780")
            .post("/update/1/foo")
            .send()
            .expect(200);

        await request("http://localhost:6780")
            .post("/update/2/bar")
            .send()
            .expect(200);
    });

    it("search content", async function(){

        await request("http://localhost:6780")
            .get("/search/foo")
            .set('Accept', 'application/json')
            .expect(["0","1"]);

        await request("http://localhost:6780")
            .get("/search/bar")
            .set('Accept', 'application/json')
            .expect(["2"]);

        await request("http://localhost:6780")
            .get("/search/foobar")
            .set('Accept', 'application/json')
            .expect(["0"])
    });

    it("remove content", async function(){

        await request("http://localhost:6780")
            .post("/remove/0")
            .send()
            .expect(200);

        await request("http://localhost:6780")
            .post("/remove/1")
            .send()
            .expect(200);

        await request("http://localhost:6780")
            .post("/remove/2")
            .send()
            .expect(200);

        // check:

        await request("http://localhost:6780")
            .get("/search/foo")
            .set('Accept', 'application/json')
            .expect([]);

        await request("http://localhost:6780")
            .get("/search/bar")
            .set('Accept', 'application/json')
            .expect([]);

        await request("http://localhost:6780")
            .get("/search/foobar")
            .set('Accept', 'application/json')
            .expect([])
    });
});

describe("FlexSearch Server (JSON)", function(){

    it("index content", async function(){

        await request("http://localhost:6780")
            .post("/add")
            .send([{id: 0, content: "foo"}, {id: 1, content: "bar"}, {id: 2, content: "foobar"}])
            .expect(200);
    });

    it("update content", async function(){

        await request("http://localhost:6780")
            .post("/update")
            .send([{id: 0, content: "foobar"}, {id: 1, content: "foo"}, {id: 2, content: "bar"}])
            .expect(200);
    });

    it("search content", async function(){

        await request("http://localhost:6780")
            .get("/search/foo")
            .set('Accept', 'application/json')
            .expect([0,1]);

        await request("http://localhost:6780")
            .get("/search/bar")
            .set('Accept', 'application/json')
            .expect([2]);

        await request("http://localhost:6780")
            .get("/search/foobar")
            .set('Accept', 'application/json')
            .expect([0])
    });

    it("remove content", async function(){

        await request("http://localhost:6780")
            .post("/remove")
            .send([0, 1, 2])
            .expect(200);

        // check:

        await request("http://localhost:6780")
            .get("/search/foo")
            .set('Accept', 'application/json')
            .expect([]);

        await request("http://localhost:6780")
            .get("/search/bar")
            .set('Accept', 'application/json')
            .expect([]);

        await request("http://localhost:6780")
            .get("/search/foobar")
            .set('Accept', 'application/json')
            .expect([])
            .then(function(){
                server.close();
            })
    });
});