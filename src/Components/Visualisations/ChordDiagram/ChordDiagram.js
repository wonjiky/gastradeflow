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

        let fuelProps = [
            {"ID": 1, "color": "red"  },
            {"ID": 2, "color": "darkblue"  },
            {"ID": 3, "color": "lightblue"  },
            {"ID": 4, "color": "lightcoral"  },
            {"ID": 5, "color": "darkcyan"  },
            {"ID": 6, "color": "yellowgreen"  },
            {"ID": 7, "color": "goldenrod"  },
            {"ID": 8, "color": "mediumvioletred"  },
            {"ID": 9, "color": "mediumaquamarine"  },
            {"ID": 10, "color": "gray"  },
            {"ID": 11, "color": "violet"  },
            {"ID": 12, "color": "rebeccapurple"  },
            {"ID": 13, "color": "#449999"  },
            {"ID": 14, "color": "yellow"  },
            {"ID": 15, "color": "rosybrown"  },
            {"ID": 16, "color": "mediumslatebue"},
            {"ID": 17, "color": "palevioletred"  },
            {"ID": 18, "color": "darkslategrey"  },
            {"ID": 19, "color": "palegoldenrod"  },
            {"ID": 20, "color": "darkkhaki"  },
            {"ID": 21, "color": "darkcyan"  },
            {"ID": 22, "color": "darkslateblue"  },
            {"ID": 23, "color": "greenyellow"  },
            {"ID": 24, "color": "papayawhip"  },
            {"ID": 25, "color": "midnightblue"  },
            {"ID": 26, "color": "wheat"  },
            {"ID": 27, "color": "aquamarine"  },
            {"ID": 28, "color": "palegreen"  },
            {"ID": 29, "color": "plum"  },
            {"ID": 30, "color": "sienna"  },
            {"ID": 31, "color": "peachpuff"  },
            {"ID": 32, "color": "pru"},
            {"ID": 33, "color": "burlywood"  },
            {"ID": 34, "color": "khaki"  },
            {"ID": 35, "color": "aqua"  },
            {"ID": 36, "color": "lightseagreen"  },
            {"ID": 37, "color": "bisque"  },
            {"ID": 38, "color": "royalblue"  },
            {"ID": 39, "color": "gainsboro"  },
            {"ID": 40, "color": "honeydew"  },
            {"ID": 41, "color": "salmon"  },
            {"ID": 42, "color": "brown"  },
            {"ID": 43, "color": "blanchedalmond"},
        ];

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
                    COLOR: fuelProps[i].color,
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
                    meta={fuelProps}
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