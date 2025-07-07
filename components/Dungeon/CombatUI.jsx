import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { useGameStore } from "../../state/GameState.jsx";
import { useTurnSystem } from "../../hooks/useTurnSystem.js";
import { useCombatLogic } from "../../hooks/useCombatLogic.js";
function CombatUI() {
  const combatLog = useGameStore((state) => state.combatLog);
  const { activeCharacter, isPlayerTurn, combatState } = useTurnSystem();
  const { selectedSkill, handleSelectSkill } = useCombatLogic();
  const getTurnText = () => {
    if (combatState !== "ongoing") return "Combat Over";
    if (!activeCharacter) return "Determining turn...";
    return `${activeCharacter.name}'s Turn`;
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "combat-ui", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "turn-tracker", children: /* @__PURE__ */ jsxDEV("h2", { children: getTurnText() }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 20,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 19,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "action-bar", children: [
      /* @__PURE__ */ jsxDEV("h3", { children: "Actions" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 24,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "skills", children: [
        isPlayerTurn && activeCharacter && activeCharacter.skills.map((skill) => /* @__PURE__ */ jsxDEV(
          "button",
          {
            className: `skill-button ${selectedSkill?.name === skill.name ? "selected" : ""}`,
            onClick: () => handleSelectSkill(skill),
            disabled: combatState !== "ongoing",
            children: skill.name
          },
          skill.name,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 27,
            columnNumber: 25
          },
          this
        )),
        !isPlayerTurn && combatState === "ongoing" && /* @__PURE__ */ jsxDEV("p", { children: "Awaiting enemy action..." }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 36,
          columnNumber: 68
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 25,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 23,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "combat-log", children: [
      /* @__PURE__ */ jsxDEV("h3", { children: "Log" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 41,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("ul", { children: combatLog.slice(0, 10).map((msg, index) => /* @__PURE__ */ jsxDEV("li", { children: msg }, index, false, {
        fileName: "<stdin>",
        lineNumber: 44,
        columnNumber: 25
      }, this)) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 42,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 40,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 18,
    columnNumber: 9
  }, this);
}
export {
  CombatUI as default
};
