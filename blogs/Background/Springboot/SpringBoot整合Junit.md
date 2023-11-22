---
title: SpringBoot整合Junit
sidebar: 'auto' date: 2023-11-19
tags:
- java 
- SpringBoot 
- Junit
categories: 
 - SpringBoot
---
# SpringBoot整合Junit

## 编写测试类

通常需要测试哪个类就写在测试包中创建一个**类名+Test**的测试类

> SpringBoot2.2以上的版本只需要在测试类上加一个注解@SpringBootTest就完成测试类的创建了

然后在对应的方法加上注解**@Test**，就可以单独测试该方法了

```java
@SpringBootTest
public class UserServiceTest {
    @Autowired
    private UserService userService;
    @Test
    public void addTest(){
        userService.add();
    }
}

```

