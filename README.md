# Shinsekai Plugin Market

Shinsekai 插件市场前台，用于浏览、提交和维护 Shinsekai 插件。

Based on `AstrBotDevs/Astrbot_Plugins_Market`, modified for Shinsekai Plugin Market.

## Scope

当前版本只做前台浏览体验：

- 不做后端
- 不接 AWS/S3/R2/OSS 密钥
- 不上传插件包体
- 不实现登录
- 不实现付费
- 不实现真实安装 API
- 不依赖私有接口

## Features

- 插件列表
- 搜索：`name` / `description` / `author` / `repo`
- 标签和基础状态筛选
- 排序：默认 / 名称 / 作者 / 更新时间 / 仓库优先
- 分页浏览
- 插件详情抽屉
- GitHub 仓库跳转
- 复制安装信息
- 提交插件入口
- loading / error / empty 状态
- 移动端适配

## Data Source

通过 Vite 环境变量配置 registry：

```bash
VITE_PLUGIN_REGISTRY_URL=https://raw.githubusercontent.com/End0rph1nww/Shinsekai-Plugin-Registry/main/plugins.json
```

默认值：

```text
https://raw.githubusercontent.com/End0rph1nww/Shinsekai-Plugin-Registry/main/plugins.json
```

上游 registry 可选地址：

```text
https://raw.githubusercontent.com/RachelForster/Shinsekai-Plugin-Registry/main/plugins.json
```

## Registry Format

当前兼容旧字段：

```json
{
  "name": "moondream_vision",
  "author": "Chihiro",
  "repo": "RachelForster/shinsekai-moondream-vision",
  "description": "Enable your character to see your screen",
  "entry": "moondream_vision.plugin:MoondreamVisionPlugin"
}
```

预留未来字段：

```text
display_name
version
shinsekai_version
download_url
sha256
commit_sha
size
updated_at
tags
logo
```

字段不存在时 UI 会降级显示，不会因为 registry 缺字段而崩溃。

## Development

安装依赖：

```bash
npm ci
```

启动开发服务器：

```bash
npm run dev -- --host 0.0.0.0
```

## Build

生产构建：

```bash
npm run build
```

预览构建结果：

```bash
npm run preview -- --host 0.0.0.0
```

## Submission Flow

“提交插件”按钮会跳转到上游 registry issue 页面：

```text
https://github.com/RachelForster/Shinsekai-Plugin-Registry/issues/new
```

测试 fork：

```text
https://github.com/End0rph1nww/Shinsekai-Plugin-Registry
```

## License And Attribution

This project is based on `AstrBotDevs/Astrbot_Plugins_Market` and keeps the original GPL-3.0 license.

- Original project: `AstrBotDevs/Astrbot_Plugins_Market`
- Original license: GNU General Public License v3.0
- Modified for: Shinsekai Plugin Market

Do not remove the original `LICENSE`. If retained assets require additional licenses such as `OFL.txt`, keep those files as well.
