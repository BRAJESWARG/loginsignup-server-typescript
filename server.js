const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Client } = require('pg');
require('dotenv').config();

const app = express();
const PORT = 8040;
const SECRET_KEY = 'your-secret-key';

app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection
const client = new Client({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
});

client
    .connect()
    .then(() => console.log('✅ Connected to PostgreSQL'))
    .catch((err) => console.error('❌ PostgreSQL connection error:', err));

// Create table if not exists
client.query(`
  CREATE TABLE IF NOT EXISTS LoginRegister (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100),
    encrypted_password VARCHAR(200)
  );
`);

// 📝 Register
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .json({ message: 'Username and password are required' });
    }

    try {
        // Check if username exists
        const existing = await client.query(
            'SELECT * FROM LoginRegister WHERE username = $1',
            [username]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert both plain (legacy) and encrypted (secure)
        await client.query(
            'INSERT INTO LoginRegister (username, password, encrypted_password) VALUES ($1, $2, $3)',
            [username, password, hashedPassword]
        );

        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        return res
            .status(201)
            .json({ message: 'Registration successful!', token });
    } catch (err) {
        console.error('❌ Registration error:', err.message);
        return res.status(500).json({ message: err.message });
    }
});

// 🔐 Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await client.query(
            'SELECT * FROM LoginRegister WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = result.rows[0];

        // If encrypted password exists, use bcrypt comparison
        if (user.encrypted_password) {
            const isMatch = await bcrypt.compare(password, user.encrypted_password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
        } else {
            // Fallback for old unencrypted accounts
            if (user.password !== password) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            // Optional: migrate old user to encrypted password
            const newHash = await bcrypt.hash(password, 10);
            await client.query(
                'UPDATE LoginRegister SET encrypted_password = $1 WHERE username = $2',
                [newHash, username]
            );
        }

        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ message: 'Login successful!', token });
    } catch (err) {
        console.error('❌ Login error:', err.message);
        return res.status(500).json({ message: err.message });
    }
});

// 🚀 Start server
app.listen(PORT, () => {
    console.log(`✅ Server running at: http://localhost:${PORT}`);
});
