/* ===== Devices > Monitor reports (Nov 15). Facts: Learn device-management/reports/overview, device-enrollment/monitor-reports, setup-time-grouping, monitor-encryption, ref-device-restrictions-apple, device-updates/apple/monitor-reports, autopatch management status report, autopilot reporting-monitoring and profiles, android-management-api-overview, security-update-status-dashboard. Panel is a mock-up of the report list, not a screenshot. ===== */
const N25 = "Devices > Monitor: what each report shows";
const RL = ML + 'intune/device-management/reports/overview';
const LK2 = { enr: ML + 'intune/device-enrollment/monitor-reports', etg: ML + 'intune/device-enrollment/setup-time-grouping', enc: ML + 'intune/device-configuration/endpoint-security/monitor-encryption', rest: ML + 'intune/device-configuration/templates/ref-device-restrictions-apple', apl: ML + 'intune/device-updates/apple/monitor-reports', ap: ML + 'windows/deployment/windows-autopatch/monitor/windows-autopatch-management-status-report', dp: ML + 'autopilot/device-preparation/reporting-monitoring', prof: ML + 'autopilot/profiles', amapi: ML + 'intune/device-enrollment/android/android-management-api-overview', cmp: ML + 'intune/device-security/compliance/ref-ios-ipados-settings' };
const RP2 = [['#', 'Devices > Monitor'],
  ['Apple software update failures', 'Updates'], ['Autopatch management status', 'Updates'], ['Certificates', 'Configuration'],
  ['Configuration policy assignment failures', 'Configuration'], ['Deployment status per Windows update ring', 'Updates'], ['Device actions', 'Other'],
  ['Device encryption status', 'Configuration'], ['Devices with restricted apps', 'Configuration'], ['Driver update policies with alerts', 'Updates'],
  ['Enrollment failures', 'Enrollment'], ['Enrollment time grouping failures', 'Enrollment'], ['Expedited quality update policies with alerts', 'Updates'],
  ['Feature update policies with alerts', 'Updates'], ['Noncompliant devices', 'Compliance'], ['Personal devices on Android Management API', 'Configuration'],
  ['Policies with noncompliant and error devices', 'Compliance'], ['Security update status', 'Security'], ['Windows Autopilot deployment status', 'Enrollment'],
  ['Windows Autopilot device preparation deployment status', 'Enrollment']];

addv(D1, N25, RP2, "Which report shows failed user enrollment attempts, including the failure reason, OS, OS version, username and enrollment method?",
  ["Enrollment failures"],
  ["Enrollment time grouping failures, because it lists every attempt that failed during enrollment by user", "Windows Autopilot deployment status, because it lists failed enrollment attempts for every platform", "Device actions, because it lists failed requests and the user who started each of them"],
  "Enrollment failures shows each failed enrollment attempt with the date, reason, OS, OS version, username and enrollment method. Select a row for the details and the recommended fix.", LK2.enr);
addv(D1, N25, RP2, "Devices enroll, but some fail to join the static security group set in the enrollment policy. Which report lists only those group failures?",
  ["Enrollment time grouping failures"],
  ["Enrollment failures, because a failure to join a group is counted as a failed enrollment", "Configuration policy assignment failures, because group joins are tracked as policy assignments", "Policies with noncompliant and error devices, because the missing group puts the device in error"],
  "The Enrollment time grouping failures report shows only failures to become a member of a static device group during setup. Missing the group can cause configuration to change or be removed after enrollment.", LK2.etg);
add(D1, N25, "Which TWO enrollment methods does the Enrollment time grouping failures report cover?",
  ["Windows Autopilot device preparation", "Apple automated device enrollment"],
  ["Android Enterprise personally owned work profile enrollment", "iOS/iPadOS account-driven user enrollment", "Windows enrollment through Settings > Access work or school"],
  "Learn lists Autopilot device preparation, Android Enterprise fully managed, corporate-owned work profile and dedicated, and Apple automated device enrollment.", LK2.etg);
add(D1, N25, "How long can it take for new data to show in the Enrollment time grouping failures report, and which RBAC permission is needed?",
  ["Up to 20 minutes, with Managed devices/Read"],
  ["Up to 24 hours, with Organization/Read", "Up to 4 hours, with Device configurations/Read", "Up to 7 days, with Enrollment programs/Read"],
  "Recently updated information can take up to 20 minutes to appear. You need the Microsoft.Intune/ManagedDevices/Read permission.", LK2.etg);
addv(D1, N25, RP2, "Which report is a summary of deployment details for Windows Autopilot enrolled devices over the last 30 days?",
  ["Windows Autopilot deployment status"],
  ["Windows Autopilot device preparation deployment status, because that one also covers 30 days of data", "Enrollment failures, because every Autopilot deployment is stored as one enrollment attempt", "Autopatch management status, because it lists the deployment details of all Windows devices"],
  "The Windows Autopilot deployments report gives deployment details for the last 30 days. It is for Autopilot (not device preparation), and only new Intune enrollment events create a record, so a reset that keeps enrollment does not appear.", LK2.prof);
add(D1, N25, "Which Autopilot activity does NOT create a record in the Windows Autopilot deployment status report?",
  ["A reset that keeps the device enrolled in Intune"],
  ["A new device that enrolls in Intune for the first time during OOBE", "A device that was deleted from Intune and then enrolled again", "A device that is reprovisioned and enrolls as a fresh Intune device"],
  "Only new Intune enrollment events trigger deployment records. Any reset that maintains enrollment, and the user portion of Autopilot pre-provisioning, is not shown. The report is also in preview.", LK2.prof);
addv(D1, N25, RP2, "You need near real-time status for a device preparation deployment, with the policy, apps and scripts. Which report is used?",
  ["Windows Autopilot device preparation deployment status"],
  ["Windows Autopilot deployment status, because it also shows apps and scripts in near real-time", "Enrollment time grouping failures, because it follows each device through group membership", "Device actions, because every deployment step is stored as a device action"],
  "Device preparation reporting is near real-time and shows the policy, Policy installation, Script installation and App installation phases, and the Success, Failed or In progress status.", LK2.dp);
add(D1, N25, "In the Autopilot device preparation report, which phase tracks Win32 and Microsoft Store apps?",
  ["App installation"],
  ["Policy installation", "Script installation", "Device registration"],
  "Policy installation is the initial setup and line-of-business apps, Script installation tracks scripts, and App installation tracks Win32 and Microsoft Store apps.", LK2.dp);
add(D1, N25, "An app shows Skipped in the Autopilot device preparation device details. What does Learn say this usually means?",
  ["It was chosen in the policy but not assigned to its device group"],
  ["It installed, and the report simply left out the install time for it", "It failed to install and Intune will retry it at the next check-in", "It was removed by the user before the deployment finished"],
  "Skipped usually means the app was selected in the device preparation policy but not assigned to the device group in that policy. It can also mean the app is not applicable to the device.", LK2.dp);
add(D1, N25, "What can you download from the device preparation deployment report for a failed deployment?",
  ["Diagnostic logs, collected when an error occurs"],
  ["A Windows Autopilot hardware hash file for the failed device", "The ESP profile that was assigned to the failed device", "A list of all the apps that the user has installed after OOBE"],
  "Diagnostics logs for failed deployments are available in the Device deployment details of a failed deployment.", ML + 'autopilot/device-preparation/whats-new');
add(D1, N25, "How does the Windows Autopilot device preparation report differ from the Windows Autopilot deployment report?",
  ["It shows all device preparation deployments in near real-time"],
  ["It shows only devices registered with Autopilot, and the data is not real-time", "It shows only user-driven deployments completed over the last 30 days", "It shows the same data but also includes each device hardware hash"],
  "Per Learn, the device preparation report shows all device preparation deployments with more data, near real-time. The Autopilot report only shows Autopilot registered devices and is not real-time.", ML + 'autopilot/device-preparation/compare');
addv(D1, N25, RP2, "Which report tracks personally owned work profile devices moving to Android Management API, with the states AMAPI, Not targeted to move, Move pending and Error?",
  ["Personal devices on Android Management API"],
  ["Enrollment failures, because moves that fail are counted as failed enrollment attempts", "Configuration policy assignment failures, because the move is delivered as a policy to devices", "Device actions, because each move is sent to the device as a requested device action"],
  "Use this report to follow migration progress. Reporting does not appear under the policy Device assignment status or on the device Device configuration tab.", LK2.amapi);
add(D1, N25, "Which statement about moving personally owned work profile devices to Android Management API is correct?",
  ["After a device moves, it cannot roll back to the old method"],
  ["Devices are unenrolled and must enroll again to finish the move", "Deleting the policy moves already migrated devices back to Company Portal", "Any Android version can be moved, since the Intune app handles the update"],
  "No unenrollment occurs. Devices must run Android 9 or later. If you unassign or delete the policy, devices that already moved keep using Android Management API.", LK2.amapi);

addv(D2, N25, RP2, "Which report shows encryption readiness, encryption status and TPM version for managed devices?",
  ["Device encryption status"],
  ["Noncompliant devices, because it lists the encryption setting that each device fails to meet", "Certificates, because the BitLocker recovery key is stored with the certificate details", "Devices with restricted apps, because it shows which disk tools are installed on each device"],
  "The Encryption report is also called Device encryption status. It lists device name, OS, OS version, TPM version (Windows only), Encryption readiness and Encryption status.", LK2.enc);
add(D2, N25, "A Windows PC shows Not ready for encryption readiness. What does Learn say?",
  ["It might still support encryption, but not silently by MDM"],
  ["It cannot be encrypted at all, so BitLocker must be turned off for it", "It is already encrypted, and Intune cannot see the state of the drive", "It must be wiped and enrolled again before encryption can be applied"],
  "Not ready means the device does not have full encryption capabilities, but might still support it. Ready needs an activated TPM for MDM encryption, though a TPM is not required to encrypt manually or through a setting that allows it without one.", LK2.enc);
add(D2, N25, "How long can it take for the Device encryption status report to show a device encryption state or a change to it?",
  ["Up to 24 hours"],
  ["Up to 30 minutes", "Up to 8 hours", "Up to 7 days"],
  "It can take up to 24 hours, including the time to encrypt plus the time for the device to report back. For FileVault, have the user sync the device after encryption completes to speed it up.", LK2.enc);
add(D2, N25, "On Windows, what does Encryption status in the encryption report look at?",
  ["Only whether the OS drive is encrypted"],
  ["Every fixed and removable drive, and it is Encrypted only if all are", "Only whether the recovery key is stored in Microsoft Entra ID", "Whether the TPM chip is version 2.0 and the drive is encrypted"],
  "Encryption status is whether the OS drive is encrypted. For Windows it does not look at other drives, such as fixed drives.", LK2.enc);
add(D2, N25, "Which operating systems does the Intune encryption report support?",
  ["macOS 10.13 or later and Windows 1607 or later"],
  ["Windows 11 only, plus macOS 14 or later with Apple silicon", "Windows, macOS, iOS/iPadOS and Android Enterprise", "Windows 10 1809 or later and Linux with an enrolled TPM"],
  "The report supports macOS 10.13 or later and Windows version 1607 or later. TPM version applies to Windows only.", LK2.enc);
addv(D2, N25, RP2, "Which report gives certificate thumbprints, issuance information and status?",
  ["Certificates"],
  ["Device encryption status, because it holds the recovery keys with the certificate thumbprint", "Configuration policy assignment failures, because a failed certificate profile shows the thumbprint", "Devices with restricted apps, because certificates are treated as restricted items on devices"],
  "The Certificates report (Operational) lets you review thumbprints, issuance info and status.", RL);
addv(D2, N25, RP2, "Which report lists devices where users installed one or more restricted apps?",
  ["Devices with restricted apps"],
  ["Noncompliant devices, because installing a restricted app always marks the device noncompliant", "Device actions, because the install of a restricted app is stored as a requested action", "Configuration policy assignment failures, because the restricted apps profile failed on those devices"],
  "A device configuration restricted apps list does not block installs. Devices that have such apps populate the Devices with restricted apps report in Devices > Monitor.", LK2.rest);
add(D2, N25, "A device restrictions profile uses Prohibited apps. What happens when a user installs one of those apps?",
  ["The user is not blocked, and the device is reported in Intune"],
  ["The install is blocked and the app is removed at the next sync", "The app is hidden from the user but kept on the device", "The device is retired from Intune and the user is notified"],
  "Restricted apps settings create lists and report. They do not stop installs or runs. To block, use a settings catalog policy with Allow Listed or Blocked App Bundle IDs.", LK2.rest);
add(D2, N25, "A profile with the restricted apps setting is assigned. To what must it be assigned?",
  ["User groups, not device groups"],
  ["Device groups, not user groups", "Dynamic device groups only", "Any group type, but only with an assignment filter"],
  "Device profiles that use restricted app settings must be assigned to user groups, not device groups.", LK2.rest);
add(D2, N25, "How does the iOS/iPadOS compliance setting Restricted apps differ from the device restrictions version?",
  ["Compliance marks the device noncompliant if an app is installed"],
  ["Compliance blocks the install of the app, and restrictions only report it", "Compliance only applies to apps that Intune deployed to the device", "Compliance works through the Devices with restricted apps report only"],
  "In a compliance policy, a restricted app from the bundle ID list marks the device noncompliant. It applies to unmanaged apps installed outside of management context.", LK2.cmp);
addv(D2, N25, RP2, "Which report lists configuration profiles with the number of devices in an error or conflict state?",
  ["Configuration policy assignment failures"],
  ["Policies with noncompliant and error devices, because it shows policies that have devices in error", "Device actions, because a failed profile is recorded as a requested action on each device", "Noncompliant devices, because a profile conflict makes the settings of the device noncompliant"],
  "The Assignment failures report (also named Configuration policy assignment failures) shows profiles with devices in error or conflict. Security baselines and endpoint security profiles are in it, told apart by the Policy type column.", RL);
addv(D2, N25, RP2, "Which report lists requested device actions and their status, such as who initiated them and when?",
  ["Device actions"],
  ["Configuration policy assignment failures, because it lists each action that was taken on a profile", "Enrollment failures, because a wipe or retire is counted when the device re-enrolls", "Noncompliant devices, because noncompliant devices are the ones with actions requested"],
  "Device actions gives the id, Device Name, User ID, IMEI, Action Status, Initiated By and Date/Time. It holds data for the past 180 days.", RL);
add(D2, N25, "How far back does the Device actions report go?",
  ["180 days"],
  ["30 days, the same as the Autopilot deployments report", "90 days, the same as app protection data retention", "365 days, a full year of device action history"],
  "Learn notes the Device actions report contains data for the past 180 days. The Autopilot deployments report keeps 30 days and app protection data keeps at least 90 days.", RL);
add(D2, N25, "A Delete action on an MDM device shows Completed in the Device actions report. What does that mean?",
  ["Server side is done; the device may not have finished Retire"],
  ["The device confirmed the wipe and all company data is now removed", "The device was removed from Entra ID and from the Autopilot service", "The action is queued and will run when the device next checks in"],
  "For MDM devices, Delete hides the device and starts a Retire. Completed means the process is complete on the server side, not that the client finished the Retire.", RL);

addv(D2, N25, RP2, "Which report shows, for each Windows update ring, the number of devices with successful or failed updates?",
  ["Deployment status per Windows update ring"],
  ["Autopatch management status, because it counts how many devices each update ring has", "Feature update policies with alerts, because it shows the devices that failed each ring", "Security update status, because the risk of each ring is shown with the devices that are behind"],
  "Per update ring deployment state (Operational) is also called Deployment status per Windows update ring.", RL);
addv(D2, N25, RP2, "Which report lists feature update policies with one or more Windows devices that have alerts, and needs data collection set up first?",
  ["Feature update policies with alerts"],
  ["Deployment status per Windows update ring, because it is the report that needs diagnostic data", "Expedited quality update policies with alerts, because it also covers feature updates", "Driver update policies with alerts, because driver updates are delivered with feature updates"],
  "Before the Feature update failures report shows data, data collection must be configured for the Windows feature updates reports. It is for devices targeted by a Feature updates for Windows 10 and later policy.", RL);
add(D2, N25, "Which TWO Monitor reports list Windows update policies that have devices with alerts?",
  ["Driver update policies with alerts", "Expedited quality update policies with alerts"],
  ["Apple software update failures, which covers iOS, iPadOS and macOS", "Deployment status per Windows update ring, which counts by ring", "Autopatch management status, which is an inventory of devices"],
  "The driver and expedited quality reports list policies with one or more Windows devices that have those alerts. The Apple report covers iOS, iPadOS and macOS.", RL);
addv(D2, N25, RP2, "Which report shows update failures on iOS, iPadOS and macOS devices, with the failure reason and the time of the last failure?",
  ["Apple software update failures"],
  ["Feature update policies with alerts, because it lists failed updates for every OS in the tenant", "Deployment status per Windows update ring, because each Apple device is placed in a ring", "Security update status, because it covers update currency on Windows and Apple devices"],
  "Apple software update failures is the operational report in Devices > Monitor. Apple software update reporting needs iOS/iPadOS 17 or later and macOS 14 or later, and the organizational report is under Reports > Device management > Apple updates.", LK2.apl);
addv(D2, N25, RP2, "Which report is a tenant-wide inventory of Intune-managed Windows devices, including those that no update policy targets?",
  ["Autopatch management status"],
  ["Deployment status per Windows update ring, because it lists each device that has an update ring", "Security update status, because it shows the number of devices in each risk level", "Device actions, because every managed Windows device has at least one requested action"],
  "It shows content-type enrollment (feature, quality, driver), the mechanism (cloud policies, update rings or other), hotpatch readiness and alerts. It helps find devices that fell through the cracks.", LK2.ap);
addv(D2, N25, RP2, "Which report answers Where am I at risk for Windows client, Windows Server and Microsoft 365 Apps updates?",
  ["Security update status"],
  ["Deployment status per Windows update ring, because it shows the risk of each ring and its devices", "Autopatch management status, because it shows which devices are missing the update", "Feature update policies with alerts, because it shows the risk level of each feature update"],
  "In Devices > Monitor, the dashboard gives Current, Exposed and Critical counts, refreshed every six hours. It is a snapshot for triage, not for root cause.", ML + 'intune/device-security/security-update-status-dashboard');

addv(D4, N25, RP2, "Which Monitor report is the operational list of noncompliant devices that a helpdesk uses to find and fix problems?",
  ["Noncompliant devices"],
  ["Policies with noncompliant and error devices, because it lists each noncompliant device with the policy", "Configuration policy assignment failures, because noncompliant devices are the ones with failures", "Devices with restricted apps, because noncompliant devices are the ones with restricted apps"],
  "Devices > Monitor > Noncompliant devices is the operational report. It supports filtering, searching, paging and sorting, and you can drill down to troubleshoot.", RL);
addv(D4, N25, RP2, "Which report lists compliance policies that have one or more noncompliant devices or devices with errors?",
  ["Policies with noncompliant and error devices"],
  ["Noncompliant devices, because it lists the policies that each noncompliant device fails", "Configuration policy assignment failures, because compliance policies are in that list too", "Device actions, because each error on a policy is stored as a requested device action"],
  "This is the Policy noncompliance report (Operational). Helpdesk and admin roles use it to find problems to remediate.", RL);
add(D4, N25, "Which report shows the noncompliant setting and the policy it comes from for all targeted devices at once?",
  ["Reports > Device compliance > Noncompliant devices and settings"],
  ["Devices > Monitor > Policies with noncompliant and error devices", "Devices > Monitor > Configuration policy assignment failures", "Reports > Device compliance > Devices without compliance policy"],
  "The organizational report shows the noncompliant setting, the noncompliant policy and settings in error for each device, so you do not check each device Device compliance view.", RL);
add(D4, N25, "Devices without compliance policy shows devices with no compliance policy. Which tenant-wide setting does Learn recommend changing?",
  ["Mark devices with no compliance policy assigned as Not compliant"],
  ["Compliance status validity period (days), set to a much longer number of days", "Enhanced jailbreak detection, turned on for all devices", "Mark devices with no compliance policy assigned as Compliant"],
  "By default a device with no assigned policy is marked Compliant. Learn recommends Not compliant so that untargeted devices stand out.", RL);

add(D2, N25, "Which report types does Intune use to describe its reports?",
  ["Operational, Organizational, Historical and Specialist"],
  ["Operational, Tactical, Strategic and Archival reports of data", "Real-time, Daily, Weekly and Monthly refresh reports", "Device, User, App and Policy focused reports of data"],
  "Operational gives timely, targeted data to act on. Organizational is a broader summary, Historical shows patterns and trends, and Specialist uses raw data for custom reports.", RL);
add(D2, N25, "Which built-in Intune role is the least privileged one that can view the report data?",
  ["Read Only Operator"],
  ["Help Desk Operator", "Policy and Profile Manager", "School Administrator"],
  "Learn names Read Only Operator as the least privileged built-in role with permission to review the report data.", RL);
addv(D2, N25, RP2, "Which TWO of these reports are tagged Enrollment in the Monitor list?",
  ["Enrollment time grouping failures", "Windows Autopilot device preparation deployment status"],
  ["Certificates, which is tagged Configuration in the list", "Device encryption status, which is tagged Configuration too", "Noncompliant devices, which is tagged Compliance in the list"],
  "Enrollment time grouping failures and the two Autopilot reports carry the Enrollment tag, along with Enrollment failures. Certificates and encryption are tagged Configuration.", RL);
