/* ---- Balance the new Domain 1 / 4 questions ---- */
(function () {
  const M = (pat, w) => { const q = Q.find(x => x.q.startsWith(pat)); if (!q) throw new Error(pat); q.w = w; };
  M("A domain-joined PC shows as Pending", ["The device has no compliance policy assigned to it yet", "The user lacks an Intune license for enrollment", "The MDM user scope is currently set to None for the tenant"]);
  M("You must stop users from enrolling personally owned iOS", ["A device limit restriction that is set to 0 devices", "A compliance policy that checks the ownership field", "An app protection policy for the iOS platform"]);
  M("The Apple MDM push certificate expires", ["Create a new certificate with a different Apple ID instead", "Delete the old certificate and start the process over", "Renew the ADE token in place of the certificate"]);
  M("The Apple ADE token is about to expire", ["Renew the Apple MDM push certificate in the Apple portal", "Re-create every enrollment profile in the Intune console", "Wipe the enrolled devices and enroll them again"]);
  M("What is required before you can enroll any Android Enterprise", ["A Samsung Knox account linked to the tenant", "An Apple MDM push certificate in the Intune console", "A Google Workspace subscription for the organization"]);
  M("Which cut, copy and paste setting", ["Receive data from other apps: All apps, with no limits", "Send org data to other apps: All apps, with no limits", "Third-party keyboards: Allow for all managed apps"]);
  M("An employee leaves. Their personal", ["Run the Wipe device action on the unenrolled iPhone", "Run an Autopilot Reset against the iPhone", "Delete the user's Entra account and wait for sync"]);
  M("A custom line-of-business iOS app has no Intune SDK", ["Create an app configuration policy for the app", "Enroll the device with User Enrollment instead", "Use a Conditional Access policy by itself"]);
  M("You add an .msi line-of-business app", ["You must write a registry detection rule yourself", "You must upload an .intunewin file for the app", "Detection is not possible for MSI apps at all"]);
  M("A user is in a group where an app is Required", ["The app installs, because Required always wins", "The app is shown only as Available in the portal", "Intune reports a conflict and installs it twice"]);
  M("You want a Required app to reach only corporate-owned", ["A scope tag for corporate-owned devices", "An enrollment restriction on the platform", "A compliance policy on the ownership value"]);
  M("You deploy apps from the Microsoft Store (new", ["You must wrap each app with the Win32 Content Prep Tool", "Only apps that you sideload are supported in Intune", "Store apps cannot be assigned with the Required intent"]);
  M("You deploy Microsoft 365 Apps to PCs that still have older", ["Create a supersedence rule for the old Office app", "Assign the old Office app with the Uninstall intent", "Run a Windows Autopilot Reset on each PC"]);
})();
