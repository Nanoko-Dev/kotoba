# @nanoko/kotoba
## The Nanoko lightweight express framework used for backend services and Nanoko!

```ts
const { Kotoba } = require("@nanoko/kotoba");
const kotoba = new Kotoba(3000);
kotoba
  .store("views", "some view")
  .createRequest({
    method: "get",
    route: "/post/:id",
    callback: (req, response) => {
      const id = "test";
      const res = kotoba.setRequestAndResponse(req, response);
      res.getParam("id")
        .then((data) => {
          if (data == id) {
            res.getBody("post")
              .then((p) => {
                response.json(JSON.stringify({ post: p.info }));
              })
              .catch((err) => {
                response.status(400).send(err.message);
              })
          }
        })
    }
  })

  .startApp(`Connected and online at ${kotoba.getPort}`);
```
