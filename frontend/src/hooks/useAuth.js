import { useEffect, useState } from "react";
import { client } from "../supabase/client";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await client.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkAuth();
  }, []);

  return { user, loading };
};