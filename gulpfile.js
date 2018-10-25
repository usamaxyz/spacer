let gulp = require('gulp'),
    less = require('gulp-less'),
    sass = require('gulp-sass'),
    rtl = require('gulp-rtlcss'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleanCss = require('gulp-clean-css'),
    args = require('yargs').argv,
    es = require('event-stream'),

    //sourcemaps = require('gulp-sourcemaps'),

    //browserify
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),

    //browserify plugins
    babelify = require('babelify'),
    tsify = require("tsify"),
    vueify = require('vueify'),

    //typescript
    gulpTypescript = require("gulp-typescript"),
    gulpBabel = require("gulp-babel"),


    //util
    gulpif = require('gulp-if'),
    rename = require('gulp-rename'),
    logger = require('./node_modules/vinus/logger');


/*
 * get local files: start.js, tsconfig.json, .babelrc
 */

let isProduction = !!args.prod,
    vinusObj;


if (isProduction) {
    logger.info('Production mode...');
    process.env.NODE_ENV = 'production';
}

//start file
try {
    require('./' + (args.start || 'start.js'));
    vinusObj = require('vinus').get();
} catch (ex) {
    logger.error(ex);
    return logger.error((args.start || 'start.js') + ' not found. Use "npx vinus init" command to add start.js.');
}

vinusObj['isProduction'] = isProduction;
if (vinusObj.scripts)
    vinusObj.scripts.forEach(element => {
        //init browserify
        let browserifySrc = undefined;
        if (element.src.length && element.browserify.status) {
            browserifySrc = browserify({
                entries: element.src,
                // debug: true,
                cache: {},
                packageCache: {}
            });

            if (element.typescript.status)
                browserifySrc.plugin(tsify);

            browserifySrc.transform(vueify);

            if (element.babel.status)
                browserifySrc.transform(babelify);
        }
        element.browserifySrc = browserifySrc;
    });

/*
 * core tasks
 */
function styles() {
    let tasks = vinusObj.styles.map(function (element) {
        return gulp.src(element.src)
            .pipe(gulpif(element.isSass, sass()))
            .pipe(gulpif(element.isLess, less()))
            .pipe(gulpif(element.concat.status, concat(element.concat.fileName)))
            .pipe(gulpif(vinusObj.isProduction, cleanCss()))

            //emit original if withRtl() is used
            .pipe(gulpif(element.generateRtl && vinusObj.isProduction, rename({
                suffix: '.min'
            })))
            //save
            .pipe(gulpif(element.generateRtl, gulp.dest(element.dist)))
            //remove .min suffix
            .pipe(gulpif(element.generateRtl && vinusObj.isProduction, rename(function (path) {
                path.basename = path.basename.substring(0, path.basename.length - 4);
            })))
            //emit rtl version if withRtl() is used
            .pipe(gulpif(element.generateRtl, rtl()))
            .pipe(gulpif(element.generateRtl, rename({
                suffix: '.rtl'
            })))
            .pipe(gulpif(vinusObj.isProduction, rename({
                suffix: '.min'
            })))
            .pipe(gulp.dest(element.dist));
    });
    // create a merged stream
    if (tasks.length)
        return es.merge.apply(null, tasks);
}

function scripts() {

    let tasks = vinusObj.scripts.map(function (element) {
        let browserifyStatus = element.browserify.status;

        return (browserifyStatus ? element.browserifySrc.bundle() : gulp.src(element.src))
            .pipe(gulpif(!browserifyStatus && element.typescript.status, gulpTypescript()))
            .pipe(gulpif(!browserifyStatus && element.babel.status, gulpBabel()))
            .pipe(gulpif(browserifyStatus, source(element.browserify.sourceName)))
            .pipe(gulpif(browserifyStatus, buffer()))
            .pipe(gulpif(element.concat.status, concat(element.concat.fileName)))
            // .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(gulpif(vinusObj.isProduction, uglify()))
            // .pipe(sourcemaps.write('./'))
            .pipe(gulpif(vinusObj.isProduction, rename({
                suffix: '.min'
            })))
            .pipe(gulp.dest(element.dist));
    });


    // create a merged stream
    if (tasks.length)
        return es.merge.apply(null, tasks);
}

function watch() {
    styles();
    scripts();

    vinusObj.scripts.map(function (element) {
        if (!element.browserify.status) {
            gulp.watch(element.src, ['scripts']).on('change', function (event) {
                logger.info('File ' + event.path + ' was ' + event.type + ', running tasks...');
            });
        }
        else {
            element.browserifySrc.plugin(watchify);
            element.browserifySrc.on('update', scripts);
            element.browserifySrc.on('log', logger.info);
        }
    });
    vinusObj.styles.map(function (element) {
        gulp.watch(element.src, ['styles']).on('change', function (event) {
            logger.info('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
    });

    logger.info('Watching...');
}

/*
 * end of core tasks
 */

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('default', ['styles', 'scripts']);
gulp.task('watch', watch);