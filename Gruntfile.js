/*
* grunt-scaffold
* https://github.com/crudo/grunt-scaffold
*
* Copyright (c) crudo <crudo@crudo.cz>
* Licensed under the MIT license.
*/

'use strict';

var config = require('./config');

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig(config);

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'copy', 'mocha_istanbul']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);
};
