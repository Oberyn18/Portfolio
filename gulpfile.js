// Solicito esas dependencias
const gulp = require('gulp'),
sass = require('gulp-sass');
autoprefixer = require('gulp-autoprefixer'),
browserSync = require('browser-sync').create(),
pug = require('gulp-pug2');

// Para recargar el navegador
const reload = browserSync.reload;
// "./" denota DIRECTORIO ACTUAL

// Sass y autoprefixer.
gulp.task('sass', ()=> {
// Defino un origen
gulp.src('./scss/*.scss')
// Paso el plug-in Sass
.pipe(sass())
.pipe(autoprefixer({
    // Cuantas versiones anteriores debo considerar
    browsers: ['last 15 versions'],
    // Formato de los prefijos
    cascade: true,
    // Considerar grid a la hora de poner los prefijos
    grid: true
}))
// Defino un destino
.pipe(gulp.dest('./css'))
// Agregado para el browser-sync:
 .pipe(browserSync.reload({stream:true}))
});

// Pug
gulp.task('pug', () => {
// Origen
gulp.src('./pug/*.pug')
.pipe(pug({
    pretty: true
}))
.pipe(gulp.dest('./'))
});

// Browser Sync
gulp.task('browser-sync', ['sass', 'pug'], () => {
browserSync.init({
    server: {
        baseDir: "./"
    }
});
});

// Watch
gulp.task('watch', ()=> {
// Por defecto ejecutaré las siguientes tareas, sobre los archivos que pase en watch:
gulp.watch('./scss/**/*.scss', ['sass']);
gulp.watch('./pug/**/*.pug', ['pug']);
/// A diferencia del CSS, para el HTML o JS se debe usar browserSync.reload
gulp.watch('./*.html').on('change', reload)
});

// Tarea por defecto:
gulp.task('default', ['watch', 'browser-sync']);