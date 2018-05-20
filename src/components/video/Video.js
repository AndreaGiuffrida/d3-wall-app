import React, { Component } from 'react';
import * as Wall from '../../config/Wall';
import _ from 'lodash';

let index = -1;


const VIDEO_LIST = [
  './assets/video/video-00.mp4',
  './assets/video/video-01.mp4',
  './assets/video/video-02.mp4',
  './assets/video/video-03.mp4',
  './assets/video/video-04.mp4',
  './assets/video/video-05.mp4',
  './assets/video/video-06.mp4',
  './assets/video/video-07.mp4',
  './assets/video/video-08.mp4',
  './assets/video/video-09.mp4',
  './assets/video/video-10.mp4'
];


class Video extends Component {

  constructor(props) {

    super(props);
    this.state = {
      disabled: true
    }



  }

  componentDidMount() {

    let video = this.refs.video;
    video.addEventListener("canplay",this.onReady.bind(this),false);

  }

  onReady() {

    let video = this.refs.video;
    let timeout = (video.duration - 1.5) * 1000;

    this.setState({disabled: false});


    _.delay(this.props.resetGrid,1000);
    _.delay(this.props.showGrid,timeout - 750);
    _.delay(this.onEnded.bind(this),timeout - 750);


    video.play();
  }

  onEnded() {

    this.setState({disabled: true});

  }

  render() {

    index++;
    if(index == VIDEO_LIST.length) index = 0;

    return(
        <div id="video-holder">
          <video ref="video" preload="auto" disabled={this.state.disabled}>
            <source type="video/mp4" src={VIDEO_LIST[index]} />
          </video>
        </div>
    );
  }

}

export default Video;
