/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= pkg.author %> <%= grunt.template.today("yyyy") %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    config: {
      dist:'./dist',
      src: './src',
      js: [
        '<%= config.src %>/**/*.js',
        '!<%= config.src %>/**/*.spec.js'
      ]
    },
    clean: ['<%= config.dist %>'],
    copy: {

    },
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['<%= config.js %>'],
        dest: '<%= config.dist %>/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: '<%= config.dist %>/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          angular: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },
    sass: {
      dev: {
        //files: [{
          src: '<%= config.src %>/*.scss',
          dest:'<%= config.dist %>/<%= pkg.name %>.css'
       //}]
      }
    },
    autoprefixer: {
      dev: {
        options: {
           browsers: ['last 2 versions']
        },
        src: '<%= sass.dev.dest %>',
        dest: '<%= sass.dev.dest %>'
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['build']
      },
      js: {
        files: ['<%= config.js %>', '**/*.spec.js'],
        tasks: ['karma:unit:run', 'build']
      },
      scss: {
        files: '<%= config.src %>/scss/**/*.scss',
        tasks: ['sass', 'autoprefixer']
      },
      index: {
        files: '<%= config.src %>/index.html',
        tasks: ['build']
      }
    },
    connect: {
      server: {
        options: {
          port: 9393,
          hostname: '0.0.0.0',
          base: '.'
        }
      }
    },
    karma: {
        unit: {
            configFile: 'karma-unit.js',
            background: true,
            browsers: ['Chrome', 'Firefox']
        }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('build', ['clean', 'jshint', 'concat', 'uglify', 'sass', 'autoprefixer']);
  grunt.registerTask('default', ['karma:unit', 'connect', 'watch']);

};
