const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../config/db');
require('dotenv').config();

const register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(400).json({ message: 'Username and password required' });

    try {
        const existing = await client.query(
            'SELECT * FROM Credentials WHERE username = $1',

            [username]
        );
        if (existing.rows.length > 0)
            return res.status(409).json({ message: 'Username already exists' });

        const hashed = await bcrypt.hash(password, 10);

        await client.query(
            'INSERT INTO Credentials (username, password, encrypted_password) VALUES ($1, $2, $3)',
            [username, password, hashed]
        );

        const token = jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(201).json({ message: 'Registration successful', token });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await client.query('SELECT * FROM Credentials WHERE username = $1', [username]);
        if (user.rows.length === 0)
            return res.status(401).json({ message: 'Invalid username or password' });

        const valid = await bcrypt.compare(password, user.rows[0].encrypted_password);
        if (!valid)
            return res.status(401).json({ message: 'Invalid username or password' });

        const token = jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login };
