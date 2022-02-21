import { Routes, Route } from "react-router";
import withLayout from "./layout";
import QueueDetail from "./pages/queue-detail";
import QueueList from "./pages/queue-list";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<QueueList />} />
      <Route path="/:queueName" element={<QueueDetail />} />
    </Routes>
  );
};

export default withLayout(App);
