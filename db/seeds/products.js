/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('products').del()
  await knex('products').insert([
    { name: 'paket ayam geprek', description: 'ayam geprek beserta nasi', price: 15000, image: 'https://res.cloudinary.com/dg1vhnf5g/image/upload/v1697878704/products/ayamgeprek1_n7o1rv.jpg' },
    { name: 'ayam geprek', description: 'ayam geprek', price: 12000, image: 'https://res.cloudinary.com/dg1vhnf5g/image/upload/v1697878717/products/ayamgeprek2_igudpv.jpg' }
  ]);
};
