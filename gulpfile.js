var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('build-all', function () {
    gulp.src('lib/mrm.scss')
        .pipe(sass()) // Using gulp-sass
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function () {
    gulp.watch('lib/**/*.scss', ['build-all']);
});

gulp.task('default', ['build-all']);