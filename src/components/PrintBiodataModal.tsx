import React from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile } from '../types';
import { Printer, X, Download, Share2, ShieldCheck } from 'lucide-react';

export const PrintBiodataModal: React.FC<{
  profile: UserProfile | null;
  onClose: () => void;
}> = ({ profile, onClose }) => {
  const { siteConfig } = useApp();

  if (!profile) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-slate-900/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      
      {/* Top Action Bar (Hidden when printing) */}
      <div className="fixed top-4 right-4 z-[110] flex items-center gap-2 print:hidden">
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-full bg-[#A71930] hover:bg-[#800C1E] text-white text-xs font-bold shadow-xl border border-amber-300 flex items-center gap-2 transition-all active:scale-95"
        >
          <Printer className="w-4 h-4 text-amber-300" />
          <span>बायोडाटा प्रिंट करा (Print A4 PDF)</span>
        </button>
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white text-slate-700 hover:bg-slate-100 shadow-xl border border-slate-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Printable Sheet Wrapper */}
      <div className="w-full max-w-3xl bg-[#FFFDF5] border-2 border-amber-400 rounded-3xl p-6 sm:p-10 shadow-2xl text-slate-800 my-auto print:border-none print:shadow-none print:p-0 print:w-full print:max-w-none print:bg-white">
        
        {/* Print Header */}
        <div className="text-center pb-4 border-b-2 border-[#A71930]/30 space-y-1">
          <p className="text-xs sm:text-sm font-bold text-[#A71930] tracking-widest uppercase">
            {siteConfig?.topBarText || '॥ श्री संत भगवान बाबा प्रसन्न ॥'}
          </p>
          
          <div className="flex items-center justify-center gap-3 py-1">
            {siteConfig?.logoUrl ? (
              <img
                src={siteConfig.logoUrl}
                alt="Logo"
                className="w-12 h-12 object-contain"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#A71930] text-amber-300 font-black flex items-center justify-center text-xl border-2 border-amber-400 shadow">
                व
              </div>
            )}
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-black text-[#A71930] tracking-tight">
                {siteConfig?.logoTitle || 'वंजारी जोडी'}
              </h1>
              <p className="text-xs font-bold text-amber-800">
                {siteConfig?.logoSubtitle || 'विश्वासू वंजारी विवाह मंच'} — अधिकृत बायोडाटा
              </p>
            </div>
          </div>
        </div>

        {/* Profile Identity & Photo Banner */}
        <div className="mt-6 grid grid-cols-12 gap-6 items-center bg-white p-4 rounded-2xl border border-amber-200 shadow-sm">
          <div className="col-span-8 space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-[#A71930] text-xs font-bold border border-amber-300">
              प्रोफाईल आयडी: {profile.id} | वंजारी समाज ({profile.subCaste})
            </span>
            <h2 className="text-2xl font-black text-[#A71930]">
              {profile.fullName}
            </h2>
            <p className="text-xs font-bold text-slate-600">
              जन्म तारीख / वय: {profile.dob} ({profile.age} वर्षे)
            </p>
            <p className="text-xs font-semibold text-slate-600">
              सध्याचे शहर / जिल्हा: {profile.city}, {profile.district}
            </p>
          </div>

          <div className="col-span-4 flex justify-end">
            <div className="w-32 h-40 rounded-2xl overflow-hidden border-2 border-[#A71930] shadow-md bg-slate-100 p-1">
              <img
                src={profile.photos[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                alt={profile.fullName}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Section 1: Personal Details */}
        <div className="mt-6 space-y-2">
          <h3 className="text-sm font-black text-white bg-[#A71930] px-4 py-1.5 rounded-xl inline-block border border-amber-300">
            १. वैयक्तिक माहिती (Personal Details)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-white p-4 rounded-2xl border border-amber-200">
            <div>
              <span className="text-slate-500 block font-medium">उंची (Height):</span>
              <span className="font-bold text-slate-800">{profile.height}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">वजन (Weight):</span>
              <span className="font-bold text-slate-800">{profile.weight || '५५ किलो'}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">रक्तगट (Blood Group):</span>
              <span className="font-bold text-[#A71930]">{profile.bloodGroup}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">रंग / वर्ण (Complexion):</span>
              <span className="font-bold text-slate-800">{profile.complexion || 'गोरा'}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">वैवाहिक स्थिती (Marital Status):</span>
              <span className="font-bold text-[#A71930]">{profile.maritalStatus === 'never_married' ? 'अविवाहित' : profile.maritalStatus}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">जन्म वेळ व स्थान:</span>
              <span className="font-bold text-slate-800">{profile.birthTime || 'सकाळी १०:३०'} ({profile.birthPlace || profile.district})</span>
            </div>
          </div>
        </div>

        {/* Section 2: Education & Profession */}
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-black text-white bg-[#A71930] px-4 py-1.5 rounded-xl inline-block border border-amber-300">
            २. शैक्षणिक व नोकरी माहिती (Education & Career)
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs bg-white p-4 rounded-2xl border border-amber-200">
            <div>
              <span className="text-slate-500 block font-medium">शिक्षण (Degree / Education):</span>
              <span className="font-extrabold text-slate-900 text-sm">{profile.education}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">नोकरी / व्यवसाय (Occupation):</span>
              <span className="font-extrabold text-[#A71930] text-sm">{profile.occupation}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">वार्षिक उत्पन्न (Annual Income):</span>
              <span className="font-bold text-emerald-700">{profile.income}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">नोकरीचे ठिकाण (Work Location):</span>
              <span className="font-bold text-slate-800">{profile.city}, {profile.district}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Family Details */}
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-black text-white bg-[#A71930] px-4 py-1.5 rounded-xl inline-block border border-amber-300">
            ३. कौटुंबिक माहिती (Family Background)
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs bg-white p-4 rounded-2xl border border-amber-200">
            <div>
              <span className="text-slate-500 block font-medium">वडिलांचे नाव व व्यवसाय:</span>
              <span className="font-bold text-slate-900">{profile.fatherName || 'श्री. मुंडे'} ({profile.fatherOccupation})</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">आईचे नाव व व्यवसाय:</span>
              <span className="font-bold text-slate-900">{profile.motherName || 'सौ. मुंडे'} ({profile.motherOccupation})</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">भाऊ व बहीण:</span>
              <span className="font-bold text-slate-800">{profile.brothers} भाऊ, {profile.sisters} बहीण</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">मामांचे नाव व गाव:</span>
              <span className="font-bold text-slate-800">{profile.mamaName || 'श्री. सानप'} ({profile.mamaNative || profile.district})</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-amber-100">
              <span className="text-slate-500 block font-medium">नातेवाईक आडनावे (Relative Surnames):</span>
              <p className="font-bold text-amber-900 mt-1">
                {profile.relativeSurnames && profile.relativeSurnames.length > 0
                  ? profile.relativeSurnames.join(', ')
                  : 'मुंडे, सानप, नागरे, काकड, घूगे, आघाव, आंधळे'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Horoscope & Caste */}
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-black text-white bg-[#A71930] px-4 py-1.5 rounded-xl inline-block border border-amber-300">
            ४. धर्म, जात व गोत्र (Caste & Astro)
          </h3>
          <div className="grid grid-cols-3 gap-3 text-xs bg-white p-4 rounded-2xl border border-amber-200">
            <div>
              <span className="text-slate-500 block font-medium">उपजात (Sub Caste):</span>
              <span className="font-bold text-[#A71930]">{profile.subCaste}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">गोत्र (Gotra):</span>
              <span className="font-bold text-slate-800">{profile.gotra || 'काश्यप'}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">राशी (Rashi):</span>
              <span className="font-bold text-slate-800">{profile.rashi || 'मकर'}</span>
            </div>
          </div>
        </div>

        {/* Section 5: Address & Contact */}
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-black text-white bg-[#A71930] px-4 py-1.5 rounded-xl inline-block border border-amber-300">
            ५. संपर्क व पत्ता (Address & Contact)
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs bg-white p-4 rounded-2xl border border-amber-200">
            <div>
              <span className="text-slate-500 block font-medium">कायमचा मूळ पत्ता:</span>
              <span className="font-bold text-slate-800">{profile.nativeAddress || `${profile.taluka}, जिल्हा: ${profile.district}`}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">सध्याचा पत्ता:</span>
              <span className="font-bold text-slate-800">{profile.currentAddress || profile.city}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">संपर्क मोबाईल नंबर:</span>
              <span className="font-extrabold text-[#A71930] text-sm">{profile.mobile}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">ईमेल पत्ता:</span>
              <span className="font-bold text-slate-800">{profile.email || 'उपलब्ध नाही'}</span>
            </div>
          </div>
        </div>

        {/* Print Footer Disclaimer */}
        <div className="mt-8 pt-4 border-t border-amber-300 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <p>© २०२६ {siteConfig?.logoTitle || 'वंजारी जोडी'} — www.vanjarijodi.org</p>
          <p className="font-bold text-[#A71930]">॥ संत भगवान बाबा आशीर्वाद ॥</p>
        </div>

      </div>
    </div>
  );
};
