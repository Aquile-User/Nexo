// Remove the background image import
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../styles/inicioSesion.css';
import nexoLogo from '../assets/nexo-logo.png';
import loginImage from '../assets/login-illustration.jpg';
import authService from '../services/authService';

function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    keepLoggedIn: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Por favor ingresa un email válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        await authService.login(formData.email, formData.password);
        navigate('/dashboard');
      } catch (error) {
        setErrors({ submit: error.message || 'Error al iniciar sesión. Por favor intenta de nuevo.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="page-wrapper">
      <header className="logo-container">
        <div className="logo-icon">
          <img src={nexoLogo} alt="Nexo Logo" />
        </div>
        <span>Nexo</span>
      </header>

      <main className="login-container">
        <div className="login-form-section">
          <div className="login-content">
            <div className="login-header">
              <h1 style={{ color: 'var(--primary-color)' }}>Bienvenido de nuevo</h1>
              <p style={{ color: 'var(--text-light)' }}>Ingresa tus credenciales para acceder a tu cuenta</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ingresa tu correo electrónico"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <div className="password-label-wrapper">
                  <label htmlFor="password">Contraseña</label>
                </div>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                    className={errors.password ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-options">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    name="keepLoggedIn"
                    checked={formData.keepLoggedIn}
                    onChange={handleChange}
                  />
                  <label htmlFor="keepLoggedIn">Mantener sesión iniciada</label>
                </div>
              </div>

              <button
                type="submit"
                className={`sign-in-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  'Iniciar sesión'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <div className="decorative-element">
        <div className="decorative-pattern"></div>
        <div className="decorative-content">
          <img
            src={loginImage}
            alt="Ilustración de inicio de sesión"
            className="decorative-image"
          />
          <div className="decorative-text">
            <h2>Transforma tu forma de trabajar</h2>
            <p>Conecta con tu equipo, gestiona evaluaciones y alcanza tus objetivos de manera más eficiente.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
