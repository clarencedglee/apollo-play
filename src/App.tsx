import React, { Component } from "react";
import { ApolloProvider, Query } from "react-apollo";
import gql from "graphql-tag";

import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { withClientState } from "apollo-link-state";

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError, operation, forward }) => {
      // debugger;
      // fetch failure
      // message: "Failed to fetch"
      // stack: "TypeError: Failed to fetch"

      // non-gql endpoint
      // name: "ServerParseError"
      // statusCode: 404
      // stack: "ServerParseError: Unexpected token < in JSON at position 0↵    at Object.parse (<anonymous>)↵    at http://localhost:3000/static/js/0.chunk.js:6011:21"

      // bad query, e.g. missing field
      // [{
      //   location: []
      //   message: Cannot query field "foo" on type "Product".
      // }]

      // ignore graphql errors and let components handle it
      if (graphQLErrors) return;

      const message = networkError && networkError.message;
      // ||
      // (graphQLErrors &&
      //   graphQLErrors.reduce((error, out) => out + error, ""));

      client.writeQuery({
        query: APP_ERROR_QUERY,
        data: { appError: message }
      });
    }),
    withClientState({
      defaults: {
        appError: undefined
      },
      resolvers: {},
      cache
    }),
    new HttpLink({
      uri: "https://fakerql.com/graphql",
      // uri: "https://fakerbroken.comp/graphql",
      credentials: "same-origin"
    })
  ]),
  cache
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <AppError />
        <div className="ui grid">
          <div className="eight wide column">
            <One />
          </div>
          <div className="eight wide column">
            <Two />
          </div>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;

const APP_ERROR_QUERY = gql`
  {
    appError @client
  }
`;

const AppError = () => (
  <Query query={APP_ERROR_QUERY}>
    {({ loading, error, data }) => {
      if (loading) return "AppError component loading...";
      if (error) return "AppErrorComponent Error";
      return data && data.appError ? (
        <div className="ui message error">{data.appError}</div>
      ) : null;
    }}
  </Query>
);

const ONE_QUERY = gql`
  {
    allProducts {
      name
    }
  }
`;

const One = () => {
  const Heading = () => (
    <h3>
      This will fail if you Refetch with browser offline <br />
      (and show global error message)
    </h3>
  );
  return (
    <Query query={ONE_QUERY}>
      {({ loading, error, data, refetch }) => {
        if (loading) return <div className="ui message">Loading</div>;
        if (error) {
          // ApolloError
          // debugger;
          return (
            <>
              <Heading />
              <div className="ui message error">
                Error in one component: {error.message}
              </div>
            </>
          );
        }
        return (
          <>
            <Heading />
            <ul>
              {data.allProducts.slice(0, 5).map((item: any, key: any) => (
                <li {...{ key }}>{item.name}</li>
              ))}
            </ul>
            <button onClick={() => refetch()}>Refetch</button>
          </>
        );
      }}
    </Query>
  );
};

const TWO_QUERY = gql`
  {
    allTodos {
      titled
    }
  }
`;

const Two = () => {
  return (
    <Query query={TWO_QUERY}>
      {({ loading, error, data }) => {
        if (loading) return <div className="ui message">Loading</div>;
        if (error) {
          return (
            <>
              <h3>
                This will fail always due to a gql error <br />
                (malformed query)
              </h3>

              <div className="ui message error">
                Error in two component: {error.message}
              </div>
            </>
          );
        }
        return (
          <>
            <ul>
              {data.allTodos.slice(0, 5).map((item: any, key: any) => (
                <li {...{ key }}>{item.title}</li>
              ))}
            </ul>
          </>
        );
      }}
    </Query>
  );
};
