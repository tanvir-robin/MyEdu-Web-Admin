import React, { useState, useEffect } from 'react';
import './Courses.css';
import { db } from '../firebaseConfig';
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, addDoc } from 'firebase/firestore';

const Courses = () => {
  const [semester, setSemester] = useState('1st');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

  // Sample courses for random generation
  const sampleCourses = {
    '1st': [
      { code: 'ENG-101', name: 'English Composition', teachers: ['Dr. Sarah Johnson', 'Prof. Mike Wilson'] },
      { code: 'MATH-101', name: 'Calculus I', teachers: ['Dr. David Lee', 'Prof. Emily Chen'] },
      { code: 'PHY-101', name: 'Physics I', teachers: ['Dr. Robert Brown', 'Prof. Lisa Garcia'] },
      { code: 'CSE-101', name: 'Introduction to Computer Science', teachers: ['Dr. Ahmed Rahman', 'Prof. Maria Rodriguez'] }
    ],
    '2nd': [
      { code: 'CSE-201', name: 'Data Structures', teachers: ['Dr. John Smith', 'Prof. Anna Davis'] },
      { code: 'MATH-201', name: 'Discrete Mathematics', teachers: ['Dr. Kevin Wu', 'Prof. Rachel Kim'] },
      { code: 'ENG-201', name: 'Technical Writing', teachers: ['Dr. Jennifer Lopez', 'Prof. Steven Clark'] },
      { code: 'PHY-201', name: 'Physics II', teachers: ['Dr. Michael Taylor', 'Prof. Sandra Martinez'] }
    ]
    // Add more semesters as needed
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // First, ensure the main courses document exists
        const coursesDocRef = doc(db, 'courses', 'main');
        const coursesDocSnap = await getDoc(coursesDocRef);
        
        if (!coursesDocSnap.exists()) {
          // Create the main document with updatedAt field
          await setDoc(coursesDocRef, {
            updatedAt: new Date()
          });
        }

        // Get courses from the semester subcollection
        const semesterCollectionRef = collection(db, 'courses', 'main', semester);
        const semesterSnapshot = await getDocs(semesterCollectionRef);
        
        const coursesData = [];
        semesterSnapshot.forEach((doc) => {
          coursesData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([]);
      }
      setLoading(false);
    };
    fetchCourses();
  }, [semester]);

  const handleAddCourse = () => {
    const newCourse = {
      code: '',
      name: '',
      teachers: ['', ''],
      createdAt: new Date(),
      tempId: `temp_${Date.now()}` // Temporary ID for local state
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const handleGenerateRandomCourses = async () => {
    const semesterCourses = sampleCourses[semester] || sampleCourses['1st'];
    
    try {
      // Clear existing courses first
      setCourses([]);
      
      // Add sample courses with proper structure
      const coursesWithMetadata = semesterCourses.map(course => ({
        ...course,
        createdAt: new Date(),
        tempId: `temp_${Date.now()}_${Math.random()}`
      }));
      
      setCourses(coursesWithMetadata);
    } catch (error) {
      console.error('Error generating courses:', error);
    }
  };

  const handleInputChange = (index, field, value) => {
    setCourses(prev => 
      prev.map((course, i) => 
        i === index ? { ...course, [field]: value } : course
      )
    );
  };

  const handleTeacherChange = (index, teacherIndex, value) => {
    setCourses(prev => 
      prev.map((course, i) => 
        i === index 
          ? {
              ...course,
              teachers: course.teachers.map((teacher, tIndex) => 
                tIndex === teacherIndex ? value : teacher
              )
            }
          : course
      )
    );
  };

  const handleDeleteCourse = async (index, courseId) => {
    try {
      // If course has a real ID (saved in database), delete from Firestore
      if (courseId && !courseId.startsWith('temp_')) {
        const courseDocRef = doc(db, 'courses', 'main', semester, courseId);
        await deleteDoc(courseDocRef);
      }
      
      // Remove from local state
      setCourses(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Error deleting course. Please try again.');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update the main document's updatedAt field
      const coursesDocRef = doc(db, 'courses', 'main');
      await setDoc(coursesDocRef, {
        updatedAt: new Date()
      }, { merge: true });

      // Save each course to the semester subcollection
      const semesterCollectionRef = collection(db, 'courses', 'main', semester);
      
      for (const course of courses) {
        const courseData = {
          code: course.code,
          name: course.name,
          teachers: course.teachers,
          updatedAt: new Date()
        };

        if (course.id && !course.id.startsWith('temp_')) {
          // Update existing course
          const courseDocRef = doc(db, 'courses', 'main', semester, course.id);
          await setDoc(courseDocRef, courseData, { merge: true });
        } else {
          // Add new course
          const docRef = await addDoc(semesterCollectionRef, {
            ...courseData,
            createdAt: new Date()
          });
          
          // Update local state with the new ID
          setCourses(prev => 
            prev.map(c => 
              c.tempId === course.tempId 
                ? { ...c, id: docRef.id, tempId: undefined }
                : c
            )
          );
        }
      }
      
      alert('Courses saved successfully!');
    } catch (error) {
      console.error('Error saving courses:', error);
      alert('Error saving courses. Please try again.');
    }
    setSaving(false);
  };

  return (
    <div className="courses-container">
      <h1>📚 Course Management</h1>
      
      {/* Semester Selector */}
      <div className="semester-selector">
        {semesters.map((sem) => (
          <button
            key={sem}
            className={semester === sem ? 'active' : ''}
            onClick={() => setSemester(sem)}
          >
            {sem} Semester
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button onClick={handleAddCourse} className="add-course-btn">
          <span className="btn-icon">➕</span>
          Add New Course
        </button>
        <button onClick={handleGenerateRandomCourses} className="generate-btn">
          <span className="btn-icon">🎲</span>
          Generate Sample Courses
        </button>
        <div className="course-count">
          <span className="count-badge">{courses.length}</span>
          <span className="count-text">Courses</span>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="courses-grid">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No courses added yet</h3>
            <p>Start by adding a new course or generating sample courses for this semester.</p>
          </div>
        ) : (
          courses.map((course, index) => (
            <div key={course.id || course.tempId || index} className="course-card" style={{ '--delay': `${index * 0.1}s` }}>
              <div className="course-header">
                <div className="course-number">#{index + 1}</div>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDeleteCourse(index, course.id)}
                  title="Delete Course"
                >
                  🗑️
                </button>
              </div>
              
              <div className="course-fields">
                <div className="field-group">
                  <label>Course Code</label>
                  <input
                    type="text"
                    placeholder="e.g., CSE-101"
                    value={course.code}
                    onChange={(e) => handleInputChange(index, 'code', e.target.value)}
                    className="course-input"
                  />
                </div>
                
                <div className="field-group">
                  <label>Course Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Data Structures"
                    value={course.name}
                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                    className="course-input"
                  />
                </div>
                
                <div className="field-group">
                  <label>Primary Teacher</label>
                  <input
                    type="text"
                    placeholder="e.g., Dr. John Smith"
                    value={course.teachers[0]}
                    onChange={(e) => handleTeacherChange(index, 0, e.target.value)}
                    className="course-input"
                  />
                </div>
                
                <div className="field-group">
                  <label>Secondary Teacher (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Prof. Jane Doe"
                    value={course.teachers[1]}
                    onChange={(e) => handleTeacherChange(index, 1, e.target.value)}
                    className="course-input"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Save Button */}
      {courses.length > 0 && (
        <div className="save-section">
          <button 
            onClick={handleSave} 
            className="save-button" 
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="loading-spinner small"></div>
                Saving...
              </>
            ) : (
              <>
                <span className="btn-icon">💾</span>
                Save All Courses
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Courses;
