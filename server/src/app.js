const express = require('express');
const cors = require('cors');

const { initDb } = require('./db');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

initDb(); 
app.use('/api', routes);

app.listen(3000, () => console.log('API: http://localhost:3000'));
