import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  const handleNavigateToRoutines = () => {
    navigate("/routines");
  };

  const handleNavigateToCourses = () => {
    navigate("/courses");
  };

  const handleNavigateToNotices = () => {
    navigate("/notices");
  };

  const handleNavigateToAcademicBills = () => {
    navigate("/academic-bills");
  };

  const menuItems = [
    { 
      title: "Routines", 
      icon: "📅", 
      description: "Manage class schedules and timetables",
      color: "#667eea"
    },
    { 
      title: "Courses", 
      icon: "📚", 
      description: "Course management and curriculum",
      color: "#764ba2"
    },
    { 
      title: "Results", 
      icon: "📊", 
      description: "Student results and grading",
      color: "#f093fb"
    },
    { 
      title: "Notices", 
      icon: "📢", 
      description: "Announcements and notifications",
      color: "#4facfe"
    },
    { 
      title: "Academic Bills", 
      icon: "💰", 
      description: "Manage academic fees and billing",
      color: "#ff6b6b"
    },
    { 
      title: "All Students", 
      icon: "👥", 
      description: "Student database and profiles",
      color: "#43e97b"
    },
    { 
      title: "Faculty", 
      icon: "👨‍🏫", 
      description: "Faculty management and records",
      color: "#fa709a"
    },
    { 
      title: "Departments", 
      icon: "🏢", 
      description: "Department administration",
      color: "#fee140"
    },
    { 
      title: "Reports", 
      icon: "📈", 
      description: "Analytics and reports",
      color: "#a8edea"
    }
  ];

  return (
    <div className={`dashboard-container ${isLoaded ? 'loaded' : ''}`}>
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>🎓 PSTU Admin Panel</h1>
            <p>Welcome to the University Management System</p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">👨‍🎓</div>
            <div className="stat-info">
              <h3>2,547</h3>
              <p>Total Students</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👨‍🏫</div>
            <div className="stat-info">
              <h3>156</h3>
              <p>Faculty Members</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <h3>48</h3>
              <p>Active Courses</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏢</div>
            <div className="stat-info">
              <h3>12</h3>
              <p>Departments</p>
            </div>
          </div>
        </div>

        <div className="dashboard-menu">
          {menuItems.map((item, index) => (
            <div 
              key={item.title} 
              className="menu-item"
              style={{ '--item-color': item.color, '--delay': `${index * 0.1}s` }}
              onClick={
                item.title === "Routines"
                  ? handleNavigateToRoutines
                  : item.title === "Courses"
                  ? handleNavigateToCourses
                  : item.title === "Notices"
                  ? handleNavigateToNotices
                  : item.title === "Academic Bills"
                  ? handleNavigateToAcademicBills
                  : undefined
              }
            >
              <div className="menu-item-icon">{item.icon}</div>
              <div className="menu-item-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className="menu-item-arrow">→</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
