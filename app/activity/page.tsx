"use client"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getAllReports } from '@/utils/db/actions';  // Assume this function fetches the reports table
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

type Report = {
  userId: string;
  wasteType: string;
  amount: number;
  status: string; 
  collectorId?: string; 
};

type ActivityReport = {
  totalReports: number;
  wasteReported: string;
  wasteCollected: string;
  wasteTypes: string[];
  impactSummary: string;
};



export default function ActivityReportPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityReport, setActivityReport] = useState<ActivityReport | null>(null);
    

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const fetchedReports = await getAllReports();  // Fetch all reports from the database

        // Transform the data to match the Report type
        const transformedReports = fetchedReports.map((report) => ({
          userId: String(report.userId), // Convert to string if needed
          wasteType: report.wasteType,
          amount: parseFloat(report.amount), // Ensure amount is a number
          status: report.status,
          collectorId: report.collectorId ? String(report.collectorId) : undefined,
        }));

        setReports(transformedReports);
        generateActivityReport(transformedReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    const generateActivityReport = async (reportsData: Report[]) => {
        try {
          const genAI = new GoogleGenerativeAI(geminiApiKey!);
          const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });
      
          // Convert the reportsData into a string format that the AI model expects
          const formattedReportsData = JSON.stringify(reportsData.map(report => ({
            user_id: report.userId,
            waste_type: report.wasteType,
            amount: report.amount,
            status: report.status,
            collector_id: report.collectorId || null,  // null if collectorId is not available
          })));
      
          const prompt = `You are an expert in community service and waste management. Generate a concise volunteer activity report based on the provided reports data.
      
            You will receive data in the following format:
            [
              {
                "user_id": "ID of the person who reported",
                "waste_type": "Type of waste reported",
                "amount": "Quantity of waste (in kg or liters)",
                "status": "verified or unverified",
                "collector_id": "ID of the person who collected (if verified)"
              },
              ...
            ]
      
            Analyze this data and provide:
            1. The total number of waste reports made by the user.
            2. The total amount of waste reported by the user (in kg or liters).
            3. The total amount of waste collected by the user (if they acted as a collector for verified reports).
            4. The types of waste the user interacted with (both reported and collected).
            5. A short impact summary based on their contributions.
      
            Respond in JSON format like this:
            {
              "totalReports": number,
              "wasteReported": "total amount with unit",
              "wasteCollected": "total amount with unit",
              "wasteTypes": ["list of waste types"],
              "impactSummary": "short description of the user's contribution"
            }`;
      
          // Now pass the formatted string data (not the raw Report objects) to the model
          const result = await model.generateContent([prompt, formattedReportsData]);
          const response = await result.response;
          const text = response.text();
      
          // Assuming the response is in the expected format
          const generatedReport = JSON.parse(text);
          setActivityReport(generatedReport);
        } catch (error) {
          console.error('Error generating activity report:', error);
        }
      };
      
      

    fetchReports();
  }, []);

  

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Activity Report</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 text-gray-600">Loading...</div>
        </div>
      ) : activityReport ? (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6">
            <div className="flex justify-between items-center text-white">
              <span className="text-2xl font-bold">Activity Report</span>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-lg font-medium">Total Reports: {activityReport.totalReports}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm">Total Waste Reported: {activityReport.wasteReported}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm">Total Waste Collected: {activityReport.wasteCollected}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm">Waste Types: {activityReport.wasteTypes.join(', ')}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm">Impact Summary: {activityReport.impactSummary}</span>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50">
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
              Download Report
            </Button>
          </div>
        </div>
      ) : (
        <div>No data available for activity reports.</div>
      )}
    </div>
  );
}
