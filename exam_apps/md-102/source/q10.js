/* ===== Added Nov 11, 2026: sequencing questions and Domain 1 / Domain 4 reinforcement ===== */
Object.assign(L, {
  hybridAp: ML + 'autopilot/windows-autopilot-hybrid',
  hybridFlow: ML + 'autopilot/tutorial/user-driven/hybrid-azure-ad-join-workflow',
  entraHybrid: ML + 'entra/identity/devices/how-to-hybrid-join',
  entraHybridPlan: ML + 'entra/identity/devices/hybrid-join-plan',
  apns: ML + 'intune/device-enrollment/apple/apple-mdm-push-certificate-get',
  ade: ML + 'intune/device-enrollment/apple/automated-device-enrollment-ios',
  mgpBind: ML + 'intune/app-management/deployment/add-managed-google-play',
  androidFm: ML + 'intune/device-enrollment/android/setup-fully-managed',
  builtinRoles: ML + 'intune/fundamentals/role-based-access-control/role-based-access-control',
  mamSel: ML + 'intune/app-management/protection/apps-selective-wipe',
  mamWrap: ML + 'intune/app-management/protection/app-wrapping-tool',
  store: ML + 'intune/app-management/deployment/add-microsoft-store-app',
  m365Intune: ML + 'intune/app-management/deployment/add-office365',
  condLaunch: ML + 'intune/app-management/protection/ref-settings-ios',
  lob: ML + 'intune/app-management/deployment/add-line-of-business'
});
function addo(d, t, q, steps, extra, notes, e, l) {
  Q.push({ id: Q.length + 1, d, t, q, type: 'order', steps, extra, notes, e, l });
}
const TS = 'Setup sequences';

/* ---------- Sequences ---------- */
addo(D1, TS, "Place the steps in the order you would follow to set up Windows Autopilot user-driven Microsoft Entra hybrid join. Some listed steps do not belong.",
  ["Set up automatic Intune enrollment (MDM user scope)", "Install the Intune Connector for Active Directory", "Increase the computer account limit in the OU", "Register the devices as Windows Autopilot devices", "Create a device group", "Configure and assign the Enrollment Status Page", "Create and assign the hybrid join Autopilot deployment profile", "Create and assign the domain join profile"],
  ["Create a device preparation policy", "Enable Windows Backup for Organizations"],
  ["Devices must be able to enroll in Intune automatically", "The connector creates the computer objects in your domain", "The connector's account needs room to create computer objects in the OU", "Intune needs the hardware hash to recognize the device", "The group will hold the Autopilot devices", "ESP tracks the setup before the user reaches the desktop", "The profile is set to Microsoft Entra hybrid joined", "The domain join profile tells the connector the domain and OU"],
  "This is the order in the Learn tutorial. Creating the device group before registering the devices is interchangeable and often the better order in production. The device preparation policy does not support hybrid join.", L.hybridFlow);
addo(D1, TS, "Existing domain-joined Windows 11 PCs must become Microsoft Entra hybrid joined and then enroll in Intune automatically. Place the steps in order.",
  ["Run Microsoft Entra Connect and configure hybrid Microsoft Entra join (device options and SCP)", "Set the MDM user scope for Microsoft Intune in Entra", "Create a GPO that enables automatic MDM enrollment with default Entra credentials", "Link the GPO to the OU that holds the PCs", "Confirm the PCs show as Hybrid Microsoft Entra joined and as enrolled in Intune"],
  ["Run dsregcmd /leave on every PC", "Install the Intune Connector for Active Directory"],
  ["Entra Connect writes the SCP and syncs the device objects", "Without scope, the enrollment has nowhere to land", "The GPO triggers the enrollment on PCs that are hybrid joined", "The GPO only applies where it is linked", "Check both Entra devices and Intune"],
  "Hybrid join is configured first because the auto-enrollment GPO needs a hybrid joined device. The MDM user scope can be set any time before enrollment. The Intune Connector for Active Directory is only for Autopilot hybrid join.", L.entraHybrid);
addo(D1, TS, "Place the steps in order to enroll iPhones with Apple Automated Device Enrollment (ADE) in Intune.",
  ["Create the Apple MDM push certificate in Intune", "Download the Intune public key", "In Apple Business Manager, add an MDM server, upload the key and download the token", "Upload the token to Intune with the Apple ID", "Create an ADE enrollment profile", "Assign the profile to the synced devices"],
  ["Create a VPP token for device licensing", "Enable the Company Portal for each device"],
  ["The push certificate is required before any Apple enrollment", "The public key pairs the token with Intune", "Apple Business Manager issues the server token (.p7m)", "The token connects the Intune tenant to ABM", "The profile defines supervision and Setup Assistant screens", "Devices pick up the profile at first boot"],
  "The push certificate comes first, then the ADE token. After devices sync from ABM, the enrollment profile is assigned to them. A VPP token is for apps, not enrollment.", L.ade);
addo(D1, TS, "Place the steps in order to create the Apple MDM push certificate in Intune.",
  ["Download the certificate signing request (CSR) from Intune", "Sign in to the Apple Push Certificates Portal with an Apple ID", "Upload the CSR and download the .pem certificate", "Upload the .pem to Intune with the same Apple ID"],
  ["Upload the CSR to Apple Business Manager", "Create an ADE token"],
  ["Intune creates the request", "Use a work Apple ID that will be kept long term", "Apple signs the request into a certificate", "Renewals must use the same Apple ID"],
  "The certificate lasts one year, and renewal must use the same Apple ID or devices have to re-enroll.", L.apns);
addo(D1, TS, "Place the steps in order to enroll Android Enterprise fully managed devices by QR code.",
  ["Connect Intune to Managed Google Play", "Create a fully managed enrollment profile", "Get the token or QR code from the profile", "Factory reset the device", "Scan the QR code at the setup screen"],
  ["Install the Company Portal and sign in", "Enable device administrator"],
  ["Required before any Android Enterprise enrollment", "The profile defines the enrollment type and group", "The QR code carries the token", "The device must be at its welcome screen", "Setup completes automatically"],
  "Fully managed enrollment starts at device setup. Company Portal sign-in creates a work profile instead, and device administrator is deprecated.", L.androidFm);
addo(D1, TS, "Place the steps in order to roll out Windows LAPS with Intune and Microsoft Entra ID.",
  ["Turn on Microsoft Entra Local Administrator Password Solution in the tenant", "Create a LAPS policy under Endpoint security > Account protection", "Assign the policy to a device group", "The device applies the policy and backs up the password to Entra", "View or rotate the password from the device page"],
  ["Delete the local administrator account", "Join the devices to an on-premises domain"],
  ["The tenant setting allows Entra to store passwords", "The policy sets account name, length and rotation", "Assignments target the devices", "The password is stored with the device object", "Viewing needs permission, and rotation needs the remote task permission"],
  "The Entra tenant setting must be enabled before devices can back up the password. Viewing it needs the right Entra role or a custom Intune permission.", L.lapsDeploy);
addo(D1, TS, "Place the steps in order to protect Exchange Online mail on unenrolled personal phones with an app protection policy.",
  ["Create an app protection policy for iOS and Android", "Assign the policy to the user group", "Create a Conditional Access policy for Exchange Online on mobile", "Grant access with Require app protection policy", "Turn the policy on after testing in report-only mode"],
  ["Enroll the personal phones in Intune", "Require a compliant device in the grant"],
  ["Defines copy, paste, PIN and wipe behavior", "Policies only apply to the users assigned", "Targets cloud app and platform", "This grant checks for a protected app", "Report-only avoids a surprise lockout"],
  "Unenrolled devices have no compliance state, so the compliant device grant would block them. App protection works without enrollment.", L.appCA);
addo(D4, TS, "Place the steps in order to deploy a Win32 app with Intune.",
  ["Package the installer with the Win32 Content Prep Tool", "Add a Windows app (Win32) and upload the .intunewin file", "Set the install and uninstall commands and install behavior", "Add requirement rules", "Add a detection rule", "Assign the app as Required"],
  ["Upload an APK", "Create an app protection policy for Windows"],
  ["Creates the .intunewin package", "The upload starts the app wizard", "System or User context is chosen here", "Requirements decide whether the app applies", "Detection decides whether the app is already installed", "Required installs without user action"],
  "The wizard order is App information, Program, Requirements, Detection rules, Dependencies, Supersedence, Assignments.", L.win32);
addo(D4, TS, "Place the steps in order to deploy Microsoft 365 Apps with Visio through Intune.",
  ["Add the Microsoft 365 Apps (Windows 10 and later) app", "Configure the app suite and include Visio", "Set architecture, update channel and licensing options", "Optionally remove older MSI Office versions", "Assign the app as Required to the device group"],
  ["Create an app configuration policy for Visio", "Upload an .intunewin file for Visio"],
  ["This app type is the supported way in Intune", "The suite choices decide what installs", "Settings define how the apps install and update", "Prevents conflicts with older MSI installs", "Required installs without the user"],
  "Settings in an app configuration policy do not add products. The installation package decides what is installed.", L.m365Intune);
addo(D1, TS, "Place the steps in order to use Multi Admin Approval to protect an app deployment.",
  ["Create a security group of approvers", "Add the group to an Intune role assignment", "Create an access policy for Apps and choose the approver group", "An admin submits an app change, which becomes pending", "An approver approves the request", "The requester completes the change"],
  ["The requester approves their own change", "Create a Microsoft 365 group of approvers"],
  ["Approvers must be a security group", "The group must be assigned directly to an Intune role", "Access policies decide what needs approval", "Changes to protected resources wait for approval", "A different admin approves", "The submitter finishes the change after approval"],
  "The access policy itself needs a second admin to approve it, and the requester selects Complete after approval. Nobody can approve their own request. Microsoft 365 groups, distribution lists and mail-enabled security groups do not resolve as approvers.", L.maa);
addo(D2, TS, "Place the steps in order to issue certificates to devices with Intune Cloud PKI and SCEP.",
  ["Create a Cloud PKI root CA", "Create a Cloud PKI issuing CA", "Deploy the root CA certificate with a trusted certificate profile", "Create a SCEP certificate profile that points to the issuing CA", "Assign the profiles to the devices"],
  ["Install NDES on a Windows server", "Install the Certificate Connector"],
  ["The trust anchor comes first", "The issuing CA signs device certificates", "Devices must trust the chain", "The SCEP profile uses the issuing CA's SCEP URL", "Devices request and receive certificates"],
  "Cloud PKI removes the need for NDES and the certificate connector. The trusted certificate profile must reach the device before SCEP.", L.cpki);
addo(D2, TS, "Place the steps in order to set up Windows Autopilot device preparation (user-driven, Microsoft Entra join).",
  ["Set up Windows automatic Intune enrollment", "Allow users to join devices to Microsoft Entra ID", "Create an assigned device group (owner: Intune Provisioning Client)", "Create a user group", "Assign apps and PowerShell scripts to the device group", "Create the device preparation policy and assign it to the user group"],
  ["Register the hardware hash", "Create an Autopilot deployment profile"],
  ["Devices that join are enrolled in Intune automatically", "Users are allowed to join devices to Entra ID", "The policy uses an assigned (not dynamic) security group", "The policy is assigned to this group of users", "Apps and scripts target the device group", "The policy picks the device group, apps and scripts, and goes to the users"],
  "This is the order in the Learn tutorial: Steps 1 to 6 are required, and Step 7 (corporate identifiers or device association) is optional. Device preparation needs no hardware hash and no deployment profile, and it supports Entra join only. The device group must be an assigned security group with the Intune Provisioning Client service principal as owner. Devices are added to it during deployment.", L.apDP);

/* ---------- Domain 1 reinforcement ---------- */
const T1a = 'Hybrid join and Autopilot hybrid';
add(D1, T1a, "Which object in on-premises Active Directory tells domain-joined Windows devices which Microsoft Entra tenant to register with?",
  ["The Service Connection Point (SCP)"],
  ["The Group Policy Central Store", "The Intune Connector's computer account", "The Entra Connect Health agent"],
  "The SCP in the AD configuration partition points devices at the tenant. Entra Connect creates it when you configure hybrid join.", L.entraHybridPlan);
add(D1, T1a, "A domain-joined PC shows as Pending in Microsoft Entra ID. What is the most likely reason?",
  ["The device registered and is waiting for Entra Connect to finish syncing it"],
  ["The device has no compliance policy", "The user lacks an Intune license", "The MDM user scope is set to None"],
  "Hybrid join shows Pending until the device object syncs and the device completes registration. It does not depend on Intune.", L.entraHybrid);
add(D1, T1a, "During Autopilot hybrid join, the PC must be able to reach what on the network at OOBE?",
  ["A domain controller, over the corporate network or VPN"],
  ["A Configuration Manager distribution point", "A Windows Server Update Services server", "An internal certificate authority only"],
  "Hybrid join needs line of sight to a domain controller during OOBE, because the PC is joined to the domain as part of the process.", L.hybridAp);
add(D1, T1a, "The Intune Connector for Active Directory is installed. What permission must it have in the target OU?",
  ["Create computer objects"],
  ["Reset passwords for user accounts", "Link Group Policy objects", "Modify the schema"],
  "The connector creates the computer objects for hybrid joined Autopilot devices in the OU from the domain join profile.", L.hybridAp);
add(D1, T1a, "A personal Windows PC needs single sign-on to work apps and Conditional Access, with no management by IT. Which state fits?",
  ["Microsoft Entra registered"],
  ["Microsoft Entra joined", "Microsoft Entra hybrid joined", "Domain joined only"],
  "Registered is the BYOD state. Joined and hybrid joined are for organization-owned devices.", L.entraJoin);
add(D1, T1a, "Where do you set the MDM user scope that allows automatic enrollment when a device is Entra joined or hybrid joined?",
  ["Entra admin center > Mobility (MDM and WIP) > Microsoft Intune"],
  ["Intune > Devices > Enrollment > Windows enrollment", "Intune > Tenant administration > Connectors and tokens", "Intune > Endpoint security > Account protection"],
  "The scope is a setting on the Microsoft Intune MDM application in Entra, with None, Some or All users.", L.entraJoin);
add(D1, T13, "What is the largest value you can set for a device limit restriction?",
  ["15 devices per user"],
  ["5 devices per user", "100 devices per user", "1,000 devices per user"],
  "Device limit restrictions allow 1 to 15 devices. Only a Device Enrollment Manager goes above that, up to 1,000 devices.", L.limitRestr);
add(D1, T13, "You must stop users from enrolling personally owned iOS devices, but allow company-owned iPhones. Which control do you use?",
  ["A device type (platform) restriction that blocks personally owned iOS"],
  ["A device limit restriction set to 0", "A compliance policy that checks ownership", "An app protection policy for iOS"],
  "Platform restrictions can block personally owned devices per platform. Limits count devices and don't filter by ownership.", L.platRestr);
add(D1, T12, "The Apple MDM push certificate expires in a few weeks. How do you renew it without re-enrolling devices?",
  ["Renew it in the Apple Push Certificates Portal with the same Apple ID"],
  ["Create a new certificate with a different Apple ID", "Delete the old certificate and start over", "Renew the ADE token instead"],
  "The certificate is valid for one year, and a renewal must use the same Apple ID. A different ID breaks the trust and devices must re-enroll.", L.apns);
add(D1, T12, "The Apple ADE token is about to expire. What do you do?",
  ["Download a new token from Apple Business Manager and upload it in Intune"],
  ["Renew the Apple MDM push certificate", "Re-create every enrollment profile", "Wipe the enrolled devices"],
  "The ADE token is valid for one year. Renew it by downloading a new server token and uploading it to the existing token in Intune.", L.ade);
add(D1, T12, "What is required before you can enroll any Android Enterprise device in Intune?",
  ["A connection between the tenant and Managed Google Play"],
  ["A Samsung Knox account", "An Apple MDM push certificate", "A Google Workspace subscription"],
  "Android Enterprise needs the Managed Google Play binding. Knox and zero-touch are optional enrollment helpers.", L.mgpBind);
add(D1, T15, "Which Android compliance setting checks that the device is genuine and not rooted?",
  ["Play Integrity verdict"],
  ["Restricted apps list", "Require a screen lock", "Minimum security patch level"],
  "Play Integrity verdict replaced SafetyNet attestation for device integrity checks.", L.rbac);
add(D1, T14, "A technician must create and manage configuration profiles and compliance policies, but not manage apps or devices. Which built-in Intune role fits?",
  ["Policy and Profile Manager"],
  ["Help Desk Operator", "Application Manager", "School Administrator"],
  "Policy and Profile Manager manages compliance policies, configuration profiles and Apple enrollment. Application Manager covers apps.", L.builtinRoles);
add(D1, T14, "An auditor needs to view everything in Intune but change nothing. Which built-in role fits?",
  ["Read Only Operator"],
  ["Endpoint Security Manager", "Intune Administrator", "Policy and Profile Manager"],
  "Read Only Operator has read access to all Intune areas and no ability to change them.", L.builtinRoles);
add(D1, T14, "Which scope tag is assigned to an Intune object when you do not choose one?",
  ["The Default scope tag"],
  ["No scope tag, so everyone can see it", "The tag of the admin who created it", "A random tag"],
  "New objects get the Default scope tag. Admins whose role assignment includes it can see the object.", L.scopeTags);

/* ---------- Domain 4 reinforcement ---------- */
const T4a = 'App protection details', T4b = 'App types and licensing', T4c = 'Microsoft 365 Apps';
add(D4, T4a, "Which cut, copy and paste setting lets managed apps receive pasted data from any app, while data copied out of them can only go to other managed apps?",
  ["Restrict cut, copy and paste between other apps: Policy managed apps with paste in"],
  ["Receive data from other apps: All apps", "Send org data to other apps: All apps", "Third-party keyboards: Allow"],
  "Policy managed apps with paste in allows pasting from any app into managed apps, while copying out stays inside managed apps. Policy managed apps blocks pasting in from outside as well.", L.mamAndroid);
add(D4, T4a, "An employee leaves. Their personal, unenrolled iPhone holds Outlook with company mail. How do you remove only company data?",
  ["Use App selective wipe for the user in the Intune admin center"],
  ["Run the Wipe device action", "Run Autopilot Reset", "Delete the user's Entra account only"],
  "App selective wipe removes company data from protected apps on unenrolled devices. Device wipe needs an enrolled device.", L.mamSel);
add(D4, T4a, "A custom line-of-business iOS app has no Intune SDK. How do you apply app protection to it?",
  ["Use the Intune App Wrapping Tool, then deploy the wrapped app"],
  ["Create an app configuration policy for it", "Enroll the device with User Enrollment", "Use a Conditional Access policy alone"],
  "The wrapping tool adds app protection to in-house apps without code changes. App protection policies need an app that supports the Intune app protection layer.", L.mamWrap);
add(D4, T4a, "In an app protection policy, which area sets rules such as blocking access on jailbroken or rooted devices?",
  ["Conditional launch"],
  ["Data transfer", "Access requirements", "Assignments"],
  "Conditional launch holds the checks and actions (block or wipe) for jailbreak or root, minimum OS, app version and device threat level.", L.condLaunch);
add(D4, T4a, "An app protection policy and an app configuration policy are both assigned to Outlook. What does each control?",
  ["Protection controls data handling, and configuration sets values inside the app"],
  ["Protection sets the email account, and configuration controls copy and paste", "Both control the same data settings", "Protection needs enrollment, and configuration does not"],
  "App protection covers data transfer, PIN and wipe. App configuration passes settings such as the account or server to the app. Neither needs enrollment for managed apps.", L.appConfig);
add(D4, T4b, "A Win32 app package is large. What is the maximum size for an app uploaded to Intune as a Win32 app?",
  ["30 GB"],
  ["2 GB", "8 GB", "100 GB"],
  "Win32 app packages can be up to 30 GB. Larger installs should use a smaller package that downloads content.", L.win32);
add(D4, T4b, "Which of these is a valid Win32 app detection rule type? (Select two)",
  ["File or folder exists", "Registry value"],
  ["Enrollment status", "Company Portal category"],
  "Detection rules can use an MSI product code, a file or folder, a registry key or value, or a custom script.", L.win32);
add(D4, T4b, "A new version of an app must install over the old one and keep user settings. Which supersedence choice fits?",
  ["Supersede the old app without uninstalling it first"],
  ["Create a dependency on the old app", "Set the old app's detection rule to always true", "Assign the old app as Uninstall"],
  "Supersedence can replace an app with or without uninstalling first. Without uninstall the newer installer updates in place.", L.win32Super);
add(D4, T4b, "You add an .msi line-of-business app and assign it to devices. Which statement about detection is correct?",
  ["Intune detects an MSI app by its product code, with no extra rule"],
  ["You must write a registry detection rule", "You must upload an .intunewin file", "Detection is not possible for MSI apps"],
  "The LOB app type reads the MSI product code for detection. Win32 apps give you custom detection and requirement rules.", L.lob);
add(D4, T4b, "An iPad is enrolled with User Enrollment, and you assign an Apple Business Manager app. Which license assignment works?",
  ["User licensing"],
  ["Device licensing", "Per-app VPN licensing", "Either, because the type is chosen at install"],
  "User Enrollment does not support device-licensed apps, so the app is licensed to the user's Apple Account.", L.vpp);
add(D4, T4b, "A user is in a group where an app is Required, and also in an excluded group for the same assignment. What happens?",
  ["The app is not installed, because exclusion takes precedence"],
  ["The app installs, because Required wins", "The app is shown as Available", "Intune reports a conflict and installs it twice"],
  "Exclusions win over inclusions. One exception is mixing user groups and device groups in include and exclude, which Intune does not evaluate.", L.assignApps);
add(D4, T4b, "You want a Required app to reach only corporate-owned Windows PCs inside a mixed user group. What do you add to the assignment?",
  ["An Include assignment filter based on device ownership"],
  ["A scope tag for corporate devices", "An enrollment restriction", "A compliance policy"],
  "Assignment filters narrow who gets the app using device properties, without building a new group.", L.props);
add(D4, T4b, "You deploy apps from the Microsoft Store (new experience) in Intune. What is true?",
  ["You search the Store, add the app, and Intune delivers it without a package"],
  ["You must wrap each app with the Win32 Content Prep Tool", "Only apps that you sideload are supported", "The Store apps cannot be assigned as Required"],
  "The new Microsoft Store app type uses the Store catalog. You pick the app and assign it with the usual intents.", L.store);
add(D4, T4c, "You deploy Microsoft 365 Apps to PCs that still have older MSI-based Office installed. Which option removes the old versions during the install?",
  ["Remove MSI from end-user devices in the app settings"],
  ["Create a supersedence rule for Office", "Assign the old Office as Uninstall", "Run Windows Autopilot Reset"],
  "The Microsoft 365 Apps app has an option to uninstall MSI Office versions as part of the deployment.", L.m365Intune);
add(D4, T4c, "Microsoft 365 Apps must be installed on an Azure Virtual Desktop multi-session host. Which setting should you enable?",
  ["Use shared computer activation"],
  ["Accept the app license on behalf of users", "Update channel: Beta", "Architecture: 32-bit"],
  "Shared computer activation is used for multi-user environments such as RDS and AVD, where users sign in to license the apps.", L.m365Intune);
add(D4, T4c, "Which update channel gives Microsoft 365 Apps new features once a month, on a predictable date?",
  ["Monthly Enterprise Channel"],
  ["Current Channel", "Semi-Annual Enterprise Channel", "Beta Channel"],
  "Monthly Enterprise Channel releases on the second Tuesday of each month. Current Channel ships as soon as ready, and Semi-Annual is twice a year.", L.m365Intune);
add(D4, T4c, "Which of these deploys Microsoft Edge to Windows PCs through Intune?",
  ["The Microsoft Edge, version 77 and later app type"],
  ["A Win32 app that you package from the Edge installer with the content prep tool", "An app protection policy for Edge that installs the browser on enrolled PCs", "An app configuration policy for Edge that pushes the installer to the devices"],
  "Apps > All Apps > Create > App type > Microsoft Edge, version 77 and later > Windows 10. You pick the Stable, Beta or Dev channel. Edge policies are set separately in the settings catalog.", ML + 'intune/app-management/deployment/add-edge-windows');
add(D4, T4c, "An admin wants Outlook on mobile to stay silent from 10 PM to 7 AM. Where is this configured?",
  ["A Quiet Time policy"],
  ["A compliance policy", "A Conditional Access session control", "An app protection policy PIN setting"],
  "A Quiet Time policy (Apps > Quiet Time > Policies) mutes Outlook email and Teams notifications on iOS/iPadOS and Android.", L.quiet);
