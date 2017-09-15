let gulp = require('gulp');
let sass = require('gulp-sass');
let cleanCSS = require('gulp-clean-css');
let sourcemaps = require('gulp-sourcemaps');
let minify = require('gulp-minify');

gulp.task('build-all', () => {
    gulp.src('lib/mrm.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('minimize-css', () => {
    gulp.src(['dist/css/*.css', '!dist/css/*.min.css'])
        .pipe(sourcemaps.init())
        .pipe(cleanCSS({
            debug: true,
            format: 'beautify'
        }, function (data) {
            let oldSize = data.stats.originalSize,
                newSize = data.stats.minifiedSize,
                name = data.name,
                delta = Math.round(100 - newSize / oldSize * 100);

            console.log(`${name}: ${oldSize} -> ${newSize} (${delta}%)`);
        }))
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('minimaze-js', () => {
    gulp.src(['dist/js/*.js', '!dist/js/*.min.js'])
        .pipe(minify({
            ext: {
                min: '.min.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['-min.js']
        }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('copy', function () {
    gulp.src('./dist/js/*')
        .pipe(gulp.dest('web/assets/js'));
    gulp.src('./dist/css/*')
        .pipe(gulp.dest('web/assets/css'));
    gulp.src('./dist/css/fonts/*')
        .pipe(gulp.dest('web/assets/css/fonts'))
});

gulp.task('watch', () => gulp.watch('lib/**/*.scss', ['build-all']));

gulp.task('default', ['build-all', 'minimaze-js', 'copy']);