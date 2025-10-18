import React from "react";
import { Link } from "react-router";

function Sidebar() {
  return (
    <div className="bg-[#bed4d9] rounded-b-md w-[200px] min-h-screen flex flex-col items-start justify-between p-4 gap-4">
      <div className="flex flex-col gap-2 ">
        <h2 className="text-[#333333] text-xl font-semibold">Menu</h2>
        <Link to="/" className="hover:underline p-2 text-[#333333]">Home</Link>
        <Link to="/Dashboard" className="hover:underline p-2 text-[#333333]">
          DashBoard
        </Link>
        <Link to="/Expense" className="hover:underline p-2 text-[#333333]">
          Expenses
        </Link>
        <Link to="/Report" className="hover:underline p-2 text-[#333333]">
          Reports
        </Link>
      </div>
      <div>
        <h2 className="font-semibold text-[#333333]">Expense Tracker</h2>
      </div>
    </div>
  );
}

export default Sidebar;
