import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { supabase } from "../supabaseClient.js";

const Authcontext = createContext();
const AuthProvider = ({ children }) => {
  const [session, setsession] = useState(null);
  const [loading, setloading] = useState(true);
  const [profile, setprofile] = useState(null);
  const initialized = useRef(false);

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return data;
  };

  useEffect(() => {
    const fetchsession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setsession(session);

      if (session?.user) {
        const data = await fetchProfile(session.user.id);
        setprofile(data);
      }

      setloading(false);
      initialized.current = true;
    };

    fetchsession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!initialized.current) return;

      if (event === "SIGNED_OUT") {
        setsession(null);
        setprofile(null);
        setloading(false);
        return;
      }

      if (session?.user) {
        setsession(session);
        const data = await fetchProfile(session.user.id);
        setprofile(data);
      } else {
        setprofile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleVisibility = async () => {
      if (document.visibilityState === "visible") {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          setsession(session);
          const data = await fetchProfile(session.user.id);
          setprofile(data);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (session) {
      console.log("updated session:", session);
      console.log("updated session:", session.user.user_metadata?.username);
      console.log("updated profile:", profile);
      console.log("user profile:", profile?.username);
    }
  }, [session, profile]);
  return (
    <Authcontext.Provider
      value={{
        session,
        loading,
        setprofile,
        setsession,
        profile,
        setloading,
      }}
    >
      {children}
    </Authcontext.Provider>
  );
};

export default AuthProvider;
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(Authcontext);
