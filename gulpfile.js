let gulp = require('gulp');
let sass = require('gulp-sass');
let cleanCSS = require('gulp-clean-css');
let sourcemaps = require('gulp-sourcemaps');

gulp.task('build-all', () => {
    gulp.src('lib/mrm.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('minimize-all', () =>{
    gulp.src(['dist/css/*.css', '!dist/css/*.min.css'])
    .pipe(sourcemaps.init())
    .pipe(cleanCSS({debug: true, format: 'beautify'}))
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('dist/css'));
})

gulp.task('watch', () => gulp.watch('lib/**/*.scss', ['build-all']));

gulp.task('default', ['build-all', 'minimize-all']);