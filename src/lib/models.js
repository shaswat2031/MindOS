import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  plan: { type: String, default: 'Free' },
  onboardingComplete: { type: Boolean, default: false },
  onboardingAnswers: Object,
  mindProfile: {
    scarcityAbundanceScore: Number,
    focusLevel: Number,
    decisionStyle: String,
    primaryBlocker: String,
    insights: [String]
  },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastCheckIn: Date,
  createdAt: { type: Date, default: Date.now },
});

const DecisionSchema = new mongoose.Schema({
  userId: String,
  question: String,
  context: String,
  analysis: Object,
  status: { type: String, default: 'pending' }, // 'pending', 'resolved'
  outcome: String,
  createdAt: { type: Date, default: Date.now },
});

const HabitSchema = new mongoose.Schema({
  userId: String,
  name: String,
  streak: { type: Number, default: 0 },
  history: [{ date: Date, status: String, whyMissed: String }],
  isActive: { type: Boolean, default: true },
});

const CheckInSchema = new mongoose.Schema({
  userId: String,
  energy: String,
  focus: String,
  mood: String,
  intentions: [String],
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model('User', UserProfileSchema);
export const Decision = mongoose.models.Decision || mongoose.model('Decision', DecisionSchema);
export const Habit = mongoose.models.Habit || mongoose.model('Habit', HabitSchema);
export const CheckIn = mongoose.models.CheckIn || mongoose.model('CheckIn', CheckInSchema);
