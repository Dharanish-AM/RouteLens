const express = require("express");
const app = express();
app.use(express.json());

// Example middleware
function sampleMiddleware(req, res, next) {
  req.middlewareApplied = true;
  next();
}

// Async controller
async function asyncController(req, res) {
  await new Promise((resolve) => setTimeout(resolve, 10));
  res.json({ message: "Async response", query: req.query });
}

// GET user by id
app.get("/users/:id", (req, res) => res.json({ id: req.params.id }));

// POST create user
app.post("/users", (req, res) => res.json(req.body));

// PUT update user
app.put("/users/:id", sampleMiddleware, (req, res) => {
  res.json({ updated: true, id: req.params.id, body: req.body, middleware: req.middlewareApplied });
});

// DELETE user
app.delete("/users/:id", sampleMiddleware, async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 5));
  res.json({ deleted: true, id: req.params.id, middleware: req.middlewareApplied });
});

// GET with query params and async handler
app.get("/search", asyncController);

// POST with middleware and async handler
app.post("/posts", sampleMiddleware, async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 15));
  res.json({ created: true, post: req.body, middleware: req.middlewareApplied });
});

// Route with multiple middlewares
function mw1(req, res, next) { req.mw1 = true; next(); }
function mw2(req, res, next) { req.mw2 = true; next(); }
app.get("/multi-mw", mw1, mw2, (req, res) => {
  res.json({ mw1: req.mw1, mw2: req.mw2 });
});

export default app;
