import { useEffect, useState, useRef } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { useApp } from '../context/AppContext';

export function useAndroidBackHandler() {
  const app = useApp();
  const [showExitToast, setShowExitToast] = useState(false);
  const lastBackPressTime = useRef<number>(0);

  // Check if any modal or drawer is open
  const hasAnyModalOpen = Boolean(
    app.selectedProfileForModal ||
    app.activeChatUser ||
    app.activeVideoUser ||
    app.isKundaliModalOpen ||
    app.isBioDataMakerOpen ||
    app.isPaymentOpen ||
    app.isFilterOpen ||
    app.isRightDrawerOpen ||
    app.isLeftDrawerOpen ||
    app.isLoginOpen ||
    app.isRegisterOpen ||
    app.isAdminOpen ||
    app.isBusinessVendorDirectoryOpen ||
    app.isBusinessVendorRegisterModalOpen ||
    app.isVendorPortalOpen ||
    app.isSeoHubOpen ||
    app.isUserSecurityOpen ||
    app.isAdminSecurityOpen ||
    app.isPhoneAuthModalOpen ||
    app.isMarketingAdModalOpen ||
    app.isContactUnlockModalOpen ||
    app.isGuestRestrictionModalOpen ||
    app.isProfileRemovalModalOpen ||
    app.isFaceAuthModalOpen
  );

  useEffect(() => {
    let backButtonListener: any = null;

    const setupListener = async () => {
      try {
        backButtonListener = await CapacitorApp.addListener('backButton', () => {
          handleBackPress();
        });
      } catch {
        // Native back listener fallback for web browser preview
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBackPress();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    setupListener();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (backButtonListener && typeof backButtonListener.remove === 'function') {
        backButtonListener.remove();
      }
    };
  }, [
    app.selectedProfileForModal,
    app.activeChatUser,
    app.activeVideoUser,
    app.isKundaliModalOpen,
    app.isBioDataMakerOpen,
    app.isPaymentOpen,
    app.isFilterOpen,
    app.isRightDrawerOpen,
    app.isLeftDrawerOpen,
    app.isLoginOpen,
    app.isRegisterOpen,
    app.isAdminOpen,
    app.isBusinessVendorDirectoryOpen,
    app.isBusinessVendorRegisterModalOpen,
    app.isVendorPortalOpen,
    app.isSeoHubOpen,
    app.isUserSecurityOpen,
    app.isAdminSecurityOpen,
    app.isPhoneAuthModalOpen,
    app.isMarketingAdModalOpen,
    app.isContactUnlockModalOpen,
    app.isGuestRestrictionModalOpen,
    app.isProfileRemovalModalOpen,
    app.isFaceAuthModalOpen,
    app.currentView
  ]);

  const handleBackPress = () => {
    // Priority 1: Top-most open Modals / Views
    if (app.selectedProfileForModal) {
      app.setSelectedProfileForModal(null);
      return;
    }
    if (app.activeChatUser) {
      app.setActiveChatUser(null);
      return;
    }
    if (app.activeVideoUser) {
      app.setActiveVideoUser(null);
      return;
    }
    if (app.isKundaliModalOpen) {
      app.setIsKundaliModalOpen(false);
      return;
    }
    if (app.isBioDataMakerOpen) {
      app.setIsBioDataMakerOpen(false);
      return;
    }
    if (app.isPaymentOpen) {
      app.setIsPaymentOpen(false);
      return;
    }
    if (app.isFilterOpen) {
      app.setIsFilterOpen(false);
      return;
    }
    if (app.isRightDrawerOpen) {
      app.setIsRightDrawerOpen(false);
      return;
    }
    if (app.isLeftDrawerOpen) {
      app.setIsLeftDrawerOpen(false);
      return;
    }
    if (app.isLoginOpen) {
      app.setIsLoginOpen(false);
      return;
    }
    if (app.isRegisterOpen) {
      app.setIsRegisterOpen(false);
      return;
    }
    if (app.isAdminOpen) {
      app.setIsAdminOpen(false);
      return;
    }
    if (app.isBusinessVendorDirectoryOpen) {
      app.setIsBusinessVendorDirectoryOpen(false);
      return;
    }
    if (app.isBusinessVendorRegisterModalOpen) {
      app.setIsBusinessVendorRegisterModalOpen(false);
      return;
    }
    if (app.isVendorPortalOpen) {
      app.setIsVendorPortalOpen(false);
      return;
    }
    if (app.isSeoHubOpen) {
      app.setIsSeoHubOpen(false);
      return;
    }
    if (app.isUserSecurityOpen) {
      app.setIsUserSecurityOpen(false);
      return;
    }
    if (app.isAdminSecurityOpen) {
      app.setIsAdminSecurityOpen(false);
      return;
    }
    if (app.isPhoneAuthModalOpen) {
      app.setIsPhoneAuthModalOpen(false);
      return;
    }
    if (app.isMarketingAdModalOpen) {
      app.setIsMarketingAdModalOpen(false);
      return;
    }
    if (app.isContactUnlockModalOpen) {
      app.setIsContactUnlockModalOpen(false);
      return;
    }
    if (app.isGuestRestrictionModalOpen) {
      app.setIsGuestRestrictionModalOpen(false);
      return;
    }
    if (app.isProfileRemovalModalOpen) {
      app.setIsProfileRemovalModalOpen(false);
      return;
    }
    if (app.isFaceAuthModalOpen) {
      app.setIsFaceAuthModalOpen(false);
      return;
    }

    // Priority 2: View Navigation
    if (app.currentView === 'dashboard') {
      app.setCurrentView('profiles');
      return;
    }
    if (app.currentView === 'profiles') {
      app.setCurrentView('home');
      return;
    }

    // Priority 3: On Home view with no open modals -> Double press to exit app
    if (app.currentView === 'home') {
      const now = Date.now();
      if (now - lastBackPressTime.current < 2000) {
        try {
          CapacitorApp.exitApp();
        } catch {
          console.log('App exit called');
        }
      } else {
        lastBackPressTime.current = now;
        setShowExitToast(true);
        setTimeout(() => setShowExitToast(false), 2000);
      }
    }
  };

  return { showExitToast, hasAnyModalOpen, handleBackPress };
}
