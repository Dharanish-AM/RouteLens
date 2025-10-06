const express = require("express");
const app = express();
app.use(express.json());

app.get("/users/:id", (req, res) => res.json({ id: req.params.id }));
app.post("/users", (req, res) => res.json(req.body));

export default app;
