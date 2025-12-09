import React, { useContext, useState } from "react";
import { Link } from "react-router";
import { Navcontent } from "../context/Navcontent";
function Sidebar() {
const {setNavamt,setTarget1}=useContext(Navcontent)
const [totalamt, setTotalamt] = useState("");
const [target,setTarget]=useState(0);
console.log(target);
const handleclick1=(e)=>{
  e.preventDefault()
    setTarget1(target)
    setTarget(0);
}
const handleclick = (e) => {
  e.preventDefault();
  
  // 1. CONVERT the string to a number
  const newBudgetAmount = parseFloat(totalamt);

  // 2. CHECK if it's a valid number
  if (isNaN(newBudgetAmount) || newBudgetAmount < 0) {
    alert("Please enter a valid amount.");
    return;
  }
  
  // 3. SEND THE NUMBER to the context
  setNavamt(newBudgetAmount); 
  
  // 4. Clear the input
  setTotalamt(""); 

};
  return (
    <div className="bg-[#bed4d9] rounded-b-md w-[250px] min-h-screen flex flex-col items-start justify-between p-4 gap-4">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="text-[#333333] text-xl font-semibold">Menu</h2>
        <label>Set Total Amount</label>
        <input onChange={(e)=>setTotalamt(e.target.value)}
        value={totalamt}
          type="number"
          className="bg-white py-1 rounded-lg focus:outline-none focus:border-[#504450] focus:ring-2 focus:ring-[#504450]"
        ></input>
        <button onClick={handleclick} className="text-white px-2 py-1 rounded-lg bg-black">
          Add Amount
        </button>
        <Link to="/" className="hover:underline p-2 text-[#333333]">
          Home
        </Link>
        <Link to="/Dashboard" className="hover:underline p-2 text-[#333333]">
          DashBoard
        </Link>
        <Link to="/Expense" className="hover:underline p-2 text-[#333333]">
          Expenses
        </Link>
        <Link to="/Report" className="hover:underline p-2 text-[#333333]">
          Reports
        </Link>
        <label>Target Days:</label>
        <input onChange={(e)=>setTarget(e.target.value)} value={target} type="number" className="bg-white px-2 py-1 rounded-lg outline-0 focus:border-[#504450] focus:ring-2 focus:ring-[#504450]"></input>
        <button className="px-2 py-1 rounded-lg bg-black text-white" onClick={handleclick1}>Add Target</button>
      </div>
      
      <div>
        <h2 className="font-semibold text-[#333333]">Expense Tracker</h2>
      </div>
    </div>
  );
}

export default Sidebar;
