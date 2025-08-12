const express = require('express');
const path = require('path');
const cors = require('cors');
const {Pool} = require('pg');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false}
});

const servicosRoutes = require('./routes/servicosRoutes');
app.use('/api', servicosRoutes);

const marcacoesRoutes = require('./routes/marcacoesRoutes');
app.use('/api', marcacoesRoutes);

const authRoutes = require('./routes/auth');
app.use ('/api', authRoutes)

// Serve os ficheiros estáticos (frontend)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/teste', async(req, res) =>{
  try{
    const result = await pool.query('SELECT NOW()');
    res.json({ horaServidor: result.rows[0].now });
  }
  catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get('*',(req, res) => {
  res.sendFile(path.join(__dirname,'public', 'index.html'))
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});


