let vinus = require('vinus');

let spacerVersion = '-' + require('./package.json').version;


vinus

    //notify css
    // .css('src/css/ukNotify.css', 'dist/css/ukNotify.css')
    // .withRtl()

    //spacer
    .babel('src/js/spacer.js', `dist/js/spacer.js`)
    .babel('src/js/spacer.js', `dist/js/spacer${spacerVersion}.js`)

    //services  => uncomment changed
    // .babel('src/js/services/bootstrap3-modal-service.js', `dist/js/services/bootstrap3-modal-service.js`)
    // .babel('src/js/services/bootstrap3-panel-service.js', `dist/js/services/bootstrap3-panel-service.js`)
    // .babel('src/js/services/bootstrap3-validation-driver.js', `dist/js/services/bootstrap3-validation-driver.js`)
    // .babel('src/js/services/bootstrap4-validation-driver.js', `dist/js/services/bootstrap4-validation-driver.js`)
    // .babel('src/js/services/listOfErrors-validation-driver.js', `dist/js/services/listOfErrors-validation-driver.js`)
    // .babel('src/js/services/storage.js', `dist/js/services/storage.js`)
    // .babel('src/js/services/uk-notify-remark.js', `dist/js/services/uk-notify-remark.js`)
    // .babel('src/js/services/uk-notify-metronic.js', `dist/js/services/uk-notify-metronic.js`)
    // .babel('src/js/services/uk-notify-bootstrap3.js', `dist/js/services/uk-notify-bootstrap3.js`)


/*

Api Function:
-------------
newCss()
src(dist)
dist(dist)
concat(name)
rename(name)
asSass()
asLess()
withRtl()

newJs()
src(dist)
dist(dist)
concat(name)
rename(name)
babelify(opts)
browserify()
asTs(opts)

newcopy()
src(dist)
dist(dist)
rename(name)

newGroup(name)

//alias
css(src, dist)
sass(src, dist)
less(src, dist)
js(src, dist)
vue(src, dist)
babel(src, dist)
ts(src, dist)
copy(src, dist)

//configs
setGlobals({
    prodSuffix:'.min',
    rtlSuffix: '.rtl',
})
 */