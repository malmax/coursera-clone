// @flow

export default () => {
  type CourseSchema = {
    typeDefs: Array<string>,
    query: Array<string>,
    mutation: Array<string>,
  };
  const courseSchema: CourseSchema = {
    typeDefs: [],
    query: [],
    mutation: [],
  };

  courseSchema.typeDefs = [
    `type Course {
        courseId: Int!
        name: String!
        description: String
        modules: [CourseModule!]
        createdAt: String
        updatedAt: String
      }`,
  ];

  courseSchema.query = [
    `courseGet(courseId: Int!): Course`,
    `courseGetAll: [Course]`,
  ];

  courseSchema.mutation = [
    `# в success приходит id
    courseAddNew(
        name: String!,
        description: String):
    MutationAnswer!`,
    `courseEdit(
        courseId: Int!,
        name: String,
        description: String):
    MutationAnswer!`,
    `courseDelete(courseId: Int!): MutationAnswer!`,
  ];

  return courseSchema;
};
