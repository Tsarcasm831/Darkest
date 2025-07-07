import React, { useEffect, useState } from 'react';
import { useGameStore } from '../state/GameState.jsx';
import CombatScene from '../components/Dungeon/CombatScene.jsx';
import CombatUI from '../components/Dungeon/CombatUI.jsx';

const playerDamageMultiplier = 1;
const enemyDamageMultiplier = 1;

export default function CombatScreen() {
  const { initializeCombat, combatState, gameInitialized } = useGameStore(state => ({
    initializeCombat: state.initializeCombat,
    combatState: state.combatState,
    gameInitialized: state.gameInitialized,
  }));

  const [isLoading, setIsLoading] = useState(true);

  const loadGameData = async () => {
    setIsLoading(true);
    try {
      const [heroResponse, enemyResponse] = await Promise.all([
        fetch('./data/heroes.json'),
        fetch('./data/enemies.json'),
      ]);
      const heroData = await heroResponse.json();
      const enemyData = await enemyResponse.json();

      const finalHeroData = heroData.map(h => ({
        ...h,
        damage: Math.round(h.damage * playerDamageMultiplier),
      }));
      const scaledEnemyData = enemyData.map(e => ({
        ...e,
        damage: Math.round(e.damage * enemyDamageMultiplier),
      }));

      initializeCombat(finalHeroData, scaledEnemyData);
    } catch (error) {
      console.error('Failed to load game data:', error);
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
    return <div>Loading Combat...</div>;
  }

  return (
    <div className="combat-screen">
      <CombatScene />
      <CombatUI />
      {combatState !== 'ongoing' && (
        <div className="combat-overlay">
          <div className="combat-result-popup">
            <h1>{combatState === 'victory' ? 'Victory Achieved' : 'A Fateful Defeat'}</h1>
            <p>
              {combatState === 'victory'
                ? 'The fiends are vanquished... for now.'
                : 'Ruin has come to our family.'}
            </p>
            <button onClick={handleRestart}>Try Again</button>
          </div>
        </div>
      )}
    </div>
  );
}
