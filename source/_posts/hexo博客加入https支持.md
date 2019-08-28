---
title: hexo博客加入https支持
categories: 博客的搭建
tags:
  - blog
  - hexo
  - seo
translate_title: hexo-blog-to-join-https-support
date: 2019-08-01 10:40:26
---
## 前言 
浏览器左上角会显示一把锁，这个就叫做https,有人说Google早在2014年8月对外宣称它会影响网站的SEO排名，并在2018年2月发布了另外一个声明，如果网站没有开通https，2018年7月以后浏览器会强制显示该网站不安全。现在都2019年了~~~，其实https这一块Google也在弱化显示这一块，没办法现在建站门槛太低，很多人网站建好之后就不维护了，更别说https的加入了.我这次加入https 也是因为在加入评论功能的时候左上角显示个警告图标（没办法！强迫症晚期）.<br>以下是网站接入https教程
<!--more-->
## 流程
- 先通过[此链接](http://coolaf.com/tool/port)检查你的网站是否打开了443端口(github page可跳过)
- 申请ssl证书(在你域名解析商那申请，建议使用[cloudflare](https://www.cloudflare.com/))
	- [阿里云免费SSL证书](https://common-buy.aliyun.com/?spm=a2c4g.11186623.2.4.tiF9wE&commodityCode=cas#/buy)，保护类型选择1个域名，选择品牌选择Symantec，即可看到免费型DV SSL。
	- [腾讯云免费SSL证书](https://cloud.tencent.com/login?s_url=https%3A%2F%2Fconsole.cloud.tencent.com%2Fssl)
	- [七牛免费SSL证书](https://portal.qiniu.com/certificate/apply)
	- [cloudflare](https://www.cloudflare.com/)
- 上传ssl证书 并配置
### cloudflare
>不管你的网站是搭建在github page 还是vps ，以下方法都适用[cloudflare 官网](https://www.cloudflare.com/)

![在域名解析配置页面点击“Crypto”(此操作跳过配置解析流程，可以自行baidu)](hexo-blog-to-join-https-support/1.png)</br>
![找到“Always Use HTTPS”选项打开即可](hexo-blog-to-join-https-support/2.png)
### 手动配置流程
>阿里云、腾讯云和七牛，注册登录，根据提示填写信息，不久就可以拿到证书。
<pre><code>解压www.simcom.ltd.zip，可以得到下列文件：
www.simcom.ltd
│  www.simcom.ltd.csr
│
├─Apache
│      1_root_bundle.crt
│      2_www.simcom.ltd.crt
│      3_www.simcom.ltd.key
│
├─IIS
│      keystorePass.txt
│      www.simcom.ltd.pfx
│
├─Nginx
│      1_www.simcom.ltd_bundle.crt
│      2_www.simcom.ltd.key
│
└─Tomcat
        keystorePass.txt
        www.simcom.ltd.jks
</pre></code>
#### 上传证书
- 服务器上，创建目录ssl
mkdir /etc/nginx/ssl
- 将Nginx文件夹中的文件使用xftp上传到ssl目录(我这边是nginx环境)

#### 配置nginx
>/etc/nginx/conf.d中新建配置文件www.simcom.ltd.conf
<pre><code>server {
    listen 80;
    listen 443 ssl;
    server_name www.simcom.ltd;
    charset utf-8;
    #ssl配置
    ssl_certificate /etc/nginx/ssl/1_www.simcom.ltd_bundle.crt; 
    ssl_certificate_key  /etc/nginx/ssl/2_www.simcom.ltd.key; 
    ssl_session_timeout  5m;  
    ssl_protocols SSLv3 TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers  HIGH:!ADH:!EXPORT56:RC4+RSA:+MEDIUM;

    location / {
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
        client_max_body_size       1024m;
        client_body_buffer_size    128k;
        client_body_temp_path      /var/data/client_body_temp;
        proxy_connect_timeout      90;
        proxy_send_timeout         90;
        proxy_read_timeout         90;
        proxy_buffer_size          4k;
        proxy_buffers              4 32k;
        proxy_busy_buffers_size    64k;
        proxy_temp_file_write_size 64k;
        proxy_temp_path            /var/data/proxy_temp;
    }
}
</pre></code>
#### 重启nginx
<pre><code>systemctl restart nginx
</pre></code>
## 参考
[www.voidking.com](https://www.voidking.com/2018/04/07/deve-hexo-https/)