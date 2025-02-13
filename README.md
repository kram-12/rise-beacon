# RISE Beacon - Volunteer Availability Platform

**RISE Beacon** is a full-stack platform designed to connect volunteers with organizations in India. The platform supports volunteer registration, organization and school interaction, and offers reward points for volunteer activities, including a unique AI-powered feature to predict waste types and weights.

## Features

- **Volunteer Registration:** Volunteers can sign up, view available opportunities, and earn reward points.
- **Organization & School Integration:** Organizations can post volunteer opportunities, and schools can track student participation.
- **AI-powered Waste Prediction:** Volunteers can upload pictures of garbage, and the system predicts the type and weight of the waste.
- **Reward System:** Volunteers earn points that can be redeemed for sponsor coupons.
- **Government ID Verification:** Users can verify their identity through Aadhar, PAN, and other government IDs.
- **User Access by Schools:** Schools have access to their students' volunteer data.

## Getting Started

To get started with **RISE Beacon**, clone the repository and install the dependencies.

### Prerequisites

- Node.js (>= 14.0.0)
- npm (>= 7.0.0) or yarn (>= 1.22.0)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kram-12/rise-beacon.git
   cd rise-beacon
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Development Server

To start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the platform in action.

The page will auto-update as you make changes to the code.

## AI Feature

**RISE Beacon** includes an AI-powered feature for waste management. Volunteers can upload images of garbage, and the AI will predict the type and weight of the waste to earn additional reward points. 

## Verification

- **User Verification:** Volunteers are required to verify their identity through government IDs such as Aadhar or PAN.
- **Organization & School Verification:** Schools and organizations can be verified using a TBD method to ensure authenticity.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn more about Next.js features and API.
- [Vercel Deployment](https://vercel.com/docs) - Learn how to deploy your Next.js app using Vercel.
