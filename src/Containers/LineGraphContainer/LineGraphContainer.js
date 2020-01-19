import React from 'react';
import classes from './LineGraphContainer.module.css';
import ContainerLayout from '../../hoc/ContainerLayout/ContainerLayout';
import TextWrapper from '../../Components/TextWrapper/TextWrapper';
import VizWrapper from '../../Components/Visualisations/VizWrapper/VizWrapper';
import LineGraph from '../../Components/Visualisations/LineGraph/LineGraph';
import _ from 'lodash';


class LineGraphContainer extends React.Component {

    state = {
        selectedCountry: {"label": "Algeria", "value": "Algeria"}
    }

    handler = e => {
        this.setState({ selectedCountry: e })
    }

    render() {
        const { data } = this.props;
        let countryList = [];
        let heading = "Gas Trade Flow",
        body = "The Gas Trade Flow shows the flow of gas transacations within Europe."
        let datum = [ ...data ];

        //Selector
        let filterData = _.groupBy(datum, 'Entry');
        for( let country in filterData) {
            countryList.push(country)
        };
        let list = countryList.map(country => ({ "label": country, "value": country }));
        let defaultValue = {"label": "Algeria", "value": "Algeria"};

        //LineGraph
        let lineGraphData = [];
        lineGraphData = _.chain(datum)
            .groupBy('Entry')
            .filter(obj => obj[0].Entry === this.state.selectedCountry.value)
            .map(objs => (
                {
                    "ID": _.uniqBy(objs, 'Entry')[0].Entry,
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
                        <TextWrapper 
                            Heading={heading}
                            Body={body}
                            type="Line"
                        />
                        <VizWrapper type="Line">
                            <LineGraph
                                options={list}
                                data={lineGraphData[0].data} 
                                defaultValue={defaultValue}      
                                selectorValue={this.state.selectedCountry}
                                handler={this.handler}
                                />
                        </VizWrapper>
                    </ContainerLayout>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default LineGraphContainer;
