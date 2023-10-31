/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('orders', function(table) {
    table.increments('id').primary();
    table.timestamps(true, true);
    table.integer('product_id').unsigned().references('id').inTable('products');
    table.string('product_name', 255).unsigned().references('name').inTable('products');
    table.decimal('quantity', 20);
    table.decimal('total_amount', 20);
    table.string('name', 255).notNullable();
    table.string('telephone', 20);
    table.string('address', 255);
    table.string('status').defaultTo('Belum Bayar')
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('orders');
};
