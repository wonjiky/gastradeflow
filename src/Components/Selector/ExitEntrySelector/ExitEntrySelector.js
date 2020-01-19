import React from 'react';
import classes from './ExitEntrySelector.module.css';


const exitEntrySelector = props => {

    return (
        <form className={classes.Selector}>
            <input type="radio" value="entry" checked={props.value === "entry"}
                onChange={props.exitEntryHandler} /> Entry
            <input type="radio" value="exit" className={classes.Input} checked={props.value === "exit"}
                onChange={props.exitEntryHandler} /> Exit
        </form>
    )
}

export default exitEntrySelector;
