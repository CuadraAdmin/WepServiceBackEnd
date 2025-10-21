import { useState, useEffect } from "react";
import {
  X,
  Shield,
  Search,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Loader,
} from "lucide-react";
import ApiConfig from "../../Config/api.config";
const Alert = ({ type, message, onClose }) => {
  const styles = {
    success: {
      bg: "bg-gradient-to-r from-green-50 to-emerald-50",
      border: "border-green-200",
      text: "text-green-700",
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    error: {
      bg: "bg-gradient-to-r from-red-50 to-rose-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
    },
  };

  const style = styles[type] || styles.error;

  return (
    <div
      className={`${style.bg} ${style.border} border-2 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in slide-in-from-top duration-300`}
    >
      <div className="flex items-center gap-3">
        {style.icon}
        <p className={`${style.text} font-medium`}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/50 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

function AsignarPermisos({ perfil, token, nombreUsuario, onClose }) {
  const [todosPermisos, setTodosPermisos] = useState([]);
  const [permisosAsignados, setPermisosAsignados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchDisponibles, setSearchDisponibles] = useState("");
  const [searchAsignados, setSearchAsignados] = useState("");
  const [permisosProcesando, setPermisosProcesando] = useState(new Set());

  useEffect(() => {
    cargarDatos();
  }, []);

  //funcion para normalizar propiedades
  const normalizarPermiso = (p) => ({
    Perm_Id: p.Perm_Id || p.perm_Id,
    Perm_Nombre: p.Perm_Nombre || p.perm_Nombre,
    Perm_Actividad: p.Perm_Actividad || p.perm_Actividad,
    Perm_Descripcion: p.Perm_Descripcion || p.perm_Descripcion,
    Perm_Estatus:
      p.Perm_Estatus !== undefined ? p.Perm_Estatus : p.perm_Estatus,
  });

  const cargarDatos = async () => {
    setLoading(true);
    setError("");

    try {
      const responsePermisos = await fetch(
        ApiConfig.getUrl(ApiConfig.ENDPOINTSPERMISOS.LISTAR),
        {
          method: "GET",
          headers: ApiConfig.getHeaders(token),
        }
      );

      if (!responsePermisos.ok) {
        throw new Error("Error al cargar permisos");
      }

      const permisos = await responsePermisos.json();

      // Normalizar y filtrar permisos activos
      const permisosNormalizados = permisos.map(normalizarPermiso);
      setTodosPermisos(
        permisosNormalizados.filter((p) => p.Perm_Estatus === true)
      );

      const perfilId = perfil.Perf_Id || perfil.perf_Id;

      const responseAsignados = await fetch(
        ApiConfig.getUrl(ApiConfig.ENDPOINTSPERFILES.PERMISOS(perfilId)),
        {
          method: "GET",
          headers: ApiConfig.getHeaders(token),
        }
      );

      if (!responseAsignados.ok) {
        throw new Error("Error al cargar permisos del perfil");
      }

      const asignados = await responseAsignados.json();

      // Normalizar permisos asignados
      const asignadosNormalizados = asignados.map(normalizarPermiso);
      const permisosValidos = asignadosNormalizados.filter(
        (p) => p && p.Perm_Nombre
      );

      setPermisosAsignados(permisosValidos);
    } catch (err) {
      setError(err.message || "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const asignarPermiso = async (permiso) => {
    const permisoId = permiso.Perm_Id;

    if (permisosProcesando.has(permisoId)) {
      return;
    }

    setPermisosProcesando((prev) => new Set(prev).add(permisoId));
    setProcesando(true);
    setError("");
    setSuccess("");

    try {
      // Soporte para ambas capitalizaciones
      const perfilId = perfil.Perf_Id || perfil.perf_Id;

      const url = ApiConfig.getUrl(
        ApiConfig.ENDPOINTSPERFILES.ASIGNAR_PERMISO(perfilId, permisoId)
      );

      const response = await fetch(url, {
        method: "POST",
        headers: ApiConfig.getHeaders(token),
      });

      if (response.ok) {
        setPermisosAsignados((prev) => [...prev, permiso]);
        setSuccess(` "${permiso.Perm_Nombre}" asignado`);
        setTimeout(() => setSuccess(""), 2000);
      } else {
        const data = await response.json();
        throw new Error(data.mensaje || "Error al asignar");
      }
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(""), 3000);
    } finally {
      setProcesando(false);
      setPermisosProcesando((prev) => {
        const newSet = new Set(prev);
        newSet.delete(permisoId);
        return newSet;
      });
    }
  };

  const quitarPermiso = async (permiso) => {
    const permisoId = permiso.Perm_Id;

    if (permisosProcesando.has(permisoId)) {
      return;
    }

    setPermisosProcesando((prev) => new Set(prev).add(permisoId));
    setProcesando(true);
    setError("");
    setSuccess("");

    try {
      // Soporte para ambas capitalizaciones
      const perfilId = perfil.Perf_Id || perfil.perf_Id;

      const url = ApiConfig.getUrl(
        ApiConfig.ENDPOINTSPERFILES.QUITAR_PERMISO(perfilId, permisoId)
      );

      const response = await fetch(url, {
        method: "DELETE",
        headers: ApiConfig.getHeaders(token),
      });

      if (response.ok) {
        setPermisosAsignados((prev) =>
          prev.filter((p) => p.Perm_Id !== permisoId)
        );
        setSuccess(`"${permiso.Perm_Nombre}" removido`);
        setTimeout(() => setSuccess(""), 2000);
      } else {
        const data = await response.json();
        throw new Error(data.mensaje || "Error al quitar");
      }
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(""), 3000);
    } finally {
      setProcesando(false);
      setPermisosProcesando((prev) => {
        const newSet = new Set(prev);
        newSet.delete(permisoId);
        return newSet;
      });
    }
  };

  // Permisos disponibles (los que NO tiene)
  const permisosDisponibles = todosPermisos.filter(
    (permiso) =>
      permiso.Perm_Nombre &&
      !permisosAsignados.some((p) => p.Perm_Id === permiso.Perm_Id) &&
      permiso.Perm_Nombre.toLowerCase().includes(
        searchDisponibles.toLowerCase()
      )
  );

  // permisos asignados filtrados por busqueda
  const permisosAsignadosFiltrados = permisosAsignados.filter(
    (permiso) =>
      permiso.Perm_Nombre &&
      permiso.Perm_Nombre.toLowerCase().includes(searchAsignados.toLowerCase())
  );

  // agrupar permisos por modulo
  const agruparPorModulo = (permisos) => {
    return permisos.reduce((acc, permiso) => {
      if (!permiso.Perm_Nombre) return acc;
      const modulo = permiso.Perm_Nombre.split(".")[0] || "Otros";
      if (!acc[modulo]) {
        acc[modulo] = [];
      }
      acc[modulo].push(permiso);
      return acc;
    }, {});
  };

  const disponiblesAgrupados = agruparPorModulo(permisosDisponibles);
  const asignadosAgrupados = agruparPorModulo(permisosAsignadosFiltrados);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-7xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div
          className="p-6 md:p-8 text-white flex justify-between items-center"
          style={{
            background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Gestionar Permisos
              </h2>
              <p className="text-white/80 mt-1 text-sm">
                Perfil: {perfil.Perf_Nombre || perfil.perf_Nombre}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Mensajes */}
          {success && (
            <div className="mb-4">
              <Alert
                type="success"
                message={success}
                onClose={() => setSuccess("")}
              />
            </div>
          )}

          {error && (
            <div className="mb-4">
              <Alert
                type="error"
                message={error}
                onClose={() => setError("")}
              />
            </div>
          )}

          {/* estadisticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div
              className="p-4 rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(107, 83, 69, 0.05) 0%, rgba(139, 111, 71, 0.05) 100%)",
              }}
            >
              <p className="text-sm text-stone-600 mb-1">Total de permisos</p>
              <p className="text-2xl font-bold text-stone-900">
                {todosPermisos.length}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50">
              <p className="text-sm text-green-600 mb-1"> Asignados</p>
              <p className="text-2xl font-bold text-green-700">
                {permisosAsignados.length}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50">
              <p className="text-sm text-blue-600 mb-1"> Disponibles</p>
              <p className="text-2xl font-bold text-blue-700">
                {permisosDisponibles.length}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative mb-4">
                <div className="w-16 h-16 border-4 border-stone-200 border-t-transparent rounded-full animate-spin"></div>
                <Shield className="w-8 h-8 text-stone-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-stone-600 font-medium">Cargando permisos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* COLUMNA IZQUIERDA - Permisos Disponibles */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    Permisos Disponibles
                  </h3>
                  <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-bold">
                    {permisosDisponibles.length}
                  </span>
                </div>

                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                  <input
                    type="text"
                    placeholder="Buscar disponibles..."
                    value={searchDisponibles}
                    onChange={(e) => setSearchDisponibles(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-blue-200 focus:border-blue-400 outline-none bg-white text-sm"
                  />
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {Object.keys(disponiblesAgrupados).length === 0 ? (
                    <div className="text-center py-8 text-blue-600">
                      <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        {searchDisponibles
                          ? "No hay permisos que coincidan"
                          : "Todos los permisos están asignados"}
                      </p>
                    </div>
                  ) : (
                    Object.entries(disponiblesAgrupados).map(
                      ([modulo, permisos]) => (
                        <div key={modulo}>
                          <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            {modulo}
                          </h4>
                          <div className="space-y-2">
                            {permisos.map((permiso) => {
                              const estaProcesando = permisosProcesando.has(
                                permiso.Perm_Id
                              );
                              return (
                                <div
                                  key={permiso.Perm_Id}
                                  className="flex items-center gap-2 bg-white rounded-xl p-3 border border-blue-200 hover:border-blue-300 transition-all group"
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-stone-900 truncate">
                                      {permiso.Perm_Nombre}
                                    </p>
                                    <p className="text-xs text-stone-600 truncate">
                                      {permiso.Perm_Actividad}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => asignarPermiso(permiso)}
                                    disabled={estaProcesando}
                                    className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                    title="Asignar permiso"
                                  >
                                    {estaProcesando ? (
                                      <Loader className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>

              {/* parte derecha - Permisos Asignados */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-green-900 flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    Permisos Asignados
                  </h3>
                  <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-bold">
                    {permisosAsignados.length}
                  </span>
                </div>

                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                  <input
                    type="text"
                    placeholder="Buscar asignados..."
                    value={searchAsignados}
                    onChange={(e) => setSearchAsignados(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-green-200 focus:border-green-400 outline-none bg-white text-sm"
                  />
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {Object.keys(asignadosAgrupados).length === 0 ? (
                    <div className="text-center py-8 text-green-600">
                      <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        {searchAsignados
                          ? "No hay permisos que coincidan"
                          : "No hay permisos asignados"}
                      </p>
                    </div>
                  ) : (
                    Object.entries(asignadosAgrupados).map(
                      ([modulo, permisos]) => (
                        <div key={modulo}>
                          <h4 className="text-sm font-bold text-green-800 mb-2 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            {modulo}
                          </h4>
                          <div className="space-y-2">
                            {permisos.map((permiso) => {
                              const estaProcesando = permisosProcesando.has(
                                permiso.Perm_Id
                              );
                              return (
                                <div
                                  key={permiso.Perm_Id}
                                  className="flex items-center gap-2 bg-white rounded-xl p-3 border border-green-200 hover:border-green-300 transition-all group"
                                >
                                  <button
                                    onClick={() => quitarPermiso(permiso)}
                                    disabled={estaProcesando}
                                    className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                    title="Quitar permiso"
                                  >
                                    {estaProcesando ? (
                                      <Loader className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <ChevronLeft className="w-4 h-4" />
                                    )}
                                  </button>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-stone-900 truncate">
                                      {permiso.Perm_Nombre}
                                    </p>
                                    <p className="text-xs text-stone-600 truncate">
                                      {permiso.Perm_Actividad}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-200 bg-stone-50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-stone-600">
              <span className="font-semibold text-green-700">
                {permisosAsignados.length} permisos asignados
              </span>
              {" · "}
              <span className="font-semibold text-blue-700">
                {permisosDisponibles.length} disponibles
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-3 text-white rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg"
              style={{
                background: "linear-gradient(135deg, #6b5345 0%, #8b6f47 100%)",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AsignarPermisos;
