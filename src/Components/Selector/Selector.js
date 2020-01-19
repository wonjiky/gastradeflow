import React from 'react';
import Select from 'react-select';
import classes from './Selector.module.css';


const selector = props => {
    return (
        <Select 
            // className={classes.Selector}
            isClearable={props.isClearable}
            // styles={styled}
            isSearchable={props.searchable}
            value={props.selectorValue}
            // backspaceRemovesValue={props.backspace}
            // defaultValue={props.defaultValue}
            onChange={props.handler}
            options={props.options}
            // theme={theme => ({
            // ...theme,
            // borderRadius: 0,
            // colors: {
            //     ...theme.colors,
            //     primary25: '#e3e3e3',
            //     primary50: '#449999',
            //     primary: '#449999',
            // },
            // })}
        />
    )
}

export default selector;