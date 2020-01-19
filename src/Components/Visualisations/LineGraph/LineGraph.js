import React from 'react';
import { LineChart, YAxis, XAxis, Line, Tooltip  } from 'recharts'
import classes from './LineGraph.module.css';
import Selector from '../../Selector/Selector';


const lineGraph = props => {
    const { options, defaultValue, selectorValue, data } = props;
    let lineChart = (
        <LineChart width={500} height={140} data={data}
            margin={{top: 0, right: 20, left: 20, bottom: 10}}
            >
            <XAxis tick={{fontSize: '10px'}} dataKey={'year'} />
            <YAxis hide={true}tick={{fontSize: '12px'}} type="number" domain={[0, 'dataMax']} />
            <Tooltip content={renderTooltip} />
            <Line type="monotone" dataKey="value" strokeWidth="2px" stroke={'gray'} activeDot={{r: 8}}/>
        </LineChart>
    )

    return (
        <div className={classes.LineGraph}>
            <Selector 
                options={options} 
                defaultValue={defaultValue}
                selectorValue={selectorValue}
                handler={props.handler}
            />
            {lineChart}
        </div>
    );
}

export default lineGraph;

const renderTooltip = props => {
    if ( props.active && props.payload !== null && props.payload[0] !== null ){
        let payload = props.payload[0].payload;
        return (
            <p className={classes.Tooltip}>
                {payload.year}
                <br/><span>
                    Value : {parseFloat(payload.value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} M USD
                </span>
            </p>
        )
    }
}
