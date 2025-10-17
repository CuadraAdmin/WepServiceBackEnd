import { useState } from "react";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Facebook,
  Instagram,
  ChartColumnStacked,
} from "lucide-react";
import Menu from "../Menu";
import ApiConfig from "../Config/api.config";
import { useAuth } from "../../hooks/useAuth";

function Login() {
  const { isAuthenticated, userData, login, logout, isLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = ApiConfig.getUrl(ApiConfig.ENDPOINTSUSUARIOS.LOGIN);

      const response = await fetch(url, {
        method: "POST",
        headers: ApiConfig.getHeaders(),
        body: JSON.stringify({
          usuario: formData.username,
          contrasena: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.exito) {
        login({
          token: data.token,
          usuario: data.usuario,
          mensaje: data.mensaje,
        });
      } else {
        setError(data.mensaje || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error(" Error al hacer login:", err);
      setError(
        "Error al conectar con el servidor. Verifica que la API esté corriendo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = () => {
    logout();
    setFormData({ username: "", password: "" });
    setError("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-stone-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-stone-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600 font-medium">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  // ✅ Si está autenticado, mostrar el menú
  if (isAuthenticated && userData) {
    return <Menu userData={userData} onLogout={handleLogout} />;
  }

  // 🔐 Mostrar formulario de login
  return (
    <div className="min-h-screen w-full flex bg-stone-100">
      {/* Parte izquierda */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 76, 0.3), transparent 50%), linear-gradient(135deg, #5c4033 0%, #6b5345 50%, #7a6456 100%)`,
        }}
        onMouseMove={handleMouseMove}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-amber-200 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-200 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-16">
          <img
            src="/modelo.webp"
            alt="Logo"
            className="w-64 h-auto"
            style={{
              width: "46rem",
              height: "auto",
            }}
          />
        </div>
      </div>

      {/* Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-center">
            <img
              src="/logo.svg"
              alt="Logo"
              className="w-64 h-auto"
              style={{
                width: "16rem",
                height: "auto",
              }}
            />
          </div>

          <div className="text-left">
            <div
              className="inline-block p-3 rounded-2xl mb-6"
              style={{
                background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
              }}
            >
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-3 text-stone-900">
              Inicio de sesión
            </h1>
            <p className="text-lg text-stone-600">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium block text-stone-700"
                style={{ fontWeight: "bold" }}
              >
                Usuario
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors"
                  style={{ color: "#8b6f47" }}
                />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl transition-all outline-none border-2 bg-white text-stone-900 placeholder-stone-400"
                  style={{
                    borderColor: "#d6d3d1",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#8b6f47";
                    e.target.style.boxShadow =
                      "0 10px 15px -3px rgba(139, 111, 71, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#d6d3d1";
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="Ingresa tu usuario"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium block text-stone-700"
                style={{ fontWeight: "bold" }}
              >
                Contraseña
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors"
                  style={{ color: "#8b6f47" }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-14 py-4 rounded-xl transition-all outline-none border-2 bg-white text-stone-900 placeholder-stone-400"
                  style={{
                    borderColor: "#d6d3d1",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#8b6f47";
                    e.target.style.boxShadow =
                      "0 10px 15px -3px rgba(139, 111, 71, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#d6d3d1";
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}
            <br />
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-4 rounded-xl font-semibold text-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                background: "linear-gradient(135deg, #6b5345 0%, #8b6f47)",
                boxShadow: "0 10px 25px -5px rgba(107, 83, 69, 0.4)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.boxShadow =
                    "0 20px 35px -5px rgba(107, 83, 69, 0.5)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow =
                  "0 10px 25px -5px rgba(107, 83, 69, 0.4)";
              }}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              {loading && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
            </button>

            {/* sociales*/}
            <div className="pt-4">
              <div className="flex justify-center gap-4 mt-6">
                <a
                  href="https://www.facebook.com/share/1GdksZysJU/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 transform hover:scale-110"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                    boxShadow: "0 4px 12px rgba(107, 83, 69, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(107, 83, 69, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(107, 83, 69, 0.3)";
                  }}
                >
                  <Facebook className="w-6 h-6 text-white" />
                </a>

                <a
                  href="https://www.instagram.com/cuadralifestyle?igsh=MmcwZWZydWZtenVj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 transform hover:scale-110"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                    boxShadow: "0 4px 12px rgba(107, 83, 69, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(107, 83, 69, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(107, 83, 69, 0.3)";
                  }}
                >
                  <Instagram className="w-6 h-6 text-white" />
                </a>
                <a
                  href="https://gcuadra.sharepoint.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 transform hover:scale-110"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                    boxShadow: "0 4px 12px rgba(107, 83, 69, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(107, 83, 69, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(107, 83, 69, 0.3)";
                  }}
                >
                  <ChartColumnStacked className="w-6 h-6 text-white" />
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
