exports.seed = function course(knex, Promise) {
  // Deletes ALL existing entries
  return knex('courses')
    .del()
    .then(() =>
      // Inserts seed entries
      knex('courses').insert([
        {
          course_id: 1,
          name: 'React',
          description: 'Базовый курс по React',
          start_at: knex.raw(
            `date(${Math.round(Date.UTC(2018, 0, 1) / 1000)},'unixepoch')`
          ),
        },
        {
          course_id: 2,
          name: 'Discovery',
          description: 'Курс для яйцеголовых',
          start_at: knex.raw(
            `date(${Math.round(Date.UTC(2017, 10, 1) / 1000)},'unixepoch')`
          ),
        },
        {
          course_id: 3,
          name: 'Vue',
          description: 'Знакомство с фреймворком Vue',
          start_at: knex.raw(
            `date(${Math.round(Date.UTC(2018, 0, 15) / 1000)},'unixepoch')`
          ),
        },
        {
          course_id: 4,
          name: 'Vue Advanced',
          description: 'Продвинутый курс по фреймворку Vue',
          start_at: knex.raw(
            `date(${Math.round(Date.UTC(2018, 2, 1) / 1000)},'unixepoch')`
          ),
        },
        {
          course_id: 5,
          name: 'React Advanced',
          description: 'Продвинутый курс по React',
          start_at: knex.raw(
            `date(${Math.round(Date.UTC(2018, 2, 15) / 1000)},'unixepoch')`
          ),
        },
      ])
    );
};
