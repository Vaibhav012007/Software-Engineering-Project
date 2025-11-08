import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx";

// Pages
import Dashboard from "./Components/dashboard/Dashboard";
import Hospitals from "./Components/hospitals/Hospitals";
import Appointments from "./Components/appointments/Appointments";
import Patients from "./Components/patients/Patients";
import Referrals from "./Components/referrals/Referrals";
import Resources from "./Components/resources/Resources";
import Pharmacy from "./Components/pharmacy/Pharmacy";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Hospitals" element={<Hospitals />} />
          <Route path="/Appointments" element={<Appointments />} />
          <Route path="/Patients" element={<Patients />} />
          <Route path="/Referrals" element={<Referrals />} />
          <Route path="/Resources" element={<Resources />} />
          <Route path="/Pharmacy" element={<Pharmacy />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
