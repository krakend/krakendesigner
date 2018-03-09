module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ngtemplates:  {
      app:        {
        src:      'src/app/html/components/**.html',
        dest:     'src/app/compiled_templates.js',
        options:  {
          module: 'KrakenDesigner',
          standalone: false,
          prefix: '/'
        }
      }
    }
  });

  // Load the plugin that provides the "grunt-angular-templates" task.
  grunt.loadNpmTasks('grunt-angular-templates');


  // Default task(s).
  grunt.registerTask('default', ['ngtemplates']);

};