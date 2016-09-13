var utils = require("belty");

var defaultOptions = {
  resolve: [],
  fetch: [],
  transform: [],
  dependency: [],
  precompile: [],
  extensions: []
};

function PluginBuilder(options) {
  if (!(this instanceof PluginBuilder)) {
    return new PluginBuilder(options);
  }

  this._defaults = defaultOptions;
  this._configuration = merge(utils.merge({}, this._defaults), options, this._defaults);
}

PluginBuilder.create = function(options) {
  return new PluginBuilder(options);
};

PluginBuilder.prototype.build = function() {
  return utils.merge({}, this._configuration);
};

PluginBuilder.prototype.configure = function(options) {
  merge(this._configuration, options, this._defaults);
  return this;
};

PluginBuilder.prototype.withDefaultProperty = function(name, value) {
  this._defaults[name] = value === (void 0) ? [] : value;
  return this;
};

PluginBuilder.prototype.withDefaultProperties = function(props) {
  Object.keys(props).forEach(function(key) {
    this.withDefaultProperty(key, props[key]);
  }.bind(this));

  return this;
};

function merge(pluginConfig, options, defaults) {
  pluginConfig = mergeOptions(pluginConfig, options, defaults);
  pluginConfig = mergeMatchers(pluginConfig, options);
  return pluginConfig;
}

function mergeOptions(pluginConfig, options, defaults) {
  options = options || {};

  var updateKeys = Object
    .keys(options)
    .filter(function(option) {
      return defaults.hasOwnProperty(option);
    });

  utils.extend(pluginConfig, mergeState(pluginConfig, utils.pick(options, updateKeys)));
  return pluginConfig;
}

function mergeMatchers(pluginConfig, options) {
  options = options || {};

  var matches = options.match || options.matches;
  if (matches) {
    pluginConfig.matches = mergeState(pluginConfig.matches, matches);
  }

  var ignores = options.ignore || options.ignores;
  if (ignores) {
    pluginConfig.ignores = mergeState(pluginConfig.ignores, ignores);
  }

  return pluginConfig;
}

function mergeState(currentState, newState) {
  currentState = currentState || {};

  return Object
    .keys(newState)
    .reduce(function(result, key) {
      result[key] = (currentState[key] || []).concat(utils.toArray(newState[key]));
      return result;
    }, {});
}

module.exports = PluginBuilder;
