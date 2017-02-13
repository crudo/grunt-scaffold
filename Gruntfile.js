/*
* grunt-scaffold
* https://github.com/crudo/grunt-scaffold
*
* Copyright (c) crudo <crudo@crudo.cz>
* Licensed under the MIT license.
*/

const config = require('./config');

module.exports = (grunt) => {
    // Project configuration.
    grunt.initConfig(config);

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('gruntify-eslint');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'copy', 'mocha_istanbul']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['eslint', 'test']);
};
