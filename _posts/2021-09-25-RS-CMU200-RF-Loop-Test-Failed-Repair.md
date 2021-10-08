---
title: R&S CMU200 RF Loop Test 外环自检失败故障修复
layout: post
summary: R&S CMU200 RF Frontend 模块的 RF 3 末端放大器失效，导致 1->4/3->2 RF Loop Test 自检失败，本文描述了故障调查以及修复的过程
author: Alex Zhang
categories: electronics
banner: /assets/images/posts/RS-CMU200.png
tags: CMU200 RF Frontend SBW-5089 MMIC Amplifier BW5
---

ROHDE & SCHWARZ CMU200 是一台 2.7 GHz 的通用无线电综测仪，本文内容假定读者对 CMU200 已经具备基本了解，如果可以看到本文描述的自检错误，那么应该已了解如何操作运行这些自检程序，因此本文对这些基础内容就不再额外描述。

故障现象： `1->4/3->2 RF Loop Test` 自检中，`1->4 Tx-Path 1 Loop Test` 测试通过，但 `3->2 Tx-Path 1 Loop Test` 测试失败，所有频点无法读取测试信号幅度。

![CMU200 3->2 Tx-Path 1 Loop Test failed](/assets/images/posts/RS-CMU200-RF-Loop-Test-3-2-failed.png)
图1：CMU 200 3->2 Tx-Path 1 Loop Test failed

## 1. Investigation

自检结果说明 `RF 3 输出` 和 `RF 2 输入` 二者至少一项存在问题。首先利用已知正常的 `RF 1` 验证 `RF 2` 和 `RF 3`，确认 `RF 2` 工作正常，而 `RF 3` 在全频段输出信号幅度均偏低约 20 dB。

![CMU200 Block Diagram](/assets/images/posts/RS-CMU200-Block-Diagram.png)
图2：CMU200 Block Diagram

在 CMU200 Service Manual 中找到功能框图，可知 RF 1 ~ RF 4 端口位于 RF Frontend 模块，作为主要的 RF 信号接口，负责信号的 INPUT/OUTPUT 处理，根据信号路径，怀疑为 RF Frontend 模块内部故障。

我手上有多台 CMU200，通过代换部件确认为 RF Frontend 模块故障。下一小节描述如何更换 RF Frontend 模块，如果不感兴趣可以直接跳到小节 `1.2. 检查 RF Frontend 模块`。

### 1.1. 如何更换 RF Frontend 模块

![CMU200 RF Frontend](/assets/images/posts/RS-CMU200-RF-Frontend.png)
图3：Replacing CMU200 RF Frontend

更换 RF Frontend 模块，比较简单直接，拆除外壳后，再拆除 RF Frontend 模块的所有连接电缆和3颗螺丝，即可取下，具体请参考 CMU200 Service Manual 提供的步骤：

![Replacing CMU200 RF Frontend](/assets/images/posts/RS-CMU200-RF-Frontend-Replacement.png)
图4：Replacing CMU200 RF Frontend

提示：拆解仪器时，请佩戴手套，一方面防止被仪器的锋利边缘割伤，另一方面可以防止在仪器内留下指纹，尤其是光滑的铝合金板，或者表面有镀银层的部件，留下的指纹在若干年后会变为醒目的印记，并无法恢复。本人推荐一次性医用丁腈手套，防酸碱耐油污，防滑性好，舒适贴手，用后即弃，十分方便。


### 1.2. 检查 RF Frontend 模块

将 RF Frontend 模块底部盖板拆下，内部如图：

![CMU200 RF Frontend 内部](/assets/images/posts/RS-CMU200-RF-Frontend-Opened-1.png)
图5：CMU200 RF Frontend 内部

![CMU200 RF Frontend 内部](/assets/images/posts/RS-CMU200-RF-Frontend-Opened-2.png)
图6：CMU200 RF Frontend 内部


从内部状态判断该模块没有过维修历史，模块内元件集成度很高，但功能分区和信号路径比较明显，可明确识别出 RF 3 信号路径。粗略观察整体并重点观察 RF 3 路径附近，均无外观异常元件。

从 RF 3 端口开始，沿信号路径向上检测元件，重点是那颗 MMIC Amplifier，丝印 `BW5`，这个是 RF 3 OUT 端口的末端放大器。

![CMU200 RF Frontend RF 3 Signal Path](/assets/images/posts/RS-CMU200-RF-Frontend-RF3-Signal-Path.png)
图7：CMU200 RF Frontend RF 3 Signal Path

`BW5` 的型号为 [SBW-5089 MMIC Amplifier](https://pdf1.alldatasheet.com/datasheet-pdf/view/256822/SIRENZA/SBW-5089Z.html)，下载 Datasheet，可知其典型增益约 20 dB，`PIN 1` 为输入，`PIN 3` 为输出。

![SBW-5089 MMIC Amplifier Datasheet](/assets/images/posts/SIRENZA-SBW-5089-datasheet.png)
图8：SBW-5089 MMIC Amplifier Datasheet

测量板上 `BW5` 的正向电阻，约为几 kΩ，正常值应为约 600 Ω，确认其已损坏。
附近其它阻容元件测试均正常。


## 2. 更换 BW5 SBW-5089 MMIC Amplifier

Taobao 购入 `SBW-5089 MMIC Amplifier`，该元件对静电敏感，容易被端口串入的静电击穿，购入多颗备用。
更换前使用万用表测试新元件，确认其正常。

### 2.1. 准备清单

![准备工具](/assets/images/posts/RS-CMU200-RF-Frontend-Repair-Tools.png)
图9：准备工具

虽然只更换一个小元件，但想要修新如新也是需要专业精神的。

* 焊台：150W JBC 245 兼容焊台
* 烙铁头
  * 刀头 JBC C245-765
  * 平头 JBC C245-907 2.2x1mm
* 低温焊锡 阿米特 KR-19RMA 熔点 190ºC
* 助焊剂 GOOT FLUX BS 10
* 吸锡带 GOOT 3.0mm
* 酒精
* 棉签
* 防静电毛刷
* 镊子
* 气吹

### 2.2. 解焊&焊接

RF Frontend 模块为提高散热效率，基板有大面积的金属散热层，即使焊接一个小元件，也要求`焊台`的回温性好。

BW5 为 4脚元件，这类解焊我习惯使用`低温焊锡`，用`刀头`使低温焊锡包裹元件一端3个焊脚，另一接地端也涂满低温焊锡，两侧轮流加热，可令焊锡同时保持熔化状态，然后用`镊子`将元件取下，焊盘完好无恙。

使用`助焊剂`和`吸锡带`清理焊盘。

焊新元件使用`平头`，先焊一个焊点，确保元件放平、放正后再焊其它焊脚，完成后用`酒精`和`毛刷`清洗焊点周围，然后用`棉签`清理干净。

![更换 BW5 SBW-5089 MMIC Amplifier 完成](/assets/images/posts/RS-CMU200-RF-Frontend-Repair-Done.png)
图10：更换 BW5 SBW-5089 MMIC Amplifier 完成

Nice and Clean！


## 3. 组装&测试

组装前，使用万用表测试新更换的元件，确认其正常，然后将 RF Frontend 模块组装好，安装回机箱。

全部组装完成后，开机，重新运行 `1->4/3->2 RF Loop Test` 自检，测试全部通过，修复成功。

![CMU200 3->2 Tx-Path 1 Loop Test passed](/assets/images/posts/RS-CMU200-RF-Loop-Test-3-2-passed.png)
图11：CMU 200 3->2 Tx-Path 1 Loop Test passed
