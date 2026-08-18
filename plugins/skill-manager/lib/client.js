window.__ModuleLoader__.load({
	id: "dsh-skill-manager",
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
  SkillManagerTab: () => SkillManagerTab,
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var NS = "skill-manager";
var zh = {
  "tab": "Skill \u7BA1\u7406",
  "title": "Skill \u7BA1\u7406",
  "hint": "\u7BA1\u7406 ~/.dsh/skills/ \u4E0B\u7684 Skill \u6587\u4EF6\u3002Harness \u4F1A\u81EA\u52A8\u76D1\u89C6\u53D8\u66F4\uFF0C\u65B0\u589E\u6216\u4FEE\u6539\u540E\u5373\u65F6\u751F\u6548\u3002",
  "openFolder": "\u6253\u5F00\u6587\u4EF6\u5939",
  "new": "\u65B0\u5EFA Skill",
  "loading": "\u6B63\u5728\u8BFB\u53D6 Skill \u5217\u8868\u2026",
  "loadError": "\u8BFB\u53D6\u5931\u8D25",
  "retry": "\u91CD\u8BD5",
  "empty": "\u6682\u65E0 Skill\u3002\u70B9\u51FB\u300C\u65B0\u5EFA Skill\u300D\u521B\u5EFA\u7B2C\u4E00\u4E2A\u3002",
  "name": "\u540D\u79F0",
  "namePlaceholder": "kebab-case\uFF0C\u5982 my-skill",
  "description": "\u63CF\u8FF0",
  "descriptionPlaceholder": "\u8FD9\u4E2A Skill \u505A\u4EC0\u4E48",
  "whenToUse": "\u4F55\u65F6\u4F7F\u7528",
  "whenToUsePlaceholder": "\u53EF\u9009\uFF0C\u63CF\u8FF0\u4F7F\u7528\u65F6\u673A",
  "format": "\u683C\u5F0F",
  "formatFlat": "\u6241\u5E73\u6587\u4EF6\uFF08name.md\uFF09",
  "formatBundle": "\u76EE\u5F55\uFF08name/SKILL.md\uFF09",
  "body": "\u6B63\u6587",
  "bodyPlaceholder": "Skill \u7684\u6307\u4EE4\u6B63\u6587\u2026\n\n\u4F8B\u5982\uFF1A\n## \u6B65\u9AA4\n1. \u5206\u6790\u9700\u6C42\n2. \u751F\u6210\u4EE3\u7801\n3. \u9A8C\u8BC1\u7ED3\u679C",
  "save": "\u4FDD\u5B58",
  "saving": "\u4FDD\u5B58\u4E2D\u2026",
  "saved": "\u5DF2\u4FDD\u5B58",
  "saveError": "\u4FDD\u5B58\u5931\u8D25",
  "delete": "\u5220\u9664",
  "deleteConfirm": "\u786E\u5B9A\u5220\u9664\u6B64 Skill\uFF1F",
  "deleteError": "\u5220\u9664\u5931\u8D25",
  "edit": "\u7F16\u8F91",
  "cancel": "\u53D6\u6D88",
  "back": "\u8FD4\u56DE\u5217\u8868",
  "nameRequired": "\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A",
  "nameInvalid": "\u540D\u79F0\u5FC5\u987B\u4E3A kebab-case\uFF08\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u8FDE\u5B57\u7B26\uFF09",
  "chars": "\u5B57\u7B26"
};
var en = {
  "tab": "Skill Manager",
  "title": "Skill Manager",
  "hint": "Manage Skill files under ~/.dsh/skills/. Harness watches for changes automatically \u2014 new or edited skills take effect immediately.",
  "openFolder": "Open Folder",
  "new": "New Skill",
  "loading": "Loading skills\u2026",
  "loadError": "Failed to load",
  "retry": "Retry",
  "empty": 'No skills yet. Click "New Skill" to create one.',
  "name": "Name",
  "namePlaceholder": "kebab-case, e.g. my-skill",
  "description": "Description",
  "descriptionPlaceholder": "What this skill does",
  "whenToUse": "When to use",
  "whenToUsePlaceholder": "Optional, describe when to use this skill",
  "format": "Format",
  "formatFlat": "Flat file (name.md)",
  "formatBundle": "Directory (name/SKILL.md)",
  "body": "Body",
  "bodyPlaceholder": "Skill instruction body\u2026\n\nExample:\n## Steps\n1. Analyze request\n2. Generate code\n3. Verify results",
  "save": "Save",
  "saving": "Saving\u2026",
  "saved": "Saved",
  "saveError": "Save failed",
  "delete": "Delete",
  "deleteConfirm": "Delete this skill?",
  "deleteError": "Delete failed",
  "edit": "Edit",
  "cancel": "Cancel",
  "back": "Back to list",
  "nameRequired": "Name is required",
  "nameInvalid": "Name must be kebab-case (lowercase letters, digits, hyphens)",
  "chars": "characters"
};
var panelStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  maxWidth: 820
};
var hintStyle = {
  margin: 0,
  fontSize: 12,
  color: "var(--text-muted-color, #999)",
  lineHeight: 1.6
};
var buttonStyle = {
  padding: "6px 14px",
  borderRadius: 8,
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
var dangerButtonStyle = {
  ...buttonStyle,
  background: "#e03131",
  borderColor: "transparent",
  color: "#fff"
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
var descStyle = {
  margin: "2px 0 0",
  fontSize: 12,
  color: "var(--text-muted-color, #999)"
};
var badgeStyle = {
  fontSize: 10,
  padding: "1px 7px",
  borderRadius: 999,
  color: "#fff",
  background: "#868e96"
};
var inputStyle = {
  width: "100%",
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid var(--line-color, rgba(127,127,127,.35))",
  background: "var(--bg-color, #fff)",
  color: "var(--text-color, #333)",
  fontSize: 13,
  boxSizing: "border-box",
  outline: "none"
};
var textareaStyle = {
  ...inputStyle,
  minHeight: 240,
  fontFamily: "var(--mono-font, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace)",
  lineHeight: 1.7,
  resize: "vertical"
};
var labelStyle = {
  fontSize: 12.5,
  fontWeight: 600,
  color: "var(--text-color, #333)",
  marginBottom: 4,
  display: "block"
};
var statusStyle = {
  fontSize: 12,
  color: "var(--text-muted-color, #999)"
};
async function fetchSkills() {
  const res = await fetch("/skill-manager", { cache: "no-store" });
  const payload = await res.json();
  if (payload.ok !== true || !Array.isArray(payload.skills)) {
    throw new Error(payload.error?.message ?? "fetch failed");
  }
  return payload.skills;
}
async function fetchSkill(name) {
  const res = await fetch(`/skill-manager/skills/${encodeURIComponent(name)}`, { cache: "no-store" });
  const payload = await res.json();
  if (payload.ok !== true) {
    if (res.status === 404) return null;
    throw new Error(payload.error?.message ?? "fetch failed");
  }
  return payload.skill;
}
async function saveSkill(name, data) {
  const res = await fetch(`/skill-manager/skills/${encodeURIComponent(name)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const payload = await res.json();
  if (payload.ok !== true) {
    throw new Error(payload.error?.message ?? "save failed");
  }
}
async function deleteSkill(name) {
  const res = await fetch(`/skill-manager/skills/${encodeURIComponent(name)}`, { method: "DELETE" });
  const payload = await res.json();
  if (payload.ok !== true) {
    throw new Error(payload.error?.message ?? "delete failed");
  }
}
async function openFolder() {
  await fetch("/skill-manager/open-folder", { method: "POST" });
}
function SkillList({ t, onEdit, onNew, reloadKey }) {
  const [skills, setSkills] = (0, import_react.useState)([]);
  const [status, setStatus] = (0, import_react.useState)("loading");
  const [errorMsg, setErrorMsg] = (0, import_react.useState)("");
  const [deleting, setDeleting] = (0, import_react.useState)(null);
  const load = (0, import_react.useCallback)(() => {
    setStatus("loading");
    fetchSkills().then(
      (s) => {
        setSkills(s);
        setStatus("ready");
      },
      (err) => {
        setErrorMsg(err instanceof Error ? err.message : String(err));
        setStatus("error");
      }
    );
  }, []);
  (0, import_react.useEffect)(load, [load, reloadKey]);
  const handleDelete = async (name) => {
    if (!window.confirm(t("deleteConfirm"))) return;
    setDeleting(name);
    try {
      await deleteSkill(name);
      load();
    } catch (err) {
      window.alert(`${t("deleteError")}\uFF1A${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setDeleting(null);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: hintStyle, children: t("hint") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: buttonStyle, onClick: () => {
          void openFolder();
        }, children: t("openFolder") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: primaryButtonStyle, onClick: onNew, children: t("new") })
      ] })
    ] }),
    status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: statusStyle, children: t("loading") }),
    status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { ...statusStyle, color: "#c92a2a" }, role: "alert", children: [
        t("loadError"),
        "\uFF1A",
        errorMsg
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: buttonStyle, onClick: load, children: t("retry") })
    ] }),
    status === "ready" && skills.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: statusStyle, children: t("empty") }),
    status === "ready" && skills.map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { style: cardStyle, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { style: nameStyle, children: skill.name }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: badgeStyle, children: skill.format === "bundle" ? "dir" : "file" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: descStyle, children: skill.description || `~/.dsh/skills/${skill.dirName}${skill.format === "bundle" ? "/SKILL.md" : ".md"}` })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: buttonStyle, onClick: () => onEdit(skill.dirName), children: t("edit") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            style: dangerButtonStyle,
            disabled: deleting === skill.dirName,
            onClick: () => {
              void handleDelete(skill.dirName);
            },
            children: deleting === skill.dirName ? "\u2026" : t("delete")
          }
        )
      ] })
    ] }, skill.dirName))
  ] });
}
function SkillEditor({ t, skillName, onBack }) {
  const isNew = skillName === null;
  const [name, setName] = (0, import_react.useState)("");
  const [description, setDescription] = (0, import_react.useState)("");
  const [whenToUse, setWhenToUse] = (0, import_react.useState)("");
  const [format, setFormat] = (0, import_react.useState)("flat");
  const [body, setBody] = (0, import_react.useState)("");
  const [status, setStatus] = (0, import_react.useState)("loading");
  const [errorMsg, setErrorMsg] = (0, import_react.useState)("");
  (0, import_react.useEffect)(() => {
    if (isNew) {
      setName("");
      setDescription("");
      setWhenToUse("");
      setFormat("flat");
      setBody("");
      setStatus("ready");
      return;
    }
    setStatus("loading");
    fetchSkill(skillName).then(
      (detail) => {
        if (!detail) {
          setStatus("ready");
          return;
        }
        setName(detail.frontmatter.name || skillName || "");
        setDescription(detail.frontmatter.description || "");
        setWhenToUse(detail.frontmatter.whenToUse || "");
        setFormat(detail.format);
        setBody(detail.body);
        setStatus("ready");
      },
      (err) => {
        setErrorMsg(err instanceof Error ? err.message : String(err));
        setStatus("saveError");
      }
    );
  }, [skillName, isNew]);
  const nameValid = name.length > 0 && /^[a-z0-9][a-z0-9-]*$/.test(name);
  const dirty = status === "ready" || status === "saved" || status === "saveError";
  const handleSave = async () => {
    if (!nameValid) return;
    setStatus("saving");
    try {
      await saveSkill(name, {
        frontmatter: { name, description, whenToUse },
        body,
        format
      });
      setStatus("saved");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setStatus("saveError");
    }
  };
  const statusText = (() => {
    if (status === "loading") return t("loading");
    if (status === "saving") return t("saving");
    if (status === "saved") return t("saved");
    if (status === "saveError") return `${t("saveError")}\uFF1A${errorMsg}`;
    if (!nameValid && name.length > 0) return t("nameInvalid");
    if (body.length === 0) return t("bodyPlaceholder").split("\n")[0];
    return `${body.length} ${t("chars")}`;
  })();
  const statusColor = status === "saveError" ? "#c92a2a" : status === "saved" ? "#2f9e44" : "var(--text-muted-color, #999)";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: buttonStyle, onClick: onBack, children: t("back") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { style: { margin: 0, fontSize: 15, fontWeight: 600 }, children: isNew ? t("new") : t("edit") })
    ] }),
    status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: statusStyle, children: t("loading") }),
    status !== "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { style: labelStyle, children: t("name") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: inputStyle,
            value: name,
            placeholder: t("namePlaceholder"),
            onChange: (e) => {
              setName(e.target.value.toLowerCase());
              if (status === "saved" || status === "saveError") setStatus("ready");
            },
            disabled: !isNew
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { style: labelStyle, children: t("description") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: inputStyle,
            value: description,
            placeholder: t("descriptionPlaceholder"),
            onChange: (e) => {
              setDescription(e.target.value);
              if (status === "saved") setStatus("ready");
            }
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { style: labelStyle, children: t("whenToUse") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            style: inputStyle,
            value: whenToUse,
            placeholder: t("whenToUsePlaceholder"),
            onChange: (e) => {
              setWhenToUse(e.target.value);
              if (status === "saved") setStatus("ready");
            }
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { style: labelStyle, children: t("format") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 12, fontSize: 12.5 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { style: { display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "radio", checked: format === "flat", onChange: () => setFormat("flat") }),
            t("formatFlat")
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { style: { display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "radio", checked: format === "bundle", onChange: () => setFormat("bundle") }),
            t("formatBundle")
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { style: labelStyle, children: t("body") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "textarea",
          {
            style: textareaStyle,
            value: body,
            placeholder: t("bodyPlaceholder"),
            onChange: (e) => {
              setBody(e.target.value);
              if (status === "saved") setStatus("ready");
            }
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { ...statusStyle, color: statusColor }, children: statusText }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            style: status === "saving" || !nameValid ? { ...primaryButtonStyle, opacity: 0.5, cursor: "not-allowed" } : primaryButtonStyle,
            disabled: status === "saving" || !nameValid,
            onClick: () => {
              void handleSave();
            },
            children: status === "saving" ? t("saving") : t("save")
          }
        )
      ] })
    ] })
  ] });
}
function SkillManagerTab({ t }) {
  const [view, setView] = (0, import_react.useState)({ mode: "list" });
  const [reloadKey, setReloadKey] = (0, import_react.useState)(0);
  const goList = () => {
    setView({ mode: "list" });
    setReloadKey((k) => k + 1);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: panelStyle, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { style: { margin: 0, fontSize: 15, fontWeight: 600 }, children: t("title") }),
    view.mode === "list" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      SkillList,
      {
        t,
        reloadKey,
        onEdit: (name) => setView({ mode: "edit", name }),
        onNew: () => setView({ mode: "edit", name: null })
      }
    ),
    view.mode === "edit" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      SkillEditor,
      {
        t,
        skillName: view.name,
        onBack: goList
      }
    )
  ] });
}
var inject = ["slots", "locale"];
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-skill-manager: copy");
  const t = ctx.locale.bind(NS);
  ctx.slots.inject("settings.plugins.tab", () => ctx.slots.register({
    name: "settings.plugins.tab",
    id: "skill-manager",
    order: 15,
    label: () => t("tab"),
    locale: NS
  }, SkillManagerTab));
}

		return module.exports;
	}
});
