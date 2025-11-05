const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs'); 

let insecureStorage = true;

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    let storedPassword;
    if (insecureStorage) {
        storedPassword = password;
    } else {
        const salt = await bcrypt.genSalt(10);
        storedPassword = await bcrypt.hash(password, salt);
    }

    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, storedPassword]);
    res.send({ success: true });
});

router.get('/', async (req, res) => {
    const result = await pool.query('SELECT id, username, password FROM users');
    res.send(result.rows);
});

router.post('/toggle-storage', (req, res) => {
    insecureStorage = req.body.enabled;
    res.send({ insecureStorage });
});

module.exports = router;
