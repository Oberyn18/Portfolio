import gulp from 'gulp';
import babel from 'gulp-babel';
import pug from 'gulp-pug2';
import browserSync from 'browser-sync';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';

const server = browserSync.create();

const postCSSPlugins = [
    cssnano({
        autoprefixer: {
            add: true
        }
    })
]

gulp.task('es6', () => 
    gulp.src('./dev/js/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./docs/js'))
);

gulp.task('sass', () => 
    gulp.src('./dev/scss/styles.scss')
        .pipe(sass())
        .pipe(postcss(postCSSPlugins))
        .pipe(gulp.dest('./docs/css'))
        .pipe(server.stream({match:'**/*.css'}))
);

gulp.task('pug', () => 
    gulp.src('./dev/pug/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('./docs'))
);

gulp.task('default', () => {
    server.init({
        server: {
            baseDir: './docs'
        }
    });
    gulp.watch('./dev/js/*.js', ['es6', server.reload]);
    gulp.watch('./dev/**/*.pug', ['pug', server.reload]);
    gulp.watch('./dev/scss/**/*.scss', ['sass'])
});