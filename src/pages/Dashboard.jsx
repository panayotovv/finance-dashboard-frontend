import StatCard from '../components/StatCard';
import WelcomeBanner from '../components/WelcomeBanner';
import SalesOverview from '../components/SalesOverview';
import RecentTransactions from '../components/RecentTransactions';
import SpendingCategories from '../components/SpendingCategories';
import '../pages/Dashboard.css';
import { BalanceIcon, IncomeIcon, ExpensesIcon, InvestmentsIcon } from '../components/Icons';
import AllTransactionsModal from "../components/AllTransactionsModal";
import { useState, useEffect } from "react";

import { useOutletContext } from "react-router-dom";

export default function Dashboard() {
  const {
    data,
    userData,
    transactionsData,
    transactionSummary,
    setShowTransaction,
    setAllTransactions,
    showAllTransactions,
    isLoggedIn
  } = useOutletContext();

  const [monthComparisonData, setMonthComparisonData] = useState(null);

  const fetchData = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    try {
      const month_comparison = await fetch(
        "http://127.0.0.1:8000/api/month_comparison/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (month_comparison.status === 401) {
        handleLogout();
        return;
      }

      const month_comparison_data = await month_comparison.json();

      setMonthComparisonData(month_comparison_data)

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    } else {
      setMonthComparisonData(null); 
    }
  }, [isLoggedIn, transactionsData]);
  
  return (
    <>
    {showAllTransactions && (
      <AllTransactionsModal
        alltransactions={transactionsData}
        onClose={() => setAllTransactions(false)}
      />
    )}
    <div className="dw">
      
      <div className="dw__stats">
        <StatCard
          label="Total Balance"
          value={`€${monthComparisonData?.total || 0}`}
          change={`${monthComparisonData?.total_percentage?.toFixed(2) || 0}%`}
          positive={monthComparisonData?.income?.percent_change >= 0}
          icon={<BalanceIcon />}
          accent="linear-gradient(135deg, #3b82f6, #2563eb)"
        />

        <StatCard
          label="Monthly Income"
          value={`€${monthComparisonData?.income?.current || 0}`}
          change={`${monthComparisonData?.income?.percent_change?.toFixed(2) || 0}%`}
          positive={monthComparisonData?.income?.percent_change >= 0}
          icon={<IncomeIcon />}
          accent="linear-gradient(135deg, #10b981, #059669)"
        />

        <StatCard
          label="Monthly Expenses"
          value={`€${monthComparisonData?.expenses?.current || 0}`}
          change={`${monthComparisonData?.expenses?.percent_change?.toFixed(2) || 0}%`}
          positive={monthComparisonData?.expenses?.percent_change >= 0}
          icon={<ExpensesIcon />}
          accent="linear-gradient(135deg, #f43f5e, #e11d48)"
        />

        <StatCard
          label="Investments"
          value={`€${monthComparisonData?.investments?.current|| 0}`}
          change={`${monthComparisonData?.investments?.percent_change?.toFixed(2) || 0}%`}
          positive={monthComparisonData?.investments?.percent_change >= 0}
          icon={<InvestmentsIcon />}
          accent="linear-gradient(135deg, #8b5cf6, #7c3aed)"
        />
      </div>

      <div className="dw__mid">
        <div className="dw__welcome">
          <WelcomeBanner
            name={userData?.username || "Guest"}
            subtitle="Glad to see you again!"
            onRecord={() => setShowTransaction(true)}
          />
        </div>

        <SpendingCategories data={data?.categories} />

        <RecentTransactions
         transactions={transactionsData}
         onTransaction={() => setAllTransactions(true)}
        />
      </div>

      <div className="dw__bottom">
        <SalesOverview isLoggedIn={isLoggedIn} transactionsData={transactionsData} />
      </div>
    </div>
    </>
  );
}