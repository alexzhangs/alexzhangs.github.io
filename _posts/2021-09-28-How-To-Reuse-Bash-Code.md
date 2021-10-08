---
title: 如何重用你的 BASH 代码
layout: post
summary: XSH 快速指南，管理并分发 BASH 代码，一次编写，随处调用
author: Alex Zhang
categories: software
banner: /assets/images/posts/Gnu-bash-logo.svg
tags: xsh Bash Shell Library
---



如何重用已有代码，和如何写出可重用的代码，是两个完全不同的主题，本文讲述前者，后者是一个很大的话题，这里并不展开讨论。

## 背景

开始之前，先介绍一下历史背景，为了准确表述，采用了很多原始英文词汇，并附加了 WIKI 传送门，虽然读起来会有一些奇怪，但可以避免翻译可能带来的误解或是信息传递不畅。

[BASH](https://zh.wikipedia.org/wiki/Bash) 是 UNIX Shell 的一种，由 [Richard Stallman](https://zh.wikipedia.org/wiki/理查德·斯托曼) 创建的 [自由软件基金会 FSF](https://zh.wikipedia.org/wiki/自由软件基金会) 发布，遵守 [GPL](https://zh.wikipedia.org/wiki/GNU通用公共许可证) 开源协议。其最初是为 GNU [HURD KERNEL](https://zh.wikipedia.org/zh-hans/GNU_Hurd) 所编写，但 [LINUX KERNEL](https://zh.wikipedia.org/wiki/Linux内核) 更早发布出来，并采用了很多 [GNU Project](https://zh.wikipedia.org/zh-hans/GNU計劃) 的开源 Components，比如 BASH 和 GCC。因此，BASH 是现今几乎所有 [LINUX OS](https://zh.wikipedia.org/wiki/Linux) Distribution 的默认 Shell，一些其它 UNIX Like OS（包括商用 OS）也会预装 BASH，有的还将其作为默认 Shell。如果对于各种 Shell 之间的区别感兴趣，请移步[这里](https://en.wikipedia.org/wiki/Comparison_of_command_shells)。



## 重用之难

将 Shell 命令组合起来，完成某些特定的功能，就形成了 [Shell 脚本](https://en.wikipedia.org/wiki/Shell_script)，通常将其保存在文件中，准备在特定的环境进行调用。

有时，一段 Shell 脚本完成的功能具有通用性，不仅可以在它们的 `编写环境` 被用到，还可以在 `其它环境` 被需要。但经常的，`编写环境` 和 `其它环境` 不在同一个用户空间，甚至不在同一个主机，甚至这种需求跨越了时间，你在编写时根本无法预知。这种时空差异，使得在需要重用已有 Shell 脚本的时候，不能方便的获取它们，再获取的成本甚至高于重写一遍的成本。

另外，由于对 Shell 脚本需求的非计划性，通常导致难以划分合适的功能边界和定义良好的接口，同时缺乏有效代码组织管理。而前述的代码重用障碍进一步加剧了此问题，这产生了一个负循环，大量各式各样的 Shell 代码分布在各处，写法各异，功能交并，难以管理。

笔者有近15年的 Shell 编程历史，深知重用 Shell 代码从来不是一件简单的事情。即使是组织良好的可重用代码，在重用时，由于空间的差异，也避免不了产生一份新的代码拷贝，很显然不具备一次修改，多处生效的能力。



## The Solution - XSH

为了解决上述问题，我们需要一个标准化的 Package/Library Manager，就像 Linux 世界的 yum，apt，portage，或者 Python 世界的 pip。在我产生的这个想法的数年间，多次在网上搜索相关的解决方案，但没有一个满足我的预期，多数是按某个特定方式组织已实现好的代码库（Library）本身，而不是一个管理器，这非常令我意外。最后我决定自己编写一个 Shell 世界的 Library Manager，将其命名为 [XSH](https://github.com/alexzhangs/xsh) ，2021年5月27日发布 [0.4.7](https://github.com/alexzhangs/xsh/releases/tag/0.4.6)，目前仅支持 BASH。

![xsh doc snapshot](/assets/images/posts/xsh-doc-snapshot-1.png)

图1: xsh doc snapshot

下面将描述如何利用 XSH 管理 BASH 代码，实现重用。



## Quick Start Guide of XSH

### 1. 软件环境要求

XSH 支持 LINUX 和 UNIX Like OS + BASH Shell，在以下环境测试通过：

* Linux Ubuntu Bionic 18.04 - bash 4.4.20

* macOS 10.15.7 - bash 3.2.57


在安装之前，请确保你运行的是 BASH Shell，而不是 KSH、ZSH，或是其它。同时确保你的本地已安装 [GIT](https://zh.wikipedia.org/wiki/Git) 命令行工具。



### 2. XSH Bootstrap/Installation

单行命令安装（需要 curl）：

```bash
$ curl -s https://raw.githubusercontent.com/alexzhangs/xsh/master/boot | bash && . ~/.xshrc
```

以下安装方法和上面的方法结果等同（选择之一即可）：

```bash
$ git clone https://github.com/alexzhangs/xsh
$ bash xsh/install.sh
$ . ~/.xshrc
```

注意：XSH 安装在用户空间，而非系统空间。

查看已安装的 XSH 版本：

```bash
$ xsh version
0.4.7
```



### 3. Convert Existing Code to an XSH Library

为了创建你自己的 [XSH Library](https://github.com/alexzhangs/xsh#5-development)，你需要一个可以访问的 GIT 服务，并具有创建 Repository的权限。无论是公共的 Github 服务，还是私有的 Gitlab 服务，亦或是其它 GIT 兼容服务均可以，但此服务的可用范围，决定了你将要创建的 Library 的可用范围。本示范中使用 Github 服务。



#### 3.1. 创建 Library 代码库

首先创建用于容纳示范 Library 的代码库，命名为 `johndoe/xsh-lib-sample`，`johndoe` 是 Github 用户名，根据需要进行修改。

将代码库 Clone 到本地开发环境后，在根目录中创建如下文件：

xsh.lib

```ini
name=smpl
```

`xsh.lib` 是 XSH 的配置文件，`name=<lib_name>` 用于命名 Library。



#### 3.2. 原始代码

以下面两段代码为例，示范如何将其转化为 XSH Library。

##### 代码一

function.sh

```bash
string_lower () {
    echo "$@" | tr [A-Z] [a-z]
}

string_upper () {
    echo "$@" | tr [a-z] [A-Z]
}
```

##### 代码二

tcp-stat.sh

```bash
#!/bin/bash

usage () {
    printf "Make a statistics of TCP connections number among states.\n"
    printf "Should work on both Linux and macOS.\n"
    printf "\n"
    printf "Usage:\n"
    printf "\t$0 [-h]\n"
    printf "\n"
    printf "Option:\n"
    printf "\t-h: This help\n"
    printf "\n"
}

while getopts h opt; do
    case $opt in
        h)
            usage
            exit
            ;;
        *)
            usage
            exit 255
            ;;
    esac
done

if netstat -p tcp >/dev/null 2>&1; then  # macOS
    output=$(netstat -anp tcp)
else  # Linux
    output=$(netstat -tan)
fi

echo "$output" \
    | awk '/^tcp/ {++state[$NF]} END {for(key in state) printf "%s %s\n", state[key], key}' \
    | sort -rnk1

exit
```



#### 3.3. 转换后的代码

先直接给转换后的结果，然后再解释规则。

##### 代码一

functions/string/lower.sh

```bash
#? Usage:
#?   @lower STRING ...
#?
#? Output:
#?   Lowercase presentation of STRING.
#?
#? Example:
#?   @lower Foo
#?   # foo
#?
function lower () {
    echo "$@" | tr [A-Z] [a-z]
}
```

functions/string/upper.sh

```bash
#? Usage:
#?   @upper STRING ...
#?
#? Output:
#?   Uppercase presentation of STRING.
#?
#? Example:
#?   @upper Foo
#?   # FOO
#?
function upper () {
    echo "$@" | tr [a-z] [A-Z]
}
```

##### 代码二

scripts/tcp/stat.sh

```bash
#!/bin/bash

#? Description:
#?   Make a statistics of TCP connections number among states.
#?   Should work on both Linux and macOS.
#?
#? Usage:
#?   @stat [-h]
#?
#? Options:
#?   -h: This help
#?

while getopts h opt; do
    case $opt in
        h)
            usage
            exit
            ;;
        *)
            usage
            exit 255
            ;;
    esac
done

if netstat -p tcp >/dev/null 2>&1; then  # macOS
    output=$(netstat -anp tcp)
else  # Linux
    output=$(netstat -tan)
fi

echo "$output" \
    | awk '/^tcp/ {++state[$NF]} END {for(key in state) printf "%s %s\n", state[key], key}' \
    | sort -rnk1

exit
```



#### 3.4. 文件对比

Side by Side 对比一下改写前后的文件。

对于以函数方式调用的 Library，XSH 要求每个函数独立为一个文件，保持函数名和文件名相同，并且函数头的定义要严格遵循这个格式：`function <name> ()`，好消息是你再也不必为遵循哪种写法而纠结了。

XSH 从注释代码中提取并生成帮助信息，你需要严格遵循示范中注释的格式才能获得这个功能，好消息是你再也不用在代码中写那些难看的 `printf` 或者添加使用 `heredoc` 的 `usage` 函数了。

![Diff view of functions/string/lower.sh](/assets/images/posts/xsh-file-diff-1.png)

图2：Diff view of functions/string/lower.sh

对于以脚本方式调用的 Library，规则少了很多，只需要注意注释格式即可。

![Diff view of scripts/tcp/stat.sh](/assets/images/posts/xsh-file-diff-2.png)

图3：Diff view of scripts/tcp/stat.sh

你可能注意到了，改写后，文件名中的一些命名语义被转换成了目录结构，事实上，除了 `functions` 和 `scripts` 这两个目录必要保留以外，其它并不是必须的，但可以为你后续的代码组织留出空间。



#### 3.5. 文件列表

将改写完成的文件放入前面创建的代码库，整个文件列表如下：

```
xsh-lib-sample/
├── functions
│   └── string
│       └── lower.sh
│       └── upper.sh
├── scripts
│   └── tcp
│       └── stat.sh
└── xsh.lib
```

你并不需要为每一个 `.sh` 文件添加执行权限，这个操作将由 XSH 帮你完成，事实上，为了安全起见，推荐的 `.sh` 文件 chmod 是 `644`。

现在你已经可以把这些变更提交并推送到代码库了，本示范中，你已将代码提交到了 `master` 分支。



### 4. 发布你的 XSH Library

为了让 XSH 知道你的 Library 已经 ready，你需要为版本库添加至少一个 tag，并推送到 remote：

```shell
$ git tag -a -m 'v1.0.0' 1.0.0
$ git push origin 1.0.0
```

恭喜，你的第一个 XSH Library 已经发布成功了！

现在你可以在任何可以访问到 Github 的 XSH 环境，调用它们。

安装你的 Library：

```bash
$ xsh load johndoe/xsh-lib-sample
```

查看已安装的 Library：

```bash
$ xsh list
smpl (1.0.0) => johndoe/xsh-lib-sample
```

查看 Library 内有哪些 Utility：

```bash
$ xsh list smpl
[scripts] smpl/tcp/stat
[functions] smpl/string/lower
[functions] smpl/string/upper
```

查看 Utility 的帮助信息：

```bash
$ xsh help smpl/tcp/stat
```

调用 Utility：

```bash
$ xsh smpl/string/lower
$ xsh smpl/string/upper
$ xsh smpl/tcp/stat
```



## What's Next ?

为简洁起见，本快速指南只呈现了主题所必需的内容，如果你感兴趣，可以到 [XSH 项目主页](https://github.com/alexzhangs/xsh) 获取更多信息。

