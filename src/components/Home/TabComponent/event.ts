import { createUseStore } from "@/hooks/StatesStore/useStore";

const [useActiveTab, setActiveTab] = createUseStore("challenges");

export { useActiveTab, setActiveTab };
