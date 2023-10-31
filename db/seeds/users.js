/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const bcrypt = require('bcrypt')

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

exports.seed = async function(knex) {
  const passAdmin1 = await hashPassword('123admin1');
  const passAdmin2 = await hashPassword('123admin2');
  const passAndreas = await hashPassword('123andreas');
  const passFaisal = await hashPassword('123faisal');
  const passRizki = await hashPassword('123rizki');
  const passRezky = await hashPassword('123rezky');
  const passRyan = await hashPassword('123ryan');
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    { username: 'admin1', email: 'admin1@mangiyok.com', name: 'Administrator 1', password: passAdmin1, photo: 'https://res.cloudinary.com/dg1vhnf5g/image/upload/v1698579929/users/administrator_z6nqjn.jpg', role: 'admin' },
    { username: 'admin2', email: 'admin2@mangiyok.com', name: 'Administrator 2', password: passAdmin2, photo: 'https://res.cloudinary.com/dg1vhnf5g/image/upload/v1698579929/users/administrator_z6nqjn.jpg', role: 'admin' },
    { username: 'andreas', email: 'andreas@mangiyok.com', name: 'Andreas Tan', password: passAndreas },
    { username: 'faisal', email: 'faisal@mangiyok.com', name: 'Faisal Baqir Tahmidi', password: passFaisal },
    { username: 'rizki', email: 'rizki@mangiyok.com', name: 'Muhammad Rizki Irvansyah', password: passRizki },
    { username: 'rezky', email: 'rezky@mangiyok.com', name: 'Rezky Mauliana Zain', password: passRezky },
    { username: 'ryan', email: 'ryan@mangiyok.com', name: 'Ryan Febry', password: passRyan }
  ]);
};
