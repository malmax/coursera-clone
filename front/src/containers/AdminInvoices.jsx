import * as React from 'react';
import Dropzone from 'react-dropzone';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import xlsx from 'xlsx';
import { Button, Icon, Table, Dropdown, Input, List } from 'semantic-ui-react';
import Bluebird from 'bluebird';

class AdminInvoices extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: {},
      loading: false,
    };
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop = async ([file]) => {
    const rABS = false;
    const object = {};
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const reader = new FileReader();
    function readDataFile(e) {
      let data = e.target.result;
      if (!rABS) data = new Uint8Array(data);
      const workbook = xlsx.read(data, { type: rABS ? 'binary' : 'array' });
      // const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      workbook.Strings.forEach(el => {
        if (re.test(el.t)) {
          Object.assign(object, {
            [el.t]: {
              email: el.t,
              courses: [],
              discount: 0,
              sentInvoice: false,
              error: '',
            },
          });
        }
      });

      if (Object.keys(object).length) {
        this.setState({ users: object });
      }
    }

    reader.onload = readDataFile.bind(this);

    try {
      if (rABS) reader.readAsBinaryString(file);
      else reader.readAsArrayBuffer(file);
    } catch (e) {
      reader.readAsDataURL(file);
    }
    // upload file
    // const response = await this.props.mutate({ variables: { file } });
    // console.log(response);
  };

  clearEmails = emailSearch => {
    const newUsers = {};
    Object.keys(this.state.users)
      .filter(e => emailSearch !== undefined && e !== emailSearch)
      .forEach(email => {
        const obj = this.state.users[email];
        Object.assign(newUsers, { [email]: obj });
      });
    this.setState({ users: newUsers });
  };

  changeDiscount(emailSearch, discountIn) {
    if (this.state.loading || this.state.error) return;

    const discount = parseInt(discountIn, 10) || 0;
    if (discount > 100 || discount < 0) return;

    const newUsers = {};
    Object.keys(this.state.users).forEach(email => {
      const obj = this.state.users[email];
      if (email === emailSearch) {
        obj.discount = discount;
      }
      Object.assign(newUsers, { [email]: obj });
    });
    this.setState({ users: newUsers });
  }

  handleAddCourse = async (module, course) => {
    const moduleModified = Object.assign({}, module);
    moduleModified.name = `${module.name}(${course.name})`;

    const newUsers = {};
    Object.keys(this.state.users).forEach(email => {
      const obj = this.state.users[email];
      const mIds = obj.courses.map(e => e.courseModuleId);
      if (mIds.indexOf(module.courseModuleId) === -1)
        obj.courses.push(moduleModified);
      obj.error = '';
      Object.assign(newUsers, { [email]: obj });
    });
    this.setState({ users: newUsers });
  };

  removeCourse(emailSearch, courseModuleId) {
    if (this.state.loading || this.state.error) return;

    const newUsers = {};
    Object.keys(this.state.users).forEach(email => {
      const obj = this.state.users[email];
      if (email === emailSearch) {
        obj.courses = obj.courses.filter(
          m => m.courseModuleId !== courseModuleId
        );
      }
      Object.assign(newUsers, { [email]: obj });
    });
    this.setState({ users: newUsers });
  }

  sendInvoices = () =>
    Bluebird.each(Object.keys(this.state.users), email => {
      let userId;
      const user = this.state.users[email];

      return new Promise(res => this.setState({ loading: true }, res))
        .then(() =>
          this.props.userFindOrCreate({
            variables: { email: user.email, name: '' },
          })
        )
        .then(result => {
          if (!result) {
            throw new Error(
              'Произошла ошибка при создании пользователя. Повторите позднее'
            );
          }

          if (user.courses.length === 0) {
            throw new Error('Не выбран ни один из курсов');
          }
          userId = result.data.userFindOrCreate.userId;

          return this.props.ordersBulkCreate({
            variables: {
              userId,
              moduleIds: user.courses.map(el => el.courseModuleId),
              discount: user.discount,
            },
          });
        })
        .then(result => {
          const { data: { ordersBulkCreate: flagOrdersCreate } } = result;
          if (!flagOrdersCreate) {
            throw new Error('Произошла ошибка при размещении заказа');
          }
          console.log(flagOrdersCreate);
          return this.props.transactionCreate({
            variables: { userId },
          });
        })
        .then(result => {
          const { data: { transactionCreate: redirectUrl } } = result;
          if (!redirectUrl || redirectUrl.length < 10) {
            throw new Error('Произошла ошибка при формировании платежа');
          }

          const newUsers = Object.assign({}, this.state.users, {
            [user.email]: Object.assign({}, user, { sentInvoice: true }),
          });
          return new Promise(resolve =>
            this.setState({ users: newUsers, loading: false }, resolve)
          );
        })
        .catch(e => {
          const newUsers = Object.assign({}, this.state.users, {
            [user.email]: Object.assign({}, user, { error: e.message }),
          });
          return new Promise(resolve =>
            this.setState({ users: newUsers, loading: false }, resolve)
          );
        });
    });

  render() {
    if (!Object.keys(this.state.users).length) {
      return (
        <Dropzone
          onDrop={this.onDrop}
          accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv,.xls"
        >
          Drop file here
        </Dropzone>
      );
    }

    return (
      <div>
        <Button
          disabled={this.state.loading}
          onClick={() => this.clearEmails()}
        >
          <Icon name="remove" /> удалить список
        </Button>
        <Button.Group color="teal">
          <Dropdown
            text="добавить курс"
            icon="add square"
            floating
            labeled
            button
            color="teal"
            className="icon"
            disabled={this.state.loading}
          >
            <Dropdown.Menu>
              <Dropdown.Header content="Выберите курс, чтобы добавить его" />
              {!this.props.data.loading &&
                this.props.data.courseGetAll.map(course =>
                  course.modules.map(module => (
                    <Dropdown.Item
                      key={`add-course-${module.courseModuleId}`}
                      value={module.courseModuleId}
                      onClick={() => this.handleAddCourse(module, course)}
                    >
                      {`${course.name}`}
                      <small>({`с ${course.startAt}`})</small>
                      {`. Модуль: ${module.name} за $${module.price}`}
                    </Dropdown.Item>
                  ))
                )}
            </Dropdown.Menu>
          </Dropdown>
        </Button.Group>
        <Table celled structured>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Курсы к оплате</Table.HeaderCell>
              <Table.HeaderCell>Скидка</Table.HeaderCell>
              <Table.HeaderCell>Всего к оплате</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {Object.keys(this.state.users).map(email => {
              const user = this.state.users[email];
              return (
                <Table.Row
                  key={`user-${email}`}
                  positive={user.sentInvoice}
                  negative={user.error.length > 0}
                >
                  <Table.Cell>{email}</Table.Cell>

                  <Table.Cell>
                    {user.error.length > 0 ? (
                      user.error
                    ) : (
                      <List>
                        {user.courses.map(c => (
                          <List.Item key={`${c.courseModuleId}-list-key`}>
                            <List.Icon
                              name="remove"
                              link
                              onClick={() =>
                                this.removeCourse(email, c.courseModuleId)
                              }
                            />
                            <List.Content>{c.name}</List.Content>
                          </List.Item>
                        ))}
                      </List>
                    )}
                  </Table.Cell>

                  <Table.Cell>
                    <Input
                      label={{ basic: true, content: '%' }}
                      labelPosition="right"
                      placeholder="Введите размер скидки"
                      disabled={this.state.loading}
                      value={this.state.users[email].discount}
                      onChange={e => this.changeDiscount(email, e.target.value)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {user.courses.reduce(
                      (prev, current) => current.price + prev,
                      0
                    ) *
                      (1 - user.discount / 100)}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Icon
                      name="remove user"
                      link
                      onClick={() => this.clearEmails(email)}
                    />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="5">
                <Button
                  floated="right"
                  color="teal"
                  onClick={this.sendInvoices}
                  loading={this.state.loading}
                >
                  <Icon name="send" /> Отправить счета
                </Button>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    );
  }
}

// const uploadFile = gql`
//   mutation singleUpload($file: Upload!) {
//     singleUpload(file: $file) {
//       id
//       filename
//       encoding
//       mimetype
//       path
//     }
//   }
// `;

const getCourses = gql`
  {
    courseGetAll {
      courseId
      name
      modules {
        courseModuleId
        name
        price
        startDate
      }
      startAt
    }
  }
`;
const userFindOrCreate = gql`
  mutation UserFindOrCreate($email: String!, $name: String) {
    userFindOrCreate(email: $email, name: $name) {
      userId
    }
  }
`;

const ordersBulkCreate = gql`
  mutation OrdersBulkCreate(
    $userId: Int!
    $moduleIds: [Int!]!
    $discount: Int
  ) {
    ordersBulkCreate(
      userId: $userId
      moduleIds: $moduleIds
      discount: $discount
    )
  }
`;

const transactionCreate = gql`
  mutation TransactionCreate($userId: Int!) {
    transactionCreate(userId: $userId)
  }
`;

export default compose(
  graphql(userFindOrCreate, { name: 'userFindOrCreate' }),
  graphql(ordersBulkCreate, { name: 'ordersBulkCreate' }),
  graphql(transactionCreate, { name: 'transactionCreate' }),
  graphql(getCourses)
)(AdminInvoices);
