'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Assuming this is a custom Button component
import Image from 'next/image'; // For using the logo image

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
    <div className="flex items-center justify-center min-h-screen bg-yellow-100">
      <div className="bg-white bg-opacity-50 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-96">
        {/* Logo and Tagline */}
        <div className="flex justify-center items-center mb-6">
          <div className="flex flex-col items-left">
            <span className="font-bold text-4xl text-gray-500">Rise</span>
            <span className="font-bold text-3xl text-yellow-500">Beacon</span>
            <span className="text-sm text-gray-500">Connect, Contribute, Change</span>
          </div>
        </div>

        {/* Login Title */}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

        {/* User Type Buttons */}
        <div className="flex justify-between mb-6">
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

        {/* Login Button */}
        {!loggedIn ? (
          <Button 
            onClick={login} 
            className="w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition-all duration-300"
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
            className="w-full bg-yellow-600 text-white py-2 rounded-xl hover:bg-yellow-700 transition-all duration-300"
          >
            Proceed to Dashboard
          </Button>
        )}
      </div>
    </div>
  );
}
