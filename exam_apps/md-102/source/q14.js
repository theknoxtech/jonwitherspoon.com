/* ===== Scenario practice: pick the policy type ===== */
Object.assign(L, {
  complianceOv: ML + 'intune/device-security/compliance/overview',
  esPolicies: ML + 'intune/device-configuration/endpoint-security/manage-policies',
  esOverview: ML + 'intune/device-security/endpoint-security-policies',
  profilesOv: ML + 'intune/device-configuration/overview'
});
const TP = 'Choose the policy type';
const P_COMP = "Compliance policy", P_CONF = "Device configuration profile", P_ES = "Endpoint security policy", P_MAM = "App protection policy", P_APP = "App configuration policy";
const P_ALL = [P_COMP, P_CONF, P_ES, P_MAM, P_APP];
function addp(d, q, correct, e, l) { add(d, TP, q, [correct], P_ALL.filter(x => x !== correct), e, l); }

addp(D3, "Scenario: Company Windows laptops must have BitLocker turned on. Devices without it must be marked noncompliant after a 3-day grace period, and Conditional Access must then block them from Exchange Online. Which policy type do you create?",
  P_COMP, "Compliance policies evaluate a device against rules (such as encryption), report a status, and can take actions for noncompliance after a grace period. Conditional Access uses that status. A configuration or endpoint security policy would turn BitLocker on but would not report compliance or start the grace period.", L.complianceOv);

addp(D3, "Scenario: The security team wants to set the Microsoft Defender Antivirus scan schedule and path exclusions on all Windows 11 devices, and manage the settings from the Endpoint security area. Which policy type?",
  P_ES, "Endpoint security policies (antivirus, firewall, disk encryption, attack surface reduction and so on) are purpose-built to configure security settings. A compliance policy only checks a device against requirements, and a device configuration profile covers general device settings.", L.esPolicies);

addp(D2, "Scenario: You need to push a Wi-Fi profile that uses certificate authentication to company iPhones. Which policy type?",
  P_CONF, "Device configuration profiles deliver settings and features such as Wi-Fi, VPN, certificates and email to enrolled devices. Compliance and app policies do not push Wi-Fi settings.", L.profilesOv);

addp(D4, "Scenario: Employees use personal phones that are NOT enrolled in Intune. You must stop them saving Outlook attachments to personal cloud storage and require a PIN to open Outlook. Which policy type?",
  P_MAM, "App protection policies work without device enrollment (MAM) and control data transfer, PIN requirements and saving of organization data inside managed apps. A device compliance or configuration policy needs an enrolled device.", L.mamCreate);

addp(D4, "Scenario: On managed iPhones you want Outlook for iOS to open already signed in with the user's email address and your organization's settings, with no manual setup. Which policy type?",
  P_APP, "App configuration policies deliver key and value settings to an app, such as the account or server details. They do not enforce data protection rules; that is the job of an app protection policy.", L.appConfig);

addp(D3, "Scenario: Any iPhone that is jailbroken must be reported as noncompliant and lose access to company email through Conditional Access. Which policy type?",
  P_COMP, "Jailbreak detection is a device health rule in a compliance policy. The noncompliant status then feeds Conditional Access. A configuration profile cannot report a compliance state.", L.complianceOv);

addp(D3, "Scenario: You must create Microsoft Defender Firewall rules and set the domain, private and public profile behavior for all Windows devices, from the security administrator's own policy area. Which policy type?",
  P_ES, "Firewall is one of the endpoint security policy types for Windows. Endpoint security policies show only the relevant firewall settings, which is easier to manage than the same settings buried in a general profile.", L.esPolicies);

addp(D2, "Scenario: Company-owned Android Enterprise tablets in a warehouse must have the camera disabled and the screen lock timeout set. Which policy type?",
  P_CONF, "A device restrictions profile (a device configuration profile) sets restrictions and features on the device. Compliance policies only check and report.", L.profilesOv);

addp(D4, "Scenario: On BYOD phones that are not enrolled, Teams must require a PIN, and company data in the app must be wiped after the device has been offline for 30 days. Which policy type?",
  P_MAM, "The offline grace period, PIN settings and selective wipe of organization data inside the app belong to an app protection policy.", L.mamAndroid);

addp(D3, "Scenario: You want to turn on Attack surface reduction rules, such as blocking Office apps from creating child processes, on all Windows 11 PCs. Which policy type?",
  P_ES, "Attack surface reduction is an endpoint security policy type for Windows. It configures the rules. A compliance policy cannot turn the rules on.", L.esPolicies);

addp(D2, "Scenario: Windows 11 PCs need a Microsoft Entra-joined VPN connection profile with the gateway address and authentication method preconfigured. Which policy type?",
  P_CONF, "VPN connection settings come from a device configuration profile (a VPN template or the settings catalog).", L.profilesOv);

addp(D4, "Scenario: On enrolled and managed Android devices, you want Microsoft Edge to open with a company homepage and a set of managed bookmarks already in place. Which policy type?",
  P_APP, "An app configuration policy for managed devices (or managed apps) sends the key and value settings that Edge reads. App protection policies protect data but do not set homepages or bookmarks.", L.appConfig);

addp(D3, "Scenario: Every iPad must run at least the minimum approved iPadOS version. Users with an older version should get a notification, then be marked noncompliant after 5 days. Which policy type?",
  P_COMP, "Minimum OS version is a compliance rule, and notifications and grace periods are actions for noncompliance. A configuration profile cannot mark a device noncompliant.", L.complianceOv);

addp(D3, "Scenario: You need to enable BitLocker disk encryption on Windows devices, including recovery key escrow to Microsoft Entra ID, and manage it as a security setting. Which policy type?",
  P_ES, "Disk encryption is an endpoint security policy type that configures BitLocker. To then verify that devices are encrypted and report it, you would also add a compliance policy.", L.bitlocker);

addp(D2, "Scenario: A shared Windows 11 kiosk PC must run a single app in full screen for anyone who walks up to it. Which policy type?",
  P_CONF, "Kiosk mode is configured with a device configuration profile (the kiosk template or the settings catalog). The other four types do not create kiosk experiences.", L.profilesOv);

addp(D3, "Scenario: You must require that Microsoft Defender real-time protection is on, and block mailbox access from any Windows PC where it is turned off. Which policy type do you use to require this and report the result?",
  P_COMP, "Requiring a state and reporting whether the device meets it is the job of a compliance policy, with Conditional Access doing the blocking. An endpoint security antivirus policy would set the setting but would not check or report compliance on its own.", L.complianceOv);

addp(D3, "Scenario: Real-time protection keeps being turned off by users. You want to set it to enabled, and set the cloud protection level, on all Windows devices so that the settings are enforced. Which policy type?",
  P_ES, "Antivirus is an endpoint security policy type, and it sets the actual Defender settings. Pair it with a compliance policy if you also want a reported compliant or noncompliant state.", L.esPolicies);
