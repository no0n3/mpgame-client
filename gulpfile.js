var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var usemin = require('gulp-usemin');
var rev = require('gulp-rev');
var revOutdated  = require('gulp-rev-outdated');
var minifyCss = require('gulp-minify-css');
var ngHtml2Js = require("gulp-ng-html2js");
var inject = require("gulp-inject");
var clean = require('gulp-clean');
var replace = require('gulp-replace');
var gulpAngularExtender = require('gulp-angular-extender');

//Convert all HTML tpl files to Angular template module
gulp.task('create-templates', function() {
    return gulp
        .src('./**/*.html')
        .pipe(ngHtml2Js({
            moduleName: "app.templates",
            rename: function(url) {
                return url.replace('src/', '');
            }
        }))
        .pipe(concat("app.templates.js"))
        .pipe(gulp.dest("src/"));
});

//Inject the templates file into ./src/index.html to be picked up by usemin
gulp.task('inject-templates', ['create-templates'], function() {
    return gulp
        .src('./src/index.html')
        .pipe(inject(
            gulp.src('./src/app.templates.js',
            {read: false}),
            {
                ignorePath: 'src',
                addRootSlash: false
            }
        ))
        .pipe(gulp.dest('src/'));
});

//Minify, concatenate and version CSS and JS
//Use ngAnnotate to take care of Angular inject issues
gulp.task('usemin', ['inject-templates'], function() {
    return gulp
        .src('./src/index.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat', rev()],
            js: [/*ngAnnotate(),*/ uglify(), rev()],
            // assets: [rev()]
        }))
        .pipe(gulp.dest('build/'));
});

//Add Angular module dependency for templates
gulp.task('add-dependencies', ['usemin'], function () {
    gulp
        .src('build/app.min-*.js')
        .pipe(gulpAngularExtender({
            "app": [
                "app.templates"
            ]
        }))
        .pipe(gulp.dest('build/'));
});

//Delete the temporary templates module file and remove the include from ./src/index.html
gulp.task('clean', ['usemin'], function () {
    gulp
        .src('./src/app.templates.js', {read: false})
        .pipe(clean());
    gulp
        .src('./src/index.html')
        .pipe(replace(/(<!--\s*inject:js\s*-->\s*)(\n*)(.*)(\n*)(\s*)(<!--\s*endinject\s*-->)/g, '$1$6'))
        .pipe(gulp.dest('src/'));
    gulp
        .src(['build/*.*'], {read: false})
        .pipe(revOutdated(1)) // leave 1 latest asset file for every file name prefix.
        .pipe(clean());
});

gulp.task('watch', ['usemin'], function () {
    gulp.watch('src/**/*.js', ['usemin'])
});

gulp.task('build', ['create-templates', 'inject-templates', 'usemin', 'add-dependencies', 'clean']);

