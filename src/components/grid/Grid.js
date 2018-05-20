import React, { Component } from 'react';
import * as Wall from '../../config/Wall';
import * as Cache from '../../config/Cache';
import * as Loader from '../loader/Loader';
import _ from 'lodash';


class Grid extends Component {

  constructor(props) {
    super(props);

    this.idLIST = [];
    this.globalDelay = 0;
  }

  startLoading() {

    //console.log("pattern:",this.props.grid);
    console.clear();
    //console.log("---------------------------------------");

    let manifest = [];
    let manifestLength = this.idLIST.length;

    for(let i=0; i < manifestLength; i++) {

      let id = _.last(this.idLIST);
      let item = this.props.grid.list[i];
      this.idLIST = _.dropRight(this.idLIST,1);

      manifest.push({
        id: id,
        src: item.url,
        type: createjs.AbstractLoader.IMAGE
      });


    };

    manifest = _.shuffle(manifest);

    this.onFileLoad({item: _.last(manifest)},manifest);
    //this.queue = Loader.loadManifest(manifest,this.onComplete.bind(this),this.onFileLoad.bind(this));
  }

  onFileLoad(e,manifest) {

    manifest = _.dropRight(manifest,1);

    let self = this;
    let code = _.last(e.item.src.split('/'));
    let cached = Cache.getCachedImage(code);
    let div = this.refs['grid-item' + e.item.id];

    if(!cached) {

      let img = new Image();
      img.onload = function onImageLoaded() {


        let code = _.last(this.src.split('/'));
        Cache.saveToCache(this,code);

        console.log("save:",code);

        if(div) div.appendChild(this);
        if(manifest.length) self.onFileLoad({item: _.last(manifest)},manifest);
        else _.delay(self.onComplete.bind(self),2000);


      };

      img.src = e.item.src;

    } else {

      console.log("cached:",code);

      if(div) div.appendChild(cached);

      _.delay(function(){

        if(manifest.length) self.onFileLoad({item: _.last(manifest)},manifest);
        else _.delay(self.onComplete.bind(self),2000);

      },100);


    };


  }



  onComplete() {

    this.props.onEnded();

  }

  render() {

    let index = 0;
    let percX = 100 / (Wall.GRID_WIDTH / Wall.GRID_CHUNK);
    let percY = 100 / (Wall.GRID_HEIGHT / Wall.GRID_CHUNK);
    //let list = _.shuffle(this.props.grid.list);

    this.globalDelay = 0;
    this.idLIST = [];

    return(
      <div id="grid">
      {
        this.props.grid.map.map((pos,i) => {

          if(pos[1] == 0)
              return null;

          this.idLIST.push(i);
          let row = Math.floor(pos[0] / 10);
          let column =  Math.floor(pos[0] % 10);
          let sizeW = (pos[1] * 2 * percX) + '%';
          let sizeH = (pos[1] * 2 * percY) + '%';
          let x = (column * 2 * percX) + '%';
          let y = (row * 2 * percY) + '%';
          //let url = list[index++].url;

          let style = {

            left: x,
            top: y,
            width: sizeW,
            height: sizeH,
            //backgroundImage: 'url(' + url + ')'

          };

          return (
            <div ref={'grid-item' + i} className="grid-item" key={i} style={style} />
          );

        })
      }
      </div>
    );
  }
}

export default Grid;
