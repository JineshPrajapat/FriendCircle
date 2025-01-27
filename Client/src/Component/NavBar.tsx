import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavLinkType {
  label: string;
  path: string;
}

const navLink: NavLinkType[] = [
  { label: "Dashboard", path: "/" },
  { label: "Discover User", path: "/allUser" },
  { label: "Friends", path: "/friends" },
  { label: "Request Sent", path: "/requestSent" },
  { label: "Request Recieved", path: "/requestRecieved" },
];

const NavBar: React.FC = () => {
  const location = useLocation();
  const pathName = location.pathname;

  return (
    <nav className="flex justify-around mb-4 border-b border-gray-200 overflow-hidden overflow-x-auto">
      {navLink.map((link, index) => (
        <div
          key={index} 
          className={`py-2 px-4 ${
            pathName === link.path
              ? "border-b-4 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          <Link to={link.path} className="whitespace-nowrap">
            {link.label}
          </Link>
        </div>
      ))}
    </nav>
  );
};

export default NavBar;
