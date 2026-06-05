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
- 标签筛选
- 排序：默认 / 名称 / 作者 / Star 数 / 更新时间 / 仓库优先
- GitHub Star / Fork 自动拉取
- 分页浏览
- 插件详情抽屉
- GitHub 仓库跳转
- 复制安装信息
- 提交插件入口
- loading / error / empty 状态
- 移动端适配

## Configuration

复制 `.env.example` 为 `.env` 并按需修改：

```bash
cp .env.example .env
```

可用环境变量：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `VITE_PLUGIN_REGISTRY_URL` | 插件 registry JSON 地址 | 上游 registry |
| `VITE_SUBMIT_URL` | 提交插件跳转的 issue URL | 上游 registry issues/new |
| `VITE_SITE_URL` | Shinsekai 主站地址 | `/` |
| `VITE_REGISTRY_FORK_URL` | Registry fork 地址（页脚显示） | 不显示 |

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
display_name, version, shinsekai_version, download_url,
sha256, commit_sha, size, updated_at, tags, logo, stars
```

字段不存在时 UI 会降级显示，不会崩溃。

## Development

```bash
npm ci
npm run dev -- --host 0.0.0.0
```

## Build

```bash
npm run build
npm run preview -- --host 0.0.0.0
```

## License and Attribution

This project is based on `AstrBotDevs/Astrbot_Plugins_Market` and keeps the original GPL-3.0 license.

- Original project: `AstrBotDevs/Astrbot_Plugins_Market`
- Original license: GNU General Public License v3.0
- Modified for: Shinsekai Plugin Market

Do not remove the original `LICENSE`. If retained assets require additional licenses such as `OFL.txt`, keep those files as well.
