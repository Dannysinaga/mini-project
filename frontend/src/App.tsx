import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EventDetailPage from "./pages/EventDetailPage";
import TransactionHistoryPage from "./pages/TransactionHistorypage";
import OrganizerPendingTransactionsPage from "./pages/OrganizerPendingTransactionsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/transactions" element={<TransactionHistoryPage />} />
        <Route
          path="/organizer/pending-transactions"
          element={<OrganizerPendingTransactionsPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;