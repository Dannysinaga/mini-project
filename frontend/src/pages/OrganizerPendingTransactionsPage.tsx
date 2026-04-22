import { useEffect, useState } from "react";
import PendingTransactionCard from "../components/PendingTransactionCard";
import {
  approveTransaction,
  getPendingTransactions,
  rejectTransaction,
} from "../services/transaction.service";
import type { Transaction } from "../types/transaction";

const ORGANIZER_ID = "88c148da-aa4e-4cf2-bc2c-11c307d10bb5";

const OrganizerPendingTransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchPendingTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPendingTransactions(ORGANIZER_ID);
      setTransactions(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch pending transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTransactions();
  }, []);

  const handleApprove = async (transactionId: string) => {
    try {
      await approveTransaction(transactionId);
      alert("Transaction approved successfully");
      fetchPendingTransactions();
    } catch (err) {
      console.error(err);
      alert("Failed to approve transaction");
    }
  };

  const handleReject = async (transactionId: string) => {
    try {
      const reason = prompt("Enter rejection reason") || "Payment rejected";
      await rejectTransaction(transactionId, reason);
      alert("Transaction rejected successfully");
      fetchPendingTransactions();
    } catch (err) {
      console.error(err);
      alert("Failed to reject transaction");
    }
  };

  if (loading) return <p>Loading pending transactions...</p>;
  if (error) return <p>{error}</p>;
  if (transactions.length === 0) return <p>No pending transactions found</p>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>Organizer Pending Transactions</h1>

      {transactions.map((transaction) => (
        <PendingTransactionCard
          key={transaction.id}
          transaction={transaction}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      ))}
    </div>
  );
};

export default OrganizerPendingTransactionsPage;