/* ===== DOMAIN 1: Prepare infrastructure for devices ===== */
const T11 = 'Join, groups and dynamic rules', T12 = 'Enrollment by platform', T13 = 'Enrollment restrictions and limits', T14 = 'Roles, scope tags and Multi Admin Approval', T15 = 'Compliance, identity and LAPS';

add(D1, T11, "Corporate Windows 11 laptops are cloud-only, with no on-premises domain. Users should sign in with their work accounts and the PCs must be managed. Which join type fits?",
  ["Microsoft Entra join"],
  ["Microsoft Entra registered", "Microsoft Entra hybrid join", "Workgroup with Company Portal sign-in"],
  "Entra join is for organization-owned devices with no Active Directory dependency. Entra registered is the BYOD pattern, and hybrid join is for devices that also join on-premises AD.", L.entraJoin);

add(D1, T11, "You need a dynamic device group of all corporate-owned Windows devices. Which membership rule works?",
  ["(device.deviceOwnership -eq \"Company\") -and (device.deviceOSType -eq \"Windows\")"],
  ["(user.deviceOwnership -eq \"Company\") -and (user.osType -eq \"Windows\")", "(device.deviceOwnership -eq \"Personal\") -and (device.deviceOSType -eq \"Windows\")", "(device.displayName -startsWith \"Corp\") -or (device.deviceOSType -eq \"iOS\")"],
  "Dynamic device rules use device.* attributes such as deviceOwnership and deviceOSType, joined with -and. User attributes do not exist on device objects. Dynamic groups need Entra ID P1.", L.dynGroups);

add(D1, T11, "Users Entra join new Windows 11 PCs and every PC must enroll in Intune automatically. What do you configure?",
  ["Set the MDM user scope for Microsoft Intune to Some or All in Entra"],
  ["Create an Autopilot profile for each individual user", "Deploy the Company Portal app to every device first", "Upload each device's hardware hash to Intune"],
  "Automatic enrollment on join comes from the MDM user scope under Entra Mobility (MDM and WIP). It needs Entra ID P1. Autopilot is optional and not required for this behavior.", L.entraJoin);

add(D1, T11, "Hybrid joined Windows devices must enroll in Intune automatically. Which step enables that?",
  ["Deploy the GPO that enables automatic MDM enrollment with default Entra credentials"],
  ["Run dsregcmd /leave on every device", "Install the Intune Connector for Active Directory on a DC", "Create a Configuration Manager boundary group"],
  "Hybrid joined devices that are already domain joined auto-enroll through the Group Policy setting for automatic MDM enrollment, plus an MDM user scope in Entra. The Intune Connector for AD is for Autopilot hybrid join.", L.entraJoin);

add(D1, T12, "Employees want work apps on personal iPhones. Work and personal data must stay separate, and IT must not see personal apps. Which enrollment should you choose?",
  ["Account-driven User Enrollment"],
  ["Automated Device Enrollment with supervision", "Apple Configurator enrollment over USB cable", "Device enrollment using a DEM account"],
  "User Enrollment is Apple's privacy-preserving model for personal devices. It manages only a separate work partition. Supervised and ADE paths are for organization-owned devices.", L.restr);

add(D1, T12, "You buy iPhones through Apple Business Manager and want them supervised at first boot. What must exist in Intune before ADE devices can sync?",
  ["An Apple MDM push certificate and an ADE token from Apple Business Manager"],
  ["Only an Apple MDM push certificate in Intune", "A VPP token and a Managed Google Play binding", "An Apple Configurator profile signed by your CA"],
  "ADE needs the Apple MDM push certificate first, then an ADE token (.p7m) created in Apple Business Manager and uploaded to Intune. After that, enrollment profiles can be assigned to synced devices.", L.restr);

add(D1, T12, "Shared barcode scanners in a warehouse run one locked-down app. Which Android Enterprise scenario fits best?",
  ["Corporate-owned dedicated devices"],
  ["Personally-owned devices with a work profile", "Corporate-owned devices with a work profile", "Android device administrator"],
  "Dedicated devices (kiosk or COSU) are single-purpose, shared, and have no personal use. Device administrator is deprecated for devices with Google Mobile Services.", L.restr);

add(D1, T12, "Company-owned Android phones should allow personal apps, with work data kept in a separate work profile. Which enrollment type fits?",
  ["Corporate-owned devices with a work profile"],
  ["Corporate-owned fully managed devices", "Corporate-owned dedicated devices", "Personally-owned devices with a work profile"],
  "COPE (corporate-owned, personally enabled) gives IT control of the device while keeping a work profile. Fully managed has no personal profile, and personally-owned is for BYOD.", L.restr);

add(D1, T12, "Samsung phones bought from a carrier must enroll as fully managed on first power-on, without an admin touching each one. What should you use?",
  ["A Samsung Knox Mobile Enrollment profile that points to Intune"],
  ["A Windows Autopilot deployment profile", "An Apple Automated Device Enrollment token", "A QR code scanned on each device"],
  "Knox Mobile Enrollment (or Google zero-touch for supported devices) lets a reseller-registered device enroll automatically. QR codes need an admin or user to launch setup on every device.", L.restr);

add(D1, T13, "A user is in two groups. Group A has a platform restriction at priority 5. Group B has one at priority 2. What applies to the user?",
  ["Only the priority 2 restriction"],
  ["Both, with the stricter one winning each setting", "Only priority 5, because it was assigned first", "Neither, because the two policies conflict"],
  "When a group has several restrictions, the highest priority (lowest number) applies and the others are disregarded for that user.", L.limitRestr);

add(D1, T13, "You lower a device limit restriction from 5 to 3. A user already has 4 enrolled devices. What happens?",
  ["Nothing yet. The change applies to new enrollments only"],
  ["Intune retires the oldest device right away", "Intune retires all four devices of that user", "Intune blocks the user's sign-in everywhere"],
  "Edits to enrollment restrictions apply to new enrollments and do not affect devices that are already enrolled. Enrollment restrictions are also not a security boundary.", L.limitRestr);

add(D1, T13, "An iOS BYOD user gets an error that they have added the maximum number of devices. Which two actions resolve it? (Select two)",
  ["The user removes one of their enrolled devices", "You raise the limit in the device limit restriction"],
  ["Renew the Apple MDM push certificate", "Block personal iOS in platform restrictions", "Reassign the user's Intune license"],
  "Device cap errors are fixed by freeing a slot or raising the limit. The default policy applies until a higher-priority limit restriction is assigned.", L.limitRestr);

add(D1, T14, "Chicago help desk staff must manage only Chicago devices and see only Chicago policies. What do you configure?",
  ["A role assignment with Chicago scope groups and a Chicago scope tag"],
  ["Intune Administrator, with a filter by city name", "Separate Intune tenants for each office location", "The Reports Reader role in the Entra admin center"],
  "Scope groups decide which users and devices the admin can act on. Scope tags decide which objects (policies, apps) the admin can see. Use both for distributed IT.", L.scopeTags);

add(D1, T14, "Which Microsoft Entra built-in role is dedicated to managing Windows 365 Cloud PCs and is narrower than Intune Administrator?",
  ["Windows 365 Administrator"],
  ["Intune Administrator", "Cloud Device Administrator", "Global Reader"],
  "Windows 365 Administrator grants Cloud PC management without full Intune rights. Intune also has Cloud PC permissions for custom roles.", L.rbac);

add(D1, T14, "You created a Multi Admin Approval access policy for apps, but requests never reach approvers. The approver group is a Microsoft 365 group. What is the fix?",
  ["Use a security group and add it directly to an Intune role assignment"],
  ["Make the approvers members of the Global Administrator role", "Convert the group into a mail distribution list", "Nest the approvers inside a dynamic device group"],
  "Approver groups must be security groups assigned directly as a member group on an Intune role. Distribution lists, Microsoft 365 groups and mail-enabled security groups fail to resolve.", L.maa);

add(D1, T14, "Which two resources can Multi Admin Approval protect with access policies? (Select two)",
  ["Wipe, retire and delete device actions", "Compliance policies"],
  ["App protection policies", "Enrollment restriction policies", "Conditional Access policies"],
  "MAA covers apps (deployments), compliance policies, settings catalog configuration policies, wipe/retire/delete actions, RBAC, Windows scripts, access policies and device categories. App protection policies are not included.", L.maa);

add(D1, T14, "A Global Administrator submits a change to a script protected by an access policy. Who can approve it?",
  ["A different admin in the approver group, then the requester completes it"],
  ["The same Global Administrator, since the role bypasses approval", "Any admin who holds the Intune Administrator role", "No one. Global Administrators are exempt from MAA"],
  "An admin can never approve their own request, even as a Global Administrator. The same account that submitted it selects Complete after another approver approves.", L.maa);

add(D1, T15, "Devices with no compliance policy assigned currently count as compliant. You want Conditional Access to treat them as not compliant. Which setting do you change?",
  ["Mark devices with no compliance policy assigned as: Not compliant"],
  ["Compliance status validity period (days)", "Enhanced jailbreak detection", "A grace period of zero days on each policy"],
  "This tenant-wide compliance policy setting closes the gap for devices that fall outside any policy. The validity period controls how long a device can go without reporting.", L.rbac);

add(D1, T15, "After you require 'Require device to be marked as compliant' in Conditional Access, unenrolled personal Windows PCs are blocked. Why?",
  ["They have no Intune compliance state, so the grant is not satisfied"],
  ["Their users lack Entra ID P2 licenses", "Compliance only applies to Android and iOS", "They need an app protection policy first"],
  "The compliance grant needs a device that is registered and evaluated by Intune. A device that is not enrolled has no compliance result and fails the control.", L.caGrant);

add(D1, T15, "You want Windows Hello for Business settings applied by default to every new Windows enrollment in the tenant. Where do you set that?",
  ["Devices > Enrollment > Windows Hello for Business, as a tenant-wide default"],
  ["A BitLocker policy under Endpoint security", "The Enrollment Status Page profile for all devices", "A device compliance policy with Hello rules"],
  "The tenant-wide enrollment setting applies at enrollment. Targeted Account protection or settings catalog policies can then override it for specific groups.", L.rbac);

add(D1, T15, "A help desk user with a built-in role sees the Local admin password option disabled in Intune. Which permission is missing?",
  ["Remote tasks: Rotate Local Admin Password, through a custom Intune role"],
  ["Managed devices: Wipe, through Help Desk Operator", "Security baselines: Read, through Endpoint Security Manager", "Organization: Delete, through a scope tag"],
  "The Local admin password pane needs the Rotate local administrator password Intune permission. Reading the password itself also needs an Entra role such as Cloud Device Administrator or Intune Administrator, or a custom role with microsoft.directory/deviceLocalCredentials/password/read.", L.laps);

add(D1, T15, "A device object is deleted from Entra ID. Can you recover the LAPS password that was stored for it?",
  ["No. The stored password is lost with the device object"],
  ["Yes, from the Entra recycle bin for 30 days", "Yes, an Intune Administrator can restore it", "Yes, if the device rejoins with the same name"],
  "LAPS credentials are tied to the device object in Entra. Deleting it loses the password unless you export it elsewhere first.", L.lapsEntra);

add(D1, T15, "You want a help desk Entra group added to the local Administrators group on Entra-joined PCs. Which Intune policy is designed for this?",
  ["Endpoint security > Account protection > Local user group membership"],
  ["A compliance policy that requires an admin group", "A platform script that runs for every signed-in user", "Group Policy Preferences from on-premises AD"],
  "The Account protection policy for local user group membership adds or removes members of local groups, and it replaces ad hoc scripts for this task.", L.rbac);
