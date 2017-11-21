// @flow
import fs from 'fs';
import shortid from 'shortid';
import mkdirp from 'mkdirp';
import ApolloUploadServer from 'apollo-upload-server';

import config from '../../config';
import { checkAuth } from '../../utils/auth';
import { createPaymentSignature } from '../../utils/payment';

const uploadDir = './uploads';
mkdirp.sync(uploadDir);

const storeUpload = async ({ stream, filename }) => {
  const id = shortid.generate();
  const path = `${uploadDir}/${id}-${filename}`;

  return new Promise((resolve, reject) =>
    stream
      .pipe(fs.createWriteStream(path))
      .on('finish', () => resolve({ id, path }))
      .on('error', reject)
  );
};

const recordFile = file => null;

const processUpload = async upload => {
  const file = await upload;
  console.log(file);
  const { stream, filename, mimetype, encoding } = file;
  const { id, path } = await storeUpload({ stream, filename });
  return recordFile({ id, filename, mimetype, encoding, path });
};

export default () => ({
  Default: {
    Upload: ApolloUploadServer.GraphQLUpload,
  },
  Query: {
    uploads: () => null,
  },
  Mutation: {
    singleUpload: (obj, { file }) => processUpload(file),
    multipleUpload: (obj, { files }) => Promise.all(files.map(processUpload)),
  },
});
