import React from 'react';
import axios from 'axios';
import ChordDiagram from '../../Components/Visualisations/ChordDiagram/ChordDiagram';
import ContainerLayout from '../../hoc/ContainerLayout/ContainerLayout';
import TimeSlider from '../../Components/TimeSlider/TimeSlider';
import TextWrapper from '../../Components/TextWrapper/TextWrapper';
import VizWrapper from '../../Components/Visualisations/VizWrapper/VizWrapper'
import classes from './ChordContainer.module.css';

class ChordContainer extends React.Component {

    state = {
        data: [],
        from: 2019,
        to: 2019,
        exitEnterValue: "entry"

    }

    // componentDidMount() {
    //     this.initialLoad()
    // }

    // initialLoad = () => {
    //     axios.get('/json/test.json')
    //         .then(res => {
    //             this.setState({
    //                 data: res.data
    //             })
    //         })
    // }

    exitEntryHandler = e => {

        this.setState({ exitEnterValue: e.target.value})
    }

    sliderChange = e => {
        this.setState({
            from: e[0],
            to: e[1]
        })
    }    

    render(){

        const { data } = this.props, { from, to, exitEnterValue } = this.state;
        let chordDiagram = null;
        if ( this.props.data.length !== 0 ) {
            chordDiagram = (
                <ChordDiagram
                    data={data}
                    from={from}
                    to={to}
                    exitEntryHandler={this.exitEntryHandler}                
                    exitEnterValue={exitEnterValue}
                />
                );
        }

        return (
            <ContainerLayout>
                <div className={classes.ChordsLayout}>
                    <h1>Interconnectivity of trades between countries</h1>
                </div>
                <VizWrapper type="Chord">
                        {chordDiagram}
                    <div className={classes.TimeSlider}>
                        <TimeSlider 
                            from={from} 
                            to={to}  
                            width={"100%"}
                            height={30}
                            margin={16}
                            pushParams={this.sliderChange}
                        />
                    </div>
                </VizWrapper>
            </ContainerLayout>
        )
        
    }
}

export default ChordContainer;