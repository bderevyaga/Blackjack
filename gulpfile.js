const {src, dest, watch, parallel} = require('gulp');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const connect = require('gulp-connect');
const notify = require('gulp-notify');

function connectServer(done) {
    connect.server({
        root: '.',
        livereload: true
    });
    done();
}

function html() {
    return src('*.html')
        .pipe(connect.reload());
}

function js() {
    return src('js/*.js')
        .pipe(connect.reload());
}

function styles() {
    return src('less/*.less')
        .pipe(less())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(dest('css'))
        .pipe(notify('CSS'))
        .pipe(connect.reload());
}

function watchFiles() {
    watch('less/*.less', styles);
    watch('js/*.js', js);
    watch('*.html', html);
}

exports.html = html;
exports.less = styles;
exports.watch = watchFiles;
exports.connect = connectServer;
exports.default = parallel(connectServer, watchFiles);
