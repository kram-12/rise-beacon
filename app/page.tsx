'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Assuming this is a custom Button component

export default function LoginPage() {
  const [userType, setUserType] = useState<'volunteer' | 'organization'>('volunteer');
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in by userType
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType) {
      setLoggedIn(true);
      setUserType(storedUserType as 'volunteer' | 'organization');
    }
  }, []);

  const login = () => {
    // Save userType in localStorage without email
    localStorage.setItem('userType', userType);
    setLoggedIn(true);

    // Redirect based on userType
    if (userType === 'organization') {
      router.push('/home_o');
    } else {
      router.push('/home_v');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <div className="flex justify-between mb-4">
          <button 
            className={`px-4 py-2 rounded-xl w-full mx-1 ${userType === 'volunteer' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setUserType('volunteer')}
          >
            Volunteer
          </button>
          <button 
            className={`px-4 py-2 rounded-xl w-full mx-1 ${userType === 'organization' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setUserType('organization')}
          >
            Organization
          </button>
        </div>
        {!loggedIn ? (
          <Button 
            onClick={login} 
            className="w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600"
          >
            Login as {userType.charAt(0).toUpperCase() + userType.slice(1)}
          </Button>
        ) : (
          <Button 
            onClick={() => {
              if (userType === 'organization') {
                router.push('/home_o');
              } else {
                router.push('/home_v');
              }
            }} 
            className="w-full bg-yellow-600 text-white py-2 rounded-xl hover:bg-yellow-700"
          >
            Proceed to Dashboard
          </Button>
        )}
      </div>
    </div>
  );
}
