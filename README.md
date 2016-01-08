# bit-plugin-builder
> Helper for creating bit-loader plugin configurations

Plugin builder simplifies the process of creating configurations for bit-loader plugins. It merges transforms, resolve, fetch, dependency handlers in a Plugin. It also merges match and ignore rules.

#### PluginBuilder.create(options) : PluginBuilder
  Factory method to create a Plugin builder. Options can be passed in for setting the intial state of the Plugin builder.

  - returns PluginBuilder instance

``` javascript
  var utils = require("bit-bundler-utils");

  var defaultOptions = {
    match: {
      path: /[\w]+\.(js)$/
    }
  };

  var pluginBuilder = PluginBuilder.create(defaultOptions);
```

#### configure(options) : PluginBuilder

  Method to configure PluginBuilder instance

  - returns PluginBuilder instance (self)


``` javascript
  pluginBuilder = pluginBuilder.configure({
    transform: function(meta) {
      console.log(meta);
    }
  });
```

#### build() : Object

  Method that creates a plugin configuration object to register plugins with the loader

  - returns loader plugin configuration

``` javascript
  var plugin = pluginBuilder.build();
```

#### Examples

Sample plugin that loads JSON files.

``` javascript
var PluginBuilder = require("bit-bundler-utils/PluginBuilder");

var defaults = {
  match: {
    path: /[\w]+\.(json)$/
  },
  dependency: function dependencyText(meta) {
    return {
      source: "module.exports = " + meta.source + ";"
    };
  }
};

function textPlugin(options) {
  return PluginBuilder
    .create(defaults)
    .configure(options)
    .build();
}

module.exports = textPlugin;
```

License
===============

Licensed under MIT
