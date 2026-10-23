export const NAV = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/studio', label: '3D Studio', icon: '🌐' },
  { to: '/journey', label: 'Fitness Journey', icon: '🧭' },
  { to: '/workout', label: 'Workout', icon: '🏋️' },
  { to: '/exercises', label: 'Exercises', icon: '💪' },
  { to: '/diet', label: 'Diet & Protein', icon: '🥗' },
  { to: '/bmi', label: 'BMI Calculator', icon: '⚖️' },
  { to: '/goals', label: 'Goals', icon: '🎯' },
  { to: '/results', label: 'Results', icon: '📈' },
];

export const FEATURES = [
  { icon: '🏋️', title: 'Train with a plan', text: 'Six workout styles, from upper body splits to cardio, built for every level.', to: '/workout' },
  { icon: '🥗', title: 'Eat for results', text: 'Simple protein and meal guidance you can follow without counting everything.', to: '/diet' },
  { icon: '⚖️', title: 'Know your numbers', text: 'Check your BMI in seconds and see what it means for your goals.', to: '/bmi' },
  { icon: '📈', title: 'See your progress', text: 'Track workouts, streaks and milestones in one clear dashboard.', to: '/results' },
];

export const JOURNEY = [
  { icon: '🎯', title: 'Set a clear goal', text: 'Pick one target, such as losing 5 kg or doing 10 push-ups, and a date to reach it.' },
  { icon: '📚', title: 'Learn the basics', text: 'Master form on squats, push-ups and planks before adding weight.' },
  { icon: '🗓️', title: 'Build the habit', text: 'Start with three 30-minute sessions a week and protect those slots in your calendar.' },
  { icon: '📈', title: 'Progress gradually', text: 'Add a rep, a set or a little weight each week. Small increases add up.' },
  { icon: '🏆', title: 'Own the lifestyle', text: 'Sleep, food and training work as one system. Keep all three steady.' },
];

export const LEVELS = [
  { tag: 'Beginner', icon: '🌱', title: 'Weeks 1 to 8', text: 'Bodyweight moves, 3 days a week, 20 to 30 minutes. Focus on form and showing up.' },
  { tag: 'Intermediate', icon: '🔥', title: 'Months 3 to 8', text: 'Add dumbbells and barbells, split your training, and train 4 to 5 days a week.' },
  { tag: 'Advanced', icon: '⚡', title: 'Month 9 and beyond', text: 'Periodised programs, heavy compound lifts and planned deload weeks.' },
];

export const CONSISTENCY = [
  'Schedule workouts like meetings and keep them short on busy days.',
  'Miss a session? Do not double up. Just get back on track the next day.',
  'Sleep 7 to 9 hours. Recovery is when your muscles actually grow.',
  'Track every session. What you measure, you improve.',
  'Rest 1 to 2 days a week to avoid burnout and injury.',
];

export const WORKOUTS = [
  { cat: 'Upper Body', icon: '💪', text: 'Chest, back, shoulders and arms for a strong, balanced upper frame.', time: '40 min', freq: '2x / week' },
  { cat: 'Lower Body', icon: '🦵', text: 'Squats, lunges and hinges to build powerful legs and glutes.', time: '45 min', freq: '2x / week' },
  { cat: 'Core', icon: '🧱', text: 'Abs, obliques and lower back for stability and better posture.', time: '20 min', freq: '3x / week' },
  { cat: 'Full Body', icon: '🔥', text: 'Train every major muscle in one session. Perfect for busy weeks.', time: '50 min', freq: '3x / week' },
  { cat: 'Strength', icon: '🏆', text: 'Heavy compound lifts in low rep ranges to get measurably stronger.', time: '60 min', freq: '3x / week' },
  { cat: 'Cardio', icon: '🏃', text: 'Running, rowing and intervals to boost stamina and burn fat.', time: '30 min', freq: '3x / week' },
];

export const EXERCISES = [
  { n: 'Push-Ups', c: 'Upper Body', m: 'Chest, triceps', d: 'Beginner', t: 'Keep your body in a straight line and lower until your chest nearly touches the floor.', s: '3 x 10-15' },
  { n: 'Pull-Ups', c: 'Upper Body', m: 'Back, biceps', d: 'Advanced', t: 'Pull your chin over the bar without swinging. Use a band if you need help.', s: '4 x 6-8' },
  { n: 'Dumbbell Shoulder Press', c: 'Upper Body', m: 'Shoulders, triceps', d: 'Intermediate', t: 'Press overhead from shoulder height while keeping your ribs down.', s: '3 x 10-12' },
  { n: 'Bodyweight Squats', c: 'Lower Body', m: 'Quads, glutes', d: 'Beginner', t: 'Sit back and down with chest up, then drive through your heels.', s: '3 x 15' },
  { n: 'Romanian Deadlift', c: 'Lower Body', m: 'Hamstrings, glutes', d: 'Intermediate', t: 'Hinge at the hips with a flat back until you feel the hamstrings stretch.', s: '3 x 8-10' },
  { n: 'Walking Lunges', c: 'Lower Body', m: 'Quads, glutes', d: 'Beginner', t: 'Take long steps and lower your back knee towards the floor.', s: '3 x 12 / leg' },
  { n: 'Plank', c: 'Core', m: 'Abs, lower back', d: 'Beginner', t: 'Hold a straight line from head to heels and squeeze your glutes.', s: '3 x 30-45 sec' },
  { n: 'Hanging Leg Raises', c: 'Core', m: 'Lower abs', d: 'Advanced', t: 'Raise straight legs to hip height with no swinging.', s: '3 x 10' },
  { n: 'Russian Twists', c: 'Core', m: 'Obliques', d: 'Intermediate', t: 'Lean back slightly and rotate your torso side to side.', s: '3 x 20' },
  { n: 'Burpees', c: 'Full Body', m: 'Full body, heart', d: 'Intermediate', t: 'Drop to a push-up, jump your feet in, then explode upward.', s: '4 x 10' },
  { n: 'Kettlebell Swings', c: 'Full Body', m: 'Glutes, back, shoulders', d: 'Intermediate', t: 'Snap your hips forward and let the bell float to chest height.', s: '4 x 15' },
  { n: 'Barbell Back Squat', c: 'Strength', m: 'Legs, core', d: 'Advanced', t: 'Brace your core, squat to parallel and stand tall with control.', s: '5 x 5' },
  { n: 'Bench Press', c: 'Strength', m: 'Chest, triceps', d: 'Intermediate', t: 'Plant your feet, lower the bar to mid-chest and press up.', s: '4 x 6-8' },
  { n: 'Deadlift', c: 'Strength', m: 'Back, glutes, legs', d: 'Advanced', t: 'Keep the bar close, push the floor away and lock out your hips.', s: '5 x 3-5' },
  { n: 'Jump Rope', c: 'Cardio', m: 'Calves, heart', d: 'Beginner', t: 'Stay light on your toes and turn the rope with your wrists.', s: '5 x 1 min' },
  { n: 'Sprint Intervals', c: 'Cardio', m: 'Legs, heart', d: 'Intermediate', t: 'Sprint hard for 30 seconds, then walk for 60 seconds.', s: '8 x 30 sec' },
  { n: 'Rowing Machine', c: 'Cardio', m: 'Back, legs, heart', d: 'Intermediate', t: 'Drive with the legs first, then lean back and pull the handle.', s: '20 min steady' },
];

export const DIET = [
  { icon: '🍽️', title: 'Nutrition basics', tips: ['Build each plate: half veggies, a quarter protein, a quarter carbs.', 'Eat 3 main meals and 1 to 2 snacks.', 'Mostly whole foods; keep processed food occasional.', 'To lose fat, eat a small deficit. To gain muscle, a small surplus.'] },
  { icon: '🥚', title: 'Healthy food ideas', tips: ['Protein: eggs, chicken, fish, paneer, tofu, lentils, Greek yogurt.', 'Carbs: oats, rice, sweet potato, whole wheat roti, fruit.', 'Fats: nuts, seeds, avocado, olive oil.', 'Veggies: spinach, broccoli, carrots, peppers.'] },
  { icon: '⚡', title: 'Pre-workout', tips: ['Eat 1 to 2 hours before training.', 'Pick carbs plus a little protein, like a banana with peanut butter.', 'Avoid heavy, greasy meals right before you train.', 'Drink a glass of water 30 minutes before.'] },
  { icon: '🔄', title: 'Post-workout', tips: ['Eat within 1 to 2 hours after training.', 'Aim for 20 to 40 g of protein plus carbs.', 'Try a whey shake with fruit, or rice with chicken and veggies.', 'Rehydrate and replace lost salts.'] },
  { icon: '💧', title: 'Hydration', tips: ['Drink about 2.5 to 3.5 litres of water a day.', 'Add 500 to 750 ml for every hour of hard training.', 'Pale yellow urine means you are well hydrated.', 'Coconut water or electrolytes help in long sessions.'] },
];

export const PROTEIN = [
  { f: 'Chicken breast (100 g)', p: 31 }, { f: 'Eggs (2 large)', p: 12 }, { f: 'Paneer (100 g)', p: 18 },
  { f: 'Greek yogurt (170 g)', p: 17 }, { f: 'Cooked lentils (1 cup)', p: 18 }, { f: 'Tofu (100 g)', p: 8 },
];

export const GOALS = [
  { icon: '💪', title: 'Muscle gain', text: 'Lift heavy, eat in a small surplus and recover well.', focus: ['Train 4 days a week', '1.6 to 2.2 g protein per kg', 'Progressive overload'], cat: 'Strength' },
  { icon: '🔥', title: 'Fat loss', text: 'Burn more than you eat while keeping the muscle you have.', focus: ['Moderate calorie deficit', '8,000+ steps a day', 'Lift plus cardio'], cat: 'Cardio' },
  { icon: '🏆', title: 'Strength', text: 'Get stronger on the big lifts with lower reps and longer rests.', focus: ['Squat, bench, deadlift', '3 to 6 reps per set', 'Rest 2 to 3 minutes'], cat: 'Strength' },
  { icon: '🏅', title: 'Fitness', text: 'Look, move and feel athletic with a balanced routine.', focus: ['Mix strength and cardio', 'Mobility twice a week', '3 to 4 sessions a week'], cat: 'Full Body' },
  { icon: '🏃', title: 'Endurance', text: 'Last longer, run further and recover faster.', focus: ['Zone 2 cardio', 'Weekly long session', 'Interval training'], cat: 'Cardio' },
  { icon: '❤️', title: 'General health', text: 'Move daily, sleep well and keep stress in check.', focus: ['150 min activity weekly', '7 to 9 hours sleep', 'Walk after meals'], cat: 'Full Body' },
];

export const STATS = [
  { icon: '🏋️', label: 'Workouts done', value: '48', pct: 80 },
  { icon: '🔥', label: 'Calories burned', value: '18,400 kcal', pct: 65 },
  { icon: '⏱️', label: 'Active time', value: '36 hrs', pct: 72 },
  { icon: '⚖️', label: 'Weight change', value: '-4.2 kg', pct: 58 },
];

export const WEEK = [
  { d: 'Mon', v: 60 }, { d: 'Tue', v: 40 }, { d: 'Wed', v: 85 }, { d: 'Thu', v: 8 },
  { d: 'Fri', v: 70 }, { d: 'Sat', v: 95 }, { d: 'Sun', v: 30 },
];

export const ACHIEVEMENTS = [
  { icon: '🥇', title: 'First workout', text: 'You started. That is the hardest step.', done: true },
  { icon: '🔥', title: '7-day streak', text: 'A full week of showing up.', done: true },
  { icon: '💯', title: '25 sessions', text: 'Twenty-five workouts logged.', done: true },
  { icon: '🏔️', title: '100 kg club', text: 'Lift 100 kg on any compound lift.', done: false },
  { icon: '⚡', title: '30-day streak', text: 'Train every planned day for a month.', done: false },
  { icon: '🏆', title: 'Goal reached', text: 'Hit your main body goal.', done: false },
];
