# dsh-harness-sync

DeepSeek Harness 跨设备配置同步插件。

当前版本：`v0.1.3`

在“设置 → 配置同步”中提供“备份到 Git”和“从 Git 恢复”。

## 同步范围

- 自定义插件源码：`plugin-manager`、`usage-monitor`、`harness-sync`
- Web profile 的 `cordis.patch.yml`
- 可审计的同步清单

不会同步 API Key、`.credentials.yaml`、会话、存储数据或浏览器缓存。
依赖目录 `node_modules` 也不会纳入仓库，避免上传本机链接或平台相关文件。

恢复会先备份本机 profile，再拉取仓库内容、还原插件源码和配置，并安装本地链接依赖；之后重启 Harness。

`v0.1.3` 补齐 Harness 扫描客户端模块所需的 `./package.json` 导出；入口注册到“设置 → 插件 → 配置同步”。
