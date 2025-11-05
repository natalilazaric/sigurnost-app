const express = require('express');
const router = express.Router();
const pool = require('../db');
const he = require('he');

let xssVulnerable = true;

router.post('/', async (req, res) => {
    const { content } = req.body;
    let storedContent = content;

    if (xssVulnerable) {
        storedContent = content;
    } else {
        storedContent = he.escape(content);
    }

    const insertResult = await pool.query(
        'INSERT INTO messages (content) VALUES ($1) RETURNING id, content',
        [storedContent]
    );
    res.send(insertResult.rows[0]);
});


router.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM messages');
    res.send(result.rows);
});

router.post('/toggle-xss', (req, res) => {
    xssVulnerable = req.body.enabled;
    res.send({ xssVulnerable });
});

module.exports = router;
