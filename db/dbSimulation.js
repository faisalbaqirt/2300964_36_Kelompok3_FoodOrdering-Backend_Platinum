const knex = require('knex');
const knexfile = require('../knexfile');

const dbSimulation = knex(knexfile.simulation);

module.exports = dbSimulation;
