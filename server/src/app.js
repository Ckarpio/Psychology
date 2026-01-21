const express = require('express');

const { initDb } = require('./db');
const routes = require('./routes');

const app = express();
app.use(express.json());

initDb(); 
app.use('/api', routes);

app.listen(3000, () => console.log('API: http://localhost:3000'));
