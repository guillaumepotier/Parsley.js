module.exports = function(grunt) {

  /** LOAD Tasks **/
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-bower-cli');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.loadNpmTasks('grunt-docco');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: ['./dist']
    },

    docco: {
      source: {
        src: ['src/parsley.js', 'src/parsley/*.js'],
        options: {
          output: 'doc/annotated-source/',
          layout: 'parallel'
        }
      }
    },

    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: 'name',
              replacement: '<%= pkg.name %>'
            },
            {
              match: 'version',
              replacement: '<%= pkg.version %>'
            },
            {
              match: 'author',
              replacement: '<%= pkg.author.name %> - <<%= pkg.author.email %>>'
            },
            {
              match: 'timestamp',
              replacement: '<%= grunt.template.today() %>'
            },
            {
              match: 'license',
              replacement: '<%= pkg.license %>'
            }
          ]
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: ['dist/parsley.js', 'dist/parsley.min.js'],
            dest: 'dist/'
          }
        ]
      }
    },

    requirejs: {
      options: {
        name: "./bower_components/almond/almond",
        mainConfigFile: "./src/config.js",

        // TODO: find how to give only parsley here :(
        include: ['parsley'],
        insertRequire: ['parsley'],
        wrap: true
      },
      production: {
        options: {
          out: "dist/<%= pkg.name %>.min.js",
          findNestedDependencies: true
        }
      },
      development: {
        options: {
          out: "dist/<%= pkg.name %>.js",
          findNestedDependencies: true,
          optimize: 'none'
        }
      }
    },

    uglify: {
      min: {
        options: {
          report: 'gzip',
          preserveComments: function (pos, node) { return new RegExp('^!').test(node.value); }
        },
        files: {
          'dist/parsley.min.js': 'dist/parsley.min.js'
        }
      }
    }
  });

  /** Tasks here **/
  grunt.registerTask('default', []);
  grunt.registerTask('configure', ['clean:dist', 'bower:install']);
  grunt.registerTask('build', ['configure', 'requirejs', 'replace', 'uglify:min']);

  grunt.registerTask('build-annotated-source', 'docco:source');

};
