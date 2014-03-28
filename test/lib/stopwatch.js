'use strict';

var assert = require('chai').assert;
var stopwatch = require('../../lib/stopwatch');

describe('lib/stopwatch.js', function () {

    beforeEach(function () {
        stopwatch.clear();
    });

    describe('#start/stop()', function () {
        it('should start a new stopwatch and stop it afterwards', function (done) {
            var timer = stopwatch.start('test');
            assert.equal(timer.time, null);
            setTimeout(function () {
                timer.stop();
                assert(timer.time >= 100);
                assert(timer.time < 120);
                assert.equal(timer.name, 'test');
                assert(timer.start);
                done();
            }, 100);
        });
    });

    describe('#getAll()', function () {
        it('should return all stopwatches, both running and stopped', function (done) {
            stopwatch.start('test');
            stopwatch.start('test2').stop();
            stopwatch.start('test');

            var timers = stopwatch.getAll();
            assert.equal(timers.length, 3);
            assert.equal(timers[0].name, 'test');
            assert.equal(timers[0].time, null);
            assert.equal(timers[1].name, 'test2');
            assert(timers[0].time >= 0);
            assert.equal(timers[2].name, 'test');
            assert.equal(timers[2].time, null);
            done();
        });
    });

    describe('#clear()', function () {
        it('should remove all registered stopwatches', function () {
            stopwatch.start('test');
            stopwatch.start('test2').stop();

            var timers = stopwatch.getAll();
            assert.equal(timers.length, 2);

            stopwatch.clear();
            timers = stopwatch.getAll();
            assert.equal(timers.length, 0);
        });
    });
});