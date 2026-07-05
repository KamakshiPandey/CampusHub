
const TRAITS = ['sleepSchedule', 'cleanliness', 'smoking', 'pets', 'studyHabits', 'socialLevel', 'guestsFrequency'];

const calculateMatchPercentage = (userA, userB) => {
  if (!userA.quizCompleted || !userB.quizCompleted) return null;

  let totalWeight = 0;
  let score = 0;

  TRAITS.forEach((trait) => {
    const a = userA[trait];
    const b = userB[trait];
    if (!a || !b) return;

    totalWeight += 1;

    if (a === b) {
      score += 1;
    } else if (
      (trait === 'sleepSchedule' && (a === 'flexible' || b === 'flexible')) ||
      (trait === 'smoking' && (a === 'no_preference' || b === 'no_preference')) ||
      (trait === 'pets' && (a === 'okay_with_pets' || b === 'okay_with_pets')) ||
      (trait === 'socialLevel' && (a === 'balanced' || b === 'balanced'))
    ) {
      score += 0.6;
    } else {
      score += 0.15;
    }
  });

  if (totalWeight === 0) return null;
  return Math.round((score / totalWeight) * 100);
};

module.exports = { calculateMatchPercentage, TRAITS };
