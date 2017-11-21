// @flow
import * as React from 'react';
import { Form, Icon, Table, Grid, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import { removeFromCart } from '../redux/actions/shopActions';
import type { ShopActionInType } from '../redux/actions/shopActions';

class CheckoutPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      error: '',
    };
  }

  handleChange = (e, { name, value }) =>
    this.setState({
      [name]: value,
      error: '',
    });

  handleSubmit = async () => {
    try {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!this.state.email || !re.test(this.state.email)) {
        throw new Error('Необходимо ввести корректный email');
      }

      const user = await this.props.userFindOrCreate({
        variables: { email: this.state.email, name: this.state.name },
      });
      if (!user) {
        throw new Error(
          'Произошла ошибка при создании пользователя. Повторите позднее'
        );
      }
      const { data: { userFindOrCreate: { userId } } } = user;

      if (this.props.items.length === 0) {
        throw new Error('Не выбран ни один из курсов');
      }
      const resultOrderCreate = await this.props.ordersBulkCreate({
        variables: {
          userId,
          moduleIds: this.props.items.map(el => el.courseModuleId),
        },
      });
      const {
        data: { ordersBulkCreate: flagOrdersCreate },
      } = resultOrderCreate;
      if (!flagOrdersCreate) {
        throw new Error('Произошла ошибка при размещении заказа');
      }
      console.log(flagOrdersCreate);

      const resultTransaction = await this.props.transactionCreate({
        variables: { userId },
      });

      const { data: { transactionCreate: redirectUrl } } = resultTransaction;
      if (!redirectUrl || redirectUrl.length < 10) {
        throw new Error('Произошла ошибка при формировании платежа');
      }

      window.location = redirectUrl;

      this.setState({ email: '', name: '' });
      this.props.items.forEach(el =>
        this.props.removeFromCartHandler({
          id: el.courseModuleId,
          amount: el.price,
        })
      );
      // this.props.history.push(redirectUrl);
    } catch (e) {
      this.setState({ error: e.message });
    }
  };

  render() {
    const { name, email, error } = this.state;

    if (this.props.items.length === 0) {
      return (
        <Grid centered as="h2">
          Вы не выбрали ни одного курса
        </Grid>
      );
    }
    return (
      <Grid centered>
        {error ? (
          <Message negative>
            <Message.Header>Ошибка</Message.Header>
            <p>{error}</p>
          </Message>
        ) : (
          <h2>Оформление заказа:</h2>
        )}
        <Grid.Row>
          <Table basic="very" celled collapsing>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Курс</Table.HeaderCell>
                <Table.HeaderCell>Модуль</Table.HeaderCell>
                <Table.HeaderCell>Дата начала</Table.HeaderCell>
                <Table.HeaderCell>Стоимость</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.items.map(el => (
                <Table.Row key={`${el.courseModuleId}-row`}>
                  <Table.Cell>{el.Course.name}</Table.Cell>
                  <Table.Cell>{el.name}</Table.Cell>
                  <Table.Cell>{el.startDate}</Table.Cell>
                  <Table.Cell>${el.price}</Table.Cell>
                  <Table.Cell>
                    <Icon
                      link
                      name="remove"
                      onClick={this.props.removeFromCartHandler.bind(this, {
                        id: el.courseModuleId,
                        amount: el.price,
                      })}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell />
                <Table.HeaderCell />
                <Table.HeaderCell>${this.props.cartAmount}</Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Grid.Row>
        <Grid.Row>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Input
                placeholder="Name"
                name="name"
                value={name}
                onChange={this.handleChange}
              />
              <Form.Input
                placeholder="Email"
                name="email"
                value={email}
                onChange={this.handleChange}
              />
              <Form.Button primary content="Запросить счет для оплаты" />
            </Form.Group>
          </Form>
        </Grid.Row>
      </Grid>
    );
  }
}

const userFindOrCreate = gql`
  mutation UserFindOrCreate($email: String!, $name: String) {
    userFindOrCreate(email: $email, name: $name) {
      userId
    }
  }
`;

const ordersBulkCreate = gql`
  mutation OrdersBulkCreate($userId: Int!, $moduleIds: [Int!]!) {
    ordersBulkCreate(userId: $userId, moduleIds: $moduleIds)
  }
`;

const transactionCreate = gql`
  mutation TransactionCreate($userId: Int!) {
    transactionCreate(userId: $userId)
  }
`;

const getCourseModules = gql`
  {
    courseModuleGetAll {
      courseModuleId
      Course {
        name
        teacher {
          name
        }
      }
      name
      description
      price
      startDate
      weeks
      createdAt
      updatedAt
    }
  }
`;
const mapStateToProps = (state, ownProps) => {
  if (ownProps.data.loading) return { items: [] };
  return {
    items: ownProps.data.courseModuleGetAll.filter(
      el => state.shopReducer.cartItems.indexOf(el.courseModuleId) !== -1
    ),
    cartAmount: state.shopReducer.cartAmount,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  removeFromCartHandler: (product: ShopActionInType) => {
    dispatch(removeFromCart(product));
  },
});

export default compose(
  graphql(userFindOrCreate, { name: 'userFindOrCreate' }),
  graphql(ordersBulkCreate, { name: 'ordersBulkCreate' }),
  graphql(transactionCreate, { name: 'transactionCreate' }),
  graphql(getCourseModules),
  connect(mapStateToProps, mapDispatchToProps)
)(CheckoutPage);
