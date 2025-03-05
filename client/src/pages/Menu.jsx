import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiUserGroup } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export function Menu() {
  const location = useLocation();
  const navigate = useNavigate();

  const getItemClass = (path) =>
    `rounded-lg p-2 flex items-center gap-2 transition 
    ${location.pathname === path 
      ? "bg-[#1DC6C6] text-white !hover:bg-[#1DC6C6]"  
      : "text-gray-900 hover:bg-gray-100"
    }`;

  const getIconClass = (path) =>
    location.pathname === path ? "text-white" : "text-gray-900"; 

  // Logout function
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("refreshToken");

    navigate("/login"); // Redirect to login page
  };

  return (
    <Sidebar aria-label="Default sidebar example" className="h-screen w-64 bg-white shadow-lg">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item>Name</Sidebar.Item>

          <Link to="/admin">
            <Sidebar.Item 
              className={getItemClass("/admin")} 
              icon={() => <HiChartPie className={getIconClass("/admin")} />}
            >
              Dashboard
            </Sidebar.Item>
          </Link>

          <Link to="/admin/dashboard">
            <Sidebar.Item 
              className={getItemClass("/admin/dashboard")} 
              icon={() => <HiUserGroup className={getIconClass("/admin/dashboard")} />} 
            >
              Users
            </Sidebar.Item>
          </Link>

          <Link to="/admin/admins">
            <Sidebar.Item 
              className={getItemClass("/admin/admins")} 
              icon={() => <HiUserGroup className={getIconClass("/admin/admins")} />} 
            >
              Admins
            </Sidebar.Item>
          </Link>

          <button 
            onClick={handleLogout} 
            className="w-full text-left"
          >
            <Sidebar.Item 
              className={getItemClass("/sign-out")} 
              icon={() => <HiArrowSmRight className={getIconClass("/sign-out")} />} 
            >
              Sign Out
            </Sidebar.Item>
          </button>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
