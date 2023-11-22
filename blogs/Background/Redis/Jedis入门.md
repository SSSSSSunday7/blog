---
title: Jedis入门
sidebar: 'auto' date: 2023-11-19
tags:
- redis
categories: 
 - redis
---
# Jedis入门

导入依赖：

```xml
        <dependency>
            <groupId>redis.clients</groupId>
            <artifactId>jedis</artifactId>
            <version>5.0.2</version>
        </dependency>
```

测试String：

```java
public class JedisTest {
    private Jedis jedis;
    @BeforeEach//测试类里，在每个测试方法前都调用这个方法
    void setUp(){
        jedis =new Jedis("192.168.101.66",6379);
        jedis.auth("Lhh4850");
        jedis.select(0);
        /*
        *  	默认选中0,reids默认有16个数据库,可以自由选择
        */
    }
    @Test
    void testString(){
        String result = jedis.set("age", "99");
        System.out.println("result="+result);//"ok"
        String age =jedis.get("age");
        System.out.println("age="+age);// 99
    }
    @AfterEach//每个测试方法后都调用
    void shutdown(){
        if(jedis!=null){
            jedis.close();
        }
    }
}
```

测试Hash:

```java
    @Test
    void testHash(){
        //一次设置一个键
        long resultLong = jedis.hset("scores", "清华", "690");
        System.out.println("resultLong="+resultLong);
        String hget = jedis.hget("scores", "清华");
        System.out.println("hget="+hget);
    }
    @Test
    void testHmset(){
        //一次设置多个键
        HashMap<String,String> map =new HashMap<>();
        map.put("清华","690");
        map.put("北大","680");
        String hmset = jedis.hmset("scores", map);
        System.out.println("hmset="+hmset);
        Map<String, String> scores = jedis.hgetAll("scores");//hgetAll={清华=690, 北大=680}
        System.out.println("hgetAll="+scores);
    }
```

