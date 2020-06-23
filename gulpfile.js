const { src, dest, parallel, series, watch } = require('gulp');
const newer = require('gulp-newer');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');

const paths = {
    build: './build',

    scss: './src/scss',
    css: './src/css'
}

function browsersync() {
    browserSync.init({ // Инициализация Browsersync
        server: { baseDir: 'dev/' }, // Указываем папку сервера
        notify: false, // Отключаем уведомления
        online: true // Режим работы: true или false (false - если нет интернета)
    })
}

function styles() {
    return src(`${paths.scss}/style.scss`)
    .pipe(sass())
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
    // .pipe(cleancss(
    //     {
    //         level:
    //             {
    //                 1: {
    //                     specialComments: 0
    //                 }
    //             }
    //         }
    // ))
    .pipe(dest(`${paths.css}`))
    .pipe(browserSync.stream())
}

function scripts() {
    return src([
        'dev/js/jquery.fancybox.min.js',
        'dev/js/slick.min.js',
        'dev/js/main.js',
    ])
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(dest('dev/js/'))
    .pipe(browserSync.stream())
}

function images() {
    return src('dev/images/**/*.')
    .pipe(newer('dist/images/'))
    .pipe(imagemin())
    .pipe(dest('dist/images/'))
}

function build() {

}

function startWhatch() {
    watch('dev/**/*.html').on('change', browserSync.reload)
    watch('dev/scss/**/*scss', styles);
    // watch(['dev/js/**/*.js', '!script.min.js'], scripts);
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;

exports.default = parallel(styles, browsersync, startWhatch);
