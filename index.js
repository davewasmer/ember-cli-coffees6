'use strict';

var Filter = require('broccoli-filter')
var checker = require('ember-cli-version-checker');

CoffeeScriptEs6Filter.prototype = Object.create(Filter.prototype);
CoffeeScriptEs6Filter.prototype.constructor = CoffeeScriptEs6Filter

function CoffeeScriptEs6Filter (inputTree, options) {

  if (!(this instanceof CoffeeScriptEs6Filter)) return new CoffeeScriptEs6Filter(inputTree, options);
  this.options = options;
  Filter.call(this, inputTree)
}

CoffeeScriptEs6Filter.prototype.extensions = ['coffee']
CoffeeScriptEs6Filter.prototype.targetExtension = 'coffee'



CoffeeScriptEs6Filter.prototype.processString = function (string) {
  if(this.options.debug) {
    console.log("Coffees6 Input:\n\n", string, "\n=======");
  }
  var regex = /^export default /m;
  if (string.match(regex)) {
    string = string.replace(regex, "___ExportObject___ = ");
    string = string + "\n\n`export default ___ExportObject___`";
  }

  var importRegex = /^import (.+) from ("|')(.+)("|')( \t)*$/gm
  var match;

  while (match = importRegex.exec(string)) {
    string = string.replace(match[0], "`" + match[0] + ";`");
  }
  if(this.options.debug) {
    console.log("Coffees6 Output:\n\n", string, "\n=======");
  }

  return string;
}

function CoffeeES6Preprocessor(options) {
  this.options = options || {};
  this.name = 'ember-cli-coffees6';
  this.ext = 'js';
}

CoffeeES6Preprocessor.prototype.toTree = function(tree, inputPath, outputPath) {
  return new CoffeeScriptEs6Filter(tree, this.options);
};

function CoffeescriptES6Addon(project) {
  this._project = project;
  this.name     = 'Ember CLI Coffeescript ES6 Addon';
}

CoffeescriptES6Addon.prototype.shouldSetupRegistryInIncluded = function() {
  return !checker.isAbove(this, '0.2.0');
}

CoffeescriptES6Addon.prototype.setupPreprocessorRegistry = function(type, registry) {
  var plugin = new CoffeeES6Preprocessor(this._project.config(process.env.EMBER_ENV).coffeeES6);
  registry.add('js', plugin);
}

CoffeescriptES6Addon.prototype.included = function(app) {
  this.app = app;
  if (this.shouldSetupRegistryInIncluded()) {
    this.setupPreprocessorRegistry('parent', app.registry);
  }
};

module.exports = CoffeescriptES6Addon;
