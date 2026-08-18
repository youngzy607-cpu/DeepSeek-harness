# dsh-harness-sync

DeepSeek Harness 跨设备配置同步插件。

当前版本：`v0.1.9`

在“设置 → 配置同步”中提供“备份到 Git”和“从 Git 恢复”。

## 同步范围

- 自定义插件源码：`plugin-manager`、`usage-monitor`、`harness-sync`
- Web profile 的 `cordis.patch.yml`
- 可审计的同步清单

不会同步 API Key、`.credentials.yaml`、会话、存储数据或浏览器缓存。
依赖目录 `node_modules` 也不会纳入仓库，避免上传本机链接或平台相关文件。

恢复会先备份本机 profile，再拉取仓库内容、还原插件源码和配置，并安装本地链接依赖；之后重启 Harness。

`v0.1.3` 补齐 Harness 扫描客户端模块所需的 `./package.json` 导出；入口注册到“设置 → 插件 → 配置同步”。

`v0.1.4` 新增可见的实时同步日志：逐步显示快照、敏感项排除、Git 提交、远端推送或恢复过程；日志不会展示任何密钥或令牌。

`v0.1.9` 移除旧同步快照中遗留的 Windows 固定目录。插件会根据自身安装位置识别插件目录、根据当前用户目录识别 Harness profile，并优先从当前 Node.js 运行时定位 `pnpm` 或 `corepack`。恢复时不再依赖终端 PATH，因此不会出现 `spawn pnpm ENOENT`。
