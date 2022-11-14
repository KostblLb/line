import http2 from "node:http2";
import fs from "fs";

const server = http2.createSecureServer({
  key: fs.readFileSync("./.devcert/localhost-privkey.pem"),
  cert: fs.readFileSync("./.devcert/localhost-cert.pem"),
});
server.on("error", (err) => console.error(err));
