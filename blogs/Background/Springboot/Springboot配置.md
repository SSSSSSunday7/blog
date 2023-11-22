---
title: Springboot配置
sidebar: 'auto' date: 2023-11-19
tags:
- java 
- SpringBoot
categories: 
 - SpringBoot
---
# Springboot配置



## 1. 读取配置文件

1）@Value

2）Environment

3）@CnfigurationProperties

---



### @Value

在实体类的属性上加入@Value("${变量名}")可以读取到配置文件里的变量，适合注入单个变量

![image-20231010143640462](/image-20231010143640462.png)

### Environment

Environment是一个类，本身存在IOC当中，需要使用@AutoWired注入

![image-20231010143555789](/image-20231010143555789.png)



可以直接使用Environment实例对象的*getProperty("变量名")* 

![image-20231010144259694](/image-20231010144259694.png)

可以方便的获取多个变量，更加精炼

### @ConfigurationProperties

该注解直接加在类上

会自动将和配置文件同名的变量注入

**例如：**

​	配置文件中有名为name的变量为*zhangsan*，

​	那么添加了该配置的类中如果有名为name的属性，那么

​	则会自动将 *zhangsan* 注入该类的name属性。



  *如果你想要将对象中的变量注入，则需要在注解上加prefix属性*

**例如：** 当你想要将person对象中的name值注入类中的name属性则![image-20231010145350791](/image-20231010145350791.png)

这样会自动读取person类下的所有属性，遇到能对应的属性就注入

**注意：**![image-20231010145617672](/image-20231010145617672.png)

加入该注解后有可能会弹出这个警告框，点击open会进入文档，推荐在pom文件里加入一个SpringBoot配置处理器加入以后就不弹警告了，并且在配置文件写变量时会多一个提示.*（导入坐标后记得刷新）*

![image-20231010150041766](/image-20231010150041766.png)

## 2. SpringBoot动态切换配置文件

### profile

1）profile配置方式

​		多profile方式

​		yml多文档方式

2）profile激活方式 

​		配置文件

​		虚拟机参数

​		命令行参数

#### 多profile方式

![image-20231010150921577](/image-20231010150921577.png)

像这样在默认配置文件名后加上`-xxx`就能表示是不同环境的配置文件



> 在默认配置文件*application.properties*或*yml,yaml*中写入`spring.profiles.active=dev`表示使用dev配置文件

#### yaml多文档方式

**如下：**

可以在同一文档中写入不同的配置，更加简洁，使用  `---`分割



```yaml
server:
  port: 8080
#表示选中的环境
spring:
  profiles:
    active: test
---
#开发环境
server:
  port: 8081
spring:
  config:
    activate:
      on-profile: dev #环境命名
---
#测试环境
server:
  port: 8082
spring:
  config:
    activate:
      on-profile: test
```

#### 虚拟机参数切换

先到IDEA的![image-20231010163828998](/image-20231010163828998.png)

编辑处

然后![image-20231010163856484](/image-20231010163856484.png)

添加虚拟机选项，并在参数里添加`-Dspring.profiles.active=test`

即可通过test配置文件来运行项目，*=*  后方的参数可替换为dev等

#### 命令行实参

如图，在参数里写入 `--spring.profiles.active=test`和虚拟机参数效果一样

![image-20231010164523482](/image-20231010164523482.png)

> 在命令行里启动的方式一样，如图名为SpringBootDemo01-0.0.1-SNAPSHOT.jar的jar使用 test 配置文件启动
>
> ![image-20231010165107305](/image-20231010165107305.png)

## 3. SpringBoot配置加载顺序

### 内部加载顺序

如图![image-20231010170041846](/image-20231010170041846.png)

>maven项目的resource文件夹对应的是classpath的根目录，也就是第四个



>**注意，项目的根目录和模块的根目录不要弄混了**

### 资源访问路径

也就是整个项目所有资源的访问路径，默认是`/` ，可以在配置文件中修改成例如`/demo`，这样整个SpringBoot项目的资源都会在`/demo` 下

### 外部加载顺序

详情参考 ([Spring Boot 中文文档 参考手册 中文版 (springcloud.cc)](https://www.springcloud.cc/spring-boot.html#boot-features-external-config))



## 4.其他

### 4.1 Springboot的strater

+ 一般构造器能选的依赖基本都是starter
+ strat由依赖和配置类构成

+ Springboot的strater都是自带配置类的，所以才能在application.properties里快速管理

### 4.2 @SpringbootApplication

> 该注解由三个注解构成
>
> @SpringbootConfiguration
>
> @EnableAutoConfiguration
>
> @ComponentScan

+ @SpringbootConfiguration只继承了@Configuration，两者基本一致，所以你可以在Springboot主程序里直接用@Bean，故启动类也可以当配置类用
+ @EnableAutoConfiguration启动SpringBoot内置的自动配置功能
+ @ComponentScan用于扫描启动类包下的所有Bean，一般都是同级的
