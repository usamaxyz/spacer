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

    .sass('src/css/spa-notify.scss', `dist/css/spa-notify${suffix}.css`)
    .sass('src/css/spa-notify.rtl.scss', `dist/css/spa-notify.rtl${suffix}.css`, {}, [
        require("rtlcss")(),
    ])
;