import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, X, UploadCloud, AlertCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { api } from '../services/api';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const listingId = parseInt(id || '0');

  const [formData, setFormData] = useState({
    contact_number: '',
    move_in_date: '',
    duration_months: 1,
  });
  
  const [files, setFiles] = useState<{
    aadhar_card: File | null;
    college_id: File | null;
    declaration: File | null;
  }>({
    aadhar_card: null,
    college_id: null,
    declaration: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof typeof files) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError(`Invalid file type for ${fieldName}. Please upload JPG, PNG, or PDF.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`${fieldName} exceeds 5MB size limit.`);
        return;
      }
      setFiles({ ...files, [fieldName]: file });
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!files.aadhar_card || !files.college_id || !files.declaration) {
      setError('Please upload all required documents.');
      return;
    }

    setLoading(true);
    setError('');

    const submitData = new FormData();
    submitData.append('student_id', user.id.toString());
    submitData.append('listing_id', listingId.toString());
    submitData.append('contact_number', formData.contact_number);
    submitData.append('move_in_date', formData.move_in_date);
    submitData.append('duration_months', formData.duration_months.toString());
    submitData.append('aadhar_card', files.aadhar_card);
    submitData.append('college_id', files.college_id);
    submitData.append('declaration', files.declaration);

    try {
      await api.createSecureBooking(submitData);
      alert('Booking request submitted successfully! Pending verification.');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting the booking request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-premium border border-zinc-100 overflow-hidden relative">
        <div className="border-b border-zinc-100 p-8 md:p-10 flex items-center justify-between bg-zinc-50/30">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Secure Booking Request</h1>
            <p className="text-zinc-500 mt-2 font-medium">Complete your details to securely send a request.</p>
          </div>
          <button onClick={() => navigate(-1)} className="p-3 bg-white shadow-sm border border-zinc-200 hover:bg-zinc-50 rounded-full transition-colors text-zinc-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 md:p-10">
          {error && (
            <div className="bg-red-50 text-red-600 p-5 rounded-2xl mb-8 flex items-center gap-3 text-sm font-bold border border-red-100 shadow-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-6">
              <h3 className="flex items-center text-xl font-bold text-zinc-900 tracking-tight">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3 text-sm">1</span>
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 md:pl-11">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Full Name</label>
                  <input type="text" value={user?.full_name || ''} disabled className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-zinc-500 font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Contact Number</label>
                  <input type="tel" name="contact_number" required value={formData.contact_number} onChange={handleTextChange} placeholder="+91 99999 99999" className="w-full border border-zinc-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Move-in Date</label>
                  <input type="date" name="move_in_date" required value={formData.move_in_date} onChange={handleTextChange} className="w-full border border-zinc-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium text-zinc-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Duration of Stay</label>
                  <select name="duration_months" value={formData.duration_months} onChange={handleTextChange} className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium text-zinc-900">
                    <option value={1}>1 Month</option>
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months</option>
                    <option value={12}>1 Year</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="flex items-center text-xl font-bold text-zinc-900 tracking-tight">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3 text-sm">2</span>
                  Required Documents
                </h3>
                <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-4 py-1.5 rounded-full border border-zinc-200 w-max">PDF, JPG, PNG (Max 5MB)</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pl-0 md:pl-11">
                <div className="relative border-2 border-dashed border-zinc-200 rounded-2xl p-6 text-center hover:bg-zinc-50 hover:border-emerald-400 transition-all group overflow-hidden">
                  <input type="file" required accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, 'aadhar_card')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="flex flex-col items-center justify-center space-y-3 relative pointer-events-none">
                    <div className={"w-14 h-14 rounded-full flex items-center justify-center transition-colors " + (files.aadhar_card ? "bg-emerald-100 text-emerald-600" : "bg-zinc-50 text-zinc-400 border border-zinc-200 group-hover:bg-emerald-50 group-hover:text-emerald-500 group-hover:border-emerald-200")}>
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-zinc-900 leading-tight">Aadhar Card</span>
                    <span className="text-[11px] font-medium text-zinc-500 truncate w-full px-2">
                      {files.aadhar_card ? files.aadhar_card.name : 'Click to Upload'}
                    </span>
                  </div>
                </div>

                <div className="relative border-2 border-dashed border-zinc-200 rounded-2xl p-6 text-center hover:bg-zinc-50 hover:border-emerald-400 transition-all group overflow-hidden">
                  <input type="file" required accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, 'college_id')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="flex flex-col items-center justify-center space-y-3 relative pointer-events-none">
                    <div className={"w-14 h-14 rounded-full flex items-center justify-center transition-colors " + (files.college_id ? "bg-emerald-100 text-emerald-600" : "bg-zinc-50 text-zinc-400 border border-zinc-200 group-hover:bg-emerald-50 group-hover:text-emerald-500 group-hover:border-emerald-200")}>
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-zinc-900 leading-tight">College ID</span>
                    <span className="text-[11px] font-medium text-zinc-500 truncate w-full px-2">
                      {files.college_id ? files.college_id.name : 'Click to Upload'}
                    </span>
                  </div>
                </div>

                <div className="relative border-2 border-dashed border-zinc-200 rounded-2xl p-6 text-center hover:bg-zinc-50 hover:border-emerald-400 transition-all group overflow-hidden">
                  <input type="file" required accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, 'declaration')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="flex flex-col items-center justify-center space-y-3 relative pointer-events-none">
                    <div className={"w-14 h-14 rounded-full flex items-center justify-center transition-colors " + (files.declaration ? "bg-emerald-100 text-emerald-600" : "bg-zinc-50 text-zinc-400 border border-zinc-200 group-hover:bg-emerald-50 group-hover:text-emerald-500 group-hover:border-emerald-200")}>
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-zinc-900 leading-tight">Declaration</span>
                    <span className="text-[11px] font-medium text-zinc-500 truncate w-full px-2">
                      {files.declaration ? files.declaration.name : 'Click to Upload'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-6 flex gap-5 items-start border border-emerald-100 mt-10">
              <ShieldCheck className="w-8 h-8 text-emerald-600 flex-shrink-0" />
              <div>
                <h4 className="text-base font-bold text-emerald-900">Your documents are secure</h4>
                <p className="text-sm text-emerald-700/80 mt-2 leading-relaxed font-medium">We use industry-standard encryption to protect your sensitive data. Your documents are strictly used for verification purposes by property owners and are not shared with any third parties.</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-5 rounded-2xl transition-all disabled:opacity-50 tracking-wide uppercase text-sm shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/30 active:scale-[0.98] focus:ring-4 focus:ring-emerald-500/20"
            >
              {loading ? 'Submitting Request...' : 'Submit Secure Booking Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
