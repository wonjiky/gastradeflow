import React from 'react';
import classes from './VizWrapper.module.css';

export default props => (
    <div className={classes[props.type]}>
        {props.children}
    </div>
)