/* Shorten the longest correct answers */
const _s = (id, c) => { Q.find(x => x.id === id).c = c; };
_s(55, ["Marked noncompliant after the grace period, then the noncompliance actions run"]);
_s(59, ["It stays on its old version until you change the profile version yourself"]);
_s(65, ["Enable the Defender for Endpoint connector in Intune and deploy an EDR onboarding policy"]);
_s(66, ["A compliance policy with a maximum machine risk score, plus a CA policy requiring compliance"]);
_s(69, ["Issue and manage certificates from a cloud CA with no on-premises infrastructure"]);
_s(83, ["Microsoft 365 Apps policies (Cloud Policy service in the Microsoft 365 Apps admin center)"]);
_s(97, ["A device name template in the Autopilot deployment profile or a device naming policy"]);
_s(39, ["Import the custom ADMX files into Intune, then configure settings from the imported template"]);
_s(46, ["A provisioning policy with an Azure network connection to your own virtual network"]);
_s(32, ["Windows Backup for Organizations, with the restore page in the Enrollment Status Page"]);
_s(29, ["Self-deploying mode with Microsoft Entra join, which needs TPM 2.0 attestation"]);
_s(31, ["Enrollment Status Page set to block device use until required apps install"]);
_s(49, ["The Remote Help add-on or Intune Suite license, for both helper and sharer"]);
