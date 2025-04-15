import React,{useState} from 'react'
import AdminDashboard from '../components/AdminDashBoard'
import SecurityGuards from '../components/SecurityGuards';
import Bookings from '../components/Bookings';
import Sidebar from '../components/SlideBar';
import Payment from '../components/Payment';
import Progress from '../components/Progress'
import Track from '../components/Track'
import Schedule from '../components/Schedule';
import SalaryManagement from '../components/SalaryManagement';

const AdminPage = () => {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");

  const renderComponent = () => {
    switch (selectedMenu) {
      case "SecurityGuards":
        return <SecurityGuards />;
      case "Bookings":
        return <Bookings />;
      case "Payment":
          return <Payment/>
      case "Progress":
          return <Progress/>
      case "Track":
          return <Track/>
        case 'Schedule':
          return <Schedule/>
          case 'SalaryManagement':
            return <SalaryManagement/>
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setSelectedMenu={setSelectedMenu} />
      <div style={{ marginLeft: "50px", padding: "20px", width: "100%" ,marginTop:'50px'}}>
        {renderComponent()}
      </div>
    </div>
  )
}

export default AdminPage