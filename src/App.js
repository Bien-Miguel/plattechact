import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";

function App() {
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [students, setStudents] = useState([]);

  // Read data from Firebase in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "students"), (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Add data to Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (studentName !== "" && studentId !== "") {
      await addDoc(collection(db, "students"), {
        name: studentName,
        studentNumber: studentId,
      });
      setStudentName('');
      setStudentId('');
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Student Record System</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Student Name" 
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input 
          type="text" 
          placeholder="Student ID" 
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}>
          Add Student
        </button>
      </form>

      <hr />

      <h2>Current Students</h2>
      <ul>
        {students.map((student) => (
          <li key={student.id} style={{ marginBottom: '10px' }}>
            <strong>{student.name}</strong> (ID: {student.studentNumber})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;