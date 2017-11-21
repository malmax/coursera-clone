import * as React from 'react';
import Dropzone from 'react-dropzone';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

const FileInput = props => (
  <div>
    <input type="file" {...props} />
  </div>
);

class AdminInvoices extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }
  onDrop = async ([file]) => {
    const response = await this.props.mutate({ variables: { file } });
    console.log(response);
  };

  handleChange = ({ target }) => {
    // console.log(target.files);
    // target.validity.valid &&
    //   this.props.mutate({
    //     variables: { file: target.files[0] },
    //     // update: (proxy, { data: { singleUpload } }) => {
    //     //   const data = proxy.readQuery({ query: uploadsQuery })
    //     //   data.uploads.push(singleUpload)
    //     //   proxy.writeQuery({ query: uploadsQuery, data })
    //     // }
    //   });
  };

  render() {
    // return <FileInput required onChange={this.handleChange} />;
    return <Dropzone onDrop={this.onDrop}>Drop file here</Dropzone>;
  }
}

const uploadFile = gql`
  mutation singleUpload($file: Upload!) {
    singleUpload(file: $file) {
      id
      filename
      encoding
      mimetype
      path
    }
  }
`;

const uploads = gql`
  query uploads {
    uploads {
      id
      filename
      encoding
      mimetype
      path
    }
  }
`;

export default compose(graphql(uploadFile), graphql(uploads))(AdminInvoices);
