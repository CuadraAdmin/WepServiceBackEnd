import { useState } from "react";
import { User, LogOut, Menu, X, ChevronDown } from "lucide-react";

function Navbar({ userData, onLogout, isSidebarOpen, toggleSidebar }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const usuario = userData?.usuario || {};
  const perfiles = usuario.perfiles || [];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-stone-200 z-50 shadow-sm">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Logo y toggle sidebar */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6 text-stone-600" />
            ) : (
              <Menu className="w-6 h-6 text-stone-600" />
            )}
          </button>
          <img src="/logo.svg" alt="Logo" className="h-10 w-auto" />
        </div>

        {/* Usuario info */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-stone-50 transition-colors"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-stone-900">
                {usuario.usua_Nombre}
              </p>
              <p className="text-xs text-stone-500">
                {perfiles.map((p) => p.perf_Nombre).join(", ")}
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
              style={{
                background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
              }}
            >
              {usuario.usua_Nombre?.charAt(0) || "U"}
            </div>
            <ChevronDown className="w-4 h-4 text-stone-600" />
          </button>

          {/* Menú desplegable */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden">
              <div
                className="p-4 border-b border-stone-200"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(107, 83, 69, 0.05) 0%, rgba(139, 111, 71, 0.05) 100%)",
                }}
              >
                <p className="text-sm font-semibold text-stone-900">
                  {usuario.usua_Nombre}
                </p>
                <p className="text-xs text-stone-600 mt-1">
                  {usuario.usua_Correo}
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  {usuario.usua_Telefono}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {perfiles.map((perfil) => (
                    <span
                      key={perfil.perf_Id}
                      className="px-2 py-1 text-xs rounded-lg text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
                      }}
                    >
                      {perfil.perf_Nombre}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
