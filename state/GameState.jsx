import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
const useGameStore = create((set, get) => ({
  heroes: [],
  enemies: [],
  turnQueue: [],
  currentTurnIndex: 0,
  combatLog: [],
  selectedSkill: null,
  isPlayerTurn: false,
  combatState: "ongoing",
  // 'ongoing', 'victory', 'defeat'
  gameInitialized: false,
  /* @tweakable Stress gained when a hero takes HP damage */
  stressFromDamage: 5,
  /* @tweakable List of possible afflictions */
  possibleAfflictions: ["Fearful", "Paranoid", "Selfish", "Masochistic"],
  // === INITIALIZATION ===
  initializeCombat: (heroData, enemyData) => {
    const combatHeroes = heroData.map((h) => ({ ...h, combatId: uuidv4(), stress: 0, affliction: null }));
    const combatEnemies = enemyData.map((e) => ({ ...e, combatId: uuidv4() }));
    const allCharacters = [...combatHeroes, ...combatEnemies];
    const turnQueue = allCharacters.sort((a, b) => b.speed - a.speed).map((c) => c.combatId);
    set({
      heroes: combatHeroes,
      enemies: combatEnemies,
      turnQueue,
      currentTurnIndex: 0,
      combatLog: ["Combat begins!"],
      selectedSkill: null,
      combatState: "ongoing",
      isPlayerTurn: allCharacters.find((c) => c.combatId === turnQueue[0])?.type === "hero",
      gameInitialized: true
    });
  },
  // === ACTIONS ===
  setSelectedSkill: (skill) => set({ selectedSkill: skill }),
  executeAction: (targetId) => {
    const { selectedSkill, turnQueue, currentTurnIndex } = get();
    if (!selectedSkill) return;
    const attackerId = turnQueue[currentTurnIndex];
    const { allCharacters } = get()._getCharacterLists();
    const attacker = allCharacters.find((c) => c.combatId === attackerId);
    let logMessage = "";
    let target;
    let requiresTargetUpdate = false;
    const handleStress = (target2, amount) => {
      if (target2.type !== "hero" || target2.hp <= 0 || target2.affliction) return target2;
      const newStress = Math.min(target2.maxStress, target2.hp > 0 ? target2.stress + amount : target2.stress);
      if (newStress > target2.stress) {
        get()._addLog(`${target2.name} is stressed! (+${amount})`);
      }
      let newAffliction = target2.affliction;
      if (newStress >= target2.maxStress && !target2.affliction) {
        const { possibleAfflictions } = get();
        newAffliction = possibleAfflictions[Math.floor(Math.random() * possibleAfflictions.length)];
        get()._addLog(`${target2.name}'s resolve is tested... ${newAffliction.toUpperCase()}!`);
        return { ...target2, stress: newStress, affliction: newAffliction };
      }
      return { ...target2, stress: newStress };
    };
    if (selectedSkill.damage_modifier) {
      target = allCharacters.find((c) => c.combatId === targetId);
      if (!target) return;
      const damage = Math.round(attacker.damage * selectedSkill.damage_modifier);
      const newHp = Math.max(0, target.hp - damage);
      logMessage = `${attacker.name} uses ${selectedSkill.name} on ${target.name} for ${damage} damage!`;
      const baseUpdate = { ...target, hp: newHp };
      const finalUpdate = target.type === "hero" ? handleStress(baseUpdate, get().stressFromDamage) : baseUpdate;
      const updateCharacter = (c) => c.combatId === targetId ? finalUpdate : c;
      set((state) => ({
        heroes: state.heroes.map(updateCharacter),
        enemies: state.enemies.map(updateCharacter)
      }));
      requiresTargetUpdate = true;
    } else if (selectedSkill.heal) {
      target = get().heroes.find((c) => c.combatId === targetId);
      if (!target) return;
      const newHp = Math.min(target.maxHp, target.hp + selectedSkill.heal);
      logMessage = `${attacker.name} uses ${selectedSkill.name} on ${target.name}, healing for ${selectedSkill.heal} HP.`;
      const updateCharacter = (c) => c.combatId === targetId ? { ...c, hp: newHp } : c;
      set((state) => ({ heroes: state.heroes.map(updateCharacter) }));
      requiresTargetUpdate = true;
    } else if (selectedSkill.stress_damage) {
      target = get().heroes.find((c) => c.combatId === targetId);
      if (!target) return;
      logMessage = `${attacker.name} uses ${selectedSkill.name} on ${target.name}! Their resolve is tested.`;
      const finalUpdate = handleStress(target, selectedSkill.stress_damage);
      const updateCharacter = (c) => c.combatId === targetId ? finalUpdate : c;
      set((state) => ({ heroes: state.heroes.map(updateCharacter) }));
      requiresTargetUpdate = true;
    }
    if (requiresTargetUpdate) {
      set((state) => ({
        combatLog: [logMessage, ...state.combatLog],
        selectedSkill: null
      }));
      get()._endTurn();
    }
  },
  // === TURN MANAGEMENT ===
  _endTurn: () => {
    const { heroes, enemies, turnQueue } = get();
    const livingIds = [...heroes, ...enemies].filter((c) => c.hp > 0).map((c) => c.combatId);
    const newTurnQueue = turnQueue.filter((id) => livingIds.includes(id));
    if (get().enemies.every((e) => e.hp <= 0)) {
      set({ combatState: "victory", combatLog: ["Victory!", ...get().combatLog] });
      return;
    }
    if (get().heroes.every((h) => h.hp <= 0)) {
      set({ combatState: "defeat", combatLog: ["Defeat!", ...get().combatLog] });
      return;
    }
    const newIndex = (get().currentTurnIndex + 1) % newTurnQueue.length;
    const nextCharId = newTurnQueue[newIndex];
    const { allCharacters } = get()._getCharacterLists();
    const nextChar = allCharacters.find((c) => c.combatId === nextCharId);
    set({
      currentTurnIndex: newIndex,
      turnQueue: newTurnQueue,
      isPlayerTurn: nextChar?.type === "hero"
    });
  },
  // === ENEMY AI ===
  runEnemyAI: () => {
    const { turnQueue, currentTurnIndex, heroes } = get();
    const attackerId = turnQueue[currentTurnIndex];
    const { allCharacters } = get()._getCharacterLists();
    const attacker = allCharacters.find((c) => c.combatId === attackerId);
    if (!attacker || attacker.type !== "enemy") return;
    const livingHeroes = heroes.filter((h) => h.hp > 0);
    if (livingHeroes.length === 0) return;
    const skill = attacker.skills[Math.floor(Math.random() * attacker.skills.length)];
    let target;
    if (skill.stress_damage) {
      const nonAfflictedHeroes = livingHeroes.filter((h) => !h.affliction);
      if (nonAfflictedHeroes.length > 0) {
        target = nonAfflictedHeroes[Math.floor(Math.random() * nonAfflictedHeroes.length)];
      } else {
        target = livingHeroes[Math.floor(Math.random() * livingHeroes.length)];
      }
    } else {
      target = livingHeroes[Math.floor(Math.random() * livingHeroes.length)];
    }
    set({ selectedSkill: skill });
    get().executeAction(target.combatId);
  },
  _addLog: (message) => {
    set((state) => ({ combatLog: [message, ...state.combatLog] }));
  },
  // === HELPERS ===
  _getCharacterLists: () => {
    const { heroes, enemies } = get();
    return { heroes, enemies, allCharacters: [...heroes, ...enemies] };
  }
}));
export {
  useGameStore
};
