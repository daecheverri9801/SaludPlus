import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="public-footer">
      <p>© 2025 SaludPlus - Todos los derechos reservados</p>
      <div className="footer-links">
        <a href="/contacto">Contacto</a>
        <a href="/privacidad">Política de privacidad</a>
        <a href="/terminos">Términos de servicio</a>
      </div>
    </div>
  );
};

export default Footer;
