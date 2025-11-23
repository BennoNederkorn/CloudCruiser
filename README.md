# HackaTUM 2025 - Sixt challenge - Team Cloud Cruiser

## What is this project about?

This project is a proof-of-concept for an upselling platform targeted at customers who have already booked a car. It provides an intuitive interface for users to browse and select premium vehicle upgrades for their existing reservation. The goal is to enhance the customer experience while simultaneously creating new revenue streams from confirmed bookings.

## What technologies are used for this project?

This project is built with a modern web stack, utilizing a JavaScript framework with Vite for a fast and efficient development workflow. It integrates with Google Cloud APIs to leverage powerful cloud services. The backend is a lightweight Node.js server, responsible for serving images.

## Set Up

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Create Google Cloud API Key.
echo "VITE_GOOGLE_API_KEY=yourkey" >> .env

# Step 4: Install the necessary dependencies.
npm i

# Step 5: Start the image server
node server.js

# Step 6: Start the development server with auto-reloading and an instant preview.
npm run dev
```
