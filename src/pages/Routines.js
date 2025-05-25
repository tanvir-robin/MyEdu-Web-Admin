import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import "./Routines.css";

const semesters = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
const timeSlots = ["10:00", "11:00", "12:00", "14:00"]; // 10 AM, 11 AM, 12 PM, 2 PM

const Routines = () => {
  const [selectedSemester, setSelectedSemester] = useState("6th");
  const [routine, setRoutine] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchRoutine = async (semester) => {
      setIsLoading(true);
      try {
        const docRef = doc(collection(db, "routines"), semester);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRoutine(docSnap.data());
        } else {
          // Initialize with default time slots
          const defaultRoutine = {};
          days.forEach(day => {
            defaultRoutine[day] = {};
            timeSlots.forEach((time, index) => {
              defaultRoutine[day][index] = time;
              defaultRoutine[day][`course_${index}`] = "";
            });
          });
          setRoutine(defaultRoutine);
        }
      } catch (error) {
        console.error("Error fetching routine:", error);
        alert("Error fetching routine data");
      }
      setIsLoading(false);
    };

    fetchRoutine(selectedSemester);
  }, [selectedSemester]);

  const handleTimeChange = (day, index, value) => {
    setRoutine((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [index]: value,
      },
    }));
  };

  const handleCourseChange = (day, index, value) => {
    setRoutine((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [`course_${index}`]: value,
      },
    }));
  };

  const generateRandomRoutine = () => {
    const departments = ["CIT", "CCE", "EEE"];
    const level = Math.ceil(parseInt(selectedSemester) / 2);
    const semester = (parseInt(selectedSemester) % 2) === 0 ? 2 : 1;
    const coursePrefix = `${level}${semester}`;
    
    const courseSubjects = [
      "Programming", "Database", "Networks", "Software Engineering", 
      "Data Structures", "Algorithms", "Computer Graphics", "AI",
      "System Analysis", "Web Technology", "Mobile Computing", "Security"
    ];
    
    const newRoutine = {};
    days.forEach(day => {
      newRoutine[day] = {};
      timeSlots.forEach((time, index) => {
        newRoutine[day][index] = time;
        const dept = departments[Math.floor(Math.random() * departments.length)];
        const subject = courseSubjects[Math.floor(Math.random() * courseSubjects.length)];
        const courseNum = String(Math.floor(Math.random() * 9) + 1).padStart(2, '0');
        newRoutine[day][`course_${index}`] = `${dept}-${coursePrefix}${courseNum} ${subject}`;
      });
    });
    
    setRoutine(newRoutine);
  };

  const saveRoutine = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(collection(db, "routines"), selectedSemester);
      await setDoc(docRef, routine);
      alert("✅ Routine saved successfully!");
    } catch (error) {
      console.error("Error saving routine:", error);
      alert("❌ Error saving routine");
    }
    setIsSaving(false);
  };

  return (
    <div className="routines-container">
      <button 
        onClick={() => navigate("/dashboard")} 
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(255,255,255,0.8)',
          border: 'none',
          borderRadius: '50px',
          padding: '10px 20px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        ← Back to Dashboard
      </button>
      
      <h1>📚 Class Routines Management</h1>
      
      <div className="semester-selector">
        {semesters.map((semester) => (
          <button
            key={semester}
            className={selectedSemester === semester ? "active" : ""}
            onClick={() => setSelectedSemester(semester)}
          >
            {semester} Semester
          </button>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button 
          onClick={generateRandomRoutine}
          style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            padding: '0.8rem 1.5rem',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',
            marginRight: '1rem'
          }}
        >
          🎲 Generate Random Routine
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading-spinner"></div>
          <p>Loading routine...</p>
        </div>
      ) : (
        <div className="routine-editor">
          {days.map((day, dayIndex) => (
            <div key={day} className="day-section" style={{ '--delay': `${dayIndex * 0.1}s` }}>
              <h3>{day}</h3>
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="class-time">
                  <label>Class {index + 1}:</label>
                  <input
                    type="time"
                    value={routine[day]?.[index] || timeSlots[index] || ""}
                    onChange={(e) => handleTimeChange(day, index, e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="e.g., CIT-3201 Programming"
                    value={routine[day]?.[`course_${index}`] || ""}
                    onChange={(e) => handleCourseChange(day, index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      
      <div style={{ textAlign: 'center' }}>
        <button 
          className="save-button" 
          onClick={saveRoutine} 
          disabled={isLoading || isSaving}
        >
          {isSaving && <div className="loading-spinner"></div>}
          {isSaving ? "Saving..." : "💾 Save Routine"}
        </button>
      </div>
    </div>
  );
};

export default Routines;
