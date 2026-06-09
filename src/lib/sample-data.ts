export const locations = ["HB", "GW", "CM", "Roastery"];

export const stats = [
  { label: "Open shifts", value: "7", detail: "Across this week" },
  { label: "Training due", value: "12", detail: "Assigned modules" },
  { label: "Low stock", value: "5", detail: "Below par level" },
  { label: "Order requests", value: "9", detail: "Pending review" },
];

export const shifts = [
  { day: "Mon", time: "6:00 AM - 2:00 PM", person: "Hannah Brooks", location: "HB", role: "Opening Lead" },
  { day: "Mon", time: "8:00 AM - 4:00 PM", person: "Jules Nava", location: "HB", role: "Barista" },
  { day: "Tue", time: "5:30 AM - 1:30 PM", person: "Gina Wells", location: "GW", role: "Store Manager" },
  { day: "Wed", time: "7:00 AM - 3:00 PM", person: "Caleb Morris", location: "CM", role: "Floor Lead" },
  { day: "Thu", time: "6:00 AM - 2:00 PM", person: "Riley Stone", location: "Roastery", role: "Roastery Lead" },
];

export const trainingMaterials = [
  { title: "Espresso Dial-In", category: "Coffee", status: "Ready", audience: "Baristas and Leads" },
  { title: "Guest Recovery", category: "Service", status: "Draft", audience: "All cafe staff" },
  { title: "Roast Batch Handoff", category: "Roastery", status: "Ready", audience: "Roastery and managers" },
  { title: "Opening Checklist", category: "Operations", status: "Ready", audience: "Shift leads" },
];

export const quizzes = [
  { title: "Espresso Standards Quiz", questions: 8, passing: "80%", attempts: 18 },
  { title: "Food Safety Basics", questions: 10, passing: "85%", attempts: 12 },
  { title: "Guest Recovery Scenarios", questions: 6, passing: "80%", attempts: 7 },
];

export const hrRecords = [
  { employee: "Hannah Brooks", location: "HB", complete: 5, missing: 0 },
  { employee: "Jules Nava", location: "HB", complete: 3, missing: 2 },
  { employee: "Gina Wells", location: "GW", complete: 4, missing: 1 },
  { employee: "Riley Stone", location: "Roastery", complete: 5, missing: 0 },
];

export const inventory = [
  { item: "Whole Milk", location: "HB", count: 9, par: 18, unit: "gal" },
  { item: "Cold Cups 16oz", location: "HB", count: 5, par: 8, unit: "case" },
  { item: "Vanilla Syrup", location: "GW", count: 11, par: 10, unit: "bottle" },
  { item: "Retail Bags", location: "CM", count: 22, par: 60, unit: "each" },
  { item: "Ethiopia Green Coffee", location: "Roastery", count: 180, par: 300, unit: "lb" },
];

export const orders = [
  { request: "REQ-1001", location: "HB", item: "Whole Milk", status: "SUBMITTED", owner: "Hannah Brooks" },
  { request: "REQ-1002", location: "CM", item: "Retail Bags", status: "APPROVED", owner: "Caleb Morris" },
  { request: "REQ-1003", location: "Roastery", item: "12oz Valve Bags", status: "DRAFT", owner: "Riley Stone" },
];
