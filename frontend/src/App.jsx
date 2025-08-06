import React, { useEffect, useRef, useState } from "react";
import { Navbar } from "./components/Navbar";
import { Outlet } from "react-router-dom";

export const App = () => {
  const navbarRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const updateNavbarHeight = () => {
      if (navbarRef.current) {
        const height = navbarRef.current.offsetHeight;
        setNavbarHeight(height);
        document.documentElement.style.setProperty(
          "--navbar-height",
          `${height}px`
        );
      }
    };

    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);
    return () => window.removeEventListener("resize", updateNavbarHeight);
  }, []);

  return (
    <div className="h-screen ">
      {/* Navbar */}
      <Navbar navbarRef={navbarRef} />
      {/* Children Content */}
      <main
        className="bg-green-100"
        style={{
          height: `calc(100vh - ${navbarHeight}px)`,
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};
