(function() {
  
  /**
   * @namespace
   */
  fabric.util = { };
  
  /**
   * Removes value from an array.
   * Presence of value (and its position in an array) is determined via `Array.prototype.indexOf`
   * @static
   * @memberOf fabric.util
   * @method removeFromArray
   * @param {Array} array
   * @param {Any} value
   * @return {Array} original array
   */
  function removeFromArray(array, value) {
    var idx = array.indexOf(value);
    if (idx !== -1) {
      array.splice(idx, 1);
    }
    return array;
  };
  
  /**
   * Returns random number between 2 specified ones.
   * @static
   * @method getRandomInt
   * @memberOf fabric.util
   * @param {Number} min lower limit
   * @param {Number} max upper limit
   * @return {Number} random value (between min and max)
   */
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  var PiBy180 = Math.PI / 180;
  
  /**
   * Transforms degrees to radians.
   * @static
   * @method degreesToRadians
   * @memberOf fabric.util
   * @param {Number} degrees value in degrees
   * @return {Number} value in radians
   */
  function degreesToRadians(degrees) {
    return degrees * PiBy180;
  }
  
  /**
   * Rotates `point` around `origin` with `radians`
   * @static
   * @method rotatePoint
   * @memberOf fabric.util
   * @param {fabric.Point} The point to rotate
   * @param {fabric.Point} The origin of the rotation
   * @param {Number} The radians of the angle for the rotation
   * @return {fabric.Point} The new rotated point
   */
  function rotatePoint(point, origin, radians) {
    var sin = Math.sin(radians),
        cos = Math.cos(radians);
        
      point.subtractEquals(origin);
      
      var rx = point.x * cos - point.y * sin;
      var ry = point.x * sin + point.y * cos;
      
      return new fabric.Point(rx, ry).addEquals(origin);
  }
  
  /**
   * A wrapper around Number#toFixed, which contrary to native method returns number, not string.
   * @static
   * @method toFixed
   * @memberOf fabric.util
   * @param {Number | String} number number to operate on
   * @param {Number} fractionDigits number of fraction digits to "leave"
   * @return {Number}
   */
   function toFixed(number, fractionDigits) {
     return parseFloat(Number(number).toFixed(fractionDigits));
   }
   
   /**
    * Function which always returns `false`.
    * @static
    * @method falseFunction
    * @memberOf fabric.util
    * @return {Boolean}
    */
   function falseFunction() {
     return false;
   }
   
   /**
    * Changes value from one to another within certain period of time, invoking callbacks as value is being changed.
    * @method animate
    * @memberOf fabric.util
    * @param {Object} [options] Animation options
    * @param {Function} [options.onChange] Callback; invoked on every value change
    * @param {Function} [options.onComplete] Callback; invoked when value change is completed
    * @param {Number} [options.startValue=0] Starting value
    * @param {Number} [options.endValue=100] Ending value
    * @param {Function} [options.easing] Easing function
    * @param {Number} [options.duration=500] Duration of change
    */
  function animate(options) {

    options || (options = { });

    var start = +new Date(), 
      duration = options.duration || 500,
      finish = start + duration, time, pos,
      onChange = options.onChange || function() { },
      abort = options.abort || function() { return false; },
      easing = options.easing || function(pos) { return (-Math.cos(pos * Math.PI) / 2) + 0.5; },
      startValue = 'startValue' in options ? options.startValue : 0,
      endValue = 'endValue' in options ? options.endValue : 100;

    options.onStart && options.onStart();
    
    (function tick() {
      time = +new Date();
      pos = time > finish ? 1 : (time - start) / duration;
      onChange(startValue + (endValue - startValue) * easing(pos));
      if (time > finish || abort()) {
        options.onComplete && options.onComplete();
        return;
      }
      requestAnimFrame(tick);
    })();
  }
  
  /**
    * requestAnimationFrame polyfill from http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    * @method requestAnimFrame
    * @memberOf fabric.util
    * @param {Function} callback Callback to invoke
    * @param {DOMElement} element optional Element to associate with animation
    */
  var requestAnimFrame = (function() {
    return  fabric.window.requestAnimationFrame       || 
            fabric.window.webkitRequestAnimationFrame || 
            fabric.window.mozRequestAnimationFrame    || 
            fabric.window.oRequestAnimationFrame      || 
            fabric.window.msRequestAnimationFrame     || 
            function(callback, element) {
              fabric.window.setTimeout(callback, 1000 / 60);
            };
  })();

  /**
    * Loads image element from given url and passes it to a callback
    * @method loadImage
    * @memberOf fabric.util
    * @param {String} url URL representing an image
    * @param {Function} callback Callback; invoked with loaded image
    * @param {Any} context optional Context to invoke callback in
    */
  function loadImage(url, callback, context) {
    if (url) {
      var img = new Image();
      /** @ignore */
      img.onload = function () { 
        callback && callback.call(context, img);
        img = img.onload = null;
      };
      img.src = url;
    }
    else {
      callback && callback.call(context, url);
    }
  }

  fabric.util.removeFromArray = removeFromArray;
  fabric.util.degreesToRadians = degreesToRadians;
  fabric.util.rotatePoint = rotatePoint;
  fabric.util.toFixed = toFixed;
  fabric.util.getRandomInt = getRandomInt;
  fabric.util.falseFunction = falseFunction;
  fabric.util.animate = animate;
  fabric.util.requestAnimFrame = requestAnimFrame;
  fabric.util.loadImage = loadImage;
})();