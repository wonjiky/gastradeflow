import React from 'react';
import classes from './ContainerLayout.module.css';

export default props => (

    <div className={classes.ContainerLayout}>
        {props.children}
    </div>
)