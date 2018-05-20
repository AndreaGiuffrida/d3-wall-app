let cache = {};


export const getCachedImage = (id) => {
  return cache[id];
}

export const saveToCache = (img,id) => {
  cache[id] = img;
}
