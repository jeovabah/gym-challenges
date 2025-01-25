import { SessionProvider } from "./SessionProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
