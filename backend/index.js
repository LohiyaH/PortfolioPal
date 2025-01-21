const express = require('express');
const cors = require('cors'); 
const portfolioRoutes = require('./routes/portfolio');

// Initialize database connection
const dbPromise = require('./models/db');
dbPromise.then(() => console.log('Database connection initialized'));

const app = express();
app.use(cors());
app.use(express.json());
 
app.use('/api/portfolio', portfolioRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));