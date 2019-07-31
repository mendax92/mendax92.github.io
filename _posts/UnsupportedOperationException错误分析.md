---
title: UnsupportedOperationException错误分析
date: '2019/7/26 16:10:51'
categories: Android
tags:
  - 错误分析
  - Android
translate_title: unsupportedoperationexception-error-analysis
---
## 1. 错误分析 ##
>java.lang.UnsupportedOperationException 大致的意思是，你调用的关于的容器的操作是不被允许的。
<!--more-->
---------------------------------------
## 2. 个人理解 ##
1. 这不是说没有该方法，如果没有该方法的话，在编译期间就可以识别。 
2. 有该方法，也就是说该方法受到了限制。 
3. 限制就类似于权限限制之类的东西。（类似于linux 中对于文件权限的管理）。如果list不能实现这种权限的限制，那么会存在一些安全性的问题。所以可以看出来，权限在大部分场合都是一个必备的成分。 
4. 不同的粒度上，相关的语言提供了不同控制权限的方式。 
5. 本质上，下面的错误案例，都可以归结为权限问题。 
---------------------------------------
## 3. 举例 ##
### Collections.unmodifiableList（*）引起的错误 ###

<pre><code>Collections.unmodifiableList 起到了对list**设置权限的目的**。
   private static void testReadOnly(){
        //1.创建一个list。并且这个list的访问权限未进行设置。
        List<String> modifyList = new ArrayList<>(); 
        //2.向其中插入相关的数据。【可行】
        modifyList.add("you");
        modifyList.add("are");
        modifyList.add("boy");
        //3.对list进行设置。使之可读。
        modifyList = Collections.unmodifiableList(modifyList);
        //4.在次插入，出现错误。
        modifyList.add("hello");
    }
</pre></code>

#### 解决办法 ####
1. 该只读的权限维护的是，修改list中引用的权限。 
2. 但是如果你如果不改引用，是可以通过引用来更改其所指向的对象的。
<pre><code>
private static void testChangeReadOnly(){
        ////1.创建2个list。并且这2个list的访问权限未进行设置。
        List<StringBuilder> modifyList = new ArrayList<>(); 
        List<StringBuilder> normalList= new LinkedList<>();
        //2.向modifylist中插入元素。
        modifyList.add(new StringBuilder("you"));
        modifyList.add(new StringBuilder("are"));
        modifyList.add(new StringBuilder("boy"));
        //3.设置可读权限
        modifyList = Collections.unmodifiableList(modifyList);
        //4.将只读的modifyList中的引用复制到normalList中。
        normalList.addAll(modifyList);
        //5.向normalList中插入数据。
        normalList.add(new StringBuilder("hello"));
        System.out.println(normalList.toString());//[you, are, boy, hello]

        //6.更改只读list中，引用所指向的对象的值。
        System.out.println("更改之前 ----> " + modifyList.toString());//更改之前 ----> [you, are, boy]
        //更改
        modifyList.get(1).append("~~~~~");
        System.out.println("更改之后 ----> " + modifyList.toString());//更改之后 ----> [you, are~~~~~, boy]
    } 
</pre></code><pre><code>输出结果：
[you, are, boy, hello]
更改之前 ----> [you, are, boy]
更改之后 ----> [you, are~~~~~, boy]
</pre></code>
### 使用Arrays.asLisvt()后调用add，remove这些method时出现 ### 
> Arrays.asLisvt() 返回java.util.ArraysArrayList，而不是ArrayList。
> 
> ArraysArrayList和ArrayList都是继承AbstractList，remove，add等method在AbstractList中是默认throw   UnsupportedOperationException而且不作任何操作。
> 
> ArrayList override这些method来对list进行操作，但是Arrays$ArrayList没有override remove(int)，add(int)等，所以throw UnsupportedOperationException

#### 解决办法 ####
和上面异常的处理一样，将引用操作转移到其他地方。
<pre><code>List list = Arrays.asList(fixArray[]);
List newList = new ArrayList(list); 
</pre></code>
