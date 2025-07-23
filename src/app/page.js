// app/s/[subdomain]/page.js
"use client";

import { useParams } from "next/navigation";

export default function SubdomainLandingPage() {
  const { subdomain } =  useParams();
  console.log("Subdomain :", subdomain)

  return (
    <div className="min-h-screen flex items-center justify-center text-center p-8">
      <div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Welcome to <span className="text-blue-600">{subdomain}.yourdomain.com</span>
        </h1>
        <p className="text-lg text-gray-600">
          This is your custom subdomain page.
        </p>
      </div>
    </div>
  );
}
