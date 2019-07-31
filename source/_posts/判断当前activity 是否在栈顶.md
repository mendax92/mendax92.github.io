---
title: 判断当前activity 是否在栈顶
date: '2019/7/26 15:34:37'
categories: Android
tags:
  - 工具
translate_title: determine-if-the-current-activity-is-at-top-of-stack
---
## 判断当前activity 是否在栈顶的两种方法 ##
<!--more-->
1.	通过代码
<pre><code>private static final String ACTIVITY_NAME_PARENTMEETING = "com.sunnyberry.xst.activity.parentmeeting.ParentMeetingActivity";
Utils.activityIsBackground(mContext, ACTIVITY_NAME_PARENTMEETING);
/**
 * 判断activity是否是在栈顶
 */
public static boolean activityIsBackground(Context context, String clazzName) {
    ActivityManager manager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
    RunningTaskInfo info = manager.getRunningTasks(1).get(0);
    String shortClassName = info.topActivity.getShortClassName();    //类名
    String className = info.topActivity.getClassName();              //完整类名
    String packageName = info.topActivity.getPackageName();          //包名
    if (TextUtils.isEmpty(clazzName)) {
        return false;
    }
    return (clazzName.equals(className));
}
</code></pre>
2.	通过adb命令行获取当前的activity
adb shell dumpsys activity | findstr "mFocusedActivity"