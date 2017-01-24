var gulp = require('gulp');
var flatten = require('gulp-flatten');
var inject = require('gulp-inject');
var connect = require('gulp-connect');
var series = require('stream-series');
var gutil = require('gulp-util');

gulp.task('import-bower-components',function(){
	gulp.src('bower_components/**/*.min.js')
	.pipe(flatten())
	.pipe(gulp.dest('src/assets/js/'));
});

gulp.task('inject-scripts',function(){
	var ang = gulp.src(['./src/assets/js/angular.min.js'], {read:false});
	var angularLibsStream = gulp.src(['./src/assets/js/*js','!./src/assets/js/angular.min.js'], {read:false});
	var appStream = gulp.src(['./src/**/*app.js'], {read:false});
	var servicesStream = gulp.src(['./src/**/*service.js'], {read:false});
	var controllersStream = gulp.src(['./src/**/*controller.js'], {read:false});
	var directivesStream = gulp.src(['./src/**/*directive.js'], {read:false});	

	return gulp.src('src/index.html')
	.pipe(inject(series(ang,angularLibsStream, appStream),{relative:true}))
	.pipe(gulp.dest('./src'));
});

gulp.task('watch',function(){
	gulp.watch('src/**/*',['reload']);
});

gulp.task('reload',function(){
	gulp.src(['src/**/*'])
	.pipe(connect.reload())
});

gulp.task('connect',function(){
	connect.server({
		root: './src',
		livereload: true
	})
});

gulp.task('run-dev',['import-bower-components','inject-scripts','connect','watch']);