/*jslint node: true */
"use strict";


module.exports = function(grunt) {

  grunt.initConfig({
    connect: {
      server: {
        options: {
          hostname: 'localhost',
          port: 3000,
          base: './public'
        }
      }
    },
    requirejs: {
      development: {
        options: {
          baseUrl: "./app",
          mainConfigFile: "./app/config.js",
          out: "./public/javascripts/main.js",
          name: "./main",
          optimize: "none"
        }
      }
    },
    less: {
      development: {
        options: {
          compress: false,
          yuicompress: false,
          optimization: 2
        },
        files: {
          "./public/stylesheets/style.css": "./less/app.less" // destination file and source file
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      scripts: {
        files: ['./app/**/*.js'],
        tasks: ['requirejs:development'],
        options: {
          spawn: false,
        }
      },
      less: {
        files: ['./less/*.less'],
        tasks: ['less:development'],
        options: {
          spawn: false,
        },
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');


  grunt.registerTask('default', ['less:development', 'requirejs:development', 'connect:server', 'watch']);

};
