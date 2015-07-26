module.exports = function (grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var config = {
    watch: {
      js: {
        files: ['src/{,**/}*.js'],
        tasks: ['jshint']
      }
    },
    jshint : {
      options: {
        jshintrc: true
      },
      src: ['src/{,**/}*.js']
    }
  };

  grunt.initConfig(config);

  grunt.registerTask('default', [
    "watch"
  ]);

};
