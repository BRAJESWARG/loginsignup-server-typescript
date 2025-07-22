const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'your-secret-key';
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(cors());
app.use(bodyParser.json());

// Utility: Read users from file
async function getUsers() {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
}

// Utility: Save users to file
async function saveUsers(users) {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const users = await getUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ message: 'Login successful!', token });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Register Route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const users = await getUsers();
        const existingUser = users.find(u => u.username === username);

        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const newUser = { username, password };
        users.push(newUser);
        await saveUsers(users);

        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        return res.status(201).json({ message: 'Registration successful!', token });
    } catch (err) {
        console.error('Registration error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running at: http://localhost:${PORT}`);
});
