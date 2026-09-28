---
layout: ../layouts/Legal.astro
title: "Privacy Policy"
description: "How The Center Book handles center, family, student and Google Calendar information."
path: "/privacy"
---

# The Center Book: Privacy Policy

**Effective date:** September 28, 2026
**Operated by:** The Center Book LLC ("The Center Book", "we", "us")
**Contact:** steve@thecenterbook.com

---

## 1. Who this policy covers

The Center Book is software that learning centers (for example, Kumon franchise centers) use to run their center: attendance, scheduling, family communication, a family portal, and appointment booking.

- **Centers** are our customers. Each center decides what information it enters and how it uses The Center Book.
- **Staff** are people a center gives an account to.
- **Families** (parents and guardians) use the family portal and receive messages from their center.
- **Students** are the children enrolled at a center. Students do not have accounts, and we do not collect information directly from children.

For information a center enters about its families and students, the center is responsible for that information, and we process it on the center's behalf and under its instructions.

## 2. Information we handle

**Information centers and staff enter:**
- Student names, grades, schedules, attendance, levels and progress notes.
- Parent and guardian names, phone numbers, email addresses, and contact preferences.
- Consents and permissions recorded by the family or the center.

**Information families enter in the family portal:** contact details, absence notices, requests and messages to their center.

**Account information:** staff and parent sign-in details. Passwords are stored only as secure one-way hashes.

**Messages:** texts and emails the center sends through The Center Book, and their delivery status.

**Technical information:** basic logs such as IP address, browser type and the time of each request. We use these to keep the service secure and working.

## 3. Google user data (Google Calendar connection)

Staff members can choose to connect their Google Calendar so The Center Book can respect their real availability and add booked parent meetings to their calendar. **This connection is optional, and only the staff member who connects it can turn it on.**

**What we access, and why:**

| Google permission | What we use it for |
|---|---|
| Your Google account email and account ID (`openid`, `email`) | To show which Google account is connected, and to keep one connection per account. |
| Your list of calendars (`calendar.calendarlist.readonly`) | So you can choose which calendars count as busy and which calendar receives bookings. |
| Free/busy times on the calendars you choose (`calendar.events.freebusy`) | To keep busy times off the parent booking page, so families can't book you when you're unavailable. We read **only start and end times**, never event titles, descriptions, attendees or locations. |
| Events on calendars you own (`calendar.events.owned`) | To add a parent meeting booked through The Center Book to the calendar you picked, and to update or remove it if the meeting is moved or cancelled. **We only create, change or delete events that The Center Book itself created.** |

**What we store:**
- Your Google account email and ID, and the names and IDs of the calendars you connected.
- Busy time windows (start and end times only) for roughly the next eight weeks, refreshed automatically.
- The ID of each calendar event we create for a booking.
- Access and refresh tokens from Google, **stored encrypted** with a dedicated key and never shown in the app.

**What we do NOT do with Google user data:**
- We do not sell it, rent it, or use it for advertising.
- We do not share it with anyone else. The only exception is service providers who host our systems for us under confidentiality obligations, where the law requires it, or to protect the security of the service.
- We do not use it to train artificial intelligence or machine learning models.
- We do not let people read it, except where you give us permission for a specific support request, where it's needed for security, or where the law requires it.

**Removing access:** click **Disconnect** on your "My Calendars" card at any time. We revoke our access with Google and delete your stored tokens, calendar list and busy times right away. Events already added to your calendar stay in your calendar unless you delete them. You can also remove access from your Google Account at https://myaccount.google.com/connections.

**Google API Services User Data Policy.** The Center Book's use and transfer to any other app of information received from Google APIs will adhere to the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.

## 4. How we use information

- To provide the service to each center: attendance, scheduling, booking, family communication and the portal.
- To send the texts and emails a center chooses to send.
- To keep the service secure, prevent abuse (for example, spam protection on website forms), and fix problems.
- To meet legal obligations.

We do not sell personal information, and we do not use it for advertising.

## 5. How we share information

We share information only:
- **with the center** it belongs to, and the staff that center authorizes;
- **with service providers** who run parts of the service for us, bound by confidentiality and data protection obligations. These include:
  - cloud hosting and database (Vercel, Neon);
  - email delivery (SendGrid);
  - text messaging (Twilio);
  - spam protection (Cloudflare Turnstile);
- **when the law requires it**, or to protect the rights, safety or security of people or the service.

## 6. Children's information

Students are children. The Center Book is not directed to children, and we do not knowingly collect personal information directly from children under 13. Children do not create accounts or sign in.

A student's information (name, grade, schedule, attendance, levels, progress notes, and health or permission details a family chooses to share) is entered by the student's center or by a parent or guardian through the family portal. The center collects it for the educational purpose of running the child's program and is responsible for obtaining any parent or guardian consent the law requires. We act as the center's service provider:

- We use children's information only to provide the service to that center and that family.
- We never sell it, never use it for advertising or marketing, and never build profiles of children for any other purpose.
- We never share it except with the center, the service providers listed in section 5 (under confidentiality obligations), or where the law requires it.
- We protect it with the security measures in section 7, and delete it as described in section 8.

A parent or guardian can review, correct or delete their child's information, or withdraw consent to further use, by contacting their center or us at steve@thecenterbook.com. We'll respond within 30 days. If we learn we have collected information directly from a child under 13 without the consent required by law, we will delete it.

## 7. Security

- Data is encrypted in transit (HTTPS) and at rest.
- Secrets such as Google tokens are encrypted with separate keys.
- Access is limited by role.
- Each center's data is kept in its own separate database.

## 8. Retention

We keep a center's information while that center uses The Center Book. When a center stops using the service, we delete or return its data within 90 days, unless the law requires us to keep it. Google Calendar data is deleted when a staff member disconnects.

## 9. Your choices

- **Families:** contact your center to review, correct or delete your information, or to change how you're contacted. You can reply STOP to any text to stop texts.
- **Staff:** contact your center administrator, or us at steve@thecenterbook.com.

## 10. Changes

If we change this policy, we'll update the date at the top. If a change is significant, we'll let centers know first.

## 11. Contact

The Center Book LLC · steve@thecenterbook.com
