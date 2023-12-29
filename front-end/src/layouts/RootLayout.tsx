import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import NavLinks from "../components/NavLinks";

const RootLayout = () => {
  return (
    <div>
      <NavLinks />
      <Toaster />
      <Suspense fallback={<p>Loading...</p>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default RootLayout;
