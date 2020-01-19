import React from 'react';
import Select from 'react-select';
import classes from './Selector.module.css';


const selector = props => {
    return (
        <Select 
            className={classes.Selector}
            isClearable={props.isClearable}
            styles={styles}
            isSearchable={props.searchable}
            value={props.selectorValue}
            // backspaceRemovesValue={props.backspace}
            // defaultValue={props.defaultValue}
            onChange={props.handler}
            options={props.options}
            theme={theme => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary25: '#e3e3e3',
                  primary50: '#00d885',
                  primary: '#00d885',
                },
              })}
        />
    )
}

export default selector;

const styles = {
    indicatorSeparator: (base, state) => {

    },
    menu: (base, state) => {
        return {
            ...base,
            backgroundColor: "#01ff9d",
            // opacity: ".9"
        }
    },
    dropdownIndicator: (base, state) => {
      return { ...base,
        color: 'white',
        "&:hover": {
        //   color: '#449999',
        }
      };
    },
    control: (base, state) => {
      return { ...base, 
        boxShadow: 'none',
        backgroundColor: 'none',
        borderStyle: 'solid', 
        borderColor: '#449999',
        borderWidth: '0px',
        borderBottom: '3px solid white',
        color: 'none', 
        "&:hover": { 
        }
      };
    },
    singleValue: (base, state) => {
      return {
        ...base,
        fontSize:'2rem',
        fontWeight:'600',
        color: 'white'
      }
    },
    input: (base, state) => {
      return {
        ...base,
        fontSize:'2rem',
        fontWeight:'900',
        color: 'white'
      }
    }
};
