const { ApolloServer, gql } = require('apollo-server');
const { find, filter } = require('lodash');
const { customers, orders, products } = require('./data');

const typeDefs = gql`
  type Query {
    customers: [Customer]
    customer(id: ID!): Customer
  }

  type Customer {
    id: ID
    first_name: String
    last_name: String
    address: String
    orders: [Order]
    order(id: ID!): Order
  }

  type Order {
    id: ID
    amount: Float
    instructions: String
    products: [Product]
  }

  type Product {
    id: ID
    product_code: String
    quantity: Int
  }
`;

const resolvers = {
  Query: {
    customers: () => customers,
    customer: (parent, args, context, info) => {
      return find(customers, {id: Number(args.id)});
    }
  },
  Customer: {
    orders: (customer) => {
      return filter(orders, {customer_id: customer.id});
    },
    order: (parent, args, context, info) => {
      return find(orders, {id: Number(args.id), customer_id: parent.id});
    }
  },
  Order: {
    products: (order) => {
      return filter(products, {order_id: order.id});
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
