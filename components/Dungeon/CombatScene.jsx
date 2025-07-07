import React from 'react';
import { useGameStore } from '../../state/GameState.jsx';
import { useCombatLogic } from '../../hooks/useCombatLogic.js';
import { useTurnSystem } from '../../hooks/useTurnSystem.js';

/* @tweakable Whether to reverse the order of heroes. Set to false for correct order. */
const reverseHeroOrder = false;

function Character({ char, isActive, onTarget, isTargetable }) {
  const hpPercentage = (char.hp / char.maxHp) * 100;
  const stressPercentage = char.stress ? (char.stress / char.maxStress) * 100 : 0;

  const getCharacterClass = () => {
    let classes = `character ${char.type}`;
    if (isActive) classes += ' active';
    if (isTargetable) classes += ' targetable';
    if (char.hp <= 0) classes += ' dead';
    return classes;
  };

  return (
    <div className={getCharacterClass()} onClick={() => isTargetable && onTarget(char.combatId)}>
      {char.affliction && <div className="affliction-text">{char.affliction}</div>}
      <div className="character-name">{char.name}</div>
      <img src={char.image} alt={char.name} className="character-sprite" />
      <div className="character-info-bars">
        <div className="health-bar-bg">
          <div className="health-bar-fg" style={{ width: `${hpPercentage}%` }} />
        </div>
        {char.type === 'hero' && (
          <div className="stress-bar-bg">
            <div className="stress-bar-fg" style={{ width: `${stressPercentage}%` }} />
          </div>
        )}
      </div>
      <div className="hp-text">
        {char.hp} / {char.maxHp}
      </div>
    </div>
  );
}

export default function CombatScene() {
  const { heroes, enemies } = useGameStore(state => ({
    heroes: state.heroes,
    enemies: state.enemies,
  }));
  const { activeCharacter, isPlayerTurn } = useTurnSystem();
  const { selectedSkill, handleTargetSelect } = useCombatLogic();

  const isTargetable = character => {
    if (!isPlayerTurn || !selectedSkill) return false;
    if (character.hp <= 0) return false;

    if (selectedSkill.target === 'enemy' && character.type === 'enemy') return true;
    if (selectedSkill.target === 'hero' && character.type === 'hero') {
      if (selectedSkill.heal && character.hp === character.maxHp) return false;
      if (selectedSkill.stress_damage && character.affliction) return false;
      return true;
    }
    return false;
  };

  return (
    <div className="combat-scene">
      <div className="party">
        {[...heroes]
          .sort((a, b) => (reverseHeroOrder ? b.position - a.position : a.position - b.position))
          .map(hero => (
            <Character
              key={hero.combatId}
              char={hero}
              isActive={activeCharacter?.combatId === hero.combatId}
              onTarget={handleTargetSelect}
              isTargetable={isTargetable(hero)}
            />
          ))}
      </div>
      <div className="enemies">
        {[...enemies].sort((a, b) => a.position - b.position).map(enemy => (
          <Character
            key={enemy.combatId}
            char={enemy}
            isActive={activeCharacter?.combatId === enemy.combatId}
            onTarget={handleTargetSelect}
            isTargetable={isTargetable(enemy)}
          />
        ))}
      </div>
    </div>
  );
}
