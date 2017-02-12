/*
 * grunt-scaffold
 * https://github.com/crudo/grunt-scaffold
 *
 * Copyright (c) crudo <crudo@crudo.cz>
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
    grunt.registerMultiTask('scaffold', 'Scaffold what you want.', function() {
        var inquirer = require('inquirer');
        var scaffolder = require('./lib/scaffolder').init(grunt);

        scaffolder.run(inquirer, this.options(), this.async());
    });
};
