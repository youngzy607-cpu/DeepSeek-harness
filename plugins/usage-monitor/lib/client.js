window.__ModuleLoader__.load({
	id: "dsh-usage-monitor",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.tsx
var client_exports = {};
__export(client_exports, {
  NS: () => NS,
  OFFICIAL_PRICES: () => OFFICIAL_PRICES,
  RECHARGE_URL: () => RECHARGE_URL,
  UsageChip: () => UsageChip,
  UsageMonitorSection: () => UsageMonitorSection,
  apply: () => apply,
  en: () => en,
  getBalance: () => getBalance,
  getConfig: () => getConfig,
  inject: () => inject,
  refreshBalance: () => refreshBalance,
  setConfig: () => setConfig,
  subscribeBalance: () => subscribeBalance,
  subscribeConfig: () => subscribeConfig,
  zh: () => zh
});
module.exports = __toCommonJS(client_exports);
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var NS = "usage-monitor";
var RECHARGE_URL = "https://platform.deepseek.com/top_up";
var zh = {
  "nav": "\u7528\u91CF\u76D1\u63A7",
  "balance.title": "\u8D26\u6237\u4F59\u989D",
  "balance.available": "\u53EF\u7528",
  "balance.unavailable": "\u4E0D\u53EF\u7528",
  "balance.total": "\u603B\u4F59\u989D",
  "balance.granted": "\u8D60\u91D1",
  "balance.toppedUp": "\u5145\u503C",
  "balance.refresh": "\u5237\u65B0",
  "balance.refreshing": "\u5237\u65B0\u4E2D\u2026",
  "balance.lastUpdated": "\u66F4\u65B0\u4E8E",
  "balance.empty": "\u6682\u65E0\u4F59\u989D\u6570\u636E",
  "balance.noKey": "\u672A\u914D\u7F6E DEEPSEEK_API_KEY\uFF08\u8BF7\u5728 Harness \u8BBE\u7F6E\u4E2D\u914D\u7F6E API Key\uFF09",
  "balance.unauthorized": "API Key \u65E0\u6548\u6216\u5DF2\u8FC7\u671F",
  "balance.failed": "\u67E5\u8BE2\u5931\u8D25",
  "usage.title": "Token \u7528\u91CF",
  "usage.all": "\u5168\u90E8\u4F1A\u8BDD",
  "usage.today": "\u4ECA\u65E5\uFF08\u8FD1\u4F3C\uFF09",
  "usage.sessions": "\u6709\u7528\u91CF\u8BB0\u5F55\u7684\u4F1A\u8BDD",
  "usage.input": "\u8F93\u5165\uFF08\u672A\u7F13\u5B58\uFF09",
  "usage.output": "\u8F93\u51FA",
  "usage.cacheRead": "\u7F13\u5B58\u8BFB",
  "usage.cacheWrite": "\u7F13\u5B58\u5199",
  "usage.total": "\u5408\u8BA1",
  "usage.empty": "\u6682\u65E0\u7528\u91CF\u6570\u636E",
  "cost.title": "\u8D39\u7528\u4F30\u7B97",
  "cost.badge": "\u4F30\u7B97",
  "cost.hint": "\u6309\u7A7A\u95F2\u65F6\u6BB5\u57FA\u51C6\u4EF7\u4F30\u7B97\uFF0C\u9AD8\u5CF0\u65F6\u6BB5\uFF08\u5317\u4EAC\u65F6\u95F4 9-12 / 14-18 \u70B9\uFF09\u4EF7\u683C \xD72\uFF0C\u4EC5\u4F9B\u53C2\u8003",
  "cost.model": "\u4F30\u7B97\u6A21\u578B",
  "cost.custom": "\u81EA\u5B9A\u4E49\u4EF7\u683C\uFF08\u5143/\u767E\u4E07 tokens\uFF09",
  "cost.hit": "\u8F93\u5165\xB7\u7F13\u5B58\u547D\u4E2D",
  "cost.miss": "\u8F93\u5165\xB7\u7F13\u5B58\u672A\u547D\u4E2D",
  "cost.output": "\u8F93\u51FA",
  "config.title": "\u8BBE\u7F6E",
  "config.refreshInterval": "\u4F59\u989D\u81EA\u52A8\u5237\u65B0\u95F4\u9694",
  "config.minutes": "\u5206\u949F",
  "config.source": "\u6570\u636E\u6765\u6E90\uFF1A\u4F59\u989D\u6765\u81EA DeepSeek \u5B98\u65B9\u63A5\u53E3\uFF08\u51ED\u636E\u4EC5\u5728\u672C\u5730\u670D\u52A1\u7AEF\u4F7F\u7528\uFF09\uFF1B\u7528\u91CF\u6765\u81EA Harness \u672C\u5730\u4F1A\u8BDD\u8BB0\u5F55\u3002",
  "chip.balance": "\u4F59\u989D",
  "chip.session": "\u672C\u4F1A\u8BDD",
  "chip.amount": "\u91D1\u989D",
  "chip.recharge": "\u4F59\u989D\u4E0D\u8DB3\uFF0C\u70B9\u51FB\u5145\u503C"
};
var en = {
  "nav": "Usage Monitor",
  "balance.title": "Account Balance",
  "balance.available": "Available",
  "balance.unavailable": "Unavailable",
  "balance.total": "Total balance",
  "balance.granted": "Granted",
  "balance.toppedUp": "Topped up",
  "balance.refresh": "Refresh",
  "balance.refreshing": "Refreshing\u2026",
  "balance.lastUpdated": "Updated",
  "balance.empty": "No balance data",
  "balance.noKey": "DEEPSEEK_API_KEY is not configured (set it in Harness settings)",
  "balance.unauthorized": "API Key is invalid or expired",
  "balance.failed": "Query failed",
  "usage.title": "Token Usage",
  "usage.all": "All sessions",
  "usage.today": "Today (approx.)",
  "usage.sessions": "Sessions with usage",
  "usage.input": "Input (uncached)",
  "usage.output": "Output",
  "usage.cacheRead": "Cache read",
  "usage.cacheWrite": "Cache write",
  "usage.total": "Total",
  "usage.empty": "No usage data yet",
  "cost.title": "Cost Estimate",
  "cost.badge": "estimate",
  "cost.hint": "Estimated at off-peak base prices; peak hours (Beijing 9-12 / 14-18) cost \xD72. For reference only.",
  "cost.model": "Model for estimate",
  "cost.custom": "Custom prices (CNY / 1M tokens)",
  "cost.hit": "Input \xB7 cache hit",
  "cost.miss": "Input \xB7 cache miss",
  "cost.output": "Output",
  "config.title": "Settings",
  "config.refreshInterval": "Balance auto-refresh interval",
  "config.minutes": "min",
  "config.source": "Balance comes from the official DeepSeek API (credentials stay on the local host); usage comes from local Harness session records.",
  "chip.balance": "Balance",
  "chip.session": "Session",
  "chip.amount": "Amount",
  "chip.recharge": "Low balance, click to recharge"
};
var balanceState = { status: "loading" };
var balanceListeners = /* @__PURE__ */ new Set();
function emitBalance() {
  for (const listener of balanceListeners) listener();
}
function subscribeBalance(listener) {
  balanceListeners.add(listener);
  return () => {
    balanceListeners.delete(listener);
  };
}
function getBalance() {
  return balanceState;
}
async function refreshBalance() {
  balanceState = { status: "loading" };
  emitBalance();
  try {
    const res = await fetch("/usage-monitor/balance", { cache: "no-store" });
    let json = null;
    try {
      json = await res.json();
    } catch {
    }
    const payload = json ?? {};
    if (payload.ok === true && payload.data) {
      balanceState = { status: "ok", data: payload.data, fetchedAt: payload.fetchedAt ?? Date.now() };
    } else {
      const err = payload.error ?? {};
      balanceState = {
        status: "error",
        kind: err.kind ?? "unknown",
        message: err.message ?? "\u672A\u77E5\u9519\u8BEF"
      };
    }
  } catch (err) {
    balanceState = { status: "error", kind: "network", message: String(err) };
  }
  emitBalance();
}
var OFFICIAL_PRICES = {
  flash: { hit: 0.05, miss: 1.5, output: 4.5 },
  pro: { hit: 0.15, miss: 4.5, output: 13.5 }
};
var DEFAULT_CONFIG = {
  refreshMinutes: 5,
  priceModel: "flash",
  custom: { ...OFFICIAL_PRICES.flash }
};
var CONFIG_KEY = "dsh-usage-monitor.config";
function loadConfig() {
  try {
    const raw = window.localStorage.getItem(CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        custom: { ...DEFAULT_CONFIG.custom, ...parsed?.custom ?? {} }
      };
    }
  } catch {
  }
  return { ...DEFAULT_CONFIG };
}
var config = loadConfig();
var configListeners = /* @__PURE__ */ new Set();
function emitConfig() {
  for (const listener of configListeners) listener();
}
function subscribeConfig(listener) {
  configListeners.add(listener);
  return () => {
    configListeners.delete(listener);
  };
}
function getConfig() {
  return config;
}
function setConfig(patch) {
  config = {
    ...config,
    ...patch,
    custom: { ...config.custom, ...patch.custom ?? {} }
  };
  try {
    window.localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch {
  }
  emitConfig();
}
function fmtTokens(n) {
  if (!Number.isFinite(n) || n <= 0) return "0";
  if (n >= 1e8) return `${(n / 1e8).toFixed(2)}\u4EBF`;
  if (n >= 1e4) return `${(n / 1e4).toFixed(1)}\u4E07`;
  return n.toLocaleString("en-US");
}
function currencySymbol(currency) {
  switch (currency) {
    case "CNY":
      return "\xA5";
    case "USD":
      return "$";
    default:
      return `${currency} `;
  }
}
function compactBalance(data) {
  const first = data.balance_infos?.[0];
  if (!first || first.total_balance === void 0) return "\u2014";
  return `${currencySymbol(first.currency)}${Number(first.total_balance).toFixed(2)}`;
}
function sessionTotal(usage) {
  if (!usage) return 0;
  return usage.uncachedInputTokens + usage.outputTokens + usage.cacheReadTokens + usage.cacheWriteTokens;
}
function beijingParts(date) {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Shanghai", hour: "numeric", hour12: false }).formatToParts(date).find((part) => part.type === "hour")?.value ?? "0"
  ) % 24;
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
  return { hour, day };
}
function isPeakHour(date) {
  const { hour } = beijingParts(date);
  return hour >= 9 && hour < 12 || hour >= 14 && hour < 18;
}
function estimateCost(usage, cfg, at) {
  if (!usage) return null;
  const prices = cfg.priceModel === "custom" ? cfg.custom : OFFICIAL_PRICES[cfg.priceModel];
  const multiplier = isPeakHour(at) ? 2 : 1;
  return ((usage.uncachedInputTokens * prices.miss + usage.cacheReadTokens * prices.hit) * multiplier + usage.outputTokens * prices.output * multiplier) / 1e6;
}
function emptyTotals() {
  return { uncached: 0, output: 0, cacheRead: 0, cacheWrite: 0, count: 0 };
}
function addTotals(totals, usage) {
  return {
    uncached: totals.uncached + usage.uncachedInputTokens,
    output: totals.output + usage.outputTokens,
    cacheRead: totals.cacheRead + usage.cacheReadTokens,
    cacheWrite: totals.cacheWrite + usage.cacheWriteTokens,
    count: totals.count + 1
  };
}
function UsageChip({ useProjection, t }) {
  const usage = useProjection("tokenUsage");
  const balance = (0, import_react.useSyncExternalStore)(subscribeBalance, getBalance);
  const config2 = (0, import_react.useSyncExternalStore)(subscribeConfig, getConfig);
  const sessionCost = estimateCost(usage, config2, /* @__PURE__ */ new Date());
  const firstBalance = balance.status === "ok" ? balance.data.balance_infos?.[0] : void 0;
  const lowBalance = balance.status === "ok" && !!firstBalance && firstBalance.currency === "CNY" && Number.isFinite(Number(firstBalance.total_balance)) && Number(firstBalance.total_balance) < 1.5;
  const chipStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 12,
    lineHeight: "20px",
    color: lowBalance ? "#fff" : "var(--text-color, #555)",
    background: lowBalance ? "#c92a2a" : "var(--bg2-color, rgba(127,127,127,.12))",
    whiteSpace: "nowrap",
    userSelect: "none",
    cursor: "pointer",
    textDecoration: "none"
  };
  const tooltip = (0, import_react.useMemo)(() => {
    const lines = [];
    if (lowBalance) {
      lines.push(t("chip.recharge"));
    }
    if (balance.status === "ok") {
      for (const info of balance.data.balance_infos ?? []) {
        lines.push(`${t("balance.total")} ${currencySymbol(info.currency)}${Number(info.total_balance).toFixed(2)} \xB7 ${t("balance.granted")} ${Number(info.granted_balance).toFixed(2)} \xB7 ${t("balance.toppedUp")} ${Number(info.topped_up_balance).toFixed(2)}`);
      }
      lines.push(`${t("balance.lastUpdated")} ${new Date(balance.fetchedAt).toLocaleTimeString()}`);
    } else if (balance.status === "error") {
      lines.push(`${t("balance.failed")}\uFF1A${balance.message}`);
    }
    if (usage) {
      lines.push(`${t("usage.input")} ${fmtTokens(usage.uncachedInputTokens)} \xB7 ${t("usage.output")} ${fmtTokens(usage.outputTokens)} \xB7 ${t("usage.cacheRead")} ${fmtTokens(usage.cacheReadTokens)}`);
    }
    if (sessionCost !== null) {
      lines.push(`${t("chip.amount")} \xA5${sessionCost.toFixed(2)}`);
    }
    return lines.join("\n");
  }, [balance, usage, config2, sessionCost, t]);
  const balanceText = balance.status === "ok" ? `${t("chip.balance")} ${compactBalance(balance.data)}` : balance.status === "error" ? `${t("chip.balance")} \u2014` : "";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "a",
    {
      href: RECHARGE_URL,
      target: "_blank",
      rel: "noreferrer",
      role: "status",
      "aria-live": "polite",
      title: tooltip,
      style: chipStyle,
      children: [
        balanceText ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: balanceText }) : null,
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: `${t("chip.session")} ${fmtTokens(sessionTotal(usage))}` }),
        sessionCost !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: `${t("chip.amount")} \xA5${sessionCost.toFixed(2)}` }) : null
      ]
    }
  );
}
var cardStyle = {
  border: "1px solid var(--line-color, rgba(127,127,127,.25))",
  borderRadius: 10,
  padding: "12px 14px",
  marginBottom: 14
};
var cardTitleStyle = {
  margin: "0 0 10px",
  fontSize: 13,
  fontWeight: 600,
  color: "var(--text-color, #333)"
};
var rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  padding: "4px 0",
  fontSize: 12.5,
  color: "var(--text-color, #333)"
};
var mutedStyle = {
  fontSize: 11.5,
  color: "var(--text-muted-color, #999)",
  lineHeight: 1.6
};
var badgeStyle = {
  fontSize: 11,
  padding: "1px 8px",
  borderRadius: 999,
  color: "#fff",
  background: "#2f9e44"
};
var inputStyle = {
  width: 76,
  padding: "2px 6px",
  borderRadius: 6,
  border: "1px solid var(--line-color, rgba(127,127,127,.35))",
  background: "var(--bg-color, #fff)",
  color: "var(--text-color, #333)",
  fontSize: 12.5
};
var buttonStyle = {
  padding: "3px 12px",
  borderRadius: 6,
  border: "1px solid var(--line-color, rgba(127,127,127,.35))",
  background: "var(--bg2-color, rgba(127,127,127,.12))",
  color: "var(--text-color, #333)",
  fontSize: 12.5,
  cursor: "pointer"
};
function BalanceCard({ balance, t }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { style: cardStyle, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { style: cardTitleStyle, children: t("balance.title") }),
    balance.status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: rowStyle, children: t("balance.refreshing") ?? "\u2026" }),
    balance.status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: rowStyle, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "#c92a2a" }, children: balance.kind === "no-credential" ? t("balance.noKey") : balance.kind === "unauthorized" ? t("balance.unauthorized") : `${t("balance.failed")}\uFF1A${balance.message}` }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { style: buttonStyle, onClick: () => {
        void refreshBalance();
      }, children: t("balance.refresh") })
    ] }),
    balance.status === "ok" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      balance.data.balance_infos.map((info) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: rowStyle, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontWeight: 600 }, children: [
          currencySymbol(info.currency),
          Number(info.total_balance).toFixed(2)
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { ...badgeStyle, background: balance.data.is_available ? "#2f9e44" : "#c92a2a" }, children: balance.data.is_available ? t("balance.available") : t("balance.unavailable") })
      ] }, info.currency)),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { ...rowStyle, justifyContent: "space-between" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: mutedStyle, children: [
          t("balance.granted"),
          " ",
          Number(balance.data.balance_infos[0]?.granted_balance ?? 0).toFixed(2),
          " \xB7 ",
          t("balance.toppedUp"),
          " ",
          Number(balance.data.balance_infos[0]?.topped_up_balance ?? 0).toFixed(2),
          " \xB7 ",
          t("balance.lastUpdated"),
          " ",
          new Date(balance.fetchedAt).toLocaleTimeString()
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { style: buttonStyle, onClick: () => {
          void refreshBalance();
        }, children: t("balance.refresh") })
      ] })
    ] })
  ] });
}
function UsageMonitorSection({ useSessions, t }) {
  const balance = (0, import_react.useSyncExternalStore)(subscribeBalance, getBalance);
  const config2 = (0, import_react.useSyncExternalStore)(subscribeConfig, getConfig);
  const byId = useSessions((state) => state.byId);
  const [tab, setTab] = (0, import_react.useState)("all");
  const totals = (0, import_react.useMemo)(() => {
    const rows = Object.values(byId);
    const all = rows.reduce(
      (acc, row) => row.projectionValues?.tokenUsage ? addTotals(acc, row.projectionValues.tokenUsage) : acc,
      emptyTotals()
    );
    const todayKey = beijingParts(/* @__PURE__ */ new Date()).day;
    const today = rows.reduce(
      (acc, row) => {
        if (!row.projectionValues?.tokenUsage) return acc;
        if (!row.updatedAt || beijingParts(new Date(row.updatedAt)).day !== todayKey) return acc;
        return addTotals(acc, row.projectionValues.tokenUsage);
      },
      emptyTotals()
    );
    return { all, today };
  }, [byId]);
  const current = tab === "all" ? totals.all : totals.today;
  const cost = estimateCost(
    tab === "all" ? { uncachedInputTokens: totals.all.uncached, outputTokens: totals.all.output, cacheReadTokens: totals.all.cacheRead, cacheWriteTokens: totals.all.cacheWrite } : { uncachedInputTokens: totals.today.uncached, outputTokens: totals.today.output, cacheReadTokens: totals.today.cacheRead, cacheWriteTokens: totals.today.cacheWrite },
    config2,
    /* @__PURE__ */ new Date()
  );
  const tabStyle = (active) => ({
    padding: "3px 12px",
    borderRadius: 999,
    border: "1px solid var(--line-color, rgba(127,127,127,.35))",
    background: active ? "var(--primary-color, #4d6bfe)" : "transparent",
    color: active ? "#fff" : "var(--text-color, #333)",
    fontSize: 12,
    cursor: "pointer"
  });
  const usageRows = [
    { label: t("usage.input"), value: current.uncached },
    { label: t("usage.output"), value: current.output },
    { label: t("usage.cacheRead"), value: current.cacheRead },
    { label: t("usage.cacheWrite"), value: current.cacheWrite }
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BalanceCard, { balance, t }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { style: cardStyle, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { style: { ...cardTitleStyle, margin: 0 }, children: t("usage.title") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { style: tabStyle(tab === "all"), onClick: () => setTab("all"), children: t("usage.all") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { style: tabStyle(tab === "today"), onClick: () => setTab("today"), children: t("usage.today") })
        ] })
      ] }),
      current.count === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: rowStyle, children: t("usage.empty") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        usageRows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: rowStyle, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.label }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontWeight: 500 }, children: fmtTokens(row.value) })
        ] }, row.label)),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { ...rowStyle, borderTop: "1px solid var(--line-color, rgba(127,127,127,.2))", marginTop: 4, paddingTop: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontWeight: 600 }, children: t("usage.total") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontWeight: 600 }, children: fmtTokens(current.uncached + current.output + current.cacheRead + current.cacheWrite) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: mutedStyle, children: [
          t("usage.sessions"),
          "\uFF1A",
          current.count,
          tab === "today" ? `\uFF08${t("usage.today")}\uFF09` : ""
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { style: cardStyle, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { style: { ...cardTitleStyle, margin: 0 }, children: t("cost.title") }),
        cost !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: badgeStyle, children: [
          "\xA5",
          cost.toFixed(2),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { opacity: 0.85 }, children: [
            "\xB7 ",
            t("cost.badge")
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: rowStyle, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("cost.model") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "select",
          {
            style: inputStyle,
            value: config2.priceModel,
            onChange: (event) => setConfig({ priceModel: event.target.value }),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "flash", children: "deepseek-v4-flash" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "pro", children: "deepseek-v4-pro" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "custom", children: t("cost.custom") })
            ]
          }
        )
      ] }),
      config2.priceModel === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { ...rowStyle, flexWrap: "wrap", gap: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { style: mutedStyle, children: [
          t("cost.hit"),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "input",
            {
              type: "number",
              min: 0,
              step: 0.01,
              style: { ...inputStyle, marginLeft: 6 },
              value: config2.custom.hit,
              onChange: (event) => setConfig({ custom: { hit: Number(event.target.value) } })
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { style: mutedStyle, children: [
          t("cost.miss"),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "input",
            {
              type: "number",
              min: 0,
              step: 0.01,
              style: { ...inputStyle, marginLeft: 6 },
              value: config2.custom.miss,
              onChange: (event) => setConfig({ custom: { miss: Number(event.target.value) } })
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { style: mutedStyle, children: [
          t("cost.output"),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "input",
            {
              type: "number",
              min: 0,
              step: 0.01,
              style: { ...inputStyle, marginLeft: 6 },
              value: config2.custom.output,
              onChange: (event) => setConfig({ custom: { output: Number(event.target.value) } })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: mutedStyle, children: t("cost.hint") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { style: cardStyle, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { style: cardTitleStyle, children: t("config.title") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: rowStyle, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("config.refreshInterval") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "select",
          {
            style: inputStyle,
            value: config2.refreshMinutes,
            onChange: (event) => setConfig({ refreshMinutes: Number(event.target.value) }),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", { value: 1, children: [
                "1 ",
                t("config.minutes")
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", { value: 5, children: [
                "5 ",
                t("config.minutes")
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", { value: 10, children: [
                "10 ",
                t("config.minutes")
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", { value: 30, children: [
                "30 ",
                t("config.minutes")
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", { value: 60, children: [
                "60 ",
                t("config.minutes")
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: mutedStyle, children: t("config.source") })
    ] })
  ] });
}
var inject = ["slots", "locale"];
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-usage-monitor: copy");
  ctx.effect(() => {
    void refreshBalance();
    let timer = 0;
    const arm = () => {
      if (timer !== 0) window.clearInterval(timer);
      timer = window.setInterval(() => {
        void refreshBalance();
      }, getConfig().refreshMinutes * 6e4);
    };
    arm();
    const unsubscribe = subscribeConfig(arm);
    return () => {
      window.clearInterval(timer);
      unsubscribe();
    };
  }, "dsh-usage-monitor: balance auto-refresh");
  const t = ctx.locale.bind(NS);
  ctx.slots.inject("conversation.session.header.utilities", () => ctx.slots.register({
    name: "conversation.session.header.utilities",
    id: "usage-monitor-chip",
    order: 100,
    locale: NS
  }, UsageChip));
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "usage-monitor",
    order: 40,
    label: () => t("nav"),
    locale: NS
  }, UsageMonitorSection));
}

		return module.exports;
	}
});
