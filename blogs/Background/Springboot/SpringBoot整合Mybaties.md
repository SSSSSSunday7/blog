---
title: SpringBoot整合Junit
sidebar: 'auto' date: 2023-11-19
tags:
- java 
- SpringBoot 
- mybatis
categories: 
 - SpringBoot
---
# SpringBoot整合Mybaties

## 配置文件



```yaml
spring:
  datasource:
    url: jdbc:mysql:///springDemo01?useSSL=false&serverTimezone=GMT%2B8
    #yaml文件里不要手贱加分号;
    username: root
    password: ****
    driver-class-name: com.mysql.jdbc.Driver
#mysql版本大于5.7请使用com.mysql.cj.jdbc.Driver并在url中设置时区
```

> Mybatis会自动读自动探测存在的 DataSource
>
> + 将使用 SqlSessionFactoryBean 创建并注册一个 SqlSessionFactory 的实例，并将探测到的 DataSource 作为数据源
>
> + 将创建并注册一个从 SqlSessionFactory 中得到的 SqlSessionTemplate 的实例
>
> + 自动扫描你的 mapper，将它们与 SqlSessionTemplate 相关联，并将它们注册到Spring 的环境（context）中去，这样它们就可以被注入到你的 bean 中

## 实体类

```java
@Data
public class User {
    private String name;
    private String password;
   }
```

需要安装lombok依赖。

## 注解开发的mapper

```java
@Mapper
public interface UserMapper {
    @Select("select * from user")
    List<User> selectAll();
}

```

@Mapper是mybaties适配SpringBoot的注解，

只是用来实现注解开发的，以及加入spring的ioc，

还可以在Springboot主文件中加入@MapperScan(“指定mapper包”)给扫描包下的所有mapper都默认加入@Mapper

## xml配置文件开发的mapper

 需要在resources目录下创建mapper目录

在其中创建符合规范的xml文件

### mybatis约束头

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
```

每个mappe的xml都要有约束头。

### XML文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.springbootmybatiesdemo.mapper.UserXmlMapper">
    <select id="findAll" resultType="user">
        <!--id名和mapper接口里的方法名是对应的-->
          select * from user
    </select>
</mapper>
```

namespace是表明该xml对应的类



### XML开发在Springboot中的配置

```yaml
mybatis:
  #resources的路径可以写classpath:
  mapper-locations: classpath:mapper/*Mapper.xml #mapper的映射文件路径
  type-aliases-package: com.example.springbootmybatiesdemo.pojo 
  #别名配置，参数填实体类的包名，用于在resultType里简写（只写类名）
#config-location: 用于指定核心配置文件

```



## 注意事项

> 在测试类里用@AutoWired注入Mapper时可能会报错但是只要mapper类中有@Mapper注解，则该mapper已经进入Spring的IOC当中，可以正常编译。

