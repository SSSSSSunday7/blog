---
title: jedis 连接池
sidebar: 'auto' date: 2023-11-19
tags:
- redis
categories: 
 - redis
---
# jedis 连接池

> jedis是线程不安全的，频繁的创建和销毁都会有性能损耗，因此推荐使用连接池代替连接jedis

```java
public class JedisConnectionFactory {
    private  static final JedisPool jedisPool;
    static {
        JedisPoolConfig jedisPoolConfig=new JedisPoolConfig();
        //最大连接
        jedisPoolConfig.setMaxTotal(8);
        //最大空闲连接
        jedisPoolConfig.setMaxIdle(8);
        //最小空闲连接
        jedisPoolConfig.setMinIdle(0);
        //释放时间,可以把ofSeconds换成ofDays之类的
        jedisPoolConfig.setMaxWait(Duration.ofSeconds(200));
        jedisPool = new JedisPool(jedisPoolConfig,"192.168.101.66",6379,1000,"Lhh4850");
    }
    //获取jedis
    public static Jedis getJedis(){
        return jedisPool.getResource();
    }
}
```





