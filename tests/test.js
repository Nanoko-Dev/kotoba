const { Kotoba } = require("../dist/index");
const kotoba = new Kotoba(3000);
kotoba
  .createRequest({
    method: 'get',
    route: '/',
    callback: (req, response) => {
      response.send("Hello World!");
    }
  })
  .createRequest({
    method: 'get',
    route: '/helloworld',
    callback: (req, res) => res.json(JSON.stringify({ hello: "world" }))
  })
  .createRequest({
    method: 'get',
    route: '/post/:id',
    callback: (req, res) => {
      const helper = kotoba.setRequestAndResponse(req, res);
      helper.getParam("id")
       .then((p) => {
        console.log(p);
        res.send("hi");
       });
    }
  })
  .startApp(`Now online on the interwebs :3 ${kotoba.port}`)
