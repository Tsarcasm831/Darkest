import { useGameStore } from '../state/GameState.jsx';

export function useCombatLogic() {
    const { selectedSkill, setSelectedSkill, executeAction, heroes } = useGameStore(state => ({
        selectedSkill: state.selectedSkill,
        setSelectedSkill: state.setSelectedSkill,
        executeAction: state.executeAction,
        heroes: state.heroes,
    }));

    const handleSelectSkill = (skill) => {
        // if skill is a stress attack, and all heroes are afflicted, don't allow selection.
        if (skill.stress_damage) {
            const livingHeroes = heroes.filter(h => h.hp > 0);
            if (livingHeroes.every(h => h.affliction)) {
                return; // Cannot select skill
            }
        }
        setSelectedSkill(skill);
    };

    const handleTargetSelect = (targetId) => {
        if (selectedSkill) {
            executeAction(targetId);
        }
    };

    return {
        selectedSkill,
        handleSelectSkill,
        handleTargetSelect,
    };
}

