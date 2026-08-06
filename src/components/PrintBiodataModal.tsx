import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile } from '../types';
import { VanjariJodiLogo } from './VanjariJodiLogo';
import { Printer, X, Download, FileImage, FileText, ChevronDown, Check, ShieldCheck } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { VerifiedBadge } from './VerifiedBadge';

export const PrintBiodataModal: React.FC<{
  profile: UserProfile | null;
  onClose: () => void;
}> = ({ profile, onClose }) => {
  const { siteConfig } = useApp();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!profile) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJpg = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);
    setIsDropdownOpen(false);

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFDF5',
        logging: false
      });

      const image = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.href = image;
      link.download = `VanjariJodi_Biodata_${profile.fullName.replace(/\s+/g, '_')}.jpg`;
      link.click();
    } catch (err) {
      console.error('Error generating JPG biodata:', err);
      alert('बायोडाटा JPG डाउनलोड करताना त्रुटी आली. कृपया प्रिंट पर्याय वापरा.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);
    setIsDropdownOpen(false);

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFDF5',
        logging: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      pdf.save(`VanjariJodi_Biodata_${profile.fullName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('Error generating PDF biodata:', err);
      alert('बायोडाटा PDF डाउनलोड करताना त्रुटी आली. कृपया प्रिंट पर्याय वापरा.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-slate-900/75 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      
      {/* Top Action Bar */}
      <div className="fixed top-4 right-4 z-[110] flex items-center gap-2 print:hidden">
        
        {/* Download Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-xl border border-amber-300 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>{isGenerating ? 'तयार होत आहे...' : 'बायोडाटा डाउनलोड करा'}</span>
            <ChevronDown className="w-3.5 h-3.5 ml-1" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-slate-200 py-2 z-[120] text-slate-800">
              <button
                onClick={handleDownloadJpg}
                className="w-full text-left px-4 py-2.5 hover:bg-amber-50 flex items-center gap-3 text-xs font-bold text-slate-800"
              >
                <FileImage className="w-4 h-4 text-emerald-600" />
                <span>JPG इमेज म्हणून डाउनलोड करा</span>
              </button>
              <button
                onClick={handleDownloadPdf}
                className="w-full text-left px-4 py-2.5 hover:bg-amber-50 flex items-center gap-3 text-xs font-bold text-slate-800 border-t border-slate-100"
              >
                <FileText className="w-4 h-4 text-[#A71930]" />
                <span>PDF दस्तऐवज म्हणून डाउनलोड करा</span>
              </button>
            </div>
          )}
        </div>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-full bg-[#A71930] hover:bg-[#800C1E] text-white text-xs font-bold shadow-xl border border-amber-300 flex items-center gap-2 transition-all active:scale-95"
        >
          <Printer className="w-4 h-4 text-amber-300" />
          <span className="hidden sm:inline">प्रिंट / A4 PDF</span>
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white text-slate-700 hover:bg-slate-100 shadow-xl border border-slate-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Printable Sheet Wrapper */}
      <div
        ref={printRef}
        className="w-full max-w-3xl bg-[#FFFDF5] border-2 border-amber-400 rounded-3xl p-6 sm:p-10 shadow-2xl text-slate-800 my-auto print:border-none print:shadow-none print:p-0 print:w-full print:max-w-none print:bg-white"
      >
        
        {/* Print Header */}
        <div className="text-center pb-4 border-b-2 border-[#A71930]/30 space-y-1">
          <p className="text-xs sm:text-sm font-bold text-[#A71930] tracking-widest uppercase">
            {siteConfig?.topBarText || '॥ श्री संत भगवान बाबा प्रसन्न ॥'}
          </p>
          
          <div className="flex items-center justify-center gap-3 py-1">
            <VanjariJodiLogo variant="emblem" size={48} />
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-black text-[#A71930] tracking-tight">
                {siteConfig?.logoTitle || 'वंजारी जोडी'}
              </h1>
              <p className="text-xs font-bold text-amber-800">
                {siteConfig?.logoSubtitle || 'पवित्र नात्यांची सुंदर सुरुवात'} — अधिकृत बायोडाटा
              </p>
            </div>
          </div>
        </div>

        {/* Profile Identity & Photo Banner */}
        <div className="mt-6 grid grid-cols-12 gap-6 items-center bg-white p-4 rounded-2xl border border-amber-200 shadow-sm">
          <div className="col-span-8 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-[#A71930] text-xs font-bold border border-amber-300">
                आयडी: {profile.id} | वंजारी समाज ({profile.subCaste})
              </span>
              <VerifiedBadge profile={profile} size="sm" showLabel={true} />
            </div>

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
            <div className="w-32 h-40 rounded-2xl overflow-hidden border-2 border-[#A71930] shadow-md bg-slate-100 p-1 relative">
              <img
                src={profile.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                alt={profile.fullName}
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute bottom-2 right-2 text-[8px] bg-black/60 text-amber-300 font-bold px-1 rounded">
                वंजारी जोडी
              </div>
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
              <span className="font-bold text-slate-800">{profile.weight || 'उपलब्ध नाही'}</span>
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
              <span className="text-slate-500 block font-medium">वैवाहिक स्थिती:</span>
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
              <span className="font-bold text-slate-900">{profile.fatherName || 'माहिती उपलब्ध'} ({profile.fatherOccupation})</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">आईचे नाव व व्यवसाय:</span>
              <span className="font-bold text-slate-900">{profile.motherName || 'माहिती उपलब्ध'} ({profile.motherOccupation})</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">भाऊ व बहीण:</span>
              <span className="font-bold text-slate-800">{profile.brothers} भाऊ, {profile.sisters} बहीण</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">मामांचे नाव व गाव:</span>
              <span className="font-bold text-slate-800">{profile.mamaName || 'माहिती उपलब्ध'} ({profile.mamaNative || profile.district})</span>
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
