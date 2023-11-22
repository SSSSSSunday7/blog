---
title: SpringBoot整合Redis
sidebar: 'auto' date: 2023-11-19
tags:
- java 
- SpringBoot 
- redis
categories: 
 - SpringBoot
---
# SpringBoot整合Redis

## 选择依赖

> 注意的点不多，直接附代码

在SpringBoot构造器选项里找到NoSql

然后选Spring Data Redis (Access+Driver)

![image-20231010192645670](/image-20231010192645670.png)

## 配置文件

```yaml
spring:
  redis:
    password: ****
    port: 6379
    host: localhost
```

## 测试类

```java
@SpringBootTest
class SpringbootRedisApplicationTests {
    @Autowired
    private RedisTemplate redisTemplate;
    @Test
    void setTest(){
        redisTemplate.boundValueOps("name").set("zhangsan");
    }
    @Test
    void getTest(){
        Object name = redisTemplate.boundValueOps("name").get();
        System.out.println(name);

    }

}
```

