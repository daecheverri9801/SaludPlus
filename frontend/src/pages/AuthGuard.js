import { useEffect } from "react";
import { useNavigate } from "react-router";
import { client } from "../supabase/client";

export function AuthGuard({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await client.auth.getUser();
      if (!user) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  return children;
}
