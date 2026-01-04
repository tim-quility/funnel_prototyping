const pool = require('../db');
const smsService = require('../services/SmsService');
const emailService = require('../services/EmailService');
const xmlFeedService = require('../services/XmlFeedService');
const { v4: uuidv4 } = require('uuid');

// --- Helper Functions ---
const getRecruit = async (id, tenant_id) => {
  const [rows] = await pool.query('SELECT * FROM `lead` WHERE id = ? AND tenant_id = ? AND lead_type = ?', [id, tenant_id, 'recruiting']);
  return rows[0];
};

const getPipelineConfig = async (agent_id, tenant_id) => {
  const [rows] = await pool.query(
    'SELECT pipelines_config FROM recruiting_pipelines WHERE agent_id = ? AND tenant_id = ?',
    [agent_id, tenant_id]
  );
  if (rows.length > 0 && rows[0].pipelines_config) {
    return typeof rows[0].pipelines_config === 'string'
      ? JSON.parse(rows[0].pipelines_config)
      : rows[0].pipelines_config;
  }
  return null;
};

// --- Controller Methods ---

exports.getDashboardData = async (req, res) => {
  try {
    const { id: agent_id, tenant_id } = req.user;

    // 1. Fetch Stats
    // Total Candidates
    const [[{ total_candidates }]] = await pool.query(
      "SELECT COUNT(*) as total_candidates FROM `lead` WHERE lead_type = 'recruiting' AND agent_id = ? AND tenant_id = ?",
      [agent_id, tenant_id]
    );

    // Active Pipelines (from config)
    const pipelineConfig = await getPipelineConfig(agent_id, tenant_id);
    const active_pipelines = pipelineConfig ? pipelineConfig.length : 0;

    // Conversion Rate (Hired / Total)
    // Assuming 'Hired' status or similar exists. This logic might need refinement based on actual stage names.
    const [[{ hired_candidates }]] = await pool.query(
      "SELECT COUNT(*) as hired_candidates FROM `lead` WHERE lead_type = 'recruiting' AND lead_status LIKE '%Hired%' AND agent_id = ? AND tenant_id = ?",
      [agent_id, tenant_id]
    );
    const conversion_rate = total_candidates > 0 ? ((hired_candidates / total_candidates) * 100).toFixed(2) : 0;

    // 2. Fetch Recent Activity (simple implementation: latest recruits updated)
    const [recent_activity] = await pool.query(
      "SELECT id, first_name, last_name, lead_status, updated_at FROM `lead` WHERE lead_type = 'recruiting' AND agent_id = ? AND tenant_id = ? ORDER BY updated_at DESC LIMIT 5",
      [agent_id, tenant_id]
    );

    res.json({
      stats: {
        total_candidates,
        active_pipelines,
        conversion_rate
      },
      recent_activity,
      pipeline_config: pipelineConfig || []
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getBadges = async (req, res) => {
  try {
    const { id: agent_id } = req.user;
    // Assuming a standard gamification structure, querying agent_recruiting_badges
    // If table doesn't exist yet, return empty array
    try {
      const [badges] = await pool.query(
        "SELECT b.*, arb.awarded_at FROM recruiting_badges b JOIN agent_recruiting_badges arb ON b.id = arb.badge_id WHERE arb.agent_id = ?",
        [agent_id]
      );
      res.json(badges);
    } catch (e) {
      console.warn("Badges table query failed (table might not exist yet):", e.message);
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.savePipelines = async (req, res) => {
  try {
    const { id: agent_id, tenant_id } = req.user;
    const { pipelines_config, default_stage } = req.body;

    const configString = JSON.stringify(pipelines_config);

    // Upsert configuration
    await pool.query(
      `INSERT INTO recruiting_pipelines (tenant_id, agent_id, pipelines_config, default_stage)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE pipelines_config = VALUES(pipelines_config), default_stage = VALUES(default_stage)`,
      [tenant_id, agent_id, configString, default_stage]
    );

    res.json({ message: 'Pipeline configuration saved.' });
  } catch (error) {
    console.error('Error saving pipelines:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createRecruit = async (req, res) => {
  try {
    const { id: agent_id, tenant_id } = req.user;
    const { first_name, last_name, phone, email, state, source, notes, status } = req.body;

    // Assuming standard lead table structure
    const query = `
      INSERT INTO \`lead\` (tenant_id, agent_id, first_name, last_name, phone, email, state, source, notes, lead_status, lead_type, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'recruiting', NOW(), NOW())
    `;

    const [result] = await pool.query(query, [tenant_id, agent_id, first_name, last_name, phone, email, state, source, notes, status || 'New Lead']);

    res.status(201).json({ id: result.insertId, message: 'Recruit created.' });
  } catch (error) {
    console.error('Error creating recruit:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateRecruit = async (req, res) => {
  try {
    const { id: agent_id, tenant_id } = req.user;
    const { id } = req.params;
    const updates = req.body; // Expecting fields to update

    const currentRecruit = await getRecruit(id, tenant_id);
    if (!currentRecruit) {
      return res.status(404).json({ error: 'Recruit not found.' });
    }

    // Check for Stage Change to trigger automations
    if (updates.lead_status && updates.lead_status !== currentRecruit.lead_status) {
      // 1. Fetch Pipeline Config to find automations for the new stage
      const pipelineConfig = await getPipelineConfig(agent_id, tenant_id);

      let newStageConfig = null;
      if (pipelineConfig) {
        for (const pipe of pipelineConfig) {
          const stage = pipe.stages.find(s => s.title === updates.lead_status || s.id === updates.lead_status);
          if (stage) {
            newStageConfig = stage;
            break;
          }
        }
      }

      // 2. Trigger Automations
      if (newStageConfig && newStageConfig.automations) {
        for (const automation of newStageConfig.automations) {
          if (automation.type === 'send_sms') {
             // automation.templateId or automation.content
             const body = automation.content || "Hello from Funnel CRM!";
             // Variable substitution (basic)
             const finalBody = smsService.processTemplate(body, { FirstName: currentRecruit.first_name });
             await smsService.sendSms(currentRecruit.phone, finalBody);
          } else if (automation.type === 'send_packet') {
             // automation.packetId
             if (automation.packetId) {
                // Fetch packet details
                const [packets] = await pool.query('SELECT * FROM recruiting_resource_packets WHERE id = ?', [automation.packetId]);
                if (packets.length > 0) {
                   const packet = packets[0];
                   const resourceIds = typeof packet.resource_ids === 'string' ? JSON.parse(packet.resource_ids) : packet.resource_ids;

                   // Fetch resources
                   if (resourceIds.length > 0) {
                     // Convert IDs to string for IN clause safely or use loop (simple IN clause here)
                     const placeholders = resourceIds.map(() => '?').join(',');
                     const [resources] = await pool.query(`SELECT * FROM recruiting_resources WHERE id IN (${placeholders})`, resourceIds);

                     await emailService.sendResourcePacket(currentRecruit.email, packet.name, resources);
                   }
                }
             }
          }
        }
      }

      // 3. Update Status History
      let history = currentRecruit.status_history;
      if (typeof history === 'string') {
          try { history = JSON.parse(history); } catch(e) { history = []; }
      }
      if (!Array.isArray(history)) history = [];

      history.push({
        from: currentRecruit.lead_status,
        to: updates.lead_status,
        timestamp: new Date().toISOString()
      });
      updates.status_history = JSON.stringify(history);
    }

    // Construct Update Query
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = Object.values(updates);

    if (fields.length > 0) {
      await pool.query(`UPDATE \`lead\` SET ${fields}, updated_at = NOW() WHERE id = ? AND tenant_id = ?`, [...values, id, tenant_id]);
    }

    res.json({ message: 'Recruit updated.' });

  } catch (error) {
    console.error('Error updating recruit:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// --- Resources & Packets ---

exports.createResource = async (req, res) => {
  try {
    const { id: agent_id, tenant_id } = req.user;
    const { type, title, description, category, content_url, thumbnail_url } = req.body;
    const id = uuidv4();

    await pool.query(
      'INSERT INTO recruiting_resources (id, tenant_id, agent_id, type, title, description, category, content_url, thumbnail_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, tenant_id, agent_id, type, title, description, category, content_url, thumbnail_url]
    );

    res.status(201).json({ id, message: 'Resource created.' });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createPacket = async (req, res) => {
  try {
    const { id: agent_id, tenant_id } = req.user;
    const { name, resource_ids } = req.body; // resource_ids is array
    const id = uuidv4();

    await pool.query(
      'INSERT INTO recruiting_resource_packets (id, tenant_id, agent_id, name, resource_ids) VALUES (?, ?, ?, ?, ?)',
      [id, tenant_id, agent_id, name, JSON.stringify(resource_ids)]
    );

    res.status(201).json({ id, message: 'Packet created.' });
  } catch (error) {
    console.error('Error creating packet:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// --- Job Posts & Feeds ---

exports.createJobPostTemplate = async (req, res) => {
  try {
    const { id: agent_id, tenant_id } = req.user;
    const { title, content } = req.body;
    const id = uuidv4();

    await pool.query(
      'INSERT INTO job_post_templates (id, tenant_id, agent_id, title, content) VALUES (?, ?, ?, ?, ?)',
      [id, tenant_id, agent_id, title, content]
    );

    res.status(201).json({ id, message: 'Job Post Template created.' });
  } catch (error) {
    console.error('Error creating job post template:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getPublicFeed = async (req, res) => {
  try {
    const { feedId } = req.params; // In a real scenario, map feedId to a configuration in DB
    // For prototype/demo, we will just fetch ALL job post templates for a specific agent (hardcoded or derived)
    // Or, if feedId is the agent_id/tenant_id combined.

    // Simplification: Assume feedId maps to a tenant_id for demo purposes, or we just fetch some dummy data + templates

    // 1. Fetch Templates (limit 10)
    // We need a way to know WHICH tenant this feed is for.
    // Let's assume feedId = tenant_id for this implementation.
    const tenant_id = feedId;

    const [templates] = await pool.query(
      'SELECT * FROM job_post_templates WHERE tenant_id = ? LIMIT 10',
      [tenant_id]
    );

    if (templates.length === 0) {
      return res.status(404).send('Feed not found or empty.');
    }

    // 2. Map templates to "Jobs" (adding cities/dates dynamically)
    const jobs = templates.map(t => ({
      id: t.id,
      title: t.title,
      description: t.content,
      city: 'Remote', // Default or fetched from feed config
      state: 'USA',
      date: t.updated_at.toISOString().split('T')[0],
      url: `https://funnelcrm.com/careers/${t.id}`
    }));

    // 3. Generate XML
    const xml = xmlFeedService.generateJobFeed(jobs);

    res.set('Content-Type', 'text/xml');
    res.send(xml);

  } catch (error) {
    console.error('Error generating feed:', error);
    res.status(500).send('Error generating feed');
  }
};
