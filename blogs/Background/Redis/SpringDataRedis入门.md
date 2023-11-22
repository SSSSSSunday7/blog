---
title: SpringDataRedis入门
sidebar: 'auto' date: 2023-11-19
tags:
- java 
- Spring 
- SpringBoot 
- redis
categories: 
 - redis
---
# SpringDataRedis入门

SpringDataRedis中提供了**RedisTemplate工具类**，其中封装了各种对Redis的操作。并且将不同数据类型的操作API封装到了不同的类型中:

|             API             |   返回值类型    |         说明          |
| :-------------------------: | :-------------: | :-------------------: |
| redisTemplate.opsForValue() | ValueOperations |  操作String类型数据   |
| redisTemplate.opsForHash()  | HashOperations  |   操作Hash类型数据    |
| redisTemplate.opsForList()  | ListOperations  |   操作List类型数据    |
|  redisTemplate.opsForSet()  |  SetOperations  |    操作Set类型数据    |
| redisTemplate.opsForZSet()  | ZSetOperations  | 操作SortedSet类型数据 |
|        redisTemplate        |                 |      通用的命令       |

各个`*Operations`类都封装了对应类型的操作

## 配置

在Springboot中提供依赖

```xml
        <!--    redis依赖    -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <!--    连接池依赖   -->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-pool2</artifactId>
        </dependency>
```

yaml配置:

```yaml
spring:
  redis:
    port: 6379
    password: Lhh4850
    host: 192.168.101.66
    lettuce:
      pool:
        max-active: 8 #最大连接
        max-idle: 8 #最大空闲连接
        max-wait: 100 #最小空闲连接
        min-idle: 0 #连接等待时间
```

测试类：

```java
@SpringBootTest
public class RedisTest {
    private final RedisTemplate redisTemplate;
    @Autowired
    public RedisTest(RedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }
    @Test
    void testString(){
        redisTemplate.opsForValue().set("name","李四");
        Object name = redisTemplate.opsForValue().get("name");
        System.out.println("name="+name);//name=李四
    }
}
```

## 序列化问题

> 上文中加入了键名为name的键值对，但是` redisTemplate.opsForValue().set()`默认传递的是对象，会使用序列化的方式，调用jdk的序列化工具，所以我们在redis数据库中看到的是序列化后的键名和值

+ 缺点
  + 可读性差
  + 内存占用大

### 解决

改变RedisTemplate的序列化方式

以下为所有的序列化类：

![image-20231025105413002](/image-20231025105413002.png)

默认使用`JdkSerializationRedisSerializer`

如果键和值都是字符串，建议使用`StringRedisSerializer`

如果键是字符串，值是对象，建议使用`GenericJackson2JsonRedisSerializer`，它会把对象转换为JSON存储

## Redis配置类

+ 创建RedisTemplate对象
+ 设置连接工厂
+ 创建JSON序列化工具
+ 设置Key的序列化
+ 设置Value的序列化
+ 返回

**配置类：**

```java
@Configuration
public class RedisConfig {
    @Bean
    public RedisTemplate<String,Object> redisTemplate(RedisConnectionFactory connectionFactory){
        // 创建RedisTemplate对象
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        // 设置连接工厂
        redisTemplate.setConnectionFactory(connectionFactory);
        // 创建JSON序列化工具
        GenericJackson2JsonRedisSerializer jsonRedisSerializer = new GenericJackson2JsonRedisSerializer();
        //设置Key的序列化
        redisTemplate.setKeySerializer(RedisSerializer.string());
        redisTemplate.setHashKeySerializer(RedisSerializer.string());
        // 设置Value的序列化
        redisTemplate.setValueSerializer(jsonRedisSerializer);
        redisTemplate.setHashValueSerializer(jsonRedisSerializer);
        // 返回
        return redisTemplate;
    }
}
```

**关于加上`GenericJackson2JsonRedisSerialize`的**

####  **报错解决**:

加jackson依赖，哪怕是springboot

```xml
		<dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-core</artifactId>
            <version>2.15.3</version>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.module</groupId>
            <artifactId>jackson-module-jaxb-annotations</artifactId>
            <version>2.15.3</version>
        </dependency>
```

**测试类：**

```java
@SpringBootTest
public class RedisTest {
    @Autowired
    private  RedisTemplate<String,Object> redisTemplate;


    @Test
    void testString(){
        redisTemplate.opsForValue().set("name","李四");
        Object name = redisTemplate.opsForValue().get("name");
        System.out.println("name="+name);
    }
    @Test
    void testObject(){
        redisTemplate.opsForValue().set("name:100",new User("张三",18));
        Object name = redisTemplate.opsForValue().get("name:100");
        System.out.println("name="+name);
    }
}
```

**数据库信息**（name:100）：

```json
{
    "@class": "com.example.springdataredis.pojo.User",
    "name": "张三",
    "age": 18
}
```

通过`@class`来定位实体类，但是内存开销大

#### 序列化生成@class造成的内存占用问题解决 

为了节省空间不会使用Json序列化器来处理value，而是统一使用String序列化器，要求只能存储String类型的key和value，当需要存储对象时，手动完成序列化和反序列化

Spring默认提供了一个**StringRedisTemplate**，它的key和value的序列化方式**默认就是String**，**省去了自定义RedisTemplate的过程：**

```java
@SpringBootTest
public class RedisStringTest {
    private final StringRedisTemplate stringRedisTemplate;
    private static final ObjectMapper mapper=new ObjectMapper();

    @Autowired
    public RedisStringTest(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Test
    void testString(){
        //字符串无需处理
        stringRedisTemplate.opsForValue().set("name","李四");
        Object name = stringRedisTemplate.opsForValue().get("name");
        System.out.println("name="+name);
    }
    @Test
    void testObject() throws JsonProcessingException {
        //手动序列化对象，通过Springboot自带的ObjectMapper
        String user = mapper.writeValueAsString(new User("张三", 18));
        //写入数据
        stringRedisTemplate.opsForValue().set("name:100",user);
        //获取数据
        String jsonUser = stringRedisTemplate.opsForValue().get("name:100");
        //反序列化，指定类型
        User ruser=mapper.readValue(jsonUser,User.class);
        System.out.println("user="+ruser);
    }
}

```

数据库数据：

```json
{
  "name": "张三",
  "age": 18
}
```

## 操作Hash类型

`hset()`变成了`put()`

`hmset()`变成了`putAll()`

`get()`还是一样

获取全部变成`entries()`

和java的hashmap方法名对应

测试类：

```java
@SpringBootTest
public class RedisHashTest {
    private final StringRedisTemplate stringRedisTemplate;
    private static final ObjectMapper mapper=new ObjectMapper();

    @Autowired
    public RedisHashTest(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

 @Test
    void testHash(){
        HashOperations<String, Object, Object> template =stringRedisTemplate.opsForHash();
        template.put("user:400","name","李四");
        template.put("user:400","age","19");
        Map<Object, Object> users = template.entries("user:400");
        System.out.println(users);
    }
}
```

