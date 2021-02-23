import { BrowserRouter as Router } from "react-router-dom";
import Homapage from "./components/pages/Homapage";
import Header from "./components/headers/Header";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Homapage />
      </div>
    </Router>
  );
}

export default App;
