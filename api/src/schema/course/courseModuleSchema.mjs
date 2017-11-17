// @flow

export default () => {
  type CourseModuleSchema = {
    typeDefs: Array<string>,
    query: Array<string>,
    mutation: Array<string>,
  };
  const courseModuleSchema: CourseModuleSchema = {
    typeDefs: [],
    query: [],
    mutation: [],
  };

  courseModuleSchema.typeDefs = [
    `type CourseModule {
        courseModuleId: Int!
        courseId: Int!
        Course: Course
        name: String!
        description: String
        # in dollars
        price: Int
        startDate: String
        # length in weeks
        weeks: Int
        createdAt: String
        updatedAt: String
      }`,
  ];

  courseModuleSchema.query = [
    `courseGetModules(courseId: Int!): [CourseModule!]`,
    `courseModuleGetAll: [CourseModule!]`,
  ];

  courseModuleSchema.mutation = [
    `# в success приходит id
    courseModuleAddNew(
        courseId: Int!,
        name: String!,
        description: String,
        price: Int,
        startDate: String,
        endDate: String,
        payUntil: String,
        teacher: Int):
    MutationAnswer!`,
    `courseModuleDelete(courseModuleId: Int!): MutationAnswer!`,
  ];

  return courseModuleSchema;
};
