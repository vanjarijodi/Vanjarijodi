import { transliterateMarathiToEnglish } from './transliterate';

export function formatProfileDisplayName(
  profileName: string,
  currentUser: any,
  isAdminLoggedIn: boolean,
  isAuthorized: boolean,
  siteConfig: any,
  language: 'mr' | 'en' = 'mr'
): string {
  if (!profileName) return language === 'en' ? 'Candidate' : 'उमेदवार';

  // Admin and authorized contacts see full name
  if (isAdminLoggedIn || isAuthorized) {
    return language === 'en' ? transliterateMarathiToEnglish(profileName) : profileName;
  }

  // Strict Guest Mode: Blur/Mask name for guest visitors
  const isGuest = !currentUser || currentUser.id?.startsWith('guest') || currentUser.isGuest;
  if (isGuest) {
    const parts = profileName.trim().split(/\s+/);
    const masked = parts.map((p) => (p.length > 0 ? p.charAt(0) + '****' : '****')).join(' ');
    return language === 'en' ? `${masked} (🔒 Login to view)` : `${masked} (🔒 नाव पाहण्यासाठी लॉगिन करा)`;
  }

  // Strict Unapproved Member Mode: Mask name until admin approves
  const isUnapproved = Boolean(currentUser && currentUser.isApproved === false && !currentUser.isAdmin);
  if (isUnapproved) {
    const parts = profileName.trim().split(/\s+/);
    const masked = parts.map((p) => (p.length > 0 ? p.charAt(0) + '****' : '****')).join(' ');
    return language === 'en' ? `${masked} (🔒 Pending Admin Approval)` : `${masked} (🔒 ॲडमिन मंजुरी प्रलंबित)`;
  }

  // Free / Unpaid Member Mode
  const isPaidMember = Boolean(
    currentUser &&
      ((currentUser.membership && currentUser.membership !== 'free') ||
        currentUser.isCustomAccessGranted)
  );

  if (!isPaidMember) {
    // If festive free mode is ON, name is fully visible
    if (siteConfig?.isFestiveFreeModeEnabled) {
      return language === 'en' ? transliterateMarathiToEnglish(profileName) : profileName;
    }

    const parts = profileName.trim().split(/\s+/);
    const honorifics = ['डॉ.', 'इंजि.', 'प्रा.', 'ॲड.', 'adv.', 'dr.', 'er.', 'prof.', 'mr.', 'mrs.', 'ms.', 'श्री.', 'सौ.', 'कु.'];
    let honorific = '';
    let nameParts = [...parts];

    if (nameParts.length > 0 && honorifics.some((h) => h.toLowerCase() === nameParts[0].toLowerCase())) {
      honorific = nameParts[0] + ' ';
      nameParts = nameParts.slice(1);
    }

    // Check specific fine-grained hide flags
    const hideFirstName = siteConfig?.hideCandidateFirstNameForFreeUsers === true;
    const hideMiddleName = siteConfig?.hideMiddleNameForFreeUsers === true || siteConfig?.hideFatherNameForFreeUsers === true;
    const hideSurname = siteConfig?.hideSurnameForFreeUsers === true || siteConfig?.hideLastNameForFreeUsers === true;

    // If explicit fine-grained flags are enabled:
    if (hideFirstName || hideMiddleName || hideSurname) {
      const processed = nameParts.map((part, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === nameParts.length - 1 && nameParts.length > 1;
        const isMiddle = !isFirst && !isLast;

        if (isFirst && hideFirstName) {
          return '****';
        }
        if (isMiddle && hideMiddleName) {
          return '****';
        }
        if (isLast && hideSurname) {
          return '****';
        }
        return part;
      });

      const result = honorific + processed.join(' ');
      return language === 'en' ? transliterateMarathiToEnglish(result) : result;
    }

    const mode = siteConfig?.nameDisplayModeForFreeUsers || 'surname_only';
    let resultName = profileName;

    if (mode === 'surname_only') {
      if (nameParts.length > 1) {
        const lastName = nameParts[nameParts.length - 1];
        resultName = `${honorific}**** ${lastName}`;
      } else if (nameParts.length === 1) {
        resultName = `${honorific}${nameParts[0]}`;
      }
    } else if (mode === 'first_and_last') {
      if (nameParts.length > 1) {
        const firstName = nameParts[0];
        const lastName = nameParts[nameParts.length - 1];
        resultName = `${honorific}${firstName} **** ${lastName}`;
      }
    } else if (mode === 'first_name_only') {
      if (nameParts.length > 0) resultName = `${honorific}${nameParts[0]} ****`;
    } else if (mode === 'blurred_name' || mode === 'hidden_star') {
      resultName = honorific + nameParts.map((p) => p.charAt(0) + '****').join(' ');
    }

    if (language === 'en') {
      return transliterateMarathiToEnglish(resultName);
    }
    return resultName;
  }

  if (language === 'en') {
    return transliterateMarathiToEnglish(profileName);
  }

  return profileName;
}

