import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

function DashboardLayout(props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function closeSidebar() {
    setSidebarOpen(false);
  }

  function openSidebar() {
    setSidebarOpen(true);
  }

  return (
    <div className="flex bg-base min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 min-w-0">
        <Navbar
          onMenuClick={openSidebar}
          onSearch={props.onSearch || function () {}}
          onUploadClick={props.onUploadClick}
          showUpload={props.showUploadButton !== false}
        />

        <main className="p-4 sm:p-6">{props.children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
