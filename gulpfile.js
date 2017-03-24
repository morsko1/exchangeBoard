var gulp = require('gulp'),
	open = require('gulp-open'),
	connect = require('gulp-connect'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	sourcemaps = require('gulp-sourcemaps');

//CONFIG
var config = {
	path: {
		src: {
			html: './*.html',
			css: './css/*.css',
			js: './js/main.js',
			jswatch: './js/**/*.js'
		},
		dist: './'
	},
	localServer: {
		port: 8001,
		url: 'http://localhost:8001/'
	}
};

// HTML
gulp.task('html', function() {
	gulp.src(config.path.src.html)
	.pipe(connect.reload());
});

// CSS
gulp.task('css', function () {
	gulp.src(config.path.src.css)
	.pipe(connect.reload());
});

// browserify
gulp.task('browserify', function() {
	return browserify(config.path.src.js, {debug : true})
	.bundle()
	// Передаем имя файла, который получим на выходе, vinyl-source-stream
	.on('error', function(err){ // from SO
	// print the error (can replace with gulp-util)
	console.log(err.message);
	// end this stream
	this.emit('end');
	})
	.pipe(source('_build.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest(config.path.dist))
	.pipe(connect.reload());
});

// CONNECT
gulp.task('connect', function () {
	connect.server({
		root: './',
		port: config.localServer.port,
		livereload: true
	});
});

// BUILD
gulp.task('build', [
	'html',
	'css',
	'browserify'
]);

// OPEN
gulp.task('open', function(){
	gulp.src('index.html')
	.pipe(open({uri: config.localServer.url}));
});

// WATCH
gulp.task('watch', function () {
	gulp.watch(config.path.src.html, ['html']);
	gulp.watch(config.path.src.css, ['css']);
	gulp.watch(config.path.src.jswatch, ['browserify']);
});

// DEFAULT
gulp.task('default', ['build', 'connect', 'open', 'watch']);