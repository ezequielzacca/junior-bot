const gulp = require('gulp');
const ts = require('gulp-typescript');
const JSON_FILES = ['src/*.json', 'src/**/*.json','src/**/*.ejs','!src/wwwroot/*','src/*.pem','src/*.ppk','src/**/*.jasper', 'src/**/*.js','src/**/*.handlebars'];
const WWWROOT = ['src/wwwroot/**'];
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');
var argv = require("yargs").argv;

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('browser-sync', ['nodemon', 'watch'], function () {
    browserSync.init(null, {
        proxy: "localhost:3006",
        files: ["dist/public/**/*.*", "dist/views/**/*.*"],
        port: 7000,
    });
});

// run nodemon on server file changes
gulp.task('nodemon', function (cb) {
    var started = false;

    return nodemon({
        script: 'dist/index.js',
        watch: ['dist/*.js']
    }).on('start', function () {
        if (!started) {
            cb();
            started = true;
        }
    }).on('restart', function onRestart() {
        setTimeout(function reload() {
            browserSync.reload({
                stream: false
            });
        }, 500);  // browserSync reload delay
    });
});

gulp.task('scripts',[/*'wwwroot',*/'assets'], () => {
        var tsResult;
        if (argv._.indexOf('scripts') >= 0) {
            console.log("was called directly")
            tsResult = tsProject.src().pipe(sourcemaps.init())
            .pipe(tsProject()).once("error", function () {
                this.once("finish", () => process.exit(1));
              });
          }else{
            tsResult = tsProject.src().pipe(sourcemaps.init())
            .pipe(tsProject());
          }
return tsResult.js.pipe(sourcemaps.write({
      // Return relative source map root directories per file.
      sourceRoot: function (file) {
        var sourceFile = path.join(file.cwd, file.sourceMap.file);
        return path.relative(path.dirname(sourceFile), file.cwd);
      }
    })).pipe(gulp.dest('dist'));
});        
        


gulp.task('watch', ['scripts'], () => {
    gulp.watch(['src/**/*.ts','src/**/*.ejs','src/**/*.handlebars'], ['scripts']);
});

gulp.task('assets', function() {
    return gulp.src(JSON_FILES)
        .pipe(gulp.dest('dist'));
});

gulp.task('wwwroot', function() {
    return gulp.src(WWWROOT)
        .pipe(gulp.dest('dist/wwwroot'));
});

gulp.task('default', ['browser-sync']);