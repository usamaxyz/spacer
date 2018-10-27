let vinus = require('vinus');

let spacerVersion = '-3.1.7';


vinus

    //notify css
    // .css('src/css/ukNotify.css', 'dist/css/ukNotify.css')

    //spacer
    .babel('src/js/spacer.js', `dist/js/spacer.js`)
    .babel('src/js/spacer.js', `dist/js/spacer${spacerVersion}.js`)

    //services  => uncomment changed
    // .babel('src/js/services/bootstrap3ModalService.js', `dist/js/services/bootstrap3ModalService.js`)
    // .babel('src/js/services/bootstrap3PanelService.js', `dist/js/services/bootstrap3PanelService.js`)
    // .babel('src/js/services/bootstrap3ValidationDriver.js', `dist/js/services/bootstrap3ValidationDriver.js`)
    // .babel('src/js/services/bootstrap4ValidationDriver.js', `dist/js/services/bootstrap4ValidationDriver.js`)
    // .babel('src/js/services/storage.js', `dist/js/services/storage.js`)
    // .babel('src/js/services/ukNotifyRemark.js', `dist/js/services/ukNotifyRemark.js`)
    // .babel('src/js/services/ukNotifyBootstrap3.js', `dist/js/services/ukNotifyBootstrap3.js`)


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
 */