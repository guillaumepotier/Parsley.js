module.exports = function (grunt) {

  /** LOAD Tasks **/
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-bower-cli');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-npm2bower-sync');

  grunt.loadNpmTasks('grunt-docco');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: ['./dist']
    },

    sync: {
      all: {
        options: {
          sync: ['author', 'name', 'license', 'main', 'keywords'],
          from: 'package.json',
          to: 'bower.json'
        }
      }
    },

    docco: {
      source: {
        src: ['src/parsley.js', 'src/parsley/*.js', 'src/extra/plugin/remote.js'],
        options: {
          output: 'doc/annotated-source/',
          layout: 'parallel'
        }
      }
    },

    replace: {
      annotated: {
        options: {
          patterns: [
            {
              match: /<div id="jump_page">/ig,
              replacement: function () {
                return '<div id="jump_page"><a class="source" href="../index.html"><<< back to documentation</a>';
              }
            },
            {
              match: /<\/body>/ig,
              replacement: function () {
                return '<script type="text/javascript">var _gaq=_gaq||[];_gaq.push(["_setAccount","UA-37229467-1"]);_gaq.push(["_trackPageview"]);(function(){var e=document.createElement("script");e.type="text/javascript";e.async=true;e.src=("https:"==document.location.protocol?"https://ssl":"http://www")+".google-analytics.com/ga.js";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)})();</script></body>';
              }
            },
            {
              match: 'version',
              replacement: '<%= pkg.version %>'
            },
          ]
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: 'doc/annotated-source/*.html',
            dest: 'doc/annotated-source/'
          }
        ]
      },
      dist: {
        options: {
          patterns: [
            {
              match: 'name',
              replacement: '<%= pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1) %>'
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
            src: 'dist/parsley.js',
            dest: 'dist/'
          }
        ]
      }
    },

    requirejs: {
      compile: {
        options: {
          // name: "./bower_components/almond/almond",
          name: "parsley",
          mainConfigFile: "./src/config.js",

          wrap: {
            startFile: "src/wrap/prepend.js",
            endFile: "src/wrap/append.js"
          },

          optimize: 'none',
          out: "dist/parsley.js",
          findNestedDependencies: true,

          // Avoid breaking semicolons inserted by r.js
          skipSemiColonInsertion: true,
          onBuildWrite: convert
        }
      }
    },

    uglify: {
      options: {
        report: 'gzip',
        preserveComments: function (pos, node) {
          return new RegExp('^!').test(node.value) && RegExp('parsley', 'i').test(node.value);
        }
      },
      min: {
        files: {
          'dist/parsley.min.js': 'dist/parsley.js'
        }
      },
      remote: {
        files: {
          'dist/parsley.remote.min.js': 'dist/parsley.remote.js'
        }
      }
    },

    watch: {
      dev: {
        files: ['src/parsley.js', 'src/parsley.css', 'src/wrap/*.js', 'src/parsley/*.js'],
        tasks: ['requirejs', 'replace:dist']
      }
    },

    concat: {
      remote: {
        src: ['dist/parsley.js', 'src/extra/plugin/remote.js'],
        dest: 'dist/parsley.remote.js'
      }
    }
  });

  /** Tasks here **/
  grunt.registerTask('default', []);
  grunt.registerTask('configure', ['bower:install']);
  grunt.registerTask('build-std', ['requirejs', 'replace:dist', 'uglify:min']);
  grunt.registerTask('build-remote', ['concat:remote', 'uglify:remote']);
  grunt.registerTask('build-annotated-source', ['docco:source', 'replace:annotated']);
  grunt.registerTask('build', ['configure', 'clean:dist', 'build-std', 'build-remote', 'build-annotated-source', 'sync']);
  grunt.registerTask('build-all', ['build']);
};

var rdefineEnd = /\}\);[^}\w]*$/;

function convert(name, path, contents) {
  // Update original validatorjs for non-AMD implementation
  if (/(dist\/validator.js)/.test(path)) {

    // Makes sure the self-executing wrapper function stores a variable
    contents = contents.replace("(","var Validator = (");

    // Makes sure the self-executing wrapper function returns an object
    var lastClosingBraceIndex = contents.lastIndexOf("}");
    contents = contents.substring(0, lastClosingBraceIndex)
      + "\n\n  return exports;\n}"
      + contents.substring(lastClosingBraceIndex + 1);

    return contents;
  }

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
