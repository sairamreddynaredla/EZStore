import { Link } from "react-router-dom";

const Breadcrumbs = ({ crumbs }) => (
  <nav className="mb-4 text-sm text-gray-500 flex gap-2" aria-label="Breadcrumb">
    {crumbs.map((crumb, idx) => (
      <span key={crumb.path || idx} className="flex items-center">
        {idx < crumbs.length - 1 ? (
          <Link to={crumb.path} className="hover:underline text-primary-600 font-medium">
            {crumb.label}
          </Link>
        ) : (
          <span className="text-gray-700 font-semibold">{crumb.label}</span>
        )}
        {idx < crumbs.length - 1 && <span className="mx-2">&gt;</span>}
      </span>
    ))}
  </nav>
);

export default Breadcrumbs;
