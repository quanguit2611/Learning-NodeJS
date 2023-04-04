const EventEmmiter = require("events");
const http = require("http");

class Sales extends EventEmmiter {
  constructor() {
    super();
  }
}

const myEmmiter = new Sales();

myEmmiter.on("newSale", () => {
  console.log("there was a new sale");
});

myEmmiter.on("newSale", () => {
  console.log("customer name: quang");
});

myEmmiter.on("newSale", (stock) => {
  console.log(`there are now ${stock} items in stock`);
});

myEmmiter.emit("newSale", 9);

/////////////////////////////

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("request received");
  console.log(req.url);
  res.end("request received");
});

server.on("request", (req, res) => {
  console.log("Another request received");
});

server.on("close", () => {
  console.log("server closed");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Waiting for requests...");
});
