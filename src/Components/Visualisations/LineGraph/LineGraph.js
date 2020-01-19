import React from 'react';
import { LineChart, YAxis, XAxis, Line, Tooltip  } from 'recharts'
import classes from './LineGraph.module.css';
import Selector from '../../Selector/Selector';
import ExitEntrySelector from '../../Selector/ExitEntrySelector/ExitEntrySelector';

const lineGraph = props => {
    const { options, defaultValue, selectorValue, data, exitEnterValue } = props;
    let lineChart = (
        <LineChart width={1024} height={200} data={data}
            margin={{top: 10, right: 20, left: 20, bottom: 10}}
            >
            <XAxis strokeWidth="1px" stroke={'black'} tick={{fontSize: '11px'}} dataKey={'year'} />
            <YAxis hide={true}tick={{fontSize: '12px'}} type="number" domain={[0, 'dataMax']} />
            <Tooltip cursor={{ strokeWidth: 0 }} content={renderTooltip} />
            <Line type="monotone" dataKey="value" strokeWidth="2px" stroke={'black'} fill="#00d885" activeDot={{r: 8}}/>
        </LineChart>
    )

    return (
        <div className={classes.LineGraph}>

            {lineChart}
            <div className={classes.ExitEntry}>
                <ExitEntrySelector 
                    exitEntryHandler={props.exitEntryHandler}
                    value={exitEnterValue}
                    />
                <p>
                    * Gas measured at Standard Conditions - 15 degrees Celsius and at 760 mm Hg. The data were not fully collected in the time period Apr-Sep 2009 	
                </p>
            </div>
            <Selector 
                options={options} 
                defaultValue={defaultValue}
                selectorValue={selectorValue}
                handler={props.handler}
            />
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
                    Total of {parseFloat(payload.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} MM3
                </span>
            </p>
        )
    }
}
