import React from 'react';
import LineGraphContainer from './Containers/LineGraphContainer/LineGraphContainer';
import ChordContainer from './Containers/ChordContainer/ChordContainer';
import Layout from './hoc/Layout/Layout';
import datas from '../src/Data/data'
import './App.css';

class App extends React.Component {
	state = {
		result: datas
	}
	// componentDidMount() {
	// 	this.initialLoad();
	// }
	// initialLoad = () => {
    //     Axios.get('/json/test.json')
    //         .then(res => {
    //             this.setState({
    //                 result: res.data
    //             })
    //         })
	// }
	render() {
		const { result } = this.state;
		
		let data = [...result];

		return (
			<Layout>
				<LineGraphContainer data={data} />
				<ChordContainer data={data}/>
			</Layout>
		)
	}
}

export default App;
