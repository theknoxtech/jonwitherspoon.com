/* ===== Removing MSI Office when deploying Microsoft 365 Apps (Nov 15). Facts: Learn intune/app-management/deployment/add-microsoft-365-windows and microsoft-365-apps/deploy/upgrade-from-msi-version. ===== */
const M1 = ML + 'intune/app-management/deployment/add-microsoft-365-windows';
const M2 = ML + 'microsoft-365-apps/deploy/upgrade-from-msi-version';
add(D4, T4c, "Microsoft 365 Apps is deployed through Intune to a PC that still has MSI-based Office installed, and Remove other versions is set to No. What happens?",
  ["The installation does not succeed"],
  ["Both versions install side by side and share the same file associations", "The MSI version is upgraded in place and its settings move over", "Intune installs the apps and removes the MSI version at the next restart"],
  "Learn says the Intune-delivered Microsoft 365 Apps fail to install while MSI Office is present, unless you use the Remove MSI feature.", M1);
add(D4, T4c, "You set Remove other versions to Yes in the Microsoft 365 Apps app, and you selected only Word and Excel to install. Which MSI Office apps are removed?",
  ["All Office (MSI) apps on the device"],
  ["Only Word and Excel, because those are the apps you selected", "Only the apps in the suite that match the selected channel", "Only the apps that are closed when the install starts on the device"],
  "The removal is not limited to the apps you chose to install in Configure App Suite.", M1);
add(D4, T4c, "Which Office Deployment Tool element removes MSI-based Office during an install?",
  ["RemoveMSI"],
  ["UninstallMSI, placed inside the Add element", "Remove, with the product ID of the MSI suite", "Updates, with the target version set to the new build number"],
  "Add <RemoveMSI /> to configuration.xml. It handles Windows Installer versions of Office 2007 to 2016.", M2);
add(D4, T4c, "An admin uses RemoveMSI and wants users to keep the same language packs they had. Which Language ID goes in configuration.xml?",
  ["MatchPreviousMSI"],
  ["KeepExisting, with the RemoveMSI element removed", "SameAsInstalled, along with at least one other language", "PreserveLanguages, placed under the Updates element in the file"],
  "MatchPreviousMSI needs the RemoveMSI element and at least one language ID such as en-us.", M2);
add(D4, T4c, "You need to remove MSI Office but keep Visio Professional. Which configuration does this?",
  ["RemoveMSI with an IgnoreProduct element for VisPro"],
  ["RemoveMSI with the Exclude attribute set to Visio on the Add element", "Remove with the product ID for Visio Professional added to it", "Two separate Add elements, one for Office and one for Visio, and no RemoveMSI"],
  "IgnoreProduct keeps a product by ID. Only whole products can be kept, not single apps from a suite.", M2);
add(D4, T4c, "Which previous Office installs does RemoveMSI uninstall?",
  ["Windows Installer (MSI) Office 2007, 2010, 2013 and 2016"],
  ["Click-to-Run Office 2016 and Office 2019", "Microsoft Store (Centennial) Office apps and Office 2019", "Every earlier Office version, whatever the installation technology"],
  "Click-to-Run versions are removed with the ODT Remove element or Control Panel instead.", M2);
add(D4, T4c, "Office 2019 (Click-to-Run) is on a PC that is getting Microsoft 365 Apps. How do you remove it with the ODT?",
  ["Use the Remove element in configuration.xml"],
  ["Use RemoveMSI, because Office 2019 is a Windows Installer product", "Nothing is needed, because Click-to-Run versions upgrade in place", "Set Remove other versions to Yes in the Intune app, which handles it"],
  "RemoveMSI does not uninstall Click-to-Run Office. Use the Remove element.", M2);
add(D4, T4c, "An MSI Office uninstall is triggered by the Microsoft 365 Apps deployment. When is the restart needed?",
  ["A restart finishes the uninstall, but it is not enforced"],
  ["A restart is forced right after the removal and before the install starts", "No restart is ever needed for MSI Office removal", "A restart is enforced only when Display Level is set to Full"],
  "You can restart after the Microsoft 365 Apps installation is finished.", M2);
add(D4, T4c, "Removing MSI Office fails on some PCs. What is a likely cause?",
  ["Office apps were open on the PC"],
  ["The PC was already running a Click-to-Run Office version", "The Office language packs were installed before the apps", "The install channel was Current Channel and not Monthly Enterprise"],
  "Removal can fail if a product is open, especially with the ODT display level set to None.", M2);
add(D4, T4c, "What happens to a user's documents and settings when MSI Office is removed during the Microsoft 365 Apps install?",
  ["They are kept"],
  ["They are removed and restored from OneDrive after the install", "Only the documents are kept, and settings are reset to default", "They are kept only if the user signs in during the removal"],
  "User settings, preferences and documents are retained, even if all Office products are uninstalled.", M2);

/* ===== Link fixes (Nov 15): five questions pointed at the RBAC overview page. Q57 also rewritten: Learn's current iOS compliance settings page has no "Enhanced jailbreak detection" setting. ===== */
function PL(id, l, extra) { const q = Q.find(x => x.id === id); q.l = l; if (extra) Object.assign(q, extra); }
const CMP = ML + 'intune/device-security/compliance/overview';
PL(18, CMP);
PL(55, CMP);
PL(20, ML + 'intune/device-security/identity-protection/configure-tenant-wide-policy');
PL(180, ML + 'intune/device-security/compliance/ref-android-enterprise-settings');
PL(57, ML + 'intune/device-security/compliance/ref-ios-ipados-settings', {
  q: "Which iOS/iPadOS compliance setting marks jailbroken devices as not compliant?",
  c: ["Jailbroken devices set to Block"],
  w: ["Require a passcode on the device", "Restricted apps list for iOS", "Minimum OS version requirement"],
  e: "Jailbroken devices is in the Device health section of the iOS/iPadOS compliance policy. Block marks them as not compliant, and Conditional Access can then act on that status."
});
(function () { const q = Q.find(x => /only from Windows devices that have BitLocker turned on/.test(x.q)); q.l = CMP; })();
PL(23, ML + 'intune/device-configuration/endpoint-security/account-protection#manage-local-groups-on-windows-devices');
PL(120, ML + 'intune/device-configuration/endpoint-security/account-protection#manage-local-groups-on-windows-devices');
PL(65, ML + 'intune/device-security/microsoft-defender/configure-integration');
PL(40, ML + 'intune/device-configuration/settings-catalog/');

/* interchangeable steps: device preparation policy and assigning apps/scripts can be done in either order */
(function(){
  const q = Q.find(x => x.type === 'order' && /Autopilot device preparation \(user-driven, Microsoft Entra join\)/.test(x.q));
  q.swap = [[4, 5]];
  q.e = "The Learn tutorial lists assigning apps and scripts (Step 5) before creating the policy (Step 6), but the two can be done in either order: the policy only needs the device group, and apps and scripts you pick in the policy install during deployment. Steps 1 to 6 are required; Step 7 (corporate identifiers or device association) is optional. Device preparation needs no hardware hash and no deployment profile, and it supports Entra join only. The device group must be an assigned security group with the Intune Provisioning Client service principal as owner.";
})();
/* more interchangeable steps, matching what the explanations already say */
(function(){
  function SW(re, groups){ const q = Q.find(x => x.type === 'order' && re.test(x.q)); if (!q) throw new Error('no seq ' + re); q.swap = groups; }
  SW(/Autopilot user-driven Microsoft Entra hybrid join/, [[3, 4]]);
  SW(/Entra hybrid joined and then enroll/, [[1, 2, 3]]);
  SW(/enroll a corporate Windows PC automatically when the user joins/, [[0, 1]]);
  SW(/cloud-only user-driven Windows Autopilot/, [[2, 3]]);
  SW(/connect Microsoft Defender for Endpoint to/, [[2, 3]]);
})();

/* link repair from a full Learn check (v41): old URL -> working URL */
(function(){
  const R = {
    'intune/app-management/deployment/enterprise-app-catalog-apps': 'intune/app-management/deployment/add-enterprise-catalog-app',
    'intune/app-management/protection/app-wrapping-tool': 'intune/developer/app-sdk/integration-methods',
    'intune/app-management/protection/apps-selective-wipe': 'intune/app-management/protection/wipe-corporate-data',
    'intune/device-configuration/oemconfig': 'intune/device-configuration/templates/configure-oemconfig-android',
    'intune/device-configuration/supervised-mode': 'intune/device-enrollment/apple/enable-supervised-mode',
    'intune/device-enrollment/apple/apple-mdm-push-certificate-get': 'intune/device-enrollment/apple/create-mdm-push-certificate',
    'intune/device-enrollment/apple/automated-device-enrollment-ios': 'intune/device-enrollment/apple/setup-automated-ios',
    'intune/device-enrollment/monitor/troubleshoot-windows-enrollment-errors': 'intune/device-enrollment/monitor-reports',
    'intune/app-management/deployment/add-android-store': 'intune/app-management/deployment/add-store-android',
    'intune/app-management/deployment/add-line-of-business': 'intune/app-management/deployment/add-lob-windows',
    'intune/app-management/deployment/add-microsoft-store-app': 'intune/app-management/deployment/add-microsoft-store',
    'intune/app-management/deployment/add-office365': 'intune/app-management/deployment/add-microsoft-365-windows',
    'intune/app-management/deployment/apple-business-manager-apps': 'intune/app-management/deployment/manage-vpp-apple',
    'intune/app-management/deployment/assign': 'intune/app-management/deployment/assign-groups',
    'intune/device-management/inventory-and-status/device-sync-refresh': 'intune/device-configuration/troubleshoot-device-profiles#policy-refresh-intervals',
    'intune/device-management/monitoring/review-logs-using-azure-monitor': 'intune/governance/integrate-azure-monitor',
    'intune/device-management/monitoring/tenant-status': 'intune/governance/tenant-status',
    'intune/device-management/tools/troubleshoot-device': 'intune/fundamentals/it-pro-support/help-desk-operators',
    'intune/device-security/endpoint-security/antivirus-policy': 'intune/device-configuration/endpoint-security/antivirus',
    'intune/device-security/endpoint-security/attack-surface-reduction-policy': 'intune/device-configuration/endpoint-security/attack-surface-reduction',
    'intune/device-security/endpoint-security/firewall-policy': 'intune/device-configuration/endpoint-security/firewall',
    'intune/device-updates/android/android-fota-deployments': 'intune/device-updates/android/manage-fota',
    'intune/device-updates/apple/software-updates-ios-ipados': 'intune/device-updates/apple/',
    'intune/device-updates/apple/software-updates-macos': 'intune/device-updates/apple/',
    'intune/device-updates/windows/delivery-optimization': 'intune/device-configuration/templates/configure-delivery-optimization-windows',
    'intune/fundamentals/role-based-access-control/role-based-access-control': 'intune/fundamentals/role-based-access-control/overview'
  };
  let n = 0;
  Q.forEach(q => { if (!q.l) return; const k = q.l.replace(ML, ''); if (R[k]) { q.l = ML + R[k]; n++; } });
  if (n < 30) throw new Error('link repair applied to only ' + n);
})();

/* the Vulnerability Remediation Agent question no longer offers retired agents as wrong answers */
(function(){
  const q = Q.find(x => x.id === 154);
  if (!q || q.c[0] !== 'Vulnerability Remediation Agent') throw new Error('id 154 changed');
  q.w = ["Conditional Access Optimization Agent", "Phishing Triage Agent", "Threat Intelligence Briefing Agent"];
  q.e = "The Vulnerability Remediation Agent ranks vulnerabilities from Defender and recommends fixes, and an admin approves the action. The other three are Security Copilot agents for other products, not Intune agents.";
})();

/* Domain tags re-aligned to the MD-102 skills outline (Oct 27, 2026). Topic rules first, then single questions. */
(function(){
  const byTopic = {
    'Apps > Monitor: what each report shows': 4,
    'Devices > Monitor: what each report shows': 5,
    'Compliance and Conditional Access': 1,
    'Device actions: what each one does': 2,
    'App protection: Microsoft Tunnel for MAM': 2
  };
  const appProtTopics = /^App protection: (choose the settings|cut, copy|conditional launch|order of conditional|Windows MAM)/;
  const byId = {
    1: {}, // placeholder so the map is easy to extend
    2: [157, 171, 172, 297, 302, 393, 394, 395, 396, 397, 398, 399, 168, 680],
    3: [299, 300, 400, 401, 402, 403, 404, 405],
    4: [163, 421, 422, 424, 425],
    5: [431],
    D1: [279, 286]
  };
  const to = {};
  byId[2].forEach(i => to[i] = 2);
  byId[3].forEach(i => to[i] = 3);
  byId[4].forEach(i => to[i] = 4);
  byId[5].forEach(i => to[i] = 5);
  byId.D1.forEach(i => to[i] = 1);
  [718, 719, 720, 721, 722, 723, 724, 725, 726, 727, 728, 729, 730, 731, 732].forEach(i => to[i] = 2);   // EPM
  [747, 748, 749, 750, 751, 752, 753].forEach(i => to[i] = 1);                                          // Windows Hello for Business
  [458, 459, 460].forEach(i => to[i] = 2);                                                              // Collect diagnostics is a remote action
  Q.forEach(q => {
    if (byTopic[q.t]) q.d = byTopic[q.t];
    else if (appProtTopics.test(q.t)) q.d = 4;
    if (to[q.id]) q.d = to[q.id];
  });
})();

/* retired features removed from the quiz (ids stay stable, the questions are spliced out like Lab questions) */
(function(){
  [94, 436, 437, 438].forEach(id => {
    const i = Q.findIndex(q => q.id === id);
    if (i < 0) throw new Error('retired question id not found ' + id);
    if (!/agent/i.test(Q[i].q)) throw new Error('unexpected question at id ' + id + ': ' + Q[i].q);
    Q.splice(i, 1);
  });
})();
