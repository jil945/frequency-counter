const app = require("./api");
const port = process.env.PORT || 8080;
const host = "0.0.0.0";

app.listen(port, host);
console.log(`Running on http://${host}:${port}`);