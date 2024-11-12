import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// css
import './index.css';
// Internal Import
import Home from './pages/Home';
import NavBar from './components/NavBar';
import EmergencyForm from './pages/Emergency';
import VerifyEmail from './pages/VerifyEmail';

const App = () => {
  return (
    <>
      <Router>
        {/* <NavBar></NavBar> */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/emergency' element={<EmergencyForm />} />
          <Route path='/verify-email/:token' element={<VerifyEmail />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
