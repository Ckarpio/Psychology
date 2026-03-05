const express = require('express');
const cors = require('cors');

const { initDb } = require('./db');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

initDb(); 
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API: http://localhost:${PORT}`));
