import React, { useEffect, useState } from "react";
import { useStorageState } from "@/hooks/useStorageState";
import { showToast } from "@/utils/toast";
import { RegisterProps } from "@/stores/RegisterStore";
import { login, signUp } from "@/api/auth";
import { getUserGamer } from "@/api/user";

type UserMetadata = {
  confirmation_sent_at: string;
  email: string;
  email_verified: boolean;
  name: string;
  phone_verified: boolean;
  sub: string;
};

type Identity = {
  identity_id: string;
  id: string;
  user_id: string;
  identity_data: UserMetadata;
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
  email: string;
};

type AuthUser = {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: UserMetadata;
  identities: Identity[];
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
};

type GameUser = {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string | null;
  elo_id: string;
  points: number;
  created_at: string;
};

type User = {
  auth: AuthUser;
  game: GameUser;
};

type AuthContextType = {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  register: (props: RegisterProps) => Promise<any>;
  session?: string | null;
  user?: User | null;
  isLoading: boolean;
  getUser: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType>({
  signIn: async () => {},
  signOut: () => null,
  session: null,
  user: null,
  isLoading: false,
  register: async () => {},
  getUser: async () => {},
});

export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [[userLoading, user], setUser] = useStorageState("user");
  const [loading, setLoading] = useState(false);

  const getUser = async () => {
    const userData = JSON.parse(user || "");
    const game = await getUserGamer(userData.auth.id || "");
    const userStore = {
      auth: userData.auth,
      game: game,
    };

    setUser(JSON.stringify(userStore));
  };

  const loadStorageData = async () => {
    try {
      setLoading(true);
      await getUser();
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadStorageData();
    }
  }, [session]);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      if (response?.session.session.access_token) {
        const { session, user } = response;
        setSession(session.session.access_token);

        const userData = {
          auth: session.user,
          game: user[0],
        };

        setUser(JSON.stringify(userData));
      } else {
        throw new Error("Não foi possível realizar o login");
      }
    } catch (error: any) {
      showToast("error", error.message);
      throw error;
    }
  };

  const signOut = () => {
    setSession(null);
    setUser(null);
  };

  const register = async (props: RegisterProps) => {
    try {
      const data = await signUp(props.email, props.password, props.name);
      if (data?.session?.access_token) {
        const { session, ...userData } = data;
        setSession(session.access_token);
        setUser(JSON.stringify(userData));
      }

      return data;
    } catch (error: any) {
      showToast("error", error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        user: user ? JSON.parse(user) : null,
        isLoading: isLoading || userLoading || loading,
        register,
        getUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
