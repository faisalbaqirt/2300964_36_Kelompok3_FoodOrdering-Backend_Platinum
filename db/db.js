const knex = require('knex');
const knexfile = require('../knexfile');

// Ubah lingkungan yang digunakan berdasarkan nilai NODE_ENV
const environment = process.env.NODE_ENV || 'development';
const db = knex(knexfile[environment]);

module.exports = db;
