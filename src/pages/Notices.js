import React, { useState, useEffect } from 'react';
import './Notices.css';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);

  console.log('Notices component mounted, current notices:', notices);

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        console.log('Fetching notices...');
        const noticesCollection = collection(db, 'notices');
        const q = query(noticesCollection, orderBy('created_at', 'desc'));
        const noticesSnapshot = await getDocs(q);
        const noticesData = noticesSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        console.log('Fetched notices:', noticesData);
        setNotices(noticesData);
      } catch (error) {
        console.error('Error fetching notices:', error);
      }
      setLoading(false);
    };

    fetchNotices();
  }, []);

  const handleAddNotice = async () => {
    if (!newNotice.title.trim() || !newNotice.content.trim()) {
      alert('Please fill in both the title and content.');
      return;
    }

    try {
      const noticesCollection = collection(db, 'notices');
      const now = new Date();
      const newNoticeData = {
        title: newNotice.title.trim(),
        content: newNotice.content.trim(),
        created_at: now,
        updated_at: now
      };
      
      const docRef = await addDoc(noticesCollection, newNoticeData);
      console.log('Added notice with ID:', docRef.id);
      
      // Add to local state with the new ID
      setNotices(prev => [{ id: docRef.id, ...newNoticeData }, ...prev]);
      setNewNotice({ title: '', content: '' });
      alert('Notice added successfully!');
    } catch (error) {
      console.error('Error adding notice:', error);
      alert('Error adding notice. Please try again.');
    }
  };

  const handleDeleteNotice = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const noticeDoc = doc(db, 'notices', id);
      await deleteDoc(noticeDoc);
      setNotices(prev => prev.filter(notice => notice.id !== id));
      console.log('Deleted notice with ID:', id);
    } catch (error) {
      console.error('Error deleting notice:', error);
      alert('Error deleting notice. Please try again.');
    }
  };

  return (
    <div className="notices-page">
      <div className="notices-container">
        <h1>📢 Notice Board</h1>

        <div className="add-notice">
          <input
            type="text"
            placeholder="Notice Title"
            value={newNotice.title}
            onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
          />
          <textarea
            placeholder="Notice Content"
            value={newNotice.content}
            onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
          ></textarea>
          <button onClick={handleAddNotice}>Add Notice</button>
        </div>

        <div className="notices-list">
          {loading ? (
            <div className="loading-message">
              <div className="loading-spinner"></div>
              Loading notices...
            </div>
          ) : notices.length === 0 ? (
            <div className="empty-message">
              📭 No notices available.
            </div>
          ) : (
            notices.map(notice => (
              <div key={notice.id} className="notice-item">
                <h3>{notice.title}</h3>
                <p>{notice.content}</p>
                <div className="notice-meta">
                  <span className="notice-date">
                    {notice.created_at?.toDate?.() 
                      ? notice.created_at.toDate().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'No date'
                    }
                  </span>
                </div>
                <button 
                  onClick={() => handleDeleteNotice(notice.id, notice.title)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notices;
