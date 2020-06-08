const express = require('express');

// initialize express
const app = express();

app.get('/', (req, res) => res.json({ msg: `Welcome to the jungle` }));

// define routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

// env variable port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
