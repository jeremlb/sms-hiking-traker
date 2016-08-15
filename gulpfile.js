var gulp = require('gulp');

var fs = require('fs');
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");

var files = {
	css: [
		'/static/css/lumx.css',
		'/static/css/angular-carousel.css',
		'/static/css/style.css'
	]
};

// Include plugins
var plugins = require('gulp-load-plugins')(); // tous les plugins de package.json

gulp.task("webpack:prod", function(callback) {
	// modify some webpack config options

	var myConfig = Object.create(webpackConfig);

	myConfig.output = {
		path: __dirname + '/.build/',
		filename: 'bundle.min.js'
	};

	myConfig.devtool = null;

	myConfig.plugins = myConfig.plugins.concat(
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				"NODE_ENV": JSON.stringify("production")
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	);

	// run webpack
	webpack(myConfig, function(err, stats) {
		callback();
	});
});

gulp.task('webpack:dev', function (callback) {
	var myConfig = Object.create(webpackConfig);

	myConfig.output = {
		path: __dirname + '/.build/',
		filename: 'bundle.js'
	};

	// run webpack
	webpack(myConfig, function(err, stats) {
		callback();
	});
});

gulp.task('copy:fonts', function () {
	return gulp.src('bower_components/lumx/dist/fonts/*')
			.pipe(gulp.dest('./.build/fonts'));
});

gulp.task('copy:data', function () {
	return gulp.src('client/data/*')
			.pipe(gulp.dest('./.build/data'));
});

gulp.task('css:dev', function () {
	return gulp.src([
				'bower_components/lumx/dist/lumx.css',
				'node_modules/angular-carousel/dist/angular-carousel.css',
				'client/css/*'
			])
			.pipe(plugins.replace(/url\(.\//g, 'url(..\/'))
			// .pipe(plugins.csscomb())
			.pipe(gulp.dest('./.build/css'));
});

gulp.task('css:prod', function () {
	return gulp.src([
					'bower_components/lumx/dist/lumx.css',
					'node_modules/angular-carousel/dist/angular-carousel.css',
					'client/css/*'
				])
      		   .pipe(plugins.autoprefixer())
			   .pipe(plugins.replace(/url\(.\//g, 'url(..\/'))
	  		   .pipe(plugins.concat('main.min.css'))
      		   .pipe(plugins.csso())
      		   .pipe(gulp.dest('./.build/css'));
});

gulp.task('clean', function() {
	return gulp.src('.build/**/*', {read: false})
    		   .pipe(plugins.rm());
});

gulp.task('symlink', function (callback) {
	try { // if exception the directory doesn't exist
      !fs.statSync('server/static');
	  callback(); // it exists
  	} catch(e) {
		return gulp.src('./.build')
			.pipe(plugins.sym('server/static'));
	}
});

gulp.task('img:dev', function() {
    return gulp.src('client/img/**/*')
    .pipe(gulp.dest('.build/img'));
});

gulp.task('img:prod', function() {
    return gulp.src('client/img/**/*')
    .pipe(plugins.imagemin({ progressive: true }))
    .pipe(gulp.dest('.build/img'));
});

gulp.task('replace:dev', function () {
	return gulp.src('client/index.html')
		.pipe(plugins.htmlReplace({
			js: '/static/bundle.js',
			css: files.css
		}))
		.pipe(gulp.dest('server/templates'));
});

gulp.task('replace:prod', function () {
	return gulp.src('client/index.html')
		.pipe(plugins.htmlReplace({
			js: '/static/bundle.min.js',
			css: '/static/css/main.min.css'
		}))
		.pipe(plugins.htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('server/templates'));
});

gulp.task('clean:all', ['clean', 'symlink']);

gulp.task("build:dev", ['clean:all'], function () {
	gulp.start("webpack:dev");
	gulp.start("css:dev");
	gulp.start("img:dev");
	gulp.start('copy:fonts');
	gulp.start('copy:data');
	gulp.start('replace:dev');
});

gulp.task("build:prod", ['clean:all'], function () {
	gulp.start("webpack:prod");
	gulp.start("css:prod");
	gulp.start("img:prod");
	gulp.start('copy:fonts');
	gulp.start('copy:data');
	gulp.start('replace:prod');

});

gulp.task('watch', ['build:dev'], function () {
	gulp.watch('client/css/**/*.css', ['css:dev']);
	gulp.watch('client/js/**/*.js', ['webpack:dev']);
});
