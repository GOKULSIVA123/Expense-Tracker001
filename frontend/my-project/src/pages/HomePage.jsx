import React, { useContext, useState } from "react";
import { Expensecontent } from "../context/Expensecontent";
import { Navcontent } from "../context/Navcontent";
function HomePage() {
  const { navamt, target1 } = useContext(Navcontent);
  const { expenses } = useContext(Expensecontent);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const spent = expenses.reduce((accum, curr) => {
    const val = parseFloat(curr.amount) || 0;
    return val + accum;
  }, 0);
  const rem = navamt - spent;
  return (
    <div className="w-full bg-gray-100 min-h-screen p-5">
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-5 w-full">
          <div className="flex-1 p-4 bg-white rounded-lg shadow-md text-center">
            <h1 className="text-2xl text-gray-500 font-medium">
              Total Budget:
            </h1>
            <h2 className="text-blue-500 text-xl font-semibold">
              ₹{navamt.toFixed(2)}
            </h2>
          </div>
          <div className="flex-1 p-4 bg-white rounded-lg shadow-md text-center">
            <h1 className="text-2xl text-gray-500 font-medium">Total Spent:</h1>
            <h2 className="text-red-500 text-xl font-semibold">
              ₹{spent.toFixed(2)}
            </h2>
          </div>
          <div className="flex-1 p-4 bg-white rounded-lg shadow-md text-center">
            <h1 className="text-2xl text-gray-500 font-medium">Remaining:</h1>
            <h2 className="text-green-500 text-xl font-semibold">
              ₹{rem.toFixed(2)}
            </h2>
          </div>
        </div>
        <div className="w-full min-h-[500px] flex flex-col md:flex-row gap-5 ">
          <div className="flex-1 min-h-[50px] p-4">
            <div className="bg-white rounded-lg min-h-[100px] text-center p-4">
              <label className="text-xl font-semibold text-gray-700">
                Target Month Goal:
              </label>
              <h1 className="text-2xl font-semibold text-green-400">
                {target1}
              </h1>
            </div>
            <form className="flex flex-col mt-5 bg-white rounded-lg min-h-[300px] shadow-xl text-center gap-3 p-3 ">
              <h1 className="font-semibold text-gray-700 text-xl">
                Expense Ai Assist
              </h1>
              <label className="text-xl font-medium text-gray-700">
                Enter Your goal:
              </label>
              <p className="text-gray-700">
                (Tell Your goal to ai for generating a plan for maintaining your
                budget)
              </p>
              <textarea className="p-2 bg-gray-100 outline-0 focus:outline-none focus:ring-2 focus:ring-[#504450] focus:border-[#504450] rounded-lg"></textarea>
              <div className="flex items-start w-full justify-center p-2">
                <button
                  // Disable the button while loading
                  disabled={loadingPlan}
                  // onClick={getAiPlan}
                  className="px-4 py-2 mt-3 bg-black text-white rounded-lg font-semibold 
             hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {/* Change the text based on the loading state */}
                  {loadingPlan ? "ANALYZING..." : "ASK AI FOR HELP"}
                </button>
              </div>
            </form>
          </div>
          <div className="flex-1 min-h-[200px] bg-white p-4 rounded-lg shadow-2xl text-center">
            <h1 className="text-2xl text-gray-700 font-semibold">
              Ai Generated Plan for Help
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
