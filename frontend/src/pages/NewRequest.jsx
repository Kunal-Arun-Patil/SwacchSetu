import React from 'react';
import RequestForm from '../components/requests/RequestForm';

export default function NewRequest() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-emerald-50 to-white py-10 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900  mb-1">Schedule a Pickup</h1>
          <p className="text-gray-500  text-sm">Fill in the details and we'll handle the rest</p>
        </div>
        <div className="bg-white   rounded-2xl border border-gray-100 shadow-card p-6 sm:p-8">
          <RequestForm />
        </div>
      </div>
    </div>
  );
}
