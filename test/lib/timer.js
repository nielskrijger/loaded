'use strict';

var assert = require('chai').assert;
var timer = require('../../lib/timer');

describe('lib/timer.js', function () {

    beforeEach(function () {
        timer.clear();
    });

    describe('#start/stop()', function () {
        it('should start a new timer and stop it afterwards', function (done) {
            var timerA = timer.start('A');
            assert.equal(timerA.time, null);
            setTimeout(function () {
                timerA.stop();
                assert(timerA.time >= 100);
                assert(timerA.time < 120);
                assert.equal(timerA.name, 'A');
                assert(timerA.start);
                done();
            }, 100);
        });
    });

    describe('#getAll()', function () {
        it('should return all timeres, both running and stopped', function (done) {
            timer.start('test');
            timer.start('test2').stop();
            timer.start('test');

            var timers = timer.getAll();
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
        it('should remove all registered timeres', function () {
            timer.start('test');
            timer.start('test2').stop();

            var timers = timer.getAll();
            assert.equal(timers.length, 2);

            timer.clear();
            timers = timer.getAll();
            assert.equal(timers.length, 0);
        });
    });
});