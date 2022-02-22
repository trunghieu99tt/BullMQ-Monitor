import { Routes, Route } from "react-router";
import withLayout from "./layout";
import QueueDetail from "./pages/connection-queue-detail";
import QueueList from "./pages/connection-queue-list";
import Home from "./pages/home";
import { useApp } from "./talons/useApp";

const App = () => {
  const appTalons = useApp();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/connection/:connectionId/:queueName"
        element={<QueueDetail />}
      />
      <Route path="/connection/:connectionId" element={<QueueList />} />
    </Routes>
  );
};

export default withLayout(App);
