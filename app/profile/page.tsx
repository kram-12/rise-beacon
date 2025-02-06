'use client'
import { useState, useEffect } from 'react'
import { Coins, ArrowUpRight, User, Mail, Calendar, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getUserByEmail, getUserTotalRewards } from '@/utils/db/actions'
import { toast } from 'react-hot-toast'
import Link from "next/link"
import { GoogleGenerativeAI } from "@google/generative-ai";
const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

type UserDetails = {
  name: string
  email: string
  joined: string 
  rewards: number
}

export default function UserDetailsPage() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true)
      try {
        const userEmail = localStorage.getItem('userEmail')
        if (userEmail) {
          const fetchedUser = await getUserByEmail(userEmail)
          if (fetchedUser) {
            const formattedDate = new Date(fetchedUser.createdAt).toLocaleDateString() // Format the date

            const rewards = (await getUserTotalRewards(Number(fetchedUser.id))).rewardsRedeemed;

            setUserDetails({
              name: fetchedUser.name,
              email: fetchedUser.email,
              joined: formattedDate, 
              rewards: rewards || 0, 
            })
          } else {
            toast.error('User not found. Please log in again.')
          }
        } else {
          toast.error('User not logged in. Please log in.')
        }
      } catch (error) {
        console.error('Error fetching user details:', error)
        toast.error('Failed to load user details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [])



  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">User Details</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin h-8 w-8 text-gray-600" />
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6">
            <div className="flex justify-between items-center text-white">
              <User className="h-10 w-10" />
              <span className="text-2xl font-bold">User Details</span>
              <Coins className="h-10 w-10" />
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-6 w-6 text-gray-500 mr-2" />
                <span className="text-lg font-medium">{userDetails?.name}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-gray-500 mr-2" />
                <span className="text-sm">{userDetails?.email}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-gray-500 mr-2" />
                <span className="text-sm">{userDetails?.joined}</span> 
              </div>
              <div className="flex items-center">
                <Coins className="h-6 w-6 text-gray-500 mr-2" />
                <span className="text-sm">{userDetails?.rewards} Points</span>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50">
            <Link href="/rewards">
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Redeem Reward
            </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}



