import React from 'react';
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider'
import { Handle, Track, Tick } from './SliderComponents/SliderComponents';
import classes from './TimeSlider.module.css';
  
const timeSlider = ( props ) => {
    
    const sliderStyle = {  
        position: 'relative',
        width: props.width,
        height: props.height,
        marginBottom: props.margin
    }

    return (
        <Slider
            rootStyle={sliderStyle}
            domain={[2009, 2019]}
            step={1}
            mode={1}
            onChange={props.pushParams}
            values={[props.from, props.to]} >
            <Rail>
            {({ getRailProps }) => ( 
                <div className={classes.RailStyle} {...getRailProps()} /> 
            )}
            </Rail>
            <Handles>
                {({ handles, getHandleProps }) => (
                    <div>
                        {handles.map(handle => (
                            <Handle
                            key={handle.id}
                            handle={handle}
                            getHandleProps={getHandleProps}
                            />
                        ))}
                    </div>
                )}
            </Handles>
            <Tracks right={false} left={false}>
                {({ tracks, getTrackProps }) => (
                    <div>
                    {tracks.map(({ id, source, target }) => (
                        <Track
                            key={id}
                            source={source}
                            target={target}
                            getTrackProps={getTrackProps} />
                    ))}
                    </div>
                )}
            </Tracks>
            <Ticks count={11}>
                {({ ticks }) => (
                    <div>
                    {ticks.map(tick => (
                        <Tick key={tick.id} tick={tick} count={ticks.length} />
                    ))}
                    </div>
                )}
            </Ticks>  
        </Slider>   
    );
};

export default timeSlider;