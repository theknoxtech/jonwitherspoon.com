/* ===== Practice-assessment gaps (Nov 15). Every fact below was checked on Learn: provisioning-packages/provision-pcs-for-initial-deployment, intune/device-management/actions/fresh-start, troubleshoot-app-protection-policy-deployment, quickstart-create-assign-policy, add-microsoft-365-windows, overview-office-customization-tool, deployment-guide-for-visio, app-management/configuration/overview and configure-managed-apps, ref-settings-android, vulnerability-remediation-agent (+ manage-), import-custom-admx-templates, microsoft-tunnel/monitor. ===== */
const N28a = "Removing preinstalled apps from new PCs";
const N28b = "App protection: assignment and conditional launch";
const N28c = "Microsoft 365 Apps with Visio";
const N28d = "App configuration policies: managed apps";
const N28e = "Vulnerability Remediation Agent: reading suggestions";
const N28f = "Custom ADMX templates in Intune";
const N28g = "Microsoft Tunnel server logs";
const K28 = {
  wcd: ML + 'windows/configuration/provisioning-packages/provision-pcs-for-initial-deployment',
  wcdWhat: ML + 'windows/configuration/provisioning-packages/provisioning-packages',
  fresh: ML + 'intune/device-management/actions/fresh-start',
  appTs: ML + 'troubleshoot/mem/intune/app-protection-policies/troubleshoot-app-protection-policy-deployment',
  appQs: ML + 'intune/app-management/protection/quickstart-create-assign-policy',
  appAnd: ML + 'intune/app-management/protection/ref-settings-android',
  appIos: ML + 'intune/app-management/protection/ref-settings-ios',
  m365: ML + 'intune/app-management/deployment/add-microsoft-365-windows',
  oct: ML + 'microsoft-365-apps/admin-center/overview-office-customization-tool',
  visio: ML + 'microsoft-365-apps/deploy/deployment-guide-for-visio',
  acpOv: ML + 'intune/app-management/configuration/overview',
  acpMa: ML + 'intune/app-management/configuration/configure-managed-apps',
  appMgmt: ML + 'intune/app-management/overview',
  vra: ML + 'intune/copilot/agents/vulnerability-remediation-agent',
  vraUse: ML + 'intune/copilot/agents/manage-vulnerability-remediation-agent',
  admx: ML + 'intune/device-configuration/settings-catalog/import-custom-admx-templates',
  tunMon: ML + 'intune/device-security/microsoft-tunnel/monitor'
};

/* 1. Removing preinstalled apps */
add(D2, N28a, "Five new unmanaged Windows 11 PCs ship with OEM trial apps. You want to remove the apps with the least effort by using a tool that applies to every PC from one package. Which tool should you use?",
  ["Windows Configuration Designer"],
  ["Sysprep, which generalizes an image so it can be captured and deployed to other PCs", "User State Migration Tool, which moves user files and settings between computers", "Windows System Image Manager, which builds unattend answer files for setup"],
  "The Windows Configuration Designer desktop wizard has a Remove preinstalled software option in the Set up device step. The package it builds is applied during setup. Sysprep, USMT and Windows SIM do not remove apps.", K28.wcd);
add(D2, N28a, "Which Windows Configuration Designer wizard step lets you remove preinstalled software from new desktop PCs?",
  ["Set up device"],
  ["Account management, where you pick how the PC joins a directory", "Add applications, where you list the apps to install on the PC", "Set up network, where you add the Wi-Fi profile for first connection"],
  "The Set up device step also covers the device name, the product key for an edition upgrade and shared use.", K28.wcd);
add(D2, N28a, "A Windows 11 PC is already managed by Intune and still has OEM apps from the factory. Which Intune device action removes those preinstalled apps?",
  ["Fresh Start"],
  ["Autopilot Reset, which returns a device to a ready-to-use state for the next user", "Wipe with Retain enrollment state and user data turned on", "Collect diagnostics, which gathers logs and sends them to Intune"],
  "Fresh Start removes apps from managed Windows devices, mainly the OEM apps that ship on a new PC. It needs a role with the Remote tasks Clean PC permission, such as Help Desk Operator.", K28.fresh);

/* 2. App protection: assignment and conditional launch */
add(D4, N28b, "An app protection policy is assigned to a group that holds 500 Android devices. Users report that none of the policy settings apply. What should you change?",
  ["Assign the policy to a group of users"],
  ["Turn on Target to apps on all device types so the policy reaches every device", "Change Target policy to from All Microsoft apps to All public apps", "Enroll the devices in Intune as Android device administrator devices"],
  "App protection policies must be assigned to user groups, not device groups. If a user is not targeted, the policy is not applied.", K28.appTs);
add(D4, N28b, "Which statement about assigning an app protection policy is correct?",
  ["You can only apply it to groups that contain users"],
  ["You can apply it to a device group when the devices are enrolled in Intune", "You can apply it to either user groups or device groups on Android", "You can apply it to a device group when the app uses the Intune App SDK"],
  "The quickstart states that app protection policies apply to groups that contain users, not groups that contain devices.", K28.appQs);
add(D4, N28b, "A user is in the targeted group, but a status report shows no app protection policy for the user. Before changing settings, which Intune report should you open first?",
  ["Apps, Monitor, App protection status"],
  ["Devices, Monitor, Assignment failures", "Reports, Device compliance, Noncompliant devices", "Endpoint security, Antivirus, Unhealthy endpoints"],
  "The investigation flow starts at Apps, Monitor, App protection status. A newly targeted user can take up to 24 hours to appear in reports.", K28.appTs);
add(D4, N28b, "You are building an app protection policy that must protect company data when a device is rooted or jailbroken. Which two actions can you choose for this conditional launch setting?",
  ["Block access", "Wipe data"],
  ["Warn", "Reset PIN", "Encrypt organizational data"],
  "For Jailbroken/rooted devices the actions are Block access and Wipe data. Reset PIN belongs to the Max PIN attempts setting, and Warn is offered for settings such as Min OS version.", K28.appAnd);

/* 3. Microsoft 365 Apps with Visio */
add(D4, N28c, "You deploy Microsoft 365 Apps to enrolled Windows 11 devices by using Intune. Visio must be part of the same deployment. Where do you add Visio in the app suite settings?",
  ["Select other Office apps (license required)"],
  ["Select Office apps, the list of standard Microsoft 365 apps", "Languages, where you add extra language packs to the suite", "Properties, where you add the owner and information URL for the app"],
  "The configuration designer lists licensed apps such as Visio Online Plan 2 and the Project Online desktop client under Select other Office apps (license required).", K28.m365);
add(D4, N28c, "Which tool is recommended for building the configuration XML that installs Microsoft 365 Apps together with Visio?",
  ["Office Customization Tool in the Microsoft 365 Apps admin center"],
  ["Windows Configuration Designer with the provisioning package wizard", "An Intune app configuration policy for Microsoft Visio", "An Intune device configuration profile that uses the Custom template"],
  "The Office Customization Tool (config.office.com) builds the file. You can then paste it into the Intune app by choosing Enter XML data.", K28.oct);
add(D4, N28c, "Which Intune app type is built to install the Microsoft 365 Apps suite and can also include Visio?",
  ["Microsoft 365 Apps, under Windows 10 and later"],
  ["Windows app (Win32), by using the Visio setup file only", "Line-of-business app, by using an MSI that contains Visio", "Web link, by using the Visio sign-in page"],
  "Intune has a dedicated Microsoft 365 Apps app type. Visio and Project are optional extras you must own licenses for.", K28.m365);
add(D4, N28c, "Visio Plan 2 must be installed for a group of users. Who receives the Visio license?",
  ["The users who run Visio"],
  ["Only the administrator who creates the Intune app", "The Windows devices that receive the app", "The Entra group that is assigned to the app"],
  "You assign Visio licenses to the users in the Microsoft 365 admin center. The admin who builds the deployment does not need one.", K28.visio);

/* 4. App configuration policies: managed apps */
add(D4, N28d, "An Android phone is not enrolled in Intune. You need to push settings to a protected app on it. Which type of app configuration policy applies?",
  ["Managed apps"],
  ["Managed devices, which depends on the OS management channel on enrolled devices", "Compliance policy, which reports whether the device meets rules", "Enrollment restriction, which limits the platforms that can enroll"],
  "Managed apps delivers configuration through the MAM channel. Enrollment state does not matter, but the app must use the Intune App SDK or be wrapped.", K28.acpOv);
add(D4, N28d, "For which apps can you use the Managed apps type of app configuration policy?",
  ["Apps built with the Intune App SDK or wrapped"],
  ["Any app that is deployed from Managed Google Play", "Any app that is pinned to the management profile on iOS", "Any app that is listed in the Windows Package Manager"],
  "Managed apps are the apps that support app protection policies. The Managed devices type is the one that depends on how the app is deployed to the enrolled device.", K28.acpOv);
add(D4, N28d, "Which two devices can receive a Managed apps app configuration policy?",
  ["An iPhone that is not enrolled in Intune", "An Android phone that is not enrolled in Intune"],
  ["A Mac that is enrolled in Intune", "A Linux workstation that is enrolled in Intune", "A Windows server that is joined to Active Directory"],
  "App configuration policies cover Android and iOS/iPadOS apps. macOS is listed as not supported in the app management capabilities table.", K28.appMgmt);
add(D4, N28d, "On Windows, which app is supported by a Managed apps app configuration policy?",
  ["Microsoft Edge for Windows"],
  ["Microsoft Outlook for Windows", "Any Win32 app that is deployed by Intune", "Microsoft Teams for Windows"],
  "Learn states that, at this time, the only supported app for Managed apps on Windows is Microsoft Edge for Windows.", K28.acpMa);

/* 5. Vulnerability Remediation Agent: reading suggestions */
add(D5, N28e, "The Vulnerability Remediation Agent shows two suggestions. One lists 5 CVEs on 30 exposed devices, the other 1 CVE on 900 exposed devices. Which two columns on the Suggestions tab help you rank them?",
  ["Impact", "Exposed devices"],
  ["Status", "Last applied", "Remediation type"],
  "Impact is the exposure score from Defender Vulnerability Management, and Exposed devices is the count of affected devices. Status and Last applied track your own remediation work.", K28.vraUse);
add(D5, N28e, "On the Vulnerability Remediation Agent Suggestions tab, an admin selects Mark as applied. What happens?",
  ["Status becomes Applied and the agent changes nothing on devices"],
  ["The agent deploys the suggested update policy to the exposed devices", "The agent runs a Windows Update ring with expedited quality updates", "The agent removes the CVEs from Defender Vulnerability Management"],
  "Mark as applied records that an admin attests to finishing the remediation steps. The agent does not change devices.", K28.vraUse);
add(D5, N28e, "Which service supplies the CVE data that the Vulnerability Remediation Agent analyzes?",
  ["Microsoft Defender Vulnerability Management"],
  ["Microsoft Purview Compliance Manager", "Microsoft Entra ID Protection risk detections", "Windows Update for Business reports"],
  "The agent collects CVEs from Defender Vulnerability Management and prioritizes them by factors such as CVSS scores, exposure impact and device count.", K28.vra);
add(D5, N28e, "For an operating system vulnerability, which remediation might the Vulnerability Remediation Agent recommend?",
  ["Deploy a quality update policy or an expedited update ring"],
  ["Replace the device with a new Autopilot deployment profile", "Create an app protection policy for the browser", "Add the device to an enrollment restriction group"],
  "For OS vulnerabilities it commonly recommends a quality update policy or expedited quality updates. For apps it suggests a newer app version or an Intune profile.", K28.vraUse);

/* 6. Custom ADMX templates */
add(D2, N28f, "Windows 11 devices are Entra joined and enrolled in Intune. A Microsoft Edge policy exists in on-premises Group Policy but not in the settings catalog. You need to manage it centrally with the least effort. What should you do?",
  ["Import the ADMX and ADML files into Intune and create a profile from them"],
  ["Deploy a PowerShell script that writes the registry value to each device", "Create a custom profile with a hand-built OMA-URI setting for the policy", "Export the setting from a domain controller and deploy it as a compliance policy"],
  "Use Devices, Configuration, Import ADMX to upload the template files, then create a profile that uses the imported settings.", K28.admx);
add(D2, N28f, "Which two files do you upload when you import a custom administrative template into Intune?",
  ["An ADMX file", "An ADML file for one language"],
  ["A Group Policy backup (GPO) file", "A JSON settings export from Group Policy analytics", "A provisioning package (PPKG) file"],
  "You can add only one language file per ADMX file. The ADMX holds the settings and the ADML holds the display text.", K28.admx);
add(D2, N28f, "An imported ADMX file fails with the error NamespaceMissing: Microsoft.Policies.Windows. What should you do?",
  ["Upload Windows.admx first, then retry"],
  ["Remove the ADML file and upload the ADMX alone", "Change the policy to a user scope in the profile", "Convert the combo box settings to text boxes"],
  "Some templates depend on Windows.admx as a prerequisite. It must be uploaded before the file that references it.", K28.admx);

/* 7. Microsoft Tunnel server logs */
add(D2, N28g, "On a Linux Tunnel Gateway server you must see session connect and disconnect details and watch the monitoring task as it writes. Access logging must stay off. Which two log views do you use?",
  ["mstunnel_monitor entries with the follow option", "ocserv entries that contain OCSERV_TELEMETRY"],
  ["ocserv-access entries with the follow option", "mstunnel-agent entries for the agent container", "mst-cli server restart output after each failure"],
  "journalctl -t mstunnel_monitor -f follows the monitoring task. OCSERV_TELEMETRY lines record connect and disconnect operations. The ocserv-access tag needs access logging, which is off by default.", K28.tunMon);
add(D2, N28g, "How do you turn on Tunnel access logging, including DNS connections?",
  ["Set TRACE_SESSIONS=2 in /etc/mstunnel/env.sh and restart the server with mst-cli"],
  ["Set TRACE_SESSIONS=1 in /etc/mstunnel/env.sh and restart the server with mst-cli", "Turn on Verbose logging in the Tunnel site settings in the admin center", "Edit the ocserv configuration file and reload the Podman network"],
  "TRACE_SESSIONS=1 enables access logs, and 2 adds DNS connection logging. Restart with mst-cli server restart. Access logs can reduce performance.", K28.tunMon);
add(D2, N28g, "Which journalctl tag shows the Microsoft Tunnel agent logs?",
  ["mstunnel-agent"],
  ["mstunnel_monitor, which shows the monitoring task logs", "ocserv, which shows the tunnel server logs", "ocserv-access, which shows access logs when enabled"],
  "Tags: mstunnel-agent is the agent, mstunnel_monitor is the monitoring task, ocserv is the server and ocserv-access is the access log.", K28.tunMon);
