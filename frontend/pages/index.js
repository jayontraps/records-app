import { getRecords } from '../queries'
import gql from 'graphql-tag';
import { Query } from "react-apollo";
import { Record } from '../components'
import styled from 'styled-components'

const RecordsList = styled.div`
  > div {
    margin-bottom: 10px;
  }
`

const vars = {
  orderBy: `date_DESC`  
}

const Home = props => {  
  return (
    <Query query={getRecords} variables={vars}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;
      const records = data.records
      return (
        <RecordsList>
          {records.map((rec, index) => {
            return (
              <Record 
                record={rec}
                key={`${rec.id}-${index}`} 
              />
          )})}
        </RecordsList>
      );
    }}
  </Query>
)};

export default Home;
