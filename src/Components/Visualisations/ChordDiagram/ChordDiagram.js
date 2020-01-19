import React from 'react';
import _ from 'lodash';
import { chord, ribbon } from 'd3-chord';
import { arc } from 'd3-shape';
import { descending } from 'd3-array';
import ReactTooltip from 'react-tooltip';
import Arc from './ChordComponents/Arc';
import classes from './ChordDiagram.module.css';
import Ribbon from './ChordComponents/Ribbon';
import ExitEntrySelector from '../../../Components/Selector/ExitEntrySelector/ExitEntrySelector';

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
        let value = parseFloat(description).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

        let enterExit;

        if ( this.props.exitEnterValue === "entry") {
            enterExit = "entered";
        }else{
            enterExit= "exited"
        }
        return description ? (
            <p><span>{name}</span><br/>
                Total MM3 of Gas {enterExit} : <br/>
                <h5>{value} MM3</h5></p>
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

        
        let result = (
            <p><span>{subindexName}</span> to <span>{indexName}</span> : <br/>
            <h5>{entryValue} MM3</h5>
            <br/>
            <span>{indexName}</span> to <span>{subindexName}</span> : <br/>
            <h5>{exitValue} MM3</h5>
             </p>
        )


        // let result = (<p>{indexName} : {entryValue} <br/> {subindexName}: {exitValue}</p>)
    
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
            {"ID": 1,  "NAME": "Algeria", "color": "red"  },
            {"ID": 2,  "NAME": "Austria", "color": "darkblue"  },
            {"ID": 3,  "NAME": "Belarus", "color": "lightblue"  },
            {"ID": 4,  "NAME": "Belgium", "color": "lightcoral"  },
            {"ID": 5,  "NAME": "Bulgaria", "color": "darkcyan"  },
            {"ID": 6,  "NAME": "Croatia", "color": "yellowgreen"  },
            {"ID": 7,  "NAME": "Czech Republic", "color": "goldenrod"  },
            {"ID": 8,  "NAME": "Denmark", "color": "mediumvioletred"  },
            {"ID": 9,  "NAME": "Estonia", "color": "mediumaquamarine"  },
            {"ID": 10, "NAME": "Finland",  "color": "gray"  },
            {"ID": 11, "NAME": "France",  "color": "violet"  },
            {"ID": 12, "NAME": "Georgia",  "color": "rebeccapurple"  },
            {"ID": 13, "NAME": "Germany",  "color": "#449999"  },
            {"ID": 14, "NAME": "Greece",  "color": "yellow"  },
            {"ID": 15, "NAME": "Hungary",  "color": "rosybrown"  },
            {"ID": 16, "NAME": "Iran",  "color": "mediumslatebue"},
            {"ID": 17, "NAME": "Ireland",  "color": "palevioletred"  },
            {"ID": 18, "NAME": "Isle of Man",  "color": "darkslategrey"  },
            {"ID": 19, "NAME": "Italy",  "color": "palegoldenrod"  },
            {"ID": 20, "NAME": "Latvia",  "color": "darkkhaki"  },
            {"ID": 21, "NAME": "Libya",  "color": "darkcyan"  },
            {"ID": 22, "NAME": "Liquefied Natural Gas",  "color": "darkslateblue"  },
            {"ID": 23, "NAME": "Lithuania",  "color": "greenyellow"  },
            {"ID": 24, "NAME": "Luxembourg",  "color": "papayawhip"  },
            {"ID": 25, "NAME": "Macedonia, Former Yugoslav Republic",  "color": "midnightblue"  },
            {"ID": 26, "NAME": "Moldova",  "color": "wheat"  },
            {"ID": 27, "NAME": "Morocco",  "color": "aquamarine"  },
            {"ID": 28, "NAME": "Netherlands",  "color": "palegreen"  },
            {"ID": 29, "NAME": "Norway",  "color": "plum"  },
            {"ID": 30, "NAME": "Poland",  "color": "sienna"  },
            {"ID": 31, "NAME": "Portugal",  "color": "peachpuff"  },
            {"ID": 32, "NAME": "Romania",  "color": "pru"},
            {"ID": 33, "NAME": "Russia",  "color": "burlywood"  },
            {"ID": 34, "NAME": "Serbia",  "color": "khaki"  },
            {"ID": 35, "NAME": "Slovak Republic",  "color": "aqua"  },
            {"ID": 36, "NAME": "Slovenia",  "color": "lightseagreen"  },
            {"ID": 37, "NAME": "Spain",  "color": "bisque"  },
            {"ID": 38, "NAME": "Sweden",  "color": "royalblue"  },
            {"ID": 39, "NAME": "Switzerland",  "color": "gainsboro"  },
            {"ID": 40, "NAME": "Tunisia",  "color": "honeydew"  },
            {"ID": 41, "NAME": "Turkey",  "color": "salmon"  },
            {"ID": 42, "NAME": "Ukraine",  "color": "brown"  },
            {"ID": 43, "NAME": "United Kingdom",  "color": "blanchedalmond"},
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
                        if ( this.props.exitEnterValue === 'entry'){
                            fuelData[j].data[i] = el.Value
                        } else {
                            fuelData[i].data[j] = el.Value
                        }
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
                <ExitEntrySelector
                    exitEntryHandler={this.props.exitEntryHandler}
                    value={this.props.exitEnterValue}/> 
                <svg width="100%" height="100%" viewBox={`0 0 400 330`}>
                    <g transform={`translate(${400 / 2}, ${330 / 2})`}>
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