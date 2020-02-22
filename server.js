// configurando o servidor
const express = require('express');

const server = express();

// configurar o servidor para apresentar arquivos extras
server.use(express.static('public'));

// habilitar body do furmulário
server.use(express.urlencoded({ extended: true }));

// configuar a conexão com o banco de dados
const pool = require('pg').Pool;
const db = new pool({
  user: 'postgres',
  possword: 'docker',
  host: 'localhost',
  port: 5432,
  database: 'doe'
});

// configurando a template engine
const nunjucks = require('nunjucks');
nunjucks.configure('./', {
  express: server,
  noCache: true,
});

// configurar a apresentação da página
server.get('/', (req, res) => {
  // [];

  db.query("SELECT * FROM donors", (err, result) => {
    if (err) {
      return res.json({ error: 'Erro de banco de dados' });

    }

    const donors = result.rows;
    return res.render('index.html', { donors });
  });
});

server.post('/', (req, res) => {
  const { name, email, blood } = req.body;

  if (!name || !email || !blood) {
    return res.json({ error: 'Todos os campos são obrigatórios' });
  }

  const query = `
    INSERT INTO donors ("name", "email", "blood") 
    VALUES ($1, $2, $3)`;

  const values = [name, email, blood];

  db.query(query, values, (err) => {
    if (err) {
      return res.json({ error: 'Erro no banco de dados' });
    }

    return res.redirect('/');
  });
});

// ligar o servidor e permitir o acesso na porta 3000
server.listen(3000);