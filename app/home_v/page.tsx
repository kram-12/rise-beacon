// @ts-nocheck
'use client'
import { useState, useEffect } from 'react'
import { ArrowRight,HeartHandshake, Handshake, Recycle,ClockArrowUp, Users, Coins, MapPin, ChevronRight,Building2,Building,Clock,Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Poppins } from 'next/font/google'
import Image from 'next/image';
import Link from 'next/link'
import ContractInteraction from '@/components/ContractInteraction'
import { getRecentReports, getAllRewards, getWasteCollectionTasks, getTotalRewards, getVolunteersEngaged } from '@/utils/db/actions'
const poppins = Poppins({ 
  weight: ['300', '400', '600'],
  subsets: ['latin'],
  display: 'swap',
})

function AnimatedGlobe() {
  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
      <div className="absolute inset-0 rounded-full bg-yellow-500 opacity-20 animate-pulse"></div>
      <div className="absolute inset-2 rounded-full bg-yellow-400 opacity-40 animate-ping"></div>
      <div className="absolute inset-4 rounded-full bg-yellow-300 opacity-60 animate-spin"></div>
      <div className="absolute inset-6 rounded-full bg-yellow-200 opacity-80 animate-bounce"></div>
      <HeartHandshake className="absolute inset-0 m-auto h-16 w-16 text-yellow-600 animate-pulse" />
    </div>
  )
}

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [impactData, setImpactData] = useState({
    wasteCollected: 0,
    reportsSubmitted: 0,
    tokensEarned: 0,
    co2Offset: 0
  });

  

  useEffect(() => {
    async function fetchImpactData() {
      try {
        const totalRewards = await getTotalRewards(); // Fetch total rewards redeemed
        const volunteers = await getVolunteersEngaged();  // Fetch all transactions

        setImpactData({
          rewardsRedeemed: totalRewards.rewardsRedeemed || 0, 
          volunteersEngaged: volunteers.volunteersEngaged || 0,
        });
      } catch (error) {
        console.error("Error fetching impact data:", error);
        setImpactData({
          rewardsRedeemed: 0, 
          volunteersEngaged: 0,
        });
      }
    }
  
    fetchImpactData();
  }, []);

  const login = () => {
    setLoggedIn(true);
  };

  return (
    <div className={`container mx-auto px-4 py-16 ${poppins.className}`}>
      <section className="text-center mb-20">
        <AnimatedGlobe />
        <h1 className="text-6xl font-bold mb-6 text-gray-800 tracking-tight">
          Rise <span className="text-yellow-600">Beacon</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
          Join Rise Beacon, a platform designed to connect passionate volunteers with organizations in need
        </p>
        {!loggedIn ? (
          <Button onClick={login} className="bg-yellow-600 hover:bg-yellow-700 text-white text-lg py-6 px-10 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        ) : (
          <Link href="/opurtunities">
            <Button className="bg-yellow-600 hover:bg-yellow-700 text-white text-lg py-6 px-10 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105">
              Start Volunteer
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        )}
      </section>
      
      <section className="grid md:grid-cols-3 gap-10 mb-20">
        <FeatureCard
          icon={Handshake}
          title="Volunteer with Purpose"
          description="Find meaningful opportunities to support communities in need."
        />
        <FeatureCard
          icon={Building2}
          title="Verified Organizations"
          description="Connect with trusted NGOs, schools, and community initiatives."
        />
        <FeatureCard
          icon={ClockArrowUp}
          title="Track Your Impact"
          description="Log your volunteer hours and see the difference you're making."
        />
      </section>
      
      <section className="bg-white p-10 rounded-3xl shadow-lg mb-20">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Our Impact</h2>
        <div className="grid md:grid-cols-4 gap-6">
        <ImpactCard 
          title="Volunteers Engaged" 
          value={(impactData.volunteersEngaged ?? 0).toString()} 
          icon={Users} 
        />

        <ImpactCard 
          title="Hours Contributed" 
          value={`${impactData.hoursContributed ?? 0} hrs`} 
          icon={Clock} 
        />

        <ImpactCard 
          title="Organizations Partnered" 
          value={(impactData.organizationsPartnered ?? 0).toString()} 
          icon={Building} 
        />

        <ImpactCard 
          title="Total Tokens Rewards" 
          value={`${impactData.rewardsRedeemed ?? 0} tokens`} 
          icon={Gift} 
        />
        </div>
      </section>

   
    </div>
  )
}

function ImpactCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) {
  const formattedValue = typeof value === 'number' ? value.toLocaleString('en-US', { maximumFractionDigits: 1 }) : value;
  
  return (
    <div className="p-6 rounded-xl bg-gray-50 border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-md">
      <Icon className="h-10 w-10 text-yellow-500 mb-4" />
      <p className="text-3xl font-bold mb-2 text-gray-800">{formattedValue}</p>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col items-center text-center">
      <div className="bg-yellow-100 p-4 rounded-full mb-6">
        <Icon className="h-8 w-8 text-yellow-600" />
      </div>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}