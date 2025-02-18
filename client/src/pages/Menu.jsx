"use client";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiUserGroup } from "react-icons/hi";
import { useState } from "react";

import { Link } from "react-router-dom";


export function Menu() {
  const [activeItem, setActiveItem] = useState("Dashboard");



  const getItemClass = (item) =>
    `rounded-lg p-2 flex items-center gap-2 transition 
    ${activeItem === item 
      ? "bg-[#1DC6C6] text-white !hover:bg-[#1DC6C6]"  // Active: No hover effect, text white
      : "text-gray-900 hover:bg-gray-100"
    }`;

  const getIconClass = (item) =>
    activeItem === item ? "text-white" : "text-gray-900"; // Change icon color

  return (
    <Sidebar aria-label="Default sidebar example" className="h-screen w-64 bg-white shadow-lg">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item >
            Name
          </Sidebar.Item>
          <Link to="/admin">
          <Sidebar.Item 
            
            className={getItemClass("Dashboard")} 
            onClick={() => setActiveItem("Dashboard")} 
            icon={() => <HiChartPie className={getIconClass("Dashboard")} />} // Custom icon color
          >
            Dashboard
          </Sidebar.Item>
         </Link>
         <Link to="/admin/dashboard">
          <Sidebar.Item 
           
            className={getItemClass("Users")} 
            onClick={() => setActiveItem("Users")}
            icon={() => <HiUserGroup className={getIconClass("Users")} />} 
          >
            Users
          </Sidebar.Item>
          </Link>

          <Link to="">
          <Sidebar.Item 
           
            className={getItemClass("Admins")} 
            onClick={() => setActiveItem("Admins")}
            icon={() => <HiUserGroup className={getIconClass("Admins")} />} 
          >
            Users
          </Sidebar.Item>
          </Link>
          <Sidebar.Item 
            
            className={getItemClass("Sign In")} 
            onClick={() => setActiveItem("Sign In")}
            icon={() => <HiArrowSmRight className={getIconClass("Sign In")} />} 
          >
            Sign In
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}