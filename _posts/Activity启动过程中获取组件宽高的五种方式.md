---
title: Activity启动过程中获取组件宽高的五种方式
categories: Android
tags:
  - 工具
  - Android
translate_title: five-ways-to-get-the-width-and-height-of-components-during-startup-process
date: 2019-07-30 11:57:39
---
## 问题：在Activity的启动流程中通过getWidht和getHeight方法获取组件的宽度和高度 ##
<pre><code>//在onCreate方法中调用，用于获取TextView的宽度和高度
private void getTextHeightAndWidth() {
	// 我们定义的用于获取宽度和高度的组件
	titleText = (TextView) findViewById(R.id.text_title);
	int height = titleText.getHeight();
	int width = titleText.getWidth();
	Log.i(TAG, "height:" + height + "  " + "width:" + width);
}
</pre></code>
### 打印结果 ###
<pre><code>I/MainActivity: height:0  width:0
</pre></code>
咦？为什么打印的height和width都是0呢？我们在执行一遍呢？结果还是一样的，两个变量都是0，难道这段代码不能再onCreate方法中调用，那么我们试试在onResume方法中调用呢？</br>
<!--more-->
只能说然并卵，打印的结果依然是：
<pre><code>I/MainActivity: height:0  width:0</pre></code>
好吧，问题已经出来了，看样子我们是不能再onCreate方法或者是onResume方法中调用该方法获取组件的宽高的，但是这是为什么呢？</br>平时我们都是通过这个方法来获取组件的宽高的，并且也没问题啊，比如我们将这个方法的调用逻辑写在按钮的点击事件之内呢？我们再来试试。
<pre><code>//这里的button1是我们定义的Button组件，并且我们重写了Button的点击事件，在其中调用了获取组件宽高的方法
button1 = (Button) findViewById(R.id.button1);
button1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getTextHeightAndWidth();
            }
});</pre></code>
这样敲完代码之后，我们执行这段代码，界面入下图所示：
![app展示图](https://raw.githubusercontent.com/mendax92/pic/master/blog/2019-07-30/2019-07-30115739.png)
### 打印结果 ###
<pre><code>I/MainActivity: height:57  width:225
</pre></code>
恩？这时候我们发现其打印出了组件的宽和高，那么为什么我们在Activity的onCreate、onResume方法中打印的时候，输出的组件宽高都是为0呢？
## 原因 ##
>Activity的启动流程和Activity的布局文件加载绘制流程，其实没有相关的关系的，其实两个异步的加载流程，
>这样我们在Activity的onCreate和onResume方法调用textView.getHeight或者是textView.getWidth方法的时候，
>其组件并没有执行完绘制流程，因此此时获取到的组件的宽高都是默认的0，也就是无法获取组件的宽和高。
>但是当我们将获取组件宽高的方法卸载按钮的点击事件的时候，由于此时按钮已经显示出来了，所以证明布局文件已经加载绘制完成，
>这时候点击组件执行组件的获取宽高方法，就能正常的获取到组件的宽和高了。
>这也就是为什么我们在onCreate和onResume方法中调用获取组件宽高都是0，而在按钮的点击事件中获取的时候正常的原因了
## 解决方案 ##
### 重写Activity的onWindowFocusChanged方法 ###
<pre><code>//重写Acitivty的onWindowFocusChanged方法
@Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        /**
         * 当hasFocus为true的时候，说明Activity的Window对象已经获取焦点，进而Activity界面已经加载绘制完成
         */
        if (hasFocus) {
            int widht = titleText.getWidth();
            int height = titleText.getHeight();
            Log.i(TAG, "onWindowFocusChanged width:" + widht + "   "
                            + "  height:" + height;
        }
    }
</pre></code>
#### 说明：####
这样重写onWindowFocusChanged方法，当获取焦点的时候我们就可以通过getWidth和getHeight方法得到组件的宽和高了。但是这时候这个方法的逻辑可能会执行多次，也就是说只要我们的Activity的window对象获取了焦点就会执行该语句，所以我们需要做一些逻辑判断，让它在我们需要打印获取组件宽高的时候在执行。 

### 为组件添加OnGlobalLayoutListener事件监听 ###
<pre><code>/**
 * 为Activity的布局文件添加OnGlobalLayoutListener事件监听，当回调到onGlobalLayout方法的时候我们通过getMeasureHeight和getMeasuredWidth方法可以获取到组件的宽和高
 */
private void initOnLayoutListener() {
        final ViewTreeObserver viewTreeObserver = this.getWindow().getDecorView().getViewTreeObserver();
        viewTreeObserver.addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                Log.i(TAG, "开始执行onGlobalLayout().........");
                int height = titleText.getMeasuredHeight();
                int width = titleText.getMeasuredWidth();

                Log.i(TAG, "height:" + height + "   width:" + width);
           // 移除GlobalLayoutListener监听     
                   MainActivity.this.getWindow().getDecorView().getViewTreeObserver().removeOnGlobalLayoutListener(this);
            }
        });
    }
</pre></code>
#### 说明  #### 
需要说明的是这里的onGlobalLayout方法会在Activity的组件执行完onLayout方法之后执行，这里的onLayout方法主要用于计算组件的宽高操作，具体可参考：Android源码解析（十八）–>Activity布局绘制流程，这样当我们计算完组件的宽高之后再执行获取组件的宽高操作，自然能够获取到组件的宽度和高度。

### 为组件添加OnPreDrawListener事件监听 ###
<pre><code>/**
     * 初始化viewTreeObserver事件监听,重写OnPreDrawListener获取组件高度
     */
private void initOnPreDrawListener() {
        final ViewTreeObserver viewTreeObserver = this.getWindow().getDecorView().getViewTreeObserver();
        viewTreeObserver.addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
            @Override
            public boolean onPreDraw() {
                Log.i(TAG, "开始执行onPreDraw().........");
                int height = titleText.getMeasuredHeight();
                int width = titleText.getMeasuredWidth();

                Log.i(TAG, "height:" + height + "   width:" + width);
                // 移除OnPreDrawListener事件监听
                MainActivity.this.getWindow().getDecorView().getViewTreeObserver().removeOnPreDrawListener(this);
                return true;
            }
        });
}
</pre></code>
####  说明  #### 
需要说明的是这里的onPreDraw方法会在Activity的组件执行onDraw方法之前执行，熟悉我们Activity组件加载绘制流程的同学应该知道，这里的onDraw方法主要用于执行真正的绘制组件操作，而这时候我们已经计算出来了组件的位置，宽高等操作，这样之后再执行获取组件的宽高操作，自然能够获取到组件的宽度和高度。

### 使用View.post方法获取组件的宽高 ###
<pre><code>/**
 * 使用View的post方法获取组件的宽度和高度
 */
private void initViewHandler() {
        titleText.post(new Runnable() {
            @Override
            public void run() {
                int width = titleText.getWidth();
                int height = titleText.getHeight();

                Log.i(TAG, "initViewHandler height:" + height + "  width:" + width);
            }
        });
}
</pre></code>
####  说明  #### 
这里的view的post方法底层使用的是Android的异步消息机制，消息的执行在MainActivity主进程Loop执行之后，所以这时候也可以获取组件的宽高

### 通过Handler对象使用异步消息获取组件的宽高 ### 
<pre><code>/**
 * 在onCreate方法中发送异步消息，在handleMessage中获取组件的宽高
 */
private Handler mHandler = new Handler() {

        @Override
        public void handleMessage(Message msg) {
            if (msg.what == 101) {
                int width = titleText.getWidth();
                int height = titleText.getHeight();

                Log.i(TAG, "initViewHandler height:" + height + "  width:" + width);
            }
        }
    };
</pre></code>
####  说明  ####  
和上面使用view.post方法类似，这里用的是异步消息获取组件的宽高，而这里的异步消息的执行过程是在主进程的主线程的Activity绘制流程之后，所以这时候可以获取组件的宽高