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
  useEffect(() => {
    const fetchsession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setsession(session);
      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setprofile(data);
      }

      setloading(false);
      initialized.current = true;
    };
    fetchsession();
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!initialized.current) return;
        setsession(session);
        if (session?.user) {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          setprofile(data);
        } else {
          setprofile(null);
        }

        setloading(false);
      },
    );
    return () => {
      listener.subscription.unsubscribe();
    };
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
        // isAdmin: profile?.group === "ADMIN",
      }}
    >
      {children}
    </Authcontext.Provider>
  );
};

export default AuthProvider;
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(Authcontext);
