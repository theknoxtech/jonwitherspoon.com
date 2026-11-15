/* ===== Apps > Monitor reports (Nov 15). Facts: Learn app-management overview, discovered-apps, monitor-assignments, protection/monitor-policies, manage-vpp-apple, configuration/overview, device-security/security-update-status-dashboard. Panel is a mock-up of the report list (name and category), not a screenshot. ===== */
const N24 = "Apps > Monitor: what each report shows";
const AM = ML + 'intune/app-management/';
const LK = { ov: AM + 'overview', disc: AM + 'discovered-apps', asg: AM + 'monitor-assignments', pol: AM + 'protection/monitor-policies', vpp: AM + 'deployment/manage-vpp-apple', cfg: AM + 'configuration/overview', sec: ML + 'intune/device-security/security-update-status-dashboard', inv: AM + 'deployment/enhanced-app-inventory' };
const RP = [['#', 'Apps > Monitor'], ['App configuration status', 'Configuration'], ['App install status', 'Other'], ['App licenses', 'Other'], ['App protection status', 'Security'], ['Discovered apps', 'Inventory'], ['Security update status', 'Security']];

addv(D3, N24, RP, "An admin wants a software inventory of the apps detected on enrolled devices, including apps users installed themselves on corporate devices. Which report fits?",
  ["Discovered apps"],
  ["App install status, because it lists every app on a device with its version, publisher and platform", "App licenses, because it reports the apps detected on devices that hold a purchased license", "App configuration status, because it reports the configuration state of each detected app for a user"],
  "Discovered apps is the tenant software inventory. It is a separate report from the app install reports, which only cover apps that Intune assigned.", LK.disc);
addv(D3, N24, RP, "Which report lists apps with their version, publisher and platform, plus install and failure totals for devices and users?",
  ["App install status"],
  ["Discovered apps, because it lists the apps found on devices along with the install and failure totals", "App licenses, because it shows how many installs and failures each purchased app has reported", "App protection status, because it lists each protected app with its version and the check-in failures"],
  "App install status gives Version, Publisher and Platform, plus install and failure totals for devices and users. It can be sorted and searched.", LK.asg);
addv(D3, N24, RP, "A helpdesk admin picks one user and wants to see which app protection policies reached that user, with each policy status and last sync. Which report is used?",
  ["App protection status"],
  ["App configuration status, because it lists the policies applied to a chosen user and their sync times", "Discovered apps, because it shows every app on the devices of that user, with the policy name", "App install status, because it shows the policy status of each app assigned to the chosen user"],
  "Apps > Monitor > App protection status shows the status of app protection policies for a user that you select.", LK.pol);
addv(D3, N24, RP, "Which report provides details about the configuration state of each app based on the user?",
  ["App configuration status"],
  ["App protection status, because it reports the state of every policy per user and per app", "App install status, because it reports the state of every app assignment for the user", "Security update status, because it reports the configuration state of each app on a device"],
  "Learn describes App Configuration status as details about the configuration state of each app based on user.", LK.ov);
addv(D3, N24, RP, "Which report is used to view, assign and monitor volume-purchased apps from the app stores?",
  ["App licenses"],
  ["App install status, because volume-purchased apps are tracked together with every other assigned app", "Discovered apps, because purchased apps show up there with the count of devices using a license", "App configuration status, because purchased apps need a policy per license that is monitored there"],
  "App licenses is where you view, assign and monitor volume-purchased apps, such as Apple VPP apps.", LK.ov);
addv(D3, N24, RP, "Which report answers the question Where am I at risk across Windows client, Windows Server and Microsoft 365 Apps updates?",
  ["Security update status"],
  ["App install status, because it summarizes update installs and failures for every workload", "Discovered apps, because it shows which app versions are out of date on each enrolled device", "App protection status, because it shows the patch version of every device and the update risk"],
  "The Security update status dashboard is a fleet-wide view of security update currency for Windows client, Windows Server and Microsoft 365 Apps. Use it for triage, not root cause.", LK.sec);

add(D3, N24, "How often does the Discovered apps report normally refresh for a device?",
  ["Every seven days from its enrollment date"],
  ["Every 24 hours for the whole tenant at once, at a set time of day", "Every four hours, in line with the device check-in interval", "Only when an admin selects Sync on the device in the admin center"],
  "The report refreshes every seven days for each device, starting from its enrollment date. It is not a weekly refresh for the whole tenant. Win32 app data from the Intune Management Extension is collected every 24 hours.", LK.disc);
add(D3, N24, "Which Discovered apps data comes in every 24 hours instead of every seven days?",
  ["Win32 app information collected by the Intune Management Extension"],
  ["Apps installed from the Microsoft Store on any enrolled Windows device", "Apps on iOS and iPadOS devices that are enrolled with user affinity", "Apps on Android Enterprise work profile devices only"],
  "The only exception to the seven-day cycle is Win32 application information that the Intune Management Extension collects every 24 hours.", LK.disc);
add(D3, N24, "What does Discovered apps collect from a personally owned device?",
  ["Managed apps only, because unmanaged apps are never collected"],
  ["Every app on the device, so that admins can review the full personal app list", "Only the apps that carry an app protection policy and have checked in recently", "Nothing at all, because personal devices are left out of the report"],
  "For personal devices Intune never collects unmanaged apps. On corporate devices any app, managed or not, is collected.", LK.disc);
add(D3, N24, "Which TWO details does the Discovered apps report show?",
  ["Device count", "Application publisher"],
  ["Install failure total per app", "Compliance state of each device", "Last sync time of each app instance"],
  "The report gives Application name, Platform, Application version, Device count and Application publisher. Failure totals belong to App install status.", LK.disc);
add(D3, N24, "How can an admin take the Discovered apps list out of the admin center?",
  ["Select Export to save it to a .csv file"],
  ["Run the report again from Reports > Export and pick a .xlsx file", "Copy it with the Download backup option on the Apps overview", "It can only be read in the console, so a Graph request is the one way"],
  "You can export the list of discovered apps to a .csv file by selecting Export in the Discovered apps pane.", LK.disc);
add(D3, N24, "An admin changes the targeting of an app that is already installed. The install count in App install status drops, but the app still shows in Discovered apps. Why?",
  ["Discovered apps is inventory, so the app stays while the device still has it"],
  ["A bug means the report was not refreshed, and the app is removed from it after a restart", "The app was uninstalled from the device and the inventory still shows the old record", "Intune keeps a copy of the app in the report until the license is revoked"],
  "Learn lists changing targeting as one reason the counts differ: the install count decrements, but the app remains in detected apps. The two reports are also collected at different intervals.", LK.disc);
add(D3, N24, "Which enrollment type does not display discovered apps?",
  ["Android Open Source Project (AOSP)"],
  ["Android Enterprise personally owned work profile", "iOS/iPadOS devices enrolled with Automated Device Enrollment", "Windows devices that are joined to Microsoft Entra ID"],
  "AOSP enrollments do not show discovered apps. On work profile devices, system apps are reported even when the user does not see them in the Work tab.", LK.disc);
add(D3, N24, "Learn calls a newer Windows feature the intended long-term replacement for Discovered apps. It collects data several times a day and adds install location, size and uninstall commands. What is it?",
  ["App inventory"],
  ["Endpoint analytics", "Windows Autopatch reports", "App install status"],
  "App inventory is the intended long-term replacement for Discovered apps on Windows devices that need faster refresh cycles and richer app metadata.", LK.inv);

add(D3, N24, "In the App protection status report, which column identifies one unique user, app and device that checked in?",
  ["App Instance ID"],
  ["MDM device ID", "Microsoft Entra Device ID", "Policy name"],
  "App Instance ID is the string that identifies a unique user + app + device that has checked in. MDM device ID and Entra device ID only appear when the device is enrolled or joined.", LK.pol);
add(D3, N24, "How long is App protection status data kept?",
  ["A minimum of 90 days of check-ins"],
  ["Seven days, which matches the refresh cycle of the other app reports", "30 days, after which the app instance must register again", "For as long as the policy exists, with no limit on age"],
  "App protection data is retained for a minimum of 90 days. Any app instance that checked in to the service in the past 90 days is in the report.", LK.pol);
add(D3, N24, "In the App protection status report, what does the Last sync column show?",
  ["When Intune last saw the app instance"],
  ["When the policy was last edited by an admin in the admin center", "When the user last signed in to the device with a work account", "When the device last reported its compliance state to Intune"],
  "Last sync is the time Intune last saw the app instance. The in-console user status report updates instantly, while the exportable .csv report can lag 1 to 30 minutes.", LK.pol);
add(D3, N24, "A user was just targeted with an app protection policy but does not appear in the reports. What does Learn say?",
  ["It can take up to 24 hours for a newly targeted user to show up"],
  ["The user must be targeted again through a device group before reports can list them", "The report only shows users after the app is wiped and signed in again", "Reports update only when an admin selects Generate report"],
  "Learn notes that a newly targeted user can take up to 24 hours to show in reports. App protection policies are assigned to user groups, not device groups.", ML + 'troubleshoot/mem/intune/app-protection-policies/troubleshoot-app-protection-policy-deployment');
add(D3, N24, "Where do you start to review the app protection policies applied to one affected user?",
  ["Apps > Monitor > App protection status, then select the user"],
  ["Devices > All devices, then open the device and select Device compliance", "Reports > Device compliance, then filter on the app name and the user", "Apps > All apps, then open the app and select Device install status"],
  "Use Apps > Monitor > App protection status, pick a tile such as Assigned users or User status, then Select user. Note the policy, device type, check-in status and last sync.", ML + 'troubleshoot/mem/intune/app-protection-policies/troubleshoot-app-protection-policy-deployment');
add(D3, N24, "An app protection policy was deleted. What does a Global Administrator see in the report, compared with a scoped admin?",
  ["Not available as the name; scoped admins see nothing"],
  ["Nothing for either role, because deleted policies are purged from the report", "The full policy name for both roles, until the 90-day retention ends", "The policy name for scoped admins only, because Global Administrators see device data"],
  "When you delete a policy, scoped admins no longer see app instances tied to it. Global Administrators still see the policy listed as not available.", LK.pol);
add(D3, N24, "Which column in App protection status holds the date of the last security patch on an Android device?",
  ["Android patch version"],
  ["Platform version, which is the OS version of the device", "Device model, with the manufacturer of the phone", "App version of the protected app on the device"],
  "Android patch version is the date of the last Android Security Patch the device received. Platform version is the OS version, and iOS SDK version is the iOS MAM SDK in the app.", LK.pol);
add(D3, N24, "On iOS 16 and later, what is unusual about the Device Name in app protection reports?",
  ["It shows a generic device name"],
  ["It is blank until the user signs in to the Company Portal app", "It shows the serial number in place of the name", "It is the Microsoft Entra device ID of the device"],
  "For iOS 16 and later the Device Name in all app protection reports is a generic name, because of an Apple change.", LK.pol);

add(D3, N24, "Where do you see per-device install results for ONE app?",
  ["Apps > All apps > select the app > Device install status"],
  ["Apps > Monitor > App install status, then filter on the device name", "Devices > Monitor > Discovered apps for that single app", "Apps > Monitor > App licenses, then select the app"],
  "App install status in Monitor is the list of apps. For a single app, open it from All apps and use Device install status or User install status.", LK.asg);
add(D3, N24, "Which statuses does the Device and user status graph show for an app?",
  ["Installed, Not installed, Failed, Install pending, Not applicable"],
  ["Compliant, Noncompliant, In grace period, Not evaluated, Error, Unknown", "Succeeded, Error, Conflict, Pending, Not applicable, Remediated", "Protected, Unprotected, Wiped, Blocked, Not checked in, Retired"],
  "Those five states appear on the app overview. Succeeded, Error and Conflict belong to configuration policy check-in status.", LK.asg);
add(D3, N24, "Apps from the Microsoft Store or Android store are deployed as Available. What does Learn say about their install status?",
  ["They do not report install status"],
  ["They report Installed only after the user opens the app once", "They report Install pending until the next seven-day refresh", "They report like required apps, with a Failed count per device"],
  "Microsoft Store and Android Store apps deployed as Available do not report their installation status.", LK.asg);
add(D3, N24, "A Managed Google Play app is on a personally owned work profile device. What can you see in Intune?",
  ["The app status and version number on the device"],
  ["Nothing, because personal devices send no app data to Intune", "The full list of personal apps, along with their versions", "Only whether the app protection policy was applied to it"],
  "For Managed Google Play apps on Android Enterprise personally owned work profile devices, you can view the status and version number of the installed app.", LK.asg);

add(D3, N24, "How often do managed apps check in for app configuration policy status when an app protection policy is also assigned?",
  ["Every 30 minutes, or 720 without a protection policy"],
  ["Every 720 minutes in all cases, no matter which policies are assigned", "Every 8 hours when a policy is assigned, and every 24 hours when not", "Every 30 minutes in all cases, because the SDK checks for wipe at that pace"],
  "Managed apps check in every 30 minutes for app configuration status when deployed with an app protection policy. Without one, the interval is 720 minutes.", LK.cfg);
add(D3, N24, "Where do you confirm which app configuration policies reached one device?",
  ["Devices > All devices > the device > App configuration"],
  ["Apps > Monitor > Discovered apps, then select the device", "Apps > Monitor > App licenses, then filter on the device name", "Endpoint security > Security baselines > Profiles for the device"],
  "The device App configuration pane lists the assigned policies and their state. Device install status on the app is another check.", LK.cfg);

add(D3, N24, "On the Security update status dashboard, devices behind on the latest security update past the first three days or so are shown as what?",
  ["Exposed"],
  ["Critical", "Unknown build", "Not checked in"],
  "Current covers the latest update or a short grace period. Exposed starts roughly three days after a new update. Critical is a week or longer behind, or an unsupported version.", LK.sec);
add(D3, N24, "How does the Security update status dashboard treat a device that has not checked in for 90 days or more?",
  ["It is left out of the main risk calculation"],
  ["It is counted as Critical, because it cannot be checked", "It is removed from Intune and its record is deleted", "It is counted as Current, until the device checks in again"],
  "Devices not checked in for 90+ days appear outside the primary status calculation so stale data does not distort active risk.", LK.sec);
add(D3, N24, "How often does the Security update status dashboard refresh its data?",
  ["Every six hours"],
  ["Every hour, matching the diagnostic data upload", "Every seven days, like Discovered apps", "Every 24 hours at midnight UTC"],
  "The last updated timestamp reflects a dashboard refresh that occurs every six hours.", LK.sec);
add(D3, N24, "Which TWO things can the Security update status dashboard NOT do?",
  ["Show historical trends", "Remediate devices from the dashboard"],
  ["Show Windows Server update status", "Show Microsoft 365 Apps update status", "Show the number of devices in each risk level"],
  "It is a snapshot with no trend history, no third-party update visibility, and no remediation. Use Intune, Autopatch or Configuration Manager for that.", LK.sec);
add(D3, N24, "Which workloads does the Security update status dashboard cover?",
  ["Windows client, Windows Server, Microsoft 365 Apps"],
  ["Windows client, iOS/iPadOS and Android Enterprise devices", "Windows client and macOS devices, based on enrollment", "Microsoft Edge, Office on mobile and Windows Server roles"],
  "The primary workloads are Windows client, Windows Server and Microsoft 365 Apps. It is supported in the public cloud only.", LK.sec);
add(D3, N24, "Which Intune RBAC permission is the minimum to view the Security update status dashboard?",
  ["Organization/Read"],
  ["Managed devices/Read", "Device configurations/Read", "Reports/Read for Windows Autopatch"],
  "An account needs at least Organization/Read, from a built-in or custom role.", LK.sec);

add(D3, N24, "A VPP app has 100 licenses and is assigned to a group of 500 users. What happens?",
  ["The first 100 get licenses, and the rest fail"],
  ["Intune blocks the assignment until the license count is raised", "All 500 users get the app, with the extra seats billed later", "The first 100 are installed and the rest wait in Install pending"],
  "Intune admins can oversubscribe an app. Members beyond the license count fail on license assignment.", LK.vpp);
add(D3, N24, "At what point does Intune show an alert in the Enrollment alerts tab for VPP licenses?",
  ["At 50% or more of total licenses used"],
  ["When used licenses reach 100% of the total for an app", "When fewer than 10 licenses remain for any single app", "When a token is within 30 days of its expiry date"],
  "The alert appears when used licenses are 50% or more of the total, and clears when usage drops below 50%.", LK.vpp);
add(D3, N24, "What must be done before you can revoke a VPP app license from a user or device?",
  ["Remove the app assignment"],
  ["Delete the VPP token from Intune", "Retire the device from Intune management", "Set the app to Available for enrolled devices"],
  "Removing the assignment is a prerequisite. Then use Revoke license, and set the assignment to Uninstall to also remove the app. Deleting a token revokes licenses but does not uninstall apps.", LK.vpp);
add(D3, N24, "A user leaves and is deleted from Microsoft Entra ID. What happens to their VPP app licenses?",
  ["Intune revokes them"],
  ["They stay assigned until an admin revokes them", "They are reclaimed when the device is retired from Intune", "They move to the next user in the same group"],
  "Intune revokes app licenses when the user is deleted from Entra ID. Licenses are not reclaimed just because a device is removed from Intune management.", LK.vpp);

addv(D3, N24, RP, "A manager asks how many devices have an app that is not on your deployment list, and who publishes it. Which report do you open?",
  ["Discovered apps"],
  ["App install status, because it lists the publisher and platform of the apps in the tenant", "App licenses, because it counts the devices that hold each app that was purchased", "App protection status, because it shows each app instance with its version and device"],
  "Discovered apps lists Application name, Platform, Version, Device count and Publisher for every detected app, including ones that Intune never assigned.", LK.disc);
addv(D3, N24, RP, "Users report that an assigned in-house app failed to install on several devices. Which report gives you the failure totals by app first?",
  ["App install status"],
  ["Discovered apps, because it shows the failures reported by every device for each app", "App configuration status, because it shows the failed installs per user for each app", "App licenses, because a failed install is counted as a license that was used up"],
  "App install status shows install and failure totals per app. Then open the app and use Device install status or User install status to see which devices or users failed.", LK.asg);
