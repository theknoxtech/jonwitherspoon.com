/* ===== More app assignment questions, from the "Assign apps to groups" Learn page (Nov 14) ===== */
add(D4, G2, "You need to assign a store app to Android phones that are not enrolled in Intune. Which target can you use?",
  ["A user group"],
  ["A device group", "An all-devices assignment", "A device group with an assignment filter"],
  "Apps can be assigned to users whether or not the device is enrolled. Assigning to devices needs an enrolled device.", L.assignGroups);

add(D4, G2, "Users with unenrolled devices need to install an available app. Which statement is true about the Company Portal?",
  ["They can use the web-based Company Portal, but not the Company Portal app"],
  ["They can use the Company Portal app, but not the web-based Company Portal", "They can use either one, as long as the app is assigned as Required", "They cannot use either one, because the device is not enrolled"],
  "For unenrolled devices the table on Learn shows web-based Company Portal installs as Yes and Company Portal app installs as No. Updates are also manual.", L.assignGroups);

add(D4, G2, "A store app from managed Google Play is assigned as Available with or without enrollment. Where do users on unenrolled Android phones find the app?",
  ["In the Play Store app, under their work account"],
  ["In the Company Portal app, under Apps", "In Microsoft Intune admin center, under Apps", "In the Microsoft Edge browser, in a managed bookmark"],
  "Managed Google Play apps targeted this way appear in the Play Store app. Users can switch between the personal and work Google accounts there. The Company Portal app only shows a message that apps are available.", L.assignGroups);

add(D4, G2, "You plan to deploy managed Google Play apps to unenrolled Android phones. Which three actions should you take? Each correct answer presents part of the solution.",
  ["Connect your Intune tenant to managed Google Play", "Target the apps as Available with or without enrollment", "Assign an app protection policy to the user group"],
  ["Target the apps as Required to the user group", "Create an Android device administrator enrollment profile"],
  "Required and Uninstall aren't supported for nonenrolled devices. The apps come from managed Google Play and are protected by app protection policies (MAM).", L.assignGroups);

add(D4, G2, "You issue an app protection policy selective wipe for a user's unenrolled Android phone. What happens to apps the user installed from the Play Store with their work account?",
  ["The work account is removed, and the installed apps stay installed"],
  ["The installed apps are uninstalled from the phone by the wipe", "The apps stay, and the user keeps the work apps in the Play Store", "The whole phone is factory reset by the selective wipe"],
  "A selective wipe removes the work account from the Play Store app, so the user no longer sees work apps in the catalog. Apps that were already installed remain installed.", L.assignGroups);

add(D4, G2, "You assign an app as Required to the group Engineering Global. The groups Engineering APAC, EMEA and US are nested in it. Who receives the app?",
  ["Members of Engineering Global and of its nested child groups"],
  ["Only direct members of Engineering Global", "Only members of the three child groups", "No one, because nested groups are not supported for apps"],
  "Intune supports assigning apps to nested groups, so child group members are targeted too.", L.assignGroups);

add(D4, G2, "A user is in a group where an app is assigned as Required, and the same user's device is in a group where the app is assigned as Uninstall. What is the resulting intent?",
  ["Required"],
  ["Uninstall", "Available", "Required and Available"],
  "For User Required with Device Uninstall, both assignments exist and Intune resolves Required.", L.assignGroups);

add(D4, G2, "A user is in a group where an app is assigned as Available. The user's device is in a group where the app is assigned as Uninstall. Which statement is true?",
  ["It shows in Company Portal, and an installed copy is uninstalled"],
  ["The app is uninstalled and is hidden from Company Portal for good", "The app installs on the device and the Uninstall assignment is ignored", "Intune blocks the assignment because the two intents conflict"],
  "User Available with Device Uninstall resolves to Available. The app shows in Company Portal and an existing install is removed, but if the user installs it from Company Portal the install is honored.", L.assignGroups);

add(D4, G2, "Two device groups target the same app. One has the app as Required and the other as Available. What is the resulting intent?",
  ["Required and Available"],
  ["Required", "Available", "Uninstall"],
  "Device Required with Device Available resolves to Required and Available.", L.assignGroups);

add(D4, G2, "Why might an assignment filter not work as expected when a user belongs to groups with conflicting app intents?",
  ["Because the intent is evaluated before the filter"],
  ["Because filters apply only to Required assignments in Intune", "Because filters are evaluated before the groups are resolved", "Because filters cannot be used with Available assignments"],
  "Learn notes that with assignment conflicts the filter might not work as expected, because intent is evaluated first. Avoid creating conflicts.", L.assignGroups);

add(D4, G2, "You add a Line-of-business iOS app and assign it to a group. Which default does the Uninstall on device removal setting have?",
  ["Yes"],
  ["No", "Yes only when the device is supervised", "It has no default and must be set before you can save"],
  "The default for line-of-business apps is Yes. Store apps, VPP apps and built-in apps default to No.", L.assignGroups);

add(D4, G2, "An iOS store app that is not a VPP app is assigned as Required. What intents does Intune give the app?",
  ["Required and Available"],
  ["Required only", "Available only", "Required, and Uninstall when the device is unenrolled"],
  "For managed iOS store apps, when you assign Required, the app receives both Required and Available intents. It is enforced at check-in and also appears in Company Portal.", L.assignGroups);

add(D4, G2, "An app is assigned as Required to Android Enterprise fully managed and corporate-owned work profile devices. Which statement is true?",
  ["Users cannot uninstall the app manually"],
  ["Users can uninstall it from Company Portal", "Users can uninstall it only when the device is offline", "The app becomes Available after 30 days"],
  "Apps deployed as Required to these corporate-owned device types can't be uninstalled manually by the user.", L.assignGroups);

add(D4, G2, "You assign an app as Available for enrolled devices. When is the app shown to a user in Company Portal?",
  ["When the user is the primary user who enrolled the device and the app applies"],
  ["When the user is in the same Microsoft Entra group as the device itself", "When the signed-in user holds a Microsoft Intune Administrator role", "When the device has no compliance policy assigned to it at all"],
  "Learn states the app only shows as available if the user signed in to Company Portal is the primary user who enrolled the device and the app applies to that device.", L.assignGroups);

add(D4, G2, "An Android app is deployed as Available with or without enrollment. Which statement about reporting is true?",
  ["Reporting status is available only for enrolled devices"],
  ["Reporting status is available for all devices", "Reporting status is available only for Required assignments", "No reporting status exists for Android apps"],
  "For Android apps deployed this way, status is only reported on devices that are enrolled in Intune.", L.assignGroups);

add(D4, G2, "A managed Google Play preproduction track app is assigned as Required to Android Enterprise personally owned work profile devices. The app does not install. What should you do?",
  ["Use two identical user groups: Available for one, Required for the other"],
  ["Change the assignment to Uninstall first and then back to Required later", "Enroll the devices as fully managed instead of as personally owned", "Assign the app to a device group instead of to a user group"],
  "Learn gives this workaround for preproduction track apps on personally owned work profile devices.", L.assignGroups);

add(D4, G2, "You select a group for an app assignment, and the group was soft-deleted in Microsoft Entra ID. What happens?",
  ["It shows as soft deleted, and the assignment waits until the group is restored"],
  ["The assignment keeps applying for another 30 days until the group is purged", "Intune removes the assignment immediately and permanently from the app", "The assignment is applied to all users in the tenant instead"],
  "Soft-deleted groups are shown as such in the console and their assignments do not apply until restored.", L.assignGroups);
