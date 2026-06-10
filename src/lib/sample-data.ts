export const locations = ["602 HB", "602 GW", "602 CM", "Roastery"];

export const storeProfiles = [
  { code: "602 HB", name: "602 HB", neighborhood: "HB", managers: ["Hannah Brooks", "Marcus Lee"], dailySalesGoal: "$4,800", laborTarget: "24%", openHours: "6:00 AM - 6:00 PM" },
  { code: "602 GW", name: "602 GW", neighborhood: "GW", managers: ["Gina Wells", "Noah Patel"], dailySalesGoal: "$4,200", laborTarget: "25%", openHours: "6:00 AM - 5:00 PM" },
  { code: "602 CM", name: "602 CM", neighborhood: "CM", managers: ["Caleb Morris", "Sofia Reyes"], dailySalesGoal: "$3,900", laborTarget: "26%", openHours: "6:30 AM - 5:00 PM" },
  { code: "Roastery", name: "Roastery", neighborhood: "Production", managers: ["Riley Stone"], dailySalesGoal: "420 lb", laborTarget: "Production plan", openHours: "5:00 AM - 2:00 PM" },
];

export const teamMembers = [
  { name: "Hannah Brooks", location: "602 HB", role: "Store Manager", status: "Active", training: 96, availability: "Full time", nextShift: "Mon 6:00 AM" },
  { name: "Marcus Lee", location: "602 HB", role: "Store Manager", status: "Active", training: 92, availability: "Full time", nextShift: "Tue 10:00 AM" },
  { name: "Jules Nava", location: "602 HB", role: "Shift Lead", status: "Active", training: 88, availability: "Mornings", nextShift: "Mon 8:00 AM" },
  { name: "Taylor Kim", location: "602 HB", role: "Team Member", status: "Active", training: 74, availability: "Weekdays", nextShift: "Wed 9:00 AM" },
  { name: "Gina Wells", location: "602 GW", role: "Store Manager", status: "Active", training: 98, availability: "Full time", nextShift: "Tue 5:30 AM" },
  { name: "Noah Patel", location: "602 GW", role: "Store Manager", status: "Active", training: 91, availability: "Full time", nextShift: "Wed 12:00 PM" },
  { name: "Ari Lopez", location: "602 GW", role: "Shift Lead", status: "Active", training: 82, availability: "Closes", nextShift: "Thu 11:00 AM" },
  { name: "Caleb Morris", location: "602 CM", role: "Store Manager", status: "Active", training: 95, availability: "Full time", nextShift: "Wed 7:00 AM" },
  { name: "Sofia Reyes", location: "602 CM", role: "Store Manager", status: "Active", training: 90, availability: "Full time", nextShift: "Mon 12:00 PM" },
  { name: "Mina Carter", location: "602 CM", role: "Shift Lead", status: "Active", training: 78, availability: "Flexible", nextShift: "Fri 6:30 AM" },
  { name: "Riley Stone", location: "Roastery", role: "Roastery Lead", status: "Active", training: 93, availability: "Production", nextShift: "Thu 5:00 AM" },
];

export const stats = [
  { label: "Open shifts", value: "7", detail: "Need coverage this week" },
  { label: "Store tasks", value: "31", detail: "9 due today" },
  { label: "Low stock", value: "8", detail: "Below par level" },
  { label: "Training due", value: "14", detail: "Across all locations" },
];

export const operationsGroups = [
  {
    title: "Daily Store Operations",
    color: "good",
    items: [
      { task: "HB opening checklist", location: "602 HB", owner: "Hannah Brooks", status: "Working", priority: "High", due: "Today 7:00 AM" },
      { task: "GW patio deep clean", location: "602 GW", owner: "Ari Lopez", status: "Stuck", priority: "Medium", due: "Today 2:00 PM" },
      { task: "CM espresso grinder burr check", location: "602 CM", owner: "Mina Carter", status: "Not Started", priority: "High", due: "Tomorrow" },
      { task: "Manager shift notes review", location: "All Stores", owner: "Daniel Othman", status: "Done", priority: "Low", due: "Daily" },
    ],
  },
  {
    title: "Menu and Launch Projects",
    color: "warn",
    items: [
      { task: "Summer latte recipe cards", location: "All Stores", owner: "Gina Wells", status: "Working", priority: "High", due: "Fri" },
      { task: "Cold brew signage update", location: "602 HB", owner: "Marcus Lee", status: "Done", priority: "Medium", due: "Thu" },
      { task: "Pastry par reset", location: "602 GW", owner: "Noah Patel", status: "Working", priority: "Medium", due: "Next Mon" },
    ],
  },
  {
    title: "Maintenance and Facilities",
    color: "danger",
    items: [
      { task: "HB ice machine service call", location: "602 HB", owner: "Daniel Othman", status: "Stuck", priority: "Urgent", due: "Today" },
      { task: "CM back door keypad", location: "602 CM", owner: "Caleb Morris", status: "Waiting", priority: "Medium", due: "Wed" },
      { task: "GW floor mat replacement", location: "602 GW", owner: "Gina Wells", status: "Not Started", priority: "Low", due: "Next Week" },
    ],
  },
  {
    title: "Roastery Production",
    color: "neutral",
    items: [
      { task: "Roast 120 lb house blend", location: "Roastery", owner: "Riley Stone", status: "Working", priority: "High", due: "Today" },
      { task: "Bag retail coffee for HB/GW/CM", location: "Roastery", owner: "Riley Stone", status: "Not Started", priority: "High", due: "Tomorrow" },
      { task: "Green coffee receiving log", location: "Roastery", owner: "Daniel Othman", status: "Waiting", priority: "Medium", due: "Fri" },
    ],
  },
];

export const weeklyShifts = [
  { day: "Mon", date: "Jun 15", location: "602 HB", time: "6:00 AM - 2:00 PM", person: "Hannah Brooks", role: "Opening Manager", station: "Floor", hours: 8, status: "Confirmed" },
  { day: "Mon", date: "Jun 15", location: "602 HB", time: "8:00 AM - 4:00 PM", person: "Jules Nava", role: "Shift Lead", station: "Bar", hours: 8, status: "Confirmed" },
  { day: "Mon", date: "Jun 15", location: "602 CM", time: "12:00 PM - 5:30 PM", person: "Sofia Reyes", role: "Closing Manager", station: "Floor", hours: 5.5, status: "Confirmed" },
  { day: "Tue", date: "Jun 16", location: "602 GW", time: "5:30 AM - 1:30 PM", person: "Gina Wells", role: "Opening Manager", station: "Floor", hours: 8, status: "Confirmed" },
  { day: "Tue", date: "Jun 16", location: "602 HB", time: "10:00 AM - 6:00 PM", person: "Marcus Lee", role: "Closing Manager", station: "Floor", hours: 8, status: "Confirmed" },
  { day: "Wed", date: "Jun 17", location: "602 CM", time: "7:00 AM - 3:00 PM", person: "Caleb Morris", role: "Opening Manager", station: "Floor", hours: 8, status: "Confirmed" },
  { day: "Wed", date: "Jun 17", location: "602 GW", time: "12:00 PM - 5:30 PM", person: "Noah Patel", role: "Closing Manager", station: "Floor", hours: 5.5, status: "Confirmed" },
  { day: "Thu", date: "Jun 18", location: "Roastery", time: "5:00 AM - 1:00 PM", person: "Riley Stone", role: "Production Lead", station: "Roaster", hours: 8, status: "Confirmed" },
  { day: "Thu", date: "Jun 18", location: "602 GW", time: "11:00 AM - 5:30 PM", person: "Ari Lopez", role: "Shift Lead", station: "Bar", hours: 6.5, status: "Trade Requested" },
  { day: "Fri", date: "Jun 19", location: "602 CM", time: "6:30 AM - 2:30 PM", person: "Mina Carter", role: "Shift Lead", station: "Bar", hours: 8, status: "Confirmed" },
  { day: "Sat", date: "Jun 20", location: "602 HB", time: "7:00 AM - 3:00 PM", person: "Open Shift", role: "Barista", station: "Register", hours: 8, status: "Open" },
  { day: "Sun", date: "Jun 21", location: "602 GW", time: "9:00 AM - 3:00 PM", person: "Open Shift", role: "Barista", station: "Support", hours: 6, status: "Open" },
];

export const scheduleCoverage = [
  { location: "602 HB", scheduled: 112, target: 124, open: 2, labor: "23.8%" },
  { location: "602 GW", scheduled: 98, target: 108, open: 1, labor: "24.9%" },
  { location: "602 CM", scheduled: 86, target: 96, open: 2, labor: "25.5%" },
  { location: "Roastery", scheduled: 40, target: 44, open: 0, labor: "On plan" },
];

export const shiftRequests = [
  { type: "Time off", employee: "Taylor Kim", location: "602 HB", date: "Jun 20", status: "Needs Review", note: "Family event" },
  { type: "Shift trade", employee: "Ari Lopez", location: "602 GW", date: "Jun 18", status: "Pending Coverage", note: "Trade requested with Noah" },
  { type: "Availability", employee: "Mina Carter", location: "602 CM", date: "Starting Jun 24", status: "New", note: "Can open Mon/Wed/Fri" },
];

export const trainingMaterials = [
  { title: "Espresso Dial-In", category: "Coffee", status: "Ready", audience: "Baristas and Leads", due: "Before first bar shift", owner: "Gina Wells" },
  { title: "Guest Recovery", category: "Service", status: "Draft", audience: "All cafe staff", due: "Within 14 days", owner: "Marcus Lee" },
  { title: "Roast Batch Handoff", category: "Roastery", status: "Ready", audience: "Roastery and managers", due: "Before production handoff", owner: "Riley Stone" },
  { title: "Opening Checklist", category: "Operations", status: "Ready", audience: "Shift leads", due: "Before lead promotion", owner: "Hannah Brooks" },
  { title: "Cash Handling", category: "Operations", status: "Ready", audience: "Managers and leads", due: "Before drawer access", owner: "Caleb Morris" },
  { title: "Food Safety and Allergens", category: "Safety", status: "Ready", audience: "All staff", due: "Within 7 days", owner: "Noah Patel" },
];

export const quizzes = [
  { title: "Espresso Standards Quiz", questions: 8, passing: "80%", attempts: 18, average: "87%", retakes: 3 },
  { title: "Food Safety Basics", questions: 10, passing: "85%", attempts: 12, average: "91%", retakes: 1 },
  { title: "Guest Recovery Scenarios", questions: 6, passing: "80%", attempts: 7, average: "83%", retakes: 2 },
  { title: "Shift Lead Readiness", questions: 12, passing: "90%", attempts: 5, average: "88%", retakes: 2 },
];

export const hrRecords = [
  { employee: "Hannah Brooks", location: "602 HB", role: "Store Manager", complete: 5, missing: 0, nextReview: "Aug 1" },
  { employee: "Marcus Lee", location: "602 HB", role: "Store Manager", complete: 5, missing: 0, nextReview: "Aug 8" },
  { employee: "Jules Nava", location: "602 HB", role: "Shift Lead", complete: 4, missing: 1, nextReview: "Jul 18" },
  { employee: "Taylor Kim", location: "602 HB", role: "Team Member", complete: 3, missing: 2, nextReview: "Jul 12" },
  { employee: "Gina Wells", location: "602 GW", role: "Store Manager", complete: 5, missing: 0, nextReview: "Aug 10" },
  { employee: "Noah Patel", location: "602 GW", role: "Store Manager", complete: 4, missing: 1, nextReview: "Jul 28" },
  { employee: "Caleb Morris", location: "602 CM", role: "Store Manager", complete: 5, missing: 0, nextReview: "Aug 14" },
  { employee: "Riley Stone", location: "Roastery", role: "Roastery Lead", complete: 5, missing: 0, nextReview: "Sep 1" },
];

export const inventory = [
  { item: "Whole Milk", location: "602 HB", category: "Dairy", count: 9, par: 18, unit: "gal", vendor: "Local Dairy", reorder: "Auto request" },
  { item: "Oat Milk", location: "602 HB", category: "Dairy Alt", count: 11, par: 16, unit: "case", vendor: "Distributor", reorder: "Need today" },
  { item: "Cold Cups 16oz", location: "602 HB", category: "Packaging", count: 5, par: 8, unit: "case", vendor: "Packaging Co", reorder: "Submitted" },
  { item: "Vanilla Syrup", location: "602 GW", category: "Syrups", count: 11, par: 10, unit: "bottle", vendor: "House Prep", reorder: "Healthy" },
  { item: "Chai Concentrate", location: "602 GW", category: "Beverage", count: 4, par: 8, unit: "jug", vendor: "Distributor", reorder: "Need today" },
  { item: "Retail Bags", location: "602 CM", category: "Retail", count: 22, par: 60, unit: "each", vendor: "Roastery", reorder: "Submitted" },
  { item: "Ethiopia Green Coffee", location: "Roastery", category: "Green Coffee", count: 180, par: 300, unit: "lb", vendor: "Importer", reorder: "Quote needed" },
  { item: "12oz Valve Bags", location: "Roastery", category: "Packaging", count: 6, par: 12, unit: "case", vendor: "Packaging Co", reorder: "Need today" },
];

export const orders = [
  { request: "REQ-1001", location: "602 HB", item: "Whole Milk", status: "SUBMITTED", owner: "Hannah Brooks", needed: "Today", source: "Local Dairy" },
  { request: "REQ-1002", location: "602 CM", item: "Retail Bags", status: "APPROVED", owner: "Caleb Morris", needed: "Tomorrow", source: "Roastery" },
  { request: "REQ-1003", location: "Roastery", item: "12oz Valve Bags", status: "DRAFT", owner: "Riley Stone", needed: "Fri", source: "Packaging Co" },
  { request: "REQ-1004", location: "602 GW", item: "Chai Concentrate", status: "SUBMITTED", owner: "Noah Patel", needed: "Today", source: "Distributor" },
];
