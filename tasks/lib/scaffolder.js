'use strict';

var mustache = require('mustache'),
    wrench = require('wrench'),
    path = require('path'),
    fs = require('fs'),
    _ = require('lodash');

exports.init = function(grunt) {
    return {
        run: function (inquirer, options, done) {
            var questions = options.questions;

            if (options.before && _.isFunction(options.before)) {
                options.before();
            }

            if (questions) {
                inquirer.prompt(questions).then(function (result) {
                    if (options.postQuestions && _.isFunction(options.postQuestions)) {
                        options.postQuestions(result);
                    }

                    this.process(result, options, function () {});

                    if (options.after && _.isFunction(options.after)) {
                        options.after(result);
                    }

                    done();
                }.bind(this)).catch(function (err) {
                    grunt.fail.warn(err.message);
                    done();
                }.bind(this));

            } else {
                this.process({}, options, function () {});
                done();
            }
        },
        process: function(result, options, done) {
            var template = options.template || {};

            if (options.filter && _.isFunction(options.filter)) {
                result = options.filter(result);
            }

            if (_.isFunction(template)) {
                template = template(result);
            }

            Object.keys(template).forEach(function(key){
                var dist = mustache.render(template[key], result),
                    distDir = path.dirname(dist);

                if (fs.statSync(key).isFile()) {
                    wrench.mkdirSyncRecursive(distDir);

                    fs.writeFileSync(
                        dist,
                        mustache.render(
                            fs.readFileSync(key, 'utf-8'),
                            result
                        )
                    );
                } else {
                    wrench.mkdirSyncRecursive(distDir);
                    wrench.copyDirSyncRecursive(key, dist);
                    wrench.readdirSyncRecursive(dist).forEach(function(file){
                        file = path.join(dist, file);

                        fs.writeFileSync(
                            mustache.render(file, result),
                            mustache.render(
                                fs.readFileSync(file, 'utf-8'),
                                result
                            ),
                            'utf-8'
                        );
                    });
                }
            });

            done();
        }
    };
};
