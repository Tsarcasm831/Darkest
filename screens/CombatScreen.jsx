import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useEffect, useState } from "react";
import { useGameStore } from "../state/GameState.jsx";
import CombatScene from "../components/Dungeon/CombatScene.jsx";
import CombatUI from "../components/Dungeon/CombatUI.jsx";
const playerDamageMultiplier = 1;
const enemyDamageMultiplier = 1;
function CombatScreen() {
  const {
    initializeCombat,
    combatState,
    gameInitialized
  } = useGameStore((state) => ({
    initializeCombat: state.initializeCombat,
    combatState: state.combatState,
    gameInitialized: state.gameInitialized
  }));
  const [isLoading, setIsLoading] = useState(true);
  const loadGameData = async () => {
    setIsLoading(true);
    try {
      const [heroResponse, enemyResponse] = await Promise.all([
        fetch("./data/heroes.json"),
        fetch("./data/enemies.json")
      ]);
      const heroData = await heroResponse.json();
      const enemyData = await enemyResponse.json();
      const finalHeroData = heroData.map((h) => ({
        ...h,
        damage: Math.round(h.damage * playerDamageMultiplier)
      }));
      const scaledEnemyData = enemyData.map((e) => ({
        ...e,
        damage: Math.round(e.damage * enemyDamageMultiplier)
      }));
      initializeCombat(finalHeroData, scaledEnemyData);
    } catch (error) {
      console.error("Failed to load game data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadGameData();
  }, []);
  const handleRestart = () => {
    loadGameData();
  };
  if (isLoading || !gameInitialized) {
    return /* @__PURE__ */ jsxDEV("div", { children: "Loading Combat..." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 62,
      columnNumber: 16
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "combat-screen", children: [
    /* @__PURE__ */ jsxDEV(CombatScene, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 67,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(CombatUI, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 68,
      columnNumber: 13
    }, this),
    combatState !== "ongoing" && /* @__PURE__ */ jsxDEV("div", { className: "combat-overlay", children: /* @__PURE__ */ jsxDEV("div", { className: "combat-result-popup", children: [
      /* @__PURE__ */ jsxDEV("h1", { children: combatState === "victory" ? "Victory Achieved" : "A Fateful Defeat" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 72,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ jsxDEV("p", { children: combatState === "victory" ? "The fiends are vanquished... for now." : "Ruin has come to our family." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 73,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: handleRestart, children: "Try Again" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 74,
        columnNumber: 25
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 71,
      columnNumber: 21
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 70,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 66,
    columnNumber: 9
  }, this);
}
export {
  CombatScreen as default
};
