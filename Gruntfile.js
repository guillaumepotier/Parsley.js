module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    requirejs: {
      options: {
        name: "../bower_components/almond/almond",
        mainConfigFile: "src/config.js",

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

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Default task(s).
  grunt.registerTask('default', []);
  grunt.registerTask('build', 'requirejs');
  grunt.registerTask('build-dev', 'requirejs:development');
  grunt.registerTask('build-prod', 'requirejs:production');
};