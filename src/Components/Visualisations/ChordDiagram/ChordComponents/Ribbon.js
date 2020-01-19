import React, { useState } from 'react';
import { easeExpOut } from "d3-ease";
import { NodeGroup } from "react-move";

const Ribbon = ({data, ribbon, meta, arcIndex, innerRadius }) => {

    const [mouseOver, mouseOverHandler] = useState({ selected: false, selectedIndex: null });
    //Define defs
    let defs = createLinearGradient(data, innerRadius, meta);
    return (
        <NodeGroup
            data={data}
            keyAccessor={(d, i) => i}
            start={d => ({
                source: {
                startAngle: [d.source.startAngle],
                endAngle: [d.source.endAngle]
                },
                target: {
                startAngle: [d.target.startAngle],
                endAngle: [d.target.endAngle]
                }
            })}
            enter={d =>({
                source: {
                    endAngle: [d.source.endAngle]
                },
                target: {
                    endAngle: [d.target.endAngle]
                },
                timing: { duration: 500, ease: easeExpOut }
                })
            }
            update={d => ({
                source: {
                    startAngle: [d.source.startAngle],
                    endAngle: [d.source.endAngle]
                },
                target: {
                    startAngle: [d.target.startAngle],
                    endAngle: [d.target.endAngle]
                },
                timing: { duration: 500, ease: easeExpOut }
            })}
        >
            
            {nodes => {
                return (
                    <g id="ribbons">
                        {defs}
                        {nodes.map(({ key, data, state }) => {
                            return (
                                data.value === 0 ? null : <path 
                                    id='ribbons'
                                    key={key} 
                                    data-tip={
                                        `
                                        ${data.source.index + 1}|
                                        ${data.source.subindex + 1}|
                                        ${data.source.value}|
                                        ${data.target.value}`
                                    } 
                                    data-for="ChordRibbon"
                                    d={ribbon(state)}
                                    onMouseOver={() => mouseOverHandler(prevState =>({
                                        ...prevState, selected: true, selectedIndex: key
                                    }))}
                                    onMouseOut={() => mouseOverHandler(prevState => ({
                                        ...prevState, selected: false, selectedIndex: null
                                    }))} 
                                    fill={"black"} 
                                    fill={`url(#Ribbon-${data.source.index}-${data.target.index})`} 
                                    opacity={ 
                                        (mouseOver.selected === true && mouseOver.selectedIndex !== null && mouseOver.selectedIndex === key) || 
                                        ( (parseInt(arcIndex) === data.source.index) || (parseInt(arcIndex) === data.source.subindex) ) ? 1 : .2} 
                                />
                            );
                        })}
                    </g>
                );
            }}
        </NodeGroup>
    );
}

const createLinearGradient = (data, innerRadius, meta) => {
    return (
        <defs>
            {data.map((ribbon, i) => {

                let fillIndex = {
                    source: ribbon.source.index, 
                    target: ribbon.target.index
                };

                return (
                    <Gradient
                        key={i}
                        ribbon={ribbon}
                        innerRadius={innerRadius}
                        fill={[meta[fillIndex.source].color, meta[fillIndex.target].color]}
                    />
                )
            })}
        </defs>
    )
}

const Gradient = ( {ribbon, innerRadius, fill} ) => {

    let t = ribbon.target, s = ribbon.source;
    let x1 = innerRadius * Math.cos((s.endAngle - s.startAngle)/2 + s.startAngle-Math.PI/2),
        y1 = innerRadius * Math.sin((s.endAngle - s.startAngle)/2 + s.startAngle-Math.PI/2),
        x2 = innerRadius * Math.cos((t.endAngle - t.startAngle)/2 + t.startAngle-Math.PI/2),
        y2 = innerRadius * Math.sin((t.endAngle - t.startAngle)/2 + t.startAngle-Math.PI/2);

    return (
        <linearGradient 
            id={`Ribbon-${ribbon.source.index}-${ribbon.target.index}`}
            gradientUnits={"userSpaceOnUse"}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
        >
            <stop offset="0%" stopColor={fill[0]} />
            <stop offset="100%" stopColor={fill[1]} />
        </linearGradient>
    )
}

export default Ribbon;

