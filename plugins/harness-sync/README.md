# dsh-harness-sync

DeepSeek Harness 跨设备配置同步插件。

当前版本：`v0.2.0`

在“设置 → 配置同步”中提供“备份到 Git”和“同步 Git”。

## 同步范围

- 自定义插件源码：`plugin-manager`、`usage-monitor`、`harness-sync`
- Web profile 的 `cordis.patch.yml`
- 可审计的同步清单

不会同步 API Key、`.credentials.yaml`、会话、存储数据或浏览器缓存。
依赖目录 `node_modules` 也不会纳入仓库，避免上传本机链接或平台相关文件。

Git 仓库的 `plugins/` 目录是跨设备插件来源。同步 Git 会先备份本机 profile，再拉取仓库中全部有效的自定义插件、写入本机链接依赖并安装；不会删除本机未纳入仓库的插件，之后重启 Harness。

`v0.1.3` 补齐 Harness 扫描客户端模块所需的 `./package.json` 导出；入口注册到“设置 → 插件 → 配置同步”。

`v0.1.4` 新增可见的实时同步日志：逐步显示快照、敏感项排除、Git 提交、远端推送或恢复过程；日志不会展示任何密钥或令牌。

`v0.1.9` 移除旧同步快照中遗留的 Windows 固定目录。插件会根据自身安装位置识别插件目录、根据当前用户目录识别 Harness profile，并优先从当前 Node.js 运行时定位 `pnpm` 或 `corepack`。恢复时不再依赖终端 PATH，因此不会出现 `spawn pnpm ENOENT`。

`v0.1.10` 将用户界面的“从 Git 恢复”统一更名为“同步 Git”，并更新进度与完成提示，准确表达 Git 仓库仅用于同步 Harness 自定义配置。

`v0.2.0` 将 Git `plugins/` 目录作为插件同步来源：备份时自动发现有效的 `dsh-*` 自定义插件并写入清单；同步时按仓库目录复制插件、更新当前电脑的本地链接依赖并安装。界面会显示本次实际同步的插件列表。已取消的 Skill 管理相关插件继续排除。
