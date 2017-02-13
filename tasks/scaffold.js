'use strict';

/*
 * grunt-scaffold
 * https://github.com/crudo/grunt-scaffold
 *
 * Copyright (c) crudo <crudo@crudo.cz>
 * Licensed under the MIT license.
 */

module.exports = (grunt) => {
    /* eslint-disable global-require */
    const inquirer = require('inquirer');
    const scaffolder = require('./lib/scaffolder').init(grunt);

    grunt.registerMultiTask('scaffold', 'Scaffold what you want.', () => {
        const currentTask = grunt.task.current;
        scaffolder.run(inquirer, currentTask.options(), currentTask.async());
    });
};
