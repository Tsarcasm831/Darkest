import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { useGameStore } from "../../state/GameState.jsx";
import { useCombatLogic } from "../../hooks/useCombatLogic.js";
import { useTurnSystem } from "../../hooks/useTurnSystem.js";
const reverseHeroOrder = false;
const Character = ({ char, isActive, onTarget, isTargetable }) => {
  const hpPercentage = char.hp / char.maxHp * 100;
  const stressPercentage = char.stress ? char.stress / char.maxStress * 100 : 0;
  const getCharacterClass = () => {
    let classes = `character ${char.type}`;
    if (isActive) classes += " active";
    if (isTargetable) classes += " targetable";
    if (char.hp <= 0) classes += " dead";
    return classes;
  };
  return /* @__PURE__ */ jsxDEV("div", { className: getCharacterClass(), onClick: () => isTargetable && onTarget(char.combatId), children: [
    char.affliction && /* @__PURE__ */ jsxDEV("div", { className: "affliction-text", children: char.affliction }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 23,
      columnNumber: 33
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "character-name", children: char.name }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 24,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("img", { src: char.image, alt: char.name, className: "character-sprite" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 25,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "character-info-bars", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "health-bar-bg", children: /* @__PURE__ */ jsxDEV("div", { className: "health-bar-fg", style: { width: `${hpPercentage}%` } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 28,
        columnNumber: 21
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 27,
        columnNumber: 17
      }),
      char.type === "hero" && /* @__PURE__ */ jsxDEV("div", { className: "stress-bar-bg", children: /* @__PURE__ */ jsxDEV("div", { className: "stress-bar-fg", style: { width: `${stressPercentage}%` } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 32,
        columnNumber: 25
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 31,
        columnNumber: 22
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 26,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "hp-text", children: [
      char.hp,
      " / ",
      char.maxHp
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 36,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 22,
    columnNumber: 9
  });
};
function CombatScene() {
  const { heroes, enemies } = useGameStore((state) => ({ heroes: state.heroes, enemies: state.enemies }));
  const { activeCharacter, isPlayerTurn } = useTurnSystem();
  const { selectedSkill, handleTargetSelect } = useCombatLogic();
  const isTargetable = (character) => {
    if (!isPlayerTurn || !selectedSkill) return false;
    if (character.hp <= 0) return false;
    if (selectedSkill.target === "enemy" && character.type === "enemy") return true;
    if (selectedSkill.target === "hero" && character.type === "hero") {
      if (selectedSkill.heal && character.hp === character.maxHp) return false;
      if (selectedSkill.stress_damage && character.affliction) return false;
      return true;
    }
    return false;
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "combat-scene", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "party", children: [...heroes].sort((a, b) => reverseHeroOrder ? b.position - a.position : a.position - b.position).map((hero) => /* @__PURE__ */ jsxDEV(
      Character,
      {
        char: hero,
        isActive: activeCharacter?.combatId === hero.combatId,
        onTarget: handleTargetSelect,
        isTargetable: isTargetable(hero)
      },
      hero.combatId,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 70,
        columnNumber: 21
      },
      this
    )) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 66,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "enemies", children: [...enemies].sort((a, b) => a.position - b.position).map((enemy) => /* @__PURE__ */ jsxDEV(
      Character,
      {
        char: enemy,
        isActive: activeCharacter?.combatId === enemy.combatId,
        onTarget: handleTargetSelect,
        isTargetable: isTargetable(enemy)
      },
      enemy.combatId,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 81,
        columnNumber: 21
      },
      this
    )) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 79,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 65,
    columnNumber: 9
  }, this);
}
export {
  CombatScene as default
};
