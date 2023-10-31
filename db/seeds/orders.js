/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('orders').del()
  await knex('orders').insert([
    { product_name: "ayam geprek", quantity: "3", name: "Andreas Tan", telephone: "123456789012", address: "jalan china selatan no. 12" },
    { product_name: "paket ayam geprek", quantity: "5", name: "Faisal Baqir Tahmidi", telephone: "123456789034", address: "jerman barat no. 10" },
    { product_name: "ayam geprek", quantity: "1", name: "Muhammad Rizki Irvansyah", telephone: "123456789056", address: "jalan korea utara no.5 " },
    { product_name: "paket ayam geprek", quantity: "2", name: "Rezky Mauliana Zain", telephone: "123456789078", address: "spanyol tenggara no. 1" },
    { product_name: "ayam geprek", quantity: "6", name: "Ryan Febry", telephone: "123456789090", address: "rusia timur 1 no. 8" },
  ]);
};
