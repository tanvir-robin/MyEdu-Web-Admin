import React, { useState, useEffect } from 'react';
import './AcademicBills.css';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const AcademicBills = () => {
  const [bills, setBills] = useState([]);
  const [newBill, setNewBill] = useState({
    purpose: '',
    deadline: '',
    remarks: '',
    items: [],
  });
  const [currentItem, setCurrentItem] = useState({ detail: '', amount: '' });
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewBillForm, setShowNewBillForm] = useState(false);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'academic_fees'));
        const fetchedBills = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Ensure items have numeric amounts
          const items = data.items ? data.items.map(item => ({
            ...item,
            amount: typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount
          })) : [];
          
          return {
            id: doc.id,
            ...data,
            items,
            total: typeof data.total === 'string' ? parseFloat(data.total) : data.total
          };
        });
        setBills(fetchedBills);
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };
    fetchBills();
  }, []);

  const addItem = () => {
    if (currentItem.detail.trim() && currentItem.amount && parseFloat(currentItem.amount) > 0) {
      const amount = parseFloat(currentItem.amount);
      const updatedItems = [...newBill.items, { 
        detail: currentItem.detail.trim(), 
        amount: amount 
      }];
      setNewBill({ ...newBill, items: updatedItems });
      setTotal(total + amount);
      setCurrentItem({ detail: '', amount: '' });
    }
  };

  const removeItem = (index) => {
    const itemToRemove = newBill.items[index];
    const updatedItems = newBill.items.filter((_, i) => i !== index);
    setNewBill({ ...newBill, items: updatedItems });
    setTotal(total - itemToRemove.amount);
  };

  const saveBill = async () => {
    if (newBill.purpose.trim() && newBill.deadline && newBill.items.length > 0) {
      setIsLoading(true);
      try {
        const billData = { 
          ...newBill, 
          total, 
          createdAt: new Date().toISOString(),
          status: 'active'
        };
        const docRef = await addDoc(collection(db, 'academic_fees'), billData);
        setBills([...bills, { id: docRef.id, ...billData }]);
        setNewBill({ purpose: '', deadline: '', remarks: '', items: [] });
        setTotal(0);
        setShowNewBillForm(false);
      } catch (error) {
        console.error('Error saving bill:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getBillStatus = (deadline) => {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    return deadlineDate > currentDate ? 'Active' : 'Expired';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="academic-bills-container">
      <div className="bills-header">
        <h1>💰 Academic Bills Management</h1>
        <p>Manage and track all academic fees and billing</p>
      </div>

      <div className="bills-actions">
        <button 
          className={`create-bill-btn ${showNewBillForm ? 'active' : ''}`}
          onClick={() => setShowNewBillForm(!showNewBillForm)}
        >
          {showNewBillForm ? '✕ Cancel' : '+ Create New Bill'}
        </button>
      </div>

      {showNewBillForm && (
        <div className="new-bill-section">
          <div className="new-bill-card">
            <h2>📝 Create New Bill</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Purpose</label>
                <input
                  type="text"
                  placeholder="e.g., Semester Fee, Library Fee"
                  value={newBill.purpose}
                  onChange={e => setNewBill({ ...newBill, purpose: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  value={newBill.deadline}
                  onChange={e => setNewBill({ ...newBill, deadline: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Remarks</label>
              <textarea
                placeholder="Additional notes or instructions..."
                value={newBill.remarks}
                onChange={e => setNewBill({ ...newBill, remarks: e.target.value })}
                className="form-textarea"
                rows="3"
              />
            </div>

            <div className="items-section">
              <h3>📋 Bill Items</h3>
              
              <div className="add-item-form">
                <div className="item-inputs">
                  <input
                    type="text"
                    placeholder="Item description (e.g., Enrollment Fee)"
                    value={currentItem.detail}
                    onChange={e => setCurrentItem({ ...currentItem, detail: e.target.value })}
                    className="form-input"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={currentItem.amount}
                    onChange={e => setCurrentItem({ ...currentItem, amount: e.target.value })}
                    className="form-input amount-input"
                    min="0"
                    step="0.01"
                  />
                  <button 
                    type="button"
                    onClick={addItem}
                    className="add-item-btn"
                    disabled={!currentItem.detail.trim() || !currentItem.amount}
                  >
                    Add
                  </button>
                </div>
              </div>

              {newBill.items.length > 0 && (
                <div className="items-list">
                  {newBill.items.map((item, index) => (
                    <div key={index} className="item-row">
                      <span className="item-detail">{item.detail}</span>
                      <span className="item-amount">৳{(typeof item.amount === 'number' ? item.amount : parseFloat(item.amount) || 0).toFixed(2)}</span>
                      <button 
                        onClick={() => removeItem(index)}
                        className="remove-item-btn"
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  
                  <div className="total-row">
                    <span className="total-label">Total Amount:</span>
                    <span className="total-amount">৳{total.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button 
                onClick={() => setShowNewBillForm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={saveBill}
                className="save-bill-btn"
                disabled={isLoading || !newBill.purpose.trim() || !newBill.deadline || newBill.items.length === 0}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Saving...
                  </>
                ) : (
                  '💾 Save Bill'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bills-list-section">
        <h2>📊 All Bills</h2>
        {bills.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3>No bills found</h3>
            <p>Create your first academic bill to get started</p>
          </div>
        ) : (
          <div className="bills-grid">
            {bills.map((bill, index) => (
              <div 
                key={bill.id} 
                className={`bill-card ${getBillStatus(bill.deadline).toLowerCase()}`}
                style={{ '--delay': `${index * 0.1}s` }}
              >
                <div className="bill-header">
                  <div className="bill-id">
                    <span className="id-label">Bill ID:</span>
                    <span className="id-value">#{bill.id.slice(-6).toUpperCase()}</span>
                  </div>
                  <div className={`status-badge ${getBillStatus(bill.deadline).toLowerCase()}`}>
                    {getBillStatus(bill.deadline)}
                  </div>
                </div>
                
                <div className="bill-content">
                  <h3 className="bill-purpose">{bill.purpose}</h3>
                  
                  <div className="bill-details">
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span className="detail-text">Deadline: {formatDate(bill.deadline)}</span>
                    </div>
                    
                    {bill.remarks && (
                      <div className="detail-item">
                        <span className="detail-icon">📝</span>
                        <span className="detail-text">{bill.remarks}</span>
                      </div>
                    )}
                    
                    <div className="detail-item">
                      <span className="detail-icon">📋</span>
                      <span className="detail-text">{bill.items?.length || 0} items</span>
                    </div>
                  </div>
                  
                  <div className="bill-total">
                    <span className="total-label">Total Amount</span>
                    <span className="total-value">৳{(typeof bill.total === 'number' ? bill.total : parseFloat(bill.total) || 0).toFixed(2)}</span>
                  </div>
                  
                  {bill.items && bill.items.length > 0 && (
                    <div className="bill-items-preview">
                      <h4>Items:</h4>
                      <ul>
                        {bill.items.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            {item.detail}: <strong>৳{(typeof item.amount === 'number' ? item.amount : parseFloat(item.amount) || 0).toFixed(2)}</strong>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicBills;
