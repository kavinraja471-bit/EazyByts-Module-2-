require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');

const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const stockRoutes = require('./routes/stocks');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB (Using Memory Server for zero-setup local demo)
let mongoServer;
const connectDB = async () => {
    try {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB (In-Memory) connected successfully!');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/stocks', stockRoutes);

app.get('/', (req, res) => {
    res.send('Stock Market Dashboard API');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
