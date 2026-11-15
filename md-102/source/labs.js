/* ===== Lab guide data (paraphrased from the user's MD-102 Intune Lab Guide) ===== */
const LABSETUP = {
  objects: [
    ['lab.user1, lab.user2, lab.helpdesk', 'Licensed users (M365 E5, or Intune plus Entra ID P1). Helpdesk gets a custom role in Lab 9.'],
    ['GRP-Users-Pilot', 'Assigned group: lab.user1 and lab.user2'],
    ['GRP-Dev-Windows', 'Dynamic device group: device.deviceOSType -eq "Windows"'],
    ['GRP-Dev-Autopilot', 'Dynamic device group: devicePhysicalIds -any (_ -startsWith "[ZTDId]")'],
    ['GRP-Dev-Autopilot-Kiosk', 'Dynamic device group: devicePhysicalIds -any (_ -eq "[OrderID]:LAB-KIOSK"), so the group tag is the order ID'],
    ['GRP-Dev-Test', 'Assigned group where you add the devices you want to target']
  ],
  vms: [
    ['W11-ENTRA', 'Entra joined, cloud only', 'Labs 1, 3, 4, 5, 6, 7, 8, 9'],
    ['W11-AP', 'Autopilot target, never joined by hand', 'Lab 2'],
    ['W11-BYOD', 'Registered personal device', 'Labs 1, 4'],
    ['DC01, W11-HYB, W11-AP2', 'Optional: domain controller plus two PCs on the LabNAT switch', 'Lab 11'],
    ['iPhone (your own)', 'Enrolled through the Company Portal; use Retire, never Wipe', 'Lab 12 (and Lab 10 on iOS)']
  ],
  tips: [
    'Prefix every policy, profile and app with LAB- so you can filter and delete them in one pass.',
    'Build each VM with Secure Boot and a vTPM, then checkpoint it at the first OOBE screen as Clean-OOBE.',
    'Keep the VMs on the Default Switch for Labs 1 to 10. Only Lab 11 needs the custom LabNAT switch.',
    'Keep one admin account out of every Conditional Access policy.'
  ],
  order: [
    'Lab 1 (enrollment) so you have an enrolled VM',
    'Lab 6 Part C (a Win32 app) so the Lab 2 ESP has a required app to wait for',
    'Lab 2 (Autopilot), then Lab 3 (provisioning package) on a clean VM',
    'Labs 4, 5, 7 and 8 on W11-ENTRA, enabling BitLocker in Lab 8 before you require it in Lab 4',
    'Lab 9 after Lab 8, so the helpdesk user can be tested against the LAPS password and BitLocker key',
    'Lab 10 on a phone or emulator at any point, Lab 12 on your enrolled iPhone, and Lab 11 (hybrid) last'
  ],
  reset: [
    ['1', 'Delete the device record', 'Intune: Devices > All devices'],
    ['2', 'Delete the device record', 'Entra ID > Devices > All devices'],
    ['3', 'Delete the Autopilot record (only if re-registering the hash)', 'Windows Autopilot devices list'],
    ['4', 'Revert to the Clean-OOBE checkpoint', 'Hyper-V Manager'],
    ['5', 'Check that group membership has caught up', 'Entra groups (dynamic rules take time)']
  ],
  tools: [
    ['dsregcmd /status', 'Join state, MDM URL, token and PRT status'],
    ['Access work or school > Info > Create report', 'The list of applied MDM policies'],
    ['MdmDiagnosticsTool.exe -area Autopilot -cab C:\\temp\\ap.cab', 'Autopilot and ESP diagnostics'],
    ['DeviceManagement-Enterprise-Diagnostics-Provider event log', 'Enrollment and policy processing errors'],
    ['IntuneManagementExtension.log', 'Win32 apps, platform scripts and remediations'],
    ['edge://policy', 'Edge policies actually applied'],
    ['Intune per-setting status', 'Conflicts, errors and not-applicable results']
  ],
  prep: [
    'Read the current MD-102 study guide first, because the skills measured change.',
    'After each lab, write a one-line answer to "what breaks if this is misconfigured" and compare it with the exam list.',
    'Practice reading a scenario and picking the policy type: compliance, configuration, endpoint security, app protection or app configuration.',
    'Know the portal path and the behavior. Case studies test why something did not apply more than where a toggle sits.'
  ]
};

const LABS = [
{ id:1, title:'Automatic MDM enrollment, restrictions and device limits', d:[1], time:'60 min', uses:'W11-ENTRA, W11-BYOD, lab.user1, lab.user2, GRP-Users-Pilot', topic:'Lab 1: Enrollment and restrictions',
  parts:[
    {t:'Part A: Turn on automatic enrollment', s:[
      'Entra ID > Mobility (MDM and MAM) > Microsoft Intune: set MDM user scope to Some and pick GRP-Users-Pilot. Leave MAM user scope at None.',
      'Boot W11-ENTRA, choose Set up for work or school, and sign in as lab.user1. The PC joins Entra and enrolls in one pass.',
      'Verify with dsregcmd /status (AzureAdJoined YES, MDMUrl present) and in Intune: Ownership Corporate, Managed by Intune.']},
    {t:'Part B: Enroll a personal device', s:[
      'On W11-BYOD use a local account, then Settings > Accounts > Access work or school > Connect and sign in as lab.user2. Do not pick the join option.',
      'Confirm Ownership Personal and join type Microsoft Entra registered.']},
    {t:'Part C: Enrollment restriction', s:[
      'Create a Windows restriction named LAB-Block-Personal-Windows: Windows (MDM) allowed, Personal devices Block.',
      'Assign to GRP-Users-Pilot and move it above the default policy.',
      'Revert W11-BYOD, delete its old records, repeat Part B: it should fail. Allow personal devices again and confirm it succeeds.']},
    {t:'Part D: Device limits', s:[
      'Create a Device limit restriction LAB-Limit-1 with limit 1, assigned to GRP-Users-Pilot above the default.',
      'Try to enroll W11-BYOD as lab.user1 as well: the second enrollment is refused. Raise the limit to 2 and retry.',
      'Open Entra ID > Devices > Device settings and note Maximum number of devices per user. It is a separate limit and both apply.']}
  ],
  brk:[
    'Remove lab.user1 from the MDM-scope group and do a fresh Entra join: the PC joins Entra but never shows as Intune-managed.',
    'Set Users may join devices to Microsoft Entra to Selected with nobody chosen and watch the join fail.',
    'Remove the Intune license and retry. Read the error, then check the DeviceManagement-Enterprise-Diagnostics-Provider Admin log.'],
  exam:[
    'MDM user scope: None, Some, All, and which is needed for automatic enrollment.',
    'Restrictions target user groups, not device groups. They evaluate by priority and the default policy is last.',
    'A device limit restriction allows 1 to 15 devices per user. A device enrollment manager account can enroll up to 1,000.',
    'Entra joined vs Entra registered vs hybrid joined, and which suit corporate or personal devices.']},
{ id:2, title:'Autopilot profiles, ESP and group tags', d:[1,2], time:'90 min', uses:'W11-AP, lab.user1, GRP-Dev-Autopilot, GRP-Dev-Autopilot-Kiosk', topic:'Lab 2: Autopilot and ESP',
  parts:[
    {t:'Part A: Register the VM', s:[
      'Boot W11-AP to the first OOBE screen, press Shift+F10, start PowerShell.',
      'Run Set-ExecutionPolicy -Scope Process Bypass, Install-Script Get-WindowsAutopilotInfo, then Get-WindowsAutopilotInfo -Online -GroupTag "LAB-KIOSK". Or export a CSV with -OutputFile and import it under Windows Autopilot > Devices > Import.',
      'Wait for the import and confirm the device shows with the LAB-KIOSK group tag.']},
    {t:'Part B: Groups and deployment profiles', s:[
      'Confirm the dynamic groups hold the VM (the group tag is stored as the order ID).',
      'Create LAB-AP-UserDriven (Windows PC): User-driven, Entra joined, hide license terms, privacy and change-account options, Standard user, name template LAB-%RAND:5% (15 characters max). Assign to GRP-Dev-Autopilot and exclude GRP-Dev-Autopilot-Kiosk.',
      'Create LAB-AP-Kiosk with the template KSK-%RAND:5% and assign it to GRP-Dev-Autopilot-Kiosk.',
      'Wait for Profile status to change from Unassigned to Assigned.']},
    {t:'Part C: Enrollment Status Page', s:[
      'Create LAB-ESP: show progress Yes, timeout 60 minutes, allow users to collect logs Yes.',
      'Block device use until all apps and profiles are installed: Yes, with Selected apps (add the Lab 6 app later).',
      'Assign to GRP-Users-Pilot and set its priority above the default ESP.']},
    {t:'Part D: Run the provisioning', s:[
      'Start W11-AP, set region and keyboard, connect to the network, and sign in as lab.user1 at the branded screen.',
      'Watch the ESP phases: device preparation, device setup, account setup.',
      'Check the computer name starts with LAB- and Intune shows Corporate.']}
  ],
  brk:[
    'Change the VM group tag and wait for group membership to move: the other profile applies.',
    'Remove the profile assignment and restart OOBE: it falls back to a normal OOBE.',
    'Make the ESP required app fail (bad detection rule) and watch the timeout and Collect logs option.',
    'Run MdmDiagnosticsTool.exe -area Autopilot -cab C:\\temp\\ap.cab and read the ModernDeployment-Diagnostics-Provider log.',
    'Optional: try Autopilot device preparation (no hardware hash; device group owned by the Intune Provisioning Client; works in a VM since there is no TPM attestation).'],
  exam:[
    'Which Autopilot modes work in a VM, and which need physical TPM attestation (self-deploying and pre-provisioning).',
    'Hybrid Entra join needs the Intune Connector for Active Directory and a domain join profile.',
    'Group tags drive dynamic group rules through the order ID attribute.',
    'ESP assignment, priority, blocking behavior and what happens on timeout.',
    'Delete an old device record from Intune and Entra ID before re-registering the same hardware.']},
{ id:3, title:'Bulk enrollment with provisioning packages', d:[1], time:'45 min', uses:'W11-ENTRA (reverted), host or helper machine', topic:'Lab 3: Provisioning packages',
  parts:[
    {t:'Part A: Prepare', s:[
      'Install Windows Configuration Designer from the Microsoft Store.',
      'Confirm automatic enrollment is on. Temporarily set MDM user scope to All if the package devices join Entra but never enroll.',
      'Revert W11-ENTRA to Clean-OOBE, delete the old records, and finish OOBE with a local account (disconnect the network adapter if Windows insists on a Microsoft account).']},
    {t:'Part B: Build the package', s:[
      'Choose Provision desktop devices and name the project LAB-Bulk.',
      'Set up device: name template such as LAB-%RAND:4%. Skip the product key and the network step.',
      'Account management: Enroll in Microsoft Entra ID, then Get Bulk Token and sign in. A temporary package_ account appears in the tenant.',
      'Skip apps and certificates, optionally password-protect, and Create. Note the .ppkg path.']},
    {t:'Part C: Apply it', s:[
      'Copy the file into the VM (guest services and Copy-VMFile).',
      'In the VM: Settings > Accounts > Access work or school > Add or remove a provisioning package > Add a package. The device renames, restarts, joins Entra and enrolls.',
      'Optional: at the first OOBE screen of a fresh VM press the Windows key five times to apply a package from removable media.']}
  ],
  brk:[
    'Apply the package to a device that is already Entra joined: it fails.',
    'Delete the package_ user in Entra ID and apply the package to a fresh VM: enrollment fails, which is how a token is revoked.',
    'Compare with an Autopilot device: look at the primary user and join account.'],
  exam:[
    'When a provisioning package beats Autopilot: no hardware hash, no user at the keyboard, devices already unboxed.',
    'Package contents (device name, Entra bulk join, Wi-Fi, apps, certificates) and delivery (USB, network share, email, OOBE).',
    'The bulk token expires and can be revoked. Learn pages show different lifetimes (90 and 180 days), so check the current value.',
    'Bulk-enrolled devices have no user affinity, so target device groups.']},
{ id:4, title:'Compliance policies plus Conditional Access', d:[3], time:'75 min', uses:'W11-ENTRA, lab.user1, GRP-Users-Pilot', topic:'Lab 4: Compliance and Conditional Access',
  parts:[
    {t:'Part A: Compliance policy', s:[
      'Create LAB-Compliance-Win (Windows 10 and later): Secure Boot, code integrity, minimum OS version at your current build, password, firewall, TPM, antivirus and antispyware Require. Add BitLocker after Lab 8.',
      'Actions for noncompliance: mark noncompliant at 0 days, send email after 1 day (needs a notification template), retire after 30 days.',
      'Assign to GRP-Users-Pilot. In Compliance policy settings, set Mark devices with no compliance policy assigned as to Not compliant and note the 30-day validity period.',
      'Verify on the device page under Device compliance. Force a Sync if needed.']},
    {t:'Part B: Conditional Access', s:[
      'Create LAB-CA-RequireCompliant: include GRP-Users-Pilot, exclude your admin, target Office 365, grant Require device to be marked as compliant, set Report-only.',
      'Sign in as lab.user1 in Edge to outlook.office.com, then check Entra sign-in logs, Conditional Access tab: Report-only: Success.',
      'Switch the policy to On and repeat: it still succeeds.']},
    {t:'Part C: Make it fail', s:[
      'Raise the minimum OS version above the VM build, sync, and wait for Not compliant.',
      'Sign in again: access is blocked with a "device must be compliant" message. Fix the setting, sync, and access returns.']}
  ],
  brk:[
    'Open the same site in Firefox: browsers that cannot pass device identity are treated as unknown devices.',
    'Unassign the compliance policy and see how Mark devices with no compliance policy changes the outcome.',
    'Set a 1-day noncompliance action to see the In grace period state.'],
  exam:[
    'Compliance sets pass/fail, Conditional Access enforces, a configuration profile pushes settings. Do not mix them.',
    'Compliance states: compliant, noncompliant, in grace period, not evaluated.',
    'The tenant-wide "no compliance policy" setting is what blocks brand-new devices under CA.',
    'Report-only mode, emergency-account exclusions, and reading the CA result in sign-in logs.',
    'Windows devices check in about every 8 hours after the initial rapid check-ins. An admin or user can force a sync.']},
{ id:5, title:'Configuration profiles, settings catalog and security baselines', d:[2,3], time:'75 min', uses:'W11-ENTRA, GRP-Dev-Test', topic:'Lab 5: Profiles and baselines',
  parts:[
    {t:'Part A: Settings catalog', s:[
      'Devices > Windows > Configuration > Create > New policy, Windows 10 and later, Settings catalog: LAB-Settings-Edge with Configure the home page URL and Show Home button enabled.',
      'Assign to GRP-Dev-Test, sync, open edge://policy and Reload policies: both settings show source Platform, status OK.']},
    {t:'Part B: Template and custom OMA-URI', s:[
      'Templates > Device restrictions (LAB-Restrict-Camera): Camera Block.',
      'Templates > Custom (LAB-Custom-AdID): OMA-URI ./Device/Vendor/MSFT/Policy/Config/Privacy/DisableAdvertisingId, Integer, value 1.',
      'On the VM create the Advanced Diagnostic Report (Access work or school > Info) and find both settings.']},
    {t:'Part C: Security baseline', s:[
      'Endpoint security > Security baselines > Security Baseline for Windows 10 and later: LAB-Baseline-Win. Assign to GRP-Dev-Test only, since baselines are strict.',
      'After check-in view Device status > per-setting status: Matches baseline, Does not match baseline, Conflict or Not applicable.',
      'Open Versions to see how a profile moves to a newer baseline version.']},
    {t:'Part D (optional): Group Policy analytics', s:[
      'Devices > Group Policy analytics > Import a GPO report XML (Get-GPOReport -All -ReportType Xml). Intune shows which settings have an MDM equivalent and can migrate supported ones to a settings catalog profile.']}
  ],
  brk:[
    'Create a second settings catalog profile with a different Edge home page for the same group and look for Conflict.',
    'Assign a user-based profile to a device group and a device-based profile to a user group, and predict the result.',
    'Remove an assignment: most CSP settings revert, custom OMA-URI settings may not.',
    'Check Devices > Monitor for configuration failures and the profile Device and user check-in status.'],
  exam:[
    'Settings catalog vs templates vs custom OMA-URI vs administrative templates: which is current, which is legacy, and when custom is needed.',
    'Security baseline statuses, and what Conflict means.',
    'Include and exclude assignments, user vs device groups, and how conflicts resolve.',
    'Group Policy analytics: what it can and cannot migrate.']},
{ id:6, title:'App deployment (Store, M365 Apps, Win32) and filters', d:[4], time:'90 min', uses:'W11-ENTRA, GRP-Dev-Test, GRP-Users-Pilot', topic:'Lab 6: App deployment and filters',
  parts:[
    {t:'Part A: Microsoft Store app (new)', s:[
      'Apps > Windows > Create > Microsoft Store app (new): Windows Terminal. Assign GRP-Dev-Test Required and GRP-Users-Pilot Available for enrolled devices.',
      'Sync the VM and confirm the install. Check that the available app shows in Company Portal for lab.user1.']},
    {t:'Part B: Microsoft 365 Apps', s:[
      'Create > Microsoft 365 Apps for Windows 10 and later (LAB-M365-Apps): Word, Excel and PowerPoint only, 64-bit, Current Channel, Remove other versions Yes.',
      'Assign Required to GRP-Dev-Test and wait for the large download.']},
    {t:'Part C: Win32 app (.intunewin)', s:[
      'Package the 7-Zip MSI with IntuneWinAppUtil.exe -c <source folder> -s <setup file> -o <output>.',
      'Create > Windows app (Win32), upload the .intunewin. Program: install command msiexec /i ... /qn, matching uninstall command, install behavior System.',
      'Requirements: 64-bit and a minimum Windows version. Detection rules: MSI product code, or a File rule for C:\\Program Files\\7-Zip\\7z.exe.',
      'Assign Required to GRP-Dev-Test and follow the install in IntuneManagementExtension.log.',
      'Add the app as a required app in LAB-ESP (Lab 2) and re-run Autopilot.']},
    {t:'Part D: Assignment filters', s:[
      'Tenant administration > Filters > Create (Windows 10 and later): LAB-Filter-VM (device.model -eq "Virtual Machine") and LAB-Filter-Physical (device.model -ne "Virtual Machine"). Use Preview devices.',
      'Edit the Win32 assignment: Include filtered devices with LAB-Filter-Physical (the app should not install), then LAB-Filter-VM (it installs). Try Exclude filtered devices too.']}
  ],
  brk:[
    'Use a wrong detection rule: the install works but Intune keeps reporting a failure and retries.',
    'Change the install command to return an unmapped exit code and look at Return codes.',
    'Add 7-Zip as a dependency of a second Win32 app and watch the install order.',
    'Create an Uninstall assignment for the app on the same group.'],
  exam:[
    'App types and which fits each case: Store, LOB, Win32, M365 Apps, web link.',
    'Win32 packaging, install context, detection vs requirement rules, return codes, dependencies, supersedence.',
    'Assignment intents: Required, Available for enrolled devices, Uninstall.',
    'A filter narrows an existing assignment and never replaces the group.']},
{ id:7, title:'Update rings, feature updates and driver updates', d:[3], time:'60 min', uses:'W11-ENTRA, GRP-Dev-Test, GRP-Dev-Windows', topic:'Lab 7: Windows updates',
  parts:[
    {t:'Part A: Update rings', s:[
      'Devices > Windows > Update rings > Create: LAB-Ring-Pilot, General Availability channel, Microsoft product updates Allow, quality and feature deferral 0 days, feature uninstall period 10 days.',
      'User experience: automatic install and restart at maintenance time, quality deadline 2 days, feature deadline 5 days, grace period 2 days. Assign to GRP-Dev-Test.',
      'Create LAB-Ring-Broad with a 7-day quality deferral for GRP-Dev-Windows, excluding GRP-Dev-Test.',
      'Verify: Windows Update shows "Some settings are managed by your organization" and the registry key HKLM:\\SOFTWARE\\Microsoft\\PolicyManager\\current\\device\\Update holds the values.']},
    {t:'Part B: Feature update policy', s:[
      'Feature updates > Create: LAB-Feature-Win11, newest Windows 11 version, Make update available as soon as possible, assign to GRP-Dev-Test.',
      'The policy takes priority over the ring feature deferral. Make sure Windows diagnostic data is at least Required, since update reports depend on it.']},
    {t:'Part C: Driver updates', s:[
      'Driver updates > Create: LAB-Drivers with Approval method Manual, assigned to GRP-Dev-Test. Review the Driver updates tab to approve, decline or pause. A Hyper-V VM often shows no candidates.']},
    {t:'Part D: Expedite and pause', s:[
      'Quality updates > Create profile and pick an Expedite release: it installs and reboots on a short schedule regardless of deferral.',
      'On LAB-Ring-Broad use Pause and note how long a pause can last.']}
  ],
  brk:[
    'Set the feature update policy to a version older than the VM: Intune does not downgrade.',
    'Assign the same device to two rings and look for the conflict in ring status.',
    'Run Get-WindowsUpdateLog to read scan history.'],
  exam:[
    'Update rings, feature update policies, quality (expedite) policies and driver update policies: what each controls.',
    'Deferral up to 30 days for quality and 365 for feature, pausing up to 35 days, deadlines and grace periods.',
    'A feature update policy overrides the ring feature deferral.',
    'Where reports live, and that update reporting needs Windows diagnostic data.'],
  flag:'The guide sets the ring setting "Windows drivers" to Block so only approved drivers are offered. Microsoft Learn says the opposite for driver update policies: keep the ring Windows driver setting on Allow, or the ring can block driver installs. For the exam, remember that a ring set to Block prevents drivers from installing.'},
{ id:8, title:'Windows LAPS, BitLocker and Defender policies', d:[3], time:'90 min', uses:'W11-ENTRA (vTPM on), GRP-Dev-Test', topic:'Lab 8: LAPS, BitLocker and Defender',
  parts:[
    {t:'Part A: Windows LAPS', s:[
      'Entra ID > Devices > Device settings: Enable Microsoft Entra Local Administrator Password Solution (LAPS) = Yes.',
      'Endpoint security > Account protection > Create > Windows > Local admin password solution: backup to Entra ID, age 30 days, complexity and length 14, automatic account management with custom account LABAdmin, post-authentication action reset password and log off.',
      'Assign to GRP-Dev-Test and sync. Check Event Viewer > LAPS > Operational, then Intune device > Local admin password > Show, and the device action Rotate local admin password.']},
    {t:'Part B: BitLocker', s:[
      'Endpoint security > Disk encryption > Create > Windows > BitLocker: Require device encryption Enabled, warning for other disk encryption Disabled, standard users may enable during Entra join Enabled, XTS-AES 256, save recovery info to Entra ID and require it first, client-driven recovery password rotation, startup authentication TPM only.',
      'Assign to GRP-Dev-Test. Verify with manage-bde -status C: and Get-BitLockerVolume, then the Encryption report and the device Recovery keys page.',
      'Now turn on Require BitLocker in the Lab 4 compliance policy.']},
    {t:'Part C: Defender policies', s:[
      'Antivirus > Microsoft Defender Antivirus: real-time and cloud-delivered protection on, PUA Block, quick scan schedule.',
      'Antivirus > Windows Security Experience with Tamper protection enabled. Attack surface reduction rule (for example block executable content from email) in Audit. Firewall on for all profiles.',
      'Verify with Get-MpPreference and Get-MpComputerStatus, test with the EICAR file, then switch the ASR rule from Audit to Block.']}
  ],
  brk:[
    'With tamper protection on, try Set-MpPreference -DisableRealtimeMonitoring $true: it fails or reverts.',
    'Add a startup PIN to the BitLocker policy: silent encryption stops on a new device.',
    'Set the same Defender value in a settings catalog profile and look for the conflict in endpoint security status.',
    'As a standard user try to read the LAPS password or BitLocker key to see the role boundary.'],
  exam:[
    'Windows LAPS backup directory (Entra ID, Active Directory or disabled), rotation, and which roles can read the password.',
    'Silent BitLocker needs an Entra joined or hybrid joined device with TPM 1.2+, UEFI, Secure Boot and WinRE, no startup PIN, the other-disk-encryption warning off, and the standard-user setting. Recovery keys are stored and viewed in Entra and Intune.',
    'Endpoint security policy families: antivirus, disk encryption, firewall, EDR, attack surface reduction, account protection.',
    'Audit vs block mode, tamper protection, and Defender for Endpoint onboarding through the connector.']},
{ id:9, title:'Scripts, remediations, RBAC with scope tags and device actions', d:[1,5], time:'90 min', uses:'W11-ENTRA, W11-BYOD, lab.helpdesk, GRP-Dev-Test', topic:'Lab 9: Scripts, RBAC and device actions',
  parts:[
    {t:'Part A: Platform script', s:[
      'Devices > Windows > Scripts and remediations > Platform scripts > Add: LAB-Script-Marker. Settings: logged-on credentials No, signature check No, 64-bit host Yes.',
      'Assign to GRP-Dev-Test and sync. Check the output file says nt authority\\system and follow the run in IntuneManagementExtension.log and Device status.',
      'A platform script runs again only when its content changes.']},
    {t:'Part B: Remediation', s:[
      'Remediations > Create script package LAB-Fix-Spooler: detection returns exit 0 when the Spooler runs and exit 1 when it is stopped; remediation runs Start-Service.',
      'Run in system context, 64-bit PowerShell, Daily or Hourly, assign to GRP-Dev-Test. Stop the service, then wait or use Run remediation.',
      'Read Overview: Fixed means remediated, Recurred means the issue returned.']},
    {t:'Part C: RBAC and scope tags', s:[
      'Create GRP-Helpdesk with lab.helpdesk, a scope tag LAB-Tag-A, and apply the tag to W11-ENTRA (Properties > Scope tags).',
      'Create the Intune role LAB-Helpdesk-Limited: Managed devices Read, Remote tasks Sync devices and Retire, Organization Read, Mobile apps and Device configurations Read. No wipe or delete.',
      'Assign the role: Admin groups GRP-Helpdesk, Scope groups GRP-Dev-Test, Scope tags LAB-Tag-A.',
      'Sign in as lab.helpdesk in an InPrivate window: limited menu, only the in-scope device, sync works, wipe is unavailable. Remove the tag and confirm access is lost.']},
    {t:'Part D: Device actions (take a checkpoint first)', s:[
      'Sync W11-ENTRA, Rename it (after restart), and Collect diagnostics.',
      'Retire W11-BYOD: removes company data and management, leaves personal data.',
      'Wipe W11-ENTRA with "keep enrollment state and associated user account" ticked (it returns to sign-in and re-enrolls), then with the option off.',
      'Compare Delete (removes only the Intune record, not the device) with Retire and Wipe. Try Bulk device actions against a group.']}
  ],
  brk:[
    'Make the platform script return a non-zero exit code and read the result.',
    'Set the remediation detection script to always exit 1 and watch the status become Recurred.',
    'Assign the helpdesk role with the wrong scope tag and see which devices appear.'],
  exam:[
    'Platform scripts (one-time run) vs remediations (scheduled detect and fix), both run by the Intune Management Extension.',
    'An RBAC assignment needs a role, members (admin groups), scope groups and scope tags.',
    'Built-in roles: Help Desk Operator, Policy and Profile Manager, Application Manager, Read Only Operator, Endpoint Security Manager and others.',
    'Wipe vs retire vs delete vs fresh start vs Autopilot Reset, and which removes only company data.']},
{ id:10, title:'App protection and app configuration policies', d:[4], time:'75 min', uses:'Android emulator or a real phone, lab.user1, GRP-Users-Pilot', topic:'Lab 10: App protection and app configuration',
  parts:[
    {t:'Part A: Set up the device', s:[
      'Android Studio emulator with a Google Play image (needs Windows Hypervisor Platform), sign in to the Play Store with a throwaway account.',
      'Install Outlook, Edge and the Company Portal (Android app protection needs Company Portal even without enrollment). On iOS you do not need it.']},
    {t:'Part B: App protection policy', s:[
      'Apps > App protection policies > Create > Android: LAB-APP-Android for Outlook and Edge.',
      'Data protection: back up to Android services Block, send and receive Policy managed apps, save copies Block, cut/copy/paste Policy managed apps, screen capture and Google Assistant Block, encrypt org data Require.',
      'Access: PIN Require, numeric, simple PIN Block, min length 6, recheck after 30 minutes. Conditional launch: max PIN attempts 5, offline grace period 720 minutes, jailbroken/rooted Block access.',
      'Assign to GRP-Users-Pilot. Verify PIN prompt, blocked paste into Notes, blocked screenshot, and Apps > Monitor > App protection status.']},
    {t:'Part C: App configuration policy', s:[
      'Apps > App configuration policies > Create > Managed apps: LAB-AppConfig-Edge, target Edge (Android), key com.microsoft.intune.mam.managedbrowser.homepage with a URL value. Assign to GRP-Users-Pilot.',
      'Managed apps works through the app protection channel with no enrollment. Managed devices type needs an enrolled device.']},
    {t:'Part D: Selective wipe and Conditional Access', s:[
      'Apps > App selective wipe > Create wipe request for lab.user1 and the device: the company account and data are removed.',
      'Create LAB-CA-RequireAPP: GRP-Users-Pilot, Office 365, Device platforms Android and iOS, grant Require app protection policy. Start in Report-only, then On, and test a browser sign-in on the phone.']}
  ],
  brk:[
    'Remove the Company Portal from the device and open Outlook: the policy cannot be evaluated.',
    'Enter the wrong PIN more times than Max PIN attempts allows.',
    'Change Send org data to other apps to All apps and test paste again.',
    'Assign the app protection policy to a device group and see why it does not apply.'],
  exam:[
    'App protection targets users, works without enrollment, and applies to specific apps. Configuration profiles and compliance policies need enrollment.',
    'Settings areas: data protection, access requirements, conditional launch. Know which blocks copy and paste and which wipes after offline days.',
    'Managed apps vs managed devices app configuration policies.',
    'Selective wipe vs device wipe, and the Conditional Access grant Require app protection policy.',
    'The three data protection framework levels: basic, enhanced and high.']},
{ id:11, title:'Hybrid join with Active Directory, Entra Connect and Autopilot', d:[1], time:'3 hours', uses:'DC01 (Server 2022), W11-HYB, W11-AP2, lab.user1. Do after Labs 1 to 5.', topic:'Lab 11: Hybrid join',
  parts:[
    {t:'Part A: Network and tenant domain', s:[
      'Verify the custom domain in the tenant first (Settings > Domains > Add domain, TXT record). If you cannot edit DNS, use the onmicrosoft.com suffix instead.',
      'Create an internal NAT switch LabNAT (192.168.50.0/24), connect DC01, give it a static address with DNS 127.0.0.1, and rename it.']},
    {t:'Part B: Build the domain', s:[
      'Install AD DS and DNS, promote the forest (ad.<your domain>). Add a DNS forwarder, add the public domain as a UPN suffix, create OUs (LabUsers, LabComputers) and a test user.',
      'Install DHCP so the Windows 11 VMs receive an address and DNS from DC01.']},
    {t:'Part C: Sync to Entra ID', s:[
      'Install Entra Connect on DC01 (fine for a lab): Customize, Password hash synchronization, connect the forest.',
      'Domain and OU filtering: select only LabUsers and LabComputers. Device objects must sit in a synced OU or hybrid join will not complete.',
      'Configure device options: Configure Hybrid Microsoft Entra join, Windows 10 or later domain-joined devices. This creates the service connection point (SCP).',
      'Force Start-ADSyncSyncCycle -PolicyType Delta and confirm the user shows On-premises sync enabled. License the user and add it to GRP-Users-Pilot.']},
    {t:'Part D: Hybrid join a Windows 11 VM', s:[
      'Create W11-HYB on LabNAT with a local account, confirm it gets an address and DNS from DC01, then Add-Computer into the LabComputers OU.',
      'Sign in as the domain user and run dsregcmd /status. It may first show DomainJoined YES and AzureAdJoined NO (Pending), then flips to YES after the next sync and sign-in or restart.',
      'In Entra ID the device shows Join type Microsoft Entra hybrid joined.']},
    {t:'Part E: Auto-enroll hybrid devices in Intune', s:[
      'On DC01 create a GPO LAB-MDM-Autoenroll linked to LabComputers: Administrative Templates > Windows Components > MDM > Enable automatic MDM enrollment using default Microsoft Entra credentials, Enabled, Credential type User credential.',
      'On W11-HYB run gpupdate /force and restart. Look for the enrollment task in Task Scheduler > Microsoft > Windows > EnterpriseMgmt.',
      'The device appears in Intune. The signed-in user must be in MDM user scope and licensed.']},
    {t:'Part F: Autopilot with hybrid join', s:[
      'Install the Intune Connector for Active Directory on DC01 (from Devices > Enrollment > Windows) and delegate Create computer objects on the LabComputers OU to the account the connector uses.',
      'Create a dynamic group GRP-Dev-Autopilot-Hybrid on order ID LAB-HYBRID and exclude it from LAB-AP-UserDriven.',
      'Create a Domain Join profile (computer name prefix HYB-, domain, OU) and an Autopilot profile LAB-AP-Hybrid: user-driven, Join to Microsoft Entra ID as Microsoft Entra hybrid joined. Assign both to the hybrid group.',
      'Register W11-AP2 on LabNAT with group tag LAB-HYBRID, start it, and sign in as the synced user. Extend the ESP timeout and run a delta sync if it seems stuck.',
      'Verify: a HYB- computer object in LabComputers, hybrid joined in Entra ID, managed in Intune.']}
  ],
  brk:[
    'Point W11-HYB DNS at 1.1.1.1 and try the domain join: it fails because the client cannot find the domain.',
    'Remove LabComputers from the Entra Connect OU filter, sync, and watch the device stay Pending.',
    'Create a user with an unverified UPN suffix and see which suffix it syncs with.',
    'Stop the Intune Connector service and start an Autopilot hybrid deployment: the domain join step fails at the ESP.',
    'Set a GPO that conflicts with an Intune setting and research which wins.'],
  exam:[
    'Entra joined vs hybrid joined vs registered, and why hybrid is chosen when devices still need AD resources.',
    'The pieces of hybrid join: Entra Connect, the SCP, OU filtering and device registration states.',
    'Automatic enrollment of hybrid devices by Group Policy, and the Intune Connector plus domain join profile for Autopilot hybrid.',
    'Co-management with Configuration Manager: workload sliders, pilot collections, cloud attach. You cannot build it in this lab, so learn it from the docs.',
    'Conflicts between Group Policy and MDM, and which wins.'],
  flag:'The guide says MDM wins over Group Policy. Learn says that when the same setting is in both, Group Policy takes precedence unless you set the policy that gives MDM precedence (MDM Wins Over Group Policy, ControlPolicyConflict). Answer exam questions with that caveat in mind.'}
,{ id:12, title:'Enrolled iPhone: compliance, restrictions and apps', d:[2,3], time:'75 min', uses:'Your own iPhone enrolled through the Company Portal, lab.user1, GRP-Users-Pilot. Use a lab tenant, never a client tenant.', topic:'Lab 12: iPhone enrollment',
  parts:[
    {t:'Part A: Confirm the enrollment', s:[
      'Intune admin center > Devices > iOS/iPadOS: find your iPhone, open it, and note the primary user, ownership, compliance state and last check-in.',
      'Run Sync from the device actions and watch Last check-in change. In the Company Portal app, open Settings and Check Status.']},
    {t:'Part B: Compliance policy', s:[
      'Devices > Compliance > Create policy > Platform iOS/iPadOS. Name it LAB-Comp-iOS.',
      'Device Health: Jailbroken devices Block. System Security: Require a password to unlock mobile devices Require, Simple passwords Block, Minimum password length 4.',
      'Assign it to GRP-Users-Pilot. After the next check-in, open the device and confirm it shows Compliant.']},
    {t:'Part C: Device restrictions profile', s:[
      'Devices > Manage devices > Configuration > Create > New policy > iOS/iPadOS > Templates > Device restrictions. Name it LAB-Restrict-iOS.',
      'General: Block screenshots and screen recording Yes. This setting applies to all enrollment types.',
      'Assign to GRP-Users-Pilot, sync, and try a screenshot on the phone. Then remove the assignment so your phone goes back to normal.']},
    {t:'Part D: App assignment intent', s:[
      'Apps > All apps > Add > iOS store app. Pick a free app, and assign it as Available for enrolled devices to GRP-Users-Pilot. Install it from the Company Portal app.',
      'Change the assignment to Required. For iOS store apps, a Required assignment also creates an Available intent, so the app still shows in the Company Portal.',
      'Try to add the Available assignment to a device group: Available works with user groups only.']},
    {t:'Part E: Software updates with DDM (build only)', s:[
      'Devices > Manage devices > Configuration > Create > New policy > iOS/iPadOS > Settings catalog. Name it LAB-DDM-Update.',
      'Add settings from Declarative Device Management > Software Update and read what each one controls.',
      'Do not assign this policy to your own phone. The point is to know where the settings live.']},
    {t:'Part F: Device actions and removal', s:[
      'Run Send custom notification and read it in the Company Portal app.',
      'When you finish the lab, run Retire. It removes company data, settings and the management profile, and leaves personal data. Do not run Wipe: it factory-resets the iPhone.',
      'After Retire, the Entra device record is not removed. Delete the stale record in Entra ID > Devices if you want a clean tenant.']}
  ],
  brk:[
    'Raise the minimum password length above your real passcode length and watch the device go Not compliant.',
    'Remove the compliance policy assignment and see what state the device shows (a compliance policy must be assigned for the device to evaluate).',
    'Assign the restrictions profile to a device group instead of the user group and check that it still applies to the enrolled phone.',
    'Remove lab.user1 from the MDM user scope and try a new enrollment.',
    'Unassign the restrictions profile and confirm that the screenshot restriction lifts after the next check-in.'],
  exam:[
    'Compliance policies are platform-specific, so iOS needs its own policy. Know the Device Health and System Security settings.',
    'Retire removes company data and the management profile and leaves personal data. Wipe is a factory reset. Delete removes the device from Intune and retires it.',
    'Available assignments target user groups. For iOS store apps, Required also creates Available.',
    'Settings catalog > Declarative Device Management > Software Update is how iOS and macOS updates are managed.',
    'Some device restriction settings apply to all enrollment types and others only to supervised or device-enrolled devices. Read the Settings apply to line.',
    'App protection with selective wipe also runs when you retire an enrolled device, for apps that have an app protection policy.']}
];
