import React, { Component } from 'react';
import _ from 'lodash';
import * as Wall from '../config/Wall';
import * as Action from '../actions/Actions';
import randomColor from 'random-color';
import Debug from './debug/Debug';
import * as Loader from './loader/Loader';
import * as PixelArt from './pixelart/PixelArt';
import Grid from './grid/Grid';
import Video from './video/Video';

let step = 2;
let videoStep = 3;

class App extends Component {

  constructor(props) {

    super(props);

    this.onEnded = this.onEnded.bind(this);

    // gif limit per call
    this.limit = 60;

    // last gif code received
    this.code = null;

    this.state = {
      grid: {map:[], list:[]},
      video: false,
      debug: false,
      network: navigator.onLine
    };


  }

  onKeyDown(evt) {

    if(evt.keyCode == 68) {
      this.setState({
        debug: !this.state.debug
      });
    }
  }

  componentDidMount() {

    // setup PixelArt Canvas and load all images
    //PixelArt.setup(this.refs['pixel-canvas'],this.updateWall.bind(this));

    this.updateWall();
    window.addEventListener('keydown',this.onKeyDown.bind(this));
  }

  // Get the GIF List from the v1/wall API
  updateWall() {

    // update the wall
    Action.getWall(this.limit, this.code,this.getPattern.bind(this));

  }

  // Get the next patter to show
  getPattern(error) {

    console.log("> get pattern");

    if(!error) {

      step++;
      this.pattern = Wall.getPattern();
      this.setState({network:true});

    } else {

      this.setState({network:false});
    }

    this.setState({video:true});

  }

  onShowGrid() {

    console.log(" > show grid");
    this.setState({grid: this.pattern});
    this.refs.grid.startLoading();
  }

  onResetGrid() {

    console.log(" > reset grid");
    this.setState({grid:{map:[], list:[]}});
  }

  onEnded() {

    this.setState({video:false});
    _.delay(this.updateWall.bind(this),Wall.API_TIMEOUT * 1000);

  }

  render(){

    return(

      <div id="wall">

        {(process.env.NODE_ENV == "development" && this.state.debug) ? <Debug /> : null}
        <Grid ref="grid" grid={this.state.grid} onEnded={this.onEnded} />
        {this.state.video ? <Video showGrid={this.onShowGrid.bind(this)} resetGrid={this.onResetGrid.bind(this)}/> : null}

      </div>

    );
  }
}


export default App;
