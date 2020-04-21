import React, { Component, Fragment } from 'react'
import gql from 'graphql-tag'
import { Query } from "react-apollo";
import CreatableSelect from 'react-select/creatable';
import styled from 'styled-components';

const classesQuery = gql`
      query {
        classes {
          name
          id
        }
      }
    `
const StyledFrom = styled.form`
  .select__class {
    display: flex;
    label {
      margin-right: 10px;
    }
  }
`

const colourOptions = [
  { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
  { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
  { value: 'purple', label: 'Purple', color: '#5243AA' },
  { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
  { value: 'orange', label: 'Orange', color: '#FF8B00' },
  { value: 'yellow', label: 'Yellow', color: '#FFC400' },
  { value: 'green', label: 'Green', color: '#36B37E' },
  { value: 'forest', label: 'Forest', color: '#00875A' },
  { value: 'slate', label: 'Slate', color: '#253858' },
  { value: 'silver', label: 'Silver', color: '#666666' },
];

const flavourOptions = [
  { value: 'vanilla', label: 'Vanilla', rating: 'safe' },
  { value: 'chocolate', label: 'Chocolate', rating: 'good' },
  { value: 'strawberry', label: 'Strawberry', rating: 'wild' },
  { value: 'salted-caramel', label: 'Salted Caramel', rating: 'crazy' },
];

class CreatableSingle extends Component {
  handleChange = (newValue, actionMeta) => {
    console.group('Value Changed');
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };
  handleInputChange = (inputValue, actionMeta) => {
    console.group('Input Changed');
    console.log(inputValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };
  render() {
    return (
      <CreatableSelect
        isClearable
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        options={this.props.options}
      />
    );
  }
}

class CreateRecord extends Component {
  state = {
    class: 'bird',
    observer: '',
    species: '',
    location: '',
    date: '',
    dateTo: '',
    count: 0,
    notes: '',
    breeding_code: ''  
  }

  componentDidMount() {

  }

  getClasses = () => {
    
  }
      

  setClass = () => {

  }

  classChangeHandler = (e) => {
    this.setState({
      class: e.target.value
    })
  }

  render() {
    return (
      <div>
        <StyledFrom>
          <h3>Select class:</h3>         
          <Query query={classesQuery}>
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;
            const classes = data.classes
            return (
              <div className="select__class">
                {classes.map(cl => (       
                  <label key={cl.id}>
                    <input 
                      onChange={this.classChangeHandler} 
                      type="radio" 
                      name="class" 
                      value={cl.name}
                      checked={cl.name === this.state.class}                        
                      />
                    {cl.name}
                  </label>           
                ))}
              </div>
            );
          }}
        </Query>
          <h3>Location:</h3>
          <CreatableSingle options={colourOptions} />
          <h3>Observer:</h3>
          <CreatableSingle options={flavourOptions} />
        </StyledFrom>
      </div>
    )
  }
}

export default CreateRecord