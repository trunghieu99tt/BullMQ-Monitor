import { Routes, Route } from "react-router";
import withLayout from "./layout";
import QueueDetail from "./pages/queue-detail";
import QueueList from "./pages/queue-list";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Hello</div>} />
      <Route
        path="/connection/:connectionId/:queueName"
        element={<QueueDetail />}
      />
      <Route path="/connection/:connectionId" element={<QueueList />} />
    </Routes>
  );
};

export default withLayout(App);
