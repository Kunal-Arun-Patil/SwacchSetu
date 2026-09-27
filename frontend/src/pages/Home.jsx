import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, MapPin, BarChart2, ShieldCheck, Truck, Recycle, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  { icon: <Leaf size={22} />, title: 'Select Category', desc: 'Choose the type of waste you need collected' },
  { icon: <MapPin size={22} />, title: 'Submit Request', desc: 'Fill in your address, date, and quantity details' },
  { icon: <Truck size={22} />, title: 'We Collect', desc: 'Our team arrives at your preferred time slot' },
  { icon: <Recycle size={22} />, title: 'Proper Disposal', desc: 'Waste is sorted, recycled, or safely disposed' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20">
            <Leaf size={14} /> Smart Waste Management Platform
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5 leading-tight">
            Clean City,
            <br />
            <span className="text-emerald-200">Greener Future</span>
          </h1>
          <p className="text-lg text-emerald-100 max-w-2xl mb-8">
            Schedule waste pickups in seconds. Track your request in real-time. SwachhSetu makes responsible waste disposal effortless.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap justify-center">
            <Link
              to={user ? '/request/new' : '/login'}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-emerald-700 font-semibold rounded-2xl hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl text-base"
            >
              Schedule a Pickup <ArrowRight size={18} />
            </Link>
            <Link
              to="/scanner"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-emerald-800 text-emerald-50 font-semibold rounded-2xl hover:bg-emerald-900 transition-all shadow-lg hover:shadow-xl text-base border border-emerald-600"
            >
              🤖 Try AI Scanner
            </Link>
            <Link
              to="/my-requests"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all text-base"
            >
              Track My Request
            </Link>
          </div>
          {/* Stats strip */}
          <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/20 pt-8 w-full max-w-xl">
            {[['18+', 'Requests Handled'], ['5', 'Waste Categories'], ['4.9⭐', 'User Rating']].map(([val, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold">{val}</p>
                <p className="text-xs text-emerald-200 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900  mb-2">How It Works</h2>
          <p className="text-gray-500 ">Simple, transparent waste collection in 4 steps</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.title} className="text-center">
              <div className="relative inline-flex">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-3">
                  {step.icon}
                </div>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900  mb-1 text-sm">{step.title}</h3>
              <p className="text-xs text-gray-500  leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50  border-t border-b border-gray-200 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900  mb-2">Waste Categories We Handle</h2>
            <p className="text-gray-500  text-sm">Each type is handled with specialized disposal methods</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className={`p-4 rounded-2xl border-2 ${cat.bgClass} text-center cursor-default group`}>
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <p className="font-semibold text-sm text-gray-800 ">{cat.label}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to={user ? '/request/new' : '/login'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
            >
              Book a Pickup Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <MapPin size={20} />, color: 'bg-blue-50 text-blue-600', title: 'Real-time Tracking', desc: 'Track your pickup status from Pending to Collected with live updates.' },
            { icon: <ShieldCheck size={20} />, color: 'bg-emerald-50 text-emerald-600', title: 'Safe & Compliant', desc: 'All hazardous and e-waste is handled as per government disposal regulations.' },
            { icon: <BarChart2 size={20} />, color: 'bg-purple-50 text-purple-600', title: 'Smart Analytics', desc: 'City admins get real-time insights to optimize collection routes and schedules.' },
          ].map((f) => (
            <div key={f.title} className="bg-white   rounded-2xl border border-gray-100 shadow-card p-6 hover:shadow-card-hover transition-all">
              <div className={`inline-flex p-2.5 rounded-xl ${f.color} mb-4`}>{f.icon}</div>
              <h3 className="font-semibold text-gray-900  mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500  leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Leaf size={16} className="text-emerald-400" />
          <span className="text-white font-semibold">SwachhSetu</span>
        </div>
        <p className="text-sm">🌍 Making cities cleaner, one pickup at a time.</p>
      </footer>
    </div>
  );
}
