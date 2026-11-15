/* ===== DOMAIN 5: Optimize endpoint operations ===== */
const T51 = 'Endpoint analytics and Remediations', T52 = 'Security Copilot and agents', T53 = 'Monitoring and reports', T54 = 'Troubleshooting';

add(D5, T51, "You want a proactive script that detects a stopped service on Windows PCs and restarts it, on a schedule, with detection and remediation scripts. What do you deploy?",
  ["A Remediation (proactive remediation) script package"],
  ["A Win32 app with a detection rule", "A platform script that runs once", "A compliance script with a custom rule"],
  "Remediations pair a detection script with a remediation script, run on a schedule, and report results. Platform scripts only run once per device or user.", L.remediations);

add(D5, T51, "A detection script returns exit code 1. What does the Remediation package do?",
  ["It runs the remediation script, because 1 means the issue was detected"],
  ["It marks the device compliant", "It skips the remediation script", "It retires the device"],
  "Detection scripts return 0 for 'without issue' and 1 for 'with issue'. Exit 1 triggers the remediation script.", L.remediations);

add(D5, T51, "You want to run a remediation immediately on one device from the admin center, outside the schedule. Which action?",
  ["Run remediation (preview) from the device's page"],
  ["Sync", "Collect diagnostics", "Autopilot Reset"],
  "The on-demand 'Run remediation' device action executes a chosen remediation script package on a single device.", L.runRemed);

add(D5, T51, "Endpoint analytics gives each device a score. Which score measures how long Windows takes to boot and sign in?",
  ["Startup performance"],
  ["Work from anywhere", "Application reliability", "Resource performance"],
  "Startup performance covers boot and sign-in time. Work from anywhere measures cloud readiness, and Application reliability measures app crashes.", L.endpointAnalytics);

add(D5, T51, "Which Endpoint analytics report helps you decide whether your Windows PCs are ready for cloud management and Windows 11?",
  ["Work from anywhere"],
  ["Startup performance", "Battery health only", "Proactive remediations only"],
  "Work from anywhere summarizes Windows readiness, cloud identity, cloud management and cloud provisioning across your PCs.", L.endpointAnalytics);

add(D5, T52, "You use Security Copilot in Intune to answer an admin question about why a compliance policy fails on a device. What does it give you?",
  ["A summary of the device and policy data with suggested next steps"],
  ["An automatic wipe of the device", "A new tenant-wide policy created without approval", "A license assignment for the user"],
  "Security Copilot in Intune summarizes policies, devices and errors, and helps explain differences and troubleshoot. It does not act without the admin.", L.copilotIntune);

add(D5, T52, "Which three Intune agents have been retired and should not be part of a new operations plan? (Select three)",
  ["Device Offboarding Agent", "Change Review Agent", "Policy Configuration Agent"],
  ["Vulnerability Remediation Agent", "Conditional Access Optimization Agent"],
  "The Device Offboarding Agent retired June 1, 2026. The Change Review Agent and Policy Configuration Agent went away after Aug 31, 2026. Always check Learn for the current agent list.", L.agents);

add(D5, T52, "A Security Copilot agent proposes a fix for a vulnerable app on many devices. Before it runs, what should an admin do?",
  ["Review the recommended action and approve it"],
  ["Nothing. Agents act on their own with no review", "Retire all affected devices", "Disable Conditional Access"],
  "Agents recommend or take scoped actions inside permissions you grant and show their work for review. Admins stay accountable for approvals.", L.agents);

add(D5, T53, "Which Intune report shows devices that have not checked in for a set number of days, for cleanup?",
  ["Device cleanup rules"],
  ["Tenant status", "The app install status report", "Windows Autopatch cohorts"],
  "Device cleanup rules delete stale device records after a set number of days without check-in. The Devices list can also be filtered by last check-in.", L.adminTasks);

add(D5, T53, "How do you rename Windows devices consistently at enrollment, such as CORP-<serial>?",
  ["Use a device name template in the Autopilot deployment profile (classic) or in a device naming policy"],
  ["Run the Rename device action on each device", "Edit the Entra device name by hand", "Use a compliance policy"],
  "Name templates (for example CORP-%SERIAL%) apply at Autopilot enrollment for Entra joined devices. Rename device in the console has limits on supported platforms.", L.rename);

add(D5, T53, "Which tool collects the logs from a managed Windows device to a zip you can download in Intune?",
  ["Collect diagnostics"],
  ["Sync", "Fresh Start", "Run query"],
  "Collect diagnostics gathers logs from the device and makes them available to download from the device's page.", L.actions);

add(D5, T54, "A Win32 app deployed to a group shows Failed with a detection error 0x87D1041C. What does the error most likely mean?",
  ["The app was installed, but the detection rule did not find it"],
  ["The device is not enrolled", "The license is missing", "The MDM push certificate expired"],
  "0x87D1041C means that the app installed but the detection rule was not satisfied after install. Check the rule and the log in IntuneManagementExtension.", L.ime);
