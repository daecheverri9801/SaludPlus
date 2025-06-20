import React, { useEffect, useState } from "react";
import { client } from "../supabase/client";
import { useNavigate } from "react-router";

export function MedicalAuthGuard({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { user },
      } = await client.auth.getUser();

      if (user) {
        const { data: userData } = await client
          .from("usuarios")
          .select("es_medico")
          .eq("id", user.id)
          .single();

        if (userData?.es_medico) {
          navigate("/medical-dashboard");
        }
      }

      setLoading(false);
      setAccessGranted(true);
    };

    checkAccess();
  }, [navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return accessGranted ? children : null;
}
