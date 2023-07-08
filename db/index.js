const {Pool} = require('pg');
const { Client } = require('pg');

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

const pool = new Pool({
  max: 10,
  
  //DETAILS FOR DB CONNECTION
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

module.exports = pool;