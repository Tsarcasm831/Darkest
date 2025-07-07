import { useEffect } from 'react';
import { useGameStore } from '../state/GameState.jsx';

/* @tweakable Delay in milliseconds for the AI to take its turn */
const aiActionDelay = 1000;

export function useTurnSystem() {
    const { 
        turnQueue, 
        currentTurnIndex, 
        isPlayerTurn, 
        runEnemyAI, 
        combatState,
        gameInitialized
    } = useGameStore(state => ({
        turnQueue: state.turnQueue,
        currentTurnIndex: state.currentTurnIndex,
        isPlayerTurn: state.isPlayerTurn,
        runEnemyAI: state.runEnemyAI,
        combatState: state.combatState,
        gameInitialized: state.gameInitialized
    }));

    const allCharacters = useGameStore(state => [...state.heroes, ...state.enemies]);
    
    const activeCharacter = gameInitialized ? allCharacters.find(c => c.combatId === turnQueue[currentTurnIndex]) : null;

    useEffect(() => {
        if (!isPlayerTurn && combatState === 'ongoing' && gameInitialized) {
            const timer = setTimeout(() => {
                runEnemyAI();
            }, aiActionDelay); // Delay for AI action
            return () => clearTimeout(timer);
        }
    }, [isPlayerTurn, currentTurnIndex, combatState, runEnemyAI, gameInitialized]);

    return {
        activeCharacter,
        isPlayerTurn,
        combatState,
        gameInitialized,
    };
}