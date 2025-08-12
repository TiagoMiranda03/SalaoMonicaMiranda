const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

//Login
router.post('/login',async (req,res) =>{
    const{email, password} = req.body;

    try{
        const result = await pool.query('SELECT * FROM UTILIZADOR WHERE email = $1', [email]);
        if (result.rows.length === 0){
            return res.status(401).json({error:'Credenciais Inválidas'});
        }

        const user = result.rows[0];

        //Comparar passwords
        console.log('User from DB:', user);
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Aqui podes gerar um token JWT ou outra coisa para autenticar sessões
        res.json({ message: 'Login bem-sucedido', userId: user.id });
        console.log('Login request:', email);


    }catch (err) {
        res.status(500).json({ error: 'Erro do servidor' });
        console.error('Erro no login:', err);
  }
});

module.exports = router;