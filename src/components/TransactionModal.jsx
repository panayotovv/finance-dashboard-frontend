import { useState } from "react";
import "../styles/TransactionModal.css";

export default function TransactionModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ category: "", amount: "", type: "", isInvestment: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => {
      const updated = { ...f, [name]: type === "checkbox" ? checked : value };
      if (name === "isInvestment" && checked) updated.category = "Investment";
      if (name === "isInvestment" && !checked) updated.category = "";
      return updated;
    });
    setError("");
  };

  const setType = (type) => {
    setForm((f) => ({ ...f, type }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.category) return setError("Please enter a category.");
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      return setError("Enter a valid amount.");
    if (!form.type) return setError("Choose income or expense.");

    setLoading(true);
    setError("");

    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch("http://127.0.0.1:8000/api/add_transactions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to add transaction");

      const data = await response.json();
      console.log("Transaction added:", data);

      onSuccess();
      onClose();
    } catch (err) {
      setError("Failed to add transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <div>
            <p className="modal-eyebrow">New entry</p>
            <h2 className="modal-title">Add transaction</h2>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="type-toggle">
          <button
            className={`type-btn ${form.type === "INCOME" ? "active-income" : ""}`}
            onClick={() => setType("INCOME")}
            type="button"
          >
            <span className="type-arrow income-arrow">↑</span> Income
          </button>
          <button
            className={`type-btn ${form.type === "EXPENSE" ? "active-expense" : ""}`}
            onClick={() => setType("EXPENSE")}
            type="button"
          >
            <span className="type-arrow expense-arrow">↓</span> Expense
          </button>
        </div>

        <div className="field-group">
          <label className="field-label">Category</label>
          <input
            type="text"
            name="category"
            placeholder={form.isInvestment ? "Investment" : "e.g. Rent, Groceries..."}
            value={form.category}
            onChange={handleChange}
            disabled={form.isInvestment}
            className="field-input"
          />
        </div>

        <div className="field-group">
          <label className="field-label">Amount</label>
          <div className="amount-wrapper">
            <span className="amount-prefix">$</span>
            <input
              type="number"
              name="amount"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="field-input amount-input"
            />
          </div>
        </div>

        <label className="investment-row">
          <input
            type="checkbox"
            name="isInvestment"
            checked={form.isInvestment}
            onChange={handleChange}
            className="investment-check"
          />
          <div>
            <p className="investment-title">Mark as investment</p>
            <p className="investment-sub">Category will be set to Investment</p>
          </div>
        </label>

        {error && <p className="error-msg">{error}</p>}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose} type="button">Cancel</button>
          <button className="btn-submit" onClick={handleSubmit} type="button" disabled={loading}>
            {loading ? "Adding..." : "Add transaction"}
          </button>
        </div>

      </div>
    </div>
  );
}