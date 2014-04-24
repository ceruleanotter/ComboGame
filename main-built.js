(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.once = noop;
process.off = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],2:[function(require,module,exports){
var Actor, DisplayObjectContainer, HasPlugins, HasSignals, Repeater, Tween, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

cg = require('cg');

DisplayObjectContainer = require('rendering/DisplayObjectContainer');

Tween = require('Tween');

HasSignals = require('util/HasSignals');

HasPlugins = require('util/HasPlugins');

Repeater = (function() {
  function Repeater() {}

  return Repeater;

})();


/**
An `Actor` is an active entity within your `App`.

@class cg.Actor
@extends cg.rendering.DisplayObjectContainer
@uses cg.util.HasSignals

@constructor
@param [properties] {Object}
A set of name/value pairs that will be copied into the resulting `Actor` object.

@param [properties.controls] {ControlMap|String}
When a `String` is provided, it is converted to `cg.input.controls[properties.controls]` for convenience.
 */

Actor = (function(_super) {
  __extends(Actor, _super);

  Actor.mixin(HasSignals);

  Actor.mixin(HasPlugins);

  Actor.prototype.onMixin = function() {
    return Actor.__defineProperties.call(this);
  };

  Actor.prototype.__applyProperties = function(properties) {
    var k, v;
    if (properties == null) {
      properties = {};
    }
    if (this.__classes == null) {
      this.__classes = [];
    }
    for (k in properties) {
      if (!__hasProp.call(properties, k)) continue;
      v = properties[k];
      this[k] = v;
    }
    return this.className != null ? this.className : this.className = '';
  };

  function Actor(properties) {
    if (properties == null) {
      properties = {};
    }
    this.__defineProperties();
    this.__plugins_preInit();
    this.defineProperty('__internalID', {
      value: cg.getNextID()
    });
    Actor.__super__.constructor.apply(this, arguments);
    this.__applyProperties(properties);
    this.__plugins_postInit();
  }

  Actor.prototype.valueOf = function() {
    return this.__internalID;
  };


  /**
  Set the value of a property on this actor.
  
  @method set
  @param [property, value] {String, <Any>} Two arguments: property name and value you wish to change.
  @param [values] {Object} One argument: key-value hash of all properties you wish to set.
  @chainable
   */

  Actor.prototype.set = function() {
    var args, key, val, values;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (args.length === 1) {
      values = args[0];
    } else {
      values = {};
      values[args[0]] = args[1];
    }
    for (key in values) {
      if (!__hasProp.call(values, key)) continue;
      val = values[key];
      this[key] = val;
    }
    return this;
  };


  /**
  Reset a potentially-destroyed actor, optionally re-initializing some properties.
  
  Often used in conjunction with [`Pool::spawn`](cg.util.HasPooling.Pool.html#method_spawn).
  
  @method reset
  @param [properties] {Object} A set of properties/values to be applied to the actor.
  @chainable
   */

  Actor.prototype.reset = function(properties) {
    if (properties == null) {
      properties = {};
    }
    this.__plugins_preReset();
    this._destroyed = false;
    this.__applyProperties(properties);
    this.__plugins_postReset();
    return this;
  };

  Actor.prototype.__getId = function() {
    return this.__id;
  };

  Actor.prototype.__setId = function(val) {
    cg._setActorByID(this, val);
    return this.__id = val;
  };

  Actor.prototype.__getControls = function() {
    return this.__controls;
  };

  Actor.prototype.__setControls = function(val) {
    var _ref, _ref1;
    if ((_ref = this.__controls) != null) {
      if (typeof _ref.removeListener === "function") {
        _ref.removeListener(this);
      }
    }
    this.__controls = val;
    return (_ref1 = this.__controls) != null ? typeof _ref1.addListener === "function" ? _ref1.addListener(this) : void 0 : void 0;
  };

  Actor.prototype.__getClassName = function() {
    var _ref, _ref1;
    return (_ref = (_ref1 = this.__classes) != null ? _ref1.join(' ') : void 0) != null ? _ref : '';
  };

  Actor.prototype.__setClassName = function(val) {
    var className, __classes, _i, _j, _len, _ref, _results;
    if (this.__classes == null) {
      this.__classes = [];
    }
    if (val == null) {
      val = '';
    }
    __classes = val.split(' ');
    _ref = this.__classes;
    for (_i = _ref.length - 1; _i >= 0; _i += -1) {
      className = _ref[_i];
      if (__indexOf.call(__classes, className) >= 0) {
        continue;
      }
      this.removeClass(className);
    }
    _results = [];
    for (_j = 0, _len = __classes.length; _j < _len; _j++) {
      className = __classes[_j];
      if (__indexOf.call(this.__classes, className) >= 0) {
        continue;
      }
      _results.push(this.addClass(className));
    }
    return _results;
  };

  Actor.prototype.__getPaused = function() {
    return !!this.__paused;
  };

  Actor.prototype.__setPaused = function(value) {
    if (this.__paused === value) {
      return;
    }
    if (value) {
      this.broadcast('pause');
    } else {
      this.broadcast('resume');
    }
    return this.__paused = value;
  };

  Actor.prototype.__defineProperties = function() {

    /**
    A unique identifier for this actor; this can later be used to retrieve
    the actor with [`cg('#<id>')`](Game.html#method_default).
    
    @property id
    @type {String}
    @example
        actor.id = 'player'
        console.assert(actor === cg('#player')); // true
     */
    var _className, _controls, _id, _paused;
    _id = this.id;
    this.defineProperty('id', {
      get: this.__getId,
      set: this.__setId
    });
    if (_id != null) {
      this.id = _id;
    }

    /**
    A set of input controls that this actor shall listen to.
    
    Changing this property to a valid `ControlMap` will automatically register
    this actor with [`this.controls.addListener(this)`](cg.input.ControlMap.html#method_addListener), meaning that any
    action events that occur in the `ControlMap` will be redirected to this actor so
    that they may be captured with [`on`](#method_on).
    
    @example
        this.controls = new ControlMap({jump: 'space'}); // Spacebar triggers the jump event
        this.on('jump', this.jump);
    @property controls
    @type {ControlMap}
     */
    _controls = this.controls;
    this.defineProperty('controls', {
      get: this.__getControls,
      set: this.__setControls
    });
    if (_controls != null) {
      this.controls = _controls;
    }

    /**
    A string that represents what class(es) this actor belongs to, if any.
    
    This string may represent more than one class by separating classes with spaces.
    
    Updating this property automatically adds and removes this actor from
    the appropriate class groups in `cg.classes` for convenient access.
    
    See also:
    
      - [`addClass`](#method_addClass)
      - [`removeClass`](#method_removeClass)
      - [`hasClass`](#method_hasClass)
    
    @example
        this.className = 'fruit produce';
    
        if (cg.classes.fruit.contains(this)) {
          cg.log('Delicious fruit!');
        }
    
        if (cg.classes.produce.contains(this)) {
          cg.log('Fresh produce!');
        }
    
        // Result:
        // > Delicious fruit!
        // > Fresh produce!
    
    @property className
    @type {String}
     */
    _className = this.className;
    this.defineProperty('className', {
      get: this.__getClassName,
      set: this.__setClassName
    });
    if (_className != null) {
      this.className = _className;
    }

    /**
    If `true`, [`update`](#method_update) will not be exected during the game loop.
    
    Furthermore, any event listeners added to this actor with [`on`](#method_on) will be
    suppressed whenever `paused` is set to `true`.
    
    See also:
    
      * [`pause`](#method_pause)
      * [`resume`](#method_resume)
      * [`event:pause`](#event_pause)
      * [`event:resume`](#event_resume)
    @property paused {Boolean}
     */
    _paused = this.paused;
    this.defineProperty('paused', {
      get: this.__getPaused,
      set: this.__setPaused
    });
    if (_paused != null) {
      return this.paused = _paused;
    }
  };

  Actor.__defineProperties = function() {

    /**
    The horizontal position relative to `this.parent`.
    
    @property x
    @type {Number}
     */

    /**
    The vertical position relative to `this.parent`.
    
    @property y
    @type {Number}
     */

    /**
    Like [`paused`](#property_paused) but recursively factors in parent's paused status as well.
    
    `paused` could still be true, but if the parent is paused, this actor will not `update()`.
    
    @property worldPaused
    @type {Boolean}
    @readonly
     */
    this.defineProperty('worldPaused', {
      get: function() {
        var _ref;
        return this.paused || !!((_ref = this.parent) != null ? _ref.paused : void 0);
      }
    });

    /**
    Shorthand for `this.controls.actions`.
    
    @property actions
    @type {Object}
    @readonly
     */
    return this.defineProperty('actions', {
      get: function() {
        var _ref;
        return (_ref = this.controls) != null ? _ref.actions : void 0;
      }
    });
  };

  Actor.__defineProperties();


  /**
  Associate a new class name with this actor.
  
  Whitespace is removed. To add multiple classes, make multiple calls to [`addClass`](#method_addClass),
   or set [`className`](#property_className) directly.
  
  Empty class names are ignored.
  
  `this` will be added to the appropriate class group of `cg.classes`.
  
  [`className`](#property_className) will automatically be updated to reflect the addition of this class.
  
  @example
      this.addClass('fruit');
      this.addClass('produce');
  
      if (cg.classes.fruit.contains(this)) {
        cg.log('Delicious fruit!');
      }
  
      if (cg.classes.produce.contains(this)) {
        cg.log('Fresh produce!');
      }
  
      cg.log('this.className: "' + this.className + '"');
  
      // Result:
      // > Delicious fruit!
      // > Fresh produce!
      // > this.className = "fruit produce" // NOTE: Order of names may vary.
  
  @method addClass
  @param newClass {String} The name of the class to associate with this actor.
  @chainable
   */

  Actor.prototype.addClass = function(newClass) {
    newClass = newClass.replace(/\s/g, '').replace(/#/g, '');
    if (newClass.length === 0) {
      return this;
    }
    this.__classes.push(newClass);
    cg._addActorToClassGroup(this, newClass);
    return this;
  };


  /**
  Remove association of a class name from this actor.
  
  Empty class names are ignored.
  
  `this` will be removed from the appropriate class group of `cg.classes`.
  
  [`className`](#property_className) will automatically be updated to reflect the removal of this class.
  
  @example
      this.className = 'fruit produce';
      this.removeClass('fruit');
      this.removeClass('produce');
  
      if (cg.classes.fruit.contains(this)) {
        cg.log('Delicious fruit!');
      } else {
        cg.log('Not fruit!');
      }
  
      if (cg.classes.produce.contains(this)) {
        cg.log('Fresh produce!');
      } else {
        cg.log('Not produce!');
      }
  
      cg.log('this.className: "' + this.className + '"');
  
      // Result:
      // > Not fruit!
      // > Not produce!
      // > this.className: ""
  
  @method removeClass
  @param className {String} The name of the class to no longer associate with this actor.
  @chainable
   */

  Actor.prototype.removeClass = function(className) {
    var idx;
    idx = this.__classes.indexOf(className);
    if (idx < 0) {
      return this;
    }
    this.__classes.splice(idx, 1);
    cg._removeActorFromClassGroup(this, className);
    return this;
  };


  /**
  Query whether this actor is associated with a given class name.
  
  @method hasClass
  @param className {String} The name of the class to query.
  @return {Boolean} `true` if this actor is associated with `className`; `false` otherwise.
   */

  Actor.prototype.hasClass = function(className) {
    return this.__classes.indexOf(className) >= 0;
  };


  /**
  Call a function for each class name associated with this actor.
  
  The only argument passed to the function is a `String` of each class name.
  
  The value of `this` in the body of the function will be set to this `Actor` instance.
  
  **NOTE:** The order of the iteration is not specified, and may differ with each call to `forEachClass`.
  
  @example
      this.forEachClass(function(className) {
        cg.log('I am a member of the "' + className + '" class.');
      });
  
  @method forEachClass
  @param func {Function} The function to execute for each class.
  @chainable
   */

  Actor.prototype.forEachClass = function(func) {
    var className, _i, _ref;
    _ref = this.__classes;
    for (_i = _ref.length - 1; _i >= 0; _i += -1) {
      className = _ref[_i];
      func.call(this, className);
    }
    return this;
  };

  Actor.prototype.__hideOrShow = function(arg, params, cb, cbx) {
    var k, v, _ref;
    params.duration = 0;
    if (typeof arg === 'number') {
      params.duration = arg;
    } else if (typeof arg === 'object') {
      for (k in arg) {
        if (!__hasProp.call(arg, k)) continue;
        v = arg[k];
        params[k] = v;
      }
    }
    params.immediate = false;
    if ((_ref = this.__hideShowTween) != null) {
      _ref.stop();
    }
    this.__hideShowTween = new Tween(this, params);
    this.__hideShowTween.start().then(cb).then(cbx);
    return this.__hideShowTween;
  };

  Actor.prototype.__hide = function() {
    this.visible = false;
    return this.pause();
  };


  /**
  Hide this actor, with an optional "fade out" animation.
  
  @example
      // Immediately hide the actor.
      this.hide();
  
  @example
      // Fade the actor out for 500 ms and then hide it.
      this.hide(500);
  
  @example
      // After the actor is hidden, execute a function.
      this.hide(500).then(function() {
        cg.log('I have finished fading out!');
      });
  
  @example
      // Hide the actor using a custom tween animation.
      var tweenParams = {
        values: {
          scaleX: 0 // "Squeeze" the actor horizontally
        },
        duration: 250
      };
  
      this.hide(tweenParams);
  
  @method hide
  @param [duration|params] {Number(milliseconds)|Object}
  One of the following:
  
    1. `duration`: The number of milliseconds for the "fade out" animation to take before hiding the actor.
    2. `params`: An object whose properties will be used to create a `Tween` that will execute before finally hiding this actor.
  @param [callback] {Function} A callback to execute once the "fade out" animation completes.
  
  See also:
  
    * [`show`](#method_show)
    * [`tween`](#method_tween)
  
  @return {Promise} A promise that will be resolved once this actor is completely hidden.
   */

  Actor.prototype.hide = function(arg, cb) {
    var params;
    params = {
      values: {
        alpha: 0
      }
    };
    return this.__hideOrShow(arg, params, this.__hide, cb);
  };

  Actor.prototype.__show = function() {
    return this.resume();
  };


  /**
  Show (unhide) this actor, with an optional "fade in" animation.
  
  @example
      // Immediately show the actor.
      this.show();
  
  @example
      // Show the actor, then fade it in for 500 ms.
      this.show(500);
  
  @example
      // After the actor fades in, execute a function.
      this.show(500).then(function() {
        cg.log('I have finished fading in!');
      });
  
  @example
      // Show the actor using a custom tween animation.
      var tweenParams = {
        values: {
          scaleX: 1 // "Open" the actor horizontally
        },
        duration: 250
      };
  
      this.scaleX = 0;
      this.show(tweenParams);
  
  @method show
  @param [duration|params] {Number(milliseconds)|Object}
  One of the following:
  1. `duration`: The number of milliseconds for the "fade in" animation to take after showing the actor.
  2. `params`: An object whose properties will be used to create a `Tween` that will execute after showing this actor.
  
  @return {Promise} A promise that will be resolved once the "fade in" animation completes.
  
  See also:
  
    * [`hide`](#method_hide)
    * [`tween`](#method_tween)
   */

  Actor.prototype.show = function(arg, cb) {
    var params;
    this.visible = true;
    params = {
      values: {
        alpha: 1
      }
    };
    return this.__hideOrShow(arg, params, this.__show, cb);
  };


  /**
  Prevent [`update`](#method_update) from being called.
  
  Also suppresses any event listeners that bound with [`on`](#method_on).
  
  @method pause
  @chainable
   */


  /**
  Fired *immediately* when [`pause`](#method_pause) is called.
  
  @event pause
   */

  Actor.prototype.pause = function() {
    this.paused = true;
    return this;
  };


  /**
  Allow [`update`](#method_update) to be called.
  
  @method resume
  @chainable
   */


  /**
  Fired *immediately* when [`resume`](#method_resume) is called.
  
  @event resume
   */

  Actor.prototype.resume = function() {
    this.paused = false;
    return this;
  };


  /**
  Remove this actor from the app.
  
  `update()` will never be executed after `destroy()` is called.
  
  This `Actor` is finally removed from the app's display list at the end of the app's `update` cycle.
  @method destroy
  @chainable
   */


  /**
  Fired *immediately* when `this.destroy()` is called.
  
  @event destroy
   */

  Actor.prototype.destroy = function() {
    var t, _i, _ref;
    this.__plugins_preDispose();
    this.emit('destroy', this);
    this.broadcast('__destroy__', this);
    this._destroyed = true;
    this.visible = false;
    cg._dispose(this);
    this.className = '';
    if (this.__tweens != null) {
      _ref = this.__tweens;
      for (_i = _ref.length - 1; _i >= 0; _i += -1) {
        t = _ref[_i];
        t.stop();
      }
    }
    return this;
  };

  Actor.prototype._dispose = function() {
    var _ref, _ref1;
    this._disposeListeners();
    if ((_ref = this.controls) != null) {
      if (typeof _ref.removeListener === "function") {
        _ref.removeListener(this);
      }
    }
    if ((_ref1 = this.parent) != null) {
      if (typeof _ref1.removeChild === "function") {
        _ref1.removeChild(this);
      }
    }
    return this.__plugins_postDispose();
  };


  /**
  Called once every update-cycle of the app, unless the [`paused`](#property_paused) is `true`.
  
  Any [`children`](#property_children) that aren't paused get updated here, therefore it is essential
  to call `super` in any `update` methods that are inherited from this one.
  
  **Important Note**: Since paused children are not updated, neither are any of *their* children, whether
  the children themselves are paused or not.
  @method update
   */


  /**
  Fired *immediately* before `update` is called.
  @event update
   */

  Actor.prototype.update = function() {
    var c, _i, _len, _ref;
    this.__plugins_preUpdate();
    _ref = this.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      if (c.paused || c._destroyed) {
        continue;
      }
      if (typeof c.emit === "function") {
        c.emit('update');
      }
      if (typeof c.update === "function") {
        c.update();
      }
    }
    this.__plugins_postUpdate();
  };

  Actor.prototype.__registerTween = function(tween) {
    if (this.__tweens == null) {
      this.__tweens = [];
    }
    this.__tweens.push(tween);
    return this.on(tween, 'removed', function() {
      return this.__tweens.splice(this.__tweens.indexOf(tween), 1);
    });
  };


  /**
  "Ease" this actor's numeric property (or number of properties) from one value to another.
  
  @method tween
  @param [params] {Object} Parameters that define how the `Tween` should behave (see below).
  @param [params.values] {Object} A key-value pair of the final values to be applied to this actor.
  @param [params.duration=500] {Number(milliseconds)} The span of time over which this actor's `value`s should be tweened.
  @param [params.easeFunc=`Tween.Quadratic.InOut`] {Function}
  @param [params.delay=0] {Number(milliseconds)} The amount of time after `start` is called before the tween should begin.
  @param [params.relative=false] {Boolean} Whether `values` should represent a delta to be added to this actor's current values, rather than the absolute final values.
  @param [params.tweener=this.scene.tweener] {TweenManager} The `TweenManager` to be used to drive this `Tween`.
  @param [params.immediate=true] {Boolean} If true, `start()` will be called immediately on the resulting `Tween`.
  @return {Promise} A promise that will be resolved when this tween completes, or rejected when `stop()` is called.
   */

  Actor.prototype.tween = function() {
    var delay, duration, easeFunc, obj, object, params, property, t, value, values, _i;
    object = 6 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 5) : (_i = 0, []), property = arguments[_i++], value = arguments[_i++], duration = arguments[_i++], easeFunc = arguments[_i++], delay = arguments[_i++];
    if (object.length === 0) {
      obj = this;
    } else {
      obj = object[0];
    }
    if (typeof property === 'object') {
      params = property;
    } else {
      values = {};
      values[property] = value;
      params = {
        values: values,
        duration: duration,
        easeFunc: easeFunc,
        delay: delay
      };
    }
    if (this.scene != null) {
      if (params.tweener == null) {
        params.tweener = this.scene.tweener;
      }
    }
    t = new Tween(obj, params);
    this.__registerTween(t);
    return t;
  };

  Actor.prototype.__blinkOn = function() {
    var _ref;
    this.visible = true;
    if ((_ref = this.__blinkDelay) != null) {
      _ref.stop();
    }
    return this.__blinkDelay = this.delay(this.__blinkOnDuration, this.__blinkOff);
  };

  Actor.prototype.__blinkOff = function() {
    var _ref;
    this.visible = false;
    if ((_ref = this.__blinkDelay) != null) {
      _ref.stop();
    }
    return this.__blinkDelay = this.delay(this.__blinkOffDuration, this.__blinkOn);
  };

  Actor.prototype.__blinkStop = function() {
    var _ref;
    if ((_ref = this.__blinkDelay) != null) {
      _ref.stop();
    }
    return this.visible = true;
  };


  /**
  Cause this actor to blink on and off by periodically toggling `this.visible`.
  
  To cancel blinking, pass a "falsy" value (i.e. `false`, `0`).
  
  @method blink
  @param [onDuration=500] {Number(milliseconds)} The duration to blink "on"
  @param [offDuration=onDuration] {Number(milliseconds)} The duration to blink "off"
   */

  Actor.prototype.blink = function(__blinkOnDuration, __blinkOffDuration, lifetime) {
    this.__blinkOnDuration = __blinkOnDuration != null ? __blinkOnDuration : 500;
    this.__blinkOffDuration = __blinkOffDuration != null ? __blinkOffDuration : this.__blinkOnDuration;
    if (!this.__blinkOnDuration) {
      this.__blinkStop();
      return this;
    }
    if (this.visible) {
      this.__blinkOff();
    } else {
      this.__blinkOn();
    }
    if (typeof lifetime === 'number') {
      this.delay(lifetime, this.__blinkStop);
    }
    return this;
  };

  Actor.prototype.__animateStop = function() {
    var _ref;
    if ((_ref = this.__animateTween) != null) {
      _ref.stop();
    }
    return delete this.__animateTweens;
  };


  /**
  TODOC
  
  @method animate
  @example
       * Pulse on and off...
      this.animate(
        ['alpha', 0],
        ['alpha', 1]
      )
   */

  Actor.prototype.animate = function() {
    var argList, argLists, cb, count, previousTween, tween, _fn, _i;
    argLists = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (arguments[0] === false) {
      this.__animateStop();
      return this;
    }
    previousTween = null;
    this.__animateTweens = [];
    _fn = function(previousTween) {
      return tween.on('complete', function() {
        if (previousTween != null) {
          return this.__animateTween = previousTween.start();
        }
      });
    };
    for (_i = argLists.length - 1; _i >= 0; _i += -1) {
      argList = argLists[_i];
      if ((typeof cb === "undefined" || cb === null) && (typeof argList === 'function')) {
        cb = argList;
        continue;
      }
      if ((typeof count === "undefined" || count === null) && (typeof argList === 'number')) {
        count = argList;
        continue;
      }
      if (cg.util.isArray(argList)) {
        tween = (function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args);
          return Object(result) === result ? result : child;
        })(Tween, [this].concat(__slice.call(argList)), function(){});
      } else {
        tween = new Tween(this, argList);
      }
      tween.stop();
      this.__animateTweens.unshift(tween);
      _fn(previousTween);
      previousTween = tween;
    }
    this.__animateTweens[this.__animateTweens.length - 1].on('complete', function() {
      if (cb != null) {
        cb.call(this);
      }
      if ((count == null) || --count > 0) {
        return this.__animateTween = tween.start();
      }
    });
    this.__animateTween = tween != null ? tween.start() : void 0;
    return this;
  };


  /**
  Invoke a function on this actor after a specified duration.
  
  The delay is synchronized with this actor's [scene](#property_scene).
  
  To cancel the callback function, call `stop()` on the returned `Tween` object.
  
  @example
      t = this.delay(1000, function() {
        cg.log("One second has passed!");
      }).then(function() {
        cg.log("Two")
      });
  
      t.stop(); // This will cancel the delay.
  @method delay
  @param time {Number(milliseconds)} The time to wait before invoking `func`.
  @param func {Function} The function to call; the value of `this` inside the body of the function will be this `Actor` instance.
  @return {cg.Tween} The `Tween` object that controls this delay.
   */


  /*
  TODO: make it easy to chain tweens and delays and other self-functions
  eg:
  
      this.delay(100).tween({
        values: { alpha: 0 },
        duration: 100
      }).delay(100).then(function() {
        cg.log('all done!'); // Called after 300ms (delay(100), tween(100), delay(100))
      });
   */

  Actor.prototype.delay = function(time, func) {
    var t, tweener;
    if (this.tweener != null) {
      tweener = this.tweener;
    } else if (this.scene != null) {
      tweener = this.scene.tweener;
    } else {
      tweener = cg.tweener;
    }
    t = new Tween(this, {
      duration: time,
      immediate: false,
      tweener: tweener
    });
    this.__registerTween(t);
    t.start().then(func);
    return t;
  };


  /**
  Repeatedly invoke a function on this actor at a fixed interval.
  
  @method repeat
  @param time {Number(milliseconds)} The period between each invocation of `func`.
  @param func {Function} The function to call; the value of `this` inside the body of the function will be this `Actor` instance.
  @param [count] {Number} If specified, the number of times for `func` to be invoked.
  @return {Repeater} A reference to the repeater; pass to [`cancelRepeat`](#method_cancelRepeat) to stop repeating.
   */

  Actor.prototype.repeat = function() {
    var count, func, ref, time, _i;
    time = arguments[0], count = 4 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 2) : (_i = 1, []), func = arguments[_i++], ref = arguments[_i++];
    count = count[0];
    if (ref == null) {
      ref = new Repeater;
    }
    ref.hook = this.delay(time, function() {
      if ((func.call(this) !== false) && ((count == null) || count-- > 0)) {
        return this.repeat(time, count, func, ref);
      }
    });
    return ref;
  };

  Actor.prototype.cancelRepeat = function(ref) {
    var _ref;
    if (ref != null) {
      if ((_ref = ref.hook) != null) {
        if (typeof _ref.stop === "function") {
          _ref.stop();
        }
      }
    }
  };


  /**
  Calculate a vector going from this actor to some other point.
  
  @method vecTo
  @param other {Object} something that has `x` and `y` properties, like an actor or a vector.
   */

  Actor.prototype.vecTo = function(other) {
    return cg.math.Vector2.prototype.sub.call(other, this);
  };


  /**
  Shorthand for `this.vecTo(cg.input.mouse)`.
  
  @method vecToMouse
   */

  Actor.prototype.vecToMouse = function() {
    return this.vecTo(cg.input.mouse);
  };

  return Actor;

})(DisplayObjectContainer);

module.exports = Actor;


},{"Tween":11,"cg":13,"rendering/DisplayObjectContainer":52,"util/HasPlugins":91,"util/HasSignals":93}],3:[function(require,module,exports){
var Animation, HasSignals, Module, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Module = require('Module');

HasSignals = require('util/HasSignals');


/**
A series of textures that can be displayed one frame at a time.

@class cg.Animation
@extends cg.Module
@uses cg.util.HasSignals

@constructor
@param frames {Array(String|Texture|Array[2](String|Texture,Number))}
An array of frames.

Each frame can be represented either by a single `Texture`, or by a two-element array containing a `Texture`
and a number representing how long the frame's duration is, respectively.

`String` values will be interpretted as asset names -- i.e., the string `'bullet'` becomes `cg.assets.textures.bullet`.

If no explicit duration is specified for a frame, it is shown for the default specified `frameLength`.
@param [frameLength=10] {Number(milliseconds)} Default duration for each frame.
@param [looping=true] {Boolean} Whether the animation should repeat endlessly.

@example
    // Create a 5-frame, looping animation with 30ms between each frame.
    // 'f0' is shorthand for cg.assets.textures.f0
    var anim = new Animation(['f0', 'f1', 'f2', 'f3', 'f4'], 30);

@example
    // Create a non-looping animation with a mixture of custom and default frame lengths:
    var anim = new Animation([
      ['f0', 60], // Display for 60ms (override)
      'f1',       // Display for 30ms (supplied default)
      'f2',       // Display for 30ms (supplied default)
      'f3',       // Display for 30ms (supplied default)
      ['f4', 100] // Display for 100ms (override)
    ], 30, false);
 */

Animation = (function(_super) {
  __extends(Animation, _super);

  Animation.mixin(HasSignals);

  Object.defineProperty(Animation.prototype, 'looping', {
    get: function() {
      return this.__looping;
    },
    set: function(val) {
      this.__looping = val;
      if (val) {
        return this.update = this.__looping_update;
      } else {
        return this.update = this.__oneshot_update;
      }
    }
  });

  function Animation(frames, frameLength, looping) {
    var frame, i, _i, _len, _ref;
    this.frames = frames;
    this.frameLength = frameLength != null ? frameLength : 10;
    this.looping = looping != null ? looping : true;
    _ref = this.frames;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      frame = _ref[i];
      if (typeof frame === 'string') {
        this.frames[i] = cg.assets.textures[frame];
      } else if (cg.util.isArray(frame)) {
        if (typeof frame[0] === 'string') {
          frame[0] = cg.assets.textures[frame[0]];
        }
      } else if (!frame instanceof cg.Texture) {
        throw new Error('Animation: Invalid frame type for frame #' + i);
      }
    }
    this.rewind();
  }


  /**
  Retrieve the `Texture` associated with a given frame index.
  
  @method getFrame
  @param index {Number} The index into this animation's frame list.
  @return {cg.Texture} The texture for the frame at the specified frame number.
  
  `null` is returned when `index` is out of range.
   */

  Animation.prototype.getFrame = function(index) {
    if (index >= this.frames.length) {
      return null;
    }
    return this.frames[index][0] || this.frames[index];
  };


  /**
  Reset the animation's current frame to the beginning.
  
  This will set the current frame back to 0, but will not resume
  playing if it is paused.
  
  Calling this method will always trigger a [`newFrame`](#event_newFrame) event.
  
  @method rewind
  @chainable
   */

  Animation.prototype.rewind = function() {
    this.done = false;
    this.frameNum = 0;
    this.nextFrame = this.frames[this.frameNum][1] || this.frameLength;
    this.texture = this.frames[this.frameNum][0] || this.frames[this.frameNum];
    this.emit('newFrame', this.texture);
    return this;
  };


  /**
  Halt the playback of this `Animation`.
  
  @method pause
  @chainable
   */

  Animation.prototype.pause = function() {
    this.paused = true;
    return this;
  };


  /**
  Continue the playback of this `Animation`.
  
  This will not reset the animation to the beginning if it has completed; use `rewind` instead.
  @method resume
  @chainable
   */

  Animation.prototype.resume = function() {
    this.paused = false;
    return this;
  };


  /**
  Fired *immediately after* this `Animation`'s frame number goes from the last back to `0`.
  @event end
   */


  /**
  Fired whenever this `Animation`'s current frame number changes (even if the previous frame is identical).
  @event newFrame
  @param texture {Texture} The new current texture of this animation.
   */


  /**
  Tick the timer of this `Animation` forward.
  
  If paused, or completed and not looping, this does nothing.
  Otherwise, it will advance the internal timer of the animation by `cg.dt`.
  
  This is used internally by [`SpriteActor`s with the `anim`](cg.SpriteActor.html#property_anim) property set.
  
  @method update
  @protected
   */

  Animation.prototype.__looping_update = function() {
    if (this.paused) {
      return;
    }
    this.nextFrame -= cg.dt;
    if (this.nextFrame > 0) {
      return;
    }
    this.frameNum = (this.frameNum + 1) % this.frames.length;
    this.texture = this.frames[this.frameNum][0] || this.frames[this.frameNum];
    this.nextFrame += this.frames[this.frameNum][1] || this.frameLength;
    this.emit('newFrame', this.texture);
    if (this.frameNum === 0) {
      return this.emit('end');
    }
  };

  Animation.prototype.__oneshot_update = function() {
    if (this.done || this.paused) {
      return;
    }
    this.nextFrame -= cg.dt;
    if (this.nextFrame > 0) {
      return;
    }
    this.frameNum = this.frameNum + 1;
    if (this.frameNum >= this.frames.length) {
      this.done = true;
      return this.emit('end');
    } else {
      this.texture = this.frames[this.frameNum][0] || this.frames[this.frameNum];
      this.nextFrame += this.frames[this.frameNum][1] || this.frameLength;
      return this.emit('newFrame', this.texture);
    }
  };

  return Animation;

})(Module);

module.exports = Animation;


},{"Module":6,"cg":13,"util/HasSignals":93}],4:[function(require,module,exports){
var AssetManager, BitmapFont, Deferred, Module, Music, Promises, Scene, Sound, Texture, TileSheet, async, cg, __NOOP__,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

async = require('util/async');

cg = require('cg');

Module = require('Module');

Scene = require('Scene');

Promises = require('util/Promises');

Texture = require('rendering/textures/Texture');

Sound = require('sound/Sound');

Music = require('sound/Music');

TileSheet = require('TileSheet');

BitmapFont = require('text/BitmapFont');

Deferred = Promises.Deferred;

__NOOP__ = function() {};


/**
A central place to load assets (textures, sounds, music, JSON, etc.)

@class cg.AssetManager
@extends cg.Module
 */

AssetManager = (function(_super) {
  __extends(AssetManager, _super);

  AssetManager.textureTypes = ['jpeg', 'jpg', 'png', 'gif'];

  AssetManager._textureCache = {};

  function AssetManager() {
    this.music = {};
    this.sounds = {};
    this.textures = {};
    this.sheets = {};
    this.json = {};
    this.text = {};
    this.fonts = {};
  }


  /**
  Load a `Texture` from an image file.
  
  @method loadTexture
  @param path {String} The path (URL) of the texture file to load.
  @return {Promise} A promise that will resolve a `Texture` once it finishes loading, or reject if it fails to load.
  @example
      cg.assets.loadTexture('assets/bacon.png').then(function (texture) {
        cg.log('Delicious bacon!');
        cg.log('Bacon width: ' + texture.width);
        cg.log('Bacon height: ' + texture.height);
      }, function () {
        cg.error('Failed to load delicious bacon.');
      });
   */

  AssetManager.prototype.loadTexture = function(path) {
    throw new Error('Unimplemented AssetManager::loadTexture was called; this method must be overridden in your AssetManager implementation.');
  };


  /**
  Load and parse JSON from a file.
  
  @method loadJSON
  @param path {String} The path (URL) of the json file to load.
  @return {Promise} A promise that will resolve a parsed object literal once the file finishes loading, or reject if it fails to load.
  @example
      cg.assets.loadJSON('assets/preferences.json').then(function (preferences) {
        cg.backgroundColor = preferences.backgroundColor;
      }, function () {
        cg.error('Failed to load preferences file!');
      });
   */

  AssetManager.prototype.loadJSON = function(path) {
    throw new Error('Unimplemented AssetManager::loadJSON was called; this method must be overridden in your AssetManager implementation.');
  };


  /**
  Load a `Texture` and chop it up into a fixed-size `TileSheet`
  *or* [Texture Packer](http://www.codeandweb.com/texturepacker) atlas in JSON format.
  
  @method loadSpritesheet
  @param path {String} Tye path (URL) of either an image file, or texture atlas file.
  
  If `tileW` and `tileH` are specified, this value will be assumed to be an image, otherwise
  it is assumed to be a texture atlas file.
  
  @param [tileW] {Number}
  @param [tileH] {Number}
  @return {Promise} A promise that resolves one of two things:
    1. If only `path` is specified, a plain javascript object that maps texture file paths to `Texture` objects (eg. `textures['assets/bacon.jpg']`)
    2. If `tileW` and `tileH` are specified, a `TileSheet` made of a `Texture` loaded from `path`, with tiles of size `tileW`x`tileH`
   */

  AssetManager.prototype.loadSpritesheet = function(path, tileW, tileH) {
    var deferred, textures;
    deferred = new Deferred(this);
    textures = {};
    if ((typeof tileW === 'number') && (typeof tileH === 'number')) {
      this.loadTexture(path).then((function(_this) {
        return function(texture) {
          return deferred.resolve(TileSheet.create(texture, tileW, tileH));
        };
      })(this), (function(_this) {
        return function(error) {
          return deferred.reject(error);
        };
      })(this));
    } else {
      this.loadJSON(path).then((function(_this) {
        return function(json) {
          var texturePath;
          texturePath = json.meta.image;
          return _this.loadTexture(texturePath).then(function(baseTexture) {
            var frame, frameData, name, rect;
            frameData = json.frames;
            for (name in frameData) {
              rect = frameData[name].frame;
              if (!rect) {
                continue;
              }
              frame = {
                x: rect.x,
                y: rect.y,
                width: rect.w,
                height: rect.h
              };
              textures[name] = AssetManager._textureCache[name] = new Texture(baseTexture, frame);
              if (!frameData[name].trimmed) {
                continue;
              }
              textures[name].realSize = frameData[name].spriteSourceSize;
              textures[name].trim.x = 0;
            }
            return deferred.resolve(textures);
          });
        };
      })(this), (function(_this) {
        return function(error) {
          return deferred.reject(error);
        };
      })(this));
    }
    return deferred.promise;
  };


  /**
  Load a `BitmapFont` from a texture path.
  
  @method loadBitmapFont
  @param path {String} The path (URL) of the font's texture file.
  @param [spacing] {Number} Passed to the [`BitmapFont`](BitmapFont.html) constructor.
  @param [lineHeight] {Number} Passed to the [`BitmapFont`](BitmapFont.html) constructor.
   */

  AssetManager.prototype.loadBitmapFont = function(path, spacing, lineHeight) {
    var deferred;
    deferred = new Deferred(this);
    this.loadTexture(path).then((function(_this) {
      return function(texture) {
        return deferred.resolve(new BitmapFont(texture, spacing, lineHeight));
      };
    })(this), (function(_this) {
      return function(error) {
        return deferred.reject(error);
      };
    })(this));
    return deferred.promise;
  };


  /**
  Load a `Sound` file.
  
  @method loadSound
  @param paths {String|Array<String>} The path(s) (URL[s]) to attempt to load the sound from.
  
  The paths will be attempted to load in the order of the array, if an array is specified.
  
  @param numChannels {Number} The value to set the sound's [`numChannels`](cg.sound.Sound.html#property_numChannels) property to.
   */

  AssetManager.prototype.loadSound = function(paths, numChannels) {
    throw new Error('Unimplemented AssetManager::loadSound was called; this method must be overridden in your AssetManager implementation.');
  };


  /**
  Load a `Music` file.
  
  @method loadSound
  @param paths {String|Array<String>} The path(s) (URL[s]) to attempt to load the sound from.
  
  The paths will be attempted to load in the order of the array, if an array is specified.
   */

  AssetManager.prototype.loadMusic = function(paths) {
    throw new Error('Unimplemented AssetManager::loadMusic was called; this method must be overridden in your AssetManager implementation.');
  };


  /**
  Pre-load all assets (textures, sounds, music, text, etc) from a pack of assets.
  
  @method preload
  @param pack {Object} Container of asset definitions.
  
  @param [pack.textures] {Object}
  Example:
      textures: {
        bullet: 'assets/bullet.png',
        ship: 'assets/ship.png'
      }
  
  @param [pack.sheets] {Object}
  Example:
      sheets: {
        tileset: ['assets/tileset.png', 20, 20],
        packedTextures: 'assets/packedTextures.json'
      }
  
  @param [pack.sounds] {Object}
  Example:
      sounds: {
        shoot: ['assets/pew.ogg', 'assets/pew.mp3', 'assets/pew.m4a'],
        boom: ['assets/boom.ogg', 'assets/boom.mp3', 'assets/boom.m4a']
      }
  
  @param [pack.music] {Object}
  Example:
      music: {
        menu: ['assets/menu.ogg', 'assets/menu.mp3', 'assets/menu.m4a'],
        battle: ['assets/battle.ogg', 'assets/battle.mp3', 'assets/battle.m4a']
      }
  
  @param handlers {Object}
  @param handlers.error {Function}
  Callback that excutes if an asset fails to load.
  
  Callback Arguments:
  
  - `src` (`String`) -- the path of the asset that failed to load.
  
  Example:
      var errorCallback = function (src) {
        cg.error(src + ' failed to load!');
      };
  
  @param handlers.progress {Function}
  Callback that executes whenever a single asset from the pack is loaded.
  
  Callback Arguments:
  
  - `src` (`String`) -- the path of the asset that failed to load.
  - `asset` (`Texture|Sound|Music|String`) -- the final loaded version of the asset.
  - `loaded` (`Number`) -- the number of assets that have been loaded, including the one that triggered this callback.
  - `count` (`Number`) -- the total number of assets in the pack.
  
  Example:
      var progressCallback = function (src, asset, loaded, asset_count) {
        cg.log('Loaded asset "' + src + '"');
        cg.log('Loaded ' + loaded + ' out of ' + count + ' assets.');
      };
  
  @param handlers.complete {Function}
  Callback that executes whenever a single asset from the pack is loaded.
  
  Callback Arguments:
  
  None.
  
  Example:
      var completeCallback = function () {
        cg.log('Preloading complete!');
      };
  
  @param [concurrency=1] {Number} The number of files to load simultaneously.
  
  @example
      var assets = {
        textures: {
          bullet: 'assets/bullet.png',
          ship: 'assets/ship.png'
        },
        sounds: {
          shoot: ['assets/pew.ogg', 'assets/pew.mp3', 'assets/pew.m4a'],
          boom: ['assets/boom.ogg', 'assets/boom.mp3', 'assets/boom.m4a']
        },
        music: {
          menu: ['assets/menu.ogg', 'assets/menu.mp3', 'assets/menu.m4a'],
          battle: ['assets/battle.ogg', 'assets/battle.mp3', 'assets/battle.m4a']
        },
        json: {
          level1: 'assets/level1.json',
          level2: 'assets/level2.json',
          enemyTypes: 'assets/enemyTypes.json'
        },
        sheets: {
          tileset: ['assets/tileset.png', 20, 20]
        }
      };
  
      var callbacks = {
        error: function (src) {
          cg.error('Failed to load ' + src);
        },
        progress: function (src, asset, loaded, asset_count) {
          cg.log('Loaded asset "' + src + '"');
          cg.log('Loaded ' + loaded + ' out of ' + count + ' assets.');
        },
        complete: function () {
          cg.log('Preloading complete!');
        }
      };
  
      cg.assets.preload(assets, callbacks);
   */

  AssetManager.prototype.preload = function(pack, handlers, concurrency) {
    var asset_count, assets, data, font_count, getSoundData, json_count, loadFont, loadGfx, loadJSON, loadMusic, loadSfx, loadSpritesheet, loadText, loaded, music_count, name, path, sheet_count, sound_count, text_count, texture_count;
    if (concurrency == null) {
      concurrency = 1;
    }
    music_count = cg.util.sizeOf(pack.music);
    sound_count = cg.util.sizeOf(pack.sounds);
    sheet_count = cg.util.sizeOf(pack.sheets);
    texture_count = cg.util.sizeOf(pack.textures);
    font_count = cg.util.sizeOf(pack.fonts);
    text_count = cg.util.sizeOf(pack.text);
    json_count = cg.util.sizeOf(pack.json);
    asset_count = texture_count + sound_count + music_count + sheet_count;
    loaded = 0;
    cg.log('Pre-loading assets...');
    assets = [];
    getSoundData = (function(_this) {
      return function(asset) {
        var data;
        data = {};
        switch (typeof asset.data) {
          case 'string':
            data.paths = asset.data;
            break;
          case 'object':
            if (asset.data.paths != null) {
              data.paths = asset.data.paths;
            } else {
              data.paths = asset.data;
            }
        }
        if (typeof data.paths === 'string') {
          data.paths = data.paths;
        }
        if (typeof asset.data.numChannels === 'number') {
          data.numChannels = asset.data.numChannels;
        }
        if (typeof asset.data.volume === 'number') {
          data.volume = asset.data.volume;
        } else {
          data.volume = 1;
        }
        return data;
      };
    })(this);
    assets.push.apply(assets, (function() {
      var _ref, _results;
      _ref = pack.music;
      _results = [];
      for (name in _ref) {
        if (!__hasProp.call(_ref, name)) continue;
        data = _ref[name];
        _results.push({
          name: name,
          data: data,
          type: 'music'
        });
      }
      return _results;
    })());
    loadMusic = (function(_this) {
      return function(asset, cb) {
        var done;
        done = function(music) {
          _this.music[asset.name] = music;
          ++loaded;
          handlers.progress(music.path, music, loaded, asset_count);
          return cb();
        };
        data = getSoundData(asset);
        return _this.loadMusic(data.paths, data.volume).then(function(music) {
          return done(music);
        }, function(err) {
          var music;
          music = {};
          music.play = __NOOP__;
          music.stop = __NOOP__;
          music.path = 'DUMMY(' + data.paths + ')';
          handlers.error(data.paths);
          return done(music);
        });
      };
    })(this);
    assets.push.apply(assets, (function() {
      var _ref, _results;
      _ref = pack.sounds;
      _results = [];
      for (name in _ref) {
        if (!__hasProp.call(_ref, name)) continue;
        data = _ref[name];
        _results.push({
          name: name,
          data: data,
          type: 'sound'
        });
      }
      return _results;
    })());
    loadSfx = (function(_this) {
      return function(asset, cb) {
        var done;
        done = function(sound) {
          _this.sounds[asset.name] = sound;
          ++loaded;
          handlers.progress(sound.path, sound, loaded, asset_count);
          return cb();
        };
        data = getSoundData(asset);
        return _this.loadSound(data.paths, data.volume, data.numChannels).then(function(sound) {
          return done(sound);
        }, function(err) {
          var sound;
          sound = {};
          sound.play = __NOOP__;
          sound.stop = __NOOP__;
          sound.path = 'DUMMY(' + data.paths + ')';
          handlers.error(data.paths);
          return done(sound);
        });
      };
    })(this);
    assets.push.apply(assets, (function() {
      var _ref, _results;
      _ref = pack.sheets;
      _results = [];
      for (name in _ref) {
        if (!__hasProp.call(_ref, name)) continue;
        data = _ref[name];
        _results.push({
          name: name,
          data: data,
          type: 'sheet'
        });
      }
      return _results;
    })());
    loadSpritesheet = (function(_this) {
      return function(asset, cb) {
        var done, path, tileH, tileW, _ref;
        done = function(sheet) {
          _this.sheets[asset.name] = sheet;
          ++loaded;
          handlers.progress(asset.data, sheet, loaded, asset_count);
          return cb();
        };
        if (cg.util.isArray(asset.data)) {
          _ref = asset.data, path = _ref[0], tileW = _ref[1], tileH = _ref[2];
        } else {
          path = asset.data;
        }
        return _this.loadSpritesheet(path, tileW, tileH).then(function(sheet) {
          return done(sheet);
        }, function(sheet) {
          handlers.error(path);
          return cb(sheet);
        });
      };
    })(this);
    assets.push.apply(assets, (function() {
      var _ref, _results;
      _ref = pack.textures;
      _results = [];
      for (name in _ref) {
        if (!__hasProp.call(_ref, name)) continue;
        path = _ref[name];
        _results.push({
          name: name,
          path: path,
          type: 'texture'
        });
      }
      return _results;
    })());
    loadGfx = (function(_this) {
      return function(asset, cb) {
        var done;
        done = function(texture) {
          _this.textures[asset.name] = texture;
          ++loaded;
          handlers.progress(texture.path, texture, loaded, asset_count);
          return cb();
        };
        return _this.loadTexture(asset.path).then(function(texture) {
          return done(texture);
        }, function(texture) {
          handlers.error(asset.path);
          return cb(texture);
        });
      };
    })(this);
    assets.push.apply(assets, (function() {
      var _ref, _results;
      _ref = pack.fonts;
      _results = [];
      for (name in _ref) {
        if (!__hasProp.call(_ref, name)) continue;
        path = _ref[name];
        _results.push({
          name: name,
          path: path,
          type: 'font'
        });
      }
      return _results;
    })());
    loadFont = (function(_this) {
      return function(asset, cb) {
        var done;
        done = function(font) {
          _this.fonts[asset.name] = font;
          ++loaded;
          handlers.progress(font.path, font, loaded, asset_count);
          return cb();
        };
        return _this.loadBitmapFont(asset.path).then(function(font) {
          return done(font);
        }, function(font) {
          handlers.error(asset.path);
          return cb(font);
        });
      };
    })(this);
    assets.push.apply(assets, (function() {
      var _ref, _results;
      _ref = pack.text;
      _results = [];
      for (name in _ref) {
        if (!__hasProp.call(_ref, name)) continue;
        path = _ref[name];
        _results.push({
          name: name,
          path: path,
          type: 'text'
        });
      }
      return _results;
    })());
    loadText = (function(_this) {
      return function(asset, cb) {
        var done;
        done = function(text) {
          _this.text[asset.name] = text;
          ++loaded;
          handlers.progress(asset.path, text, loaded, asset_count);
          return cb();
        };
        return _this.loadText(asset.path).then(function(text) {
          return done(text);
        }, function(text) {
          handlers.error(asset.path);
          return cb(text);
        });
      };
    })(this);
    assets.push.apply(assets, (function() {
      var _ref, _results;
      _ref = pack.json;
      _results = [];
      for (name in _ref) {
        if (!__hasProp.call(_ref, name)) continue;
        path = _ref[name];
        _results.push({
          name: name,
          path: path,
          type: 'json'
        });
      }
      return _results;
    })());
    loadJSON = (function(_this) {
      return function(asset, cb) {
        var done;
        done = function(json) {
          _this.json[asset.name] = json;
          ++loaded;
          handlers.progress(asset.path, json, loaded, asset_count);
          return cb();
        };
        return _this.loadJSON(asset.path).then(function(json) {
          return done(json);
        }, function(json) {
          handlers.error(asset.path);
          return cb(json);
        });
      };
    })(this);
    return async.eachLimit(assets, concurrency, (function(_this) {
      return function(asset, cb) {
        var _ref, _ref1, _ref2;
        cg.log("loading " + asset.type + " " + ((_ref = (_ref1 = asset.path) != null ? _ref1 : (_ref2 = asset.data) != null ? _ref2.paths : void 0) != null ? _ref : asset.data));
        switch (asset.type) {
          case 'sheet':
            return loadSpritesheet(asset, cb);
          case 'texture':
            return loadGfx(asset, cb);
          case 'text':
            return loadText(asset, cb);
          case 'json':
            return loadJSON(asset, cb);
          case 'font':
            return loadFont(asset, cb);
          case 'sound':
            return loadSfx(asset, cb);
          case 'music':
            return loadMusic(asset, cb);
          default:
            return cb('AssetManager: Unexpected asset type: ' + asset.type);
        }
      };
    })(this), (function(_this) {
      return function(asset) {
        if (asset) {
          return handlers.error(asset.path);
        } else {
          return handlers.complete(_this);
        }
      };
    })(this));
  };

  return AssetManager;

})(Module);

module.exports = AssetManager;


},{"Module":6,"Scene":7,"TileSheet":10,"cg":13,"rendering/textures/Texture":77,"sound/Music":79,"sound/Sound":80,"text/BitmapFont":82,"util/Promises":94,"util/async":97}],5:[function(require,module,exports){
var Actor, Group, HasSignals, Module, Tween, cg, chainableMethodNames, chainables, delay, each, groupMethods, hide, makeChainable, map, name, show, tween, __add, __remove, _i, _len,
  __slice = [].slice,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __hasProp = {}.hasOwnProperty;

cg = require('cg');

Module = require('Module');

Tween = require('Tween');

HasSignals = require('util/HasSignals');

Actor = require('Actor');


/**
TODOC

@class cg.Group
 */

chainableMethodNames = ['pause', 'resume', 'destroy', 'on', 'once', 'off', 'emit', 'halt'];

makeChainable = function(name) {
  return function() {
    var idx, _ref;
    idx = this.length;
    while (idx--) {
      (_ref = this[idx])[name].apply(_ref, arguments);
    }
    return this;
  };
};

chainables = {};

for (_i = 0, _len = chainableMethodNames.length; _i < _len; _i++) {
  name = chainableMethodNames[_i];
  chainables[name] = makeChainable(name);
}


/**
@method each
 */

each = function() {
  var args, func, i, obj, _j, _k;
  func = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  if (typeof func === 'string') {
    for (i = _j = this.length - 1; _j >= 0; i = _j += -1) {
      obj = this[i];
      obj[func].apply(obj, args);
    }
  } else {
    for (i = _k = this.length - 1; _k >= 0; i = _k += -1) {
      obj = this[i];
      func.call(obj, i, obj);
    }
  }
  return this;
};


/**
@method map
 */

map = function() {
  var args, func, obj;
  func = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  if (typeof func === 'string') {
    return (function() {
      var _j, _results;
      _results = [];
      for (_j = this.length - 1; _j >= 0; _j += -1) {
        obj = this[_j];
        _results.push(obj[func].apply(obj, args));
      }
      return _results;
    }).call(this);
  } else {
    return (function() {
      var _j, _results;
      _results = [];
      for (_j = this.length - 1; _j >= 0; _j += -1) {
        obj = this[_j];
        _results.push(func.call(obj, i, obj));
      }
      return _results;
    }).call(this);
  }
};


/**
@method tween
 */

tween = function(props) {
  return new Tween(this, props);
};


/**
@method delay
 */

delay = function(time, func) {
  var t;
  t = new Tween(this, {
    duration: time,
    immediate: false
  });
  t.start().then(func);
  return t;
};


/**
@method hide
 */

hide = function(arg, cb) {
  var params;
  params = {
    values: {
      alpha: 0
    }
  };
  return Actor.prototype.__hideOrShow.call(this, arg, params, function() {
    return this.set('visible', false);
  }, cb);
};


/**
@method show
 */

show = function(arg, cb) {
  var params;
  this.set('visible', true);
  params = {
    values: {
      alpha: 1
    }
  };
  return Actor.prototype.__hideOrShow.call(this, arg, params, null, cb);
};

__add = function(group, subgroup, actor) {
  return group.add(actor);
};

__remove = function(group, subgroup, actor) {
  var sg, _j, _len1, _ref;
  _ref = group.__subGroups;
  for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
    sg = _ref[_j];
    if (sg !== subgroup) {
      if (__indexOf.call(subgroup, actor) >= 0) {
        return;
      }
    }
  }
  return group.remove(actor);
};

groupMethods = {

  /**
  @method set
   */
  set: function() {
    var actor, args, i, key, val, values, _j, _len1;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (args.length === 1) {
      values = args[0];
    } else {
      values = {};
      values[args[0]] = args[1];
    }
    for (i = _j = 0, _len1 = this.length; _j < _len1; i = ++_j) {
      actor = this[i];
      for (key in values) {
        if (!__hasProp.call(values, key)) continue;
        val = values[key];
        if (typeof val === 'function') {
          actor[key] = val.call(actor, i, actor);
        } else {
          actor[key] = val;
        }
      }
    }
    return this;
  },

  /**
  @method add
   */
  add: function(val) {
    var tail, tval;
    tail = this.length - 1;
    while (tail >= 0) {
      tval = this[tail];
      if (val > tval) {
        break;
      }
      if (val === tval) {
        return this;
      }
      --tail;
    }
    this.splice(tail + 1, 0, val);
    this._groupSignals.emit('add', this, val);
    return this;
  },

  /**
  @method addAll
   */
  addAll: function(array) {
    var actor, _j, _len1;
    for (_j = 0, _len1 = array.length; _j < _len1; _j++) {
      actor = array[_j];
      this.add(actor);
    }
    return this;
  },

  /**
  @method addGroup
   */
  addGroup: function(group) {
    if (__indexOf.call(this.__subGroups, group) >= 0) {
      return;
    }
    this.__subGroups.push(group);
    this.addAll(group);
    this._groupSignals.on(group._groupSignals, 'add', this.__add);
    this._groupSignals.on(group._groupSignals, 'remove', this.__remove);
    this._groupSignals.emit('addGroup', group);
    return this;
  },

  /**
  @method remove
   */
  remove: function(actor) {
    var position;
    position = this.indexOf(actor);
    if (position < 0) {
      return this;
    }
    this.splice(position, 1);
    this._groupSignals.emit('remove', this, actor);
    return this;
  },

  /**
  @method removeGroup
   */
  removeGroup: function(group) {
    var actor, groupIdx, _j, _len1;
    groupIdx = this.__subGroups.indexOf(group);
    if (groupIdx < 0) {
      return;
    }
    this.__subGroups.splice(groupIdx, 1);
    for (_j = 0, _len1 = group.length; _j < _len1; _j++) {
      actor = group[_j];
      this.remove(actor);
    }
    this._groupSignals.off(group._groupSignals, 'add', this.__add);
    this._groupSignals.off(group._groupSignals, 'remove', this.__remove);
    this._groupSignals.emit('removeGroup', group);
    return this;
  },

  /**
  @method contains
   */
  contains: function(actor) {
    return this.indexOf(actor) >= 0;
  },

  /**
  Create a new group containing only members that belong to both groups.
  @method intersect
   */
  intersect: function(other) {
    var actor, g, _j, _len1;
    g = Group.create();
    for (_j = 0, _len1 = other.length; _j < _len1; _j++) {
      actor = other[_j];
      if (this.contains(actor)) {
        g.add(actor);
      }
    }
    return g;
  },

  /**
  @method dispose
   */
  dispose: function() {
    var actor, _j, _len1;
    for (_j = 0, _len1 = this.length; _j < _len1; _j++) {
      actor = this[_j];
      this._groupSignals.emit('remove', this, actor);
    }
    this._groupSignals.emit('__destroy__');
    return this.length = 0;
  }
};

Group = {
  create: function() {
    var arg, args, g, method, _j, _len1;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    g = [];
    g._groupSignals = Object.create(HasSignals);
    g._isGroup = true;
    g.__subGroups = [];
    g.each = each;
    g.map = map;
    g.tween = tween;
    g.hide = hide;
    g.show = show;
    g.__add = __add.bind(g, g);
    g.__remove = __remove.bind(g, g);
    for (name in chainables) {
      if (!__hasProp.call(chainables, name)) continue;
      method = chainables[name];
      g[name] = method;
    }
    for (name in groupMethods) {
      if (!__hasProp.call(groupMethods, name)) continue;
      method = groupMethods[name];
      g[name] = method;
    }
    for (_j = 0, _len1 = args.length; _j < _len1; _j++) {
      arg = args[_j];
      if (!cg.util.isArray(arg)) {
        g.add(arg);
      } else {
        if (arg._isGroup) {
          g.addGroup(arg);
        } else {
          g.addAll(arg);
        }
      }
    }
    return g;
  }
};

Group.empty = Group.create();

module.exports = Group;


},{"Actor":2,"Module":6,"Tween":11,"cg":13,"util/HasSignals":93}],6:[function(require,module,exports){
var Module,
    moduleKeywords,
    inherit;

inherit = function inherit(child, parent) {
  for (var key in parent) {
    if (Object.hasOwnProperty.call(parent, key)) child[key] = parent[key];
  }

  function ctor() {
    this.constructor = child;
  }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  child.__super__ = parent.prototype;
  return child;
};

moduleKeywords = ['onMixinStatic', 'onMixin', 'constructor'];

/**
* TODOC
*
* @class cg.Module
*/
Module = (function() {

  function Module() {}

  Module.__mixinStatic = function(obj) {
    var key;

    for (key in obj) {
      if (moduleKeywords.indexOf(key) >= 0) continue;
      this[key] = obj[key];
    }

    if (obj.onMixinStatic != null) {
      obj.onMixinStatic.call(this);
    }
    return this;
  };

  Module.mixinStatic = function () {
    var i;
    for (i=0; i<arguments.length; ++i) {
      this.__mixinStatic(arguments[i]);
    }
  }

  Module.__mixin = function(obj) {
    var key;

    for (key in obj) {
      if (moduleKeywords.indexOf(key) >= 0) continue;
      this.prototype[key] = obj[key];
    }

    if (obj.onMixin != null) {
      obj.onMixin.call(this);
    }
    return this;
  };

  Module.mixin = function () {
    var i;
    for (i=0; i<arguments.length; ++i) {
      this.__mixin(arguments[i]);
    }
  }

  Module.prototype.__mixin = function(obj) {
    var key;

    for (key in obj) {
      if (moduleKeywords.indexOf(key) >= 0) continue;
      this[key] = obj[key];
    }

    if (obj.onMixin != null) {
      obj.onMixin.call(this);
    }
    return this;
  };

  Module.prototype.mixin = function () {
    var i;
    for (i=0; i<arguments.length; ++i) {
      this.__mixin(arguments[i]);
    }
  }

  Module.defineProperty = function () {
    var args = [],
        i;

    args.push(this.prototype);
    args.push.apply(args, arguments);

    Object.defineProperty.apply(Object, args);
  }

  Module.prototype.defineProperty = function () {
    var args = [],
        i;

    args.push(this);
    args.push.apply(args, arguments);

    Object.defineProperty.apply(Object, args);
  }

  Module.extend = function(name, props) {
    var child, key, parent, val, __wrapped__;
    parent = this;
    __wrapped__ = function(superFunc, func) {
      return function() {
        var ret, prevSuper;
        prevSuper = this._super;
        this._super = superFunc;
        ret = func.apply(this, arguments);
        this._super = prevSuper;
        return ret;
      };
    };

    // Sometimes, you just gotta get your hands dirty:
    if (!props.hasOwnProperty('constructor')) {
      child = (new Function('inherit', 'parent',
        "var "+name+" = function "+name+" () {\n" +
        "  var ref = "+name+".__super__.constructor.apply(this, arguments);\n" +
        "  return ref;\n" +
        "};\n" +
        "\n" +
        "inherit("+name+", parent);\n" +
        "return "+name+";"
      ))(inherit, parent);
    } else {
      child = (new Function('inherit', 'parent', 'ctor',
        "var "+name+" = function "+name+" () {\n" +
        "  this._super = "+name+".__super__.constructor;\n" +
        "  var ref = ctor.apply(this, arguments);\n" +
        "  delete this._super;\n" +
        "  return ref;\n" +
        "};\n" +
        "\n" +
        "inherit("+name+", parent);\n" +
        "return "+name+";"
      ))(inherit, parent, props.constructor);
    }

    for (key in props) {
      if (!props.hasOwnProperty(key)) continue;
      val = props[key];
      if ((typeof val === 'function') && (typeof parent.prototype[key] === 'function')) {
        child.prototype[key] = __wrapped__(parent.prototype[key], val);
      } else {
        child.prototype[key] = val;
      }
    }
    return child;
  };

  return Module;
})();

module.exports = Module;

},{}],7:[function(require,module,exports){
var Actor, Scene, TweenManager, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Actor = require('Actor');

TweenManager = require('TweenManager');


/**
TODOC

A scene is meant to be a stand-alone interactivity zone of a game.
All Apps extend Scene, and therefore scenes can have children scenes.
A scene has its own independent tween system to allow for
 independent sets of controls for different menus/minigames/etc.

@class cg.Scene
 */

Scene = (function(_super) {
  __extends(Scene, _super);

  Object.defineProperty(Scene.prototype, 'isScene', {
    value: true,
    writable: false
  });

  function Scene() {
    Scene.__super__.constructor.apply(this, arguments);
    if (this.tweener == null) {
      this.tweener = new TweenManager;
    }
    if (this.paused == null) {
      this.paused = false;
    }
    this.currentTime = 0;
  }

  Scene.prototype.__preload = function(assets) {
    if (this.assets == null) {
      this.preloaded = true;
      this.preloadComplete();
      return;
    }
    this.preloaded = false;
    this.pause();
    return cg.assets.preload(this.assets, {
      error: (function(_this) {
        return function() {
          return _this.preloadError.apply(_this, arguments);
        };
      })(this),
      progress: (function(_this) {
        return function() {
          return _this.preloadProgress.apply(_this, arguments);
        };
      })(this),
      complete: (function(_this) {
        return function() {
          _this.preloaded = true;
          _this.resume();
          return _this.preloadComplete();
        };
      })(this)
    });
  };

  Scene.prototype.preload = function() {
    if (typeof this.assets !== 'string') {
      return this.__preload(this.assets);
    } else {
      return cg.assets.loadJSON(this.assets).then((function(_this) {
        return function(assets) {
          _this.assets = assets;
          return _this.__preload(_this.assets);
        };
      })(this), (function(_this) {
        return function(err) {
          throw new Error('Failed to load asset pack JSON: "' + _this.assets + '": ' + err.message);
        };
      })(this));
    }
  };

  Scene.prototype.preloadError = function(src) {
    return cg.error('Failed to load asset ' + src);
  };

  Scene.prototype.preloadProgress = function(src, data, loaded, count) {
    return cg.log('Loaded ' + src);
  };

  Scene.prototype.preloadComplete = function() {};

  Scene.prototype.update = function() {
    this.tweener.update();
    Scene.__super__.update.apply(this, arguments);
    return this.currentTime += cg.dt;
  };

  return Scene;

})(Actor);

module.exports = Scene;


},{"Actor":2,"TweenManager":12,"cg":13}],8:[function(require,module,exports){
var Actor, HasPlugins, HasSignals, Sprite, SpriteActor, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Sprite = require('rendering/Sprite');

Actor = require('Actor');

HasSignals = require('util/HasSignals');

HasPlugins = require('util/HasPlugins');


/**
A `Sprite` with all of `Actor` mixed in.

In other words, an `Actor` with a `Texture`.

@class cg.SpriteActor
@extends cg.rendering.Sprite
@uses cg.Actor

@constructor
@param [properties.texture] {String|Texture}
(see [`texture`](#property_texture) property)

If [`anim`](#property_anim) is set, this will get overwritten by the texture of the current frame of `anim`.
@param [properties.anim] {Animation}
(see [`anim`](#property_anim) property)
 */


/**
The animation this `Sprite` uses, if any.

Whenever the animation's frame changes, this `Sprite`s texture is updated automatically.
@property anim {Animation}
 */

SpriteActor = (function(_super) {
  __extends(SpriteActor, _super);

  SpriteActor.mixin(Actor.prototype);

  SpriteActor.mixin(HasPlugins);

  function SpriteActor(properties) {
    var tex;
    if (properties == null) {
      properties = {};
    }
    Actor.prototype.__defineProperties.call(this);
    this.__plugins_preInit();
    Object.defineProperty(this, '__internalID', {
      value: cg.getNextID()
    });
    tex = properties.texture || this.texture;
    SpriteActor.__super__.constructor.call(this, tex);
    delete properties.texture;
    this.__applyProperties(properties);
    if (this.anim && this.texture !== this.anim.texture) {
      this.texture = this.anim.texture;
    }
    this.__plugins_postInit();
  }

  SpriteActor.prototype.update = function() {
    Actor.prototype.update.call(this);
    if (this.anim) {
      this.anim.update();
      if (this.texture !== this.anim.texture) {
        this.texture = this.anim.texture;
      }
    }
  };

  SpriteActor.prototype.__updateTransform = Sprite.prototype.__updateTransform;

  return SpriteActor;

})(Sprite);

module.exports = SpriteActor;


},{"Actor":2,"cg":13,"rendering/Sprite":54,"util/HasPlugins":91,"util/HasSignals":93}],9:[function(require,module,exports){
var Actor, Text, cg, example,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Actor = require('Actor');

example = function() {
  var text;
  return text = this.addChild(new cg.Text('Hello, world!', {
    font: 'chunky',
    align: 'center',
    x: cg.width / 2,
    y: cg.height / 2
  }));
};


/**
TODOC

@class cg.Text
@extends cg.Actor
 */

Text = (function(_super) {
  __extends(Text, _super);

  Text.defaults = {
    font: '10pt sans-serif',
    color: 'white',
    align: 'left'
  };

  Text.defineProperty('string', {
    get: function() {
      return this.__string;
    },
    set: function(val) {
      var _ref;
      if (val === this.__string) {
        return;
      }
      this.__string = (_ref = val != null ? val.toString() : void 0) != null ? _ref : '';
      if (this.__textItem instanceof cg.text.BitmapText) {
        this.__textItem.string = this.__string;
      } else {
        this.__textItem.text = this.__string;
      }
      return this.__textItem.updateText();
    }
  });

  Text.defineProperty('font', {
    get: function() {
      return this.__font;
    },
    set: function(val) {
      var font;
      if (!(typeof val === 'string')) {
        if (!val instanceof cg.text.BitmapFont) {
          throw new Error('Expected cg.text.BitmapFont or String for font.');
        }
        return this.__font = val;
      } else {
        font = cg.assets.fonts[val];
        if (font == null) {
          return this.__font = val;
        } else {
          return this.__font = font;
        }
      }
    }
  });

  Text.defineProperty('align', {
    get: function() {
      return this.__align;
    },
    set: function(val) {
      if (val === this.__align) {
        return;
      }
      this.__align = val;
      return this.__updateAlignment();
    }
  });

  Text.defineProperty('color', {
    get: function() {
      return this.__color;
    },
    set: function(val) {
      this.__color = val;
      if (this.__textItem == null) {
        return;
      }
      if (this.__textItem instanceof cg.text.BitmapText) {
        return;
      }
      this.__textItem.style.fill = this.__color;
      return this.__textItem.updateText();
    }
  });

  Text.defineProperty('width', {
    get: function() {
      var _ref;
      return (_ref = this.__width) != null ? _ref : this.__textItem.width;
    },
    set: function(val) {
      this.__width = val;
      if (this.__textItem instanceof cg.text.BitmapText) {

      } else {
        this.__textItem.style.wordWrap = this.__width != null;
        this.__textItem.style.wordWrapWidth = this.__width;
        return this.__textItem.updateText();
      }
    }
  });

  Text.defineProperty('height', {
    get: function() {
      return this.__textItem.height;
    }
  });

  Text.defineProperty('left', {
    get: function() {
      return this.x + this.__textItem.left;
    },
    set: function(val) {
      return this.x = val - this.__textItem.left;
    }
  });

  Text.defineProperty('right', {
    get: function() {
      return this.x + this.__textItem.right;
    },
    set: function(val) {
      return this.x = val - this.__textItem.right;
    }
  });

  Text.defineProperty('top', {
    get: function() {
      return this.y + this.__textItem.top;
    },
    set: function(val) {
      return this.y = val - this.__textItem.top;
    }
  });

  Text.defineProperty('bottom', {
    get: function() {
      return this.y + this.__textItem.bottom;
    },
    set: function(val) {
      return this.y = val - this.__textItem.bottom;
    }
  });

  Text.prototype.__buildTextItem = function() {
    var string, _ref, _ref1, _ref2;
    string = (_ref = this.string) != null ? _ref : '';
    if (this.__textItem__ != null) {
      this.removeChild(this.__textItem__);
    }
    if (this.font instanceof cg.text.BitmapFont) {
      this.__textItem__ = this.addChild(new cg.text.BitmapText(this.font, string));
    } else {
      this.__textItem__ = this.addChild(new cg.text.PixiText(string, {
        font: (_ref1 = this.font) != null ? _ref1 : Text.defaults.font,
        fill: (_ref2 = this.color) != null ? _ref2 : Text.defaults.color
      }));
    }
    return this.__updateAlignment();
  };

  Text.defineProperty('__textItem', {
    get: function() {
      if (!this.__textItem__) {
        this.__buildTextItem();
      }
      return this.__textItem__;
    }
  });

  Text.prototype.__updateAlignment = function() {
    if (this.__textItem == null) {
      return;
    }
    if (this.__textItem instanceof cg.text.BitmapText) {
      this.__textItem.alignment = this.align;
      return this.__textItem.updateText();
    } else {
      switch (this.align) {
        case 'center':
          return this.__textItem.anchorX = 0.5;
        case 'right':
          return this.__textItem.anchorX = 1;
        default:
          return this.__textItem.anchorX = 0;
      }
    }
  };

  function Text(string, params) {
    var k, v, _ref;
    if (params == null) {
      params = {};
    }
    _ref = Text.defaults;
    for (k in _ref) {
      if (!__hasProp.call(_ref, k)) continue;
      v = _ref[k];
      if (params[k] == null) {
        params[k] = v;
      }
    }
    Text.__super__.constructor.call(this, params);
    this.string = string;
  }

  return Text;

})(Actor);

module.exports = Text;


},{"Actor":2,"cg":13}],10:[function(require,module,exports){
var Animation, Rectangle, Texture, TileSheet, cg;

cg = require('cg');

Texture = require('rendering/textures/Texture');

Rectangle = require('rendering/core/Rectangle');

Animation = require('Animation');


/**
Array of `Texture`s created from a single `Texture`, split up into fixed-sized pieces

You **must** use [`cg.TileSheet.create`](#method_create) to create a new `TileSheet`; 
calling `new TileSheet` will throw an exception.

@class cg.TileSheet
 */

TileSheet = (function() {
  function TileSheet() {
    throw new Error('Use cg.TileSheet.create(...) to create a new TileSheet.');
  }


  /**
  Create a new `TileSheet` array.
  
  @static
  @method create
  @param texture {cg.Texture} The texture to chop up into smaller texture tiles.
  @param tileW {Number} The width of a single texture tile.
  @param tileH {Number} The height of a single texture tile.
  @return {cg.TileSheet}
   */

  TileSheet.create = function(texture, tileW, tileH) {
    var bt, fh, fw, fx, fy, ox, oy, textures;
    if (!(tileW > 0 && tileH > 0)) {
      throw new Error('TileSheet tile width and height must be positive, non-zero values');
    }
    if (typeof texture === 'string') {
      texture = cg.assets.textures[texture];
    }
    if (!texture.baseTexture) {
      throw new Error('Invalid Texture passed to TileSheet.create');
    }
    textures = [];
    ox = 0;
    fx = texture.frame.x;
    fy = texture.frame.y;
    fw = texture.frame.width;
    fh = texture.frame.height;
    bt = texture.baseTexture;
    oy = 0;
    while (true) {
      if (oy >= fh) {
        break;
      }
      ox = 0;
      while (true) {
        if (ox >= fw) {
          break;
        }
        textures.push(new Texture(bt, new Rectangle(fx + ox, fy + oy, tileW, tileH)));
        ox += tileW;
      }
      oy += tileH;
    }

    /**
    Create an [`Animation`](cg.Animation.html) from a sequence of tile numbers.
    
    @method anim
    @param frameIndexes {Number|Array(Number|Array[2](Number))}
    An array of frames, represented by integer indexes of this `TileSheet`.
    
    The format of this parameter is identical to the first parameter to the [`Animation` constructor](cg.Animation.html),
    except any integer values are treated as index values into this `TileSheet` array.
    
    For instance, the sequence `[0, 1, 2]` will become `[sheet[0], sheet[1], sheet[2]]`, where `sheet` is the `TileSheet`
    that `anim` was called on.
    
    Any non-integer frame values will be passed as-is to the [`Animation` constructor](cg.Animation.html), allowing
    you to mix explicit texture names or `Texture` values as frames along with integer values.
    
    @param [frameLength=32] {Number(milliseconds)} Default duration for each frame.
    @param [looping=true] {Boolean} Whether the animation should repeat endlessly.
    
    @return {cg.Animation} The desired `Animation` sequence.
     */
    textures.anim = function(frameIndexes, frameLength, looping) {
      var frame, frames, _i, _len;
      if (frameLength == null) {
        frameLength = 32;
      }
      if (looping == null) {
        looping = true;
      }
      if (typeof frameIndexes === 'number') {
        frameIndexes = [frameIndexes];
      }
      frames = [];
      for (_i = 0, _len = frameIndexes.length; _i < _len; _i++) {
        frame = frameIndexes[_i];
        if ((typeof frame) === 'number') {
          frames.push(textures[frame]);
        } else if ((typeof frames[1]) === 'number') {
          frames.push([textures[frame[0]], frame[1]]);
        } else {
          frames.push(frame);
        }
      }
      return new Animation(frames, frameLength, looping);
    };
    Object.defineProperty(textures, 'isTileSheet', {
      value: true,
      writable: false,
      configurable: true
    });
    return textures;
  };

  return TileSheet;

})();

module.exports = TileSheet;


},{"Animation":3,"cg":13,"rendering/core/Rectangle":63,"rendering/textures/Texture":77}],11:[function(require,module,exports){
var HasSignals, Module, Promises, Tween, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Module = require('Module');

HasSignals = require('util/HasSignals');

Promises = require('util/Promises');


/**
"Ease" an object's numeric property (or number of properties) from one value to another.
@class cg.Tween
@extends cg.Module
@uses cg.util.HasSignals
@uses Promise

@constructor
@param object {Object|Array} The object(s) whose properties will be tweened.
@param [params] {Object} Parameters that define how the `Tween` should behave (see below).
@param [params.values] {Object}
A key-value pair of the final values to be applied to `object`.

Any `object[key]` that is anything but a number or function will be ignored.

Properties can either be simple numeric values, or accessor functions in the following style:

```javascript
obj.value(100); // set value to 100
obj.value();    // returns 100
```

Any property may also be assigned a function instead of a numerical value:

```javascript
// Tween object1.x to 50, object2.x to 100, and object3.x to 150
new Tween([object1, object2, object3], {
  values: {
    x: function (index, object) {
      // This function is called once for each object this Tween affects
      //  as soon as `start()` is called. Subsequent calls to `start()`
      //  *will* call this function again for each object.

      // The value of `this` is the current object being iterated over.

      // The first argument passed is the index into the array corresponding to the object.
      // The second argument is the object.

      // If only a single object was passed, index is always 0.

      // Your function *must* return a numerical value:
      return index * 50;
    }
  }
});
```
@param [params.duration=`Tween.defaults.duration=500`] {Number(milliseconds)|Function} The span of time over which `object`'s `value`s should be tweened.
@param [params.easeFunc=`Tween.defaults.easeFunc='quad.inout'`] {String|Function} TODOC
@param [params.delay=0] {Number(milliseconds)|Function} The amount of time after `start` is called before the tween should begin.
@param [params.relative=false] {Boolean} Whether `values` should represent a delta to be added to `object`'s current values, rather than the absolute final values.
@param [params.tweener=cg.tweener] {TweenManager} The `TweenManager` to be used to drive this `Tween`.
@param [params.immediate=true] {Boolean} If true, `this.start()` will be called immediately.
@param [params.context] {Object} If specified, this will be the value of `this` inside the body of promises returned by calling [`then`](#method_then).
 */

Tween = (function(_super) {
  __extends(Tween, _super);

  Tween.mixin(HasSignals);

  Tween.__easeFuncs = {};

  Tween.defaults = {
    duration: 500,
    easeFunc: 'quad.inout'
  };


  /**
  Globally add a custom ease function that can be utilized by referring to a name (string) when
  setting the `easeFunc` parameter to the `Tween` constructor.
  
  @static
  @method addEaseFunc
  @param name {String}
  @param func {Function}
   */

  Tween.addEaseFunc = function(name, func) {
    if (this.__easeFuncs[name] != null) {
      cg.warn('Tween.addEaseFunc: overwriting existing "' + name + '" function.');
    }
    return this.__easeFuncs[name] = func;
  };

  function Tween(_objects, property, value, duration, easeFunc, delay) {
    var params, values;
    this._objects = _objects;
    this._eventObjects = this._objects;
    if (!cg.util.isArray(this._objects)) {
      this._objects = [this._objects];
    }
    if (typeof property === 'object') {
      params = property;
    } else {
      values = {};
      values[property] = value;
      params = {
        values: values,
        duration: duration,
        easeFunc: easeFunc,
        delay: delay
      };
    }
    this.setParams(params);
  }

  Tween.prototype.__clearParams = function() {
    var paramName, _i, _len, _ref, _results;
    _ref = ['values', 'duration', 'easeFunc', 'delay', 'relative', 'tweener', 'immediate'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      paramName = _ref[_i];
      _results.push(delete this[paramName]);
    }
    return _results;
  };

  Tween.prototype.setParams = function(params) {
    var easeFuncName, f, name;
    this.__clearParams();
    this.values = params.values, this.duration = params.duration, this.easeFunc = params.easeFunc, this.delay = params.delay, this.relative = params.relative, this.tweener = params.tweener, this.immediate = params.immediate;
    if (this.values == null) {
      this.values = {};
    }
    if (this.duration == null) {
      this.duration = Tween.defaults.duration;
    }
    if (this.easeFunc == null) {
      this.easeFunc = Tween.defaults.easeFunc;
    }
    if (typeof this.easeFunc === 'string') {
      easeFuncName = this.easeFunc;
      this.easeFunc = Tween.__easeFuncs[easeFuncName];
      if (this.easeFunc == null) {
        this.easeFunc = Tween.Quad.InOut;
        cg.warn('Tween: unknown ease function: ' + easeFuncName('; available ease function names are:'));
        cg.warn(((function() {
          var _ref, _results;
          _ref = Tween.__easeFuncs;
          _results = [];
          for (name in _ref) {
            if (!__hasProp.call(_ref, name)) continue;
            f = _ref[name];
            _results.push('  ' + name);
          }
          return _results;
        })()).join('\n'));
      }
    }
    if (this.delay == null) {
      this.delay = 0;
    }
    if (this.relative == null) {
      this.relative = false;
    }
    if (this.tweener == null) {
      this.tweener = cg.tweener;
    }
    if (this.immediate == null) {
      this.immediate = true;
    }
    this.active = false;
    if (this.immediate) {
      return this.start();
    }
  };


  /**
  Begin tweening `object`'s `values`.
  
  @method start
  @chainable
   */


  /**
  Fired *immediately* when `this.start()` is called.
  @event start(object)
  @param object {Object} `object` before its values have started tweening
   */

  Tween.prototype.start = function() {
    var i, name, obj, relative, value, _i, _len, _ref, _ref1, _ref2;
    this._deferred = new Promises.Deferred(this._eventObjects);

    /**
    TODOC
    @method then
     */
    this.then = this._deferred.promise.then;
    this.emit('start', this._eventObjects);
    this.active = true;
    this.removed = false;
    this.tweener.add(this);
    this.time = 0;
    this._initialValues = [];
    this._finalValues = [];
    this._done = [];
    this._durations = [];
    this._totalDone = 0;
    if (typeof this.delay === 'function') {
      this._delays = (function() {
        var _i, _len, _ref, _results;
        _ref = this._objects;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          obj = _ref[i];
          _results.push(this.delay.call(obj, i, obj));
        }
        return _results;
      }).call(this);
    }
    if (typeof this.duration === 'function') {
      this._durations = (function() {
        var _i, _len, _ref, _results;
        _ref = this._objects;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          obj = _ref[i];
          _results.push(this.duration.call(obj, i, obj));
        }
        return _results;
      }).call(this);
    }
    _ref = this._objects;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      obj = _ref[i];
      if (obj == null) {
        continue;
      }
      this._initialValues[i] = {};
      this._finalValues[i] = {};
      this._done[i] = false;
      _ref1 = this.values;
      for (name in _ref1) {
        if (!__hasProp.call(_ref1, name)) continue;
        value = _ref1[name];
        if (!((_ref2 = typeof obj[name]) === 'number' || _ref2 === 'function')) {
          cg.warn("Tween: Property named \"" + name + "\" of " + obj + " is of an unsupported type: \"" + (typeof obj[name]) + "\"; ignoring it!");
          cg.warn("typeof obj: " + (typeof obj));
          continue;
        }
        if (typeof value === 'function') {
          value = value.call(obj, i, obj);
        }
        if (typeof value === 'string') {
          value = value.trim();
          relative = true;
          value = parseFloat(value);
        }
        if (typeof obj[name] === 'function') {
          this._initialValues[i][name] = obj[name]();
        } else {
          this._initialValues[i][name] = obj[name];
        }
        if (relative || this.relative) {
          this._finalValues[i][name] = this._initialValues[i][name] + value;
        } else {
          this._finalValues[i][name] = value;
        }
      }
    }
    return this;
  };


  /**
  Stop tweening `object`'s `values`.
  @method stop
  @chainable
   */

  Tween.prototype.stop = function() {
    this.emit('removed');
    this.removed = true;
    this.active = false;
    return this;
  };


  /**
  Called by this `Tween`'s associated `TweenManager` each tick.
  
  @method update
  @protected
  @return `true` if this tween has completed
   */


  /**
  Fired each tick *immediately after* `object`'s `values` have been updated.
  
  @event update(object)
  @param object {Object} `object` after having its values updated for one tick
   */

  Tween.prototype.update = function() {
    var amount, delay, delta, duration, i, initial, name, obj, target, val, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
    if (this.removed) {
      return true;
    }
    this.time += cg.dt;
    _ref = this._objects;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      obj = _ref[i];
      if (this._done[i]) {
        continue;
      }
      if (obj == null) {
        this._done[i] = true;
        ++this._totalDone;
        continue;
      }
      delay = (_ref1 = (_ref2 = this._delays) != null ? _ref2[i] : void 0) != null ? _ref1 : this.delay;
      duration = (_ref3 = (_ref4 = this._durations) != null ? _ref4[i] : void 0) != null ? _ref3 : this.duration;
      if (this.time < delay) {
        continue;
      }
      delta = cg.math.clamp((this.time - delay) / duration, 0, 1);
      amount = this.easeFunc(delta);
      if (delta >= 1) {
        this._done[i] = true;
        ++this._totalDone;
      }
      _ref5 = this._initialValues[i];
      for (name in _ref5) {
        if (!__hasProp.call(_ref5, name)) continue;
        initial = _ref5[name];
        target = this._finalValues[i][name];
        val = initial + (target - initial) * amount;
        if (typeof obj[name] === 'function') {
          obj[name](val);
        } else {
          obj[name] = val;
        }
      }
    }
    this.emit('update', this._eventObjects);
    if (this._totalDone >= this._objects.length) {
      this.active = false;
      return true;
    }
    return false;
  };

  Tween.prototype._complete = function() {
    if (this.removed) {
      return;
    }
    this.emit('complete', this._eventObjects);
    this._deferred.resolve(this._eventObjects);
    return this.stop();
  };


  /**
  Linear `easeFunc`.
  
  @static
  @property Linear
   */

  Tween.Linear = function(k) {
    return k;
  };

  Tween.Quake = {
    In: function(k) {
      if (k === 1) {
        return 1;
      }
      return k + cg.rand.normal() * k;
    },
    Out: function(k) {
      if (k === 1) {
        return 1;
      }
      return k + cg.rand.normal() * (1 - k);
    },
    InOut: function(k) {
      if (k < 0.5) {
        return Tween.Quake.In(k * 2) * 0.5;
      } else {
        return Tween.Quake.Out(k * 2 - 1) * 0.5 + 0.5;
      }
    }
  };

  Tween.Elastic = {

    /**
    [Elastic-In](http://easings.net/#easeInElastic) `easeFunc`
    
    @static
    @property Elastic.In
     */
    In: function(k) {
      var a, p, s;
      s = void 0;
      a = 0.1;
      p = 0.4;
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      if (!a || a < 1) {
        a = 1;
        s = p / 4;
      } else {
        s = p * Math.asin(1 / a) / (2 * Math.PI);
      }
      return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
    },

    /**
    [Elastic-Out](http://easings.net/#easeOutElastic) `easeFunc`
    
    @static
    @property Elastic.Out
     */
    Out: function(k) {
      var a, p, s;
      s = void 0;
      a = 0.1;
      p = 0.4;
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      if (!a || a < 1) {
        a = 1;
        s = p / 4;
      } else {
        s = p * Math.asin(1 / a) / (2 * Math.PI);
      }
      return a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1;
    },

    /**
    [Elastic-In-Out](http://easings.net/#easeInOutElastic) `easeFunc`
    
    @static
    @property Elastic.InOut
     */
    InOut: function(k) {
      var a, p, s;
      s = void 0;
      a = 0.1;
      p = 0.4;
      if (k === 0) {
        return 0;
      }
      if (k === 1) {
        return 1;
      }
      if (!a || a < 1) {
        a = 1;
        s = p / 4;
      } else {
        s = p * Math.asin(1 / a) / (2 * Math.PI);
      }
      if ((k *= 2) < 1) {
        return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
      }
      return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
    }
  };

  Tween.Quad = {

    /**
    [Quad-In](http://easings.net/#easeInQuad) `easeFunc`
    
    @static
    @property Quad.In
     */
    In: function(k) {
      return k * k;
    },

    /**
    [Quad-Out](http://easings.net/#easeOutQuad) `easeFunc`
    
    @static
    @property Quad.Out
     */
    Out: function(k) {
      return k * (2 - k);
    },

    /**
    [Quad-InOut](http://easings.net/#easeInOutQuad) `easeFunc`
    
    @static
    @property Quad.InOut
     */
    InOut: function(k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k;
      }
      return -0.5 * (--k * (k - 2) - 1);
    }
  };

  Tween.Back = {

    /**
    [Back-In](http://easings.net/#easeInBack) `easeFunc`
    
    @static
    @property Back.In
     */
    In: function(k) {
      var s;
      s = 1.70158;
      return k * k * ((s + 1) * k - s);
    },

    /**
    [Back-Out](http://easings.net/#easeOutBack) `easeFunc`
    
    @static
    @property Back.Out
     */
    Out: function(k) {
      var s;
      s = 1.70158;
      return --k * k * ((s + 1) * k + s) + 1;
    },

    /**
    [Back-InOut](http://easings.net/#easeInOutBack) `easeFunc`
    
    @static
    @property Back.InOut
     */
    InOut: function(k) {
      var s;
      s = 1.70158 * 1.525;
      if ((k *= 2) < 1) {
        return 0.5 * (k * k * ((s + 1) * k - s));
      }
      return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
    }
  };

  Tween.Bounce = {

    /**
    [Bounce-In](http://easings.net/#easeInBounce) `easeFunc`
    
    @static
    @property Bounce.In
     */
    In: function(k) {
      return 1 - Tween.Bounce.Out(1 - k);
    },

    /**
    [Bounce-Out](http://easings.net/#easeOutBounce) `easeFunc`
    
    @static
    @property Bounce.Out
     */
    Out: function(k) {
      if (k < (1 / 2.75)) {
        return 7.5625 * k * k;
      } else if (k < (2 / 2.75)) {
        return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
      } else if (k < (2.5 / 2.75)) {
        return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
      } else {
        return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
      }
    },

    /**
    [Bounce-InOut](http://easings.net/#easeInOutBounce) `easeFunc`
    
    @static
    @property Bounce.InOut
     */
    InOut: function(k) {
      if (k < 0.5) {
        return Tween.Bounce.In(k * 2) * 0.5;
      } else {
        return Tween.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
      }
    }
  };

  return Tween;

})(Module);

Tween.addEaseFunc('linear', Tween.Linear);

Tween.addEaseFunc('quake', Tween.Quake.InOut);

Tween.addEaseFunc('quake.in', Tween.Quake.In);

Tween.addEaseFunc('quake.out', Tween.Quake.Out);

Tween.addEaseFunc('quake.inout', Tween.Quake.InOut);

Tween.addEaseFunc('back.in', Tween.Back.In);

Tween.addEaseFunc('back.out', Tween.Back.Out);

Tween.addEaseFunc('back.inout', Tween.Back.InOut);

Tween.addEaseFunc('bounce.in', Tween.Bounce.In);

Tween.addEaseFunc('bounce.out', Tween.Bounce.Out);

Tween.addEaseFunc('bounce.inout', Tween.Bounce.InOut);

Tween.addEaseFunc('elastic.in', Tween.Elastic.In);

Tween.addEaseFunc('elastic.out', Tween.Elastic.Out);

Tween.addEaseFunc('elastic.inout', Tween.Elastic.Out);

Tween.addEaseFunc('quad.in', Tween.Quad.In);

Tween.addEaseFunc('quad.out', Tween.Quad.Out);

Tween.addEaseFunc('quad.inout', Tween.Quad.InOut);

module.exports = Tween;


},{"Module":6,"cg":13,"util/HasSignals":93,"util/Promises":94}],12:[function(require,module,exports){
var TweenManager, cg,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

cg = require('cg');


/**
Tracks, updates, and cleans up active `Tween` instances.

@class cg.TweenManager

@constructor
 */

TweenManager = (function() {
  function TweenManager() {
    this.tweens = [];
    this.completedTweens = [];
  }


  /**
  Add a `Tween` to begin tweening.
  
  @private
  @method add
   */

  TweenManager.prototype.add = function(tween) {
    if (!(__indexOf.call(this.tweens, tween) >= 0)) {
      return this.tweens.push(tween);
    }
  };


  /**
  Remove a `Tween` to stop it from tweening.
  @private
  @method remove
   */

  TweenManager.prototype.remove = function(tween) {
    return tween.stop();
  };


  /**
  Update all active tweens associated with this manager.
  @private
  @method update
   */

  TweenManager.prototype.update = function() {
    var idx, tween, _i, _j, _len, _len1, _ref, _ref1;
    _ref = this.completedTweens;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tween = _ref[_i];
      idx = this.tweens.indexOf(tween);
      if (idx >= 0) {
        this.tweens.splice(idx, 1);
      }
      tween._complete();
    }
    this.completedTweens = [];
    _ref1 = this.tweens;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      tween = _ref1[_j];
      if (tween.update()) {
        this.completedTweens.push(tween);
      }
    }
  };

  return TweenManager;

})();

module.exports = TweenManager;


},{"cg":13}],13:[function(require,module,exports){
(function (global){
var Core, HasPlugins, HasSignals, Module, NOOP, cg, util,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

Module = require('Module');

util = require('util/index');

HasSignals = require('util/HasSignals');

HasPlugins = require('util/HasPlugins');


/**
Reference to this game's [`cg.AssetManager`](cg.AssetManager.html) instance.

@class cg.assets
 */


/**
Reference to this game's [`cg.ui.UIManager`](cg.ui.UIManager.html) instance.

@class cg.ui
 */

NOOP = function() {};


/**
The global `cg.Core` instance.

@class cg.Core
 */

Core = (function(_super) {
  __extends(Core, _super);

  Core.prototype.Module = Module;

  Core.prototype.Core = Core;

  Core.mixin(HasSignals);

  Core.mixin(HasPlugins);

  Core.prototype.util = util;

  Core.prototype.setLogLevel = function(lvl) {
    var i, levels, n, name, _results;
    levels = ['info', 'debug', 'warn', 'error'];
    if (lvl === 'verbose') {
      i = 0;
    } else {
      i = levels.indexOf(lvl);
    }
    n = 0;
    while (n < i) {
      name = levels[i];
      if (name === 'debug') {
        name = 'log';
      }
      cg[name] = NOOP;
      ++n;
    }
    _results = [];
    while (i < levels.length) {
      name = levels[i];
      if (name === 'debug') {
        name = 'log';
      }
      cg[name] = console[name].bind(console);
      _results.push(++i);
    }
    return _results;
  };

  Core.prototype.__defineProperties = function() {

    /**
    Hex-formatted RGB value (eg 0xFF0000 is red); setting this will automatically change
    the color used to clear the screen after each frame rendered.
    
    @property backgroundColor
    @type Number
     */
    Object.defineProperty(this, 'backgroundColor', {
      get: function() {
        return this.__backgroundColor;
      },
      set: function(val) {
        var _ref;
        if (val === this.__backgroundColor) {
          return;
        }
        if ((_ref = this.stageRoot) != null) {
          _ref.setBackgroundColor(val);
        }
        return this.__backgroundColor = val;
      }
    });

    /**
    A hint about how the display region of the game should behave, as well as how textures should be filtered.
    
    There are five valid values:
    
    * `'aspect'` - compute [`scale`](#property_scale) to fit inside the display area while maintaining an aspect ratio of [`width`](#property_width):[`height`](#property_height).
    * `'pixel'` - like `'aspect'`, but use a framebuffer of [`width`](#property_width)x[`height`](#property_height) if [`scale`](#property_scale) is not `1`.
    * `'pixelPerfect'` - like `'pixel'`, but when scaling the framebuffer, use the largest whole-digit scale factor that fits (eg. 1x, 2x, 3x...).
    * `'fill'` - fill the entire display area ([`width`](#property_width) and [`height`](#property_height) are computed based on [the dimensions of the display container](#method_getDeviceWidth()), and [`scale`](#property_scale)).
    * `'fillPixel'` - like `'fill'`, but use a framebuffer if [`scale`](#property_scale) is not `1`.
    
    If `'pixel'`, `'pixelPerfect'`, or `'fillPixel'` is specified, [`textureFilter`](#property_textureFilter)
    and [`resizeFilter`](#property_resizeFilter) will be set to `'nearest'`, unless explicitly specified.
    
    @property displayMode
    @type String
    @default 'aspect'
     */
    Object.defineProperty(this, 'displayMode', {
      get: function() {
        return this.__displayMode;
      },
      set: function(val) {
        if (this.__displayMode === val) {
          return;
        }
        this.__displayMode = val;
        if (val === 'pixel' || val === 'pixelPerfect' || val === 'fillPixel') {
          this.__defaultFilter = 'nearest';
        } else {
          this.__defaultFilter = 'linear';
        }
        return this.__needsTriggerResize = true;
      }
    });

    /**
    The default way textures should be rendered when scaled, stretched, or rotated.
    
    One of two valid values:
    
    * `'linear'` - Smooth out textures.
    * `'nearest'` - Preserve "pixellyness" of textures.
    
    Any textures that don't explicitly set a [`filterMode`](cg.Texture.html#property_filterMode) will inherit this value.
    
    Changing this value will automatically update all applicable textures before the next frame is rendered.
    
    **Default**: `'nearest'` if [`displayMode`](#property_displayMode) is `'pixel'`, `'pixelPerfect'`, or `'fillPixel'`; `'linear'` otherwise
    
    @property textureFilter
    @type String
     */
    Object.defineProperty(this, 'textureFilter', {
      get: function() {
        var _ref;
        return (_ref = this.__textureFilter) != null ? _ref : this.__defaultFilter;
      },
      set: function(val) {
        if (this.__textureFilter === val) {
          return;
        }
        this.__textureFilter = val;
        return this.__needsTriggerResize = true;
      }
    });

    /**
    The [`filterMode`](cg.BaseTexture.html#property_filterMode) used on the framebuffer; ignored unless [`displayMode`](#property_displayMode) is `'pixel'` or `'pixelPerfect'`.
    
    One of two valid values:
    
    * `'linear'` - Smooth out the stretched framebuffer
    * `'nearest'` - Preserve "pixellyness" of the framebuffer
    
    @property resizeFilter
    @type String
    @default 'nearest'
     */
    Object.defineProperty(this, 'resizeFilter', {
      get: function() {
        var _ref;
        return (_ref = this.__resizeFilter) != null ? _ref : 'nearest';
      },
      set: function(val) {
        if (this.__resizeFilter === val) {
          return;
        }
        this.__resizeFilter = val;
        return this.__needsTriggerResize = true;
      }
    });

    /**
    The virtual width of this game's display area, in game-units (or pixels at 1x scale).
    
    @property width
    @type number
    @default 400
     */
    Object.defineProperty(this, 'width', {
      get: function() {
        return this.__width;
      },
      set: function(val) {
        if (this.__width === val) {
          return;
        }
        this.__width = val;
        return this.__needsTriggerResize = true;
      }
    });

    /**
    The virtual height of this game's display area, in game-units (or pixels at 1x scale).
    
    @property height
    @type number
    @default 240
     */
    Object.defineProperty(this, 'height', {
      get: function() {
        return this.__height;
      },
      set: function(val) {
        if (this.__height === val) {
          return;
        }
        this.__height = val;
        return this.__needsTriggerResize = true;
      }
    });

    /**
    The ratio of the display's actual size in pixels to its virtual size.
    
    @property scale
    @type number
     */
    Object.defineProperty(this, 'scale', {
      get: function() {
        return this.__scale;
      },
      set: function(val) {
        if (this.__scale === val) {
          return;
        }
        this.__scale = val;
        return this.__needsTriggerResize = true;
      }
    });

    /**
    Shorthand for `cg.assets.music`
    @property music
     */
    Object.defineProperty(this, 'music', {
      get: function() {
        return this.assets.music;
      }
    });

    /**
    Shorthand for `cg.assets.sounds`
    @property sounds
     */
    Object.defineProperty(this, 'sounds', {
      get: function() {
        return this.assets.sounds;
      }
    });

    /**
    Shorthand for `cg.assets.textures`
    @property textures
     */
    Object.defineProperty(this, 'textures', {
      get: function() {
        return this.assets.textures;
      }
    });

    /**
    Shorthand for `cg.assets.sheets`
    @property sheets
     */
    Object.defineProperty(this, 'sheets', {
      get: function() {
        return this.assets.sheets;
      }
    });

    /**
    Shorthand for `cg.assets.json`
    @property json
     */
    return Object.defineProperty(this, 'json', {
      get: function() {
        return this.assets.json;
      }
    });
  };

  Core.prototype._newRenderer = function() {
    throw new Error('_newRenderer: unimplemented!');
  };

  function Core() {
    this.classes = {};
    this.__byID = {};
    this.__nextID = 1;
  }

  Core.create = function() {
    var instance, k, ret, v;
    instance = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(this, arguments, function(){});
    ret = instance["default"].bind(instance);
    for (k in instance) {
      v = instance[k];
      ret[k] = v;
    }
    instance.__defineProperties.apply(ret);
    return ret;
  };

  Core.prototype["default"] = function(query) {
    var classGroup, className, final, group, groups, _i, _j, _len, _len1, _ref;
    if (query == null) {
      query = '';
    }
    query = query.trim();
    if (query[0] === '#') {
      return this.getActorByID(query.substr(1));
    }
    groups = [];
    _ref = query.split(' ');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      className = _ref[_i];
      className = className.trim();
      if (className.length === 0) {
        continue;
      }
      classGroup = this.classes[className];
      if (classGroup != null) {
        groups.push(classGroup);
      }
    }
    if (groups.length === 1) {
      return groups[0];
    }
    final = cg.Group.create();
    for (_j = 0, _len1 = groups.length; _j < _len1; _j++) {
      group = groups[_j];
      final.addAll(group);
    }
    return final;
  };

  Core.prototype._setActorByID = function(actor, id) {
    if (this.__byID[id]) {
      cg.warn('Actor with id ' + id + ' already exists; ignoring.');
    }
    return this.__byID[id] = actor;
  };

  Core.prototype.getActorByID = function(id) {
    return this.__byID[id];
  };

  Core.prototype.getNextID = function() {
    return this.__nextID++;
  };

  Core.prototype.init = function(params) {
    var dtex, filterProp, gfx, k, stg, v, _i, _len, _ref, _ref1;
    if (params == null) {
      params = {};
    }
    this.__plugins_preInit();

    /**
    Emitted when the user attempts to close the game.
    
    TODOC
    @event quitAttempt
     */
    this.on('quitAttempt', (function(_this) {
      return function() {
        return _this.quit();
      };
    })(this));

    /**
    Emitted when the game gains input focus.
    @event focus
     */
    this.on('focus', (function(_this) {
      return function() {
        _this.__lastCall = Date.now();
        _this._focused = true;
      };
    })(this));

    /**
    Emitted when the game loses input focus.
    @event blur
     */
    this.on('blur', (function(_this) {
      return function() {
        _this.__lastCall = Date.now();
        _this._focused = false;
      };
    })(this));

    /**
    Emitted when the game's visibility changes.
    
    TODOC (What exactly does this mean in various circumstances?)
    @event
     */
    this.on('visibilityChange', (function(_this) {
      return function(visible) {
        _this.__lastCall = Date.now();
        return _this._visible = visible;
      };
    })(this));
    for (k in params) {
      if (!__hasProp.call(params, k)) continue;
      v = params[k];
      this[k] = v;
    }
    this.rand = cg.math.Random.create();
    this.stageRoot = new cg.rendering.Stage;
    this.stageRoot.setBackgroundColor(this.backgroundColor);
    this.stage = this.stageRoot.addChild(new cg.Actor);
    if (this.backgroundColor == null) {
      this.backgroundColor = 0x000000;
    }
    this._disposed = [];
    if (this.displayMode == null) {
      this.displayMode = 'aspect';
    }
    _ref = ['textureFilter', 'resizeFilter'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      filterProp = _ref[_i];
      if ((_ref1 = !this[filterProp]) === 'linear' || _ref1 === 'nearest') {
        cg.warn('Unexpected filter mode: ' + this[filterProp] + '. Defaulting to "linear"');
        this[filterProp] = 'linear';
      }
    }
    if (this.fps == null) {
      this.fps = 60;
    }
    if (this.timeScale == null) {
      this.timeScale = 1;
    }
    this.dt = 1000 / this.fps;
    this.dt_seconds = this.dt / 1000;
    this.tweener = new cg.TweenManager;
    this._focused = true;
    this._visible = true;
    this.currentTime = 0;
    this.__accum = this.dt;
    this.assets = new cg.AssetManager;
    this.renderer = this._newRenderer(this.width, this.height, this.textureFilter);
    this._triggerResize(true);
    dtex = cg.rendering.Sprite.prototype.__defaultTexture = new cg.RenderTexture(10, 10);
    gfx = new cg.rendering.Graphics;
    stg = new cg.rendering.Stage(0xFF00FF);
    stg.addChild(gfx);
    gfx.clear();
    gfx.beginFill(0xFF00FF);
    gfx.drawRect(0, 0, 10, 10);
    gfx.endFill();
    dtex.render(stg);
    return this.__plugins_postInit();
  };

  Core.prototype.mainLoop = function() {
    var count, d, delta, dh, dw, now, start, stop;
    dw = this.getDeviceWidth();
    dh = this.getDeviceHeight();
    if ((dw !== this._dwCache) || (dh !== this._dhCache) || this.__needsTriggerResize) {
      this._dwCache = dw;
      this._dhCache = dh;
      this._triggerResize();
      this.resized = true;
    } else {
      this.resized = false;
    }
    if (!this._focused) {
      return;
    }
    now = Date.now();
    if (this.__lastCall == null) {
      this.__lastCall = now;
    }
    delta = now - this.__lastCall;
    count = 0;
    this.__lastCall = now;
    start = Date.now();
    this.__accum += delta;
    if (this.profiling) {
      console.profile('update');
    }
    while ((this.__accum >= this.dt / this.timeScale) && count < 20) {
      ++count;
      this.tweener.update();
      this.emit('beforeUpdate', this);
      this.update();
      this.emit('afterUpdate', this);
      this.__accum -= this.dt / this.timeScale;
    }
    if (this.profiling) {
      console.profileEnd();
    }
    if (!this._visible) {
      return;
    }
    if (this.profiling) {
      console.profile('draw');
    }
    this.emit('beforeDraw', this);
    this.draw((1 - this.__accum / this.dt / this.timeScale) / 1000);
    this.emit('afterDraw', this);
    if (this.profiling) {
      console.profileEnd();
    }
    stop = Date.now();
    return d = stop - start;
  };

  Core.prototype._triggerResize = function(forceResize) {
    var dh, displayAR, dw, frameBuffer, frameBufferSprite, gameAR, prevHeight, prevScale, prevWidth, _ref;
    if (forceResize == null) {
      forceResize = true;
    }
    this.__needsTriggerResize = false;
    prevScale = this.scale;
    prevWidth = this.width;
    prevHeight = this.height;
    switch (this.displayMode) {
      case 'fill':
      case 'fillPixel':
        if (this.scale == null) {
          this.scale = 1;
        }
        this.width = Math.floor(this.getDeviceWidth() / this.scale);
        this.height = Math.floor(this.getDeviceHeight() / this.scale);
        break;
      default:
        if (this.width == null) {
          this.width = 400;
        }
        if (this.height == null) {
          this.height = 240;
        }
        dw = this.getDeviceWidth();
        dh = this.getDeviceHeight();
        displayAR = dw / dh;
        gameAR = this.width / this.height;
        if (gameAR > displayAR) {
          this.scale = dw / this.width;
        } else {
          this.scale = dh / this.height;
        }
        if (this.displayMode === 'pixelPerfect') {
          this.scale = Math.max(1, Math.floor(this.scale));
        }
    }
    if (!(((_ref = this.displayMode) === 'pixel' || _ref === 'pixelPerfect' || _ref === 'fillPixel') && this.scale !== 1)) {
      if (this.frameBufferStage != null) {
        this.frameBufferStage.clearChildren();
        delete this.frameBufferStage;
        this.stageRoot.addChild(this.stage);
      }
      this.stage.scaleX = this.stage.scaleY = this.scale;
      this.__render = (function(_this) {
        return function() {
          return _this.renderer.render(_this.stageRoot);
        };
      })(this);
    } else {
      this.stage.scaleX = this.stage.scaleY = 1;
      frameBuffer = new cg.RenderTexture(this.width, this.height, this.textureFilter, this.resizeFilter);
      frameBufferSprite = new cg.rendering.Sprite(frameBuffer);
      this.frameBufferStage = new cg.rendering.Stage;
      this.frameBufferStage.addChild(frameBufferSprite);
      frameBufferSprite.width = this.width;
      frameBufferSprite.height = this.height;
      frameBufferSprite.scaleX = this.scale;
      if (this.renderer.gl == null) {
        frameBufferSprite.scaleY = this.scale;
        frameBufferSprite.y = 0;
      } else {
        frameBufferSprite.scaleY = -1 * this.scale;
        frameBufferSprite.y = this.height * this.scale;
      }
      this.__render = (function(_this) {
        return function() {
          if (_this.frameBufferStage.backgroundColor !== _this.stageRoot.backgroundColor) {
            _this.frameBufferStage.setBackgroundColor(_this.stageRoot.backgroundColor);
          }
          frameBuffer.render(_this.stage, {
            x: 0,
            y: 0
          }, true);
          return _this.renderer.render(_this.frameBufferStage);
        };
      })(this);
    }
    if (!this._needsResize) {
      this._needsResize = prevScale !== this.scale || prevWidth !== this.width || prevHeight !== this.height;
    }
    if ((this.renderer != null) && this._needsResize || forceResize) {
      this.renderer.resize(this.getRendererWidth(), this.getRendererHeight(), this.getViewportWidth(), this.getViewportHeight(), this.getViewportOffsetX(), this.getViewportOffsetY());
      this._needsResize = false;
      this.emit('afterResize', this);
    }
    return this.renderer._updateAllTextures(this.textureFilter);
  };

  Core.prototype.draw = function(t) {
    var d, start, stop;
    start = Date.now();
    this.__render();
    stop = Date.now();
    return d = stop - start;
  };

  Core.prototype.getDeviceWidth = function() {
    throw new Error('Called unimplemented version of getDeviceWidth');
  };

  Core.prototype.getDeviceHeight = function() {
    throw new Error('Called unimplemented version of getDeviceHeight');
  };

  Core.prototype.maximizeWindow = function() {
    return cg.warn('maximizeWindow not available on this device');
  };

  Core.prototype.minimizeWindow = function() {
    return cg.warn('minimizeWindow not available on this device');
  };

  Core.prototype.restoreWindow = function() {
    return cg.warn('restoreWindow not available on this device');
  };

  Core.prototype.resizeWindow = function(width, height) {
    return cg.warn('resizeWindow not available on this device');
  };

  Core.prototype.quit = function() {};

  Core.prototype._dispose = function(obj) {
    return this._disposed.push(obj);
  };

  Core.prototype._addActorToClassGroup = function(actor, cls) {
    var _base;
    if (actor._destroyed) {
      return;
    }
    if ((_base = this.classes)[cls] == null) {
      _base[cls] = cg.Group.create();
    }
    return this.classes[cls].add(actor);
  };

  Core.prototype._removeActorFromClassGroup = function(actor, cls) {
    if (!this.classes[cls]) {
      return;
    }
    this.classes[cls].remove(actor);
    if (this.classes[cls].length === 0) {
      return delete this.classes[cls];
    }
  };


  /**
  Emitted *immediately after* [`update`](#method_update) executes inside [`mainLoop`](#method_mainLoop).
  @event afterUpdate
   */


  /**
  Emitted *immediately before* [`update`](#method_update) executes inside [`mainLoop`](#method_mainLoop).
  @event beforeUpdate
   */


  /**
  Recursively updates all non-paused children.
  
  After updating, disposes any children that have been [`destroy`](cg.Actor.html#method_destroy)ed.
  
  @method update
   */

  Core.prototype.update = function() {
    var obj, _i, _len, _ref;
    this.__plugins_preUpdate();
    this.currentTime += cg.dt;
    this.stage.update();
    _ref = this._disposed;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      obj = _ref[_i];
      obj._dispose();
      if (obj.id != null) {
        delete this.__byID[obj.id];
      }
    }
    this._disposed = [];
    this.__plugins_postUpdate();
  };


  /**
  Convenience method; equivalent to calling [`new Tween(obj, params)`](cg.Tween.html).
  
  @method tween
  @return {cg.Tween} The newly-created tween.
   */

  Core.prototype.tween = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(cg.Tween, args, function(){});
  };


  /**
  TODOC
  
  @method delay
  @return {cg.Tween} The newly-created tween.
   */

  Core.prototype.delay = function(time, func) {
    var t;
    t = new Tween(this, {
      duration: time,
      immediate: false
    });
    t.start().then(func);
    return t;
  };

  return Core;

})(Module);

cg = Core.create();

if (typeof global !== "undefined" && global !== null) {
  global.cg = cg;
}

if (typeof window !== "undefined" && window !== null) {
  window.cg = cg;
}

cg.setLogLevel('verbose');

module.exports = cg;


}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"Module":6,"util/HasPlugins":91,"util/HasSignals":93,"util/index":98}],14:[function(require,module,exports){
var Module, UserDataManager,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Module = require('Module');


/**
Store and retrieve data (eg. save game info, preferences, etc).

@class cg.data.UserDataManager
@constructor
@param namespace {String}
A unique name for data associated with this `UserDataManager`.
 */

UserDataManager = (function(_super) {
  __extends(UserDataManager, _super);

  function UserDataManager(namespace) {
    this.namespace = namespace;
    if (this.namespace == null) {
      throw new Error('Namespace parameter is required for creating a new UserDataManager');
    }
  }


  /**
  Retrieve data associated with a given key. The type of the data is preserved from when it was set.
  
  @method get
  @param key {String}
  The identifier for the data you wish to retrieve.
  @return {Promise}
  A Promise that resolves with the value associated with the given key.
  If the value doesn't exist, `undefined` is resolved successfully; the promise
  is only rejected with an error if there is some internal problem accessing
  user data.
  
  @example
  data.get('color', function (err, color) {
    cg.log('Color: ' + color);
  });
  
  @example
  data.get('preferences', function (err, prefs) {
    if (err) {
      cg.error('Unexpected error when loading preferences: ' + err);
      return;
    }
    cg.log(prefs.difficulty);                    // "Hurt Me Plenty!"
    cg.log('Hello, ' + prefs.player_name + '.'); // "Hello, Clarice."
  });
   */

  UserDataManager.prototype.get = function(key, cb) {
    throw new Error('You must be override UserDataManager::get; do not call `super` within your implementation.');
  };


  /**
  Store some data with a given key name.
  
  @method set
  @param key {String}
  A unique identifier with which you will later retrieve the data.
  
  @param value {Number|String|Object}
  The data to associate with the specified key.
  **NOTE**: If specifying an `Object`, it will be serialized as JSON before storage; it must therefore not contain any circular references.
  
  @example
  data.set('color', 'red');
  
  @example
  var prefs = {
    difficulty: 'Hurt Me Plenty!',
    player_name: 'Clarice'
  };
  
  data.set('preferences', prefs, function (err) {
    if (err) {
      cg.error('Unexpected error when saving preferences: ' + err);
    }
  });
   */

  UserDataManager.prototype.set = function(key, value, cb) {
    throw new Error('You must be override UserDataManager::set; do not call `super` within your implementation.');
  };

  return UserDataManager;

})(Module);

module.exports = UserDataManager;


},{"Module":6}],15:[function(require,module,exports){
var LoadingScreen, Scene, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Scene = require('Scene');


/**
@class cg.extras.LoadingScreen
@constructor
@param [properties]
A set of name/value pairs that will be copied into the resulting `LoadingScreen` object, as with [`cg.Actor`](cg.Actor.html)

@param [properties.barHeight=20]
Height in virtual pixels of the loading bar.

@param [properties.padding=4]
Amount of padding inside the loading bar's container; this essentially forms a border around the progress bar.

@param [properties.bgColor=0x000000]
The color of the loading bar's background.

@param [properties.bgColor=0xFFF]
The color of the loading bar's progress bar.
 */

LoadingScreen = (function(_super) {
  __extends(LoadingScreen, _super);

  function LoadingScreen() {
    LoadingScreen.__super__.constructor.apply(this, arguments);
    this.bar = this.addChild(new cg.rendering.Graphics);
    if (this.alpha == null) {
      this.alpha = 1;
    }
    if (this.barHeight == null) {
      this.barHeight = 20;
    }
    if (this.padding == null) {
      this.padding = 4;
    }
    if (this.bgColor == null) {
      this.bgColor = 0x000000;
    }
    if (this.fgColor == null) {
      this.fgColor = 0xFFFFFF;
    }
    this.reset();
  }


  /**
  Set the progress bar back to zero.
  
  @method reset
   */

  LoadingScreen.prototype.reset = function() {
    this.progress = 0;
    return this.alpha = 1;
  };


  /**
  Start the loading animation.
  
  @method begin
   */

  LoadingScreen.prototype.begin = function() {
    return this.reset();
  };


  /**
  Animate the progress of this loading screen to a given percentage.
  
  @method setProgress
  @param val
  A number between 0 and 1 that represents the percentage of loading that has been completed.
   */

  LoadingScreen.prototype.setProgress = function(val) {
    var _ref;
    if (this.progress > val) {
      return;
    }
    if ((_ref = this._progressTween) != null) {
      _ref.stop();
    }
    return this._progressTween = this.tween({
      duration: 2000,
      easeFunc: 'linear',
      values: {
        progress: Math.min(val, 1.0)
      }
    });
  };


  /**
  Finish the loading animation.
  
  @method complete
  @return {Promise}
  A promise that resolves itself once the completion animation has finished.
  
  @example
      loadingScreen.complete().then(function () {
        loadingScreen.destroy();
        titleScreen.show();
      });
   */

  LoadingScreen.prototype.complete = function() {
    var _ref;
    if ((_ref = this._progressTween) != null) {
      _ref.stop();
    }
    return this.tween({
      duration: 100,
      easeFunc: 'linear',
      values: {
        progress: 1
      }
    }).then(function() {
      return this.hide(100).then(function() {
        return this.emit('complete');
      });
    });
  };

  LoadingScreen.prototype.update = function() {
    LoadingScreen.__super__.update.apply(this, arguments);
    this.bar.clear();
    this.bar.beginFill(this.bgColor);
    this.bar.drawRect(this.padding, cg.height / 2 - this.barHeight / 2 - this.padding / 2, cg.width - 2 * this.padding, this.barHeight + this.padding);
    this.bar.endFill();
    this.bar.beginFill(this.fgColor);
    this.bar.drawRect(this.padding * 1.5, cg.height / 2 - this.barHeight / 2, this.progress * (cg.width - 2 * this.padding * 1.5), this.barHeight);
    this.bar.endFill();
    return this.bar.alpha = this.alpha;
  };

  return LoadingScreen;

})(Scene);

module.exports = LoadingScreen;


},{"Scene":7,"cg":13}],16:[function(require,module,exports){
var Scene, SplashScreen, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Scene = require('Scene');

SplashScreen = (function(_super) {
  __extends(SplashScreen, _super);

  function SplashScreen() {
    SplashScreen.__super__.constructor.apply(this, arguments);
    this.hide();
    if (this.displayTime == null) {
      this.displayTime = 2000;
    }
  }

  SplashScreen.prototype.splashIn = function() {
    this.show();
    this.once(cg.input, 'any', this.splashOut);
    return this._hideDelay = this.delay(this.displayTime, this.splashOut);
  };

  SplashScreen.prototype.splashOut = function() {
    var _ref, _ref1;
    if ((_ref = this._hideDelay) != null) {
      _ref.stop();
    }
    if ((_ref1 = this._hideTween) != null) {
      _ref1.stop();
    }
    return this._hideTween = this.hide(250, function() {
      return this.emit('done');
    });
  };

  return SplashScreen;

})(Scene);

SplashScreen.Simple = (function(_super) {
  __extends(Simple, _super);

  function Simple(logoTexture) {
    this.logoTexture = logoTexture;
    Simple.__super__.constructor.apply(this, arguments);
    this.logo = this.addChild(new cg.SpriteActor({
      texture: this.logoTexture,
      anchorX: 0.5,
      anchorY: 0.5
    }));
    this.hide();
  }

  Simple.prototype.splashIn = function() {
    var ar, gameAR, height, scale, width, _ref, _ref1, _ref2;
    Simple.__super__.splashIn.apply(this, arguments);
    this.logo.x = cg.width / 2;
    this.logo.y = cg.height / 2;
    if ((_ref = this.widthTween) != null) {
      _ref.stop();
    }
    if ((_ref1 = this.heightTween) != null) {
      _ref1.stop();
    }
    _ref2 = this.logo, width = _ref2.width, height = _ref2.height;
    gameAR = cg.width / cg.height;
    ar = width / height;
    if (ar > gameAR) {
      scale = cg.width / width;
    } else {
      scale = cg.height / height;
    }
    this.logo.width = this.logo.height = 0;
    this.widthTween = this.logo.tween({
      values: {
        width: width * scale
      },
      easeFunc: 'elastic.out'
    });
    return this.heightTween = this.logo.tween({
      delay: 50,
      values: {
        height: height * scale
      },
      easeFunc: 'elastic.out'
    });
  };

  return Simple;

})(SplashScreen);

module.exports = SplashScreen;


},{"Scene":7,"cg":13}],17:[function(require,module,exports){
var LoadingScreen, SplashScreen;

SplashScreen = require('extras/SplashScreen');

LoadingScreen = require('extras/LoadingScreen');

module.exports = {
  SplashScreen: SplashScreen,
  LoadingScreen: LoadingScreen
};


},{"extras/LoadingScreen":15,"extras/SplashScreen":16}],18:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/**
@author Mat Groves http://matgroves.com/ @Doormat23
 */
var BaseTexture, CanvasRenderer, Detector, WebGLRenderer;

WebGLRenderer = require('rendering/renderers/webgl/WebGLRenderer');

CanvasRenderer = require('rendering/renderers/canvas/CanvasRenderer');

BaseTexture = require('rendering/textures/BaseTexture');

Detector = {};


/*
This helper function will automatically detect which renderer you should be using.
WebGL is the preferred renderer as it is a lot fastest. If webGL is not supported by the browser then this function will return a canvas renderer
@method autoDetectRenderer
@static
@param width {Number} the width of the renderers view
@param height {Number} the height of the renderers view
@param view {Canvas} the canvas to use as a view, optional
@param transparent {Boolean} the transparency of the render view, default false
@default false
 */

Detector.autoDetectRenderer = function(width, height, view, transparent, textureFilter, resizeFilter) {
  var webgl;
  if (textureFilter == null) {
    textureFilter = 'linear';
  }
  if (resizeFilter == null) {
    resizeFilter = 'linear';
  }
  webgl = (function() {
    var canvas, e;
    try {
      canvas = document.createElement('canvas');
      return !!window.WebGLRenderingContext && !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (_error) {
      e = _error;
      return false;
    }
  })();
  if (webgl) {
    return new WebGLRenderer(width, height, view, transparent, textureFilter, resizeFilter);
  }
  return new CanvasRenderer(width, height, view, transparent, textureFilter, resizeFilter);
};

module.exports = Detector;


},{"rendering/renderers/canvas/CanvasRenderer":69,"rendering/renderers/webgl/WebGLRenderer":74,"rendering/textures/BaseTexture":75}],19:[function(require,module,exports){
var LocalStorageUserDataManager, Promises, UserDataManager,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

UserDataManager = require('data/UserDataManager');

Promises = require('util/Promises');

LocalStorageUserDataManager = (function(_super) {
  __extends(LocalStorageUserDataManager, _super);

  function LocalStorageUserDataManager() {
    return LocalStorageUserDataManager.__super__.constructor.apply(this, arguments);
  }

  LocalStorageUserDataManager.prototype.get = function(key, cb) {
    var deferred, e;
    deferred = new Promises.Deferred;
    if (typeof cb === 'function') {
      deferred.promise.then(cb.bind(null, void 0), cb);
    }
    try {
      deferred.resolve(JSON.parse(localStorage.getItem(this.namespace + '$' + key)));
    } catch (_error) {
      e = _error;
      deferred.reject(e);
    }
    return deferred.promise;
  };

  LocalStorageUserDataManager.prototype.set = function(key, value, cb) {
    var deferred, e;
    deferred = new Promises.Deferred;
    if (typeof cb === 'function') {
      deferred.promise.then(cb.bind(null, void 0), cb);
    }
    try {
      localStorage.setItem(this.namespace + '$' + key, JSON.stringify(value));
      deferred.resolve(value);
    } catch (_error) {
      e = _error;
      deferred.reject(e);
    }
    return deferred.promise;
  };

  return LocalStorageUserDataManager;

})(UserDataManager);

module.exports = LocalStorageUserDataManager;


},{"data/UserDataManager":14,"util/Promises":94}],20:[function(require,module,exports){
var AssetManager, Deferred, Promises, Texture, WebAssetManager, WebMusic, WebSound, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

cg = require('cg');

AssetManager = require('AssetManager');

Texture = require('rendering/textures/Texture');

WebSound = require('implementations/web/WebSound');

WebMusic = require('implementations/web/WebMusic');

Promises = require('util/Promises');

Deferred = Promises.Deferred;

WebAssetManager = (function(_super) {
  __extends(WebAssetManager, _super);

  function WebAssetManager() {
    return WebAssetManager.__super__.constructor.apply(this, arguments);
  }

  WebAssetManager.prototype.loadJSON = function(path) {
    var ajaxRequest, deferred;
    deferred = new Deferred(this);
    ajaxRequest = new XMLHttpRequest;
    ajaxRequest.onreadystatechange = function() {
      var e, json;
      if (ajaxRequest.readyState === 4) {
        if (!(ajaxRequest.status === 200 || window.location.href.indexOf('http') === -1)) {
          return deferred.reject("Failed to load file " + path);
        } else {
          try {
            json = JSON.parse(ajaxRequest.responseText);
            return deferred.resolve(json);
          } catch (_error) {
            e = _error;
            return deferred.reject("Failed to parse file " + path + ":\n" + e.name + ": " + e.message);
          }
        }
      }
    };
    ajaxRequest.open('GET', path, true);
    if (ajaxRequest.overrideMimeType) {
      ajaxRequest.overrideMimeType('application/json');
    }
    ajaxRequest.send(null);
    return deferred.promise;
  };

  WebAssetManager.prototype.loadTexture = function(path) {
    var deferred, fileType, texture;
    deferred = new Deferred(this);
    fileType = path.split(".").pop().split('?')[0].toLowerCase();
    if (path in AssetManager._textureCache) {
      deferred.resolve(AssetManager._textureCache[path]);
    }
    if (__indexOf.call(AssetManager.textureTypes, fileType) >= 0) {
      texture = Texture.fromImage(path);
      texture.path = path;
      if (texture.baseTexture.hasLoaded) {
        deferred.resolve(texture);
      } else {
        texture.baseTexture.on('loaded', (function(_this) {
          return function(event) {
            return deferred.resolve(texture);
          };
        })(this));
        texture.baseTexture.on('error', (function(_this) {
          return function(event) {
            texture.error = event;
            return deferred.reject(texture);
          };
        })(this));
      }
      return deferred.promise;
    }
    if (texture == null) {
      texture = {};
    }
    cg.error(texture.error = path + ' is an unsupported file type.');
    deferred.reject(texture);
    return deferred.promise;
  };

  WebAssetManager.prototype.loadSound = function(paths, volume, numChannels) {
    var snd;
    snd = new WebSound(paths, volume, numChannels);
    return snd.load();
  };

  WebAssetManager.prototype.loadMusic = function(paths, volume) {
    var snd;
    snd = new WebMusic(paths, volume);
    return snd.load();
  };

  return WebAssetManager;

})(AssetManager);

module.exports = WebAssetManager;


},{"AssetManager":4,"cg":13,"implementations/web/WebMusic":22,"implementations/web/WebSound":23,"rendering/textures/Texture":77,"util/Promises":94}],21:[function(require,module,exports){

/*
combo.js - Copyright 2012-2013 Louis Acresti - All Rights Reserved
 */
var InputManager, WebInputManager, addMouseWheelHandler, cg, elementPosition, getNumericStyleProperty, setupKeys,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

cg = require('cg');

InputManager = require('input/InputManager');

setupKeys = function() {
  cg.__keys = {
    'backspace': 8,
    'tab': 9,
    'enter': 13,
    'return': 13,
    'shift': 16,
    'lshift': 16,
    'rshift': 16,
    'ctrl': 17,
    'lctrl': 17,
    'rctrl': 17,
    'alt': 18,
    'lalt': 18,
    'altr': 18,
    'pause': 19,
    'capslock': 20,
    'esc': 27,
    'space': 32,
    'pageup': 33,
    'pagedown': 34,
    'end': 35,
    'home': 36,
    'left': 37,
    'up': 38,
    'right': 39,
    'down': 40,
    'insert': 45,
    'delete': 46,
    '0': 48,
    '1': 49,
    '2': 50,
    '3': 51,
    '4': 52,
    '5': 53,
    '6': 54,
    '7': 55,
    '8': 56,
    '9': 57,
    'a': 65,
    'b': 66,
    'c': 67,
    'd': 68,
    'e': 69,
    'f': 70,
    'g': 71,
    'h': 72,
    'i': 73,
    'j': 74,
    'k': 75,
    'l': 76,
    'm': 77,
    'n': 78,
    'o': 79,
    'p': 80,
    'q': 81,
    'r': 82,
    's': 83,
    't': 84,
    'u': 85,
    'v': 86,
    'w': 87,
    'x': 88,
    'y': 89,
    'z': 90,
    'kp_0': 96,
    'kp_1': 97,
    'kp_2': 98,
    'kp_3': 99,
    'kp_4': 100,
    'kp_5': 101,
    'kp_6': 102,
    'kp_7': 103,
    'kp_8': 104,
    'kp_9': 105,
    'kp_multiply': 106,
    'kp_plus': 107,
    'kp_minus': 109,
    'kp_decimal': 110,
    'kp_divide': 111,
    'f1': 112,
    'f2': 113,
    'f3': 114,
    'f4': 115,
    'f5': 116,
    'f6': 117,
    'f7': 118,
    'f8': 119,
    'f9': 120,
    'f10': 121,
    'f11': 122,
    'f12': 123,
    'equal': 187,
    '=': 187,
    'comma': 188,
    ',': 188,
    'minus': 189,
    '-': 189,
    'period': 190,
    '.': 190
  };
  return InputManager._generateKeyNameMap();
};

addMouseWheelHandler = (function() {
  return function(element, callback) {
    var binding, handler, lowestDelta, lowestDeltaXY, toBind, _i, _results;
    handler = function(event) {
      var absDelta, absDeltaXY, args, delta, deltaX, deltaY, fn, lowestDelta, lowestDeltaXY;
      if (event == null) {
        event = window.event;
      }
      args = [].slice.call(arguments, 1);
      delta = 0;
      deltaX = 0;
      deltaY = 0;
      absDelta = 0;
      absDeltaXY = 0;
      fn = void 0;
      if (event.wheelDelta) {
        delta = event.wheelDelta;
      }
      if (event.detail) {
        delta = event.detail * -1;
      }
      if (event.deltaY) {
        deltaY = event.deltaY * -1;
        delta = deltaY;
      }
      if (event.deltaX) {
        deltaX = event.deltaX;
        delta = deltaX * -1;
      }
      if (event.wheelDeltaY !== undefined) {
        deltaY = event.wheelDeltaY;
      }
      if (event.wheelDeltaX !== undefined) {
        deltaX = event.wheelDeltaX * -1;
      }
      absDelta = Math.abs(delta);
      if (!lowestDelta || absDelta < lowestDelta) {
        lowestDelta = absDelta;
      }
      absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
      if (!lowestDeltaXY || absDeltaXY < lowestDeltaXY) {
        lowestDeltaXY = absDeltaXY;
      }
      fn = (delta > 0 ? 'floor' : 'ceil');
      delta = Math[fn](delta / lowestDelta);
      deltaX = Math[fn](deltaX / lowestDeltaXY);
      deltaY = Math[fn](deltaY / lowestDeltaXY);
      args.unshift(event, delta, deltaX, deltaY);
      return callback.apply(null, args);
    };
    toBind = ('onwheel' in document || document.documentMode >= 9 ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll']);
    lowestDelta = void 0;
    lowestDeltaXY = void 0;
    _results = [];
    for (_i = toBind.length - 1; _i >= 0; _i += -1) {
      binding = toBind[_i];
      _results.push(element.addEventListener(binding, handler, false));
    }
    return _results;
  };
})();

getNumericStyleProperty = function(element, prop) {
  var style;
  style = getComputedStyle(element, null);
  return parseInt(style.getPropertyValue(prop), 10);
};

elementPosition = function(e) {
  var borderLeft, borderTop, inner, paddingLeft, paddingTop, x, y;
  x = 0;
  y = 0;
  inner = true;
  while (true) {
    x += e.offsetLeft;
    y += e.offsetTop;
    borderTop = getNumericStyleProperty(e, 'border-top-width');
    borderLeft = getNumericStyleProperty(e, 'border-left-width');
    y += borderTop;
    x += borderLeft;
    if (inner) {
      paddingTop = getNumericStyleProperty(e, 'padding-top');
      paddingLeft = getNumericStyleProperty(e, 'padding-left');
      y += paddingTop;
      x += paddingLeft;
    }
    inner = false;
    if (!(e = e.offsetParent)) {
      break;
    }
  }
  return {
    x: x,
    y: y
  };
};

WebInputManager = (function(_super) {
  __extends(WebInputManager, _super);

  WebInputManager.__initialized = false;

  WebInputManager.__initialize = function() {
    var container, preventDefaultKeys, touchStop, touchesById;
    if (this.__initialized) {
      return;
    }
    this.__initialized = true;
    setupKeys();
    preventDefaultKeys = [cg.__keys['tab'], cg.__keys['backspace']];
    container = cg.container;
    window.addEventListener('keydown', function(e) {
      var _ref, _ref1;
      if ((_ref = document.activeElement.tagName) === 'INPUT') {
        return;
      }
      if (_ref1 = e.keyCode, __indexOf.call(preventDefaultKeys, _ref1) >= 0) {
        e.preventDefault();
      }
      cg.input._triggerKeyDown(e.keyCode);
      return true;
    });
    window.addEventListener('keyup', function(e) {
      var _ref, _ref1;
      if ((_ref = document.activeElement.tagName) === 'INPUT') {
        return;
      }
      if (_ref1 = e.keyCode, __indexOf.call(preventDefaultKeys, _ref1) >= 0) {
        e.preventDefault();
      }
      cg.input._triggerKeyUp(e.keyCode);
      return true;
    });
    window.addEventListener('keypress', function(e) {
      cg.input.emit('keyPress', e.charCode);
      return true;
    });
    touchesById = {};
    container.oncontextmenu = function() {
      return false;
    };
    window.addEventListener('mousemove', function(e) {
      return cg.input._triggerMouseMove(e.pageX, e.pageY);
    });
    container.addEventListener('mousedown', function(e) {
      return cg.input._triggerMouseDown(e.which);
    });
    window.addEventListener('mouseup', function(e) {
      return cg.input._triggerMouseUp(e.which);
    });
    container.addEventListener('touchstart', function(e) {
      var num, touch, _i, _len, _ref, _results;
      e.preventDefault();
      _ref = e.touches;
      _results = [];
      for (num = _i = 0, _len = _ref.length; _i < _len; num = ++_i) {
        touch = _ref[num];
        if (__indexOf.call(e.changedTouches, touch) >= 0) {
          touchesById[touch.identifier] = t;
          _results.push(cg.input._triggerTouchDown(touch.pageX, touch.pageY, num));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    });
    container.addEventListener('touchmove', function(e) {
      var num, touch, _i, _len, _ref, _results;
      e.preventDefault();
      _ref = e.touches;
      _results = [];
      for (num = _i = 0, _len = _ref.length; _i < _len; num = ++_i) {
        touch = _ref[num];
        if (__indexOf.call(e.changedTouches, touch) >= 0) {
          _results.push(cg.input._triggerTouchDrag(touch.pageX, touch.pageY, num));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    });
    addMouseWheelHandler(container, function(e, delta, deltaX, deltaY) {
      return cg.input.emit('mouseWheel', {
        dx: deltaX,
        dy: deltaY
      });
    });
    touchStop = function(e) {
      var num, touch, _i, _len, _ref, _results;
      _ref = e.touches;
      _results = [];
      for (num = _i = 0, _len = _ref.length; _i < _len; num = ++_i) {
        touch = _ref[num];
        if (__indexOf.call(e.changedTouches, touch) >= 0) {
          _results.push(cg.input._triggerTouchUp(touch.pageX, touch.pageY, num));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    container.addEventListener('touchend', touchStop);
    return container.addEventListener('touchcancel', touchStop);
  };

  WebInputManager.prototype._transformDeviceCoordinates = function(pageX, pageY) {
    var h, p, view, w, x, y;
    view = cg.renderer.getView();
    w = getNumericStyleProperty(view, 'width');
    h = getNumericStyleProperty(view, 'height');
    p = elementPosition(view);
    x = ((pageX - p.x) / w) * cg.width;
    y = ((pageY - p.y) / h) * cg.height;
    return [x, y];
  };

  function WebInputManager() {
    WebInputManager.__initialize();
    WebInputManager.__super__.constructor.apply(this, arguments);
  }

  return WebInputManager;

})(InputManager);

module.exports = WebInputManager;


},{"cg":13,"input/InputManager":28}],22:[function(require,module,exports){
var Deferred, Music, Promises, WebMusic, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Music = require('sound/Music');

Promises = require('util/Promises');

Deferred = Promises.Deferred;

WebMusic = (function(_super) {
  __extends(WebMusic, _super);

  function WebMusic() {
    this.__pathIndex = 0;
    if (this.__deferred == null) {
      this.__deferred = new Deferred(this);
    }
    this.__loaded = false;
    WebMusic.__super__.constructor.apply(this, arguments);
  }

  WebMusic.prototype.load = function() {
    var canPlayThrough;
    WebMusic.__super__.load.apply(this, arguments);
    if (this.__loaded) {
      this.__deferred.resolve(this);
    } else {
      this.path = this.paths[this.__pathIndex];
      this.__data = new Audio(this.path);
      this.__data.load();
      canPlayThrough = (function(_this) {
        return function() {
          _this.__data.removeEventListener('canplaythrough', canPlayThrough);
          _this.__setupBindings();
          _this._setLooping(_this.looping);
          _this._setVolume(_this.volume);
          _this.__data.addEventListener('ended', function() {
            if (_this.looping) {
              return _this.__data.play();
            } else {
              return _this.stop();
            }
          }, false);
          _this.__loaded = true;
          return _this.__deferred.resolve(_this);
        };
      })(this);
      this.__data.addEventListener('canplaythrough', canPlayThrough, false);
      this.__data.addEventListener('error', (function(_this) {
        return function(error) {
          ++_this.__pathIndex;
          if (_this.__pathIndex < _this.paths.length) {
            return _this.load();
          } else {
            _this.error = error;
            return _this.__deferred.reject(new Error(_this.error));
          }
        };
      })(this), false);
    }
    return this.__deferred.promise;
  };

  WebMusic.prototype._setVolume = function(volume) {
    var effectiveVolume, _ref;
    WebMusic.__super__._setVolume.apply(this, arguments);
    effectiveVolume = this.getEffectiveVolume();
    if ((_ref = this.__data) != null) {
      _ref.volume = effectiveVolume;
    }
    return this;
  };

  WebMusic.prototype._setLooping = function(looping) {
    var _ref;
    WebMusic.__super__._setLooping.apply(this, arguments);
    if ((_ref = this.__data) != null) {
      _ref.loop = looping;
    }
    return this;
  };

  WebMusic.prototype._play = function(volume, looping) {
    var effectiveVolume;
    if (volume == null) {
      volume = this.volume;
    }
    if (looping == null) {
      looping = this.looping;
    }
    effectiveVolume = this.getEffectiveVolume(volume);
    this.volume = volume;
    this.__data.currentTime = 0;
    this.__data.play();
    return this.looping = looping;
  };

  WebMusic.prototype._stop = function() {
    if (!this.__loaded) {
      return;
    }
    this.__data.currentTime = 0;
    return this.__data.pause();
  };

  return WebMusic;

})(Music);

module.exports = WebMusic;


},{"cg":13,"sound/Music":79,"util/Promises":94}],23:[function(require,module,exports){
var Deferred, Promises, Sound, WebSound, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Sound = require('sound/Sound');

Promises = require('util/Promises');

Deferred = Promises.Deferred;

WebSound = (function(_super) {
  __extends(WebSound, _super);

  function WebSound() {
    this.__pathIndex = 0;
    this.__channels = [];
    if (this.__deferred == null) {
      this.__deferred = new Deferred(this);
    }
    WebSound.__super__.constructor.apply(this, arguments);
  }

  WebSound.prototype.load = function() {
    var canPlayThrough;
    WebSound.__super__.load.apply(this, arguments);
    if (this.__loaded) {
      this.__deferred.resolve(this);
    } else {
      this.path = this.paths[this.__pathIndex];
      this.__data = new Audio(this.path);
      this.__data.load();
      canPlayThrough = (function(_this) {
        return function() {
          var a;
          _this.__data.removeEventListener('canplaythrough', canPlayThrough);
          _this.__channels = [_this.__data];
          while (_this.__channels.length < _this.numChannels) {
            a = new Audio(_this.path);
            _this.__channels.push(a);
          }
          _this.__setupBindings();
          _this.__loaded = true;
          return _this.__deferred.resolve(_this);
        };
      })(this);
      this.__data.addEventListener('canplaythrough', canPlayThrough, false);
      this.__data.addEventListener('error', (function(_this) {
        return function(error) {
          ++_this.__pathIndex;
          if (_this.__pathIndex < _this.paths.length) {
            return _this.load();
          } else {
            _this.error = error;
            return _this.__deferred.reject(_this.error);
          }
        };
      })(this), false);
    }
    return this.__deferred.promise;
  };

  WebSound.prototype.__getChannelsForIndex = function(idx) {
    if (this.__channels[idx] != null) {
      return [this.__channels[idx]];
    } else {
      return this.__channels;
    }
  };

  WebSound.prototype._setVolume = function(volume, idx) {
    var c, channels, effectiveVolume, _i, _len;
    WebSound.__super__._setVolume.apply(this, arguments);
    channels = this.__getChannelsForIndex(idx);
    effectiveVolume = this.getEffectiveVolume();
    for (idx = _i = 0, _len = channels.length; _i < _len; idx = ++_i) {
      c = channels[idx];
      c.volume = effectiveVolume;
    }
  };

  WebSound.prototype._play = function(volume, looping) {
    var c, effectiveVolume, idx, minCurrentTime, minIdx, _i, _len, _ref, _ref1;
    if (!this.__loaded) {
      cg.warn((_ref = 'Sound: Could not play ' + this.path) != null ? _ref : this.paths + '; not yet loaded.');
      return;
    }
    effectiveVolume = this.getEffectiveVolume(volume);
    if (effectiveVolume <= 0) {
      return;
    }
    minCurrentTime = Infinity;
    minIdx = -1;
    _ref1 = this.__channels;
    for (idx = _i = 0, _len = _ref1.length; _i < _len; idx = ++_i) {
      c = _ref1[idx];
      if (!(c.ended || c.paused) && c.currentTime < minCurrentTime) {
        minIdx = idx;
        minCurrentTime = c.currentTime;
      } else {
        minIdx = idx;
        break;
      }
    }
    c = this.__channels[minIdx];
    c.currentTime = 0;
    c.volume = effectiveVolume;
    c.loop = looping;
    c.play();
    return idx;
  };

  WebSound.prototype.stop = function(idx) {
    var c, channels, _i, _len;
    channels = this.__getChannelsForIndex(idx);
    for (_i = 0, _len = channels.length; _i < _len; _i++) {
      c = channels[_i];
      c.currentTime = 0;
      c.pause();
    }
  };

  return WebSound;

})(Sound);

module.exports = WebSound;


},{"cg":13,"sound/Sound":80,"util/Promises":94}],24:[function(require,module,exports){
var CanvasRenderer, Detector, LocalStorageUserDataManager, UIManager, WebAssetManager, WebGLRenderer, WebInputManager, WebMusic, WebSound,
  __hasProp = {}.hasOwnProperty;

LocalStorageUserDataManager = require('implementations/web/LocalStorageUserDataManager');

WebAssetManager = require('implementations/web/WebAssetManager');

WebInputManager = require('implementations/web/WebInputManager');

WebMusic = require('implementations/web/WebMusic');

WebSound = require('implementations/web/WebSound');

Detector = require('implementations/web/Detector');

CanvasRenderer = require('rendering/renderers/canvas/CanvasRenderer');

WebGLRenderer = require('rendering/renderers/webgl/WebGLRenderer');

UIManager = require('plugins/ui/UIManager');

module.exports = function(cg) {
  var change, hidden, lastTime, onchange, vendor, vis, _i, _len, _ref;
  if (!((typeof window !== "undefined" && window !== null) && (typeof document !== "undefined" && document !== null))) {
    throw new Error('`window` and/or `document` arent defined; are you in a browser(like) environment?');
  }
  onchange = function(evt) {
    var body;
    if (cg == null) {
      return;
    }
    body = document.body;
    evt = evt || window.event;
    if (evt.type === 'focus' || evt.type === 'focusin') {
      return cg.emit('visibilityChange', true);
    } else if (evt.type === 'blur' || evt.type === 'focusout') {
      return cg.emit('visibilityChange', false);
    } else {
      if (this.hidden) {
        return cg.emit('visibilityChange', false);
      } else {
        return cg.emit('visibilityChange', true);
      }
    }
  };
  hidden = void 0;
  change = void 0;
  vis = {
    hidden: 'visibilitychange',
    mozHidden: 'mozvisibilitychange',
    webkitHidden: 'webkitvisibilitychange',
    msHidden: 'msvisibilitychange',
    oHidden: 'ovisibilitychange'
  };
  for (hidden in vis) {
    if (!__hasProp.call(vis, hidden)) continue;
    if (hidden in document) {
      change = vis[hidden];
      break;
    }
  }
  if (change) {
    document.addEventListener(change, onchange);
  } else if (document.onfocusin !== void 0) {
    document.onfocusin = document.onfocusout = onchange;
  }

  /*
  A polyfill for requestAnimationFrame
  MIT license
  http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  
  requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
  
  @method requestAnimationFrame
   */
  _ref = ['ms', 'moz', 'webkit', 'o'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    vendor = _ref[_i];
    if (window.requestAnimationFrame) {
      break;
    }
    window.requestAnimationFrame = window[vendor + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendor + 'CancelAnimationFrame'] || window[vendor + 'CancelRequestAnimationFrame'];
  }
  if (!window.requestAnimationFrame) {
    lastTime = 0;
    window.requestAnimationFrame = function(callback, element) {
      var currTime, id, timeToCall;
      currTime = new Date().getTime();
      timeToCall = Math.max(0, 16 - (currTime - lastTime));
      id = window.setTimeout(function() {
        return callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  /*
  A polyfill for cancelAnimationFrame
  
  @method cancelAnimationFrame
   */
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      return clearTimeout(id);
    };
  }
  window.requestAnimFrame = window.requestAnimationFrame;
  cg.AssetManager = WebAssetManager;
  cg.sound.Sound = WebSound;
  cg.sound.Music = WebMusic;
  cg.env = {
    getParameterByName: function(name) {
      var regex, results;
      name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
      regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      results = regex.exec(location.search);
      if (results === null) {
        return null;
      } else {
        return decodeURIComponent(results[1].replace(/\+/g, ' '));
      }
    }
  };
  cg.mainLoop = function() {
    cg.Core.prototype.mainLoop.apply(this, arguments);
    return window.requestAnimationFrame.call(null, (function(_this) {
      return function() {
        return _this.mainLoop();
      };
    })(this));
  };
  cg._triggerResize = function() {
    var newView, oldView, _ref1, _ref2;
    oldView = (_ref1 = this.renderer) != null ? _ref1.getView() : void 0;
    cg.Core.prototype._triggerResize.apply(this, arguments);
    newView = (_ref2 = this.renderer) != null ? _ref2.getView() : void 0;
    if ((oldView != null) && (oldView !== newView)) {
      this.container.removeChild(oldView);
    }
    if (newView != null) {
      return this.container.appendChild(newView);
    }
  };
  cg.getDeviceWidth = function() {
    return this.container.clientWidth;
  };
  cg.getDeviceHeight = function() {
    return this.container.clientHeight;
  };
  cg.getRendererWidth = function() {
    return this.width * this.scale;
  };
  cg.getRendererHeight = function() {
    return this.height * this.scale;
  };
  cg.getViewportWidth = function() {
    return this.width * this.scale;
  };
  cg.getViewportHeight = function() {
    return this.height * this.scale;
  };
  cg.getViewportOffsetX = function() {
    return 0;
  };
  cg.getViewportOffsetY = function() {
    return 0;
  };
  cg._newRenderer = function(width, height, textureFilter) {
    if (this.forceWebGL) {
      return new WebGLRenderer(width, height, null, false, textureFilter);
    } else if (this.forceCanvas) {
      return new CanvasRenderer(width, height, null, false, textureFilter);
    } else {
      return Detector.autoDetectRenderer(width, height, null, false, textureFilter);
    }
  };
  return cg.init = function(props) {
    var container, _ref1;
    container = (_ref1 = props.container) != null ? _ref1 : 'combo-game';
    if (typeof container === 'string') {
      this.container = document.getElementById(container);
    } else {
      this.container = container;
    }
    this.input = new WebInputManager;
    delete props.container;
    cg.Core.prototype.init.apply(this, arguments);
    this.data = new LocalStorageUserDataManager(this.name);
    window.addEventListener('focus', (function(_this) {
      return function() {
        return _this.emit('focus', _this);
      };
    })(this), false);
    window.addEventListener('blur', (function(_this) {
      return function() {
        return _this.emit('blur', _this);
      };
    })(this), false);
    return this.mainLoop();
  };
};


},{"implementations/web/Detector":18,"implementations/web/LocalStorageUserDataManager":19,"implementations/web/WebAssetManager":20,"implementations/web/WebInputManager":21,"implementations/web/WebMusic":22,"implementations/web/WebSound":23,"plugins/ui/UIManager":49,"rendering/renderers/canvas/CanvasRenderer":69,"rendering/renderers/webgl/WebGLRenderer":74}],25:[function(require,module,exports){
var Actor, Animation, BaseTexture, Group, Module, RenderTexture, Scene, SoundManager, SpriteActor, Text, Texture, TileSheet, Tween, TweenManager, cg, combo, extras, implement, includes, math, menus, rendering, text, tile,
  __hasProp = {}.hasOwnProperty;

implement = require('implementations/web/index');

cg = require('cg');

Actor = require('Actor');

Animation = require('Animation');

Group = require('Group');

Module = require('Module');

Scene = require('Scene');

SpriteActor = require('SpriteActor');

Text = require('Text');

TileSheet = require('TileSheet');

Tween = require('Tween');

TweenManager = require('TweenManager');

SoundManager = require('sound/SoundManager');

BaseTexture = require('rendering/textures/BaseTexture');

Texture = require('rendering/textures/Texture');

RenderTexture = require('rendering/textures/RenderTexture');

extras = require('extras/index');

math = require('math/index');

menus = require('menus/index');

rendering = require('rendering/index');

text = require('text/index');

tile = require('tile/index');

includes = {
  Actor: Actor,
  Animation: Animation,
  Group: Group,
  Module: Module,
  Scene: Scene,
  SpriteActor: SpriteActor,
  Text: Text,
  TileSheet: TileSheet,
  Tween: Tween,
  TweenManager: TweenManager,
  BaseTexture: BaseTexture,
  Texture: Texture,
  RenderTexture: RenderTexture,
  extras: extras,
  math: math,
  menus: menus,
  rendering: rendering,
  text: text,
  tile: tile
};

combo = {
  __initialized: false,
  init: function() {
    var module, moduleName;
    if (combo.__initialized) {
      return;
    }
    combo.__initialized = true;
    if (typeof Function.prototype.bind !== 'function') {
      Function.prototype.bind = (function() {
        var slice;
        slice = Array.prototype.slice;
        return function(thisArg) {
          var F, bound, boundArgs, target;
          bound = function() {
            var args;
            args = boundArgs.concat(slice.call(arguments));
            return target.apply((this instanceof bound ? this : thisArg), args);
          };
          target = this;
          boundArgs = slice.call(arguments, 1);
          if (typeof target !== 'function') {
            throw new TypeError();
          }
          bound.prototype = (F = function(proto) {
            proto && (F.prototype = proto);
            if (!(this instanceof F)) {
              return new F;
            }
          })(target.prototype);
          return bound;
        };
      })();
    }
    for (moduleName in includes) {
      if (!__hasProp.call(includes, moduleName)) continue;
      module = includes[moduleName];
      cg[moduleName] = module;
    }
    cg.sound = new SoundManager;
    implement(cg);
    return cg.log(combo.VERSION_NAME + ' initialized');
  }
};

Object.defineProperty(combo, 'VERSION', {
  get: function() {
    return '0.0.1';
  }
});

Object.defineProperty(combo, 'VERSION_NAME', {
  get: function() {
    return 'Combo ' + combo.VERSION + ': "There Will Be Bugs"';
  }
});

combo.init();

module.exports = combo;


},{"Actor":2,"Animation":3,"Group":5,"Module":6,"Scene":7,"SpriteActor":8,"Text":9,"TileSheet":10,"Tween":11,"TweenManager":12,"cg":13,"extras/index":17,"implementations/web/index":24,"math/index":34,"menus/index":39,"rendering/index":67,"rendering/textures/BaseTexture":75,"rendering/textures/RenderTexture":76,"rendering/textures/Texture":77,"sound/SoundManager":81,"text/index":85,"tile/index":89}],26:[function(require,module,exports){
var Axis, HasSignals, Module, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Module = require('Module');

HasSignals = require('util/HasSignals');

Axis = (function(_super) {
  __extends(Axis, _super);

  function Axis() {
    return Axis.__super__.constructor.apply(this, arguments);
  }

  Axis.mixin(HasSignals);

  Object.defineProperty(Axis.prototype, 'value', {
    get: function() {
      return this.__value;
    },
    set: function(val) {
      var delta;
      val = cg.math.clamp(val, -1, 1);
      delta = val - this.__value;
      if (delta !== 0) {
        this.__value = val;
        return this.emit('change', val, delta);
      }
    }
  });

  return Axis;

})(Module);

module.exports = Axis;


},{"Module":6,"cg":13,"util/HasSignals":93}],27:[function(require,module,exports){
var Axis, ControlMap, HasSignals, InputManager, Module, MultiTrigger, Touch, Trigger, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __slice = [].slice;

cg = require('cg');

Module = require('Module');

Touch = require('input/Touch');

Trigger = require('input/Trigger');

Axis = require('input/Axis');

MultiTrigger = require('input/MultiTrigger');

HasSignals = require('util/HasSignals');

InputManager = require('input/InputManager');


/**
A mapping of (keyboard keys)[TODOC] to action names; meant to decouple input configurations from game logic.

@class cg.input.ControlMap
@uses cg.util.HasSignals
@constructor
@param [namespace] {String}
Set the value of [`namespace`](#property_namespace).

If specified, these controls will be accessible as `cg.input.controls[namespace]`.
Otherwise, a random UUID will be assigned to [`namespace`](#property_namespace).

@param [map] {Object} Key-value set of control data.

Key names represent the name of the action.
The values are either a string or `Array` of strings representing [keyboard keys](TODOC).

See also: [`actions`](#property_actions)

@example
    var shipControls = new cg.input.ControlMap({
      shoot: 'space',
      thrust: ['up', 'w'],
      brake: ['down', 's'],
      turnLeft: ['left', 'a'],
      turnRight: ['right', 'd']
    });

@example
    var shipControls = new cg.input.ControlMap('ship', {
      shoot: 'space',
      thrust: ['up', 'w'],
      brake: ['down', 's'],
      turnLeft: ['left', 'a'],
      turnRight: ['right', 'd']
    });

    assert(cg.input.controls.ship == shipControls); // true

@example
    // load control mappings from user data: (see `UserDataManager`)
    var myControls = new cg.input.ControlMap(cg.data.getSync('controls'));
 */

ControlMap = (function(_super) {
  __extends(ControlMap, _super);

  ControlMap.mixin(HasSignals);

  function ControlMap(namespace, map) {
    var k, keys, name, _i, _len;
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = cg.rand.uuid();
    }
    this.paused = false;

    /**
    A unique identifier for this ControlMap.
    
    This is used by [`cg.input`](cg.input.html) to 
    
    @property namespace
    @type String
    @default A random UUID.
     */
    Object.defineProperty(this, 'namespace', {
      value: namespace
    });
    cg.input.map(this.namespace, this);
    this.actions = {};
    this.axes = {};
    this._triggersByKeycode = {};
    this.listeners = [this];
    if (map != null) {
      for (name in map) {
        if (!__hasProp.call(map, name)) continue;
        keys = map[name];
        if (!cg.util.isArray(keys)) {
          keys = [keys];
        }
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
          k = keys[_i];
          if ((typeof k === 'string') && __indexOf.call(k, '/') >= 0) {
            this.mapAxisKeys.apply(this, [name].concat(__slice.call(k.split('/'))));
          } else {
            this.mapKey(name, k);
          }
        }
      }
    }
  }


  /**
  `true` if action events are being suppressed, `false` otherwise.
  
  @property paused {Boolean}
   */

  Object.defineProperty(ControlMap.prototype, 'paused', {
    get: function() {
      return this.__paused;
    },
    set: function(value) {
      if (this.__paused !== value) {
        this.__paused = value;
        if (this.__paused) {
          return this._releaseAll();
        }
      }
    }
  });


  /**
  Suppress action events from being emitted from this `ControlMap`.
  
  See also:
  
    * [`paused`](#property_paused)
  
  @method pause
   */

  ControlMap.prototype.pause = function() {
    this.paused = true;
  };


  /**
  Allow action events to be emitted from this `ControlMap`.
  
  See also:
  
    * [`paused`](#property_paused)
  
  @method pause
   */

  ControlMap.prototype.resume = function() {
    this.paused = false;
  };


  /**
  Register an object that `HasSignals` to capture events emitted from this `ControlMap`.
  
  All of the following event types will be forwarded:
  
    * [`<action>:hit`](#event_<action>:hit)
    * [`<action>`](#event_<action>)
    * [`<action>:release`](#event_<action>:release)
    * [`!<action>`](#event_!<action>)
  
  **NOTE**: This method is called automatically when modifying the [`Actor::controls`](cg.Actor.html#property_controls) property.
  
  @method addListener
  @param listener {HasSignals}
  The object you wish to forward all action events from this `ControlMap` to.
  
  Typically an `Actor`, but anything that uses `HasSignals` will work.
  
  @example
      var controls = new cg.input.ControlMap({shoot: 'space'});
  
      controls.addListener(spaceShip);
  
      // Now, all `shoot` events will be forwarded to `spaceShip` whenever
      //  the space bar is hit, allowing it to handle them directly without
      //  referring to this `ControlMap`:
      spaceShip.on('shoot', function () {
        this.shootBullet();
      });
   */

  ControlMap.prototype.addListener = function(listener) {
    var idx;
    idx = this.listeners.indexOf(listener);
    if (idx >= 0) {
      cg.warn("ControlMap: Listener (" + listener + ") was already in our list of listeners; not adding it.");
      return;
    }
    return this.listeners.push(listener);
  };


  /**
  Un-register an object that `HasSignals` from capturing events emitted from this `ControlMap`.
  
  **NOTE**: This method is called automatically when modifying the [`Actor::controls`](cg.Actor.html#property_controls) property.
  
  @method removeListener
  @param listener {HasSignals}
  The object you wish to *stop* forwarding all action events from this `ControlMap` to.
  
  Typically an `Actor`, but anything that uses `HasSignals` will work.
   */

  ControlMap.prototype.removeListener = function(listener) {
    var idx;
    idx = this.listeners.indexOf(listener);
    if (idx < 0) {
      cg.warn("ControlMap: Listener (" + listener + ") was not in our list of listeners.");
      return;
    }
    return this.listeners.splice(idx, 1);
  };


  /**
  Associate a named action with a generic `Trigger`.
  
  Multiple calls to `map` with the same `name` parameter will
  not overwrite previously-mapped triggers; multiple triggers can
  be associated with a single action.
  
  @method map
  @param name {String} The name of the action event.
  @param trigger {Trigger} The trigger whose `hit` and `release` events correspond with the named action.
   */

  ControlMap.prototype.map = function(name, trigger) {
    var _base;
    if ((_base = this.actions)[name] == null) {
      _base[name] = new MultiTrigger;
    }
    return this.actions[name].addTrigger(trigger);
  };


  /**
  Stop associating a named action with a specific `Trigger`, or all of its associated triggers.
  
  @method unmap
  @param name {String} The name of the action event.
  @param [trigger] {Trigger}
  
  @example
      // Completely disable the "shoot" action:
      controlMap.unmap('shoot');
  
  @example
      // Remove a specific trigger from the "shoot" action's list of triggers:
      controlMap.unmap('shoot', someTrigger);
   */

  ControlMap.prototype.unmap = function(name, trigger) {
    var action;
    action = this.actions[name];
    if (action == null) {
      cg.warn('ControlMap.unmap: No action named "' + name('"; aborting.'));
      return;
    }
    if (trigger != null) {
      return action.removeTrigger(trigger);
    } else {
      return delete this.actions[name];
    }
  };


  /**
  Associate a named action with a (keyboard key)[TODOC] or set of [keyboard keys](TODOC).
  
  Multiple calls to `mapKey` with the same `name` parameter will
  not overwrite previously-mapped keys; multiple keys can
  be associated with a single action.
  
  A single key may also be mapped to multiple actions.
  
  @method map
  @param name {String} The name of the action event.
  @param keyCodeNames {String|Array} The key name(s) to associate with the given action name.
  @return {cg.input.Trigger} the new trigger associated with the given key name(s)
  @example
      this.mapKey('shoot', 'space');
  
  @example
      this.mapKey('thruster', ['up', 'w']);
   */

  ControlMap.prototype.mapKey = function(name, keyCodeNames) {
    var keyCode, keyCodeName, keyCodeSet, trigger, _base, _i, _j, _len, _len1;
    if (!cg.util.isArray(keyCodeNames)) {
      keyCodeNames = [keyCodeNames];
    }
    trigger = new Trigger;
    trigger.name = name;
    this.map(name, trigger);
    for (_i = 0, _len = keyCodeNames.length; _i < _len; _i++) {
      keyCodeName = keyCodeNames[_i];
      keyCodeSet = cg.__keys[keyCodeName];
      if (!keyCodeSet) {
        cg.warn("ControlMap::mapKey: Unknown key name: '" + keyCodeName + "'; ignoring.");
        continue;
      }
      if (!cg.util.isArray(keyCodeSet)) {
        keyCodeSet = [keyCodeSet];
      }
      for (_j = 0, _len1 = keyCodeSet.length; _j < _len1; _j++) {
        keyCode = keyCodeSet[_j];
        if ((_base = this._triggersByKeycode)[keyCode] == null) {
          _base[keyCode] = [];
        }
        this._triggersByKeycode[keyCode].push(trigger);
      }
    }
    return trigger;
  };


  /**
  Stop associating a (keyboard key)[TODOC] or set of [keyboard keys](TODOC) with a named action.
  
  @method unmapKey
  @param name
  @param keyCodeNames {String|Array} The key name(s) to associate with the given action name.
  @example
      this.unmapKey('shoot', 'space');
  
  @example
      this.unmapKey('thruster', ['up', 'w']);
   */

  ControlMap.prototype.unmapKey = function(name, keyCodeNames) {
    var idx, keyCode, keyCodeName, keyCodeSet, trigger, triggers, _i, _j, _k, _len, _len1;
    if (!cg.util.isArray(keyCodeNames)) {
      keyCodeNames = [keyCodeNames];
    }
    for (_i = 0, _len = keyCodeNames.length; _i < _len; _i++) {
      keyCodeName = keyCodeNames[_i];
      keyCodeSet = cg.__keys[keyCodeName];
      if (!keyCodeSet) {
        cg.warn("ControlMap::unmapKey: Unknown key name: '" + keyCodeName + "'; ignoring.");
        continue;
      }
      if (!cg.util.isArray(keyCodeSet)) {
        keyCodeSet = [keyCodeSet];
      }
      for (_j = 0, _len1 = keyCodeSet.length; _j < _len1; _j++) {
        keyCode = keyCodeSet[_j];
        triggers = this._triggersByKeycode[keyCode];
        if (triggers == null) {
          continue;
        }
        for (idx = _k = triggers.length - 1; _k >= 0; idx = _k += -1) {
          trigger = triggers[idx];
          if (trigger.name === name) {
            triggers.splice(idx, 1);
          }
        }
      }
    }
  };


  /**
  TODOC
  
  @method mapAxisKeys
  @param name {String} the name of the axis to create (or to associate more keys with if it already exists)
  @param low {String} the key associated with the negative direction of the axis
  @param high {String} the key associated with the positive direction of the axis
  @return {cg.input.Axis} the axis associated with the given name
   */

  ControlMap.prototype.mapAxisKeys = function(name, low, high) {
    var axis, highTrigger, lowTrigger;
    if (this.axes[name]) {
      axis = this.axes[name];
    } else {
      axis = this.axes[name] = new Axis;
      axis.name = name;
      this.on(axis, 'change', function(val, delta) {
        var l, _i, _len, _ref, _results;
        _ref = this.listeners;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          l = _ref[_i];
          _results.push(l.emit(axis.name, val, delta));
        }
        return _results;
      });
    }
    lowTrigger = this.mapKey('axis:' + name + ':low', low);
    highTrigger = this.mapKey('axis:' + name + ':high', high);
    lowTrigger.on('hit', function() {
      return axis.value = -1;
    });
    lowTrigger.on('release', function() {
      return axis.value = highTrigger.held() ? 1 : 0;
    });
    highTrigger.on('hit', function() {
      return axis.value = 1;
    });
    highTrigger.on('release', function() {
      return axis.value = lowTrigger.held() ? -1 : 0;
    });
    return axis;
  };

  ControlMap.prototype.unmapAxisKeys = function(name, low, high) {
    var highTriggerName, lowTriggerName;
    lowTriggerName = 'axis:' + name + ':low';
    highTriggerName = 'axis:' + name + ':high';
    this.unmapKey(lowTriggerName, low);
    this.unmapKey(highTriggerName, high);
    if ((this._triggersByKeycode[lowTriggerName] != null) || (this._triggersByKeycode[highTriggerName] != null)) {
      return;
    }
    return delete this.axes[name];
  };

  ControlMap.prototype._releaseAll = function() {
    var keyName, name, trigger, triggers, _ref, _ref1, _results;
    _ref = this.actions;
    for (name in _ref) {
      trigger = _ref[name];
      trigger.release();
    }
    _ref1 = this.keys;
    _results = [];
    for (keyName in _ref1) {
      triggers = _ref1[keyName];
      _results.push((function() {
        var _i, _len, _results1;
        _results1 = [];
        for (_i = 0, _len = triggers.length; _i < _len; _i++) {
          trigger = triggers[_i];
          _results1.push(trigger.release());
        }
        return _results1;
      })());
    }
    return _results;
  };


  /**
  Emitted whenever a trigger or key associated with <action> emits a [`hit`](Trigger#event_hit) event.
  See also: [`<action>`](#event_<action>)
  
  @event <action>:hit
  
  @example
      var controls = new cg.input.ControlMap({shoot: 'space'});
      
      controls.on('shoot:hit', function () {
        cg.log('Shooting!');
      });
   */


  /**
  Shorthand event synonymous with [`<action>:hit`](#event_<action>:hit).
  
  @event <action>
  
  @example
      var controls = new cg.input.ControlMap({shoot: 'space'});
      
      controls.on('shoot', function () {
        cg.log('Shooting!');
      });
   */

  ControlMap.prototype._triggerKeyDown = function(keyCode) {
    var l, t, triggers, _i, _j, _len, _len1, _ref;
    if (this.paused) {
      return;
    }
    triggers = this._triggersByKeycode[keyCode];
    if (!triggers) {
      return false;
    }
    for (_i = 0, _len = triggers.length; _i < _len; _i++) {
      t = triggers[_i];
      if (t.trigger()) {
        _ref = this.listeners;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          l = _ref[_j];
          l.emit("" + t.name + ":hit");
          l.emit(t.name);
        }
      }
    }
    return true;
  };


  /**
  Emitted whenever a trigger or key associated with <action> emits a [`release`](Trigger#event_release) event.
  
  See also:
  
    * [`!<action>`](#event_!<action>)
  
  @event <action>:release
  
  @example
      var controls = new cg.input.ControlMap({shoot: 'space'});
      
      controls.on('shoot:release', function () {
        cg.log('No longer shooting!');
      });
   */


  /**
  Shorthand event synonymous with [`<action>:release`](#event_<action>:release).
  
  @event !<action>
  
  @example
      var controls = new cg.input.ControlMap({shoot: 'space'});
      
      controls.on('!shoot', function () {
        cg.log('No longer shooting!');
      });
   */

  ControlMap.prototype._triggerKeyUp = function(keyCode) {
    var l, t, triggers, _i, _j, _len, _len1, _ref;
    if (this.paused) {
      return;
    }
    triggers = this._triggersByKeycode[keyCode];
    if (!triggers) {
      return false;
    }
    for (_i = 0, _len = triggers.length; _i < _len; _i++) {
      t = triggers[_i];
      if (t.release()) {
        _ref = this.listeners;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          l = _ref[_j];
          l.emit("" + t.name + ":release");
          l.emit("!" + t.name);
        }
      }
    }
    return true;
  };

  return ControlMap;

})(Module);

module.exports = ControlMap;


},{"Module":6,"cg":13,"input/Axis":26,"input/InputManager":28,"input/MultiTrigger":29,"input/Touch":30,"input/Trigger":31,"util/HasSignals":93}],28:[function(require,module,exports){
var Axis, ControlMap, HasSignals, InputManager, Module, MultiTrigger, Touch, Trigger, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Module = require('Module');

HasSignals = require('util/HasSignals');

Axis = require('input/Axis');

ControlMap = require('input/ControlMap');

Touch = require('input/Touch');

MultiTrigger = require('input/MultiTrigger');

Trigger = require('input/Trigger');


/**
The dispatcher/tracker of input events.

@class cg.input.InputManager
@extends cg.Module
@uses cg.util.HasSignals
 */

InputManager = (function(_super) {
  __extends(InputManager, _super);

  InputManager.mixin(HasSignals);


  /*
  A reference to the [`Axis`](cg.input.Axis.html) class.
  @property Axis
   */

  InputManager.prototype.Axis = Axis;


  /*
  A reference to the [`ControlMap`](cg.input.ControlMap.html) class.
  @property ControlMap
   */

  InputManager.prototype.ControlMap = ControlMap;


  /*
  A reference to the [`Touch`](cg.input.Touch.html) class.
  @property Touch
   */

  InputManager.prototype.Touch = Touch;


  /*
  A reference to the [`InputManager`](cg.input.InputManager.html) class.
  @property InputManager
   */

  InputManager.prototype.InputManager = InputManager;


  /*
  A reference to the [`MultiTrigger`](cg.input.MultiTrigger.html) class.
  @property MultiTrigger
   */

  InputManager.prototype.MultiTrigger = MultiTrigger;


  /*
  A reference to the [`Trigger`](cg.input.Trigger.html) class.
  @property Trigger
   */

  InputManager.prototype.Trigger = Trigger;

  InputManager._generateKeyNameMap = function() {
    var code, codes, name, _ref, _results;
    cg.__keyNames = {};
    _ref = cg.__keys;
    _results = [];
    for (name in _ref) {
      if (!__hasProp.call(_ref, name)) continue;
      codes = _ref[name];
      if (!cg.util.isArray(codes)) {
        codes = [codes];
      }
      _results.push((function() {
        var _base, _i, _len, _results1;
        _results1 = [];
        for (_i = 0, _len = codes.length; _i < _len; _i++) {
          code = codes[_i];
          if ((_base = cg.__keyNames)[code] == null) {
            _base[code] = [];
          }
          _results1.push(cg.__keyNames[code].push(name));
        }
        return _results1;
      })());
    }
    return _results;
  };

  function InputManager() {
    var i, name, _ref;
    this.mouse = new Touch;
    this.touches = (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 0; _i <= 10; i = ++_i) {
        _results.push(new Touch(i));
      }
      return _results;
    })();
    this.touch = this.touches[0];
    this.lmb = new Touch;
    this.mmb = new Touch;
    this.rmb = new Touch;
    this.any = new Trigger;
    this.key = {};
    _ref = cg.__keys;
    for (name in _ref) {
      if (!__hasProp.call(_ref, name)) continue;
      this.key[name] = new Trigger;
    }
    this.controls = {};
  }


  /**
  Register a control map to a specified name; this is required for the `ControlMap` to become active, since
  the `InputManager` is what forwards raw input events to the map.
  
  @method map
  @protected
  @param namespace {String} A unique identifier for the control map to add.
  @param map {Object|cg.input.ControlMap} The control map object to add.
  @return {cg.input.ControlMap} The map that was added.
   */

  InputManager.prototype.map = function(namespace, map) {
    if (!(map instanceof ControlMap)) {
      map = new ControlMap(map);
    }
    if (this.controls[namespace] != null) {
      throw new Error("InputManager: A ControlMap with namespace \"" + map.namespace + "\" already exists; remove it with _removeControlMap before replacing it.");
    }
    this.controls[namespace] = map;
    return map;
  };


  /**
  Un-register a `ControlMap` by name or value.
  
  @method _removeControlMap
  @param map {String|cg.input.ControlMap}
  
  @example
      // Remove an existing ControlMap by its object value:
      cg.input._removeControlMap(shipControls); // shipControls is an existing ControlMap object.
  
  @example
      // Remove a ControlMap by its namespace:
      cg.input._removeControlMap('ship'); // `cg.input.controls.ship` is now `undefined`
   */

  InputManager.prototype._removeControlMap = function(map) {
    var namespace, toDelete, _i, _len, _map, _ref;
    if (typeof map === 'string') {
      toDelete = [map];
    } else {
      toDelete = [];
      _ref = this.controls;
      for (namespace in _ref) {
        if (!__hasProp.call(_ref, namespace)) continue;
        _map = _ref[namespace];
        if (_map === map) {
          toDelete.add(namespace);
        }
      }
    }
    for (_i = 0, _len = toDelete.length; _i < _len; _i++) {
      namespace = toDelete[_i];
      delete this.controls[namespace];
    }
  };


  /**
  Emitted whenever a key's state goes from not-pressed, to pressed.
  
  @event keyDown
  @param keyName {String}
  @example
      cg.input.on('keyDown', function (keyName) {
        if (keyName == 'space') {
          cg.log('Space bar was hit!');
        }
      });
   */


  /**
  Emitted whenever a key's state goes from not-pressed, to pressed.
  
  @event keyDown:<keyName>
  @example
      cg.input.on('keyDown:space', function () {
        cg.log('Space bar was hit!');
      });
   */


  /**
  Emitted whenever a key is pressed, a mouse button is clicked, or a touch event begins.
  
  @event any
  @example
      cg.input.on('any', function () {
        splashScreen.hide();
      });
   */

  InputManager.prototype._triggerKeyDown = function(keyCode) {
    var keyNames, map, name, ns, _i, _len, _ref, _results;
    keyNames = cg.__keyNames[keyCode];
    if (keyNames != null) {
      for (_i = 0, _len = keyNames.length; _i < _len; _i++) {
        name = keyNames[_i];
        if (this.key[name].trigger()) {
          this.emit('keyDown', name);
          this.emit('keyDown:' + name);
        }
      }
    }
    this.any.trigger();
    this.emit('any');
    this.emit('anyDown');
    _ref = this.controls;
    _results = [];
    for (ns in _ref) {
      if (!__hasProp.call(_ref, ns)) continue;
      map = _ref[ns];
      _results.push(map._triggerKeyDown(keyCode));
    }
    return _results;
  };


  /**
  Emitted whenever a key's state goes from pressed, to not-pressed.
  
  @event keyUp
  @param keyName {String}
  @example
      cg.input.on('keyUp', function (keyName) {
        if (keyName == 'space') {
          cg.log('Space bar was released!');
        }
      });
   */


  /**
  Emitted whenever a key's state goes from pressed, to not-pressed.
  
  @event keyUp:<keyName>
  @example
      cg.input.on('keyUp:space', function () {
        cg.log('Space bar was released!');
      });
   */

  InputManager.prototype._triggerKeyUp = function(keyCode) {
    var keyNames, map, name, ns, _i, _len, _ref, _results;
    keyNames = cg.__keyNames[keyCode];
    if (keyNames != null) {
      for (_i = 0, _len = keyNames.length; _i < _len; _i++) {
        name = keyNames[_i];
        if (this.key[name].release()) {
          this.emit('keyUp', name);
          this.emit('keyUp:' + name);
        }
      }
    }
    this.any.release();
    this.emit('anyUp');
    this.emit('!any');
    _ref = this.controls;
    _results = [];
    for (ns in _ref) {
      if (!__hasProp.call(_ref, ns)) continue;
      map = _ref[ns];
      _results.push(map._triggerKeyUp(keyCode));
    }
    return _results;
  };

  InputManager.prototype._triggerKeyPress = function(charCode) {
    return this.emit('keyPress', charCode);
  };


  /**
  Emitted whenever a new indicator appears on the touch surface, or mouse button gets pressed.
  
  @event touchDown
  @param gesturer {Touch} The touch or mouse gesturer.
  @example
      cg.input.on('touchDown', function (gesturer) {
        cg.log('touchDown at (' + gesturer.x + ', ' + gesturer.y + ')!');
      });
   */

  InputManager.prototype._triggerTouchDown = function(screenX, screenY, num) {
    var t, x, y, _ref;
    _ref = this._transformDeviceCoordinates(screenX, screenY), x = _ref[0], y = _ref[1];
    t = this.touches[num];
    t.moveTo(x, y);
    t.trigger();
    if (num === 0) {
      this.touch.moveTo(x, y);
      this.touch.trigger();
    }
    this.any.trigger();
    this.emit('any');
    this.emit('anyDown');
    return this.emit('touchDown', t);
  };


  /**
  Emitted whenever an indicator is dragged on the touch surface, or the mouse moves with any buttons held.
  
  @event touchDrag
  @param gesturer {Touch} The touch or mouse gesturer.
  @example
      cg.input.on('touchDrag', function (gesturer) {
        cg.log('touchDrag motion: (' + gesturer.dx + ', ' + gesturer.dy + ')!');
      });
   */

  InputManager.prototype._triggerTouchDrag = function(screenX, screenY, num) {
    var t, x, y, _ref;
    _ref = this._transformDeviceCoordinates(screenX, screenY), x = _ref[0], y = _ref[1];
    t = this.touches[num];
    t.moveTo(x, y);
    if (num === 0) {
      this.touch.moveTo(x, y);
    }
    return this.emit('touchDrag', t);
  };


  /**
  Emitted whenever an indicator is removed from the touch surface, or mouse button gets released.
  
  @event touchUp
  @param gesturer {Touch} The touch or mouse gesturer.
  @example
      cg.input.on('touchUp', function (gesturer) {
        cg.log('touchUp at (' + gesturer.x + ', ' + gesturer.y + ')!');
      });
   */

  InputManager.prototype._triggerTouchUp = function(screenX, screenY, num) {
    var t;
    t = this.touches[num];
    t.x = t.y = void 0;
    t.release();
    if (num === 0) {
      this.touch.x = this.touch.y = void 0;
      this.touch.release();
    }
    this.emit('touchUp', t);
    this.any.release();
    this.emit('anyUp');
    return this.emit('!any');
  };


  /**
  Emitted whenever a mouse button is pressed.
  
  **NOTE**: A [`touchDown`](#event_touchDown) event will *also* be emitted with the generic gesturer `cg.input.touch` when the
  left mouse button (but not for right or middle) is pressed.
  
  @event mouseDown
  @param which {Number} an integer representing which mouse button was pressed.
  One of the following:
  
    * 1: Left Mouse Button
    * 2: Middle Mouse Button
    * 3: Right Mouse Button
   */

  InputManager.prototype._triggerMouseDown = function(which) {
    switch (which) {
      case 1:
        this.mouse.trigger();
        this.lmb.trigger();
        this.touch.trigger();
        this.emit('touchDown', this.touch);
        break;
      case 2:
        this.mmb.trigger();
        break;
      case 3:
        this.rmb.trigger();
        break;
      default:
        cg.warn("InputManager: Unexpected mouse button number: " + which + "; ignoring.");
        return;
    }
    this.any.trigger();
    this.emit('any');
    this.emit('anyDown');
    return this.emit('mouseDown', which);
  };


  /**
  Emitted whenever a mouse moves.
  
  **NOTE**: A [`touchDrag`](#event_touchDown) event will *also* be emitted with the generic gesturer `cg.input.touch` when the
  left mouse button (but not for right or middle) is held.
  
  @event mouseDown
  @param {Touch} a reference to a gesturer representing the mouse that moved
   */

  InputManager.prototype._triggerMouseMove = function(screenX, screenY) {
    var mapping, x, y, _i, _len, _ref, _ref1;
    _ref = this._transformDeviceCoordinates(screenX, screenY), x = _ref[0], y = _ref[1];
    _ref1 = [this.touch, this.lmb, this.mmb, this.rmb];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      mapping = _ref1[_i];
      mapping.moveTo(x, y);
    }
    if (this.touch.held()) {
      this.emit('touchDrag', this.touch);
    }
    this.mouse.moveTo(x, y);
    this.emit('mouseMove', this.mouse);
  };


  /**
  Emitted whenever a mouse button is released.
  
  **NOTE**: A [`touchUp`](#event_touchUp) event will *also* be emitted with the generic gesturer `cg.input.touch` when the
  left mouse button (but not for right or middle) is released.
  
  @event mouseDown
  @param which {Number} an integer representing which mouse button was released.
  One of the following:
  
    * 1: Left Mouse Button
    * 2: Middle Mouse Button
    * 3: Right Mouse Button
   */

  InputManager.prototype._triggerMouseUp = function(which) {
    this.any.release();
    switch (which) {
      case 1:
        this.mouse.release();
        this.lmb.release();
        this.touch.release();
        this.emit('touchUp', this.touch);
        break;
      case 2:
        this.mmb.release();
        break;
      case 3:
        this.rmb.release();
    }
    this.emit('mouseUp', which);
    this.any.release();
    this.emit('anyUp');
    return this.emit('!any');
  };

  return InputManager;

})(Module);

module.exports = InputManager;


},{"Module":6,"cg":13,"input/Axis":26,"input/ControlMap":27,"input/MultiTrigger":29,"input/Touch":30,"input/Trigger":31,"util/HasSignals":93}],29:[function(require,module,exports){
var MultiTrigger, Trigger,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Trigger = require('input/Trigger');


/**
A special trigger that can be triggered by any number of other triggers.

(Yo dawg...)

@class cg.input.MultiTrigger
@extends cg.input.Trigger
 */

MultiTrigger = (function(_super) {
  __extends(MultiTrigger, _super);

  function MultiTrigger() {
    this.triggers = [];
    MultiTrigger.__super__.constructor.apply(this, arguments);
  }


  /**
  Add a trigger to the list of triggers that cause this to trigger.
  
  @method addTrigger
  @param trigger {Trigger}
   */

  MultiTrigger.prototype.addTrigger = function(trigger) {
    var _release, _trigger;
    _trigger = trigger.trigger;
    trigger.trigger = (function(_this) {
      return function() {
        _trigger.call(trigger);
        return _this.trigger();
      };
    })(this);
    _release = trigger.release;
    trigger.release = (function(_this) {
      return function() {
        _release.call(trigger);
        return _this.release();
      };
    })(this);
    return this.triggers.push(trigger);
  };


  /**
  Remove a trigger from the list of triggers that cause this to trigger.
  
  @method removeTrigger
  @param trigger {Trigger}
   */

  MultiTrigger.prototype.removeTrigger = function(trigger) {
    var idx;
    idx = this.triggers.indexOf(trigger);
    if (idx < 0) {
      cg.warn('MultiTrigger::removeTrigger: trigger to remove was not found in my list of triggers; aborting.');
      return;
    }
    return this.triggers.splice(idx, 1);
  };

  return MultiTrigger;

})(Trigger);

module.exports = MultiTrigger;


},{"input/Trigger":31}],30:[function(require,module,exports){

/*
combo.js - Copyright 2012-2013 Louis Acresti - All Rights Reserved
 */
var Touch, Trigger,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Trigger = require('input/Trigger');


/**
A trigger with some extra properties; useful for representing things like fingers on touch screens, and mouse cursors.

@class cg.input.Touch
@extends cg.input.Trigger
@constructor
@param [number=-1] {Number}
A unique index (often representing a finger #) for this gesturer.
 */

Touch = (function(_super) {
  __extends(Touch, _super);

  function Touch(number) {
    this.number = number != null ? number : -1;
    Touch.__super__.constructor.apply(this, arguments);

    /**
    The x-coordinate in virtual screen space of this gesturer's current location.
    
    **NOTE**: This value will be `undefined` if the touch indicator associated with this is not actively touching 
    the touch surface. (This does not apply to gesturers that refer to mouse buttons.)
    @property x
    @type Number
     */
    this.x = NaN;

    /**
    The y-coordinate in virtual screen space of this gesturer's current location.
    
    **NOTE**: This value will be `undefined` if the touch indicator associated with this is not actively touching 
    the touch surface. (This does not apply to gesturers that refer to mouse buttons.)
    @property y
    @type Number
     */
    this.y = NaN;
  }

  Touch.prototype.moveTo = function(x, y) {
    var oldX, oldY;
    oldX = this.x;
    oldY = this.y;
    this.x = x;
    this.y = y;

    /**
    The x-component of the distance this gesturer traveled in the last motion event caused by [`moveTo`](#method_moveTo).
    @property dx
    @type Number
     */
    this.dx = this.x - oldX;

    /**
    The y-component of the distance this gesturer traveled in the last motion event caused by [`moveTo`](#method_moveTo).
    @property dy
    @type Number
     */
    this.dy = this.y - oldY;

    /**
    Emitted whenever this gesturer moves.
    
    @event move
    @param gesturer
    A reference to this gesturer.
     */
    this.emit('move', this);
    if (this.held()) {

      /**
      Emitted whenever this gesturer moves while it is [`held()`](cg.input.Trigger.html#method_held).
      
      @event drag
      @param gesturer
      A reference to this gesturer.
       */
      return this.emit('drag', this);
    }
  };

  return Touch;

})(Trigger);

module.exports = Touch;


},{"input/Trigger":31}],31:[function(require,module,exports){
var HasSignals, Module, Trigger, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Module = require('Module');

HasSignals = require('util/HasSignals');


/**
A generic representation of something that can be "on" or "off", "pressed" or "released", etc.

@class cg.input.Trigger
@extends cg.Module
@uses cg.util.HasSignals
 */

Trigger = (function(_super) {
  __extends(Trigger, _super);

  Trigger.mixin(HasSignals);

  function Trigger() {
    this.lastPressedTime = -2;
    this.lastReleasedTime = -1;
  }


  /**
  Cause this trigger to be ... triggered.
  
  In other words, change its status to "on" or "pressed".
  
  @method trigger
  @return {Boolean} `true` if the trigger's status changed.
   */

  Trigger.prototype.trigger = function() {
    if (this.held()) {
      return false;
    }
    this.lastPressedTime = cg.currentTime;

    /**
    Emitted immediately when this trigger is [`triggered`](#method_trigger).
    
    @event hit
    @param trigger {Trigger} a reference to this `Trigger`
     */
    this.emit('hit', this);
    return true;
  };


  /**
  Cause this trigger to be released.
  
  In other words, change its status to "off" or "released".
  
  @method release
  @return {Boolean} `true` if the trigger's status changed.
   */

  Trigger.prototype.release = function() {
    if (!this.held()) {
      return false;
    }
    this.lastReleasedTime = cg.currentTime;
    this.emit('release', this);
    return true;
  };


  /**
  Poll whether this trigger was _just_ triggered.
  
  @method hit
  @return {Boolean} `true` if triggered this update-cycle.
   */

  Trigger.prototype.hit = function() {
    return (this.lastPressedTime >= 0) && (cg.currentTime - this.lastPressedTime === 0);
  };


  /**
  Poll whether this trigger is currently held-down.
  
  @method held
  @return {Boolean} `true` if held-down this update-cycle
   */

  Trigger.prototype.held = function() {
    return this.lastPressedTime > this.lastReleasedTime;
  };


  /**
  Poll whether this trigger if this trigger was _just_ released.
  
  @method released
  @return {Boolean} `true` if released this update-cycle
   */

  Trigger.prototype.released = function() {
    return this.lastReleasedTime >= 0 && (cg.currentTime - this.lastReleasedTime === 0);
  };


  /**
  Poll how long this trigger has been held down for.
  
  @method heldTime
  @return {Number(milliseconds)} the amount of time this trigger has been held down for
   */

  Trigger.prototype.heldTime = function() {
    if (!this.held()) {
      return 0;
    }
    return cg.currentTime - this.lastPressedTime;
  };

  return Trigger;

})(Module);

module.exports = Trigger;


},{"Module":6,"cg":13,"util/HasSignals":93}],32:[function(require,module,exports){
var Module, Random, hash, rnd,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

Module = require('Module');

hash = function(data) {
  var h, i, n;
  h = void 0;
  i = void 0;
  n = void 0;
  n = 0xefc8249d;
  data = data.toString();
  i = 0;
  while (i < data.length) {
    n += data.charCodeAt(i);
    h = 0.02519603282416938 * n;
    n = h >>> 0;
    h -= n;
    h *= n;
    n = h >>> 0;
    h -= n;
    n += h * 0x100000000;
    i++;
  }
  return (n >>> 0) * 2.3283064365386963e-10;
};

rnd = function() {
  var t;
  t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10;
  this.c = t | 0;
  this.s0 = this.s1;
  this.s1 = this.s2;
  this.s2 = t - this.c;
  return this.s2;
};


/**
A [pseudo-random number generator](http://en.wikipedia.org/wiki/Pseudorandom_number_generator) with convenient utility methods.

All `Random` instances are actually bound `Function` objects with instance methods attached to it (not unlike the `jQuery` object).

A global instance is always available as `cg.rand`.

**NOTE**: You must use [`cg.math.Random.create`](#method_create); `new Random` will not work.

@class cg.math.Random
 */

Random = (function(_super) {
  __extends(Random, _super);


  /**
  Create a new random number generator.
  
  @static
  @method create
  @param [...] arguments will be passed to an invocation of [`sow(...)`](#method_sow).
   */

  Random.create = function() {
    var k, rand, ret, v;
    rand = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Random, arguments, function(){});
    ret = rand["default"].bind(rand);
    for (k in rand) {
      v = rand[k];
      ret[k] = v;
    }
    return ret;
  };


  /**
  If no arguments are passed, a random number in the range (0, 1) will be returned.
  
  @method default
  @param [arg0] {Number | Array}
  - If a single number is passed, a random number in the range (0, `number`) will be returned.
  - If an array is passed, [`pick`](#method_pick) will choose a single element and return it.
  
  @param [arg1] {Number}
  If supplied, a random number in the range (`arg0`, `arg1`) will be returned.
  
  @example
      var amount = cg.rand(); // Will be between 0 and 1.
  
  @example
      var amount = cg.rand(100); // Will be between 0 and 100.
  
  @example
      var amount = cg.rand(-100,100); // Will be between -100 and 100
  
  @example
      // One color name will be chosen and returned:
      var choice = cg.rand(['red', 'green', 'blue', 'purple', 'orange']);
   */

  Random.prototype["default"] = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    switch (args.length) {
      case 0:
        return this.fract32();
      case 1:
        if (cg.util.isArray(args[0])) {
          return this.pick(args[0]);
        }
        if (typeof args[0] === 'number') {
          return this.range(0, args[0]);
        }
        break;
      default:
        return this.range(args[0], args[1]);
    }
  };

  function Random() {
    this.sow.apply(this, arguments);
  }


  /**
  "Seed" the random sequence with any arbitrary data.
  
  @method sow
  @param [...] any number of arbitrary arguments will be used as seed data after being converted
  to strings with `toString`.
   */

  Random.prototype.sow = function() {
    var i, seed, seeds;
    i = void 0;
    seeds = void 0;
    seed = void 0;
    this.s0 = hash(' ');
    this.s1 = hash(this.s0);
    this.s2 = hash(this.s1);
    this.c = 1;
    seeds = Array.prototype.slice.call(arguments);
    i = 0;
    while (seed = seeds[i++]) {
      this.s0 -= hash(seed);
      this.s0 += ~~(this.s0 < 0);
      this.s1 -= hash(seed);
      this.s1 += ~~(this.s1 < 0);
      this.s2 -= hash(seed);
      this.s2 += ~~(this.s2 < 0);
    }
  };


  /**
  @method uint32
  @return a random integer between 0 and 2^32.
   */

  Random.prototype.uint32 = function() {
    return rnd.apply(this) * 0x100000000;
  };


  /**
  @method fract32
  @return a random real number between 0 and 1.
   */

  Random.prototype.fract32 = function() {
    return rnd.apply(this) + (rnd.apply(this) * 0x200000 | 0) * 1.1102230246251565e-16;
  };


  /**
  @method real
  @return a random real number between 0 and 2^32.
   */

  Random.prototype.real = function() {
    return this.uint32() + this.fract32();
  };


  /**
  @method int
  @return a random integer between min and max.
   */

  Random.prototype.i = function(min, max) {
    return Math.floor(this.range(min, max));
  };


  /**
  @method range
  @param min {Number}
  @param max {Number}
  @return random real number between min and max.
   */

  Random.prototype.range = function(min, max) {
    min = min || 0;
    max = max || 0;
    return this.fract32() * (max - min) + min;
  };


  /**
  @method normal
  @return a random real number between -1 and 1.
   */

  Random.prototype.normal = function() {
    return 1 - 2 * this.fract32();
  };

  Random.prototype.uuid = function() {
    var a, b;
    a = void 0;
    b = void 0;
    b = a = '';
    while (a++ < 36) {
      b += (~a % 5 | a * 3 & 4 ? (a ^ 15 ? 8 ^ this.fract32() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-');
    }
    return b;
  };

  Random.prototype.uuidObj = function() {
    var i, ret, segment, u, _i, _len, _ref;
    u = this.uuid();
    ret = new Uint32Array(4);
    _ref = u.split('-');
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      segment = _ref[i];
      ret[i] = parseInt('0x' + segment);
    }
    return ret;
  };


  /**
  @method pick
  @param array {Array} an array of things to choose from
  @return a random member of `array`.
   */

  Random.prototype.pick = function(array) {
    return array[this.i(0, array.length)];
  };


  /**
  @method weightedPick
  @param array {Array} an array of things to choose from
  @return a random member of `array`, favoring the earlier entries.
   */

  Random.prototype.weightedPick = function(array) {
    return array[~~(Math.pow(this.fract32(), 2) * array.length)];
  };

  return Random;

})(Module);

module.exports = {
  create: Random.create
};


},{"Module":6}],33:[function(require,module,exports){

/**
A two-dimensional vector representation with utility methods.

@class cg.math.Vector2
@param [x=0] the horizontal component of the vector.
@param [y=0] the vertical component of the vector.
 */
var Vector2;

Vector2 = (function() {

  /**
  The horizontal component of this vector.
  
  @property x
  @type Number
   */

  /**
  The vertical component of this vector.
  
  @property y
  @type Number
   */
  function Vector2(x, y) {
    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
  }


  /**
  @method clone
  @return {cg.math.Vector2} a copy of this vector.
   */

  Vector2.prototype.clone = function() {
    return new Vector2(this.x, this.y);
  };


  /**
  Set the values of this vector to those of another.
  
  @method set
  @param other {cg.math.Vector2}
  @chainable
   */

  Vector2.prototype.set = function(other) {
    this.x = other.x, this.y = other.y;
    return this;
  };


  /**
  Find the dot product of this vector with another.
  
  @method dot
  @param other {cg.math.Vector2} the other vector to perform the dot product with.
  @return {Number} the dot product of this vector with `other`.
   */

  Vector2.prototype.dot = function(other) {
    return this.x * other.x + this.y * other.y;
  };


  /**
  Get the square of the length of this vector (faster than [`len`](#method_len)
  since no `sqrt` is necessary).
  
  @method len2
  @return the square of the length of this vector.
   */

  Vector2.prototype.len2 = function() {
    return this.x * this.x + this.y * this.y;
  };


  /**
  Get the length of this vector.
  
  @method len
  @return the length of this vector.
   */

  Vector2.prototype.len = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };


  /**
  Set the magnitude of this vector.
  
  @method mag
  @param amount {Number} the magnitude you wish this vector to aquire
  @chainable
   */

  Vector2.prototype.mag = function(amount) {
    this.$norm().$mul(amount);
    return this;
  };


  /**
  Determine the angle this vector is facing, in radians.
  
  0 radians starts at (1, 0) and goes clockwise according
  to Combo's coordinate system.
  
  @method angle
  @return {Number} the angle of the vector in radians
   */

  Vector2.prototype.angle = function() {
    return Math.atan2(this.y, this.x);
  };


  /**
  Set the length of this vector to zero.
  
  Effectively the same as `this.x = this.y = 0`.
  
  @method zero
  @chainable
   */

  Vector2.prototype.zero = function() {
    this.x = this.y = 0;
    return this;
  };


  /**
  Compute the addition of this vector with another.
  
  @method add
  @param other {cg.math.Vector2} the other vector to add to this one.
  @return {cg.math.Vector2} a new vector representing the vector-sum of this and `other`.
   */

  Vector2.prototype.add = function(other) {
    return new Vector2(this.x + other.x, this.y + other.y);
  };


  /**
  Compute the subtraction of this vector with another.
  
  @method sub
  @param other {cg.math.Vector2} the other vector to subtract from this one.
  @return {cg.math.Vector2} a new vector representing the vector-difference of this and `other`.
   */

  Vector2.prototype.sub = function(other) {
    return new Vector2(this.x - other.x, this.y - other.y);
  };


  /**
  Compute the multiplication of this vector with a scalar.
  
  Effectively the same as `new Vector2(this.x * scalar, this.y * scalar)`.
  
  @method mul
  @param scalar {Number} the number to multiply this vector's components by.
  @return {cg.math.Vector2} a new vector representing the result of the multiplication.
   */

  Vector2.prototype.mul = function(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar);
  };


  /**
  Compute the division of this vector with a scalar.
  
  Effectively the same as `new Vector2(this.x / scalar, this.y / scalar)`.
  
  @method div
  @param scalar {Number} the number to divide this vector's components by.
  @return {cg.math.Vector2} a new vector representing the result of the division.
   */

  Vector2.prototype.div = function(scalar) {
    return new Vector2(this.x / scalar, this.y / scalar);
  };


  /**
  Ensures this vector's length/magnitude isn't larger than a specified scalar.
  
  @method limit
  @param amount {Number} the maximum length/magnitude to allow this vector to have
   */

  Vector2.prototype.limit = function(amount) {
    if (this.len() > amount) {
      this.$norm().$mul(amount);
    }
    return this;
  };


  /**
  Compute a normalized version of this vector.
  
  @method norm
  @return {cg.math.Vector2} A new normalized version of this vector.
   */

  Vector2.prototype.norm = function() {
    var len;
    len = this.len();
    if (len === 0) {
      return new Vector2;
    }
    return new Vector2(this.x / len, this.y / len);
  };


  /**
  Point this vector in a random direction with a given length.
  
  @method randomize
  @param [len=1] {Number} the new length of this vector.
  @chainable
   */

  Vector2.prototype.randomize = function(len) {
    var ang;
    if (len == null) {
      len = 1;
    }
    ang = 2 * Math.random() * Math.PI;
    this.x = len * Math.cos(ang);
    this.y = len * Math.sin(ang);
    return this;
  };


  /**
  Add a vector to this vector, modifying this vector "in-place".
  
  @method $add
  @param other {cg.math.Vector2} the other vector to add to this one.
  @chainable
   */

  Vector2.prototype.$add = function(other) {
    this.x += other.x;
    this.y += other.y;
    return this;
  };


  /**
  Subtract a vector from this vector, modifying this vector "in-place".
  
  @method $sub
  @param other {cg.math.Vector2} the other vector to subtract from this one.
  @chainable
   */

  Vector2.prototype.$sub = function(other) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  };


  /**
  Multiply this vector by a scalar, modifying this vector "in-place".
  
  Effectively the same as `this.x *= scalar; this.y *= scalar`.
  
  @method $mul
  @param scalar {Number} the number to multiply this vector's components by.
  @chainable
   */

  Vector2.prototype.$mul = function(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  };


  /**
  Divide this vector by a scalar, modifying this vector "in-place".
  
  Effectively the same as `this.x /= scalar; this.y /= scalar`.
  
  @method $div
  @param scalar {Number} the number to divide this vector's components by.
  @chainable
   */

  Vector2.prototype.$div = function(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  };


  /**
  Normalize this vector "in-place".
  
  @method $norm
  @chainable
   */

  Vector2.prototype.$norm = function() {
    var len;
    len = this.len();
    if (len === 0) {
      return this;
    }
    this.x /= len;
    this.y /= len;
    return this;
  };

  return Vector2;

})();

module.exports = Vector2;


},{}],34:[function(require,module,exports){
var Random, Vector2;

Vector2 = require('math/Vector2');

Random = require('math/Random');

module.exports = {
  Vector2: Vector2,
  Random: Random,
  clamp: function(n, min, max) {
    return Math.min(max, Math.max(n, min));
  },
  mod: function(num, n) {
    return ((num % n) + n) % n;
  },
  wrap: function(num, min, max) {
    return (cg.math.mod(num - min, max - min)) + min;
  }
};


},{"math/Random":32,"math/Vector2":33}],35:[function(require,module,exports){
var Menu, MenuItem, Scene, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Scene = require('Scene');

MenuItem = require('menus/MenuItem');


/**
TODOC

@class cg.menus.Menu
@extends cg.Scene
 */

Menu = (function(_super) {
  __extends(Menu, _super);

  function Menu() {
    Menu.__super__.constructor.apply(this, arguments);
    if (this.controls == null) {
      this.controls = cg.input.controls.menus;
    }
    this.on('up', function() {
      return this.selectItem(this.selected.above);
    });
    this.on('down', function() {
      return this.selectItem(this.selected.below);
    });
    this.on('left', function() {
      return this.selectItem(this.selected.left);
    });
    this.on('right', function() {
      return this.selectItem(this.selected.right);
    });
    this.on('select', function() {
      return this.selected.select();
    });
  }

  Menu.prototype.selectItem = function(item) {
    var _ref;
    if (item == null) {
      return;
    }
    if ((_ref = this.selected) != null) {
      _ref.blur();
    }
    this.selected = item;
    return item.focus();
  };

  return Menu;

})(Scene);

module.exports = Menu;


},{"Scene":7,"cg":13,"menus/MenuItem":36}],36:[function(require,module,exports){
var Actor, MenuItem, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Actor = require('Actor');


/**
TODOC

@class cg.menus.MenuItem
@extends cg.Actor
 */

MenuItem = (function(_super) {
  __extends(MenuItem, _super);

  function MenuItem() {
    MenuItem.__super__.constructor.apply(this, arguments);
    if (this.focused == null) {
      this.focused = false;
    }
  }

  MenuItem.prototype.focus = function() {
    this.emit('focus');
    return this.focused = true;
  };

  MenuItem.prototype.blur = function() {
    this.emit('blur');
    return this.focused = false;
  };

  MenuItem.prototype.select = function() {
    return this.emit('select');
  };

  return MenuItem;

})(Actor);

module.exports = MenuItem;


},{"Actor":2,"cg":13}],37:[function(require,module,exports){
var BitmapText, MenuItem, TextMenuItem, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

MenuItem = require('menus/MenuItem');

BitmapText = require('text/BitmapText');


/**
TODOC

@class cg.menus.TextMenuItem
@extends MenuItem
 */

TextMenuItem = (function(_super) {
  __extends(TextMenuItem, _super);

  function TextMenuItem(font, string, params) {
    this.font = font;
    this.string = string != null ? string : '';
    TextMenuItem.__super__.constructor.call(this, params);
    if (this.blurAlpha == null) {
      this.blurAlpha = 0.5;
    }
    if (this.focusAlpha == null) {
      this.focusAlpha = 1;
    }
    this.alpha = this.blurAlpha;
    this.textString = this.addChild(new BitmapText(this.font, this.string, {
      alignment: this.alignment,
      spacing: this.spacing
    }));
  }

  TextMenuItem.prototype.focus = function() {
    TextMenuItem.__super__.focus.apply(this, arguments);
    return this.alpha = this.focusAlpha;
  };

  TextMenuItem.prototype.blur = function() {
    TextMenuItem.__super__.blur.apply(this, arguments);
    return this.alpha = this.blurAlpha;
  };

  TextMenuItem.prototype.updateText = function() {
    this.textString.string = this.string;
    return this.textString.updateText();
  };

  return TextMenuItem;

})(MenuItem);

module.exports = TextMenuItem;


},{"cg":13,"menus/MenuItem":36,"text/BitmapText":83}],38:[function(require,module,exports){
var Menu, TextMenuItem, VerticalMenu, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Menu = require('menus/Menu');

TextMenuItem = require('menus/TextMenuItem');


/**
TODOC

@class cg.menus.VerticalMenu
@extends Menu
 */

VerticalMenu = (function(_super) {
  __extends(VerticalMenu, _super);

  function VerticalMenu() {
    var i, item, itemHeight, itemNames, k, name, num, top, _i, _items, _len, _ref;
    VerticalMenu.__super__.constructor.apply(this, arguments);
    if (this.spacing == null) {
      this.spacing = 1;
    }
    if (this.items == null) {
      this.items = [];
    }
    _items = this.items;
    itemNames = [];
    this.items = {};
    if (this.alignment == null) {
      this.alignment = 'center';
    }
    if (this.lineHeight == null) {
      this.lineHeight = this.font.lineHeight;
    }
    itemHeight = (this.lineHeight * this.font.charHeight) + this.spacing;
    this.anchor = {};
    if (this.alignment === 'center') {
      this.anchor.x = this.anchor.y = 0.5;
    }
    this.height = itemHeight * _items.length - this.spacing;
    top = -this.height / 2 + itemHeight / 2;
    for (num = _i = 0, _len = _items.length; _i < _len; num = ++_i) {
      item = _items[num];
      name = '_UNDEFINED_';
      switch (typeof item) {
        case 'string':
          if (this.font == null) {
            throw new Error('No font specified.');
          }
          name = item;
          this.items[name] = this.addChild(new TextMenuItem(this.font, item, {
            alignment: this.alignment,
            spacing: this.spacing,
            y: top + num * itemHeight
          }), 'items');
          break;
        case 'object':
          name = item.name;
          item = item.item;
          item.y = top + num * itemHeight;
          this.items[name] = this.addChild(item, 'items');
          break;
        default:
          throw new Error('Unexpected menu item type: ' + typeof item);
      }
      itemNames.push(name);
    }
    i = 0;
    _ref = this.items;
    for (k in _ref) {
      if (!__hasProp.call(_ref, k)) continue;
      item = _ref[k];
      if (i === 0) {
        this.selectItem(item);
      }
      item.above = this.items[itemNames[cg.math.mod(i - 1, itemNames.length)]];
      item.below = this.items[itemNames[cg.math.mod(i + 1, itemNames.length)]];
      ++i;
    }
  }

  return VerticalMenu;

})(Menu);

module.exports = VerticalMenu;


},{"cg":13,"menus/Menu":35,"menus/TextMenuItem":37}],39:[function(require,module,exports){
var Menu, MenuItem, TextMenuItem, VerticalMenu;

Menu = require('menus/Menu');

MenuItem = require('menus/MenuItem');

TextMenuItem = require('menus/TextMenuItem');

VerticalMenu = require('menus/VerticalMenu');

module.exports = {
  Menu: Menu,
  MenuItem: MenuItem,
  TextMenuItem: TextMenuItem,
  VerticalMenu: VerticalMenu,
  defaultControlMap: {
    up: 'up',
    down: 'down',
    left: 'left',
    right: 'right',
    select: ['enter', 'space'],
    back: 'esc'
  },
  init: function(defaultControls) {
    if (defaultControls == null) {
      defaultControls = index.defaultControlMap;
    }
    return cg.input.map('menus', defaultControls);
  }
};


},{"menus/Menu":35,"menus/MenuItem":36,"menus/TextMenuItem":37,"menus/VerticalMenu":38}],40:[function(require,module,exports){
var Body, Module, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Module = require('Module');


/**
TODOC
@class cg.physics.Body
@extends cg.Module
@constructor
@param actor {Actor} The actor associated with this body.
@param [props] {Object} Optional starting values of this body's properties (only those listed below will be applied)
@param [props.shape=new_AABB] {Shape} The shape associated with this body.
@param [props.bounce=0.5] {Number} The starting value of [`bounce`](#property_bounce).
@param [props.bounds=0.5] {Number} The starting value of [`bounds`](#property_density).
@param [props.density=0.5] {Number} The starting value of [`density`](#property_density).
@param [props.gravityScale=1.0] {Number} The starting value of [`gravityScale`](#property_density).
 */

Body = (function(_super) {
  __extends(Body, _super);

  function Body(actor, _arg) {
    var ox, oy;
    this.actor = actor;
    this.shape = _arg.shape, this.density = _arg.density, this.bounce = _arg.bounce, this.gravityScale = _arg.gravityScale, this.bounds = _arg.bounds;
    this.v = new cg.math.Vector2;
    this.f = new cg.math.Vector2;
    this.offset = new cg.math.Vector2;
    ox = 0;
    oy = 0;
    Object.defineProperty(this.offset, 'x', {
      get: function() {
        return ox;
      },
      set: (function(_this) {
        return function(val) {
          var x;
          x = _this.actor.x;
          ox = val;
          return _this.actor.x = x;
        };
      })(this)
    });
    Object.defineProperty(this.offset, 'y', {
      get: function() {
        return oy;
      },
      set: (function(_this) {
        return function(val) {
          var y;
          y = _this.actor.y;
          oy = val;
          return _this.actor.y = y;
        };
      })(this)
    });
    if (this.shape == null) {
      this.shape = new cg.physics.shapes.AABB;
    }
    if (this.bounded == null) {
      this.bounded = true;
    }
    if (this.bounce == null) {
      this.bounce = 0.5;
    }
    if (this.density == null) {
      this.density = 0.5;
    }
    if (this.gravityScale == null) {
      this.gravityScale = 1;
    }
    if (this.sFriction == null) {
      this.sFriction = 0.6;
    }
    if (this.dFriction == null) {
      this.dFriction = 0.4;
    }
    this._updateMass();
  }

  Body.prototype._updateMass = function() {
    var m;
    this.shape._areaDirty = false;
    m = this.shape.area * this.density;
    if (m === 0) {
      return this.__inverseMass = 0;
    } else {
      return this.__inverseMass = 1 / m;
    }
  };


  /**
  The horizontal position of this body; synonymous with `this.shape.x`.
  @property x
  @type Number
   */

  Object.defineProperty(Body.prototype, 'x', {
    get: function() {
      return this.shape.x;
    },
    set: function(val) {
      return this.shape.x = val;
    }
  });


  /**
  The vertical position of this body; synonymous with `this.shape.y`.
  @property y
  @type Number
   */

  Object.defineProperty(Body.prototype, 'y', {
    get: function() {
      return this.shape.y;
    },
    set: function(val) {
      return this.shape.y = val;
    }
  });


  /**
  A virtual property representing the left-most point on this body's shape.
  
  Setting its value will move the shape horizontally so that its left-most point is equal to the value specified.
  @property left
  @type Number
   */

  Object.defineProperty(Body.prototype, 'left', {
    get: function() {
      return this.shape.left;
    },
    set: function(val) {
      return this.shape.left = val;
    }
  });


  /**
  A virtual property representing the right-most point on this body's shape.
  
  Setting its value will move the shape horizontally so that its right-most point is equal to the value specified.
  @property right
  @type Number
   */

  Object.defineProperty(Body.prototype, 'right', {
    get: function() {
      return this.shape.right;
    },
    set: function(val) {
      return this.shape.right = val;
    }
  });


  /**
  A virtual property representing the top-most point on this body's shape.
  
  Setting its value will move the shape vertically so that its top-most point is equal to the value specified.
  @property top
  @type Number
   */

  Object.defineProperty(Body.prototype, 'top', {
    get: function() {
      return this.shape.top;
    },
    set: function(val) {
      return this.shape.top = val;
    }
  });


  /**
  A virtual property representing the bottom-most point on this body's shape.
  
  Setting its value will move the shape vertically so that its bottom-most point is equal to the value specified.
  @property bottom
  @type Number
   */

  Object.defineProperty(Body.prototype, 'bottom', {
    get: function() {
      return this.shape.bottom;
    },
    set: function(val) {
      return this.shape.bottom = val;
    }
  });


  /**
  The width of this body's shape.
  @property width
  @type Number
   */

  Object.defineProperty(Body.prototype, 'width', {
    get: function() {
      return this.shape.width;
    },
    set: function(val) {
      return this.shape.width = val;
    }
  });


  /**
  The height of this body's shape.
  @property height
  @type Number
   */

  Object.defineProperty(Body.prototype, 'height', {
    get: function() {
      return this.shape.height;
    },
    set: function(val) {
      return this.shape.height = val;
    }
  });


  /**
  The mass of this object.
  
  Changing this property affects [`density`](#property_density) and [`inverseMass`](#property_inverseMass).
  @property mass
  @type Number
   */

  Object.defineProperty(Body.prototype, 'mass', {
    get: function() {
      if (this.inverseMass === 0) {
        return 0;
      }
      return 1 / this.inverseMass;
    },
    set: function(val) {
      this.density = val / this.shape.area;
      return this._updateMass();
    }
  });


  /**
  The inverse mass of this object.
  
  Changing this property affects [`density`](#property_density) and [`mass`](#property_mass).
  @property inverseMass
  @type Number
   */

  Object.defineProperty(Body.prototype, 'inverseMass', {
    get: function() {
      if (this.shape._areaDirty) {
        this._updateMass();
      }
      return this.__inverseMass;
    },
    set: function(val) {
      if (val === 0) {
        this.density = 0;
      } else {
        this.density = (1 / val) / this.shape.area;
      }
      return this._updateMass();
    }
  });


  /**
  The mass of this object.
  
  Changing this property affects [`density`](#property_density) and [`inverseMass`](#property_inverseMass).
  @property mass
  @type Number
   */

  Object.defineProperty(Body.prototype, 'density', {
    get: function() {
      return this.__density;
    },
    set: function(val) {
      this.__density = val;
      return this._updateMass();
    }
  });


  /**
  The static coefficient for this body's friction.
  @property sFriction
  @type Number
   */

  Object.defineProperty(Body.prototype, 'sFriction', {
    get: function() {
      return this.__sFriction;
    },
    set: function(val) {
      this.__sFriction2 = val * val;
      return this.__sFriction = val;
    }
  });


  /**
  The square of this body's static coefficient of friction.
  @property sFriction2
  @type Number
   */

  Object.defineProperty(Body.prototype, 'sFriction2', {
    get: function() {
      return this.__sFriction2;
    },
    set: function(val) {
      this.__sFriction2 = val;
      return this.__sFriction = Math.sqrt(val);
    }
  });


  /**
  The dynamic coefficient for this body's friction.
  @property dFriction
  @type Number
   */

  Object.defineProperty(Body.prototype, 'dFriction', {
    get: function() {
      return this.__dFriction;
    },
    set: function(val) {
      this.__dFriction2 = val * val;
      return this.__dFriction = val;
    }
  });


  /**
  The square of this body's dynamic coefficient of friction.
  @property dFriction2
  @type Number
   */

  Object.defineProperty(Body.prototype, 'dFriction2', {
    get: function() {
      return this.__dFriction2;
    },
    set: function(val) {
      this.__dFriction2 = val;
      return this.__dFriction = Math.sqrt(val);
    }
  });


  /**
  Simple friction coefficient. When read, its value is the same as [`dFriction`](#property_dFriction).
  
  Setting this value automatically sets [`dFriction`](#property_dFriction) to the value specified, and [`sFriction`](#property_sFriction) 25% higher, capped at 0.95.
  
  If you need finer control of friction, set [`dFriction`](#property_dFriction) and [`sFriction`](#property_sFriction) separately.
  
  @property friction
  @type Number
   */

  Object.defineProperty(Body.prototype, 'friction', {
    get: function() {
      return this.dFriction;
    },
    set: function(val) {
      this.dFriction = val;
      return this.sFriction = Math.min(0.95, val * 1.25);
    }
  });


  /**
  Update this body's position based on various forces and its current velocity.
  
  **NOTE:** This method is invoked by the [`PhysicsManager`](cg.physics.PhysicsManager.html) for any bodies that have been added
  with
  @method update
  @param dt {Number[seconds]} the amount of time that passed since the last update.
   */

  Body.prototype.update = function(dt) {
    var f, v, _ref;
    v = this.v;
    f = this.f;
    v.$add(cg.physics.gravity.mul(this.gravityScale));
    v.$add(f.$mul(this.inverseMass * dt));
    this.x += v.x * dt;
    this.y += v.y * dt;
    f.zero();
    if (this.bounded) {
      return this.collideWithBounds((_ref = this.bounds) != null ? _ref : cg.physics.bounds);
    }
  };


  /*
  TODO: This needs to work similarly to the other collide/intersect methods.
   */

  Body.prototype.collideWithBounds = function(bounds) {
    if (bounds.left !== false && this.left < bounds.left) {
      this.left = bounds.left;
      this.v.x *= -this.bounce;
    } else if (bounds.right !== false && this.right > bounds.right) {
      this.right = bounds.right;
      this.v.x *= -this.bounce;
    }
    if (bounds.top !== false && this.top < bounds.top) {
      this.top = bounds.top;
      return this.v.y *= -this.bounce;
    } else if (bounds.bottom !== false && this.bottom > bounds.bottom) {
      this.bottom = bounds.bottom;
      return this.v.y *= -this.bounce;
    }
  };

  return Body;

})(Module);

module.exports = Body;


},{"Module":6,"cg":13}],41:[function(require,module,exports){

/**
A description of how two [shapes](cg.physics.shapes.Shape.html) intersect.

@class cg.physics.Intersection
@constructor
@param object1 {Shape} The first intersecting shape.
@param object2 {Shape} The second intersecting shape.
@param normal {Vector2} The direction to "push" the objects out of each other with a minimal distance
@param penetration {Number} The total distance the shapes would need to move along `normal` for them to no longer intersect.
 */
var Intersection;

Intersection = (function() {

  /**
  The first intersecting shape.
  @property object1
  @type {Shape}
   */

  /**
  The second intersecting shape.
  @property object2
  @type {Shape}
   */

  /**
  The direction to "push" the objects out of each other with a minimal distance.
  @property normal
  @type Vector2
   */

  /**
  The total distance the shapes would need to move along `normal` for them to no longer intersect.
  @property penetration
  @type Number
   */
  function Intersection(object1, object2, normal, penetration) {
    this.object1 = object1;
    this.object2 = object2;
    this.normal = normal;
    this.penetration = penetration;
  }

  return Intersection;

})();

module.exports = Intersection;


},{}],42:[function(require,module,exports){
var Physical, cg;

cg = require('cg');

Physical = {
  mixin: {
    __getPhysical: function() {
      return !!this.__physical;
    },
    __setPhysical: function(val) {
      if (val === !!this.__physical) {
        return;
      }
      this.__physical = val;
      if (val) {
        return cg.physics.addBody(this.body);
      } else {
        return cg.physics.removeBody(this.body);
      }
    },
    __getX: function() {
      return this.body.x - this.body.offset.x;
    },
    __setX: function(val) {
      return this.body.x = val + this.body.offset.x;
    },
    __getY: function() {
      return this.body.y - this.body.offset.y;
    },
    __setY: function(val) {
      return this.body.y = val + this.body.offset.y;
    },
    __getShape: function() {
      return this.body.shape;
    },
    __setShape: function(val) {
      return this.body.shape = val;
    },
    __touches: function(other) {
      return this.body.shape.intersects(other.body.shape);
    },

    /*
    Test whether this object touches another object.
    
    This is effectively shorthand for `this.body.shape.intersects(other.body.shape)`.
    
    @method touches
    @param other {Actor|Array<Actor>|Group} The object(s) to test whether this object is touching or not.
    @return {Actor|null} the first `Actor` that a touch was detected on, if any; `null` if none are touching.
     */
    touches: function(others) {
      var other, _i, _len;
      if (!cg.util.isArray(others)) {
        if (others !== this && this.__touches(others)) {
          return others;
        }
      } else {
        for (_i = 0, _len = others.length; _i < _len; _i++) {
          other = others[_i];
          if (other !== this && this.__touches(other)) {
            return other;
          }
        }
        return false;
      }
    },

    /*
    Get the `Intersection` of this object with another, if any exists.
    
    @method intersects
    @param other {Actor} The object to test whether this object is touching or not.
    @return {cg.physics.Intersection} The intersection data of these two objects; `null` if they do not intersect.
     */
    intersects: function(other) {
      var intersection, intersects;
      intersection = new cg.physics.Intersection;
      intersects = this.body.shape.intersects(other.body.shape, intersection);
      if (intersects) {
        return intersection;
      } else {
        return null;
      }
    }
  },
  postInit: function() {
    var _height, _physical, _ref, _ref1, _ref2, _ref3, _ref4, _shape, _width, _x, _y;
    _x = (_ref = this.x) != null ? _ref : 0;
    _y = (_ref1 = this.y) != null ? _ref1 : 0;
    _physical = (_ref2 = this.physical) != null ? _ref2 : true;
    _width = (_ref3 = this.width) != null ? _ref3 : 10;
    _height = (_ref4 = this.height) != null ? _ref4 : 10;
    this.shape || (this.shape = new cg.physics.shapes.AABB(_x, _y, _width, _height));
    _shape = this.shape;
    this.body || (this.body = new cg.physics.Body(this, {
      shape: this.shape
    }));

    /**
    Shorthand for `this.body.shape`.
    
    @property shape
    @type {cg.physics.shapes.Shape}
     */
    Object.defineProperty(this, 'shape', {
      get: this.__getShape,
      set: this.__setShape,
      enumerable: true
    });
    this.shape = _shape;

    /**
    The horizontal position relative to `this.parent`.
    
    **Note**: Updating this property will update `this.body.x`, and vice-versa.
    @property x
    @type {Number}
     */
    Object.defineProperty(this, 'x', {
      get: this.__getX,
      set: this.__setX,
      enumerable: true
    });
    this.x = _x;

    /**
    The vertical position relative to `this.parent`.
    
    **Note**: Updating this property will update `this.body.y`, and vice-versa.
    @property y
    @type {Number}
     */
    Object.defineProperty(this, 'y', {
      get: this.__getY,
      set: this.__setY,
      enumerable: true
    });
    this.y = _y;

    /**
    Whether or not this actor
     */
    Object.defineProperty(this, 'physical', {
      get: this.__getPhysical,
      set: this.__setPhysical,
      enumerable: true
    });
    return this.physical = _physical;
  },
  postReset: function() {
    if (this.physical && (!this.body._active)) {
      return cg.physics.addBody(this.body);
    }
  },
  postDispose: function() {
    return cg.physics.removeBody(this.body);
  }
};

module.exports = Physical;


},{"cg":13}],43:[function(require,module,exports){
var Physics, PhysicsManager;

PhysicsManager = require('plugins/physics/PhysicsManager');


/**
A game-wide plugin that provides a [PhysicsManager](cg.physics.PhysicsManager.html) instance to be used by
 [Physical](cg.physics.Physical.html) objects.

@class cg.physics.Physics
 */

Physics = {
  postInit: function() {

    /**
    Reference to this game's [`cg.physics.PhysicsManager`](cg.physics.PhysicsManager.html) instance.
    
    @property physics
     */
    this.physics = PhysicsManager._instance;
    if ((this.width != null) && (this.height != null)) {
      this.physics.bounds.left = 0;
      this.physics.bounds.right = this.width;
      this.physics.bounds.top = 0;
      return this.physics.bounds.bottom = this.height;
    }
  },
  preUpdate: function() {
    return this.physics.update();
  }
};

module.exports = Physics;


},{"plugins/physics/PhysicsManager":44}],44:[function(require,module,exports){
var AABB, Body, DebugVisuals, Intersection, Module, Physical, PhysicsManager, Shape, Vector2, cg, func, intersection, name, relativeVelocity, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Module = require('Module');

Vector2 = require('math/Vector2');

Body = require('plugins/physics/Body');

Intersection = require('plugins/physics/Intersection');

Physical = require('plugins/physics/Physical');

Shape = require('plugins/physics/shapes/Shape');

AABB = require('plugins/physics/shapes/AABB');

DebugVisuals = (function(_super) {
  __extends(DebugVisuals, _super);

  function DebugVisuals(manager) {
    this.manager = manager;
    DebugVisuals.__super__.constructor.call(this, {});
    this.gfx = this.addChild(new cg.rendering.Graphics);
  }

  DebugVisuals.prototype.update = function() {
    var body, _i, _len, _ref;
    DebugVisuals.__super__.update.apply(this, arguments);
    this.gfx.clear();
    this.gfx.lineStyle(1, 0x00FF00, 0.8);
    this.gfx.beginFill(0, 0);
    _ref = this.manager.bodies;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      body = _ref[_i];
      this.gfx.drawRect(body.x, body.y, body.width, body.height);
    }
    return this.gfx.endFill();
  };

  return DebugVisuals;

})(cg.Actor);

intersection = new Intersection(null, null, new Vector2, 0);

relativeVelocity = new Vector2;


/**
Manages the updating/collisions of an arbitrary collection of [bodies](cg.physics.Body.html).

@class cg.physics.PhysicsManager
@extends cg.Module
@constructor
 */

PhysicsManager = (function(_super) {
  __extends(PhysicsManager, _super);

  PhysicsManager.prototype.Body = Body;

  PhysicsManager.prototype.Intersection = Intersection;

  PhysicsManager.prototype.PhysicsManager = PhysicsManager;

  PhysicsManager.prototype.Shape = Shape;

  PhysicsManager.prototype.Physical = Physical;

  PhysicsManager._instance = new PhysicsManager;

  PhysicsManager.prototype.intersectFuncs = [];

  PhysicsManager.prototype.collideFuncs = [];

  PhysicsManager.prototype.containsFuncs = [];

  PhysicsManager.prototype.__nextShapeID = 0;

  PhysicsManager.prototype.__shapeIDs = {};

  PhysicsManager.prototype.__shapeNames = [];

  PhysicsManager.prototype.correctionPercent = 0.6;

  PhysicsManager.prototype.correctionSlop = 0.05;

  PhysicsManager.prototype.enableDebugVisuals = function() {
    if (this.__debugVisuals == null) {
      this.__debugVisuals = cg.stage.addChild(new DebugVisuals(this));
    }
    return this.__debugVisuals.resume().show();
  };

  PhysicsManager.prototype.disableDebugVisuals = function() {
    var _ref;
    return (_ref = this.__debugVisuals) != null ? _ref.pause().hide() : void 0;
  };

  PhysicsManager.prototype.toggleDebugVisuals = function() {
    if ((this.__debugVisuals == null) || this.__debugVisuals.paused) {
      return this.enableDebugVisuals();
    } else {
      return this.disableDebugVisuals();
    }
  };


  /**
  Register a new shape type with the manager and retrieve a unique ID for it.
  
  This will make the shape class accessible as `cg.physics.shapes[name]`.
  @method registerPhysicsShape
  @param name {String} A unique identifier for the type of shape you wish to retrieve an ID for.
  @param shapeClass A reference to the shape class being registered.
   */

  PhysicsManager.prototype.registerPhysicsShape = function(name, shapeClass) {
    if (this.__shapeIDs[name] != null) {
      cg.warn("PhysicsManager::registerPhysicsShape: Shape with name " + name + " already exists; NOT overwriting!");
    } else {
      this.__shapeIDs[name] = this.__nextShapeID++;
      this.__shapeNames[this.__shapeIDs[name]] = name;
    }
    if (this.shapes == null) {
      this.shapes = {};
    }
    this.shapes[name] = shapeClass;
    return this.__shapeIDs[name];
  };


  /**
  Retrieve a shape name from a given shape ID (generated with [`registerPhysicsShape`](#method_registerPhysicsShape)).
  
  @method getShapeNameforID
  @param shapeID {Number} The ID to resolve as a shape name.
  @return {String} The name associated with `shapeID`.
   */

  PhysicsManager.prototype.getShapeNameForID = function(shapeID) {
    var _ref;
    return (_ref = this.__shapeNames[shapeID]) != null ? _ref : '__UNKNOWN__';
  };

  PhysicsManager.prototype.registerIntersectHandler = function(shapeA, shapeB, handler) {
    var _base;
    if ((_base = this.intersectFuncs)[shapeA] == null) {
      _base[shapeA] = [];
    }
    if (this.intersectFuncs[shapeA][shapeB] != null) {
      cg.warn("PhysicsManager: Overwriting existing collision handler for '" + (this.getShapeNameForID(shapeA)) + "' vs '" + (this.getShapeNameForID(shapeB)) + "'!");
    }
    return this.intersectFuncs[shapeA][shapeB] = handler;
  };

  PhysicsManager.prototype.registerCollideHandler = function(shapeA, shapeB, handler) {
    var _base;
    if ((_base = this.collideFuncs)[shapeA] == null) {
      _base[shapeA] = [];
    }
    if (this.collideFuncs[shapeA][shapeB] != null) {
      cg.warn("PhysicsManager: Overwriting existing collision handler for '" + (this.getShapeNameForID(shapeA)) + "' vs '" + (this.getShapeNameForID(shapeB)) + "'!");
    }
    return this.collideFuncs[shapeA][shapeB] = handler;
  };

  function PhysicsManager() {
    this.gravity = new Vector2(0, 10);
    this.bounds = {
      left: false,
      right: false,
      top: false,
      bottom: false
    };
    this.bodies = [];
  }


  /**
  Add a body to this manager's list of bodies to update and test collisions for.
  @method addBody
  @param body {cg.physics.Body} The body to add to this manager.
  @return {cg.physics.Body} The body that was added.
   */

  PhysicsManager.prototype.addBody = function(body) {
    this.bodies.push(body);
    body._active = true;
    return body;
  };


  /**
  Remove a body from this manager's list of bodies to update and test collisions for.
  @method removeBody
  @param body {cg.physics.Body} The body to remove from this manager.
  @return {cg.physics.Body} The body that was removed.
   */

  PhysicsManager.prototype.removeBody = function(body) {
    var idx;
    idx = this.bodies.indexOf(body);
    if (idx < 0) {
      return;
    }
    this.bodies.splice(idx, 1);
    body._active = false;
    return body;
  };


  /**
  Update all bodies that were added with [`addBody`](#method_addBody).
  
  Bodies that are associated with paused actors will not be updated.
  
  @method update
   */

  PhysicsManager.prototype.update = function() {
    var body, dts, _i, _len, _ref;
    dts = cg.dt_seconds;
    _ref = this.bodies;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      body = _ref[_i];
      if (!body.actor.worldPaused) {
        body.update(dts);
      }
    }
  };


  /**
  Resolve the appropriate function to compute the intersection between two shape types.
  @method getIntersectionFunctionFor
  @param type1 {Number} The ID of the first shape type.
  @param type2 {Number} The ID of the second shape type.
  @return {Function} The intersection function associated with the two shape types; `null` if no appropriate function exists.
   */

  PhysicsManager.prototype.getIntersectionFunctionFor = function(type1, type2) {
    var intersect, _ref;
    intersect = (_ref = this.intersectFuncs[type1]) != null ? _ref[type2] : void 0;
    if (intersect == null) {
      cg.warn("No intersection test function for '" + (PhysicsManager.getShapeNameForID(this.type)) + "' vs '" + (PhysicsManager.getShapeNameForID(other.type)) + "'!");
      return null;
    }
    return intersect;
  };


  /**
  Resolve the appropriate function to compute the collision between two bodies.
  @method getCollisionFunctionFor
  @param type1 {Number} The ID of the first body's shape type.
  @param type2 {Number} The ID of the second body's shape type.
  @return {Function} The intersection function associated with the two bodies' shape types; `null` if no appropriate function exists.
   */

  PhysicsManager.prototype.getCollisionFunctionFor = function(type1, type2) {
    var collide, _ref;
    collide = (_ref = this.collideFuncs[type1]) != null ? _ref[type2] : void 0;
    if (collide == null) {
      cg.warn("No collision test function for '" + (PhysicsManager.getShapeNameForID(this.type)) + "' vs '" + (PhysicsManager.getShapeNameForID(other.type)) + "'!");
      return null;
    }
    return collide;
  };


  /**
  Determine if two bodies are intersecting, and if they are, compute and apply the appropriate collision response, which should
  lead the bodies to bounce off one another.
  @method collide
  @param a {Shape} The first body.
  @param b {Shape} The second body.
  @return {Boolean} `true` if a collision occured, `false` otherwise.
   */

  PhysicsManager.prototype.collide = function(a, b) {
    var aInvMass, bInvMass, correction, dynFriction, frictionImpulse, impulse, j, jt, mu, restitution, speedAlongNormal, tangent, totInvMass, _base;
    if (a.mass === 0 && b.mass === 0) {
      return false;
    }
    relativeVelocity.zero();
    speedAlongNormal = typeof (_base = this.getCollisionFunctionFor(a.shape.type, b.shape.type)) === "function" ? _base(a, b, intersection, relativeVelocity) : void 0;
    if (!speedAlongNormal) {
      return;
    }
    aInvMass = a.inverseMass;
    bInvMass = b.inverseMass;
    totInvMass = aInvMass + bInvMass;
    if (intersection.penetration > this.correctionSlop) {
      correction = intersection.normal.mul((intersection.penetration / totInvMass) * this.correctionPercent);
      a.x -= aInvMass * correction.x;
      a.y -= aInvMass * correction.y;
      b.x += bInvMass * correction.x;
      b.y += bInvMass * correction.y;
    }
    if (!(speedAlongNormal < 0)) {
      return false;
    }
    restitution = Math.min(a.bounce, b.bounce);
    j = -(1 + restitution) * speedAlongNormal;
    j /= totInvMass;
    impulse = intersection.normal.mul(j);
    a.v.$sub(impulse.mul(aInvMass));
    b.v.$add(impulse.mul(bInvMass));
    tangent = relativeVelocity.sub(intersection.normal.mul(relativeVelocity.dot(intersection.normal)));
    tangent.$norm();
    jt = -relativeVelocity.dot(tangent);
    jt /= totInvMass;
    mu = Math.sqrt(a.sFriction2 + b.sFriction2);
    if (Math.abs(jt) < j * mu) {
      frictionImpulse = tangent.mul(jt);
    } else {
      dynFriction = Math.sqrt(a.dFriction2 + b.dFriction2);
      frictionImpulse = tangent.mul(-1 * j * dynFriction);
    }
    a.v.$sub(frictionImpulse.mul(aInvMass));
    b.v.$add(frictionImpulse.mul(bInvMass));
    return true;
  };

  return PhysicsManager;

})(Module);

_ref = PhysicsManager.prototype;
for (name in _ref) {
  if (!__hasProp.call(_ref, name)) continue;
  func = _ref[name];
  if (typeof func !== 'function') {
    continue;
  }
  PhysicsManager[name] = (function(func) {
    return function() {
      return func.apply(this._instance, arguments);
    };
  })(func);
}

AABB.prototype.type = PhysicsManager._instance.registerPhysicsShape('AABB', AABB);

PhysicsManager._instance.registerIntersectHandler(AABB.prototype.type, AABB.prototype.type, AABB.IntersectAABB);

PhysicsManager._instance.registerCollideHandler(AABB.prototype.type, AABB.prototype.type, AABB.CollideAABB);

module.exports = PhysicsManager;


},{"Module":6,"cg":13,"math/Vector2":33,"plugins/physics/Body":40,"plugins/physics/Intersection":41,"plugins/physics/Physical":42,"plugins/physics/shapes/AABB":45,"plugins/physics/shapes/Shape":46}],45:[function(require,module,exports){
var AABB, Shape,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Shape = require('plugins/physics/shapes/Shape');


/**
An axis-aligned (non-rotating) bounding box shape.

@class cg.physics.shapes.AABB
@extends cg.physics.shapes.Shape
@constructor
@param [x=0] The horizontal position of the box.
@param [y=0] The vertical position of the box.
@param [width=10] The horizontal size of the box.
@param [height=10] The vertical size of the box.
 */

AABB = (function(_super) {
  var axes, intersects, normalizeOverX, normalizeOverY;

  __extends(AABB, _super);

  function AABB(x, y, width, height) {
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    if (width == null) {
      width = 10;
    }
    if (height == null) {
      height = 10;
    }
    this.min = new cg.math.Vector2(x, y);
    this.max = new cg.math.Vector2(x + width, y + height);
  }


  /**
  The horizontal position of the box.
  @property x
  @type Number
   */

  Object.defineProperty(AABB.prototype, 'x', {
    get: function() {
      return this.min.x;
    },
    set: function(val) {
      var w;
      w = this.width;
      this.min.x = val;
      return this.max.x = val + w;
    }
  });


  /**
  The vertical position of the box.
  @property y
  @type Number
   */

  Object.defineProperty(AABB.prototype, 'y', {
    get: function() {
      return this.min.y;
    },
    set: function(val) {
      var h;
      h = this.height;
      this.min.y = val;
      return this.max.y = val + h;
    }
  });


  /**
  The width of the box.
  @property width
  @type Number
   */

  Object.defineProperty(AABB.prototype, 'width', {
    get: function() {
      return this.max.x - this.min.x;
    },
    set: function(val) {
      this.max.x = this.min.x + val;
      return this._areaDirty = true;
    }
  });


  /**
  The height of the box.
  @property height
  @type Number
   */

  Object.defineProperty(AABB.prototype, 'height', {
    get: function() {
      return this.max.y - this.min.y;
    },
    set: function(val) {
      this.max.y = this.min.y + val;
      return this._areaDirty = true;
    }
  });


  /**
  A virtual property representing the left-most point on this shape.
  
  Setting its value will move the shape horizontally so that its left-most point is equal to the value specified.
  @property left
  @type Number
   */

  Object.defineProperty(AABB.prototype, 'left', {
    get: function() {
      return this.min.x;
    },
    set: function(val) {
      var w;
      w = this.width;
      this.min.x = val;
      return this.max.x = val + w;
    }
  });


  /**
  A virtual property representing the right-most point on this shape.
  
  Setting its value will move the shape horizontally so that its right-most point is equal to the value specified.
  @property right
  @type Number
   */

  Object.defineProperty(AABB.prototype, 'right', {
    get: function() {
      return this.max.x;
    },
    set: function(val) {
      var w;
      w = this.width;
      this.max.x = val;
      return this.min.x = val - w;
    }
  });


  /**
  A virtual property representing the top-most point on this shape.
  
  Setting its value will move the shape vertically so that its top-most point is equal to the value specified.
  @property top
  @type Number
   */

  Object.defineProperty(AABB.prototype, 'top', {
    get: function() {
      return this.min.y;
    },
    set: function(val) {
      var h;
      h = this.height;
      this.min.y = val;
      return this.max.y = val + h;
    }
  });


  /**
  A virtual property representing the bottom-most point on this shape.
  
  Setting its value will move the shape vertically so that its bottom-most point is equal to the value specified.
  @property bottom
  @type Number
   */

  Object.defineProperty(AABB.prototype, 'bottom', {
    get: function() {
      return this.max.y;
    },
    set: function(val) {
      var h;
      h = this.height;
      this.max.y = val;
      return this.min.y = val - h;
    }
  });


  /**
  A virtual, **read-only** property representing the total area of this shape.
  
  @property area
  @type Number
   */

  Object.defineProperty(AABB.prototype, 'area', {
    get: function() {
      return this.width * this.height;
    }
  });


  /**
  A virtual, **read-only** representation of the center-point of this shape.
  
  @property center
  @type cg.math.Vector2
   */

  Object.defineProperty(AABB.prototype, 'center', {
    get: function() {
      return new cg.math.Vector2(this.x + this.width / 2, this.y + this.height / 2);
    }
  });

  intersects = function(a, b) {
    return a.bottom >= b.top && a.top <= b.bottom && a.right >= b.left && a.left <= b.right;
  };

  axes = function(a, b) {
    var aToB;
    aToB = b.center.sub(a.center);
    return {
      aToB: aToB,
      dx: (a.width / 2) + (b.width / 2) - Math.abs(aToB.x),
      dy: (a.height / 2) + (b.height / 2) - Math.abs(aToB.y)
    };
  };

  normalizeOverX = function(normal, dist) {
    normal.y = 0;
    normal.x = dist < 0 ? -1 : 1;
  };

  normalizeOverY = function(normal, dist) {
    normal.x = 0;
    normal.y = dist < 0 ? -1 : 1;
  };

  AABB.IntersectAABB = function(a, b, intersection) {
    var aToB, dx, dy, _ref;
    if (intersection == null) {
      return intersects(a, b);
    }
    if (!intersects(a, b)) {
      return false;
    }
    _ref = axes(a, b), aToB = _ref.aToB, dx = _ref.dx, dy = _ref.dy;
    if (dx < dy) {
      intersection.penetration = dx;
      normalizeOverX(intersection.normal, aToB.x);
    } else {
      intersection.penetration = dy;
      normalizeOverY(intersection.normal, aToB.y);
    }
    return true;
  };

  AABB.CollideAABB = function(a, b, intersection, relativeVelocity) {
    var aToB, dx, dy, speedAlongNormal, _ref;
    if (!intersects(a.shape, b.shape, intersection)) {
      return false;
    }
    _ref = axes(a.shape, b.shape), aToB = _ref.aToB, dx = _ref.dx, dy = _ref.dy;
    if (dx < dy) {
      normalizeOverX(intersection.normal, aToB.x);
      speedAlongNormal = relativeVelocity.set(b.v.sub(a.v)).dot(intersection.normal);
      intersection.penetration = dx;
    } else {
      normalizeOverY(intersection.normal, aToB.y);
      speedAlongNormal = relativeVelocity.set(b.v.sub(a.v)).dot(intersection.normal);
      intersection.penetration = dy;
    }
    return speedAlongNormal;
  };

  return AABB;

})(Shape);

module.exports = AABB;


},{"plugins/physics/shapes/Shape":46}],46:[function(require,module,exports){
var Module, Shape,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Module = require('Module');


/**
The abstract base class for all shapes available in Combo's simple physics system.

@class cg.physics.shapes.Shape
 */

Shape = (function(_super) {
  __extends(Shape, _super);

  function Shape() {
    return Shape.__super__.constructor.apply(this, arguments);
  }


  /**
  Check if this shape intersects with another.
  
  @method intersects
  @param other {Shape} the other shape to check for intersection against.
  @param intersection {Intersection} the intersection object to store intersection data in if an intersection occurs.
  @return {Boolean} `true` if the shapes intersect, `false` otherwise.
   */

  Shape.prototype.intersects = function(other, intersection) {
    var intersects;
    intersects = cg.physics.getIntersectionFunctionFor(this.type, other.type);
    if (intersects == null) {
      return false;
    }
    return intersects(this, other, intersection);
  };

  return Shape;

})(Module);

module.exports = Shape;


},{"Module":6}],47:[function(require,module,exports){
var Interactive, cg;

cg = require('cg');


/**
An actor plugin that is used in conjunction with `plugins.ui`
@class plugins.ui.Interactive
 */

Interactive = {
  mixin: {
    __getInteractive: function() {
      return !!this.__interactive;
    },
    __setInteractive: function(val) {
      if (val === !!this.__interactive) {
        return;
      }
      this.__interactive = !!val;
      if (val) {
        return cg.ui.registerActor(this);
      } else {
        return cg.ui.unregisterActor(this);
      }
    }
  },
  postInit: function() {
    var _interactive, _ref;
    _interactive = (_ref = this.interactive) != null ? _ref : true;

    /**
    Whether or not this actor is interactive with mouse/touch
    @property interactive
    @type {Boolean}
     */
    Object.defineProperty(this, 'interactive', {
      get: this.__getInteractive,
      set: this.__setInteractive,
      enumerable: true
    });
    return this.interactive = _interactive;
  }
};

module.exports = Interactive;


},{"cg":13}],48:[function(require,module,exports){
var UI, UIManager;

UIManager = require('plugins/ui/UIManager');


/**
A game-wide plugin that provides a [UIManager](cg.ui.UIManager.html) instance to be used by 
 [Interactive](cg.ui.Interactive.html) objects.

@class plugins.ui
 */

UI = {
  postInit: function() {

    /**
    Reference to this game's [`cg.ui.UIManager`](cg.ui.UIManager.html) instance.
    
    @property ui
     */
    return this.ui = new UIManager();
  },
  preUpdate: function() {
    return this.ui.update();
  }
};

module.exports = UI;


},{"plugins/ui/UIManager":49}],49:[function(require,module,exports){
var HasSignals, Interactive, Module, UIManager, cg, hitTest, touchDrag, unregister,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Module = require('Module');

HasSignals = require('util/HasSignals');

Interactive = require('plugins/ui/Interactive');

hitTest = function(item, gx, gy) {
  var a00, a01, a02, a10, a11, a12, height, id, width, worldTransform, x, x1, y, y1, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
  gx *= cg.stage.scaleX;
  gy *= cg.stage.scaleY;
  worldTransform = item.worldTransform;
  a00 = worldTransform[0];
  a01 = worldTransform[1];
  a02 = worldTransform[2];
  a10 = worldTransform[3];
  a11 = worldTransform[4];
  a12 = worldTransform[5];
  id = 1 / (a00 * a11 + a01 * -a10);
  x = a11 * id * gx + -a01 * id * gy + (a12 * a01 - a02 * a11) * id;
  y = a00 * id * gy + -a10 * id * gx + (-a12 * a00 + a02 * a10) * id;
  width = (_ref = (_ref1 = item.width) != null ? _ref1 : (_ref2 = item.texture) != null ? _ref2.frame.width : void 0) != null ? _ref : 0;
  height = (_ref3 = (_ref4 = item.height) != null ? _ref4 : (_ref5 = item.texture) != null ? _ref5.frame.height : void 0) != null ? _ref3 : 0;
  x1 = -width * ((_ref6 = item.anchorX) != null ? _ref6 : 0);
  if (x > x1 && x < x1 + width) {
    y1 = -height * ((_ref7 = item.anchorY) != null ? _ref7 : 0);
    if (y > y1 && y < y1 + height) {
      return true;
    }
  }
  return false;
};

touchDrag = function(touch) {
  var dx, dy;
  if (!this.__ui_dragStarted) {
    this.__ui_dragStarted = true;

    /**
    Emitted whenever this actor begins being dragged by a touch instance.
    
    @event drag
    @param touch {Touch} The touch instance that is doing the dragging.
     */
    this.emit('dragStart', touch);
  }
  dx = touch.dx, dy = touch.dy;
  if (this.draggable) {
    this.x += dx;
    this.y += dy;
    this.dragging = true;

    /**
    Emitted whenever this actor's position changes from being dragged by a touch instance.
    
    @event drag
    @param touch {Touch} The touch instance that is doing the dragging.
     */
    return this.emit('drag', touch);
  }
};

unregister = function(actor) {
  return cg.ui.unregisterActor(actor);
};


/**
Control the dispatching of touch/mouse events on actors in your game.

**NOTE**: All events listed under this class actually apply to actors added with [`registerActor`](#method_registerActor).

@class plugins.ui.UIManager
@extends cg.Module
 */

UIManager = (function(_super) {
  __extends(UIManager, _super);

  UIManager.mixin(HasSignals);

  UIManager.prototype.UIManager = UIManager;

  UIManager.prototype.Interactive = Interactive;

  function UIManager() {
    this.__actors = [];
    this.on(cg.input, 'touchDown', function(touch) {
      var actor, hoveredObject, mouseOver, released, stopDragging, touchX, touchY, _i, _len, _ref;
      stopDragging = function() {
        this.dragging = false;
        this.off(touch, 'drag', touchDrag);
        if (this.__ui_dragStarted) {
          this.__ui_dragStarted = false;

          /**
          Emitted whenever this actor stops being dragged by a touch instance.
          
          @event dragStop
          @param touch {Touch} The touch instance that was doing the dragging.
           */
          return this.emit('dragStop', touch);
        }
      };
      released = function() {

        /**
        Emitted whenever a touch that started inside an actor is released.
        
        @event touchUp
        @param touch {Touch} The touch instance that was released.
         */
        this.emit('touchUp', touch);
        if (!hitTest(this, touch.x, touch.y)) {

          /**
          Emitted whenever a touch that *started* inside an actor is released *outside* the actor.
          
          @event touchUpOutside
          @param touch {Touch} The touch instance that was released.
           */
          return this.emit('touchUpOutside', touch);
        } else {

          /**
          Emitted whenever a touch that started inside an actor is released inside the actor.
          
          @event touchUpInside
          @param touch {Touch} The touch instance that was released.
           */
          this.emit('touchUpInside', touch);

          /**
          Emitted whenever a touch that started inside an actor is released inside the actor.
          
          @event tap
          @param touch {Touch} The touch instance that was released.
           */
          return this.emit('tap', touch);
        }
      };
      mouseOver = function() {
        return this.emit('mouseOver');
      };
      touchX = touch.x;
      touchY = touch.y;
      hoveredObject = null;
      _ref = this.__actors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        actor = _ref[_i];
        if (!(actor.worldVisible && (!(hoveredObject != null ? hoveredObject.isAbove(actor) : void 0)) && hitTest(actor, touchX, touchY))) {
          continue;
        }
        hoveredObject = actor;
      }
      if (hoveredObject == null) {
        return;
      }

      /**
      Emitted whenever a touch starts inside an actor.
      
      @event touchDown
      @param touch {Touch} The touch instance that just started.
       */
      hoveredObject.emit('touchDown', touch);
      hoveredObject.once(touch, 'release', released);
      if (hoveredObject.draggable) {
        hoveredObject.on(touch, 'drag', touchDrag);
        return hoveredObject.once(touch, 'release', stopDragging);
      }
    });
    this.on(cg.input, 'touchDrag', function(touch) {
      var actor, hoveredObject, touchX, touchY, _i, _len, _ref;
      touchX = touch.x;
      touchY = touch.y;
      hoveredObject = null;
      _ref = this.__actors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        actor = _ref[_i];
        if (!(actor.worldVisible && (!(hoveredObject != null ? hoveredObject.isAbove(actor) : void 0)) && hitTest(actor, touchX, touchY))) {
          continue;
        }
        hoveredObject = actor;
      }
      if (hoveredObject == null) {
        return;
      }

      /**
      Emitted whenever a dragging touch goes over an actor.
      
      @event dragOver
      @param touch {Touch} The touch instance that is dragging.
       */
      return hoveredObject.emit('dragOver', touch);
    });
    this.on(cg.input, 'mouseMove', function(mouse) {
      var actor, hoveredObject, mouseX, mouseY, _i, _len, _ref;
      hoveredObject = null;
      mouseX = mouse.x;
      mouseY = mouse.y;
      _ref = this.__actors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        actor = _ref[_i];
        if (actor.worldVisible && (!(hoveredObject != null ? hoveredObject.isAbove(actor) : void 0)) && hitTest(actor, mouseX, mouseY)) {
          if (hoveredObject != null ? hoveredObject.__ui_mouseOver : void 0) {
            hoveredObject.__ui_mouseOver = false;

            /**
            Emitted whenever the mouse leaves the area of an actor.
            
            @event mouseOut
            @param mouse {Touch} The mouse that is no longer hovering over the actor.
             */
            hoveredObject.emit('mouseOut', mouse);
          }
          hoveredObject = actor;
        } else if (actor.__ui_mouseOver) {
          actor.__ui_mouseOver = false;
          actor.emit('mouseOut', mouse);
        }
      }
      if (hoveredObject == null) {
        return;
      }
      mouse.__ui_hoveredObject = hoveredObject;
      if (!hoveredObject.__ui_mouseOver) {
        hoveredObject.__ui_mouseOver = true;

        /**
        Emitted whenever the mouse enters the area of an actor.
        
        @event mouseOver
        @param mouse {Touch} The mouse that is now hovering over the actor.
         */
        hoveredObject.emit('mouseOver', mouse);
      }
      return hoveredObject.emit('mouseMove', mouse);
    });
  }

  UIManager.prototype.update = function() {
    return cg.input.emit('mouseMove', cg.input.mouse);
  };


  /**
  Enable UI events for a specified actor.
  
  @method registerActor
  @param actor {Actor} The actor to enable UI events for.
   */

  UIManager.prototype.registerActor = function(actor) {
    if (actor.__ui_registered) {
      return;
    }
    this.__actors.push(actor);
    actor.__ui_registered = true;
    return this.once(actor, '__destroy__', unregister);
  };


  /**
  Disable UI events for a specified actor.
  
  @method registerActor
  @param actor {Actor} The actor to disable UI events for.
   */

  UIManager.prototype.unregisterActor = function(actor) {
    var idx;
    this.off(actor, '__destroy__', unregister);
    if (!actor.__ui_registered) {
      return;
    }
    idx = this.__actors.indexOf(actor);
    if (idx < 0) {
      return;
    }
    this.__actors.splice(idx, 1);
    return delete actor.__ui_registered;
  };

  return UIManager;

})(Module);

module.exports = UIManager;


},{"Module":6,"cg":13,"plugins/ui/Interactive":47,"util/HasSignals":93}],50:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/*
@author Mat Groves http://matgroves.com/ @Doormat23
 */
var CustomRenderable, DisplayObject, RenderTypes,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DisplayObject = require('rendering/DisplayObject');

RenderTypes = require('rendering/core/RenderTypes');


/*
This object is one that will allow you to specify custom rendering functions based on render type

@class CustomRenderable
@extends cg.rendering.DisplayObject
@constructor
 */

CustomRenderable = (function(_super) {
  __extends(CustomRenderable, _super);

  CustomRenderable.prototype.__renderType = RenderTypes.CUSTOMRENDERABLE;

  function CustomRenderable() {
    CustomRenderable.__super__.constructor.apply(this, arguments);
  }


  /*
  If this object is being rendered by a CanvasRenderer it will call this callback
  
  @method renderCanvas
  @param renderer {CanvasRenderer} The renderer instance
   */

  CustomRenderable.prototype.renderCanvas = function(renderer) {};


  /*
  If this object is being rendered by a WebGLRenderer it will call this callback to initialize
  
  @method initWebGL
  @param renderer {WebGLRenderer} The renderer instance
   */

  CustomRenderable.prototype.initWebGL = function(renderer) {};


  /*
  If this object is being rendered by a WebGLRenderer it will call this callback
  
  @method renderGLES
  @param renderer {WebGLRenderer} The renderer instance
   */

  CustomRenderable.prototype.renderGLES = function(renderGroup, projectionMatrix) {};

  return CustomRenderable;

})(DisplayObject);

module.exports = CustomRenderable;


},{"rendering/DisplayObject":51,"rendering/core/RenderTypes":64}],51:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/**
@author Mat Groves http://matgroves.com/ @Doormat23
 */
var DisplayObject, FilterBlock, Matrix, Module, Point, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Point = require('rendering/core/Point');

Matrix = require('rendering/core/Matrix');

FilterBlock = require('rendering/filters/FilterBlock');

Module = require('Module');


/**
The base class for all objects that are rendered on the screen.

@class cg.rendering.DisplayObject
@constructor
 */

DisplayObject = (function(_super) {
  __extends(DisplayObject, _super);

  DisplayObject.defineProperty('scene', {
    get: function() {
      if (this.parent == null) {
        return null;
      }
      if (this.parent.isScene) {
        return this.parent;
      }
      return this.parent.scene;
    }
  });

  DisplayObject.defineProperty('isScene', {
    value: false,
    writable: false,
    configurable: true
  });

  function DisplayObject() {
    this.last = this;
    this.first = this;

    /**
    The x coordinate of the object relative to the local coordinates of the parent.
    @property x
     */
    this.x = 0;

    /**
    The y coordinate of the object relative to the local coordinates of the parent.
    @property y
     */
    this.y = 0;

    /**
    The X scale factor of the object.
    @property scaleX
     */
    if (this.scaleX == null) {
      this.scaleX = 1;
    }

    /**
    The Y scale factor of the object.
    @property scaleY
     */
    if (this.scaleY == null) {
      this.scaleY = 1;
    }

    /**
    The x-coordinate of the pivot point that this rotates around.
    @property pivotX
     */
    this.pivotX = 0;

    /**
    The y-coordinate of the pivot point that this rotates around.
    @property pivotY
     */
    this.pivotY = 0;

    /**
    The rotation of the object in radians.
    
    @property rotation
    @type Number
     */
    this.rotation = 0;

    /**
    The opacity of the object.
    
    @property alpha
    @type Number
     */
    this.alpha = 1;

    /**
    Whether this object is renderable or not.
    
    @property renderable
    @type Boolean
     */
    this.renderable = false;

    /**
    Whether this object should be rendered or not (ignored if [`renderable`](#property_renderable) is `false`).
    
    @property visible
    @type Boolean
     */
    this.visible = true;

    /**
    The visibility of the object based on world (parent) factors.
    
    @property worldVisible
    @type Boolean
    @final
     */

    /**
    The display object container that contains this display object.
    
    @property parent
    @type DisplayObjectContainer
    @final
     */
    this.parent = null;

    /**
    The stage the display object is connected to, or undefined if it is not connected to the stage.
    
    @property stage
    @type Stage
    @final
    @protected
     */
    if (this.stage == null) {
      this.stage = null;
    }

    /**
    The multiplied alpha of this `DisplayObject`.
    
    @property worldAlpha
    @type Number
    @final
     */
    this.worldAlpha = 1;

    /**
    Current transform of the object based on world (parent) factors
    
    @property worldTransform
    @type Mat3
    @final
    @private
     */
    this.worldTransform = Matrix.mat3.create();

    /**
    Current transform of the object locally
    
    @property localTransform
    @type Mat3
    @final
    @private
     */
    this.localTransform = Matrix.mat3.create();
    this._sr = 0;
    this._cr = 1;
  }


  /**
  Sets a mask for the displayObject. A mask is an object that limits the visibility of an object to the shape of the mask applied to it.
  A regular mask must be a Graphics object. This allows for much faster masking in canvas as it utilises shape clipping.
  To remove a mask, set this property to null.
  
  @property mask
  @type Graphics
   */

  DisplayObject.defineProperty('mask', {
    get: function() {
      return this._mask;
    },
    set: function(value) {
      if (!value) {
        this.removeFilter(this._mask);
        this._mask.renderable = true;
      } else {
        if (this._mask) {
          value.start = this._mask.start;
          value.end = this._mask.end;
        } else {
          this.addFilter(value);
          value.renderable = false;
        }
      }
      return this._mask = value;
    }
  });

  DisplayObject.prototype._getVisible = function() {
    return this.__visible;
  };

  DisplayObject.prototype._setVisible = function(value) {
    return this.__visible = value;
  };

  DisplayObject.defineProperty('visible', {
    get: function() {
      return this._getVisible();
    },
    set: function(value) {
      return this._setVisible(value);
    }
  });

  DisplayObject.prototype._getWorldVisible = function() {
    return this.__worldVisible;
  };

  DisplayObject.prototype._setWorldVisible = function(value) {
    return this.__worldVisible = value;
  };

  DisplayObject.defineProperty('worldVisible', {
    get: function() {
      return this._getWorldVisible();
    }
  });


  /**
  A special property that allows you to set both [`scaleX`](#property_scaleX) and [`scaleY`](#property_scaleY)
  simultaneously to the same value.
  
  When *reading* this value, if [`scaleX`](#property_scaleX) and  [`scaleY`](#property_scaleY) are not equal, 
  it will resemble the average of the two.
  
  @example
      this.scaleX = 0.5;
      this.scaleY = 1.5;
      cg.log(this.scale); // Output: "1"
  
      this.scale = 2;
      cg.log(this.scaleX); // Output: "2"
      cg.log(this.scaleY); // Output: "2"
  
  @property scale
  @type Number
   */

  DisplayObject.defineProperty('scale', {
    get: function() {
      return (this.scaleX + this.scaleY) / 2;
    },
    set: function(val) {
      return this.scaleX = this.scaleY = val;
    }
  });

  DisplayObject.defineProperty('left', {
    get: function() {
      var ax, left, w;
      left = this.x - this.pivotX;
      if (((w = this.width) != null) && ((ax = this.anchorX) != null)) {
        left -= ax * w;
      }
      return left;
    },
    set: function(val) {
      var ax, w;
      if (((w = this.width) != null) && ((ax = this.anchorX) != null)) {
        return this.x = val + this.pivotX + w * ax;
      } else {
        return this.x = val + this.pivotX;
      }
    }
  });

  DisplayObject.defineProperty('right', {
    get: function() {
      var w;
      if ((w = this.width)) {
        return this.left + w;
      } else {
        return this.left;
      }
    },
    set: function(val) {
      var w;
      if ((w = this.width)) {
        return this.left = val - w;
      } else {
        return this.left = val;
      }
    }
  });

  DisplayObject.defineProperty('top', {
    get: function() {
      var ay, h, top;
      top = this.y - this.pivotY;
      if (((h = this.height) != null) && ((ay = this.anchorY) != null)) {
        top -= ay * h;
      }
      return top;
    },
    set: function(val) {
      var ay, h;
      if (((h = this.height) != null) && ((ay = this.anchorY) != null)) {
        return this.y = val + this.pivotY + h * ay;
      } else {
        return this.y = val + this.pivotY;
      }
    }
  });

  DisplayObject.defineProperty('bottom', {
    get: function() {
      var h;
      if ((h = this.height)) {
        return this.top + h;
      } else {
        return this.top;
      }
    },
    set: function(val) {
      var h;
      if ((h = this.height)) {
        return this.top = val - h;
      } else {
        return this.top = val;
      }
    }
  });


  /**
  Adds a filter to this displayObject
  
  @method addFilter
  @param mask {Graphics} the graphics object to use as a filter
  @private
   */

  DisplayObject.prototype.addFilter = function(mask) {
    var childFirst, childLast, end, nextObject, prevLast, previousObject, start, updateLast;
    if (this.filter) {
      return;
    }
    this.filter = true;
    start = new FilterBlock();
    end = new FilterBlock();
    start.mask = mask;
    end.mask = mask;
    start.first = start.last = this;
    end.first = end.last = this;
    start.open = true;
    childFirst = start;
    childLast = start;
    nextObject = void 0;
    previousObject = void 0;
    previousObject = this.first._iPrev;
    if (previousObject) {
      nextObject = previousObject._iNext;
      childFirst._iPrev = previousObject;
      previousObject._iNext = childFirst;
    } else {
      nextObject = this;
    }
    if (nextObject) {
      nextObject._iPrev = childLast;
      childLast._iNext = nextObject;
    }
    childFirst = end;
    childLast = end;
    nextObject = null;
    previousObject = null;
    previousObject = this.last;
    nextObject = previousObject._iNext;
    if (nextObject) {
      nextObject._iPrev = childLast;
      childLast._iNext = nextObject;
    }
    childFirst._iPrev = previousObject;
    previousObject._iNext = childFirst;
    updateLast = this;
    prevLast = this.last;
    while (updateLast) {
      if (updateLast.last === prevLast) {
        updateLast.last = end;
      }
      updateLast = updateLast.parent;
    }
    this.first = start;
    if (this.__renderGroup) {
      this.__renderGroup.addFilterBlocks(start, end);
    }
    return mask.renderable = false;
  };


  /**
  Removes the filter to this displayObject
  
  @method removeFilter
  @private
   */

  DisplayObject.prototype.removeFilter = function() {
    var lastBlock, mask, nextObject, previousObject, startBlock, tempLast, updateLast;
    if (!this.filter) {
      return;
    }
    this.filter = false;
    startBlock = this.first;
    nextObject = startBlock._iNext;
    previousObject = startBlock._iPrev;
    if (nextObject) {
      nextObject._iPrev = previousObject;
    }
    if (previousObject) {
      previousObject._iNext = nextObject;
    }
    this.first = startBlock._iNext;
    lastBlock = this.last;
    nextObject = lastBlock._iNext;
    previousObject = lastBlock._iPrev;
    if (nextObject) {
      nextObject._iPrev = previousObject;
    }
    previousObject._iNext = nextObject;
    tempLast = lastBlock._iPrev;
    updateLast = this;
    while (updateLast.last === lastBlock) {
      updateLast.last = tempLast;
      updateLast = updateLast.parent;
      if (!updateLast) {
        break;
      }
    }
    mask = startBlock.mask;
    mask.renderable = true;
    if (this.__renderGroup) {
      return this.__renderGroup.removeFilterBlocks(startBlock, lastBlock);
    }
  };


  /**
  Updates the object transform for rendering
  
  @method __updateTransform
  @private
   */

  DisplayObject.prototype.__updateTransform = function() {
    var a00, a01, a02, a10, a11, a12, b00, b01, b02, b10, b11, b12, localTransform, parentTransform, px, py, worldTransform;
    if (this.rotation !== this.rotationCache) {
      this.rotationCache = this.rotation;
      this._sr = Math.sin(this.rotation);
      this._cr = Math.cos(this.rotation);
    }
    localTransform = this.localTransform;
    parentTransform = this.parent.worldTransform;
    worldTransform = this.worldTransform;
    localTransform[0] = this._cr * this.scaleX;
    localTransform[1] = -this._sr * this.scaleY;
    localTransform[3] = this._sr * this.scaleX;
    localTransform[4] = this._cr * this.scaleY;
    px = this.pivotX;
    py = this.pivotY;
    a00 = localTransform[0];
    a01 = localTransform[1];
    a02 = this.x - localTransform[0] * px - py * localTransform[1];
    a10 = localTransform[3];
    a11 = localTransform[4];
    a12 = this.y - localTransform[4] * py - px * localTransform[3];
    b00 = parentTransform[0];
    b01 = parentTransform[1];
    b02 = parentTransform[2];
    b10 = parentTransform[3];
    b11 = parentTransform[4];
    b12 = parentTransform[5];
    localTransform[2] = a02;
    localTransform[5] = a12;
    worldTransform[0] = b00 * a00 + b01 * a10;
    worldTransform[1] = b00 * a01 + b01 * a11;
    worldTransform[2] = b00 * a02 + b01 * a12 + b02;
    worldTransform[3] = b10 * a00 + b11 * a10;
    worldTransform[4] = b10 * a01 + b11 * a11;
    worldTransform[5] = b10 * a02 + b11 * a12 + b12;
    return this.worldAlpha = this.alpha * this.parent.worldAlpha;
  };

  DisplayObject.prototype.getGlobalX = function() {
    this.__updateTransform();
    return this.worldTransform[2];
  };

  DisplayObject.prototype.getGlobalY = function() {
    this.__updateTransform();
    return this.worldTransform[5];
  };

  DisplayObject.prototype.getChildIndex = function() {
    var _ref;
    return (_ref = this.parent) != null ? _ref.children.indexOf(typeof this !== "undefined" && this !== null ? this : NaN) : void 0;
  };

  DisplayObject.prototype.getTreeDepth = function() {
    if (this.parent == null) {
      return 0;
    }
    return 1 + this.parent.getTreeDepth();
  };

  DisplayObject.prototype.isAbove = function(other) {
    var a, b, depth, otherDepth;
    a = this;
    b = other;
    otherDepth = other.getTreeDepth();
    depth = this.getTreeDepth();
    while (true) {
      if (a.parent === b) {
        return true;
      }
      if (b.parent === a) {
        return false;
      }
      if ((a.parent === b.parent) || (a.parent == null) || (b.parent == null)) {
        break;
      }
      if (depth > otherDepth) {
        a = a.parent;
        depth -= 1;
      } else if (otherDepth > depth) {
        b = b.parent;
        otherDepth -= 1;
      } else {
        a = a.parent;
        b = b.parent;
      }
    }
    return a.getChildIndex() > b.getChildIndex();
  };

  DisplayObject.prototype.bringToFront = function() {
    var parent;
    if (!this.parent) {
      return;
    }
    parent = this.parent;
    parent.removeChild(this);
    parent.addChild(this);
    return this;
  };

  return DisplayObject;

})(Module);

module.exports = DisplayObject;


},{"Module":6,"cg":13,"rendering/core/Matrix":60,"rendering/core/Point":61,"rendering/filters/FilterBlock":66}],52:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/**
@author Mat Groves http://matgroves.com/ @Doormat23
 */
var DisplayObject, DisplayObjectContainer,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DisplayObject = require('rendering/DisplayObject');


/**
A DisplayObjectContainer represents a collection of display objects.
It is the base class of all display objects that act as a container for other objects.

@class cg.rendering.DisplayObjectContainer
@extends cg.rendering.DisplayObject
@constructor
 */

DisplayObjectContainer = (function(_super) {
  __extends(DisplayObjectContainer, _super);

  function DisplayObjectContainer() {

    /**
    The of children of this container.
    
    @property children
    @type Array<DisplayObject>
    @final
     */
    this.children = [];
    DisplayObjectContainer.__super__.constructor.apply(this, arguments);
  }

  DisplayObjectContainer.prototype._setVisible = function(value) {
    var before, _ref;
    DisplayObjectContainer.__super__._setVisible.apply(this, arguments);
    before = this.worldVisible;
    return this._setWorldVisible(((_ref = this.parent) != null ? _ref.worldVisible : void 0) && value);
  };

  DisplayObjectContainer.prototype._setWorldVisible = function(value) {
    var child, _i, _len, _ref, _results;
    DisplayObjectContainer.__super__._setWorldVisible.apply(this, arguments);
    _ref = this.children;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      _results.push(child._setWorldVisible(this.worldVisible && child.visible));
    }
    return _results;
  };


  /**
  Adds a child to the container.
  
  @method addChild
  @param child {cg.rendering.DisplayObject} The DisplayObject to add to the container.
   */

  DisplayObjectContainer.prototype.addChild = function(child) {
    var childFirst, childLast, nextObject, prevLast, previousObject, tmpChild, updateLast;
    if (child.parent != null) {
      child.parent.removeChild(child);
    }
    child.parent = this;
    child._setWorldVisible(this.worldVisible && child.visible);
    this.children.push(child);
    if (this.stage) {
      tmpChild = child;
      while (true) {
        tmpChild.stage = this.stage;
        tmpChild = tmpChild._iNext;
        if (!tmpChild) {
          break;
        }
      }
    }
    childFirst = child.first;
    childLast = child.last;
    nextObject = void 0;
    previousObject = void 0;
    if (this.filter) {
      previousObject = this.last._iPrev;
    } else {
      previousObject = this.last;
    }
    nextObject = previousObject._iNext;
    updateLast = this;
    prevLast = previousObject;
    while (updateLast) {
      if (updateLast.last === prevLast) {
        updateLast.last = child.last;
      }
      updateLast = updateLast.parent;
    }
    if (nextObject) {
      nextObject._iPrev = childLast;
      childLast._iNext = nextObject;
    }
    childFirst._iPrev = previousObject;
    previousObject._iNext = childFirst;
    if (this.__renderGroup) {
      if (child.__renderGroup) {
        child.__renderGroup.removeDisplayObjectAndChildren(child);
      }
      this.__renderGroup.addDisplayObjectAndChildren(child);
    }
    if (typeof child.emit === "function") {
      child.emit('enter');
    }
    if (typeof child.enter === "function") {
      child.enter();
    }
    if (child.isScene) {
      child.preload();
    }
    return child;
  };


  /**
  Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown
  
  @method addChildAt
  @param child {cg.rendering.DisplayObject} The child to add.
  @param index {Number} The index to place the child in.
   */

  DisplayObjectContainer.prototype.addChildAt = function(child, index) {
    var childFirst, childLast, nextObject, prevLast, previousObject, tmpChild, updateLast;
    if (index >= 0 && index <= this.children.length) {
      if (child.parent != null) {
        child.parent.removeChild(child);
      }
      child.parent = this;
      child._setWorldVisible(this.worldVisible && child.visible);
      if (this.stage) {
        tmpChild = child;
        while (true) {
          tmpChild.stage = this.stage;
          tmpChild = tmpChild._iNext;
          if (!tmpChild) {
            break;
          }
        }
      }
      childFirst = child.first;
      childLast = child.last;
      nextObject = void 0;
      previousObject = void 0;
      if (index === this.children.length) {
        previousObject = this.last;
        updateLast = this;
        prevLast = this.last;
        while (updateLast) {
          if (updateLast.last === prevLast) {
            updateLast.last = child.last;
          }
          updateLast = updateLast.parent;
        }
      } else if (index === 0) {
        previousObject = this;
      } else {
        previousObject = this.children[index - 1].last;
      }
      nextObject = previousObject._iNext;
      if (nextObject) {
        nextObject._iPrev = childLast;
        childLast._iNext = nextObject;
      }
      childFirst._iPrev = previousObject;
      previousObject._iNext = childFirst;
      this.children.splice(index, 0, child);
      if (this.__renderGroup) {
        if (child.__renderGroup) {
          child.__renderGroup.removeDisplayObjectAndChildren(child);
        }
        return this.__renderGroup.addDisplayObjectAndChildren(child);
      }
    } else {
      throw new Error(child + " The index " + index + " supplied is out of bounds " + this.children.length);
    }
  };


  /**
  Swaps the draw-order of two immediate children.
  
  @method swapChildren
  @param child {cg.rendering.DisplayObject}
  @param child2 {cg.rendering.DisplayObject}
   */

  DisplayObjectContainer.prototype.swapChildren = function(child, child2) {
    var idx1, idx2;
    if (child === child2) {
      return;
    }
    idx1 = this.children.indexOf(child);
    idx2 = this.children.indexOf(child2);
    if (idx1 < 0 || idx2 < 0) {
      throw new Error('swapChildren: Both the supplied DisplayObjects must be a child of the caller.');
    }
    this.removeChild(child);
    this.removeChild(child2);
    if (idx1 < idx2) {
      this.addChildAt(child2, idx1);
      this.addChildAt(child, idx2);
    } else {
      this.addChildAt(child, idx2);
      this.addChildAt(child2, idx1);
    }
  };


  /**
  Returns the Child at the specified index
  
  @method getChildAt
  @param index {Number} The index to get the child from.
  @return {cg.rendering.DisplayObject} The child at the specified index.
   */

  DisplayObjectContainer.prototype.getChildAt = function(index) {
    if (index >= 0 && index < this.children.length) {
      return this.children[index];
    } else {
      throw new Error(child + " Both the supplied DisplayObjects must be a child of the caller " + this);
    }
  };


  /**
  Removes a child from the container.
  
  @method removeChild
  @param child {cg.rendering.DisplayObject} The DisplayObject to remove.
   */

  DisplayObjectContainer.prototype.removeChild = function(child) {
    var childFirst, childLast, index, nextObject, previousObject, tempLast, tmpChild, updateLast;
    index = this.children.indexOf(child);
    if (index !== -1) {
      childFirst = child.first;
      childLast = child.last;
      nextObject = childLast._iNext;
      previousObject = childFirst._iPrev;
      if (nextObject) {
        nextObject._iPrev = previousObject;
      }
      previousObject._iNext = nextObject;
      if (this.last === childLast) {
        tempLast = childFirst._iPrev;
        updateLast = this;
        while (updateLast.last === childLast.last) {
          updateLast.last = tempLast;
          updateLast = updateLast.parent;
          if (!updateLast) {
            break;
          }
        }
      }
      childLast._iNext = null;
      childFirst._iPrev = null;
      if (this.stage) {
        tmpChild = child;
        while (true) {
          tmpChild.stage = null;
          tmpChild = tmpChild._iNext;
          if (!tmpChild) {
            break;
          }
        }
      }
      if (child.__renderGroup) {
        child.__renderGroup.removeDisplayObjectAndChildren(child);
      }
      child.parent = void 0;
      this.children.splice(index, 1);
      if (typeof child.emit === "function") {
        child.emit('leave');
      }
      return typeof child.leave === "function" ? child.leave() : void 0;
    } else {
      throw new Error(child + " The supplied DisplayObject must be a child of the caller " + this);
    }
  };


  /**
  Removes all children from the container.
  @method clearChildren
   */

  DisplayObjectContainer.prototype.clearChildren = function() {
    var child, children, _i, _len;
    children = this.children.slice(0);
    for (_i = 0, _len = children.length; _i < _len; _i++) {
      child = children[_i];
      this.removeChild(child);
    }
    return this.children = [];
  };


  /**    
  Updates the container's children's transform for rendering
  
  @method __updateTransform
  @private
   */

  DisplayObjectContainer.prototype.__updateTransform = function() {
    var i, j, _results;
    if (!this.visible) {
      return;
    }
    DisplayObjectContainer.__super__.__updateTransform.apply(this, arguments);
    i = 0;
    j = this.children.length;
    _results = [];
    while (i < j) {
      this.children[i].__updateTransform();
      _results.push(i++);
    }
    return _results;
  };

  return DisplayObjectContainer;

})(DisplayObject);

module.exports = DisplayObjectContainer;


},{"rendering/DisplayObject":51}],53:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/**
@author Mat Groves http://matgroves.com/ @Doormat23
 */
var DisplayObjectContainer, Graphics, RenderTypes,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DisplayObjectContainer = require('rendering/DisplayObjectContainer');

RenderTypes = require('rendering/core/RenderTypes');


/**
The Graphics class contains a set of methods that you can use to create primitive shapes and lines.
It is important to know that with the webGL renderer only simple polys can be filled at this stage
Complex polys will not be filled. Heres an example of a complex poly: http://www.goodboydigital.com/wp-content/uploads/2013/06/complexPolygon.png

@class cg.rendering.Graphics
@extends cg.rendering.DisplayObjectContainer
@constructor
 */

Graphics = (function(_super) {
  __extends(Graphics, _super);

  Graphics.prototype.__renderType = RenderTypes.GRAPHICS;

  Graphics.POLY = 0;

  Graphics.RECT = 1;

  Graphics.CIRC = 2;

  Graphics.ELIP = 3;

  function Graphics() {
    Graphics.__super__.constructor.apply(this, arguments);
    this.renderable = true;

    /**
    The alpha of the fill of this graphics object
    
    @property fillAlpha
    @type Number
     */
    this.fillAlpha = 1;

    /**
    The width of any lines drawn
    
    @property lineWidth
    @type Number
     */
    this.lineWidth = 0;

    /**
    The color of any lines drawn
    
    @property lineColor
    @type String
     */
    this.lineColor = 'black';

    /**
    Graphics data
    
    @property graphicsData
    @type Array
    @private
     */
    this.graphicsData = [];

    /**
    Current path
    
    @property currentPath
    @type Object
    @private
     */
    this.currentPath = {
      points: []
    };
  }


  /**
  Specifies a line style used for subsequent calls to Graphics methods such as the lineTo() method or the drawCircle() method.
  
  @method lineStyle
  @param lineWidth {Number} width of the line to draw, will update the object's stored style
  @param color {Number} color of the line to draw, will update the object's stored style
  @param alpha {Number} alpha of the line to draw, will update the object's stored style
   */

  Graphics.prototype.lineStyle = function(lineWidth, color, alpha) {
    if (this.currentPath.points.length === 0) {
      this.graphicsData.pop();
    }
    this.lineWidth = lineWidth || 0;
    this.lineColor = color || 0;
    this.lineAlpha = (alpha === undefined ? 1 : alpha);
    this.currentPath = {
      lineWidth: this.lineWidth,
      lineColor: this.lineColor,
      lineAlpha: this.lineAlpha,
      fillColor: this.fillColor,
      fillAlpha: this.fillAlpha,
      fill: this.filling,
      points: [],
      type: Graphics.POLY
    };
    return this.graphicsData.push(this.currentPath);
  };


  /**
  Moves the current drawing position to (x, y).
  
  @method moveTo
  @param x {Number} the X coord to move to
  @param y {Number} the Y coord to move to
   */

  Graphics.prototype.moveTo = function(x, y) {
    if (this.currentPath.points.length === 0) {
      this.graphicsData.pop();
    }
    this.currentPath = this.currentPath = {
      lineWidth: this.lineWidth,
      lineColor: this.lineColor,
      lineAlpha: this.lineAlpha,
      fillColor: this.fillColor,
      fillAlpha: this.fillAlpha,
      fill: this.filling,
      points: [],
      type: Graphics.POLY
    };
    this.currentPath.points.push(x, y);
    return this.graphicsData.push(this.currentPath);
  };


  /**
  Draws a line using the current line style from the current drawing position to (x, y);
  the current drawing position is then set to (x, y).
  
  @method lineTo
  @param x {Number} the X coord to draw to
  @param y {Number} the Y coord to draw to
   */

  Graphics.prototype.lineTo = function(x, y) {
    this.currentPath.points.push(x, y);
    return this.dirty = true;
  };


  /**
  Specifies a simple one-color fill that subsequent calls to other Graphics methods
  (such as lineTo() or drawCircle()) use when drawing.
  
  @method beginFill
  @param color {uint} the color of the fill
  @param alpha {Number} the alpha
   */

  Graphics.prototype.beginFill = function(color, alpha) {
    this.filling = true;
    this.fillColor = color || 0;
    return this.fillAlpha = alpha != null ? alpha : 1;
  };


  /**
  Applies a fill to the lines and shapes that were added since the last call to the beginFill() method.
  
  @method endFill
   */

  Graphics.prototype.endFill = function() {
    this.filling = false;
    this.fillColor = null;
    return this.fillAlpha = 1;
  };


  /**
  @method drawRect
  
  @param x {Number} The X coord of the top-left of the rectangle
  @param y {Number} The Y coord of the top-left of the rectangle
  @param width {Number} The width of the rectangle
  @param height {Number} The height of the rectangle
   */

  Graphics.prototype.drawRect = function(x, y, width, height) {
    if (this.currentPath.points.length === 0) {
      this.graphicsData.pop();
    }
    this.currentPath = {
      lineWidth: this.lineWidth,
      lineColor: this.lineColor,
      lineAlpha: this.lineAlpha,
      fillColor: this.fillColor,
      fillAlpha: this.fillAlpha,
      fill: this.filling,
      points: [x, y, width, height],
      type: Graphics.RECT
    };
    this.graphicsData.push(this.currentPath);
    return this.dirty = true;
  };


  /**
  Draws a circle.
  
  @method drawCircle
  @param x {Number} The X coord of the center of the circle
  @param y {Number} The Y coord of the center of the circle
  @param radius {Number} The radius of the circle
   */

  Graphics.prototype.drawCircle = function(x, y, radius) {
    if (this.currentPath.points.length === 0) {
      this.graphicsData.pop();
    }
    this.currentPath = {
      lineWidth: this.lineWidth,
      lineColor: this.lineColor,
      lineAlpha: this.lineAlpha,
      fillColor: this.fillColor,
      fillAlpha: this.fillAlpha,
      fill: this.filling,
      points: [x, y, radius, radius],
      type: Graphics.CIRC
    };
    this.graphicsData.push(this.currentPath);
    return this.dirty = true;
  };


  /**
  Draws an elipse.
  
  @method drawElipse
  @param x {Number}
  @param y {Number}
  @param width {Number}
  @param height {Number}
   */

  Graphics.prototype.drawElipse = function(x, y, width, height) {
    if (this.currentPath.points.length === 0) {
      this.graphicsData.pop();
    }
    this.currentPath = {
      lineWidth: this.lineWidth,
      lineColor: this.lineColor,
      lineAlpha: this.lineAlpha,
      fillColor: this.fillColor,
      fillAlpha: this.fillAlpha,
      fill: this.filling,
      points: [x, y, width, height],
      type: Graphics.ELIP
    };
    this.graphicsData.push(this.currentPath);
    return this.dirty = true;
  };


  /**
  Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
  
  @method clear
   */

  Graphics.prototype.clear = function() {
    this.lineWidth = 0;
    this.filling = false;
    this.dirty = true;
    this.clearDirty = true;
    return this.graphicsData = [];
  };

  return Graphics;

})(DisplayObjectContainer);

module.exports = Graphics;


},{"rendering/DisplayObjectContainer":52,"rendering/core/RenderTypes":64}],54:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/**
@author Mat Groves http://matgroves.com/ @Doormat23
 */
var DisplayObjectContainer, Point, RenderTypes, Sprite, Texture, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

DisplayObjectContainer = require('rendering/DisplayObjectContainer');

Point = require('rendering/core/Point');

Texture = require('rendering/textures/Texture');

RenderTypes = require('rendering/core/RenderTypes');


/**
The Sprite object is the base for all textured objects that are rendered to the screen

@class cg.rendering.Sprite
@extends cg.rendering.DisplayObjectContainer
@constructor
@param texture {cg.Texture} The texture for this sprite
@type String
 */

Sprite = (function(_super) {
  __extends(Sprite, _super);

  Sprite.prototype.__renderType = RenderTypes.SPRITE;

  Sprite.blendModes = {
    NORMAL: 0,
    SCREEN: 1
  };

  function Sprite(texture) {
    Sprite.__super__.constructor.apply(this, arguments);

    /**
    The x-component of this `Sprite`'s anchor.
    
    The anchor sets the origin point of this `Sprite`'s texture.
    
    A value of 0 indicates that the texture's left side is aligned with `this.x`, 
    and a value of 1 indicates that the texture's right side is aligned with `this.x`.
    
    A value of 0.5 indicates that the texture is horizontally centered on `this.x`, etc.
    
    @property anchorX
    @type Number
    @default 0
     */
    if (this.anchorX == null) {
      this.anchorX = 0;
    }

    /**
    The y-component of this `Sprite`'s anchor.
    
    The anchor sets the origin point of this `Sprite`'s texture.
    
    A value of 0 indicates that the texture's top is aligned with `this.y`, 
    and a value of 1 indicates that the texture's bottom is aligned with `this.y`.
    
    A value of 0.5 indicates that the texture is vertically centered on `this.y`, etc.
    
    @property anchorY
    @type Number
    @default 0
     */
    if (this.anchorY == null) {
      this.anchorY = 0;
    }

    /**
    The texture that the sprite is using
    
    @property texture
    @type Texture
     */
    this.texture = texture;

    /**
    The blend mode of sprite.
    currently supports Sprite.blendModes.NORMAL and Sprite.blendModes.SCREEN
    
    @property blendMode
    @type Number
     */
    this.blendMode = Sprite.blendModes.NORMAL;
    if (this._width == null) {
      this._width = 10;
    }
    if (this._height == null) {
      this._height = 10;
    }
    if (this.texture != null) {
      if (this.texture.baseTexture.hasLoaded) {
        this._updateFrame = true;
      } else {
        this.onTextureUpdateBind = this.onTextureUpdate.bind(this);
        this.texture.on('update', this.onTextureUpdateBind);
      }
    }
    this.renderable = true;
  }

  Sprite.prototype.__updateTransform = function() {
    var a00, a01, a02, a10, a11, a12, b00, b01, b02, b10, b11, b12, localTransform, offsetX, offsetY, parentTransform, px, py, scaleX, scaleY, worldTransform;
    if (this.rotation !== this.rotationCache) {
      this.rotationCache = this.rotation;
      this._sr = Math.sin(this.rotation);
      this._cr = Math.cos(this.rotation);
    }
    localTransform = this.localTransform;
    parentTransform = this.parent.worldTransform;
    worldTransform = this.worldTransform;
    if (this.flipX) {
      scaleX = -this.scaleX;
      offsetX = this.width * (1 - 2 * this.anchorX);
    } else {
      scaleX = this.scaleX;
      offsetX = 0;
    }
    if (this.flipY) {
      scaleY = -this.scaleY;
      offsetY = this.height * (1 - 2 * this.anchorY);
    } else {
      scaleY = this.scaleY;
      offsetY = 0;
    }
    localTransform[0] = this._cr * scaleX;
    localTransform[1] = -this._sr * scaleY;
    localTransform[3] = this._sr * scaleX;
    localTransform[4] = this._cr * scaleY;
    px = this.pivotX;
    py = this.pivotY;
    a00 = localTransform[0];
    a01 = localTransform[1];
    a02 = this.x - localTransform[0] * px - py * localTransform[1] + offsetX;
    a10 = localTransform[3];
    a11 = localTransform[4];
    a12 = this.y - localTransform[4] * py - px * localTransform[3] + offsetY;
    b00 = parentTransform[0];
    b01 = parentTransform[1];
    b02 = parentTransform[2];
    b10 = parentTransform[3];
    b11 = parentTransform[4];
    b12 = parentTransform[5];
    localTransform[2] = a02;
    localTransform[5] = a12;
    worldTransform[0] = b00 * a00 + b01 * a10;
    worldTransform[1] = b00 * a01 + b01 * a11;
    worldTransform[2] = b00 * a02 + b01 * a12 + b02;
    worldTransform[3] = b10 * a00 + b11 * a10;
    worldTransform[4] = b10 * a01 + b11 * a11;
    worldTransform[5] = b10 * a02 + b11 * a12 + b12;
    return this.worldAlpha = this.alpha * this.parent.worldAlpha;
  };


  /**
  The width of the sprite, setting this will actually modify the scale to acheive the value set
  
  @property width
  @type Number
   */

  Object.defineProperty(Sprite.prototype, 'width', {
    get: function() {
      var _ref;
      if (((_ref = this.texture) != null ? _ref.frame : void 0) != null) {
        return this.scaleX * this.texture.frame.width;
      } else {
        return this._width;
      }
    },
    set: function(value) {
      this._width = value;
      if (this.texture) {
        return this.scaleX = value / this.texture.frame.width;
      }
    }
  });


  /**
  The height of the sprite, setting this will actually modify the scale to acheive the value set
  
  @property height
  @type Number
   */

  Object.defineProperty(Sprite.prototype, 'height', {
    get: function() {
      var _ref;
      if (((_ref = this.texture) != null ? _ref.frame : void 0) != null) {
        return this.scaleY * this.texture.frame.height;
      } else {
        return this._height;
      }
    },
    set: function(value) {
      this._height = value;
      if (this.texture) {
        return this.scaleY = value / this.texture.frame.height;
      }
    }
  });


  /**
  The texture used by this `Sprite`.
  
  @property texture
   */

  Object.defineProperty(Sprite.prototype, 'texture', {
    get: function() {
      return this._texture;
    },
    set: function(texture) {
      var _ref, _ref1;
      if ((typeof texture === 'string') && (((_ref = cg.assets) != null ? _ref.textures : void 0) != null)) {
        texture = cg.assets.textures[texture];
      }
      if (((_ref1 = this._texture) != null ? _ref1.baseTexture : void 0) === (texture != null ? texture.baseTexture : void 0)) {
        this._texture = texture != null ? texture : this.__defaultTexture;
      } else {
        this._texture = texture != null ? texture : this.__defaultTexture;
        if (this.__renderGroup) {
          this.__renderGroup.updateTexture(this);
        }
      }
      return this._updateFrame = true;
    }
  });

  Object.defineProperty(Sprite.prototype, 'flipX', {
    get: function() {
      return !!this._flipX;
    },
    set: function(val) {
      return this._flipX = val;
    }
  });

  Object.defineProperty(Sprite.prototype, 'flipY', {
    get: function() {
      return !!this._flipY;
    },
    set: function(val) {
      return this._flipY = val;
    }
  });


  /**
  When the texture is updated, this event will fire to update the scale and frame
  
  @method onTextureUpdate
  @param event
  @private
   */

  Sprite.prototype.onTextureUpdate = function(event) {
    if (this._width) {
      this.scaleX = this._width / this.texture.frame.width;
    }
    if (this._height) {
      this.scaleY = this._height / this.texture.frame.height;
    }
    return this._updateFrame = true;
  };


  /**
  Helper function that creates a sprite that will contain a texture from the TextureCache based on the frameId
  The frame ids are created when a Texture packer file has been loaded
  
  @method fromFrame
  @static
  @param frameId {String} The frame Id of the texture in the cache
  @return {cg.rendering.Sprite} A new Sprite using a texture from the texture cache matching the frameId
   */

  Sprite.fromFrame = function(frameId) {
    var texture;
    texture = Texture.cache[frameId];
    if (!texture) {
      throw new Error('The frameId \'' + frameId + '\' does not exist in the texture cache ' + this);
    }
    return new Sprite(texture);
  };


  /**
  Helper function that creates a sprite that will contain a texture based on an image url
  If the image is not in the texture cache it will be loaded
  
  @method fromImage
  @static
  @param imageId {String} The image url of the texture
  @return {cg.rendering.Sprite} A new Sprite using a texture from the texture cache matching the image id
   */

  Sprite.fromImage = function(imageId) {
    var texture;
    texture = Texture.fromImage(imageId);
    return new Sprite(texture);
  };

  return Sprite;

})(DisplayObjectContainer);

module.exports = Sprite;


},{"cg":13,"rendering/DisplayObjectContainer":52,"rendering/core/Point":61,"rendering/core/RenderTypes":64,"rendering/textures/Texture":77}],55:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/**
@author Mat Groves http://matgroves.com/ @Doormat23
 */
var DisplayObjectContainer, Matrix, Point, Stage, Texture, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

DisplayObjectContainer = require('rendering/DisplayObjectContainer');

Point = require('rendering/core/Point');

Texture = require('rendering/textures/Texture');

Matrix = require('rendering/core/Matrix');


/**
A Stage represents the root of the display tree. Everything connected to the stage is rendered

@class cg.rendering.Stage
@extends cg.rendering.DisplayObjectContainer
@constructor
@param backgroundColor {Number} The background color of the stage. Hex format is most convenient; eg. `0xFFFFFF` for white.
 */

Stage = (function(_super) {
  __extends(Stage, _super);

  function Stage(backgroundColor) {
    Stage.__super__.constructor.apply(this, arguments);

    /**
    Current transform of the object based on world (parent) factors
    
    @property worldTransform
    @type Mat3
    @final
    @private
     */
    this.worldTransform = Matrix.mat3.create();
    this.dirty = true;
    this.stage = this;
    this.setBackgroundColor(backgroundColor);
    this._setWorldVisible(true);
  }


  /**    
  Updates the object transform for rendering
  
  @method __updateTransform
  @private
   */

  Stage.prototype.__updateTransform = function() {
    var i, j;
    this.worldAlpha = 1;
    i = 0;
    j = this.children.length;
    while (i < j) {
      this.children[i].__updateTransform();
      i++;
    }
    if (this.dirty) {
      return this.dirty = false;
    }
  };


  /**
  Sets the background color for the stage
  
  @method setBackgroundColor
  @param backgroundColor {Number} the color of the background, easiest way to pass this in is in hex format
  like: 0xFFFFFF for white
   */

  Stage.prototype.setBackgroundColor = function(backgroundColor) {
    var hex;
    this.backgroundColor = backgroundColor || 0x000000;
    this.backgroundColorSplit = cg.util.hexToRGB(this.backgroundColor);
    hex = this.backgroundColor.toString(16);
    hex = "000000".substr(0, 6 - hex.length) + hex;
    return this.backgroundColorString = "#" + hex;
  };

  return Stage;

})(DisplayObjectContainer);

module.exports = Stage;


},{"cg":13,"rendering/DisplayObjectContainer":52,"rendering/core/Matrix":60,"rendering/core/Point":61,"rendering/textures/Texture":77}],56:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/**
@author Mat Groves http://matgroves.com/
 */
var DisplayObjectContainer, RenderTypes, Sprite, Strip, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

DisplayObjectContainer = require('rendering/DisplayObjectContainer');

Sprite = require('rendering/Sprite');

RenderTypes = require('rendering/core/RenderTypes');


/**
TODOC

@class cg.rendering.Strip
 */

Strip = (function(_super) {
  __extends(Strip, _super);

  Strip.prototype.__renderType = RenderTypes.STRIP;

  function Strip(texture, width, height) {
    var error;
    Strip.__super__.constructor.apply(this, arguments);
    this.texture = texture;
    this.blendMode = Sprite.blendModes.NORMAL;
    try {
      this.uvs = new cg.util.Float32Array([0, 1, 1, 1, 1, 0, 0, 1]);
      this.verticies = new cg.util.Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]);
      this.colors = new cg.util.Float32Array([1, 1, 1, 1]);
      this.indices = new cg.util.Uint16Array([0, 1, 2, 3]);
    } catch (_error) {
      error = _error;
      this.uvs = [0, 1, 1, 1, 1, 0, 0, 1];
      this.verticies = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.colors = [1, 1, 1, 1];
      this.indices = [0, 1, 2, 3];
    }
    this.width = width;
    this.height = height;
    if (texture.baseTexture.hasLoaded) {
      this.width = this.texture.frame.width;
      this.height = this.texture.frame.height;
      this._updateFrame = true;
    } else {
      this.onTextureUpdateBind = this.onTextureUpdate.bind(this);
      this.texture.on('update', this.onTextureUpdateBind);
    }
    this.renderable = true;
  }


  /**
  The texture used by this `Strip`.
  
  @property texture
   */

  Object.defineProperty(Strip.prototype, 'texture', {
    get: function() {
      return this._texture;
    },
    set: function(texture) {
      this._texture = texture;
      this.width = texture.frame.width;
      this.height = texture.frame.height;
      return this._updateFrame = true;
    }
  });

  Strip.prototype.onTextureUpdate = function(event) {
    return this._updateFrame = true;
  };

  return Strip;

})(DisplayObjectContainer);

module.exports = Strip;


},{"cg":13,"rendering/DisplayObjectContainer":52,"rendering/Sprite":54,"rendering/core/RenderTypes":64}],57:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/**
@author Mat Groves http://matgroves.com/
 */
var DisplayObjectContainer, Point, RenderTypes, Sprite, TilingSprite,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Point = require('rendering/core/Point');

DisplayObjectContainer = require('rendering/DisplayObjectContainer');

Sprite = require('rendering/Sprite');

RenderTypes = require('rendering/core/RenderTypes');


/**
A tiling sprite is a fast way of rendering a tiling image

@class cg.rendering.TilingSprite
@extends cg.rendering.DisplayObjectContainer
@constructor
@param texture {Texture} the texture of the tiling sprite *NOTE*: Dimensions of the *baseTexture* must be a power-of-2! (eg. 32x64, 128x128, etc.)
@param width {Number}  the width of the tiling sprite
@param height {Number} the height of the tiling sprite
 */

TilingSprite = (function(_super) {
  __extends(TilingSprite, _super);

  TilingSprite.prototype.__renderType = RenderTypes.TILINGSPRITE;

  function TilingSprite(texture, width, height) {
    TilingSprite.__super__.constructor.apply(this, arguments);

    /**
    The texture that the sprite is using
    
    @property texture
    @type Texture
     */
    this.texture = texture;

    /**
    The width of the tiling sprite
    
    @property width
    @type Number
     */
    this.width = width;

    /**
    The height of the tiling sprite
    
    @property height
    @type Number
     */
    this.height = height;

    /**
    The scaling of the image that is being tiled
    
    @property tileScale
    @type Point
     */
    this.tileScale = new Point(1, 1);

    /**
    The offset position of the image that is being tiled
    
    @property tilePosition
    @type Point
     */
    this.tilePosition = new Point(0, 0);
    this.renderable = true;
    this.blendMode = Sprite.blendModes.NORMAL;
  }


  /**
  The texture used by this `TilingSprite`.
  
  **NOTE**: Must be a power-of-two image.
  @property texture
   */

  Object.defineProperty(TilingSprite.prototype, 'texture', {
    get: function() {
      return this._texture;
    },
    set: function(texture) {
      this._texture = texture;
      return this._updateFrame = true;
    }
  });


  /**
  When the texture is updated, this event will fire to update the frame
  
  @method onTextureUpdate
  @param event
  @private
   */

  TilingSprite.prototype.onTextureUpdate = function(event) {
    return this._updateFrame = true;
  };

  return TilingSprite;

})(DisplayObjectContainer);

module.exports = TilingSprite;


},{"rendering/DisplayObjectContainer":52,"rendering/Sprite":54,"rendering/core/Point":61,"rendering/core/RenderTypes":64}],58:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/**
@author Chad Engler <chad@pantherdev.com>
 */

/*
The Circle object can be used to specify a hit area for displayobjects

@class Circle
@constructor
@param x {Number} The X coord of the upper-left corner of the framing rectangle of this circle
@param y {Number} The Y coord of the upper-left corner of the framing rectangle of this circle
@param radius {Number} The radius of the circle
 */
var Circle;

Circle = (function() {
  function Circle(x, y, radius) {

    /*
    @property x
    @type Number
    @default 0
     */
    this.x = x || 0;

    /*
    @property y
    @type Number
    @default 0
     */
    this.y = y || 0;

    /*
    @property radius
    @type Number
    @default 0
     */
    this.radius = radius || 0;
  }


  /*
  Creates a clone of this Circle instance
  
  @method clone
  @return {Circle} a copy of the polygon
   */

  Circle.prototype.clone = function() {
    return new Circle(this.x, this.y, this.radius);
  };


  /*
  Checks if the x, and y coords passed to this function are contained within this circle
  
  @method contains
  @param x {Number} The X coord of the point to test
  @param y {Number} The Y coord of the point to test
  @return {Boolean} if the x/y coords are within this polygon
   */

  Circle.prototype.contains = function(x, y) {
    var dx, dy, r2;
    if (this.radius <= 0) {
      return false;
    }
    dx = this.x - x;
    dy = this.y - y;
    r2 = this.radius * this.radius;
    dx *= dx;
    dy *= dy;
    return dx + dy <= r2;
  };

  return Circle;

})();

module.exports = Circle;


},{}],59:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/*
@author Chad Engler <chad@pantherdev.com>
 */

/*
The Ellipse object can be used to specify a hit area for displayobjects

@class Ellipse
@constructor
@param x {Number} The X coord of the upper-left corner of the framing rectangle of this ellipse
@param y {Number} The Y coord of the upper-left corner of the framing rectangle of this ellipse
@param width {Number} The overall height of this ellipse
@param height {Number} The overall width of this ellipse
 */
var Ellipse;

Ellipse = (function() {
  function Ellipse(x, y, width, height) {

    /*
    @property x
    @type Number
    @default 0
     */
    this.x = x || 0;

    /*
    @property y
    @type Number
    @default 0
     */
    this.y = y || 0;

    /*
    @property width
    @type Number
    @default 0
     */
    this.width = width || 0;

    /*
    @property height
    @type Number
    @default 0
     */
    this.height = height || 0;
  }


  /*
  Creates a clone of this Ellipse instance
  
  @method clone
  @return {Ellipse} a copy of the ellipse
   */

  Ellipse.prototype.clone = function() {
    return new Ellipse(this.x, this.y, this.width, this.height);
  };


  /*
  Checks if the x, and y coords passed to this function are contained within this ellipse
  
  @method contains
  @param x {Number} The X coord of the point to test
  @param y {Number} The Y coord of the point to test
  @return {Boolean} if the x/y coords are within this ellipse
   */

  Ellipse.prototype.contains = function(x, y) {
    var normx, normy;
    if (this.width <= 0 || this.height <= 0) {
      return false;
    }
    normx = ((x - this.x) / this.width) - 0.5;
    normy = ((y - this.y) / this.height) - 0.5;
    normx *= normx;
    normy *= normy;
    return normx + normy < 0.25;
  };

  Ellipse.getBounds = function() {
    return new Rectangle(this.x, this.y, this.width, this.height);
  };

  return Ellipse;

})();

module.exports = Ellipse;


},{}],60:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */
var Matrix;

Matrix = {};

Matrix.Matrix = (typeof Float32Array !== "undefined" ? Float32Array : Array);

Matrix.mat3 = {};

Matrix.mat3.create = function() {
  var matrix;
  matrix = new Matrix.Matrix(9);
  matrix[0] = 1;
  matrix[1] = 0;
  matrix[2] = 0;
  matrix[3] = 0;
  matrix[4] = 1;
  matrix[5] = 0;
  matrix[6] = 0;
  matrix[7] = 0;
  matrix[8] = 1;
  return matrix;
};

Matrix.mat3.identity = function(matrix) {
  matrix[0] = 1;
  matrix[1] = 0;
  matrix[2] = 0;
  matrix[3] = 0;
  matrix[4] = 1;
  matrix[5] = 0;
  matrix[6] = 0;
  matrix[7] = 0;
  matrix[8] = 1;
  return matrix;
};

Matrix.mat4 = {};

Matrix.mat4.create = function() {
  var matrix;
  matrix = new Matrix.Matrix(16);
  matrix[0] = 1;
  matrix[1] = 0;
  matrix[2] = 0;
  matrix[3] = 0;
  matrix[4] = 0;
  matrix[5] = 1;
  matrix[6] = 0;
  matrix[7] = 0;
  matrix[8] = 0;
  matrix[9] = 0;
  matrix[10] = 1;
  matrix[11] = 0;
  matrix[12] = 0;
  matrix[13] = 0;
  matrix[14] = 0;
  matrix[15] = 1;
  return matrix;
};

Matrix.mat3.multiply = function(mat, mat2, dest) {
  var a00, a01, a02, a10, a11, a12, a20, a21, a22, b00, b01, b02, b10, b11, b12, b20, b21, b22;
  if (!dest) {
    dest = mat;
  }
  a00 = mat[0];
  a01 = mat[1];
  a02 = mat[2];
  a10 = mat[3];
  a11 = mat[4];
  a12 = mat[5];
  a20 = mat[6];
  a21 = mat[7];
  a22 = mat[8];
  b00 = mat2[0];
  b01 = mat2[1];
  b02 = mat2[2];
  b10 = mat2[3];
  b11 = mat2[4];
  b12 = mat2[5];
  b20 = mat2[6];
  b21 = mat2[7];
  b22 = mat2[8];
  dest[0] = b00 * a00 + b01 * a10 + b02 * a20;
  dest[1] = b00 * a01 + b01 * a11 + b02 * a21;
  dest[2] = b00 * a02 + b01 * a12 + b02 * a22;
  dest[3] = b10 * a00 + b11 * a10 + b12 * a20;
  dest[4] = b10 * a01 + b11 * a11 + b12 * a21;
  dest[5] = b10 * a02 + b11 * a12 + b12 * a22;
  dest[6] = b20 * a00 + b21 * a10 + b22 * a20;
  dest[7] = b20 * a01 + b21 * a11 + b22 * a21;
  dest[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return dest;
};

Matrix.mat3.clone = function(mat) {
  var matrix;
  matrix = new Matrix.Matrix(9);
  matrix[0] = mat[0];
  matrix[1] = mat[1];
  matrix[2] = mat[2];
  matrix[3] = mat[3];
  matrix[4] = mat[4];
  matrix[5] = mat[5];
  matrix[6] = mat[6];
  matrix[7] = mat[7];
  matrix[8] = mat[8];
  return matrix;
};

Matrix.mat3.transpose = function(mat, dest) {
  var a01, a02, a12;
  if (!dest || mat === dest) {
    a01 = mat[1];
    a02 = mat[2];
    a12 = mat[5];
    mat[1] = mat[3];
    mat[2] = mat[6];
    mat[3] = a01;
    mat[5] = mat[7];
    mat[6] = a02;
    mat[7] = a12;
    return mat;
  }
  dest[0] = mat[0];
  dest[1] = mat[3];
  dest[2] = mat[6];
  dest[3] = mat[1];
  dest[4] = mat[4];
  dest[5] = mat[7];
  dest[6] = mat[2];
  dest[7] = mat[5];
  dest[8] = mat[8];
  return dest;
};

Matrix.mat3.toMat4 = function(mat, dest) {
  if (!dest) {
    dest = Matrix.mat4.create();
  }
  dest[15] = 1;
  dest[14] = 0;
  dest[13] = 0;
  dest[12] = 0;
  dest[11] = 0;
  dest[10] = mat[8];
  dest[9] = mat[7];
  dest[8] = mat[6];
  dest[7] = 0;
  dest[6] = mat[5];
  dest[5] = mat[4];
  dest[4] = mat[3];
  dest[3] = 0;
  dest[2] = mat[2];
  dest[1] = mat[1];
  dest[0] = mat[0];
  return dest;
};

Matrix.mat4.create = function() {
  var matrix;
  matrix = new Matrix.Matrix(16);
  matrix[0] = 1;
  matrix[1] = 0;
  matrix[2] = 0;
  matrix[3] = 0;
  matrix[4] = 0;
  matrix[5] = 1;
  matrix[6] = 0;
  matrix[7] = 0;
  matrix[8] = 0;
  matrix[9] = 0;
  matrix[10] = 1;
  matrix[11] = 0;
  matrix[12] = 0;
  matrix[13] = 0;
  matrix[14] = 0;
  matrix[15] = 1;
  return matrix;
};

Matrix.mat4.transpose = function(mat, dest) {
  var a01, a02, a03, a12, a13, a23;
  if (!dest || mat === dest) {
    a01 = mat[1];
    a02 = mat[2];
    a03 = mat[3];
    a12 = mat[6];
    a13 = mat[7];
    a23 = mat[11];
    mat[1] = mat[4];
    mat[2] = mat[8];
    mat[3] = mat[12];
    mat[4] = a01;
    mat[6] = mat[9];
    mat[7] = mat[13];
    mat[8] = a02;
    mat[9] = a12;
    mat[11] = mat[14];
    mat[12] = a03;
    mat[13] = a13;
    mat[14] = a23;
    return mat;
  }
  dest[0] = mat[0];
  dest[1] = mat[4];
  dest[2] = mat[8];
  dest[3] = mat[12];
  dest[4] = mat[1];
  dest[5] = mat[5];
  dest[6] = mat[9];
  dest[7] = mat[13];
  dest[8] = mat[2];
  dest[9] = mat[6];
  dest[10] = mat[10];
  dest[11] = mat[14];
  dest[12] = mat[3];
  dest[13] = mat[7];
  dest[14] = mat[11];
  dest[15] = mat[15];
  return dest;
};

Matrix.mat4.multiply = function(mat, mat2, dest) {
  var a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33, b0, b1, b2, b3;
  if (!dest) {
    dest = mat;
  }
  a00 = mat[0];
  a01 = mat[1];
  a02 = mat[2];
  a03 = mat[3];
  a10 = mat[4];
  a11 = mat[5];
  a12 = mat[6];
  a13 = mat[7];
  a20 = mat[8];
  a21 = mat[9];
  a22 = mat[10];
  a23 = mat[11];
  a30 = mat[12];
  a31 = mat[13];
  a32 = mat[14];
  a33 = mat[15];
  b0 = mat2[0];
  b1 = mat2[1];
  b2 = mat2[2];
  b3 = mat2[3];
  dest[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  dest[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  dest[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  dest[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = mat2[4];
  b1 = mat2[5];
  b2 = mat2[6];
  b3 = mat2[7];
  dest[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  dest[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  dest[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  dest[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = mat2[8];
  b1 = mat2[9];
  b2 = mat2[10];
  b3 = mat2[11];
  dest[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  dest[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  dest[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  dest[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = mat2[12];
  b1 = mat2[13];
  b2 = mat2[14];
  b3 = mat2[15];
  dest[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  dest[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  dest[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  dest[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return dest;
};

module.exports = Matrix;


},{}],61:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/*
@author Mat Groves http://matgroves.com/ @Doormat23
 */

/*
The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal axis and y represents the vertical axis.

@class Point
@constructor
@param x {Number} position of the point
@param y {Number} position of the point
 */
var Point;

Point = (function() {
  function Point(x, y) {

    /*
    @property x
    @type Number
    @default 0
     */
    this.x = x || 0;

    /*
    @property y
    @type Number
    @default 0
     */
    this.y = y || 0;
  }


  /*
  Creates a clone of this point
  
  @method clone
  @return {Point} a copy of the point
   */

  Point.prototype.clone = function() {
    return new Point(this.x, this.y);
  };

  return Point;

})();

module.exports = Point;


},{}],62:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/*
@author Adrien Brault <adrien.brault@gmail.com>
 */
var Point, Polygon;

Point = require('rendering/core/Point');


/*
@class Polygon
@constructor
@param points* {Array<Point>|Array<Number>|Point...|Number...} This can be an array of Points that form the polygon,
a flat array of numbers that will be interpreted as [x,y, x,y, ...], or the arguments passed can be
all the points of the polygon e.g. `new Polygon(new Point(), new Point(), ...)`, or the
arguments passed can be flat x,y values e.g. `new Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are
Numbers.
 */

Polygon = (function() {
  function Polygon(points) {
    var i, il, p;
    if (!(points instanceof Array)) {
      points = Array.prototype.slice.call(arguments);
    }
    if (typeof points[0] === "number") {
      p = [];
      i = 0;
      il = points.length;
      while (i < il) {
        p.push(new Point(points[i], points[i + 1]));
        i += 2;
      }
      points = p;
    }

    /*
    @property points {Array<Point>}
     */
    this.points = points;
  }


  /*
  Creates a clone of this polygon
  
  @method clone
  @return {Polygon} a copy of the polygon
   */

  Polygon.prototype.clone = function() {
    var i, points;
    points = [];
    i = 0;
    while (i < this.points.length) {
      points.push(this.points[i].clone());
      i++;
    }
    return new Polygon(points);
  };


  /*
  Checks if the x, and y coords passed to this function are contained within this polygon
  
  @method contains
  @param x {Number} The X coord of the point to test
  @param y {Number} The Y coord of the point to test
  @return {Boolean} if the x/y coords are within this polygon
   */

  Polygon.prototype.contains = function(x, y) {
    var i, inside, intersect, j, xi, xj, yi, yj;
    inside = false;
    i = 0;
    j = this.points.length - 1;
    while (i < this.points.length) {
      xi = this.points[i].x;
      yi = this.points[i].y;
      xj = this.points[j].x;
      yj = this.points[j].y;
      intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) {
        inside = !inside;
      }
      j = i++;
    }
    return inside;
  };

  return Polygon;

})();

module.exports = Polygon;


},{"rendering/core/Point":61}],63:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/*
@author Mat Groves http://matgroves.com/
 */

/*
the Rectangle object is an area defined by its position, as indicated by its top-left corner point (x, y) and by its width and its height.
@class Rectangle
@constructor
@param x {Number} The X coord of the upper-left corner of the rectangle
@param y {Number} The Y coord of the upper-left corner of the rectangle
@param width {Number} The overall wisth of this rectangle
@param height {Number} The overall height of this rectangle
 */
var Rectangle;

Rectangle = (function() {
  function Rectangle(x, y, width, height) {

    /*
    @property x
    @type Number
    @default 0
     */
    this.x = x || 0;

    /*
    @property y
    @type Number
    @default 0
     */
    this.y = y || 0;

    /*
    @property width
    @type Number
    @default 0
     */
    this.width = width || 0;

    /*
    @property height
    @type Number
    @default 0
     */
    this.height = height || 0;
  }


  /*
  Creates a clone of this Rectangle
  
  @method clone
  @return {Rectangle} a copy of the rectangle
   */

  Rectangle.prototype.clone = function() {
    return new Rectangle(this.x, this.y, this.width, this.height);
  };


  /*
  Checks if the x, and y coords passed to this function are contained within this Rectangle
  
  @method contains
  @param x {Number} The X coord of the point to test
  @param y {Number} The Y coord of the point to test
  @return {Boolean} if the x/y coords are within this Rectangle
   */

  Rectangle.prototype.contains = function(x, y) {
    var x1, y1;
    if (this.width <= 0 || this.height <= 0) {
      return false;
    }
    x1 = this.x;
    if (x >= x1 && x <= x1 + this.width) {
      y1 = this.y;
      if (y >= y1 && y <= y1 + this.height) {
        return true;
      }
    }
    return false;
  };

  return Rectangle;

})();

module.exports = Rectangle;


},{}],64:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */
module.exports = {
  SPRITE: 6,
  BATCH: 1,
  TILINGSPRITE: 2,
  STRIP: 3,
  GRAPHICS: 4,
  FILTERBLOCK: 5,
  CUSTOMRENDERABLE: -1
};


},{}],65:[function(require,module,exports){
var Circle, Ellipse, Matrix, Point, Polygon, Rectangle, RenderTypes;

Circle = require('rendering/core/Circle');

Ellipse = require('rendering/core/Ellipse');

Matrix = require('rendering/core/Matrix');

Point = require('rendering/core/Point');

Polygon = require('rendering/core/Polygon');

Rectangle = require('rendering/core/Rectangle');

RenderTypes = require('rendering/core/RenderTypes');

module.exports = {
  Circle: Circle,
  Ellipse: Ellipse,
  Matrix: Matrix,
  Point: Point,
  Polygon: Polygon,
  Rectangle: Rectangle,
  RenderTypes: RenderTypes
};


},{"rendering/core/Circle":58,"rendering/core/Ellipse":59,"rendering/core/Matrix":60,"rendering/core/Point":61,"rendering/core/Polygon":62,"rendering/core/Rectangle":63,"rendering/core/RenderTypes":64}],66:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/*
@author Mat Groves http://matgroves.com/ @Doormat23
 */
var FilterBlock, Module, RenderTypes,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Module = require('Module');

RenderTypes = require('rendering/core/RenderTypes');

FilterBlock = (function(_super) {
  __extends(FilterBlock, _super);

  function FilterBlock(mask) {
    this.graphics = mask;
    this.visible = true;
    this.renderable = true;
  }

  return FilterBlock;

})(Module);

FilterBlock.prototype.__renderType = RenderTypes.FILTERBLOCK;

module.exports = FilterBlock;


},{"Module":6,"rendering/core/RenderTypes":64}],67:[function(require,module,exports){
var CustomRenderable, DisplayObject, DisplayObjectContainer, Graphics, Sprite, Stage, Strip, TilingSprite, core;

CustomRenderable = require('rendering/CustomRenderable');

DisplayObject = require('rendering/DisplayObject');

DisplayObjectContainer = require('rendering/DisplayObjectContainer');

Graphics = require('rendering/Graphics');

Sprite = require('rendering/Sprite');

Stage = require('rendering/Stage');

Strip = require('rendering/Strip');

TilingSprite = require('rendering/TilingSprite');

core = require('rendering/core/index');

module.exports = {
  CustomRenderable: CustomRenderable,
  DisplayObject: DisplayObject,
  DisplayObjectContainer: DisplayObjectContainer,
  Graphics: Graphics,
  Sprite: Sprite,
  Stage: Stage,
  Strip: Strip,
  TilingSprite: TilingSprite,
  core: core
};


},{"rendering/CustomRenderable":50,"rendering/DisplayObject":51,"rendering/DisplayObjectContainer":52,"rendering/Graphics":53,"rendering/Sprite":54,"rendering/Stage":55,"rendering/Strip":56,"rendering/TilingSprite":57,"rendering/core/index":65}],68:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/*
@author Mat Groves http://matgroves.com/ @Doormat23
 */
var CanvasGraphics, Graphics;

Graphics = require('rendering/Graphics');


/*
A set of functions used by the canvas renderer to draw the primitive graphics data

@class CanvasGraphics
 */

CanvasGraphics = (function() {
  function CanvasGraphics() {}


  /*
  Renders the graphics object
  
  @static
  @private
  @method renderGraphics
  @param graphics {Graphics}
  @param context {Context2D}
   */

  CanvasGraphics.renderGraphics = function(graphics, context) {
    var color, data, elipseData, h, i, j, kappa, ox, oy, points, w, worldAlpha, x, xe, xm, y, ye, ym, _results;
    worldAlpha = graphics.worldAlpha;
    i = 0;
    _results = [];
    while (i < graphics.graphicsData.length) {
      data = graphics.graphicsData[i];
      points = data.points;
      context.strokeStyle = color = "#" + ("00000" + (data.lineColor | 0).toString(16)).substr(-6);
      context.lineWidth = data.lineWidth;
      if (data.type === Graphics.POLY) {
        context.beginPath();
        context.moveTo(points[0], points[1]);
        j = 1;
        while (j < points.length / 2) {
          context.lineTo(points[j * 2], points[j * 2 + 1]);
          j++;
        }
        if (points[0] === points[points.length - 2] && points[1] === points[points.length - 1]) {
          context.closePath();
        }
        if (data.fill) {
          context.globalAlpha = data.fillAlpha * worldAlpha;
          context.fillStyle = color = "#" + ("00000" + (data.fillColor | 0).toString(16)).substr(-6);
          context.fill();
        }
        if (data.lineWidth) {
          context.globalAlpha = data.lineAlpha * worldAlpha;
          context.stroke();
        }
      } else if (data.type === Graphics.RECT) {
        if (data.fillColor || data.fillColor === 0) {
          context.globalAlpha = data.fillAlpha * worldAlpha;
          context.fillStyle = color = "#" + ("00000" + (data.fillColor | 0).toString(16)).substr(-6);
          context.fillRect(points[0], points[1], points[2], points[3]);
        }
        if (data.lineWidth) {
          context.globalAlpha = data.lineAlpha * worldAlpha;
          context.strokeRect(points[0], points[1], points[2], points[3]);
        }
      } else if (data.type === Graphics.CIRC) {
        context.beginPath();
        context.arc(points[0], points[1], points[2], 0, 2 * Math.PI);
        context.closePath();
        if (data.fill) {
          context.globalAlpha = data.fillAlpha * worldAlpha;
          context.fillStyle = color = "#" + ("00000" + (data.fillColor | 0).toString(16)).substr(-6);
          context.fill();
        }
        if (data.lineWidth) {
          context.globalAlpha = data.lineAlpha * worldAlpha;
          context.stroke();
        }
      } else if (data.type === Graphics.ELIP) {
        elipseData = data.points;
        w = elipseData[2] * 2;
        h = elipseData[3] * 2;
        x = elipseData[0] - w / 2;
        y = elipseData[1] - h / 2;
        context.beginPath();
        kappa = .5522848;
        ox = (w / 2) * kappa;
        oy = (h / 2) * kappa;
        xe = x + w;
        ye = y + h;
        xm = x + w / 2;
        ym = y + h / 2;
        context.moveTo(x, ym);
        context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        context.closePath();
        if (data.fill) {
          context.globalAlpha = data.fillAlpha * worldAlpha;
          context.fillStyle = color = "#" + ("00000" + (data.fillColor | 0).toString(16)).substr(-6);
          context.fill();
        }
        if (data.lineWidth) {
          context.globalAlpha = data.lineAlpha * worldAlpha;
          context.stroke();
        }
      }
      _results.push(i++);
    }
    return _results;
  };


  /*    
  Renders a graphics mask
  
  @static
  @private
  @method renderGraphicsMask
  @param graphics {Graphics}
  @param context {Context2D}
   */

  CanvasGraphics.renderGraphicsMask = function(graphics, context) {
    var data, elipseData, h, i, j, kappa, len, ox, oy, points, w, worldAlpha, x, xe, xm, y, ye, ym, _results;
    worldAlpha = graphics.worldAlpha;
    len = graphics.graphicsData.length;
    if (len > 1) {
      len = 1;
      console.log("Pixi.js warning: masks in canvas can only mask using the first path in the graphics object");
    }
    i = 0;
    _results = [];
    while (i < 1) {
      data = graphics.graphicsData[i];
      points = data.points;
      if (data.type === Graphics.POLY) {
        context.beginPath();
        context.moveTo(points[0], points[1]);
        j = 1;
        while (j < points.length / 2) {
          context.lineTo(points[j * 2], points[j * 2 + 1]);
          j++;
        }
        if (points[0] === points[points.length - 2] && points[1] === points[points.length - 1]) {
          context.closePath();
        }
      } else if (data.type === Graphics.RECT) {
        context.beginPath();
        context.rect(points[0], points[1], points[2], points[3]);
        context.closePath();
      } else if (data.type === Graphics.CIRC) {
        context.beginPath();
        context.arc(points[0], points[1], points[2], 0, 2 * Math.PI);
        context.closePath();
      } else if (data.type === Graphics.ELIP) {
        elipseData = data.points;
        w = elipseData[2] * 2;
        h = elipseData[3] * 2;
        x = elipseData[0] - w / 2;
        y = elipseData[1] - h / 2;
        context.beginPath();
        kappa = .5522848;
        ox = (w / 2) * kappa;
        oy = (h / 2) * kappa;
        xe = x + w;
        ye = y + h;
        xm = x + w / 2;
        ym = y + h / 2;
        context.moveTo(x, ym);
        context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        context.closePath();
      }
      _results.push(i++);
    }
    return _results;
  };

  return CanvasGraphics;

})();

module.exports = CanvasGraphics;


},{"rendering/Graphics":53}],69:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/*
@author Mat Groves http://matgroves.com/ @Doormat23
 */
var BaseTexture, CanvasGraphics, CanvasRenderer, RENDERTYPE_BATCH, RENDERTYPE_CUSTOMRENDERABLE, RENDERTYPE_FILTERBLOCK, RENDERTYPE_GRAPHICS, RENDERTYPE_SPRITE, RENDERTYPE_STRIP, RENDERTYPE_TILINGSPRITE, RenderTypes, Texture;

Texture = require('rendering/textures/Texture');

BaseTexture = require('rendering/textures/BaseTexture');

CanvasGraphics = require('rendering/renderers/canvas/CanvasGraphics');

RenderTypes = require('rendering/core/RenderTypes');

RENDERTYPE_SPRITE = RenderTypes.SPRITE;

RENDERTYPE_BATCH = RenderTypes.BATCH;

RENDERTYPE_TILINGSPRITE = RenderTypes.TILINGSPRITE;

RENDERTYPE_STRIP = RenderTypes.STRIP;

RENDERTYPE_GRAPHICS = RenderTypes.GRAPHICS;

RENDERTYPE_FILTERBLOCK = RenderTypes.FILTERBLOCK;

RENDERTYPE_CUSTOMRENDERABLE = RenderTypes.CUSTOMRENDERABLE;


/*
the CanvasRenderer draws the stage and all its content onto a 2d canvas. This renderer should be used for browsers that do not support webGL.
Dont forget to add the view to your DOM or you will not see anything :)

@class CanvasRenderer
@constructor
@param width=0 {Number} the width of the canvas view
@param height=0 {Number} the height of the canvas view
@param view {Canvas} the canvas to use as a view, optional
@param transparent=false {Boolean} the transparency of the render view, default false
 */

CanvasRenderer = (function() {
  function CanvasRenderer(width, height, view, transparent, textureFilter) {
    this.textureFilter = textureFilter != null ? textureFilter : 'linear';
    this.transparent = transparent;

    /*
    The width of the canvas view
    
    @property width
    @type Number
    @default 800
     */
    this.width = width || 800;

    /*
    The height of the canvas view
    
    @property height
    @type Number
    @default 600
     */
    this.height = height || 600;

    /*
    The canvas element that the everything is drawn to
    
    @property view
    @type Canvas
     */
    this.view = view || document.createElement("canvas");

    /*
    The canvas context that the everything is drawn to
    @property context
    @type Canvas 2d Context
     */
    this.context = this.view.getContext("2d");
    this.refresh = true;
    this.view.width = this.width;
    this.view.height = this.height;
    this.count = 0;
  }


  /*
  Renders the stage to its canvas view
  
  @method render
  @param stage {Stage} the Stage element to be rendered
   */

  CanvasRenderer.prototype.render = function(stage) {
    var imageSmoothingEnabled;
    this._updateTextures();
    stage.__updateTransform();
    imageSmoothingEnabled = this.textureFilter === 'nearest';
    this.context.imageSmoothingEnabled = imageSmoothingEnabled;
    this.context.webkitImageSmoothingEnabled = imageSmoothingEnabled;
    this.context.mozImageSmoothingEnabled = imageSmoothingEnabled;
    if (this.view.style.backgroundColor !== stage.backgroundColorString && !this.transparent) {
      this.view.style.backgroundColor = stage.backgroundColorString;
    }
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.width, this.height);
    this.renderDisplayObject(stage);
    if (Texture.frameUpdates.length > 0) {
      return Texture.frameUpdates = [];
    }
  };


  /*
  resizes the canvas view to the specified width and height
  
  @method resize
  @param width {Number} the new width of the canvas view
  @param height {Number} the new height of the canvas view
   */

  CanvasRenderer.prototype.resize = function(width, height, viewportWidth, viewportHeight, viewportX, viewportY) {
    this.width = width;
    this.height = height;
    this.viewportX = viewportX != null ? viewportX : 0;
    this.viewportY = viewportY != null ? viewportY : 0;
    this.viewportWidth = viewportWidth != null ? viewportWidth : this.width;
    this.viewportHeight = viewportHeight != null ? viewportHeight : this.height;
    this.view.width = width;
    this.view.height = height;
    this.view.style.width = width + 'px';
    return this.view.style.height = height + 'px';
  };

  CanvasRenderer.prototype.getView = function() {
    return this.view;
  };


  /*
  Renders a display object
  
  @method renderDisplayObject
  @param displayObject {DisplayObject} The displayObject to render
  @private
   */

  CanvasRenderer.prototype.renderDisplayObject = function(displayObject) {
    var cacheAlpha, context, frame, imageSmoothingEnabled, maskTransform, testObject, transform;
    transform = void 0;
    context = this.context;
    context.globalCompositeOperation = "source-over";
    testObject = displayObject.last._iNext;
    displayObject = displayObject.first;
    while (true) {
      transform = displayObject.worldTransform;
      if (!displayObject.visible) {
        displayObject = displayObject.last._iNext;
        if (displayObject === testObject) {
          break;
        }
        continue;
      }
      if (!displayObject.renderable) {
        displayObject = displayObject._iNext;
        if (displayObject === testObject) {
          break;
        }
        continue;
      }
      switch (displayObject.__renderType) {
        case RENDERTYPE_SPRITE:
          frame = displayObject.texture.frame;
          imageSmoothingEnabled = displayObject.texture.baseTexture.__imageSmoothingEnabled;
          context.imageSmoothingEnabled = imageSmoothingEnabled;
          context.webkitImageSmoothingEnabled = imageSmoothingEnabled;
          context.mozImageSmoothingEnabled = imageSmoothingEnabled;
          if (frame) {
            context.globalAlpha = displayObject.worldAlpha;
            context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5]);
            context.drawImage(displayObject.texture.baseTexture.source, frame.x, frame.y, frame.width, frame.height, displayObject.anchorX * -frame.width, displayObject.anchorY * -frame.height, frame.width, frame.height);
          }
          break;
        case RENDERTYPE_STRIP:
          context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5]);
          this.renderStrip(displayObject);
          break;
        case RENDERTYPE_TILINGSPRITE:
          context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5]);
          this.renderTilingSprite(displayObject);
          break;
        case RENDERTYPE_CUSTOMRENDERABLE:
          displayObject.renderCanvas(this);
          break;
        case RENDERTYPE_GRAPHICS:
          context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5]);
          CanvasGraphics.renderGraphics(displayObject, context);
          break;
        case RENDERTYPE_FILTERBLOCK:
          if (displayObject.open) {
            context.save();
            cacheAlpha = displayObject.mask.alpha;
            maskTransform = displayObject.mask.worldTransform;
            context.setTransform(maskTransform[0], maskTransform[3], maskTransform[1], maskTransform[4], maskTransform[2], maskTransform[5]);
            displayObject.mask.worldAlpha = 0.5;
            context.worldAlpha = 0;
            CanvasGraphics.renderGraphicsMask(displayObject.mask, context);
            context.clip();
            displayObject.mask.worldAlpha = cacheAlpha;
          } else {
            context.restore();
          }
      }
      displayObject = displayObject._iNext;
      if (displayObject === testObject) {
        break;
      }
    }
  };


  /*
  Renders a flat strip
  
  @method renderStripFlat
  @param strip {Strip} The Strip to render
  @private
   */

  CanvasRenderer.prototype.renderStripFlat = function(strip) {
    var context, i, index, length, uvs, verticies, x0, x1, x2, y0, y1, y2;
    context = this.context;
    verticies = strip.verticies;
    uvs = strip.uvs;
    length = verticies.length / 2;
    this.count++;
    context.beginPath();
    i = 1;
    while (i < length - 2) {
      index = i * 2;
      x0 = verticies[index];
      x1 = verticies[index + 2];
      x2 = verticies[index + 4];
      y0 = verticies[index + 1];
      y1 = verticies[index + 3];
      y2 = verticies[index + 5];
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.lineTo(x2, y2);
      i++;
    }
    context.fillStyle = "#FF0000";
    context.fill();
    return context.closePath();
  };


  /*
  Renders a tiling sprite
  
  @method renderTilingSprite
  @param sprite {TilingSprite} The tilingsprite to render
  @private
   */

  CanvasRenderer.prototype.renderTilingSprite = function(sprite) {
    var context, tilePosition, tileScale;
    context = this.context;
    context.globalAlpha = sprite.worldAlpha;
    if (!sprite.__tilePattern) {
      sprite.__tilePattern = context.createPattern(sprite.texture.baseTexture.source, "repeat");
    }
    context.beginPath();
    tilePosition = sprite.tilePosition;
    tileScale = sprite.tileScale;
    context.scale(tileScale.x, tileScale.y);
    context.translate(tilePosition.x, tilePosition.y);
    context.fillStyle = sprite.__tilePattern;
    context.fillRect(-tilePosition.x, -tilePosition.y, sprite.width / tileScale.x, sprite.height / tileScale.y);
    context.scale(1 / tileScale.x, 1 / tileScale.y);
    context.translate(-tilePosition.x, -tilePosition.y);
    return context.closePath();
  };


  /*
  Renders a strip
  
  @method renderStrip
  @param strip {Strip} The Strip to render
  @private
   */

  CanvasRenderer.prototype.renderStrip = function(strip) {
    var context, delta, delta_a, delta_b, delta_c, delta_d, delta_e, delta_f, i, index, length, u0, u1, u2, uvs, v0, v1, v2, verticies, x0, x1, x2, y0, y1, y2;
    context = this.context;
    verticies = strip.verticies;
    uvs = strip.uvs;
    length = verticies.length / 2;
    this.count++;
    i = 1;
    while (i < length - 2) {
      index = i * 2;
      x0 = verticies[index];
      x1 = verticies[index + 2];
      x2 = verticies[index + 4];
      y0 = verticies[index + 1];
      y1 = verticies[index + 3];
      y2 = verticies[index + 5];
      u0 = uvs[index] * strip.texture.width;
      u1 = uvs[index + 2] * strip.texture.width;
      u2 = uvs[index + 4] * strip.texture.width;
      v0 = uvs[index + 1] * strip.texture.height;
      v1 = uvs[index + 3] * strip.texture.height;
      v2 = uvs[index + 5] * strip.texture.height;
      context.save();
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.lineTo(x2, y2);
      context.closePath();
      context.clip();
      delta = u0 * v1 + v0 * u2 + u1 * v2 - v1 * u2 - v0 * u1 - u0 * v2;
      delta_a = x0 * v1 + v0 * x2 + x1 * v2 - v1 * x2 - v0 * x1 - x0 * v2;
      delta_b = u0 * x1 + x0 * u2 + u1 * x2 - x1 * u2 - x0 * u1 - u0 * x2;
      delta_c = u0 * v1 * x2 + v0 * x1 * u2 + x0 * u1 * v2 - x0 * v1 * u2 - v0 * u1 * x2 - u0 * x1 * v2;
      delta_d = y0 * v1 + v0 * y2 + y1 * v2 - v1 * y2 - v0 * y1 - y0 * v2;
      delta_e = u0 * y1 + y0 * u2 + u1 * y2 - y1 * u2 - y0 * u1 - u0 * y2;
      delta_f = u0 * v1 * y2 + v0 * y1 * u2 + y0 * u1 * v2 - y0 * v1 * u2 - v0 * u1 * y2 - u0 * y1 * v2;
      context.transform(delta_a / delta, delta_d / delta, delta_b / delta, delta_e / delta, delta_c / delta, delta_f / delta);
      context.drawImage(strip.texture.baseTexture.source, 0, 0);
      context.restore();
      i++;
    }
  };


  /*
  Updates canvas related texture properties of a given texture
  
  @static
  @method updateTexture
  @param texture {Texture} The texture to update
  @private
   */

  CanvasRenderer.updateTexture = function(texture, defaultFilterMode) {
    var filterMode;
    if (texture.filterMode != null) {
      filterMode = texture.filterMode;
    } else {
      filterMode = defaultFilterMode;
    }
    return texture.__imageSmoothingEnabled = this.__getImageSmoothingEnabled(filterMode);
  };


  /*
  Updates all canvas related texture properties of textures flagged for updating/destruction
  
  @static
  @method _updateTextures
  @private
   */

  CanvasRenderer._updateTextures = function(textureFilter) {
    var i;
    i = 0;
    while (i < BaseTexture.texturesToUpdate.length) {
      this.updateTexture(BaseTexture.texturesToUpdate[i], textureFilter);
      i++;
    }
    i = 0;
    while (i < BaseTexture.texturesToDestroy.length) {
      this.destroyTexture(BaseTexture.texturesToDestroy[i]);
      i++;
    }
    BaseTexture.texturesToUpdate = [];
    return BaseTexture.texturesToDestroy = [];
  };


  /*
  @static
  @method _updateAllTextures
  @private
   */

  CanvasRenderer._updateAllTextures = function(defaultFilter) {
    var tex, _i, _len, _ref, _results;
    _ref = BaseTexture.allTextures;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tex = _ref[_i];
      _results.push(this.updateTexture(tex, defaultFilter));
    }
    return _results;
  };


  /*
  @static
  @method destroyTexture
  @private
   */

  CanvasRenderer.destroyTexture = function(texture) {};


  /*
  @static
  @method __getImageSmoothingEnabled
  @private
   */

  CanvasRenderer.__getImageSmoothingEnabled = function(filterMode) {
    var imageSmoothingEnabled;
    imageSmoothingEnabled = true;
    switch (filterMode) {
      case 'nearest':
        imageSmoothingEnabled = false;
        break;
      case 'linear':
        imageSmoothingEnabled = true;
        break;
      default:
        console.warn('Unexpected value for filterMode: ' + filterMode + '. Defaulting to LINEAR');
        imageSmoothingEnabled = true;
    }
    return imageSmoothingEnabled;
  };

  CanvasRenderer.prototype._updateTextures = function() {
    return CanvasRenderer._updateTextures.apply(CanvasRenderer, arguments);
  };

  CanvasRenderer.prototype._updateAllTextures = function() {
    return CanvasRenderer._updateAllTextures.apply(CanvasRenderer, arguments);
  };

  return CanvasRenderer;

})();

module.exports = CanvasRenderer;


},{"rendering/core/RenderTypes":64,"rendering/renderers/canvas/CanvasGraphics":68,"rendering/textures/BaseTexture":75,"rendering/textures/Texture":77}],70:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/*
@author Mat Groves http://matgroves.com/ @Doormat23
 */
var GLESGraphics, GLESShaders, Graphics, Matrix, Point, PolyK, cg;

cg = require('cg');

Point = require('rendering/core/Point');

Matrix = require('rendering/core/Matrix');

PolyK = require('rendering/utils/PolyK');

Graphics = require('rendering/Graphics');

GLESShaders = require('rendering/renderers/webgl/GLESShaders');


/*
A set of functions used by the webGL renderer to draw the primitive graphics data

@class CanvasGraphics
 */

GLESGraphics = (function() {
  function GLESGraphics() {}


  /*
  Renders the graphics object
  
  @static
  @private
  @method renderGraphics
  @param graphics {Graphics}
  @param projection {Object}
   */

  GLESGraphics.renderGraphics = function(graphics, projection) {
    var gl, m;
    gl = this.gl;
    if (!graphics._GL) {
      graphics._GL = {
        points: [],
        indices: [],
        lastIndex: 0,
        buffer: gl.createBuffer(),
        indexBuffer: gl.createBuffer()
      };
    }
    if (graphics.dirty) {
      graphics.dirty = false;
      if (graphics.clearDirty) {
        graphics.clearDirty = false;
        graphics._GL.lastIndex = 0;
        graphics._GL.points = [];
        graphics._GL.indices = [];
      }
      GLESGraphics.updateGraphics(graphics);
    }
    GLESShaders.activatePrimitiveShader(gl);
    m = Matrix.mat3.clone(graphics.worldTransform);
    Matrix.mat3.transpose(m);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniformMatrix3fv(GLESShaders.primitiveShader.translationMatrix, false, m);
    gl.uniform2f(GLESShaders.primitiveShader.projectionVector, projection.x, projection.y);
    gl.uniform1f(GLESShaders.primitiveShader.alpha, graphics.worldAlpha);
    gl.bindBuffer(gl.ARRAY_BUFFER, graphics._GL.buffer);
    gl.vertexAttribPointer(GLESShaders.defaultShader.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribPointer(GLESShaders.primitiveShader.vertexPositionAttribute, 2, gl.FLOAT, false, 4 * 6, 0);
    gl.vertexAttribPointer(GLESShaders.primitiveShader.colorAttribute, 4, gl.FLOAT, false, 4 * 6, 2 * 4);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, graphics._GL.indexBuffer);
    gl.drawElements(gl.TRIANGLE_STRIP, graphics._GL.indices.length, gl.UNSIGNED_SHORT, 0);
    return GLESShaders.activateDefaultShader(gl);
  };


  /*
  Updates the graphics object
  
  @static
  @private
  @method updateGraphics
  @param graphics {Graphics}
   */

  GLESGraphics.updateGraphics = function(graphics) {
    var data, gl, i;
    i = graphics._GL.lastIndex;
    while (i < graphics.graphicsData.length) {
      data = graphics.graphicsData[i];
      if (data.type === Graphics.POLY) {
        if (data.fill) {
          if (data.points.length > 3) {
            GLESGraphics.buildPoly(data, graphics._GL);
          }
        }
        if (data.lineWidth > 0) {
          GLESGraphics.buildLine(data, graphics._GL);
        }
      } else if (data.type === Graphics.RECT) {
        GLESGraphics.buildRectangle(data, graphics._GL);
      } else {
        if (data.type === Graphics.CIRC || data.type === Graphics.ELIP) {
          GLESGraphics.buildCircle(data, graphics._GL);
        }
      }
      i++;
    }
    graphics._GL.lastIndex = graphics.graphicsData.length;
    gl = this.gl;
    graphics._GL.glPoints = new cg.util.Float32Array(graphics._GL.points);
    gl.bindBuffer(gl.ARRAY_BUFFER, graphics._GL.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, graphics._GL.glPoints, gl.STATIC_DRAW);
    graphics._GL.glIndicies = new cg.util.Uint16Array(graphics._GL.indices);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, graphics._GL.indexBuffer);
    return gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, graphics._GL.glIndicies, gl.STATIC_DRAW);
  };


  /*
  Builds a rectangle to draw
  
  @static
  @private
  @method buildRectangle
  @param graphics {Graphics}
  @param webGLData {Object}
   */

  GLESGraphics.buildRectangle = function(graphicsData, webGLData) {
    var alpha, b, color, g, height, indices, r, rectData, vertPos, verts, width, x, y;
    rectData = graphicsData.points;
    x = rectData[0];
    y = rectData[1];
    width = rectData[2];
    height = rectData[3];
    if (graphicsData.fill) {
      color = cg.util.hexToRGB(graphicsData.fillColor);
      alpha = graphicsData.fillAlpha;
      r = color[0] * alpha;
      g = color[1] * alpha;
      b = color[2] * alpha;
      verts = webGLData.points;
      indices = webGLData.indices;
      vertPos = verts.length / 6;
      verts.push(x, y);
      verts.push(r, g, b, alpha);
      verts.push(x + width, y);
      verts.push(r, g, b, alpha);
      verts.push(x, y + height);
      verts.push(r, g, b, alpha);
      verts.push(x + width, y + height);
      verts.push(r, g, b, alpha);
      indices.push(vertPos, vertPos, vertPos + 1, vertPos + 2, vertPos + 3, vertPos + 3);
    }
    if (graphicsData.lineWidth) {
      graphicsData.points = [x, y, x + width, y, x + width, y + height, x, y + height, x, y];
      return GLESGraphics.buildLine(graphicsData, webGLData);
    }
  };


  /*
  Builds a circle to draw
  
  @static
  @private
  @method buildCircle
  @param graphics {Graphics}
  @param webGLData {Object}
   */

  GLESGraphics.buildCircle = function(graphicsData, webGLData) {
    var alpha, b, color, g, height, i, indices, r, rectData, seg, totalSegs, vecPos, verts, width, x, y;
    rectData = graphicsData.points;
    x = rectData[0];
    y = rectData[1];
    width = rectData[2];
    height = rectData[3];
    totalSegs = 40;
    seg = (Math.PI * 2) / totalSegs;
    if (graphicsData.fill) {
      color = cg.util.hexToRGB(graphicsData.fillColor);
      alpha = graphicsData.fillAlpha;
      r = color[0] * alpha;
      g = color[1] * alpha;
      b = color[2] * alpha;
      verts = webGLData.points;
      indices = webGLData.indices;
      vecPos = verts.length / 6;
      indices.push(vecPos);
      i = 0;
      while (i < totalSegs + 1) {
        verts.push(x, y, r, g, b, alpha);
        verts.push(x + Math.sin(seg * i) * width, y + Math.cos(seg * i) * height, r, g, b, alpha);
        indices.push(vecPos++, vecPos++);
        i++;
      }
      indices.push(vecPos - 1);
    }
    if (graphicsData.lineWidth) {
      graphicsData.points = [];
      i = 0;
      while (i < totalSegs + 1) {
        graphicsData.points.push(x + Math.sin(seg * i) * width, y + Math.cos(seg * i) * height);
        i++;
      }
      return GLESGraphics.buildLine(graphicsData, webGLData);
    }
  };


  /*
  Builds a line to draw
  
  @static
  @private
  @method buildLine
  @param graphics {Graphics}
  @param webGLData {Object}
   */

  GLESGraphics.buildLine = function(graphicsData, webGLData) {
    var a1, a2, alpha, b, b1, b2, c1, c2, color, denom, dist, firstPoint, g, i, indexCount, indexStart, indices, ipx, ipy, lastPoint, length, midPointX, midPointY, p1x, p1y, p2x, p2y, p3x, p3y, pdist, perp2x, perp2y, perp3x, perp3y, perpx, perpy, points, px, py, r, verts, width, wrap;
    wrap = true;
    points = graphicsData.points;
    if (points.length === 0) {
      return;
    }
    firstPoint = new Point(points[0], points[1]);
    lastPoint = new Point(points[points.length - 2], points[points.length - 1]);
    if (firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y) {
      points.pop();
      points.pop();
      lastPoint = new Point(points[points.length - 2], points[points.length - 1]);
      midPointX = lastPoint.x + (firstPoint.x - lastPoint.x) * 0.5;
      midPointY = lastPoint.y + (firstPoint.y - lastPoint.y) * 0.5;
      points.unshift(midPointX, midPointY);
      points.push(midPointX, midPointY);
    }
    verts = webGLData.points;
    indices = webGLData.indices;
    length = points.length / 2;
    indexCount = points.length;
    indexStart = verts.length / 6;
    width = graphicsData.lineWidth / 2;
    color = cg.util.hexToRGB(graphicsData.lineColor);
    alpha = graphicsData.lineAlpha;
    r = color[0] * alpha;
    g = color[1] * alpha;
    b = color[2] * alpha;
    p1x = void 0;
    p1y = void 0;
    p2x = void 0;
    p2y = void 0;
    p3x = void 0;
    p3y = void 0;
    perpx = void 0;
    perpy = void 0;
    perp2x = void 0;
    perp2y = void 0;
    perp3x = void 0;
    perp3y = void 0;
    ipx = void 0;
    ipy = void 0;
    a1 = void 0;
    b1 = void 0;
    c1 = void 0;
    a2 = void 0;
    b2 = void 0;
    c2 = void 0;
    denom = void 0;
    pdist = void 0;
    dist = void 0;
    p1x = points[0];
    p1y = points[1];
    p2x = points[2];
    p2y = points[3];
    perpx = -(p1y - p2y);
    perpy = p1x - p2x;
    dist = Math.sqrt(perpx * perpx + perpy * perpy);
    perpx /= dist;
    perpy /= dist;
    perpx *= width;
    perpy *= width;
    verts.push(p1x - perpx, p1y - perpy, r, g, b, alpha);
    verts.push(p1x + perpx, p1y + perpy, r, g, b, alpha);
    i = 1;
    while (i < length - 1) {
      p1x = points[(i - 1) * 2];
      p1y = points[(i - 1) * 2 + 1];
      p2x = points[i * 2];
      p2y = points[i * 2 + 1];
      p3x = points[(i + 1) * 2];
      p3y = points[(i + 1) * 2 + 1];
      perpx = -(p1y - p2y);
      perpy = p1x - p2x;
      dist = Math.sqrt(perpx * perpx + perpy * perpy);
      perpx /= dist;
      perpy /= dist;
      perpx *= width;
      perpy *= width;
      perp2x = -(p2y - p3y);
      perp2y = p2x - p3x;
      dist = Math.sqrt(perp2x * perp2x + perp2y * perp2y);
      perp2x /= dist;
      perp2y /= dist;
      perp2x *= width;
      perp2y *= width;
      a1 = (-perpy + p1y) - (-perpy + p2y);
      b1 = (-perpx + p2x) - (-perpx + p1x);
      c1 = (-perpx + p1x) * (-perpy + p2y) - (-perpx + p2x) * (-perpy + p1y);
      a2 = (-perp2y + p3y) - (-perp2y + p2y);
      b2 = (-perp2x + p2x) - (-perp2x + p3x);
      c2 = (-perp2x + p3x) * (-perp2y + p2y) - (-perp2x + p2x) * (-perp2y + p3y);
      denom = a1 * b2 - a2 * b1;
      if (denom === 0) {
        denom += 1;
      }
      px = (b1 * c2 - b2 * c1) / denom;
      py = (a2 * c1 - a1 * c2) / denom;
      pdist = (px - p2x) * (px - p2x) + (py - p2y) + (py - p2y);
      if (pdist > 140 * 140) {
        perp3x = perpx - perp2x;
        perp3y = perpy - perp2y;
        dist = Math.sqrt(perp3x * perp3x + perp3y * perp3y);
        perp3x /= dist;
        perp3y /= dist;
        perp3x *= width;
        perp3y *= width;
        verts.push(p2x - perp3x, p2y - perp3y);
        verts.push(r, g, b, alpha);
        verts.push(p2x + perp3x, p2y + perp3y);
        verts.push(r, g, b, alpha);
        verts.push(p2x - perp3x, p2y - perp3y);
        verts.push(r, g, b, alpha);
        indexCount++;
      } else {
        verts.push(px, py);
        verts.push(r, g, b, alpha);
        verts.push(p2x - (px - p2x), p2y - (py - p2y));
        verts.push(r, g, b, alpha);
      }
      i++;
    }
    p1x = points[(length - 2) * 2];
    p1y = points[(length - 2) * 2 + 1];
    p2x = points[(length - 1) * 2];
    p2y = points[(length - 1) * 2 + 1];
    perpx = -(p1y - p2y);
    perpy = p1x - p2x;
    dist = Math.sqrt(perpx * perpx + perpy * perpy);
    perpx /= dist;
    perpy /= dist;
    perpx *= width;
    perpy *= width;
    verts.push(p2x - perpx, p2y - perpy);
    verts.push(r, g, b, alpha);
    verts.push(p2x + perpx, p2y + perpy);
    verts.push(r, g, b, alpha);
    indices.push(indexStart);
    i = 0;
    while (i < indexCount) {
      indices.push(indexStart++);
      i++;
    }
    return indices.push(indexStart - 1);
  };


  /*
  Builds a polygon to draw
  
  @static
  @private
  @method buildPoly
  @param graphics {Graphics}
  @param webGLData {Object}
   */

  GLESGraphics.buildPoly = function(graphicsData, webGLData) {
    var alpha, b, color, g, i, indices, length, points, r, triangles, vertPos, verts, _results;
    points = graphicsData.points;
    if (points.length < 6) {
      return;
    }
    verts = webGLData.points;
    indices = webGLData.indices;
    length = points.length / 2;
    color = cg.util.hexToRGB(graphicsData.fillColor);
    alpha = graphicsData.fillAlpha;
    r = color[0] * alpha;
    g = color[1] * alpha;
    b = color[2] * alpha;
    triangles = PolyK.Triangulate(points);
    vertPos = verts.length / 6;
    i = 0;
    while (i < triangles.length) {
      indices.push(triangles[i] + vertPos);
      indices.push(triangles[i] + vertPos);
      indices.push(triangles[i + 1] + vertPos);
      indices.push(triangles[i + 2] + vertPos);
      indices.push(triangles[i + 2] + vertPos);
      i += 3;
    }
    i = 0;
    _results = [];
    while (i < length) {
      verts.push(points[i * 2], points[i * 2 + 1], r, g, b, alpha);
      _results.push(i++);
    }
    return _results;
  };

  return GLESGraphics;

})();

module.exports = GLESGraphics;


},{"cg":13,"rendering/Graphics":53,"rendering/core/Matrix":60,"rendering/core/Point":61,"rendering/renderers/webgl/GLESShaders":72,"rendering/utils/PolyK":78}],71:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/*
@author Mat Groves http://matgroves.com/ @Doormat23
 */
var BaseTexture, Batch, CustomRenderable, FilterBlock, GLESGraphics, GLESRenderGroup, GLESRenderer, GLESShaders, Graphics, Matrix, Module, Point, RENDERTYPE_BATCH, RENDERTYPE_CUSTOMRENDERABLE, RENDERTYPE_FILTERBLOCK, RENDERTYPE_GRAPHICS, RENDERTYPE_SPRITE, RENDERTYPE_STRIP, RENDERTYPE_TILINGSPRITE, Rectangle, RenderTypes, Sprite, Strip, Texture, TilingSprite, cg;

cg = require('cg');

Module = require('Module');

Matrix = require('rendering/core/Matrix');

Sprite = require('rendering/Sprite');

TilingSprite = require('rendering/TilingSprite');

Strip = require('rendering/Strip');

CustomRenderable = require('rendering/CustomRenderable');

FilterBlock = require('rendering/filters/FilterBlock');

Graphics = require('rendering/Graphics');

BaseTexture = require('rendering/textures/BaseTexture');

Texture = require('rendering/textures/Texture');

Rectangle = require('rendering/core/Rectangle');

Point = require('rendering/core/Point');

GLESShaders = require('rendering/renderers/webgl/GLESShaders');

GLESGraphics = require('rendering/renderers/webgl/GLESGraphics');

RenderTypes = require('rendering/core/RenderTypes');

RENDERTYPE_SPRITE = RenderTypes.SPRITE;

RENDERTYPE_BATCH = RenderTypes.BATCH;

RENDERTYPE_TILINGSPRITE = RenderTypes.TILINGSPRITE;

RENDERTYPE_STRIP = RenderTypes.STRIP;

RENDERTYPE_GRAPHICS = RenderTypes.GRAPHICS;

RENDERTYPE_FILTERBLOCK = RenderTypes.FILTERBLOCK;

RENDERTYPE_CUSTOMRENDERABLE = RenderTypes.CUSTOMRENDERABLE;

Batch = void 0;


/*
A GLESRenderGroup Enables a group of sprites to be drawn using the same settings.
if a group of sprites all have the same baseTexture and blendMode then they can be
grouped into a batch. All the sprites in a batch can then be drawn in one go by the
GPU which is hugely efficient. ALL sprites in the GLES renderer are added to a batch
even if the batch only contains one sprite. Batching is handled automatically by the
GLES renderer. A good tip is: the smaller the number of batchs there are, the faster
the GLES renderer will run.

@class GLESRenderGroup
@contructor
@param gl {GLESContext} An instance of the GLES context
 */

GLESRenderGroup = (function() {
  function GLESRenderGroup(gl, textureFilter) {
    this.textureFilter = textureFilter != null ? textureFilter : 'linear';
    this.gl = gl;
    this.root;
    this.backgroundColor;
    this.batchs = [];
    this.toRemove = [];
  }


  /*
  Add a display object to the webgl renderer
  
  @method setRenderable
  @param displayObject {DisplayObject}
  @private
   */

  GLESRenderGroup.prototype.setRenderable = function(displayObject) {
    if (this.root) {
      this.removeDisplayObjectAndChildren(this.root);
    }
    displayObject.worldVisible = displayObject.visible;
    this.root = displayObject;
    return this.addDisplayObjectAndChildren(displayObject);
  };


  /*
  Renders the stage to its webgl view
  
  @method render
  @param projection {Object}
   */

  GLESRenderGroup.prototype.render = function(projection) {
    var gl, i, renderable, _results;
    GLESRenderer._updateTextures(this.textureFilter);
    gl = this.gl;
    gl.uniform2f(GLESShaders.defaultShader.projectionVector, projection.x, projection.y);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    renderable = void 0;
    i = 0;
    _results = [];
    while (i < this.batchs.length) {
      renderable = this.batchs[i];
      switch (renderable.__renderType) {
        case RENDERTYPE_BATCH:
          this.batchs[i].render();
          break;
        case RENDERTYPE_TILINGSPRITE:
          if (renderable.worldVisible) {
            this.renderTilingSprite(renderable, projection);
          }
          break;
        case RENDERTYPE_STRIP:
          if (renderable.worldVisible) {
            this.renderStrip(renderable, projection);
          }
          break;
        case RENDERTYPE_GRAPHICS:
          if (renderable.worldVisible && renderable.renderable) {
            GLESGraphics.renderGraphics(renderable, projection);
          }
          break;
        case RENDERTYPE_FILTERBLOCK:
          if (renderable.open) {
            gl.enable(gl.STENCIL_TEST);
            gl.colorMask(false, false, false, false);
            gl.stencilFunc(gl.ALWAYS, 1, 0xff);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
            GLESGraphics.renderGraphics(renderable.mask, projection);
            gl.colorMask(true, true, true, true);
            gl.stencilFunc(gl.NOTEQUAL, 0, 0xff);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
          } else {
            gl.disable(gl.STENCIL_TEST);
          }
      }
      _results.push(i++);
    }
    return _results;
  };


  /*
  Renders the stage to its webgl view
  
  @method handleFilter
  @param filter {FilterBlock}
  @private
   */

  GLESRenderGroup.prototype.handleFilter = function(filter, projection) {};


  /*
  Renders a specific displayObject
  
  @method renderSpecific
  @param displayObject {DisplayObject}
  @param projection {Object}
  @private
   */

  GLESRenderGroup.prototype.renderSpecific = function(displayObject, projection) {
    var endBatch, endBatchIndex, endIndex, gl, head, i, lastItem, lastRenderable, next, nextRenderable, renderable, startBatch, startBatchIndex, startIndex;
    GLESRenderer._updateTextures(this.textureFilter);
    gl = this.gl;
    gl.uniform2f(GLESShaders.defaultShader.projectionVector, projection.x, projection.y);
    startIndex = void 0;
    startBatchIndex = void 0;
    endIndex = void 0;
    endBatchIndex = void 0;
    nextRenderable = displayObject.first;
    while (nextRenderable._iNext) {
      nextRenderable = nextRenderable._iNext;
      if (nextRenderable.renderable && nextRenderable.__renderGroup) {
        break;
      }
    }
    startBatch = nextRenderable.batch;
    if (nextRenderable.__renderType === RENDERTYPE_SPRITE) {
      startBatch = nextRenderable.batch;
      head = startBatch.head;
      next = head;
      if (head === nextRenderable) {
        startIndex = 0;
      } else {
        startIndex = 1;
        while (head.__next !== nextRenderable) {
          startIndex++;
          head = head.__next;
        }
      }
    } else {
      startBatch = nextRenderable;
    }
    lastRenderable = displayObject;
    endBatch = void 0;
    lastItem = displayObject;
    while (lastItem.children.length > 0) {
      lastItem = lastItem.children[lastItem.children.length - 1];
      if (lastItem.renderable) {
        lastRenderable = lastItem;
      }
    }
    if (lastRenderable.__renderType === RENDERTYPE_SPRITE) {
      endBatch = lastRenderable.batch;
      head = endBatch.head;
      if (head === lastRenderable) {
        endIndex = 0;
      } else {
        endIndex = 1;
        while (head.__next !== lastRenderable) {
          endIndex++;
          head = head.__next;
        }
      }
    } else {
      endBatch = lastRenderable;
    }
    if (startBatch === endBatch) {
      if (startBatch.__renderType === RENDERTYPE_BATCH) {
        startBatch.render(startIndex, endIndex + 1);
      } else {
        this.renderSpecial(startBatch, projection);
      }
      return;
    }
    startBatchIndex = this.batchs.indexOf(startBatch);
    endBatchIndex = this.batchs.indexOf(endBatch);
    if (startBatch.__renderType === RENDERTYPE_BATCH) {
      startBatch.render(startIndex);
    } else {
      this.renderSpecial(startBatch, projection);
    }
    i = startBatchIndex + 1;
    while (i < endBatchIndex) {
      renderable = this.batchs[i];
      if (renderable.__renderType === RENDERTYPE_BATCH) {
        this.batchs[i].render();
      } else {
        this.renderSpecial(renderable, projection);
      }
      i++;
    }
    if (endBatch.__renderType === RENDERTYPE_BATCH) {
      return endBatch.render(0, endIndex + 1);
    } else {
      return this.renderSpecial(endBatch, projection);
    }
  };


  /*
  Renders a specific renderable
  
  @method renderSpecial
  @param renderable {DisplayObject}
  @param projection {Object}
  @private
   */

  GLESRenderGroup.prototype.renderSpecial = function(renderable, projection) {
    var gl;
    if (renderable.__renderType === RENDERTYPE_TILINGSPRITE) {
      if (renderable.worldVisible) {
        return this.renderTilingSprite(renderable, projection);
      }
    } else if (renderable.__renderType === RENDERTYPE_STRIP) {
      if (renderable.worldVisible) {
        return this.renderStrip(renderable, projection);
      }
    } else if (renderable.__renderType === RENDERTYPE_CUSTOMRENDERABLE) {
      if (renderable.worldVisible) {
        return renderable.renderGLES(this, projection);
      }
    } else if (renderable.__renderType === RENDERTYPE_GRAPHICS) {
      if (renderable.worldVisible && renderable.renderable) {
        return GLESGraphics.renderGraphics(renderable, projection);
      }
    } else if (renderable.__renderType === RENDERTYPE_FILTERBLOCK) {
      gl = GLESRenderer.gl;
      if (renderable.open) {
        gl.enable(gl.STENCIL_TEST);
        gl.colorMask(false, false, false, false);
        gl.stencilFunc(gl.ALWAYS, 1, 0xff);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
        GLESGraphics.renderGraphics(renderable.mask, projection);
        gl.colorMask(true, true, true, true);
        gl.stencilFunc(gl.NOTEQUAL, 0, 0xff);
        return gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
      } else {
        return gl.disable(gl.STENCIL_TEST);
      }
    }
  };


  /*
  Updates a webgl texture
  
  @method updateTexture
  @param displayObject {DisplayObject}
  @private
   */

  GLESRenderGroup.prototype.updateTexture = function(displayObject) {
    var nextRenderable, previousRenderable;
    this.removeObject(displayObject);
    previousRenderable = displayObject.first;
    while (previousRenderable !== this.root) {
      previousRenderable = previousRenderable._iPrev;
      if (previousRenderable.renderable && previousRenderable.__renderGroup) {
        break;
      }
    }
    nextRenderable = displayObject.last;
    while (nextRenderable._iNext) {
      nextRenderable = nextRenderable._iNext;
      if (nextRenderable.renderable && nextRenderable.__renderGroup) {
        break;
      }
    }
    return this.insertObject(displayObject, previousRenderable, nextRenderable);
  };


  /*
  Adds filter blocks
  
  @method addFilterBlocks
  @param start {FilterBlock}
  @param end {FilterBlock}
  @private
   */

  GLESRenderGroup.prototype.addFilterBlocks = function(start, end) {
    var previousRenderable, previousRenderable2;
    start.__renderGroup = this;
    end.__renderGroup = this;
    previousRenderable = start;
    while (previousRenderable !== this.root) {
      previousRenderable = previousRenderable._iPrev;
      if (previousRenderable.renderable && previousRenderable.__renderGroup) {
        break;
      }
    }
    this.insertAfter(start, previousRenderable);
    previousRenderable2 = end;
    while (previousRenderable2 !== this.root) {
      previousRenderable2 = previousRenderable2._iPrev;
      if (previousRenderable2.renderable && previousRenderable2.__renderGroup) {
        break;
      }
    }
    return this.insertAfter(end, previousRenderable2);
  };


  /*
  Remove filter blocks
  
  @method removeFilterBlocks
  @param start {FilterBlock}
  @param end {FilterBlock}
  @private
   */

  GLESRenderGroup.prototype.removeFilterBlocks = function(start, end) {
    this.removeObject(start);
    return this.removeObject(end);
  };


  /*
  Adds a display object and children to the webgl context
  
  @method addDisplayObjectAndChildren
  @param displayObject {DisplayObject}
  @private
   */

  GLESRenderGroup.prototype.addDisplayObjectAndChildren = function(displayObject) {
    var nextRenderable, previousRenderable, tempObject, testObject, _results;
    if (displayObject.__renderGroup) {
      displayObject.__renderGroup.removeDisplayObjectAndChildren(displayObject);
    }
    previousRenderable = displayObject.first;
    while (previousRenderable !== this.root) {
      previousRenderable = previousRenderable._iPrev;
      if (previousRenderable.renderable && previousRenderable.__renderGroup) {
        break;
      }
    }
    nextRenderable = displayObject.last;
    while (nextRenderable._iNext) {
      nextRenderable = nextRenderable._iNext;
      if (nextRenderable.renderable && nextRenderable.__renderGroup) {
        break;
      }
    }
    tempObject = displayObject.first;
    testObject = displayObject.last._iNext;
    _results = [];
    while (true) {
      tempObject.__renderGroup = this;
      if (tempObject.renderable) {
        this.insertObject(tempObject, previousRenderable, nextRenderable);
        previousRenderable = tempObject;
      }
      tempObject = tempObject._iNext;
      if (tempObject === testObject) {
        break;
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };


  /*
  Removes a display object and children to the webgl context
  
  @method removeDisplayObjectAndChildren
  @param displayObject {DisplayObject}
  @private
   */

  GLESRenderGroup.prototype.removeDisplayObjectAndChildren = function(displayObject) {
    var lastObject, _results;
    if (displayObject.__renderGroup !== this) {
      return;
    }
    lastObject = displayObject.last;
    _results = [];
    while (true) {
      displayObject.__renderGroup = null;
      if (displayObject.renderable) {
        this.removeObject(displayObject);
      }
      displayObject = displayObject._iNext;
      if (!displayObject) {
        break;
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };


  /*
  Inserts a displayObject into the linked list
  
  @method insertObject
  @param displayObject {DisplayObject}
  @param previousObject {DisplayObject}
  @param nextObject {DisplayObject}
  @private
   */

  GLESRenderGroup.prototype.insertObject = function(displayObject, previousObject, nextObject) {
    var batch, index, nextBatch, nextSprite, previousBatch, previousSprite, splitBatch;
    previousSprite = previousObject;
    nextSprite = nextObject;
    if (displayObject.__renderType === RENDERTYPE_SPRITE) {
      previousBatch = void 0;
      nextBatch = void 0;
      if (previousSprite.__renderType === RENDERTYPE_SPRITE) {
        previousBatch = previousSprite.batch;
        if (previousBatch) {
          if (previousBatch.texture === displayObject.texture.baseTexture && previousBatch.blendMode === displayObject.blendMode) {
            previousBatch.insertAfter(displayObject, previousSprite);
            return;
          }
        }
      } else {
        previousBatch = previousSprite;
      }
      if (nextSprite) {
        if (nextSprite.__renderType === RENDERTYPE_SPRITE) {
          nextBatch = nextSprite.batch;
          if (nextBatch) {
            if (nextBatch.texture === displayObject.texture.baseTexture && nextBatch.blendMode === displayObject.blendMode) {
              nextBatch.insertBefore(displayObject, nextSprite);
              return;
            } else {
              if (nextBatch === previousBatch) {
                splitBatch = previousBatch.split(nextSprite);
                batch = GLESRenderer.getBatch();
                index = this.batchs.indexOf(previousBatch);
                batch.init(displayObject);
                this.batchs.splice(index + 1, 0, batch, splitBatch);
                return;
              }
            }
          }
        } else {
          nextBatch = nextSprite;
        }
      }
      batch = GLESRenderer.getBatch();
      batch.init(displayObject);
      if (previousBatch) {
        index = this.batchs.indexOf(previousBatch);
        this.batchs.splice(index + 1, 0, batch);
      } else {
        this.batchs.push(batch);
      }
      return;
    } else if (displayObject.__renderType === RENDERTYPE_TILINGSPRITE) {
      this.initTilingSprite(displayObject);
    } else if (displayObject.__renderType === RENDERTYPE_STRIP) {
      this.initStrip(displayObject);
    } else {
      displayObject;
    }
    return this.insertAfter(displayObject, previousSprite);
  };


  /*
  Inserts a displayObject into the linked list
  
  @method insertAfter
  @param item {DisplayObject}
  @param displayObject {DisplayObject} The object to insert
  @private
   */

  GLESRenderGroup.prototype.insertAfter = function(item, displayObject) {
    var index, previousBatch, splitBatch;
    if (displayObject.__renderType === RENDERTYPE_SPRITE) {
      previousBatch = displayObject.batch;
      if (previousBatch) {
        if (previousBatch.tail === displayObject) {
          index = this.batchs.indexOf(previousBatch);
          return this.batchs.splice(index + 1, 0, item);
        } else {
          splitBatch = previousBatch.split(displayObject.__next);
          index = this.batchs.indexOf(previousBatch);
          return this.batchs.splice(index + 1, 0, item, splitBatch);
        }
      } else {
        return this.batchs.push(item);
      }
    } else {
      index = this.batchs.indexOf(displayObject);
      return this.batchs.splice(index + 1, 0, item);
    }
  };


  /*
  Removes a displayObject from the linked list
  
  @method removeObject
  @param displayObject {DisplayObject} The object to remove
  @private
   */

  GLESRenderGroup.prototype.removeObject = function(displayObject) {
    var batch, batchToRemove, index;
    batchToRemove = void 0;
    if (displayObject.__renderType === RENDERTYPE_SPRITE) {
      batch = displayObject.batch;
      if (!batch) {
        return;
      }
      batch.remove(displayObject);
      if (batch.size === 0) {
        batchToRemove = batch;
      }
    } else {
      batchToRemove = displayObject;
    }
    if (batchToRemove) {
      index = this.batchs.indexOf(batchToRemove);
      if (index === -1) {
        return;
      }
      if (index === 0 || index === this.batchs.length - 1) {
        this.batchs.splice(index, 1);
        if (batchToRemove.__renderType === RENDERTYPE_BATCH) {
          GLESRenderer.returnBatch(batchToRemove);
        }
        return;
      }
      if (this.batchs[index - 1].__renderType === RENDERTYPE_BATCH && this.batchs[index + 1].__renderType === RENDERTYPE_BATCH) {
        if (this.batchs[index - 1].texture === this.batchs[index + 1].texture && this.batchs[index - 1].blendMode === this.batchs[index + 1].blendMode) {
          this.batchs[index - 1].merge(this.batchs[index + 1]);
          if (batchToRemove.__renderType === RENDERTYPE_BATCH) {
            GLESRenderer.returnBatch(batchToRemove);
          }
          GLESRenderer.returnBatch(this.batchs[index + 1]);
          this.batchs.splice(index, 2);
          return;
        }
      }
      this.batchs.splice(index, 1);
      if (batchToRemove.__renderType === RENDERTYPE_BATCH) {
        return GLESRenderer.returnBatch(batchToRemove);
      }
    }
  };


  /*
  Initializes a tiling sprite
  
  @method initTilingSprite
  @param sprite {TilingSprite} The tiling sprite to initialize
  @private
   */

  GLESRenderGroup.prototype.initTilingSprite = function(sprite) {
    var gl;
    gl = this.gl;
    sprite.verticies = new cg.util.Float32Array([0, 0, sprite.width, 0, sprite.width, sprite.height, 0, sprite.height]);
    sprite.uvs = new cg.util.Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
    sprite.colors = new cg.util.Float32Array([1, 1, 1, 1]);
    sprite.indices = new cg.util.Uint16Array([0, 1, 3, 2]);
    sprite._vertexBuffer = gl.createBuffer();
    sprite._indexBuffer = gl.createBuffer();
    sprite._uvBuffer = gl.createBuffer();
    sprite._colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sprite._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sprite.verticies, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, sprite._uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sprite.uvs, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, sprite._colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sprite.colors, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sprite._indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sprite.indices, gl.STATIC_DRAW);
    if (sprite.texture.baseTexture._glTexture) {
      gl.bindTexture(gl.TEXTURE_2D, sprite.texture.baseTexture._glTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      return sprite.texture.baseTexture._powerOf2 = true;
    } else {
      return sprite.texture.baseTexture._powerOf2 = true;
    }
  };


  /*
  Renders a Strip
  
  @method renderStrip
  @param strip {Strip} The strip to render
  @param projection {Object}
  @private
   */

  GLESRenderGroup.prototype.renderStrip = function(strip, projection) {
    var defaultShader, gl, m;
    gl = this.gl;
    defaultShader = GLESShaders.defaultShader;
    gl.useProgram(GLESShaders.stripShaderProgram);
    m = Matrix.mat3.clone(strip.worldTransform);
    Matrix.mat3.transpose(m);
    gl.uniformMatrix3fv(GLESShaders.stripShaderProgram.translationMatrix, false, m);
    gl.uniform2f(GLESShaders.stripShaderProgram.projectionVector, projection.x, projection.y);
    gl.uniform1f(GLESShaders.stripShaderProgram.alpha, strip.worldAlpha);
    if (!strip.dirty) {
      gl.bindBuffer(gl.ARRAY_BUFFER, strip._vertexBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, strip.verticies);
      gl.vertexAttribPointer(defaultShader.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, strip._uvBuffer);
      gl.vertexAttribPointer(defaultShader.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, strip.texture.baseTexture._glTexture);
      gl.bindBuffer(gl.ARRAY_BUFFER, strip._colorBuffer);
      gl.vertexAttribPointer(defaultShader.colorAttribute, 1, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, strip._indexBuffer);
    } else {
      strip.dirty = false;
      gl.bindBuffer(gl.ARRAY_BUFFER, strip._vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, strip.verticies, gl.STATIC_DRAW);
      gl.vertexAttribPointer(defaultShader.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, strip._uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, strip.uvs, gl.STATIC_DRAW);
      gl.vertexAttribPointer(defaultShader.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, strip.texture.baseTexture._glTexture);
      gl.bindBuffer(gl.ARRAY_BUFFER, strip._colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, strip.colors, gl.STATIC_DRAW);
      gl.vertexAttribPointer(defaultShader.colorAttribute, 1, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, strip._indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, strip.indices, gl.STATIC_DRAW);
    }
    gl.drawElements(gl.TRIANGLE_STRIP, strip.indices.length, gl.UNSIGNED_SHORT, 0);
    return gl.useProgram(GLESShaders.defaultShader);
  };


  /*
  Renders a TilingSprite
  
  @method renderTilingSprite
  @param sprite {TilingSprite} The tiling sprite to render
  @param projectionMatrix {Object}
  @private
   */

  GLESRenderGroup.prototype.renderTilingSprite = function(sprite, projectionMatrix) {
    var defaultShader, gl, offsetX, offsetY, scaleX, scaleY, tilePosition, tileScale;
    gl = this.gl;
    defaultShader = GLESShaders.defaultShader;
    tilePosition = sprite.tilePosition;
    tileScale = sprite.tileScale;
    offsetX = tilePosition.x / sprite.texture.baseTexture.width;
    offsetY = tilePosition.y / sprite.texture.baseTexture.height;
    scaleX = (sprite.width / sprite.texture.baseTexture.width) / tileScale.x;
    scaleY = (sprite.height / sprite.texture.baseTexture.height) / tileScale.y;
    sprite.uvs[0] = 0 - offsetX;
    sprite.uvs[1] = 0 - offsetY;
    sprite.uvs[2] = (1 * scaleX) - offsetX;
    sprite.uvs[3] = 0 - offsetY;
    sprite.uvs[4] = (1 * scaleX) - offsetX;
    sprite.uvs[5] = (1 * scaleY) - offsetY;
    sprite.uvs[6] = 0 - offsetX;
    sprite.uvs[7] = (1 * scaleY) - offsetY;
    sprite.verticies[2] = sprite.verticies[4] = sprite.width;
    sprite.verticies[5] = sprite.verticies[7] = sprite.height;
    gl.bindBuffer(gl.ARRAY_BUFFER, sprite._vertexBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, sprite.verticies);
    gl.bindBuffer(gl.ARRAY_BUFFER, sprite._uvBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, sprite.uvs);
    return this.renderStrip(sprite, projectionMatrix);
  };


  /*
  Initializes a strip to be rendered
  
  @method initStrip
  @param strip {Strip} The strip to initialize
  @private
   */

  GLESRenderGroup.prototype.initStrip = function(strip) {
    var defaultShader, gl;
    gl = this.gl;
    defaultShader = this.defaultShader;
    strip._vertexBuffer = gl.createBuffer();
    strip._indexBuffer = gl.createBuffer();
    strip._uvBuffer = gl.createBuffer();
    strip._colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, strip._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, strip.verticies, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, strip._uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, strip.uvs, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, strip._colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, strip.colors, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, strip._indexBuffer);
    return gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, strip.indices, gl.STATIC_DRAW);
  };

  return GLESRenderGroup;

})();


/*
the GLESRenderer is draws the stage and all its content onto a webGL enabled canvas. This renderer
should be used for browsers support webGL. This Render works by automatically managing webGLBatchs.
So no need for Sprite Batch's or Sprite Cloud's
Dont forget to add the view to your DOM or you will not see anything :)

@class GLESRenderer
@constructor
@param width=0 {Number} the width of the canvas view
@param height=0 {Number} the height of the canvas view
@param view {Canvas} the canvas to use as a view, optional
@param transparent=false {Boolean} the transparency of the render view, default false
 */

GLESRenderer = (function() {
  GLESRenderer.GLESRenderGroup = GLESRenderGroup;

  GLESRenderer.setBatchClass = function(BatchClass) {
    return Batch = BatchClass;
  };

  function GLESRenderer(gl, width, height, transparent, textureFilter) {
    this.gl = gl;
    this.textureFilter = textureFilter != null ? textureFilter : 'linear';
    GLESGraphics.gl = this.gl;
    this.transparent = !!transparent;
    this.width = width || 800;
    this.height = height || 600;
    this.initShaders();
    gl = GLESRenderer.gl = this.gl;
    this.batch = new Batch(gl);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.colorMask(true, true, true, this.transparent);
    GLESRenderer.projection = new Point(400, 300);
    this.resize(this.width, this.height);
    this.contextLost = false;
    this.stageRenderGroup = new GLESRenderGroup(this.gl, this.textureFilter);
  }

  GLESRenderer.prototype.initShaders = function() {
    GLESShaders.initPrimitiveShader(this.gl);
    GLESShaders.initDefaultShader(this.gl);
    GLESShaders.initDefaultStripShader(this.gl);
    return GLESShaders.activateDefaultShader(this.gl);
  };


  /*
  Gets a new Batch from the pool
  
  @static
  @method getBatch
  @return {Batch}
  @private
   */

  GLESRenderer.getBatch = function() {
    if (Batch._batchs.length === 0) {
      return new Batch(GLESRenderer.gl);
    } else {
      return Batch._batchs.pop();
    }
  };


  /*
  Puts a batch back into the pool
  
  @static
  @method returnBatch
  @param batch {Batch} The batch to return
  @private
   */

  GLESRenderer.returnBatch = function(batch) {
    batch.clean();
    return Batch._batchs.push(batch);
  };


  /*
  Renders the stage to its webGL view
  
  @method render
  @param stage {Stage} the Stage element to be rendered
   */

  GLESRenderer.prototype.render = function(stage) {
    var gl, i;
    if (this.contextLost) {
      return;
    }
    if (this.__stage !== stage) {
      this.__stage = stage;
      this.stageRenderGroup.setRenderable(stage);
    }
    this._updateTextures(this.textureFilter);
    stage.__updateTransform();
    gl = this.gl;
    gl.colorMask(true, true, true, this.transparent);
    gl.viewport(this.viewportX, this.viewportY, this.viewportWidth, this.viewportHeight);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clearColor(stage.backgroundColorSplit[0], stage.backgroundColorSplit[1], stage.backgroundColorSplit[2], !this.transparent);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.stageRenderGroup.backgroundColor = stage.backgroundColorSplit;
    this.stageRenderGroup.render(GLESRenderer.projection);
    if (Texture.frameUpdates.length > 0) {
      i = 0;
      while (i < Texture.frameUpdates.length) {
        Texture.frameUpdates[i]._updateFrame = false;
        i++;
      }
      return Texture.frameUpdates = [];
    }
  };


  /*
  Updates the textures loaded into this webgl renderer
  
  @static
  @method _updateTextures
  @private
   */

  GLESRenderer._updateTextures = function(defaultFilter) {
    var i;
    i = 0;
    while (i < BaseTexture.texturesToUpdate.length) {
      this.updateTexture(BaseTexture.texturesToUpdate[i], defaultFilter);
      i++;
    }
    i = 0;
    while (i < BaseTexture.texturesToDestroy.length) {
      this.destroyTexture(BaseTexture.texturesToDestroy[i]);
      i++;
    }
    BaseTexture.texturesToUpdate = [];
    return BaseTexture.texturesToDestroy = [];
  };


  /*
  @static
  @method _updateAllTextures
  @private
   */

  GLESRenderer._updateAllTextures = function(defaultFilter) {
    var tex, _i, _len, _ref, _results;
    _ref = BaseTexture.allTextures;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tex = _ref[_i];
      _results.push(this.updateTexture(tex, defaultFilter));
    }
    return _results;
  };

  GLESRenderer.prototype._updateTextures = function() {
    return GLESRenderer._updateTextures.apply(GLESRenderer, arguments);
  };

  GLESRenderer.prototype._updateAllTextures = function() {
    return GLESRenderer._updateAllTextures.apply(GLESRenderer, arguments);
  };


  /*
  @private
   */

  GLESRenderer.getGLFilterMode = function(filterMode) {
    var glFilterMode;
    switch (filterMode) {
      case 'nearest':
        glFilterMode = this.gl.NEAREST;
        break;
      case 'linear':
        glFilterMode = this.gl.LINEAR;
        break;
      default:
        cg.warn('Unexpected value for filterMode: ' + filterMode + '. Defaulting to LINEAR');
        glFilterMode = this.gl.LINEAR;
    }
    return glFilterMode;
  };


  /*
  Updates a loaded webgl texture
  
  @static
  @method updateTexture
  @param texture {Texture} The texture to update
  @private
   */

  GLESRenderer.updateTexture = function(texture, defaultFilterMode) {
    var filterMode, gl, glFilterMode;
    if (texture.filterMode != null) {
      filterMode = texture.filterMode;
    } else {
      filterMode = defaultFilterMode;
    }
    gl = GLESRenderer.gl;
    if (!texture._glTexture) {
      texture._glTexture = gl.createTexture();
    }
    if (texture.hasLoaded) {
      gl.bindTexture(gl.TEXTURE_2D, texture._glTexture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);
      glFilterMode = this.getGLFilterMode(filterMode);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glFilterMode);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glFilterMode);
      if (!texture._powerOf2) {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      }
      return gl.bindTexture(gl.TEXTURE_2D, null);
    }
  };


  /*
  Destroys a loaded webgl texture
  
  @method destroyTexture
  @param texture {Texture} The texture to update
  @private
   */

  GLESRenderer.destroyTexture = function(texture) {
    var gl, idx;
    gl = this.gl;
    if (texture._glTexture) {
      texture._glTexture = gl.createTexture();
      gl.deleteTexture(gl.TEXTURE_2D, texture._glTexture);
      idx = BaseTexture.allTextures.indexOf(texture);
      if (idx < 0) {
        return;
      }
      return BaseTexture.allTextures.splice(idx, 1);
    }
  };


  /*
  resizes the webGL view to the specified width and height
  
  @method resize
  @param width {Number} the new width of the webGL view
  @param height {Number} the new height of the webGL view
   */

  GLESRenderer.prototype.resize = function(width, height, viewportWidth, viewportHeight, viewportX, viewportY) {
    this.width = width;
    this.height = height;
    this.viewportX = viewportX != null ? viewportX : 0;
    this.viewportY = viewportY != null ? viewportY : 0;
    this.viewportWidth = viewportWidth != null ? viewportWidth : this.width;
    this.viewportHeight = viewportHeight != null ? viewportHeight : this.height;
    this.gl.viewport(this.viewportX, this.viewportY, this.viewportWidth, this.viewportHeight);
    GLESRenderer.projection.x = this.width / 2;
    return GLESRenderer.projection.y = this.height / 2;
  };

  return GLESRenderer;

})();

module.exports = GLESRenderer;


},{"Module":6,"cg":13,"rendering/CustomRenderable":50,"rendering/Graphics":53,"rendering/Sprite":54,"rendering/Strip":56,"rendering/TilingSprite":57,"rendering/core/Matrix":60,"rendering/core/Point":61,"rendering/core/Rectangle":63,"rendering/core/RenderTypes":64,"rendering/filters/FilterBlock":66,"rendering/renderers/webgl/GLESGraphics":70,"rendering/renderers/webgl/GLESShaders":72,"rendering/textures/BaseTexture":75,"rendering/textures/Texture":77}],72:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/*
@author Mat Groves http://matgroves.com/ @Doormat23
 */
var GLESShaders;

GLESShaders = {};

GLESShaders.shaderFragmentSrc = ["#ifdef GL_ES", "precision lowp float;", "#endif", "varying vec2 vTextureCoord;", "varying float vColor;", "uniform sampler2D uSampler;", "void main(void) {", "gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;", "}"];

GLESShaders.shaderVertexSrc = ["attribute vec2 aVertexPosition;", "attribute vec2 aTextureCoord;", "attribute float aColor;", "uniform vec2 projectionVector;", "varying vec2 vTextureCoord;", "varying float vColor;", "void main(void) {", "gl_Position = vec4( aVertexPosition.x / projectionVector.x -1.0, aVertexPosition.y / -projectionVector.y + 1.0 , 0.0, 1.0);", "vTextureCoord = aTextureCoord;", "vColor = aColor;", "}"];

GLESShaders.stripShaderFragmentSrc = ["#ifdef GL_ES", "precision mediump float;", "#endif", "varying vec2 vTextureCoord;", "varying float vColor;", "uniform float alpha;", "uniform sampler2D uSampler;", "void main(void) {", "gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));", "gl_FragColor = gl_FragColor * alpha;", "}"];

GLESShaders.stripShaderVertexSrc = ["attribute vec2 aVertexPosition;", "attribute vec2 aTextureCoord;", "attribute float aColor;", "uniform mat3 translationMatrix;", "uniform vec2 projectionVector;", "varying vec2 vTextureCoord;", "varying float vColor;", "void main(void) {", "vec3 v = translationMatrix * vec3(aVertexPosition, 1.0);", "gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);", "vTextureCoord = aTextureCoord;", "vColor = aColor;", "}"];

GLESShaders.primitiveShaderFragmentSrc = ["#ifdef GL_ES", "precision mediump float;", "#endif", "varying vec4 vColor;", "void main(void) {", "gl_FragColor = vColor;", "}"];

GLESShaders.primitiveShaderVertexSrc = ["attribute vec2 aVertexPosition;", "attribute vec4 aColor;", "uniform mat3 translationMatrix;", "uniform vec2 projectionVector;", "uniform float alpha;", "varying vec4 vColor;", "void main(void) {", "vec3 v = translationMatrix * vec3(aVertexPosition, 1.0);", "gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);", "vColor = aColor  * alpha;", "}"];

GLESShaders.initPrimitiveShader = function(gl) {
  var shader;
  shader = {};
  shader.program = GLESShaders.compileProgram(gl, GLESShaders.primitiveShaderVertexSrc, GLESShaders.primitiveShaderFragmentSrc);
  gl.useProgram(shader.program);
  shader.vertexPositionAttribute = gl.getAttribLocation(shader.program, "aVertexPosition");
  shader.colorAttribute = gl.getAttribLocation(shader.program, "aColor");
  shader.projectionVector = gl.getUniformLocation(shader.program, "projectionVector");
  shader.translationMatrix = gl.getUniformLocation(shader.program, "translationMatrix");
  shader.alpha = gl.getUniformLocation(shader.program, "alpha");
  return GLESShaders.primitiveShader = shader;
};

GLESShaders.initDefaultShader = function(gl) {
  var shader;
  shader = {};
  shader.program = GLESShaders.compileProgram(gl, GLESShaders.shaderVertexSrc, GLESShaders.shaderFragmentSrc);
  gl.useProgram(shader.program);
  shader.vertexPositionAttribute = gl.getAttribLocation(shader.program, "aVertexPosition");
  shader.projectionVector = gl.getUniformLocation(shader.program, "projectionVector");
  shader.textureCoordAttribute = gl.getAttribLocation(shader.program, "aTextureCoord");
  shader.colorAttribute = gl.getAttribLocation(shader.program, "aColor");
  shader.samplerUniform = gl.getUniformLocation(shader.program, "uSampler");
  return GLESShaders.defaultShader = shader;
};

GLESShaders.initDefaultStripShader = function(gl) {
  var shader;
  shader = {};
  shader.program = GLESShaders.compileProgram(gl, GLESShaders.stripShaderVertexSrc, GLESShaders.stripShaderFragmentSrc);
  gl.useProgram(shader.program);
  shader.vertexPositionAttribute = gl.getAttribLocation(shader.program, "aVertexPosition");
  shader.projectionVector = gl.getUniformLocation(shader.program, "projectionVector");
  shader.textureCoordAttribute = gl.getAttribLocation(shader.program, "aTextureCoord");
  shader.translationMatrix = gl.getUniformLocation(shader.program, "translationMatrix");
  shader.alpha = gl.getUniformLocation(shader.program, "alpha");
  shader.colorAttribute = gl.getAttribLocation(shader.program, "aColor");
  shader.projectionVector = gl.getUniformLocation(shader.program, "projectionVector");
  shader.samplerUniform = gl.getUniformLocation(shader.program, "uSampler");
  return GLESShaders.stripShader = shader;
};

GLESShaders.CompileVertexShader = function(gl, shaderSrc) {
  return GLESShaders._CompileShader(gl, shaderSrc, gl.VERTEX_SHADER);
};

GLESShaders.CompileFragmentShader = function(gl, shaderSrc) {
  return GLESShaders._CompileShader(gl, shaderSrc, gl.FRAGMENT_SHADER);
};

GLESShaders._CompileShader = function(gl, shaderSrc, shaderType) {
  var shader, src;
  src = shaderSrc.join("\n");
  shader = gl.createShader(shaderType);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
};

GLESShaders.compileProgram = function(gl, vertexSrc, fragmentSrc) {
  var fragmentShader, program, vertexShader;
  fragmentShader = GLESShaders.CompileFragmentShader(gl, fragmentSrc);
  vertexShader = GLESShaders.CompileVertexShader(gl, vertexSrc);
  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }
  return program;
};

GLESShaders.activateDefaultShader = function(gl) {
  var shader;
  shader = GLESShaders.defaultShader;
  gl.useProgram(shader.program);
  gl.enableVertexAttribArray(shader.vertexPositionAttribute);
  gl.enableVertexAttribArray(shader.textureCoordAttribute);
  return gl.enableVertexAttribArray(shader.colorAttribute);
};

GLESShaders.activatePrimitiveShader = function(gl) {
  gl.disableVertexAttribArray(GLESShaders.defaultShader.textureCoordAttribute);
  gl.disableVertexAttribArray(GLESShaders.defaultShader.colorAttribute);
  gl.useProgram(GLESShaders.primitiveShader.program);
  gl.enableVertexAttribArray(GLESShaders.primitiveShader.vertexPositionAttribute);
  return gl.enableVertexAttribArray(GLESShaders.primitiveShader.colorAttribute);
};

module.exports = GLESShaders;


},{}],73:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/*
@author Mat Groves http://matgroves.com/ @Doormat23
 */
var GLESShaders, RenderTypes, Sprite, WebGLBatch, cg;

cg = require('cg');

Sprite = require('rendering/Sprite');

GLESShaders = require('rendering/renderers/webgl/GLESShaders');

RenderTypes = require('rendering/core/RenderTypes');


/*
A WebGLBatch Enables a group of sprites to be drawn using the same settings.
if a group of sprites all have the same baseTexture and blendMode then they can be grouped into a batch.
All the sprites in a batch can then be drawn in one go by the GPU which is hugely efficient. ALL sprites
in the webGL renderer are added to a batch even if the batch only contains one sprite. Batching is handled
automatically by the webGL renderer. A good tip is: the smaller the number of batchs there are, the faster
the webGL renderer will run.

@class WebGLBatch
@constructor
@param gl {WebGLContext} an instance of the webGL context
 */

WebGLBatch = (function() {
  WebGLBatch.prototype.__renderType = RenderTypes.BATCH;

  WebGLBatch._batchs = [];


  /*
  @private
   */

  WebGLBatch._getBatch = function(gl) {
    if (WebGLBatch.length === 0) {
      return new WebGLBatch(gl);
    } else {
      return WebGLBatch.pop();
    }
  };


  /*
  @private
   */

  WebGLBatch._returnBatch = function(batch) {
    batch.clean();
    return WebGLBatch.push(batch);
  };


  /*
  @private
   */

  WebGLBatch._restoreBatchs = function(gl) {
    var i;
    i = 0;
    while (i < WebGLBatch.length) {
      WebGLBatch[i].restoreLostContext(gl);
      i++;
    }
  };

  function WebGLBatch(gl) {
    this.gl = gl;
    this.size = 0;
    this.vertexBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();
    this.uvBuffer = gl.createBuffer();
    this.colorBuffer = gl.createBuffer();
    this.blendMode = Sprite.blendModes.NORMAL;
    this.dynamicSize = 1;
  }


  /*
  Cleans the batch so that is can be returned to an object pool and reused
  
  @method clean
   */

  WebGLBatch.prototype.clean = function() {
    this.verticies = [];
    this.uvs = [];
    this.indices = [];
    this.colors = [];
    this.dynamicSize = 1;
    this.texture = null;
    this.last = null;
    this.size = 0;
    this.head;
    return this.tail;
  };


  /*
  Recreates the buffers in the event of a context loss
  
  @method restoreLostContext
  @param gl {WebGLContext}
   */

  WebGLBatch.prototype.restoreLostContext = function(gl) {
    this.gl = gl;
    this.vertexBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();
    this.uvBuffer = gl.createBuffer();
    return this.colorBuffer = gl.createBuffer();
  };


  /*
  inits the batch's texture and blend mode based if the supplied sprite
  
  @method init
  @param sprite {Sprite} the first sprite to be added to the batch. Only sprites with
  the same base texture and blend mode will be allowed to be added to this batch
   */

  WebGLBatch.prototype.init = function(sprite) {
    var _ref;
    sprite.batch = this;
    this.dirty = true;
    this.blendMode = sprite.blendMode;
    this.texture = (_ref = sprite.texture) != null ? _ref.baseTexture : void 0;
    this.head = sprite;
    this.tail = sprite;
    this.size = 1;
    return this.growBatch();
  };


  /*
  inserts a sprite before the specified sprite
  
  @method insertBefore
  @param sprite {Sprite} the sprite to be added
  @param nextSprite {nextSprite} the first sprite will be inserted before this sprite
   */

  WebGLBatch.prototype.insertBefore = function(sprite, nextSprite) {
    var tempPrev;
    this.size++;
    sprite.batch = this;
    this.dirty = true;
    tempPrev = nextSprite.__prev;
    nextSprite.__prev = sprite;
    sprite.__next = nextSprite;
    if (tempPrev) {
      sprite.__prev = tempPrev;
      return tempPrev.__next = sprite;
    } else {
      return this.head = sprite;
    }
  };


  /*
  inserts a sprite after the specified sprite
  
  @method insertAfter
  @param sprite {Sprite} the sprite to be added
  @param  previousSprite {Sprite} the first sprite will be inserted after this sprite
   */

  WebGLBatch.prototype.insertAfter = function(sprite, previousSprite) {
    var tempNext;
    this.size++;
    sprite.batch = this;
    this.dirty = true;
    tempNext = previousSprite.__next;
    previousSprite.__next = sprite;
    sprite.__prev = previousSprite;
    if (tempNext) {
      sprite.__next = tempNext;
      return tempNext.__prev = sprite;
    } else {
      return this.tail = sprite;
    }
  };


  /*
  removes a sprite from the batch
  
  @method remove
  @param sprite {Sprite} the sprite to be removed
   */

  WebGLBatch.prototype.remove = function(sprite) {
    this.size--;
    if (this.size === 0) {
      sprite.batch = null;
      sprite.__prev = null;
      sprite.__next = null;
      return;
    }
    if (sprite.__prev) {
      sprite.__prev.__next = sprite.__next;
    } else {
      this.head = sprite.__next;
      this.head.__prev = null;
    }
    if (sprite.__next) {
      sprite.__next.__prev = sprite.__prev;
    } else {
      this.tail = sprite.__prev;
      this.tail.__next = null;
    }
    sprite.batch = null;
    sprite.__next = null;
    sprite.__prev = null;
    return this.dirty = true;
  };


  /*
  Splits the batch into two with the specified sprite being the start of the new batch.
  
  @method split
  @param sprite {Sprite} the sprite that indicates where the batch should be split
  @return {WebGLBatch} the new batch
   */

  WebGLBatch.prototype.split = function(sprite) {
    var batch, tempSize;
    this.dirty = true;
    batch = new WebGLBatch(this.gl);
    batch.init(sprite);
    batch.texture = this.texture;
    batch.tail = this.tail;
    this.tail = sprite.__prev;
    this.tail.__next = null;
    sprite.__prev = null;
    tempSize = 0;
    while (sprite) {
      tempSize++;
      sprite.batch = batch;
      sprite = sprite.__next;
    }
    batch.size = tempSize;
    this.size -= tempSize;
    return batch;
  };


  /*
  Merges two batchs together
  
  @method merge
  @param batch {WebGLBatch} the batch that will be merged
   */

  WebGLBatch.prototype.merge = function(batch) {
    var sprite;
    this.dirty = true;
    this.tail.__next = batch.head;
    batch.head.__prev = this.tail;
    this.size += batch.size;
    this.tail = batch.tail;
    sprite = batch.head;
    while (sprite) {
      sprite.batch = this;
      sprite = sprite.__next;
    }
  };


  /*
  Grows the size of the batch. As the elements in the batch cannot have a dynamic size this
  function is used to increase the size of the batch. It also creates a little extra room so
  that the batch does not need to be resized every time a sprite is added
  
  @method growBatch
   */

  WebGLBatch.prototype.growBatch = function() {
    var gl, i, index2, index3, length;
    gl = this.gl;
    if (this.size === 1) {
      this.dynamicSize = 1;
    } else {
      this.dynamicSize = this.size * 1.5;
    }
    this.verticies = new cg.util.Float32Array(this.dynamicSize * 8);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.verticies, gl.DYNAMIC_DRAW);
    this.uvs = new cg.util.Float32Array(this.dynamicSize * 8);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.DYNAMIC_DRAW);
    this.__dirtyUVs = true;
    this.colors = new cg.util.Float32Array(this.dynamicSize * 4);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.DYNAMIC_DRAW);
    this.__dirtyColors = true;
    this.indices = new cg.util.Uint16Array(this.dynamicSize * 6);
    length = this.indices.length / 6;
    i = 0;
    while (i < length) {
      index2 = i * 6;
      index3 = i * 4;
      this.indices[index2 + 0] = index3 + 0;
      this.indices[index2 + 1] = index3 + 1;
      this.indices[index2 + 2] = index3 + 2;
      this.indices[index2 + 3] = index3 + 0;
      this.indices[index2 + 4] = index3 + 2;
      this.indices[index2 + 5] = index3 + 3;
      i++;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    return gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
  };


  /*
  Refresh's all the data in the batch and sync's it with the webGL buffers
  
  @method refresh
   */

  WebGLBatch.prototype.refresh = function() {
    var a, aX, aY, b, c, colorIndex, d, displayObject, frame, fx, fy, gl, h0, h1, height, index, indexRun, texture, th, tw, tx, ty, w0, w1, width, worldTransform;
    gl = this.gl;
    if (this.dynamicSize < this.size) {
      this.growBatch();
    }
    indexRun = 0;
    worldTransform = void 0;
    width = void 0;
    height = void 0;
    aX = void 0;
    aY = void 0;
    w0 = void 0;
    w1 = void 0;
    h0 = void 0;
    h1 = void 0;
    index = void 0;
    a = void 0;
    b = void 0;
    c = void 0;
    d = void 0;
    tx = void 0;
    ty = void 0;
    displayObject = this.head;
    while (displayObject) {
      index = indexRun * 8;
      texture = displayObject.texture;
      frame = texture.frame;
      tw = texture.baseTexture.width;
      th = texture.baseTexture.height;
      fx = frame.x;
      fy = frame.y;
      this.uvs[index + 0] = fx / tw;
      this.uvs[index + 1] = fy / th;
      this.uvs[index + 2] = (fx + frame.width) / tw;
      this.uvs[index + 3] = fy / th;
      this.uvs[index + 4] = (fx + frame.width) / tw;
      this.uvs[index + 5] = (fy + frame.height) / th;
      this.uvs[index + 6] = fx / tw;
      this.uvs[index + 7] = (fy + frame.height) / th;
      displayObject._updateFrame = false;
      colorIndex = indexRun * 4;
      this.colors[colorIndex] = this.colors[colorIndex + 1] = this.colors[colorIndex + 2] = this.colors[colorIndex + 3] = displayObject.worldAlpha;
      displayObject = displayObject.__next;
      indexRun++;
    }
    this.__dirtyUVs = true;
    return this.__dirtyColors = true;
  };


  /*
  Updates all the relevant geometry and uploads the data to the GPU
  
  @method update
   */

  WebGLBatch.prototype.update = function() {
    var a, aX, aY, b, c, colorIndex, d, displayObject, frame, gl, h0, h1, height, index, index2, index3, indexRun, texture, th, tw, tx, ty, w0, w1, width, worldTransform, _ref, _ref1, _ref2, _ref3, _ref4;
    gl = this.gl;
    worldTransform = void 0;
    width = void 0;
    height = void 0;
    aX = void 0;
    aY = void 0;
    w0 = void 0;
    w1 = void 0;
    h0 = void 0;
    h1 = void 0;
    index = void 0;
    index2 = void 0;
    index3 = void 0;
    a = void 0;
    b = void 0;
    c = void 0;
    d = void 0;
    tx = void 0;
    ty = void 0;
    indexRun = 0;
    displayObject = this.head;
    while (displayObject) {
      if (displayObject.worldVisible) {
        width = (_ref = (_ref1 = displayObject.texture) != null ? _ref1.frame.width : void 0) != null ? _ref : displayObject.width;
        height = (_ref2 = (_ref3 = displayObject.texture) != null ? _ref3.frame.height : void 0) != null ? _ref2 : displayObject.height;
        aX = displayObject.anchorX;
        aY = displayObject.anchorY;
        w0 = width * (1 - aX);
        w1 = width * -aX;
        h0 = height * (1 - aY);
        h1 = height * -aY;
        index = indexRun * 8;
        worldTransform = displayObject.worldTransform;
        a = worldTransform[0];
        b = worldTransform[3];
        c = worldTransform[1];
        d = worldTransform[4];
        tx = worldTransform[2];
        ty = worldTransform[5];
        this.verticies[index + 0] = a * w1 + c * h1 + tx;
        this.verticies[index + 1] = d * h1 + b * w1 + ty;
        this.verticies[index + 2] = a * w0 + c * h1 + tx;
        this.verticies[index + 3] = d * h1 + b * w0 + ty;
        this.verticies[index + 4] = a * w0 + c * h0 + tx;
        this.verticies[index + 5] = d * h0 + b * w0 + ty;
        this.verticies[index + 6] = a * w1 + c * h0 + tx;
        this.verticies[index + 7] = d * h0 + b * w1 + ty;
        if (displayObject._updateFrame || ((_ref4 = displayObject.texture) != null ? _ref4._updateFrame : void 0)) {
          this.__dirtyUVs = true;
          texture = displayObject.texture;
          frame = texture.frame;
          tw = texture.baseTexture.width;
          th = texture.baseTexture.height;
          this.uvs[index + 0] = frame.x / tw;
          this.uvs[index + 1] = frame.y / th;
          this.uvs[index + 2] = (frame.x + frame.width) / tw;
          this.uvs[index + 3] = frame.y / th;
          this.uvs[index + 4] = (frame.x + frame.width) / tw;
          this.uvs[index + 5] = (frame.y + frame.height) / th;
          this.uvs[index + 6] = frame.x / tw;
          this.uvs[index + 7] = (frame.y + frame.height) / th;
          displayObject._updateFrame = false;
        }
        if (displayObject.cacheAlpha !== displayObject.worldAlpha) {
          displayObject.cacheAlpha = displayObject.worldAlpha;
          colorIndex = indexRun * 4;
          this.colors[colorIndex] = this.colors[colorIndex + 1] = this.colors[colorIndex + 2] = this.colors[colorIndex + 3] = displayObject.worldAlpha;
          this.__dirtyColors = true;
        }
      } else {
        index = indexRun * 8;
        this.verticies[index + 0] = 0;
        this.verticies[index + 1] = 0;
        this.verticies[index + 2] = 0;
        this.verticies[index + 3] = 0;
        this.verticies[index + 4] = 0;
        this.verticies[index + 5] = 0;
        this.verticies[index + 6] = 0;
        this.verticies[index + 7] = 0;
      }
      indexRun++;
      displayObject = displayObject.__next;
    }
  };


  /*
  Draws the batch to the frame buffer
  
  @method render
   */

  WebGLBatch.prototype.render = function(start, end) {
    var defaultShader, gl, len;
    start = start || 0;
    if (end === undefined) {
      end = this.size;
    }
    if (this.dirty) {
      this.refresh();
      this.dirty = false;
    }
    if (this.size === 0) {
      return;
    }
    this.update();
    gl = this.gl;
    defaultShader = GLESShaders.defaultShader;
    gl.useProgram(defaultShader.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.verticies);
    gl.vertexAttribPointer(defaultShader.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    if (this.__dirtyUVs) {
      this.__dirtyUVs = false;
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.uvs);
    }
    gl.vertexAttribPointer(defaultShader.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture._glTexture);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    if (this.__dirtyColors) {
      this.__dirtyColors = false;
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.colors);
    }
    gl.vertexAttribPointer(defaultShader.colorAttribute, 1, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    len = end - start;
    return gl.drawElements(gl.TRIANGLES, len * 6, gl.UNSIGNED_SHORT, start * 2 * 6);
  };

  return WebGLBatch;

})();

module.exports = WebGLBatch;


},{"cg":13,"rendering/Sprite":54,"rendering/core/RenderTypes":64,"rendering/renderers/webgl/GLESShaders":72}],74:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/*
@author Mat Groves http://matgroves.com/ @Doormat23
 */
var GLESRenderer, WebGLBatch, WebGLRenderer,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

GLESRenderer = require('rendering/renderers/webgl/GLESRenderer');

WebGLBatch = require('rendering/renderers/webgl/WebGLBatch');


/*
the WebGLRenderer is draws the stage and all its content onto a webGL enabled canvas. This renderer should be used for browsers support webGL. This Render works by automatically managing webGLBatchs. So no need for Sprite Batch's or Sprite Cloud's
Dont forget to add the view to your DOM or you will not see anything :)
@class WebGLRenderer
@constructor
@param width {Number} the width of the canvas view
@default 0
@param height {Number} the height of the canvas view
@default 0
@param view {Canvas} the canvas to use as a view, optional
@param transparent {Boolean} the transparency of the render view, default false
@default false
 */

WebGLRenderer = (function(_super) {
  __extends(WebGLRenderer, _super);

  function WebGLRenderer(width, height, view, transparent, textureFilter) {
    var contextName, e, options, scope, webGL, _i, _len, _ref;
    this.transparent = transparent;
    if (textureFilter == null) {
      textureFilter = 'linear';
    }
    this.view = view || document.createElement('canvas');
    this.view.width = this.width;
    this.view.height = this.height;
    scope = this;
    this.view.addEventListener('webglcontextlost', (function(event) {
      return scope.handleContextLost(event);
    }), false);
    this.view.addEventListener('webglcontextrestored', (function(event) {
      return scope.handleContextRestored(event);
    }), false);
    this.batchs = [];
    options = {
      alpha: this.transparent,
      antialias: false,
      premultipliedAlpha: true,
      stencil: true
    };
    _ref = ['experimental-webgl', 'webgl'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      contextName = _ref[_i];
      try {
        webGL = this.view.getContext(contextName, options);
        break;
      } catch (_error) {
        e = _error;
        console.log('WebGLRenderer: ');
        console.log(e);
        webGL = null;
      }
    }
    if (webGL == null) {
      throw new Error('This browser does not support WebGL. Try using the canvas renderer ' + this);
    }
    GLESRenderer.setBatchClass(WebGLBatch);
    WebGLRenderer.__super__.constructor.call(this, webGL, width, height, transparent, textureFilter);
  }


  /*
  @private
   */

  WebGLRenderer.prototype.handleContextLost = function(event) {
    event.preventDefault();
    return this.contextLost = true;
  };


  /*
  @private
   */

  WebGLRenderer.prototype.handleContextRestored = function(event) {
    var i;
    this.gl = this.view.getContext('experimental-webgl', {
      alpha: true
    });
    this.initShaders();
    i = 0;
    while (i < Texture.cache.length) {
      this.updateTexture(Texture.cache[i], this.textureFilter);
      i++;
    }
    i = 0;
    while (i < this.batchs.length) {
      this.batchs[i].restoreLostContext(this.gl);
      this.batchs[i].dirty = true;
      i++;
    }
    Batch._restoreBatchs(this.gl);
    return this.contextLost = false;
  };

  WebGLRenderer.prototype.resize = function(width, height) {
    this.view.width = width;
    this.view.height = height;
    this.view.style.width = width + 'px';
    this.view.style.height = height + 'px';
    return WebGLRenderer.__super__.resize.apply(this, arguments);
  };

  WebGLRenderer.prototype.getView = function() {
    return this.view;
  };

  WebGLRenderer.prototype.getContainerWidth = function() {
    return this.view.width;
  };

  WebGLRenderer.prototype.getContainerHeight = function() {
    return this.view.height;
  };

  return WebGLRenderer;

})(GLESRenderer);

module.exports = WebGLRenderer;


},{"rendering/renderers/webgl/GLESRenderer":71,"rendering/renderers/webgl/WebGLBatch":73}],75:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/**
@author Mat Groves http://matgroves.com/ @Doormat23
 */
var BaseTexture, HasSignals, Module,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Module = require('Module');

HasSignals = require('util/HasSignals');


/**
A texture stores the information that represents an image. All textures have a base texture

@class cg.BaseTexture
@extends cg.Module
@uses cg.util.HasSignals
@constructor
@param source {String} the source object (image or canvas)
 */

BaseTexture = (function(_super) {
  __extends(BaseTexture, _super);

  BaseTexture.mixin(HasSignals);

  BaseTexture.cache = {};

  BaseTexture.allTextures = [];

  BaseTexture.texturesToUpdate = [];

  BaseTexture.texturesToDestroy = [];

  function BaseTexture(source) {
    BaseTexture.__super__.constructor.apply(this, arguments);

    /**
    The width of the base texture set when the image has loaded
    
    @property width
    @type Number
    @final
     */
    this.width = 100;

    /**
    The height of the base texture set when the image has loaded
    
    @property height
    @type Number
    @final
     */
    this.height = 100;

    /**
    Describes if the base texture has loaded or not
    
    @property hasLoaded
    @type Boolean
    @final
     */
    this.hasLoaded = false;

    /**
    The source that is loaded to create the texture
    
    @property source
    @type Image
     */
    this.source = source;
    if (!source) {
      return;
    }
    if (!((this.source instanceof Image) || (this.source instanceof HTMLImageElement))) {
      this.hasLoaded = true;
      this.width = this.source.width;
      this.height = this.source.height;
      this.createCanvas(this.source);
    } else {
      if (this.source.complete) {
        this.hasLoaded = true;
        this.width = this.source.width;
        this.height = this.source.height;
        this.createCanvas(this.source);
        this.emit('loaded', this);
      } else {
        this.source.onerror = (function(_this) {
          return function() {
            return _this.emit('error', _this);
          };
        })(this);
        this.source.onload = (function(_this) {
          return function() {
            _this.hasLoaded = true;
            _this.width = _this.source.width;
            _this.height = _this.source.height;
            _this.createCanvas(_this.source);
            return _this.emit('loaded', _this);
          };
        })(this);
      }
    }
    this._powerOf2 = false;
    this.filterMode = void 0;
    BaseTexture.allTextures.push(this);
  }

  Object.defineProperty(BaseTexture.prototype, 'filterMode', {
    get: function() {
      var _ref;
      return (_ref = this.__filterMode) != null ? _ref : cg.textureFilter;
    },
    set: function(val) {
      this.__filterMode = val;
      return BaseTexture.texturesToUpdate.push(this);
    }
  });

  BaseTexture.prototype.beginRead = function() {
    return this._imageData != null ? this._imageData : this._imageData = this._ctx.getImageData(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
  };

  BaseTexture.prototype.getPixel = function(x, y) {
    var idx;
    idx = (x + y * this._imageData.width) * 4;
    return {
      r: this._imageData.data[idx + 0],
      g: this._imageData.data[idx + 1],
      b: this._imageData.data[idx + 2],
      a: this._imageData.data[idx + 3]
    };
  };

  BaseTexture.prototype.setPixel = function(x, y, rgba) {
    var idx;
    idx = (x + y * this._imageData.width) * 4;
    this._imageData.data[idx + 0] = rgba.r;
    this._imageData.data[idx + 1] = rgba.g;
    this._imageData.data[idx + 2] = rgba.b;
    return this._imageData.data[idx + 3] = rgba.a;
  };

  BaseTexture.prototype.endRead = function() {
    this._ctx.putImageData(this._imageData, 0, 0);
    return BaseTexture.texturesToUpdate.push(this);
  };

  BaseTexture.prototype.createCanvas = function(loadedImage) {
    if (typeof loadedImage.getContext !== 'function') {
      this.source = document.createElement('canvas');
      this.source.width = loadedImage.width;
      this.source.height = loadedImage.height;
    }
    this._ctx = this.source.getContext('2d');
    this._ctx.drawImage(loadedImage, 0, 0);
    this.beginRead();
    return this.endRead();
  };


  /**
  Destroys this base texture
  
  @method destroy
   */

  BaseTexture.prototype.destroy = function() {
    if (this.source instanceof Image) {
      this.source.src = null;
    }
    this.source = null;
    return BaseTexture.texturesToDestroy.push(this);
  };


  /**
  Helper function that returns a base texture based on an image url
  If the image is not in the base texture cache it will be  created and loaded
  
  @static
  @method fromImage
  @param imageUrl {String} The image url of the texture
  @return BaseTexture
   */

  BaseTexture.fromImage = function(imageUrl, crossorigin) {
    var baseTexture, image;
    baseTexture = BaseTexture.cache[imageUrl];
    if (!baseTexture) {
      image = new Image();
      if (crossorigin) {
        image.crossOrigin = "";
      }
      image.src = imageUrl;
      baseTexture = new BaseTexture(image);
      BaseTexture.cache[imageUrl] = baseTexture;
    }
    return baseTexture;
  };

  return BaseTexture;

})(Module);

module.exports = BaseTexture;


},{"Module":6,"util/HasSignals":93}],76:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/**
@author Mat Groves http://matgroves.com/ @Doormat23
 */
var BaseTexture, CanvasRenderer, GLESRenderGroup, GLESRenderer, Matrix, Point, Rectangle, RenderTexture, Texture,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Rectangle = require('rendering/core/Rectangle');

Point = require('rendering/core/Point');

Matrix = require('rendering/core/Matrix');

CanvasRenderer = require('rendering/renderers/canvas/CanvasRenderer');

GLESRenderer = require('rendering/renderers/webgl/GLESRenderer');

BaseTexture = require('rendering/textures/BaseTexture');

Texture = require('rendering/textures/Texture');

GLESRenderGroup = GLESRenderer.GLESRenderGroup;


/**
A RenderTexture is a special texture that allows any pixi displayObject to be rendered to it.

__Hint__: All DisplayObjects (exmpl. Sprites) that renders on RenderTexture should be preloaded.
Otherwise black rectangles will be drawn instead.

RenderTexture takes snapshot of DisplayObject passed to render method. If DisplayObject is passed to render method, position and rotation of it will be ignored. For example:

var renderTexture = new RenderTexture(800, 600);
var sprite = Sprite.fromImage("spinObj_01.png");
sprite.x = 800/2;
sprite.y = 600/2;
sprite.anchorX = 0.5;
sprite.anchorY = 0.5;
renderTexture.render(sprite);

Sprite in this case will be rendered to 0,0 position. To render this sprite at center DisplayObjectContainer should be used:

var doc = new DisplayObjectContainer();
doc.addChild(sprite);
renderTexture.render(doc);  // Renders to center of renderTexture

@class cg.RenderTexture
@extends cg.Texture
@constructor
@param width {Number} The width of the render texture
@param height {Number} The height of the render texture
 */

RenderTexture = (function(_super) {
  __extends(RenderTexture, _super);

  function RenderTexture(width, height, textureFilter, filterMode) {
    this.textureFilter = textureFilter != null ? textureFilter : 'linear';
    this.filterMode = filterMode != null ? filterMode : 'linear';
    this.width = width || 100;
    this.height = height || 100;
    this.identityMatrix = Matrix.mat3.create();
    this.frame = new Rectangle(0, 0, this.width, this.height);
    if (GLESRenderer.gl) {
      this.initGLES();
    } else {
      this.initCanvas();
    }
  }


  /**
  Initializes the webgl data for this texture
  
  @method initGLES
  @private
   */

  RenderTexture.prototype.initGLES = function() {
    var gl, glFilterMode;
    gl = GLESRenderer.gl;
    this.glFramebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.glFramebuffer);
    this.baseTexture = new BaseTexture();
    this.baseTexture.width = this.width;
    this.baseTexture.height = this.height;
    this.baseTexture._glTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.baseTexture._glTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    glFilterMode = GLESRenderer.getGLFilterMode(this.filterMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glFilterMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glFilterMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.baseTexture.isRender = true;
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.baseTexture._glTexture, 0);
    this.projection = new Point(this.width / 2, this.height / 2);
    this.projectionMatrix = Matrix.mat4.create();
    this.projectionMatrix[5] = 2 / this.height;
    this.projectionMatrix[13] = -1;
    this.projectionMatrix[0] = 2 / this.width;
    this.projectionMatrix[12] = -1;
    return this.render = this.renderGLES;
  };

  RenderTexture.prototype.resize = function(width, height) {
    var gl;
    this.width = width;
    this.height = height;
    this.projection = new Point(this.width / 2, this.height / 2);
    if (GLESRenderer.gl) {
      gl = GLESRenderer.gl;
      gl.bindTexture(gl.TEXTURE_2D, this.baseTexture._glTexture);
      return gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    } else {
      this.frame.width = this.width;
      this.frame.height = this.height;
      return this.renderer.resize(this.width, this.height);
    }
  };


  /**
  Initializes the canvas data for this texture
  
  @method initCanvas
  @private
   */

  RenderTexture.prototype.initCanvas = function() {
    this.renderer = new CanvasRenderer(this.width, this.height, null, false, this.textureFilter);
    this.baseTexture = new BaseTexture(this.renderer.view);
    this.frame = new Rectangle(0, 0, this.width, this.height);
    return this.render = this.renderCanvas;
  };


  /**
  This function will draw the display object to the texture.
  
  @method renderGLES
  @param displayObject {DisplayObject} The display object to render this texture on
  @param clear {Boolean} If true the texture will be cleared before the displayObject is drawn
  @private
   */

  RenderTexture.prototype.renderGLES = function(displayObject, position, clear) {
    var children, gl, i, j, renderGroup;
    gl = GLESRenderer.gl;
    gl.colorMask(true, true, true, true);
    gl.viewport(0, 0, this.width, this.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.glFramebuffer);
    if (clear) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    children = displayObject.children;
    displayObject.worldTransform = Matrix.mat3.create();
    i = 0;
    j = children.length;
    while (i < j) {
      children[i].__updateTransform();
      i++;
    }
    renderGroup = displayObject.__renderGroup;
    if (renderGroup) {
      if (displayObject === renderGroup.root) {
        return renderGroup.render(this.projection);
      } else {
        return renderGroup.renderSpecific(displayObject, this.projection);
      }
    } else {
      if (!this.renderGroup) {
        this.renderGroup = new GLESRenderGroup(gl, this.textureFilter);
      }
      this.renderGroup.setRenderable(displayObject);
      return this.renderGroup.render(this.projection);
    }
  };


  /**
  This function will draw the display object to the texture.
  
  @method renderCanvas
  @param displayObject {DisplayObject} The display object to render this texture on
  @param clear {Boolean} If true the texture will be cleared before the displayObject is drawn
  @private
   */

  RenderTexture.prototype.renderCanvas = function(displayObject, position, clear) {
    var children, i, imageSmoothingEnabled, j;
    children = displayObject.children;
    displayObject.worldTransform = Matrix.mat3.create();
    if (position) {
      displayObject.worldTransform[2] = position.x;
      displayObject.worldTransform[5] = position.y;
    }
    i = 0;
    j = children.length;
    while (i < j) {
      children[i].__updateTransform();
      i++;
    }
    imageSmoothingEnabled = this.textureFilter === 'nearest';
    this.renderer.context.imageSmoothingEnabled = imageSmoothingEnabled;
    this.renderer.context.webkitImageSmoothingEnabled = imageSmoothingEnabled;
    this.renderer.context.mozImageSmoothingEnabled = imageSmoothingEnabled;
    if (clear) {
      this.renderer.context.clearRect(0, 0, this.width, this.height);
    }
    this.renderer.renderDisplayObject(displayObject);
    return this.renderer.context.setTransform(1, 0, 0, 1, 0, 0);
  };

  return RenderTexture;

})(BaseTexture);

module.exports = RenderTexture;


},{"rendering/core/Matrix":60,"rendering/core/Point":61,"rendering/core/Rectangle":63,"rendering/renderers/canvas/CanvasRenderer":69,"rendering/renderers/webgl/GLESRenderer":71,"rendering/textures/BaseTexture":75,"rendering/textures/Texture":77}],77:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/**
@author Mat Groves http://matgroves.com/ @Doormat23
 */
var BaseTexture, HasSignals, Module, Point, Rectangle, Texture,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Module = require('Module');

HasSignals = require('util/HasSignals');

BaseTexture = require('rendering/textures/BaseTexture');

Rectangle = require('rendering/core/Rectangle');

Point = require('rendering/core/Point');


/**
A texture stores the information that represents an image or part of an image. It cannot be added
to the display list directly. To do this use Sprite. If no frame is provided then the whole image is used

@class cg.Texture
@extends cg.Module
@uses cg.util.HasSignals
@constructor
@param baseTexture {BaseTexture} The base texture source to create the texture from
@param frmae {Rectangle} The rectangle frame of the texture to show
 */

Texture = (function(_super) {
  __extends(Texture, _super);

  Texture.mixin(HasSignals);

  Texture.cache = {};

  Texture.frameUpdates = [];

  Object.defineProperty(Texture.prototype, 'filterMode', {
    get: function() {
      return this.baseTexture.filterMode;
    },
    set: function(val) {
      return this.baseTexture.filterMode = val;
    }
  });

  function Texture(baseTexture, frame) {
    Texture.__super__.constructor.apply(this, arguments);
    if (!frame) {
      this.noFrame = true;
      frame = new Rectangle(0, 0, 1, 1);
    }
    if (baseTexture instanceof Texture) {
      baseTexture = baseTexture.baseTexture;
    }

    /**
    The base texture of this texture
    
    @property baseTexture
    @type BaseTexture
     */
    this.baseTexture = baseTexture;

    /**
    The frame specifies the region of the base texture that this texture uses
    
    @property frame
    @type Rectangle
     */
    this.frame = frame;

    /**
    The trim point
    
    @property trim
    @type Point
     */
    this.trim = new Point();
    if (baseTexture.hasLoaded) {
      if (this.noFrame) {
        frame = new Rectangle(0, 0, baseTexture.width, baseTexture.height);
      }
      this.setFrame(frame);
    } else {
      baseTexture.on('loaded', (function(_this) {
        return function() {
          return _this.onBaseTextureLoaded();
        };
      })(this));
    }
  }


  /**
  Called when the base texture is loaded
  
  @method onBaseTextureLoaded
  @param event
  @private
   */

  Texture.prototype.onBaseTextureLoaded = function(event) {
    var baseTexture;
    baseTexture = this.baseTexture;
    if (this.noFrame) {
      this.frame = new Rectangle(0, 0, baseTexture.width, baseTexture.height);
    }
    this.noFrame = false;
    this.width = this.frame.width;
    this.height = this.frame.height;
    return this.emit('update', this);
  };


  /**
  Destroys this texture
  
  @method destroy
  @param destroyBase {Boolean} Whether to destroy the base texture as well
   */

  Texture.prototype.destroy = function(destroyBase) {
    if (destroyBase) {
      return this.baseTexture.destroy();
    }
  };


  /**
  Specifies the rectangle region of the baseTexture
  
  @method setFrame
  @param frame {Rectangle} The frame of the texture to set it to
   */

  Texture.prototype.setFrame = function(frame) {
    this.frame = frame;
    this.width = frame.width;
    this.height = frame.height;
    if (frame.x + frame.width > this.baseTexture.width || frame.y + frame.height > this.baseTexture.height) {
      throw new Error('Texture Error: frame does not fit inside the base Texture dimensions ' + this);
    }
    this._updateFrame = true;
    return Texture.frameUpdates.push(this);
  };

  Texture.prototype.getPixel = function(x, y) {
    return this.baseTexture.getPixel(this.frame.x + x, this.frame.y + y);
  };

  Texture.prototype.setPixel = function(x, y, rgba) {
    return this.baseTexture.setPixel(this.frame.x + x, this.frame.y + y, rgba);
  };

  Texture.prototype.beginRead = function() {
    return this.baseTexture.beginRead();
  };

  Texture.prototype.endRead = function() {
    return this.baseTexture.endRead();
  };


  /**
  Helper function that returns a texture based on an image url
  If the image is not in the texture cache it will be  created and loaded
  
  @static
  @method fromImage
  @param imageUrl {String} The image url of the texture
  @param crossorigin {Boolean} Whether requests should be treated as crossorigin
  @return Texture
   */

  Texture.fromImage = function(imageUrl, crossorigin) {
    var texture;
    texture = Texture.cache[imageUrl];
    if (!texture) {
      texture = new Texture(BaseTexture.fromImage(imageUrl, crossorigin));
      Texture.cache[imageUrl] = texture;
    }
    return texture;
  };


  /**
  Helper function that returns a texture based on a frame id
  If the frame id is not in the texture cache an error will be thrown
  
  @static
  @method fromFrame
  @param frameId {String} The frame id of the texture
  @return Texture
   */

  Texture.fromFrame = function(frameId) {
    var texture;
    texture = Texture.cache[frameId];
    if (!texture) {
      throw new Error("The frameId '" + frameId + "' does not exist in the texture cache " + this);
    }
    return texture;
  };


  /**
  Helper function that returns a texture based on a canvas element
  If the canvas is not in the texture cache it will be  created and loaded
  
  @static
  @method fromCanvas
  @param canvas {Canvas} The canvas element source of the texture
  @return Texture
   */

  Texture.fromCanvas = function(canvas) {
    var baseTexture;
    baseTexture = new BaseTexture(canvas);
    return new Texture(baseTexture);
  };


  /**
  Adds a texture to the textureCache.
  
  @static
  @method addTextureToCache
  @param texture {Texture}
  @param id {String} the id that the texture will be stored against.
   */

  Texture.addTextureToCache = function(texture, id) {
    return Texture.cache[id] = texture;
  };


  /**
  Remove a texture from the textureCache.
  
  @static
  @method removeTextureFromCache
  @param id {String} the id of the texture to be removed
  @return {cg.Texture} the texture that was removed
   */

  Texture.removeTextureFromCache = function(id) {
    var texture;
    texture = Texture.cache[id];
    Texture.cache[id] = null;
    return texture;
  };

  return Texture;

})(Module);

module.exports = Texture;


},{"Module":6,"rendering/core/Point":61,"rendering/core/Rectangle":63,"rendering/textures/BaseTexture":75,"util/HasSignals":93}],78:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */
var PolyK;

PolyK = {};


/*
Triangulates shapes for webGL graphic fills

@method Triangulate
@namespace PolyK
@constructor
 */

PolyK.Triangulate = function(p) {
  var al, avl, ax, ay, bx, cx, cy, earFound, i, i0, i1, i2, j, n, sign, tgs, vi, _by;
  sign = true;
  n = p.length >> 1;
  if (n < 3) {
    return [];
  }
  tgs = [];
  avl = [];
  i = 0;
  while (i < n) {
    avl.push(i);
    i++;
  }
  i = 0;
  al = n;
  while (al > 3) {
    i0 = avl[(i + 0) % al];
    i1 = avl[(i + 1) % al];
    i2 = avl[(i + 2) % al];
    ax = p[2 * i0];
    ay = p[2 * i0 + 1];
    bx = p[2 * i1];
    _by = p[2 * i1 + 1];
    cx = p[2 * i2];
    cy = p[2 * i2 + 1];
    earFound = false;
    if (PolyK._convex(ax, ay, bx, _by, cx, cy, sign)) {
      earFound = true;
      j = 0;
      while (j < al) {
        vi = avl[j];
        j++;
        if (vi === i0 || vi === i1 || vi === i2) {
          continue;
        }
        if (PolyK._PointInTriangle(p[2 * vi], p[2 * vi + 1], ax, ay, bx, _by, cx, cy)) {
          earFound = false;
          break;
        }
      }
    }
    if (earFound) {
      tgs.push(i0, i1, i2);
      avl.splice((i + 1) % al, 1);
      al--;
      i = 0;
    } else if (i++ > 3 * al) {
      if (sign) {
        tgs = [];
        avl = [];
        i = 0;
        while (i < n) {
          avl.push(i);
          i++;
        }
        i = 0;
        al = n;
        sign = false;
      } else {
        console.warn("Warning: shape too complex to fill");
        return [];
      }
    }
  }
  tgs.push(avl[0], avl[1], avl[2]);
  return tgs;
};


/*
Checks if a point is within a triangle

@class _PointInTriangle
@namespace PolyK
@private
 */

PolyK._PointInTriangle = function(px, py, ax, ay, bx, _by, cx, cy) {
  var dot00, dot01, dot02, dot11, dot12, invDenom, u, v, v0x, v0y, v1x, v1y, v2x, v2y;
  v0x = cx - ax;
  v0y = cy - ay;
  v1x = bx - ax;
  v1y = _by - ay;
  v2x = px - ax;
  v2y = py - ay;
  dot00 = v0x * v0x + v0y * v0y;
  dot01 = v0x * v1x + v0y * v1y;
  dot02 = v0x * v2x + v0y * v2y;
  dot11 = v1x * v1x + v1y * v1y;
  dot12 = v1x * v2x + v1y * v2y;
  invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
  u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  v = (dot00 * dot12 - dot01 * dot02) * invDenom;
  return (u >= 0) && (v >= 0) && (u + v < 1);
};


/*
Checks if a shape is convex

@class _convex
@namespace PolyK
@private
 */

PolyK._convex = function(ax, ay, bx, _by, cx, cy, sign) {
  return ((ay - _by) * (cx - bx) + (bx - ax) * (cy - _by) >= 0) === sign;
};

module.exports = PolyK;


},{}],79:[function(require,module,exports){
var HasSignals, Module, Music, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Module = require('Module');

HasSignals = require('util/HasSignals');


/**
A long sound that typically will only play one at a time.

Ideal for -- you guessed it -- background music.

@class cg.sound.Music
@extends cg.Module
@constructor
@param paths {String|Array<String>} A path or list of paths to attempt to load.
@param [volume=0.8] {Number} Value between 0 and 1 representing how loudly the music should play.
 */

Music = (function(_super) {
  __extends(Music, _super);

  Music.prototype.__setupBindings = function() {
    this.manager.on('musicVolumeChange', (function(_this) {
      return function() {
        return _this._setVolume(_this._getVolume());
      };
    })(this));
    return this.onMusicStopBinding = this.manager.on('musicStop', (function(_this) {
      return function() {
        return _this.stop();
      };
    })(this));
  };

  function Music(paths, volume, manager) {
    this.paths = paths;
    if (volume == null) {
      volume = 0.8;
    }
    this.manager = manager != null ? manager : cg.sound;
    if ((typeof this.paths) === 'string') {
      this.paths = [this.paths];
    }
    this.volume = volume;
    this.looping = true;
  }


  /**
  Value between 0 and 1 representing how loudly the music is playing/will play.
  @property volume
  @type Number
   */

  Object.defineProperty(Music.prototype, 'volume', {
    get: function() {
      return this._getVolume();
    },
    set: function(val) {
      return this._setVolume(val);
    }
  });


  /**
  `true` if the music will repeat indefinitely while playing, `false` otherwise.
  
  @property looping
  @type Boolean
   */

  Object.defineProperty(Music.prototype, 'looping', {
    get: function() {
      return this._getLooping();
    },
    set: function(val) {
      return this._setLooping(val);
    }
  });


  /**
  Specify the current volume of the music.
  
  @protected
  @method _setVolume
  @param volume {Number} Value between 0 and 1 representing how loudly to play the music.
  @chainable
   */

  Music.prototype._setVolume = function(__volume) {
    this.__volume = __volume;
    return this;
  };


  /**
  Retrieve the current volume of the music.
  
  @protected
  @method _getVolume
  @return {Number} Value between 0 and 1 representing how loudly the music is playing/will play.
   */

  Music.prototype._getVolume = function() {
    return this.__volume;
  };


  /**
  Specify whether this should repeat after it finishes playing.
  
  @protected
  @method _setLooping
  @param looping {Boolean} `true` if you wish for the music to repeat indefinitely while playing, `false` otherwise.
  @chainable
   */

  Music.prototype._setLooping = function(__looping) {
    this.__looping = __looping;
    return this;
  };


  /**
  Retrieve whether this should repeat after it finishes playing.
  
  @protected
  @method _getLooping
  @return {Boolean} `true` if the music will repeat indefinitely while playing, `false` otherwise.
   */

  Music.prototype._getLooping = function() {
    return this.__looping;
  };


  /**
  Calculate the final volume the music will be played at; this is the same as multiplying
  this music's volume (or the parameter passed in) by its manager's [`musicVolume`](cg.sound.SoundManager.html#property_musicVolume)
  
  @method getEffectiveVolume
  @param [volume=this.volume] {Number} Value between 0 and 1 representing how loudly to play the music.
   */

  Music.prototype.getEffectiveVolume = function(volume) {
    if (volume == null) {
      volume = this.volume;
    }
    return cg.math.clamp(this.manager.musicVolume * volume, 0, 1);
  };


  /**
  Attempt to load this music from the specified [`paths`](#property_paths).
  
  @method load
  @return {Promise} A promise that resolves once loading finishes, and rejects if the loading fails.
   */

  Music.prototype.load = function() {};

  Music.prototype._play = function() {
    throw new Error('Unimplemented version of Music::_play!');
  };

  Music.prototype._stop = function() {
    throw new Error('Unimplemented version of Music::_stop!');
  };


  /**
  Play the music.
  
  If the music is not yet loaded, it will attempt to load it, and if successful, begin playing.
  
  If it fails to load, a warning will be printed.
  @method play
  @param [volume] {Number} Value between 0 and 1 representing how loudly to play the music.
  @param [looping] {Boolean} `true` if you wish for the music to repeat indefinitely while playing, `false` otherwise.
  @chainable
   */

  Music.prototype.play = function(volume, looping) {
    if (volume == null) {
      volume = this.volume;
    }
    if (looping == null) {
      looping = this.looping;
    }
    this.__playing = true;
    this.volume = volume;
    this.looping = looping;
    this.load().then((function(_this) {
      return function() {
        if (!_this.__playing) {
          return;
        }
        return _this._play(_this.volume, _this.looping);
      };
    })(this), (function(_this) {
      return function() {
        return cg.warn('Music::play: Failed to load any of ' + (_this.paths.join(', ')) + '; aborting playback.');
      };
    })(this));
    return this;
  };


  /**
  Convenience method; like calling [`play`](#method_play) with the `looping` parameter set to true.
  @method loop
  @param [volume] {Number} Value between 0 and 1 representing how loudly to play the music.
  @chainable
   */

  Music.prototype.loop = function(volume) {
    if (volume == null) {
      volume = this.volume;
    }
    return this.play(volume, true);
  };


  /**
  Stop playback of this music.
  
  If `stop` is invoked after `play`, but before the music is loaded, playback will be cancelled,
  but the music will continue to load.
  
  @method stop
  @chainable
   */

  Music.prototype.stop = function() {
    this.__playing = false;
    this._stop();
    return this;
  };


  /**
  Slide the volume to a specified level.
  
  @method fadeTo
  @param level {Number} The value to slide [`volume`](#property_volume) to.
  @param [duration=2000] {Number(milliseconds)} The length of time the slide will take.
  @param [easeFunc='quad.in'|'quad.out'] {String|Function} The ease function to use with
  the [`Tween`](cg.Tween.html) that alters [`volume`](#property_volume)
  
  By default, if `level` is greater than [`volume`](#property_volume), 'quaratic.in' is used,
  otherwise 'quad.out' is used.
  
  If the music is not already playing, it will begin playing from the beginning.
  
  @return {Promise} A promise that resolves as soon as the slide completes.
   */

  Music.prototype.fadeTo = function(level, duration, easeFunc) {
    var _ref;
    if (duration == null) {
      duration = 2000;
    }
    if (!this.__playing) {
      this.play();
    }
    if (easeFunc == null) {
      easeFunc = level > this.volume ? 'quad.in' : 'quad.out';
    }
    if ((_ref = this.__fade) != null) {
      _ref.stop();
    }
    return this.__fade = cg.tween(this, {
      values: {
        volume: level
      },
      duration: duration,
      easeFunc: easeFunc
    });
  };


  /**
  Slide the volume level down to a given level.
  
  If the `level` argument is zero, playback will automatically stop once the slide completes.
  
  @method fadeOut
  @param [duration=2000] {Number(milliseconds)} The length of time it should take to fade out before stopping.
  @param [level=0] {Number} The value to slide [`volume`](#property_volume) down to from its current level.
  @param [easeFunc='quad.out'] {String|Function} The ease function to use with
  the [`Tween`](cg.Tween.html) that alters [`volume`](#property_volume)
  @return {Promise} A promise that resolves as soon as the slide completes.
   */

  Music.prototype.fadeOut = function(duration, level, easeFunc) {
    var _ref;
    if (duration == null) {
      duration = 2000;
    }
    if (level == null) {
      level = 0;
    }
    if (easeFunc == null) {
      easeFunc = 'quad.out';
    }
    if ((_ref = this.__fade) != null) {
      _ref.stop();
    }
    return this.__fade = cg.tween(this, {
      values: {
        volume: level
      },
      duration: duration,
      easeFunc: easeFunc
    }).then((function(_this) {
      return function() {
        if (_this.volume === 0) {
          return _this.stop();
        }
      };
    })(this));
  };


  /**
  Slide the volume level up to a given level.
  
  If the music is not yet loaded, it will attempt to load it, and if successful, begin playing.
  If it fails to load, a warning will be printed.
  
  If the music is not already playing, [`volume`](#property_volume) will be set to zero, and it will begin
  playing from the beginning.
  
  @method fadeIn
  @param [duration=2000] {Number(milliseconds)} The length of time it should take to fade out before stopping.
  @param [level=0.8] {Number} The value to slide [`volume`](#property_volume) up to from zero.
  @param [easeFunc='quad.in'] {String|Function} The ease function to use with
  the [`Tween`](cg.Tween.html) that alters [`volume`](#property_volume)
  @return {Promise} A promise that resolves as soon as the fade in completes.
   */

  Music.prototype.fadeIn = function(duration, level, easeFunc) {
    if (duration == null) {
      duration = 2000;
    }
    if (level == null) {
      level = 0.8;
    }
    if (easeFunc == null) {
      easeFunc = 'quad.in';
    }
    return this.load().then((function(_this) {
      return function() {
        var _ref;
        if (!_this.__playing) {
          _this.volume = 0;
          _this.play();
        }
        if ((_ref = _this.__fade) != null) {
          _ref.stop();
        }
        return _this.__fade = cg.tween(_this, {
          values: {
            volume: level
          },
          duration: duration,
          easeFunc: easeFunc
        });
      };
    })(this));
  };

  return Music;

})(Module);

module.exports = Music;


},{"Module":6,"cg":13,"util/HasSignals":93}],80:[function(require,module,exports){
var Module, Sound, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Module = require('Module');


/**
A (relatively) short sound that is capable of being played multiple times simultaneously; a sound effect.

@class cg.sound.Sound
@extends cg.Module
@constructor
@param paths {String|Array<String>} A path or list of paths to attempt to load.
@param [volume=0.8] {Number} Value between 0 and 1 representing how loudly the sound should play.
@param [numChannels=4] {Number} Sets the value of [`numChannels`](#property_numChannels))
 */

Sound = (function(_super) {
  __extends(Sound, _super);

  Sound.prototype.__setupBindings = function() {
    this.onSfxVolumeChangeBinding = this.manager.on('sfxVolumeChange', (function(_this) {
      return function() {
        return _this._setVolume(_this._getVolume());
      };
    })(this));
    return this.onSfxStopBinding = this.manager.on('sfxStop', (function(_this) {
      return function() {
        return _this.stop();
      };
    })(this));
  };

  function Sound(paths, volume, numChannels, manager) {
    var format, path;
    this.paths = paths;
    if (numChannels == null) {
      numChannels = cg.sound.defaultSfxChannelCount;
    }
    this.manager = manager != null ? manager : cg.sound;
    if ((typeof this.paths) === 'string') {
      if (this.paths.length > 0 && (this.paths[this.paths.length - 1] === '*')) {
        path = this.paths.substr(0, this.paths.length - 1);
        this.paths = (function() {
          var _i, _len, _ref, _results;
          _ref = cg.sound.formats;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            format = _ref[_i];
            _results.push(path + format);
          }
          return _results;
        })();
      } else {
        this.paths = [this.paths];
      }
    }
    this.volume = volume;

    /**
    The number of instances of this sound that may be played simultaneously. Originally set in the constructor; cannot be altered.
    @property numChannels
    @type Number
    @final
     */
    Object.defineProperty(this, 'numChannels', {
      value: numChannels
    });
  }


  /**
  Value between 0 and 1 representing how loudly the sound is playing/will play.
  @property volume
  @type Number
   */

  Object.defineProperty(Sound.prototype, 'volume', {
    get: function() {
      return this._getVolume();
    },
    set: function(val) {
      return this._setVolume(val);
    }
  });


  /**
  `true` if the sound will repeat indefinitely while playing, `false` otherwise.
  
  @property looping
  @type Boolean
   */

  Object.defineProperty(Sound.prototype, 'looping', {
    get: function() {
      return this._getLooping();
    },
    set: function(val) {
      return this._setLooping(val);
    }
  });


  /**
  Specify the current volume of the sound.
  
  @protected
  @method _setVolume
  @param volume {Number} Value between 0 and 1 representing how loudly to play the sound.
  @chainable
   */

  Sound.prototype._setVolume = function(__volume) {
    this.__volume = __volume;
    return this;
  };


  /**
  Retrieve the current volume of the sound.
  
  @protected
  @method _getVolume
  @return {Number} Value between 0 and 1 representing how loudly the sound is playing/will play.
   */

  Sound.prototype._getVolume = function() {
    return this.__volume;
  };


  /**
  Specify whether this should repeat after it finishes playing.
  
  @protected
  @method _setLooping
  @param looping {Boolean} `true` if you wish for the sound to repeat indefinitely while playing, `false` otherwise.
  @chainable
   */

  Sound.prototype._setLooping = function(__looping) {
    this.__looping = __looping;
    return this;
  };


  /**
  Retrieve whether this should repeat after it finishes playing.
  
  @protected
  @method _getLooping
  @return {Boolean} `true` if the sound will repeat indefinitely while playing, `false` otherwise.
   */

  Sound.prototype._getLooping = function() {
    return this.__looping;
  };


  /**
  Calculate the final volume the sound will be played at; this is the same as multiplying
  this sound's volume (or the parameter passed in) by its manager's [`sfxVolume`](cg.sound.SoundManager.html#property_sfxVolume)
  
  @method getEffectiveVolume
  @param [volume=this.volume] {Number} Value between 0 and 1 representing how loudly to play the sound.
   */

  Sound.prototype.getEffectiveVolume = function(volume) {
    if (volume == null) {
      volume = this.__volume;
    }
    return cg.math.clamp(this.manager.sfxVolume * volume, 0, 1);
  };


  /**
  Attempt to load this sound from the specified [`paths`](#property_paths).
  
  @method load
  @return {Promise} A promise that resolves once loading finishes, and rejects if the loading fails.
   */

  Sound.prototype.load = function() {};

  Sound.prototype._play = function() {
    throw new Error('Unimplemented version of Sound::_play!');
  };

  Sound.prototype._stop = function() {
    throw new Error('Unimplemented version of Sound::_stop!');
  };


  /**
  The channel number that was used the last time [`play`](#method_play) or [`loop`](#method_loop) was invoked.
  
  @property channel
  @type Number
   */

  Object.defineProperty(Sound.prototype, 'channel', {
    get: function() {
      return this.__channel;
    }
  });


  /**
  Play the sound.
  
  If all channels are busy, the least-recently-active channel will be interrupted, otherwise
  the first available is used.
  
  **NOTE:** Unlike [`Music::play`](cg.sound.Music.html#method_play), if `Sound::play` is called before a `Sound` is loaded, it will simply
  fail to play, and print a warning.
  
  @method play
  @param [volume=[`this.volume`](#property_volume)] {Number} Value between 0 and 1 representing how loudly to play the sound.
  @param [looping] {Boolean} `true` if you wish for the sound to repeat indefinitely while playing, `false` otherwise.
  @chainable
   */

  Sound.prototype.play = function(volume, looping) {
    if (volume == null) {
      volume = this.volume;
    }
    if (looping == null) {
      looping = this.looping;
    }
    this.__channel = this._play(volume, looping);
    return this;
  };


  /**
  Convenience method; like calling [`play`](#method_play) with the `looping` parameter set to true.
  @method loop
  @param [volume] {Number} Value between 0 and 1 representing how loudly to play the sound.
  @chainable
   */

  Sound.prototype.loop = function(volume) {
    if (volume == null) {
      volume = this.volume;
    }
    this.play(volume, true);
    return this;
  };


  /**
  Stop playback of this sound.
  
  @method stop
  @param [channel] {Number}
  The channel number to stop; if unspecified, playback on all channels will be stopped.
  @chainable
   */

  Sound.prototype.stop = function(channel) {
    this._stop(channel);
    return this;
  };


  /**
  Slide the volume (of all channels) to a specified level.
  
  @method fadeTo
  @param level {Number} The value to slide [`volume`](#property_volume) to.
  @param [duration=2000] {Number(milliseconds)} The length of time the slide will take.
  @param [easeFunc='quad.in'|'quad.out'] {String|Function} The ease function to use with
  the [`Tween`](cg.Tween.html) that alters [`volume`](#property_volume)
  
  By default, if `level` is greater than [`volume`](#property_volume), 'quaratic.in' is used,
  otherwise 'quad.out' is used.
  @return {Promise} A promise that resolves as soon as the slide completes.
   */

  Sound.prototype.fadeTo = function(level, duration, easeFunc) {
    var _ref;
    if (duration == null) {
      duration = 2000;
    }
    if (easeFunc == null) {
      easeFunc = level > this.volume ? 'quad.in' : 'quad.out';
    }
    if ((_ref = this.__fade) != null) {
      _ref.stop();
    }
    return this.__fade = cg.tween(this, {
      values: {
        volume: level
      },
      duration: duration,
      easeFunc: easeFunc
    });
  };


  /**
  Slide the volume level (of all channels) down to a given level.
  
  If the `level` argument is zero, playback will automatically stop once the slide completes.
  
  @method fadeOut
  @param [duration=2000] {Number(milliseconds)} The length of time it should take to fade out before stopping.
  @param [level=0] {Number} The value to slide [`volume`](#property_volume) down to from its current level.
  @param [easeFunc='quad.out'] {String|Function} The ease function to use with
  the [`Tween`](cg.Tween.html) that alters [`volume`](#property_volume)
  @return {Promise} A promise that resolves as soon as the slide completes.
   */

  Sound.prototype.fadeOut = function(duration, level, easeFunc) {
    var _ref;
    if (duration == null) {
      duration = 2000;
    }
    if (level == null) {
      level = 0;
    }
    if (easeFunc == null) {
      easeFunc = 'quad.out';
    }
    if ((_ref = this.__fade) != null) {
      _ref.stop();
    }
    return this.__fade = cg.tween(this, {
      values: {
        volume: level
      },
      duration: duration,
      easeFunc: easeFunc
    }).then((function(_this) {
      return function() {
        if (_this.volume === 0) {
          return _this.stop();
        }
      };
    })(this));
  };


  /**
  Slide the volume level (of all channels) up to a given level.
  
  @method fadeIn
  @param [duration=2000] {Number(milliseconds)} The length of time it should take to fade out before stopping.
  @param [level=0.8] {Number} The value to slide [`volume`](#property_volume) up to from zero.
  @param [easeFunc='quad.in'] {String|Function} The ease function to use with
  the [`Tween`](cg.Tween.html) that alters [`volume`](#property_volume)
  @return {Promise} A promise that resolves as soon as the fade in completes.
   */

  Sound.prototype.fadeIn = function(duration, level, easeFunc) {
    var _ref;
    if (duration == null) {
      duration = 2000;
    }
    if (level == null) {
      level = 0.8;
    }
    if (easeFunc == null) {
      easeFunc = 'quad.in';
    }
    if ((_ref = this.__fade) != null) {
      _ref.stop();
    }
    return this.__fade = cg.tween(this, {
      values: {
        volume: level
      },
      duration: duration,
      easeFunc: easeFunc
    });
  };

  return Sound;

})(Module);

module.exports = Sound;


},{"Module":6,"cg":13}],81:[function(require,module,exports){
var HasSignals, Module, SoundManager, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Module = require('Module');

HasSignals = require('util/HasSignals');


/**
Control playback of all music and sound effects.

@class cg.sound.SoundManager
@extends cg.Module
 */

SoundManager = (function(_super) {
  __extends(SoundManager, _super);

  SoundManager.mixin(HasSignals);

  SoundManager.prototype.formats = ['ogg', 'mp3', 'm4a', 'wav'];

  function SoundManager() {
    this.defaultSfxChannelCount = 4;
    this.sfxVolume = 1;
    this.musicVolume = 1;
  }


  /**
  Emitted whenever [`musicVolume`](#property_musicVolume) changes.
  
  @event musicVolumeChange
  @param level {Number} The new value of `musicVolume`
   */


  /**
  Volume multiplier applied to all music playback.
  
  @property musicVolume
  @type Number
  @default 1.0
   */

  Object.defineProperty(SoundManager.prototype, 'musicVolume', {
    get: function() {
      return this._musicVolume;
    },
    set: function(level) {
      this._musicVolume = level;
      return this.emit('musicVolumeChange', level);
    }
  });


  /**
  Emitted whenever [`sfxVolume`](#property_sfxVolume) changes.
  
  @event sfxVolumeChange
  @param level {Number} The new value of `sfxVolume`
   */


  /**
  Volume multiplier applied to all sound effect playback.
  
  @property sfxVolume
  @type Number
  @default 1.0
   */

  Object.defineProperty(SoundManager.prototype, 'sfxVolume', {
    get: function() {
      return this._sfxVolume;
    },
    set: function(level) {
      this._sfxVolume = level;
      return this.emit('sfxVolumeChange', level);
    }
  });


  /**
  Stop playback of all music.
  
  @method stopAllMusic
  @chainable
   */

  SoundManager.prototype.stopAllMusic = function() {
    this.emit('musicStop', this);
    return this;
  };


  /**
  Stop playback of all sound effects.
  
  @method stopAllSfx
  @chainable
   */

  SoundManager.prototype.stopAllSfx = function() {
    this.emit('sfxStop', this);
    return this;
  };


  /**
  Stop playback of all music and sound effects.
  
  @method stopAll
  @chainable
   */

  SoundManager.prototype.stopAll = function() {
    this.stopAllSfx();
    this.stopAllMusic();
    return this;
  };


  /**
  Slide [`sfxVolume`](#property_sfxVolume) to a specified level.
  
  @method fadeSfxTo
  @param level {Number} The value to slide [`sfxVolume`](#property_sfxVolume) to.
  @param [duration=2000] {Number(milliseconds)} The length of time the slide will take.
  @param [easeFunc='quad.in'|'quad.out'] {String|Function} The ease function to use with 
  the [`Tween`](cg.Tween.html) that alters [`sfxVolume`](#property_sfxVolume)
  
  By default, if `level` is greater than [`sfxVolume`](#property_sfxVolume), 'quad.in' is used,
  otherwise 'quad.out' is used.
  @return {Promise} A promise that resolves as soon as the slide completes.
   */

  SoundManager.prototype.fadeSfxTo = function(level, duration, easeFunc) {
    if (duration == null) {
      duration = 2000;
    }
    if (easeFunc == null) {
      easeFunc = level > this.sfxVolume ? 'quad.in' : 'quad.out';
    }
    return cg.tween(this, {
      values: {
        sfxVolume: level
      },
      duration: duration,
      easeFunc: easeFunc
    });
  };


  /**
  Slide the [`sfxVolume`](#property_sfxVolume) level down to a given level.
  
  If the `level` argument is zero, all sound effects playing will be stopped.
  
  @method fadeSfxOut
  @param [duration=2000] {Number(milliseconds)} The length of time it should take to fade out before stopping.
  @param [level=0] {Number} The value to slide [`sfxVolume`](#property_sfxVolume) down to from its current level.
  @param [easeFunc='quad.out'] {String|Function} The ease function to use with 
  the [`Tween`](cg.Tween.html) that alters [`sfxVolume`](#property_volume)
  @return {Promise} A promise that resolves as soon as the slide completes.
   */

  SoundManager.prototype.fadeSfxOut = function(duration, level, easeFunc) {
    if (duration == null) {
      duration = 2000;
    }
    if (level == null) {
      level = 0;
    }
    if (easeFunc == null) {
      easeFunc = 'quad.out';
    }
    return cg.tween(this, {
      values: {
        sfxVolume: level
      },
      duration: duration,
      easeFunc: easeFunc
    }).then((function(_this) {
      return function() {
        if (_this.sfxVolume === 0) {
          return _this.stopAllSfx();
        }
      };
    })(this));
  };


  /**
  Set [`sfxVolume`](#property_sfxVolume) to zero then slide it up to a given level.
  
  @method fadeSfxIn
  @param [duration=2000] {Number(milliseconds)} The length of time it should take to fade out before stopping.
  @param [level=0.8] {Number} The value to slide [`sfxVolume`](#property_sfxVolume) up to from zero.
  @param [easeFunc='quad.in'] {String|Function} The ease function to use with 
  the [`Tween`](cg.Tween.html) that alters [`sfxVolume`](#property_sfxVolume)
  @return {Promise} A promise that resolves as soon as the fade in completes.
   */

  SoundManager.prototype.fadeSfxIn = function(duration, level, easeFunc) {
    if (duration == null) {
      duration = 2000;
    }
    if (level == null) {
      level = 0.8;
    }
    if (easeFunc == null) {
      easeFunc = 'quad.in';
    }
    this.sfxVolume = 0;
    return cg.tween(this, {
      values: {
        volume: level
      },
      duration: duration,
      easeFunc: easeFunc
    });
  };


  /**
  Slide [`musicVolume`](#property_musicVolume) to a specified level.
  
  @method fadeMusicTo
  @param level {Number} The value to slide [`musicVolume`](#property_musicVolume) to.
  @param [duration=2000] {Number(milliseconds)} The length of time the slide will take.
  @param [easeFunc='quad.in'|'quad.out'] {String|Function} The ease function to use with 
  the [`Tween`](cg.Tween.html) that alters [`musicVolume`](#property_musicVolume)
  
  By default, if `level` is greater than [`musicVolume`](#property_musicVolume), 'quad.in' is used,
  otherwise 'quad.out' is used.
  @return {Promise} A promise that resolves as soon as the slide completes.
   */

  SoundManager.prototype.fadeMusicTo = function(level, duration, easeFunc) {
    if (duration == null) {
      duration = 2000;
    }
    if (easeFunc == null) {
      easeFunc = level > this.musicVolume ? 'quad.in' : 'quad.out';
    }
    return cg.tween(this, {
      values: {
        musicVolume: level
      },
      duration: duration,
      easeFunc: easeFunc
    });
  };


  /**
  Slide [`musicVolume`](#property_musicVolume) level down to a given level.
  
  If the `level` argument is zero, all sound effects playing will be stopped.
  
  @method fadeMusicOut
  @param [duration=2000] {Number(milliseconds)} The length of time it should take to fade out before stopping.
  @param [level=0] {Number} The value to slide [`musicVolume`](#property_musicVolume) down to from its current level.
  @param [easeFunc='quad.out'] {String|Function} The ease function to use with 
  the [`Tween`](cg.Tween.html) that alters [`musicVolume`](#property_volume)
  @return {Promise} A promise that resolves as soon as the slide completes.
   */

  SoundManager.prototype.fadeMusicOut = function(duration, level, easeFunc) {
    if (duration == null) {
      duration = 2000;
    }
    if (level == null) {
      level = 0;
    }
    if (easeFunc == null) {
      easeFunc = 'quad.out';
    }
    return cg.tween(this, {
      values: {
        musicVolume: level
      },
      duration: duration,
      easeFunc: easeFunc
    }).then((function(_this) {
      return function() {
        if (_this.musicVolume === 0) {
          return _this.stopAllSfx();
        }
      };
    })(this));
  };


  /**
  Set [`musicVolume`](#property_musicVolume) to zero then slide it up to a given level.
  
  @method fadeMusicIn
  @param [duration=2000] {Number(milliseconds)} The length of time it should take to fade out before stopping.
  @param [level=0.8] {Number} The value to slide [`musicVolume`](#property_musicVolume) up to from zero.
  @param [easeFunc='quad.in'] {String|Function} The ease function to use with 
  the [`Tween`](cg.Tween.html) that alters [`musicVolume`](#property_musicVolume)
  @return {Promise} A promise that resolves as soon as the fade in completes.
   */

  SoundManager.prototype.fadeMusicIn = function(duration, level, easeFunc) {
    if (duration == null) {
      duration = 2000;
    }
    if (level == null) {
      level = 0.8;
    }
    if (easeFunc == null) {
      easeFunc = 'quad.in';
    }
    this.musicVolume = 0;
    return cg.tween(this, {
      values: {
        musicVolume: level
      },
      duration: duration,
      easeFunc: easeFunc
    });
  };

  return SoundManager;

})(Module);

module.exports = SoundManager;


},{"Module":6,"cg":13,"util/HasSignals":93}],82:[function(require,module,exports){
var BitmapFont, Rectangle, Texture, cg;

cg = require('cg');

Rectangle = require('rendering/core/Rectangle');

Texture = require('rendering/textures/Texture');


/**
**NOTE**: This API is expected to change dramatically or even be replaced; use at your own risk!
@class cg.text.BitmapFont
 */

BitmapFont = (function() {
  function BitmapFont(texture, spacing, lineHeight, startChar) {
    var alpha, char, charHeight, charWidth, pixel, texHeight, texWidth, x, y;
    this.texture = texture;
    this.spacing = spacing != null ? spacing : 1.0;
    this.lineHeight = lineHeight != null ? lineHeight : 1.0;
    if (startChar == null) {
      startChar = ' ';
    }
    if (typeof this.texture === 'string') {
      this.texture = cg.assets.textures[this.texture];
    }
    texWidth = this.texture.width;
    texHeight = this.texture.height;
    this.textures = {};
    x = 0;
    y = texHeight - 1;
    char = startChar;
    charWidth = 0;
    this.charHeight = charHeight = texHeight - 1;
    this.texture.beginRead();
    while (x < texWidth) {
      pixel = this.texture.getPixel(x, y);
      alpha = pixel != null ? pixel.a : void 0;
      pixel.a = 0;
      this.texture.setPixel(x, y, pixel);
      if (alpha == null) {
        throw new Error('Unexpected issue loading BitmapFont; could not retrieve pixel at (' + x + ', ' + y + ')');
      }
      ++charWidth;
      ++x;
      if (alpha <= 0) {
        this.textures[char] = new Texture(this.texture.baseTexture, new Rectangle(x - charWidth, 0, charWidth, charHeight));
        charWidth = 0;
        char = String.fromCharCode(char.charCodeAt(0) + 1);
      }
    }
    this.texture.endRead();
  }

  BitmapFont.prototype.widthOf = function(str, spacing) {
    var ch, i, width, _ref, _ref1;
    if (spacing == null) {
      spacing = this.spacing;
    }
    width = 0;
    i = 0;
    while (i < str.length) {
      ch = str[i];
      width += (((_ref = this.textures[ch]) != null ? (_ref1 = _ref.frame) != null ? _ref1.width : void 0 : void 0) || 0) * spacing;
      ++i;
    }
    return width;
  };

  return BitmapFont;

})();

module.exports = BitmapFont;


},{"cg":13,"rendering/core/Rectangle":63,"rendering/textures/Texture":77}],83:[function(require,module,exports){

/*
combo.js - Copyright 2012-2013 Louis Acresti - All Rights Reserved
 */
var Actor, BitmapFont, BitmapText, Sprite, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

BitmapFont = require('text/BitmapFont');

Actor = require('Actor');

Sprite = require('rendering/Sprite');


/**
**NOTE**: This API is expected to change dramatically or even be replaced; use at your own risk!

@class cg.text.BitmapText
@extends cg.Actor
 */

BitmapText = (function(_super) {
  __extends(BitmapText, _super);

  function BitmapText(font, string, params) {
    this.font = font;
    this.string = string != null ? string : '';
    BitmapText.__super__.constructor.call(this, params);
    if (this.lineHeight == null) {
      this.lineHeight = this.font.lineHeight;
    }
    if (this.spacing == null) {
      this.spacing = this.font.spacing;
    }
    this.width = 0;
    this.height = 0;
    this.updateText();
  }

  BitmapText.prototype.updateText = function() {
    var ch, charSprite, i, left, lines, str, th, top, tw, width, widths, _i, _j, _len, _len1, _results;
    this.clearChildren();
    th = this.font.charHeight * this.lineHeight;
    lines = this.string.split('\n');
    this.height = th * lines.length;
    widths = [];
    for (_i = 0, _len = lines.length; _i < _len; _i++) {
      str = lines[_i];
      width = this.font.widthOf(str, this.spacing);
      this.width = Math.max(this.width, width);
      widths.push(width);
    }
    switch (this.alignment) {
      case 'center':
        this.pivotX = this.width / 2;
        this.pivotY = this.height / 2;
        break;
      case 'left':
        this.pivotX = 0;
        this.pivotY = 0;
        break;
      case 'right':
        this.pivotX = this.width;
        this.pivotY = 0;
    }
    top = 0;
    _results = [];
    for (i = _j = 0, _len1 = lines.length; _j < _len1; i = ++_j) {
      str = lines[i];
      width = widths[i];
      if (this.alignment === 'center') {
        left = (this.width - width) / 2;
      } else {
        left = 0;
      }
      i = 0;
      while (i < str.length) {
        ch = str[i];
        tw = this.font.widthOf(ch);
        if (tw > 0) {
          charSprite = this.addChild(new Sprite(this.font.textures[ch]));
          charSprite.x = left;
          charSprite.y = top;
        }
        left += tw * this.spacing;
        ++i;
      }
      _results.push(top += th);
    }
    return _results;
  };

  return BitmapText;

})(Actor);

module.exports = BitmapText;


},{"Actor":2,"cg":13,"rendering/Sprite":54,"text/BitmapFont":82}],84:[function(require,module,exports){

/*
The MIT License

Copyright (c) 2013-2014 Mathew Groves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/**
@author Mat Groves http://matgroves.com/ @Doormat23
 */
var BaseTexture, PixiText, Point, Sprite, Texture,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Sprite = require('rendering/Sprite');

Texture = require('rendering/textures/Texture');

BaseTexture = require('rendering/textures/BaseTexture');

Point = require('rendering/core/Point');


/**
A PixiText Object will create a line(s) of text to split a line you can use "\n"

**NOTE**: This API is expected to change dramatically or even be replaced; use at your own risk!

@class cg.text.PixiText
@extends cg.rendering.Sprite
@constructor
@param text {String} The copy that you would like the text to display
@param [style] {Object} The style parameters
@param [style.font] {String} default "bold 20pt Arial" The style and size of the font
@param [style.fill="black"] {Object} A canvas fillstyle that will be used on the text eg "red", "#00FF00"
@param [style.align="left"] {String} An alignment of the multiline text ("left", "center" or "right")
@param [style.stroke] {String} A canvas fillstyle that will be used on the text stroke eg "blue", "#FCFF00"
@param [style.strokeThickness=0] {Number} A number that represents the thickness of the stroke. Default is 0 (no stroke)
@param [style.wordWrap=false] {Boolean} Indicates if word wrap should be used
@param [style.wordWrapWidth=100] {Number} The width at which text will wrap
 */

PixiText = (function(_super) {
  __extends(PixiText, _super);

  PixiText.heightCache = {};

  function PixiText(text, style) {
    var canvas;
    canvas = document.createElement("canvas");
    PixiText.__super__.constructor.call(this, Texture.fromCanvas(canvas));
    this.canvas = this.texture.baseTexture.source;
    this.context = this.texture.baseTexture._ctx;
    this.setText(text);
    this.setStyle(style);
    this.updateText();
    this.dirty = false;
  }


  /**
  Set the style of the text
  
  @method setStyle
  @param [style] {Object} The style parameters
  @param [style.font="bold 20pt Arial"] {String} The style and size of the font
  @param [style.fill="black"] {Object} A canvas fillstyle that will be used on the text eg "red", "#00FF00"
  @param [style.align="left"] {String} An alignment of the multiline text ("left", "center" or "right")
  @param [style.stroke="black"] {String} A canvas fillstyle that will be used on the text stroke eg "blue", "#FCFF00"
  @param [style.strokeThickness=0] {Number} A number that represents the thickness of the stroke. Default is 0 (no stroke)
  @param [style.wordWrap=false] {Boolean} Indicates if word wrap should be used
  @param [style.wordWrapWidth=100] {Number} The width at which text will wrap
   */

  PixiText.prototype.setStyle = function(style) {
    style = style || {};
    style.font = style.font || "bold 20pt Arial";
    style.fill = style.fill || "black";
    style.align = style.align || "left";
    style.stroke = style.stroke || "black";
    style.strokeThickness = style.strokeThickness || 0;
    style.wordWrap = style.wordWrap || false;
    style.wordWrapWidth = style.wordWrapWidth || 100;
    this.style = style;
    return this.dirty = true;
  };


  /**
  Set the copy for the text object. To split a line you can use "\n"
  
  @methos setText
  @param {String} text The copy that you would like the text to display
   */

  PixiText.prototype.setText = function(text) {
    this.text = text.toString() || " ";
    return this.dirty = true;
  };


  /**
  Renders text
  
  @method updateText
  @private
   */

  PixiText.prototype.updateText = function() {
    var i, lineHeight, linePosition, lineWidth, lineWidths, lines, maxLineWidth, outputText;
    this.context.font = this.style.font;
    outputText = this.text;
    if (this.style.wordWrap) {
      outputText = this.wordWrap(this.text);
    }
    lines = outputText.split(/(?:\r\n|\r|\n)/);
    lineWidths = [];
    maxLineWidth = 0;
    i = 0;
    while (i < lines.length) {
      lineWidth = this.context.measureText(lines[i]).width;
      lineWidths[i] = lineWidth;
      maxLineWidth = Math.max(maxLineWidth, lineWidth);
      i++;
    }
    this.width = this.canvas.width = maxLineWidth + this.style.strokeThickness;
    lineHeight = this.determineFontHeight("font: " + this.style.font + ";") + this.style.strokeThickness;
    this.height = this.canvas.height = lineHeight * lines.length;
    this.context.fillStyle = this.style.fill;
    this.context.font = this.style.font;
    this.context.strokeStyle = this.style.stroke;
    this.context.lineWidth = this.style.strokeThickness;
    this.context.textBaseline = "top";
    i = 0;
    while (i < lines.length) {
      linePosition = new Point(this.style.strokeThickness / 2, this.style.strokeThickness / 2 + i * lineHeight);
      if (this.style.align === "right") {
        linePosition.x += maxLineWidth - lineWidths[i];
      } else {
        if (this.style.align === "center") {
          linePosition.x += (maxLineWidth - lineWidths[i]) / 2;
        }
      }
      if (this.style.stroke && this.style.strokeThickness) {
        this.context.strokeText(lines[i], linePosition.x, linePosition.y);
      }
      if (this.style.fill) {
        this.context.fillText(lines[i], linePosition.x, linePosition.y);
      }
      i++;
    }
    return this.updateTexture();
  };


  /**
  Updates texture size based on canvas size
  
  @method updateTexture
  @private
   */

  PixiText.prototype.updateTexture = function() {
    this.texture.baseTexture.width = this.canvas.width;
    this.texture.baseTexture.height = this.canvas.height;
    this.texture.frame.width = this.canvas.width;
    this.texture.frame.height = this.canvas.height;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    return BaseTexture.texturesToUpdate.push(this.texture.baseTexture);
  };


  /**
  Updates the transfor of this object
  
  @method __updateTransform
  @private
   */

  PixiText.prototype.__updateTransform = function() {
    if (this.dirty) {
      this.updateText();
      this.dirty = false;
    }
    return PixiText.__super__.__updateTransform.apply(this, arguments);
  };


  /**
  http://stackoverflow.com/users/34441/ellisbben
  great solution to the problem!
  
  @method determineFontHeight
  @param fontStyle {Object}
  @private
   */

  PixiText.prototype.determineFontHeight = function(fontStyle) {
    var body, dummy, dummyText, result;
    result = PixiText.heightCache[fontStyle];
    if (!result) {
      body = document.getElementsByTagName("body")[0];
      dummy = document.createElement("div");
      dummyText = document.createTextNode("M");
      dummy.appendChild(dummyText);
      dummy.setAttribute("style", fontStyle + ";position:absolute;top:0;left:0");
      body.appendChild(dummy);
      result = dummy.offsetHeight;
      PixiText.heightCache[fontStyle] = result;
      body.removeChild(dummy);
    }
    return result;
  };


  /**
  A PixiText Object will apply wordwrap
  
  @method wordWrap
  @param text {String}
  @private
   */

  PixiText.prototype.wordWrap = function(text) {
    var i, lineWrap, lines, result, searchWrapPos;
    searchWrapPos = function(ctx, text, start, end, wrapWidth) {
      var p;
      p = Math.floor((end - start) / 2) + start;
      if (p === start) {
        return 1;
      }
      if (ctx.measureText(text.substring(0, p)).width <= wrapWidth) {
        if (ctx.measureText(text.substring(0, p + 1)).width > wrapWidth) {
          return p;
        } else {
          return arguments.callee(ctx, text, p, end, wrapWidth);
        }
      } else {
        return arguments.callee(ctx, text, start, p, wrapWidth);
      }
    };
    lineWrap = function(ctx, text, wrapWidth) {
      var pos;
      if (ctx.measureText(text).width <= wrapWidth || text.length < 1) {
        return text;
      }
      pos = searchWrapPos(ctx, text, 0, text.length, wrapWidth);
      return text.substring(0, pos) + "\n" + arguments.callee(ctx, text.substring(pos), wrapWidth);
    };
    result = "";
    lines = text.split("\n");
    i = 0;
    while (i < lines.length) {
      result += lineWrap(this.context, lines[i], this.style.wordWrapWidth) + "\n";
      i++;
    }
    return result;
  };


  /**
  Destroys this text object
  
  @method destroy
  @param destroyTexture {Boolean}
   */

  PixiText.prototype.destroy = function(destroyTexture) {
    if (destroyTexture) {
      return this.texture.destroy();
    }
  };

  return PixiText;

})(Sprite);

module.exports = PixiText;


},{"rendering/Sprite":54,"rendering/core/Point":61,"rendering/textures/BaseTexture":75,"rendering/textures/Texture":77}],85:[function(require,module,exports){
var BitmapFont, BitmapText, PixiText;

PixiText = require('text/PixiText');

BitmapFont = require('text/BitmapFont');

BitmapText = require('text/BitmapText');

module.exports = {
  PixiText: PixiText,
  BitmapFont: BitmapFont,
  BitmapText: BitmapText
};


},{"text/BitmapFont":82,"text/BitmapText":83,"text/PixiText":84}],86:[function(require,module,exports){

/*
combo.js - Copyright 2012-2013 Louis Acresti - All Rights Reserved
 */
var BitwiseTileMap, NEIGHBOR, TileMap, TileSheet,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TileSheet = require('TileSheet');

TileMap = require('tile/TileMap');

NEIGHBOR = {
  TOP: 1,
  RIGHT: 2,
  BOTTOM: 4,
  LEFT: 8
};


/**
A special [`TileMap`](cg.tile.TileMap.html) that automatically chooses appropriate tile images based on the tiles around it.

The sheet that gets used with this must follow the rules outlined here:
http://www.saltgames.com/2010/a-bitwise-method-for-applying-tilemaps/

@class cg.tile.BitwiseTileMap
@extends cg.tile.TileMap
 */

BitwiseTileMap = (function(_super) {
  __extends(BitwiseTileMap, _super);

  function BitwiseTileMap() {
    BitwiseTileMap.__super__.constructor.apply(this, arguments);
    this._bitwiseMap = new Array(this.mapWidth * this.mapHeight, 0);
  }

  BitwiseTileMap.prototype._totFor = function(x, y) {
    var bottom, left, right, top, tot;
    if (x < 0 || y < 0 || x >= this.mapWidth || y >= this.mapHeight || (!this._bitwiseMap[y * this.mapWidth + x])) {
      return -1;
    }
    if (y > 0) {
      top = this._bitwiseMap[(y - 1) * this.mapWidth + x];
    }
    if (x < this.mapWidth - 1) {
      right = this._bitwiseMap[y * this.mapWidth + x + 1];
    }
    if (y < this.mapHeight - 1) {
      bottom = this._bitwiseMap[(y + 1) * this.mapWidth + x];
    }
    if (x > 0) {
      left = this._bitwiseMap[y * this.mapWidth + x - 1];
    }
    tot = 0;
    if (top) {
      tot += NEIGHBOR.TOP;
    }
    if (right) {
      tot += NEIGHBOR.RIGHT;
    }
    if (bottom) {
      tot += NEIGHBOR.BOTTOM;
    }
    if (left) {
      tot += NEIGHBOR.LEFT;
    }
    return tot;
  };


  /**
  Build a 2D array representing the current map.
  
  @method getMapData
  @return {2D Array of Booleans} A 2D array containing booleans; `true` values are solid tiles, others are not solid.
   */

  BitwiseTileMap.prototype.getMapData = function() {
    var col, data, x, y;
    data = new Array(this.mapWidth);
    x = 0;
    while (x < this.mapWidth) {
      col = new Array(this.mapHeight);
      y = 0;
      while (y < this.mapHeight) {
        col[y] = this._bitwiseMap[y * this.mapWidth + x] ? 1 : 0;
        ++y;
      }
      data[x] = col;
      ++x;
    }
    return data;
  };


  /**
  Mark the tile at a specified coordinate as "solid".
  
  A "solid" tile is just the opposite of an empty space.
  
  @method setSolid
  @param x {Number} The x coordinate into the tile map.
  @param y {Number} The y coordinate into the tile map.
  @param solid {Boolean} `true` if you want the tile to be solid.
   */

  BitwiseTileMap.prototype.setSolid = function(x, y, solid) {
    if (x < 0 || y < 0 || x >= this.mapWidth || y >= this.mapHeight) {
      return;
    }
    if (!!solid === !!this._bitwiseMap[y * this.mapWidth + x]) {
      return;
    }
    this._bitwiseMap[y * this.mapWidth + x] = solid;
    if (y > 0) {
      this.set(x, y - 1, this._totFor(x, y - 1));
    }
    if (x < this.mapWidth - 1) {
      this.set(x + 1, y, this._totFor(x + 1, y));
    }
    if (y < this.mapHeight - 1) {
      this.set(x, y + 1, this._totFor(x, y + 1));
    }
    if (x > 0) {
      this.set(x - 1, y, this._totFor(x - 1, y));
    }
    return this.set(x, y, this._totFor(x, y));
  };

  return BitwiseTileMap;

})(TileMap);

module.exports = BitwiseTileMap;


},{"TileSheet":10,"tile/TileMap":88}],87:[function(require,module,exports){
var Bottom, EPSILON, HasHotspots, Hotspot, Left, Right, Top, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

EPSILON = 0.001;


/**
TODOC

@class cg.tile.HasHotspots
 */

HasHotspots = (function() {
  function HasHotspots() {}

  HasHotspots.prototype.init = function() {
    this.grounded = false;
    return this.hotspots = {};
  };

  HasHotspots.prototype.update = function(dt) {
    var dist, hs, k, map, _i, _len, _ref, _ref1;
    _ref = this.collisionMaps;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      map = _ref[_i];
      _ref1 = this.hotspots;
      for (k in _ref1) {
        if (!__hasProp.call(_ref1, k)) continue;
        hs = _ref1[k];
        dist = hs.update(map);
        if (hs.solid) {
          if (dist != null) {
            hs.handleCollision(dist);
          }
        }
      }
    }
  };

  return HasHotspots;

})();


/**
TODOC

@class cg.tile.Hotspot
 */

Hotspot = (function() {
  function Hotspot(actor, offset) {
    this.actor = actor;
    this.offset = offset;
  }

  Hotspot.prototype.update = function() {
    return this.didCollide = false;
  };

  return Hotspot;

})();


/**
TODOC

@class cg.tile.Hotspot.Top
 */

Top = (function(_super) {
  __extends(Top, _super);

  function Top(actor, offset, solid) {
    var o;
    this.actor = actor;
    this.offset = offset;
    this.solid = solid != null ? solid : true;
    Top.__super__.constructor.apply(this, arguments);
    o = this.offset;
    this.offset = {
      x: o.x - this.actor.anchorX * this.actor.width,
      y: o.y - this.actor.anchorY * this.actor.height
    };
  }

  Top.prototype.update = function(map) {
    var pos, tileBottom, tileX, tileY, _ref;
    Top.__super__.update.apply(this, arguments);
    pos = {
      x: this.actor.x + this.offset.x,
      y: this.actor.y + this.offset.y
    };
    _ref = map.tileCoordsAt(pos.x, pos.y), tileX = _ref.x, tileY = _ref.y;
    if (map.get(tileX, tileY) != null) {
      tileBottom = (tileY + 1) * map.tileHeight;
      if (map.bottomEdge(tileX, tileY) && (tileBottom - pos.y) <= (map.tileHeight / 2)) {
        this.didCollide = true;
        if (this.actor.v.y > 0) {
          return;
        }
        return tileBottom - pos.y;
      }
    }
  };

  Top.prototype.handleCollision = function(dy) {
    var pos;
    pos = {
      x: this.actor.x + this.offset.x,
      y: this.actor.y + this.offset.y
    };
    pos.y += dy;
    this.actor.y = pos.y - this.offset.y + EPSILON;
    return this.actor.v.y *= -this.actor.bounce;
  };

  return Top;

})(Hotspot);


/**
TODOC

@class cg.tile.Hotspot.Bottom
 */

Bottom = (function(_super) {
  __extends(Bottom, _super);

  function Bottom(actor, offset, solid) {
    var o;
    this.actor = actor;
    this.offset = offset;
    this.solid = solid != null ? solid : true;
    Bottom.__super__.constructor.apply(this, arguments);
    o = this.offset;
    this.offset = {
      x: o.x - this.actor.anchorX * this.actor.width,
      y: o.y - this.actor.anchorY * this.actor.height
    };
  }

  Bottom.prototype.update = function(map) {
    var pos, tileTop, tileX, tileY, _ref;
    Bottom.__super__.update.apply(this, arguments);
    pos = {
      x: this.actor.x + this.offset.x,
      y: this.actor.y + this.offset.y
    };
    _ref = map.tileCoordsAt(pos.x, pos.y), tileX = _ref.x, tileY = _ref.y;
    if (map.get(tileX, tileY) != null) {
      tileTop = tileY * map.tileHeight;
      if (map.topEdge(tileX, tileY) && (pos.y - tileTop) <= (map.tileHeight / 2)) {
        this.didCollide = true;
        if (this.actor.v.y < 0) {
          return;
        }
        return tileTop - pos.y;
      }
    }
  };

  Bottom.prototype.handleCollision = function(dy) {
    var pos;
    pos = {
      x: this.actor.x + this.offset.x,
      y: this.actor.y + this.offset.y
    };
    pos.y += dy;
    if (this.actor.v.y > 0) {
      this.actor.y = pos.y - this.offset.y + EPSILON;
      return this.actor.v.y *= -this.actor.bounce;
    }
  };

  return Bottom;

})(Hotspot);


/**
TODOC

@class cg.tile.Hotspot.Left
 */

Left = (function(_super) {
  __extends(Left, _super);

  function Left(actor, offset, solid) {
    var o;
    this.actor = actor;
    this.offset = offset;
    this.solid = solid != null ? solid : true;
    Left.__super__.constructor.apply(this, arguments);
    o = this.offset;
    this.offset = {
      x: o.x - this.actor.anchorX * this.actor.width,
      y: o.y - this.actor.anchorY * this.actor.height
    };
  }

  Left.prototype.update = function(map) {
    var pos, tileRight, tileX, tileY, _ref;
    Left.__super__.update.apply(this, arguments);
    pos = {
      x: this.actor.x + this.offset.x,
      y: this.actor.y + this.offset.y
    };
    _ref = map.tileCoordsAt(pos.x, pos.y), tileX = _ref.x, tileY = _ref.y;
    if (map.get(tileX, tileY) != null) {
      tileRight = (tileX + 1) * map.tileWidth;
      if (map.rightEdge(tileX, tileY) && (tileRight - pos.x) <= (map.tileWidth / 2)) {
        this.didCollide = true;
        if (this.actor.v.x > 0) {
          return;
        }
        return tileRight - pos.x;
      }
    }
  };

  Left.prototype.handleCollision = function(dx) {
    var pos;
    pos = {
      x: this.actor.x + this.offset.x,
      y: this.actor.y + this.offset.y
    };
    pos.x += dx;
    this.actor.x = pos.x - this.offset.x + EPSILON;
    return this.actor.v.x *= -this.actor.bounce;
  };

  return Left;

})(Hotspot);


/**
TODOC

@class cg.tile.Hotspot.Right
 */

Right = (function(_super) {
  __extends(Right, _super);

  function Right(actor, offset, solid) {
    var o;
    this.actor = actor;
    this.offset = offset;
    this.solid = solid != null ? solid : true;
    Right.__super__.constructor.apply(this, arguments);
    o = this.offset;
    this.offset = {
      x: o.x - this.actor.anchorX * this.actor.width,
      y: o.y - this.actor.anchorY * this.actor.height
    };
  }

  Right.prototype.update = function(map) {
    var pos, tileLeft, tileX, tileY, _ref;
    Right.__super__.update.apply(this, arguments);
    pos = {
      x: this.actor.x + this.offset.x,
      y: this.actor.y + this.offset.y
    };
    _ref = map.tileCoordsAt(pos.x, pos.y), tileX = _ref.x, tileY = _ref.y;
    if (map.get(tileX, tileY) != null) {
      tileLeft = tileX * map.tileWidth;
      if (map.leftEdge(tileX, tileY) && (pos.x - tileLeft) <= (map.tileWidth / 2)) {
        this.didCollide = true;
        if (this.actor.v.x < 0) {
          return;
        }
        return tileLeft - pos.x;
      }
    }
  };

  Right.prototype.handleCollision = function(dx) {
    var pos;
    pos = {
      x: this.actor.x + this.offset.x,
      y: this.actor.y + this.offset.y
    };
    pos.x += dx;
    this.actor.x = pos.x - this.offset.x + EPSILON;
    return this.actor.v.x *= -this.actor.bounce;
  };

  return Right;

})(Hotspot);

Hotspot.Left = Left;

Hotspot.Right = Right;

Hotspot.Bottom = Bottom;

Hotspot.Top = Top;

Hotspot.HasHotspots = HasHotspots;

module.exports = Hotspot;


},{"cg":13}],88:[function(require,module,exports){

/*
combo.js - Copyright 2012-2013 Louis Acresti - All Rights Reserved
 */
var Actor, Sprite, TileMap, TileSheet, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Actor = require('Actor');

TileSheet = require('TileSheet');

Sprite = require('rendering/Sprite');


/**
Fixed-size grid of square textures in the fashion of oldschool console games.

@class cg.tile.TileMap
@extends cg.Actor

@constructor

@example
    // Create a 100x100 TileMap that uses a 20x20 grid-based tilesheet named "tiles"
    var map = new TileMap({
      mapWidth: 100,
      mapHeight: 100,
      tileWidth: 20,
      tileHeight: 20,
      texture: 'tiles' Shorthand for cg.assets.textures.tiles
    });

@param [properties] {Object} This object is passed to the inherited `Actor` constructor.

Any additional name/value pairs in `properties` will be copied into the resulting `TileMap` object.
@param [properties.mapWidth=32] {Number} The number of tiles this map spans horizontally.
@param [properties.mapHeight=32] {Number} The number of tiles this map spans vertically.
@param [properties.tileWidth=16] {Number} The width of each tile (in pixels).
@param [properties.tileHeight=16] {Number} The height of each tile (in pixels).
@param [properties.sheets]* {String|Texture|TileSheet | Array(String|Texture|TileSheet)}
Any `Texture` supplied is converted to a `TileSheet` with a grid size that matches this map.

You may also supply pre-existing `TileSheet`s as well, in which case no new `TileSheet` is created.

The resulting array of `TileSheet`s is stored as `this.sheets`.
 */

TileMap = (function(_super) {
  __extends(TileMap, _super);

  TileMap.prototype._createSheetFor = function(prop) {
    var sheet, _ref;
    if (typeof prop === 'object' && prop instanceof TileSheet) {
      sheet = prop;
    } else if ((_ref = cg.assets.sheets[prop]) != null ? _ref.isTileSheet : void 0) {
      sheet = cg.assets.sheets[prop];
    } else {
      sheet = TileSheet.create(prop, this.tileWidth, this.tileHeight);
    }
    return sheet;
  };

  function TileMap() {
    var i, sheet, _i, _len, _ref;
    TileMap.__super__.constructor.apply(this, arguments);
    if (this.mapWidth == null) {
      this.mapWidth = 32;
    }
    if (this.mapHeight == null) {
      this.mapHeight = 32;
    }
    if (this.tileWidth == null) {
      this.tileWidth = 16;
    }
    if (this.tileHeight == null) {
      this.tileHeight = 16;
    }
    if (this.sheets == null) {
      this.sheets = [];
    }
    if (!cg.util.isArray(this.sheets)) {
      this.sheets = [this.sheets];
    }
    _ref = this.sheets;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      sheet = _ref[i];
      this.sheets[i] = this._createSheetFor(sheet);
    }
    this._map = new Array(this.mapWidth * this.mapHeight);
    this._resizeDisplayMap(cg.width, cg.height);
  }

  TileMap.prototype._resizeDisplayMap = function(scrWidth, srcHeight) {
    var sheetNum, t, tex, tile, tileNum, x, y, _ref;
    this.displayMap = [];
    this.displayMap.width = Math.min(this.mapWidth, Math.ceil(scrWidth / this.tileWidth) + 1);
    this.displayMap.height = Math.min(this.mapHeight, Math.ceil(srcHeight / this.tileHeight) + 1);
    if (this.displayContainer != null) {
      this.removeChild(this.displayContainer);
    }
    this.displayContainer = new Actor;
    y = 0;
    while (y < this.displayMap.height) {
      x = 0;
      while (x < this.displayMap.width) {
        tile = new Sprite(this.sheets[0][0]);
        tex = null;
        t = this.get(x, y);
        if (t != null) {
          sheetNum = t[0], tileNum = t[1];
          tex = (_ref = this.sheets[sheetNum]) != null ? _ref[tileNum] : void 0;
        }
        if (tex == null) {
          tile.visible = false;
        } else {
          tile.texture = tex;
          tile.visible = true;
        }
        tile.x = x * this.tileWidth;
        tile.y = y * this.tileHeight;
        this.displayContainer.addChild(tile);
        this.displayMap[y * this.displayMap.width + x] = tile;
        ++x;
      }
      ++y;
    }
    return this.addChild(this.displayContainer);
  };


  /**
  Replace one of this map's `TileSheet`s.
  
  @method setSheet
  @param sheet {String|Texture|TileSheet}
  The new sheet.
  
  If a `String` or `Texture` is supplied, it is converted to a `TileSheet` with a grid size that matches this map.
  @param number=0 {Number} The index into `this.sheets` to replace.
  @return The `TileSheet` that was replaced, if any.
  
  @example
      // Typical use case; changing to a new world
      map.setSheet('world_02_tiles');
  
  @example
      // Using multiple sheets at once:
      var map = new TileMap({
        mapWidth: 100,
        mapHeight: 100,
        tileWidth: 20,
        tileHeight: 20,
        texture: ['lightTiles', 'darkTiles']
      });
  
      generateMap(map); // Some method that populates our map with tiles
      
      var lightSheet = map.sheets[0];
      var darkSheet  = map.sheets[1];
  
      map.setSheet(map.sheets[1], 0);
      map.setSheet(lightSheet, 1);
   */

  TileMap.prototype.setSheet = function(sheet, number) {
    var oldSheet;
    if (number == null) {
      number = 0;
    }
    sheet = this._createSheetFor(sheet);
    oldSheet = this.sheets[number];
    this.sheets[number] = sheet;
    this._resizeDisplayMap(cg.width, cg.height);
    return oldSheet;
  };


  /**
  Add a new `TileSheet` to `this.sheets`
  
  @method addSheet
  @param sheet {String|Texture|TileSheet}
  The sheet to add.
  
  If a `String` or `Texture` is supplied, it is converted to a `TileSheet` with a grid size that matches this map.
  
  @return The sheet that was added.
  
  @example
      var map = new TileMap({
        mapWidth: 100,
        mapHeight: 100,
        tileWidth: 20,
        tileHeight: 20,
        texture: ['tiles', 'moreTiles']
      });
  
      cg.log(map.sheets.length); // "2"
  
      map.addSheet('evenMoreTiles');
  
      cg.log(map.sheets.length); // "3"
   */

  TileMap.prototype.addSheet = function(sheet) {
    sheet = this._createSheetFor(sheet);
    this.sheets.push(sheet);
    return sheet;
  };


  /**
  Set the tile index at a given grid coordinate.
  
  @method set
  @param x {Number} Integer x-coordinate into this map (ignored when x < 0 or x >= `this.mapWidth`)
  @param y {Number} Integer y-coordinate into this map (ignored when y < 0 or y >= `this.mapHeight`)
  @param tileNumber {Number} The integer index into the `TileSheet` that represents this tile.
  @param [sheetNumber=0] {Number} The integer index into `this.sheets` that represents the `TileSheet` associated with this tile.
   */

  TileMap.prototype.set = function(x, y, tileNumber, sheetNum) {
    var val;
    if (sheetNum == null) {
      sheetNum = 0;
    }
    if (x < 0 || y < 0 || x >= this.mapWidth || y >= this.mapHeight) {
      return;
    }
    if (sheetNum < 0 || tileNumber < 0) {
      val = null;
    } else {
      val = [sheetNum, tileNumber];
    }
    this._map[y * this.mapWidth + x] = val;
    if (!this.dirty) {
      return this.dirty = true;
    }
  };


  /**
  Get the tile index and sheet number at a given grid coordinate.
  
  @method get
  @param x {Number} Integer x-coordinate into this map 
  @param y {Number} Integer y-coordinate into this map
  @return {Array}
  A two-element `Array` that contains first the sheet number, then the tile number of the tile at the
  specified coordinate.
  
      var sheetNumber, tileNumber, tileData;
      tileData = this.get(0,0);
  
      sheetNumber = tileData[0];
      tileNumber = tileData[1];
  
  `undefined` when the coordinate is outside the bounds of this map.
   */

  TileMap.prototype.get = function(x, y) {
    if (x < 0 || y < 0 || x >= this.mapWidth || y >= this.mapHeight) {
      return void 0;
    }
    return this._map[y * this.mapWidth + x];
  };


  /**
  Get the sprite used to display the tile at a specified coordinate.
  
  @protected
  @method getTileSprite
  @param x {Number} Integer x-coordinate into this map
  @param y {Number} Integer y-coordinate into this map
  @return {cg.rendering.Sprite}
  The sprite used to display the tile at the specified coordinate.
  
  `null` when the tile at the specified coordinate is not in the visible bounds
  of this tile map.
   */

  TileMap.prototype.getTileSprite = function(x, y) {
    var dx, dy, map;
    dx = x - this.startx;
    dy = y - this.starty;
    map = this.displayMap;
    if (!(dx >= 0 && dy >= 0 && dx < map.width && dy < map.height)) {
      return null;
    }
    return map[dy * map.width + dx];
  };


  /**
  Get the coordinates of the tile that contains a given screen coordinate.
  
  **NOTE**: This 
  
  @method tileCoordsAt
  @param x {Number} x-component of the screen coordinate
  @param y {Number} y-component of the screen coordinate
   */

  TileMap.prototype.tileCoordsAt = function(x, y) {
    return {
      x: Math.floor((x - this.x) / this.tileWidth),
      y: Math.floor((y - this.y) / this.tileHeight)
    };
  };

  TileMap.prototype.update = function() {
    var dx, dy, endx, endy, prevEndx, prevEndy, prevStartx, prevStarty, renderer, sheetNum, startx, starty, t, tex, tile, tileNum, x, y, _ref;
    if (cg.resized) {
      renderer = cg.renderer;
      this._resizeDisplayMap(cg.width, cg.height);
    }
    TileMap.__super__.update.apply(this, arguments);
    prevStartx = this.startx;
    prevStarty = this.starty;
    prevEndx = this.endx;
    prevEndy = this.endy;
    startx = Math.max(0, Math.floor(this.x / this.tileWidth));
    starty = Math.max(0, Math.floor(this.y / this.tileHeight));
    endx = startx + this.displayMap.width;
    endy = starty + this.displayMap.height;
    if (!(this.dirty || (prevStartx !== startx) || (prevStarty !== starty) || (prevEndx !== endx) || (prevEndy !== endy))) {
      return;
    }
    x = startx;
    dx = 0;
    while (x < endx) {
      y = starty;
      dy = 0;
      while (y < endy) {
        tile = this.displayMap[dy * this.displayMap.width + dx];
        if (tile != null) {
          tex = null;
          t = this.get(x, y);
          if (t != null) {
            sheetNum = t[0], tileNum = t[1];
            tex = (_ref = this.sheets[sheetNum]) != null ? _ref[tileNum] : void 0;
          }
          if (tex == null) {
            tile.visible = false;
          } else {
            tile.texture = tex;
            tile.visible = true;
          }
        }
        ++y;
        ++dy;
      }
      ++x;
      ++dx;
    }
    this.displayContainer.x = startx * this.tileWidth;
    this.displayContainer.y = starty * this.tileHeight;
    this.startx = startx;
    this.starty = starty;
    this.endx = endx;
    this.endy = endy;
    return this.dirty = false;
  };


  /**
  @protected
  @method topEdge
  @param x {Number} integer x-component of a tile coordinate
  @param y {Number} integer x-component of a tile coordinate
  @return {Boolean} `true` if the top of the tile isn't directly adjacent to another tile
   */

  TileMap.prototype.topEdge = function(x, y) {
    return this.get(x, y - 1) == null;
  };


  /**
  @protected
  @method leftEdge
  @param x {Number} integer x-component of a tile coordinate
  @param y {Number} integer x-component of a tile coordinate
  @return {Boolean} `true` if the left of the tile isn't directly adjacent to another tile
   */

  TileMap.prototype.leftEdge = function(x, y) {
    return this.get(x - 1, y) == null;
  };


  /**
  @protected
  @method bottomEdge
  @param x {Number} integer x-component of a tile coordinate
  @param y {Number} integer x-component of a tile coordinate
  @return {Boolean} `true` if the bottom of the tile isn't directly adjacent to another tile
   */

  TileMap.prototype.bottomEdge = function(x, y) {
    return this.get(x, y + 1) == null;
  };


  /**
  @protected
  @method rightEdge
  @param x {Number} integer x-component of a tile coordinate
  @param y {Number} integer x-component of a tile coordinate
  @return {Boolean} `true` if the right of the tile isn't directly adjacent to another tile
   */

  TileMap.prototype.rightEdge = function(x, y) {
    return this.get(x + 1, y) == null;
  };

  return TileMap;

})(Actor);

module.exports = TileMap;


},{"Actor":2,"TileSheet":10,"cg":13,"rendering/Sprite":54}],89:[function(require,module,exports){
var BitwiseTileMap, Hotspot, TileMap;

BitwiseTileMap = require('tile/BitwiseTileMap');

Hotspot = require('tile/Hotspot');

TileMap = require('tile/TileMap');

module.exports = {
  BitwiseTileMap: BitwiseTileMap,
  Hotspot: Hotspot,
  TileMap: TileMap
};


},{"tile/BitwiseTileMap":86,"tile/Hotspot":87,"tile/TileMap":88}],90:[function(require,module,exports){
var DeferredProxy,
  __slice = [].slice;

DeferredProxy = (function() {
  function DeferredProxy() {}

  DeferredProxy.create = function(obj, promise) {
    var enqueue, func, proxy, queue, val;
    proxy = {};
    queue = [];
    enqueue = function() {
      var args, func;
      func = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      queue.push([func, args]);
      return proxy;
    };
    for (func in obj) {
      val = obj[func];
      if (typeof val === 'function') {
        proxy[func] = enqueue.bind(null, func);
      }
    }
    promise = promise.then(function() {
      var job, _i, _len;
      for (_i = 0, _len = queue.length; _i < _len; _i++) {
        job = queue[_i];
        obj[job[0]](job[1]);
      }
    });
    proxy.then = function() {
      promise = promise.then.apply(promise, arguments);
      return proxy;
    };
    return proxy;
  };

  return DeferredProxy;

})();

module.exports = DeferredProxy;


},{}],91:[function(require,module,exports){

/*
Plugin example concept:

HasFavoriteNumber =
  preInit: (klass) ->
     * Add a property called "favoriteNumber" to our object.
    @favoriteNumber = 42
    ++klass.favoriteNumberCount
    cg.log 'There are ' + klass.favoriteNumberCount + ' objects that have a favorite number.'
    
  mixin:
    sayHello: -> cg.log 'HELLO; MY FAVORITE NUMBER IS ' + @favoriteNumber + '!'

  mixinStatic:
    onMixinStatic: ->
      @favoriteNumberCount = 0
 */
var HasPlugins, NOOP, NOOPFor, buildMethodListInvoker, invokers, k, methodListNameFor, methodNames, methodRanNameFor, name, v, _i, _len, _ref,
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty;

NOOP = function() {};

NOOPFor = function(methodName) {
  var methodRanName;
  switch (methodName) {
    case 'preInit':
    case 'postInit':
      methodRanName = methodRanNameFor(methodName);
      return function() {
        return this[methodRanName] = true;
      };
    default:
      return NOOP;
  }
};

methodNames = ['preInit', 'postInit', 'preReset', 'postReset', 'preUpdate', 'postUpdate', 'preDispose', 'postDispose'];

methodListNameFor = function(methodName) {
  return '__plugins_' + methodName + '_callbacks';
};

methodRanNameFor = function(methodName) {
  return '__plugins_' + methodName + '_ran';
};

buildMethodListInvoker = function(methodName) {
  var methodListName, methodRanName;
  methodListName = methodListNameFor(methodName);
  if (methodName === 'preInit' || methodName === 'postInit') {
    methodRanName = methodRanNameFor(methodName);
    return function() {
      var method, _i, _len, _ref;
      _ref = this[methodListName];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        method = _ref[_i];
        method.call(this);
      }
      this[methodRanName] = true;
    };
  } else {
    return function() {
      var method, _i, _len, _ref;
      _ref = this[methodListName];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        method = _ref[_i];
        method.call(this);
      }
    };
  }
};

invokers = {};

for (_i = 0, _len = methodNames.length; _i < _len; _i++) {
  name = methodNames[_i];
  invokers[name] = buildMethodListInvoker(name);
}

HasPlugins = function() {
  var __plugins;
  __plugins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  if (__plugins == null) {
    __plugins = [];
  }
  return (function(__plugins) {
    return {
      plugin: function() {
        var methodListName, methodName, plugin, _j, _k, _l, _len1, _len2, _len3, _plugins, _ref, _ref1, _results;
        _plugins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        for (_j = 0, _len1 = _plugins.length; _j < _len1; _j++) {
          plugin = _plugins[_j];
          if (plugin.mixin != null) {
            this.mixin(plugin.mixin);
          }
          for (_k = 0, _len2 = methodNames.length; _k < _len2; _k++) {
            methodName = methodNames[_k];
            if (plugin[methodName] == null) {
              continue;
            }
            methodListName = methodListNameFor(methodName);
            this[methodListName] = ((_ref = this[methodListName]) != null ? _ref.slice() : void 0) || [];
            this[methodListName].push(plugin[methodName]);
            this['__plugins_' + methodName] = invokers[methodName];
          }
        }
        _ref1 = ['preInit', 'postInit'];
        _results = [];
        for (_l = 0, _len3 = _ref1.length; _l < _len3; _l++) {
          methodName = _ref1[_l];
          if (this[methodRanNameFor(methodName)]) {
            _results.push((function() {
              var _len4, _m, _results1;
              _results1 = [];
              for (_m = 0, _len4 = _plugins.length; _m < _len4; _m++) {
                plugin = _plugins[_m];
                if (plugin[methodName] != null) {
                  _results1.push(plugin[methodName].call(this));
                } else {
                  _results1.push(void 0);
                }
              }
              return _results1;
            }).call(this));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      },
      onMixin: function() {
        var methodName, _j, _len1;
        for (_j = 0, _len1 = methodNames.length; _j < _len1; _j++) {
          methodName = methodNames[_j];
          this.prototype['__plugins_' + methodName] = NOOPFor(methodName);
        }
        this.mixinStatic({
          plugin: function() {
            var methodListName, plugin, _k, _len2, _plugins, _results;
            _plugins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            _results = [];
            for (_k = 0, _len2 = _plugins.length; _k < _len2; _k++) {
              plugin = _plugins[_k];
              if (plugin.mixin != null) {
                this.mixin(plugin.mixin);
              }
              if (plugin.mixinStatic != null) {
                this.mixinStatic(plugin.mixinStatic);
              }
              _results.push((function() {
                var _base, _l, _len3, _results1;
                _results1 = [];
                for (_l = 0, _len3 = methodNames.length; _l < _len3; _l++) {
                  methodName = methodNames[_l];
                  if (plugin[methodName] == null) {
                    continue;
                  }
                  methodListName = methodListNameFor(methodName);
                  if ((_base = this.prototype)[methodListName] == null) {
                    _base[methodListName] = [];
                  }
                  this.prototype[methodListName].push(plugin[methodName]);
                  _results1.push(this.prototype['__plugins_' + methodName] = invokers[methodName]);
                }
                return _results1;
              }).call(this));
            }
            return _results;
          }
        });
        return this.plugin(__plugins);
      }
    };
  })(__plugins);
};

_ref = HasPlugins();
for (k in _ref) {
  if (!__hasProp.call(_ref, k)) continue;
  v = _ref[k];
  HasPlugins[k] = v;
}

module.exports = HasPlugins;


},{}],92:[function(require,module,exports){

/**
A pool of actors; useful for reducing periodic garbage collector hiccups when many actors are being created and destroyed 
at a high rate.

@class cg.util.HasPooling.Pool
@constructor
@param ctor {Actor Constructor} The class reference/constructor of the actor class whose instances are to be spawned from this pool.
 */
var HasPooling, Pool;

Pool = (function() {
  function Pool(ctor) {
    this.ctor = ctor;
    this.__objects = [];
    this.__marker = 0;
    this.__size = 0;
  }


  /**
  Create a new instance of our class.
  
  @method spawn
  @param [arguments...] Arguments are passed *as-is* to the actor's [`reset`](cg.Actor.html#method_reset) method.
   */

  Pool.prototype.spawn = function() {
    var obj;
    if (this.__marker >= this.__size) {
      this.__expand(Math.max(2, this.__size * 2));
    }
    obj = this.__objects[this.__marker++];
    obj._poolIndex = this.__marker - 1;
    obj.visible = true;
    obj.reset.apply(obj, arguments);
    return obj;
  };

  Pool.prototype.__expand = function(newSize) {
    var i;
    i = 0;
    while (i < newSize - this.__size) {
      this.__objects.push(new this.ctor);
      ++i;
    }
    return this.__size = newSize;
  };

  Pool.prototype._destroy = function(obj) {
    var end, endIndex;
    --this.__marker;
    end = this.__objects[this.__marker];
    endIndex = end._poolIndex;
    this.__objects[this.__marker] = obj;
    this.__objects[obj._poolIndex] = end;
    end._poolIndex = obj._poolIndex;
    return obj._poolIndex = endIndex;
  };

  return Pool;

})();


/**
**plugin**

Add [pooling](TODOC guide:pooling) capabilities to an actor class.

@static
@class cg.util.HasPooling
 */

HasPooling = {
  mixin: {
    _leavePool: function() {
      return this._pool._destroy(this);
    },
    onMixin: function() {

      /**
      The pool that this class may spawn new/recycled actor instances from.
      
      @static
      @property pool
      @type cg.util.HasPooling.Pool
       */
      this.pool = new Pool(this);
      return this.prototype._pool = this.pool;
    }
  },
  postDispose: function() {
    if (this._poolIndex != null) {
      return this._leavePool();
    }
  }
};

module.exports = HasPooling;


},{}],93:[function(require,module,exports){
var HasSignals, Signal, __wrap,
  __slice = [].slice;

Signal = require('util/Signal');

__wrap = function(listener, funcName, listenerData, listeners) {
  if (funcName === 'addOnce') {
    return function() {
      if (!this.worldPaused) {
        listener.apply(this, arguments);
        return listeners.splice(listeners.indexOf(listenerData), 1);
      }
    };
  } else {
    return function() {
      if (!this.worldPaused) {
        return listener.apply(this, arguments);
      }
    };
  }
};


/**
**mixin**

Add event listening/emitting to any class.

@static
@class cg.util.HasSignals
 */

HasSignals = {
  __signal: function(name, create) {
    var signal, _base, _ref;
    if (create == null) {
      create = false;
    }
    if (!create) {
      signal = (_ref = this.__signals) != null ? _ref[name] : void 0;
    } else {
      if (this.__signals == null) {
        this.__signals = {};
      }
      if ((_base = this.__signals)[name] == null) {
        _base[name] = new Signal;
      }
      signal = this.__signals[name];
    }
    return signal;
  },
  __on: function(signaler, name, listener, funcName) {
    var err, listenerData, _listener;
    listenerData = [0, 0, 0, 0];
    if (this.__listeners == null) {
      this.__listeners = [];
    }
    if (!(typeof listener === 'function')) {
      err = new Error("on/once expected a function for the listener, but got '" + (typeof listener) + "'; aborting!");
      cg.warn(err.stack);
      return;
    }
    _listener = __wrap(listener, funcName, listenerData, this.__listeners);
    if ((signaler == null) || signaler === this) {
      signaler = this;
    } else {
      signaler.once('__destroy__', function() {
        return this.__listeners.splice(this.__listeners.indexOf(listenerData), 1);
      });
    }
    listenerData[0] = signaler;
    listenerData[1] = name;
    listenerData[2] = _listener;
    listenerData[3] = listener;
    this.__listeners.push(listenerData);
    return signaler.__signal(name, true)[funcName](_listener, this);
  },

  /**
  Listen for a named event and execute a function when it is emitted.
  
  @method on
  @param [signaler=this] {cg.util.HasSignals}
  The object that emits the event we wish to listen for.
  
  If *not* specified, we only listen for events emitted on this `HasSignals` object.
  
  @param name {String}
  The name of the event to listen for, or a comma-separated string of multiple event names.
  
  
  @param callback {Function}
  A function that executes whenever the event is emitted, **unless `this.paused` is `true`**.
  
  Callback Context (value of `this`):
  Inside the `callback`, the value of `this` is the value of the object that `on` was
  executed with.
  
  Example:
  
  ```javascript
  signalerAAA.on(signalerBBB, 'event', function () {
    assert(this === signalerAAA); // => true
  });
  
  signalerBBB.on('event', function () {
    assert(this === signalerBBB); // => true
  });
  
  signalerBBB.emit('event');
  ```
  
  Callback Arguments:
  The arguments in the function are derived from the arguments passed to the `signaler`'s `emit`
  call that triggered the event.
  
  @example
      listener.on(signaler, 'alert', function (msg) {
        cg.warn('Danger, Will Robinson: ' + msg);
      });
  
      signaler.emit('alert', 'This message will be logged!');
  
      // If a listener is paused, its event callbacks will not fire.
      listener.paused = true;
      signaler.emit('alert', 'This message will NOT be logged!');
  @example
      announcer.on(player, 'kill', function (enemyType, weapon) {
        cg.log('Player killed ' + enemyType + ' with ' + weapon + '.');
      });
  
      scoreBook.on(player, 'kill', function (enemyType) {
        switch(enemyType) {
        case 'rat':
          this.score += 100;
          break;
        case 'goblin':
          this.score += 200;
          break;
        case 'warlock':
          this.score += 1000;
          break;
        }
      });
  
      player.emit('kill', 'rat', 'chainsaw');
  
      // Result:
      // logged => "Player killed rat with chainsaw."
      // scoreBook.score == 200
  @example
      logger.on(service, 'log,warn,error', function (msg) {
        cg.log(msg);
      });
  
      service.emit('log', 'How are you gentlemen');
      service.emit('warn', 'Someone set us up the bomb');
      service.emit('error', 'All your base... eh, you know the drill.');
  
      // Result:
      // logged => "How are you gentlemen"
      // logged => "Someone set us up the bomb"
      // logged => "All your base... eh, you know the drill."
   */
  on: function() {
    var listener, name, signaler, _i, _j, _len, _name, _ref, _ref1;
    signaler = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), name = arguments[_i++], listener = arguments[_i++];
    _ref = name.split(',');
    for (_j = 0, _len = _ref.length; _j < _len; _j++) {
      _name = _ref[_j];
      _name = _name.trim();
      if (_name.length === 0) {
        continue;
      }
      this.__on((_ref1 = signaler[0]) != null ? _ref1 : this, _name, listener, 'add');
    }
    return this;
  },
  once: function() {
    var listener, name, signaler, _i, _j, _len, _name, _ref, _ref1;
    signaler = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), name = arguments[_i++], listener = arguments[_i++];
    _ref = name.split(',');
    for (_j = 0, _len = _ref.length; _j < _len; _j++) {
      _name = _ref[_j];
      _name = _name.trim();
      if (_name.length === 0) {
        continue;
      }
      this.__on((_ref1 = signaler[0]) != null ? _ref1 : this, _name, listener, 'addOnce');
    }
    return this;
  },
  off: function() {
    var args, i, listener, name, signal, signaler, wrapped, _i, _j, _k, _l, _len, _n, _name, _ref, _ref1, _ref2, _ref3, _ref4, _s;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (args.length === 1) {
      signaler = this;
      name = args[0];
    } else if (args.length === 2) {
      if (typeof args[0] === 'string') {
        signaler = this;
        name = args[0];
        listener = args[1];
      } else {
        signaler = args[0];
        name = args[1];
      }
    } else {
      signaler = args[0];
      name = args[1];
      listener = args[2];
    }
    _ref = name.split(',');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      _name = _ref[_i];
      _name = _name.trim();
      if (_name.length === 0) {
        continue;
      }
      signal = signaler.__signal(_name);
      if (signal == null) {
        continue;
      }
      if (listener != null) {
        _ref1 = this.__listeners;
        for (i = _j = _ref1.length - 1; _j >= 0; i = _j += -1) {
          _ref2 = _ref1[i], _s = _ref2[0], _n = _ref2[1], wrapped = _ref2[2], _l = _ref2[3];
          if (!((_s === signaler) && (_n === _name) && (_l === listener))) {
            continue;
          }
          signal.remove(wrapped, this);
          this.__listeners.splice(i, 1);
        }
      } else {
        _ref3 = this.__listeners;
        for (i = _k = _ref3.length - 1; _k >= 0; i = _k += -1) {
          _ref4 = _ref3[i], _s = _ref4[0], _n = _ref4[1], wrapped = _ref4[2];
          if (!((_s === signaler) && (_n === _name))) {
            continue;
          }
          signal.remove(wrapped, this);
          this.__listeners.splice(i, 1);
        }
      }
    }
    return this;
  },
  halt: function(name) {
    var _ref;
    if ((_ref = this.__signal(name)) != null) {
      _ref.halt();
    }
    return this;
  },
  emit: function() {
    var args, name, _ref;
    name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if ((_ref = this.__signal(name)) != null) {
      _ref.dispatch.apply(_ref, args);
    }
    return this;
  },
  broadcast: function() {
    var args, child, name, _i, _len, _ref;
    name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    this.emit.apply(this, [name].concat(__slice.call(args)));
    if (this.children == null) {
      return this;
    }
    _ref = this.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      if (typeof child.broadcast === "function") {
        child.broadcast.apply(child, [name].concat(__slice.call(args)));
      }
    }
    return this;
  },
  _disposeListeners: function() {
    var listener, name, signaler, wrappedListener, _i, _ref, _ref1;
    if (this.__listeners == null) {
      return;
    }
    _ref = this.__listeners;
    for (_i = _ref.length - 1; _i >= 0; _i += -1) {
      _ref1 = _ref[_i], signaler = _ref1[0], name = _ref1[1], wrappedListener = _ref1[2], listener = _ref1[3];
      this.off(signaler, name, listener);
    }
  }
};

module.exports = HasSignals;


},{"util/Signal":95}],94:[function(require,module,exports){
(function (process){
var Deferred, Module, Promise, Resolver, isFunction, nextTick,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Module = require('Module');

nextTick = (typeof process !== "undefined" && process !== null ? process.nextTick : void 0) != null ? process.nextTick : typeof setImmediate !== "undefined" && setImmediate !== null ? setImmediate : function(task) {
  return setTimeout(task, 0);
};

isFunction = function(value) {
  return typeof value === 'function';
};

Resolver = (function() {
  function Resolver(onResolved, onRejected, context) {
    var complete, completeRejected, completeResolved, completed, completionAction, completionValue, pendingResolvers, process, processed, propagate, schedule;
    this.context = context;
    this.promise = new Promise(this);
    pendingResolvers = [];
    processed = false;
    completed = false;
    completionValue = null;
    completionAction = null;
    if (!isFunction(onRejected)) {
      onRejected = function(error) {
        throw error;
      };
    }
    propagate = function() {
      var pendingResolver, _i, _len;
      for (_i = 0, _len = pendingResolvers.length; _i < _len; _i++) {
        pendingResolver = pendingResolvers[_i];
        pendingResolver[completionAction](completionValue);
      }
      pendingResolvers = [];
    };
    schedule = function(pendingResolver) {
      pendingResolvers.push(pendingResolver);
      if (completed) {
        propagate();
      }
    };
    complete = function(action, value) {
      onResolved = onRejected = null;
      completionAction = action;
      completionValue = value;
      completed = true;
      propagate();
    };
    completeResolved = function(result) {
      complete('resolve', result);
    };
    completeRejected = function(reason) {
      complete('reject', reason);
    };
    process = (function(_this) {
      return function(callback, value) {
        var error, stack;
        processed = true;
        try {
          if (isFunction(callback)) {
            value = callback.call(_this.context, value);
          }
          if (value && isFunction(value.then)) {
            value.then(completeResolved, completeRejected, _this.context);
          } else {
            completeResolved(value);
          }
        } catch (_error) {
          error = _error;
          stack = error.stack;
          console.error(stack);
          completeRejected(error);
        }
      };
    })(this);
    this.resolve = function(result) {
      if (!processed) {
        process(onResolved, result);
      }
    };
    this.reject = function(error) {
      if (!processed) {
        process(onRejected, error);
      }
    };
    this.then = (function(_this) {
      return function(onResolved, onRejected) {
        var pendingResolver;
        if (isFunction(onResolved) || isFunction(onRejected)) {
          pendingResolver = new Resolver(onResolved, onRejected, _this.context);
          nextTick(function() {
            return schedule(pendingResolver);
          });
          return pendingResolver.promise;
        }
        return _this.promise;
      };
    })(this);
  }

  return Resolver;

})();

Promise = (function() {
  function Promise(resolver) {
    this.then = function(onFulfilled, onRejected) {
      return resolver.then(onFulfilled, onRejected);
    };
  }

  return Promise;

})();

Deferred = (function(_super) {
  __extends(Deferred, _super);

  function Deferred(context) {
    var resolver;
    resolver = new Resolver(null, null, context);
    this.promise = resolver.promise;
    this.resolve = function(result) {
      return resolver.resolve(result);
    };
    this.reject = function(error) {
      return resolver.reject(error);
    };
  }

  return Deferred;

})(Module);

module.exports = {
  Deferred: Deferred,
  defer: function() {
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Deferred, arguments, function(){});
  }
};


}).call(this,require("/home/lyla/Documents/Programming/ComboGame1/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"/home/lyla/Documents/Programming/ComboGame1/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":1,"Module":6}],95:[function(require,module,exports){

/*
Signal & SignalBinding adapted from https://raw.github.com/millermedeiros/js-signals/
 */
var Signal, SignalBinding, validateListener,
  __slice = [].slice;

SignalBinding = require('util/SignalBinding');

validateListener = function(listener, fnName) {
  if (typeof listener !== "function") {
    throw new Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}", fnName));
  }
};


/*
Custom event broadcaster
<br />- inspired by Robert Penner's AS3 Signals.
@name cg.util.Signal
@author Miller Medeiros
@constructor
 */

Signal = (function() {
  function Signal(name) {
    this.name = name;

    /*
    @type Array.<SignalBinding>
    @private
     */
    this._bindings = [];
    this._prevParams = null;
    this.dispatch = (function(_this) {
      return function() {
        return Signal.prototype.dispatch.apply(_this, arguments);
      };
    })(this);
  }


  /*
  If Signal should keep record of previously dispatched parameters and
  automatically execute listener during `add()`/`addOnce()` if Signal was
  already dispatched before.
  @type boolean
   */

  Signal.prototype.memorize = false;


  /*
  @type boolean
  @private
   */

  Signal.prototype._shouldPropagate = true;


  /*
  If Signal is active and should broadcast events.
  <p><strong>IMPORTANT:</strong> Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
  @type boolean
   */

  Signal.prototype.active = true;


  /*
  @param {Function} listener
  @param {boolean} isOnce
  @param {Object} [listenerContext]
  @param {Number} [priority]
  @return {SignalBinding}
  @private
   */

  Signal.prototype._registerListener = function(listener, isOnce, listenerContext, priority) {
    var binding, prevIndex;
    prevIndex = this._indexOfListener(listener, listenerContext);
    binding = void 0;
    if (prevIndex !== -1) {
      binding = this._bindings[prevIndex];
      if (binding.isOnce() !== isOnce) {
        throw new Error("You cannot add" + (isOnce ? "" : "Once") + "() then add" + (!isOnce ? "" : "Once") + "() the same listener without removing the relationship first.");
      }
    } else {
      binding = new SignalBinding(this, listener, isOnce, listenerContext, priority);
      this._addBinding(binding);
    }
    if (this.memorize && this._prevParams) {
      binding.execute(this._prevParams);
    }
    return binding;
  };


  /*
  @param {SignalBinding} binding
  @private
   */

  Signal.prototype._addBinding = function(binding) {
    var n;
    n = this._bindings.length;
    while (true) {
      --n;
      if (!(this._bindings[n] && binding._priority <= this._bindings[n]._priority)) {
        break;
      }
    }
    return this._bindings.splice(n + 1, 0, binding);
  };


  /*
  @param {Function} listener
  @return {number}
  @private
   */

  Signal.prototype._indexOfListener = function(listener, context) {
    var cur, n;
    n = this._bindings.length;
    cur = void 0;
    while (n--) {
      cur = this._bindings[n];
      if (cur._listener === listener && cur.context === context) {
        return n;
      }
    }
    return -1;
  };


  /*
  Check if listener was attached to Signal.
  @param {Function} listener
  @param {Object} [context]
  @return {boolean} if Signal has the specified listener.
   */

  Signal.prototype.has = function(listener, context) {
    return this._indexOfListener(listener, context) !== -1;
  };


  /*
  Add a listener to the signal.
  @param {Function} listener Signal handler function.
  @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
  @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
  @return {SignalBinding} An Object representing the binding between the Signal and listener.
   */

  Signal.prototype.add = function(listener, listenerContext, priority) {
    validateListener(listener, "add");
    return this._registerListener(listener, false, listenerContext, priority);
  };


  /*
  Add listener to the signal that should be removed after first execution (will be executed only once).
  @param {Function} listener Signal handler function.
  @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
  @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
  @return {SignalBinding} An Object representing the binding between the Signal and listener.
   */

  Signal.prototype.addOnce = function(listener, listenerContext, priority) {
    validateListener(listener, "addOnce");
    return this._registerListener(listener, true, listenerContext, priority);
  };


  /*
  Remove a single listener from the dispatch queue.
  @param {Function} listener Handler function that should be removed.
  @param {Object} [context] Execution context (since you can add the same handler multiple times if executing in a different context).
  @return {Function} Listener handler function.
   */

  Signal.prototype.remove = function(listener, context) {
    var i;
    validateListener(listener, "remove");
    i = this._indexOfListener(listener, context);
    if (i !== -1) {
      this._bindings[i]._destroy();
      this._bindings.splice(i, 1);
    }
    return listener;
  };


  /*
  Remove all listeners from the Signal.
   */

  Signal.prototype.removeAll = function() {
    var n;
    n = this._bindings.length;
    while (n--) {
      this._bindings[n]._destroy();
    }
    return this._bindings.length = 0;
  };


  /*
  @return {number} Number of listeners attached to the Signal.
   */

  Signal.prototype.getNumListeners = function() {
    return this._bindings.length;
  };


  /*
  Stop propagation of the event, blocking the dispatch to next listeners on the queue.
  <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
  @see Signal.prototype.disable
   */

  Signal.prototype.halt = function() {
    return this._shouldPropagate = false;
  };


  /*
  Dispatch/Broadcast Signal to all listeners added to the queue.
  @param {...*} [params] Parameters that should be passed to each handler.
   */

  Signal.prototype.dispatch = function() {
    var bindings, n, params, _results;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (!this.active) {
      return;
    }
    n = this._bindings.length;
    bindings = void 0;
    if (this.memorize) {
      this._prevParams = params;
    }
    if (!n) {
      return;
    }
    bindings = this._bindings.slice();
    this._shouldPropagate = true;
    _results = [];
    while (true) {
      n--;
      if (!(bindings[n] && this._shouldPropagate && bindings[n].execute(params) !== false)) {
        break;
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };


  /*
  Forget memorized arguments.
  @see Signal.memorize
   */

  Signal.prototype.forget = function() {
    return this._prevParams = null;
  };


  /*
  Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
  <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
   */

  Signal.prototype.dispose = function() {
    this.removeAll();
    delete this._bindings;
    return delete this._prevParams;
  };


  /*
  @return {string} String representation of the object.
   */

  Signal.prototype.toString = function() {
    return "[Signal active:" + this.active + " numListeners:" + this.getNumListeners() + "]";
  };

  return Signal;

})();

module.exports = Signal;


},{"util/SignalBinding":96}],96:[function(require,module,exports){

/*
Signal & SignalBinding adapted from https://raw.github.com/millermedeiros/js-signals/
 */

/*
Object that represents a binding between a Signal and a listener function.
<br />- <strong>This is an internal constructor and shouldn't be called by regular users.</strong>
<br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
@author Miller Medeiros
@constructor
@internal
@name SignalBinding
@param {Signal} signal Reference to Signal object that listener is currently bound to.
@param {Function} listener Handler function bound to the signal.
@param {boolean} isOnce If binding should be executed just once.
@param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
@param {Number} [priority] The priority level of the event listener. (default = 0).
 */
var SignalBinding;

SignalBinding = (function() {
  function SignalBinding(signal, listener, isOnce, listenerContext, priority) {

    /*
    Handler function bound to the signal.
    @type Function
    @private
     */
    this._listener = listener;

    /*
    If binding should be executed just once.
    @type boolean
    @private
     */
    this._isOnce = isOnce;

    /*
    Context on which listener will be executed (object that should represent the `this` variable inside listener function).
    @memberOf SignalBinding.prototype
    @name context
    @type Object|undefined|null
     */
    this.context = listenerContext;

    /*
    Reference to Signal object that listener is currently bound to.
    @type Signal
    @private
     */
    this._signal = signal;

    /*
    Listener priority
    @type Number
    @private
     */
    this._priority = priority || 0;
  }


  /*
  If binding is active and should be executed.
  @type boolean
   */

  SignalBinding.prototype.active = true;


  /*
  Default parameters passed to listener during `Signal.dispatch` and `SignalBinding.execute`. (curried parameters)
  @type Array|null
   */

  SignalBinding.prototype.params = null;


  /*
  Call listener passing arbitrary parameters.
  <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p>
  @param {Array} [paramsArr] Array of parameters that should be passed to the listener
  @return {*} Value returned by the listener.
   */

  SignalBinding.prototype.execute = function(paramsArr) {
    var handlerReturn, params;
    handlerReturn = void 0;
    params = void 0;
    if (this.active && !!this._listener) {
      params = (this.params ? this.params.concat(paramsArr) : paramsArr);
      handlerReturn = this._listener.apply(this.context, params);
      if (this._isOnce) {
        this.detach();
      }
    }
    return handlerReturn;
  };


  /*
  Detach binding from signal.
  - alias to: mySignal.remove(myBinding.getListener());
  @return {Function|null} Handler function bound to the signal or `null` if binding was previously detached.
   */

  SignalBinding.prototype.detach = function() {
    if (this.isBound()) {
      return this._signal.remove(this._listener, this.context);
    } else {
      return null;
    }
  };


  /*
  @return {Boolean} `true` if binding is still bound to the signal and have a listener.
   */

  SignalBinding.prototype.isBound = function() {
    return !!this._signal && !!this._listener;
  };


  /*
  @return {boolean} If SignalBinding will only be executed once.
   */

  SignalBinding.prototype.isOnce = function() {
    return this._isOnce;
  };


  /*
  @return {Function} Handler function bound to the signal.
   */

  SignalBinding.prototype.getListener = function() {
    return this._listener;
  };


  /*
  @return {Signal} Signal that listener is currently bound to.
   */

  SignalBinding.prototype.getSignal = function() {
    return this._signal;
  };


  /*
  Delete instance properties
  @private
   */

  SignalBinding.prototype._destroy = function() {
    delete this._signal;
    delete this._listener;
    return delete this.context;
  };


  /*
  @return {string} String representation of the object.
   */

  SignalBinding.prototype.toString = function() {
    return "[SignalBinding isOnce:" + this._isOnce + ", isBound:" + this.isBound() + ", active:" + this.active + "]";
  };

  return SignalBinding;

})();

module.exports = SignalBinding;


},{}],97:[function(require,module,exports){
(function (process){
/*
Copyright (c) 2010 Caolan McMahon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*global setImmediate: false, setTimeout: false, console: false */
(function () {

    var async = {};

    // global on the server, window in the browser
    var root, previous_async;

    root = this;
    if (root != null) {
      previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        var called = false;
        return function() {
            if (called) throw new Error("Callback was already called.");
            called = true;
            fn.apply(root, arguments);
        }
    }

    //// cross-browser compatiblity functions ////

    var _each = function (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    var _map = function (arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _each(arr, function (x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };

    var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
            return arr.reduce(iterator, memo);
        }
        _each(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        if (typeof setImmediate === 'function') {
            async.nextTick = function (fn) {
                // not a direct alias for IE10 compatibility
                setImmediate(fn);
            };
            async.setImmediate = async.nextTick;
        }
        else {
            async.nextTick = function (fn) {
                setTimeout(fn, 0);
            };
            async.setImmediate = async.nextTick;
        }
    }
    else {
        async.nextTick = process.nextTick;
        if (typeof setImmediate !== 'undefined') {
            async.setImmediate = setImmediate;
        }
        else {
            async.setImmediate = async.nextTick;
        }
    }

    async.each = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
            iterator(x, only_once(function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                }
            }));
        });
    };
    async.forEach = async.each;

    async.eachSeries = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
    async.forEachSeries = async.eachSeries;

    async.eachLimit = function (arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [arr, iterator, callback]);
    };
    async.forEachLimit = async.eachLimit;

    var _eachLimit = function (limit) {

        return function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length || limit <= 0) {
                return callback();
            }
            var completed = 0;
            var started = 0;
            var running = 0;

            (function replenish () {
                if (completed >= arr.length) {
                    return callback();
                }

                while (running < limit && started < arr.length) {
                    started += 1;
                    running += 1;
                    iterator(arr[started - 1], function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            running -= 1;
                            if (completed >= arr.length) {
                                callback();
                            }
                            else {
                                replenish();
                            }
                        }
                    });
                }
            })();
        };
    };


    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.each].concat(args));
        };
    };
    var doParallelLimit = function(limit, fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.eachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (err, v) {
                results[x.index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = function (arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
    };

    var _mapLimit = function(limit) {
        return doParallelLimit(limit, _asyncMap);
    };

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                    main_callback = function () {};
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || function () {};
        var keys = _keys(tasks);
        if (!keys.length) {
            return callback(null);
        }

        var results = {};

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            _each(listeners.slice(0), function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (_keys(results).length === keys.length) {
                callback(null, results);
                callback = function () {};
            }
        });

        _each(keys, function (k) {
            var task = (tasks[k] instanceof Function) ? [tasks[k]]: tasks[k];
            var taskCallback = function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _each(_keys(results), function(rkey) {
                        safeResults[rkey] = results[rkey];
                    });
                    safeResults[k] = args;
                    callback(err, safeResults);
                    // stop subsequent errors hitting callback multiple times
                    callback = function () {};
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            };
            if (ready()) {
                task[task.length - 1](taskCallback, results);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback, results);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.waterfall = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor !== Array) {
          var err = new Error('First argument to waterfall must be an array of functions');
          return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback.apply(null, arguments);
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.setImmediate(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    var _parallel = function(eachfn, tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            eachfn.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            eachfn.each(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.parallel = function (tasks, callback) {
        _parallel({ map: async.map, each: async.each }, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
    };

    async.series = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.eachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.whilst(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (test()) {
                async.doWhilst(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.until(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doUntil = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (!test()) {
                async.doUntil(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.queue = function (worker, concurrency) {
        if (concurrency === undefined) {
            concurrency = 1;
        }
        function _insert(q, data, pos, callback) {
          if(data.constructor !== Array) {
              data = [data];
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  callback: typeof callback === 'function' ? callback : null
              };

              if (pos) {
                q.tasks.unshift(item);
              } else {
                q.tasks.push(item);
              }

              if (q.saturated && q.tasks.length === concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }

        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
              _insert(q, data, false, callback);
            },
            unshift: function (data, callback) {
              _insert(q, data, true, callback);
            },
            process: function () {
                if (workers < q.concurrency && q.tasks.length) {
                    var task = q.tasks.shift();
                    if (q.empty && q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    var next = function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        if (q.drain && q.tasks.length + workers === 0) {
                            q.drain();
                        }
                        q.process();
                    };
                    var cb = only_once(next);
                    worker(task.data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            }
        };
        return q;
    };

    async.cargo = function (worker, payload) {
        var working     = false,
            tasks       = [];

        var cargo = {
            tasks: tasks,
            payload: payload,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
                if(data.constructor !== Array) {
                    data = [data];
                }
                _each(data, function(task) {
                    tasks.push({
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    });
                    if (cargo.saturated && tasks.length === payload) {
                        cargo.saturated();
                    }
                });
                async.setImmediate(cargo.process);
            },
            process: function process() {
                if (working) return;
                if (tasks.length === 0) {
                    if(cargo.drain) cargo.drain();
                    return;
                }

                var ts = typeof payload === 'number'
                            ? tasks.splice(0, payload)
                            : tasks.splice(0);

                var ds = _map(ts, function (task) {
                    return task.data;
                });

                if(cargo.empty) cargo.empty();
                working = true;
                worker(ds, function () {
                    working = false;

                    var args = arguments;
                    _each(ts, function (data) {
                        if (data.callback) {
                            data.callback.apply(null, args);
                        }
                    });

                    process();
                });
            },
            length: function () {
                return tasks.length;
            },
            running: function () {
                return working;
            }
        };
        return cargo;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _each(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
            return x;
        };
        var memoized = function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                callback.apply(null, memo[key]);
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                      q[i].apply(null, arguments);
                    }
                }]));
            }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
      return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
      };
    };

    async.times = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.map(counter, iterator, callback);
    };

    async.timesSeries = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.mapSeries(counter, iterator, callback);
    };

    async.compose = function (/* functions... */) {
        var fns = Array.prototype.reverse.call(arguments);
        return function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([function () {
                    var err = arguments[0];
                    var nextargs = Array.prototype.slice.call(arguments, 1);
                    cb(err, nextargs);
                }]))
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        };
    };

    var _applyEach = function (eachfn, fns /*args...*/) {
        var go = function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            return eachfn(fns, function (fn, cb) {
                fn.apply(that, args.concat([cb]));
            },
            callback);
        };
        if (arguments.length > 2) {
            var args = Array.prototype.slice.call(arguments, 2);
            return go.apply(this, args);
        }
        else {
            return go;
        }
    };
    async.applyEach = doParallel(_applyEach);
    async.applyEachSeries = doSeries(_applyEach);

    async.forever = function (fn, callback) {
        function next(err) {
            if (err) {
                if (callback) {
                    return callback(err);
                }
                throw err;
            }
            fn(next);
        }
        next();
    };

    // AMD / RequireJS
    if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // Node.js
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());
}).call(this,require("/home/lyla/Documents/Programming/ComboGame1/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"/home/lyla/Documents/Programming/ComboGame1/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":1}],98:[function(require,module,exports){
var DeferredProxy, HasPooling, HasSignals, Promises, Signal, SignalBinding, name, util, _fn, _i, _len, _ref,
  __hasProp = {}.hasOwnProperty;

DeferredProxy = require('util/DeferredProxy');

HasPooling = require('util/HasPooling');

HasSignals = require('util/HasSignals');

Promises = require('util/Promises');

Signal = require('util/Signal');

SignalBinding = require('util/SignalBinding');

util = {
  sizeOf: function(obj) {
    var k, s, v;
    s = 0;
    for (k in obj) {
      if (!__hasProp.call(obj, k)) continue;
      v = obj[k];
      ++s;
    }
    return s;
  },
  isArray: function(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  },
  arrayRemove: function(arr, from, to) {
    var rest;
    rest = arr.slice((to || from) + 1 || arr.length);
    arr.length = (from < 0 ? arr.length + from : from);
    return arr.push.apply(arr, rest);
  },
  rgba: function(str) {
    var split;
    if (str[0] === '#') {
      if (str.length === 4) {
        str = "#" + str[1] + str[1] + str[2] + str[2] + str[3] + str[3];
      }
      return [parseInt(str.slice(1, 3), 16) / 255 || 0, parseInt(str.slice(3, 5), 16) / 255 || 0, parseInt(str.slice(5, 7), 16) / 255 || 0, 1.0];
    }
    if (str.slice(0, 3) === 'rgb') {
      split = str.slice(str.indexOf('(') + 1, +(str.indexOf(')') - 1) + 1 || 9e9).split(',');
      return [parseInt(split[0]) / 255 || 0, parseInt(split[1]) / 255 || 0, parseInt(split[2]) / 255 || 0, parseInt(split[3]) || 1];
    }
    return [0, 0, 0, 1];
  },
  isNaN: function(obj) {
    return util.isNumber(obj) && obj !== +obj;
  },

  /*
  Converts a hex color number to an [R, G, B] array
  
  @method HEXtoRGB
  @param hex {Number}
   */
  hexToRGB: function(hex) {
    return [(hex >> 16 & 0xFF) / 255, (hex >> 8 & 0xFF) / 255, (hex & 0xFF) / 255];
  },
  Float32Array: typeof Float32Array !== "undefined" && Float32Array !== null ? Float32Array : Array,
  Uint16Array: typeof Uint16Array !== "undefined" && Uint16Array !== null ? Uint16Array : Array,
  DeferredProxy: DeferredProxy,
  HasPooling: HasPooling,
  HasSignals: HasSignals,
  Promises: Promises,
  Signal: Signal,
  SignalBinding: SignalBinding
};

_ref = ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'];
_fn = function(name) {
  return util['is' + name] = function(obj) {
    return toString.call(obj) === '[object ' + name + ']';
  };
};
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  name = _ref[_i];
  _fn(name);
}

module.exports = util;


},{"util/DeferredProxy":90,"util/HasPooling":92,"util/HasSignals":93,"util/Promises":94,"util/Signal":95,"util/SignalBinding":96}],99:[function(require,module,exports){
var ComboGame, Trogdor, Villager, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Villager = require('Villager');

Trogdor = require('Trogdor');

ComboGame = (function(_super) {
  __extends(ComboGame, _super);

  function ComboGame() {
    var i, _i;
    ComboGame.__super__.constructor.apply(this, arguments);
    Trogdor.initalizeControls();
    this.trogdor = this.addChild(new Trogdor({
      x: cg.width / 3,
      y: cg.height / 3,
      id: 'trogdor'
    }));
    for (i = _i = 1; _i <= 100; i = ++_i) {
      this.addChild(new Villager({
        x: cg.rand(cg.width),
        y: cg.rand(cg.height)
      }));
    }
    this.trogdor.bringToFront();
  }

  ComboGame.prototype.update = function() {
    return ComboGame.__super__.update.apply(this, arguments);
  };

  return ComboGame;

})(cg.Scene);

module.exports = ComboGame;


},{"Trogdor":101,"Villager":102,"cg":13}],100:[function(require,module,exports){
var Fire, Interactive, Physical, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Physical = require('plugins/physics/Physical');

Interactive = require('plugins/ui/Interactive');

Fire = (function(_super) {
  __extends(Fire, _super);

  Fire.plugin(Interactive);

  function Fire(trogdor) {
    this.trogdor = trogdor;
    Fire.__super__.constructor.apply(this, arguments);
    this.anims = {
      burn: cg.assets.sheets.fireright.anim([0, 1, 2, 3, 2, 1], 100)
    };
    this.anim = this.anims.burn;
    this.scale = 0.5;
    console.log("Trogdor is " + this.trogdor.x);
  }

  Fire.prototype.update = function() {
    Fire.__super__.update.apply(this, arguments);
    this.x += 1;
    return console.log(this.x);

    /*console.log("Trogdor is " + @trogdor.x)
    
    if @trogdor.flipX
      @x = (@trogdor.x)-40
      @flipX = true
    else
      @x = (@trogdor.x)+40
      @flipX = false
    
    @y = (@trogdor.y)-10
    console.log("Flame is " + @x)
     */
  };

  return Fire;

})(cg.SpriteActor);

module.exports = Fire;


},{"cg":13,"plugins/physics/Physical":42,"plugins/ui/Interactive":47}],101:[function(require,module,exports){
var Fire, Interactive, Physical, TROGDOR_SPEED, Trogdor, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Physical = require('plugins/physics/Physical');

Interactive = require('plugins/ui/Interactive');

Fire = require('Fire');

TROGDOR_SPEED = 10;

Trogdor = (function(_super) {
  __extends(Trogdor, _super);

  Trogdor.plugin(Interactive);

  function Trogdor() {
    Trogdor.__super__.constructor.apply(this, arguments);
    this.texture = 'trogdor';
    this.controls = cg.input.controls.trogdorControls;
    this.velocity = new cg.math.Vector2;
    this.fire = this.addChild(new Fire({
      x: cg.width / 2,
      y: cg.height / 2,
      id: 'fire',
      trogdor: this
    }));
    this.on('leftright', function(val) {
      this.velocity.x = val * TROGDOR_SPEED;
      if (val < 0) {
        return this.flipX = true;
      } else if (val > 0) {
        return this.flipX = false;
      }
    });
    this.on('updown', function(val) {
      return this.velocity.y = val * TROGDOR_SPEED;
    });
  }

  Trogdor.prototype.update = function() {
    Trogdor.__super__.update.apply(this, arguments);
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    if (this.x > cg.width) {
      this.x = this.x % cg.width;
    }
    if (this.right < 0) {
      this.x = this.right + cg.width;
    }
    if (this.y > cg.height) {
      this.y = this.y % cg.height;
    }
    if (this.bottom < 0) {
      return this.bottom = this.bottom + cg.height;
    }
  };

  Trogdor.initalizeControls = function() {
    return cg.input.map('trogdorControls', {
      leftright: ['left/right'],
      updown: ['up/down']
    });
  };

  return Trogdor;

})(cg.SpriteActor);

module.exports = Trogdor;


},{"Fire":100,"cg":13,"plugins/physics/Physical":42,"plugins/ui/Interactive":47}],102:[function(require,module,exports){
var Interactive, POPUP_TIMERANGE_MAX, POPUP_TIMERANGE_MIN, Physical, Villager, cg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

cg = require('cg');

Physical = require('plugins/physics/Physical');

Interactive = require('plugins/ui/Interactive');

POPUP_TIMERANGE_MAX = 3000;

POPUP_TIMERANGE_MIN = 500;

Villager = (function(_super) {
  __extends(Villager, _super);

  Villager.plugin(Interactive);

  function Villager() {
    Villager.__super__.constructor.apply(this, arguments);
    this.anims = {
      idle: cg.assets.sheets.villager.anim([0]),
      walk: cg.assets.sheets.villager.anim([1, 2], 200),
      hide: cg.assets.sheets.villager.anim([0]),
      show: cg.assets.sheets.villager.anim([0])
    };
    this.popUp();
    this.anim = this.anims.walk;
  }

  Villager.prototype.popUp = function() {
    this.anim = this.anims.show;
    this.show(100, (function(_this) {
      return function() {
        return _this.anim = _this.anims.walk;
      };
    })(this));
    return this.delay(cg.rand(POPUP_TIMERANGE_MIN, POPUP_TIMERANGE_MAX), this.popDown);
  };

  Villager.prototype.popDown = function() {
    this.anim = this.anims.hide;
    this.hide(100);
    return this.delay(cg.rand(POPUP_TIMERANGE_MIN, POPUP_TIMERANGE_MAX), this.popUp);
  };

  Villager.prototype.update = function() {
    return Villager.__super__.update.apply(this, arguments);
  };

  return Villager;

})(cg.SpriteActor);

module.exports = Villager;


},{"cg":13,"plugins/physics/Physical":42,"plugins/ui/Interactive":47}],103:[function(require,module,exports){
var ComboGame, Physics, UI, cg;

cg = require('cg');

require('index');

UI = require('plugins/ui/UI');

Physics = require('plugins/physics/Physics');

ComboGame = require('ComboGame');

module.exports = function() {
  var loadingScreen;
  cg.plugin(UI);
  cg.plugin(Physics);
  cg.init({
    name: 'Combo Game',
    width: 400,
    height: 270,
    backgroundColor: 0x222222,
    displayMode: 'pixel'
  });
  loadingScreen = cg.stage.addChild(new cg.extras.LoadingScreen);
  loadingScreen.begin();
  cg.assets.loadJSON('assets.json').then(function(pack) {
    return cg.assets.preload(pack, {
      error: function(src) {
        return cg.error('Failed to load asset ' + src);
      },
      progress: function(src, data, loaded, count) {
        cg.log("Loaded '" + src + "'");
        return loadingScreen.setProgress(loaded / count);
      },
      complete: function() {
        return loadingScreen.complete().then(function() {
          loadingScreen.destroy();
          return cg.stage.addChild(new ComboGame({
            id: 'main'
          }));
        });
      }
    });
  }, function(err) {
    throw new Error('Failed to load assets.json: ' + err.message);
  });
  document.getElementById('pleasewait').style.display = 'none';
  return document.getElementById('combo-game').style.display = 'inherit';
};

module.exports();


},{"ComboGame":99,"cg":13,"index":25,"plugins/physics/Physics":43,"plugins/ui/UI":48}]},{},[103])


//# sourceMappingURL=main-built.js.map