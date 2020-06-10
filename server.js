const express = require('express');
const connectDB = require('./config/db');

// initialize express
const app = express();

// connect to database
connectDB();

// init middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.json({ msg: `Welcome to the jungle` }));

// define routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

// env variable port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
