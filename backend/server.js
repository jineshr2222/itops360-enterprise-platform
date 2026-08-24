import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;
const app = express();
const port = process.env.PORT || 5000;

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

app.use(cors());
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  res.json({ status: "ok", service: "itops360-api" });
});

app.get("/api/incidents", async (_req, res) => {
  if (!pool) {
    return res.json([
      {
        id: 1001,
        title: "VPN access issue",
        priority: "High",
        status: "Open",
        assignee: "Support Team",
        created_at: new Date().toISOString()
      }
    ]);
  }

  const result = await pool.query(
    "SELECT id, title, priority, status, assignee, created_at FROM incidents ORDER BY created_at DESC"
  );
  res.json(result.rows);
});

app.post("/api/incidents", async (req, res) => {
  const { title, description = "", priority = "Medium", assignee = "Unassigned" } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  if (!pool) {
    return res.status(201).json({
      id: Date.now(),
      title,
      description,
      priority,
      status: "Open",
      assignee,
      created_at: new Date().toISOString()
    });
  }

  const result = await pool.query(
    `INSERT INTO incidents (title, description, priority, status, assignee)
     VALUES ($1, $2, $3, 'Open', $4)
     RETURNING *`,
    [title, description, priority, assignee]
  );

  res.status(201).json(result.rows[0]);
});

app.patch("/api/incidents/:id/status", async (req, res) => {
  const { status } = req.body;
  const allowed = ["Open", "In Progress", "Resolved", "Closed"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  if (!pool) {
    return res.json({ id: Number(req.params.id), status });
  }

  const result = await pool.query(
    "UPDATE incidents SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *",
    [status, req.params.id]
  );

  if (!result.rowCount) {
    return res.status(404).json({ error: "Incident not found" });
  }

  res.json(result.rows[0]);
});

app.listen(port, () => {
  console.log(`ITOps360 API listening on port ${port}`);
});
