(function () {
/**
 * almond 0.2.7 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        if (config.deps) {
            req(config.deps, config.callback);
        }
        return req;
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("bower_components/almond/almond", function(){});

define('parsley/ui', [],function () {
  var UI = function(options) {
    this.__class__ = 'UI';
    this.init(options);
  };

  UI.prototype = {
    init: function(options) {
      this.options= options;
    }
  };

  return UI;
});

/*!
* validator.js
* Guillaume Potier - <guillaume@wisembly.com>
* Version 0.4.10 - built Sun Dec 29 2013 19:39:48
* MIT Licensed
*
*/

( function ( exports ) {

  /**
  * Validator
  */

  var Validator = function ( options ) {
    this.__class__ = 'Validator';
    this.__version__ = '0.4.10';
    this.options = options || {};
    this.bindingKey = this.options.bindingKey || '_validatorjsConstraint';

    return this;
  };

  Validator.prototype = {

    constructor: Validator,

    /*
    * Validate string: validate( string, string ) || validate( string, [ string, string] )
    * Validate object: validate( object, constraint, string ) || validate( object, constraint, [ string, string ] )
    * Validate binded object: validate( object, string ) || validate( object, [ string, string] )
    */
    validate: function ( objectOrString, AssertsOrConstraintOrGroup, group ) {
      if ( 'string' !== typeof objectOrString && 'object' !== typeof objectOrString )
        throw new Error( 'You must validate an object or a string' );

      // string validation
      if ( 'string' === typeof objectOrString)
        return this._validateString( objectOrString, AssertsOrConstraintOrGroup, group );

      // binded object validation
      if ( this.isBinded( objectOrString ) )
        return this._validateBindedObject( objectOrString, AssertsOrConstraintOrGroup );

      // regular object validation
      return this._validateObject( objectOrString, AssertsOrConstraintOrGroup, group );
    },

    version: function () {
      return this.__version__;
    },

    bind: function ( object, constraint ) {
      if ( 'object' !== typeof object )
        throw new Error( 'Must bind a Constraint to an object' );

      object[ this.bindingKey ] = new Constraint( constraint );

      return this;
    },

    unbind: function ( object ) {
      if ( 'undefined' === typeof object._validatorjsConstraint )
        return this;

      delete object[ this.bindingKey ];

      return this;
    },

    isBinded: function ( object ) {
      return 'undefined' !== typeof object[ this.bindingKey ];
    },

    getBinded: function ( object ) {
      return this.isBinded( object ) ? object[ this.bindingKey ] : null;
    },

    _validateString: function ( string, assert, group ) {
      var result, failures = [];

      if ( !_isArray( assert ) )
        assert = [ assert ];

      for ( var i = 0; i < assert.length; i++ ) {
        if ( ! ( assert[ i ] instanceof Assert) )
          throw new Error( 'You must give an Assert or an Asserts array to validate a string' );

        result = assert[ i ].check( string, group );

        if ( result instanceof Violation )
          failures.push( result );
      }

      return failures.length ? failures : true;
    },

    _validateObject: function ( object, constraint, group ) {
      if ( 'object' !== typeof constraint )
        throw new Error( 'You must give a constraint to validate an object' );

      if ( constraint instanceof Constraint )
        return constraint.check( object, group );

      return new Constraint( constraint ).check( object, group );
    },

    _validateBindedObject: function ( object, group ) {
      return object[ this.bindingKey ].check( object, group );
    }
  };

  Validator.errorCode = {
    must_be_a_string: 'must_be_a_string',
    must_be_an_array: 'must_be_an_array',
    must_be_a_number: 'must_be_a_number'
  };

  /**
  * Constraint
  */

  var Constraint = function ( data, options ) {
    this.__class__ = 'Constraint';
    this.options = options || {};
    this.nodes = {};

    if ( data ) {
      try {
        this._bootstrap( data );
      } catch ( err ) {
        throw new Error( 'Should give a valid mapping object to Constraint', err, data );
      }
    }

    return this;
  };

  Constraint.prototype = {

    constructor: Constraint,

    check: function ( object, group ) {
      var result, failures = {};

      // check all constraint nodes if strict validation enabled. Else, only object nodes that have a constraint
      for ( var property in this.options.strict ? this.nodes : object ) {
        if ( this.options.strict ? this.has( property, object ) : this.has( property ) ) {
          result = this._check( property, object[ property ], group );

          // check returned an array of Violations or an object mapping Violations
          if ( ( _isArray( result ) && result.length > 0 ) || ( !_isArray( result ) && !_isEmptyObject( result ) ) )
            failures[ property ] = result;

        // in strict mode, get a violation for each constraint node not in object
        } else if ( this.options.strict ) {
          try {
            // we trigger here a HaveProperty Assert violation to have uniform Violation object in the end
            new Assert().HaveProperty( property ).validate( object );
          } catch ( violation ) {
            failures[ property ] = violation;
          }
        }
      }

      return _isEmptyObject(failures) ? true : failures;
    },

    add: function ( node, object ) {
      if ( object instanceof Assert  || ( _isArray( object ) && object[ 0 ] instanceof Assert ) ) {
        this.nodes[ node ] = object;

        return this;
      }

      if ( 'object' === typeof object && !_isArray( object ) ) {
        this.nodes[ node ] = object instanceof Constraint ? object : new Constraint( object );

        return this;
      }

      throw new Error( 'Should give an Assert, an Asserts array, a Constraint', object );
    },

    has: function ( node, nodes ) {
      var nodes = 'undefined' !== typeof nodes ? nodes : this.nodes;
      return 'undefined' !== typeof nodes[ node ];
    },

    get: function ( node, placeholder ) {
      return this.has( node ) ? this.nodes[ node ] : placeholder || null;
    },

    remove: function ( node ) {
      var _nodes = [];

      for ( var i in this.nodes )
        if ( i !== node )
          _nodes[ i ] = this.nodes[ i ];

      this.nodes = _nodes;

      return this;
    },

    _bootstrap: function ( data ) {
      if ( data instanceof Constraint )
        return this.nodes = data.nodes;

      for ( var node in data )
        this.add( node, data[ node ] );
    },

    _check: function ( node, value, group ) {
      // Assert
      if ( this.nodes[ node ] instanceof Assert )
        return this._checkAsserts( value, [ this.nodes[ node ] ], group );

      // Asserts
      if ( _isArray( this.nodes[ node ] ) )
        return this._checkAsserts( value, this.nodes[ node ], group );

      // Constraint -> check api
      if ( this.nodes[ node ] instanceof Constraint )
        return this.nodes[ node ].check( value, group );

      throw new Error( 'Invalid node', this.nodes[ node ] );
    },

    _checkAsserts: function ( value, asserts, group ) {
      var result, failures = [];

      for ( var i = 0; i < asserts.length; i++ ) {
        result = asserts[ i ].check( value, group );

        if ( 'undefined' !== typeof result && true !== result )
          failures.push( result );

        // Some asserts (Collection for example) could return an object
        // if ( result && ! ( result instanceof Violation ) )
        //   return result;
        //
        // // Vast assert majority return Violation
        // if ( result instanceof Violation )
        //   failures.push( result );
      }

      return failures;
    }
  };

  /**
  * Violation
  */

  var Violation = function ( assert, value, violation ) {
    this.__class__ = 'Violation';

    if ( ! ( assert instanceof Assert ) )
      throw new Error( 'Should give an assertion implementing the Assert interface' );

    this.assert = assert.__class__;
    this.value = value;

    if ( 'undefined' !== typeof violation)
      this.violation = violation;
  };

  Violation.prototype = {
    show: function () {
      var show =  {
        assert: this.assert,
        value: this.value
      };

      if ( this.violation )
        show.violation = this.violation;

      return show;
    },

    __toString: function () {
      if ( 'undefined' !== typeof this.violation )
        var violation = '", ' + this.getViolation().constraint + ' expected was ' + this.getViolation().expected;

      return this.assert + ' assert failed for "' + this.value + violation || '';
    },

    getViolation: function () {
      var constraint, expected;

      for ( constraint in this.violation )
        expected = this.violation[ constraint ];

      return { constraint: constraint, expected: expected };
    }
  };

  /**
  * Assert
  */

  var Assert = function ( group ) {
    this.__class__ = 'Assert';
    this.__parentClass__ = this.__class__;
    this.groups = [];

    if ( 'undefined' !== typeof group )
      this.addGroup( group );

    return this;
  };

  Assert.prototype = {

    construct: Assert,

    check: function ( value, group ) {
      if ( group && !this.hasGroup( group ) )
        return;

      if ( !group && this.hasGroups() )
        return;

      try {
        return this.validate( value, group );
      } catch ( violation ) {
        return violation;
      }
    },

    hasGroup: function ( group ) {
      if ( 'string' !== typeof group )
        return this.hasOneOf( group );

      // Asserts with no group also respond to "Default" group. Else return false
      if ( !this.hasGroups() )
        return 'Default' === group;

      return -1 !== this.groups.indexOf( group );
    },

    hasOneOf: function ( groups ) {
      for ( var i = 0; i < groups.length; i++ )
        if ( this.hasGroup( groups[ i ] ) )
          return true;

      return false;
    },

    hasGroups: function () {
      return this.groups.length > 0;
    },

    addGroup: function ( group ) {
      if ( _isArray( group ) )
        return this.addGroups( group );

      if ( !this.hasGroup( group ) )
        this.groups.push( group );

      return this;
    },

    removeGroup: function ( group ) {
      var _groups = [];

      for ( var i = 0; i < this.groups.length; i++ )
        if ( group !== this.groups[ i ] )
          _groups.push( this.groups[ i ] );

      this.groups = _groups;

      return this;
    },

    addGroups: function ( groups ) {
      for ( var i = 0; i < groups.length; i++ )
        this.addGroup( groups[ i ] );

      return this;
    },

    /**
    * Asserts definitions
    */

    HaveProperty: function ( node ) {
      this.__class__ = 'HaveProperty';
      this.node = node;

      this.validate = function ( object ) {
        if ( 'undefined' === typeof object[ this.node ] )
          throw new Violation( this, object, { value: this.node } );

        return true;
      };

      return this;
    },

    Blank: function () {
      this.__class__ = 'Blank';

      this.validate = function ( value ) {
        if ( 'string' !== typeof value )
          throw new Violation( this, value, { value: Validator.errorCode.must_be_a_string } );

        if ( '' !== value.replace( /^\s+/g, '' ).replace( /\s+$/g, '' ) )
          throw new Violation( this, value );

        return true;
      };

      return this;
    },

    Callback: function ( fn ) {
      this.__class__ = 'Callback';

      if ( 'function' !== typeof fn )
        throw new Error( 'Callback must be instanciated with a function' );

      this.fn = fn;

      this.validate = function ( value ) {
        var result = fn( value, this );

        if ( true !== result )
          throw new Violation( this, value, { result: result } );

        return true;
      };

      return this;
    },

    Choice: function ( list ) {
      this.__class__ = 'Choice';

      if ( !_isArray( list ) && 'function' !== typeof list )
        throw new Error( 'Choice must be instanciated with an array or a function' );

      this.list = list;

      this.validate = function ( value ) {
        var list = 'function' === typeof this.list ? this.list() : this.list;

        for ( var i = 0; i < list.length; i++ )
          if ( value === list[ i ] )
            return true;

        throw new Violation( this, value, { choices: list } );
      };

      return this;
    },

    Collection: function ( constraint ) {
      this.__class__ = 'Collection';
      this.constraint = 'undefined' !== typeof constraint ? new Constraint( constraint ) : false;

      this.validate = function ( collection, group ) {
        var result, validator = new Validator(), count = 0, failures = {}, groups = this.groups.length ? this.groups : group;

        if ( !_isArray( collection ) )
          throw new Violation( this, array, { value: Validator.errorCode.must_be_an_array } );

        for ( var i = 0; i < collection.length; i++ ) {
          result = this.constraint ?
            validator.validate( collection[ i ], this.constraint, groups ) :
            validator.validate( collection[ i ], groups );

          if ( !_isEmptyObject( result ) )
            failures[ count ] = result;

          count++;
        }

        return !_isEmptyObject( failures ) ? failures : true;
      };

      return this;
    },

    Count: function ( count ) {
      this.__class__ = 'Count';
      this.count = count;

      this.validate = function ( array ) {
        if ( !_isArray( array ) )
          throw new Violation( this, array, { value: Validator.errorCode.must_be_an_array } );

        var count = 'function' === typeof this.count ? this.count( array ) : this.count;

        if ( isNaN( Number( count ) ) )
          throw new Error( 'Count must be a valid interger', count );

        if ( count !== array.length )
          throw new Violation( this, array, { count: count } );

        return true;
      };

      return this;
    },

    Email: function () {
      this.__class__ = 'Email';

      this.validate = function ( value ) {
        var regExp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

        if ( 'string' !== typeof value )
          throw new Violation( this, value, { value: Validator.errorCode.must_be_a_string } );

        if ( !regExp.test( value ) )
          throw new Violation( this, value );

        return true;
      };

      return this;
    },

    Eql: function ( eql ) {
      this.__class__ = 'Eql';

      if ( 'undefined' === typeof eql )
        throw new Error( 'Equal must be instanciated with an Array or an Object' );

      this.eql = eql;

      this.validate = function ( value ) {
        var eql = 'function' === typeof this.eql ? this.eql( value ) : this.eql;

        if ( !expect.eql( eql, value ) )
          throw new Violation( this, value, { eql: eql } );

        return true;
      };

      return this;
    },

    EqualTo: function ( reference ) {
      this.__class__ = 'EqualTo';

      if ( 'undefined' === typeof reference )
        throw new Error( 'EqualTo must be instanciated with a value or a function' );

      this.reference = reference;

      this.validate = function ( value ) {
        var reference = 'function' === typeof this.reference ? this.reference( value ) : this.reference;

        if ( reference !== value )
          throw new Violation( this, value, { value: reference } );

        return true;
      };

      return this;
    },

    GreaterThan: function ( threshold ) {
      this.__class__ = 'GreaterThan';

      if ( 'undefined' === typeof threshold )
        throw new Error( 'Should give a threshold value' );

      this.threshold = threshold;

      this.validate = function ( value ) {
        if ( isNaN( Number( value ) ) )
          throw new Violation( this, value, { value: Validator.errorCode.must_be_a_number } );

        if ( this.threshold >= value )
          throw new Violation( this, value, { threshold: this.threshold } );

        return true;
      };

      return this;
    },

    GreaterThanOrEqual: function ( threshold ) {
      this.__class__ = 'GreaterThanOrEqual';

      if ( 'undefined' === typeof threshold )
        throw new Error( 'Should give a threshold value' );

      this.threshold = threshold;

      this.validate = function ( value ) {
        if ( this.threshold > value )
          throw new Violation( this, value, { threshold: this.threshold } );

        return true;
      };

      return this;
    },

    InstanceOf: function ( classRef ) {
      this.__class__ = 'InstanceOf';

      if ( 'undefined' === typeof classRef )
        throw new Error( 'InstanceOf must be instanciated with a value' );

      this.classRef = classRef;

      this.validate = function ( value ) {
        if ( true !== (value instanceof this.classRef) )
          throw new Violation( this, value, { classRef: this.classRef } );

        return true;
      };

      return this;
    },

    IPv4: function () {
      this.__class__ = 'IPv4';

      this.validate = function ( value ) {
        var regExp = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

        if ( 'string' !== typeof value )
          throw new Violation( this, value, { value: Validator.errorCode.must_be_a_string } );

        if ( !regExp.test( value ) )
          throw new Violation( this, value );

        return true;
      };

      return this;
    },

    Length: function ( boundaries ) {
      this.__class__ = 'Length';

      if ( !boundaries.min && !boundaries.max )
        throw new Error( 'Lenth assert must be instanciated with a { min: x, max: y } object' );

      this.min = boundaries.min;
      this.max = boundaries.max;

      this.validate = function ( value ) {
        if ( 'string' !== typeof value )
          throw new Violation( this, value, { value: Validator.errorCode.must_be_a_string } );

        if ( 'undefined' !== typeof this.min && this.min === this.max && value.length !== this.min )
          throw new Violation( this, value, { min: this.min, max: this.max } );

        if ( 'undefined' !== typeof this.max && value.length > this.max )
          throw new Violation( this, value, { max: this.max } );

        if ( 'undefined' !== typeof this.min && value.length < this.min )
          throw new Violation( this, value, { min: this.min } );

        return true;
      };

      return this;
    },

    LessThan: function ( threshold ) {
      this.__class__ = 'LessThan';

      if ( 'undefined' === typeof threshold )
        throw new Error( 'Should give a threshold value' );

      this.threshold = threshold;

      this.validate = function ( value ) {
        if ( isNaN( Number( value ) ) )
          throw new Violation( this, value, { value: Validator.errorCode.must_be_a_number } );

        if ( this.threshold <= value )
          throw new Violation( this, value, { threshold: this.threshold } );

        return true;
      };

      return this;
    },

    LessThanOrEqual: function ( threshold ) {
      this.__class__ = 'LessThanOrEqual';

      if ( 'undefined' === typeof threshold )
        throw new Error( 'Should give a threshold value' );

      this.threshold = threshold;

      this.validate = function ( value ) {
        if ( this.threshold < value )
          throw new Violation( this, value, { threshold: this.threshold } );

        return true;
      };

      return this;
    },

    Mac: function () {
      this.__class__ = 'Mac';

      this.validate = function ( value ) {
        var regExp = /^(?:[0-9A-F]{2}:){5}[0-9A-F]{2}$/i;

        if ( 'string' !== typeof value )
          throw new Violation( this, value, { value: Validator.errorCode.must_be_a_string } );

        if ( !regExp.test( value ) )
          throw new Violation( this, value );

        return true;
      };

      return this;
    },

    NotNull: function () {
      this.__class__ = 'NotNull';

      this.validate = function ( value ) {
        if ( null === value || 'undefined' === typeof value )
          throw new Violation( this, value );

        return true;
      };

      return this;
    },

    NotBlank: function () {
      this.__class__ = 'NotBlank';

      this.validate = function ( value ) {
        if ( 'string' !== typeof value )
          throw new Violation( this, value, { value: Validator.errorCode.must_be_a_string } );

        if ( '' === value.replace( /^\s+/g, '' ).replace( /\s+$/g, '' ) )
          throw new Violation( this, value );

        return true;
      };

      return this;
    },

    Null: function () {
      this.__class__ = 'Null';

      this.validate = function ( value ) {
        if ( null !== value )
          throw new Violation( this, value );

        return true;
      };

      return this;
    },

    Range: function ( min, max ) {
      if ( !min || !max )
        throw new Error( 'Range assert expects min and max values' );

      this.LengthValidator = new Assert().Length( { min: min, max: max } );
      this.__class__ = 'Range';

      this.validate = function ( value ) {
        try {
          this.LengthValidator.validate( value );
        } catch ( violation ) {
          throw new Violation( this, value, violation.violation );
        }

        return true;
      };

      return this;
    },

    Regexp: function ( regexp, flag ) {
      this.__class__ = 'Regexp';

      if ( 'undefined' === typeof regexp )
        throw new Error( 'You must give a regexp' );

      this.regexp = regexp;
      this.flag = flag || '';

      this.validate = function ( value ) {
        if ( 'string' !== typeof value )
          throw new Violation( this, value, { value: Validator.errorCode.must_be_a_string } );

        if ( !new RegExp( this.regexp ).test( value, this.flag ) )
          throw new Violation( this, value, { regexp: this.regexp, flag: this.flag } );

        return true;
      };

      return this;
    },

    Required: function () {
      this.__class__ = 'Required';

      this.validate = function ( value ) {
        if ( 'undefined' === typeof value )
          throw new Violation( this, value );

        if ( 'string' === typeof value )
          try {
            new Assert().NotNull().validate( value ) && new Assert().NotBlank().validate( value );
          } catch ( violation ) {
            throw new Violation( this, value );
          }

        return true;
      };

      return this;
    },

    // Unique() or Unique ( { key: foo } )
    Unique: function ( object ) {
      this.__class__ = 'Unique';

      if ( 'object' === typeof object )
        this.key = object.key;

      this.validate = function ( array ) {
        var value, store = [];

        if ( !_isArray( array ) )
          throw new Violation( this, array, { value: Validator.errorCode.must_be_an_array } );

        for ( var i = 0; i < array.length; i++ ) {
          value = 'object' === typeof array[ i ] ? array[ i ][ this.key ] : array[ i ];

          if ( 'undefined' === typeof value )
            continue;

          if ( -1 !== store.indexOf( value ) )
            throw new Violation( this, array, { value: value } );

          store.push( value );
        }

        return true;
      };

      return this;
    }
  };

  // expose to the world these awesome classes
  exports.Assert = Assert;
  exports.Validator = Validator;
  exports.Violation = Violation;
  exports.Constraint = Constraint;

  /**
  * Some useful object prototypes / functions here
  */

  // IE8<= compatibility
  // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
  if (!Array.prototype.indexOf)
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    };

  // Test if object is empty, useful for Constraint violations check
  var _isEmptyObject = function ( obj ) {
    for ( var property in obj )
      return false;

    return true;
  };

  var _isArray = function ( obj ) {
    return Object.prototype.toString.call( obj ) === '[object Array]';
  }

  // https://github.com/LearnBoost/expect.js/blob/master/expect.js
  var expect = {
    eql: function ( actual, expected ) {
      if ( actual === expected ) {
        return true;
      } else if ( 'undefined' !== typeof Buffer
          && Buffer.isBuffer( actual ) && Buffer.isBuffer( expected ) ) {
        if ( actual.length !== expected.length ) return false;

        for ( var i = 0; i < actual.length; i++ )
          if ( actual[i] !== expected[i] ) return false;

        return true;
      } else if ( actual instanceof Date && expected instanceof Date ) {
        return actual.getTime() === expected.getTime();
      } else if ( typeof actual !== 'object' && typeof expected !== 'object' ) {
        // loosy ==
        return actual == expected;
      } else {
        return this.objEquiv(actual, expected);
      }
    },
    isUndefinedOrNull: function ( value ) {
      return value === null || typeof value === 'undefined';
    },
    isArguments: function ( object ) {
      return Object.prototype.toString.call(object) == '[object Arguments]';
    },
    keys: function ( obj ) {
      if ( Object.keys )
        return Object.keys( obj );

      var keys = [];

      for ( var i in obj )
        if ( Object.prototype.hasOwnProperty.call( obj, i ) )
          keys.push(i);

      return keys;
    },
    objEquiv: function ( a, b ) {
      if ( this.isUndefinedOrNull( a ) || this.isUndefinedOrNull( b ) )
        return false;

      if ( a.prototype !== b.prototype ) return false;

      if ( this.isArguments( a ) ) {
        if ( !this.isArguments( b ) )
          return false;

        return eql( pSlice.call( a ) , pSlice.call( b ) );
      }

      try {
        var ka = this.keys( a ), kb = this.keys( b ), key, i;
      } catch ( e ) {
        return false;
      }

      if ( ka.length !== kb.length )
        return false;

      ka.sort();
      kb.sort();

      for ( i = ka.length - 1; i >= 0; i-- )
        if ( ka[ i ] != kb[ i ] )
          return false;

      for ( i = ka.length - 1; i >= 0; i-- ) {
        key = ka[i];
        if ( !this.eql( a[ key ], b[ key ] ) )
           return false;
      }

      return true;
    }
  };

  // AMD Compliance
  if ( 'function' === typeof define && define.amd ) {
    define( 'validator', [],function() { return exports; } );
  }
} )( 'undefined' === typeof exports ? this[ 'undefined' !== typeof validatorjs_ns ? validatorjs_ns : 'Validator' ] = {} : exports );

define("vendors/validator.js/dist/validator", (function (global) {
    return function () {
        var ret, fn;
        return ret || global.Validator;
    };
}(this)));

define('parsley/validator', [
  'validator'
], function (Validator) {
  var ParsleyValidator = function(options) {
    this.__class__ = 'ParsleyValidator';
    this.init(options);
  };

  ParsleyValidator.prototype = {
    init: function(options) {
      this.options= options;
    }
  };

  return ParsleyValidator;
});

define('parsley/defaults', [],function () {
  return {
    namespace: 'data-parsley-',                 // Default data-namespace for DOM API
    inputs: 'input, textarea, select',          // Default supported inputs
  };
});

define('parsley/field', [
    'parsley/ui',
    'parsley/validator',
    'parsley/defaults'
], function (ParsleyUI, ParsleyValidator, ParsleyDefaults) {
  var ParsleyField = function(element, options) {
    this.__class__ = 'ParsleyField';

    if ('undefined' === typeof element)
      throw new Error('You must give an element');

    this.init($(element), options || ParsleyDefaults);
  };

  ParsleyField.prototype = {
    init: function ($element, options) {
      this.options = options;
      this.$element = $element;
      this.hash = this.generateHash();
    },

    validate: function () {},
    isValid: function () {},

    bindConstraints: function () {},
    bindTriggers: function () {},

    addConstraint: function (constraint) {},
    removeConstraint: function (constraint) {},
    updateConstraint: function (constraint) {},


    generateHash: function () {
      if (this.group)
        return 'parsley-' + this.group;

      return 'parsley-' + new String(Math.random()).substring(2, 9);
    }
  };

  return ParsleyField;
});

define('parsley/form', [
  'parsley/field',
  'parsley/defaults'
  ], function (ParsleyField, ParsleyDefaults) {
  var ParsleyForm = function(element, options) {
    this.__class__ = 'ParsleyForm';

    if ('undefined' === typeof element)
      throw new Error('You must give an element');

    this.init($(element), options || ParsleyDefaults);
  };

  ParsleyForm.prototype = {
    init: function ($element, options) {
      this.options = options;
      this.$element = $element;

      this.bindFields();
      this.$element.on('submit.' + this.__class__, false, $.proxy(this.validate, this));
    },

    validate: function () {
      this.bindFields();

      for (var i = 0; i < this.fields.length; i++) {
        this.fields[i].validate();
      }
    },

    isValid: function () {
      this.bindFields();

      for (var i = 0; i < this.fields.length; i++)
        if (false === this.fields[i].isValid())
          return false;

      return true;
    },

    bindFields: function () {
      var self = this;
      this.fields = [];

      this.$element.find(this.options.inputs).each(function () {
        self.addField(this);
      });

      return this;
    },

    addField: function (field) {
      this.fields.push(new ParsleyField(field, this.options));

      return this;
    },

    removeField: function (field) {},
    addListener: function (listener) {},
    removeListener: function(listener) {},
    updateListener: function(listener) {},
    reset: function () {},
    destroy: function () {}
  };

  return ParsleyForm;
});

define('parsley/utils', [],function () {
  return {
    // Parsley DOM-API
    attr: function ($element, namespace) {
      var attribute,
        obj = {},
        regex = new RegExp("^" + namespace, 'i');

      if ('undefined' === typeof $element[0])
        return {};

      for (var i in $element[0].attributes) {
        attribute = $element[0].attributes[i];
        if ('undefined' !== typeof attribute && null !== attribute && attribute.specified && regex.test(attribute.name)) {
          obj[this.camelize(attribute.name.replace(namespace, ''))] = this.deserializeValue(attribute.value);
        }
      }

      return obj;
    },

    // Recursive object / array getter
    get: function (obj, path, placeholder) {
      var i = 0,
      paths = (path || '').split('.');

      while (this.isObject(obj) || this.isArray(obj)) {
        obj = obj[paths[i++]];
        if (i === paths.length)
          return obj || placeholder;
      }

      return placeholder;
    },

    /** Third party functions **/
    // Underscore isArray
    isArray: function (mixed) {
      return Object.prototype.toString.call(mixed) === '[object Array]';
    },

    // Underscore isObject
    isObject: function (mixed) {
      return mixed === Object(mixed);
    },

    // Zepto deserialize function
    deserializeValue: function (value) {
      var num
      try {
        return value ?
          value == "true" ||
          (value == "false" ? false :
          value == "null" ? null :
          !isNaN(num = Number(value)) ? num :
          /^[\[\{]/.test(value) ? $.parseJSON(value) :
          value)
          : value;
      } catch (e) { return value; }
    },

    // Zepto camelize function
    camelize: function (str) {
      return str.replace(/-+(.)?/g, function(match, chr) {
        return chr ? chr.toUpperCase() : '';
      });
    },

    // Zepto dasherize function
    dasherize: function (str) {
      return str.replace(/::/g, '/')
             .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
             .replace(/([a-z\d])([A-Z])/g, '$1_$2')
             .replace(/_/g, '-')
             .toLowerCase();
    }
  };
});

/**
 * @license RequireJS domReady 2.0.1 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/domReady for details
 */
/*jslint */
/*global require: false, define: false, requirejs: false,
  window: false, clearInterval: false, document: false,
  self: false, setInterval: false */


define('vendors/requirejs-domready/domReady',[],function () {
    

    var isTop, testDiv, scrollIntervalId,
        isBrowser = typeof window !== "undefined" && window.document,
        isPageLoaded = !isBrowser,
        doc = isBrowser ? document : null,
        readyCalls = [];

    function runCallbacks(callbacks) {
        var i;
        for (i = 0; i < callbacks.length; i += 1) {
            callbacks[i](doc);
        }
    }

    function callReady() {
        var callbacks = readyCalls;

        if (isPageLoaded) {
            //Call the DOM ready callbacks
            if (callbacks.length) {
                readyCalls = [];
                runCallbacks(callbacks);
            }
        }
    }

    /**
     * Sets the page as loaded.
     */
    function pageLoaded() {
        if (!isPageLoaded) {
            isPageLoaded = true;
            if (scrollIntervalId) {
                clearInterval(scrollIntervalId);
            }

            callReady();
        }
    }

    if (isBrowser) {
        if (document.addEventListener) {
            //Standards. Hooray! Assumption here that if standards based,
            //it knows about DOMContentLoaded.
            document.addEventListener("DOMContentLoaded", pageLoaded, false);
            window.addEventListener("load", pageLoaded, false);
        } else if (window.attachEvent) {
            window.attachEvent("onload", pageLoaded);

            testDiv = document.createElement('div');
            try {
                isTop = window.frameElement === null;
            } catch (e) {}

            //DOMContentLoaded approximation that uses a doScroll, as found by
            //Diego Perini: http://javascript.nwbox.com/IEContentLoaded/,
            //but modified by other contributors, including jdalton
            if (testDiv.doScroll && isTop && window.external) {
                scrollIntervalId = setInterval(function () {
                    try {
                        testDiv.doScroll();
                        pageLoaded();
                    } catch (e) {}
                }, 30);
            }
        }

        //Check if document already complete, and if so, just trigger page load
        //listeners. Latest webkit browsers also use "interactive", and
        //will fire the onDOMContentLoaded before "interactive" but not after
        //entering "interactive" or "complete". More details:
        //http://dev.w3.org/html5/spec/the-end.html#the-end
        //http://stackoverflow.com/questions/3665561/document-readystate-of-interactive-vs-ondomcontentloaded
        //Hmm, this is more complicated on further use, see "firing too early"
        //bug: https://github.com/requirejs/domReady/issues/1
        //so removing the || document.readyState === "interactive" test.
        //There is still a window.onload binding that should get fired if
        //DOMContentLoaded is missed.
        if (document.readyState === "complete") {
            pageLoaded();
        }
    }

    /** START OF PUBLIC API **/

    /**
     * Registers a callback for DOM ready. If DOM is already ready, the
     * callback is called immediately.
     * @param {Function} callback
     */
    function domReady(callback) {
        if (isPageLoaded) {
            callback(doc);
        } else {
            readyCalls.push(callback);
        }
        return domReady;
    }

    domReady.version = '2.0.1';

    /**
     * Loader Plugin API method
     */
    domReady.load = function (name, req, onLoad, config) {
        if (config.isBuild) {
            onLoad(null);
        } else {
            domReady(onLoad);
        }
    };

    /** END OF PUBLIC API **/

    return domReady;
});

/*!
* parsley
* Guillaume Potier - <guillaume@wisembly.com>
* Version 2.0.0-pre - built Wed Jan 01 2014 16:30:24
* MIT Licensed
*
*/

define('parsley',[
  'parsley/form',
  'parsley/field',
  'parsley/ui',
  'parsley/utils',
  'parsley/defaults',
  'validator',
  'vendors/requirejs-domready/domReady'
], function(ParsleyForm, ParsleyField, ParsleyUI, ParsleyUtils, ParsleyDefaultOptions, Validator, domReady) {
  var Parsley = function (element, options) {
    this.__class__ = 'Parsley';
    this.__version__ = '2.0.0-pre';

    if ('undefined' === typeof element)
      throw new Error('You must give an element');

    return this.init($(element), options);
  };

  Parsley.prototype = {
    init: function ($element, options) {
      this.$element = $element;
      this.namespace = this.getNamespace(options);
      this.options = this.getOptions(options, this.namespace);

      // if a form elem is given, bind all its input children
      if (this.$element.is('form') || 'undefined' !== typeof ParsleyUtils.attr(this.namespace)['bind'])
        return this.bind('parsleyForm');

      // if it is a Parsley supported single element, bind it too, except inputs type hidden
      // add here a return instance, cuz' we could call public methods on single elems with data[ option ]() above
      else if (this.$element.is(this.options.inputs))
        return this.bind('parsleyField');

      return this;
    },

    getNamespace: function (options) {
      if ('undefined' !== typeof this.$element.data('parsleyNamespace'))
          return this.$element.data('parsleyNamespace');
      if ('undefined' !== typeof ParsleyUtils.get(options, 'namespace'))
          return options.namespace;
      if ('undefined' !== typeof ParsleyUtils.get(window, 'ParsleyConfig.namespace'))
          return window.ParsleyConfig.namespace;

      return ParsleyDefaultOptions.namespace;
    },

    getOptions: function (options, namespace) {
      return $.extend(
        true,
        {},
        ParsleyDefaultOptions,
        ParsleyUtils.get(window, 'ParsleyConfig', {}),
        options,
        ParsleyUtils.attr(this.$element, namespace));
    },

    bind: function (type) {
      var parsleyInstance = this.$element.data(type);

      // if data never binded, bind it right now!
      if ('undefined' === typeof parsleyInstance) {
        switch (type) {
          case 'parsleyForm':
            parsleyInstance = new ParsleyForm(this.$element, this.options);
            break;
          case 'parsleyField':
            parsleyInstance = new ParsleyField(this.$element, this.options);
            break;
          default:
            throw new Error(type + 'is not a supported Parsley type');
        }

        this.$element.data(type, parsleyInstance);
      }

      return parsleyInstance;
    }
  };

  /* jQuery plugin API */
  $.fn.parsley = function (options) {
    return new Parsley(this, options);
  };

  /* PARSLEY auto-binding. Prevent it by setting ParsleyConfig.autoBind to false
  * =================================================== */
  if (false !== ParsleyUtils.get(window, 'ParsleyConfig.autoBind'))
    domReady(function () {
      $('[parsley-validate], [data-parsley-validate]').each(function () {
        new Parsley(this);
      });
    });

  window.ParsleyUI = ParsleyUI;
  window.ParsleyUtils = ParsleyUtils;
  window.ParsleyValidator = Validator;

  return (window.Parsley = window.psly = Parsley);
});

require(["parsley"]);
}());