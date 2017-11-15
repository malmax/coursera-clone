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
          start_date: knex.raw(
            `date(${Math.round(Date.UTC(2018, 0, 1) / 1000)},'unixepoch')`
          ),
          weeks: 6,
        },
        {
          course_id: 1,
          name: 'Ревью кода',
          description: '',
          price: 50,
        },
        {
          course_id: 2,
          name: 'Первый месяц обучения',
          description: '',
          price: 300,
          start_date: knex.raw(
            `date(${Math.round(Date.UTC(2017, 10, 1) / 1000)},'unixepoch')`
          ),
          weeks: 4,
        },
        {
          course_id: 2,
          name: 'Второй месяц обучения',
          description: '',
          price: 300,
          start_date: knex.raw(
            `date(${Math.round(Date.UTC(2017, 11, 1) / 1000)},'unixepoch')`
          ),
          weeks: 4,
        },
        {
          course_id: 2,
          name: 'Третий месяц обучения',
          description: '',
          price: 300,
          start_date: knex.raw(
            `date(${Math.round(Date.UTC(2018, 0, 1) / 1000)},'unixepoch')`
          ),
          weeks: 4,
        },
        {
          course_id: 3,
          name: '5 недель обучения',
          description: '',
          price: 200,
          start_date: knex.raw(
            `date(${Math.round(Date.UTC(2018, 0, 15) / 1000)},'unixepoch')`
          ),
          weeks: 5,
        },
        {
          course_id: 4,
          name: 'Первый месяц обучения',
          description: '',
          price: 250,
          start_date: knex.raw(
            `date(${Math.round(Date.UTC(2018, 2, 1) / 1000)},'unixepoch')`
          ),
          weeks: 4,
        },
        {
          course_id: 4,
          name: 'Второй месяц обучения',
          description: '',
          price: 250,
          start_date: knex.raw(
            `date(${Math.round(Date.UTC(2018, 3, 1) / 1000)},'unixepoch')`
          ),
          weeks: 4,
        },
        {
          course_id: 4,
          name: 'Ревью кода',
          description: '',
          price: 50,
        },
        {
          course_id: 5,
          name: 'Первый месяц обучения',
          description: '',
          price: 250,
          start_date: knex.raw(
            `date(${Math.round(Date.UTC(2018, 2, 15) / 1000)},'unixepoch')`
          ),
          weeks: 4,
        },
        {
          course_id: 5,
          name: 'Второй месяц обучения',
          description: '',
          price: 250,
          start_date: knex.raw(
            `date(${Math.round(Date.UTC(2018, 3, 15) / 1000)},'unixepoch')`
          ),
          weeks: 4,
        },
        {
          course_id: 5,
          name: 'Ревью кода',
          description: '',
          price: 50,
        },
      ])
    );
};
