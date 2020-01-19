import React from 'react';
import classes from './LineGraphContainer.module.css';
import ContainerLayout from '../../hoc/ContainerLayout/ContainerLayout';
import TextWrapper from '../../Components/TextWrapper/TextWrapper';
import VizWrapper from '../../Components/Visualisations/VizWrapper/VizWrapper';
import LineGraph from '../../Components/Visualisations/LineGraph/LineGraph';
import countries from '../../Data/countries';
import _ from 'lodash';

class LineGraphContainer extends React.Component {

    state = {
        selectedCountry: countries.entry[0],
        exitEnterValue: "entry"
    }

    handler = e => {
        this.setState({ selectedCountry: e })
    }

    exitEntryHandler = e => {
        this.setState({ 
            exitEnterValue: e.target.value,
        })
        if (e.target.value === 'exit'){
            this.setState({
                selectedCountry: countries.exit[0]
            })
        }else {
            this.setState({
                selectedCountry: countries.entry[0]
            })
        }
    }

    render() {
        const { data } = this.props;
        let countryList = [];
        let heading = <h1>Gas Trade Flow</h1>,
        body = <p>Visualising the gas trade flows in Europe between 2008-2019.
            <br/>This platform delves into each country's annual flows as well depicts the interconnectivity between the countries.</p>
        let datum = [ ...data ];

        let list = countries.entry;
        if (this.state.exitEnterValue === "exit") list = countries.exit;

        //LineGraph
        let lineGraphData = [], typeOfValue = 'Entry';
        if ( this.state.exitEnterValue === "exit") typeOfValue = 'Exit';
        lineGraphData = _.chain(datum)
            .groupBy(typeOfValue)
            .filter(obj => obj[0][typeOfValue] === this.state.selectedCountry.value)
            .map(objs => (
                {
                    "ID": _.uniqBy(objs, typeOfValue)[0][typeOfValue],
                    "data": _.chain(objs)
                                .groupBy('Year')
                                .map(obj => ({
                                    year: _.uniqBy(obj, 'Year')[0].Year,
                                    value: _.sumBy(obj, 'Value')
                                }))
                                .value()
                }
            )).value();
            
        

        if ( lineGraphData.length > 0 ) {
            return (
                <div className={classes.LineGraphContainer}>
                    <ContainerLayout>
                        <VizWrapper type="Line">
                            <LineGraph
                                options={list}
                                exitEnterValue={this.state.exitEnterValue}
                                data={lineGraphData[0].data} 
                                // defaultValue={defaultValue}      
                                selectorValue={this.state.selectedCountry}
                                exitEntryHandler={this.exitEntryHandler}
                                handler={this.handler}
                                />
                        </VizWrapper>
                        <TextWrapper 
                            Heading={heading}
                            Body={body}
                            type="Line"
                        />
                    </ContainerLayout>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default LineGraphContainer;
