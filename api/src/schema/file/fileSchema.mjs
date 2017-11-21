// @flow
export default () => {
  type FileSchema = {
    typeDefs: Array<string>,
    query: Array<string>,
    mutation: Array<string>,
  };
  const fileSchema: FileSchema = {
    typeDefs: [],
    query: [],
    mutation: [],
  };

  fileSchema.typeDefs = [
    `scalar Upload`,
    `type File {
        id: ID!
        path: String!
        filename: String!
        mimetype: String!
        encoding: String!
      }`,
  ];

  fileSchema.query = [`uploads: [File]`];

  fileSchema.mutation = [
    `singleUpload (file: Upload!): File!`,
    `multipleUpload (files: [Upload!]!): [File!]!`,
  ];

  return fileSchema;
};
