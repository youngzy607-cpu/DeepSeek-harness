# dsh-plugin-manager

DeepSeek Harness 自定义插件启停管理插件。

在 `设置 → 插件` 中新增一个“我的插件”标签页，可以直接启用/停用你自己安装的自定义插件（默认管理 `usage-monitor`）。

## 功能

- 不修改 Harness 原生只读的“插件列表”。
- 在 Plugins 设置区新增“我的插件”标签页。
- 每个受管插件显示：名称、id、当前状态、启用/停用按钮。
- 启停先通过 Harness Loader 立即生效，再写入正确的 profile 配置来源，以便重启后保持状态。

## 文件位置

- Host 端：`lib/index.js`
- 浏览器端源码：`src/client.tsx`
- 浏览器端构建产物：`lib/client.js`
- 构建脚本：`scripts/build.mjs`

## 安装

```bash
cd ~/.dsh/profiles/web
pnpm add "link:/Users/jy/Documents/DeepSeek harness/plugin-manager"
```

然后在 `~/.dsh/profiles/web/cordis.patch.yml` 中插入：

```yaml
- insert:
    - id: plugin-manager
      name: 'dsh-plugin-manager'
      config:
        managed:
          - usage-monitor
```

重启 `dsh web`。

## 管理更多插件

在 `plugin-manager` 的 `config.managed` 中追加插件 id：

```yaml
config:
  managed:
    - usage-monitor
    - your-custom-plugin-id
```

## 开发

```bash
cd '/Users/jy/Documents/DeepSeek harness/plugin-manager'
npm run build
```

## 接口

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/plugin-manager/plugins` | 列出受管插件及启停状态 |
| POST | `/plugin-manager/plugins/:id` | 请求体 `{ "enabled": true/false }`，启用/停用插件 |
