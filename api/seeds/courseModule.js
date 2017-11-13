exports.seed = function courseModules(knex, Promise) {
  // Deletes ALL existing entries
  return knex('course_modules')
    .del()
    .then(() =>
      // Inserts seed entries
      knex('course_modules').insert([
        {
          course_id: 1,
          name: '6 недель обучения',
          description: '',
          price: 300,
          teacher: 1,
        },
        {
          course_id: 1,
          name: 'Ревью кода',
          description: '',
          price: 50,
          teacher: 1,
        },
        {
          course_id: 2,
          name: 'Первый месяц обучения',
          description: '',
          price: 300,
          teacher: 1,
        },
        {
          course_id: 2,
          name: 'Второй месяц обучения',
          description: '',
          price: 300,
          teacher: 1,
        },
        {
          course_id: 2,
          name: 'Третий месяц обучения',
          description: '',
          price: 300,
          teacher: 1,
        },
        {
          course_id: 3,
          name: '5 недель обучения',
          description: '',
          price: 200,
          teacher: 1,
        },
        {
          course_id: 4,
          name: 'Первый месяц обучения',
          description: '',
          price: 250,
          teacher: 1,
        },
        {
          course_id: 4,
          name: 'Второй месяц обучения',
          description: '',
          price: 250,
          teacher: 1,
        },
        {
          course_id: 4,
          name: 'Ревью кода',
          description: '',
          price: 50,
          teacher: 1,
        },
        {
          course_id: 5,
          name: 'Первый месяц обучения',
          description: '',
          price: 250,
          teacher: 1,
        },
        {
          course_id: 5,
          name: 'Второй месяц обучения',
          description: '',
          price: 250,
          teacher: 1,
        },
        {
          course_id: 5,
          name: 'Ревью кода',
          description: '',
          price: 50,
          teacher: 1,
        },
      ])
    );
};
