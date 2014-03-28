'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                node: true,
                sub: true,
                indent: 4,
                trailing: true,
                quotmark: 'single',
                curly: true,
                white: false,
                strict: true,
                globals: {
                    it: true,
                    describe: true,
                    before: true,
                    beforeEach: true,
                    after: true,
                    afterEach: true
                }
            },
            files: [
                'Gruntfile.js',
                'app.js',
                'lib/**/*.js',
                'test/**/*.js'
            ]
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: [
                    'test/**/*.js'
                ]
            }
        },
        mocha_istanbul: {
            coverage: {
                src: 'test', // the folder, not the files
                options: {
                    reporter: 'spec'
                }
            }
        },
        clean: ['coverage'],
        jsdoc: {
            dist: {
                src: ['lib/*.js'],
                options: {
                    destination: 'dist/jsdoc',
                    configure: 'jsdoc-conf.json'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('check-style', ['jshint']);
    grunt.registerTask('test', ['clean', 'mocha_istanbul:coverage']); // The coverage plugin runs the tests as well

    // What is run when just calling "grunt" on the command line
    grunt.registerTask('default', ['check-style', 'test']);
};