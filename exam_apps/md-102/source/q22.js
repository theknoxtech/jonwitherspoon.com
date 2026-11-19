/* ===== Device actions drill (Nov 15). Every fact checked against the Intune device actions pages on Microsoft Learn. ===== */
const N22 = "Device actions: what each one does";
const DA = ML + 'intune/device-management/actions/';

add(D2, N22, "An employee leaves Contoso and keeps a personally owned iPhone that is enrolled in Intune. You must remove company data and the management profile without touching personal photos. Which device action should you run?",
  ["Retire"],
  ["Wipe, with the option to keep personal data", "Delete, because it factory-resets only company apps", "Remove apps and configurations, then wait for it to expire"],
  "Retire removes company data, settings and the management profile and leaves personal data. Wipe is a factory reset.",
  DA + 'retire');
add(D2, N22, "A company-owned Windows laptop was stolen and holds sensitive data. You need to erase it even if the thief cuts the power during the reset. Which setting do you choose?",
  ["Wipe, with the option to continue even if the device loses power"],
  ["Retire, with the option to remove all personal data on the laptop too", "Fresh Start, with the option to retain user data turned off on the laptop", "Autopilot Reset, with the option to overwrite free disk space after sign-in"],
  "The protected wipe option keeps resetting through a power loss and overwrites free space. Learn warns it can leave some devices unable to start, so use it on corporate-owned devices only.",
  DA + 'wipe#how-to-wipe-a-device-from-the-intune-admin-center');
add(D2, N22, "You wipe a Windows 11 PC and select Wipe device, but keep enrollment state and associated user account. What is the result?",
  ["The device resets, MDM policies and settings are removed, and the device stays enrolled"],
  ["The device resets and unenrolls, and the user account is deleted from Entra ID after sign-out", "Only company apps are removed and the personal profile is left unchanged on the PC", "Nothing happens until the user signs in to the PC and approves the reset prompt"],
  "That option preserves user data, accounts and the enrollment, but MDM policies and settings are removed.",
  DA + 'wipe#how-to-wipe-a-device-from-the-intune-admin-center');
add(D2, N22, "You run Delete on an Intune-enrolled Windows 11 device. Which command does Intune actually send to it?",
  ["Retire"],
  ["Wipe, because Delete always factory-resets Windows devices", "Fresh Start with user data retained", "Autopilot Reset"],
  "For Windows, Apple mobile and macOS devices, Delete triggers Retire. The device is hidden from the admin center right away.",
  DA + 'delete');
add(D2, N22, "You run Delete on an Android Enterprise fully managed (COBO) device. Which command does Intune send?",
  ["Wipe"],
  ["Retire, because Delete never resets a device", "Remove apps and configurations", "Nothing, because Delete only removes the Intune record"],
  "For Android, Delete sends Retire for device administrator and personally owned work profile, and Wipe for COBO, COSU, COPE and AOSP.",
  DA + 'delete#delete-action-behavior-by-platform');
add(D2, N22, "A device has three pending actions: Sync, Restart and Retire. What happens?",
  ["Only the Retire runs and the other pending actions are ignored"],
  ["All three run in the order they were sent, with Retire running last of the three", "Sync runs first, then Retire runs, and the Restart is canceled by the service", "Retire is queued behind the others until each of them finishes on the device"],
  "Retire, Wipe and Delete take precedence over every other action. A device with several pending actions carries out only that one.",
  DA);
add(D2, N22, "What are the daily tenant limits for the Wipe, Retire and Delete device actions?",
  ["Wipe 500, Retire 1,000, Delete 1,000"],
  ["Wipe 1,000, Retire 500, Delete 500, per tenant", "Wipe 100, Retire 500, Delete 500, per tenant", "Wipe 500, Retire 500, Delete 100, per tenant"],
  "The limits count every method: single, bulk and Graph requests. A bulk device action handles up to 100 devices at a time.",
  DA + '#daily-tenant-limits');
add(D2, N22, "You need to reset 80 student Android Enterprise tablets at the end of the school year. What is the most efficient approach?",
  ["A bulk device action for Wipe, selecting the 80 devices"],
  ["Run Wipe on each tablet one at a time from the device page", "A bulk device action for Retire on the 80 tablets", "Use Remove apps and configurations on each tablet"],
  "Bulk device actions work on up to 100 devices at once. On Android Enterprise a bulk Wipe keeps the eSIM data plans unless you choose to remove them.",
  DA + '#bulk-device-actions');
add(D2, N22, "A PC shipped with a lot of manufacturer apps. You need to remove them and keep the user signed in with their files. Which action fits?",
  ["Fresh Start, with Retain user data selected"],
  ["Wipe, with the option to continue after a power loss, and then reinstall", "Retire, which removes all apps added by the manufacturer and the user files", "Autopilot Reset, which keeps the user's documents and installed apps"],
  "Fresh Start removes apps such as OEM apps. With Retain user data it keeps the Entra join, re-enrolls the device and preserves the user's Home folder.",
  DA + 'fresh-start');
add(D2, N22, "You run Fresh Start on a BYOD Windows PC and do not select Retain user data on this device. What happens?",
  ["The PC returns to the completed out-of-box state and is removed from Entra ID and MDM"],
  ["The PC stays enrolled in Intune and only the manufacturer apps are removed from it", "The PC reboots into Autopilot and re-enrolls on its own with the same user signed in", "Nothing happens, because Fresh Start works only on corporate-owned devices and not BYOD"],
  "Without retaining user data the device is restored to the OOBE-completed state, keeping the built-in administrator. BYOD devices leave Entra ID and MDM.",
  DA + 'fresh-start#how-to-run-fresh-start-from-the-intune-admin-center');
add(D2, N22, "Which TWO things does a remote Autopilot Reset keep on a Windows device?",
  ["The Microsoft Entra join and Intune enrollment", "Wi-Fi profiles and the region and language settings"],
  ["The previous user's files and the installed apps on the device", "The primary user assignment and the personal settings of that user", "The local administrator account and its password from before the reset"],
  "Autopilot Reset removes user data, settings and apps, and reapplies the original device configuration. It keeps the Entra and Intune enrollment, Wi-Fi profiles, region, language and keyboard.",
  DA + 'autopilot-reset');
add(D2, N22, "Which Intune permission does an admin need to run Autopilot Reset, which sends a RemoteWipe command?",
  ["Remote tasks/Wipe"],
  ["Remote tasks/Autopilot reset", "Remote tasks/Clean PC", "Managed devices/Reset"],
  "Autopilot Reset uses the Wipe permission. Fresh Start uses Remote tasks/Clean PC, and Retire uses Remote tasks/Retire.",
  DA + 'autopilot-reset#prerequisites');
add(D2, N22, "A user reports a lost company iPad that has a passcode. You want to lock it until someone confirms who has it, with a message and phone number on the lock screen. Which action do you use?",
  ["Lost mode, on a supervised device"],
  ["Remote lock, which shows a message and a phone number", "Retire, followed by a Wipe once the device is found", "Reset passcode, with a custom lock screen text"],
  "Lost Mode locks a supervised iOS/iPadOS device and shows a custom message and phone number. The Locate device action can then find it.",
  DA + 'lost-mode');
add(D2, N22, "You run Remote lock on a corporate iPhone that has no passcode set. What is the likely result?",
  ["The screen may turn off, but the user can still open the device"],
  ["The device locks and the user must call the IT help desk to get a code", "The device is wiped at once to protect the company data stored on it", "Intune creates a new passcode and sends it to the user by email message"],
  "Remote lock only works well if a passcode already exists. Enforce a passcode policy before relying on it.",
  DA + 'remote-lock');
add(D2, N22, "You send Remote lock to a Mac. What do you set, and where do you find it afterward?",
  ["A six-digit recovery PIN, shown on the device overview for up to 30 days"],
  ["A four-digit unlock code, which Intune emails to the primary user of the Mac", "A recovery key that Intune stores in Entra ID under the device object of the Mac", "Nothing at all, because Remote lock on macOS needs no PIN to be set by the admin"],
  "The macOS recovery PIN can't be retrieved later. Don't resend Remote lock to the same Mac until the PIN is used, or the new attempts show Failed.",
  DA + 'remote-lock');
add(D2, N22, "Which TWO conditions must be met before you can use Locate device on a Windows PC and on a supervised iPhone?",
  ["Windows: a settings catalog policy sets Let Apps Access Location to Force allow", "iPhone: Lost Mode is enabled"],
  ["Windows: the Company Portal app is installed and the user is signed in to it", "iPhone: the device is enrolled with User Enrollment instead of device enrollment", "Windows: the device is joined to an on-premises Active Directory domain"],
  "Windows needs the Privacy setting Let Apps Access Location set to Force allow. A supervised iOS device needs Lost Mode on before it can be located.",
  DA + 'locate#prerequisites');
add(D2, N22, "How long does Intune store location data returned by a Locate device action?",
  ["24 hours"],
  ["30 days after the action", "7 days after the action", "90 days after the action"],
  "Location data is collected only when you run the action and is deleted automatically after 24 hours. Android dedicated devices can show a last known location for up to 7 days.",
  DA + 'locate#security-and-privacy-information');
add(D2, N22, "You need to troubleshoot a corporate Android device by temporarily removing its Wi-Fi profile and one app, then putting them back. Which action do you use?",
  ["Remove apps and configurations"],
  ["Retire, which restores the items after 24 hours", "Wipe, which reinstalls the assigned items", "Collect diagnostics with the restore option turned on"],
  "The removal is temporary. You can Restore the items yourself, or Intune reapplies them within 8 to 24 hours.",
  DA + 'remove-apps-config');
add(D2, N22, "Which items can the Remove apps and configurations action NOT remove from an iPhone?",
  ["Declarative device management (DDM) based policies"],
  ["Settings catalog profiles that Intune assigned to the iPhone", "Wi-Fi and VPN profiles that Intune delivered to the iPhone", "Apps that Intune delivered to the iPhone from the store"],
  "It supports Intune-delivered apps and many profile types, but DDM-based policies aren't supported. It applies to iOS/iPadOS and Android Enterprise corporate-owned devices.",
  DA + 'remove-apps-config#supported-apps-and-configuration-profiles');
add(D5, N22, "You need to gather logs from a corporate Windows device without interrupting the user. Which action should you run?",
  ["Collect diagnostics"],
  ["Run remediation", "Sync, with the logging option turned on", "Pause Config Refresh"],
  "Collect diagnostics uploads logs to Intune without interrupting the user. You download the zip from Monitor > Device diagnostics.",
  DA + 'collect-diagnostics');
add(D5, N22, "How many Windows devices can you select in one Collect diagnostics bulk action?",
  ["25"],
  ["100", "10", "50"],
  "Collect diagnostics bulk actions cover up to 25 Windows devices. Most other bulk actions allow up to 100.",
  DA + 'collect-diagnostics');
add(D5, N22, "An Autopilot deployment fails on a Windows device. What does Intune do by default about logs?",
  ["It captures diagnostics automatically, one set per day per device"],
  ["Nothing at all, because an admin must run Collect diagnostics first", "It uploads the logs only after the failed device is retired from Intune", "It captures diagnostics on every single reboot until Autopilot finally succeeds"],
  "Automatic capture on Autopilot failure is on by default and can be turned off under Tenant administration > Device diagnostics.",
  DA + 'collect-diagnostics#diagnostics-collection-on-windows-autopilot-failure');
add(D2, N22, "Which TWO actions are available only for Windows devices, not for iOS, macOS or Android?",
  ["Fresh Start", "Autopilot reset"],
  ["Remote lock, which also works on iOS and Android", "Retire, which works on every major platform", "Wipe, which works on every major platform"],
  "Fresh Start, Autopilot reset, BitLocker key rotation, Collect diagnostics and Quick or Full Scan are Windows only. Retire, Wipe and Sync work on every major platform.",
  DA);
add(D2, N22, "Which action rotates the recovery key that protects an encrypted Mac?",
  ["Rotate FileVault recovery key"],
  ["BitLocker key rotation", "Rotate Recovery Lock passcode", "Rotate Local admin password"],
  "FileVault is for Macs and BitLocker for Windows. Recovery Lock passcode is a separate Mac firmware setting. Local admin password rotation is for Windows LAPS.",
  DA);
add(D2, N22, "A security alert says a Windows PC might have malware. You want Defender Antivirus to check everything, remotely. Which action do you run?",
  ["Full Scan"],
  ["Quick Scan", "Update Windows Defender security intelligence", "Run remediation"],
  "Full Scan and Quick Scan start Defender Antivirus scans. The intelligence update refreshes signatures only. Remediations run scripts.",
  DA);
add(D2, N22, "A Shared iPad has a student account that needs signing out, and the cached user data must be cleared. Which TWO actions apply?",
  ["Logout current user", "Remove user"],
  ["Retire, which removes the iPad from management", "Remove passcode, which clears the iPad lock", "Lost mode, which locks the iPad with a message"],
  "Logout current user and Remove user apply to Shared iPad. Remove user deletes a user from the cache of the Shared iPad.",
  DA);
add(D2, N22, "An iPhone enrolled by a device enrollment manager account is locked with Activation Lock. Which action clears it?",
  ["Disable Activation Lock"],
  ["Wipe, which factory-resets the iPhone", "Remove passcode, which clears the lock code", "Retire, which removes the management profile"],
  "Disable Activation Lock removes the lock on iOS/iPadOS and macOS devices enrolled with a DEM account.",
  DA + 'disable-activation-lock');
add(D2, N22, "A user forgot the passcode on a corporate-owned Android device and the iPhone of another user. Which action do you use on each?",
  ["Android: Reset passcode; iPhone: Remove passcode"],
  ["Android: Remove passcode; iPhone: Reset passcode", "Android: Remote lock; iPhone: Remote lock", "Android: Wipe; iPhone: Retire"],
  "The names follow the platform: Android uses Reset passcode and iOS/iPadOS uses Remove passcode. In the Company Portal, users see Reset Passcode for both.",
  DA);
add(D2, N22, "A user wants to remove their own personally owned device from Intune from the Company Portal. Which action do they choose?",
  ["Remove, which runs a Retire"],
  ["Reset, which runs a Retire", "Check Status, which removes company data", "Factory Reset, which runs a Retire"],
  "In the Company Portal, Retire shows as Remove and Wipe shows as Reset or Factory Reset. Only the device's primary user can run these self-service actions.",
  ML + 'intune/app-management/configuration/configure-company-portal#user-self-service-device-actions-from-the-company-portal');
add(D2, N22, "You wipe a Zebra Android device. Does it factory reset?",
  ["No, the Wipe action removes only corporate data on Zebra devices"],
  ["Yes, it factory resets the same as every other Android Enterprise device", "Yes, but only if Factory Reset Protection is turned off on the device", "No, it doesn't remove anything at all until the device is retired first"],
  "To factory reset a Zebra device, use Zebra StageNow or an OEMConfig data wipe configuration.",
  DA + 'wipe#zebra-devices');
add(D2, N22, "You wipe an iPhone that has an eSIM data plan. What happens to the plan by default?",
  ["The cellular data plan is preserved"],
  ["The data plan is removed with the other data", "The data plan is moved to the primary user's account", "The wipe fails until the eSIM is deleted"],
  "For iOS/iPadOS eSIM devices and for Android Enterprise corporate-owned devices, the data plan stays unless you choose to remove it.",
  DA + 'wipe');
add(D2, N22, "You retire an enrolled iPhone that has Outlook with company mail, protected by an app protection policy. What happens to the Outlook data?",
  ["A selective wipe removes the work account data the next time the app opens"],
  ["Nothing happens, because Retire doesn't touch apps that came from the App Store", "The Outlook app is uninstalled and all of the personal mail is deleted with it", "The data is removed immediately from the iPhone even if the app stays closed"],
  "Retire removes company apps and triggers a selective wipe for apps with an app protection policy, provided an app protection check-in happened. Personal app data stays.",
  DA + 'retire#user-experience');
add(D2, N22, "After you retire a Windows device, which record is NOT removed automatically, and you may need to delete it yourself?",
  ["The device record in Microsoft Entra ID"],
  ["The device record in Intune, which is deleted on retire", "The company apps installed by Intune, which are removed on retire", "The Intune management enrollment, which ends on retire"],
  "Retire removes the Intune management, but the Entra record stays. Delete it under Entra ID > Devices. Also deregister Autopilot devices if you want them gone.",
  DA + 'retire');
add(D2, N22, "Which action sends a message that the user reads in the Company Portal app?",
  ["Send custom notification"],
  ["Remote lock with a message", "Lost mode, with the message left blank", "Sync"],
  "Send custom notification is available for iOS/iPadOS and Android and is also a bulk action for Apple mobile devices.",
  DA + 'send-custom-notification');
add(D2, N22, "Which TWO of these are available as bulk device actions for Windows?",
  ["Autopilot reset", "Collect diagnostics"],
  ["Fresh Start, which is a single-device action only", "Locate device, which is a single-device action only", "Remote lock, which is a single-device action only"],
  "Windows bulk actions are Autopilot reset, Collect diagnostics, Delete, Rename, Restart, Retire, Sync and Wipe.",
  DA + '#bulk-device-actions');
add(D2, N22, "A device action such as Wipe or Delete needs a second administrator's approval before it runs. What controls that?",
  ["A Multi Admin Approval access policy"],
  ["The Remote tasks/Wipe permission alone", "A device compliance policy with an action for noncompliance", "An enrollment restriction"],
  "These actions might be governed by an Intune access policy that requires multiple administrative approvals.",
  DA + 'wipe');

/* ===== App protection: Target policy to (Nov 15). Source: Learn create-policy and data-protection-framework pages. ===== */
const N22b = "App protection: Target policy to";
const CP = ML + 'intune/app-management/protection/create-policy#app-protection-policies-for-ios-ipados-and-android-apps';
add(D4, N22b, "You create an app protection policy and set Target policy to to All Apps. Which apps does it include?",
  ["All Microsoft and partner apps that have integrated the Intune SDK"],
  ["Every app installed on the device, including apps that never integrated the Intune SDK", "Only the apps that Intune installed on an enrolled device", "Only the Microsoft apps in the Core Microsoft Apps list for the policy"],
  "All Apps means Microsoft and partner apps that integrate the Intune SDK. An app without the SDK cannot receive the policy.", CP);
add(D4, N22b, "In an app protection policy, what is the difference between All Microsoft Apps and Core Microsoft Apps?",
  ["All Microsoft Apps covers every Microsoft app with the Intune SDK; Core is a fixed shorter list"],
  ["Core Microsoft Apps also includes partner apps, while All Microsoft Apps covers only Microsoft ones", "All Microsoft Apps applies to enrolled devices only, while Core Microsoft Apps applies to all devices", "There is no difference, because both options target the same group of apps in the policy"],
  "Learn lists the dropdown as All Apps, Microsoft Apps (shown as All Microsoft Apps in the portal) and Core Microsoft Apps.", CP);
add(D4, N22b, "Which apps are in the Core Microsoft Apps group?",
  ["Edge, Excel, Office, OneDrive, OneNote, Outlook, PowerPoint, SharePoint, Teams, To Do and Word"],
  ["Edge, Excel, Outlook, PowerPoint, Teams and Word only, plus Company Portal, Authenticator and Intune", "Every Microsoft app that integrates the Intune SDK, including Visio, Power BI and Planner apps", "Outlook, Teams and OneDrive only, because those are the only apps that hold company data"],
  "The data protection framework targets Core Microsoft Apps in every policy, so the list matters for the exam.",
  ML + 'intune/app-management/protection/data-protection-framework#apps-to-include-in-the-app-protection-policies');
add(D4, N22b, "You want an app protection policy for a line-of-business app that was wrapped with the Intune App Wrapping Tool. What do you do?",
  ["Set Target policy to Selected apps and add the app under Custom apps by bundle ID"],
  ["Set Target policy to All Apps, then add the custom app to the same policy by bundle ID", "Set Target policy to Core Microsoft Apps and upload the wrapped app package to it", "Create a device compliance policy, because custom apps cannot use app protection policies"],
  "Custom apps need Selected apps. You cannot add a custom app while targeting All Apps, Microsoft Apps or Core Microsoft Apps in the same policy.", CP);
