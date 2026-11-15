/* ===== Exam-gap drill: Android management options (Nov 14) ===== */
Object.assign(L, {
  androidGuide: ML + 'intune/device-enrollment/android/guide',
  androidCorp: ML + 'intune/device-enrollment/android/ref-corporate-methods',
  androidWork: ML + 'intune/device-enrollment/android/enterprise-work-profile',
  androidPersonal: ML + 'intune/device-enrollment/android/setup-personal-work-profile'
});
const G4 = "Exam gaps: Android management options";

add(D1, G4, "Employees use their own Android phones for work and personal apps. You need a separate work area that IT manages, and personal apps and data must stay out of IT's reach. Which Android management option should you use?",
  ["Android Enterprise personally owned work profile"],
  ["Android Enterprise corporate-owned work profile", "Android Enterprise fully managed", "Android Enterprise dedicated devices"],
  "Personally owned work profile is the BYOD option. A work profile separates work apps and data from the personal side, and Intune policies do not affect personal apps. The other three are for organization-owned devices.", L.androidGuide);

add(D1, G4, "Contoso buys Android phones for its sales team. The phones are used for work and the employees are allowed to use them for personal apps too. IT wants a work profile on the phone. Which option should you use?",
  ["Android Enterprise corporate-owned work profile (COPE)"],
  ["Android Enterprise personally owned work profile", "Android Enterprise fully managed (COBO)", "Android Open Source Project (AOSP) user-associated"],
  "Corporate-owned work profile is for organization-owned devices with one user that also allow personal use. Fully managed is for work-only devices. Personally owned work profile is BYOD.", L.androidGuide);

add(D1, G4, "Contoso buys Android phones for field technicians. The phones are for work only, each has one user, and IT needs to control the whole device. Which option should you use?",
  ["Android Enterprise fully managed (COBO)"],
  ["Android Enterprise corporate-owned work profile (COPE)", "Android Enterprise dedicated devices (COSU)", "Android Enterprise personally owned work profile"],
  "Fully managed is organization-owned, has one user and is used exclusively for work. IT controls the entire device and can enforce settings that the work profile methods do not offer.", L.androidGuide);

add(D1, G4, "Contoso has 40 shared Android devices that scan inventory in a warehouse. The devices are not tied to any user and must run only approved apps. Which option should you use?",
  ["Android Enterprise dedicated devices (COSU)"],
  ["Android Enterprise fully managed (COBO)", "Android Enterprise corporate-owned work profile (COPE)", "Android device administrator"],
  "Dedicated devices (formerly COSU) are organization-owned, kiosk-style devices that are not associated with a specific user. They are used to scan items, print tickets or manage inventory.", L.androidGuide);

add(D1, G4, "Contoso has Android devices from a manufacturer in a country where Google Mobile Services is not available. The devices are organization-owned and used only for work. Which option should you use?",
  ["Android Open Source Project (AOSP)"],
  ["Android Enterprise fully managed", "Android Enterprise dedicated devices", "Android Enterprise personally owned work profile"],
  "AOSP enrollment is for organization-owned devices that do not use Google Mobile Services. All the Android Enterprise options require GMS and managed Google Play.", L.androidGuide);

add(D1, G4, "Which two statements about Android Open Source Project (AOSP) enrollment are true? Each correct answer presents a complete solution.",
  ["Devices are enrolled with a QR code", "You can enroll only one device at a time"],
  ["Devices must support Google Mobile Services", "Enrollment needs a managed Google Play account", "Devices can be personally owned (BYOD)"],
  "AOSP devices are organization-owned and have no GMS. They enroll by QR code, one at a time, and can be userless or user-associated. They do not use managed Google Play.", L.androidGuide);

add(D1, G4, "You are asked to enroll new Android devices by using Android device administrator (DA). What is the best response?",
  ["Use another option, such as Android Enterprise, because DA is deprecated on GMS devices"],
  ["Use DA, because Android Enterprise supports only personally owned devices", "Use DA, because it is the only option for devices without a work profile", "Use DA, and add a device limit restriction to keep the devices apart"],
  "Android device administrator is deprecated and no longer available for GMS devices. Microsoft recommends other methods, and a device enrollment restriction to block DA enrollment.", L.androidGuide);

add(D1, G4, "You migrate Android devices off device administrator. Devices try to enroll with DA before trying other methods. What should you create to prevent that?",
  ["An enrollment restriction that blocks Android device administrator"],
  ["A compliance policy that blocks Android device administrator", "A device limit restriction that is set to 0 for Android", "An app protection policy that targets the Company Portal app"],
  "An Android device enrollment restriction that blocks device administrator enrollment keeps devices from enrolling with DA first.", L.androidGuide);

add(D1, G4, "Before you can enroll any Android Enterprise device in Intune, what must you do?",
  ["Connect Intune to a managed Google Play account"],
  ["Upload an Apple MDM push certificate to Intune", "Install the Intune Connector for Active Directory", "Create a Windows Autopilot deployment profile"],
  "Managed Google Play is required for all Android Enterprise management options: personally owned work profile, corporate-owned work profile, fully managed and dedicated.", L.androidGuide);

add(D1, G4, "You must enroll 500 new fully managed Android devices purchased from an authorized reseller. The devices must provision when users first turn them on, with no one entering codes. Which method should you use?",
  ["Google zero-touch enrollment"],
  ["Token entry", "NFC tag", "Company Portal app enrollment"],
  "Zero-touch lets you prepare corporate-owned devices so they provision and enroll automatically when turned on. The devices must come from an authorized zero-touch reseller.", L.androidCorp);

add(D1, G4, "Which three enrollment methods apply to Android Enterprise fully managed, dedicated and corporate-owned work profile devices? Each correct answer presents a complete solution.",
  ["QR code", "Google zero-touch enrollment", "Samsung Knox Mobile Enrollment"],
  ["Apple Business Manager", "Windows Autopilot"],
  "These devices enroll by QR code, zero-touch, Knox Mobile Enrollment, NFC or token. ADE and Autopilot are for Apple and Windows.", L.androidCorp);

add(D1, G4, "A technician enrolls a fully managed Android device by token. On the Google sign-in screen, which value does the technician enter instead of a Gmail account?",
  ["afw#setup"],
  ["intune#enroll", "android#managed", "company#portal"],
  "The DPC identifier afw#setup installs the Android Device Policy app and starts the Microsoft Intune enrollment. Then the user scans the QR code or enters the token.", L.androidCorp);

add(D1, G4, "You factory reset a new Android device before enrolling it as fully managed. What must the device do at the end of setup?",
  ["Complete enrollment without being restarted"],
  ["Restart so that the Intune policies are applied", "Be wiped again from the Intune admin center", "Join Microsoft Entra ID with an Autopilot profile"],
  "Users must not restart the device until enrollment is complete. A device restarted mid-enrollment can appear enrolled but not be protected by Intune policies.", L.androidCorp);

add(D1, G4, "You use Conditional Access that requires a compliant device for All cloud apps, on Android and Browsers. Corporate-owned Android devices fail to enroll. What should you do?",
  ["Exclude the Microsoft Intune cloud app from the policy"],
  ["Exclude the Company Portal app from the compliance policy", "Disable the managed Google Play connection", "Turn on Android device administrator"],
  "Android setup uses a Chrome tab to authenticate users during enrollment, so the Microsoft Intune cloud app must be excluded from a require-compliant-device policy that targets all cloud apps.", L.androidCorp);

add(D1, G4, "Which Android option supports the optional device enrollment manager (DEM) account?",
  ["Android Enterprise personally owned work profile"],
  ["Android Enterprise fully managed", "Android Enterprise dedicated devices", "Android Enterprise corporate-owned work profile"],
  "Of the options listed on Learn, the DEM account is supported for personally owned work profile. It is not supported for fully managed, dedicated, corporate-owned work profile or AOSP.", L.androidGuide);

add(D1, G4, "Which two statements about the personally owned work profile enrollment are true? Each correct answer presents a complete solution.",
  ["Users can enroll in a browser with web-based enrollment", "Users can enroll by signing in to the Company Portal app"],
  ["Enrollment needs a QR code scan on a factory-reset device", "Enrollment needs a zero-touch reseller", "The device must be wiped before enrollment"],
  "BYOD work profile enrollment does not need a reset. Users enroll through web-based enrollment (the default for new tenants) or the Company Portal app.", L.androidPersonal);

add(D1, G4, "A corporate-owned work profile (COPE) device and a fully managed (COBO) device are each assigned an app as Available. Which statement is true?",
  ["Available can target a device group for both device types"],
  ["Available can target only user groups for both device types", "Available is not supported on either of these device types", "Available works only for personally owned work profile devices"],
  "For most platforms Available applies to user groups only. Exceptions are Win32 apps and Android Enterprise fully managed and corporate-owned work profile devices, which can target user or device groups.", ML + 'intune/app-management/deployment/assign-groups');

add(D1, G4, "A manager asks which Android devices must be factory reset before enrollment. Which two options require it? Each correct answer presents a complete solution.",
  ["Fully managed", "Corporate-owned work profile"],
  ["Personally owned work profile", "Android Enterprise personally owned work profile with web-based enrollment"],
  "Dedicated, fully managed and corporate-owned work profile devices must be factory reset first. Personally owned work profile enrolls on a device that is already in use.", L.androidGuide);

add(D1, G4, "An employee leaves. Their personal Android phone has a work profile enrolled in Intune. You retire the device. What happens?",
  ["Work apps and data are removed and the personal side is untouched"],
  ["The entire phone is factory reset", "Only the Company Portal app is removed", "Nothing, because retire works only on fully managed devices"],
  "On a personally owned work profile, only the work profile is managed. Retiring the device removes company data and the work profile while personal apps and data remain.", L.androidWork);
