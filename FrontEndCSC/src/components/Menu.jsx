import { useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import {
  User,
  Home,
  Users,
  Shield,
  Layout,
  Tag,
  Building2,
  Globe,
  Tags,
} from "lucide-react";
import Navbar from "./Navbar";
import { usePermissions } from "../hooks/usePermissions";
import { ROUTES } from "../routes";

const ROUTE_ICONS = {
  "/usuarios": Users,
  "/perfiles": User,
  "/permisos": Shield,
  "/marcas": Tag,
  "/empresas": Building2,
  "/paises": Globe,
  "/tipos-marca": Tags,
};

function Inicio({
  userData,
  hasPermission,
  loadingPermisos,
  visibleMenuItems,
  navigate,
}) {
  const usuario = userData?.usuario || {};
  const perfiles = usuario.perfiles || [];

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
                background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
              }}
            >
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900">Usuario</h3>
              <p className="text-sm text-stone-600">{usuario.usua_Usuario}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-stone-600">
              <span className="font-medium">Correo:</span> {usuario.usua_Correo}
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
                background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
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
                background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
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
              <span className="text-sm text-stone-600">Estado de cuenta:</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                Activo
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-600">Sesión:</span>
              <span className="text-sm font-medium text-stone-900">Válida</span>
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
        ) : visibleMenuItems.filter((i) => i.path !== "/").length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {visibleMenuItems
              .filter((i) => i.path !== "/")
              .map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
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

function Menu({ userData, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const usuario = userData?.usuario || {};
  const { hasPermission, loading: loadingPermisos } = usePermissions(
    userData?.token,
    usuario.usua_Id,
  );

  const menuItems = [
    { icon: Home, label: "Inicio", path: "/", visible: true },
    ...ROUTES.map((r) => ({
      icon: ROUTE_ICONS[r.path] || Shield,
      label: r.label,
      path: r.path,
      visible: hasPermission(r.permission),
    })),
  ];

  const visibleMenuItems = menuItems.filter((item) => item.visible);

  return (
    <div className="min-h-screen bg-stone-100">
      <Navbar
        userData={userData}
        onLogout={onLogout}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <aside
        className={`fixed left-0 top-16 bottom-0 bg-white border-r border-stone-200 transition-all duration-300 z-40 ${isSidebarOpen ? "w-64" : "w-20"}`}
      >
        <div className="p-4 space-y-2 overflow-y-auto h-full">
          {loadingPermisos ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-8 h-8 border-4 border-stone-200 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            visibleMenuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? "text-white" : "hover:bg-stone-50"}`}
                  style={
                    isActive
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
              );
            })
          )}
        </div>
      </aside>

      <main
        className={`pt-16 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Inicio
                userData={userData}
                hasPermission={hasPermission}
                loadingPermisos={loadingPermisos}
                visibleMenuItems={visibleMenuItems}
                navigate={navigate}
              />
            }
          />
          {ROUTES.map(({ path, component: Component, permission }) =>
            hasPermission(permission) ? (
              <Route
                key={path}
                path={path}
                element={
                  <Component token={userData?.token} userData={userData} />
                }
              />
            ) : null,
          )}
          {!loadingPermisos && (
            <Route path="*" element={<Navigate to="/" replace />} />
          )}
        </Routes>
      </main>
    </div>
  );
}

export default Menu;
