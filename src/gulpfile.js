var gulp = require("gulp");
//var compass = require('compass');
//Plugins
var sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload'),
    beep = require('beepbeep'),
    minifycss = require('gulp-minify-css');

//Source and distribution folder
var source = '../src/';
var dest = '../dist/';

//Bootstrap scss source
var bootstrapSass = { in: './bower_components/bootstrap-sass/'
};

//fonts
var fonts = { in: [source + 'fonts/**/*', bootstrapSass.in + 'assets/fonts/**/*'],
    out: dest + 'fonts'
};

// css source file: .scss files
var css = { in: source + 'sass/main.scss',
    out: dest + 'css/',
    watch: source + 'sass/**/*',
    sassOpts: {
        outputStyle: 'compressed',
        precision: 3,
        errLogToConsole: false,
        includePaths: [bootstrapSass.in + 'assets/stylesheets']
    }
};

//js source file: .js files
var js = { in: source + 'js/*.js',
    out: dest + 'js/',
    watch: source + 'js/**/*'
};

// copy bootstrap required fonts to dest
gulp.task('fonts', function() {
    return gulp.src(fonts.in)
        .pipe(gulp.dest(fonts.out));
});

// compile scss
gulp.task('sass', ['fonts'], function() {
    return gulp.src(css.in)
        .pipe(sourcemaps.init())
        .pipe(sass(css.sassOpts))
        .on('error', swallowError)
        .pipe(minifycss({ keepSpecialComments: 0 }))
        .pipe(gulp.dest(css.out))
        .pipe(sourcemaps.write('../maps'))
        .pipe(livereload());
});

gulp.task('compress', function() {
    return gulp.src([
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap/modal.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap/tab.js',
            'vendor/slick.js',
            'js/**/*'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(js.out))
        .pipe(uglify())
        .on('error', swallowError)
        .pipe(gulp.dest(js.out))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(js.out))
        .pipe(livereload());
});

//default task
gulp.task('default', ['sass'], function() {
    livereload.listen();
    gulp.watch(css.watch, ['sass']);
    //gulp.watch(js.watch, ['compress']);
});


//functions
function swallowError(error) {
    beep(2, 1000);
    console.log('----------------- START ERROR -----------------');
    console.log(error);
    this.emit('end');
    console.log('----------------- END ERROR -----------------');
}