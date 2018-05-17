const {Client} = require('pg')

const DROP_TABLE_PESSOA = `DROP TABLE IF EXISTS Pessoa`

const CREATE_TABLE_PESSOA = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE Pessoa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome varchar(200) NOT NULL,
  idade integer,
  peso float
)`

const INSERT_INTO_PESSOA = `INSERT INTO Pessoa (nome, idade, peso) VALUES ('Silva', 30, 78.3)`

const SELECT_PESSOA = `SELECT id, nome, idade, peso FROM Pessoa`

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'exemplo_driver',
  password: 'baita_segredo',
  port: 5432
})

client.connect()

// Muito prazer, Callback Hell
client.query(DROP_TABLE_PESSOA, (error, result) => {
  if (error) {
    console.log('Erro ao deletar tabela Pessoa:', error.message)
    client.end()
  } else {
    client.query(CREATE_TABLE_PESSOA, (error, result) => {
      if (error) {
        console.log('Erro ao criar tabela Pessoa:', error.message)
        client.end()
      } else {
        client.query(INSERT_INTO_PESSOA, (error, result) => {
          if (error) {
            console.log('Erro ao inserir Pessoa:', error.message)
            client.end()
          } else {
            client.query(SELECT_PESSOA, (error, result) => {
              if (error) {
                console.log('Erro ao selecionar Pessoa:', error.message)
              } else {
                console.log(result.rows.length)
                console.log(result.rows[0])
                client.end()
              }
            })
          }
        })
      }
    })
  }
})

