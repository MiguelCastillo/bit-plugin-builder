var utils = require("belty");


var defaults = {
  resolve: [],
  fetch: [],
  transform: [],
  dependency: [],
  precompile: []
};


function PluginBuilder(options) {
  this._configuration = configure(utils.merge({}, defaults), options);
}


PluginBuilder.prototype.configure = function(options) {
  this._configuration = configure(this._configuration, options);
  return this;
};


PluginBuilder.prototype.build = function() {
  return utils.merge({}, this._configuration);
};


PluginBuilder.create = function(options) {
  return new PluginBuilder(options);
};


function configure(pluginConfig, options) {
  options = options || {};

  Object.keys(options)
    .filter(function(option) {
      return defaults.hasOwnProperty(option);
    })
    .map(function(option) {
      var value = options[option];
      return {
        name: option,
        value: utils.toArray(value)
      };
    })
    .forEach(function(config) {
      pluginConfig[config.name] = pluginConfig[config.name].concat(config.value);
    });

  var matches = options.match || options.matches;
  if (matches) {
    pluginConfig.matches = configureRule(matches);
  }

  var ignores = options.ignore || options.ignores;
  if (ignores) {
    pluginConfig.ignores = configureRule(ignores);
  }

  var extensions = options.extensions;
  if (extensions) {
    pluginConfig.extensions = utils.toArray(extensions);
  }

  return pluginConfig;
};


function configureRule(rule) {
  return Object
    .keys(rule)
    .reduce(function(result, key) {
      result[key] = utils.toArray(rule[key]);
      return result;
    }, {});
}


module.exports = PluginBuilder;
