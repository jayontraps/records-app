import gql from 'graphql-tag'

const GET_RECORDS = gql`
query getRecords(
  $where: RecordWhereInput, 
  $orderBy: RecordOrderByInput, 
  $skip: Int, 
  $after: String, 
  $before: String, 
  $first: Int, 
  $last: Int) {
    records (
      where: $where, 
      orderBy: $orderBy, 
      skip: $skip, 
      after: $after, 
      before: $before, 
      first: $first, 
      last: $last) {
        status
        species {
          name
        }
        location {
          site
        }
        observer {
          name
        }
        date
        count
        notes
        breeding_code
    }
  }

`

export default GET_RECORDS
