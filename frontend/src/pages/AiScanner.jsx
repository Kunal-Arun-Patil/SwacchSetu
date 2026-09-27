import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, ScanLine, X, AlertCircle, ClipboardList, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

// Standard detailed categories that map to backend options
const CATEGORY_OPTIONS = [
  { id: 'Plastic', mapped: 'Recyclable' },
  { id: 'Paper', mapped: 'Recyclable' },
  { id: 'Cardboard', mapped: 'Recyclable' },
  { id: 'Glass', mapped: 'Recyclable' },
  { id: 'Metal', mapped: 'Recyclable' },
  { id: 'E-waste', mapped: 'E-Waste' },
  { id: 'Organic/Wet Waste', mapped: 'Organic' },
  { id: 'Textile', mapped: 'General' },
  { id: 'Hazardous Waste', mapped: 'Hazardous' },
  { id: 'Other/Unknown', mapped: 'General' }
];

export default function AiScanner() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanData, setScanData] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [error, setError] = useState('');
  
  // Feedback state
  const [correcting, setCorrecting] = useState(false);
  const [correctionSubmitted, setCorrectionSubmitted] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      resetState();
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        resetState();
      } else {
        setError('Please drop an image file.');
      }
    }
  };

  const resetState = () => {
    setScanData(null);
    setSelectedItemIndex(0);
    setError('');
    setCorrecting(false);
    setCorrectionSubmitted(false);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    resetState();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleScan = async () => {
    if (!selectedFile) return;
    setIsScanning(true);
    resetState();
    
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const res = await api.post('/scan-waste', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setScanData(res.data);
      addToast('Scan complete!', 'success');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to scan image. Please try again.');
      addToast('Scan failed', 'error');
    } finally {
      setIsScanning(false);
    }
  };

  const submitFeedback = async (newCategory) => {
    if (!scanData) return;
    const currentItem = scanData.items[selectedItemIndex];
    const catOpt = CATEGORY_OPTIONS.find(c => c.id === newCategory);
    if (!catOpt) return;

    try {
      await api.post(`/scan-waste/${scanData.scanId}/item/${currentItem._id}/feedback`, {
        correctedCategory: catOpt.id,
        correctedMappedCategory: catOpt.mapped
      });
      
      // Update local state to reflect correction
      const newItems = [...scanData.items];
      newItems[selectedItemIndex].category = catOpt.id;
      newItems[selectedItemIndex].mappedCategory = catOpt.mapped;
      setScanData({ ...scanData, items: newItems });
      
      setCorrecting(false);
      setCorrectionSubmitted(true);
      addToast('Thanks for your feedback!', 'success');
    } catch (err) {
      addToast('Failed to submit feedback.', 'error');
    }
  };

  const handleCreateRequest = () => {
    if (!scanData || !scanData.items[selectedItemIndex]) return;
    const item = scanData.items[selectedItemIndex];
    navigate('/request/new', { state: { prefilledCategory: item.mappedCategory } });
  };

  const currentItem = scanData?.items?.[selectedItemIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl mb-4">
          <ScanLine size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900  mb-2">🤖 AI Waste Scanner</h1>
        <p className="text-gray-500 ">Not sure how to dispose of an item? Let our AI understand it for you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Image & Upload */}
        <div className="bg-white   rounded-2xl border border-gray-100 shadow-card p-6 h-fit">
          {!previewUrl ? (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:bg-gray-50 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              <Upload size={40} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-700 font-medium mb-1">Click to upload or drag & drop</p>
              <p className="text-gray-400 text-sm mb-4">SVG, PNG, JPG or GIF (max. 5MB)</p>
              <div className="flex items-center justify-center gap-3">
                <Button type="button" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>Upload Image</Button>
                <Button type="button" variant="secondary" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                  <Camera size={16} /> Capture
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 aspect-square flex items-center justify-center">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                <button 
                  onClick={clearSelection}
                  className="absolute top-3 right-3 p-1.5 bg-white   hover:bg-white   text-gray-700 rounded-full shadow-sm backdrop-blur-sm transition-all"
                >
                  <X size={18} />
                </button>
                
                {isScanning && (
                  <div className="absolute inset-0 bg-emerald-900/60 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="w-16 h-16 relative mb-4">
                      <div className="absolute inset-0 border-4 border-emerald-400/30 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-emerald-400 rounded-full border-t-transparent animate-spin"></div>
                      <ScanLine size={24} className="absolute inset-0 m-auto text-emerald-400 animate-pulse" />
                    </div>
                    <p className="text-white font-medium text-lg">Analyzing materials...</p>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              {!scanData && !isScanning && (
                <Button onClick={handleScan} className="w-full text-lg py-4" size="lg">
                  <ScanLine size={20} /> Scan Waste
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Right Column: AI Results */}
        <div className="h-full">
          {scanData && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 animate-in slide-in-from-right-4 duration-500 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-emerald-200/50">
                <span className="text-2xl">🤖</span>
                <h3 className="text-lg font-bold text-emerald-900">AI Waste Analysis</h3>
              </div>
              
              {!scanData.isWaste || scanData.items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                  <AlertCircle size={40} className="text-emerald-700 mb-3" />
                  <h4 className="text-lg font-semibold text-emerald-900 mb-1">No Waste Detected</h4>
                  <p className="text-emerald-700 text-sm">We couldn't clearly identify any waste materials in this image. Please try another clearer image.</p>
                  <Button variant="secondary" onClick={clearSelection} className="mt-6">Try Another Image</Button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  {/* Multi-item selector */}
                  {scanData.items.length > 1 && (
                    <div className="mb-5">
                      <p className="text-sm font-medium text-emerald-900 mb-2">Detected multiple items. Select one:</p>
                      <div className="flex flex-wrap gap-2">
                        {scanData.items.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => { setSelectedItemIndex(idx); setCorrecting(false); setCorrectionSubmitted(false); }}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                              idx === selectedItemIndex 
                                ? 'bg-emerald-600 text-white shadow-md' 
                                : 'bg-white   text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            }`}
                          >
                            {item.objectDetected}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentItem && (
                    <>
                      {/* Confidence Warning */}
                      {currentItem.confidence < 0.60 && (
                        <div className="bg-amber-100 border border-amber-300 text-amber-800 p-3 rounded-xl flex gap-2 mb-4">
                          <AlertCircle size={18} className="shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-semibold mb-0.5">⚠️ Low Confidence ({Math.round(currentItem.confidence * 100)}%)</p>
                            <p>I couldn't confidently identify this waste. Please upload a clearer image showing the complete object.</p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white   p-3 rounded-xl border border-emerald-100 shadow-sm">
                          <p className="text-xs text-gray-500  mb-1">Object Detected</p>
                          <p className="font-semibold text-gray-900  capitalize">{currentItem.objectDetected}</p>
                        </div>
                        <div className="bg-white   p-3 rounded-xl border border-emerald-100 shadow-sm">
                          <p className="text-xs text-gray-500  mb-1">Material</p>
                          <p className="font-semibold text-gray-900  capitalize">{currentItem.material}</p>
                        </div>
                      </div>

                      <div className="bg-white   p-4 rounded-xl border border-emerald-100 shadow-sm space-y-4 mb-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                            Category: {currentItem.category}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${currentItem.recyclable ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                            {currentItem.recyclable ? '♻️ Recyclable' : '🗑️ Non-recyclable'}
                          </span>
                        </div>
                        
                        <div>
                          <p className="text-xs font-bold text-gray-500  uppercase tracking-wider mb-1">Why?</p>
                          <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-2.5 rounded-lg border border-gray-100">{currentItem.reason}</p>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-gray-500  uppercase tracking-wider mb-1">Recommendation</p>
                          <p className="text-sm text-emerald-700 bg-emerald-50 p-2.5 rounded-lg font-medium">{currentItem.recommendation}</p>
                        </div>
                      </div>

                      {/* Feedback System */}
                      {!correctionSubmitted && currentItem.category !== 'Other/Unknown' && currentItem.confidence >= 0.60 && (
                        <div className="mb-5 bg-emerald-100/50 p-3 rounded-xl border border-emerald-200">
                          {!correcting ? (
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-emerald-900">Is this correct?</p>
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="bg-white   hover:bg-emerald-50 text-emerald-700 shadow-sm" onClick={() => setCorrectionSubmitted(true)}>
                                  <CheckCircle2 size={14} /> Yes
                                </Button>
                                <Button size="sm" variant="outline" className="bg-white   hover:bg-red-50 text-red-600 border-red-200 shadow-sm" onClick={() => setCorrecting(true)}>
                                  <X size={14} /> No, change
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-emerald-900">Select the correct category:</p>
                              <select 
                                className="w-full text-sm p-2 rounded-lg border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                                onChange={(e) => { if (e.target.value) submitFeedback(e.target.value); }}
                                defaultValue=""
                              >
                                <option value="" disabled>Select category...</option>
                                {CATEGORY_OPTIONS.map(opt => (
                                  <option key={opt.id} value={opt.id}>{opt.id}</option>
                                ))}
                              </select>
                              <button onClick={() => setCorrecting(false)} className="text-xs text-gray-500  hover:text-gray-700 mt-1">Cancel</button>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Unknown fallback / correction submitted state */}
                      {(correctionSubmitted || currentItem.category === 'Other/Unknown') && (
                        <div className="mb-5">
                           {correctionSubmitted && <p className="text-xs text-emerald-600 font-medium mb-3 flex items-center gap-1"><CheckCircle2 size={12}/> AI updated based on your feedback.</p>}
                           {currentItem.category === 'Other/Unknown' && <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-xl mb-3">AI could not confidently map this item to a supported waste category. You can create a request and select it manually.</p>}
                        </div>
                      )}

                      <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-4 border-t border-emerald-200/50">
                        <Button onClick={handleCreateRequest} className="flex-1">
                          <ClipboardList size={18} /> Create Pickup Request
                        </Button>
                        <Button variant="secondary" onClick={clearSelection} className="flex-1">
                          Scan Another
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
