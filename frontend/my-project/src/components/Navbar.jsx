import React, { useContext } from "react";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  useUser,
  SignUpButton,
} from "@clerk/clerk-react";
import ThemeToggle from "./ThemeToggle";
import { Navcontent } from "../context/Navcontent";
import { Expensecontent } from "../context/Expensecontent";

function Navbar() {
  const { navamt, target1 } = useContext(Navcontent);
  const { user } = useUser();
  const { expenses } = useContext(Expensecontent);

  const totalamt = expenses.reduce((accum, current) => {
    const amt1 = parseFloat(current.amount) || 0;
    return amt1 + accum;
  }, 0);
  let amt2 = navamt - totalamt;

  return (
    // Outer container: Use flex-col on mobile, flex-row on desktop
    // Added text-xs/sm for better mobile text sizing
    <div
      className={`p-4 bg-[#4fab9a] dark:bg-gray-800 flex flex-col md:flex-row justify-between items-center gap-2`}
    >
      {/* --- SECTION 1: LOGO (Always visible) --- */}
      <h1 className={`text-xl font-bold text-white md:w-auto w-full text-center md:text-left`}>
        Expense Tracker
      </h1>

      {/* --- SECTION 2: STATS & AUTH CONTAINER (Main responsive wrapper) --- */}
      <div className="flex flex-wrap gap-2 md:gap-4 justify-center items-center w-full md:w-auto">

        {/* --- STATS: Hidden on mobile (xs) because they take up too much space. --- */}
        <div className="hidden sm:flex flex-row gap-4">
            <h1 className="bg-white px-3 py-1 rounded-lg text-sm font-medium">
              Target Days:
              <span className="text-gray-700 font-bold ml-2">{target1}</span>
            </h1>
            <h1 className="bg-white px-3 py-1 rounded-lg text-sm font-medium">
              Total:
              <span className="text-gray-700 font-bold ml-2">
                {amt2 > 0 ? amt2.toFixed(2) + "Rs" : 'No Balance'}
              </span>
            </h1>
            <h3 className="text-gray-700 font-bold ml-2 bg-white px-3 py-1 rounded-lg text-sm">
              Spent: {totalamt.toFixed(2)}Rs
            </h3>
        </div>

        {/* --- ACTIONS/AUTH (Always visible, right side) --- */}
        <ThemeToggle />
        <SignedOut>
          <SignInButton className="px-3 py-1 bg-[#333333] text-white rounded-xl text-sm" />
          <SignUpButton className="px-3 py-1 bg-[#333333] text-white rounded-xl text-sm" />
        </SignedOut>
        <SignedIn>
          <span className="text-white mr-2 text-sm">
            Welcome, {user?.fullName}
          </span>
          <UserButton />
        </SignedIn>

      </div>
    </div>
  );
}

export default Navbar;