'use strict';

const mqpacker = require("css-mqpacker");

module.exports = function() {
  $.gulp.task('sass', function() {
    return $.gulp.src('./source/style/app.sass')
      //.pipe($.gp.sourcemaps.init())
      .pipe($.gp.sass()).on('error', $.gp.notify.onError({ title: 'Style' }))
      .pipe($.gp.autoprefixer({ browsers: $.config.autoprefixerConfig }))
      .pipe($.gp.postcss([
          mqpacker({
              sort: true
          })
      ]))
      //.pipe($.gp.sourcemaps.write())
      .pipe($.gp.csso())
      .pipe($.gulp.dest($.config.root + '/assets/css'))
      .pipe($.browserSync.stream());
  })
};
