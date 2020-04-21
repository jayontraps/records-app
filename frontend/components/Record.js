import React from 'react'
import styled from "styled-components"
// import { format } from 'date-fns';

const StyledRecord = styled.div`
    background-color: gainsboro;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > * {
        width: 12%;
    }
`

const Record = ({record}) => {
    const { 
      species: {
        name
      },
      location: {
        site
      },
      status,
      observer: {
        name: observerrName
      }, 
      count,
      date,
      notes,
      breeding_code
     } = record
    return (
    <StyledRecord>
      <div>{name}</div>
      <div>{observerrName}</div>
      <div>{status}</div>
      <div>{count}</div>
      {/* <div>{format(date,  'MMMM d, YYYY')}</div> */}
      <div>{site}</div>
      <div>{notes}</div>
      <div>{breeding_code}</div>
    </StyledRecord>
  )}

  export default Record