import React, { Component } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import {
  WriteData,
  WriteQuery,
  writeDataState,
  writeQueryState,
  IfCapabilities
} from "./experiments";

const client = new ApolloClient({
  uri: "http://localhost:7788/",
  clientState: {
    defaults: {
      ...writeDataState,
      ...writeQueryState
    },
    resolvers: {}
  }
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <WriteData />
        <WriteQuery />
        <IfCapabilities includes={["flight"]}>Super</IfCapabilities>
      </ApolloProvider>
    );
  }
}

export default App;
