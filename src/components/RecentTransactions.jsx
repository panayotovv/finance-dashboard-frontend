import '../styles/RecentTransactions.css';

export default function RecentTransactions({ transactions = [], onTransaction }) {
  const Transactions = [...transactions.slice(0, 3)];

  return (
    <div className="rtx">
      <div className="rtx__header">
        <p className="rtx__title">Recent Transactions</p>
        <button className="rtx__view-all" onClick={onTransaction}>View all →</button>
      </div>

      <div className="rtx__list">
        {Transactions.map(tx => (
          <div key={tx.id} className="rtx__item">
            <div className="rtx__info">
              <div className="rtx__row">
                <p className="rtx__desc">{tx.category}</p>
                <p className="rtx__date">{tx.created_at.slice(0, 10)}</p>
              </div>
              <p className={tx.type === 'EXPENSE' ? 'rtx__amount transaction__change--down' : 'rtx__amount transaction__change--up'}>
                {tx.type === 'EXPENSE' ? '-' : '+'} €{Number(tx.amount).toFixed(0)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}