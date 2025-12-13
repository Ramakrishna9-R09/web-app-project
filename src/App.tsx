import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import CommunityView from './components/CommunityView';
import Profile from './components/Profile';
import Auth from './components/Auth';
import Communities from './components/Communities';
import { useStore } from './store/useStore';

const App = () => {
  const { currentUser, setCurrentUser } = useStore();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists()) {
          // Create new user document if first time
          const newUser = {
            id: user.uid,
            name: user.displayName || 'VIT Student',
            email: user.email,
            avatar: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
            role: 'student',
            department: 'Not Set',
            bio: '',
            createdAt: new Date().toISOString()
          };
          
          await setDoc(doc(db, 'users', user.uid), newUser);
          setCurrentUser(newUser);
        } else {
          setCurrentUser(userDoc.data() as any);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex gap-8">
          <Sidebar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/communities" element={<Communities />} />
              <Route path="/community/:id" element={<CommunityView />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;