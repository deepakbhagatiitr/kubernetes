const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB Atlas connection string with SSL enabled
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB Atlas
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process if connection fails
});

// Define the Email model
const Email = mongoose.model('Email', {
    email: String,
});

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Endpoint to add a new email
app.post('/add-email', async (req, res) => {
    const { email } = req.body;
    try {
        const newEmail = new Email({ email });
        await newEmail.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error adding email:', error);
        res.status(500).send('Error adding email');
    }
});

// Endpoint to get all emails
app.get('/emails', async (req, res) => {
    try {
        const emails = await Email.find({});
        res.json(emails);
    } catch (error) {
        console.error('Error fetching emails:', error);
        res.status(500).send('Error fetching emails');
    }
});

// Exit endpoint
app.get('/exit', (req, res) => {
    res.send('Server stopped');
    process.exit(0);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
