const express = require('express');
const router = express.Router();
const connection = require('../database/connection');

const cpfValidator = require('cpf-cnpj-validator').cpf;
const emailValidator = require('email-validator');

// Rota para exibir a lista de usuários
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM usuarios';

    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    });
});

// Rota para exibir informações de um usuário específico
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM usuarios WHERE id = ${id}`
  connection.query(sql, function (error, results, fields){
      if (error) throw error;
      
      // Verificar se há resultados correspondentes e enviar a resposta apropriada
      if (results.length) {
          res.status(200).send(results);
      } else {
          res.status(404).send('Usuário não encontrado');
      }
  });
});

// Rota para adicionar um novo usuário
router.post('/add', (req, res) => {
    const { nome, email, nascimento, sexo, cpf, senha } = req.body;
    if (!cpfValidator.isValid(cpf)) {
      console.log('CPF inválido');
      return res.status(400).send('CPF inválido');
    }
    
    if (!emailValidator.validate(email)) {
      console.log('E-mail inválido');
      return res.status(400).send('E-mail inválido');
    }

    const sql = `SELECT COUNT(*) FROM usuarios WHERE cpf = ${cpf} OR email = '${email}' LIMIT 1`;
    connection.query(sql, (error, results, fields) => {
      if (error) throw error;
  
      const count = results[0]['COUNT(*)'];
      if (count > 0) {
        console.log('Já existe um registro com o CPF ou e-mail informados.');
        res.send('Já existe um registro com o CPF ou e-mail informados.');
      } else {
        const sqlinsert = `INSERT INTO usuarios (nome, email, nascimento, sexo, cpf, senha)
                           VALUES ('${nome}', '${email}', '${nascimento}', '${sexo}', '${cpf}', '${senha}')`;
        connection.query(sqlinsert, (error, results, fields) => {
          if (error) throw error;
  
          console.log('Usuário inserido com sucesso');
          res.status(200).send('Inserido com sucesso');
        });
      }
    });
  });

  //Rota para atualizar um Usuario
  router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { nome, email, nascimento, sexo, cpf, senha } = req.body;
    
    if (!cpfValidator.isValid(cpf)) {
      console.log('CPF inválido');
      return res.status(400).send('CPF inválido');
    }
  
    if (!emailValidator.validate(email)) {
      console.log('E-mail inválido');
      return res.status(400).send('E-mail inválido');
    }
  
    const sqlSelect = `SELECT COUNT(*) FROM usuarios WHERE id = ${id} LIMIT 1`;
    connection.query(sqlSelect, (error, results, fields) => {
      if (error) throw error;
  
      const count = results[0]['COUNT(*)'];
      if (count === 0) {
        console.log('Usuário não encontrado');
        res.send('Usuário não encontrado');
      } else {
        const sqlCheckEmailCpf = `SELECT COUNT(*) FROM usuarios WHERE (cpf = '${cpf}' OR email = '${email}') AND id != ${id} LIMIT 1`;
        connection.query(sqlCheckEmailCpf, (error, results, fields) => {
          if (error) throw error;
  
          const count = results[0]['COUNT(*)'];
          if (count > 0) {
            console.log('E-mail ou CPF já cadastrados em outro usuário');
            res.status(400).send('E-mail ou CPF já cadastrados em outro usuário');
          } else {
            const sqlUpdate = `UPDATE usuarios SET nome = '${nome}', email = '${email}', nascimento = '${nascimento}', sexo = '${sexo}', cpf = '${cpf}', senha = '${senha}' WHERE id = ${id}`;
            connection.query(sqlUpdate, (error, results, fields) => {
              if (error) throw error;
  
              console.log('Usuário atualizado com sucesso');
              res.status(200).send('Atualizado com sucesso');
            });
          }
        });
      }
    });
  });

  //Rota para deletar um usuario
  router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
  
    const sqlSelect = `SELECT COUNT(*) FROM usuarios WHERE id = ${id} LIMIT 1`;
    connection.query(sqlSelect, (error, results, fields) => {
      if (error) throw error;
  
      const count = results[0]['COUNT(*)'];
      if (count === 0) {
        console.log('Usuário não encontrado');
        res.send('Usuário não encontrado');
      } else {
        const sqlDelete = `DELETE FROM usuarios WHERE id = ${id}`;
        connection.query(sqlDelete, (error, results, fields) => {
          if (error) throw error;
  
          console.log('Usuário deletado com sucesso');
          res.status(200).send('Deletado com sucesso');
        });
      }
    });
  });

module.exports = router;