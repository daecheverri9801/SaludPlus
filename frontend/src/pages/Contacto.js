import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles.css';

function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validación simple
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    // Aquí puedes agregar la lógica para enviar el formulario
    // Por ejemplo, una llamada a una API para enviar el mensaje

    setSuccess(true);
    setFormData({ nombre: '', email: '', mensaje: '' }); // Reiniciar el formulario
  };

  return (
    <div className="contacto-page-container">
      <Navbar />
      <div className="contacto-content">
        <h1>Contacto</h1>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">¡Mensaje enviado con éxito!</div>}
        <form onSubmit={handleSubmit} className="contacto-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre*</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Tu nombre"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Tu correo electrónico"
            />
          </div>
          <div className="form-group">
            <label htmlFor="mensaje">Mensaje*</label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              required
              placeholder="Escribe tu inquietud aquí"
            />
          </div>
          <button type="submit" className="contacto-button">Enviar</button>
        </form>
        <div className="contacto-footer">
          <p>Gracias por contactarnos. Nos pondremos en contacto contigo pronto.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Contacto;