import { React, useContext, createContext,useState} from "react";
export const Expensecontent = createContext(null);
export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const addExpense = (newExpenses1) => {
    const newExpenses = {
      ...newExpenses1,
      id: crypto.randomUUID()
    };
    setExpenses(prev=>[newExpenses,...prev])
  };
  const value={
    expenses:expenses,
    addExpense:addExpense
  }
  return <Expensecontent.Provider value={value}>
    {children}
  </Expensecontent.Provider>
};
