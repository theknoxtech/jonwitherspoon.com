/* ===== DOMAIN 3: Protect devices ===== */
const T31 = 'Compliance and Conditional Access', T32 = 'Endpoint security policies and baselines', T33 = 'BitLocker and encryption', T34 = 'Defender and attack surface', T35 = 'EPM, App Control and Cloud PKI';

add(D3, T31, "Which Conditional Access grant makes sure only devices that meet your Intune compliance policies can open Exchange Online?",
  ["Require device to be marked as compliant"],
  ["Require approved client app", "Require multifactor authentication", "Require Hybrid Microsoft Entra joined device"],
  "The compliance grant uses the Intune compliance state. 'Require approved client app' was retired in favor of 'Require app protection policy'. MFA does not evaluate device state.", L.caGrant);

add(D3, T31, "You used the retired 'Require approved client app' grant in a Conditional Access policy for mobile email. What should you move to?",
  ["Require app protection policy"],
  ["Require device to be marked as compliant", "Block legacy authentication", "Require password change"],
  "Microsoft retired 'Require approved client app'. Use 'Require app protection policy' (MAM-based) and migrate the existing policies using the guidance on Learn.", L.caMigrate);

add(D3, T31, "A compliance policy for Windows requires BitLocker and a 12-character password. A device fails the password rule. What happens to the device in Intune?",
  ["It is marked noncompliant after the grace period and the actions for noncompliance run"],
  ["It is retired automatically right away", "It is excluded from Conditional Access", "Intune resets the password remotely"],
  "Actions for noncompliance (email, mark noncompliant, retire) run on a schedule you define. The default action is to mark the device noncompliant immediately, and a grace period can delay it.", L.rbac);

add(D3, T31, "Users complain that a compliant iPad is blocked from Microsoft 365 right after a policy change. Which detail usually explains it?",
  ["The device has not checked in yet, so its compliance state is still evaluating"],
  ["iPadOS devices are not supported by compliance", "Conditional Access ignores compliance for tablets", "The user needs a Windows license"],
  "Devices report compliance on check-in. Right after a policy change or enrollment they may be 'in grace period' or unevaluated until the next sync.", L.caGrant);

add(D3, T31, "Which setting in a compliance policy detects the use of a jailbroken iOS device more reliably, with location-based checks?",
  ["Enhanced jailbreak detection"],
  ["Require a passcode", "Restricted apps list", "Minimum OS version"],
  "Enhanced jailbreak detection uses additional signals and may use location services to run checks more frequently on iOS/iPadOS.", L.rbac);

add(D3, T32, "You want to reduce the attack surface of Windows PCs using a Microsoft-recommended set of settings and see which devices drift from it. What should you deploy?",
  ["A security baseline profile, such as Windows 10 and later security baseline"],
  ["A Win32 app with settings.ini", "A custom OMA-URI profile for each setting", "An app protection policy"],
  "Security baselines are preconfigured groups of recommended settings, and Intune reports each device as matching, not matching, or conflicting with the baseline.", L.baselines);

add(D3, T32, "A new version of the Windows security baseline is released. What happens to the profile you already deployed?",
  ["It keeps running on its version. You must change the profile to the newer version yourself"],
  ["It updates automatically to the latest version", "It is deleted and recreated", "All its settings reset to Not configured"],
  "Existing baseline profiles stay on the version they were created with. You can use 'Change version' in the profile to pick a newer one and review the differences first.", L.baselines);

add(D3, T32, "You manage Defender Antivirus exclusions, scan schedules and firewall rules for Windows. Which Intune area has focused policy types for these?",
  ["Endpoint security"],
  ["Apps > App protection", "Tenant administration > Connectors", "Devices > Enrollment"],
  "The Endpoint security node holds antivirus, disk encryption, firewall, EDR, ASR and account protection policies, scoped by the Endpoint Security Manager role.", L.baselines);

add(D3, T32, "A configuration conflict shows between a security baseline and an Endpoint security antivirus policy that set the same value differently. What does the device report?",
  ["Conflict for that setting"],
  ["Success from both", "Not applicable", "Pending for 7 days"],
  "When two policies set the same setting to different values, the device reports a conflict, and the setting may not apply. Remove the overlap or consolidate the policy.", L.baselines);

add(D3, T33, "BitLocker must be enabled silently on Entra joined Windows 11 laptops, and the recovery keys must be available to IT. Which policy and result?",
  ["An Endpoint security disk encryption policy, with the recovery key escrowed to Entra"],
  ["A compliance policy alone, which enables BitLocker automatically", "A Win32 app that runs manage-bde", "A Windows Hello for Business policy"],
  "Disk encryption policies enable BitLocker, and recovery keys are escrowed to Entra. Silent enablement needs an Entra joined or hybrid joined device with TPM 1.2 or later, UEFI with Secure Boot and WinRE available. Set Require Device Encryption to enabled, the other-disk-encryption warning off, and allow standard user encryption when users are not admins.", L.bitlocker);

add(D3, T33, "A user is locked out at the BitLocker recovery screen. Where can a help desk admin find the recovery key for that device?",
  ["In the device's Recovery keys page in Intune, or in Entra ID"],
  ["In the Autopilot device record", "In the device's compliance report", "In the Windows Update report"],
  "Recovery keys are escrowed to Entra and shown in Intune on the device. The help desk needs the right permission (for example Helpdesk Administrator or a custom role).", L.recoveryKey);

add(D3, T33, "To limit exposure when a BitLocker recovery key has been read by a help desk member, what is the best follow-up?",
  ["Rotate the BitLocker recovery key from Intune"],
  ["Wipe the device", "Retire the device", "Delete the Entra object"],
  "Rotation generates a new recovery password so the one that was disclosed no longer works. It needs the policy option to rotate enabled.", L.bitlockerRotate);

add(D3, T34, "You want Defender for Endpoint to onboard Intune-managed Windows PCs automatically. What is the usual configuration?",
  ["Enable the Microsoft Defender for Endpoint connector in Intune, and deploy an EDR onboarding policy"],
  ["Install the Company Portal on each PC", "Create a custom role for Defender", "Join each PC to a hybrid domain"],
  "After connecting Intune and Defender for Endpoint, an Endpoint detection and response policy delivers the onboarding blob to devices. Risk can then feed compliance as a machine risk score.", L.baselines);

add(D3, T34, "Defender for Endpoint raises a device risk of High. You want Conditional Access to block that device from resources. What must exist?",
  ["A compliance policy that sets the maximum allowed machine risk score, plus a CA policy that requires compliant devices"],
  ["An app protection policy for the Defender app", "A security baseline with a risk threshold", "A scope tag named High risk"],
  "The risk score is evaluated in the compliance policy (Microsoft Defender for Endpoint section). Conditional Access then enforces the compliant requirement.", L.caGrant);

add(D3, T35, "Standard users must run a signed installer that needs admin rights, without giving them local admin. Which Intune Suite capability fits?",
  ["Endpoint Privilege Management with an elevation rule"],
  ["Local user group membership policy", "LAPS", "A Win32 app running in user context"],
  "EPM lets standard users run specific approved apps with elevated rights through elevation rules (automatic, user confirmed, or support approved). It is part of the Intune Suite.", L.epm);

add(D3, T35, "An EPM elevation rule requires the user to type a business justification and sign in to confirm. Which elevation type is this?",
  ["User confirmed"],
  ["Automatic", "Support approved", "Deny"],
  "User confirmed requires the user to confirm (with optional justification and authentication) before the app runs elevated. Support approved needs an admin approval of a request.", L.epmRules);

add(D3, T35, "Intune Cloud PKI is used mainly to do what?",
  ["Issue and manage certificates from a cloud-hosted CA without on-premises infrastructure"],
  ["Encrypt BitLocker volumes in the cloud", "Replace Microsoft Entra Conditional Access", "Sign Win32 app packages automatically"],
  "Cloud PKI is a cloud service for private CA hierarchies (root + issuing) and SCEP certificate delivery to devices without NDES or on-premises CAs. It is part of Intune Suite.", L.cpki);

add(D3, T35, "You already have an on-premises root CA and want a Cloud PKI issuing CA beneath it. Which option do you pick?",
  ["Bring your own CA (BYOCA) with a Cloud PKI issuing CA signed by your root"],
  ["Cloud PKI root CA only", "Create the CA in Azure Key Vault", "Use a SCEP profile that points to the NDES server"],
  "With BYOCA you create the issuing CA in Cloud PKI and sign its CSR with your private root CA, keeping an existing trust anchor.", L.cpkiByo);

add(D3, T35, "Which Windows feature, managed from Intune, allows only approved apps and scripts to run, using policies you create?",
  ["App Control for Business"],
  ["BitLocker To Go", "Windows Hello for Business", "Credential Guard"],
  "App Control for Business (formerly WDAC) restricts what code can run. Intune can deploy built-in policies and custom XML, optionally in audit mode first.", L.appControl);
