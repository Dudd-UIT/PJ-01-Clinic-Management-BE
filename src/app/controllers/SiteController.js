const db = require('../../config/db'); // Import your database module

class SiteController {
    // GET /
    index(req, res, next) {
        res.send('RENDER INDEX');
    }
    
    // GET /search
    search(req, res) {
        res.send('RENDER SEARCH');
    }

    // GET /tiepdon
    async tiepdon(req, res) {
        try {
            const sqlQuery = 'SELECT * FROM S_CUSTOMER';
            const customers = await db.executeQuery(sqlQuery);

            res.send(customers);
        } catch (error) {
            console.error('Error querying database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new SiteController();
