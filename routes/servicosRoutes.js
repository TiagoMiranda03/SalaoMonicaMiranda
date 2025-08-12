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

//Atualizar serviços
router.put('/servico/:id', async (req,res) =>{
    const { id } = req.params;
    const { nome, preco } = req.body;

    if (!nome || preco == undefined || isNaN(preco)) {
        return res.status(400).json({ error: 'Campos inválidos' });
    }

    try {
        const query = 'UPDATE servicos SET nome=$1, preco=$2 WHERE id=$3 RETURNING id, nome, preco';
        const values = [nome, preco, id];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Serviço não encontrado' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar serviço:', err);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

//Apagar Serviço
router.delete('/servico/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM servicos WHERE id=$1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }
    res.status(204).end();
  } catch (err) {
    console.error('Erro ao apagar serviço:', err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

module.exports = router;