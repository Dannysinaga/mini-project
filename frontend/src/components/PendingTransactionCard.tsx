import type { Transaction } from "../types/transaction";

interface PendingTransactionCardProps {
  transaction: Transaction;
  onApprove: (transactionId: string) => Promise<void>;
  onReject: (transactionId: string) => Promise<void>;
}

const PendingTransactionCard = ({
  transaction,
  onApprove,
  onReject,
}: PendingTransactionCardProps) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      <h3>{transaction.event?.name}</h3>
      <p>User: {transaction.user?.profile?.fullName || transaction.user?.email}</p>
      <p>Status: {transaction.status}</p>
      <p>Total: IDR {transaction.finalAmount.toLocaleString()}</p>

      {transaction.paymentProofUrl && (
        <p>
          Payment Proof:{" "}
          <a href={transaction.paymentProofUrl} target="_blank" rel="noreferrer">
            View Proof
          </a>
        </p>
      )}

      {transaction.items.map((item) => (
        <div key={item.id} style={{ marginBottom: "8px" }}>
          <p>
            {item.ticketType?.name} - Qty: {item.quantity}
          </p>
        </div>
      ))}

      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        <button onClick={() => onApprove(transaction.id)}>Approve</button>
        <button onClick={() => onReject(transaction.id)}>Reject</button>
      </div>
    </div>
  );
};

export default PendingTransactionCard;