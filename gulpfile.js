/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */


/* jslint node: true */
"use strict";

// Load plugins
var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    prefixer    = require('gulp-autoprefixer'),
    livereload  = require('gulp-livereload'),
    uglify      = require('gulp-uglify'),
    sass        = require('gulp-sass'),
    //haml        = require('gulp-ruby-haml'),
    //file-include        = require('gulp-file-include'), // Вставка файлов
    fileinclude = require('gulp-file-include'),
    haml        = require('gulp-haml'),
    inject      = require('gulp-inject'), // Инжекст файлов
    uncss       = require('gulp-uncss'),
    jade        = require('gulp-jade');
    sourcemaps  = require('gulp-sourcemaps'),
    cache       = require('gulp-cache'),
    rigger      = require('gulp-rigger'), // Вставка файлов
    cssmin      = require('gulp-minify-css'),
    imagemin    = require('gulp-imagemin'),
    plumber     = require('gulp-plumber'),
    pngquant    = require('imagemin-pngquant'),
    cssimport   = require("gulp-cssimport"),
    rimraf      = require('rimraf'),
    jshint      = require('gulp-jshint'),
    concatCss   = require('gulp-concat-css'),
    rename      = require('gulp-rename'),
    notify      = require('gulp-notify'),
    sftp        = require('gulp-sftp'),
    debug       = require('gulp-debug'),
    prettify    = require('gulp-html-prettify'),
    browserSync = require("browser-sync"),
    reload      = browserSync.reload;

    var options = {
        extensions: ["css"] // process only css
    };

    // Gulp plumber error handler
    var onError = function(err) {
        console.log(err);
    };

    gulp.task('sftp', function(){
        return gulp.src('build/**/*')
            .pipe(sftp({
                host: 'test.ru',
                user: 'test',
                pass: 'test',
                remotepath: 'path-to-folder'
            }))
    });

    gulp.task('clear', function (done) {
      return cache.clearAll(done);
    });
    //livereload = require('gulp-livereload'),
    // connect = require('gulp-connect'),



var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/images/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        jade: 'src/templates/**/*.jade'
        haml: 'src/*.haml',
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/main.js', //В стилях и скриптах нам понадобятся только main файлы
        style: 'src/css/main.css',
        img: 'src/images/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        jade: 'src/**/**/*.haml'
        haml: 'src/**/*.haml',
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/css/**/*.css',
        img: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    }  ,
    tunnel: true,
    host: 'localhost',
    port: 8080,
    logPrefix: "Zet_Web"

};

// Линтинг файлов
gulp.task('lint', function() {
    return gulp.src('./src/scripts/*.js')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
        //.pipe(notify({ message: 'JS Hinting task complete' }));
});

/*SERVER*/
gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('fileinclude', function() {
  gulp.src(['index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('haml2', function () {
  gulp.src('./src/index.haml')
  .pipe(haml())
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))

    //.pipe(rigger())
    .pipe(gulp.dest('./src'));
});


gulp.task('jade', function(){
  return gulp.src('src/templates/**/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('build/'))
})

gulp.task('templates', function() {
  var YOUR_LOCALS = {};

  gulp.src('./lib/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS,
      retty: true
    }))
    .pipe(gulp.dest('./dist/'))
});

 gulp.task('jade:build', function () {
    gulp.src(path.src.html)
        .pipe(plumber({
            errorHandler: onError
        }))
        //.pipe(prettify({indent_char: ' ', indent_size: 2}))
        .pipe(gulp.dest(path.build.html))
        //.pipe(notify({ message: 'Html task complete' }))
        .pipe(reload({stream: true}));
});


/*

gulp.task('haml:build', function () {
  gulp.src('./src/index.haml', {read:false})
    .pipe(haml())
    .pipe(gulp.dest('./src'));
});
*/



gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(plumber({
            errorHandler: onError
        }))
        //.pipe(prettify({indent_char: ' ', indent_size: 2}))
        .pipe(gulp.dest(path.build.html))
        //.pipe(notify({ message: 'Html task complete' }))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        //.pipe(notify({ message: 'Js task complete' }))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sourcemaps.init()) //То же самое что и с js
        //.pipe(concatCss("bundle.css"))
         .pipe(sass()) //Скомпилируем

        /*
        .pipe(sass({
            includePaths: ['src/style/'],
            outputStyle: 'compressed',
            sourceMap: true,
            errLogToConsole: true
        }))
        */
       /* .pipe(uncss({
            html: [
                'build/index.html'
            ]
        }))
        */
        .pipe(prefixer(
          {
            browsers: [
              '> 1%',
              'last 2 versions',
              'firefox >= 4',
              'safari 7',
              'safari 8',
              'IE 8',
              'IE 9',
              'IE 10',
              'IE 11'
            ],
            cascade: false
        }
        )) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(rename('bundle.min.css'))
        .pipe(sourcemaps.write())
        .pipe(cssimport())
        .pipe(gulp.dest(path.build.css))
        //.pipe(livereload())
        //.pipe(notify({ message: 'Styles task complete' }))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(plumber({
            errorHandler: onError
        }))
        /*.pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        */
        .pipe(gulp.dest(path.build.img))
        //.pipe(notify({ message: 'Image task complete' }))
        .pipe(reload({stream: true}));
});


gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        //.pipe(notify({ message: 'Fonts task complete' }))
});

gulp.task('build', [
    //'haml:build',
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);


// Get and render all .haml files recursively


// gulp.task('haml', function () {
//    gulp.src('./src/**/*.haml')
//        .pipe(haml())
//        .pipe(gulp.dest('./src'));
// });

/*
gulp.task('watch-haml', function() {
    gulp.watch(('./haml/blue/*.haml', ['haml']);
});
*/

gulp.task('watch', function(){
    //livereload.listen();
 //   watch([path.watch.haml], function(event, cb) {
 //       gulp.start('haml:build');
 //   });
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
     });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });

});

/* UN CSS TEMP COMMENTED
gulp.task('uncss', function() {
    gulp.src('./build/css/bundle.min.css')
        .pipe(uncss({
            html: [
                './build/index.html'
            ]
        }))
        .pipe(gulp.dest(path.build.css))
});
*/



gulp.task('default', ['lint', 'build', 'webserver', 'watch']);
