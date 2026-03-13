import Permisos from "../components/CU/Permisos/Permisos";
import Usuario from "../components/CU/Usuarios/Usuario";
import Perfil from "../components/CU/Perfiles/Perfil";
import Marcas from "../components/CM/Marcas";
import Empresas from "../components/Empresas/Empresas";
import Paises from "../components/Paises/Paises";
import TipoMarca from "../components/CM/CM_TIPOMARCA/TipoMarca";

export const ROUTES = [
  {
    path: "/usuarios",
    component: Usuario,
    permission: "Usuarios.Ver",
    label: "Usuarios",
  },
  {
    path: "/perfiles",
    component: Perfil,
    permission: "Perfiles.Ver",
    label: "Perfiles",
  },
  {
    path: "/permisos",
    component: Permisos,
    permission: "Permisos.Ver",
    label: "Permisos",
  },
  {
    path: "/marcas",
    component: Marcas,
    permission: "Marcas.Ver",
    label: "Marcas",
  },
  {
    path: "/empresas",
    component: Empresas,
    permission: "Empresas.Ver",
    label: "Empresas",
  },
  {
    path: "/paises",
    component: Paises,
    permission: "Paises.Ver",
    label: "Países",
  },
  {
    path: "/tipos-marca",
    component: TipoMarca,
    permission: "TiposMarca.Ver",
    label: "Tipos Marca",
  },
];
