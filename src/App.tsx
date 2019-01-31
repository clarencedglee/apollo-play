import React, { Component } from "react";
import "./App.css";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({});

class App extends Component {
  render() {
    return <ApolloProvider client={client}>Hello</ApolloProvider>;
  }
}

export default App;
