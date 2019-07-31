---
title: 巧用Hexo脚本——备份博客源文件
date: 2019-07-31 09:14:41
tags:
- hexo
- blog
---
## Hexo脚本 ##
  Hexo命令会自动触发一些事件，利用这些事件，我们可以为不同的Hexo命令添加一些额外的自定义功能。我们只需要在Hexo根目录下添加一个scripts文件夹，然后将我们编写的脚本文件放在这个文件夹中，当某一事件被触发时，接收相应事件的脚本就会被自动执行。

### 自动备份博客源文件 ###
  Hexo部署的github-pages博客在发布时只会上传生成的页面文件，而我们的源文件却没有上传,这就导致博客源文件没有备份，当然我们可以在GitHub上新建一个repo来管理我们的源文件，但是这样每次都需要手动备份，有点麻烦。这个时候，就需要利用Hexo事件来运行自动脚本了。直接上代码：
<pre><code>// filename: backup.js
require('shelljs/global');
try {
	hexo.on('generateAfter', function() {//当generate完成后执行备份
		run();
	});
} catch (e) {
	console.log("产生了一个错误<(￣3￣)> !，错误详情为：" + e.toString());
}
function run() {
	echo("==================Source Auto Backup Begin========================");
	cd('/home/dhmemi/Documents/blog_dhmemi');    //此处修改为Hexo根目录路径
	exec('if [ ! -d "public" ]; then\nmkdir public\nfi');
	
	if (exec('cp -avx source public/').code !== 0) {
		echo('Error: copy source failed');
		exit(1);
	} else {
		echo("==============Source Auto Backup Complete=========================")
	}
}
</pre></code>
这个脚本所完成的功能很简单，就是在Hexo生成（generate）完成后，将source文件夹复制到public目录下，这样，在发布（deploy）时，源文件目录就会自动被复制到.git_deploy目录下并被当作生成目录发布到github上。保存上面的脚本到scripts目录下即可。
当然在运行这个脚本之前，你一定注意到了第一行的”shelljs/global”，所以你要安装shelljs模块：
<pre><code>sudo npm install --save shelljs
</pre></code>