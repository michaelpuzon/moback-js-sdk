module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'dist/moback.js',
        dest: 'dist/moback.min.js'
      }
    },
    concat: {
      options:{
        banner: "(function (window) {\n",
        footer: "}(window));"
      },
      dist: {
        src: ['src/moback_start.js', 'src/user_mgr.js', 'src/obj_mgr.js', 'src/query_mgr.js',
          'src/notification_mgr.js', 'src/file_mgr.js', 'src/ajax.js', 'src/moback_end.js'],
        dest: 'dist/moback.js'
      }
    },
    doxx: {
      all: {
        src: 'src',
        target: 'docs',
        options: {
          title: 'Moback Javascript SDK Documentation'
        }
      }
    },
    connect: {
      /*
      server: {
        port: 1337
      }
      */
      server: {
        options: {
          livereload: true,
          hostname: 'localhost',
          port: 9009
        }
      }
    },
    clean: {
      build: {
        src: ["dist", "docs"]
      },
      dev: {
        src: ["dist", "tmp"]
      }
    },
    integrateAllJS: {
      main: {
        concatenatedJS: 'tmp/moback_concat.js', // Compiled template src
        src: 'src/master.js',
        dest: 'dist/moback.js'
      }
    },
    watch: {
      files: ['src/*.js'],
      tasks: ['clean:dev', 'concat']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-doxx');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  //grunt.loadNpmTasks('grunt-connect');


  grunt.registerMultiTask('integrateAllJS', 'Integrates js files into master js file', function () {
    var data = this.data,
      path = require('path'),
      src = grunt.file.read(data.src),
      dest = grunt.template.process(data.dest),
      templates = grunt.file.read(data.concatenatedJS),
      out;

    //out = src.replace(/\{\{templates\}\}/g, templates);
    out = src.replace('jsPlaceholder', templates);

    grunt.file.write(dest, out);
    grunt.log.writeln('JS Files integrated');
  });

  grunt.registerTask('build-dev', ['clean:dev', 'concat']);

  grunt.registerTask('default', ['clean:build', 'concat', 'uglify', 'doxx']);

  grunt.registerTask('serve', ['connect:server', 'watch']);
};