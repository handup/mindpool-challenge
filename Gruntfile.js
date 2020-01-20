var path = require('path');

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var paths = {
        root: path.join(__dirname, '/'),
        src: path.join(__dirname, '/src'),
        dist: path.join(__dirname, '/dist')
    };

    grunt.initConfig({
        paths: paths,
        svgstore: {
            options: {
                prefix : 'svg-',
                cleanup: ['style', 'class'],
                cleanupdefs: true,
                svg: {
                    xmlns: 'http://www.w3.org/2000/svg',
                    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
                    style: 'display: none;'
                }
            },
            build: {
                src: ['<%= paths.src %>/public/static/svgs/icons/**/*.svg'],
                dest: '<%= paths.dist %>/static/svgs/svgs.svg'
            }
        }
    });

    grunt.task.registerTask('svg', ['svgstore']);
};