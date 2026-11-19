/* ===== Questions from the Intune Lab Guide ===== */
Object.assign(L, {
  bulk: ML+'intune/device-enrollment/windows/create-bulk-package',
  gpoEnroll: ML+'windows/client-management/enroll-a-windows-10-device-automatically-using-group-policy',
  platScripts: ML+'intune/device-management/tools/run-powershell-scripts-windows',
  driverPol: ML+'intune/device-updates/windows/configure-driver-update-policy',
  featurePol: ML+'intune/device-updates/windows/configure-feature-update-policy',
  compOverview: ML+'intune/device-security/compliance/overview',
  filters: ML+'intune/fundamentals/filters/overview',
  updOverview: ML+'intune/device-updates/windows/'
});
const LT1='Lab 1: Enrollment and restrictions', LT2='Lab 2: Autopilot and ESP', LT3='Lab 3: Provisioning packages', LT4='Lab 4: Compliance and Conditional Access', LT5='Lab 5: Profiles and baselines', LT6='Lab 6: App deployment and filters', LT7='Lab 7: Windows updates', LT8='Lab 8: LAPS, BitLocker and Defender', LT9='Lab 9: Scripts, RBAC and device actions', LT10='Lab 10: App protection and app configuration', LT11='Lab 11: Hybrid join';

/* Lab 1 */
add(D1, LT1, "A user is removed from the group in the MDM user scope, then joins a new PC to Entra ID. The PC appears in Entra ID. What do you see in Intune?",
  ["Nothing. Automatic enrollment is skipped because the user is out of MDM scope"],
  ["The PC as Corporate but flagged noncompliant", "The PC as Personal with the user as primary", "The PC enrolled through the Company Portal fallback"],
  "Automatic enrollment at Entra join depends on the MDM user scope. Out of scope means the join works but Intune never enrolls the device.", L.restr);
add(D1, LT1, "You need to stop personal Windows devices from enrolling for a pilot team. Which assignment and order work?",
  ["A Windows platform restriction assigned to the user group, with priority above the default"],
  ["A Windows platform restriction assigned to a device group, below the default", "A compliance policy that checks ownership, assigned to the users", "A device limit restriction set to 0 for every device group"],
  "Enrollment restrictions target user groups and are evaluated by priority. The default restriction is always lowest, so yours must sit above it.", L.platRestr);
add(D1, LT1, "What range can you set for the per-user device limit in Intune, and which account type can enroll far more devices?",
  ["1 to 15 devices. A device enrollment manager can enroll up to 1,000"],
  ["1 to 100 devices. A Global Administrator has no limit at all", "1 to 10 devices. A Helpdesk Administrator can enroll 100", "1 to 5 devices. A Cloud Device Administrator can enroll 50"],
  "A device limit restriction lets you allow 1 to 15 enrolled devices per user. A device enrollment manager (DEM) account is the exception and can enroll up to 1,000.", L.limitRestr);
add(D1, LT1, "The Intune device limit is 10, yet the sixth device of a user fails to join. Which other limit applies at the same time?",
  ["Maximum number of devices per user in Entra ID device settings"],
  ["The Autopilot profile device limit", "The MDM user scope maximum", "The scope tag device count"],
  "The Entra join limit is separate from the Intune device limit. Both apply, and the lower one is hit first.", L.entraJoin);

/* Lab 2 */
add(D2, LT2, "Which attribute lets a dynamic device group match an Autopilot group tag?",
  ["devicePhysicalIds with the [OrderID] prefix"],
  ["extensionAttribute1 on the Entra device", "deviceCategory in Intune", "deviceOwnership set to Company"],
  "The group tag is stored as the order ID in the physical IDs attribute, so a rule like device.devicePhysicalIds -any (_ -eq \"[OrderID]:TAG\") picks those devices.", L.dynGroups);
add(D2, LT2, "Which Autopilot modes need physical TPM attestation, so they cannot be fully tested in a VM? (Select two)",
  ["Self-deploying", "Pre-provisioning"],
  ["User-driven Entra join", "Autopilot device preparation"],
  "Self-deploying and pre-provisioning rely on TPM attestation. User-driven and device preparation work in a VM.", L.apScen);
add(D2, LT2, "Which Enrollment Status Page setting lets a user export logs when installation fails?",
  ["Allow users to collect logs about installation errors"],
  ["Show app and profile configuration progress", "Block device use until all apps and profiles are installed", "Show an error when installation takes longer than the timeout"],
  "The log collection option shows a collect-logs button on the error screen. The other settings control progress display, blocking and timeout.", L.esp);
add(D2, LT2, "You re-run a test on the same hardware that was registered as an Autopilot device. What do you delete first to avoid stale-record failures?",
  ["The old Intune and Entra ID device records, plus the Autopilot record when re-registering the hash"],
  ["Only the Autopilot deployment profile", "Only the dynamic device group", "The ESP profile and its assignment"],
  "Stale device records cause most enrollment failures. Delete the device in Intune and Entra ID, and from the Autopilot list when you re-register the hash.", L.apScen);
add(D2, LT2, "What is the maximum length of the device name template in an Autopilot deployment profile?",
  ["15 characters"],
  ["10 characters", "20 characters", "63 characters"],
  "Names can use %SERIAL% and %RAND:n% macros, and the final name is limited to 15 characters.", L.userDriven);
add(D2, LT2, "You change the group tag of a registered Autopilot device. What happens?",
  ["Dynamic group membership updates, and the profile for the other group applies"],
  ["Nothing until you delete and re-register the device", "The device is retired from Intune", "The ESP resets and applies again immediately"],
  "Group tags drive dynamic group rules. After membership catches up, the new group's profile is the one the device receives.", L.dynGroups);

/* Lab 3 */
add(D1, LT3, "Devices are unboxed with no hardware hash collected and no user at the keyboard. They must join Entra ID and enroll. What do you use?",
  ["A provisioning package built in Windows Configuration Designer"],
  ["A user-driven Autopilot profile", "A self-deploying Autopilot profile", "A compliance policy with enrollment actions"],
  "Provisioning packages need no hardware hash and no user sign-in during enrollment. Autopilot needs registered devices.", L.bulk);
add(D1, LT3, "Devices enrolled with a bulk provisioning package have no primary user. How do you target configuration and apps at them?",
  ["Assign to device groups"],
  ["Assign to user groups", "Assign scope tags", "Assign enrollment restrictions"],
  "Bulk token enrollment is userless, so user-targeted assignments do not apply. Use device groups.", L.bulk);
add(D1, LT3, "How do you revoke a bulk enrollment provisioning package before it expires?",
  ["Delete the package_ user account in Microsoft Entra ID"],
  ["Remove the device from GRP-Dev-Test", "Retire the package in the Intune admin center", "Change the MDM user scope to None"],
  "The designer creates a temporary package_ account in your tenant. Removing it stops the token from working.", L.bulk);
add(D1, LT3, "A technician wants to apply a provisioning package from a USB drive on the first OOBE screen. What do they do?",
  ["Press the Windows key five times"],
  ["Press Shift+F10 and run Add-AppxPackage", "Press the Shift key five times", "Hold Ctrl+Alt+Delete for ten seconds"],
  "Pressing the Windows key five times at OOBE lets Windows detect a package on removable media.", L.bulk);

/* Lab 4 */
add(D3, LT4, "A brand-new device enrolls with no compliance policy assigned. Conditional Access requires compliant devices. Which tenant setting decides whether it is blocked?",
  ["Mark devices with no compliance policy assigned as: Not compliant"],
  ["Compliance status validity period", "Enhanced jailbreak detection", "The default notification template"],
  "By default devices without a policy are treated as compliant. Set the tenant-wide option to Not compliant so only devices that are confirmed compliant get through.", L.compOverview);
add(D3, LT4, "A device stops reporting compliance for longer than the compliance status validity period. How does Intune treat it?",
  ["As noncompliant"],
  ["As compliant until the next sync", "As not evaluated with full access", "As retired and deleted from Intune"],
  "The validity period defaults to 30 days (1 to 120 days). If a device does not report in time, it is treated as noncompliant.", L.compOverview);
add(D3, LT4, "Where do you read why a Conditional Access policy allowed or blocked a sign-in?",
  ["Entra sign-in logs, on the Conditional Access tab of the entry"],
  ["Intune device compliance report", "Intune tenant status page", "Event Viewer on the device"],
  "Sign-in logs show each policy and whether it succeeded, failed, or ran in report-only mode.", L.caGrant);
add(D3, LT4, "You want to see the impact of a new Conditional Access policy without blocking anyone yet. What do you do?",
  ["Set the policy to Report-only"],
  ["Exclude all users from the policy", "Assign it only to a device group", "Enable it and watch for help desk calls"],
  "Report-only evaluates the policy and logs the result but does not enforce it.", L.caGrant);
add(D3, LT4, "A compliant Windows device opens Outlook on the web in Edge but is blocked in Firefox under the same policy. Why?",
  ["Firefox cannot present the device identity by default, so the device is treated as unknown"],
  ["Firefox ignores Conditional Access policies", "Compliance is only evaluated for Microsoft browsers by policy design", "Firefox needs its own Intune license"],
  "Device-based Conditional Access needs the browser to pass device identity. Without it, the device looks unmanaged.", L.caGrant);
add(D3, LT4, "After the first rapid check-ins, how often do enrolled Windows devices check in with Intune?",
  ["About every 8 hours"],
  ["About every hour", "About every 24 hours", "About every 15 minutes"],
  "Windows devices check in about every 8 hours after enrollment. An admin or user can force a sync at any time.", L.rbac);

/* Lab 5 */
add(D2, LT5, "Which Windows profile type is the current, most complete way to configure settings, including Microsoft Edge policies?",
  ["Settings catalog"],
  ["Custom OMA-URI", "Administrative templates (legacy)", "Imported GPO backup"],
  "The settings catalog is the current profile type. Templates and administrative templates are older, and custom OMA-URI is for settings with no UI.", L.baselines);
add(D2, LT5, "When do you fall back to a custom OMA-URI profile?",
  ["When no settings catalog or template entry exists for the CSP setting"],
  ["When you want to target a user group", "When you want a Microsoft-recommended set of values", "When the device is not enrolled"],
  "Custom profiles use the CSP path, data type and value directly. Use them only when a UI entry does not exist.", L.gpaMigrate);
add(D3, LT5, "Which per-setting results can a security baseline report? (Select four)",
  ["Matches baseline", "Does not match baseline", "Conflict", "Not applicable"],
  ["Pending approval", "Rolled back"],
  "Baselines report each setting as matches, does not match, conflict or not applicable.", L.baselines);
add(D2, LT5, "How do you see on the device which MDM policies were applied?",
  ["Access work or school > Info > Create report (Advanced Diagnostic Report)"],
  ["gpresult /r in an elevated prompt", "The Intune tenant status page", "Event Viewer > Windows Logs > Security"],
  "The Advanced Diagnostic Report lists applied MDM policies. gpresult only reports Group Policy.", L.gpa);
add(D2, LT5, "What input does Group Policy analytics need?",
  ["A GPO report exported as XML from a domain controller"],
  ["An .admx file from the central store", "A backup of the GPO folder from SYSVOL", "A registry export of the policy keys"],
  "Export with Get-GPOReport -ReportType Xml and import it. Intune shows which settings have an MDM equivalent.", L.gpa);

/* Lab 6 */
add(D4, LT6, "A Required app is assigned to GRP-Dev-Test, but it should install only on physical PCs. What do you add?",
  ["An assignment filter, include filtered devices, with device.model -ne \"Virtual Machine\""],
  ["A second dynamic group that replaces GRP-Dev-Test", "A scope tag for physical devices", "A compliance policy on device model"],
  "A filter narrows an existing assignment. Use a filter with Include and the matching rule.", L.filters);
add(D4, LT6, "Which statement about assignment filters is correct?",
  ["They narrow an existing include or exclude group assignment"],
  ["They replace the group in an assignment", "They apply only to the Uninstall intent", "They evaluate users instead of devices"],
  "A filter never replaces the group. It narrows who receives the assignment, with Include or Exclude mode.", L.filters);
add(D4, LT6, "A Win32 app installs fine on the VM, but Intune reports it as failed and retries. What is the likely cause?",
  ["The detection rule does not match what the installer creates"],
  ["The device is not in MDM scope", "The assignment intent is Available", "The app needs a scope tag"],
  "If detection does not find the app after install, Intune treats the install as failed. Fix the rule, such as the MSI product code or file path.", L.win32);
add(D4, LT6, "A Win32 installer returns an exit code that Intune does not recognize. Where do you handle it?",
  ["In the app's return codes"],
  ["In the requirement rules", "In the supersedence settings", "In the assignment filter"],
  "Return codes map exit codes to success, soft reboot, hard reboot, retry or failed.", L.win32);
add(D4, LT6, "App B must install only after 7-Zip is already on the device. Which Win32 feature do you use?",
  ["Dependencies"],
  ["Supersedence", "Requirement rules", "Return codes"],
  "Dependencies install other apps first. Supersedence replaces an older app.", L.win32Super);
add(D2, LT6, "The Enrollment Status Page must wait for one specific app before the user reaches the desktop. What do you set?",
  ["Block device use until all apps and profiles are installed, with Selected apps"],
  ["Show app and profile configuration progress only", "Assign the app with the Available intent", "Allow users to reset the device on failure"],
  "Blocking with Selected apps makes the ESP wait for those required apps.", L.esp);

/* Lab 7 */
add(D3, LT7, "A feature update policy and an update ring both set feature update behavior for a device. Which wins?",
  ["The feature update policy overrides the ring's feature deferral"],
  ["The ring always wins", "The most restrictive of the two", "Intune reports a conflict and blocks both"],
  "A feature update policy takes priority over the ring's feature deferral setting.", L.featurePol);
add(D3, LT7, "What are the maximum deferral periods you can set in an update ring?",
  ["30 days for quality updates and 365 days for feature updates"],
  ["7 days for quality updates and 90 days for feature updates", "60 days for quality updates and 180 days for feature updates", "14 days for quality updates and 30 days for feature updates"],
  "Quality deferral goes up to 30 days and feature deferral up to 365 days.", L.updRings);
add(D3, LT7, "How long can you pause quality updates in an update ring?",
  ["Up to 35 days"],
  ["Up to 7 days", "Up to 14 days", "Up to 90 days"],
  "A pause stops the updates for a limited time, up to 35 days.", L.updRings);
add(D3, LT7, "Windows update reports in Intune show no data. Which device setting must be on?",
  ["Windows diagnostic data at least Required"],
  ["BitLocker enabled", "Defender for Endpoint onboarding", "Microsoft Entra hybrid join"],
  "Update reports rely on diagnostic data. Turning it off stops reporting.", L.updOverview);
add(D3, LT7, "A critical security fix must install and restart devices quickly, regardless of the ring's deferral. What do you use?",
  ["An expedite quality update policy"],
  ["A feature update policy", "A pause on the ring", "A driver update policy"],
  "Expedite policies override deferrals and install on a short schedule.", L.qualityUpd);
add(D3, LT7, "You want admins to approve each driver before it is offered. Which approval method do you pick?",
  ["Manual in a Windows driver update policy"],
  ["Automatic with a deferral of 0 days", "Windows drivers set to Allow in a ring", "Pause the update ring"],
  "With manual approval, each new driver shows Needs review until an admin approves it.", L.driverPol);
add(D3, LT7, "A feature update policy targets a version older than the one on a device. What happens?",
  ["The device stays on its newer version. Intune does not downgrade"],
  ["The device rolls back at the next restart", "The device is wiped and reimaged", "The policy shows a conflict and is deleted"],
  "Feature update policies keep devices on the target version or higher. They do not downgrade.", L.featurePol);

/* Lab 8 */
add(D3, LT8, "Which directories can Windows LAPS back passwords up to in an Intune policy?",
  ["Microsoft Entra ID or Active Directory (or disabled)"],
  ["Intune only", "Azure Key Vault", "OneDrive for Business"],
  "The policy backup directory choices are Entra ID, Active Directory or disabled.", L.laps);
add(D3, LT8, "Before a LAPS policy can back up passwords to Entra ID, which tenant setting must be on?",
  ["Enable Microsoft Entra Local Administrator Password Solution in Device settings"],
  ["Users may join devices to Microsoft Entra", "Require multifactor authentication to register or join devices", "Microsoft Defender for Endpoint connector"],
  "The LAPS setting in Entra device settings must be Yes for the backup to work.", L.lapsEntra);
add(D3, LT8, "An admin used the managed local admin password and wants it changed right away. What do you run?",
  ["The Rotate local admin password device action"],
  ["Sync", "Wipe", "Fresh Start"],
  "The Rotate local admin password action generates a new password immediately instead of waiting for the policy age.", L.lapsDeploy);
add(D3, LT8, "Which settings are needed for silent BitLocker encryption on an Entra joined PC? (Select three)",
  ["TPM-only startup authentication", "Warning for other disk encryption turned off", "Allow standard users to enable encryption during Entra join"],
  ["A startup PIN of 6 digits", "A USB startup key"],
  "A PIN or key requires user interaction, so silent encryption needs TPM only. The warning must be off and standard users must be allowed.", L.bitlocker);
add(D3, LT8, "Which Intune report shows BitLocker encryption status across devices?",
  ["Devices > Monitor > Encryption report"],
  ["Device compliance dashboard", "Tenant status page", "Device cleanup rules"],
  "The Encryption report shows status and any readiness issues for each device.", L.bitlocker);
add(D3, LT8, "With the Defender policy applied, Set-MpPreference -DisableRealtimeMonitoring $true fails or reverts on the device. Why?",
  ["Tamper protection is enabled"],
  ["The attack surface reduction rule is in Block mode", "The firewall profile is on", "The device is hybrid joined"],
  "Tamper protection prevents local changes to Defender settings, even from an elevated shell.", L.baselines);
add(D3, LT8, "You want to see what an attack surface reduction rule would block, without blocking anything. Which mode?",
  ["Audit"],
  ["Block", "Warn only", "Not configured"],
  "Audit logs the events but does not block. Switch to Block once you review the results.", L.baselines);

/* Lab 9 */
add(D5, LT9, "A platform script already ran on a device. When does it run again?",
  ["When the script content or policy changes"],
  ["At every sync", "At every user sign-in", "Every 8 hours"],
  "A platform script runs once per device and again only when it changes. If it fails, the extension retries it for the next three check-ins.", L.platScripts);
add(D5, LT9, "A platform script is set with Run this script using the logged on credentials: No. Under which account does it run?",
  ["SYSTEM"],
  ["The signed-in user", "The enrolling user", "The local Administrator account"],
  "No means the system context. The lab's output file showed nt authority\\system.", L.platScripts);
add(D5, LT9, "A remediation ran, but the next detection finds the issue again. What status does Intune show?",
  ["Recurred"],
  ["Fixed", "Without issues", "Failed to run"],
  "Fixed means the issue was remediated. Recurred means the issue came back after remediation.", L.remediations);
add(D1, LT9, "Which parts make up an Intune role assignment? (Select three)",
  ["Admin groups", "Scope groups", "Scope tags"],
  ["Enrollment restrictions", "Compliance policies"],
  "An assignment ties a role to members (admin groups), what they manage (scope groups) and scope tags.", L.rbac);
add(D1, LT9, "A helpdesk user with a role assigned for scope tag Tag-A cannot see a device they should manage. What do you check first?",
  ["That Tag-A is applied to the device and the device is in the scope group"],
  ["That the device is hybrid joined", "That the helpdesk user is licensed for Defender", "That the device has a compliance policy"],
  "A role assignment only shows devices inside its scope groups and scope tags.", L.scopeTags);
add(D2, LT9, "Which device action removes company data and management but leaves personal data on the device?",
  ["Retire"],
  ["Wipe", "Delete", "Fresh Start"],
  "Retire removes company data. Wipe resets the device. Delete removes only the Intune record.", L.actions);
add(D2, LT9, "Which device action removes only the Intune record, not the device or its data?",
  ["Delete"],
  ["Retire", "Wipe", "Autopilot Reset"],
  "Delete removes the record from Intune. The device itself is left as it is.", L.actions);
add(D2, LT9, "Which wipe option returns the device to the user's sign-in screen and re-enrolls it after the reset?",
  ["Wipe device, but keep enrollment state and associated user account"],
  ["Wipe device and continue to wipe even if devices lose power", "Delete the device after the wipe", "Retire with the personal data option"],
  "Keeping enrollment state and the user account lets the device re-enroll after the reset.", L.actions);

/* Lab 10 */
add(D4, LT10, "Which app must be on an unenrolled Android phone for app protection policies to work?",
  ["Company Portal"],
  ["Microsoft Defender", "Microsoft Authenticator", "Microsoft Tunnel Gateway"],
  "Android app protection needs the Company Portal even without enrollment. On iOS it is not required.", L.mamCreate);
add(D4, LT10, "Which app protection setting stops screenshots of Outlook on Android?",
  ["Screen capture and Google Assistant: Block"],
  ["Encrypt org data: Require", "Backup org data to Android backup services: Block", "Restrict cut, copy and paste: Blocked"],
  "Screen capture and Google Assistant is the setting that blocks screenshots.", L.mamAndroid);
add(D4, LT10, "An app protection policy was assigned to a device group and has no effect. Why?",
  ["App protection policies target users, so assign to a user group"],
  ["App protection needs a compliance policy first", "App protection works only on enrolled devices", "The policy needs a scope tag"],
  "App protection policies apply to users, not devices, and work on unenrolled devices.", L.mamCreate);
add(D4, LT10, "You set the key com.microsoft.intune.mam.managedbrowser.homepage for Edge on unenrolled phones. Which policy type?",
  ["An app configuration policy of the Managed apps type"],
  ["An app configuration policy of the Managed devices type", "A device restrictions profile", "A compliance policy"],
  "Managed apps works through the app protection channel without enrollment. Managed devices needs an enrolled device.", L.appConfig);
add(D4, LT10, "What are the three data protection framework levels for app protection?",
  ["Basic, enhanced and high"],
  ["Low, medium and strict", "Bronze, silver and gold", "Standard, advanced and premium"],
  "The framework has level 1 basic, level 2 enhanced and level 3 high data protection.", L.mamCreate);

/* Lab 11 */
add(D1, LT11, "dsregcmd /status on a freshly domain-joined PC shows DomainJoined YES and AzureAdJoined NO (Pending). What happens next?",
  ["It completes hybrid join after the next sync and a sign-in or restart"],
  ["You must rejoin the PC to the domain", "You must run an Autopilot Reset", "The PC is joined to Entra only after a wipe"],
  "Hybrid join can stay Pending until Entra Connect syncs the device object and the device signs in again.", L.entraJoin);
add(D1, LT11, "A hybrid join stays Pending because the computer is in an OU that is not synced. What fixes it?",
  ["Include the OU in Entra Connect Domain and OU filtering, then run a delta sync"],
  ["Run the Intune Connector wizard again", "Add the user to GRP-Users-Pilot", "Create a new enrollment restriction"],
  "Device objects must be in a synced OU or hybrid join will not complete.", L.entraJoin);
add(D1, LT11, "What do domain-joined clients use to find your tenant for hybrid join?",
  ["The service connection point (SCP) that Entra Connect creates"],
  ["The Intune Connector for Active Directory", "A DNS TXT record on the public domain", "The MDM user scope setting"],
  "Entra Connect creates the SCP when you configure hybrid join in device options.", L.entraJoin);
add(D1, LT11, "Which Group Policy setting auto-enrolls hybrid joined devices into Intune?",
  ["Enable automatic MDM enrollment using default Microsoft Entra credentials, with User credential"],
  ["Allow Telemetry set to Required", "Configure device registration policy for Entra", "Turn off the MDM enrollment task"],
  "The GPO under Windows Components > MDM starts a scheduled task that enrolls the device using the user's Entra credentials.", L.gpoEnroll);
add(D1, LT11, "A hybrid joined device gets the same setting from Group Policy and Intune. By default, which applies?",
  ["Group Policy, unless MDM Wins Over Group Policy is set"],
  ["Intune MDM always wins", "The setting that was applied last", "Neither, the device reports a conflict"],
  "Learn says Group Policy takes precedence over MDM unless you set the policy that gives MDM precedence. Some lab guides say MDM wins, so know the setting.", L.gpoEnroll);
add(D1, LT11, "What does the account used by the Intune Connector for Active Directory need on the target OU?",
  ["Permission to create computer objects"],
  ["Membership in Domain Admins", "Membership in Enterprise Admins", "Read access to the domain root only"],
  "The connector creates the computer objects, so delegate Create computer objects on the OU.", L.hybridFlow);
add(D1, LT11, "A Windows 11 VM cannot join the domain, and its DNS server is 1.1.1.1. What is the fix?",
  ["Point DNS at the domain controller so the client can resolve the domain"],
  ["Enable automatic MDM enrollment", "Add the VM to GRP-Dev-Test", "Install the Intune Connector on the VM"],
  "A domain join needs the client to resolve the domain from DNS. Use the DC as its DNS server.", L.entraJoin);
add(D1, LT11, "A site uses Configuration Manager and wants to move compliance policies to Intune gradually. What do you use?",
  ["Co-management with workload sliders and a pilot collection"],
  ["The Intune Connector for Active Directory", "Autopilot user-driven hybrid join", "Group Policy analytics"],
  "Co-management lets you shift workloads one at a time and test with a pilot collection first.", L.gpoEnroll);

/* ===== Lab sequences ===== */
const LTS = 'Setup sequences';
addo(D1, LTS, "Place the steps in order to enroll a corporate Windows PC automatically when the user joins it to Entra ID. Some steps do not belong.",
  ["Set the MDM user scope to Some or All and include the user's group", "Make sure the user has an Intune license", "Start OOBE and choose Set up for work or school", "Sign in as the licensed user so the PC joins Entra ID and enrolls", "Confirm the PC shows as Corporate and Managed by Intune"],
  ["Register the hardware hash in Autopilot", "Create a provisioning package"],
  ["Enrollment is skipped for users out of scope", "Enrollment needs a license", "The join starts at OOBE", "The join and enrollment happen together", "Check the result in Devices > All devices"],
  "Scope and license come first. The join and enrollment then happen in one pass. Scope and license are interchangeable.", ML + 'intune/device-enrollment/windows/enable-automatic-mdm');
addo(D1, LTS, "Place the steps in order to bulk enroll PCs with a provisioning package. Some steps do not belong.",
  ["Install Windows Configuration Designer", "Choose Provision desktop devices and name the project", "Set the device name template", "Choose Enroll in Microsoft Entra ID and get a bulk token", "Create the package", "Apply the package on the device", "Confirm the device appears in Intune as Corporate"],
  ["Upload the hardware hash", "Assign an Autopilot deployment profile"],
  ["You need the app from the Store", "The wizard starts the project", "Names can include random characters or a serial", "The designer makes a temporary package_ account", "The output is a .ppkg file", "It can come from USB, a share or OOBE", "Bulk devices have no primary user"],
  "This is the wizard order. Windows automatic enrollment must be on first and the token account must be in the MDM user scope. The token is valid 90 days.", L.bulk);
addo(D4, LTS, "Place the steps in order to deploy a Win32 app. Some steps do not belong.",
  ["Package the installer as .intunewin with the Content Prep Tool", "Create the Windows app (Win32) and upload the package", "Set install and uninstall commands and install behavior", "Add requirement rules", "Add detection rules", "Assign the app with the Required intent", "Follow the install in IntuneManagementExtension.log"],
  ["Create an app protection policy", "Create a Managed Google Play approval"],
  ["The package must be wrapped first", "The app object comes next", "The Program tab holds the commands", "Requirements decide if the app applies", "Detection tells Intune if it is installed", "Assignment starts the deployment", "The log shows the install on the client"],
  "This follows the order of the Win32 app wizard.", L.win32);
addo(D1, LTS, "Place the steps in order to give a helpdesk team limited access to a set of devices. Some steps do not belong.",
  ["Create a security group for the helpdesk users", "Create a scope tag", "Apply the scope tag to the devices", "Create the Intune role with the permissions", "Assign the role with admin groups, scope groups and scope tags", "Sign in as a helpdesk user to test"],
  ["Create an enrollment restriction", "Assign a compliance policy to the helpdesk"],
  ["The assignment needs members", "The tag marks the scope", "The devices must carry the tag", "The role holds the permissions", "The assignment ties everything together", "Test last"],
  "The group, the tag and the role must exist before the assignment. Learn applies tags to devices and profiles after the role is set up; the order of those steps is flexible, but the assignment needs the role, the groups and the tag.", L.scopeTags);
addo(D2, LTS, "Place the steps in order to set up cloud-only user-driven Windows Autopilot (Microsoft Entra join). Some steps do not belong.",
  ["Set up Windows automatic Intune enrollment", "Allow users to join devices to Microsoft Entra ID", "Register the devices as Windows Autopilot devices", "Create a device group", "Configure and assign the Enrollment Status Page", "Create and assign the Windows Autopilot deployment profile", "Deploy the device"],
  ["Install the Intune Connector for Active Directory", "Configure and assign a domain join profile"],
  ["Automatic enrollment lets the join also enroll the device in Intune", "Users must be allowed to join devices to Microsoft Entra ID", "Intune needs the hardware hash to recognize the device", "The group will hold the Autopilot devices", "The ESP holds the user at setup until the device is configured", "The profile defines the join type and the out-of-box experience", "The user turns the device on and signs in with their Entra account"],
  "This is the order in the Learn Microsoft Entra join tutorial. Assigning the device to a user is an optional step before deployment. Creating the device group before registering the devices is interchangeable. The connector and the domain join profile belong to hybrid join only.", ML + 'autopilot/tutorial/user-driven/azure-ad-join-workflow');
addo(D2, LTS, "Place the steps Windows 365 completes automatically, in order, when it provisions a Cloud PC (core provisioning). Some steps do not belong.",
  ["Allocate Azure capacity", "Create the virtual machine", "Attach the VM to the network", "Join the device to Microsoft Entra ID (Entra join or hybrid join)", "Enroll the Cloud PC in Intune without user credentials", "Assign the user as the Intune primary user"],
  ["Register the hardware hash in Windows Autopilot", "Install the Intune Connector for Active Directory"],
  ["Capacity is allocated in the chosen region first", "The VM size comes from the Windows 365 license", "A virtual NIC is created and attached", "The device joins Microsoft Entra ID", "Enrollment happens after the Entra object exists", "This makes self-service and reporting work"],
  "These are the core provisioning steps in the Learn article on Windows 365 automated provisioning. After core provisioning come post-provisioning configuration changes, then assignment of the user to the Cloud PC. Autopilot registration and the Intune Connector are not part of Windows 365 provisioning.", L.w365Steps);
