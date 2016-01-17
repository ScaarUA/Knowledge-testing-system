// Object.create()
if (typeof Object.create != 'function') {
  Object.create = (function() {
    function Temp() {}

    var hasOwn = Object.prototype.hasOwnProperty;

    return function (O) {
      if (typeof O != 'object') {
        throw TypeError('Object prototype may only be an Object or null');
      }

      Temp.prototype = O;
      var obj = new Temp();
      Temp.prototype = null;

      if (arguments.length > 1) {
        var Properties = Object(arguments[1]);
        for (var prop in Properties) {
          if (hasOwn.call(Properties, prop)) {
            obj[prop] = Properties[prop];
          }
        }
      }

      return obj;
    };
  })();
}

//AddEvent[Listener]
function addEvent(evnt, elem, func) {
   if (elem.addEventListener)  // W3C DOM
      elem.addEventListener(evnt,func,false);
   else if (elem.attachEvent) { // IE DOM
      elem.attachEvent("on"+evnt, func);
   }
   else { // No much to do
      elem[evnt] = func;
   }
}

// forEach()
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function (callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }
    var O = Object(this);
    var len = O.length >>> 0;

    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }

    if (arguments.length > 1) {
      T = thisArg;
    }

    k = 0;

    while (k < len) {

      var kValue;

      if (k in O) {

        kValue = O[k];

        callback.call(T, kValue, k, O);
      }
      k++;
    }
  };
}

// getElementsByClassName
(function () {
  if (!document.getElementsByClassName) {
    window.Element.prototype.getElementsByClassName = document.constructor.prototype.getElementsByClassName = function (classNames) {
      classNames || (classNames = '*');
      classNames = classNames.split(' ').join('.');
      
      if (classNames !== '*') {
        classNames = '.' + classNames;
      }
      
      return this.querySelectorAll(classNames);
    };  
  }
  
})();