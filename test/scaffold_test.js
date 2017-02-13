'use strict';

const grunt = require('grunt');
const expect = require('expect.js');
const sinon = require('sinon');
const config = require('../config');
const scaffolder = require('../tasks/lib/scaffolder').init(grunt);

const testScaffold = (key, cb) => {
    scaffolder.process(config.scaffold[key], config.scaffold[key].options, cb);
};

const inquirerMock = (result) => {
    return {
        prompt: () => {
            return {
                then: (fn) => {
                    fn(result);
                }
            };
        }
    };
};

describe('Scaffolder', () => {
    it('should run scaffolder', (done) => {
        const opts = {};

        scaffolder.run(inquirerMock(), opts, done);
    });

    it('should run scaffolder with before callback', (done) => {
        const beforeCallback = sinon.spy();

        const opts = {
            before: beforeCallback
        };

        scaffolder.run(inquirerMock(), opts, () => {
            expect(beforeCallback.callCount).to.be(1);
            done();
        });
    });

    it('should run scaffolder with after callback', (done) => {
        const afterCallback = sinon.spy();

        const opts = {
            questions: [],
            after: afterCallback
        };

        scaffolder.run(inquirerMock(), opts, () => {
            expect(afterCallback.callCount).to.be(1);
            done();
        });
    });

    it('should run inquirer with postQuestions', (done) => {
        const postCallback = sinon.spy();

        const opts = {
            questions: [],
            postQuestions: postCallback
        };

        scaffolder.run(inquirerMock(), opts, () => {
            expect(postCallback.callCount).to.be(1);
            done();
        });
    });

    it('should scaffold according to no_template spec', (done) => {
        testScaffold('no_template', () => {
            // edge case
            done();
        });
    });

    it('should scaffold according to simple spec', (done) => {
        testScaffold('simple', () => {
            const actual = grunt.file.read('tmp/Simple.js');
            const expected = grunt.file.read('test/expected/Simple.js');
            expect(actual).to.eql(expected);
            done();
        });
    });

    it('should scaffold according to filter spec', (done) => {
        testScaffold('filter', () => {
            const actual = grunt.file.read('tmp/My.js');
            const expected = grunt.file.read('test/expected/My.js');
            expect(actual).to.eql(expected);
            done();
        });
    });

    it('should scaffold according to folders spec', (done) => {
        testScaffold('folders', () => {
            const actual = grunt.file.read('tmp/folderA/a.js');
            const expected = grunt.file.read('test/expected/folderA/a.js');

            expect(actual).to.eql(expected);

            const actualA = grunt.file.read('tmp/folderA/My.js');
            const expectedA = grunt.file.read('test/expected/folderA/My.js');

            expect(actualA).to.eql(expectedA);

            const actualB = grunt.file.read('tmp/folderB/b.js');
            const expectedB = grunt.file.read('test/expected/folderB/b.js');

            expect(actualB).to.eql(expectedB);
            done();
        });
    });
});
