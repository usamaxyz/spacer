const mix = require('laravel-mix');
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

let spacerVersion = '-' + require('./package.json').version;

let suffix = mix.inProduction() ? '.min' : '';

mix
    .js('src/js/spacer.js', `dist/js/spacer${suffix}.js`)
    .js('src/js/spacer.js', `dist/js/spacer${spacerVersion}${suffix}.js`)

    //services  => uncomment changed
    .js('src/js/services/bootstrap3-modal-service.js', `dist/js/services/bootstrap3-modal-service${suffix}.js`)
    .js('src/js/services/bootstrap3-panel-service.js', `dist/js/services/bootstrap3-panel-service${suffix}.js`)
    .js('src/js/services/bootstrap3-validation-driver.js', `dist/js/services/bootstrap3-validation-driver${suffix}.js`)
    .js('src/js/services/bootstrap4-validation-driver.js', `dist/js/services/bootstrap4-validation-driver${suffix}.js`)
    .js('src/js/services/bootstrap4-3-hybrid-validation-driver.js', `dist/js/services/bootstrap4-3-hybrid-validation-driver${suffix}.js`)
    .js('src/js/services/listOfErrors-validation-driver.js', `dist/js/services/listOfErrors-validation-driver${suffix}.js`)
    .js('src/js/services/storage.js', `dist/js/services/storage${suffix}.js`)
    .js('src/js/services/spa-notify-remark.js', `dist/js/services/spa-notify-remark${suffix}.js`)
    .js('src/js/services/spa-notify-metronic.js', `dist/js/services/spa-notify-metronic${suffix}.js`)
    .js('src/js/services/spa-notify-bootstrap3.js', `dist/js/services/spa-notify-bootstrap3${suffix}.js`)
    .js('src/js/services/spa-notify-bootstrap4.js', `dist/js/services/spa-notify-bootstrap4${suffix}.js`)

    .sass('src/css/spa-notify.scss', `dist/css/spa-notify${suffix}.css`)
    .sass('src/css/spa-notify.rtl.scss', `dist/css/spa-notify.rtl${suffix}.css`, {}, [
        require("rtlcss")(),
    ])
;