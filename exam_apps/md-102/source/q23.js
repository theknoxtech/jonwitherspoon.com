/* ===== App protection settings in scenarios (Nov 15). Facts: Learn "Android App Protection Policy Settings" (ref-settings-android). Panels are mock-ups built from the Learn setting names, not screenshots. ===== */
const N23 = "App protection: choose the settings (Android)";
const AND = L.mamAndroid;
const dt = (o) => {
  o = Object.assign({ backup: 'Allow', send: 'All Apps', save: 'Allow', recv: 'All Apps', open: 'Allow', ccp: 'Policy managed with paste in', lim: '0', shot: 'Allow', kb: 'Not required', web: 'Any app', notif: 'Allow', print: 'Allow', sync: 'Allow', tel: 'Any dialer app', msg: 'Any messaging app', tunnel: 'No' }, o || {});
  const sendAll = o.send === 'All Apps', recvAll = o.recv === 'All Apps';
  return [['#', 'Data transfer'],
    ['Backup org data to Android backup services', o.backup],
    ['Send org data to other apps', o.send],
    ['Save copies of org data', sendAll ? 'Allow' : o.save, 1, sendAll],
    ['Transfer telecommunications data to', o.tel, 1],
    ['Transfer messaging data to', o.msg, 1],
    ['Receive data from other apps', o.recv],
    ['Open data into Org documents', recvAll ? 'Allow' : o.open, 1, recvAll],
    ['Restrict cut, copy, and paste between other apps', o.ccp],
    ['Cut and copy character limit for any app', o.lim, 1],
    ['Screen capture and Google Assistant', o.shot],
    ['Approved keyboards', o.kb],
    ['#', 'Functionality'],
    ['Sync policy managed app data with native apps or add-ins', o.sync],
    ['Printing org data', o.print],
    ['Restrict web content transfer with other apps', o.web],
    ['Org data notifications', o.notif],
    ['Start Microsoft Tunnel connection on app-launch', o.tunnel]];
};
const AC = (o) => {
  o = Object.assign({ pin: 'Require', type: 'Numeric', simple: 'Allow', len: '4', bio: 'Allow', tmo: '30', recheck: '30', cred: 'Not required' }, o || {});
  return [['#', 'Access requirements'], ['PIN for access', o.pin], ['PIN type', o.type], ['Simple PIN', o.simple], ['Select minimum PIN length', o.len],
    ['Biometrics instead of PIN for access', o.bio], ['Override biometric with PIN after timeout (minutes)', o.tmo, 1],
    ['Work or school account credentials for access', o.cred], ['Recheck the access requirements after (minutes of inactivity)', o.recheck]];
};
const CL = (rows) => [['#', 'Conditional launch'], ['Setting  |  Value  |  Action', '', 0]].slice(0, 1).concat(rows.map(r => [r[0], r[1] + '  →  ' + r[2]]));

addv(D3, N23, dt({}),
  "Users should be able to copy company text from managed apps and paste it into other managed apps, and paste text from any app into managed apps. Copying out to personal apps must be blocked. The policy is shown with default values. Which value of Restrict cut, copy, and paste between other apps meets this?",
  ["Policy managed with paste in"],
  ["Blocked, which stops cut, copy and paste between the app and every other app", "Policy managed apps, which allows paste only from other policy-managed apps", "Any app, which puts no restriction on cut, copy and paste to or from the app"],
  "Policy managed with paste in allows cut or copy only between policy-managed apps, and allows data from any app to be pasted in. Default is Any app.", AND);
addv(D3, N23, dt({}),
  "Notice that Save copies of org data and Open data into Org documents are greyed out and fixed at Allow. Why can't the admin change them?",
  ["Send org data and Receive data are both set to All Apps, which forces Allow"],
  ["Their values are locked until the policy is assigned to a user group in the tenant", "They only apply to iOS, so on an Android policy they cannot be changed", "The Company Portal must be updated before these two settings can be edited"],
  "Save copies is configurable only when Send org data to other apps is Policy managed apps. Open data into Org documents is configurable only when Receive data from other apps is Policy managed apps.", AND);
addv(D3, N23, dt({}),
  "Org data must go only to other policy-managed apps, and users may use Save As only to OneDrive and SharePoint. Which TWO changes meet this?",
  ["Set Send org data to other apps to Policy managed apps", "Set Save copies of org data to Block and select OneDrive and SharePoint"],
  ["Set Receive data from other apps to None, which stops all incoming data to the app", "Set Encrypt org data to Not required, so that saved copies can open in other apps", "Set Screen capture and Google Assistant to Block, which also limits Save As locations"],
  "Block on Save copies plus the selected services leaves only those locations. The setting works only after Send org data is Policy managed apps.", AND);
addv(D3, N23, dt({ send: 'Policy managed apps', save: 'Allow' }),
  "Contoso lets users save copies of org data only to OneDrive and SharePoint. The policy shows Save copies of org data at Allow. What do you change?",
  ["Set Save copies to Block, then select OneDrive and SharePoint as the services"],
  ["Leave Save copies at Allow, because the selected services list is used only when it is Allow, so no change is needed", "Set Send org data to other apps to None, which then lets you pick the services that users can save to", "Set Receive data from other apps to Policy managed apps, which controls where saved copies of data can go"],
  "When Save copies is Block, you can pick the services users may still save to. The list defaults to 0 selected.", AND);
addv(D3, N23, dt({}),
  "Contractors must be unable to take screenshots of company data or let Google Assistant read it. Which setting and value do you use, and what else happens?",
  ["Screen capture and Google Assistant set to Block, which also blurs the app-switcher preview"],
  ["Screen capture and Google Assistant set to Block, which also wipes the app when a screenshot is taken", "Printing org data set to Block, which also stops screen capture", "Approved keyboards set to Require, which also blurs the app-switcher preview"],
  "Block stops screen capture, Circle to Search and Google Assistant access to org data, and blurs the App-switcher preview.", AND);
addv(D3, N23, dt({}),
  "Notifications on the lock screen must keep appearing, but they must not show message content such as the sender or subject. Which Org data notifications value do you pick?",
  ["Block org data"],
  ["Block, which stops the app from sharing notifications at all", "Allow, which shares org data in the notification text", "Policy managed apps, which allows notifications only on managed devices"],
  "Block org data shows generic text such as You have new mail. Block shares no notifications. The setting needs app support (Outlook, Teams).", AND);
addv(D3, N23, dt({}),
  "Links tapped inside policy-managed apps must open only in a browser that is itself protected by the policy. Which value of Restrict web content transfer with other apps do you set?",
  ["Microsoft Edge"],
  ["Unmanaged browser, which opens the link in a browser that is outside policy", "Any app, which lets the link open in whichever browser the user picks", "Policy managed apps, which is the only value that accepts a managed browser"],
  "Microsoft Edge opens web content only in the policy-managed Edge. Unmanaged browser opens it in the browser named by the Unmanaged Browser ID.", AND);
addv(D3, N23, dt({ ccp: 'Policy managed apps' }),
  "Cut, copy and paste is restricted to policy-managed apps, but users must still be able to copy a six-digit sign-in code into any app. What do you change?",
  ["Set Cut and copy character limit for any app to 6 or more"],
  ["Set Restrict cut, copy, and paste to Any app, which keeps the code but drops the restriction", "Set Printing org data to Allow, so that the code can pass through the print service", "Set Transfer messaging data to None, so that codes travel to the messaging app"],
  "The character limit allows that many characters to any app, including unmanaged apps, even when cut, copy and paste would otherwise be blocked. Default is 0.", AND);
addv(D3, N23, dt({}),
  "Tapping a phone number in a managed app must open only the company dialer with package ID com.contoso.dialer. Which TWO configurations do you make?",
  ["Set Transfer telecommunications data to A specific dialer app", "Enter the Dialer App Package ID and Dialer App Name"],
  ["Set Transfer telecommunications data to Any dialer app, which lets any dialer open", "Set Transfer messaging data to A specific messaging app and enter its package ID", "Set Send org data to other apps to None, so that the dialer is the only app left"],
  "A specific dialer app requires both the package ID and the app name. Any policy-managed dialer app is the other restrictive option.", AND);
addv(D3, N23, dt({}),
  "Contoso does not want company data from managed apps saved to Android Backup Service. Which setting and value do you use?",
  ["Backup org data to Android backup services set to Block"],
  ["Save copies of org data set to Block, which also blocks the Android Backup Service", "Printing org data set to Block, which stops the data from leaving to backups", "Sync policy managed app data with native apps set to Block, which covers backups"],
  "Block stops the app from backing up work or school data to the Android Backup Service. The default is Allow.", AND);
addv(D3, N23, dt({}),
  "Managed apps must not copy contacts and calendar items into the phone's native Contacts and Calendar apps, and must not run add-ins. Which setting do you change?",
  ["Sync policy managed app data with native apps or add-ins set to Block"],
  ["Open data into Org documents set to Block, which also stops native contact sync", "Send org data to other apps set to None, which turns off the native contact sync", "Approved keyboards set to Require, which limits add-ins and native app sync"],
  "Block prevents saving to native apps (Contacts, Calendar, widgets) and use of add-ins, if the app supports it.", AND);
addv(D3, N23, dt({}),
  "A user who is not on an approved keyboard opens a managed app after the admin sets Approved keyboards to Require. What does the user see?",
  ["A prompt to download and install an approved keyboard before using the app"],
  ["The app opens, but typing is turned off until the user signs in again with MFA", "The app wipes the work account after the Max PIN attempts is reached", "The app opens in read-only mode with the keyboard hidden from the user"],
  "You must also select at least one approved keyboard to save the setting.", AND);
addv(D3, N23, [['#', 'Encryption'], ['Encrypt org data', 'Require'], ['Encrypt org data on enrolled devices', 'Not required', 1]],
  "The admin sets Encrypt org data on enrolled devices to Not required because the enrolled phones already use device encryption. What is the effect on org data in the managed apps on those enrolled phones?",
  ["Intune app layer encryption is not enforced for it on enrolled devices"],
  ["The managed apps stop working on enrolled devices until the setting is set back to Require", "The org data is wiped at the next check-in because encryption is no longer enforced", "The setting applies to unenrolled devices as well, so no app data is encrypted anywhere"],
  "Not required means Intune does not enforce app layer encryption on enrolled devices. The Encrypt org data setting still governs the rest.", AND);

addv(D3, N23, AC({}),
  "PINs such as 1234, 1111 and abcd must be rejected. The policy is shown with default values. Which setting do you change?",
  ["Set Simple PIN to Block"],
  ["Set PIN type to Passcode, which rejects every PIN that has only numbers in it", "Set Select minimum PIN length to 8, which rejects every PIN of the form 1234", "Set Biometrics instead of PIN for access to Allow, which blocks simple sequences"],
  "Simple PIN Block rejects simple sequences, checked in three-character sliding windows. Default is Allow.", AND);
addv(D3, N23, AC({ simple: 'Block' }),
  "With Simple PIN set to Block, which of these PINs does Intune still accept?",
  ["1122"],
  ["1235, because three characters in a row form a sliding window that is a sequence", "1112, because three characters in a row repeat one digit in the window", "4567, because the four digits climb by one from left to right in sequence"],
  "Sequences are checked in three-character windows. 1235 and 1112 are rejected, but 1122 has no three-character run.", AND);
addv(D3, N23, AC({ type: 'Passcode', simple: 'Block' }),
  "PIN type is Passcode and Simple PIN is Block. What must a user's PIN contain?",
  ["At least one number, one letter and one special character"],
  ["At least one letter or one special character, because the type is Passcode", "Only numbers, because the Passcode type allows numeric sequences", "At least eight characters, because Block raises the minimum length automatically"],
  "With Passcode and Simple PIN Allow, one letter or special character is enough. With Simple PIN Block, number plus letter plus special character are needed.", AND);
addv(D3, N23, AC({ recheck: '30', tmo: '10' }),
  "The admin sets Override biometric with PIN after timeout to 10 minutes while the recheck access requirements timeout is 30 minutes. What is wrong?",
  ["The biometric timeout should be greater than the recheck timeout"],
  ["The recheck timeout must be shorter than 10 minutes for biometrics to work at all", "Biometrics need Work or school account credentials set to Require first", "The biometric timeout cannot be changed when Biometrics instead of PIN is Allow"],
  "Learn says the override timeout value should be greater than the value under Recheck the access requirements. The defaults are 30 for both.", AND);
addv(D3, N23, AC({}),
  "Employees on Android phones must see the sign-in prompt for their work account each time access is rechecked, in addition to the PIN. Which setting do you change?",
  ["Set Work or school account credentials for access to Require"],
  ["Set PIN for access to Not required, since the sign-in replaces it", "Set Override biometric with PIN after timeout to Not required", "Set Biometrics instead of PIN for access to Block"],
  "Require means the user signs in with the work or school account instead of only entering a PIN. If PIN or biometrics are on, both are shown.", AND);

addv(D3, N23, CL([['Max PIN attempts', '5', 'Reset PIN'], ['Offline grace period', '1440 minutes', 'Block access'], ['Offline grace period', '90 days', 'Wipe data'], ['Jailbroken/rooted devices', '', 'Block access'], ['Min OS version', '12.0', 'Warn']]),
  "The conditional launch settings are shown with defaults. A user fails the PIN 5 times. What happens next?",
  ["The user must reset the PIN after signing in and any MFA"],
  ["The company account and data are wiped from the app at once", "The app is blocked until an admin resets the PIN in the admin center", "The device is factory reset to protect the data stored in the apps"],
  "The default action for Max PIN attempts is Reset PIN. Wipe data is the other action choice.", AND);
addv(D3, N23, CL([['Max PIN attempts', '5', 'Reset PIN'], ['Offline grace period', '1440 minutes', 'Block access'], ['Offline grace period', '90 days', 'Wipe data'], ['Jailbroken/rooted devices', '', 'Block access'], ['Min OS version', '12.0', 'Warn']]),
  "Contoso wants the work account wiped from an app after 30 days of the device being offline. What do you change?",
  ["Change the Offline grace period (days) value from 90 to 30, with Wipe data"],
  ["Change the Offline grace period (minutes) value from 1440 to 30 with Block access", "Change Max PIN attempts from 5 to 30 with the Wipe data action", "Change Min OS version to 30.0 with the Wipe data action"],
  "The Offline grace period has a Block access value in minutes (default 1440) and a Wipe data value in days (default 90). Each can appear separately.", AND);
addv(D3, N23, CL([['Max PIN attempts', '5', 'Reset PIN'], ['Offline grace period', '1440 minutes', 'Block access'], ['Offline grace period', '90 days', 'Wipe data'], ['Jailbroken/rooted devices', '', 'Block access'], ['Min OS version', '12.0', 'Warn']]),
  "A user on Android 11 is shown a notice, dismisses it and keeps using the app. Contoso wants these users blocked from company data instead. What do you change?",
  ["Change the action for Min OS version from Warn to Block access"],
  ["Change the action for Min OS version from Warn to Reset PIN", "Change the action for Jailbroken/rooted devices from Block access to Warn", "Change Max PIN attempts from 5 to 11 with the Block access action"],
  "Warn shows a notification that can be dismissed. Block access stops the user from accessing company data in that app.", AND);
addv(D3, N23, CL([['Jailbroken/rooted devices', '', 'Block access'], ['Play integrity verdict', 'Basic integrity', 'Block access']]),
  "A tester enrolls an Android emulator and signs in to Outlook. The policy has Play integrity verdict set to Basic integrity with Block access. What happens?",
  ["The user is blocked, because emulators and virtual devices fail basic integrity"],
  ["The user can sign in, because emulators pass basic integrity and fail only device integrity", "The user can sign in, because Play integrity applies only to physical Samsung devices", "The company account is wiped, because Basic integrity always uses the Wipe data action"],
  "Rooted devices, emulators, virtual devices and devices showing signs of tampering fail basic integrity. Only unmodified certified devices pass Basic integrity and device integrity.", AND);
addv(D3, N23, CL([['Play integrity verdict', 'Basic integrity', 'Warn']]),
  "Only unmodified devices certified by Google may use the apps. Which Play integrity verdict value do you choose?",
  ["Basic integrity and device integrity"],
  ["Basic integrity, which also requires that the device is certified by Google", "Check strong integrity, which is the only value that tests Google certification", "Require threat scan on apps, which tests the device's Google certification"],
  "Basic integrity is the general integrity check. Basic integrity and device integrity tests the device's compatibility with Google's services (certified devices only).", AND);
addv(D3, N23, CL([['Device manufacturers', 'samsung;google', 'Allow specified (Block non-specified)']]),
  "How do you enter the manufacturers in the Device manufacturers setting, and what does Allow specified (Block non-specified) do?",
  ["A semicolon-separated list; other manufacturers are blocked"],
  ["A comma-separated list; devices from other manufacturers are warned", "A semicolon-separated list; devices from other manufacturers are wiped", "A line-separated list; devices from other manufacturers are warned"],
  "The values are semicolon separated and not case sensitive. Allow specified (Wipe non-specified) wipes the account instead of blocking.", AND);
addv(D3, N23, CL([['Max allowed device threat level', 'Secured', 'Block access']]),
  "A Mobile Threat Defense connector is set up. Which Max allowed device threat level is the most restrictive?",
  ["Secured"],
  ["High, because it requires the most severe threats to be fixed before the app opens", "Medium, because it is the midpoint between the least and most restrictive value", "Low, because it requires an active Intune-to-MTD connection for all devices"],
  "Secured allows no threats at all. High is the least restrictive and essentially requires an active Intune-to-MTD connection.", AND);
addv(D3, N23, CL([['Require device lock', 'Medium Complexity', 'Block access']]),
  "Require device lock is set to High Complexity. What does an Android 11 phone get checked against?",
  ["Low Complexity, because the value targets Android 12 and later"],
  ["High Complexity, because the setting applies to every Android version from 9.0", "Medium Complexity, because older devices use the middle value of the three", "No complexity check, because the setting is ignored below Android 12 and later"],
  "For Android 11 and earlier, setting low, medium or high defaults to the expected behavior for Low Complexity.", AND);
addv(D3, N23, CL([['Min app version', '5.0', 'Warn']]),
  "A line-of-business app update must come from the Company Portal when users see the min app version dialog. What do you configure?",
  ["An app configuration policy with key com.microsoft.intune.myappstore and value CompanyPortal"],
  ["A device compliance policy that sends the key com.microsoft.intune.myappstore with the value CompanyPortal", "An app protection policy value named CompanyPortal under Min Company Portal version", "A Conditional Access policy that sends the user to the Company Portal for app updates"],
  "For any other store, the value must be the complete URL. The setting also supports where users get an updated LOB app.", AND);

/* ===== Cut, copy and paste scenarios (Nov 15). Same Learn page; the note about keyboards and OS sharing is quoted from it. ===== */
const N23b = "App protection: cut, copy and paste scenarios";
const CCP = (v, lim) => [['#', 'Data transfer'], ['Restrict cut, copy, and paste between other apps', v], ['Cut and copy character limit for any app', lim || '0', 1]];
const CCPT = "Outlook, Teams and Word have the app protection policy applied. Notes and Chrome are personal apps with no policy. ";
addv(D3, N23b, CCP('Blocked'),
  CCPT + "A user copies text in Outlook and tries to paste it into Word. What happens?",
  ["Blocked, because it stops paste with every other app"],
  ["The paste works, because both Outlook and Word are policy-managed apps", "The paste works, because Blocked applies only to apps that have no policy", "The paste works, because Blocked stops only the copy action in personal apps"],
  "Blocked: no cut, copy or paste between the app and any other app, managed or not.", AND);
addv(D3, N23b, CCP('Policy managed apps'),
  CCPT + "Which TWO actions work?",
  ["Copy in Outlook and paste into Teams", "Copy in Word and paste into Outlook"],
  ["Copy in Outlook and paste into Notes, because paste is allowed between any two apps", "Copy in Chrome and paste into Outlook, because paste in is allowed from any app", "Copy in Teams and paste into Chrome, because Teams is a Microsoft app"],
  "Policy managed apps allows cut, copy and paste only between policy-managed apps, in both directions.", AND);
addv(D3, N23b, CCP('Policy managed apps with paste in'),
  CCPT + "Which TWO actions work?",
  ["Copy in Outlook and paste into Teams", "Copy in Notes and paste into Outlook"],
  ["Copy in Outlook and paste into Notes, because copy is allowed to personal apps", "Copy in Teams and paste into Chrome, because both are app store apps", "None of these, because paste in requires the device to be enrolled"],
  "With paste in, cut and copy stay between managed apps, but data from any app can be pasted into a managed app.", AND);
addv(D3, N23b, CCP('Policy managed apps with paste in'),
  CCPT + "A user copies a paragraph in Outlook and pastes it into Notes. What happens?",
  ["Blocked, because copy out goes only to managed apps"],
  ["The paste works, because paste in also allows paste into any app", "The paste works, because the character limit is 0, which means no limit", "The paste works, but the Notes app wipes the data after the next sync"],
  "Paste in opens only the inbound direction. A character limit of 0 means no characters may leave to unmanaged apps.", AND);
addv(D3, N23b, CCP('Any app'),
  "A user copies a paragraph in Outlook and pastes it into a personal Notes app. The policy is shown with default values. What happens?",
  ["It works, because Any app is the default and has no restriction"],
  ["The paste is blocked, because every app protection policy restricts copy by default", "The paste works for the first 20 characters only, because of the default limit", "The paste is blocked, because the policy applies Policy managed apps by default"],
  "The defaults are Any app for the restriction and 0 for the character limit.", AND);
addv(D3, N23b, CCP('Blocked', '20'),
  CCPT + "A user copies a 15-character account number in Outlook and pastes it into Notes. Then copies a 40-character address and tries the same. What happens?",
  ["The 15 characters paste; the 40 characters are blocked"],
  ["Both paste, because the limit applies only to apps that have a policy", "Neither pastes, because Blocked overrides the character limit", "Both paste, but the 40-character text is cut down to 20 characters"],
  "The character limit allows that many characters to any app, including unmanaged apps, when the restriction would otherwise block it.", AND);
addv(D3, N23b, CCP('Policy managed apps', '10'),
  "The limit is 10 characters. A user copies a 6-digit code from Teams and pastes it into a personal banking app. What happens?",
  ["It works, because it is within the limit for any app"],
  ["It is blocked, because the banking app is not a policy-managed app", "It is blocked, because the limit applies only to the Blocked setting", "It works only if the banking app is also enrolled in Intune"],
  "The limit applies even with Policy managed apps. It permits that many characters to any app, including unmanaged ones.", AND);
addv(D3, N23b, CCP('Policy managed apps with paste in'),
  "Which requirement does Policy managed apps with paste in meet that Policy managed apps does not?",
  ["Users can paste from personal apps into managed apps"],
  ["Users can copy text from managed apps into personal apps, such as a meeting link", "Users can paste between two managed apps, which Policy managed apps blocks", "Users can copy only the first characters of any text into personal apps"],
  "Both values keep copy out inside managed apps. Only paste in accepts data from any app.", AND);
addv(D3, N23b, CCP('Blocked'),
  "Finance contractors must never move text between any two apps, even managed ones, in the protected apps. Which value do you use?",
  ["Blocked"],
  ["Policy managed apps, which still allows copy and paste between two managed apps", "Policy managed apps with paste in, which still allows paste in from any app", "Any app, which puts no restriction on cut, copy and paste to or from the app"],
  "Blocked is the most restrictive of the four values.", AND);
addv(D3, N23b, [['#', 'Data transfer'], ['Send org data to other apps', 'All Apps'], ['Restrict cut, copy, and paste between other apps', 'Blocked']],
  "Cut, copy and paste is Blocked, but a user still gets Outlook text onto the clipboard from the Share menu. Which setting explains this?",
  ["Send org data to other apps is All Apps, so OS sharing reaches the clipboard"],
  ["The Blocked value does not apply to text that is shorter than the character limit", "Save copies of org data is Allow, which lets text reach the clipboard in the Share menu", "Screen capture and Google Assistant is Allow, which lets text reach the clipboard"],
  "Learn notes that with Send org data to other apps set to All Apps, text data can still be transferred via OS sharing to the clipboard.", AND);
addv(D3, N23b, CCP('Policy managed apps with paste in'),
  "A user copies text in Outlook with a non-Microsoft keyboard and sees Your organization's data can't be pasted here in the keyboard's clipboard preview. Pasting inside managed apps still works. What explains the message?",
  ["The keyboard is not integrated with Intune and cannot decrypt the text"],
  ["The policy is Blocked, so the clipboard preview is cleared by Intune", "The device is not enrolled, so only the keyboard can read the clipboard", "The Approved keyboards setting is Require, so the keyboard is blocked"],
  "Users can still paste with the paste text action inside managed apps if the policy allows it.", AND);
addv(D3, N23b, CCP('Blocked'),
  "A third-party keyboard suggests text and inserts it straight into a managed app. Do the paste restrictions stop this?",
  ["No, the app receives it as standard user input"],
  ["Yes, because Blocked stops every kind of text insertion into a managed app", "Yes, because the keyboard has the same policy as the app that it types into", "No, but only when the user has enrolled the device in Intune"],
  "Some keyboards have their own clipboard or suggestions that insert text directly; Learn says paste restrictions do not apply to those insertions.", AND);
addv(D3, N23b, CCP('Any app'),
  "Contoso has personal iPhones and Androids that are not enrolled. Employees may paste anything into the managed apps but copy out only to managed apps. Which do you create?",
  ["An app protection policy with paste in, targeted to users"],
  ["A device compliance policy with a clipboard rule, assigned to the devices", "A device configuration profile that restricts the clipboard on the devices", "An app configuration policy for managed devices with the paste in key"],
  "App protection policies work without enrollment and control cut, copy and paste. Compliance and configuration profiles need enrolled devices.", AND);

/* ===== Microsoft Tunnel for MAM (Nov 15). Learn: microsoft-tunnel/mam-android and mam-ios. Needs Plan 2 or Suite. ===== */
const N23c = "App protection: Microsoft Tunnel for MAM";
const TMA = L.tunnelMamAndroid;
addv(D3, N23c, dt({}),
  "Unenrolled Android phones must connect to the Microsoft Tunnel VPN automatically whenever Edge opens. In the Edge app protection policy, which setting and value do you change?",
  ["Start Microsoft Tunnel connection on app-launch set to Yes"],
  ["Org data notifications set to Allow, so that Edge can start the tunnel in the background", "Restrict web content transfer with other apps set to Microsoft Edge, which starts the VPN", "Send org data to other apps set to Policy managed apps, which opens the tunnel for Edge"],
  "The setting is at the bottom of the Data protection tab and defaults to No.", TMA);
addv(D3, N23c, dt({ tunnel: 'Yes' }),
  "The app protection policy with Start Microsoft Tunnel connection on app-launch set to Yes is assigned, but nothing connects. Which TWO other policies does Tunnel for MAM on Android need for it to work?",
  ["An app configuration policy for Microsoft Defender", "An app configuration policy for Microsoft Edge"],
  ["A device compliance policy for the enrolled devices that run Edge", "A VPN device configuration profile for the unenrolled devices", "An enrollment restriction that allows personal Android devices"],
  "Tunnel for MAM on Android uses three profiles: Edge and Defender app configuration policies plus the Edge app protection policy.", TMA);
add(D3, N23c, "On an unenrolled Android phone, which app contains the tunnel client for Tunnel for MAM, and which Intune app must still be installed?",
  ["Microsoft Defender contains the tunnel client; the Company Portal must still be installed"],
  ["Microsoft Authenticator contains the tunnel client; the Company Portal must still be installed", "Microsoft Edge contains the tunnel client; the Company Portal is not needed on the phone", "Microsoft Defender contains the tunnel client; the Company Portal is not needed on the phone"],
  "Devices need Defender (version 1.0.4722.0101 or later), Edge and the Company Portal. Users do not need to sign in to the Company Portal or enroll.", TMA);
add(D3, N23c, "For the Microsoft Defender app configuration policy used by Tunnel for MAM on Android, which setting do you set to Yes?",
  ["Use Microsoft Tunnel VPN"],
  ["Start Microsoft Tunnel connection on app-launch", "Use per-app VPN for Microsoft Edge", "Allow Defender to manage the Tunnel gateway"],
  "That setting sits in the Microsoft Tunnel settings category with the connection name and site. The app-launch setting belongs to the app protection policy.", TMA);
add(D3, N23c, "Two Defender app configuration policies with different tunnel settings reach the same unenrolled Android phone. What happens?",
  ["The phone has tunnel connection issues"],
  ["The more restrictive policy wins and the tunnel works", "The newest policy wins and the older one is removed", "Both policies merge and the tunnel uses both gateways"],
  "Learn says to ensure only a single Defender app configuration policy targets the unenrolled device.", TMA);
add(D3, N23c, "An enrolled Android device runs Edge with the Tunnel for MAM configuration. Can other apps on that device use the MDM Tunnel configuration at the same time?",
  ["No, it must use only MDM or only MAM Tunnel configurations"],
  ["Yes, each app can pick its own, as long as the gateway site is the same for each", "Yes, but only when the Android device is also supervised by Intune", "No, because Tunnel for MAM works only on devices that are not enrolled"],
  "You can deploy MAM Tunnel configurations to enrolled devices instead of the MDM ones, but not both on one device.", TMA);
add(D3, N23c, "You want the tunnel to carry traffic for only some apps on the device. Which Android setting do you use?",
  ["The Per-App VPN (Android only) settings"],
  ["Start Microsoft Tunnel connection on app-launch set to No", "Restrict web content transfer with other apps set to Microsoft Edge", "A separate Tunnel Gateway site for each app"],
  "Once the tunnel starts, the device can reach the on-premises routes. Per-app VPN limits which apps use them.", TMA);
add(D3, N23c, "What licensing does Microsoft Tunnel for MAM need?",
  ["Intune Plan 2 or an additional subscription such as the Intune Suite"],
  ["Intune Plan 1, which already includes Tunnel for MAM for unenrolled devices", "A Microsoft Defender for Endpoint Plan 2 license for every unenrolled device", "Any Microsoft 365 license, because the tunnel client is in the Company Portal"],
  "Learn: this feature requires Microsoft Intune Plan 2 or an additional subscription.", TMA);
add(D3, N23c, "On iOS/iPadOS, why does Tunnel for MAM need an app protection policy?",
  ["It adds data protection and delivers the Tunnel app configuration"],
  ["It installs the tunnel client app from the App Store for the user on the iPhone", "It enrolls the iPhone in Intune so that the Tunnel profile can apply to it", "It sets the VPN server address for every single app on the iPhone"],
  "On iOS the tunnel is built into the app, with an app configuration policy plus trusted certificates for on-premises resources.", L.tunnelMamIos);

/* ===== Conditional launch, the rest of the Android list (Nov 15). Same Learn page: ref-settings-android, Conditional launch section. ===== */
const N23d = "App protection: conditional launch settings";
addv(D3, N23d, CL([['Disabled account', '', 'Block access']]),
  "An employee is terminated and the Entra account is disabled. The Disabled account conditional launch setting has no value to enter. Which TWO actions can you pick?",
  ["Block access", "Wipe data"],
  ["Reset PIN, which forces a new PIN before the account can be used again", "Warn, which shows a notification that the user can dismiss", "Block access on supported devices, which only applies to Samsung devices"],
  "Disabled account has no value to set. The actions are Block access and Wipe data.", AND);
addv(D3, N23d, CL([['Non-working time', '', 'Block access']]),
  "A tenant has not integrated the Working Time API. The admin adds Non-working time with Block access to the policy. What is the risk?",
  ["Accounts could be blocked because working time status is missing for them"],
  ["The setting is ignored, because it has no effect without the Working Time API", "The policy fails to save until the Working Time API is connected to the tenant", "Only Samsung devices are blocked, because Knox supplies the working time"],
  "Learn says to configure this only if the tenant is integrated with the Working Time API. Actions are Block access and Warn.", AND);
addv(D3, N23d, CL([['Max OS version', '16.0', 'Block access']]),
  "What does Max OS version do?",
  ["Triggers the action when the device OS is above the specified version"],
  ["Triggers the action when the device OS is below the specified version", "Limits which apps can be updated to the newest Android version", "Wipes the device when an update above the version is installed"],
  "Min OS version triggers below the value, Max OS version above it. Both take major or major.minor, such as 16.0, with Warn, Block access or Wipe data.", AND);
addv(D3, N23d, CL([['Min patch version', '2026-09-01', 'Block access']]),
  "In which format do you enter the Min patch version?",
  ["A date such as 2026-09-01"],
  ["A major.minor version such as 16.0", "A security build number such as 2026.09.01.4", "A month and year such as Sept 2026"],
  "Min patch version requires a minimum Android security patch released by Google and uses YYYY-MM-DD. OS versions use major or major.minor.", AND);
addv(D3, N23d, CL([['Require threat scan on apps', '', 'Block access']]),
  "What does Require threat scan on apps check?",
  ["That Google's Verify Apps scan is turned on for the device"],
  ["That a Mobile Threat Defense app is installed on the device", "That the Company Portal scanned every installed app in the last day", "That Microsoft Defender has found no threats in the work apps"],
  "Users are blocked until they turn on Google's app scanning. The actions are Warn and Block access.", AND);
addv(D3, N23d, CL([['Min Company Portal version', '5.0.6000.0', 'Warn']]),
  "Why does Learn suggest Warn for Min Company Portal version?",
  ["A forced update could use mobile data at a bad time"],
  ["Block access would also wipe the user's personal data from the phone and the work profile", "Warn is the only action that the Company Portal itself can enforce on the phone", "Wipe data requires the phone to be enrolled in Intune as a managed device first"],
  "Updates send only delta bytes, but can still be large. Actions are Block access, Wipe data and Warn. Format is Major.Minor, Major.Minor.Build or with Revision.", AND);
addv(D3, N23d, CL([['Max Company Portal version age (days)', '90', 'Warn']]),
  "What is the valid range for Max Company Portal version age (days), and who decides how old the version is?",
  ["0 to 365 days; Google Play reports the age"],
  ["1 to 90 days, and Intune reports the age of the build to the policy", "0 to 365 days, and the Company Portal reports its own build age", "30 to 180 days, and the Entra tenant reports the age of the build"],
  "The age of the Company Portal build is determined by Google Play on the device. Actions are Block access, Wipe data or Warn.", AND);
addv(D3, N23d, CL([['Samsung Knox device attestation', '', 'Block access']]),
  "Samsung Knox device attestation is set to Block access for every device. What happens on a Google Pixel?",
  ["The user is blocked; non-Samsung users cannot accept the Knox terms"],
  ["The check is skipped, because only Samsung devices are evaluated by this setting", "The user is warned only, because Pixel devices cannot be blocked by this check", "The user passes, because Google devices satisfy the check on their own hardware"],
  "Use Managed apps assignment filters to target supported Samsung devices, or Block access on supported devices, which affects only Samsung on Android 15 with One UI 7.0 or above.", AND);
addv(D3, N23d, CL([['Max allowed device threat level', 'Low', 'Block access'], ['Primary MTD service', 'Microsoft Defender for Endpoint', '(no action)']]),
  "Two Mobile Threat Defense connectors are configured. What does Primary MTD service do, and what must also be set?",
  ["It picks which MTD gives the threat level; the Max threat level must be set"],
  ["It picks which MTD gets the Wipe data action; Min app version must be set first", "It picks which MTD scans the apps; Require threat scan on apps must be set first", "It picks which MTD enrolls the device; Disabled account must be set first"],
  "Primary MTD service has no actions. Values are Microsoft Defender for Endpoint or Mobile Threat Defense (Non-Microsoft).", AND);
addv(D3, N23d, CL([['Play integrity verdict', 'Basic integrity and device integrity', 'Block access'], ['Play integrity verdict evaluation type', 'Check strong integrity', '']]),
  "Check strong integrity is set. A user has an older device that does not support strong integrity. What happens?",
  ["It is blocked or wiped, per the action chosen"],
  ["The device passes, because strong integrity applies only to new devices", "The device is warned only, because the evaluation type has no action", "The device is enrolled in Intune to complete the integrity check"],
  "Strong integrity gives hardware-backed attestation on devices that shipped with Android 8.1 or later. Test devices before turning it on widely.", AND);
addv(D3, N23d, CL([['Jailbroken/rooted devices', '', 'Block access']]),
  "A user's phone is rooted and the action is Block access. What can the user still do?",
  ["Use the app for personal tasks, but not for company data"],
  ["Use the app for company data once an admin approves the device", "Nothing, because Block access removes the app from the phone", "Use the app for company data after resetting the PIN"],
  "Block access stops the app running with the work account. Wipe data removes the account instead. Action choices: Block access or Wipe data.", AND);
addv(D3, N23d, CL([['Min OS version', '12.0', 'Wipe data']]),
  "The action Wipe data in conditional launch triggers on a user's phone. What gets removed?",
  ["The work account and data in the app only"],
  ["Everything on the phone, as with a full device wipe in Intune", "Only the PIN, so that the user must create a new PIN", "The app itself, and the user cannot reinstall it"],
  "Wipe data removes the user account associated with the application from the device. It is a selective wipe.", ML + 'intune/app-management/protection/wipe-corporate-data');
addv(D3, N23d, CL([['Min app version', '5.0', 'Block access']]),
  "You need minimum versions for Outlook and Teams. How does Learn suggest setting up Min app version?",
  ["One policy per app, each with its own minimum version"],
  ["Create one policy and set a single minimum version that covers every app", "Use one policy and set Outlook and Teams with the same major.minor value", "Use a device compliance policy, since app versions are not part of app protection"],
  "Min app version supports major.minor, major.minor.build and major.minor.build.revision. Actions are Warn, Block access and Wipe data.", AND);

/* ===== iOS/iPadOS app protection settings (Nov 15). Facts: Learn "iOS App Protection Policy Settings" (ref-settings-ios). ===== */
const N23e = "App protection: choose the settings (iOS/iPadOS)";
const IOS = ML + 'intune/app-management/protection/ref-settings-ios';
const dti = (o) => {
  o = Object.assign({ backup: 'Allow', send: 'All Apps', save: 'Allow', recv: 'All Apps', open: 'Allow', ccp: 'Any app', lim: '0', kb: 'Allow', web: 'Not configured', notif: 'Allow', shot: 'Allow', tel: 'Any dialer app' }, o || {});
  const sendAll = o.send === 'All Apps', sendNone = o.send === 'None', recvAll = o.recv === 'All Apps';
  return [['#', 'Data transfer'],
    ['Backup org data to iTunes and iCloud backups', o.backup],
    ['Send org data to other apps', o.send],
    ['Save copies of org data', sendAll ? 'Allow' : sendNone ? 'Block' : o.save, 1, sendAll || sendNone],
    ['Transfer telecommunication data to', o.tel, 1],
    ['Receive data from other apps', o.recv],
    ['Open data into Org documents', recvAll ? 'Allow' : o.open, 1, recvAll],
    ['Restrict cut, copy, and paste between other apps', o.ccp],
    ['Cut and copy character limit for any app', o.lim, 1],
    ['Third party keyboards', o.kb],
    ['#', 'Functionality'],
    ['Restrict web content transfer with other apps', o.web],
    ['Org data notifications', o.notif],
    ['Screen capture', o.shot]];
};
addv(D3, N23e, dti({}),
  "An iPhone policy has Send org data to other apps set to All Apps (the default). Users should be able to send org data only to other policy-managed apps. On the iPhone, which values of Send org data to other apps are available besides All Apps and None?",
  ["Policy managed apps, Policy managed apps with OS sharing, Policy managed apps with Open-In/Share filtering"],
  ["Policy managed apps, Policy managed apps with paste in, and Policy managed apps with Edge only, for every app", "Policy managed apps and Any managed app, which is the only other value on iOS devices", "Policy managed apps with Company Portal, and Policy managed apps with enrolled devices only"],
  "iOS has three Policy managed apps values. Android has only Policy managed apps.", IOS);
addv(D3, N23e, dti({ send: 'Policy managed apps with OS sharing' }),
  "A user on an unenrolled iPhone is targeted by Policy managed apps with OS sharing. Which behavior does the user get?",
  ["The behavior of Policy managed apps"],
  ["The behavior of All Apps, because OS sharing is not available without enrollment", "The behavior of None, because OS sharing blocks any transfer without enrollment", "The behavior of Policy managed apps with Open-In/Share filtering"],
  "OS sharing applies to MDM-enrolled devices only, where it also allows file transfers to other MDM-managed apps. On unenrolled devices it falls back to Policy managed apps.", IOS);
addv(D3, N23e, dti({ send: 'Policy managed apps with Open-In/Share filtering' }),
  "What does Policy managed apps with Open-In/Share filtering add to Policy managed apps, and what does it require?",
  ["It lists only managed apps in Open-in and Share; needs SDK 8.1.1 or later"],
  ["It encrypts every shared file on the device, and needs the device to be supervised", "It blocks Open-in entirely, and needs the Company Portal on the iPhone", "It lets any app receive the data, and needs the receiving apps to be enrolled"],
  "Both the source app and the apps that can open the file need the SDK for the filtering to work.", IOS);
addv(D3, N23e, dti({ send: 'Policy managed apps' }),
  "With Send org data to other apps set to Policy managed apps, a user tries to open a document into an unmanaged app. What does Intune do with the data that gets through Open-in on an unenrolled device?",
  ["Encrypts it, so the unmanaged app cannot read it"],
  ["Sends it as plain text, because the Open-in dialog bypasses the policy", "Deletes it from the app after the transfer completes", "Converts it to a PDF that the unmanaged app can open"],
  "Learn: users might be able to transfer via Open-in or Share extensions, but Intune encrypts the transferred data so unmanaged apps cannot read it.", IOS);
addv(D3, N23e, dti({ send: 'Policy managed apps' }),
  "Spotlight search of data inside managed apps and Siri shortcuts stop working after the admin changes Send org data to other apps. Which value is the likely cause?",
  ["Any value other than All Apps"],
  ["Policy managed apps with OS sharing only, since it is limited to MDM-enrolled devices", "None only, since only None blocks transfer to every app", "Third party keyboards set to Block, which also blocks Spotlight and Siri"],
  "Learn says Spotlight search and Siri shortcuts are blocked unless set to All Apps.", IOS);
addv(D3, N23e, dti({ recv: 'All Apps' }),
  "Which value of Receive data from other apps is available on iOS but not on Android, and what does it do?",
  ["All apps with incoming Org data, which marks data without an identity as org data"],
  ["Policy managed apps with paste in, which accepts only pasted text from other apps", "Policy managed apps with OS sharing, which accepts files from MDM apps", "All apps with enrolled devices, which accepts data only from enrolled iPhones"],
  "Incoming data is marked with the MDM-enrolled user's identity from IntuneMAMUPN. It applies to MDM-enrolled devices only; unenrolled devices get the behavior of All Apps.", IOS);
addv(D3, N23e, dti({ tel: 'A specific dialer app' }),
  "On iOS, you set Transfer telecommunication data to A specific dialer app. Which value do you enter, compared with Android?",
  ["The URL scheme; Android asks for package ID and name"],
  ["The Dialer App Bundle ID; Android asks for the URL scheme", "The Dialer App Name only; Android asks for the package ID", "The Dialer App Package ID; Android asks for the bundle ID"],
  "iOS needs the URL scheme used to launch the dialer (an SDK 12.7.0 or later feature). Older policies had tel;telprompt in the data transfer exemptions.", IOS);
addv(D3, N23e, dti({}),
  "Managed apps on iPhones must not use third-party keyboards. Which setting do you use, and what does the user see?",
  ["Third party keyboards set to Block; a one-time message says they are blocked"],
  ["Approved keyboards set to Require; the user is prompted to download an approved keyboard", "Third party keyboards set to Block; the app closes until the keyboard is removed", "Approved keyboards set to Block; a message appears every time the keyboard is used"],
  "Only the standard iOS keyboard is available in managed apps. The setting affects both the work and personal accounts of multi-identity apps, but not unmanaged apps. Android uses Approved keyboards.", IOS);
addv(D3, N23e, dti({}),
  "Which of these does Screen capture set to Block cover on iOS?",
  ["Screenshots, recording, screen sharing, AirPlay and Siri onscreen awareness"],
  ["Screenshots only, because screen recording is controlled by a separate setting", "Screenshots and printing, because Block also turns off Printing org data", "Screenshots and Google Assistant, which are the two items in the setting name"],
  "On iOS, Screen capture also covers QuickTime recording from a connected Mac. On Android the setting is Screen capture and Google Assistant.", IOS);
addv(D3, N23e, dti({}),
  "Which iOS app protection settings block Apple Intelligence features such as Genmoji and Writing Tools for work or school data?",
  ["Genmoji and Writing Tools, each set to Block"],
  ["Screen capture set to Block, which covers both features", "Sync policy managed app data with native apps set to Block, which covers both", "Org data notifications set to Block org data, which covers both features"],
  "Each setting defaults to Allow and requires a recent SDK. Screen capture Block also covers Siri onscreen awareness.", IOS);
addv(D3, N23e, dti({ web: 'Unmanaged browser' }),
  "You choose Unmanaged browser for Restrict web content transfer with other apps. How do you enter the browser in Unmanaged Browser Protocol?",
  ["Only the protocol prefix, such as mybrowser"],
  ["The full app bundle ID of the browser, such as com.contoso.mybrowser", "The full URL of the browser's home page, such as https://mybrowser.contoso.com", "The App Store link of the browser, so Intune can install it"],
  "http links become mybrowser:// and https links become mybrowsers://. Contact the browser vendor for the protocol.", IOS);
addv(D3, N23e, dti({ web: 'Microsoft Edge' }),
  "The policy requires Edge for web content, but Edge is not installed on the iPhone. What happens?",
  ["The user sees a prompt to install Microsoft Edge"],
  ["The link opens in Safari instead, because Edge is not installed", "The link is blocked, and the user cannot open it in any app", "The link opens in any other managed browser, since iOS allows several"],
  "On iOS no other managed browser apps are allowed, unlike Android, where managed browsers that support the http/https intent are allowed.", IOS);
addv(D3, N23e, [['#', 'Access requirements'], ['PIN for access', 'Require'], ['Touch ID instead of PIN for access', 'Allow'], ['Face ID instead of PIN for access', 'Allow'], ['Override Touch ID with PIN after timeout (minutes)', '30', 1], ['Recheck the access requirements after (minutes of inactivity)', '30']],
  "On iOS, which apps share the same PIN, so that the user does not have to enter it again during the recheck timeout?",
  ["Intune-managed apps from the same publisher"],
  ["Every Intune-managed app on the device, whatever the publisher", "Only the app where the PIN was set, since each app has its own PIN", "Only apps in the same app protection policy, whatever the publisher"],
  "On iOS the PIN is shared among managed apps of the same publisher. On Android it is shared with all Intune-managed apps.", IOS);
addv(D3, N23e, [['#', 'Access requirements'], ['App PIN when device PIN is set', 'Disable'], ['Work or school account credentials for access', 'Not required']],
  "App PIN when device PIN is set is Disable. What must be true for it to work?",
  ["The iPhone is enrolled and IntuneMAMUPN is configured"],
  ["The iPhone is supervised, and the Company Portal is not installed", "The iPhone is unenrolled, and the user signs in with MFA", "The iPhone has Face ID, and Touch ID is set to Block"],
  "The app needs Intune SDK 7.0.1 or later and the IntuneMAMUPN setting so it can detect the enrollment state.", IOS);
addv(D3, N23e, CL([['Min SDK version', '19.0.0', 'Warn']]),
  "Which iOS conditional launch setting checks the version of the Intune SDK in the app, and what does the Warn action do?",
  ["Min SDK version; the user is told to upgrade the app, and can dismiss the notice"],
  ["Min app version; the user is told to upgrade the SDK, and can dismiss the notice", "Min OS version; the user is blocked until the app is upgraded", "Min SDK version; the app is wiped until the user upgrades it"],
  "Learn suggests one Min SDK version policy per app, because apps have different SDK versions.", IOS);
addv(D3, N23e, CL([['Device model(s)', 'iPhone14,2;iPhone15,2', 'Allow specified (Block non-specified)']]),
  "On iOS, which setting replaces Android's Device manufacturers, and how are the values entered?",
  ["Device model(s), as a semicolon-separated list of model identifiers"],
  ["Device manufacturers, as a semicolon-separated list of manufacturers", "Device model(s), as a comma-separated list of marketing names", "Min SDK version, as a semicolon-separated list of versions"],
  "Values are not case sensitive. Allow specified (Wipe non-specified) wipes the account instead of blocking.", IOS);
addv(D3, N23e, CL([['Play integrity verdict', 'Basic integrity', 'Block access'], ['Samsung Knox device attestation', '', 'Block access']]),
  "Which of these conditional launch settings exist on Android but NOT on iOS?",
  ["Play integrity verdict and Samsung Knox device attestation"],
  ["Max OS version and Min OS version, because iOS does not limit OS versions", "Max PIN attempts and Offline grace period, because iOS has no sign-in checks", "Disabled account and Non-working time, because those only apply to Android"],
  "iOS conditional launch has Max and Min OS, PIN attempts, Offline grace, jailbroken, Disabled account, Min app and SDK version, Device model, threat level, Primary MTD and Non-working time.", IOS);
addv(D3, N23e, dti({}),
  "Contoso uses Apple's managed open-in on enrolled iPhones. A colleague thinks the app protection data protection settings control it. Are they right?",
  ["No, none of these settings control Apple managed open-in"],
  ["Yes, Send org data to other apps controls managed open-in on every iPhone", "Yes, but only when Receive data from other apps is set to None", "No, because managed open-in is turned off for any iPhone that uses app protection"],
  "To manage the Apple open-in feature, use the MDM approach in the data transfer between iOS/iPadOS apps article.", ML + 'intune/app-management/protection/manage-data-transfer-ios');

/* ===== Windows app protection / Windows MAM (Nov 15). Facts: Learn "App protection policy settings for Windows" and "Data protection for Windows MAM". ===== */
const N23f = "App protection: Windows MAM";
const WIN = ML + 'intune/app-management/protection/ref-settings-windows';
const WMAM = ML + 'intune/app-management/protection/enable-mam-windows';
const dtw = (o) => { o = Object.assign({ recv: 'All sources', send: 'All destinations', ccp: 'Any destination and any source', print: 'Allow' }, o || {});
  return [['#', 'Data transfer'], ['Receive data from', o.recv], ['Send org data to', o.send], ['Allow cut, copy, and paste for', o.ccp], ['#', 'Functionality'], ['Printing org data', o.print]]; };
add(D3, N23f, "A personally owned Windows 11 PC is not joined to Entra ID and not enrolled in any MDM. Contoso wants employees to reach company data only in Microsoft Edge with app protection. Which approach is this?",
  ["Windows MAM, with app protection and Conditional Access"],
  ["Windows MDM, with a compliance policy and the Company Portal on the PC", "Entra join, with Autopilot user-driven mode on the PC", "Windows Information Protection, with a device enrollment profile"],
  "Windows MAM gives protected access to org data through Edge on personal, unmanaged devices.", WMAM);
add(D3, N23f, "A user's PC is MAM-enrolled with Edge. Later the PC is enrolled in Intune MDM. What happens to the app protection policy settings?",
  ["They are no longer applied"],
  ["They apply together with the MDM compliance policy settings", "They apply, and the MDM settings are ignored", "They apply only when the user signs in with a personal account"],
  "Windows MAM supports unmanaged devices only. If a device is already managed, MAM enrollment is blocked; if it becomes managed after MAM enrollment, the settings stop applying.", WIN);
add(D3, N23f, "Which TWO conditions stop a Windows PC from using Windows MAM?",
  ["It is Entra joined", "It is Workplace Joined to over two other users"],
  ["The PC runs Windows 11 and the Stable channel of Edge", "The PC has never signed in to the Microsoft 365 apps", "The PC is not domain joined to an on-premises Active Directory"],
  "The device must not be Entra joined or MDM enrolled to any tenant, and the limit is three Workplace Joined users in total.", WIN);
addv(D3, N23f, dtw({}),
  "Which two categories of settings does a Windows app protection policy have, compared with three on mobile?",
  ["Data protection and Health Checks"],
  ["Data protection and Access requirements, but no Health Checks", "Access requirements and Conditional launch, but no Data protection", "Data transfer and Encryption, but no Functionality"],
  "Windows has no Access requirements such as a PIN. The Health Checks category is the Windows name for conditional launch.", WIN);
addv(D3, N23f, dtw({}),
  "The Windows panel is shown with default values. Which value of Allow cut, copy, and paste for lets users paste from any source but copy only to org documents?",
  ["Org data destinations and any source"],
  ["Any destination and any source", "No destination or source", "Org data destinations and org data sources"],
  "The default is Any destination and any source. Org data destinations and org data sources keeps both directions inside the org context.", WIN);
addv(D3, N23f, dtw({ ccp: 'No destination or source' }),
  "In Edge, Allow cut, copy, and paste for is set to No destination or source. What is blocked?",
  ["Cut, copy and paste in web content only"],
  ["Cut, copy and paste everywhere in Edge, including the address bar", "Only paste into web content, because copy is still allowed", "Only cut and copy, because paste always works in the address bar"],
  "For Edge, this value blocks cut, copy and paste in web content only. Application controls, including the address bar, are not affected.", WIN);
addv(D3, N23f, dtw({ send: 'No destinations' }),
  "In Edge, Send org data to is set to No destinations. What changes for users?",
  ["File download, and sharing files between tabs"],
  ["File upload is blocked, but downloads still work", "Printing is blocked, but downloads still work", "Only copy to the clipboard is blocked, but downloads still work"],
  "For Edge, No destinations blocks file download. Receive data from set to No sources controls file upload and blocks local file viewing.", WIN);
addv(D3, N23f, dtw({ recv: 'No sources' }),
  "In Edge, Receive data from is set to No sources. What is controlled?",
  ["File upload, and local file viewing is blocked"],
  ["Printing of web pages, and the Print dialog is hidden", "File download, and downloads are saved only to OneDrive", "Pasting text, and copying text is still allowed"],
  "For Edge, No sources controls upload and blocks local file viewing, and sharing files between sites or tabs.", WIN);
addv(D3, N23f, dtw({}),
  "Which Windows app protection setting stops users printing org data?",
  ["Printing org data set to Block"],
  ["Send org data to set to No destinations, which hides the Print dialog", "Allow cut, copy, and paste for set to No destination or source", "Receive data from set to No sources, which turns printing off"],
  "Personal or unmanaged data is not affected by Printing org data. The default is Allow.", WIN);
addv(D3, N23f, CL([['Offline grace period', '720 minutes', 'Block access'], ['Offline grace period', '90 days', 'Wipe data']]),
  "What are the default offline grace period values for Windows app protection, and how do they differ from Android and iOS?",
  ["Block at 720 minutes and Wipe at 90 days; mobile blocks at 1,440"],
  ["Block at 1,440 minutes and Wipe at 90 days; the same as Android and iOS", "Block at 720 minutes and Wipe at 30 days; Android and iOS wipe at 90", "Block at 60 minutes and Wipe at 7 days; Android and iOS block at 720"],
  "Windows blocks after 12 hours offline by default. The wipe default is 90 days on all platforms.", WIN);
addv(D3, N23f, CL([['Min OS version', '10.0.22631.3155', 'Block access']]),
  "In which format do you enter Min OS version for Windows, and why does winver show the wrong one?",
  ["10.0.22631.3155; winver shows only the build"],
  ["22631.3155, from winver; the Command Prompt shows only the edition name", "23H2, from Settings > About; winver shows only the build number", "Windows 11, from System Information; winver shows only the number of days"],
  "Learn says to open a Command Prompt for the full version. Winver shows only the OS build, which is not the correct format.", WIN);
addv(D3, N23f, CL([['Disabled account', '', 'Wipe data']]),
  "A user's Entra account is disabled, but the Windows PC is offline and Intune cannot confirm the status. What happens?",
  ["Neither action is enforced until it is confirmed"],
  ["The account is wiped at once, because the disabled status is assumed", "The account is blocked at once, but not wiped until online", "Only the Warn action runs, because the PC is offline"],
  "Learn: if user status cannot be confirmed due to connectivity, authentication or other reasons, these actions are not enforced. Only one action can be specified.", WIN);
add(D3, N23f, "Which conditional launch settings are on the Windows list?",
  ["Offline grace, Min app and SDK version, Disabled account, Min and Max OS, threat level"],
  ["Max PIN attempts, Jailbroken/rooted devices, Play integrity verdict and Device model(s) list", "Min patch version, Samsung Knox attestation, Require device lock and Min Company Portal version list", "Offline grace period, Max PIN attempts, Primary MTD service and Non-working time list"],
  "Windows has no PIN, so there is no Max PIN attempts. It has no jailbreak or Play integrity checks either.", WIN);
add(D3, N23f, "A Windows app protection policy uses Max allowed device threat level, which needs a Mobile Threat Defense (MTD) signal. Which MTD connector supplies it, and which Windows version does it require?",
  ["Windows Security Center connector; Windows 11 23H2 or later"],
  ["Microsoft Entra ID Protection risk detections; any Windows 11 version that is enrolled in Intune", "Company Portal compliance report connector; Windows 10 PCs that have Microsoft Edge installed", "Windows Autopilot deployment profile connector; any Entra joined PC that was registered by a reseller"],
  "For Windows MAM, the MTD connector is the one for the Windows Security Center (WSC). Intune receives the device health state from it. It is supported only on Windows 11 version 22631 (23H2) or later.", WMAM);
add(D3, N23f, "Which Conditional Access setup limits Windows users to Edge with app protection when they reach Microsoft 365?",
  ["A policy requiring app protection for Windows; Edge allowed, other browsers blocked"],
  ["A policy that requires a compliant device, because MAM devices are always compliant in Entra", "A policy that requires a hybrid joined device for every browser on the PC", "A policy that blocks every browser, including Edge, for all Windows devices"],
  "Learn says to start with Report-only, then move to On. The policy targets the Office 365 app group and the Windows platform.", ML + 'entra/identity/conditional-access/policy-all-users-windows-app-protection');

/* ===== Order of evaluation and conflicts (Nov 15). Learn: mam-faq (Android and iOS access settings order), configure-conditional-launch. ===== */
const N23g = "App protection: order of conditional launch checks";
const FAQ = ML + 'intune/app-management/protection/mam-faq';
const CLL = ML + 'intune/app-management/protection/configure-conditional-launch';
addv(D3, N23g, CL([['Min OS version', '11.0', 'Block access'], ['Min OS version', '12.0', 'Warn']]),
  "On Android 10, a user opens a managed app. Min OS version has 11.0 with Block access and 12.0 with Warn. What does the user get?",
  ["Blocked; a block beats the warning"],
  ["Warned first, and then blocked once the user dismisses the warning", "Only the warning, because the higher version number wins", "Neither, because the two rows conflict and Intune ignores both"],
  "Learn: in general a block takes precedence, then a dismissible warning. Both rows apply, and the more restrictive result is what the user sees.", FAQ);
addv(D3, N23g, CL([['Min OS version', '12.0', 'Wipe data'], ['Min OS version', '14.0', 'Block access'], ['Min OS version', '16.0', 'Warn']]),
  "On iOS, a user's device fails all three Min OS version rows: Wipe data, Block access and Warn. Which action is applied?",
  ["Wipe data; wipe beats block, then warning"],
  ["Block access, because a block always comes before a wipe", "Warn, because it is the first one the user sees", "All three in order, with the wipe running last"],
  "The iOS FAQ says a wipe takes precedence, followed by a block, and then a dismissible warning.", FAQ);
add(D3, N23g, "An Android user fails Min patch version (Block access) and Min app version (Block access) at once. Which requirement is evaluated first?",
  ["Min app version"],
  ["Min patch version", "Min OS version", "Max PIN attempts"],
  "For different types of settings on Android: app version first, then OS version, then patch version. Then warnings for all types, in the same order.", FAQ);
add(D3, N23g, "On iOS/iPadOS, in what order do different types of conditional launch settings take precedence?",
  ["SDK version, app version, OS version; then the warnings"],
  ["OS version, app version, SDK version; then the warnings, in the same order", "App version, OS version, device model; then the warnings, in that order", "Warnings first, then blocks, then wipes, whatever the setting type"],
  "Microsoft recommends configuring the SDK version requirement only on guidance from the Intune product team, for essential blocking scenarios.", FAQ);
addv(D3, N23g, CL([['Min patch version', '2026-03-01', 'Block access'], ['Min patch version', '2026-02-01', 'Warn']]),
  "Both rows are set for the same Min patch version setting, and a device is on patch 2026-01-01. Why do the two rows not give the user two separate experiences?",
  ["The more restrictive result applies, so the user is blocked rather than warned"],
  ["The newest row applies, so the user is warned only", "Rows for the same setting must use the same action, so only the first row saves", "The warning shows first, and the block applies at the next launch"],
  "Some settings allow several rows with different actions and values. Block takes precedence over Warn.", CLL);
add(D3, N23g, "Policy A and Policy B target the same app and user. Policy A sets Device manufacturers to Google;Samsung and Policy B sets Google. What does the app receive?",
  ["Google, the intersection of the lists"],
  ["Google;Samsung, because Policy A was created first", "Google;Samsung, because the broadest list wins", "No list, because the two policies conflict"],
  "When app protection policies conflict, Intune typically takes the most restrictive approach. The same intersection rule applies to iOS device model lists.", CLL);
add(D3, N23g, "A device on Android is offline for a long time. Which two settings still protect company data?",
  ["Jailbroken/rooted devices, and the Offline grace period"],
  ["Play integrity verdict, and Require threat scan on apps", "Min patch version, and Play integrity verdict", "Samsung Knox attestation, and Play integrity verdict"],
  "Play Integrity checks need the user to be online. Jailbroken/rooted still gets enforced offline, and after the Offline grace period all access is blocked until the network returns.", FAQ);
add(D3, N23g, "Google Play's integrity check request fails on an Android phone. What does Intune use?",
  ["The cached result for up to 24 hours or a restart, then it blocks"],
  ["It passes the user until the next successful check, with no time limit at all", "It wipes the work account at once, because the check cannot be confirmed by Google", "It uses the Jailbroken/rooted result instead, with no time limit applied to it"],
  "If the Play integrity result is noncompliant, the configured action is taken immediately.", FAQ);
add(D3, N23g, "Play integrity verdict or Jailbroken/rooted devices: which does Learn suggest?",
  ["Turn on both, for a layered approach"],
  ["Only Play integrity verdict, since it replaces the other check", "Only Jailbroken/rooted devices, since Play integrity needs enrollment", "Neither, since the Offline grace period covers both checks"],
  "Both settings require Google Play Services versions to work. A user who does not meet that is blocked when targeted with Play integrity or threat scan settings.", FAQ);
