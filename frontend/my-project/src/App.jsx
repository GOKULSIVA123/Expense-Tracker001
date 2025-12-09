import React, { createContext, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Expense from "./pages/Expense";
import Report from "./pages/Report";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/HomePage";
function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar className=''></Navbar>
        <div className="flex flex-1">
          <Sidebar></Sidebar>
          <div className="flex-1 p-6 w-full">
            <Routes>
              <Route path="/" element={<Home></Home>}></Route>
              <Route path="/Report" element={<Report></Report>}></Route>
              <Route
                path="/Dashboard"
                element={<Dashboard></Dashboard>}
              ></Route>
              <Route path="/Expense" element={<Expense></Expense>}></Route>
            </Routes>
          </div>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
