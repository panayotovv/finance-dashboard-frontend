import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Login from "../components/Login";
import TransactionModal from "../components/TransactionModal";
import Register from "../components/Register";

export default function Layout() {
  const [data, setData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [transactionSummary, setTransactionSummary] = useState({});
  const [transactionsData, setTransactionsData] = useState([]);
  const [showTransaction, setShowTransaction] = useState(false);
  const [authMode, setAuthMode] = useState(null); 
  const [showAllTransactions, setAllTransactions] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );

  const fetchData = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    try {
      const transactions_summary = await fetch(
        "http://127.0.0.1:8000/api/transactions_summary/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user_response = await fetch(
        "http://127.0.0.1:8000/api/users/user/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const categories_response = await fetch(
        "http://127.0.0.1:8000/api/spending_categories/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (transactions_summary.status === 401) {
        handleLogout();
        return;
      }

      const summary = await transactions_summary.json();
      const user = await user_response.json();
      const categories = await categories_response.json();

      setTransactionSummary(summary);
      setUserData(user);
      setData(categories);
      setTransactionsData(summary.recent_transactions || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    
    setIsLoggedIn(false);
    setData(null);
    setUserData(null);
    setTransactionSummary({});
    setTransactionsData([]);
  };

  const handleSignInSuccess = () => {
    setIsLoggedIn(true);
    setAuthMode(null);
    fetchData();
  };

  const handleSignUpSuccess = () => {
    setIsLoggedIn(true);
    setAuthMode(null);
    fetchData();
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  return (
    <>
      {authMode === "login" && (
        <Login
          onSuccess={handleSignInSuccess}
          onClose={() => setAuthMode(null)}
          onSwitchToRegister={() => setAuthMode("register")}
        />
      )}

      {authMode === "register" && (
        <Register
          onSuccess={handleSignUpSuccess}
          onClose={() => setAuthMode(null)}
          onSwitchToLogin={() => setAuthMode("login")}
        />
      )}
    <div className="dashboard-layout">
      <Sidebar
       isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onSignInClick={() => setAuthMode("login")}
        onSignUpClick={() => setAuthMode("register")}
          />

      <div className="dashboard-hero">
        <Topbar
          isLoggedIn={isLoggedIn}
          userData={userData}
          onSignInClick={() => setAuthMode("login")}
        />

        {showTransaction && (
          <TransactionModal
            onClose={() => setShowTransaction(false)}
            onSuccess={fetchData}
          />
        )}

        <Outlet
          context={{
            data,
            userData,
            transactionSummary,
            transactionsData,
            isLoggedIn,
            setIsLoggedIn,
            fetchData,
            setShowTransaction,
            setAllTransactions,
            showAllTransactions,
          }}
        />
      </div>
    </div>
      </>
  );
}