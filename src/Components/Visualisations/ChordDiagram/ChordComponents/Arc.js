import React from 'react';
import { easeExpOut } from "d3-ease";
import { NodeGroup } from "react-move";
import { select, selectAll } from 'd3-selection';

const Arc = props => {
    const { data, innerArcPath, outerArcPath, mid, radius } = props;
    return (
        <NodeGroup
            data={data}
            keyAccessor={d => d.index}
            start={d => ({
                startAngle: d.startAngle,
                endAngle: d.startAngle
            })}
            enter={d => ({
                endAngle: [d.endAngle],
                timing: { duration: 500, delay: 350, ease: easeExpOut }
            })}
            update={d => ({
                startAngle: [d.startAngle],
                endAngle: [d.endAngle],
                timing: { duration: 500, ease: easeExpOut }
            })}
        >
            {nodes => {
                let filteredNodes = [];
                for( let node in nodes ){
                    if(nodes[node].data.value > 0) {
                        filteredNodes.push(nodes[node]);
                    } 
                }
                return (
                    <g>
                        {filteredNodes.map(({ key, data, state }) => {
                            let p2Buffer = 0.05;
                            let p1 = outerArcPath.centroid(state);
                            let p2 = [ mid(state) ?
                                p1[0] + radius * p2Buffer : 
                                p1[0] - radius * p2Buffer, 
                                p1[1]
                            ];

                            let text = data.props.NAME.split(" ");
                            return (
                                    <g key={key}>
                                        <path
                                            className='arcs'
                                            d={innerArcPath(state)}
                                            fill={data.props.COLOR}
                                            opacity={0.9}
                                            onMouseOver={
                                                function() {
                                                    props.onMouseOver(key)
                                                    let selected = select(data)._groups[0][0].props.ID;
                                                    selectAll('.arcs')
                                                        .data(filteredNodes)
                                                        .style("opacity", d => {
                                                            return d.data.props.ID === selected ? 1 : 0.2
                                                            })
                                                        }
                                                }
                                                onMouseOut={ 
                                                    function() {
                                                        props.onMouseOut(key)
                                                        selectAll('.arcs')
                                                            .data(nodes)
                                                            .style('opacity', 1);
                                                }
                                            }
                                            data-tip={`${data.props.ID}|${data.props.NAME}|${data.value}`} 
                                            data-for="ChordArc" 
                                            /> 
                                        <text
                                            fontSize="3px"
                                            fill="#000"
                                            transform={`translate(${p2.toString()})`}
                                            textAnchor={mid(state) ? "start" : "end"}
                                        >   
                                            <tspan x={mid(state) ? "1px" : "-1px"} dy="0em">{text[0]} {text[1]}</tspan>
                                            <tspan x={mid(state) ? "1px" : "-1px"} dy="1em">{text[2]} {text[3]} {text[4]}</tspan>
                                        </text>
                                        <polyline
                                            fill="none"
                                            stroke="rgba(0,0,0,0.4)"
                                            strokeWidth="0.5"
                                            points={`${innerArcPath.centroid(state)},
                                                ${p1},${p2.toString()}`}
                                        /> 
                                    </g>
                            );
                        })}
                    </g>
                );
            }}
            </NodeGroup>
    );
}

export default Arc;