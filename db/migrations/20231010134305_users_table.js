/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.string("username").notNullable().unique();
    table.string("email").notNullable().unique();
    table.string("name").defaultTo("-")
    table.string("password").notNullable();
    table.string("photo").defaultTo("https://res.cloudinary.com/dg1vhnf5g/image/upload/v1698579470/users/WhatsApp_Image_2023-10-29_at_18.35.43_gthtcb.jpg")
    table.string("role").defaultTo("user")
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
