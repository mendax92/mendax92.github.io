---
title: 利用gulp4对Hexo博客压缩
tags:
  - blog
  - hexo
  - 网站优化
translate_title: compress-hexo-blog-with-gulp4
date: 2019-07-31 10:27:41
---
## 安装插件 ##
在博客的根目录执行以下命令
<pre><code>npm install gulp --save
</pre></code>
### 安装功能模块 ###
介绍(我压缩图片用不上，我的图片全部上传github)

- gulp-htmlclean       // 清理html
- gulp-htmlmin         // 压缩html
- gulp-minify-css      // 压缩css
- gulp-uglify          // 混淆js
- gulp-imagemin        // 压缩图片
<pre><code>npm install gulp-htmlclean gulp-htmlmin gulp-minify-css gulp-uglify gulp-imagemin --save
</pre></code> 
<!--more-->
## gulp配置 ##
在根目录下创建gulpfile.js文件
<pre><code>var gulp = require('gulp');
//Plugins模块获取
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
//压缩css
gulp.task('minify-css', function () {
return gulp.src('./public/**/*.css')
.pipe(minifycss())
.pipe(gulp.dest('./public'));
});
//压缩html
gulp.task('minify-html', function () {
return gulp.src('./public/**/*.html')
.pipe(htmlclean())
.pipe(htmlmin({
removeComments: true,
minifyJS: true,
minifyCSS: true,
minifyURLs: true,
}))
.pipe(gulp.dest('./public'))
});
//压缩js 不压缩min.js
gulp.task('minify-js', function () {
return gulp.src(['./public/**/*.js', '!./public/**/*.min.js'])
.pipe(uglify())
.pipe(gulp.dest('./public'));
});
//4.0以前的写法 
//gulp.task('default', [
  //  'minify-html', 'minify-css', 'minify-js'
//]);
//4.0以后的写法
// 执行 gulp 命令时执行的任务
gulp.task('build', gulp.parallel('minify-html', 'minify-css', 'minify-js', function() {
  // Do something after a, b, and c are finished.
}));
</pre></code>
## 执行压缩 ##
<pre><code>hexo clean
hexo g
gulp  // 执行压缩，两条命令可以合并：hexo g && gulp
hexo d //执行部署命令
</pre></code>

