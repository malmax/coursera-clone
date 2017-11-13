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
        },
        {
          course_id: 2,
          name: 'Discovery',
          description: 'Курс для яйцеголовых',
        },
        {
          course_id: 3,
          name: 'Vue',
          description: 'Знакомство с фреймворком Vue',
        },
        {
          course_id: 4,
          name: 'Vue Advanced',
          description: 'Продвинутый курс по фреймворку Vue',
        },
        {
          course_id: 5,
          name: 'React Advanced',
          description: 'Продвинутый курс по React',
        },
      ])
    );
};
