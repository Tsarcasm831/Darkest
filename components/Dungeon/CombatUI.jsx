import React from 'react';
import { useGameStore } from '../../state/GameState.jsx';
import { useTurnSystem } from '../../hooks/useTurnSystem.js';
import { useCombatLogic } from '../../hooks/useCombatLogic.js';

export default function CombatUI() {
  const combatLog = useGameStore(state => state.combatLog);
  const { activeCharacter, isPlayerTurn, combatState } = useTurnSystem();
  const { selectedSkill, handleSelectSkill } = useCombatLogic();

  const getTurnText = () => {
    if (combatState !== 'ongoing') return 'Combat Over';
    if (!activeCharacter) return 'Determining turn...';
    return `${activeCharacter.name}'s Turn`;
  };

  return (
    <div className="combat-ui">
      <div className="turn-tracker">
        <h2>{getTurnText()}</h2>
      </div>
      <div className="action-bar">
        <h3>Actions</h3>
        <div className="skills">
          {isPlayerTurn &&
            activeCharacter &&
            activeCharacter.skills.map(skill => (
              <button
                key={skill.name}
                className={`skill-button ${selectedSkill?.name === skill.name ? 'selected' : ''}`}
                onClick={() => handleSelectSkill(skill)}
                disabled={combatState !== 'ongoing'}
              >
                {skill.name}
              </button>
            ))}
          {!isPlayerTurn && combatState === 'ongoing' && <p>Awaiting enemy action...</p>}
        </div>
      </div>
      <div className="combat-log">
        <h3>Log</h3>
        <ul>
          {combatLog.slice(0, 10).map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
