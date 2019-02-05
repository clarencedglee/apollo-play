import { Query } from "react-apollo";
import React from "react";
import gql from "graphql-tag";

const query = gql`
  {
    writeQuery @client
  }
`;

export const defaultState = {
  writeQuery: "writeQuery init"
};

export const WriteQuery = () => (
  <Query query={query}>
    {({ loading, error, data, client }) => (
      <>
        {data.writeQuery}
        <button
          data-test="write-query"
          onClick={() => {
            client.writeQuery({
              data: { writeQuery: "writeQuery done" },
              query
            });
          }}
        >
          Update
        </button>
      </>
    )}
  </Query>
);
