const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { route } = require('./auth');
require('dotenv').config();
const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } 
});

//Ler marcações
router.get('/marcacoes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.id, m.nome_cliente, s.nome AS servico_nome, m.data, m.hora
        FROM marcacoes m
        JOIN servicos s ON m.servico_id = s.id
        WHERE (m.data > CURRENT_DATE) OR (m.data = CURRENT_DATE AND m.hora >= CURRENT_TIME)
        ORDER BY m.data, m.hora
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar marcacoes:', err);
    res.status(500).json({ error: 'Erro ao buscar marcações' });
  }
});


//criar nova marcação
router.post('/marcacoes', async(req,res) =>{
    const {nome_cliente, servico_id, data, hora, descricao} = req.body;
    if(!nome_cliente || !servico_id || !data || !hora){
        return res.status(400).json({error: 'Campos obrigatórios em falta'});
    }
    try{
        const query = 'INSERT INTO marcacoes(nome_cliente, servico_id, data, hora, descricao) values ($1,$2,$3,$4,$5) RETURNING id, nome_cliente, servico_id, data, hora, descricao';
        const values = [nome_cliente,servico_id,data,hora,descricao];
        const result = await pool.query(query,values);

        const novaMarcacao = result.rows[0];

        const servicoRes = await pool.query('SELECT nome FROM servicos WHERE id = $1', [novaMarcacao.servico_id]);
        const servicoNome = servicoRes.rows[0]?.nome || 'Serviço desconhecido';

        res.status(201).json({
            ...novaMarcacao,
            servico_nome: servicoNome
        });
        
    }catch(err){
        console.error('Erro marcacoes POST:', err);
        res.status(500).json({ error: 'Erro ao criar marcação' });
    }
});

module.exports = router;