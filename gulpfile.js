var path = {
    srcStyles       : 'src/scss',
    distStyles      : 'demo/css',
    srcHtml         : 'src',
    distHtml        : 'demo',
    srcImages       : 'src/img',
    distImages      : 'demo/img'
};

var gulp            = require('gulp'),
    browsersync     = require('browser-sync'),
    plumber         = require('gulp-plumber'),
    // del             = require('del'),
    beep            = require('beepbeep'),
    colors          = require('colors'),
    changed         = require('gulp-changed'),
    cp              = require('child_process'),
    runSequence     = require('run-sequence'),
    rename          = require('gulp-rename'),
    sass            = require('gulp-sass'),
    autoprefixer    = require('gulp-autoprefixer'),
    // csso            = require('gulp-csso'),
    size            = require('gulp-size'),
    imagemin        = require('gulp-imagemin')
    // svgmin          = require('gulp-svgmin'),
    // concat          = require('gulp-concat')
    ;


// ERROR HANDLER ========================================
var onError = function(err) {
    beep([200, 200]);
    console.log(
        '\n*****************'.bold.gray + ' \\(°□°)/ '.bold.red + '<( ERROR! ) '.bold.blue + '*****************\n\n'.bold.gray +
        String(err) +
        '\n*******************************************************\n'.bold.gray );
    browsersync.notify(String(err), 5000);
    this.emit('end');
};


// EXEC =================================================
gulp.task('exec', function(cb) {
    cp.exec('npm install', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    })
});


// STYLES ===============================================
gulp.task('css', function() {
    return gulp.src( path.srcStyles + '/*.scss' )
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: [
                'last 2 versions',
                'safari 5',
                'ie 8',
                'ie 9',
                'opera 12.1',
                'android 4'
            ],
            cascade: true
        }))
        .pipe(gulp.dest( path.distStyles ))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest( path.distStyles ))
        .pipe(size());

});


// HTML ==================================================
gulp.task('copy-html', function() {
    return gulp.src( path.srcHtml + '/*.html')
        .pipe(changed( path.distHtml + '/*.html' ))
        .pipe(gulp.dest( path.distHtml ));
});

gulp.task('html', ['copy-html'], function() {
    return browsersync.reload();
});


// IMAGES ===============================================
gulp.task('images', function() {
    gulp.src(path.srcImages + '/**/*.{jpg,jpeg,png,gif}')
        .pipe(imagemin({
            optimizationLevel: 3,
            progessive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(path.distImages));
});


// BROWSER SYNC =========================================
gulp.task('browsersync', function() {
    browsersync({
        server: {
            baseDir: "demo/",
            port: 5000,
            watchTask: true,
            files: [ path.distStyles + '/*.css'],
            logConnections: true,
        },
    })
});


// WATCH ================================================
gulp.task('watch', ['browsersync'], function() {
    gulp.watch( path.srcStyles + '/**/*.scss',  ['css'] );
    gulp.watch( path.srcHtml + '/**/*.html',    ['html'] );
    // gulp.watch( path.src + '/_img/**/*.+(png|jpg)',  ['images'] );
    // gulp.watch( path.src + '/_img/**/*.svg',         ['svg'] );
});




// BUILD ================================================
gulp.task('build', function(callback) {
    runSequence(
        'exec',
        [
            'css',
            'html',
            'images'
        ],
    callback);
});
gulp.task('default', function(callback) {
    runSequence(
        'build',
        ['watch'],
    callback);
});
