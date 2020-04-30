import gql from 'graphql-tag'

const GET_SPECIES = gql`
  query getSpecies($where: SpeciesWhereInput) {
    specieses(where: $where) {
      name
      id
    }
  } 

`

export default GET_SPECIES
