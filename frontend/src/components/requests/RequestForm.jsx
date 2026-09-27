import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ChevronRight, ChevronLeft, Info } from 'lucide-react';
import { CATEGORIES } from '../../constants/categories';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const QUANTITIES = ['1 bag', '2-3 bags', '4-5 bags', '6+ bags', 'Half bin', '1 bin', 'Multiple bins'];
const TIMES = ['07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
               '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];

export default function RequestForm() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledCategory = location.state?.prefilledCategory || '';

  // Multi-step state
  const [step, setStep] = useState(prefilledCategory ? 2 : 1); // skip category if prefilled
  const [tipModal, setTipModal] = useState(null); 
  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  const [form, setForm] = useState({
    userName: user?.name || '',
    phone: user?.phone || '',
    address: '',
    wasteCategory: prefilledCategory,
    quantity: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validateDetails = () => {
    const e = {};
    if (!form.userName.trim()) e.userName = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone.trim())) e.phone = 'Enter a valid 10-digit phone';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.quantity) e.quantity = 'Quantity is required';
    if (!form.preferredDate) e.preferredDate = 'Date is required';
    if (!form.preferredTime) e.preferredTime = 'Time is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateDetails()) return;
    setSubmitting(true);
    try {
      const res = await api.post('/requests', form);
      setSubmittedRequest(res.data);
      setStep(3);
      addToast('Pickup request submitted successfully!', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Submission failed. Try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 3: Success
  if (step === 3 && submittedRequest) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={36} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
        <p className="text-gray-500 mb-6">Your pickup request has been received. We'll confirm shortly.</p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6 max-w-sm mx-auto">
          <p className="text-sm text-gray-600 mb-1">Your Request ID</p>
          <p className="text-2xl font-mono font-bold text-emerald-700">{submittedRequest.requestId}</p>
          <p className="text-xs text-gray-500 mt-2">Save this to track your pickup status</p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate('/my-requests')}>Track My Requests</Button>
          <Button onClick={() => { setStep(1); setForm({ userName: user?.name || '', phone: user?.phone || '', address: '', wasteCategory: '', quantity: '', preferredDate: '', preferredTime: '', notes: '' }); }}>Submit Another</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {['Select Category', 'Request Details'].map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                step > i + 1 ? 'bg-emerald-500 text-white' :
                step === i + 1 ? 'bg-emerald-600 text-white' :
                'bg-gray-100 text-gray-400'
              }`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${
                step === i + 1 ? 'text-emerald-700' : 'text-gray-400'
              }`}>{label}</span>
            </div>
            {i < 1 && <div className={`flex-1 h-0.5 max-w-16 ${ step > 1 ? 'bg-emerald-500' : 'bg-gray-200' }`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Category picker */}
      {step === 1 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">What are you disposing?</h3>
          <p className="text-sm text-gray-500 mb-6">Select a waste category to get started</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="relative">
                <button
                  onClick={() => { update('wasteCategory', cat.id); }}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                    form.wasteCategory === cat.id ? cat.activeClass : cat.bgClass + ' border-transparent'
                  }`}
                >
                  <div className="text-3xl mb-2">{cat.emoji}</div>
                  <div className={`font-medium text-sm ${ form.wasteCategory === cat.id ? 'text-white' : 'text-gray-800' }`}>
                    {cat.label}
                  </div>
                </button>
                {/* Tip icon */}
                <button
                  onClick={(e) => { e.stopPropagation(); setTipModal(cat); }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Info size={11} className="text-gray-500" />
                </button>
              </div>
            ))}
          </div>
          <Button
            disabled={!form.wasteCategory}
            onClick={() => setStep(2)}
            className="w-full"
          >
            Continue <ChevronRight size={16} />
          </Button>
        </div>
      )}

      {/* Step 2: Details form */}
      {step === 2 && (
        <div>
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-5 transition-colors"
          >
            <ChevronLeft size={15} /> Back
          </button>

          <div className="flex items-center gap-2 mb-5 p-3 bg-emerald-50 rounded-xl">
            <span className="text-2xl">{CATEGORIES.find(c => c.id === form.wasteCategory)?.emoji}</span>
            <span className="font-medium text-emerald-800">{form.wasteCategory}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={form.userName} onChange={e => update('userName', e.target.value)} error={errors.userName} required placeholder="Your full name" />
            <Input label="Phone Number" value={form.phone} onChange={e => update('phone', e.target.value)} error={errors.phone} required placeholder="10-digit phone" />
            <div className="sm:col-span-2">
              <Input label="Pickup Address" value={form.address} onChange={e => update('address', e.target.value)} error={errors.address} required placeholder="House no, Street, Area, City" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Quantity / Volume <span className="text-red-500">*</span></label>
              <select
                value={form.quantity}
                onChange={e => update('quantity', e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${ errors.quantity ? 'border-red-400' : 'border-gray-300' }`}
              >
                <option value="">Select quantity</option>
                {QUANTITIES.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
              {errors.quantity && <p className="text-xs text-red-500">{errors.quantity}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Preferred Time <span className="text-red-500">*</span></label>
              <select
                value={form.preferredTime}
                onChange={e => update('preferredTime', e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${ errors.preferredTime ? 'border-red-400' : 'border-gray-300' }`}
              >
                <option value="">Select time slot</option>
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.preferredTime && <p className="text-xs text-red-500">{errors.preferredTime}</p>}
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Preferred Date"
                type="date"
                value={form.preferredDate}
                onChange={e => update('preferredDate', e.target.value)}
                error={errors.preferredDate}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Additional Notes</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={e => update('notes', e.target.value)}
                placeholder="Any special instructions for the collector..."
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            loading={submitting}
            className="w-full mt-6"
          >
            Submit Pickup Request
          </Button>
        </div>
      )}

      {/* Tip Modal */}
      <Modal
        isOpen={!!tipModal}
        onClose={() => setTipModal(null)}
        title={`${tipModal?.emoji} ${tipModal?.label} — Disposal Tips`}
      >
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">{tipModal?.tip}</p>
          <div className="bg-emerald-50 rounded-xl p-4">
            <p className="text-sm text-emerald-800 font-medium">♻️ Did you know?</p>
            <p className="text-sm text-emerald-700 mt-1">Proper waste segregation can reduce landfill usage by up to 70%.</p>
          </div>
          <Button onClick={() => setTipModal(null)} className="w-full">Got it!</Button>
        </div>
      </Modal>
    </>
  );
}
