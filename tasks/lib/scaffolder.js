'use strict';

const mustache = require('mustache');
const wrench = require('wrench');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

/* eslint-disable func-names */
exports.init = (grunt) => {
    return {
        run(inquirer, options, done) {
            const questions = options.questions;

            if (options.before && _.isFunction(options.before)) {
                options.before();
            }

            if (questions) {
                inquirer.prompt(questions).then((result) => {
                    if (options.postQuestions && _.isFunction(options.postQuestions)) {
                        options.postQuestions(result);
                    }

                    this.process(result, options, () => {});

                    if (options.after && _.isFunction(options.after)) {
                        options.after(result);
                    }

                    done();
                }).catch((err) => {
                    grunt.fail.warn(err.message);
                    done();
                });
            } else {
                this.process({}, options, () => {});
                done();
            }
        },

        process(result, options, done) {
            let modResult = result;
            let template = options.template || {};

            if (options.filter && _.isFunction(options.filter)) {
                modResult = options.filter(result);
            }

            if (_.isFunction(template)) {
                template = template(modResult);
            }

            Object.keys(template).forEach((key) => {
                const dist = mustache.render(template[key], result);
                const distDir = path.dirname(dist);

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
                    wrench.readdirSyncRecursive(dist).forEach((file) => {
                        const modFile = path.join(dist, file);

                        fs.writeFileSync(
                            mustache.render(modFile, result),
                            mustache.render(
                                fs.readFileSync(modFile, 'utf-8'),
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
