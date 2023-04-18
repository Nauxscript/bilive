# bilive

<p align="center"><img width=12.5% src="https://github.com/Nauxscript/bilive/blob/main/assets/bilive_pink.svg"></p>

<h3 align="center">Bilive</h3>

<h3 align="center">命令行 bilibili 弹幕姬。</h3>

## Install

pnpm:
```
pnpm i @nauxscript/bilive -g
```

yarn:
```
yarn add @nauxscript/bilive -g
```

npm:
```
npm i @nauxscript/bilive -g
```

注：安装前请确保已有 node 环境。

## Usage

### 开始监听房间号
```
bilive start 房间号
```

如 `bilive start 8726421`，即可开始监控我的直播间的弹幕。

### 查看版本号：
```
bilive -v
```

### 查看帮助：
```
bilive -help
```

## Development

本地开发运行，在项目目录下：

```
pnpm link --global
```

再运行