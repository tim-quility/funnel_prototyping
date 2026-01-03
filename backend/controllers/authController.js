//const pool = require('../db');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

exports.login = async (req, res) => {
    /*const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        // In a real multi-tenant app, you might determine the tenant_id from a subdomain or the username format.
        // For now, we assume a single tenant or that the email is unique across tenants.
        const query = `
            SELECT 
                a.*,
                o.name as organizationName,
                o.id as organization
            FROM agent a
            JOIN organization o ON a.organization = o.id
            WHERE username = ?
        `;

        // The username from the frontend is the email in the DB
        const [[agent]] = await pool.query(query, [username]);


        if (!agent) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        
        const isPasswordMatch = await argon2.verify(agent.v2master, password);

        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // Passwords match, create JWT
        const payload = {
            id: agent.id,
            email: agent.email,
            tenant_id: agent.tenant_id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_default_secret', {
            expiresIn: '8h',
        });

        const agentInfoForClient = {
            agentId: agent.id,
            organization: agent.organization_id,
            admin: agent.privledge,
            organizationName: agent.organizationName,
            organization: agent.organization,
            permissions: agent.privledge,
            firstName: agent.first_name,
            lastName: agent.last_name,
            email: agent.email,
            agentCode: agent.agent_code,
            beta: agent.beta,
            //a2pOnly: false,
            status: agent.status,
            username: agent.username,
            phone: agent.phone,
            timezone: agent.timezone,
            tutorial: agent.tutorial,
            statsVisible: true,
            liveTransferOptIn: false,
            recruitingModuleActive: true,
        };

        res.status(200).json({
            token,
            agent: agentInfoForClient,
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An internal server error occurred during login.' });
    }*/
};

exports.verify = async (req, res) => {

    /*const { id, organization: tenant_id  } = req.user;
    try {
        const query = `
            SELECT 
                GROUP_CONCAT(m.id SEPARATOR ',') AS serviceIds, a.id, a.agent_code, a.phone, a.timezone, a.tutorial, a.beta, a.privledge, a.status, a.username, a.organization AS tenant_id, o.name as organizationName, a.first_name, a.last_name, a.email, a.role
            FROM agent a
            LEFT JOIN ${process.env.FEATURE_DB}agent_apps aa 
            ON aa.agent_id=a.id
            LEFT JOIN ${process.env.FEATURE_DB}marketplace_items m 
            ON m.id=aa.app_id
            JOIN organization o ON a.organization = o.id
            WHERE a.id=?
        `;

        const [[agent]] = await pool.query(query, [id]);

        if (!agent) {
             return res.status(404).json({ error: 'Agent associated with token not found.' });
        }
        req.user=agent;
        const isServiceActive = (purchasedIdsString, targetId) => {
            // Return false immediately if the list is null, undefined, or an empty string
            if (!purchasedIdsString) {
                return false;
            }
            
            // Split the string, map to trim any whitespace, and check for inclusion
            return purchasedIdsString
                .split(',')
                .map(id => id.trim())
                .includes(targetId);
        };

        const agentInfoForClient = {
            agentId: agent.id,
            organization: agent.organization,
            admin: agent.privledge, 
            organizationName: agent.organizationName,
            permissions: agent.privledge,
            firstName: agent.first_name,
            lastName: agent.last_name,
            email: agent.email,
            agentCode: agent.agent_code,
            beta: agent.beta,
            //a2pOnly: false,
            status: agent.status,
            username: agent.username,
            phone: agent.phone,
            timezone: agent.timezone,
            tutorial: agent.tutorial,
            statsVisible: true,
            liveTransferOptIn: isServiceActive(agent.serviceIds, 'service_1'),
            recruitingModuleActive: isServiceActive(agent.serviceIds, 'd6b0ee81-e244-448e-a8fa-10533910ed92')
        };
        
        res.status(200).json({ agent: agentInfoForClient });
    } catch (error) {
         console.error('Token verification error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }*/
};

exports.logout = (req, res) => {
    // In a stateful system, you might blacklist the token here.
    res.status(200).json({ message: 'Logout successful. Please discard the token on the client side.' });
};
