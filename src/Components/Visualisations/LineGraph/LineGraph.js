import React from 'react';
import { LineChart, YAxis, XAxis, Line, Tooltip  } from 'recharts'
import classes from './LineGraph.module.css';
import Selector from '../../Selector/Selector';
import ExitEntrySelector from '../../Selector/ExitEntrySelector/ExitEntrySelector';

const lineGraph = props => {
    const { options, defaultValue, selectorValue, data, exitEnterValue } = props;
    let lineChart = (
        <LineChart width={480} height={200} data={data}
            margin={{top: 10, right: 20, left: 20, bottom: 10}}
            >
            <XAxis strokeWidth="1px" stroke={'black'} tick={{fontSize: '11px'}} dataKey={'year'} />
            <YAxis hide={true}tick={{fontSize: '12px'}} type="number" domain={[0, 'dataMax']} />
            <Tooltip cursor={{ strokeWidth: 0 }} content={renderTooltip} />
            <Line type="monotone" dataKey="value" strokeWidth="2px" stroke={'black'} fill="mediumspringgreen" activeDot={{r: 8}}/>
        </LineChart>
    )

    return (
        <div className={classes.LineGraph}>
            <ExitEntrySelector 
                exitEntryHandler={props.exitEntryHandler}
                value={exitEnterValue}
                />
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
