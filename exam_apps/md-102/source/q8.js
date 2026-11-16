/* ===== Enrollment limits, app and update scenarios, and outline gaps ===== */
/* Re-tag to match the Oct 27, 2026 outline: Intune Suite add-ons sit in Domain 2, device updates in Domain 3 */
[67, 68, 69, 70, 85, 86].forEach(i => { const q = Q.find(x => x.id === i); q.d = 2; q.t = 'Intune Suite add-ons'; });
[42, 43, 44, 45].forEach(i => { Q.find(x => x.id === i).d = 3; });
Q.filter(q => q.t === 'Updates and hotpatch').forEach(q => { q.t = 'Device updates'; });
Q.find(x => x.id === 71).t = 'Endpoint security and App Control';
Object.assign(L, {
  dem: 'https://learn.microsoft.com/mem/intune/enrollment/device-enrollment-manager-enroll',
  apReset: ML + 'autopilot/windows-autopilot-reset',
  advAnalytics: ML + 'intune/advanced-analytics/',
  cloudPolicy: ML + 'microsoft-365-apps/admin-center/overview-cloud-policy',
  m365Admin: ML + 'microsoft-365-apps/admin-center/overview',
  androidStore: ML + 'intune/app-management/deployment/add-android-store',
  assignApps: ML + 'intune/app-management/deployment/assign',
  macUpd: ML + 'intune/device-updates/apple/software-updates-macos',
  iosUpd: ML + 'intune/device-updates/apple/software-updates-ios-ipados',
  eac: ML + 'intune/app-management/deployment/enterprise-app-catalog-apps',
  checkin: ML + 'intune/device-management/inventory-and-status/device-sync-refresh',
  delivery: ML + 'intune/device-updates/windows/delivery-optimization',
  fota: ML + 'intune/device-updates/android/android-fota-deployments',
  oemconfig: ML + 'intune/device-configuration/oemconfig',
  ent: ML + 'intune/device-enrollment/setup-time-grouping',
  vpp: ML + 'intune/app-management/deployment/apple-business-manager-apps',
  mgp: ML + 'intune/app-management/deployment/add-managed-google-play',
  customCompl: ML + 'intune/device-security/compliance/custom-settings',
  graphIntune: ML + 'graph/api/resources/intune-graph-overview',
  logAn: ML + 'intune/device-management/monitoring/review-logs-using-azure-monitor',
  svcHealth: ML + 'intune/device-management/monitoring/tenant-status',
  trouble: ML + 'intune/device-management/tools/troubleshoot-device',
  enrollFail: ML + 'intune/device-enrollment/monitor/troubleshoot-windows-enrollment-errors',
  fw: ML + 'intune/device-security/endpoint-security/firewall-policy',
  asr: ML + 'intune/device-security/endpoint-security/attack-surface-reduction-policy',
  av: ML + 'intune/device-security/endpoint-security/antivirus-policy',
  w365Image: ML + 'windows-365/enterprise/device-images',
  apName: ML + 'autopilot/profiles',
  update11: ML + 'intune/device-updates/windows/feature-updates',
  mamCP: ML + 'intune/app-management/protection/ref-settings-android',
  ios: ML + 'intune/device-configuration/supervised-mode'
});
const T8a = 'Enrollment roles and limits', T8b = 'Outline gaps';

/* ---- Scenario questions ---- */
add(D1, T8a, "A seasonal team will enroll 400 company-owned Windows laptops for temporary workers. The enrolling account must have the fewest permissions needed. Which option fits?",
  ["Add the account as a Device Enrollment Manager"],
  ["Raise the device limit restriction for that account to 400 devices", "Assign the Intune Administrator role in the Entra admin center", "Assign the Help Desk Operator role with a scope tag for the team"],
  "A Device Enrollment Manager is a non-administrator account that can enroll up to 1,000 devices. A standard user is capped by the device limit restriction (1 to 15), and administrator roles grant far more than enrollment.", L.dem);
add(D1, T8a, "A Device Enrollment Manager (DEM) account enrolls devices for a team. How many devices can one DEM account enroll?",
  ["Up to 1,000"],
  ["Up to 15, the same as any user", "Up to 100 per day", "No limit"],
  "A DEM can enroll up to 1,000 devices. A DEM can't use the Company Portal self-service for users and isn't an administrator role. Standard users are capped by the device limit restriction (1 to 15).", L.dem);
add(D1, T15, "Conditional Access must require compliant devices, but a pilot user's new Windows PC is not managed by Intune. What must happen before compliance can be evaluated?",
  ["Enroll the device in Intune"],
  ["Assign a security baseline profile to the user", "Add the device to an Autopilot group", "Create a Conditional Access report-only policy"],
  "Compliance is reported by Intune. A device that isn't enrolled has no compliance state, so the grant control can't be satisfied. Baselines and CA policy modes do not create a state.", L.caGrant);
add(D1, T15, "Users may open Microsoft 365 only from Windows devices that have BitLocker turned on. What do you create first?",
  ["A device compliance policy that requires BitLocker"],
  ["A device configuration profile that enables BitLocker", "A Conditional Access policy that blocks all Windows devices", "An app protection policy for Windows with encryption on"],
  "Compliance policies evaluate a device against a requirement, and then Conditional Access uses the result. A configuration profile can turn BitLocker on, but it does not mark a device compliant or not.", ML + 'intune/device-security/compliance/overview');
add(D2, T21, "You run an Autopilot Reset on a Windows 11 device. Which two items are kept afterwards? (Select two)",
  ["The Wi-Fi connection details", "The Microsoft Entra join and Intune enrollment"],
  ["Personal files saved by the user", "Apps the user installed themselves", "The user's custom region and keyboard changes"],
  "Autopilot Reset removes personal files, user-installed apps and customized settings. It keeps the Entra join, the MDM enrollment and Wi-Fi connection details so the PC returns to a business-ready state.", L.apReset);
add(D2, T24, "You must create a new FileVault and firewall policy for macOS devices. The macOS Endpoint protection template is deprecated. What should you use instead?",
  ["The settings catalog, or the endpoint security Disk encryption and Firewall policies"],
  ["A new macOS Endpoint protection template profile", "A custom OMA-URI profile", "An iOS/iPadOS device restrictions profile"],
  "Existing macOS Endpoint protection policies keep working, but you can't create new ones. Use the settings catalog (FileVault, Firewall, Gatekeeper payloads) or the endpoint security Disk encryption and Firewall policies. The template is still available for Windows 10 and later.", ML+'intune/device-configuration/endpoint-security/configure-endpoint-protection');
add(D2, T8b, "Intune Advanced Analytics is licensed, but a Windows device shows none of the extra reports. Which requirement must the device meet?",
  ["It is enrolled in Intune and onboarded to endpoint analytics"],
  ["It runs Windows 10 Home with the Company Portal installed", "It is Android Enterprise with a work profile", "It has Defender for Endpoint as its only management channel"],
  "Advanced Analytics needs a license on top of Intune Plan 1 or 2, plus the endpoint analytics prerequisites. Windows devices must be enrolled in Intune and onboarded to endpoint analytics. Some features, such as device query for multiple devices, need extra policy. It can take up to 48 hours after purchase before features appear.", L.advAnalytics);
add(D2, T44, "Unenrolled iPhones must reach an on-premises HTTPS API from a line-of-business app through Microsoft Tunnel. Which policy configures the tunnel for that app?",
  ["An app configuration policy for managed apps"],
  ["An iOS/iPadOS VPN device configuration profile", "A Conditional Access policy that requires a VPN", "An iOS/iPadOS device compliance policy"],
  "Tunnel for MAM is configured through an app configuration policy for managed apps, together with an app protection policy. A VPN device profile needs an enrolled device.", L.tunnelMam);
add(D2, T27, "A critical threat requires Windows devices to download the newest antivirus signatures right now. Which remote action do you run?",
  ["Update Windows Defender security intelligence"],
  ["Sync", "Restart", "Rotate BitLocker recovery keys"],
  "The Update Windows Defender security intelligence device action forces the signature update. Sync only checks in for policy, and the other actions are unrelated.", L.actions);
add(D4, T43, "A user is in two Microsoft Entra groups that have conflicting Cloud Policy service configurations for Microsoft 365 Apps. Which configuration wins?",
  ["The one with the higher priority (0 is the highest)"],
  ["The one that was created first", "The one with the most settings configured", "Neither. Both are ignored until the conflict is removed"],
  "When a user is in several groups with conflicting settings, Cloud Policy uses priority. 0 is the highest priority, and you reorder it on the Policy configurations page. Cloud Policy settings also take precedence over Group Policy for the Microsoft 365 Apps.", L.cloudPolicy);
add(D4, T42, "Windows 11 devices need Microsoft 365 Apps with Visio included. Which is a valid way to get Visio into the deployment?",
  ["Choose Visio in the Microsoft 365 Apps deployment, or build a custom configuration in the Microsoft 365 Apps admin center"],
  ["Create an app configuration policy and enable the Visio checkbox", "Assign a Visio license to the admin who creates the app", "Create a device configuration profile that lists the products"],
  "The product list is part of the installation package. Intune's Microsoft 365 Apps app suite settings can add Visio, and the Microsoft 365 Apps admin center builds a custom configuration. App configuration policies tune settings in an app and do not change what is installed.", L.m365Admin);
add(D4, T42, "You add an Android store app (not a Managed Google Play app) to Intune and have entered its name and details. What do you enter next?",
  ["The app store URL"],
  ["The APK package", "A VPP token", "A Win32 detection rule"],
  "For an Android store app, Intune needs the public store URL so it can send users to the listing. No APK is uploaded. Private apps for Android Enterprise are published through Managed Google Play.", L.androidStore);
add(D4, T42, "A user belongs to Group A, where an app is Available, and Group B, where the same app is Required. What happens on the user's device?",
  ["The app installs automatically and also shows in the Company Portal (resulting intent Required and Available)"],
  ["The app only shows in the Company Portal as Available", "Intune shows a conflict error and installs nothing", "The app installs only if the user selects it in the Company Portal"],
  "When a user or device gets both Required and Available through different groups, Intune merges them into Required and Available: the app is installed and also listed in the Company Portal. A single group can't be given two intents. Required beats Uninstall, and Available loses to Uninstall for user-targeted assignments.", L.assignApps);
add(D4, T41, "Employees use personal Android phones that are not enrolled. Copying data from Outlook to other apps must be blocked. What must be on the phone for the app protection policy to apply?",
  ["The Company Portal app, together with the managed Microsoft app"],
  ["A device compliance policy and the Intune enrollment profile", "An Android Enterprise work profile created by the admin", "The Microsoft Tunnel Gateway app"],
  "Android app protection policies are enforced through the Company Portal on the device, with no enrollment needed. It doesn't create a work profile.", L.mamCP);
add(D3, T25, "Windows 10 devices must move to Windows 11, and users may postpone the update for at most two weeks. Which policy lets you defer feature updates for a set number of days?",
  ["An update ring with a feature update deferral period"],
  ["A quality update policy with an expedite release", "A device configuration profile with a custom OMA-URI", "A compliance policy that checks the Windows build"],
  "Update rings expose the quality deferral (0 to 30 days) and feature deferral (0 to 365 days). A feature update policy can set the target version, but the ring controls when devices install it.", L.update11);
add(D3, T25, "macOS 15.1 devices must run macOS 15.4 by 6:00 PM local time on March 1. Which approach enforces this?",
  ["A settings catalog profile that uses declarative device management software update, with target version and local date and time"],
  ["A Sync device action sent on March 1 at 6:00 PM", "A Win32 app that runs softwareupdate through a script", "A compliance policy with a minimum OS version of 15.4"],
  "Software update enforcement for macOS uses a DDM Software Update setting in the settings catalog with a target OS version and a local time. Compliance reports state only and does not install.", L.macUpd);

/* ---- Outline gaps ---- */
add(D1, T12, "Zero-touch enrollment for Android Enterprise is registered by a reseller. Which service pushes the device to Intune at first boot?",
  ["Google zero-touch enrollment, with an Intune DPC configuration"],
  ["Apple Business Manager with an ADE token", "Windows Autopilot with a hardware hash", "Android device administrator through the Company Portal"],
  "Zero-touch enrollment (Google) and Samsung Knox Mobile Enrollment auto-enroll corporate Android devices. ABM and Autopilot cover Apple and Windows.", L.restr);
add(D1, T12, "Which three methods can enroll a corporate Android Enterprise fully managed device? (Select three)",
  ["QR code", "Token (afw#setup)", "Google zero-touch enrollment"],
  ["Company Portal sign-in on an unmanaged phone", "Apple Configurator", "Windows Autopilot self-deploying mode"],
  "Fully managed devices enroll at setup with a QR code, NFC, token or zero-touch. A normal Company Portal sign-in creates a work profile and not a fully managed device.", L.restr);
add(D1, T12, "You want group-based policies and apps to apply on the first sync after enrollment, with no wait for a dynamic group to calculate. What feature does this?",
  ["Enrollment time grouping in the enrollment profile"],
  ["A dynamic device group with a membership rule", "A scope tag on the enrollment profile", "A device limit restriction"],
  "Enrollment time grouping adds the device to a static security group when it enrolls, so assignments reach it at once.", L.ent);
add(D1, T12, "A personal iPhone needs work apps, and IT must see only managed apps. Which Apple method keeps personal and work data cryptographically separate?",
  ["User Enrollment"],
  ["Device enrollment with supervision", "Automated Device Enrollment", "Apple Configurator enrollment"],
  "User Enrollment gives IT control over a separate managed partition only. Supervised modes are for corporate devices.", L.restr);
add(D1, T15, "A help desk group needs to be a member of the local Administrators group on Entra joined PCs, and other members must not be removed by mistake. Which policy setting controls that?",
  ["Local user group membership with the Add (Update) action"],
  ["Local user group membership with the Replace action", "A compliance policy for the Administrators group", "A Win32 app that runs net localgroup"],
  "Add (Update) keeps existing members, while Replace removes every other member. Choose carefully.", L.rbac);
add(D2, T21, "Autopilot names should look like CORP-<serial> for Entra joined PCs. Where do you set that?",
  ["In the Autopilot deployment profile, using a device name template"],
  ["In a compliance policy for Windows", "In the Entra admin center under device settings", "In the Enrollment Status Page profile"],
  "The deployment profile supports a name template with %SERIAL% and %RAND:x% tokens, 15 characters or fewer. It works for Entra join and not for hybrid join (the domain join profile handles that).", L.apName);
add(D2, T21, "A PC needs Microsoft 365 Apps installed during Autopilot before the user reaches the desktop. How do you make sure the install finishes first?",
  ["Assign the app as Required and track it in the Enrollment Status Page"],
  ["Assign the app as Available in the Company Portal", "Create an app protection policy for Office apps", "Wait for the first compliance evaluation"],
  "Only Required apps in the tracked list can block the desktop through the ESP. Available apps wait for the user.", L.esp);
add(D2, T21, "A new Windows 11 PC must be wiped but keep its Intune enrollment state and user account. Which option do you pick?",
  ["Wipe with 'Retain enrollment state and user account'"],
  ["Retire", "Delete", "Fresh Start"],
  "Wipe offers an option to retain the enrollment state and user account. Retire and Delete remove management. Fresh Start reinstalls Windows and removes OEM apps.", L.actions);
add(D2, T21, "A PC has OEM-installed apps you do not want. You want a clean Windows install that keeps the user data and management. Which action fits?",
  ["Fresh Start"],
  ["Autopilot Reset", "Retire", "Wipe with 'Retain enrollment state'"],
  "Fresh Start removes OEM apps from Windows 10 and 11 and keeps the user data, depending on the option you pick. It is not an Autopilot Reset.", L.actions);
add(D2, T26, "You want custom images for Windows 365 Cloud PCs. Where is the image stored for use in a provisioning policy?",
  ["An Azure compute gallery image version in your subscription"],
  ["A OneDrive library shared with the Cloud PC group", "An Intune Win32 app package in the tenant", "An Autopilot deployment profile in the tenant"],
  "Provisioning policies can use gallery images from Microsoft or a custom image from your own Azure compute gallery.", L.w365Image);
add(D2, T24, "Zebra handhelds need vendor-specific settings that Intune does not expose natively. What do you use?",
  ["An OEMConfig profile with the Zebra OEMConfig app"],
  ["A Windows custom OMA-URI profile", "A compliance policy with a custom script", "An iOS restrictions profile"],
  "OEMConfig lets OEMs expose their own settings through a managed app in Managed Google Play. The profile pushes the configuration to the device.", L.oemconfig);
add(D2, T24, "On supervised iPhones you need to turn on a setting that works only for supervised devices. Which enrollment gives you supervised devices without touching them one by one?",
  ["Automated Device Enrollment from Apple Business Manager"],
  ["User Enrollment", "Company Portal self-enrollment", "A Conditional Access policy"],
  "Supervision comes from ADE (or Apple Configurator). Settings marked supervised-only do not apply to User Enrollment or Company Portal enrolled devices.", L.ios);
add(D2, T24, "Which group of settings are collectively assigned to a Teams Rooms or kiosk Windows device by profile, with sign-in locked to a device account? (choose the platform to target)",
  ["Windows 10 and later, assigned to a device group"],
  ["macOS, assigned to a user group", "iOS/iPadOS, assigned to a user group", "Android Enterprise, assigned to a user group"],
  "Shared Windows devices such as Teams Rooms are configured with Windows device profiles and assigned to device groups, since no user signs in.", L.gpaMigrate);
add(D2, T25, "How often does a managed device check in with Intune by default once it has settled after enrollment?",
  ["About every 8 hours"],
  ["Every 30 seconds", "Every 24 hours", "Only when the user restarts"],
  "Devices check in about every 8 hours. Right after enrollment the check-ins are more frequent. A Sync action forces a check-in sooner.", L.checkin);
add(D2, T8b, "Which devices can install apps from the Enterprise App Catalog?",
  ["Windows devices only"],
  ["Windows, macOS, and iOS devices", "iOS and Android devices only", "Windows and Android devices only"],
  "The Enterprise App Catalog provides prepackaged Win32 apps for Windows, with install commands and detection rules supplied. It is part of the Intune Suite.", L.eac);
add(D2, T8b, "An app from the Enterprise App Catalog is added to Intune. Which pieces are filled in automatically?",
  ["Install and uninstall commands, detection rules and requirements"],
  ["Assignments to your user groups", "Scope tags for each administrator", "The Company Portal category and the icon only"],
  "The catalog supplies the package details. You still choose the assignments and any scope tags.", L.eac);
add(D2, T27, "Which action rotates the managed local administrator password immediately for a device that uses Windows LAPS?",
  ["Rotate local admin password from the device's page"],
  ["Sync", "Fresh Start", "Rotate BitLocker recovery keys"],
  "The Rotate local admin password remote action asks the device to generate and escrow a new password. It needs the remote task permission.", L.laps);
add(D2, T27, "A user reports a sign-in problem and you want to see their devices, enrollment and assigned apps from one place. Which area helps?",
  ["Troubleshooting + support, user-based diagnostics"],
  ["Endpoint analytics startup performance", "The Autopilot devices list", "Tenant administration connectors"],
  "The Troubleshooting + support page lets you pick a user and see their devices, assignments and failures in one view.", L.trouble);
add(D3, T32, "You are creating firewall rules for Windows devices in Intune. Where do you configure them?",
  ["Endpoint security > Firewall, using the Microsoft Defender Firewall Rules profile"],
  ["Devices > Compliance, using a firewall requirement", "Apps > App protection, using a network rule", "Tenant administration > Connectors and tokens"],
  "Firewall policies live under Endpoint security. One profile sets firewall behavior by network profile, and another creates rules.", L.fw);
add(D3, T32, "You want to test attack surface reduction rules without blocking users first. What mode do you set?",
  ["Audit mode"],
  ["Block mode", "Disabled mode", "Warn mode only on servers"],
  "Audit logs what a rule would have blocked, so you can tune exclusions before moving to Block or Warn.", L.asr);
add(D3, T32, "You must add an exclusion for a line-of-business tool in Microsoft Defender Antivirus on managed Windows PCs. Where do you configure it?",
  ["Endpoint security > Antivirus, with a Microsoft Defender Antivirus exclusions profile"],
  ["Devices > Configuration, with a custom OMA-URI profile only", "Apps > Windows apps, in the app's detection rules", "Tenant administration > Roles, in the custom role"],
  "The Antivirus node has dedicated profiles for exclusions and settings. Conflicts with other profiles are reported per setting.", L.av);
add(D3, T33, "A user is locked out of BitLocker and you want them to find their own recovery key. Where can they get it?",
  ["The Company Portal website, from their device's page"],
  ["Windows Update in Settings", "The Intune Autopilot devices list", "A scope tag in the Entra admin center"],
  "Users can retrieve a key in the Company Portal when self-service recovery isn't blocked in Entra device settings.", L.recoveryKey);
add(D3, T33, "Which Intune report shows whether BitLocker is on across the PCs and whether a key is stored?",
  ["The Encryption report under Endpoint security > Disk encryption"],
  ["The Windows Update ring report", "The App install status report", "The Autopatch groups report"],
  "The Encryption report (Devices > Monitor) lists encryption status, readiness and policy per device. Use it for compliance monitoring.", L.bitlocker);
add(D3, T25, "Windows 11 laptops on a metered branch network download updates slowly and cost bandwidth. Which feature lets peers share update content?",
  ["Delivery Optimization, configured with a download mode and a group ID"],
  ["Windows Autopatch phased rollout", "Hotpatch with a baseline", "A BitLocker policy with a network option"],
  "Delivery Optimization allows peer-to-peer caching using download mode settings and group IDs, set through Intune policy.", L.delivery);
add(D3, T25, "Zebra Android devices need a specific OS firmware update pushed by Intune. Which feature fits?",
  ["An Android FOTA deployment"],
  ["A feature update policy for Windows", "A DDM software update profile", "An iOS update restrictions profile"],
  "Android FOTA deployments push a chosen firmware to supported Zebra devices. Windows and Apple devices use their own update mechanisms.", L.fota);
add(D3, T25, "iPhones must install iOS 18.4 by a set date. Which type of Intune profile do you create?",
  ["A settings catalog profile using DDM software update"],
  ["A Windows feature update policy", "A compliance policy with a minimum OS version only", "An enrollment restriction with a minimum OS version"],
  "Apple update enforcement uses declarative device management software update settings in the settings catalog. Compliance only reports.", L.iosUpd);
add(D4, T42, "Apple Business Manager apps are purchased for shared iPads that have no Apple ID. Which license assignment type should you use?",
  ["Device licensing"],
  ["User licensing", "Per-app VPN licensing", "Education licensing"],
  "Device licensing assigns the app to the device and needs no Apple ID. User licensing needs an Apple ID for each user.", L.vpp);
add(D4, T42, "A custom Android line-of-business app must go to Android Enterprise devices. How do you deliver it?",
  ["Publish it as a private app in Managed Google Play, then approve it in Intune"],
  ["Upload the APK as a Win32 app", "Add it as an iOS store app with a URL", "Send the APK by email to each user"],
  "Private apps for Android Enterprise are published through Managed Google Play, and then approved and assigned in Intune.", L.mgp);
add(D4, T42, "A Win32 app must install for the signed-in user only, and not machine-wide. Which setting controls that?",
  ["Install behavior: User"],
  ["Return codes", "Requirement rule: user count", "Detection rule: file path"],
  "The Install behavior setting selects System or User context. System is the default.", L.win32);
add(D4, T42, "You want to see which devices failed an app install and the error code. Where do you look?",
  ["The app's Device install status and the install status report"],
  ["Tenant status", "The enrollment restrictions page", "Endpoint analytics startup performance"],
  "Each app has device and user install status views with error codes. The IME logs on the device add detail.", L.win32);
add(D5, T53, "You want Intune diagnostic logs kept longer than the default period, queried and used in workbooks. What do you configure?",
  ["Diagnostic settings that send Intune logs to a Log Analytics workspace"],
  ["Exports from the Intune Reports page only", "A Windows Autopatch cohort", "A compliance notification template"],
  "Diagnostic settings stream Intune logs to Log Analytics, storage or Event Hubs. This enables retention, queries, workbooks and alert rules.", L.logAn);
add(D5, T53, "Where do you check whether the Intune service itself has an incident or advisory?",
  ["Tenant administration > Tenant status, and the Microsoft 365 admin center service health"],
  ["Devices > Monitor > Enrollment failures", "Endpoint analytics work from anywhere", "Apps > Monitor > App install status"],
  "Tenant status shows service health and connector health. The Microsoft 365 admin center shows service health and the Message center.", L.svcHealth);
add(D5, T53, "Enrollment failed for several new Windows PCs. Which report lists failures with the error details?",
  ["Devices > Monitor > Enrollment failures"],
  ["Devices > Monitor > Encryption report", "Apps > Monitor > Discovered apps", "Tenant administration > Roles > My permissions"],
  "The Enrollment failures report is the first stop. Pair it with the Troubleshooting + support page for a specific user.", L.enrollFail);
add(D5, T53, "You want to be alerted when a compliance or enrollment problem shows up in Intune data. What is a workable approach?",
  ["Send logs to Log Analytics and create Azure Monitor alert rules"],
  ["Create a compliance policy with an alert option", "Turn on notifications in the Company Portal", "Add an alert rule to the Autopilot profile"],
  "Azure Monitor alerts can run on queries over the Intune logs in Log Analytics and notify an action group.", L.logAn);
add(D5, T54, "You script Intune tasks in PowerShell. Which module is the supported way to call Intune through Microsoft Graph?",
  ["Microsoft Graph PowerShell SDK, with Connect-MgGraph"],
  ["The Intune PowerShell SDK, which Microsoft now recommends", "The ActiveDirectory module with Get-ADComputer", "The MSOnline module with Connect-MsolService"],
  "The Microsoft Graph PowerShell SDK is the supported route. The older Intune PowerShell SDK is retired, and MSOnline is retired.", L.graphIntune);
add(D5, T54, "A script reads managed devices only and must follow least privilege. Which Graph permission should you grant?",
  ["DeviceManagementManagedDevices.Read.All"],
  ["DeviceManagementManagedDevices.ReadWrite.All", "Directory.ReadWrite.All", "DeviceManagementConfiguration.ReadWrite.All"],
  "Choose the Read.All permission when the script doesn't change anything. ReadWrite scopes expand the risk.", L.graphIntune);
add(D5, T54, "You want a compliance rule that Intune doesn't offer, such as checking a registry value. What do you use?",
  ["A custom compliance policy with a PowerShell discovery script and a JSON rules file"],
  ["A Win32 app detection rule", "A security baseline setting", "A platform script that assigns a tag"],
  "Custom compliance pairs a discovery script that outputs JSON with a rules file that evaluates it, and the result feeds Conditional Access.", L.customCompl);
add(D5, T51, "Which devices can run Remediations (proactive remediations)?",
  ["Windows devices that meet the license requirements"],
  ["Windows, macOS, iOS and Android devices", "iOS and Android devices only", "Only Microsoft Entra registered devices"],
  "Remediations run PowerShell scripts through the Intune management extension on licensed Windows devices.", L.remediations);
add(D5, T52, "Which Security Copilot agent in Intune helps prioritize vulnerabilities from Defender and propose remediation, with the admin approving the action?",
  ["Vulnerability Remediation Agent"],
  ["Device Offboarding Agent", "Change Review Agent", "Policy Configuration Agent"],
  "The Vulnerability Remediation Agent ranks vulnerabilities and recommends fixes. The other three are retired agents.", L.agents);
add(D5, T52, "Security Copilot flags a performance issue on many PCs and offers a recommendation. What is the correct next step?",
  ["Review the recommendation and decide whether to apply it"],
  ["Apply it at once, because agent advice is always correct", "Ignore it until the next Patch Tuesday", "Delete the affected device records first"],
  "Agents analyze and recommend. Admins review and approve the actions.", L.agents);
add(D1, T11, "Which dynamic membership rule picks every iOS device that is enrolled as company-owned?",
  ["(device.deviceOSType -eq \"iOS\") -and (device.deviceOwnership -eq \"Company\")"],
  ["(user.deviceOSType -eq \"iOS\") -and (user.deviceOwnership -eq \"Company\")", "(device.deviceOSType -eq \"iOS\") -or (device.deviceOwnership -eq \"Personal\")", "(device.deviceManagementAppId -eq \"iOS\") -and (device.accountEnabled -eq false)"],
  "Use device.* attributes and the -and operator so both conditions must be true.", L.dynGroups);

/* ---- Shorten the longest new correct answers ---- */
(function () {
  const S = (pat, c) => { const q = Q.find(x => x.q.startsWith(pat)); if (!q) throw new Error(pat); q.c = c; };
  S("Windows 11 devices need Microsoft 365 Apps with Visio", ["Pick Visio in the app suite, or build a custom Microsoft 365 Apps admin center configuration"]);
  S("iPhones must install iOS 18.4", ["A settings catalog profile with DDM software update"]);
  S("macOS 15.1 devices must run macOS 15.4", ["A settings catalog profile with DDM software update, target version and local time"]);
  S("A new Windows 11 PC must be wiped", ["Wipe with the 'Retain enrollment state and user account' option"]);
  S("You are creating firewall rules", ["Endpoint security > Firewall, with a Defender Firewall Rules profile"]);
  S("You must add an exclusion", ["Endpoint security > Antivirus, with a Defender Antivirus exclusions profile"]);
  S("A PC needs Microsoft 365 Apps installed during Autopilot", ["Assign the app as Required and track it in the ESP"]);
  S("Autopilot names should look like", ["In the Autopilot deployment profile, as a name template"]);
  S("An app from the Enterprise App Catalog", ["Install and uninstall commands, detection rules, requirements"]);
})();
