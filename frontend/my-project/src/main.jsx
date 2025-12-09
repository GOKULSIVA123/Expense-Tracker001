import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from './context/Themecontext.jsx';
import {ExpenseProvider} from "./context/Expensecontent.jsx";
import { NavProvider } from './context/Navcontent.jsx';
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
console.log(PUBLISHABLE_KEY);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ThemeProvider>
        <NavProvider>
        <ExpenseProvider>
      <App />
      </ExpenseProvider>
      </NavProvider>
      </ThemeProvider>
    </ClerkProvider>
  </StrictMode>,
)
