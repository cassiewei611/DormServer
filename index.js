const http = require("http");
const url = require("url");

const port = process.env.PORT || 3000;
const items = [];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method === "GET" && parsedUrl.query.op === "insert") {
    const newItem = {
      who: parsedUrl.query.who,
      what: parsedUrl.query.what,
      whereC: parsedUrl.query.whereC,
    };

    if (
      !items.find(
        (item) =>
          item.who === newItem.who &&
          item.what === newItem.what &&
          item.whereC === newItem.whereC
      )
    ) {
      items.push(newItem);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Item added successfully");
    } else {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Item already exists");
    }
  } else if (req.method === "GET" && parsedUrl.query.op === "remove") {
    const { who, what } = parsedUrl.query;
    const indexToRemove = items.findIndex(
      (item) => item.who === who && item.what === what
    );

    if (indexToRemove !== -1) {
      items.splice(indexToRemove, 1);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Item removed successfully");
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Item not found");
    }
  } else if (req.method === "GET" && parsedUrl.query.op === "update") {
    const { who, what, whereC, newWho, newWhat, newWhereC } = parsedUrl.query;
    const indexToUpdate = items.findIndex(
      (item) => item.who === who && item.what === what && item.whereC === whereC
    );

    if (indexToUpdate !== -1) {
      items[indexToUpdate] = { who: newWho, what: newWhat, whereC: newWhereC };
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Item updated successfully");
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Item not found");
    }
  } else if (req.method === "GET" && parsedUrl.pathname === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(items));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Endpoint not found");
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
