import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const path = location.pathname;

  // 1. Root path redirect based on auth
  if (path === "/") {
    if (!isAuthenticated) return <Navigate to="/auth/login" />;

    return user?.role === "admin"
      ? <Navigate to="/admin/dashboard" />
      : <Navigate to="/shop/home" />;
  }

  // 2. Block unauthenticated users from protected routes
  const isAuthPage = path.includes("/login") || path.includes("/register");

  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/auth/login" />;
  }

  // 3. Prevent logged-in users from accessing login/register
  if (isAuthenticated && isAuthPage) {
    return user?.role === "admin"
      ? <Navigate to="/admin/dashboard" />
      : <Navigate to="/shop/home" />;
  }

  // 4. Prevent non-admins from accessing admin pages
  if (isAuthenticated && user?.role !== "admin" && path.includes("/admin")) {
    return <Navigate to="/unauth-page" />;
  }

  // 5. Prevent admins from accessing shopping routes
  if (isAuthenticated && user?.role === "admin" && path.includes("/shop")) {
    return <Navigate to="/admin/dashboard" />;
  }

  // 6. Allow access
  return <>{children}</>;
}

export default CheckAuth;
