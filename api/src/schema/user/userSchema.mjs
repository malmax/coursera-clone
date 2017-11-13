// @flow
import config from '../../config';

export default () => {
  type UserSchema = {
    typeDefs: Array<string>,
    query: Array<string>,
    mutation: Array<string>,
  };
  const userSchema: UserSchema = {
    typeDefs: [],
    query: [],
    mutation: [],
  };

  userSchema.typeDefs = [
    `type MutationAnswer {
      ok: Boolean!
      error: String
      success: String
    }`,
    `enum RoleType {
      ${config.user.roles.join('\n')}
    }`,
    `type User {
        userId: Int!
        email: String!
        name: String
        timezone: Int
        region: Int
        role: RoleType
        createdAt: String,
        updatedAt: String,
      }`,
  ];

  userSchema.query = [`userGet(userId: Int!): User`, `userGetAll: [User]`];

  userSchema.mutation = [
    `# в success приходит id
    userAddNew(
      email: String!, 
      password: String!,
      name: String,
      timezone: Int,
      role: RoleType!):
    MutationAnswer!`,
    `userChangePassword(userId: Int!, 
      newPassword: String!, 
      oldPassword: String!): 
    MutationAnswer!`,
    `userEdit(
      userId: Int!,
      email: String, 
      name: String,
      timezone: Int):
    MutationAnswer!`,
    `userDelete(userId: Int!): MutationAnswer!`,
    `userChangeRole(userId: Int!, newRole: RoleType!): MutationAnswer!`,
  ];

  return userSchema;
};
