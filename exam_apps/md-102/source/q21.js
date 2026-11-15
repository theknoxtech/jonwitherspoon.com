/* ===== Exam notes drill (Nov 14). Every item was checked against Microsoft Learn on this date. ===== */
const N21 = "Exam notes drill: verified facts";

/* ---------- Domain 1: enrollment, roles, MAA, LAPS, Autopilot ---------- */
add(D1, N21, "A user belongs to Group A and Group B. Group A has a device limit restriction at priority 5. Group B has a different device limit restriction at priority 2. Which restriction applies to the user?",
  ["Only the priority 2 restriction"],
  ["Only the priority 5 restriction, because it was created first", "Whichever of the two sets the lower device limit", "Both, with the settings merged into one"],
  "Priority 1 is the highest. The restriction with the highest priority is applied and the others are disregarded.",
  L.limitRestr + '#change-restriction-priority');
add(D1, N21, "You lower a device limit restriction from 5 devices to 3. One assigned user already has 4 enrolled devices. What happens?",
  ["The 4 devices stay enrolled; the new limit applies to new enrollments"],
  ["Intune retires the oldest of the 4 enrolled devices to get the user under the new limit", "Intune stops syncing the user's 4 devices until one is removed", "The user must re-enroll all 4 devices under the new limit"],
  "Edits to enrollment restrictions are applied to new enrollments and don't affect devices that are already enrolled.",
  L.limitRestr + '#edit-enrollment-restrictions');
add(D1, N21, "A colleague says enrollment restrictions guarantee that no personal device can ever enroll. What does Microsoft Learn say about them?",
  ["They are a best-effort barrier, not a security feature"],
  ["They are enforced by hardware attestation on every platform", "They become a security boundary when paired with a compliance policy", "They are enforced for every enrollment method, including Autopilot self-deploying"],
  "Learn states that enrollment restrictions are not security features. They are a best-effort barrier for non-malicious users.",
  L.restr);
add(D1, N21, "Which TWO enrollment scenarios are not user-driven, so Intune applies the default restriction policy to them?",
  ["Windows Autopilot self-deploying mode", "Bulk enrollment with a Windows Configuration Designer package"],
  ["Enrollment through the Company Portal on a personal Windows PC", "Android Enterprise personally owned work profile enrollment", "Apple user enrollment with a managed Apple Account"],
  "Learn lists self-deploying and pre-provisioning, bulk enrollment with Windows Configuration Designer, co-management, userless ADE, Azure Virtual Desktop, Windows 365 and Android dedicated devices as not user-driven.",
  L.restr + '#limitations');
add(D1, N21, "How many devices can a device enrollment manager (DEM) enroll, and how many can a standard non-admin user enroll?",
  ["A DEM up to 1,000; a standard non-admin user 15"],
  ["A DEM up to 150; a standard non-admin user 15", "A DEM up to 1,000; a standard non-admin user 5", "A DEM up to 500 devices; a standard non-admin user 10 devices"],
  "A DEM can enroll up to 1,000 devices. A standard non-admin account can enroll 15. The number 150 is the limit on DEM accounts in the tenant.",
  ML + 'intune/device-enrollment/setup-enrollment-manager');
add(D1, N21, "Which enrollment method cannot be used with a device enrollment manager account?",
  ["Apple Automated Device Enrollment"],
  ["Bulk enrollment with a provisioning package", "Enrollment through the Company Portal on Windows", "Microsoft Entra join started by the DEM"],
  "DEM isn't compatible with Apple Automated Device Enrollment. Supported methods are bulk provisioning packages, DEM-initiated Company Portal enrollment, and DEM-initiated Entra join.",
  ML + 'intune/device-enrollment/setup-enrollment-manager#supported-enrollment-methods');
add(D1, N21, "A DEM account enrolls Windows laptops but stops at 50 devices. The Intune device limit restriction is 15. What most likely caused the stop?",
  ["A lower Microsoft Entra devices-per-user limit"],
  ["The Intune device limit restriction of 15 applies to DEM accounts", "The tenant allows only 150 DEM enrollments in total", "A platform restriction blocks DEM accounts"],
  "DEM enrolls Windows devices in shared device mode, so Intune device limit restrictions don't apply. A lower Entra device limit stops the account before it reaches 1,000.",
  ML + 'intune/device-enrollment/setup-enrollment-manager#limitations');
add(D1, N21, "Seattle helpdesk admins should manage only Seattle devices and see only the policies and profiles labeled for Seattle. What do you configure on their role assignment?",
  ["Scope (Groups) with the Seattle devices, and the Seattle scope tag"],
  ["Only the Seattle scope tag, because tags also limit who can be managed", "Only Scope (Groups), because the group hides all other objects", "The Seattle IT admin group as Scope (Groups) and no tags"],
  "Scope groups say which users and devices the admins can act on. Scope tags say which Intune objects they can see. Distributed IT uses both.",
  L.scopeTags);
add(D1, N21, "Which role is needed to create, update or delete scope tags?",
  ["Intune Administrator"],
  ["Policy and Profile Manager", "Help Desk Operator", "Endpoint Security Manager"],
  "Creating, updating or deleting scope tags needs the Intune Administrator Entra role. Admins who only hold a scope tag in an assignment can't change the master list.",
  L.scopeTags + '#to-create-a-scope-tag');
add(D1, N21, "Which TWO requirements apply to the Multi Admin Approval approver group?",
  ["It must be a security group", "It must be assigned directly to an Intune role"],
  ["It must be a Microsoft 365 group", "It must contain only Global Administrators", "Its members must hold the Intune role through nested groups"],
  "The approver group must be a security group and must be directly assigned to an Intune role. Distribution lists, Microsoft 365 groups and mail-enabled security groups are not supported.",
  L.maa + '#prerequisites-for-access-policies-and-approvers');
add(D1, N21, "A Global Administrator submits a change protected by a Multi Admin Approval access policy and is also in the approver group. Who can approve it?",
  ["A different administrator who is in the approver group"],
  ["The same Global Administrator, because Global Administrators bypass the check", "Any user holding the Intune Administrator role, including the requestor", "Nobody, because Global Administrator changes are never approved"],
  "An admin can't approve their own request, even as a member of the approver group. Changes by Global Administrators or Intune Administrators also need a different approver.",
  L.maa);
add(D1, N21, "An approver approves a Multi Admin Approval request. What must happen before Intune applies the change?",
  ["The original requestor selects Complete"],
  ["The approver selects Complete", "A second approver co-signs the request", "Nothing, the change applies on the next sync"],
  "After approval the requestor must open the request and choose Complete. A request not processed within 3 days expires.",
  L.maa + '#how-multi-admin-approval-and-access-policies-work');
add(D1, N21, "You create a Multi Admin Approval access policy for the Role policy type before the approver group has a role assignment. Now you can't assign it. What is the way out?",
  ["Delete the Role access policy, wait a few minutes, then assign the group to a role"],
  ["Ask the approver group to approve the role assignment from within its own members list", "Remove the Intune Administrator role and add it again", "Wait 24 hours for the access policy to lapse"],
  "A Role access policy protects every role change, including the assignments MAA itself needs. Learn describes this deadlock and the fix.",
  L.maa + '#more-considerations');
add(D1, N21, "An automation script uses an app-only token to update a resource that a Multi Admin Approval access policy protects. What happens?",
  ["It returns HTTP 412 until an admin approves the change"],
  ["The call succeeds because app-only tokens bypass approval", "The app approves its own request with the approval code", "Only GET requests are intercepted, so the update succeeds"],
  "MAA intercepts modifying calls (POST, PATCH, PUT, DELETE) for delegated and app-only auth. Apps can't approve. You can exclude an app from the policy, and a second admin must approve that exclusion.",
  L.maaGraph);
add(D1, N21, "Which TWO built-in Microsoft Entra roles can recover (read) the Windows LAPS password?",
  ["Cloud Device Administrator", "Intune Administrator"],
  ["Helpdesk Administrator role", "Security Administrator role", "Security Reader role"],
  "Cloud Device Administrator and Intune Administrator can read the password. Helpdesk Administrator, Security Administrator and Security Reader can read only the metadata.",
  L.lapsEntra);
add(D1, N21, "An admin holds the Cloud Device Administrator role, but the Local admin password pane in the Intune admin center is greyed out. What is missing?",
  ["The Rotate Local Admin Password remote task permission"],
  ["The Endpoint Security Manager built-in role assigned to the admin group", "A Microsoft Entra ID P2 license assigned to the helpdesk admin", "The Security baselines Assign permission in the admin's Intune role"],
  "Intune needs the Rotate Local Admin Password remote task to view or rotate. No built-in Intune role and not even the Intune Administrator Entra role includes it, so a custom role is used.",
  L.laps + '#role-based-access-controls-for-laps');
add(D1, N21, "A Windows device that backs up its LAPS password to Microsoft Entra ID is deleted from Microsoft Entra ID. What happens to the stored password?",
  ["It is lost and can't be recovered"],
  ["It stays recoverable for 30 days in a soft-delete state", "It moves to Intune and can be read from the device record", "It is restored when the device joins again"],
  "Deleting the device object loses the LAPS credential tied to it. Entra has no way to recover the password for a deleted device.",
  L.lapsEntra + '#what-happens-when-a-device-is-deleted-in-microsoft-entra-id');
add(D1, N21, "Which Microsoft Entra permission must a custom role contain to read LAPS passwords?",
  ["microsoft.directory/deviceLocalCredentials/password/read"],
  ["microsoft.directory/deviceLocalCredentials/standard/read", "microsoft.directory/devices/standard/read", "microsoft.directory/bitlockerKeys/key/read"],
  "The password/read action reads the password. The standard/read action reads only the metadata. Custom roles need Entra ID P1 or P2.",
  L.lapsEntra + '#recovering-local-administrator-password-and-password-metadata');
add(D1, N21, "Which device is the owner of the device group that a Windows Autopilot device preparation policy uses?",
  ["The Intune Provisioning Client service principal"],
  ["The Intune Connector for Active Directory service account", "The user who enrolls the device with the policy", "The Windows Autopilot service principal account"],
  "The assigned device group must be a static security group owned by the Intune Provisioning Client. In some tenants the same AppId is named Intune Autopilot ConfidentialClient.",
  ML + 'autopilot/device-preparation/tutorial/user-driven/entra-join-device-group');
add(D1, N21, "Which TWO statements are true of Windows Autopilot device preparation compared with Windows Autopilot?",
  ["Devices don't have to be registered with a hardware hash", "It supports Microsoft Entra join only"],
  ["It uses a deployment profile and an Enrollment Status Page", "It supports Microsoft Entra hybrid join", "It supports self-deploying and pre-provisioned modes"],
  "Device preparation uses a device preparation policy and a device group, not a deployment profile and ESP. It supports user-driven and automatic modes with Entra join only.",
  L.apCompare);
add(D1, N21, "Which hardware requirement applies to Windows Autopilot self-deploying mode?",
  ["TPM 2.0 with device attestation support"],
  ["TPM 1.2 or later in any state", "Secure Boot with a hardware hash on a USB drive", "A virtual TPM from the hypervisor"],
  "Self-deploying mode authenticates with TPM 2.0 attestation. It fails on devices without TPM 2.0 and on VMs, including Hyper-V virtual TPMs, with error 0x800705B4.",
  ML + 'autopilot/self-deploying#requirements');
add(D1, N21, "Which join type does Windows Autopilot self-deploying mode support?",
  ["Microsoft Entra join only"],
  ["Microsoft Entra hybrid join only", "Microsoft Entra join and hybrid join", "Microsoft Entra registered"],
  "Self-deploying mode supports only Microsoft Entra join. The profile greys out the join type for that reason.",
  ML + 'autopilot/self-deploying');
add(D1, N21, "Which TWO things does a remote Windows Autopilot Reset keep on the device?",
  ["The Microsoft Entra join", "The Intune management connection"],
  ["The primary user assignment", "The user's personal files", "The Microsoft Entra hybrid join of the device"],
  "Autopilot Reset keeps the Entra join and MDM enrollment. A remote reset removes the primary user and the Entra owner. It doesn't support hybrid joined devices.",
  ML + 'autopilot/windows-autopilot-reset');
add(D1, N21, "Where do you turn on the restore page so users can restore settings during OOBE at enrollment?",
  ["Devices > Enrollment > Windows > Windows Backup and Restore"],
  ["An Autopilot deployment profile, on the out-of-box experience page", "A device compliance policy for Windows, in the actions for noncompliance", "Endpoint security > Account protection"],
  "Restore at enrollment is a tenant-wide enrollment setting. Backup is configured separately in the settings catalog with Enable Windows backup.",
  L.backup);
add(D1, N21, "You turn on Show restore page under Windows Backup and Restore. What is true about the setting?",
  ["It is tenant-wide and defaults to Not configured"],
  ["It can be assigned to a group of users and a group of devices", "It is on by default for Autopilot devices after OOBE", "It also controls what the backup task saves on the device"],
  "The restore setting is tenant-wide. Users can restore only after backup is configured in the settings catalog.",
  L.backup + '#rbac-and-tenant-wide-targeting');

/* ---------- Domain 2: updates, config, analytics, add-ons ---------- */
add(D2, N21, "Which Intune policy keeps Windows devices on a specific Windows version, such as 24H2?",
  ["A feature update policy"],
  ["An update ring with a 365-day feature deferral", "A quality update policy", "An expedite policy"],
  "Feature update policies lock devices to a specific version. Devices already on a newer version aren't upgraded or downgraded.",
  ML + 'intune/device-updates/windows/');
add(D2, N21, "An expedite policy targets a July security update. The update ring defers quality updates by 14 days. What happens?",
  ["It installs now; deferrals for other updates still apply"],
  ["It waits 14 days because ring deferral always wins", "It installs, and the ring deferral is removed for all updates", "It installs only after the user restarts the device manually"],
  "Expedite policies override deferral for the update version named in the policy. They don't override deferrals for other versions.",
  ML + 'intune/device-updates/windows/configure-expedite-policy#identify-the-latest-applicable-update');
add(D2, N21, "Which TWO items are required for hotpatch security updates through Intune?",
  ["Windows 11 24H2 or later", "A quality update policy with hotpatch on"],
  ["Windows 10 22H2 with Extended Security Updates", "Windows 11 Home edition", "An update ring with a 0-day quality deferral"],
  "Hotpatch needs an eligible license, Windows 11 24H2 or later on the baseline, VBS running, and an Intune quality update policy with hotpatch on.",
  ML + 'windows/deployment/windows-autopatch/manage/windows-autopatch-hotpatch-updates');
add(D2, N21, "What are the maximum deferral periods you can set in a Windows update ring?",
  ["Quality updates 30 days, feature updates 365 days"],
  ["Quality updates 35 days, feature updates 365 days", "Quality updates 14 days, feature updates 180 days", "Quality updates 7 days, feature updates 90 days"],
  "Quality deferral is 0 to 30 days and feature deferral 0 to 365 days. The 35-day value is the maximum pause, a different setting.",
  ML + 'intune/device-updates/windows/ref-update-ring-settings');
add(D2, N21, "Which policy configures managed software updates for iOS and macOS devices with declarative device management?",
  ["A settings catalog policy for declarative software updates"],
  ["A Windows feature update policy assigned to the Apple device group", "A macOS feature update profile created under the Windows updates menu", "A device restrictions template that defers Apple software updates"],
  "Apple managed software updates use the settings catalog, in the Declarative Device Management category.",
  ML + 'intune/device-updates/apple/');
add(D2, N21, "Where do you create Zebra firmware update deployments in Intune?",
  ["Android FOTA deployments under Manage updates"],
  ["A device restrictions profile with a freeze period", "An app configuration policy in Managed Google Play", "The Android Enterprise settings catalog"],
  "Zebra LifeGuard Over-the-Air deployments are created under Android FOTA deployments. They need Intune Plan 2 or an add-on, and a deployment is fire and forget, not a compliance policy.",
  ML + 'intune/device-updates/android/setup-zebra-lifeguard');
add(D2, N21, "What do you import into Group Policy analytics?",
  ["A GPO exported as an XML report"],
  ["An ADMX file with its ADML language file", "A GPO backup folder zipped from the domain controller", "A registry .pol file from SYSVOL"],
  "Right-click the GPO in GPMC, choose Save report, and save it as XML. Intune then shows the MDM Support percentage for the settings.",
  L.gpa + '#export-a-gpo-as-an-xml-file');
add(D2, N21, "Where do you import a third-party ADMX file, and what must you upload with it?",
  ["Import ADMX, uploading the ADMX and one ADML file"],
  ["Group Policy analytics, uploading only the ADMX file", "Settings catalog > Add settings, uploading a CSV", "Tenant administration > Connectors and tokens"],
  "Import ADMX takes the ADMX and one ADML language file in the same session. Then create a Windows profile of type Imported Administrative templates.",
  L.admxCustom + '#add-the-admx-and-adml-files');
add(D2, N21, "What does device query for multiple devices require?",
  ["Advanced Analytics licensing and a properties catalog policy"],
  ["Intune Plan 1 alone, plus the Help Desk Operator role for the admin", "Remote Help licenses and a configured Remote Help policy", "Devices that are hybrid joined only"],
  "Device query for multiple devices is an Advanced Analytics capability. It needs a properties catalog policy, and you find it under Devices > Device query.",
  L.deviceQueryMulti);
add(D2, N21, "Which TWO requirements apply to Intune Advanced Analytics?",
  ["A license on top of Intune Plan 1 or Plan 2", "Windows devices enrolled and onboarded to endpoint analytics"],
  ["Intune Plan 2 alone covers the entire requirement", "Devices must be Microsoft Entra registered only, with no enrollment", "Devices must be Windows 10 LTSC with the Intune agent installed"],
  "Advanced Analytics is a subscription in addition to Intune Plan 1 or 2. Windows devices must be enrolled and onboarded to endpoint analytics.",
  ML + 'intune/advanced-analytics/#prerequisites');
add(D2, N21, "Which TWO capabilities are included with Intune Plan 2 or the Intune Suite but are not sold as a standalone add-on?",
  ["Microsoft Tunnel for MAM", "Firmware over-the-air update"],
  ["Endpoint Privilege Management", "Remote Help", "Microsoft Cloud PKI"],
  "EPM, Enterprise App Management, Advanced Analytics, Remote Help and Cloud PKI can be bought standalone. Tunnel for MAM and FOTA come with Plan 2 or the Suite.",
  ML + 'intune/fundamentals/add-ons#available-add-ons');
add(D2, N21, "Who needs a Remote Help license?",
  ["Both helpers and sharers"],
  ["Only the helpers", "Only the users who share their device", "Only Intune Administrators"],
  "Remote Help needs a license for everyone targeted, both helpers and sharers, in addition to Intune Plan 1 or 2.",
  L.remoteHelp + '#prerequisites');
add(D2, N21, "A helper can't assist an unenrolled device, and the role assignment uses the All devices scope group. What fixes it?",
  ["Add a user scope group containing the sharer"],
  ["Switch the scope group to All users and All devices together", "Assign the Help Desk Operator role at the tenant root", "Enroll the device and remove the scope tag"],
  "The All devices scope group doesn't include unenrolled devices, so use a user scope group in the assignment.",
  L.remoteHelp + '#authentication-and-permissions');
add(D2, N21, "Which Endpoint Privilege Management elevation type needs an administrator to approve each request before the app runs elevated?",
  ["Support approved"],
  ["User confirmed", "Automatic", "Elevate as current user"],
  "With Support approved, the user submits a request and an administrator approves it, then the user retries. User confirmed asks only the user to confirm.",
  L.epmRules);
add(D2, N21, "Which EPM elevation type runs the elevated process under the signed-in user's own account and asks for Windows authentication?",
  ["Elevate as current user"],
  ["User confirmed with a business justification", "Automatic", "Deny"],
  "Elevate as current user keeps the user's profile paths and environment, and supports Windows authentication. Other types use a virtual account.",
  ML + 'intune/epm/overview#epm-fundamentals');
add(D2, N21, "What validation does an Automatic EPM elevation rule require?",
  ["A file hash"],
  ["A publisher certificate alone", "A business justification from the user", "Windows authentication by the user"],
  "A file hash is required for automatic rules. User confirmed and Elevate as current user can use a certificate or a hash.",
  L.epmRules + '#about-elevation-rules-policy');
add(D2, N21, "Two EPM rules target the same file: a user-assigned Automatic rule and a device-assigned Deny rule. What happens?",
  ["The file elevation is denied"],
  ["The user-assigned Automatic rule wins because rules for users take precedence", "The rule with the older creation date wins", "The user is prompted to choose between the two rules"],
  "Deny rules always take precedence. After that, user rules beat device rules, a defined hash is most specific, then the rule with more attributes wins.",
  L.epmPlan + '#epm-policies');

/* ---------- Domain 3: security, compliance, Conditional Access ---------- */
add(D3, N21, "How do you move an existing security baseline profile to a newer baseline version?",
  ["Select the profile, choose Change Version, and review the update"],
  ["Nothing, baseline profiles update themselves each month", "Delete the profile and import the new baseline template from scratch", "Reassign the baseline to a new group"],
  "Change Version lets you download a CSV of differences, then keep your customizations or discard them. Test on a copy first, because the update redeploys right away.",
  ML + 'intune/device-security/security-baselines/configure-baselines');
add(D3, N21, "Two profiles configure the same setting with different values on one device. What status does the security baseline report show for that setting?",
  ["Conflict"],
  ["Error", "Pending", "Not applicable"],
  "Conflict means two settings are applied to the same device and Intune can't sort it out. An administrator should review.",
  ML + 'intune/device-security/security-baselines/monitor-baselines');
add(D3, N21, "A helpdesk technician reads a BitLocker recovery key aloud to a user. What should you do next?",
  ["Rotate the BitLocker recovery key"],
  ["Suspend BitLocker on the device", "Delete the device from Microsoft Entra ID", "Turn off the BitLocker policy for the device"],
  "Rotation refreshes the key so a disclosed key can't be reused. The Help Desk Operator and Endpoint Security Manager roles can run it, and the device needs client-driven rotation enabled.",
  L.bitlockerRotate);
add(D3, N21, "You delete the Intune object of a BitLocker-protected Microsoft Entra joined device. What does Learn say happens?",
  ["BitLocker is left suspended on the OS volume"],
  ["The drive is decrypted and the recovery key is deleted from Entra", "Nothing happens to BitLocker on the device", "The drive locks until the recovery key is entered"],
  "Deleting the Intune object triggers a sync that removes the key protectors on the operating system volume, which leaves BitLocker suspended.",
  L.bitlocker + '#monitor-and-manage-bitlocker');
add(D3, N21, "What is the status of the Conditional Access control Require approved client app after June 30, 2026?",
  ["It is read-only; existing policies keep enforcing"],
  ["It was removed and every policy that used it stopped enforcing", "It stays supported and is the recommended grant for new policies", "It switched itself to Require compliant device"],
  "Admins can still disable or delete policies that use it. Move to Require app protection policy, which is the grant to use for any new policy.",
  L.caMigrate + '#overview');
add(D3, N21, "You want to allow unenrolled personal phones to reach Exchange Online, but only in apps with data protection. Which grant control do you use?",
  ["Require app protection policy"],
  ["Require device to be marked as compliant", "Require Microsoft Entra hybrid joined device", "Require approved client app as the only control in a new policy"],
  "An unenrolled device can't be marked compliant, so the compliant device grant would fail. App protection policy works without enrollment.",
  ML + 'entra/identity/conditional-access/policy-all-users-approved-app-or-app-protection');
add(D3, N21, "You need new FileVault, firewall and Gatekeeper settings for Macs. Which option do you use?",
  ["The settings catalog or endpoint security policies"],
  ["The macOS endpoint protection template under Device configuration", "The macOS extensions template under Device configuration", "The Windows endpoint protection template applied to the Macs"],
  "The macOS endpoint protection template is deprecated. Existing policies keep working but you can't create new ones with it.",
  ML + 'intune/device-configuration/endpoint-security/ref-endpoint-protection-macos');
add(D3, N21, "An iOS app protection policy sets Offline grace period to block access after 1,440 minutes and wipe data after 90 days. A user has been offline for 2 days. What happens when the user opens the app?",
  ["The app blocks access to work data"],
  ["The app selectively wipes the user's work data", "The whole device is wiped", "Nothing happens until the 90 days pass"],
  "Block access (minutes) comes first. Wipe data (days) selectively wipes the work account after the longer period if the user can't reauthenticate.",
  ML + 'intune/app-management/protection/ref-settings-ios#conditional-launch');
add(D3, N21, "What are the default Offline grace period values on iOS and Android app protection policies?",
  ["Block access after 1,440 minutes and wipe data after 90 days"],
  ["Block access after 720 minutes and wipe data after 90 days", "Block access after 1,440 minutes and wipe data after 30 days", "Block access after 60 minutes and wipe data after 7 days"],
  "iOS and Android default to 1,440 minutes and 90 days. The Windows default for blocking access is 720 minutes.",
  ML + 'intune/app-management/protection/ref-settings-android#conditional-launch');

/* ---------- Domain 4: apps ---------- */
add(D4, N21, "A Win32 app must install only on 64-bit devices with at least 8 GB of RAM. Which rule type controls this?",
  ["Requirement rules"],
  ["Detection rules", "Return code mappings", "Supersedence settings"],
  "Requirement rules decide whether the app applies to a device. Detection rules decide whether the app is already installed.",
  ML + 'intune/app-management/deployment/add-win32');
add(D4, N21, "Which Win32 app setting tells Intune that the app is installed?",
  ["Detection rules"],
  ["Requirement rules", "Install behavior", "Dependencies"],
  "Detection rules report whether the app is present. A detection script counts as installed when it exits 0 and writes to STDOUT, with nothing on STDERR.",
  ML + 'intune/app-management/deployment/add-win32#step-4-detection-rules');
add(D4, N21, "A Win32 app reports error 0x87D1041C. What does it mean?",
  ["The install succeeded, but detection failed"],
  ["The download failed before the app could install", "The requirement rules weren't met on the device", "The content hash didn't match the uploaded package"],
  "0x87D1041C means installation succeeded but the app isn't detected, for example the user removed it or the detection rule doesn't match what was installed.",
  ML + 'troubleshoot/mem/intune/app-management/app-install-error-codes#other-installation-errors');
add(D4, N21, "You want to replace an app with a completely different app and remove the old one. What do you configure?",
  ["Supersedence with Uninstall previous version turned on"],
  ["A dependency on the old app", "Supersedence with Uninstall previous version turned off", "Two Required assignments to the same group"],
  "App replacement uninstalls the superseded app and installs the new one. With the toggle off, it's an app update and the new installer does the upgrade.",
  ML + 'intune/app-management/deployment/configure-win32-supersedence#supersedence-behavior');
add(D4, N21, "App A depends on App B. App C supersedes App B. What does Intune report for App A?",
  ["A conflict state"],
  ["App A installs and App B is skipped", "Not applicable", "App A fails with a retry code"],
  "Enforcement prefers supersedence over dependency, but when they conflict Intune reports it.",
  ML + 'intune/app-management/deployment/configure-win32-supersedence#supersedence-behavior');
add(D4, N21, "Which exit code from a Remediations detection script runs the remediation script?",
  ["Exit 1"],
  ["Exit 0", "Exit 2", "Any nonzero exit code"],
  "The detection script must exit 1 when the issue is found. Any other exit code, including empty output, means no issue and the remediation script doesn't run.",
  ML + 'intune/device-management/tools/deploy-remediations#create-and-deploy-custom-script-packages');
add(D4, N21, "Which THREE of these are available for Windows only?",
  ["Remediations", "Endpoint Privilege Management policies", "Enterprise App Catalog apps"],
  ["App protection policies for mobile apps", "Device compliance policies for Windows, iOS and Android"],
  "Remediations, EPM and the Enterprise App Catalog (Windows Win32 apps) are Windows only. App protection and compliance work on more platforms.",
  ML + 'intune/device-management/tools/deploy-remediations#prerequisites');
add(D4, N21, "Which scopes can a Cloud Policy service for Microsoft 365 policy configuration use? Select THREE.",
  ["All users in the tenant", "Specific Microsoft Entra groups", "Anonymous Office for the web users"],
  ["Specific devices", "Specific Active Directory organizational units"],
  "Choose All users, specific groups, or anonymous users of Office for the web. You can now add several groups to one policy configuration.",
  ML + 'microsoft-365-apps/admin-center/overview-cloud-policy#steps-for-creating-a-policy-configuration');
add(D4, N21, "You assign a Cloud Policy configuration to a Microsoft Entra group that contains both users and devices. What happens?",
  ["The policies apply to the user objects only"],
  ["The policies apply to the devices and the users are ignored", "The policies apply to both users and devices", "The assignment fails until you remove the devices"],
  "Cloud Policy applies at the user level. A group can hold devices too, but they are ignored.",
  ML + 'microsoft-365-apps/admin-center/overview-cloud-policy#microsoft-entra-groups-requirements');
add(D4, N21, "Which devices does Microsoft Tunnel for Mobile Application Management support?",
  ["Android and iOS devices that aren't enrolled in Intune"],
  ["Windows devices that are Microsoft Entra joined", "Only Android and iOS devices that are enrolled", "macOS devices enrolled with Automated Device Enrollment"],
  "Tunnel for MAM extends the Microsoft Tunnel VPN gateway to unenrolled Android and iOS devices.",
  L.tunnelMam);

/* ---------- Domain 5: agents ---------- */
add(D5, N21, "Which TWO Intune Security Copilot agents were announced for removal from the admin center starting August 31, 2026?",
  ["Policy Configuration Agent", "Change Review Agent"],
  ["Vulnerability Remediation Agent", "Device Offboarding Agent"],
  "The Policy Configuration Agent and the Change Review Agent were retired on August 31, 2026. The Device Offboarding Agent was removed earlier.",
  ML + 'intune/copilot/agents/policy-configuration-agent');
add(D5, N21, "When was the Intune Device Offboarding Agent removed from the admin center?",
  ["June 1, 2026"],
  ["April 30, 2026", "August 31, 2026", "December 31, 2026"],
  "Setup closed on April 30, 2026, and the agent was removed on June 1, 2026.",
  ML + 'intune/copilot/agents/device-offboarding-agent');
add(D5, N21, "What did the Change Review Agent evaluate?",
  ["Multi Admin Approval requests for PowerShell scripts"],
  ["Device compliance policy changes for all platforms", "Stale devices across Intune and Microsoft Entra ID tenants", "Defender vulnerabilities across the whole device fleet"],
  "It gave risk-based recommendations on MAA requests for PowerShell scripts. It is among the agents Learn lists as retiring on August 31, 2026.",
  ML + 'intune/copilot/agents/change-review-agent');
