'use strict';

const mustache = require('mustache');
const fse = require('fs-extra');
const readRecursive = require('fs-readdir-recursive');
const path = require('path');
const fs = require('fs');
const isFunction = require('lodash.isfunction');

/* eslint-disable func-names */
exports.init = (grunt) => {
    return {
        run(inquirer, options, done) {
            const questions = options.questions;

            if (options.before && isFunction(options.before)) {
                options.before();
            }

            if (questions) {
                inquirer.prompt(questions).then((result) => {
                    if (options.postQuestions && isFunction(options.postQuestions)) {
                        options.postQuestions(result);
                    }

                    this.process(result, options, () => {});

                    if (options.after && isFunction(options.after)) {
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

            if (options.filter && isFunction(options.filter)) {
                modResult = options.filter(result);
            }

            if (isFunction(template)) {
                template = template(modResult);
            }

            Object.keys(template).forEach((key) => {
                const dist = mustache.render(template[key], result);
                const distDir = path.dirname(dist);

                if (fs.statSync(key).isFile()) {
                    fse.ensureDirSync(distDir);

                    fs.writeFileSync(
                        dist,
                        mustache.render(
                            fs.readFileSync(key, 'utf-8'),
                            result
                        )
                    );
                } else {
                    fse.ensureDirSync(distDir);
                    fse.copySync(key, dist);
                    readRecursive(dist).forEach((file) => {
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
