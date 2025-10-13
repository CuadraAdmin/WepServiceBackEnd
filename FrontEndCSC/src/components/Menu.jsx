import { useState } from "react";
import { User, Home, Users, Shield, BarChart3, Layout } from "lucide-react";
import Navbar from "./navbar";

function Menu({ userData, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const usuario = userData?.usuario || {};
  const perfiles = usuario.perfiles || [];

  const menuItems = [
    { icon: Home, label: "Inicio", path: "/" },
    { icon: Users, label: "Usuarios", path: "/usuarios" },
    { icon: Shield, label: "Perfiles", path: "/perfiles" },
    { icon: Layout, label: "Permisos", path: "/permisos" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Navbar Component */}
      <Navbar
        userData={userData}
        onLogout={onLogout}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 bg-white border-r border-stone-200 transition-all duration-300 z-40 ${
          isSidebarOpen ? "w-54" : "w-20"
        }`}
      >
        <div className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-stone-50 transition-all group"
              style={{
                color: "#6b5345",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(107, 83, 69, 0.1) 0%, rgba(139, 111, 71, 0.1) 100%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900 mb-2">
              Bienvenido, {usuario.usua_Nombre?.split(" ")[0]}
            </h1>
            <p className="text-stone-600">
              Panel de administración del sistema
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Card 1 - Info del Usuario */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                  }}
                >
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900">Usuario</h3>
                  <p className="text-sm text-stone-600">
                    {usuario.usua_Usuario}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-stone-600">
                  <span className="font-medium">Correo:</span>{" "}
                  {usuario.usua_Correo}
                </p>
                <p className="text-stone-600">
                  <span className="font-medium">Teléfono:</span>{" "}
                  {usuario.usua_Telefono}
                </p>
              </div>
            </div>

            {/* Card 2 - Perfiles */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                  }}
                >
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900">Perfiles</h3>
                  <p className="text-sm text-stone-600">
                    {perfiles.length} asignados
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {perfiles.map((perfil) => (
                  <div
                    key={perfil.perf_Id}
                    className="p-3 rounded-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(107, 83, 69, 0.05) 0%, rgba(139, 111, 71, 0.05) 100%)",
                    }}
                  >
                    <p className="text-sm font-medium text-stone-900">
                      {perfil.perf_Nombre}
                    </p>
                    <p className="text-xs text-stone-600 mt-1">
                      {perfil.perf_Descripcion}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3 - Estado */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                  }}
                >
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900">Estado</h3>
                  <p className="text-sm text-stone-600">Sistema</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-600">
                    Estado de cuenta:
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Activo
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-600">Sesión:</span>
                  <span className="text-sm font-medium text-stone-900">
                    Válida
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info adicional */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
            <h2 className="text-xl font-bold text-stone-900 mb-4">
              Información de Sesión
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-stone-500 mb-1">ID de Usuario</p>
                <p className="text-base font-medium text-stone-900">
                  {usuario.usua_Id}
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-500 mb-1">
                  Token (primeros 50 caracteres)
                </p>
                <p className="text-xs font-mono text-stone-700 break-all">
                  {userData?.token?.substring(0, 50)}...
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Menu;
