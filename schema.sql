CREATE TABLE IF NOT EXISTS incidents (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  priority VARCHAR(20) NOT NULL DEFAULT 'Medium',
  status VARCHAR(30) NOT NULL DEFAULT 'Open',
  assignee VARCHAR(120) DEFAULT 'Unassigned',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_priority ON incidents(priority);

CREATE OR REPLACE VIEW powerbi_incident_summary AS
SELECT
  status,
  priority,
  COUNT(*) AS ticket_count,
  AVG(EXTRACT(EPOCH FROM (COALESCE(updated_at, NOW()) - created_at))/3600) AS avg_age_hours
FROM incidents
GROUP BY status, priority;
