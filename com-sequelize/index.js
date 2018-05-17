const Sequelize = require('sequelize')

const DB_NAME = 'exemplo_sequelize'
const DB_USER = 'postgres'
const DB_PASSWORD = 'baita_segredo'

const dbClient = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
  port: 5435
})

const Pessoa = dbClient.define('Pessoa', {
  nome: Sequelize.STRING,
  idade: Sequelize.INTEGER,
  peso: Sequelize.FLOAT
})

dbClient
  .sync()
  .then(() =>
    Pessoa.create({
      nome: 'Silva',
      idade: 30,
      peso: 78.3
    }))
  .then((silva) => console.log(silva.toJSON()))
  .catch(console.log)
