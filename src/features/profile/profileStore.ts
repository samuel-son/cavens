import { create } from "zustand";

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  accountType: string;
  covenantGoal: string;
  joinedAt: string;
  avatar?: string | null;
}

interface ProfileState {
  profile: UserProfile;
  setProfile: (profile: Partial<UserProfile>) => void;
}

const defaultProfile: UserProfile = {
  fullName: "Samuel Doe",
  email: "hello@cavens.com",
  phone: "024 000 0000",
  location: "Accra, Ghana",
  accountType: "Covenant Saver",
  covenantGoal: "Build a gold savings vault",
  joinedAt: new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }),
  avatar: null,
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: defaultProfile,
  setProfile: (profile) =>
    set((state) => ({
      profile: { ...state.profile, ...profile },
    })),
}));
