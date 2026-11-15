/* ===== DOMAIN 4: Manage and secure applications ===== */
const T41 = 'App protection (MAM)', T42 = 'App deployment', T43 = 'App configuration and Microsoft 365 apps', T44 = 'Tunnel and Quiet Time';

add(D4, T41, "Employees use personal iPhones that are NOT enrolled. You must stop copy and paste from Outlook into personal apps. What do you create?",
  ["An app protection policy for iOS/iPadOS targeted at the users"],
  ["A device compliance policy for iOS", "A device restrictions configuration profile", "An enrollment restriction for iOS"],
  "App protection policies work without device enrollment (MAM-WE) and control data transfer, cut/copy/paste, PIN and more inside managed apps.", L.mamCreate);

add(D4, T41, "A user has the Outlook app protection policy applied. Which setting stops them from saving company files to a personal OneDrive?",
  ["Save copies of org data: Block"],
  ["Receive data from other apps: All apps", "Restrict web content transfer: Any app", "Sync policy managed app data with native apps: Allow"],
  "Under Data protection, 'Save copies of org data' controls where files can be saved. Blocking it leaves only approved locations such as the organization's OneDrive and SharePoint.", L.mamAndroid);

add(D4, T41, "App protection requires the user to enter a PIN. How many minutes of inactivity before PIN re-prompt is set by the policy option?",
  ["Recheck the access requirements after (minutes of inactivity)"],
  ["Offline grace period", "Maximum PIN attempts", "Timeout for compliance"],
  "The 'Recheck the access requirements after' setting controls the inactivity window before the PIN (or biometrics) is requested again.", L.mamAndroid);

add(D4, T41, "A device is offline for a long time. Which app protection setting wipes company data from a managed app after the device has been offline for too long?",
  ["Offline grace period: Wipe data after (days)"],
  ["Block screen capture", "Recheck the access requirements after", "Disable app PIN when device PIN is set"],
  "The offline grace period has two parts: block access after a number of minutes, and wipe data after a number of days offline.", L.mamAndroid);

add(D4, T41, "A partner needs MAM-only access on their personal Android phone, with no device enrollment, for Outlook. Which Conditional Access grant should enforce this?",
  ["Require app protection policy"],
  ["Require device to be marked as compliant", "Require Hybrid Microsoft Entra joined device", "Require password change"],
  "'Require app protection policy' ensures the app is a managed app with an assigned policy. The compliant device grant would fail on unenrolled phones.", L.appCA);

add(D4, T42, "Win32 apps should be installed by Intune without user interaction, and installer detection must work. What do you upload and define?",
  ["An .intunewin package with detection rules"],
  ["An .msi with a PowerShell script only", "An .appx with no detection", "A .zip file of the installer"],
  "Win32 apps are wrapped with the Win32 Content Prep Tool into .intunewin. Detection rules tell Intune whether the app is installed already.", L.win32);

add(D4, T42, "App B must replace App A (the old version) on devices. What Win32 feature handles this?",
  ["Supersedence, with the uninstall previous version option"],
  ["Dependencies", "Requirement rules", "Return codes"],
  "Supersedence lets a new app replace another and optionally uninstall it. Dependencies are for apps that must be installed before another one.", L.win32Super);

add(D4, T42, "An app must install on Windows 11 devices only if free disk space is above 2 GB. Where do you set this?",
  ["In the Win32 app's requirement rules"],
  ["In the detection rules", "In the return codes", "In a compliance policy"],
  "Requirement rules gate whether the app is applicable to a device (disk space, RAM, OS, a custom script). Detection rules decide if it is already installed.", L.win32);

add(D4, T42, "Where does the Intune management extension log Win32 app installs on the client?",
  ["C:\\ProgramData\\Microsoft\\IntuneManagementExtension\\Logs"],
  ["C:\\Windows\\System32\\Winevt\\Logs", "C:\\Users\\Public\\Intune", "C:\\Windows\\Temp\\IME"],
  "The IME logs, such as IntuneManagementExtension.log and AppWorkload.log, sit in the ProgramData IntuneManagementExtension Logs folder.", L.ime);

add(D4, T42, "You assign an app to a user group with the Available intent. How does the user get it?",
  ["Manually from the Company Portal"],
  ["Automatically at the next sync", "During the Enrollment Status Page", "Only when the device is retired"],
  "Available apps appear in the Company Portal for the user to install. Required installs automatically. Uninstall removes the app.", L.win32);

add(D4, T43, "You want to configure Outlook for iOS with the user's email address automatically, on devices that are not enrolled. Which policy type?",
  ["An app configuration policy for managed apps"],
  ["A device configuration profile for iOS", "An app protection policy", "A compliance policy"],
  "App configuration policies for managed apps (targeted apps) deliver key/value settings to apps without needing device enrollment.", L.appConfig);

add(D4, T43, "Which Intune policy type controls Microsoft 365 Apps settings such as macro blocking and update channel through the cloud, mapped to ADMX policies?",
  ["Microsoft 365 Apps policies (the Cloud Policy service in the Microsoft 365 Apps admin center)"],
  ["Windows Update for Business ring", "A custom OMA-URI profile for Office", "Security baseline for Edge"],
  "The Microsoft 365 Apps admin center Cloud Policy applies Office ADMX-style settings to users signed in on any device, enrolled or not.", L.m365Pol);

add(D4, T43, "Edge for Business must open internal sites via an approved list and block saving passwords. Where is it configured?",
  ["The Settings catalog Microsoft Edge category, or the Edge security baseline"],
  ["Windows Update for Business reports", "BitLocker policy", "Enrollment restrictions"],
  "Edge policies are in the settings catalog (Microsoft Edge). Edge also has a security baseline for hardening.", L.baselines);

add(D4, T44, "Remote users on unmanaged Android phones need Microsoft Tunnel access to on-premises sites from Edge only, without enrolling the device. What do you use?",
  ["Tunnel for Mobile Application Management"],
  ["Per-app VPN profile on enrolled devices only", "A device-wide VPN profile", "Always On VPN for Windows"],
  "Tunnel for MAM provides per-app VPN access for managed apps on unenrolled iOS and Android devices, using Microsoft Tunnel Gateway and an app protection policy.", L.tunnelMam);

add(D4, T44, "For Tunnel for MAM on Android, which app contains the tunnel client that Edge uses?",
  ["Microsoft Defender"],
  ["Microsoft Authenticator", "Microsoft Tunnel Gateway app", "Company Portal"],
  "On Android, the tunnel client is part of the Microsoft Defender app, which is configured by its own app configuration policy. Company Portal (no sign-in needed) and Edge must also be installed. On iOS, no Defender or Company Portal is needed because the Tunnel for MAM SDK is built into the app.", L.tunnelMamAndroid);

add(D4, T44, "You want managed apps to stop sending notifications to employees overnight and on weekends. Which feature is built for this?",
  ["Quiet Time in an Intune app configuration policy"],
  ["Do Not Disturb in a compliance policy", "A device restrictions notification setting", "A Teams presence policy"],
  "Quiet Time sets time windows where managed mobile apps (like Outlook and Teams) mute notifications. It is configured in an app configuration policy.", L.quiet);
