---
title: hexo博客的搭建
date: '2019/7/26 16:46:12'
categories: 博客的搭建
tags:
  - blog
  - hexo
translate_title: hexo-blog-building
---
## 准备工作(window7 64位) ##
- 下载node.js并安装（[node官网](https://nodejs.org/en/download/)下载安装），默认会安装npm
- 下载安装git（[git官网]( https://git-scm.com/)下载安装）
- 下载安装hexo([hexo官方文档](https://hexo.io/zh-cn/docs/index.html))
<!--more-->
### 安装Node ###
控制台打印出对应Node版本就说明安装成功了
<pre><code>node -v
</pre></code>
### 安装git ###
- 校验是否安装成功
<pre><code> git version
</pre></code>
### 安装hexo ###
- 下载
<pre><code>$ git clone https://github.com/iissnan/hexo-theme-next themes/next
</pre></code>

- 全局安装
<pre><code>npm install -g hexo    #-g 全局安装hexo
</pre></code>

- 校验是否安装成功
<pre><code>hexo -v
</pre></code>

- 生成hexo模板进入相对应的目录（我这边是D磁盘下）
	<pre><code>hexo init blog  #blog 我这边是直接在D盘下 创建个blog 文件夹
cd blog
npm install
hexo server #运行程序，访问本地localhost:4000可以看到博客已经搭建成功
	</pre></code>
## 将博客与Github关联 ## 
- 在Github上创建名字为XXX.github.io的项目，XXX为自己的github用户名(一个账号只能创建一个githubpage，且后缀必须“.github.io”)
- 打开本地的Blog文件夹项目内的_config.yml配置文件，将其中的type设置为git，其中repository 可为SSH地址(我这是SSH地址)
	<pre><code>deploy:
	type: git
	repository: git@github.com:mendax92/mendax92.github.io.git
	branch: master
	</pre></code>或者
	<pre><code>deploy:
	type: git
	repository: https://github.com/mendax92/mendax92.github.io.git
	branch: master
	</pre></code>
- 配置SSH key
	>为什么要配置这个呢？因为你提交代码肯定要拥有你的github权限才可以，但是直接使用用户名和密码太不安全了，所以我们使用ssh key来解决本地和服务器的连接问题)
	
	<pre><code>cd ~/. ssh  #检查本机已存在的ssh密钥 如果提示：No such file or directory 说明你是第一次使用git。```
	ssh-keygen -t rsa -C "邮件地址"  #找到.ssh\id_rsa.pub文件，打开并复制里面的内容，->github主页，->个人设置 -> SSH and GPG keys -> New SSH key
	ssh -T git@github.com  #测试是否成功
	git config --global user.name "liuxianan"// 你的github用户名，非昵称
	git config --global user.email  "xxx@qq.com"// 填写你的github注册邮箱
    </pre></code>
- 安装hexo-deployer-git插件包并发布
	<pre><code>npm install hexo-deployer-git –save
hexo g		#（本地生成静态文件）
hexo d		#（将本地静态文件推送至Github）
    </pre></code>
##  更新文章 ##
定位到我们的hexo根目录，执行命令
>[Hexo官网指令大全](https://hexo.io/zh-cn/docs/commands.html)
<pre><code>hexo new 'my-first-blog'	#hexo会帮我们在_posts下生成相关md文件|也可以手动在_posts创建文件
hexo clean	#清除缓存文件
hexo g		#生成静态页面至public目录
hexo s		#启动服务器
hexo d		#部署网站
</pre></code>
##  添加页面 ##
<pre><code>hexo new page "categories"		#添加分类页面
hexo new page “tags”		#添加标签页面
hexo new page "about		#添加关于页面
</pre></code> 
