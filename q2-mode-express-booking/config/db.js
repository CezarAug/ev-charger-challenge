const pgp = require('pg-promise')()
const DB_HOST = process.env.DB_HOST || 'localhost'
const db = pgp(`postgres://postgres:postgres@${DB_HOST}:5432/postgres`)

module.exports = db;