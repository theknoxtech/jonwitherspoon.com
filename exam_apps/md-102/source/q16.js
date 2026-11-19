/* ===== Exam-gap drills (Nov 13): platform and enrollment, app assignment intents, where Defender settings live ===== */
Object.assign(L, {
  assignGroups: ML + 'intune/app-management/deployment/assign-groups',
  addWin32: ML + 'intune/app-management/deployment/add-win32',
  enrollDevices: ML + 'intune/device-enrollment/enroll-devices',
  enrollIos: ML + 'intune/device-enrollment/apple/guide-ios-ipados',
  enrollAndroid: ML + 'intune/device-enrollment/android/guide',
  esManage: ML + 'intune/device-configuration/endpoint-security/manage-policies',
  esFaq: ML + 'intune/device-security/endpoint-security-policies',
  edrDeploy: ML + 'intune/device-configuration/endpoint-security/deploy-edr',
  avPolicy: ML + 'intune/device-configuration/endpoint-security/antivirus'
});
const G1 = "Exam gaps: Which platform and enrollment method";
const G2 = "Exam gaps: App assignment intents";
const G3 = "Exam gaps: Where Defender settings live";

/* ---- Group 1: platform, ownership, enrollment (Domain 1) ---- */
add(D1, G1, "Contoso buys 200 new iPhones for employees. The devices must be supervised and must enroll automatically when the user turns them on and completes Setup Assistant. What should you use?",
  ["Automated Device Enrollment (ADE) through Apple Business Manager"],
  ["User Enrollment from the Company Portal app", "Device enrollment from the Company Portal app", "A provisioning package that you create in Windows Configuration Designer"],
  "ADE is the company-owned iOS/iPadOS method that supervises the device and enrolls it during Setup Assistant. Company Portal device enrollment is the usual BYOD method and does not supervise the device. User Enrollment is a limited BYOD method.", L.enrollIos);

add(D1, G1, "Employees use personal iPhones for work. You must keep personal and work data separate, and you must not be able to wipe the whole device or see personal apps. Which enrollment method should you use?",
  ["User Enrollment"],
  ["Automated Device Enrollment (ADE)", "Apple Configurator direct enrollment", "Device enrollment with supervision turned on"],
  "User Enrollment is the streamlined BYOD method that gives admins a subset of management options and keeps personal data out of reach. ADE and Apple Configurator are company-owned methods that supervise the device.", L.enrollIos);

add(D1, G1, "Employees use personal Android phones. You need a separate work area on the phone. IT must manage only the apps and data in that area. Which Android management option should you use?",
  ["Android Enterprise personally owned work profile"],
  ["Android Enterprise fully managed", "Android Enterprise dedicated devices", "Android Open Source Project (AOSP) corporate-owned, user associated"],
  "Personally owned work profile is the Android BYOD option. A work profile separates work apps and data from personal ones. Fully managed and dedicated are for company-owned devices, and AOSP is for devices without Google Mobile Services.", L.enrollAndroid);

add(D1, G1, "Contoso has 50 shared Android tablets that are used as ticket-printing kiosks. The tablets have no user. Which Android management option should you use?",
  ["Android Enterprise dedicated devices"],
  ["Android Enterprise personally owned work profile", "Android Enterprise fully managed", "Android device administrator"],
  "Dedicated devices (kiosk, single-purpose, no user affinity) are company-owned and let you limit the apps and links on the device. Fully managed is one user with a company-owned device. Device administrator is deprecated on devices with Google Mobile Services.", L.enrollAndroid);

add(D1, G1, "You need to manage company-owned Android devices that are used only for work, with one user per device. You need controls that the work profile method does not offer. Which option should you use?",
  ["Android Enterprise fully managed"],
  ["Android Enterprise personally owned work profile", "Android Enterprise dedicated devices", "Android Enterprise corporate-owned work profile"],
  "Fully managed is for corporate-owned, work-only devices with a single user, and it controls the whole device. Corporate-owned work profile is for devices that are also allowed for personal use.", ML + 'intune/device-enrollment/enroll-devices');

add(D1, G1, "You plan to enroll any Android Enterprise device in Intune. What must you do first?",
  ["Connect your Intune tenant to a managed Google Play account"],
  ["Upload an Apple MDM push certificate", "Create a Windows Autopilot deployment profile", "Install the Intune Connector for Active Directory"],
  "The managed Google Play connection is required for all Android Enterprise management options. The push certificate is for Apple devices, and Autopilot and the Connector are Windows items.", L.enrollAndroid);

add(D1, G1, "Contoso unboxes new company-owned Windows 11 Pro laptops. IT wants a user to sign in at the first screen and reach a managed desktop without IT touching the devices. Which approach should you use?",
  ["Windows Autopilot user-driven mode"],
  ["Apple Automated Device Enrollment", "Android Enterprise zero-touch enrollment", "A User Enrollment profile"],
  "Windows Autopilot is the Windows method for new corporate devices. ADE is Apple only, and zero-touch is Android only.", L.userDriven);

add(D1, G1, "A user has a personal Windows 11 Pro laptop. The user needs access to work apps and single sign-on, and IT does not want to manage the whole device. Which state should the device be in?",
  ["Microsoft Entra registered"],
  ["Microsoft Entra joined", "Microsoft Entra hybrid joined", "Enrolled with Windows Autopilot self-deploying mode"],
  "Entra registered is the state for personal (BYOD) Windows devices that need SSO and Conditional Access without full management. Joined and hybrid joined are for organization-owned devices.", L.enrollDevices);

add(D1, G1, "Which three platforms can you protect with Antivirus endpoint security policies? Each correct answer presents a complete solution.",
  ["Windows", "macOS", "Linux"],
  ["iOS/iPadOS", "Android"],
  "Antivirus policies cover Windows, macOS and Linux. iOS and Android use compliance policies and app protection policies, with Defender for Endpoint deployed as an app.", L.esFaq);

add(D1, G1, "Contoso wants to manage Windows Update settings for PCs with update rings. Which devices can receive an update ring policy?",
  ["Windows 10 and Windows 11 devices"],
  ["iPhones and iPads", "Android Enterprise fully managed devices", "macOS devices"],
  "Update rings are a Windows-only feature. Apple devices use declarative device management software update policies, and Android uses its own update controls.", L.updRings);

add(D1, G1, "A company-owned Windows 11 Home laptop must be joined to Microsoft Entra ID and enrolled in Intune through Windows Autopilot. What is the problem?",
  ["Windows Home cannot be joined to Entra ID or used with Autopilot. Upgrade to Pro, Enterprise or Education."],
  ["Autopilot supports only Windows 11 Home when the device is hybrid joined", "The device needs a Windows Server license to join Microsoft Entra ID", "The Intune Connector must be installed on the device"],
  "Windows Home cannot join Microsoft Entra ID and cannot use Autopilot. You need Windows Pro, Enterprise or Education.", L.enrollDevices);

add(D1, G1, "A configuration profile has a setting that works only on supervised iOS devices. Which iPhones receive that setting?",
  ["Devices that enrolled with Automated Device Enrollment (supervised)"],
  ["Devices that enrolled with User Enrollment", "Unenrolled devices that use app protection policies", "Devices that enrolled from the Company Portal app as BYOD"],
  "Supervised-only settings reach only supervised devices, which means ADE or Apple Configurator enrollment. BYOD and User Enrollment devices are not supervised, and unenrolled devices get no device profiles at all.", L.enrollIos);

add(D1, G1, "Which two are true about Intune support for platforms? Each correct answer presents a complete solution.",
  ["Security baselines are available for Windows devices", "Win32 apps can be deployed to Windows devices only"],
  ["Security baselines are available for iOS and Android devices", "Win32 apps can be deployed to macOS devices", "Update rings control iOS software updates"],
  "Security baselines and Win32 apps are Windows features. macOS uses .pkg and .dmg apps, and iOS updates use declarative device management software update policies.", L.esFaq);

/* ---- Group 2: app assignment intents (Domain 4) ---- */
add(D4, G2, "You assign an app to a group with the Required intent. What is the result?",
  ["The app installs automatically on the devices in the group"],
  ["The app appears in Company Portal for the users to choose", "The app is removed from the devices in the group", "The app is installed only when the user opens Company Portal"],
  "Required installs the app on devices in the selected groups without the user choosing. Available for enrolled devices lets users install it from Company Portal. Uninstall removes it.", L.assignGroups);

add(D4, G2, "You assign an app to a user group as Available for enrolled devices. How do users get the app?",
  ["They install it from the Company Portal app or the Company Portal website"],
  ["It installs on their devices at the next check-in", "It installs only after an administrator approves the request", "It installs when the device is wiped and re-enrolled"],
  "Available means the user decides. The app is offered in Company Portal and is installed on demand.", L.assignGroups);

add(D4, G2, "You assign an app as Uninstall to a group. On which devices is the app removed?",
  ["Devices in the group where Intune previously installed the app through a Required or Available assignment"],
  ["Every device in the group that has the app, however it was installed", "Only devices that are not compliant", "Only devices where the user is a local administrator"],
  "Uninstall removes the app only if Intune installed it earlier through an Available for enrolled devices or Required assignment of the same deployment. Intune cannot uninstall apps it did not deploy.", L.assignGroups);

add(D4, G2, "A user is in two groups. Group A has an app assigned as Required. Group B has the same app assigned as Uninstall. What happens?",
  ["The app is installed (Required wins)"],
  ["The app is uninstalled", "The app appears in Company Portal only", "Intune reports an assignment error and does nothing"],
  "When Required and Uninstall conflict through different groups, Required wins. Available and Uninstall together resolve to Uninstall.", L.assignGroups);

add(D4, G2, "A user is in two groups. Group A has an app assigned as Required. Group B has the same app assigned as Available. What is the resulting intent?",
  ["Required and Available"],
  ["Required only", "Available only", "Uninstall"],
  "The merged intent is Required and Available. The app installs and also shows in Company Portal.", L.assignGroups);

add(D4, G2, "You need an app to remove itself from users' devices, but the same group is currently assigned to install the app. What should you do?",
  ["Remove the install assignment for the group, then assign the app as Uninstall"],
  ["Add the Uninstall assignment to the same group and keep Required", "Add an assignment filter that excludes the devices", "Delete and re-add the Company Portal app"],
  "A group assigned to both install and uninstall keeps the app. Remove the install assignment before assigning Uninstall.", ML + 'intune/app-management/deployment/');

add(D4, G2, "Contoso wants an Android app available to users whose phones are not enrolled in Intune. Which assignment type should you use?",
  ["Available with or without enrollment"],
  ["Required", "Uninstall", "Available for enrolled devices"],
  "Available with or without enrollment is for users whose devices are not enrolled. The users must have an Intune license. Required and Uninstall need an enrolled device.", L.assignGroups);

add(D4, G2, "You assign an app as Required to a device group. Which statement about devices that are not enrolled in Intune is true?",
  ["The app does not install, because Required and device targeting need an enrolled device"],
  ["The app installs after the user opens Company Portal", "The app installs but cannot be uninstalled later", "The app installs because Intune sends the app through the web Company Portal"],
  "Required assignments and device-group targeting work only for enrolled devices. Unenrolled devices can only get Available assignments to users.", L.assignGroups);

add(D4, G2, "For which app type can you assign Available to either user groups or device groups?",
  ["Win32 apps"],
  ["Microsoft Store apps", "iOS store apps", "Microsoft 365 Apps"],
  "For most app types and platforms, Available applies only to user groups. Win32 apps are an exception, and so are Android Enterprise fully managed and corporate-owned work profile devices.", L.assignGroups);

add(D4, G2, "Which two statements about app assignment intents are true? Each correct answer presents a complete solution.",
  ["Required and Uninstall assignments need the device to be enrolled in Intune", "Available assignments to unenrolled devices are made to users, not devices"],
  ["Uninstall works on any app on the device, even if Intune did not install it", "Required installs an app on unenrolled devices when the user signs in to Company Portal", "Available assignments can only be made to device groups"],
  "Required and Uninstall need enrollment. For unenrolled devices you assign users with Available with or without enrollment. Uninstall removes only what Intune deployed.", L.assignGroups);

add(D4, G2, "A required app must reach only company-owned PCs for the members of a mixed group. Users also own personal devices that are enrolled. What should you add to the assignment?",
  ["An assignment filter that includes corporate-owned devices"],
  ["An enrollment restriction that blocks personal devices", "A scope tag for company-owned devices", "A second Required assignment for a device group"],
  "Assignment filters narrow an assignment by device properties such as ownership. Enrollment restrictions and scope tags do not change who receives an app.", L.assignGroups);

/* ---- Group 3: where Defender settings live (Domain 3) ---- */
add(D3, G3, "You need to configure Microsoft Defender Antivirus scan schedules and exclusions for all Windows 11 PCs. Where should you configure the settings in the Intune admin center?",
  ["Endpoint security > Antivirus"],
  ["Devices > Compliance", "Apps > App protection policies", "Tenant administration > Connectors and tokens"],
  "Antivirus is an endpoint security policy type. Compliance policies only check state, and app protection is for apps.", L.avPolicy);

add(D3, G3, "You must turn on attack surface reduction rules on Windows 11 PCs. Which type of policy should you create?",
  ["Endpoint security > Attack surface reduction"],
  ["Endpoint security > Disk encryption", "Compliance policy for Windows", "App configuration policy"],
  "ASR rules are in the Attack surface reduction policy. The policy requires Microsoft Defender Antivirus as the primary antivirus.", L.esManage);

add(D3, G3, "You need to onboard Windows devices to Microsoft Defender for Endpoint by using Intune. What should you configure?",
  ["The Defender for Endpoint connection, and an Endpoint detection and response (EDR) policy with the onboarding package"],
  ["An Antivirus policy with the onboarding package", "A compliance policy with the onboarding package", "A Win32 app that runs the onboarding script"],
  "EDR onboarding needs the tenant connection between Intune and Defender for Endpoint, then an EDR policy that carries the onboarding configuration for each platform.", L.edrDeploy);

add(D3, G3, "You want Intune to mark a device noncompliant when its Defender for Endpoint machine risk score is too high. Where do you set the requirement?",
  ["In a compliance policy, under Microsoft Defender for Endpoint"],
  ["In an Antivirus policy under Endpoint security", "In an EDR policy under Endpoint security", "In an app configuration policy"],
  "The machine risk score requirement is a compliance setting that uses the Defender for Endpoint connection. EDR and Antivirus policies configure settings but do not decide compliance.", L.complianceOv);

add(D3, G3, "Real-time protection must be required, and devices that turn it off must lose access to Exchange Online. Real-time protection must also be turned on by Intune. Which two policies should you create? Each correct answer presents part of the solution.",
  ["An Antivirus policy that enables real-time protection", "A compliance policy that requires real-time protection"],
  ["An App protection policy that enables real-time protection", "A Disk encryption policy that requires real-time protection", "An App configuration policy that enables real-time protection"],
  "Use the endpoint security policy to set the setting and a compliance policy to evaluate it and report the result. Conditional Access then blocks access based on that status.", L.esFaq);

add(D3, G3, "Which two platforms support Endpoint security Firewall policies? Each correct answer presents a complete solution.",
  ["Windows", "macOS"],
  ["Linux", "iOS/iPadOS", "Android"],
  "Firewall policies support Windows and macOS. Linux supports Antivirus and EDR, while iOS and Android use compliance and app protection.", ML + 'intune/device-configuration/endpoint-security/firewall');

add(D3, G3, "Devices have Microsoft Defender for Endpoint installed but are not enrolled in Intune. You need to apply Antivirus, ASR and EDR policies to them. What should you use?",
  ["Microsoft Defender for Endpoint security settings management"],
  ["A device configuration profile assigned to the devices", "An app protection policy", "A compliance policy"],
  "Security settings management lets you deliver selected endpoint security policies (Antivirus, ASR and EDR) to Defender-managed devices that are not enrolled in Intune.", L.esManage);

add(D3, G3, "You need BitLocker settings that you manage as a security setting, for Windows devices. In which endpoint security area do you create the policy?",
  ["Disk encryption"],
  ["Antivirus", "Attack surface reduction", "Account protection"],
  "Disk encryption has the BitLocker profile for Windows and FileVault for macOS. Account protection has Windows Hello, LAPS and local group membership.", ML + 'intune/device-configuration/endpoint-security/disk-encryption');

add(D3, G3, "You need to configure Windows LAPS settings. In which endpoint security area do you create the policy?",
  ["Account protection"],
  ["Antivirus", "Endpoint detection and response", "Firewall"],
  "Windows LAPS is a profile in Account protection, along with Local user group membership.", L.esManage);

add(D3, G3, "You need to turn on exploit protection and device control on Windows PCs. In which endpoint security area do you create the policies?",
  ["Attack surface reduction"],
  ["Endpoint detection and response", "Antivirus", "Disk encryption"],
  "Attack surface reduction has the ASR rules, Exploit protection, Device control, and App and browser isolation profiles.", L.esManage);

add(D3, G3, "A technician wants to use the same Microsoft Defender settings in a settings catalog profile that exist in the Antivirus policy. Which statement is true?",
  ["The settings are available in both, but the Endpoint security policy shows only the relevant security settings"],
  ["The settings exist only in the settings catalog profile", "The settings cannot be set in a device configuration profile at all", "The settings exist only in a compliance policy"],
  "Device configuration profiles include the same settings, but endpoint security policies present only the relevant ones and are easier to manage. Avoid setting the same value in both places to prevent conflicts.", L.esFaq);
