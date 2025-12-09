import React, { useContext, useMemo } from "react";
import { Expensecontent } from "../context/Expensecontent"; // Adjust path
import { Navcontent } from "../context/Navcontent"; // Adjust path

// --- NEW/UPDATED IMPORTS ---
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale, // For Bar Chart
  LinearScale, // For Bar Chart
  BarElement, // For Bar Chart
  Title, // To add titles
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2"; // Import Bar

// --- REGISTER ALL CHART COMPONENTS ---
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// --- StatCard Component (no changes) ---
const StatCard = ({ title, amount, colorClass }) => {
  return (
    <div className="flex-1 p-5 bg-white rounded-lg shadow-md">
      <h3 className="m-0 text-sm font-medium text-gray-500">{title}</h3>
      <p className={`mt-2 mb-0 text-3xl font-bold ${colorClass}`}>
        ₹{amount.toFixed(2)}
      </p>
    </div>
  );
};

// --- The Main Dashboard Component ---
function Dashboard() {
  const { navamt } = useContext(Navcontent);
  const { expenses } = useContext(Expensecontent);

  // --- 1. ALL-TIME CALCULATIONS ---
  const totalamt = useMemo(() => {
    return expenses.reduce((accum, current) => {
      const amt1 = parseFloat(current.amount) || 0;
      return amt1 + accum;
    }, 0);
  }, [expenses]);
  const remainingBalance = navamt - totalamt;

  // --- 2. TODAY'S CALCULATIONS ---
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const expensesToday = useMemo(() => {
    return expenses.filter((exp) => exp.date === today);
  }, [expenses, today]);

  // --- 3. CHART DATA PREP ---

  // --- Data for TODAY'S BAR CHART ---
  const categoryDataToday = useMemo(() => {
    const categories = {}; // e.g., { Food: 150, Transport: 50 }
    expensesToday.forEach((exp) => {
      const category = exp.category || "Uncategorized";
      const amount = parseFloat(exp.amount) || 0;
      categories[category] = (categories[category] || 0) + amount;
    });
    return {
      labels: Object.keys(categories),
      data: Object.values(categories),
    };
  }, [expensesToday]);

  const barData = {
    labels: categoryDataToday.labels,
    datasets: [
      {
        label: "Spent Today",
        data: categoryDataToday.data,
        backgroundColor: "#FFB1C1",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    indexAxis: "y", // Makes it a horizontal bar chart
    plugins: {
      legend: {
        display: false, // Hide legend, labels are enough
      },
      title: {
        display: true,
        text: "Today's Spending by Category",
        font: { size: 16 },
      },
    },
  };

  // --- Data for ALL-TIME DOUGHNUT CHART ---
  const categoryDataAllTime = useMemo(() => {
    const categories = {};
    expenses.forEach((exp) => {
      const category = exp.category || "Uncategorized";
      const amount = parseFloat(exp.amount) || 0;
      categories[category] = (categories[category] || 0) + amount;
    });
    return {
      labels: Object.keys(categories),
      data: Object.values(categories),
    };
  }, [expenses]);

  const doughnutData = {
    labels: categoryDataAllTime.labels,
    datasets: [
      {
        label: "Spending",
        data: categoryDataAllTime.data,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "All-Time Spending by Category",
        font: { size: 16 },
      },
    },
  };

  // --- 4. Render the Dashboard ---
  return (
    <div className="p-5 font-sans bg-gray-100 min-h-screen">
      <h1 className="mb-5 text-3xl font-bold text-gray-800">
        My Budget Dashboard
      </h1>

      {/* --- Stat Cards Section --- */}
      <div className="flex flex-col md:flex-row gap-5 mb-5">
        <StatCard
          title="Total Budget"
          amount={navamt}
          colorClass="text-blue-500"
        />
        <StatCard
          title="Total Spent"
          amount={totalamt}
          colorClass="text-red-500"
        />
        <StatCard
          title="Remaining"
          amount={remainingBalance}
          colorClass="text-green-500"
        />
      </div>
      {/* --- Main Content Section (List & Chart) --- */}
      <div className="flex flex-col lg:flex-row gap-5 mt-10">
        {/* Left Column: Today's Chart & All Expenses List */}
        <div className="flex-1 flex flex-col gap-5">
          {/* --- NEW "TODAY'S SPENDING" BAR CHART --- */}
          <div className="bg-white rounded-lg p-5 shadow-md">
            {expensesToday.length > 0 ? (
              <Bar data={barData} options={barOptions} />
            ) : (
              <div className="text-center text-black h-full flex flex-col justify-center items-center">
                <h3 className="text-xl font-semibold mb-2">Today's Spending</h3>
                <p>No expenses added yet today.</p>
              </div>
            )}
          </div>
          {/* --- END OF NEW CARD --- */}

          {/* All Recent Expenses Card */}
          <div className="bg-white rounded-lg p-5 shadow-md h-full">
            <h3 className="text-xl font-semibold mb-4">All Recent Expenses</h3>
            <ul className="list-none p-0 m-0 max-h-96 overflow-y-auto">
              {expenses.length === 0 ? (
                <p className="">No expenses added yet.</p>
              ) : (
                expenses.map((exp) => (
                  <li
                    key={exp.id}
                    className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <span className="font-medium">
                      {exp.title}{" "}
                      <span className="text-gray-500 text-sm">
                        ({exp.category})
                      </span>
                    </span>
                    <span className="font-semibold text-red-500">
                      -₹{parseFloat(exp.amount).toFixed(2)}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="bg-white p-5 min-h-[150px] rounded-lg shadow-lg">
            <h1 className=" text-xl font-semibold">Daily Tips</h1>
            <p className="text-sm text-gray-500">Here's a personalized insight based on your recent spending habits.</p>
          </div>
        </div>

        {/* Right Column: All-Time Doughnut Chart */}
        <div className="flex-1">
          <div className="bg-white rounded-lg p-5 shadow-md h-full">
            {expenses.length > 0 ? (
              <div className="w-full max-w-md mx-auto">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            ) : (
              <p className="text-center text-gray-500 h-full flex justify-center items-center">
                Add expenses to see a breakdown chart.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
