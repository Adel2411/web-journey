const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const router = require('./routes/notes.js');

const app = express();

dotenv.config();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.get('/', (req, res) => {
    res.send('Welcome to the Collaborative Note-Taking API');
});

app.use('/', router)

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});