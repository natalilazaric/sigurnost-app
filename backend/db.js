const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://postgres:lozinka123@db.jhmpqblmtvgqrixtyhmg.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }  // Supabase zahtijeva SSL
});

module.exports = pool;
