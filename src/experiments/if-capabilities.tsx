import { Query } from "react-apollo";
import React from "react";
import gql from "graphql-tag";

export const query = gql`
  {
    capabilities
  }
`;

export const defaultState = {
  writeData: "writeData init"
};

interface Props {
  includes: string[];
  queryDeduplication?: boolean;
}

export const IfCapabilities: React.SFC<Props> = ({
  includes,
  children,
  queryDeduplication = false
}) => (
  <Query query={query} context={{ queryDeduplication }}>
    {({ loading, error, data, client }) => (
      <>
        {data &&
          data.capabilities &&
          data.capabilities.some((r: any) => includes.indexOf(r) >= 0) &&
          children}
      </>
    )}
  </Query>
);
