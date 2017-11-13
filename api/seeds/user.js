const bcrypt = require('bcrypt');

exports.seed = function user(knex, Promise) {
  // Deletes ALL existing entries
  const password = bcrypt.hashSync('1234', 10);
  return knex('users')
    .del()
    .then(() =>
      // Inserts seed entries
      knex('users').insert([
        {
          user_id: 1,
          email: 'admin@mail.ru',
          name: 'Admin1',
          password,
          refresh_token_secret: `${Date.now()}admin@mail.ru`,
          role: 'admin',
        },
        {
          user_id: 2,
          email: 'client1@mail.ru',
          name: 'Client1',
          password,
          refresh_token_secret: `${Date.now()}client1@mail.ru`,
          role: 'client',
        },
        {
          user_id: 3,
          email: 'client2@mail.ru',
          name: 'Client2',
          password,
          refresh_token_secret: `${Date.now()}client2@mail.ru`,
          role: 'client',
        },
      ])
    );
};
