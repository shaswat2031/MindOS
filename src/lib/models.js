import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  plan: { type: String, enum: ['Free', 'Core', 'Growth'], default: 'Free' },
  planType: { type: String, enum: ['monthly', 'yearly', 'free'], default: 'free' },
  onboardingComplete: { type: Boolean, default: false },
  onboardingAnswers: Object,
  monthlyUsage: { type: Number, default: 0 },
  lastUsageReset: { type: Date, default: Date.now },
  mindProfile: {
    scarcityAbundanceScore: Number,
    focusLevel: Number,
    decisionStyle: String,
    primaryBlocker: String,
    insights: [String]
  },
  badges: [{ name: String, icon: String, awardedAt: { type: Date, default: Date.now } }],
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
  clarityBefore: Number,
  clarityAfter: Number,
  status: { type: String, default: 'pending' }, // 'pending', 'resolved'
  outcomeStatus: { 
    type: String, 
    enum: ['awaiting', 'executed', 'pivoted', 'abandoned', 'regretted'], 
    default: 'awaiting' 
  },
  executionDeadline: Date,
  outcomeNotes: String,
  createdAt: { type: Date, default: Date.now },
});

const HabitSchema = new mongoose.Schema({
  userId: String,
  name: String,
  streak: { type: Number, default: 0 },
  history: [{ date: Date, status: String, whyMissed: String }],
  isActive: { type: Boolean, default: true },
});

const DailyCheckInSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  question: String,
  answer: String,
  createdAt: { type: Date, default: Date.now },
});

const CheckInSchema = new mongoose.Schema({
  userId: String,
  energy: String,
  focus: String,
  mood: String,
  intentions: [String],
  createdAt: { type: Date, default: Date.now },
});

const SkillStackSchema = new mongoose.Schema({
  userId: String,
  currentSkills: [String],
  currentJob: String,
  futureValueScore: Number, // % value in 2030
  gapAnalysis: String,
  recommendedStack: [String],
  roadmap: [{ day: Number, task: String, resources: [String] }],
  createdAt: { type: Date, default: Date.now },
});

const CircleSchema = new mongoose.Schema({
  name: String,
  members: [String], // Array of clerkIds
  focusArea: String,
  leaderboard: [{ userId: String, name: String, score: Number }],
  createdAt: { type: Date, default: Date.now },
});

const MentorMessageSchema = new mongoose.Schema({
  userId: String,
  role: { type: String, enum: ['user', 'assistant'] },
  content: String,
  timestamp: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model('User', UserProfileSchema);
export const Decision = mongoose.models.Decision || mongoose.model('Decision', DecisionSchema);
export const Habit = mongoose.models.Habit || mongoose.model('Habit', HabitSchema);
export const CheckIn = mongoose.models.CheckIn || mongoose.model('CheckIn', CheckInSchema);
export const SkillStack = mongoose.models.SkillStack || mongoose.model('SkillStack', SkillStackSchema);
export const Circle = mongoose.models.Circle || mongoose.model('Circle', CircleSchema);
export const MentorMessage = mongoose.models.MentorMessage || mongoose.model('MentorMessage', MentorMessageSchema);
export const DailyCheckIn = mongoose.models.DailyCheckIn || mongoose.model('DailyCheckIn', DailyCheckInSchema);

const IntegritySystemSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  lifeGoal: { type: String, default: '' },
  weeklyGoal: { type: String, default: '' },
  dailyTasks: [{
    id: String,
    text: String,
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  updatedAt: { type: Date, default: Date.now }
});

export const IntegritySystem = mongoose.models.IntegritySystem || mongoose.model('IntegritySystem', IntegritySystemSchema);

const WeeklyReportSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  weekIdentifier: { type: String, required: true }, // Format: YYYY-WW (e.g., 2024-18)
  reportData: Object,
  createdAt: { type: Date, default: Date.now }
});

WeeklyReportSchema.index({ userId: 1, weekIdentifier: 1 }, { unique: true });
// Compound index to ensure one report per user per week

export const WeeklyReport = mongoose.models.WeeklyReport || mongoose.model('WeeklyReport', WeeklyReportSchema);
