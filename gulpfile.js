const gulp        = require('gulp');
const browserSync = require('browser-sync');
const sass        = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

gulp.task('server', function() {

    browserSync({
        server: {
            baseDir: "dist"
        },
        
    });

    gulp.watch("src/*.html").on('change', browserSync.reload);
    gulp.watch('src/js/**/*.js').on('change', browserSync.reload);
});

gulp.task('styles', function() {
    return gulp.src("src/assets/**/*.+(scss|sass|css)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '', prefix: ''}))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("dist/assets"))
        .pipe(browserSync.stream());
});

gulp.task('watch', function() {
    gulp.watch("src/assets/**/*.+(scss|sass|css)", gulp.parallel('styles'));
    gulp.watch("src/*.html").on('change', gulp.parallel('minify'));
    gulp.watch('src/js/**/*.js').on('change', gulp.parallel('scripts'));
});

gulp.task('minify', function () {
    return gulp.src("src/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('vendorScripts', function () {
    return gulp.src("src/js/**/*min.js")
    .pipe(gulp.dest('dist/js'));
});

gulp.task('scripts', function () {
    return gulp.src("src/js/*!(*.min).js")
    .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('fonts', function () {
    return gulp.src("src/fonts/**/*")
    .pipe(gulp.dest('dist/assets/fonts'));
});

gulp.task('icons', function () {
    return gulp.src("src/assets/icons/**/*")
    .pipe(gulp.dest('dist/assets/icons'));
});

gulp.task('images', function () {
    return gulp.src("src/assets/img/**/*.+(png|ico|webp|svg|jpg)")
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/img'));
});


gulp.task('default', gulp.parallel('watch', 'server', 'styles', 'scripts', 'vendorScripts', 'fonts', 'icons', 'minify', 'images'));