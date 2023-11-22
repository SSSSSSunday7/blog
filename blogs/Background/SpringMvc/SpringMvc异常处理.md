---
title: SpringMvc异常处理
sidebar: 'auto' date: 2023-11-19
tags:
- java 
- SpringMvc
categories: 
 - SpringMvc
---
# SpringMvc异常处理

## 1、异常的位置和诱因

+ 出现异常现象的常见位置与常见诱因如下
  + **框架内部**抛出的异常: **因使用不合规导致**
  + **数据层**抛出的异常: 因**外部服务器故障**导致 (例如: 服务器访问超时)
  + **业务层**抛出的异常: 因**业务逻辑书写错误**导致(例如: 遍历业务书写操作，导致索引异常等)
  + **表现层**抛出的异常: 因**数据收集、校验等规则导致**(例如: 不匹配的数据类型间导致异常)
  + **工具类**抛出的异常:因**工具类书写不严谨不够健壮**导致 (例如: 必要释放的连接长期未释放等)

## 2、异常处理类的编写思路

> 核心：AOP思想，SpringMvc中自带异常处理器

```java
@RestControllerAdvice //这里是Restful风格,如果是一般的异常处理器写@ControllerAdvice
public class ProjectExceptionAdvice {
    @ExceptionHandler(Exception.class)//标识异常处理方法
    public void doException(Exception ex){
        System.out.println("有异常!");
    }//可以把void换成自己封装的Result类型,返回时和mvc一样会解析成json
}
```

## 3、常见异常分类及处理方案

### 3.1 业务异常(BusinessException)

+ 例如常见的需要传数字类型的年龄，但是给你传了字符串。
+ 例如访问了不存在的路径

#### 3.1.1处理方案

+ 发送对应消息给用户，提示规范操作

### 3.2 系统异常(SystemException)

> 可预计不可避免

+ 数据库服务器宕机
+ 停电断电等物理原因
+ 系统出现故障

#### 3.2.1处理方案

+ 发送固定消息给用户，安抚用户
+ 发送特定消息给运维，提醒维护
+ 记录日志

### 3.3 其他异常(Exception)

+ 程序员未预见的异常

#### 3.3.1处理方案

+ 发送固定消息给用户，安抚用户
+ 发送特定**消息给特定程序员**，提醒维护(加入预期)
+ 记录日志

## 4、封装异常类

> 封装运行时异常的异常类

```java
@EqualsAndHashCode(callSuper = true)
@Data
public class SystemException extends RuntimeException{
    private Integer code;

    public SystemException(Integer code) {
        this.code = code;
    }

    public SystemException(String message, Integer code) {
        super(message);
        this.code = code;
    }

    public SystemException(String message, Throwable cause, Integer code) {
        super(message, cause);
        this.code = code;
    }

    public SystemException(Throwable cause, Integer code) {
        super(cause);
        this.code = code;
    }
    
}
```

> 重点是继承了RuntimeException，并且实现了父类构造方法



### 4.1封装错误代码常量类

```java
public class Code {
    public final static Integer SYSTEM_ERR=50001;
    public final static Integer SYSTEM_TIMEOUT_ERR=50002;
    public final static Integer SYSTEM_UNKNOWN_ERR=59999;
    public final static Integer BUSINESS_ERR=60001;
}
```

### 4.2 配置异常处理器

```java
@RestControllerAdvice //这里是Restful风格,如果是一般的异常处理器写@ControllerAdvice
public class ProjectExceptionAdvice {
    @ExceptionHandler(SystemException.class)
    public Result doSystemException(SystemException e){//刚配置的系统异常处理器
        return new Result(false,e.getCode(), e.getMessage());
    }
    @ExceptionHandler(Exception.class)//标识异常处理方法
    public Result doException(){
        return new Result(false, Code.SYSTEM_UNKNOWN_ERR,"有未知错误");
    }
}
```

### 4.3 测试异常

```java
  @PutMapping("/{id}")
    public Result updateAllById(@RequestBody ClubDTO club, @PathVariable Integer id){
        try {
            int i=1/0;
        }catch (Exception e){
            throw new SystemException("服务器访问超时", e, Code.SYSTEM_TIMEOUT_ERR);
        }
        club.setId(String.valueOf(id));
        return clubServiceImpl.updateAllById(club);
    }
```

> **注意：如果接口方法有两个参数，但是有一个没写，那么会导致根本不会执行Controller层的方法**
