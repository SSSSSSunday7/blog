---
title: SpringBoot启动类详解
sidebar: 'auto' date: 2023-11-19
tags:
- java 
- SpringBoot
categories: 
 - SpringBoot
---
# SpringBoot启动类详解

## 1. @SpringbootApplication

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