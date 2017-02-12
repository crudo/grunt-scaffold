'use strict';

var grunt = require('grunt');
var expect = require('expect.js');
var sinon = require('sinon');
var config = require('../config');
var scaffolder = require('../tasks/lib/scaffolder').init(grunt);

var _scaffold = function (key, cb) {
    scaffolder.process(config.scaffold[key], config.scaffold[key].options, cb);
};

var inquirerMock = function (result) {
    return {
        prompt: function () {
            return {
                then: function (fn) {
                    fn(result);
                }
            }
        }
    }
};

describe('Scaffolder', function() {
    it('should run scaffolder', function(done) {
        var opts = {};

        scaffolder.run(inquirerMock(), opts, done);
    });

    it('should run scaffolder with before callback', function(done) {
        var beforeCallback = sinon.spy();

        var opts = {
            before: beforeCallback
        };

        scaffolder.run(inquirerMock(), opts, function () {
            expect(beforeCallback.callCount).to.be(1);
            done();
        });
    });

    it('should run scaffolder with after callback', function(done) {
        var afterCallback = sinon.spy();

        var opts = {
            questions: [],
            after: afterCallback
        };

        scaffolder.run(inquirerMock(), opts, function () {
            expect(afterCallback.callCount).to.be(1);
            done();
        });
    });

    it('should run inquirer with postQuestions', function(done) {
        var postCallback = sinon.spy();

        var opts = {
            questions: [],
            postQuestions: postCallback
        };

        scaffolder.run(inquirerMock(), opts, function () {
            expect(postCallback.callCount).to.be(1);
            done();
        });
    });

    it('should scaffold according to no_template spec', function(done) {
        _scaffold('no_template', function () {
            // edge case
            done();
        });
    });

    it('should scaffold according to simple spec', function(done) {
        _scaffold('simple', function () {
            var actual = grunt.file.read('tmp/Simple.js');
            var expected = grunt.file.read('test/expected/Simple.js');
            expect(actual).to.eql(expected);
            done();
        });
    });

    it('should scaffold according to filter spec', function(done) {
        _scaffold('filter', function () {
            var actual = grunt.file.read('tmp/My.js');
            var expected = grunt.file.read('test/expected/My.js');
            expect(actual).to.eql(expected);
            done();
        });
    });

    it('should scaffold according to folders spec', function(done) {
        _scaffold('folders', function () {
            var actual = grunt.file.read('tmp/folderA/a.js');
            var expected = grunt.file.read('test/expected/folderA/a.js');

            expect(actual).to.eql(expected);

            actual = grunt.file.read('tmp/folderA/My.js');
            expected = grunt.file.read('test/expected/folderA/My.js');

            expect(actual).to.eql(expected);

            actual = grunt.file.read('tmp/folderB/b.js');
            expected = grunt.file.read('test/expected/folderB/b.js');

            expect(actual).to.eql(expected);
            done();
        });
    });
});
