/* ===== Endpoint security deep dive (Nov 15). Facts: Learn intune/device-security/microsoft-defender/configure-integration, endpoint-security/deploy-edr, manage-policies, firewall, epm/*, manage-app-control, encrypt-filevault-macos, ref-disk-encryption-settings, identity-protection/*, defender-endpoint exploit protection and ASR articles. Panels are mock-ups built from Learn setting names. ===== */
const N26 = "Endpoint security: connect, deploy and configure";
const K = {
  conn: ML + 'intune/device-security/microsoft-defender/configure-integration',
  adv: ML + 'defender-endpoint/advanced-features',
  edr: ML + 'intune/device-configuration/endpoint-security/deploy-edr',
  edrRef: ML + 'intune/device-configuration/endpoint-security/ref-edr-settings',
  manage: ML + 'intune/device-configuration/endpoint-security/manage-policies',
  fw: ML + 'intune/device-configuration/endpoint-security/firewall',
  ssm: ML + 'intune/device-security/microsoft-defender/security-settings-management',
  compl: ML + 'intune/device-security/compliance/ref-windows-settings',
  asrRef: ML + 'intune/device-configuration/endpoint-security/ref-attack-surface-reduction-settings',
  asrCfg: ML + 'defender-endpoint/attack-surface-reduction-rules-configure',
  asrTest: ML + 'defender-endpoint/attack-surface-reduction-rules-deployment-test',
  xpEnable: ML + 'defender-endpoint/enable-exploit-protection',
  xpCustom: ML + 'defender-endpoint/customize-exploit-protection',
  xpImport: ML + 'defender-endpoint/import-export-exploit-protection-emet-xml',
  epmFaq: ML + 'intune/epm/frequently-asked-questions',
  fv: ML + 'intune/device-configuration/endpoint-security/encrypt-filevault-macos',
  fvRef: ML + 'intune/device-configuration/endpoint-security/ref-disk-encryption-settings',
  whfbTenant: ML + 'intune/device-security/identity-protection/configure-tenant-wide-policy',
  whfbRef: ML + 'intune/device-security/identity-protection/ref-settings',
  whfbCfg: ML + 'windows/security/identity-protection/hello-for-business/configure',
  acctRef: ML + 'intune/device-configuration/endpoint-security/ref-account-protection-settings'
};
const EDRP = [['#', 'Endpoint detection and response (Windows)'],
  ['Defender for Endpoint client configuration package type', 'Auto from connector'], ['Sample sharing', 'All'], ['Telemetry Reporting Frequency', 'Not configured', 0, true]];
const EPMP = [['#', 'Windows elevation settings policy'], ['Endpoint Privilege Management', 'Enabled'], ['Default elevation response', 'Not configured'], ['Validation', 'Business justification', 1, true]];
const FVP = [['#', 'macOS FileVault'], ['Enable FileVault', 'Yes'], ['Recovery key type', 'Personal key', 1], ['Personal recovery key rotation', '6 months', 1],
  ['Number of times allowed to bypass', '3'], ['Allow deferral until sign out', 'Yes'], ['Disable prompt at sign out', 'Not configured']];

/* ---------- Sequences ---------- */
addo(D3, TS, "Place the steps in order to connect Microsoft Defender for Endpoint to Intune and onboard Windows devices with the connector.",
  ["In the Defender portal, turn on the Microsoft Intune connection in Advanced features and save", "In Intune, confirm the Defender for Endpoint connection status shows Enabled", "Turn on Connect Windows devices to Defender for Endpoint under compliance policy evaluation", "Create an Endpoint detection and response policy with the package type Auto from connector", "Assign the policy to a device group", "Check that the devices appear in the Defender portal device inventory"],
  ["Install the Intune Connector for Active Directory", "Download the offboarding package"],
  ["The connection is a two-sided setting and starts in the Defender portal", "It can take up to 15 minutes to change", "This lets Windows devices report their risk level for compliance", "Auto from connector uses the package that Defender sends to Intune", "Device groups apply without a user signing in", "Allow 15 to 30 minutes after the policy reaches the devices"],
  "The compliance toggle and the EDR policy can be done in either order once the connection is Enabled. The Auto from connector option only appears when the connection works. The AD connector is for Autopilot hybrid join.", K.conn);
addo(D3, TS, "A tenant cannot use the connector, for example in a multi-tenant or air-gapped setup. Place the steps to onboard Windows devices with an onboarding package.",
  ["In the Defender portal, open Settings > Endpoints > Device management > Onboarding", "Choose Mobile Device Management / Microsoft Intune and download the package", "Open the onboarding file and copy the blob text", "Create an Endpoint detection and response policy with the package type Onboard", "Paste the blob and set Sample sharing", "Assign the policy and check EDR Onboarding Status"],
  ["Turn on the Intune connection in Advanced features", "Create a compliance policy that sets the machine risk score"],
  ["Onboarding packages come from the Defender portal", "This is the deployment method for Intune", "The file is WindowsDefenderATP.onboarding", "Onboard is the choice when Auto from connector is not available", "Sample sharing is All or None", "Devices then report to Defender"],
  "Auto from connector is recommended. The Onboard type with a pasted blob is for setups with no connection. The connection toggle is not needed for this path.", K.edr);
addo(D3, TS, "Place the steps in order to create and deploy any endpoint security policy, for example a firewall policy.",
  ["In the Intune admin center, open Endpoint security and select the policy type", "Select Create policy and choose the platform and profile", "Enter a name and description on Basics", "Configure the settings", "Add scope tags if needed", "Assign groups", "Review and create"],
  ["Upload the policy as an XML file to the Defender portal", "Enroll the devices in Windows Autopilot"],
  ["Each policy type has its own node", "The profile decides which settings you see", "Use a name you can find later", "The settings page is the main configuration step", "Scope tags limit which admins see the policy", "Device groups apply without a sign-in", "Nothing is deployed until you create it"],
  "This is the common workflow for endpoint security policies in the Endpoint security node. Reports for the policy are under the same node after deployment.", K.manage);
addo(D3, TS, "Place the steps in order to roll out App Control for Business safely with the managed installer.",
  ["Set the Intune Management Extension as a managed installer", "Create an App Control for Business policy in Audit only mode", "Assign the policy to a pilot device group", "Deploy the apps you trust through Intune", "Review the audit events with Advanced hunting", "Switch the policy to Enforce"],
  ["Create a supplemental policy before the base policy", "Turn on Tamper protection"],
  ["Apps installed by it are tagged as trusted", "Audit logs what would be blocked and blocks nothing", "A pilot group limits the risk", "Only apps installed after the setting are tagged", "Audit events show what Enforce would block", "Enforce blocks anything not allowed"],
  "Apps that were deployed before the managed installer was set are not tagged. Learn recommends running in audit first and reviewing the events before enforcing.", L.appControl);
addo(D3, TS, "Place the steps in order to deploy Endpoint Privilege Management (EPM) so that users can run approved tools as administrator.",
  ["Confirm the EPM add-on license and that devices are Entra joined and Intune enrolled", "Create a Windows elevation settings policy that enables EPM", "Assign the elevation settings policy to the devices", "Create an elevation rules policy for the file", "Assign the rules policy", "Test with Run with elevated access"],
  ["Create an App Control for Business policy", "Add the users to the local Administrators group"],
  ["EPM needs a standalone license or the Intune Suite", "A device needs a settings policy that turns EPM on", "The settings are device-scoped", "Rules identify the file and the elevation type", "Rules can go to users or devices", "This is the right-click option when EPM is active"],
  "A rules policy does nothing on its own: the device also needs an elevation settings policy that enables EPM. Rules can be built from the Elevation report once data exists.", L.epmPlan);

/* ---------- Defender for Endpoint and Intune ---------- */
add(D3, N26, "Where do you first turn on the connection between Intune and Microsoft Defender for Endpoint?",
  ["Defender portal > Settings > Endpoints > Advanced features > Microsoft Intune connection"],
  ["Intune admin center > Tenant administration > Connectors and tokens > Defender for Endpoint tile", "Entra admin center > Devices > Device settings > Defender for Endpoint integration", "Azure portal > Defender for Cloud > Environment settings > Intune"],
  "The Intune connection toggle is in the Defender portal Advanced features. Intune then shows the connection status under Endpoint security > Defender for Endpoint.", K.conn);
add(D3, N26, "An admin turned on the Intune connection in the Defender portal. How long can it take for Intune to show Connection status Enabled?",
  ["Up to 15 minutes"],
  ["Up to 24 hours, after the next device check-in cycle", "Up to 8 hours, at the next policy refresh", "It changes instantly and never takes longer"],
  "Learn says the status can take up to 15 minutes to update.", K.conn);
add(D3, N26, "Which Intune setting lets Windows devices report their Defender for Endpoint risk level for compliance?",
  ["Connect Windows devices to Defender for Endpoint, in Compliance policy evaluation"],
  ["Allow Windows devices to share telemetry with Microsoft, under Enrollment", "Enable Microsoft Defender for Endpoint risk sync in the Windows enrollment profile", "Require machine risk reporting in the Windows update ring for all enrolled devices"],
  "The toggles under Compliance policy evaluation connect each platform to Defender for Endpoint.", K.conn);
add(D3, N26, "Which compliance setting makes a device noncompliant when Defender for Endpoint rates it too risky?",
  ["Require the device to be at or under the machine risk score"],
  ["Require the device to be at or under the Device Threat Level in Defender", "Require the device to have a Defender security score above the threshold", "Require the device to pass the Microsoft Defender risk attestation check"],
  "The setting sits under Microsoft Defender for Endpoint in the compliance policy and offers Clear, Low, Medium or High.", K.compl);
add(D3, N26, "In the machine risk score compliance setting, which value is the most restrictive?",
  ["Clear"],
  ["Low, which blocks medium and high levels as well", "Medium, because it blocks only high-level threats", "High, because it blocks every device with any threat"],
  "Clear allows no threats. High allows all levels, so it only reports.", K.conn);
add(D3, N26, "Which platforms can use the Defender for Endpoint machine risk score in a compliance policy?",
  ["Android", "iOS/iPadOS", "Windows"],
  ["Linux", "macOS with Defender installed", "Windows Server with Defender installed"],
  "Learn lists Android, iOS/iPadOS and Windows for the risk-based compliance policy.", K.conn);
add(D3, N26, "After devices are marked noncompliant by the risk score, what actually blocks them from Exchange Online and SharePoint?",
  ["A Conditional Access policy that requires a compliant device"],
  ["The compliance policy itself, which removes the Intune enrollment", "The EDR policy, which isolates the device from the internet", "A Defender for Endpoint network protection rule"],
  "Compliance only marks the device. Conditional Access enforces the block.", K.conn);
add(D3, N26, "Which package type do you choose in an EDR policy to use the onboarding package that Defender sends to Intune after the connection is set up?",
  ["Auto from connector"],
  ["Onboard, with the package pasted from the Defender portal", "Offboard, with the package uploaded as a blob", "Connected, with the tenant ID entered manually"],
  "Auto from connector is the recommended option. Onboard is for setups with no connection.", K.edr);
add(D3, N26, "When is the Onboard package type, with a pasted WindowsDefenderATP.onboarding blob, the right choice?",
  ["When there is no connection between Intune and Defender, such as in an air-gapped setup"],
  ["When the devices run Windows 10 and not Windows 11 in the tenant", "When the policy must go to user groups and not device groups", "When you want devices to share suspicious file samples with Microsoft automatically for review"],
  "Learn names the Onboard blob for disconnected or multi-tenant environments.", K.edr);
addv(D3, N26, EDRP, "The connection between Intune and Defender for Endpoint has not been set up. What does the package type setting offer in a new EDR policy?",
  ["Only the onboard and offboard blob options"],
  ["Auto from connector, which is always shown by default in new policies", "No package type setting, because Intune hides it until connected", "Auto from connector and a separate manual download link in the policy"],
  "Without a working connection, the setting only lets you paste the onboarding or offboarding blob.", K.edr);
add(D3, N26, "Where is the preconfigured policy that onboards Windows devices with one step?",
  ["Endpoint security > Endpoint detection and response > EDR Onboarding Status > Deploy preconfigured policy"],
  ["Devices > Windows > Configuration > Create > Templates > Defender onboarding", "Tenant administration > Connectors and tokens > Microsoft Defender for Endpoint > Deploy onboarding policy", "Apps > Windows > Add > Microsoft Defender for Endpoint, deployed as a required app to all devices"],
  "The preconfigured policy is assigned to All Devices with the default scope tag and no further settings.", K.conn);
add(D3, N26, "An EDR policy onboards a Windows device. Which of these does it NOT configure?",
  ["Attack surface reduction rules", "Windows Firewall settings", "Antivirus settings"],
  ["The Defender for Endpoint onboarding package"],
  "EDR onboarding does not configure ASR, firewall or antivirus. Use the matching endpoint security policy for each.", K.edr);
add(D3, N26, "What are the two Sample sharing values in an EDR policy?",
  ["All and None"],
  ["Files only and None", "Safe files only and All files except documents", "Prompt user and All"],
  "Sample sharing is All or None.", K.edrRef);
add(D3, N26, "Which toggle lets Intune endpoint security policies reach devices that are not enrolled in Intune, including Linux?",
  ["Allow Microsoft Defender for Endpoint to enforce Endpoint Security Configurations"],
  ["Enable Mobile Threat Defense for unenrolled devices in the Defender connector", "Allow unmanaged devices to receive Intune policies through Entra registration", "Use Defender for Endpoint as the MDM authority for the whole tenant, replacing Intune"],
  "This is security settings management for Defender for Endpoint, and it is set to On.", K.ssm);
add(D3, N26, "Which policy types can security settings management for Defender for Endpoint deliver to unenrolled devices?",
  ["Antivirus", "Attack surface reduction", "Endpoint detection and response"],
  ["Disk encryption", "Account protection and local admin passwords", "Endpoint Privilege Management elevation rules"],
  "Learn lists antivirus, firewall, EDR and attack surface reduction. BitLocker disk encryption is not one of them.", K.ssm);
add(D3, N26, "How do you assign attack surface reduction policies that use Defender for Endpoint security settings management?",
  ["To Microsoft Entra device groups, because user targeting is not supported"],
  ["To Microsoft Entra user groups, because the settings follow the signed-in user", "To either, because the policy handles users and devices the same way", "To dynamic user groups only, so devices are found automatically"],
  "Defender for Endpoint management supports device objects only.", K.asrCfg);
add(D3, N26, "Which groups does Learn recommend for an EDR policy for immediate deployment?",
  ["Device groups"],
  ["User groups, because EDR is a per-user feature", "Either, because both apply the moment the policy is created", "Role groups, because EDR needs an admin role"],
  "User groups require a user sign-in before the policy applies.", K.conn);

/* ---------- Endpoint security policies and conflicts ---------- */
add(D3, N26, "Which node holds the exploit protection, ASR rules, device control and app and browser isolation profiles?",
  ["Endpoint security > Attack surface reduction"],
  ["Endpoint security > Antivirus", "Endpoint security > Account protection", "Endpoint security > Endpoint detection and response"],
  "Attack surface reduction includes App and browser isolation, ASR rules, Device control, Exploit protection and Application control.", K.asrRef);
add(D3, N26, "Which profile types does the Account protection node include?",
  ["Account protection", "Local admin password solution", "Local user group membership"],
  ["Windows Firewall rules", "Microsoft Defender Antivirus", "Windows elevation settings policy"],
  "Account protection covers Windows Hello and Credential Guard settings, LAPS and local group membership.", K.manage);
add(D3, N26, "An endpoint security configuration policy and a compliance policy set the same setting differently. Which wins?",
  ["The compliance policy"],
  ["The configuration policy, because it was applied first", "Whichever policy was assigned to a user and not a device", "Neither, because Intune always reports an error and applies none"],
  "Compliance policies take precedence over configuration policies. Multiple compliance policies use the most restrictive value.", K.manage);
add(D3, N26, "Two configuration policies set the same setting to different values. What happens?",
  ["It conflicts and needs manual resolution, so the setting may not apply"],
  ["The most restrictive value always wins, as with compliance policies", "The policy with the later creation date overrides the older one", "The policy assigned to a user group always beats one assigned to devices"],
  "Configuration policy conflicts are not resolved automatically.", K.manage);
add(D3, N26, "An admin wants to use security baselines and endpoint security policies. What should be avoided?",
  ["Setting the same settings in both, because they can conflict"],
  ["Assigning both to the same device group on purpose", "Deploying endpoint security policies to Windows 11 devices", "Using scope tags with baseline profiles at all in the same tenant"],
  "Use endpoint security policies or baselines for the same settings, not both.", K.manage);
add(D3, N26, "Which Defender Antivirus requirement applies to ASR policies in Intune?",
  ["Defender Antivirus must be the primary antivirus on the device"],
  ["Defender Antivirus must be in passive mode on the device", "Defender for Cloud Apps must be connected to the tenant", "Tamper protection must be turned off while the policy is being applied"],
  "ASR rules need Microsoft Defender Antivirus as the primary antivirus.", K.asrRef);
add(D3, N26, "Which modes can an ASR rule be set to in an Intune policy?",
  ["Block", "Audit", "Warn", "Off"],
  ["Prompt every time"],
  "Rule modes are Off, Block, Audit and Warn. Not configured returns to the default.", K.asrCfg);
add(D3, N26, "Which ASR rules can usually be enabled in Block or Warn mode without prior testing?",
  ["The standard protection rules"],
  ["Every rule, because audit mode is only for older Windows versions", "Only the rules that apply to Office applications", "None, because Learn requires audit mode for all rules first"],
  "Test the other rules in Audit mode before moving to Block or Warn.", K.asrCfg);

/* ---------- Exploit protection ---------- */
add(D3, N26, "How do you create the XML file that an Intune exploit protection profile uploads?",
  ["Configure one device, then export it from Windows Security or with Get-ProcessMitigation"],
  ["Download it from the Defender portal under Settings > Endpoints > Exploit protection rules page", "Export it from the Intune admin center with the Get-IntuneExploitProtection cmdlet", "Write it by hand from the ASR rule GUID list in the Learn article, then upload that file"],
  "Export from a configured reference device, then deploy the XML to others.", K.xpImport);
add(D3, N26, "Which cmdlet imports an exploit protection XML configuration on a single device?",
  ["Set-ProcessMitigation -PolicyFilePath"],
  ["Import-ExploitProtection -Path", "Set-MpPreference -ExploitProtectionFile", "Add-ProcessMitigation -XmlPath"],
  "Get-ProcessMitigation -RegistryConfigFilePath exports, and Set-ProcessMitigation -PolicyFilePath imports.", K.xpImport);
add(D3, N26, "What does Learn recommend before deploying exploit protection mitigations to production devices?",
  ["Test in audit mode on a pilot group"],
  ["Apply them to all devices, then remove the failing ones", "Enable every mitigation first and disable them per app later", "Deploy to a user group, which prevents app compatibility issues"],
  "Mitigations can cause compatibility problems. Use audit mode and expand in stages.", K.xpEnable);
add(D3, N26, "While piloting exploit protection, which events should be watched for application problems?",
  ["Application crash events 1000 and 1001 and hang event 1002"],
  ["Defender events 5007 and 5001 in the Operational log", "Intune sync events 208 and 209 in the enrollment log", "Security events 4624 and 4625 for failed and successful sign-ins"],
  "Monitor application crashes (1000, 1001) and hangs (1002).", K.xpEnable);
add(D3, N26, "Which exploit protection mitigation applies to individual apps only?",
  ["Validate handle usage"],
  ["Control flow guard (CFG)", "Data Execution Prevention (DEP)", "Validate exception chains (SEHOP)"],
  "The PowerShell reference table marks Validate handle usage as app-level only. CFG, DEP and SEHOP can be set system-wide too.", K.xpCustom);

/* ---------- Windows Firewall policy ---------- */
add(D3, N26, "Which firewall profile do you use to create specific allow or block rules, such as an inbound rule for one app?",
  ["Windows Firewall rules"],
  ["Windows Firewall, with the inbound rules page in the profile", "Windows Firewall Advanced Security Policy for rules", "Defender Firewall extensions for custom applications"],
  "The Windows Firewall profile sets profile-level settings. The Windows Firewall rules profile holds individual rules.", K.fw);
add(D3, N26, "What is the limit for rules in one Windows Firewall rules profile?",
  ["150"],
  ["500", "1,000", "50"],
  "A Windows Firewall rules profile can hold up to 150 rules.", K.fw);
add(D3, N26, "A device receives two Windows Firewall rules profiles from different policies. What happens?",
  ["The rules are merged, and conflicting rules are both delivered to the device"],
  ["Intune reports a conflict and applies neither profile to the device", "The profile with the newest policy modified date replaces the other", "Only the profile assigned to the user group is kept on the device and the other is removed"],
  "Rules profiles from multiple policies merge, so conflicting rules both reach the device.", K.fw);
add(D3, N26, "Which of these can conflict with a Windows Firewall profile (the settings profile)?",
  ["Another Windows Firewall profile", "A device profile with firewall settings"],
  ["A Windows Firewall rules profile", "A macOS Firewall profile on a Mac assigned to the same user", "A Microsoft Defender Antivirus profile with scan settings"],
  "A Windows Firewall profile conflicts with other Windows Firewall profiles or device configuration, but not with rules profiles.", K.fw);
add(D3, N26, "A firewall rule specifies the local port range 8000-8100. Which protocol must it use?",
  ["TCP (6) or UDP (17)"],
  ["ICMP (1) or Any", "Any protocol is valid", "Only TCP (6)"],
  "Port ranges require protocol 6 or 17.", K.fw);
add(D3, N26, "A firewall rule uses Edge traversal. Which direction must it have?",
  ["Inbound"],
  ["Outbound", "Either direction", "Both inbound and outbound"],
  "Edge traversal needs an inbound rule.", K.fw);
add(D3, N26, "Which platforms does the Intune firewall policy support?",
  ["Windows", "macOS"],
  ["Linux", "Android Enterprise", "iOS/iPadOS"],
  "Firewall policy covers Windows Firewall, Windows Firewall rules and macOS Firewall.", K.manage);

/* ---------- Endpoint Privilege Management ---------- */
add(D3, N26, "What does EPM require beyond Intune?",
  ["An EPM add-on license, either standalone or as part of the Intune Suite"],
  ["A Microsoft Defender for Endpoint Plan 2 license for each user", "A Windows Enterprise E5 license on each device", "An Entra ID P2 license and a Privileged Identity Management role for each user"],
  "EPM is an Intune add-on and is included in the Intune Suite.", L.epm);
add(D3, N26, "Which two policy types does EPM use?",
  ["Elevation settings policy", "Elevation rules policy"],
  ["Elevation approval policy", "Elevation compliance policy"],
  "Settings turn EPM on and set defaults. Rules define files and how they elevate.", L.epmPlan);
addv(D3, N26, EPMP, "A user without any matching rule right-clicks a file and selects Run with elevated access on a device with this policy. What happens?",
  ["The request is denied"],
  ["The user gets a confirmation prompt and the file runs elevated", "The request goes to an admin for support approval in the console", "The file runs elevated without any prompt for the user"],
  "A default elevation response of Not configured is treated as Deny all requests.", L.epmSettings);
add(D3, N26, "Which are the default elevation response options in an elevation settings policy?",
  ["Deny all requests", "Require support approval", "Require user confirmation"],
  ["Allow all requests automatically", "Require Windows authentication only", "Require a certificate approval first"],
  "Not configured behaves as Deny all requests.", L.epmSettings);
add(D3, N26, "Which elevation rule type requires an administrator to approve each request?",
  ["Support approved"],
  ["User confirmed, with Windows authentication required", "Elevate as current user, with a business justification", "Automatic, with a file hash defined in the rule"],
  "Support approved requests wait for an admin with the right permissions.", L.epmRules);
add(D3, N26, "What does an elevation rule need when its elevation type is Automatic?",
  ["A file hash"],
  ["A business justification from the user", "A support approval record", "A reusable certificate group"],
  "A hash is required for automatic rules. For User confirmed, a certificate or a hash can be used.", L.epmRules);
add(D3, N26, "Which file types can EPM elevate?",
  [".exe", ".msi", ".ps1"],
  [".bat", ".vbs script files", ".dll library files"],
  "EPM supports .exe, .msi and .ps1 files.", L.epm);
add(D3, N26, "Two EPM rules target the same file, and one of them is a Deny rule. What happens?",
  ["The Deny rule wins and the elevation is denied"],
  ["The rule with the most attributes always wins", "The rule deployed to the device wins over the user rule", "The Automatic rule wins because it needs no prompt"],
  "Deny rules always take precedence.", L.epmPlan);
add(D3, N26, "An EPM rule deployed to a user conflicts with one deployed to a device. Which takes precedence?",
  ["The rule deployed to the user"],
  ["The rule deployed to the device", "The rule created most recently", "The rule with the longest file path"],
  "After Deny rules, user rules beat device rules, then hash-based rules rank as most specific.", L.epmPlan);
add(D3, N26, "A device gets two elevation settings policies with conflicting values. What does the EPM client do?",
  ["Reverts to default client behavior until the conflict clears"],
  ["Applies the more restrictive value from both policies", "Applies the policy that was assigned most recently", "Disables EPM until one of the conflicting policies is removed"],
  "An Enable EPM conflict defaults to EPM enabled.", L.epmPlan);
add(D3, N26, "Elevation settings are assigned to a group of users. What scope do the settings have?",
  ["Device-scoped"],
  ["User-scoped, so each user can have a separate default response", "Group-scoped, so each group gets its own client behavior", "App-scoped, so each rule decides its own default"],
  "Settings are device-scoped even when assigned to user groups.", L.epmPlan);
add(D3, N26, "Which elevation type runs under the signed-in user's own account, not a virtual account?",
  ["Elevate as current user"],
  ["User confirmed, with a virtual account", "Automatic, with a virtual account", "Support approved, with a virtual account"],
  "All other types use a virtual account to isolate the elevated process from the user profile.", L.epmRules);
add(D3, N26, "How can an admin create an elevation rule from real elevation data?",
  ["Open the Elevation report, select the file and choose Create a rule from it"],
  ["Export the Defender device timeline and import it into a new rules policy", "Copy the rule from a support approved request into the Windows settings page", "Run the EPM rule wizard on the device in the Settings app and export it"],
  "Rules can be built from the Elevation report or from a support approved request.", L.epmRules);
add(D3, N26, "What do the child process behavior options in an elevation rule control?",
  ["Whether child processes need their own rule, or are all denied elevation"],
  ["Whether child processes inherit the parent's elevation type automatically", "Whether child processes run under the virtual account or the user account", "Whether child processes can bypass the Deny rule for the same file"],
  "The options are Require rule to elevate and Deny all.", L.epmRules);
add(D3, N26, "A user is a local administrator. How does EPM treat their elevations?",
  ["As unmanaged elevations, which are reported but not managed"],
  ["As managed elevations that need a rule to run", "As denied elevations because EPM is for standard users", "As support approved elevations sent to the Intune admin for review"],
  "Unmanaged elevations happen without EPM, for example with Run as administrator by an admin.", L.epm);

/* ---------- App Control for Business ---------- */
add(D3, N26, "Where do you create an App Control for Business policy in Intune?",
  ["Endpoint security > App Control for Business > Create policy"],
  ["Endpoint security > Attack surface reduction > Application control profile", "Devices > Configuration > Create > Templates > Application control", "Apps > Windows > Policies for App Control for Business"],
  "The older Application control profile under Attack surface reduction is deprecated.", L.appControl);
add(D3, N26, "What are the two ways to supply an App Control for Business policy in Intune?",
  ["Enter XML data", "Built-in controls"],
  ["Upload a catalog file", "Import from Group Policy"],
  "The policy uses the ApplicationControl CSP. It targets devices only.", L.appControl);
add(D3, N26, "What is the difference between Audit only and Enforce in an App Control policy?",
  ["Audit only logs what would be blocked, and Enforce blocks what is not allowed"],
  ["Audit only blocks unsigned apps, and Enforce blocks all new installs", "Audit only applies to user groups only, and Enforce applies to device groups only", "Audit only prompts the user first, and Enforce silently blocks the app"],
  "Review audit events before moving to Enforce.", L.appControl);
add(D3, N26, "A supplemental App Control policy is deployed. What does it do?",
  ["Extends a base policy, identified by its Policy ID"],
  ["Replaces the base policy and removes its rules from the device", "Applies only to Store apps and nothing else on the device", "Converts the base policy from Enforce to Audit only"],
  "Supplemental policies add to a base policy and are linked by Policy ID.", L.appControl);
add(D3, N26, "What does the managed installer do in an App Control scenario?",
  ["Trusts apps installed by a set installer, such as the Intune Management Extension"],
  ["Installs the App Control policy on user devices through the Company Portal app", "Signs every app on the device with the tenant certificate so that it is trusted at launch", "Blocks installs that do not come from the Microsoft Store or Company Portal"],
  "Apps deployed through the managed installer are tagged and allowed.", L.appControl);
add(D3, N26, "An admin sets the Intune Management Extension as a managed installer. What happens to apps that were deployed earlier?",
  ["They are not tagged, so the managed installer does not trust them"],
  ["They are tagged automatically at the next check-in", "They are removed from the device until they are redeployed by Intune", "They are tagged only if the user signs in again"],
  "Only apps deployed after the setting are tagged.", L.appControl);
add(D3, N26, "Which two built-in controls does the App Control for Business policy offer?",
  ["Trust Windows components and Store apps", "Trust apps installed by the managed installer"],
  ["Trust apps signed by the tenant certificate authority", "Trust apps from the Company Portal only, for signed-in users"],
  "Built-in controls give fixed policies, so use XML for more control.", L.appControl);

/* ---------- macOS FileVault ---------- */
add(D3, N26, "Where do you create a FileVault policy in Intune?",
  ["Endpoint security > Disk encryption > Create policy > macOS > FileVault"],
  ["Devices > macOS > Configuration > Create > Templates > Endpoint protection only", "Endpoint security > Account protection > macOS > FileVault", "Apps > macOS > Policies > FileVault"],
  "FileVault is in the Disk encryption node. The endpoint protection template also has FileVault settings.", K.fv);
addv(D3, N26, FVP, "A user keeps ignoring the FileVault prompt on a device with this policy. What happens after the third bypass?",
  ["Encryption is required before the next sign-in is allowed"],
  ["The user is prompted forever, and encryption is never required", "The device is marked noncompliant and is wiped after 24 hours", "FileVault is turned on silently at the next restart"],
  "Bypass can be set from 1 to 10. No limit, always prompt never requires encryption.", K.fvRef);
add(D3, N26, "What is the allowed range for personal recovery key rotation in a FileVault policy?",
  ["1 to 12 months"],
  ["30 to 365 days", "1 to 52 weeks", "1 to 24 months, set in whole months"],
  "Rotation can also be left as Not configured.", K.fvRef);
add(D3, N26, "For which macOS devices can an Intune admin view the FileVault personal recovery key?",
  ["Devices marked as Corporate only"],
  ["All managed devices, including personal ones, for the helpdesk role", "Devices enrolled with Automated Device Enrollment only", "Devices that are encrypted by a user and not by policy"],
  "Admins cannot view recovery keys for Personal devices. Users can retrieve their own.", K.fv);
add(D3, N26, "Which RBAC right lets an admin rotate a FileVault recovery key?",
  ["Remote tasks > Rotate FileVault key"],
  ["Managed devices > Rotate FileVault key", "Security baselines > Rotate FileVault key", "Device configurations > Rotate FileVault key"],
  "The right is Rotate FileVault key, under Remote tasks.", K.fv);
add(D3, N26, "A Mac was encrypted by the user before Intune policy. How can Intune take over key management?",
  ["The user stores the key in Company Portal, or makes a new one with fdesetup changerecovery"],
  ["The admin imports the key from Apple Business Manager into the Intune encryption report page", "The admin decrypts the disk and then re-encrypts it from Intune remotely", "Intune reads the key from the Mac on its own once the FileVault policy arrives on the Mac"],
  "Both methods need an active FileVault policy from Intune.", K.fv);
add(D3, N26, "What does FileVault configuration require on macOS 10.15 and later?",
  ["User approved MDM enrollment"],
  ["Automated Device Enrollment", "Supervised mode", "A Defender for Endpoint connection"],
  "Without user approved MDM enrollment, Intune cannot configure FileVault.", ML + 'intune/device-configuration/endpoint-security/ref-endpoint-protection-macos');

/* ---------- Windows Hello for Business ---------- */
add(D3, N26, "A Windows Hello for Business tenant-wide policy is changed after devices enrolled. Which devices get the change?",
  ["Only devices that enroll after the change"],
  ["All enrolled devices at the next sync", "Devices that are Entra joined and not hybrid joined", "Devices in the groups it was assigned to"],
  "The tenant policy applies at enrollment time and is not changed for devices already enrolled.", K.whfbCfg);
add(D3, N26, "Where is the tenant-wide Windows Hello for Business policy configured?",
  ["Devices > Windows > Windows enrollment > Windows Hello for Business"],
  ["Endpoint security > Account protection > Windows Hello for Business, then the tenant tab", "Tenant administration > Windows Hello > Tenant-wide policy page", "Devices > Configuration > Windows Hello for Business"],
  "Account protection profiles apply after enrollment and can be targeted to groups.", K.whfbTenant);
add(D3, N26, "Which options apply Windows Hello for Business settings after enrollment?",
  ["Account protection policy", "Settings catalog", "Custom policy using the PassportForWork CSP"],
  ["Windows enrollment page", "Automatic enrollment (MDM user scope) settings", "Enrollment Status Page profile"],
  "Policy changes arrive during the regular refresh. Security baselines also include some Hello settings.", K.whfbCfg);
add(D3, N26, "Which Windows Hello for Business policy source wins when Group Policy and Intune both set it?",
  ["Group Policy"],
  ["Intune", "The most restrictive of the two", "The one that was applied last"],
  "Group Policy takes precedence, and the Intune settings are ignored.", ML + 'windows/security/identity-protection/hello-for-business/deploy/hybrid-key-trust-enroll');
add(D3, N26, "Which Intune profile is the only template for new identity and account protection policies since July 2024?",
  ["Account protection in the Endpoint security node"],
  ["Identity protection in the Device configuration templates", "Account protection (Preview) in Endpoint security", "Windows Hello in the Windows enrollment page"],
  "The older Identity protection and Account protection (Preview) profiles still work for existing instances.", K.whfbRef);
add(D3, N26, "What does Use a Trusted Platform Module (TPM) do when set to Enable?",
  ["Only devices with a usable TPM can provision Hello for Business"],
  ["Hello keys are stored in the TPM and also backed up in Entra ID", "Devices without a TPM use a virtual TPM that Intune supplies to them", "Hello is blocked for users who sign in with a password"],
  "With Not configured, devices try the TPM first and can fall back to software encryption.", K.whfbRef);
add(D3, N26, "What is true about biometrics in Windows Hello for Business?",
  ["Users must still set a PIN as a backup"],
  ["Biometrics replace the PIN, which is removed after setup", "Biometrics are allowed only on hybrid joined devices", "A PIN is only needed on devices without a TPM"],
  "A PIN is configured in case biometric sign-in fails.", K.whfbRef);
add(D3, N26, "Which Account protection setting turns on Credential Guard so that it cannot be turned off remotely?",
  ["Enable with UEFI lock"],
  ["Enable without UEFI lock", "Enable with TPM lock", "Not configured"],
  "With UEFI lock, the UEFI persisted configuration must be cleared on the device.", K.acctRef);
add(D3, N26, "What does the Use security keys for sign-in setting do?",
  ["Enables the Windows Hello security key as a sign-in credential for tenant PCs"],
  ["Requires a security key for every user's Microsoft Entra sign-in in the tenant", "Registers FIDO2 keys on their behalf for users who have no methods yet", "Replaces the PIN with the key on devices that do not have a TPM chip"],
  "It can be set in the tenant-wide policy and in account protection settings.", K.whfbTenant);
