import React from 'react'
import classes from './TextWrapper.module.css';

const textWrapper = props => {

    let style = classes[props.type];
    return (
        <div className={style}>
            {props.Heading}
            {props.Body}
        </div>
    );
}

export default textWrapper;