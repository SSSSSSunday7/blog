---
title: Maven进阶
sidebar: 'auto' date: 2023-11-19
tags:
- java 
- maven 
categories: 
 - maven
---
# Maven进阶

## 1、分模块开发

![image-20231023190127531](/image-20231023190127531.png)

> 新建一个模块，把pojo放到这个模块里去，在另一个要调用的模块里导入坐标

例如`mvn_01`的pom文件中有这样的信息

```xml
    <groupId>org.example</groupId>
    <artifactId>mvn_01</artifactId>
    <version>1.0-SNAPSHOT</version>
```

那么其他要使用的模块只要在pom文件中加入

```xml
<dependency>
    <groupId>org.example</groupId>
    <artifactId>mvn_01</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```

### 问题

这样会导致一个问题，当我在编译主模块的时候发现找不到`mvn_01`

这是因为`mvn_01`还没有安装到中央仓库，但是idea帮我们找到了这个依赖，需要让`mvn_01`执行install，然后就可以在中央仓库找到这个包了

## 2、依赖传递

> 非常简单，就是如果`mvn_01`里引用了`mvn_02`这个依赖，那么导入`mvn_01`的时候会自动导入`mvn_02`

#### 	依赖冲突

路径优先：当依赖中出现相同的资源，**层级越深，优先级越低，层级越浅，优先级越高**。

声明优先：当资源在相同层级被依赖时，**配置顺序越靠前的覆盖配置越靠后的**

特殊优先：当同级配置了**相同资源的不同版本**，后配置的覆盖先配置的

### 可选依赖和排除依赖

#### 	可选依赖 

加上`<optional>true</optional>`

隐藏当前工程所依赖的资源，也就是说不进行依赖传递了

#### 	排除依赖

语法：写在导入的模块的`<dependency></dependency>`

```xml
<exclusions>
    <exclusion>
        <groupId></groupId>
        <artifactId></artifactId>
    </exclusion>
</exclusions>
```



当拿到的模块不能去修改可选依赖，又不需要该模块，就像 想把`springboot`自带的`logback`换成l`og4j2`一样，就可以把`logback`排除

## 3、聚合

> 多个模块都依赖一个模块运行，当这个模块更改时，有可能导致依赖他的模块出错，这个时候我们希望这些模块同时构建，能及时发现问题

+ 聚合: 将多个模块组织成一个整体，同时进行项目构建的过程称为聚合
+ 聚合工程: 通常是一个**不具有业务功能的“空”工程** (**有且仅有一个`pom`文件**)
+ 作用:使用**聚合工程可以将多个工程编组**，通过**对聚合工程进行构建**，实现**对所包含的模块进行同步构建**
  + 当工程中**某个模块发生更新(变更)**时，必须保障工程中与已更新模块关联的**模块同步更新**，此时可以使用聚合工程来解决批量模块同步构建的问题

### 配置

新建一个工程，里面的`pom`文件的`<packaging>jar</packaging>`,改为`<packaging>pom</packaging>`



设置管理的模块名称

模块和`pom`文件同级

```xml
<modules>
        <module>neuedu-admin</module>
        <module>neuedu-framework</module>
        <module>neuedu-system</module>
        <module>neuedu-quartz</module>
        <module>neuedu-generator</module>
        <module>neuedu-common</module>
</modules>
<packaging>pom</packaging>

```

模块在`pom`文件父级

```xml
    <modules>
        <module>../mvn_01</module>
        <module>../mvn_03</module>
    </modules>
```

构建顺序和写`moudule`标签的顺序没关系，按依赖关系构建

## 4、继承

> 概念:继承描述的是两个工程间的关系，与java中的继承相似，子工程可以继承父工程中的配置信息，常见于依赖关系的继承
>
> + 作用:
>
>   + 简化配置
>
>   + 减少版本冲突

### 配置

写在子模块的`pom`文件里

这样是继承所有

```xml
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.17</version>
        <relativePath/> <!-- lookup parent from repository -->
        
    </parent>
```

假设有三个模块，有两个要用mybatis，一个不用，去两个里配置又太麻烦了

所有就有了在父模块中定义的`<dependencyManagement></dependencyManagement>`

```xml
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.mybatis.spring.boot</groupId>
                <artifactId>mybatis-spring-boot-starter</artifactId>
                <version>2.3.1</version>
            </dependency>
        </dependencies>
    </dependencyManagement>
```

在父模块中定义好版本

在子模块里直接引用就好了

## 5、属性

> 能定义一个变量，存储版本信息

![image-20231024164426365](/image-20231024164426365.png)

定义:

```xml
<properties> 
    <spring.version>5.2.10RELEASE</spring.version>
</properties>
```

引用：

```xml
<version>${spring.version}</version>
```

### 配置文件里加载pom属性

直接设置resources文件夹里的properties、yaml文件的属性值

例如上文定义的`<spring.version>5.2.10RELEASE</spring.version>`就可以在Properties文件中调用

只要配置这样一个标签

```xml
    <build>
        <resources>
            <resource>
                <directory>mvn_01/src/main/resources</directory>//模块名下指定resources文件夹
                <filtering>true</filtering>//开启识别${}
            </resource>
        </resources>
    </build>
```

## 6、版本管理

> 主要进行版本号命名的解释

+ 工程版本:
  + SNAPSHOT (快照版本)
    + 项目**开发过程**中临时输出的版本，称为快照版本
    + 快照版本会随着开发的进展不断更新
  + RELEASE(发布版本)
    + 项目开发到进入阶段里程碑后，向团队外部发布较为稳定的版本，这种版本所对应的构件文件是稳定的，即便进行功能的后续开发，也不会改变当前发布版本内容，这种版本称为发布版本
+ 发布版本
  + alpha版
  + beta版
  + 纯数字版

## 7、多环境开发

> maven提供多种环境的设定，可以帮助开发者使用过程中快速切换环境

### 配置

![image-20231024170122070](/image-20231024170122070.png)

设置默认

![image-20231024170220927](/image-20231024170220927.png)

指定环境(命令):

![image-20231024170303285](/image-20231024170303285.png)