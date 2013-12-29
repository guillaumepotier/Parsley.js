module.exports = function(grunt) {

  /** LOAD Tasks **/
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-bower-cli');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: ['./dist']
    },

    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: 'version',
              replacement: '<%= pkg.version %>'
            },
            {
              match: 'timestamp',
              replacement: '<%= grunt.template.today() %>'
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
    }
  });

  /** Tasks here **/
  grunt.registerTask('default', []);
  grunt.registerTask('configure', ['clean:dist', 'bower:install']);
  grunt.registerTask('build', ['configure', 'requirejs', 'replace']);
};
