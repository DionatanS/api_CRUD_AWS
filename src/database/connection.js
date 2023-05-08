const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USERDB,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

connection.connect((error) => {
  if (error) {
    console.error('Erro ao conectar ao banco de dados: ', error);
  } else {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  }
});

module.exports = connection;