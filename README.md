🏢 Digital Society Platform

A collaborative platform for residents, society management committees, and staff to raise issues, track finances, vote on decisions, and access updates.
Built with React (frontend), Express (backend), and PostgreSQL/Supabase (database).

🌟 Vision

Empower communities to manage complaints, budgets, polls, services, and notices transparently in one place.

⚙️ Core Features

🔑 Role-Based Access

Residents (Users): Raise complaints, vote in polls, view notices, book services.

Committee (Owners/Admin): Manage complaints, budgets, polls, notices, and services.

Staff: Execute assigned tasks (resolve complaints, update booking status).

#📋 Complaint Management

Residents file complaints (e.g., “Lift not working”).

Complaints move through statuses → Pending → In Progress → Resolved.

Auto-escalation if unresolved after X days.

💰 Society Budget & Expenses

Transparent view of maintenance collections, allocations, and expenses.

Residents see charts of where funds are used.

📢 Digital Forum (Community Hub)

Notice Board: Committee posts updates.

Polls: Residents vote on society decisions (e.g., repaint building, install solar).

Events: Announcements for celebrations and gatherings.

#🚖 Services & Bookings

Book cabs, ambulances, halls, or society amenities.

Track bookings & status updates by staff/admin.

🛡️ Role-Based Functions (RBAC)

| Feature           | User (Resident) | Staff (Worker)          | Owner (Admin/Committee)       |
| ----------------- | --------------- | ----------------------- | ----------------------------- |
| Complaints        | Create, Track   | Update status           | Assign staff, Close issue     |
| Polls             | View, Vote      | View,Vote               | Create, Close poll            |
| Notices           | View            | View                    | Create, Edit, Delete          |
| Services/Bookings | Book, Track     | Update assigned booking | Add service, Approve bookings |

⚡USP's

✅ Role-based login (Resident/Admin)
✅ Complaint filing + tracking
✅ Polls for community decisions
✅ Notice board
✅ Services (e.g., ambulance booking, hall booking, pool booking, etc.)


📌 Future Enhancements
Visitor management (digital gate entry, delivery logs) for admins.

Community marketplace (food vendors, electricians).

Event RSVPs & interest-based groups.

Budget and fund tracking for societie's management group

Enhanced RBAC.


