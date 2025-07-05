import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SummaryPage from "./pages/SummaryPage";
import RecapPage from "./pages/RecapPage";
import SummaryDetailPage from "./pages/SummaryDetailPage";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/resum" element={<SummaryPage />} />
          <Route path="/recap" element={<RecapPage />} />
          <Route path="/resum/:year/:month" element={<SummaryPage />} />
          <Route path="/recap/resum/:year/:month" element={<SummaryDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
