---
title: hexo链接SEO优化
tags:
  - blog
  - hexo
  - seo
translate_title: hexo-link-seo-optimization
date: 2019-07-31 17:33:01
---
## 前言
hexo 生成文章的默认链接是“https://blog.simcom.ltd/2019/01/14/“Markdown file name””,如果文章标题是英文的还好，如果是中文的，看着就各种别扭，而且这样也不利于seo优化。以下内容是讲如何做链接的seo优化.
<!--more-->
## 优化方法 ##
- 添加urlname属性(手动)
- hexo插件法([hexo插件官网](https://hexo.io/plugins/index.html))
	- hexo-translate-title: Translate the chinese title of Hexo blog to english words automatially
	- hexo-permalink-pinyin: A Hexo plugin which convert Chinese title to transliterate permalink.
	- hexo-abbrlink: Auto create one and only link for every post for hexo
	- hexo-number-title: The hexo blog post url is displayed as a number.

### 添加urlname属性 ###
在md文件的Front-matter区域新增urlname属性，可以是文章的英文Title也可以是其它自定义标识，所以每次编写Markdown你都得这么做，参考如下
<pre><code>---
title: hexo链接SEO优化
urlname: Hexo link SEO optimization
date: 2019-1-14 
categories: hexo
author: mendax
tags: hexo
cover_picture: http://xxx.xx/xxx.jpg
top: 1
---
</pre></code>

### 利用hexo插件 ###
大概看了下，这些插件其实主要还是两个方法的是实现地址的唯一性

- 生成唯一的值当作链接的地址
- 通过翻译的方式生成英文的地址

我这里选择的是hexo-translate-title
#### 安装 ####
<pre><code>npm install hexo-translate-title --save
</pre></code>
#### 配置 ####
修改hexo根项目下的_config.yml
<pre><code>translate_title:
  translate_way: google  # google,youdao,baidu_with_appid,baidu_no_appid
  is_need_proxy: false     # true | false
  # proxy_url: http://localhost:50018 # Your proxy_url
  # youdao_api_key: '' # Your youdao_api_key
  # youdao_keyfrom: xxxx-blog # Your youdao_keyfrom
  # baidu_appid: '' # Your baidu_appid
  # baidu_appkey: '' # Your baidu_appkey
</pre></code>
<pre><code>#修改原链接格式：permalink: :year/:month/:day/:title/
permalink: :year:month:day/:translate_title.html
</pre></code>
#### 发布 ####
<pre><code>hexo clean
hexo g
gulp  // 执行压缩，两条命令可以合并：hexo g && gulp
hexo d //执行部署命令
</pre></code>



