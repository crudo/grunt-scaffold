/*
* grunt-scaffold
* https://github.com/crudo/grunt-scaffold
*
* Copyright (c) crudo <crudo@crudo.cz>
* Licensed under the MIT license.
*/

'use strict';

module.exports = {
    jshint: {
        all: [
            'Gruntfile.js',
            'tasks/**/*.js'
        ],
        options: {
            jshintrc: '.jshintrc'
        }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
        tests: ['tmp']
    },

    copy: {
        main: {
            files: [
                {expand: true, cwd: 'test', src: ['**'], dest: 'tmp'}
            ]
        }
    },

    // Configuration to be run (and then tested).
    scaffold: {
        no_template: {
            options: {}
        },
        simple: {
            options: {
                template: {
                    'tmp/fixtures/Simple.js': 'tmp/Simple.js'
                }
            }
        },
        filter: {
            options: {
                template: function () {
                    return {
                        'tmp/fixtures/test.js': 'tmp/{{name}}.js'
                    };
                },
                filter: function (result) {
                    result.name = 'My';
                    return result;
                }
            }
        },
        folders: {
            options: {
                template: {
                    'tmp/fixtures/folderA': 'tmp/folderA',
                    'tmp/fixtures/folderB': 'tmp/folderB'
                },
                filter: function (result) {
                    result.name = 'My';
                    result.priority = 'High';
                    result.severity = 'Low';
                    return result;
                }
            }
        }
    },

    mocha_istanbul: {
        coverage: {
            src: 'test',
            options: {
                root: 'tasks/',
                reportFormats: ['html', 'cobertura'],
                mask: '*_test.js'
            }
        }
    }
};
