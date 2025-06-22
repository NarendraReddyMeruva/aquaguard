import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth } from "./components/auth";
import Chat from './components/Chat';
import Usage from './components/Usage';
import Tips from './components/Tips';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Auth />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/usage" element={<Usage />} />
        <Route path="/tips" element={<Tips />} />
      </Routes>
    </Router>
  );
}

export default App; 
