import React from 'react';
import _ from 'lodash';
import { chord, ribbon } from 'd3-chord';
import { arc } from 'd3-shape';
import { descending } from 'd3-array';
import ReactTooltip from 'react-tooltip';
import Arc from './ChordComponents/Arc';
import classes from './ChordDiagram.module.css';
import Ribbon from './ChordComponents/Ribbon';

class ChordDiagram extends React.Component {
    state = {
        arcIndex: false,
        arcHovered: undefined,
    }
    componentDidUpdate() {
        ReactTooltip.rebuild();
    }

    arcTooltip = dataTip => {
        if (!dataTip) return "";
        const [id, name, description] = dataTip.split("|");
        let value = parseFloat(description)
            .toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return description ? (
            <p>Financing for<span><br/>{id}. {name}</span><br/>
                Value : {value}M USD</p>
        ) : null;
    };
    
    ribbonTooltip = dataTip => {
        if (!dataTip) return "";
        const [indexName, subindexName, index, subindex, entryValue, exitValue] = dataTip.split("|");
        // let value = parseFloat(entryValue).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        
        // let result = (
        //     <p>Financing for<br/><span>{index}. {indexName} &amp; <br/>{subindex}. {subindexName}{}</span><br/>
        //     Value : {value}M USD</p>
        // );
        // if ( index === subindex ) {
        //     result = (
        //         <p>Financing for<br/><span>{index}.{indexName}</span><br/>
        //         Value : {value}M USD</p>
        //     );
        // }

        let result = (<p>{indexName} : {entryValue} <br/> {subindexName}: {exitValue}</p>)
    
        return indexName ? result : null;
    }

    render() {
        const { data, from, to} = this.props;
        let dataLength = 43, fuelData =[];
        const view = [500, 500]; 
        const trbl = [10, 10, 10, 10]; 
        const dims = [ view[0] - trbl[1] - trbl[3], view[1] - trbl[0] - trbl[2] ];
        const radius = (dims[1] / 2) * 0.6;
        const innerRadius = 130, outerRadius = 135;
        const dataFilteredByYear = data.filter(d => d.Year >= from && d.Year <= to);

        function mid(d) {
            return Math.PI > (d.endAngle + d.startAngle) / 2 
        }
          
        const innerArcPath = arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius);
        
        const outerArcPath = arc()
          .innerRadius(radius * 1.02)
          .outerRadius(radius * 1.02);
        
        let concatData = _.chain(dataFilteredByYear)
            .groupBy('Pos')
            .map(objs => (
                {
                    'ID': _.uniqBy(objs, 'Pos')[0].Pos - 1,
                    'Value': _.sumBy(objs, o => o.Value),
                }
            )).value();
        
        for(let i = 0; i < dataLength; i++) {
            fuelData[i] = {
                index: i + 1,
                data: [],
            };
        }

        for(let i = 0; i < dataLength; i++) {
            for(let j = 0; j < dataLength; j++) {
                concatData.forEach(el => {
                    if (43 * i + j === el.ID){
                        fuelData[i].data[j] = el.Value
                        // fuelData[j].data[i] = el.Value
                    } 
                })
            }
        }

        let datas = _.chain(fuelData)
			.map(u => u.dataFilteredByYear)
			.flatten()
			.sum()
            .value();
        const chords = chord().padAngle(0.005).sortSubgroups(descending);
        const ribbons = ribbon().radius(125);
        const matrix = fuelData.map(d => d.data);
        const chordData = chords(matrix);
        chordData['groups'] = chordData.groups.map((d,i) => {
            return {
                props: {
                    ID: dataFilteredByYear[i].ID,
                    NAME: dataFilteredByYear[i].Entry,
                    // COLOR: sdgProp[i].color,
                },
                ...d
            }
        })

        // let metaProps = _.chain(dataFilteredByYear)
        //     .groupBy('Entry')
        //     .map(objs => ({
        //         "ID": 
        //     }))
        //     .value()

        //     console.log(metaProps);
      
        let renderArc, renderRibbon = null;
        if ( datas !== 0 ) {
            renderArc = (
                <Arc 
                    data={chordData.groups}
                    innerArcPath={innerArcPath}
                    outerArcPath={outerArcPath}
                    onMouseOver={e => this.setState({ arcHovered: true, arcIndex: e })}
                    onMouseOut={e => this.setState({ arcHovered: false, arcIndex: undefined})}
                    mid={mid}
                    radius={radius}
                />
            );
            renderRibbon = (
                <Ribbon 
                    data={[...chordData]}
                    ribbon={ribbons}
                    meta={chordData.groups}
                    arcIndex={this.state.arcIndex}
                    arcHovered={this.state.arcHovered}
                    innerRadius={125}
                />
            );
        }
        return (
            <div className={classes.ChordDiagram}>
                <svg width="100%" height="100%" viewBox={`0 0 400 400`}>
                    <g transform={`translate(${400 / 2}, ${400 / 2})`}>
                        {renderArc}
                        {renderRibbon}
                    </g>
                </svg>
                <ReactTooltip id="ChordArc" className="Tooltip" getContent={d => this.arcTooltip(d)} />
                <ReactTooltip id="ChordRibbon" className="Tooltip" getContent={d => this.ribbonTooltip(d)} />
            </div>
        )
    }
}

export default ChordDiagram;