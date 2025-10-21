const Badge = ({ active, children }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
      active
        ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
        : "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200"
    }`}
  >
    <span
      className={`w-2 h-2 rounded-full ${
        active ? "bg-green-500" : "bg-red-500"
      }`}
    ></span>
    {children}
  </span>
);

export default Badge;
