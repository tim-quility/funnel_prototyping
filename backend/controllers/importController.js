// const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

exports.processCSVUpload = async (req, res) => {
    const { leads, mapping, agentId } = req.body;
    const redis = req.redisClient;
    
    if (!leads || !Array.isArray(leads) || leads.length === 0) {
        return res.status(400).json({ error: 'No leads data provided.' });
    }

    console.log(`[Import] Processing ${leads.length} rows for agent ${agentId}`);

    // 1. Redis Caching / Locking
    const lockKey = `import_lock:${agentId}`;
    const isLocked = await redis.get(lockKey);

    if (isLocked) {
        return res.status(429).json({ error: 'An import is already in progress. Please wait.' });
    }

    // Set lock for 60 seconds
    await redis.set(lockKey, 'processing', 'EX', 60);

    try {
        const processedRows = [];
        const placeholders = [];
        const values = [];

        // Define allowed DB fields to map to
        const ALLOWED_FIELDS = [
            'borrower_first', 'borrower_last', 'borrower_cell', 'borrower_home', 'borrower_work',
            'email', 'phone', 'address', 'city', 'state', 'zip', 'county',
            'company', 'status_id', 'lead_type', 'lead_level', 'mortgage', 'lender',
            'home_value', 'household_income', 'tobacco', 'dob', 'age', 'vendor'
        ];

        // 2. Data Transformation
        leads.forEach(row => {
            const systemLeadId = `li_${uuidv4()}`; 
            
            // Base row structure
            const dbRow = {
                lead_id: systemLeadId, // This now uses the UUID
                agent_id: agentId,
                date_assigned: new Date().toISOString().slice(0, 19).replace('T', ' '),
            };

            // Map CSV columns to DB fields using the provided mapping
            Object.entries(mapping).forEach(([csvHeader, dbField]) => {
                if (dbField && ALLOWED_FIELDS.includes(dbField)) {
                    let value = row[csvHeader];
                    
                    if (typeof value === 'string') {
                        value = value.trim();
                        if (dbField === 'tobacco') {
                            value = value.toLowerCase() === 'yes' ? 1 : 0;
                        }
                    }
                    
                    dbRow[dbField] = value;
                }
            });

            // Handle system status ID injected by frontend if present
            if (row['__system_status_id']) {
                dbRow['status_id'] = row['__system_status_id'];
            }

            // Fallback for phone
            if (!dbRow['phone'] && dbRow['borrower_cell']) {
                dbRow['phone'] = dbRow['borrower_cell'];
            }

            // Prepare values for SQL
            const rowValues = [
                dbRow.lead_id, // Pushes the new UUID
                dbRow.agent_id,
                dbRow.borrower_first || null,
                dbRow.borrower_last || null,
                dbRow.email || null,
                dbRow.phone || null,
                dbRow.state || null,
                dbRow.status_id || 1, 
                dbRow.lead_type || 'General',
                dbRow.date_assigned
            ];
            
            values.push(...rowValues);
            placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            processedRows.push(dbRow);
        });

        // 3. MySQL Query Construction
        const query = `
            INSERT INTO leads (
                lead_id, 
                agent_id, 
                borrower_first, 
                borrower_last, 
                email, 
                phone, 
                state, 
                status_id, 
                lead_type, 
                date_assigned
            ) 
            VALUES ${placeholders.join(', ')}
            ON DUPLICATE KEY UPDATE 
                borrower_first = VALUES(borrower_first),
                borrower_last = VALUES(borrower_last),
                email = VALUES(email),
                status_id = VALUES(status_id),
                updated_at = NOW();
        `;

        /*
        const connection = await db.getConnection();
        const [result] = await connection.query(query, values);
        connection.release();
        */
        
        console.log("Generated SQL Query (Snippet):", query.substring(0, 500) + "...");
        console.log(`Would insert ${values.length / 10} records.`);

        // Release Lock
        await redis.del(lockKey);

        res.json({
            success: true,
            message: `Successfully processed ${processedRows.length} leads.`,
            meta: {
                total: processedRows.length,
                inserted: processedRows.length
            }
        });

    } catch (error) {
        console.error('Import Error:', error);
        await redis.del(lockKey); 
        res.status(500).json({ error: 'Internal Server Error during import processing.' });
    }
};