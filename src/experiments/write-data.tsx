import { Query } from "react-apollo";
import React from "react";
import gql from "graphql-tag";

const query = gql`
  {
    writeData @client
  }
`;

export const defaultState = {
  writeData: "writeData init"
};

export const WriteData = () => (
  <Query query={query}>
    {({ loading, error, data, client }) => (
      <>
        {data.writeData}
        <button
          data-test="write-data"
          onClick={() => {
            client.writeData({ data: { writeData: "writeData done" } });
          }}
        >
          Update
        </button>
      </>
    )}
  </Query>
);
