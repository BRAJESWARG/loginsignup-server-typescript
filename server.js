const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const bmwSalesRoutes = require('./routes/bmwSalesRoutes'); // ✅ Add this

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/', authRoutes);
app.use('/api/bmw-sales', bmwSalesRoutes); // ✅ Add this line

const PORT = process.env.PORT || 8040;
app.listen(PORT, () => console.log(`🚗 Server running on port ${PORT}`));
