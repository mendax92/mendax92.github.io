---
title: Android颜色定义、设置、转换详解
tags:
  - 工具
  - Android
translate_title: android-color-definition-settings-conversion-details
date: 2019-08-28 09:16:15
---
## 前言 
Android中的颜色值通常遵循RGB/ARGB标准，使用时通常以“ # ”字符开头的8位16进制表示。</br>"A"代表透明度（Alpha）</br>"R"代表红色(Red)</br>"G"代表绿色(Green)</br>"B"代表蓝色(Blue)</br>取值范围为0 ~ 255（即16进制的0x00 ~ 0xff）。
A 从0x00到0xff表示从透明到不透明，RGB 从0x00到0xff表示颜色从浅到深。当RGB全取最小值(0或0x000000)时颜色为黑色，全取最大值(255或0xffffff)时颜色为白色
<!--more-->
## 透明度对应表
|  透明百分比   | 十六进制  | 透明度  |
|  :----:  | :----:  | :----:  |
| 100% | FF| 255|
| 95%  | F2 | 242 |
| 90%  | E6 | 230 |
| 85%  | D9 | 217 |
| 80%  | CC | 204 |
| 75%  | BF | 191 |
| 70%  | B3 | 166 |
| 65%  | A6 | 242 |
| 60%  | 99 | 153 |
| 55%  | 8C | 140 |
| 50%  | 80 | 128 |
| 45%  | 73 | 115 |
| 40%  | 66 | 102 |
| 35%  | 59 | 89 |
| 30%  | 4D | 77 |
| 25%  | 40 | 64 |
| 20%  | 33 | 51 |
| 15%  | 26 | 38 |
| 10%  | 1A | 26 |
| 5%  | 0D | 13 |
| 0%  | 00 | 0 |

>以颜色值#FF99CC00为例，其中FF是透明度，99是红色值，CC是绿色值，00是蓝色值</br>
>全透明：#00000000/(0,0,0,0)</br>
>半透明：#80000000/(128,0,0,0)</br>
>不透明：#FF000000/(255,0,0,0)
## 颜色的定义
- Android系统封装好的Color类中的常量
	<pre><code>public static final int BLACK = 0xFF000000;
public static final int DKGRAY = 0xFF444444;
public static final int GRAY = 0xFF888888;
public static final int LTGRAY = 0xFFCCCCCC;
public static final int WHITE = 0xFFFFFFFF;
public static final int RED = 0xFFFF0000;
public static final int GREEN = 0xFF00FF00;
public static final int BLUE = 0xFF0000FF;
public static final int YELLOW = 0xFFFFFF00;
public static final int CYAN = 0xFF00FFFF;
public static final int MAGENTA = 0xFFFF00FF;
public static final int TRANSPARENT = 0;</pre></code>
- 使用0x开头的颜色值
	`int color = 0xff00ff00;`
- 使用Color类的静态方法argb创建颜色
	`int color = Color.argb(127, 255, 0, 255);`
- 把16进制颜色值转换为int类型数值
	`int color = Color.parseColor("#00CCFF");`
- 使用xml资源文件来表示颜色 (.../res/values/colors.xml)
	<pre><code>&lt;?xml version="1.0" encoding="utf-8"?&gt;
	&lt;resources> 
	&lt;color name="colorPrimary">#3F51B5&lt;/color&gt;
	&lt;color name="colorPrimaryDark">#303F9F&lt;/color&gt;
	&lt;color name="colorAccent">#FF4081&lt;/color&gt;
	&lt;/resources&gt;</pre></code>
## 颜色的设置
- java代码
	<pre><code>textView.setTextColor(Color.RED);
	textView.setTextColor(0xffff0000);
	textView.setTextColor(Color.argb(127, 255, 0, 255));
	textView.setTextColor(Color.parseColor("#00CCFF"))
	textView.setTextColor(getResources().getColor(R.color.colorPrimary));//已过时
	textView.setTextColor(ContextCompat.getColor(this, R.color.colorPrimary));//替换方法</pre></code>
- xml布局
	<pre><code> android:textColor="@color/text_color_white"</pre></code>
## 颜色的转换
- 透明度百分比和十六进制对应关系计算方法：
	<pre><code>public void toARGB() {
        System.out.println("透明度 | 十六进制");
        System.out.println("---- | ----");
        for (double i = 1; i >= 0; i -= 0.01) {
            i = Math.round(i * 100) / 100.0d;
            int alpha = (int) Math.round(i * 255);
            String hex = Integer.toHexString(alpha).toUpperCase();
            if (hex.length() == 1) hex = "0" + hex;
            int percent = (int) (i * 100);
            System.out.println(String.format("%d%% | %s", percent, hex));
        }
    }</pre></code>
- 16进制转GRB颜色值方法：
	<pre><code> public static void toRGB(String hex) {
        int color = Integer.parseInt(hex.replace("#", ""), 16);
        int red = (color & 0xff0000) >> 16;
        int green = (color & 0x00ff00) >> 8;
        int blue = (color & 0x0000ff);     
        System.out.println("red="+red+"--green="+green+"--blue="+blue);  
	}</pre></code>
- GRB转16进制颜色值方法：
	<pre><code>public static void toHex(int red, int green, int blue){
        String hr = Integer.toHexString(red);
        String hg = Integer.toHexString(green);
        String hb = Integer.toHexString(blue);
        System.out.println("#"+hr + hg + hb);      
	}</pre></code>

## 工具网站
[在线拾色器](https://www.w3cschool.cn/tools/index?name=cpicker)</br>
[在线RGB颜色值与十六进制颜色码转换工具](https://www.sioe.cn/yingyong/yanse-rgb-16/)</br>
[在线图片取色器](http://www.jiniannet.com/page/allcolor)</br>