import React, { useState } from "react";
import { motion } from "framer-motion";
function Expense() {
  
  const [formdata, setFormdata] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
  });
  console.log(formdata.title);
  const handlechange = (e) => {
    const { name, value } = e.target;
    setFormdata(prevdata=>({...prevdata,[name]:value}))
  };
  const handlesubmit=(e)=>{
    e.preventDefault();
    console.log("formdata",formdata);
    setFormdata({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
    })
    
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 100, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col justify-center items-center"
    >
      <form onSubmit={handlesubmit} className="w-full p-4 bg-[#4fab9a] rounded-lg max-w-[600px] min-h-[500px] flex flex-col items-center justify-around gap-1  shadow-gray-400 shadow-lg md:p-4">
        <motion.h1
          initial={{}}
          animate={{}}
          transition={{}}
          className="text-[#504450] text-2xl font-semibold"
        >
          Expense Tracker
        </motion.h1>
        <div className="flex flex-col items-start justify-center gap-2 mt-5">
          <label className="text-[#504450]">Expense Name:</label>
          <input onChange={handlechange} value={formdata.title}
            type="text" name="title"
            className="bg-white px-4 text-black py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#504450] focus:border-[#504450] transition"
          ></input>
          <label className="text-[#504450]">Amount:</label>
          <input onChange={handlechange} value={formdata.amount}
            type="number" name="amount"
            className="bg-white px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#504450] focus:border-[#504450] transition"
          ></input>
          <label className="text-[#504450]">Category:</label>
          <select className="bg-white" onChange={handlechange} value={formdata.category} name="category">
            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Other</option>
          </select>
          <label className="text-[#504450]">Date:</label>
          <input onChange={handlechange} value={formdata.date}
            type="date" name="date"
            className="bg-white px-4 rounded-lg py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#504450] focus:border-[#504450]"
          ></input>
          <label className="text-[#504450]">Notes:</label>
          <textarea onChange={handlechange} name="notes" value={formdata.notes} className="bg-white px-8 rounded-lg py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#504450] focus:border-[#504450] "></textarea>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-black text-white px-6 py-2 rounded-lg"
        >
          Add
        </motion.button>
      </form>
    </motion.div>
  );
}

export default Expense;
