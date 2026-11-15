/* ===== DOMAIN 2: Manage and maintain devices ===== */
const T21 = 'Autopilot and device preparation', T22 = 'ESP and Windows Backup', T23 = 'Device actions and bulk actions', T24 = 'Configuration profiles, GPO and ADMX', T25 = 'Updates and hotpatch', T26 = 'Windows 365 and Remote Help', T27 = 'Device query and inventory';

add(D2, T21, "You want the simplest Autopilot path for new Windows 11 PCs: no hardware hash upload, no deployment profile, and a device group that holds the apps. Which option fits?",
  ["Windows Autopilot device preparation with a device preparation policy"],
  ["Windows Autopilot self-deploying mode", "Windows Autopilot pre-provisioning with technician flow", "Windows Autopilot for existing devices"],
  "Device preparation (the newer framework) uses a policy tied to a user group and a device group. No hardware hash registration is needed, and it replaces the classic profile and ESP model for supported scenarios.", L.apDP);

add(D2, T21, "A device preparation policy is assigned to a user group. Which object must exist for the apps and scripts to be targeted at the new device?",
  ["A static device group with the Intune Provisioning Client as owner"],
  ["A dynamic device group based on the device serial number", "A Microsoft 365 group containing the device and the user", "An Entra administrative unit for each site"],
  "The device group in a device preparation policy must be a static assigned-membership security group with the Intune Provisioning Client (AppId f1346770-5b25-470b-88bd-d5744ab7952c) set as its owner.", L.apPre);

add(D2, T21, "Which scenario does Autopilot device preparation NOT support at this time?",
  ["Hybrid Microsoft Entra join deployments"],
  ["Microsoft Entra join user-driven deployments", "Deployments on Windows 11 Pro devices", "Automatic enrollment with a user-assigned policy"],
  "Device preparation supports Entra join (user-driven and automatic modes). Hybrid join is still handled by classic Autopilot with the Intune Connector for Active Directory.", L.apCompare);

add(D2, T21, "Classic Autopilot user-driven Entra join: what must be done before the user can start OOBE on a new PC?",
  ["Register the device hardware hash and assign a deployment profile to it"],
  ["Create a device preparation policy for the device", "Install the Company Portal app on the PC", "Run a Microsoft Entra Connect sync cycle"],
  "Classic Autopilot identifies the device by its hardware hash (or via a reseller/OEM). A deployment profile assigned to a group that includes it drives OOBE.", L.userDriven);

add(D2, T21, "A technician wants to complete the device-specific part of provisioning in the back room, then hand the PC to the user to finish sign-in. Which Autopilot capability is this?",
  ["Pre-provisioning (white glove)"],
  ["Self-deploying mode", "Autopilot Reset", "Device preparation automatic mode"],
  "Pre-provisioning has a technician phase that installs device-targeted apps and policies, and a user phase when the end user signs in. Self-deploying has no user affinity.", L.apPre);

add(D2, T21, "Kiosk PCs in a lobby need Autopilot with no user sign-in and no user affinity. Which mode and join type apply?",
  ["Self-deploying mode with Microsoft Entra join, which requires TPM 2.0 attestation"],
  ["User-driven mode with Microsoft Entra registered join", "Pre-provisioning with Microsoft Entra hybrid join", "Autopilot Reset with local credentials"],
  "Self-deploying mode supports Entra join only and needs a TPM 2.0 device that supports attestation. It does not support hybrid join or user affinity.", L.apScen);

add(D2, T21, "An enterprise reuses a Windows PC for another employee. You want it back at the Autopilot sign-in screen, keeping Entra join and management, in minutes. What do you run?",
  ["Autopilot Reset from Intune"],
  ["Retire", "Delete", "Collect diagnostics"],
  "Autopilot Reset removes user data and apps and returns the device to a business-ready state while keeping the Entra join, MDM enrollment and Wi-Fi settings. Retire and Delete unenroll the device.", L.actions);

add(D2, T22, "Some apps must be installed before the user reaches the desktop, and the user must be blocked until they are. Which feature controls this?",
  ["Enrollment Status Page with 'Block device use until required apps are installed'"],
  ["A Win32 app with the Available assignment intent", "A compliance policy with a grace period", "A Windows Hello for Business enrollment policy"],
  "ESP tracks required apps and profiles during setup and can block use until they finish. Only Required-assigned apps that are tracked can block the desktop.", L.esp);

add(D2, T22, "You want a user's Windows settings, installed Store apps and Microsoft Edge preferences restored after a PC reset or replacement, during OOBE. Which Intune feature should you configure?",
  ["Windows Backup for Organizations, with the restore page in the Enrollment Status Page"],
  ["Known folder move in OneDrive only", "A Win32 app that runs robocopy", "Windows Autopilot self-deploying mode"],
  "Windows Backup for Organizations syncs settings and app lists to the user's Microsoft account in the cloud, and the Enrollment Status Page restore step brings them back at OOBE. Files are covered by OneDrive.", L.backup);

add(D2, T22, "A user is new at your company and reports that Windows Backup restore never offered a restore at OOBE. Which condition prevents it?",
  ["The restore needs a prior backup from a device the same user had signed in on"],
  ["Windows Backup only works on Windows 10", "The restore runs only on hybrid joined PCs", "A device compliance policy must exist first"],
  "Restore uses the backup stored for the user's account. A new user without an earlier backup has nothing to offer.", L.backupWin);

add(D2, T23, "A lost Android tablet may hold sensitive corporate data. You want to remove all data and return it to factory settings. Which action?",
  ["Wipe"],
  ["Retire", "Fresh Start", "Sync"],
  "Wipe returns the device to factory settings and removes data. Retire removes only company data and management, and Fresh Start reinstalls Windows keeping a clean OS.", L.actions);

add(D2, T23, "An employee leaves and takes a personal iPhone enrolled via User Enrollment. You only want to remove corporate apps and data. Which action?",
  ["Retire"],
  ["Wipe", "Autopilot Reset", "Fresh Start"],
  "Retire removes managed apps, profiles and company data but leaves personal data. Wipe is not available for User Enrollment devices.", L.actions);

add(D2, T23, "You must restart 4,000 managed Windows devices in a group after a patch. What is the best approach?",
  ["Use a bulk device action on the group for the Restart device action"],
  ["Run the Restart action on each device one by one", "Create a platform script that runs shutdown /r", "Deploy a new update ring with a deadline of zero"],
  "Bulk device actions apply a supported action to a selected device group (up to the product limits) from the admin center, with a status report.", L.bulkActions);

add(D2, T23, "A Windows device recovery tool asks you to rotate BitLocker recovery keys remotely. Which action in Intune does this?",
  ["BitLocker key rotation on the managed device"],
  ["Sync", "Restart", "Rename device"],
  "BitLocker key rotation generates a new recovery password for the OS drive and stores it in Entra. It requires Windows 10 1909 or later and key rotation enabled in policy.", L.bitlockerRotate);

add(D2, T24, "You want to apply the Windows Firewall settings from your on-premises GPOs in Intune. What should you do first to see which settings are supported?",
  ["Export the GPO as XML and import it into Group Policy analytics"],
  ["Run gpresult on each client and email the results", "Deploy the GPO to Entra joined devices", "Create a security baseline for each GPO"],
  "Group Policy analytics reads exported GPO XML and reports the MDM-support level of each setting, and can migrate supported settings into a settings catalog profile.", L.gpa);

add(D2, T24, "A third-party app ships its own ADMX and ADML files. How can you configure those policies on Intune-managed Windows PCs?",
  ["Import the custom ADMX files into Intune and configure the settings from the imported template"],
  ["Copy the files into C:\\Windows\\PolicyDefinitions", "Use a Win32 app to install the ADMX only", "Enable the setting through an app configuration policy"],
  "Intune lets you import custom ADMX/ADML into Devices > Configuration > Import ADMX, then configure settings in a Windows template. Import fails when a file references a missing namespace.", L.admxCustom);

add(D2, T24, "Which Intune profile type is the preferred, most complete way to configure Windows settings, replacing many templates?",
  ["Settings catalog"],
  ["Custom OMA-URI", "Administrative templates (legacy)", "Device restrictions template"],
  "The settings catalog exposes thousands of settings in one searchable list and is where Microsoft focuses new development. OMA-URI is a fallback for unsupported settings.", L.gpaMigrate);

add(D2, T24, "One configuration profile must apply to Windows devices only when they are corporate-owned. Which feature lets you narrow an assignment without building a new group?",
  ["An assignment filter based on device ownership"],
  ["A scope tag", "A dynamic user group", "A compliance notification"],
  "Filters evaluate device properties at assignment time and can include or exclude devices from an assigned group. Scope tags control admin visibility, not targeting.", L.props);

add(D2, T25, "Windows 11 Enterprise devices must install security updates without restarting. Which approach provides this?",
  ["Enable hotpatch updates through a Windows quality update policy"],
  ["Set the update ring to restart immediately after install", "Defer feature updates for 365 days", "Use Delivery Optimization with a download mode of 100"],
  "Hotpatch installs monthly security updates without a restart on supported Windows 11 Enterprise (Windows 365 and Azure Arc-enabled included), after prerequisites such as VBS are met.", L.hotpatch);

add(D2, T25, "You want to roll out a Windows 11 feature update only to a pilot group and block all other devices from moving to it. Which Intune policy fits?",
  ["A feature update policy that targets the pilot group at the chosen version"],
  ["A quality update policy with an expedite release", "An update ring with feature deferral at 0 days", "A compliance policy requiring the OS version"],
  "Feature update policies pin devices to a specific Windows feature update version, and devices stay on it until you change it. Update rings control behavior and cadence.", L.updRings);

add(D2, T25, "A zero-day exploit patch must be installed quickly on a set of PCs, ignoring the normal deferral. Which update policy type is for this?",
  ["Expedite quality update policy"],
  ["Windows feature update policy", "Windows Autopatch phase delay", "Driver update policy"],
  "Expedite policies install a given quality update right away and override ring deferral, with a grace-period for the restart.", L.qualityUpd);

add(D2, T25, "Which Microsoft service automates Windows quality and feature update rollout across rings and uses telemetry to pause when issues appear?",
  ["Windows Autopatch"],
  ["Windows Update for Business reports only", "Configuration Manager software updates", "Microsoft Defender Vulnerability Management"],
  "Autopatch manages update rings, groups and pause/rollback logic for Windows, Microsoft 365 apps and Edge. It is included in Windows Enterprise E3 and above.", L.autopatchFaq);

add(D2, T26, "Windows 365 Enterprise Cloud PCs must reach an on-premises file server over a private network. Which provisioning option do you use?",
  ["A provisioning policy that uses an Azure network connection (your own virtual network)"],
  ["A provisioning policy with a Microsoft-hosted network", "A shared Azure Virtual Desktop host pool", "A hybrid join with a traditional VPN profile on the Cloud PC only"],
  "Bring-your-own network provisioning attaches Cloud PCs to a customer VNet that has line of sight to on-premises DNS and file servers. Microsoft-hosted network has no on-premises path.", L.w365Net);

add(D2, T26, "Which two items are needed to provision a Windows 365 Enterprise Cloud PC for a user? (Select two)",
  ["A Windows 365 license assigned to the user", "A provisioning policy assigned to a group the user is in"],
  ["An Autopilot deployment profile for the user", "A VPP token for the user", "A Microsoft Entra Domain Services domain"],
  "A Cloud PC license (Windows 365 Enterprise) plus a group-assigned provisioning policy kicks off creation. Autopilot is not used for standard provisioning.", L.w365Prov);

add(D2, T26, "Help desk staff need to see the user's screen and take control with the user's consent, with role-based access and a block for unmanaged helpers. Which Intune capability?",
  ["Remote Help"],
  ["Quick Assist from the Microsoft Store", "Microsoft Teams screen share", "Remote Desktop with a shared admin account"],
  "Remote Help is a premium Intune Suite/add-on capability with Entra auth, RBAC, and compliance checks for the helper. Quick Assist has no per-role control.", L.remoteHelp);

add(D2, T26, "Which license is required for Remote Help sessions?",
  ["The Remote Help add-on or Intune Suite license for both the helper and the sharer"],
  ["Only an Entra ID P1 license for the helper", "Microsoft 365 E3 for the sharer only", "No license is needed"],
  "Remote Help requires a Remote Help license (standalone add-on or part of the Intune Suite) for the users who give help and those receiving it.", L.remoteHelpDeploy);

add(D2, T27, "You need to ask a single Windows device a question about its BIOS version and installed Chrome version in real time, directly in the admin center. Which feature?",
  ["Device query (KQL) from the device's page"],
  ["A compliance policy", "A remediation script", "Endpoint analytics"],
  "Device query for a single device uses KQL against live device inventory and returns results in near real time. Query across multiple devices needs the Intune Advanced Analytics add-on.", L.deviceQuery);

add(D2, T27, "A customer has one-hundred HR laptops and wants to know which ones have a given hotfix. What is the best fit? (the Advanced Analytics license is available)",
  ["Device query for multiple devices using a KQL query"],
  ["Windows Update for Business reports", "A scheduled PowerShell script that writes a file", "A Win32 app detection rule"],
  "Multi-device query runs KQL across a device group using the Advanced Analytics license and saves the query for reuse.", L.deviceQueryMulti);

add(D2, T27, "Which action collects detailed hardware and software properties (such as the BIOS version) for the Windows device inventory used by filters and reports?",
  ["Collect properties through a Properties catalog policy"],
  ["Wipe", "A CSP policy to enable WMI", "Sync only"],
  "The Properties catalog (Devices > Organize > properties catalog) collects additional inventory properties that you can query and use in filters and reports.", L.props);
