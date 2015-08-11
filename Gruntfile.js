module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'js/moback.js',
        dest: 'js/moback.min.js'
      }
    },
    concat: {
      options:{
        banner: "(function (window) {\n",
        footer: "}(window));"
      },
      dist: {
        src: ['src/helper/moback_start.js', 'src/user_mgr.js', 'src/obj_mgr.js', 'src/datatypes_mgr.js',
          'src/acl_mgr.js', 'src/role_mgr.js', 'src/query_mgr.js', 'src/notification_mgr.js', 'src/file_mgr.js',
          'src/helper/ajax.js', 'src/helper/moback_end.js'],
        dest: 'js/moback.js'
      }
    },
    doxx: {
      all: {
        src: 'src',
        target: 'generated-docs',
        options: {
          title: 'Moback Javascript SDK Documentation',
          ignore: 'helper',
          template: 'lib/doxx.jade'
        }
      }
    },
    jsdoc: {
      dist: {
        src: 'src/*.js',
        options: {
          destination: 'generated-docs'
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
        src: ["js", "generated-docs"]
      },
      dev: {
        src: ["js", "tmp"]
      }
    },
    integrateAllJS: {
      main: {
        concatenatedJS: 'tmp/moback_concat.js', // Compiled template src
        src: 'src/master.js',
        dest: 'js/moback.js'
      }
    },
    markdown: {
      all: {
        files: [
          {
            expand: true,
            src: 'docs/src/*.md',
            dest: 'docs/html/',
            ext: '.html'
          }
        ]
      }
    },
    watch: {
      js: {
        files: ['src/**.js', 'src/helper/**.js'],
        tasks: ['clean:dev', 'concat']
      },
      docs: {
        files: ['src/*.js'],
        tasks: ['clean:build', 'concat', 'doxx']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-doxx');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-markdown');
  grunt.loadNpmTasks('grunt-jsdoc');
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

  grunt.registerTask('default', ['clean:build', 'concat', 'uglify', 'doxx', 'markdown']);

  grunt.registerTask('serve', ['build-dev', 'connect:server', 'watch:js']);
};