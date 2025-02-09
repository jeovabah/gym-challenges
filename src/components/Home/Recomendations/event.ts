import { createUseStore } from "@/hooks/StatesStore/useStore";

const [useChallenges, setChallenges] = createUseStore<any[]>([]);

export { useChallenges, setChallenges };
