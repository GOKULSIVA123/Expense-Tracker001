import React, { useContext } from "react";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/clerk-react";
import ThemeToggle from "./ThemeToggle";
function Navbar() {
  const { user } = useUser();
  return (
    <div
      className={`w-full p-4 bg-[#4fab9a] dark:bg-gray-800 flex flex-row justify-between items-center`}
    >
      <h1 className={`text-[#504450] text-xl font-bold text-gray-200`}>
        Expense Tracker
      </h1>
      <div className="flex flex-row gap-4 justify-center items-center">
        <ThemeToggle></ThemeToggle>
        <SignedOut>
          <SignInButton className="px-4 py-2 bg-[#333333] text-white rounded-xl" />
        </SignedOut>
        <SignedIn>
          <span className="text-[#504450] mr-2 font-medium">
            Welcome, {user?.fullName}
          </span>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignUpButton className="px-4 py-2 bg-[#333333] text-white rounded-xl" />
        </SignedOut>
      </div>
    </div>
  );
}

export default Navbar;
