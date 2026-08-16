window.__ModuleLoader__.load({
	id: "dsh-plugin-manager",
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
  PluginManagerTab: () => PluginManagerTab,
  apply: () => apply,
  en: () => en,
  inject: () => inject,
  zh: () => zh
});
module.exports = __toCommonJS(client_exports);
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var NS = "plugin-manager";
var zh = {
  "tab": "\u6211\u7684\u63D2\u4EF6",
  "loading": "\u6B63\u5728\u8BFB\u53D6\u63D2\u4EF6\u2026",
  "error": "\u6682\u65F6\u65E0\u6CD5\u8BFB\u53D6\u63D2\u4EF6\u72B6\u6001\u3002",
  "retry": "\u91CD\u8BD5",
  "empty": "\u6682\u65E0\u53EF\u7BA1\u7406\u7684\u81EA\u5B9A\u4E49\u63D2\u4EF6\u3002",
  "missing": "\u672A\u627E\u5230\u914D\u7F6E",
  "enabled": "\u5DF2\u542F\u7528",
  "disabled": "\u5DF2\u505C\u7528",
  "enable": "\u542F\u7528",
  "disable": "\u505C\u7528",
  "operating": "\u5904\u7406\u4E2D\u2026",
  "operateError": "\u64CD\u4F5C\u5931\u8D25",
  "hint": "\u8FD9\u91CC\u53EA\u7BA1\u7406\u4F60\u5728 cordis.patch.yml \u4E2D\u914D\u7F6E\u7684\u81EA\u5B9A\u4E49\u63D2\u4EF6\u3002"
};
var en = {
  "tab": "My Plugins",
  "loading": "Loading plugins\u2026",
  "error": "Unable to load plugin states.",
  "retry": "Retry",
  "empty": "No manageable custom plugins.",
  "missing": "Not found",
  "enabled": "Enabled",
  "disabled": "Disabled",
  "enable": "Enable",
  "disable": "Disable",
  "operating": "Working\u2026",
  "operateError": "Operation failed",
  "hint": "Only custom plugins configured in cordis.patch.yml are managed here."
};
async function listPlugins() {
  const res = await fetch("/plugin-manager/plugins", { cache: "no-store" });
  const payload = await res.json();
  if (payload.ok !== true || !Array.isArray(payload.plugins)) {
    throw new Error(payload.error?.message ?? "list failed");
  }
  return payload.plugins;
}
async function setPluginEnabled(id, enabled) {
  const res = await fetch(`/plugin-manager/plugins/${encodeURIComponent(id)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabled })
  });
  const payload = await res.json();
  if (payload.ok !== true) {
    throw new Error(payload.error?.message ?? "toggle failed");
  }
}
var sectionStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  maxWidth: 760,
  color: "var(--text-color, #333)"
};
var hintStyle = {
  margin: 0,
  fontSize: 12,
  color: "var(--text-muted-color, #999)",
  lineHeight: 1.6
};
var cardStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "12px 14px",
  border: "1px solid var(--line-color, rgba(127,127,127,.25))",
  borderRadius: 10,
  background: "var(--bg2-color, rgba(127,127,127,.06))"
};
var nameStyle = {
  margin: 0,
  fontSize: 14,
  fontWeight: 600,
  color: "var(--text-color, #333)"
};
var idStyle = {
  margin: "2px 0 0",
  fontSize: 12,
  color: "var(--text-muted-color, #999)"
};
var badgeStyle = {
  fontSize: 11,
  padding: "1px 8px",
  borderRadius: 999,
  color: "#fff",
  background: "#868e96"
};
var buttonStyle = {
  padding: "4px 14px",
  borderRadius: 6,
  border: "1px solid var(--line-color, rgba(127,127,127,.35))",
  background: "var(--bg2-color, rgba(127,127,127,.12))",
  color: "var(--text-color, #333)",
  fontSize: 12.5,
  cursor: "pointer"
};
var primaryButtonStyle = {
  ...buttonStyle,
  background: "var(--primary-color, #4d6bfe)",
  borderColor: "transparent",
  color: "#fff"
};
var statusStyle = {
  margin: 0,
  fontSize: 12,
  color: "var(--text-muted-color, #999)"
};
function PluginManagerTab({ t }) {
  const [state, setState] = (0, import_react.useState)({ status: "loading" });
  const [busyId, setBusyId] = (0, import_react.useState)(null);
  const [error, setError] = (0, import_react.useState)(null);
  const load = () => {
    setState({ status: "loading" });
    listPlugins().then(
      (plugins) => setState({ status: "ready", plugins }),
      (err) => setState({
        status: "error",
        message: err instanceof Error ? err.message : String(err)
      })
    );
  };
  (0, import_react.useEffect)(load, []);
  const toggle = async (plugin, enabled) => {
    setBusyId(plugin.id);
    setError(null);
    try {
      await setPluginEnabled(plugin.id, enabled);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusyId(null);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: sectionStyle, "aria-busy": state.status === "loading", children: [
    state.status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: statusStyle, children: t("loading") }),
    state.status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { ...statusStyle, color: "#c92a2a" }, role: "alert", children: t("error") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: buttonStyle, onClick: load, children: t("retry") })
    ] }),
    error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { ...statusStyle, color: "#c92a2a" }, role: "alert", children: [
      t("operateError"),
      "\uFF1A",
      error
    ] }),
    state.status === "ready" && state.plugins.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: statusStyle, children: t("empty") }),
    state.status === "ready" && state.plugins.map((plugin) => {
      const enabled = plugin.enabled;
      const busy = busyId === plugin.id;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { style: cardStyle, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { style: nameStyle, children: plugin.name ?? plugin.id }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: idStyle, children: plugin.id }),
          !plugin.exists && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { ...idStyle, color: "#c92a2a" }, children: t("missing") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
            ...badgeStyle,
            background: enabled ? "#2f9e44" : "#868e96"
          }, children: enabled ? t("enabled") : t("disabled") }),
          enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              type: "button",
              style: buttonStyle,
              disabled: busy || !plugin.exists,
              onClick: () => {
                void toggle(plugin, false);
              },
              children: busy ? t("operating") : t("disable")
            }
          ) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              type: "button",
              style: primaryButtonStyle,
              disabled: busy || !plugin.exists,
              onClick: () => {
                void toggle(plugin, true);
              },
              children: busy ? t("operating") : t("enable")
            }
          )
        ] })
      ] }, plugin.id);
    }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: hintStyle, children: t("hint") })
  ] });
}
var inject = ["slots", "locale"];
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-plugin-manager: copy");
  const t = ctx.locale.bind(NS);
  ctx.slots.inject("settings.plugins.tab", () => ctx.slots.register({
    name: "settings.plugins.tab",
    id: "managed",
    order: 20,
    label: () => t("tab"),
    locale: NS
  }, PluginManagerTab));
}

		return module.exports;
	}
});
