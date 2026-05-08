# Notification System Design - Stage 1

This document outlines the design and implementation of the **Priority Inbox** for the Campus Notifications application.

## 1. Problem Statement
Users are overwhelmed by a high volume of notifications, causing them to miss critical information (e.g., job placements or exam results). The goal is to provide a "Priority Inbox" that surfacing the top 'n' most important unread notifications.

## 2. Priority Algorithm
The importance of a notification is determined by two factors: **Weight** and **Recency**.

### A. Weighting System
Categories are assigned numerical weights:
- **Placement**: 3 (Highest)
- **Result**: 2
- **Event**: 1 (Lowest)

### B. Scoring Logic
To maintain a strict hierarchy where weights always trump recency, we use the following comparison logic:
1. Compare category weights.
2. If weights are identical, compare timestamps (most recent first).

In code, this is implemented as:
```javascript
notifications.sort((a, b) => {
  if (weights[b.type] !== weights[a.type]) {
    return weights[b.type] - weights[a.type];
  }
  return b.timestamp - a.timestamp;
});
```

## 3. Efficiency & Maintenance
New notifications keep coming in. To maintain the top 'n' efficiently:

### A. React State Management
In the current implementation, we maintain a central `notifications` state. When a new notification arrives:
1. It is prepended to the `notifications` array.
2. The `PriorityInbox` component re-calculates the top 'n' by filtering unread items and performing a sort.

### B. Performance Analysis
- **Filtering**: $O(U)$ where $U$ is the number of unread notifications.
- **Sorting**: $O(U \log U)$.
- **Slicing**: $O(N)$ where $N$ is the user-defined limit (e.g., 10).

For a typical user with a few hundred unread notifications, this $O(U \log U)$ operation is instantaneous (sub-millisecond) in the browser.

### C. Scaling to High Volume
If the volume of notifications grows significantly (thousands of unread items), we would optimize by:
1. **Incremental Updates**: Using a **Min-Heap** of size $N$ to track the top $N$ items. When a new notification arrives, if its priority is higher than the heap's root (the $N$-th item), we replace the root and heapify. This reduces complexity to $O(\log N)$ per new notification.
2. **Server-Side Indexing**: For truly massive scales, the database would maintain a priority index (Category ID, Timestamp) to allow $O(N)$ retrieval.

## 4. User Experience (UX)
- **Visual Distinction**: Each notification type has a distinct color code (Gold for Placement, Green for Result, Blue for Event).
- **Glassmorphism Design**: A modern, premium look with subtle animations and transparency.
- **Dynamic Control**: Users can adjust 'n' (Top 5, 10, 15, 20) dynamically, and the inbox updates in real-time.
- **Read/Unread State**: Marking a notification as "Read" immediately removes it from the Priority Inbox, making room for the next most important unread alert.
