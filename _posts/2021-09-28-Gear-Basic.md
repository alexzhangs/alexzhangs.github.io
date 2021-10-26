---
title: 齿轮基础
layout: post
summary: 齿轮传动学习笔记，基础参数和计算公式，齿距、模数、齿顶圆直径、分度圆直径、齿比计算等
author: Alex Zhang
categories: rc-model
banner: /assets/images/banners/autocad.png
tags: 齿轮
---

## 齿轮基本术语

![齿轮基本术语](https://khkchina.com/images/basic-gear-terminology-calculation/Fig.-2.6-Working-Gear-Nomenclature.jpeg)

图 1：齿轮基本术语（来源：[https://khkchina.com](https://khkchina.com)）

一图胜千言，参照上图理解下面的术语和公式会轻松很多。

### 齿数 Z

齿数是个体齿轮的一个重要参数，而且可以比较直观的通过计数获得。

### 齿距 P

齿距是齿轮最重要的参数之一，两个齿轮如果齿距相同，就能良好的啮合，而与齿数无关。

齿距是衡量齿轮两个邻齿之间距离的参数，单位是 $ mm $，如果不知道的话可以通过对齿轮测量而粗略获得。

### 齿轮模数 M

齿轮模数与齿距类似，是齿距的另一种表达形式，它和齿距之间保持恒定的比例，这个比值就是 $ π $​。

模数 M 和齿距 P 之间的计算公式为：

* $ M = P / π $​​​​​

### 齿顶圆直径 Da

齿顶圆直径也是一个比较有用的参数，因为使用游标卡尺可相对较准确的测量获得，因此对于一个缺乏参数的齿轮，通过获得齿顶圆直径，可以利用公式计算出齿距或者模数。

已知齿顶圆直径 $Da$​ 和齿数 $Z$​，齿距 $P$​ 和模数 $M$​ 的计算公式分别为：

* $P = Da / (Z+2)$​

* $M = Da / (Z+2) / π$​

### 分度圆直径 D

两个齿轮如果啮合良好，则它们的分度圆必定相切，即两个齿轮的分度圆直径之和，等于两个齿轮轴的间距。

分度圆直径 $D$ 和 模数 $M$ 、齿数 $Z$ 之间有如下等式：

* $D = M * Z$​​

## 齿轮匹配应用

![求解缺席齿轮参数](/assets/images/posts/FS-1-5-Gas-On-Road-RC-Model-OP-Gear-Base-2.png)

图 2：求解缺席齿轮参数

出一个实际应用题，给出两个齿轮轴的间距，并给出其中一个齿轮的齿数和齿距，求解另一个缺席齿轮的参数。

解题：

* 两个齿轮互相匹配，所以它们的齿距和模数相等。
* 根据齿距，求出模数。
* 根据模数和给定齿轮的齿数，求出给定齿轮的分度圆直径。
* 根据轴间距和给定齿轮的分度圆直径，求出另一个齿轮的分度圆直径。
* 根据模数和另一个齿轮的分度圆直径，求出另一个齿轮的齿数。

## 齿比计算

`主动齿轮 a` 的齿数为 $Za$​​​​， `被动齿轮 b` 的齿数为 $Zb$​​​​， 两个齿轮之间齿比 $i$​​​​ 的计算公式为：

* $i = Zb / Za$​​​​​

#### 组合齿比计算

两个以上齿轮组合后的总齿比计算方法为，分别计算每组齿轮的齿比，然后将的所有齿比连续相乘即可。

例如：4个连续啮合的齿轮 a、b、c、d 的总齿比 $i$​​​ 的计算公式为：

* $i = (Zb / Za) * (Zc / Zb) * (Zd / Zc)$​​​​​​​

#### 同轴连接齿比

![同轴连接齿轮](/assets/images/posts/FS-1-5-Gas-On-Road-RC-Model-OP-Gear-Base.png)

图 3：同轴连接齿轮

两个齿轮之间如果是同轴连接，而非啮合连接，那么两个齿轮的角速度相同，不能再用齿数计算齿比，他们之间的齿比 $i$​​ 恒等于 `1`。

#### 差速器行星齿轮齿比

![差速器](/assets/images/posts/FS-1-5-RC-Model-Differential-2.png)

图 4：差速器

差速器行星齿轮由于其特殊的结构，它们之间的齿比不能使用标准的齿比公式计算。

![差速器行星齿轮](/assets/images/posts/FS-1-5-RC-Model-Differential-Opened.png)

图 5：差速器行星齿轮

对于上图的简单行星差速器来说，不考虑外部啮合关系，并且两侧半轴输出角速度相同的情况下，差速器自身的齿比为 `1`。

## 延展阅读

* [齿轮的基本用语和尺寸计算](https://khkchina.com/gearknowledge/abc-b/basic-gear-terminology-calculation.html)
* [齿轮知识](https://khkchina.com/gearknowledge/)
* [齿轮ABC入门篇(PDF)](https://khkchina.com/pdf/gearknowledge/gears-a.pdf)

