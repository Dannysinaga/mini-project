import { useState } from "react";
import type { Transaction } from "../types/transaction";

interface TransactionCardProps {
  transaction: Transaction;
  onUploadProof: (transactionId: string, paymentProofUrl: string) => Promise<void>;
}

const TransactionCard = ({
  transaction,
  onUploadProof,
}: TransactionCardProps) => {
  const [paymentProofUrl, setPaymentProofUrl] = useState("");

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
      <p>Status: {transaction.status}</p>
      <p>Total: IDR {transaction.finalAmount.toLocaleString()}</p>
      <p>Created At: {new Date(transaction.createdAt).toLocaleString()}</p>

      {transaction.items.map((item) => (
        <div key={item.id} style={{ marginBottom: "8px" }}>
          <p>
            {item.ticketType?.name} - Qty: {item.quantity}
          </p>
        </div>
      ))}

      {transaction.paymentProofUrl && (
        <p>
          Payment Proof:{" "}
          <a href={transaction.paymentProofUrl} target="_blank" rel="noreferrer">
            View Proof
          </a>
        </p>
      )}

      {transaction.status === "WAITING_PAYMENT" && !transaction.paymentProofUrl && (
        <div style={{ marginTop: "12px" }}>
          <input
            type="text"
            placeholder="Input payment proof URL"
            value={paymentProofUrl}
            onChange={(e) => setPaymentProofUrl(e.target.value)}
            style={{ padding: "8px", width: "100%", maxWidth: "400px" }}
          />

          <button
            style={{ marginTop: "8px" }}
            onClick={() => onUploadProof(transaction.id, paymentProofUrl)}
          >
            Upload Payment Proof
          </button>
        </div>
      )}

      {transaction.rejectionReason && (
        <p style={{ color: "red" }}>
          Rejection Reason: {transaction.rejectionReason}
        </p>
      )}
    </div>
  );
};

export default TransactionCard;