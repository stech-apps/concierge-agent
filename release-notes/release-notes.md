
<h1>Release notes Orchestra Concierge 4.0.0</h1>

----------

<h2>Introduction</h2>

This document describes the new features, bug corrections, known issues and recommendations for Orchestra Concierge 4.0.0. If you want to know about connector changes details or similar, this document is for you.

**Note:** Several of the remarks refer to a Jira number (Jira is Qmatic&#39;s internal registration system for bugs), or Pivotal Tracker (internal system for improvements and other issues).

<!--Add new update section after each release

<h2>Update UPDATE_VERSION_NUMBER</h2>

**Date:**
 
**Build number:**

<h3>Stories</h3>

| **Id** | **Release notes** |
| --- | --- |
| **xxx** | **Story header** Solution text |

<h3>Bug fixes</h3>

| **Id** | **Release notes** |
| --- | --- |
| **xxx** | **Bug header** Solution text |

<h3>Known issues</h3>
| **Id/Jira** | **Description** |
| --- | --- |
| **xxx** | **Bug header** Bug text |

<h3>Upgrade instructions</h3> 
-->

<h2>Original release</h2>
---
**Date:2018-12-21**
 
**Build number:1** 

<h3>Stories</h3>

| **Id** | **Release notes** |
| --- | --- |
| **xxxxxxxxx** | **New Concierge rewritten with latest Angular version** New Concierge consists of new layouts, desktop support and new utt files that overrides the old Concierge utt files |

---
<h3>Bug fixes</h3>

| **Id** | **Release notes** |
| --- | --- |
| **xxx** | **Bug header** Solution text |

---
<h3>Known issues</h3>
**Orchestra**

| **Id/Jira** | **Description** |
| --- | --- |
| **xxx** | **Bug header** Bug text |
---
<h3>Upgrade Instructions</h3>

<h2>Update 2</h2>

**Date:07/01/2019**
 
**Build number:2**

<h3>Stories</h3>

| **Id** | **Release notes** |
| --- | --- |
| **162475801** | **Make sure the Qmatic icon is used in Chrome browser** Icon changed in assets folder |
| **162701729** | **Appointment info selected appointment - Resizing** UI and SCSS changes |
| **162701580** | **Appointment info in Appointment list - resizing** UI and SCSS changes |
| **162701181** | **Appointment list - resizing** UI and SCSS changes |
| **162806695** | **Sort tables** UI and SCSS changes |
| **161313573** | **Hide Powered by Qmatic in tablet** UI and SCSS changes |
| **162572055** | **Queue View - Resizing** UI and SCSS changes |
| **162571899** | **Expanded Queue - Press Info button for Visit - Resizing** UI and SCSS changes |
| **162411633** | **Move utt settings to Operation Profile Level** utt file change |

<h3>Bug fixes</h3>

| **Id** | **Release notes** |
| --- | --- |
| **162631283** | **Remain in Flow if BOOK command fail** Fix the bug |
| **162605282** | **Robustness message hang after reconnect - Search Visit in Queue** Fix the bug |
| **162505025** | **Profile page > Use as default** |
| **162605599** | **IOS: Message A severe communication error... does not disappear after reconnect** |
| **161871807** | **Parameter Fetch Appointments on branch level not used** |
| **162505035** | **Fetch queue restcall should stop when user in a flow and start again when user reach main page.** |
| **161644691** | **Click in Month field shall move page up.** |
| **161049497** | **Edit Visit Flow > Wrong msg in already served/deleted visit.** Fix the bug |
| **161503301** | **Create appointment flow > Service banner > Tool tip for "?" icon is not implemented..**|

<h3>Known issues</h3>
| **Id/Jira** | **Description** |
| --- | --- |

<h3>Upgrade instructions</h3> 

----------

<h2>Update 3</h2>

**Date:2019-01-19**
 
**Build number:3**

<h3>Stories</h3>

| **Id** | **Release notes** |
| --- | --- |
| **162572091** | **Expand Queue** Resizing |
| **163023320** | **Start Page Resizing** Resizing |
| **162572385** | **collapse quickserve section in xs screens** Layout adjuestment |
| **160084603** | **new icon on HOME page for Concierge** New concierge icon added to the Orchestra home page |
| **161641618** | **WCAG Manual Test** Manually test WCAG and document changes |
| **163055833** | **Resizing date & time/reschedule** Responsive and other improvements in date and time reschedule screens |
| **163052379** | **Layout adjustment appointment list** Layout and responsive change adjustments in appointment list pages  |

<h3>Bug fixes</h3>

| **Id** | **Release notes** |
| --- | --- |
| **161503314** | **GO button in the device keyboard** Fixed the bug |
| **163020495** | **Add customer fish > Create customer section > Country code doesn't persist** Fixed the bug |
| **163046442** | **Quick Serve > no message when try to serve to a already filled queue.** Fixed the bug |
| **163014719** | **User Profile Page > settings shall reset if a new user login.** Fixed the bug |
| **163014720** | **User profile > when 'Use as default' is checked, No validation for service point at the second login** Fixed the bug |
| **161109030** | **Desktop Robustness : multiple messages when network fails.** |
| **163084328** | **You are already logged in message if user press HOME and then go back to Concierge** |
| **163116572** | **Edit appointment - Incorrect time appear in confirm msg when reschedule an appointment place for different branch than logged in.** |
| **162009082** | **Edit/Arrive appointments > Tab selection shall NOT be cleared after press "Refresh"** |
| **161503318** | **Create Appointment > Date & Time > calendar and timeslot sections are not fully visible** |
| **163014722** | **Hover over issue , timeslot list** |
| **161710197** | **Create Appointment > Date & time > 'Day' and 'Month' values are not translated** |
| **161176134** | **Edit appointment Flow > wrong time showing in the list if user go back and select passed appointment.** |
| **163014721** | **Edit appointment - Duplicate date appear in calendar when try to reschedule an appointment place in a branch which is in different time zone** |
| **163116573** | **Edit Appointment - Try to Reschedule after selecting a time which is in the past - No restcall to fetch the timeslots.** |
| **162631162** | **Time reserved but confirm done after reservation timed out and time is in the passed** |

<h3>Known issues</h3>
| **Id/Jira** | **Description** |
| --- | --- |
| **xxx** | **Bug header** Bug text |

<h3>Upgrade instructions</h3> 

----------

<h2>Update 4</h2>

**Date:2019-02-01**
 
**Build number:4**

<h3>Stories</h3>

| **Id** | **Release notes** |
| --- | --- |
| **163352866** | **WCAG : Implement WCAG for tab components in Concierge** WCAG |
| **163223586** | **Internal Description Text** |
| **163357850** | **replace property file** | updated property file
| **163356529** | **Add text for ? at branch page in Create Appointment flow** | layout change
| **163119994** | **Confirm page resizing** |g layout change

<h3>Bug fixes</h3>

| **Id** | **Release notes** |
| --- | --- |
| **161109031** | **Robustness : Arrive appointment flow > robustness msg should not appear when user search wrong id** Fixed the bug |
| **163116571** | **Profile settings page UX issue > RTL user in iOS device > cannot type in search fields** Fixed the bug |
| **163016595** | **reset search time value** Fixed the bug |
| **163283037** | **Remote upgrade of Orchestra (on HUB) see "old" Concierge until clear cache in Browser** Fixed the bug |
| **161911378** | **Arrive appointment - Search by Booking ID - wrong msg display when user search characters other than numbers** Fixed the bug |
| **162542515** | **RESCHEDULE button appearance if translated text is longer** Fixed the bug |
| **161012832** | **Robustness - No message if trying to do Quickserve and no connection** Fixed the bug |
| **163055861** | **Robustness > auto reconnect before pressing "Reconnect" button.** Fixed the bug |
| **161049499** | **Robustness: If Network Connection lost stop ping & Reconnect** Fixed the bug |
| **162600878** | **Concierge against distributed agent, full packet loss on central no robustness message** Fixed the bug |
| **160953264** | **Distributed environment > no branch is set, but user allows to go concierge home page.** Fixed the bug |
| **163283312** | **UX > Text length issues** Fixed the bug |
| **163289539** | **Scan QR Code in edit/arrive appointment flow gives "Visit not found" message** Fixed the bug |

<h3>Known issues</h3>
| **Id/Jira** | **Description** |
| --- | --- |
| **163223586** | **Internal Description Text** We cannot show internal description in the create appointment flow as we do not have that information available for create appointment flow services |

<h3>Upgrade instructions</h3> 

----------

<h2>Update 5</h2>

**Date:2019-02-08**
 
**Build number:5**

<h3>Stories</h3>

| **Id** | **Release notes** |
| --- | --- |
| **163517461** | **Change Browser tab text to "Concierge** Changed product name to 'Concierge' |
| **163649359** | **Buttons/tabs adjustments** UX changes related to buttons and tabs |
| **163649720** | **Searchbox adjustments** UI changes |



<h3>Bug fixes</h3>

| **Id** | **Release notes** |
| --- | --- |
| **163553264** | **VIP text is not displayed if text is longer (added SV_ infront to simulate translation)** Fixed the bug |
| **163553274** | **Change color of toast for "Central server connectivity failure..** Fixed the bug |
| **163380879** | **queues and connectivity message misplaced** Fixed the bug |
| **163318992** | **Edit/Arrive appointments > Multiple error msgs when scan a wrong QR code** Fixed the bug |
| **163014719** | **User Profile Page > settings shall reset if a new user login.** Fixed the bug |
| **163722726** | **Concierge home page > Visit search is not working.** Fixed the bug |
| **163619605** | **Edit appointment flow > Wrong appointment time when scan a QR code of an appointment place for different branch than logged in.** Fixed the bug |
| **163750353** | **Edit appointment > Find Appointment fish > Scan QR > default list is not loaded upon removal of selected appointment.** Fixed the bug |
| **163816798** | **Text in topbar appear outside the fish (if translated)** Fixed the bug |

---
<h3>Known issues</h3>
**Orchestra**

| **Id/Jira** | **Description** |
| --- | --- |

---

<h3>Upgrade instructions</h3> 

----------


<h3>Copyright notice</h3>

The information in this document is subject to change without prior notice and does not represent a commitment on the part of Q-MATIC AB. All efforts have been made to ensure the accuracy of this manual, but Q-MATIC AB cannot assume any responsibility for any errors and their consequences.<br>
This manual is copyrighted and all rights are reserved.<br>
Qmatic and Qmatic Orchestra are registered trademarks or trademarks of Q-MATIC AB.<br>
Reproduction of any part of this manual, in any form, is not allowed, unless written permission is given by Q‑MATIC AB.<br>
COPYRIGHT &copy; Q-MATIC AB, 2018.
