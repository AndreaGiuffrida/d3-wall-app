import _ from 'lodash';

let GIF_ARRAY = [];
let index = -1;

export const API_TIMEOUT = 25 // in seconds
export const GRID_WIDTH = 2560; // width of the wall led in pixels
export const GRID_HEIGHT = 1024; // height of the wall led in pixels
export const GRID_CHUNK = 128; // Chunk size for debugging

/*
{
  list: [],
  map: [
    [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],
    [10,1],[11,1],[12,1],[13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[19,1],
    [20,1],[21,1],[22,1],[23,1],[24,0],[25,0],[26,1],[27,1],[28,1],[29,1],
    [30,1],[31,1],[32,1],[33,1],[34,0],[35,0],[36,1],[37,1],[38,1],[39,1]
  ]
}
*/

export const GRID_PATTERN = [
  {
    list: [],
    map: [
      [0,2],[2,2],[4,2],[6,2],[8,2],
      [20,2],[22,2],[24,0],[26,2],[28,2]
    ]
  },
  {
    list: [],
    map: [
      [0,1],[1,1],[2,1],[3,1],[4,2],[6,1],[7,1],[8,1],[9,1],
      [10,1],[11,2],[13,1],[16,1],[17,2],[19,1],
      [20,1],[23,1],[24,0],[25,0],[26,1],[29,1],
      [30,1],[31,1],[32,1],[33,1],[34,0],[35,0],[36,1],[37,1],[38,1],[39,1]
    ]
  },
  {
    list: [],
    map: [
      [0,2],[2,1],[3,1],[4,2],[6,1],[7,1],[8,2],
      [12,1],[13,1],[16,1],[17,1],
      [20,1],[21,1],[22,2],[24,0],[25,0],[26,2],[28,1],[29,1],
      [30,1],[31,1],[34,0],[35,0],[38,1],[39,1]
    ]
  }
];

const resetLoadedGif = () => {

  GIF_ARRAY = _.map(GIF_ARRAY,function(item){
    item.loaded = false;
    return item;
  });

  GIF_ARRAY = _.shuffle(GIF_ARRAY);

}

export const updateGifArray = (data) => {

  let _tmp = data.concat(GIF_ARRAY);
  _tmp = _.uniqBy(_tmp, 'url');

  GIF_ARRAY = _tmp;

}

export const getPattern = () => {

  // if the gif list is not big enought to create the wall
  if(GIF_ARRAY.length < 10) return null;

  index = index + 1 == GRID_PATTERN.length ? 0 : index + 1;

  while(GRID_PATTERN[index].map.length > GIF_ARRAY.length) {

    index = index + 1 == GRID_PATTERN.length ? 0 : index + 1;

  }

  let pattern = GRID_PATTERN[index];

  /*
  // reset the gif loaded params if all gifs have been loaded
  let gifNotLoaded = _.map(GIF_ARRAY,function(item) {
    return !item.loaded ? item : null;
  });

  gifNotLoaded = _.compact(gifNotLoaded);

  if(!gifNotLoaded.length) {

    // Reset the loaded param
    resetLoadedGif();

    // export again the gifNotLoaded array
    gifNotLoaded = _.map(GIF_ARRAY,function(item) {
      return !item.loaded ? item : null;
    });

    gifNotLoaded = _.compact(gifNotLoaded);

  };


  // select the first N gif from the mapped array.
  let gifs = _.take(gifNotLoaded,pattern.map.length);

  // set loaded = true to the selected gifs.
  _.intersection(GIF_ARRAY,gifs).map(function(item) { item.loaded = true; });

  // if the gif length is less than the pattern map length
  // I use the not loaded gif to fill the holes.
  if(gifs.length < pattern.map.length) {

    let fill = pattern.map.length - gifs.length;
    let difference = _.difference(gifNotLoaded,gifs);
    gifs = gifs.concat(_.take(difference,fill));

  };


  // if the gif length is less than the pattern map length
  // means that all gifs have been loaded so I reset the gif loaded params from the main gif array
  // and different it with the selected ones to retrieve not duplicated gif to concat
  // to the existing gif array to add to the pattern.
  if(gifs.length < pattern.map.length) {

    resetLoadedGif();

    let fill = pattern.map.length - gifs.length;
    let difference = _.difference(GIF_ARRAY,gifs);
    gifs = gifs.concat(_.take(difference,fill));

  };
  */

  let newestLength = Math.floor(pattern.map.length * .5);
  let randomLength = pattern.map.length - newestLength;
  let newestGifs = _.take(GIF_ARRAY,newestLength);
  let difference = _.difference(GIF_ARRAY,newestGifs);
  let randomGifs = _.sampleSize(difference,randomLength);
  let gifs = newestGifs.concat(randomGifs);

  console.log(gifs.length);
  // set the pattern list and return the pattern object
  pattern.list = _.shuffle(gifs);
  return pattern;
}
