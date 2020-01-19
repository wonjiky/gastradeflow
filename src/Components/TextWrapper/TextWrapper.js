import React from 'react'
import classes from './TextWrapper.module.css';

const textWrapper = props => {

    let style = classes[props.type];
    return (
        <div className={style}>
            <h1> {props.Heading} </h1>
            <p> {props.Body} </p>
        </div>
    );
}

export default textWrapper;