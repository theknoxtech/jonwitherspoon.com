/* ===== Balance pass: keep the correct answer from being the longest option ===== */
fix(3, ["Set the MDM user scope for Microsoft Intune to Some or All in Entra"],
  ["Create an Autopilot deployment profile and assign it to each user", "Deploy the Company Portal app to every device before first sign-in", "Upload each device's hardware hash into Intune before it is joined"]);
fix(4, ["Deploy the GPO that enables automatic MDM enrollment with default Entra credentials"],
  ["Run dsregcmd /leave on every device, then rejoin it to the Entra tenant", "Install the Intune Connector for Active Directory on a domain controller", "Create a Configuration Manager boundary group for each AD site you manage"]);
fix(6, ["An Apple MDM push certificate and an ADE token from Apple Business Manager"],
  ["Only an Apple MDM push certificate in Intune, with no extra tokens needed", "A VPP token from Apple Business Manager plus a Managed Google Play binding", "An Apple Configurator profile signed by your internal certificate authority"]);
fix(9, ["A Samsung Knox Mobile Enrollment profile that points to Intune"],
  ["A Windows Autopilot deployment profile assigned to the devices' group", "An Apple Automated Device Enrollment token synced from the reseller", "A QR code that a technician scans on every device during first setup"]);
fix(11, ["Nothing yet. The change applies to new enrollments only"],
  ["Intune retires the oldest device right away to stay under the new cap", "Intune retires all four devices of that user at the next device sync", "Intune blocks the user's sign-in everywhere until a device is removed"]);
fix(12, ["The user removes one of their enrolled devices", "You raise the limit in the device limit restriction"],
  ["Renew the Apple MDM push certificate and re-enroll all of the user's devices", "Block personal iOS devices in a platform restriction at higher priority", "Reassign the user's Intune license and wait 24 hours for it to apply"]);
fix(13, ["A role assignment with Chicago scope groups and a Chicago scope tag"],
  ["Intune Administrator, with a filter that matches the city name", "Separate Intune tenants for each office location, linked by a partner role", "The Reports Reader role in the Entra admin center, scoped to Chicago"]);
fix(15, ["Use a security group and add it directly to an Intune role assignment"],
  ["Make the approvers members of the Global Administrator role in Entra", "Convert the group into a mail distribution list so requests are emailed", "Nest the approvers inside a dynamic device group for their own devices"]);
fix(16, ["Wipe, retire and delete device actions", "Compliance policies"],
  ["App protection policies for iOS and Android", "Enrollment restriction policies for each platform", "Conditional Access policies in Entra ID"]);
fix(17, ["A different admin in the approver group, then the requester completes it"],
  ["The same Global Administrator, since that role bypasses the approval step", "Any admin who holds the Intune Administrator role, even if not an approver", "No one. Global Administrators are exempt from Multi Admin Approval"]);
fix(18, ["Mark devices with no compliance policy assigned as: Not compliant"],
  ["Compliance status validity period (days), set to a very low number", "Enhanced jailbreak detection, enabled for all compliance policies", "A grace period of zero days configured on each compliance policy"]);
fix(19, ["They have no Intune compliance state, so the grant is not satisfied"],
  ["Their users lack Entra ID P2 licenses, which the compliance grant needs", "Compliance evaluation only applies to Android and iOS, not Windows", "They need an app protection policy assigned before compliance can apply"]);
fix(20, ["Devices > Enrollment > Windows Hello for Business, as a tenant-wide default"],
  ["A BitLocker policy under Endpoint security, targeted at all devices", "The Enrollment Status Page profile assigned to all devices and users", "A device compliance policy that contains the Windows Hello rules"]);
fix(21, ["Remote tasks: Rotate Local Admin Password, through a custom Intune role"],
  ["Managed devices: Wipe, through the built-in Help Desk Operator role", "Security baselines: Read, through the Endpoint Security Manager role", "Organization: Delete, through a scope tag assigned to the user"]);
fix(22, ["No. The stored password is lost with the device object"],
  ["Yes, from the Entra recycle bin during the 30-day soft delete window", "Yes, an Intune Administrator can restore it from the device record", "Yes, if the device rejoins Entra with exactly the same device name"]);
fix(23, ["Endpoint security > Account protection > Local user group membership"],
  ["A compliance policy that requires membership of an administrator group", "A platform script that runs for every signed-in user at each logon", "Group Policy Preferences delivered from on-premises Active Directory"]);
fix(24, ["Windows Autopilot device preparation with a device preparation policy"],
  ["Windows Autopilot self-deploying mode with a deployment profile", "Windows Autopilot pre-provisioning with the technician flow", "Windows Autopilot for existing devices through Configuration Manager"]);
fix(25, ["A static device group with the Intune Provisioning Client as owner"],
  ["A dynamic device group based on the device serial number prefix", "A Microsoft 365 group that contains both the device and the user", "An Entra administrative unit created for each site or building"]);
fix(27, ["Register the device hardware hash and assign a deployment profile to it"],
  ["Create a device preparation policy and assign it to the user's group", "Install the Company Portal app on the PC before it ships to the user", "Run a Microsoft Entra Connect sync cycle for the device's hardware ID"]);
fix(29, ["Self-deploying mode with Microsoft Entra join, which requires TPM 2.0 attestation"],
  ["User-driven mode with Microsoft Entra registered join, using a local admin", "Pre-provisioning with Microsoft Entra hybrid join and user affinity", "Autopilot Reset with local credentials stored on the kiosk itself"]);
fix(30, ["Autopilot Reset from Intune"],
  ["Retire from the device's page", "Delete the device record", "Collect diagnostics, then reboot"]);
fix(31, ["Enrollment Status Page with 'Block device use until required apps are installed'"],
  ["A Win32 app deployed with the Available assignment intent to the user", "A compliance policy that has a grace period of several days set", "A Windows Hello for Business enrollment policy with a PIN requirement"]);
fix(32, ["Windows Backup for Organizations, with the restore page in the Enrollment Status Page"],
  ["OneDrive Known Folder Move only, which restores apps and settings too", "A Win32 app that runs a robocopy script to copy the profile data", "Windows Autopilot self-deploying mode with an extra profile for settings"]);
fix(33, ["The restore needs a prior backup from a device the same user had signed in on"],
  ["Windows Backup only works on Windows 10 and not on Windows 11 devices", "The restore feature runs only on hybrid joined PCs in the same domain", "A device compliance policy must be assigned before a restore is offered"]);
fix(36, ["Use a bulk device action on the group for the Restart device action"],
  ["Run the Restart action on each device one at a time from its page", "Create a platform script that runs shutdown /r on every device", "Deploy a new update ring with a deadline of zero days for restarts"]);
fix(37, ["BitLocker key rotation on the managed device"],
  ["Sync the device so it uploads its keys again", "Restart the device so it creates a new key", "Rename the device to refresh its escrow record"]);
fix(38, ["Export the GPO as XML and import it into Group Policy analytics"],
  ["Run gpresult on each client and email the results to the security team", "Deploy the GPO to Entra joined devices through a Win32 app wrapper", "Create a security baseline profile for each GPO you want to compare"]);
fix(39, ["Import the custom ADMX files into Intune and configure the settings from the imported template"],
  ["Copy the files into C:\\Windows\\PolicyDefinitions on every device by script", "Use a Win32 app to install the ADMX files and nothing else on the PC", "Enable the setting through an app configuration policy for managed apps"]);
fix(41, ["An assignment filter based on device ownership"],
  ["A scope tag set on the profile for corporate devices", "A dynamic user group based on department", "A compliance notification template for owned devices"]);
fix(43, ["A feature update policy that targets the pilot group at the chosen version"],
  ["A quality update policy with an expedite release for the pilot group", "An update ring with a feature update deferral set to zero days", "A compliance policy that requires the new Windows OS version number"]);
fix(46, ["A provisioning policy that uses an Azure network connection (your own virtual network)"],
  ["A provisioning policy that uses a Microsoft-hosted network connection", "A shared Azure Virtual Desktop host pool joined to the on-premises domain", "A hybrid join with a classic VPN profile installed only on the Cloud PC"]);
fix(47, ["A Windows 365 license assigned to the user", "A provisioning policy assigned to a group the user is in"],
  ["An Autopilot deployment profile assigned to the user's group", "A VPP token assigned to the user's Apple ID", "A Microsoft Entra Domain Services managed domain"]);
fix(49, ["The Remote Help add-on or Intune Suite license for both the helper and the sharer"],
  ["Only an Entra ID P1 license, held by the person giving the help", "A Microsoft 365 E3 license held by the person sharing their screen only", "No extra license is needed, because Remote Help ships in Intune Plan 1"]);
fix(50, ["Device query (KQL) from the device's page"],
  ["A compliance policy with a custom script rule", "A remediation script scheduled hourly on the device", "Endpoint analytics startup performance reports"]);
fix(52, ["Collect properties through a Properties catalog policy"],
  ["Wipe the device, then re-enroll it to refresh inventory", "A CSP policy that turns on WMI collection on the device", "Sync the device and wait for the default inventory cycle"]);
fix(55, ["It is marked noncompliant after the grace period and the actions for noncompliance run"],
  ["It is retired from Intune automatically at once, with no grace period", "It is excluded from Conditional Access evaluation until it is fixed", "Intune resets the password remotely to a value that meets the rule"]);
fix(56, ["The device has not checked in yet, so its compliance state is still evaluating"],
  ["iPadOS devices are not supported by Intune device compliance policies", "Conditional Access ignores the compliance state for tablet devices", "The user needs a Windows license before iPadOS devices can be evaluated"]);
fix(57, ["Enhanced jailbreak detection"],
  ["Require a passcode on the device", "Restricted apps list for iOS", "Minimum OS version requirement"]);
fix(58, ["A security baseline profile, such as Windows 10 and later security baseline"],
  ["A Win32 app that carries a settings.ini file for each hardening step", "A custom OMA-URI profile created for every individual setting", "An app protection policy for Windows with data protection options"]);
fix(59, ["It keeps running on its version. You must change the profile to the newer version yourself"],
  ["It updates to the latest baseline version automatically at the next sync", "It is deleted and then recreated by Intune with the newer version", "All of its settings reset to Not configured until you assign it again"]);
fix(61, ["Conflict for that setting"],
  ["Success from both policies", "Not applicable on the device", "Pending for seven days"]);
fix(62, ["An Endpoint security disk encryption policy, with the recovery key escrowed to Entra"],
  ["A compliance policy alone, which turns BitLocker on automatically at sync", "A Win32 app that runs manage-bde from a script, with keys left on the PC", "A Windows Hello for Business policy that enables the TPM and the PIN"]);
fix(63, ["In the device's Recovery keys page in Intune, or in Entra ID"],
  ["In the Autopilot device record in the Devices > Enrollment area", "In the device's compliance report under the policy that was failed", "In the Windows Update report for the device's quality update ring"]);
fix(64, ["Rotate the BitLocker recovery key from Intune"],
  ["Wipe the device and enroll it again", "Retire the device from management", "Delete the Entra device object"]);
fix(65, ["Enable the Microsoft Defender for Endpoint connector in Intune, and deploy an EDR onboarding policy"],
  ["Install the Company Portal on each PC and ask users to onboard it manually", "Create a custom Intune role for Defender and assign it to each device owner", "Join each PC to a hybrid domain so the onboarding package applies by GPO"]);
fix(66, ["A compliance policy that sets the maximum allowed machine risk score, plus a CA policy that requires compliant devices"],
  ["An app protection policy for the Defender app that blocks users with a high risk level", "A security baseline that includes a risk threshold and blocks sign-in directly", "A scope tag named High risk, assigned to the devices that Defender flags"]);
fix(67, ["Endpoint Privilege Management with an elevation rule"],
  ["Local user group membership policy that adds the users", "LAPS rotation of the built-in admin account", "A Win32 app that runs in user context with admin tokens"]);
fix(69, ["Issue and manage certificates from a cloud-hosted CA without on-premises infrastructure"],
  ["Encrypt BitLocker volumes in the cloud and store the keys in Key Vault", "Replace Microsoft Entra Conditional Access with certificate-only rules", "Sign Win32 app packages automatically before they are published to devices"]);
fix(70, ["Bring your own CA (BYOCA) with a Cloud PKI issuing CA signed by your root"],
  ["Cloud PKI root CA only, with no link to your existing root", "Create the CA in Azure Key Vault and import it later into Intune", "Use a SCEP profile that points straight to the NDES server"]);
fix(72, ["An app protection policy for iOS/iPadOS targeted at the users"],
  ["A device compliance policy for iOS, with a data protection requirement", "A device restrictions configuration profile for iOS devices", "An enrollment restriction that blocks personal iOS devices"]);
fix(74, ["Recheck the access requirements after (minutes of inactivity)"],
  ["Offline grace period, blocking access after a set number of minutes", "Maximum PIN attempts before the app resets the PIN for the user", "Timeout for compliance reporting before the device is flagged"]);
fix(75, ["Offline grace period: Wipe data after (days)"],
  ["Block screen capture and the Google Assistant", "Recheck the access requirements after (minutes)", "Disable app PIN when a device PIN is set"]);
fix(77, ["An .intunewin package with detection rules"],
  ["An .msi file with a PowerShell script and no detection", "An .appx file that has no detection rule at all", "A .zip file that contains the installer and a script"]);
fix(78, ["Supersedence, with the uninstall previous version option"],
  ["Dependencies, set on the old app so the new one installs after it", "Requirement rules, set so the old app is detected first on each PC", "Return codes, mapped so the old app uninstalls on a soft reboot"]);
fix(79, ["In the Win32 app's requirement rules"],
  ["In the detection rules for the application", "In the return codes mapped on the application", "In a compliance policy assigned to the devices"]);
fix(80, ["C:\\ProgramData\\Microsoft\\IntuneManagementExtension\\Logs"],
  ["C:\\Windows\\System32\\Winevt\\Logs\\IntuneManagementExtension", "C:\\Users\\Public\\Documents\\Intune\\ManagementExtension\\Logs", "C:\\Windows\\Temp\\IntuneManagementExtension\\Logs"]);
fix(83, ["Microsoft 365 Apps policies (the Cloud Policy service in the Microsoft 365 Apps admin center)"],
  ["A Windows Update for Business ring assigned to the Office devices", "A custom OMA-URI profile for Office, assigned to the user groups", "The Edge security baseline, assigned to the same user groups"]);
fix(84, ["The Settings catalog Microsoft Edge category, or the Edge security baseline"],
  ["A Windows Update for Business report that lists the Edge versions", "A BitLocker policy that blocks password storage on the device", "An enrollment restriction that limits the browser to approved sites"]);
fix(88, ["A Remediation (proactive remediation) script package"],
  ["A Win32 app that carries a detection rule for the service", "A platform script that runs one time for each device", "A compliance script with a custom rule for the service"]);
fix(89, ["It runs the remediation script, because 1 means the issue was detected"],
  ["It marks the device compliant, because the script returned a result", "It skips the remediation script, because exit 1 means a script error", "It retires the device, because the detection failed to complete"]);
fix(90, ["Run remediation (preview) from the device's page"],
  ["Sync the device from the device's page", "Collect diagnostics for the device", "Autopilot Reset for that single device"]);
fix(93, ["A summary of the device and policy data with suggested next steps"],
  ["An automatic wipe of the device, run without admin approval", "A new tenant-wide policy that is created and assigned with no review", "A license assignment for the user, so the policy applies again"]);
fix(97, ["Use a device name template in the Autopilot deployment profile (classic) or in a device naming policy"],
  ["Run the Rename device action on each Windows device after enrollment", "Edit the Entra device name by hand in the portal after it joins", "Use a compliance policy that renames devices that are noncompliant"]);
fix(98, ["Collect diagnostics"],
  ["Sync the device", "Fresh Start the device", "Run a device query"]);
fix(99, ["The app was installed, but the detection rule did not find it"],
  ["The device is not enrolled in Intune, so the install was never sent", "The user's license is missing, so the install did not complete at all", "The MDM push certificate expired, so the device never checked in"]);
