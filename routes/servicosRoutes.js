const express = require('express')
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } 
});

//Ler Serviços
router.get('/servico', async(req, res) => {
    try{
        const result = await pool.query('SELECT id, nome, preco from servicos ORDER BY nome');
        res.json(result.rows);
    }catch(err){
        console.error('Erro servicos: ',err);
        res.status(500).json({error: 'Erro no servidor'});
    }
});

//Criar nova serviço
router.post('/servico', async(req,res) => {
    const {nome, preco} = req.body;
    if(!nome || preco == undefined){
        return res.status(400).json({error: 'Campos obrigatórios em falta'});
    }

    const precoNum = parseFloat(preco);

    if (isNaN(precoNum)) {
        return res.status(400).json({ error: 'Preço inválido' });
    }

    try {
        const query = 'INSERT INTO servicos(nome, preco) values ($1,$2) RETURNING id, nome, preco';
        const values =  [nome, precoNum];
        const result = await pool.query(query,values);

        return res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar serviço:', err);
        res.status(500).json({ error: 'Erro ao criar serviço' });
    }

})

module.exports = router;