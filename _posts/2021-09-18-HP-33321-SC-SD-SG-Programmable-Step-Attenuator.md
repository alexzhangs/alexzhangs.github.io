---
title: HP 33321 SC/SD/SG 程控步进衰减器
layout: post
summary: 如何利用拆机模块 DIY 一个可调程控步进衰减器
author: Alex Zhang
categories: electronics
tags: HP 33321 衰减器 Attenuator
---

![HP 33321SC and HP 33321SD](/assets/images/posts/HP-33321-SC-and-SD-1.png)
图1： HP 33321SC and HP 33321SD

市面上可以购买到一些拆机的程控步进衰减器模块，品牌为HP，是Agilent的前
身。我手上的3个模块为33321系列，后缀分别为：SC/SD/SG，网上能找到的
[HP 33321系列官方文档](http://literature.cdn.keysight.com/litweb/pdf/5959-7857.pdf)
不包含这三个后缀型号，电气接口也不同，因此只能略作参考。在
[Abex UK](https://www.abex.co.uk/) 能找到这几个型号的性能测试数据，可以参考其频率特性。

综合以上整理出如下数据。


| 型号       | 衰减范围（dB） | 步进（dB） | 衰减开关值（dB） | 最大输入功率（W） | 控制电压（VDC） | 频率范围    |
| ---------- | -------------- | ---------- | ---------------- | ----------------- | --------------- | ----------- |
| HP 33321SC | 0 ~ 70         | 10         | 10/20/40         | 1                 | 15              | DC ~ 18 GHz |
| HP 33321SD | 0 ~ 75         | 5          | 5/30/40          | 1                 | 15              | DC ~ 18 GHz |
| HP 33321SG | 0 ~ 35         | 5          | 5/10/20          | 1                 | 15              | DC ~ 16 GHz |


33321SC 与 33321SD 组合起来可以得到 0 ~ 145 dB，步进为 5 dB 的衰减器。



## 工作原理

![HP 33321 原理图 - 单个衰减单元](/assets/images/posts/HP-33321-principle.png)
图 2：HP 33321 原理图 - 单个衰减单元

上图是衰减器的内部原理图，显示了其中的一个衰减单元。

其原理类似于继电器，但是触点没有弹性复位，线圈回路分为 A、D 两部分，A 回路用于
激活衰减，D 回路用于取消衰减，两个联动的开关 $K_A$ 和 $K_D$，分别位于 A 回路和 D 
回路。

举例：给 A 线圈施加工作电压，将会断开直连触点，并闭合衰减触点，衰减器生效，同时切换联动开关，令 $K_A$ 断开，即使继续维持外部工作电压，A 线圈也不再工作，同时令 $K_D$ 闭合，为 D 线圈工作提供可能。



## 引脚定义

![HP 33321SC and HP 33321SD](/assets/images/posts/HP-33321-SC-and-SD-2.png)
图 3：HP 33321SC and HP 33321SD

三个型号的引脚定义并没有参考文档，需要测试获得。

在PIN 1 提供 +15 V，然后通过控制其它各脚接地可以操作各个衰减开关。

将衰减器的两个SMA端口连接入测试设备（两个端口无差别），一端连接信号发生器，作为输入端，另一端连接功率表，作为输出端。

使信号发生器输出固定频率固定幅度的信号，例如 10MHz / -13dBm，然后在功率表上读取输出的信号幅度。

为各个线圈施加工作电压，并记录输出幅度的变化，即 `输入幅度 - 输出幅度`。

通过逐个测试，整理出各个引脚的功能，如下。

| Pin  | 颜色   | 颜色（德语） | 功能       | HP 33321SC | HP 33321SD | HP 33321SG |
| ---- | ------ | ------------ | ---------- | ---------- | ---------- | ---------- |
| 1    | Brown  | braun        | Power      | +15VDC     | +15VDC     | +15VDC     |
| 2    | Red    | rot          | Activate   | 10dB       | 5dB        | 10dB       |
| 3    | Orange | orange       | Deactivate | 10dB       | 5dB        | 10dB       |
| 4    | Yellow | -            | -          | -          | -          | -          |
| 5    | Green  | -            | -          | -          | -          | -          |
| 6    | Blue   | blau         | Activate   | 40dB       | 40dB       | 5dB        |
| 7    | Purple | violett      | Deactivate | 40dB       | 40dB       | 5dB        |
| 8    | Gray   | -            | -          | -          | -          | -          |
| 9    | White  | weiß         | Activate   | 20dB       | 30dB       | 20dB       |
| 10   | Black  | schwarz      | Deactivate | 20dB       | 30dB       | 20dB       |


实测 +12 V 电压即可操作成功，但是否可令衰减开关触点符合性能要求有待测试。



## DIY 控制电路

掌握了模块的规格后，就可以通过添加外围控制电路，DIY一个实用的可调步进衰减器。

以 33321SC 与 33321SD 为例，组合起来可以得到 0 ~ 145 dB，步进为 5 dB 的衰减器。

控制电路有两种选择：

1. 第一种只需要电源和开关，优点是简单，操控上也完全可以满足业余使用需求。
2. 第二种是采用官方指导电路，利用TTL电平控制衰减器和LED指示灯，如需要显示衰减数值，需要连接带单片机的数码管，并编写程序。



### 1. 简单控制电路

所需零件如下表：

| 项目            | 数量 | 备注 |
| --------------- | ---- | ---- |
| 15 VDC 电源模块 | 1    |      |
| 单刀双掷钮子开关（3脚） | 6    |      |


将6个开关中位接地，开关的其余12个引脚分别与2个衰减器的PIN 2 / 3 / 6 / 7 / 9 / 10 连接即可。

为每个开关标注衰减数值，根据开关的投掷方向判断衰减状态。



### 2. TTL 电平控制电路

![HP 33321 控制电路 - 单个衰减单元](/assets/images/posts/HP-33321-control-circuit.png)
图 4：HP 33321 控制电路 - 单个衰减单元

上图为官方指导控制电路图，仅描述了一个衰减单元，实际使用中按实际需要的衰减单元数量扩展。

所需主要零件如下表：

| 项目             | 数量 | 备注                       |
| ---------------- | ---- | -------------------------- |
| 15 VDC 电源模块  | 1    |                            |
| 5 VDC 电源模块   | 1    |                            |
| IC [DM75451N](https://pdf1.alldatasheet.com/datasheet-pdf/view/8468/NSC/DS75451N.html) | 6    | 开关驱动器                 |
| IC [DM7404N](https://pdf1.alldatasheet.com/datasheet-pdf/view/50891/FAIRCHILD/DM7406N.html) | 1    | TTL输入/输出，数码管驱动器 |
| IC [DM7406N]() | 1    | LED驱动器                  |
| LED 指示灯        | 6    |                   |
| 单片机驱动数码管 | 1    |                            |
| 电阻 0.62 kΩ  1/4W | 12 |  |
| 电阻 2.5 kΩ  1/4W | 12 |  |
| 电阻 0.13 Ω 1/4W | 6 |  |
| 二极管 [1N3064](https://datasheetspdf.com/pdf/1126123/FairchildSemiconductor/1N3064/1) | 24 |  |
| 按钮开关         | 6    |                            |


因指导电路模块的电压（24 V）与本示例模块的电压（15 V）不一致，指导电路中的 4.22 kΩ 电阻阻值需要改为 2.5 kΩ ，才能保证DM7404N / DM7406N 获得约 3 V 的高电平。


## 组装

所需零件如下表：

| 名称           | 数量 | 备注                                     |
| -------------- | ---- | ---------------------------------------- |
| 外壳           | 1 |                                          |
| 电源插座       | 1 | 可选择插座、开关、滤波器、保险座一体模块 |
| 前面板电源开关 | 1 |                                          |
| 洞洞板         | 1 |                                          |

两个拆机衰减器模块，外加一些廉价的零件，总体成本在数百元以内，但DIY出来的成品，无论在操作还是性能上，都可以媲美数千元的商业产品。



## 参考资料

* [Technical Data Sheet of Agilent Step Attenuators 33320 33321 33322 33323](http://literature.cdn.keysight.com/litweb/pdf/5959-7857.pdf)
* [Test Data of HP 33321SC](https://www.abex.co.uk/esales/microwave/hp/attenuator-step/33321sc/2831a03760_s02466/index.php)
* [Test Data of HP 33321SD](https://www.abex.co.uk/esales/microwave/hp/attenuator-step/33321sd/3248a00445/index.php)
* [Test Data of HP 33321SG](https://www.abex.co.uk/esales/microwave/hp/attenuator-step/33321sg/3228a00101/index.php)
