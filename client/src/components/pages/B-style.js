import React, { Component } from 'react';
import BLic9221 from './BLic9221';
class Bstyle extends Component{
    render(){
        const { id } = this.props;
        const { data } = this.props;
        return (<div id={id} className="A4-book">
                <p className="text-center">Genius Child Greater than 2 or less than 4.8 Years</p>
                <br/>
                <BLic9221 child={data}/>
            </div>)
    }
}
export default Bstyle;