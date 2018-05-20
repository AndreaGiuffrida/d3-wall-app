import * as Wall from '../../config/Wall';
import * as Loader from '../loader/Loader';


let canvas = null;
let context = null;

let PIXELART_IMAGES = [
  {
    id: 'dubai',
    src: './assets/dubai.jpg'
  }
];

const TRANSITION_IN = 'transition-in';
const TRANSITION_OUT = 'transition-out';

const ANIMATION_TYPE_WAVE = 'animation-type-wave';
const ANIMATION = [
  {
    type: ANIMATION_TYPE_WAVE
  }
];

// initial setup and images loading
export const setup = (canvasDOM,callback) => {

  canvas = canvasDOM;
  canvas.width = Wall.GRID_WIDTH;
  canvas.height = Wall.GRID_HEIGHT;

  context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;

  Loader.loadManifest(PIXELART_IMAGES,function(evt) {

    callback();

  });

}


// UTILITY FUNCTIONS
// ----------------------------------------------------

// pixelate function
const pixelate = (size,img) => {

  // cache scaled width and height
  let w = _.floor(canvas.width * size);
  let h = _.floor(canvas.height * size);

  // draw original image to the scaled size
  context.drawImage(img, 0, 0, w, h);

  // then draw that scaled image thumb back to fill canvas
  // As smoothing is off the result will be pixelated
  context.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
}

// clear the tweenline timeline
const clearTimeline = (timeline) => {

  let targets = [];
  timeline.getChildren().map((tween) => targets.push(...tween.target));

  targets.map((node) => TweenLite.killTweensOf(node));
  timeline.kill();
  timeline = null;
}


// return a pulse value to create a wave
const pulse = (i, frequency = .02) => {

  const pi = Math.PI;
  return .15 * (1 + Math.cos(2 * pi * frequency * i));
}

// ----------------------------------------------------



// ANIMATIONS SETUP
// ----------------------------------------------------

const setupWaveAnimation = (callback, ease = TRANSITION_IN) => {


  let img = _.sample(PIXELART_IMAGES).tag; // get a random pixel art image

  let pixel = 32; // pixel size
  let waveWidth = 5; // wave width
  let step = 4; // animation step
  let duration = 2; // base duration in seconds
  let timeline = null;
  let index = 0;
  let pixelArray = [];
  let chunkSize = ease == TRANSITION_IN ? (0.1 / step) : 1;

  timeline = new TimelineLite({

    delay: ease == TRANSITION_IN ? 0 : 1.5,
    onCompleteParams:[callback, TRANSITION_OUT],
    onComplete: function (_callback,_ease) {

      clearTimeline(timeline);

      if(ease == TRANSITION_IN) {

        _callback();

        context.clearRect(0,0,Wall.GRID_WIDTH,Wall.GRID_HEIGHT);
        pixelate(1,img);

        setupWaveAnimation(_callback,TRANSITION_OUT);

      };

    },
    onUpdate: function() {

      index++;

      context.save();
      context.clearRect(0,0,Wall.GRID_WIDTH,Wall.GRID_HEIGHT);
      context.beginPath();
      context.moveTo(ease == TRANSITION_IN ? 0 : Wall.GRID_WIDTH,0);

      if(index >= step && index % step == 0) pixelArray.push(pixelArray.shift());

      // draw mask
      pixelArray.map((item,i) => {

        let pixelStep = item.step;
        context.lineTo(pixelStep * pixel, i * pixel);
        context.lineTo(pixelStep * pixel, i * pixel + pixel);

      });

      context.lineTo(ease == TRANSITION_IN ? 0 : Wall.GRID_WIDTH,pixelArray.length * pixel + pixel);
      context.closePath();
      context.clip();

      //context.drawImage(img,0,0);
      if(ease == TRANSITION_IN) {
        if(index >= (step * 2) && (index % (step * 2)) == 0) {

          let progress = this.progress();
          chunkSize = _.floor(progress,2);
          chunkSize = chunkSize < .1 ? .1 : chunkSize;
          chunkSize /= step;

        };
      };

      pixelate(chunkSize,img);
      context.restore();

      // draw wave
      pixelArray.map((item,i) => {

        let pixelStep = item.step;

        for(let j=waveWidth; j>=1; j--) {

          let alpha =  (Math.abs(j-waveWidth) / (waveWidth * 1.5));
          context.fillStyle = 'rgba(255,255,255,' + alpha + ')';
          context.fillRect((pixelStep * pixel) - ((pixel * j) * (ease == TRANSITION_IN ? 1 : -1)), i * pixel, pixel, pixel);

        };

      });

    }

  });


  // stop the timeline
  timeline.pause();

  let rows = Wall.GRID_HEIGHT / pixel;
  let maxStep = (Wall.GRID_WIDTH / pixel) + waveWidth;

  _.times(rows,function(i){

    // initalize the pixel array
    pixelArray.push({step: 0});
    let pulseValue =  i < rows * .5 ? i : Math.abs((rows * .5) - (i - (rows * .5)));

    timeline.insert(new TweenLite(pixelArray[i],(duration + pulse(pulseValue)),{

      step: maxStep,
      roundProps: 'step',
      ease: Linear.easeNone

    }));

  });

  timeline.play();

}

// ----------------------------------------------------

export const animate = (callback) => {


    let animation = _.sample(ANIMATION);

    switch (animation.type) {
      case ANIMATION_TYPE_WAVE:

          setupWaveAnimation(callback);

        break;
      default:

    }

}
