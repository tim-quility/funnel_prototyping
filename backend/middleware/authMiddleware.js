const jwt = require('jsonwebtoken');
//const pool = require('../db'); 

const authMiddleware = async (req, res, next) => {
   /* try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
        if (!token) {
            return res.status(401).json({ error: 'No token provided, authorization denied.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const [rows] = await pool.execute(
            `SELECT 
                a.*,
                o.name as organizationName,
                o.id as organization
            FROM agent a
            JOIN organization o ON a.organization = o.id
            WHERE a.id = ?`,
            [decoded.id]
        );
        if (!rows || rows.length === 0) {
            return res.status(401).json({ error: 'User not found.' });
        }
        
        req.user = rows[0];
        next();
    } catch (err) {
        console.error('Auth Middleware Error:', err);
        return res.status(403).json({ error: 'Token is not valid.' });
    }*/
};

module.exports = authMiddleware;
