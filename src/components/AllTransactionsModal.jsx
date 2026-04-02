import { useState } from "react";
import "../styles/TransactionModal.css";

export default function AllTransactionsModal({ onClose, alltransactions = []}) {
    const Transactions = [...alltransactions];

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content-transactions" onClick={(e) => e.stopPropagation()}>
            <h2 className="sign-in-header">All Transactions</h2>    
            <div className="transaction-list">
                {Transactions.map(tx => (
                    <div key={tx.id} className="transaction-item">
                    <div className="transaction-info">
                        <div className="transaction-row">
                            <p className="transaction-desc">{tx.category}</p>
                            <p className="transaction-date">
                                {tx.created_at.slice(0, 10)}
                            </p>
                        </div>

                        <p
                        className={
                            tx.type === "EXPENSE"
                            ? "transaction-amount transaction-change--down"
                            : "transaction-amount transaction-change--up"
                        }
                        >
                        {tx.type === "EXPENSE" ? "-" : "+"} €
                        {Number(tx.amount).toFixed(0)}
                        </p>
                    </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </>
  );
}