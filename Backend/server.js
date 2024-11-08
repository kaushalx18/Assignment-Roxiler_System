// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

// Create an instance of Express
const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB using the URI from the .env file
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define the schema for transactions
const transactionSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    dateOfSale: Date,
    category: String,
});

// Create a model for transactions
const Transaction = mongoose.model('Transaction', transactionSchema);

// API to initialize the database
app.post('/api/initialize', async (req, res) => {
    try {
        // Fetch data from the third-party API
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        // Insert the fetched data into the MongoDB collection
        await Transaction.insertMany(response.data);
        res.status(200).send('Database initialized');
    } catch (error) {
        res.status(500).send('Error initializing database');
    }
});

// API to list all transactions with search and pagination
app.get('/api/transactions', async (req, res) => {
    const { page = 1, perPage = 10, search = '', month } = req.query;

    // Create a date range for the selected month
    const startDate = new Date(`2023-${month}-01`);
    const endDate = new Date(`2023-${month + 1}-01`);

    const query = {
        dateOfSale: { $gte: startDate, $lt: endDate },
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: { $regex: search } },
        ],
    };

    const transactions = await Transaction.find(query)
        .skip((page - 1) * perPage)
        .limit(perPage);
    const total = await Transaction.countDocuments(query);
    res.json({ transactions, total });
});

// API for statistics
app.get('/api/statistics', async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(`2023-${month}-01`);
    const endDate = new Date(`2023-${month + 1}-01`);

    const soldItems = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lt: endDate } });
    const totalSales = await Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
        { $group: { _id: null, total: { $sum: '$price' } } },
    ]);
    const totalNotSold = await Transaction.countDocuments({ dateOfSale: { $lt: startDate } });

    res.json({
        totalSales: totalSales[0]?.total || 0,
        soldItems,
        totalNotSold,
    });
});

// API for bar chart data
app.get('/api/bar-chart', async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(`2023-${month}-01`);
    const endDate = new Date(`2023-${month + 1}-01`);

    const priceRanges = await Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
        {
            $bucket: {
                groupBy: "$price",
                boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
                default: "901-above",
                output: {
                    count: { $sum: 1 }
                }
            }
        }
    ]);

    res.json(priceRanges);
});

// API for pie chart data
app.get('/api/pie-chart', async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(`2023-${month}-01`);
    const endDate = new Date(`2023-${month + 1}-01`);

    const categories = await Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.json(categories);
});

// Combined API to fetch data from all three APIs
app.get('/api/combined', async (req, res) => {
    const { month } = req.query;
    const statistics = await getStatistics(month);
    const barChartData = await getBarChartData(month);
    const pieChartData = await getPieChartData(month);
    
    res.json({ statistics, barChartData, pieChartData });
});

// Helper functions to fetch data for combined API
async function getStatistics(month) {
    const startDate = new Date(`2023-${month}-01`);
    const endDate = new Date(`2023-${month + 1}-01`);

    const soldItems = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lt: endDate } });
    const totalSales = await Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
        { $group: { _id: null, total: { $sum: '$price' } } },
    ]);
    const totalNotSold = await Transaction.countDocuments({ dateOfSale: { $lt: startDate } });

    return {
        totalSales: totalSales[0]?.total || 0,
        soldItems,
        totalNotSold,
    };
}

async function getBarChartData(month) {
    const startDate = new Date(`2023-${month}-01`);
    const endDate = new Date(`2023-${month + 1}-01`);

    return await Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
        {
            $bucket: {
                groupBy: "$price",
                boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
                default: "901-above",
                output: {
                    count: { $sum: 1 }
                }
            }
        }
    ]);
}

async function getPieChartData(month) {
    const startDate = new Date(`2023-${month}-01`);
    const endDate = new Date(`2023-${month + 1}-01`);

    return await Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
}

// Start the server
const PORT = process.env.PORT || 5000; // You can set a port in your .env file as well
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});