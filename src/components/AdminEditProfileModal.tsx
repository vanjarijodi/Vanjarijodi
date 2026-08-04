import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Camera, Award, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { UserProfile, Gender, MaritalStatus, MembershipTier } from '../types';
import { uploadToCloudinary } from '../utils/cloudinary';

interface AdminEditProfileModalProps {
  profile: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (profileId: string, updatedFields: Partial<UserProfile>) => void;
  canEdit?: boolean; // permission check
}

export const AdminEditProfileModal: React.FC<AdminEditProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave,
  canEdit = true,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'personal' | 'location' | 'education' | 'family' | 'photos' | 'badge'>('personal');
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);

  // Profile Form States
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<Gender>('bride');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState(25);
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('never_married');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [complexion, setComplexion] = useState('');
  const [religion, setReligion] = useState('हिंदू');
  const [subCaste, setSubCaste] = useState('वंजारी');

  const [mobile, setMobile] = useState('');
  const [secondaryMobile, setSecondaryMobile] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('');
  const [taluka, setTaluka] = useState('');
  const [city, setCity] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [nativeAddress, setNativeAddress] = useState('');

  const [education, setEducation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [income, setIncome] = useState('');

  const [fatherName, setFatherName] = useState('');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherOccupation, setMotherOccupation] = useState('');
  const [brothers, setBrothers] = useState(0);
  const [brotherDetails, setBrotherDetails] = useState('');
  const [sisters, setSisters] = useState(0);
  const [sisterDetails, setSisterDetails] = useState('');
  const [mamaName, setMamaName] = useState('');
  const [mamaNative, setMamaNative] = useState('');
  const [familyType, setFamilyType] = useState('विभक्त');
  const [expectations, setExpectations] = useState('');

  const [photos, setPhotos] = useState<string[]>([]);
  const [hideContact, setHideContact] = useState(false);
  const [hidePhoto, setHidePhoto] = useState(false);

  // Badge States
  const [assignedBadge, setAssignedBadge] = useState<string>('');
  const [customBadgeText, setCustomBadgeText] = useState<string>('');

  // Set form values when profile is opened
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setGender(profile.gender || 'bride');
      setDob(profile.dob || '');
      setAge(profile.age || 25);
      setMaritalStatus(profile.maritalStatus || 'never_married');
      setHeight(profile.height || '');
      setWeight(profile.weight || '');
      setBloodGroup(profile.bloodGroup || '');
      setComplexion(profile.complexion || '');
      setReligion(profile.religion || 'हिंदू');
      setSubCaste(profile.subCaste || 'वंजारी');

      setMobile(profile.mobile || profile.mobileNumber || '');
      setSecondaryMobile(profile.secondaryMobile || '');
      setEmail(profile.email || '');
      setDistrict(profile.district || '');
      setTaluka(profile.taluka || '');
      setCity(profile.city || '');
      setCurrentAddress(profile.currentAddress || '');
      setNativeAddress(profile.nativeAddress || '');

      setEducation(profile.education || '');
      setOccupation(profile.occupation || '');
      setCompanyName(profile.companyName || '');
      setIncome(profile.income || '');

      setFatherName(profile.fatherName || '');
      setFatherOccupation(profile.fatherOccupation || '');
      setMotherName(profile.motherName || '');
      setMotherOccupation(profile.motherOccupation || '');
      setBrothers(profile.brothers || 0);
      setBrotherDetails(profile.brotherDetails || '');
      setSisters(profile.sisters || 0);
      setSisterDetails(profile.sisterDetails || '');
      setMamaName(profile.mamaName || '');
      setMamaNative(profile.mamaNative || '');
      setFamilyType(profile.familyType || 'विभक्त');
      setExpectations(profile.expectations || '');

      setPhotos(profile.photos || []);
      setHideContact(profile.privacy?.hideContact || false);
      setHidePhoto(profile.privacy?.hidePhoto || false);

      // Initialize Badge
      const currentBadge = profile.badge || profile.customBadge || '';
      if (['Verified', 'VIP', 'Premium', 'Featured'].includes(currentBadge)) {
        setAssignedBadge(currentBadge);
        setCustomBadgeText('');
      } else if (currentBadge) {
        setAssignedBadge('Custom');
        setCustomBadgeText(currentBadge);
      } else {
        setAssignedBadge('');
        setCustomBadgeText('');
      }
    }
  }, [profile, isOpen]);

  if (!isOpen || !profile) return null;

  // Auto calculate age if DOB changes
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dobValue = e.target.value;
    setDob(dobValue);
    if (dobValue) {
      const birthYear = new Date(dobValue).getFullYear();
      const currentYear = new Date().getFullYear();
      if (birthYear && birthYear > 1900 && birthYear <= currentYear) {
        setAge(currentYear - birthYear);
      }
    }
  };

  // Upload Photo Sim using Cloudinary
  const handlePhotoUploadSim = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const files: File[] = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (photos.length + files.length > 5) {
      setPhotoError('आपण जास्तीत जास्त ५ फोटो जोडू शकता.');
    }

    const filesToUpload = files.slice(0, 5 - photos.length);
    if (filesToUpload.length === 0) return;

    setIsUploadingPhoto(true);
    for (const file of filesToUpload) {
      if (file.size > 800 * 1024) {
        setPhotoError(`फोटोचा आकार ${(file.size / 1024).toFixed(0)} KB आहे! कृपया ८०० KB पेक्षा कमी आकाराचा फोटो निवडा.`);
        continue;
      }

      const res = await uploadToCloudinary(file, 'vanjarijodi_candidates');
      if (res.success && res.url) {
        setPhotos((prev) => [...prev, res.url]);
      } else {
        setPhotoError(res.error || 'फोटो अपलोड करताना अडचण आली. कृपया पुन्हा प्रयत्न करा.');
      }
    }
    setIsUploadingPhoto(false);
  };

  const removePhoto = (indexToRemove: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const setPrimaryPhoto = (index: number) => {
    if (index === 0) return; // Already primary
    setPhotos((prev) => {
      const updated = [...prev];
      const primary = updated[index];
      updated.splice(index, 1);
      updated.unshift(primary);
      return updated;
    });
  };

  const handleSave = () => {
    if (!fullName.trim()) {
      alert('कृपया पूर्ण नाव प्रविष्ट करा!');
      return;
    }
    if (!mobile.trim()) {
      alert('कृपया मोबाईल नंबर प्रविष्ट करा!');
      return;
    }

    // Determine final badge value
    let finalBadge = '';
    if (assignedBadge === 'Custom') {
      finalBadge = customBadgeText.trim();
    } else {
      finalBadge = assignedBadge;
    }

    const updatedFields: Partial<UserProfile> = {
      fullName,
      gender,
      dob,
      age: Number(age),
      maritalStatus,
      height,
      weight,
      bloodGroup,
      complexion,
      religion,
      subCaste,
      mobile,
      secondaryMobile,
      email,
      district,
      taluka,
      city,
      currentAddress,
      nativeAddress,
      education,
      occupation,
      companyName,
      income,
      fatherName,
      fatherOccupation,
      motherName,
      motherOccupation,
      brothers: Number(brothers),
      brotherDetails,
      sisters: Number(sisters),
      sisterDetails,
      mamaName,
      mamaNative,
      familyType,
      expectations,
      photos,
      badge: finalBadge,
      customBadge: finalBadge,
      privacy: {
        ...profile.privacy,
        hideContact,
        hidePhoto,
      }
    };

    onSave(profile.id, updatedFields);
    alert('सदस्याची प्रोफाईल यशस्वीरित्या संपादित आणि जतन (Save) करण्यात आली आहे!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl border-2 border-amber-300 shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh] animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 border-b-2 border-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A71930] text-amber-100 flex items-center justify-center font-black shadow">
              ✍️
            </div>
            <div>
              <h3 className="text-base font-black text-[#A71930] flex items-center gap-2">
                <span>👤 सदस्य प्रोफाईल संपादन कक्ष (Member Profile Editor)</span>
              </h3>
              <p className="text-[11px] text-slate-700 font-bold mt-0.5">
                आयडी: <span className="font-mono text-slate-900">{profile.id}</span> • नाव: <span className="text-slate-900">{profile.fullName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-amber-100 hover:bg-amber-200 border border-amber-300 text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-amber-50/50 border-b border-amber-200 p-2 overflow-x-auto flex items-center gap-1 shrink-0">
          {[
            { id: 'personal', label: '👤 वैयक्तिक माहिती' },
            { id: 'location', label: '📍 पत्ता व संपर्क' },
            { id: 'education', label: '🎓 शिक्षण व नोकरी' },
            { id: 'family', label: '👨‍👩‍👦 कौटुंबिक माहिती' },
            { id: 'photos', label: '🖼️ फोटो व गोपनीयता' },
            { id: 'badge', label: '🏅 विशेष बॅज (Badge)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-[#A71930] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-amber-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Warning Permission */}
        {!canEdit && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs font-extrabold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>तुम्हाला सब-ॲडमिन कडून सदस्य प्रोफाइल संपादित करण्याचे अधिकार दिलेले नाहीत. कृपया सुपर-ॲडमिनशी संपर्क साधा.</span>
          </div>
        )}

        {/* Modal Form Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: PERSONAL DETAILS */}
          {activeSubTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">१. संपूर्ण नाव (Full Name) *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">२. लिंग (Gender) *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                >
                  <option value="bride">वधू (Bride)</option>
                  <option value="groom">वर (Groom)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">३. जन्म तारीख (Date of Birth)</label>
                <input
                  type="date"
                  value={dob}
                  onChange={handleDobChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">४. वय (Age) (स्वयंचलित)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">५. वैवाहिक स्थिती (Marital Status)</label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                >
                  <option value="never_married">कधीही लग्न झाले नाही (Never Married)</option>
                  <option value="divorced">घटस्फोटित (Divorced)</option>
                  <option value="widowed">विधूर / विधवा (Widowed)</option>
                  <option value="awaiting_divorce">घटस्फोट प्रलंबित (Awaiting Divorce)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">६. उंची (Height)</label>
                <input
                  type="text"
                  placeholder="उदा. 5 ft 5 in"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">७. वजन (Weight - kg)</label>
                <input
                  type="text"
                  placeholder="उदा. 62 kg"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">८. रक्तगट (Blood Group)</label>
                <input
                  type="text"
                  placeholder="उदा. O+ve"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">९. वर्ण / रंग (Complexion)</label>
                <input
                  type="text"
                  placeholder="गोरा, सावळा, गव्हाळ इ."
                  value={complexion}
                  onChange={(e) => setComplexion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">१०. धर्म (Religion)</label>
                <input
                  type="text"
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">११. जात / उपजात (Sub Caste)</label>
                <input
                  type="text"
                  value={subCaste}
                  onChange={(e) => setSubCaste(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: ADDRESS & CONTACT */}
          {activeSubTab === 'location' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">१. प्राथमिक मोबाईल नंबर *</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">२. पर्यायी नंबर (Secondary Mobile)</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={secondaryMobile}
                  onChange={(e) => setSecondaryMobile(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">३. ई-मेल आयडी (Email ID)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">४. जिल्हा (District)</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">५. तालुका (Taluka)</label>
                <input
                  type="text"
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">६. शहर / गाव (City / Village)</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-800 font-extrabold text-xs mb-1">७. सध्याचा पत्ता (Current Address)</label>
                <textarea
                  rows={2}
                  value={currentAddress}
                  onChange={(e) => setCurrentAddress(e.target.value)}
                  className="w-full p-3 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-800 font-extrabold text-xs mb-1">८. मूळ गावचा पत्ता (Native Address)</label>
                <textarea
                  rows={2}
                  value={nativeAddress}
                  onChange={(e) => setNativeAddress(e.target.value)}
                  className="w-full p-3 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>
            </div>
          )}

          {/* TAB 3: EDUCATION & OCCUPATION */}
          {activeSubTab === 'education' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">१. शिक्षण (Education Details)</label>
                <input
                  type="text"
                  placeholder="उदा. BE Computer, MBA, BA इ."
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">२. नोकरी / व्यवसाय (Occupation)</label>
                <input
                  type="text"
                  placeholder="उदा. सॉफ्टवेअर इंजिनिअर, शेती, व्यवसाय इ."
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">३. कंपनीचे नाव (Company Name)</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">४. वार्षिक उत्पन्न (Annual Income)</label>
                <input
                  type="text"
                  placeholder="उदा. ७ लाख रुपये किंवा ५ लाख ते १० लाख"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>
            </div>
          )}

          {/* TAB 4: FAMILY DETAILS */}
          {activeSubTab === 'family' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">१. वडिलांचे नाव (Father's Name)</label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">२. वडिलांचा व्यवसाय (Father's Occupation)</label>
                <input
                  type="text"
                  value={fatherOccupation}
                  onChange={(e) => setFatherOccupation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">३. आईचे नाव (Mother's Name)</label>
                <input
                  type="text"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">४. आईचा व्यवसाय (Mother's Occupation)</label>
                <input
                  type="text"
                  value={motherOccupation}
                  onChange={(e) => setMotherOccupation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">५. भाऊ (Number of Brothers)</label>
                <input
                  type="number"
                  value={brothers}
                  onChange={(e) => setBrothers(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">६. भाऊ तपशील (विवाहित/शिक्षण)</label>
                <input
                  type="text"
                  placeholder="उदा. १ भाऊ (विवाहित - नोकरी)"
                  value={brotherDetails}
                  onChange={(e) => setBrotherDetails(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">७. बहीण (Number of Sisters)</label>
                <input
                  type="number"
                  value={sisters}
                  onChange={(e) => setSisters(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">८. बहीण तपशील</label>
                <input
                  type="text"
                  value={sisterDetails}
                  onChange={(e) => setSisterDetails(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">९. मामाचे नाव (Mama's Name)</label>
                <input
                  type="text"
                  value={mamaName}
                  onChange={(e) => setMamaName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">१०. मामाचे मूळ गाव (Mama's Native)</label>
                <input
                  type="text"
                  value={mamaNative}
                  onChange={(e) => setMamaNative(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs mb-1">११. कुटुंब पद्धती (Family Type)</label>
                <select
                  value={familyType}
                  onChange={(e) => setFamilyType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                >
                  <option value="एकत्रित">एकत्रित कुटुंब (Joint Family)</option>
                  <option value="विभक्त">विभक्त कुटुंब (Nuclear Family)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-800 font-extrabold text-xs mb-1">१२. वधू/वर अपेक्षा (Partner Expectations)</label>
                <textarea
                  rows={3}
                  value={expectations}
                  onChange={(e) => setExpectations(e.target.value)}
                  className="w-full p-3 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                />
              </div>
            </div>
          )}

          {/* TAB 5: PHOTOS & PRIVACY */}
          {activeSubTab === 'photos' && (
            <div className="space-y-4">
              
              {/* Photo Upload Panel */}
              <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <h4 className="font-extrabold text-xs text-[#A71930] flex items-center gap-1.5">
                    <Camera className="w-4 h-4" />
                    <span>गॅलरी व्यवस्थापन (Manage Uploaded Photos - Max 5)</span>
                  </h4>
                  <span className="text-[11px] font-black text-slate-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    {photos.length} / ५ फोटो
                  </span>
                </div>

                {photoError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] font-bold flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{photoError}</span>
                  </div>
                )}

                {photos.length < 5 && (
                  <div className="border border-dashed border-amber-400 rounded-xl p-4 text-center bg-white hover:border-[#A71930] transition-colors relative">
                    {isUploadingPhoto ? (
                      <div className="flex flex-col items-center justify-center py-2 text-[#A71930] space-y-1">
                        <Loader2 className="w-6 h-6 animate-spin text-[#A71930]" />
                        <p className="text-[11px] font-bold">क्लाउडवर सुरक्षित फोटो अपलोड होत आहे...</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-[11px] text-slate-700 font-bold">
                          नवीन फोटो जोडा (जास्तीत जास्त ८०० KB प्रति फोटो, कमाल ५)
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoUploadSim}
                          className="hidden"
                          id="admin-photo-upload-field"
                        />
                        <label
                          htmlFor="admin-photo-upload-field"
                          className="inline-block mt-2 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-[#A71930] font-black text-[10px] border border-amber-300 cursor-pointer shadow-xs"
                        >
                          🖼️ संगणक/गॅलरी मधून फोटो निवडा
                        </label>
                      </>
                    )}
                  </div>
                )}

                {/* Show current uploaded photos and let user delete one-by-one or set primary */}
                {photos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                    {photos.map((url, idx) => {
                      const isPrimary = idx === 0;
                      return (
                        <div
                          key={idx}
                          className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                            isPrimary ? 'border-[#A71930] ring-2 ring-[#A71930]/20 scale-102 bg-amber-100/50' : 'border-amber-200'
                          }`}
                        >
                          <img src={url} alt={`user-${idx}`} className="w-full h-24 object-cover" />
                          
                          {/* Photo index / Primary Badge */}
                          <div className={`absolute bottom-0 inset-x-0 py-0.5 text-[9px] font-black text-center ${
                            isPrimary ? 'bg-[#A71930] text-amber-100' : 'bg-slate-900/60 text-white'
                          }`}>
                            {isPrimary ? '⭐ मुख्य फोटो' : 'दुय्यम फोटो'}
                          </div>

                          {/* Action Buttons Overlay */}
                          <div className="absolute top-1 right-1 flex items-center gap-1 z-10">
                            {/* Make Primary Star */}
                            {!isPrimary && (
                              <button
                                type="button"
                                onClick={() => setPrimaryPhoto(idx)}
                                className="p-1 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-md"
                                title="या फोटोला मुख्य (Profile Photo) बनवा"
                              >
                                ⭐
                              </button>
                            )}

                            {/* Delete Photo Button */}
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm('तुम्हाला खरोखर हा एक फोटो हटवायचा आहे का?')) {
                                  removePhoto(idx);
                                }
                              }}
                              className="p-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-md flex items-center justify-center"
                              title="फोटो हटवा (Delete Photo)"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center bg-amber-50/50 rounded-xl text-[11px] text-slate-500 font-bold border border-dashed border-amber-200">
                    सध्या सदस्य प्रोफाइलवर एकही फोटो उपलब्ध नाही.
                  </div>
                )}
              </div>

              {/* Privacy Panel */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300 space-y-3">
                <h4 className="font-extrabold text-xs text-slate-800 border-b pb-2">
                  🔒 गोपनीयता सेटिंग्ज संपादन (Privacy Controls)
                </h4>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hideContact}
                      onChange={(e) => setHideContact(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#A71930] focus:ring-0"
                    />
                    <span className="text-xs font-bold text-slate-700">📱 सदस्यांचा मोबाईल नंबर थेट सर्वांपासून लपवा (Hide Contact)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hidePhoto}
                      onChange={(e) => setHidePhoto(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#A71930] focus:ring-0"
                    />
                    <span className="text-xs font-bold text-slate-700">📷 सदस्यांचा फोटो अपरिचित लोकांपासून लपवा (Hide Photo)</span>
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: SPECIAL BADGE SYSTEM */}
          {activeSubTab === 'badge' && (
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl border-2 border-amber-300 space-y-3">
                <div className="flex items-center gap-2 text-[#A71930] font-black text-sm">
                  <Award className="w-5 h-5 text-[#A71930] animate-bounce" />
                  <span>प्रमाणित ओळख व विशेष बॅज वितरण कक्ष (Special Profile Badges)</span>
                </div>
                
                <p className="text-[11px] text-slate-700 font-bold leading-relaxed">
                  या सदस्याच्या प्रोफाइलवर दाखवण्यासाठी एक खास गुणवत्ता बॅज किंवा स्वतःचे सानुकूल नाव देऊन सत्कार करा. हा बॅज वधू-वराच्या प्रोफाइल कार्डवर थेट चमकणाऱ्या रूपात (Animated Badge) दिसून येईल.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-slate-800 font-extrabold text-xs mb-1">विशेष बॅज निवडा (Select Badge)</label>
                    <select
                      value={assignedBadge}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAssignedBadge(val);
                        if (val !== 'Custom') {
                          setCustomBadgeText('');
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                    >
                      <option value="">काहीही नाही (None)</option>
                      <option value="Verified">Verified (प्रमाणित - ⭐)</option>
                      <option value="VIP">VIP (अतिविशेष - 👑)</option>
                      <option value="Premium">Premium (प्रीमियम - 💎)</option>
                      <option value="Featured">Featured (खास - 🔥)</option>
                      <option value="Custom">Custom Badge (स्वतःचे सानुकूल नाव देणे...)</option>
                    </select>
                  </div>

                  {assignedBadge === 'Custom' && (
                    <div className="animate-in slide-in-from-top-2">
                      <label className="block text-slate-800 font-extrabold text-xs mb-1">सानुकूल बॅज मजकूर (Custom Badge Name) *</label>
                      <input
                        type="text"
                        maxLength={25}
                        placeholder="उदा. १००% खात्रीशीर, समाजसेवक, सरकारी नोकरी इ."
                        value={customBadgeText}
                        onChange={(e) => setCustomBadgeText(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 font-bold text-xs bg-white focus:border-[#A71930]"
                      />
                    </div>
                  )}
                </div>

                {/* Badge Preview */}
                <div className="p-3.5 bg-white rounded-xl border border-amber-200 mt-4 flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-500">थेट बॅज कसा दिसेल (Badge Live Preview):</span>
                  <div>
                    {assignedBadge ? (
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 via-rose-100 to-amber-100 text-[#800C1E] border-2 border-amber-400 font-black text-xs inline-flex items-center gap-1 shadow animate-pulse">
                        <Award className="w-4 h-4 text-[#A71930]" />
                        <span>{assignedBadge === 'Custom' ? (customBadgeText || 'सानुकूल बॅज') : assignedBadge}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-bold">कोणताही बॅज निवडलेला नाही</span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-black text-xs text-slate-700 cursor-pointer"
          >
            रद्द करा
          </button>
          <button
            onClick={handleSave}
            disabled={!canEdit}
            className={`px-5 py-2.5 rounded-xl text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow border ${
              canEdit
                ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500'
                : 'bg-slate-400 border-slate-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>बदल जतन करा (Save Changes)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
