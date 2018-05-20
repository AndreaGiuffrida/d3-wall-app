import React, { Component } from 'react';
import * as Wall from '../../config/Wall';

class Debug extends Component {
  render(){

    let columns = Wall.GRID_WIDTH / Wall.GRID_CHUNK;
    let rows = Wall.GRID_HEIGHT / Wall.GRID_CHUNK;

    return(
      <div id="debug-grid">
        {[Array.apply(0, Array(columns)).map((x,i) => {
          return(
            <div className={'column col' + i} />
          )
        })]}
        {[Array.apply(0, Array(rows)).map((x,i) => {
          return(
            <div className={'row row' + i} />
          )
        })]}
        {[Array.apply(0, Array((rows * columns) / 4)).map((x,i) => {
          return(
            <p className={'num num' + i}><span>{i}</span></p>
          )
        })]}
        <div id="door" />
      </div>
    );
  }
}

export default Debug;
