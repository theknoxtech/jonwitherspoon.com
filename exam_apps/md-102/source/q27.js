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
