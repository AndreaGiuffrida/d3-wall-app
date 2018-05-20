import _ from 'lodash';
import axios from 'axios';
import * as Wall from '../config/Wall';

const API_BASE_PATH = 'http://api.gifparadise.org/v1';
const API_GET_WALL = API_BASE_PATH  + '/wall';

let lastCODE = null;
export const getWall = (limit,code,callback) => {

  code = lastCODE;
  console.log("api call - limit: ",limit," code: ",code);
  axios.get(API_GET_WALL,{

    headers: {'password':'MeetD3Dubai2016'},
    params: {
      limit: limit,
      code: code
    }

  }).then(_.bind(function({data}) {

    if(data && data.length) lastCODE = _.first(data).code;
    console.log("result length: ",data.length," last code:",lastCODE);

    Wall.updateGifArray(data);
    callback();

  },this)).catch(function(error) {

    callback(error);
    throw(error);

  });

}
