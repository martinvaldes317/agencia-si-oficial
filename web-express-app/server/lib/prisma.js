require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')

const pool = new Pool({
  host: 'localhost',
  port: 51214,
  user: 'postgres',
  password: 'postgres',
  database: 'template1',
  ssl: false,
})

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

module.exports = prisma
