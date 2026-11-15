/* ===== App intent conflict drill: one question per row of the Learn conflict table (Nov 14) ===== */
const X_REQ = "The app is installed on the device automatically (Required)";
const X_UNI = "The app is removed from the device automatically (Uninstall)";
const X_AVL = "The app is only offered in Company Portal, not installed (Available)";
const X_RA  = "Installed, and also listed in Company Portal (Required and Available)";
const X_ALL = [X_REQ, X_UNI, X_AVL, X_RA];
function addx(stem, correct, e) { add(D4, G2, stem, [correct], X_ALL.filter(x => x !== correct), e, L.assignGroups + '#how-conflicts-between-app-intents-are-resolved'); }

addx("User1 is a member of Group1 and Group2. An app is assigned to Group1 as Required and to Group2 as Uninstall. Both groups contain users. What happens?", X_REQ,
  "User Required with User Uninstall resolves to Required. Required beats Uninstall.");
addx("User1 is a member of Group1 and Group2, both user groups. An app is assigned to Group1 as Available and to Group2 as Uninstall. What happens?", X_UNI,
  "User Available with User Uninstall resolves to Uninstall.");
addx("User1 is a member of Group1 and Group2, both user groups. An app is assigned to Group1 as Required and to Group2 as Available. What happens?", X_RA,
  "Required with Available gives Required and Available: the app installs and also shows in Company Portal.");
addx("An app is assigned as Required to a user group that contains User1, and as Required to a device group that contains User1's laptop. What happens?", X_REQ,
  "User Required with Device Required: both exist, and Intune treats it as Required.");
addx("An app is assigned as Uninstall to a user group that contains User1, and as Required to a device group that contains User1's laptop. What happens?", X_REQ,
  "User Uninstall with Device Required resolves to Required.");
addx("An app is assigned as Uninstall to a user group that contains User1, and as Uninstall to a device group that contains User1's laptop. What happens?", X_UNI,
  "User Uninstall with Device Uninstall resolves to Uninstall.");
addx("An app is assigned as Required to a device group and as Uninstall to another device group. The laptop is in both groups. What happens?", X_REQ,
  "Device Required with Device Uninstall resolves to Required.");
addx("An app is assigned as Available to a device group and as Uninstall to another device group. The laptop is in both groups. What happens?", X_UNI,
  "Device Available with Device Uninstall resolves to Uninstall.");
addx("User1's group has an app assigned as Available. User1's laptop is in a device group where the same app is assigned as Required. What happens?", X_RA,
  "User Available with Device Required resolves to Required and Available.");
addx("A user group has an app assigned as Required and Available. The same user is in another group where the app is assigned as Uninstall. What happens?", X_RA,
  "User Required and Available with User Uninstall resolves to Required and Available.");

add(D4, G2, "Which two combinations of group assignments result in the app being Required? Each correct answer presents a complete solution.",
  ["User Required and User Uninstall", "Device Required and Device Uninstall"],
  ["User Available and User Uninstall", "Device Available and Device Uninstall", "User Available and Device Uninstall"],
  "Required beats Uninstall in user-to-user, device-to-device and mixed conflicts. Available with Uninstall gives Uninstall, except for User Available with Device Uninstall, which gives Available.", L.assignGroups + '#how-conflicts-between-app-intents-are-resolved');

add(D4, G2, "An app is assigned as Available to a user group that contains User1, and as Uninstall to a device group that contains User1's laptop. The app is already installed. User1 later installs it again from Company Portal. What is the final state?",
  ["The app stays installed, because the Company Portal install is honored"],
  ["The app is uninstalled again by the device group at the next check-in", "The app stays installed and is then switched over to Required by Intune", "The app is blocked from installing, because Intune detects the conflict"],
  "User Available with Device Uninstall resolves to Available: the app shows in Company Portal and an earlier install is removed, but if the user installs it from Company Portal, the uninstall intent is not honored.", L.assignGroups + '#how-conflicts-between-app-intents-are-resolved');

add(D4, G2, "Which assignment intent always wins over Uninstall when a user or device is in groups with both?",
  ["Required"],
  ["Available", "Available with or without enrollment", "Required and Available is the only intent that wins"],
  "Every row in the conflict table that pairs Required with Uninstall resolves to Required. Available beats Uninstall only for User Available with Device Uninstall.", L.assignGroups + '#how-conflicts-between-app-intents-are-resolved');
