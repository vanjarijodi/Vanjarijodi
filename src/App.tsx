import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useAndroidBackHandler } from './hooks/useAndroidBackHandler';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturesSection } from './components/FeaturesSection';
import { StatsSection } from './components/StatsSection';
import { ProfilesGrid } from './components/ProfilesGrid';
import { SuccessStories } from './components/SuccessStories';
import { CommunityAds } from './components/CommunityAds';
import { PremiumPlans } from './components/PremiumPlans';
import { FAQSection } from './components/FAQSection';
import { AndroidAppBanner } from './components/AndroidAppBanner';
import { Footer } from './components/Footer';
import { ProfileDetailModal } from './components/ProfileDetailModal';
import { SearchFiltersModal } from './components/SearchFiltersModal';
import { RegisterModal } from './components/RegisterModal';
import { LoginModal } from './components/LoginModal';
import { MemberDashboard } from './components/MemberDashboard';
import { AdminPanel } from './components/AdminPanel';
import { ChatModal } from './components/ChatModal';
import { VideoCallModal } from './components/VideoCallModal';
import { PaymentModal } from './components/PaymentModal';
import { AdminSupportChatWidget } from './components/AdminSupportChatWidget';
import { ContactUnlockModal } from './components/ContactUnlockModal';
import { GuestRestrictionModal } from './components/GuestRestrictionModal';
import { ProfileRemovalModal } from './components/ProfileRemovalModal';
import { SplashScreen } from './components/SplashScreen';
import { BlessingsSection } from './components/BlessingsSection';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LeftDrawer } from './components/LeftDrawer';
import { RightFilterDrawer } from './components/RightFilterDrawer';
import { BusinessVendorDirectoryModal } from './components/BusinessVendorDirectoryModal';
import { BusinessVendorRegisterModal } from './components/BusinessVendorRegisterModal';
import { BusinessVendorPortalModal } from './components/BusinessVendorPortalModal';
import { FlashAdPopup } from './components/FlashAdPopup';
import { BioDataMakerModal } from './components/BioDataMakerModal';
import { DynamicActionDock } from './components/DynamicActionDock';
import { DynamicSeoHead } from './components/DynamicSeoHead';
import { ProgrammaticSeoModal } from './components/ProgrammaticSeoModal';
import { UserSecurityPortalModal } from './components/UserSecurityPortalModal';
import { AdminSecurityCenterModal } from './components/AdminSecurityCenterModal';
import { TruecallerVerificationModal } from './components/TruecallerVerificationModal';
import { DigitalMarketingAdModal } from './components/DigitalMarketingAdModal';
import { KundaliMilanModal } from './components/KundaliMilanModal';
import { SingleKundliReportModal } from './components/SingleKundliReportModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NetworkStatusIndicator } from './components/NetworkStatusIndicator';

const MainAppContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    selectedProfileForModal,
    setSelectedProfileForModal,
    isFilterOpen,
    setIsFilterOpen,
    isRegisterOpen,
    setIsRegisterOpen,
    isLoginOpen,
    setIsLoginOpen,
    isAdminOpen,
    setIsAdminOpen,
    activeChatUser,
    setActiveChatUser,
    activeVideoUser,
    setActiveVideoUser,
    isPaymentOpen,
    setIsPaymentOpen,
    selectedPlanForPayment,
    siteConfig,
    currentUser,
    isBusinessVendorDirectoryOpen,
    setIsBusinessVendorDirectoryOpen,
    isBusinessVendorRegisterModalOpen,
    setIsBusinessVendorRegisterModalOpen,
    isVendorPortalOpen,
    setIsVendorPortalOpen,
    isBioDataMakerOpen,
    setIsBioDataMakerOpen,
    isSeoHubOpen,
    setIsSeoHubOpen,
    seoTargetCommunity,
    seoTargetCity,
    isUserSecurityOpen,
    setIsUserSecurityOpen,
    isAdminSecurityOpen,
    setIsAdminSecurityOpen,
    isPhoneAuthModalOpen,
    setIsPhoneAuthModalOpen,
    isMarketingAdModalOpen,
    setIsMarketingAdModalOpen,
    isKundaliModalOpen,
    setIsKundaliModalOpen,
    selectedKundaliCandidate,
    isSingleKundliModalOpen,
    setIsSingleKundliModalOpen,
    language,
  } = useApp();

  const { showExitToast } = useAndroidBackHandler();
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    if (!currentUser && (currentView === 'profiles' || currentView === 'dashboard')) {
      setCurrentView('home');
    }
  }, [currentUser, currentView, setCurrentView]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  const isEn = language === 'en';

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-slate-800 flex flex-col font-sans selection:bg-[#A71930] selection:text-white overflow-x-hidden w-full max-w-full relative">
      {/* 🚀 Dynamic Technical SEO Meta, Title & Schema.org JSON-LD Injector */}
      <DynamicSeoHead />
      
      {/* Header with Sticky Container & Integrated Site-wide Notice Banner */}
      <Navbar />

      {/* Main Content Area */}
      {currentView === 'home' && (
        <main className="flex-1 pb-24 md:pb-0 w-full max-w-full overflow-x-hidden">
          {/* Full Screen Hero with Auto Sliding Images & Dark Overlay & Quick Search */}
          <Hero />

          {/* Premium Paid Plans */}
          <PremiumPlans />
        </main>
      )}

      {currentView === 'dashboard' && (
        <main className="flex-1 pb-24 md:pb-0 w-full max-w-full overflow-x-hidden">
          <MemberDashboard />
        </main>
      )}

      {currentView === 'profiles' && (
        <main className="flex-1 pb-24 md:pb-0 pt-4 w-full max-w-full overflow-x-hidden">
          <ProfilesGrid />
        </main>
      )}

      {/* Footer */}
      <Footer />

      {/* Drawers for Mobile Navigation & Filters */}
      <LeftDrawer />
      <RightFilterDrawer />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Android Exit Double Back Press Toast Notification */}
      {showExitToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-2.5 rounded-full shadow-2xl border border-amber-400/50 flex items-center gap-2 text-xs font-black animate-bounce select-none">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>{isEn ? 'Press Back again to exit app' : 'पुन्हा Back दाबा — ॲप बंद होईल'}</span>
        </div>
      )}

      {/* Modals Container */}
      <ProfileDetailModal
        profile={selectedProfileForModal}
        onClose={() => setSelectedProfileForModal(null)}
      />

      <SearchFiltersModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      <ChatModal
        user={activeChatUser}
        onClose={() => setActiveChatUser(null)}
      />

      <VideoCallModal
        user={activeVideoUser}
        onClose={() => setActiveVideoUser(null)}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        plan={selectedPlanForPayment}
      />

      {/* Manual Pay-Per-Contact Unlock Modal */}
      <ContactUnlockModal />

      {/* Granular Guest Access Restriction Popup */}
      <GuestRestrictionModal />

      {/* Member Profile Removal / Marriage Fixed Modal */}
      <ProfileRemovalModal />

      {/* Floating Direct Member-to-Admin Support Chat Widget */}
      <AdminSupportChatWidget />

      {/* Interactive Timed Flash / Popup Ad Banner */}
      <FlashAdPopup />

      {/* Business Vendor Directory, Registration & Portal Modals */}
      {isBusinessVendorDirectoryOpen && (
        <BusinessVendorDirectoryModal onClose={() => setIsBusinessVendorDirectoryOpen(false)} />
      )}
      {isBusinessVendorRegisterModalOpen && (
        <BusinessVendorRegisterModal onClose={() => setIsBusinessVendorRegisterModalOpen(false)} />
      )}
      {isVendorPortalOpen && (
        <BusinessVendorPortalModal onClose={() => setIsVendorPortalOpen(false)} />
      )}

      {/* Server-Driven Dynamic Action Dock (Speed-dial, Bottom Sheet, Side-Rail, Chip-Bar) */}
      <DynamicActionDock />

      {/* Online Marathi BioData Maker Modal */}
      <BioDataMakerModal
        isOpen={isBioDataMakerOpen}
        onClose={() => setIsBioDataMakerOpen(false)}
      />

      {/* Programmatic SEO Landing Pages Hub (Communities & Cities) */}
      <ProgrammaticSeoModal
        isOpen={isSeoHubOpen}
        onClose={() => setIsSeoHubOpen(false)}
        initialCommunitySlug={seoTargetCommunity}
        initialCitySlug={seoTargetCity}
      />

      {/* User Security & Active Device Sessions Portal */}
      <UserSecurityPortalModal
        isOpen={isUserSecurityOpen}
        onClose={() => setIsUserSecurityOpen(false)}
      />

      {/* Administrator Security & Threat Monitoring Center */}
      <AdminSecurityCenterModal
        isOpen={isAdminSecurityOpen}
        onClose={() => setIsAdminSecurityOpen(false)}
      />

      {/* Truecaller & Mobile Number Verification Modal */}
      <TruecallerVerificationModal
        isOpen={isPhoneAuthModalOpen}
        onClose={() => setIsPhoneAuthModalOpen(false)}
      />

      {/* Digital Ad & Marketing Creative / WhatsApp Poster Modal */}
      <DigitalMarketingAdModal
        isOpen={isMarketingAdModalOpen}
        onClose={() => setIsMarketingAdModalOpen(false)}
      />

      {/* Official Prokerala Vedic Kundali Milan (36 Gun Matching) Modal */}
      <ErrorBoundary fallbackTitle="कुंडली जुळवणी लोड करताना समस्या आली">
        <KundaliMilanModal
          isOpen={isKundaliModalOpen}
          onClose={() => setIsKundaliModalOpen(false)}
          candidateProfile={selectedKundaliCandidate}
        />
      </ErrorBoundary>

      {/* Single Birth Horoscope / Kundli Report Generator Modal */}
      <ErrorBoundary fallbackTitle="जन्म कुंडली अहवाल लोड करताना समस्या आली">
        <SingleKundliReportModal
          isOpen={isSingleKundliModalOpen}
          onClose={() => setIsSingleKundliModalOpen(false)}
        />
      </ErrorBoundary>

      {/* Network Status & Offline Reconnect Indicator */}
      <NetworkStatusIndicator />

    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
