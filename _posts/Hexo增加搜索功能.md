---
title: Hexo增加搜索功能
categories: 博客的搭建
tags:
  - blog
  - hexo
translate_title: hexo-increases-search-function
date: 2019-07-31 09:46:34
---
## 安装插件 ##
在博客的根目录执行以下命令
<pre><code>npm install hexo-generator-searchdb --save
</pre></code>
<!--more-->
## 全局配置文件_config.yml ##
<pre><code>search:
  path: search.xml
  field: post
  format: html
  limit: 10000
</pre></code>
## hexo主题配置文件 ##
<pre><code># Local search
# Dependencies: https://github.com/flashlab/hexo-generator-search
local_search:
  enable: true
</pre></code>

