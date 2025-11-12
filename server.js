const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const bmwSalesRoutes = require('./routes/bmwSalesRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Prefix routes properly
app.use('/auth', authRoutes);
app.use('/api/bmw-sales', bmwSalesRoutes);

const PORT = process.env.PORT || 8040;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);

    // 🧭 Show all available routes
    if (app._router && app._router.stack) {
        console.log("📋 Available routes:");
        app._router.stack
            .filter(r => r.route)
            .forEach(r =>
                console.log(
                    Object.keys(r.route.methods).join(', ').toUpperCase(),
                    r.route.path
                )
            );
    } else {
        console.log("⚠️ No routes registered yet or router not initialized.");
    }
});
