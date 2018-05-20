import createjs from 'preload-js';

const PROGRESS = "progress";
const FILELOAD = "fileload";
const COMPLETE = "complete";

export const loadManifest = (manifest,completeCallback,fileloadCallback) => {

  let queue = new createjs.LoadQueue();

  queue.setMaxConnections(10);
  queue.on(FILELOAD,fileloadCallback);
  queue.on(COMPLETE,completeCallback);

  console.log("start loading -> items:",manifest.length);
  queue.loadManifest(manifest);
  return queue;
}
