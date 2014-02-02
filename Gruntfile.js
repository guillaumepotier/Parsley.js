module.exports = function (grunt) {

  /** LOAD Tasks **/
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-bower-cli');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');

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
            },
            // Remove useless define statements that r.js add after concatenation, and not matched by convert callback
            {
              match: /define\("((?!\);)[\s\S])*\);/ig,
              replacement: function () {
                return '';
              }
            },
            // Remove useless double line breaks
            {
              match: /\n\n/ig,
              replacement: function () {
                return "\n";
              }
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
        // name: "./bower_components/almond/almond",
        name: "parsley",
        mainConfigFile: "./src/config.js",

        wrap: {
          startFile: "src/wrap/prepend.js",
          endFile: "src/wrap/append.js"
        },

        // Avoid breaking semicolons inserted by r.js
        skipSemiColonInsertion: true,
        onBuildWrite: convert
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
    },

    watch: {
      dev: {
        files: ['src/parsley.js', 'src/wrap/*.js', 'src/parsley/*.js'],
        tasks: ['requirejs', 'replace']
      }
    }
  });

  /** Tasks here **/
  grunt.registerTask('default', []);
  grunt.registerTask('configure', ['clean:dist', 'bower:install']);

  grunt.registerTask('build', ['configure', 'requirejs', 'replace', 'uglify:min']);
  grunt.registerTask('build-annotated-source', 'docco:source');

  grunt.registerTask('build-all', ['build', 'build-annotated-source']);
};

var rdefineEnd = /\}\);[^}\w]*$/;

function convert(name, path, contents) {
  // Convert ParsleyDefaults and ParsleyUtils that needs a special treatment
  if (/(defaults|utils)/.test(path)) {
    var name = (/parsley\/([\w-]+)/.exec(name)[1]);

    return contents
      .replace(/define\([\w\W]*?return/, "  var Parsley" + name.charAt(0).toUpperCase() + name.slice(1) + " =")
      .replace(rdefineEnd, "");
  }

  // Leave original validatorjs untouched
  if (/(dist\/validator.js)/.test(path))
    return contents;

  // Ignore returns
  contents = contents
    .replace(/\s*return\s+[^\}]+(\}\);[^\w\}]*)$/, "$1")
    // Multiple exports
    .replace(/\s*exports\.\w+\s*=\s*\w+;/g, "");

  // Remove define wrappers, closure ends, and empty declarations
  contents = contents
    .replace(/define\([^{]*?{/, "")
    .replace(rdefineEnd, "\n");

  return contents;
}
