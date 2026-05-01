import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMindStore = create(
  persist(
    (set) => ({
      userProfile: {
        name: 'Ravi',
        plan: 'Free',
        mindProfile: null,
      },
      onboardingComplete: false,
      onboardingAnswers: {},
      decisions: [],
      checkIns: [],
      habits: [],
      patterns: [],
      xp: 140,
      level: 4,
      badges: [],
      circles: [],
      growthCircle: null,
      
      // Actions
      setUserProfile: (profile) => set({ userProfile: profile }),
      setOnboardingComplete: (status) => set({ onboardingComplete: status }),
      setOnboardingAnswers: (answers) => set({ onboardingAnswers: answers }),
      
      setHabits: (habits) => set({ habits }),
      updateHabit: async (id, status) => {
        set((state) => ({
          habits: state.habits.map((h) => 
            h.id === id ? { ...h, status } : h
          ),
          xp: status === 'done' ? state.xp + 10 : state.xp
        }));
      },
      
      addDecision: (decision) => set((state) => ({ 
        decisions: [decision, ...state.decisions],
        xp: state.xp + 50
      })),
      
      addCheckIn: (checkIn) => set((state) => ({ 
        checkIns: [checkIn, ...state.checkIns],
        xp: state.xp + 20
      })),
      
      addXP: (amount) => set((state) => {
        const newXP = state.xp + amount;
        const newLevel = Math.floor(newXP / 1000) + 4; // Starting at level 4 for demo
        return { xp: newXP, level: newLevel };
      }),
      
      addBadge: (badge) => set((state) => ({ badges: [...state.badges, badge] })),
      setGrowthCircle: (circle) => set({ growthCircle: circle }),
    }),
    {
      name: 'mindos-storage',
    }
  )
);
