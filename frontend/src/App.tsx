import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home.Page";
import EventDetailPage from "./pages/Event.Detail.Page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;