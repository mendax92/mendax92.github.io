---
title: android解决8.0通知栏不显示问题
translate_title: android-solves-80-notification-bar-does-not-display-the-problem
date: 2019-08-16 12:02:28
tags:
  - Android
---
## 前言 
开会时领导说更新按钮点击没有反应，后面根据log日志“NotificationService: No Channel found for pkg=xxx.xxx.xxx”查到原因是因为 按钮点击之后本应在通知栏下载的通知没有显示，android 8.0加入了通知渠道，感觉加入通知渠道这个东西之后体验确实好些，打比方APP 中有多种推送通知，-打折通知，-APP更新通知，-IM聊天通知.我可以在设置中对APP 进行通知管理，打比方只允许IM聊天的通知。</br>下面是通知渠道加入的教程
<!--more-->
## 通知渠道创建流程
>[notification的创建流程](https://developer.android.google.cn/training/notify-user/build-notification#java)</br>
>[NotificationChannel的官方讲解](https://developer.android.google.cn/reference/android/app/NotificationChannel.html)
### 通知渠道NotificationChannel的三个参数
- channelId：通知渠道的ID 可以是任意的字符串，全局唯一就可以
- channelName：通知渠道的名称，这个是用户可见的，开发者需要认真规划的命名
- importance：通知渠道的重要等级，有一下几个等级，不过这个用户都是可以手动修改的</br>
	![通知渠道的重要等级](android-solves-80-notification-bar-does-not-display-the-problem/2019-08-16.png)
### 通知渠道创建(如果通知类型比较少的话，可以省略渠道组的创建和设置组ID的流程)
<pre><code>private final String GROUP_ID = "my_group_01";
private final int NOTIFICATION_ID = 1;
private final String CHANNEL_NAME = "APP更新";
private final String CHANNEL_DESC = "APP更新通知";
private final String CHANNEL_ID = "2";
//通知渠道组的创建
notificationManager.createNotificationChannelGroup(new NotificationChannelGroup(GROUP_ID, "GROUP_NAME"));
        NotificationChannel channel = new NotificationChannel(CHANNEL_ID, CHANNEL_NAME, NotificationManager.IMPORTANCE_HIGH);
		//设置组ID
        channel.setGroup(GROUP_ID);
        channel.setShowBadge(true);
        channel.setLightColor(Color.RED);
        channel.enableLights(true);
        notificationManager.createNotificationChannel(channel);

        NotificationChannel channel2 = new NotificationChannel(CHANNEL_ID_2, CHANNEL_NAME, NotificationManager.IMPORTANCE_HIGH);
		//设置组ID
        channel2.setGroup(GROUP_ID);
        channel2.setShowBadge(true);
        channel2.setLightColor(Color.RED);
        channel2.enableLights(true);
notificationManager.createNotificationChannel(channel2);
</pre></code>
## 管理通知渠道
### 删除渠道
<pre><code>notificationManager.deleteNotificationChannel(CHANNEL_ID);
</pre></code>
### 删除渠道组
<pre><code>notificationManager.deleteNotificationChannelGroup(GROUP_ID);
</pre></code>
### 补充
>加入通知渠道之后发现依然通知无法显示，而且一直都是“NotificationService: No Channel found for pkg=xxx.xxx.xxx</br>
>stackoverflow,谷歌，百度找了个遍，有说以下三个是必须要设置的（然而我试了并没什么软用）</br>
>builder.setContentTitle() // required</br>
>.setSmallIcon() // required</br>
>.setContentText() // required</br>
>后我发现网上的教程都是"builder.setChannelId(CHANNEL_ID)"而我这边没有setChannelId()方法只有“setChannel()”,</br>发觉有可能是V7包的问题将appcompat-v7包从“26.0.0-alpha1” 换成“26.0.1”就可以了..
## 完整代码
<pre><code>public class AppUpdateService extends Service {
    /****
     * 发送广播的请求码
     */
    private final int REQUEST_CODE_BROADCAST = 0X0001;
    public static String packageName = "com.sunnyberry.xst.service.AppUpdateService";
    /****
     * 发送广播的action
     */
    private final String BROADCAST_ACTION_CLICK = "servicetask";
    /**
     * 通知
     */
    private Notification notification;
    /**
     * 通知的Id
     */
    private final int NOTIFICATION_ID = 1;
    private final String CHANNEL_NAME = "APP更新";
    private final String CHANNEL_DESC = "APP更新通知";
    private final String CHANNEL_ID = "2";
    /**
     * 通知管理器
     */
    private NotificationManager notificationManager;
    /**
     * 通知栏的远程View
     */
    private RemoteViews mRemoteViews;
    /**
     * 下载请求.
     */
    private DownloadRequest mDownloadRequest;

    /**
     * 通知栏操作的四种状态
     */
    public enum Status {
        DOWNLOADING, PAUSE, FAIL, SUCCESS
    }

    /**
     * 当前在状态 默认正在下载中
     */
    public static Status status = Status.DOWNLOADING;
    private MyBroadcastReceiver myBroadcastReceiver;
    protected static boolean isDownLoading = false;
    private String savePath;
    String url;

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    public static void start(Context context, String url) {
        if (status == Status.SUCCESS || status == Status.FAIL) {
            stopService(context);
        }
        if (!Utils.isServiceRunning(context, packageName)) {
            Intent intent = new Intent(context, AppUpdateService.class);
            intent.putExtra("url", url);
            context.startService(intent);
        }
    }

    public static void stopService(Context activity) {
        Intent service = new Intent(activity, AppUpdateService.class);
        activity.stopService(service);
    }

    @Override
    public int onStartCommand(@Nullable Intent intent, int flags, int startId) {
        savePath = ConstData.CACHE_OTHER_PATH + getApplicationInfo().packageName + ".apk";
        registerBroadCast();
        url = intent.getStringExtra("url");
        download();
        return super.onStartCommand(intent, flags, startId);
    }

    /**
     * 注册按钮点击广播*
     */
    private void registerBroadCast() {
        myBroadcastReceiver = new MyBroadcastReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction(BROADCAST_ACTION_CLICK);
        registerReceiver(myBroadcastReceiver, filter);
    }
    /**
     * 更新通知界面的按钮的广播
     */
    private class MyBroadcastReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            if (!intent.getAction().equals(BROADCAST_ACTION_CLICK)) {
                return;
            }
            switch (status) {
                case DOWNLOADING:
                    /**当在下载中点击暂停按钮**/
                    pauseDownLoad();
                    mRemoteViews.setTextViewText(R.id.bt, "下载");
                    mRemoteViews.setTextViewText(R.id.tv_message, "暂停中...");
                    status = Status.PAUSE;
                    notificationManager.notify(NOTIFICATION_ID, notification);
                    break;
                case SUCCESS:
                    /**当下载完成点击完成按钮时关闭通知栏**/
                    notificationManager.cancel(NOTIFICATION_ID);
                    callInstallApk();
                    break;
                case FAIL:
                case PAUSE:
                    /**当在暂停时点击下载按钮**/
                    download();
                    mRemoteViews.setTextViewText(R.id.bt, "暂停");
                    mRemoteViews.setTextViewText(R.id.tv_message, "下载中...");
                    status = Status.DOWNLOADING;
                    notificationManager.notify(NOTIFICATION_ID, notification);
                    break;
            }
        }
    }

    /**
     * 暂停下载
     */
    protected void pauseDownLoad() {
        if (mDownloadRequest != null && mDownloadRequest.isStarted() && !mDownloadRequest.isFinished()) {
            mDownloadRequest.cancel();
            mDownloadRequest = null;
            isDownLoading = false;
        }
    }

    /**
     * 下载文件
     */
    protected void download() {
        if (TextUtils.isEmpty(url) || !url.startsWith("http")) {
            return;
        }
        showNotificationProgress(AppUpdateService.this);
        if (!isDownLoading) {
            isDownLoading = true;
            mDownloadRequest = DownloadHelper.download(url, ConstData.CACHE_OTHER_PATH, getApplicationInfo().packageName + ".apk", new DownloadHelper.Listener() {
                @Override
                public void onDownloadError(Exception exception) {
                    isDownLoading = false;
                    deleteApk();
                    downloadFail();
                }

                @Override
                public void onProgress(int progress, long fileCount) {
                    status = Status.DOWNLOADING;
                    updateNotification(progress);
                }

                @Override
                public void onFinish(String filePath) {
                    isDownLoading = false;
                    downloadSuccess();
                    callInstallApk();
                }

                @Override
                public void onCancel() {
                    status = Status.FAIL;
                    isDownLoading = false;
                }
            });
        }
    }

    private void deleteApk() {
        File file = new File(savePath);
        if (file.exists())
            file.delete();
    }

    public void callInstallApk() {
        startActivity(getInstallIntent());
    }

    public Intent getInstallIntent() {
        isDownLoading = false;
        try {
            String permission = "777";
            String command = "chmod " + permission + " " + savePath;
            Runtime runtime = Runtime.getRuntime();
            runtime.exec(command);
        } catch (IOException e) {
            e.printStackTrace();
        }

        Intent intent = new Intent();
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.setAction(android.content.Intent.ACTION_VIEW);
        intent.setDataAndType(Uri.fromFile(new File(savePath)), "application/vnd.android.package-archive");
        return intent;
    }

    /**
     * 显示一个下载带进度条的通知
     *
     * @param context 上下文
     */
    public void showNotificationProgress(Context context) {
        /**获取通知管理器**/
        notificationManager = (NotificationManager) context.getSystemService(context.NOTIFICATION_SERVICE);
        /**进度条通知构建**/
        NotificationCompat.Builder builderProgress = new NotificationCompat.Builder(context);
        //构建渠道
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            //创建通知渠道
            NotificationChannel mChannel = new NotificationChannel(CHANNEL_ID, CHANNEL_NAME,  NotificationManager.IMPORTANCE_DEFAULT);
            mChannel.setDescription(CHANNEL_DESC);//渠道描述
            mChannel.enableLights(true);//是否显示通知指示灯
            mChannel.enableVibration(false);//是否振动
            mChannel.setLightColor(Color.GREEN);//小红点颜色
            notificationManager.createNotificationChannel(mChannel);//创建通知渠道
            //添加渠道
	    builderProgress.setChannelId(CHANNEL_ID);
        }
        /**设置为一个正在进行的通知**/
        builderProgress.setOngoing(true);
        /**设置小图标**/
        builderProgress.setSmallIcon(R.drawable.logo);
        /**新建通知自定义布局**/
        mRemoteViews= getRemoteViews(context);
        /**设置自定义布局**/
        builderProgress.setContent(mRemoteViews);
        /**设置滚动提示**/
        builderProgress.setTicker("开始下载...");
        notification = builderProgress.build();
        /**设置不可手动清除**/
        notification.flags = Notification.FLAG_NO_CLEAR;
        /**发送一个通知**/
        notificationManager.notify(NOTIFICATION_ID, notification);
    }

    private RemoteViews getRemoteViews(Context context) {
        RemoteViews mRemoteViews = new RemoteViews(context.getPackageName(), R.layout.updata_notification);
        mRemoteViews.setTextViewText(R.id.tv_name, UIUtils.getString(R.string.app_name));
        /**进度条ProgressBar**/
        mRemoteViews.setProgressBar(R.id.pb, 100, 0, false);
        /**提示信息的TextView**/
        mRemoteViews.setTextViewText(R.id.tv_message, "下载中...");
        /**操作按钮的Button**/
        mRemoteViews.setTextViewText(R.id.bt, "暂停");
        /**设置左侧小图标*/
        mRemoteViews.setImageViewResource(R.id.iv, R.drawable.logo);
        /**设置通过广播形式的PendingIntent**/
        Intent intent = new Intent(BROADCAST_ACTION_CLICK);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(context, REQUEST_CODE_BROADCAST, intent, 0);
        mRemoteViews.setOnClickPendingIntent(R.id.bt, pendingIntent);
        return mRemoteViews;
    }

    /**
     * 下载更改进度
     *
     * @param current 当前已下载大小
     */
    private void updateNotification(int current) {
        mRemoteViews.setTextViewText(R.id.tv_progress, current + "%");
        mRemoteViews.setProgressBar(R.id.pb, 100, current, false);
        notificationManager.notify(NOTIFICATION_ID, notification);
    }

    /**
     * 下载失败
     */
    private void downloadFail() {
        status = Status.FAIL;
        mRemoteViews.setTextViewText(R.id.bt, "重试");
        mRemoteViews.setTextViewText(R.id.tv_message, "下载失败");
        notificationManager.notify(NOTIFICATION_ID, notification);
        EventBus.getDefault().post(new AppUpdateEvent(AppUpdateEvent.Type.ERROR));
        //stopSelf();
    }

    /**
     * 下载成功
     */
    private void downloadSuccess() {
        status = Status.SUCCESS;
        mRemoteViews.setTextViewText(R.id.bt, "完成");
        mRemoteViews.setTextViewText(R.id.tv_message, "下载完成");
        notificationManager.notify(NOTIFICATION_ID, notification);
        EventBus.getDefault().post(new AppUpdateEvent(AppUpdateEvent.Type.SUCCESS));
    }

    /**
     * 销毁时取消下载，并取消注册广播，防止内存溢出
     */
    @Override
    public void onDestroy() {
        if (myBroadcastReceiver != null) {
            unregisterReceiver(myBroadcastReceiver);
        }
        super.onDestroy();
    }}
</pre></code>
