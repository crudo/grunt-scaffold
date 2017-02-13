/*
* grunt-scaffold
* https://github.com/crudo/grunt-scaffold
*
* Copyright (c) crudo <crudo@crudo.cz>
* Licensed under the MIT license.
*/

module.exports = {
    eslint: {
        all: [
            'config.js',
            'Gruntfile.js',
            'test/*_test.js',
            'tasks/**/*.js'
        ],
        options: {
            configFile: '.eslintrc'
        }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
        tests: ['tmp']
    },

    copy: {
        main: {
            files: [
                { expand: true, cwd: 'test', src: ['**'], dest: 'tmp' }
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
                template: () => {
                    return {
                        'tmp/fixtures/test.js': 'tmp/{{name}}.js'
                    };
                },
                filter: (result) => {
                    const obj = result;
                    obj.name = 'My';
                    return obj;
                }
            }
        },
        folders: {
            options: {
                template: {
                    'tmp/fixtures/folderA': 'tmp/folderA',
                    'tmp/fixtures/folderB': 'tmp/folderB'
                },
                filter: (result) => {
                    const obj = result;
                    obj.name = 'My';
                    obj.priority = 'High';
                    obj.severity = 'Low';
                    return obj;
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
