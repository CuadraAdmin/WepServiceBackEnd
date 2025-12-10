import { useState } from "react";
import {
  User,
  Home,
  Users,
  Shield,
  Layout,
  Tag,
  Building2,
  Globe,
} from "lucide-react";
import Navbar from "./Navbar";
import Permisos from "./CU/Permisos/Permisos";
import Usuario from "./CU/Usuarios/Usuario";
import Perfil from "./CU/Perfiles/Perfil";
import Marcas from "./CM/Marcas";
import { usePermissions } from "../hooks/usePermissions";
import Empresas from "./Empresas/Empresas";
import Paises from "./Paises/Paises";

function Menu({ userData, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("inicio");

  const usuario = userData?.usuario || {};
  const perfiles = usuario.perfiles || [];

  const {
    hasPermission,
    hasAnyPermission,
    loading: loadingPermisos,
  } = usePermissions(userData?.token, usuario.usua_Id);

  const menuItems = [
    {
      icon: Home,
      label: "Inicio",
      path: "inicio",
      visible: true,
    },
    {
      icon: Users,
      label: "Usuarios",
      path: "usuarios",
      visible: hasPermission("Usuarios.Ver"),
    },
    {
      icon: User,
      label: "Perfiles",
      path: "perfiles",
      visible: hasPermission("Perfiles.Ver"),
    },
    {
      icon: Shield,
      label: "Permisos",
      path: "permisos",
      visible: hasPermission("Permisos.Ver"),
    },
    {
      icon: Tag,
      label: "Marcas",
      path: "marcas",
      visible: hasPermission("Marcas.Ver"),
    },
    {
      icon: Building2,
      label: "Empresas",
      path: "empresas",
      visible: hasPermission("Empresas.Ver"),
    },
    {
      icon: Globe,
      label: "Países",
      path: "paises",
      visible: hasPermission("Paises.Ver"),
    },
  ];

  const visibleMenuItems = menuItems.filter((item) => item.visible);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (currentView) {
      case "permisos":
        return <Permisos token={userData?.token} userData={userData} />;

      case "usuarios":
        return <Usuario token={userData?.token} userData={userData} />;

      case "perfiles":
        return <Perfil token={userData?.token} userData={userData} />;

      case "marcas":
        return <Marcas token={userData?.token} userData={userData} />;
      case "empresas":
        return <Empresas token={userData?.token} userData={userData} />;
      case "paises":
        return <Paises token={userData?.token} userData={userData} />;

      case "inicio":
      default:
        return (
          <div className="p-4 md:p-8">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-stone-900 mb-2">
                Bienvenido, {usuario.usua_Nombre?.split(" ")[0]}
              </h1>
              <p className="text-stone-600">Panel central del sistema</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

              <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                    }}
                  >
                    <Layout className="w-6 h-6 text-white" />
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

            <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
              <h2 className="text-xl font-bold text-stone-900 mb-4">
                Accesos Rápidos
              </h2>
              {loadingPermisos ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-stone-200 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-stone-600">Cargando permisos...</p>
                </div>
              ) : visibleMenuItems.slice(1).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {visibleMenuItems.slice(1).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentView(item.path)}
                      className="p-4 rounded-xl hover:scale-105 transition-transform text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                      }}
                    >
                      <item.icon className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-semibold">{item.label}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                  <p className="text-stone-600">
                    No tienes acceso a ningún módulo adicional.
                  </p>
                  <p className="text-sm text-stone-500 mt-2">
                    Contacta al administrador para solicitar permisos.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <Navbar
        userData={userData}
        onLogout={onLogout}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <aside
        className={`fixed left-0 top-16 bottom-0 bg-white border-r border-stone-200 transition-all duration-300 z-40 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="p-4 space-y-2 overflow-y-auto h-full">
          {loadingPermisos ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-8 h-8 border-4 border-stone-200 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            visibleMenuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setCurrentView(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  currentView === item.path ? "text-white" : "hover:bg-stone-50"
                }`}
                style={
                  currentView === item.path
                    ? {
                        background:
                          "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                        color: "white",
                      }
                    : { color: "#6b5345" }
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <span className="text-sm font-medium truncate">
                    {item.label}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </aside>

      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {renderContent()}
      </main>
    </div>
  );
}

export default Menu;
