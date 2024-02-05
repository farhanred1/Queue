import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import UserJoin from "./pages/UserJoin";
import UserDashboard from './pages/UserDashboard';
import UserOtp from './pages/UserOtp';

import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  console.log("app render");
  return (
<Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/create-ticket/:adminId/:queueId/" element={<UserJoin />} />
        <Route path="/create-ticket/:adminId/:queueId/otp/" element={<UserOtp />} />
        <Route path="/dashboard/:adminId/:queueId/:ticketId/" element={<UserDashboard />} />

        <Route path="/login" element={<AdminLogin />} />
        <Route path="/sign-up" element={<AdminSignup />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;
