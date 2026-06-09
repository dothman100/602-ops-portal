import { Role, TrainingCategory, InventoryUnit, DocumentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const demoPassword = "Password123!";

export async function ensureDemoData() {
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) return;

  const passwordHash = await bcrypt.hash(demoPassword, 12);

  const [hb, gw, cm, roastery] = await Promise.all(
    [
      { code: "HB", name: "HB Coffee Shop", type: "CAFE" as const },
      { code: "GW", name: "GW Coffee Shop", type: "CAFE" as const },
      { code: "CM", name: "CM Coffee Shop", type: "CAFE" as const },
      { code: "ROASTERY", name: "Roastery", type: "ROASTERY" as const },
    ].map((location) =>
      prisma.location.upsert({
        where: { code: location.code },
        update: location,
        create: location,
      }),
    ),
  );

  const people = [
    ["Olivia", "Bennett", "owner@602ops.com", Role.OWNER, "Owner", roastery.id],
    ["Marco", "Santos", "area@602ops.com", Role.AREA_MANAGER, "Area Manager", roastery.id],
    ["Hannah", "Brooks", "hb.manager@602ops.com", Role.STORE_MANAGER, "HB Store Manager", hb.id],
    ["Gina", "Wells", "gw.manager@602ops.com", Role.STORE_MANAGER, "GW Store Manager", gw.id],
    ["Caleb", "Morris", "cm.manager@602ops.com", Role.STORE_MANAGER, "CM Store Manager", cm.id],
    ["Riley", "Stone", "roastery@602ops.com", Role.SHIFT_LEAD, "Roastery Lead", roastery.id],
    ["Jules", "Nava", "staff@602ops.com", Role.STAFF, "Barista", hb.id],
  ] as const;

  const employees = [];
  for (const [firstName, lastName, email, role, title, locationId] of people) {
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        role,
        locationId,
        passwordHash,
      },
    });

    employees.push(
      await prisma.employee.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          email,
          role,
          title,
          locationId,
          phone: "602-555-0100",
          hireDate: new Date("2024-01-15T12:00:00Z"),
        },
      }),
    );
  }

  const docTemplates = await Promise.all(
    [
      ["I-9 Verification", "Federal employment eligibility verification."],
      ["W-4", "Federal withholding form."],
      ["Food Handler Card", "Current food safety certification."],
      ["Employee Handbook", "Signed handbook acknowledgement."],
      ["Direct Deposit", "Payroll deposit authorization."],
    ].map(([name, description]) =>
      prisma.hrDocumentTemplate.create({
        data: { id: name.toLowerCase().replaceAll(" ", "-"), name, description },
      }),
    ),
  );

  await prisma.employeeDocument.createMany({
    data: employees.flatMap((employee) =>
      docTemplates.map((template, index) => ({
        employeeId: employee.id,
        templateId: template.id,
        status: index < 3 ? DocumentStatus.COMPLETE : DocumentStatus.MISSING,
        completedAt: index < 3 ? new Date() : null,
      })),
    ),
  });

  const material = await prisma.trainingMaterial.create({
    data: {
      title: "Espresso Dial-In Standards",
      category: TrainingCategory.COFFEE,
      summary: "Dose, yield, time, sensory checks, and escalation steps for every bar.",
      contentUrl: "https://example.com/training/espresso",
      requiredFor: [Role.STAFF, Role.SHIFT_LEAD, Role.STORE_MANAGER],
    },
  });

  const quiz = await prisma.quiz.create({
    data: { trainingMaterialId: material.id, title: "Espresso Standards Quiz", passingScore: 80 },
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        quizId: quiz.id,
        prompt: "What should be checked first during espresso dial-in?",
        choices: ["The posted standard", "Social media", "Last week's sales", "The music volume"],
        answer: "The posted standard",
      },
      {
        quizId: quiz.id,
        prompt: "Who should be notified when a standard cannot be met?",
        choices: ["A lead or manager", "No one", "Only the next shift", "A vendor"],
        answer: "A lead or manager",
      },
    ],
  });

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 14, 0, 0, 0);
  await prisma.scheduleShift.createMany({
    data: employees.slice(2).map((employee, index) => {
      const startsAt = new Date(monthStart);
      startsAt.setDate(index + 1);
      const endsAt = new Date(startsAt);
      endsAt.setHours(startsAt.getHours() + 8);
      return {
        employeeId: employee.id,
        locationId: employee.locationId,
        startsAt,
        endsAt,
        position: employee.role === Role.STAFF ? "Barista" : "Floor Lead",
      };
    }),
  });

  const inventoryItems = await prisma.inventoryItem.createManyAndReturn({
    data: [
      { locationId: hb.id, name: "Whole Milk", category: "Dairy", unit: InventoryUnit.GALLON, parLevel: 18, currentQty: 9 },
      { locationId: hb.id, name: "Cold Cups 16oz", category: "Packaging", unit: InventoryUnit.CASE, parLevel: 8, currentQty: 5 },
      { locationId: gw.id, name: "Vanilla Syrup", category: "Syrups", unit: InventoryUnit.EACH, parLevel: 10, currentQty: 11 },
      { locationId: cm.id, name: "Retail Bags", category: "Retail", unit: InventoryUnit.EACH, parLevel: 60, currentQty: 22 },
      { locationId: roastery.id, name: "Ethiopia Green Coffee", category: "Green Coffee", unit: InventoryUnit.POUND, parLevel: 300, currentQty: 180 },
      { locationId: roastery.id, name: "12oz Valve Bags", category: "Packaging", unit: InventoryUnit.CASE, parLevel: 12, currentQty: 6 },
    ],
  });

  const request = await prisma.orderRequest.create({
    data: {
      requestNo: "REQ-1001",
      locationId: hb.id,
      requestedBy: "Hannah Brooks",
      notes: "Need before weekend rush.",
    },
  });

  await prisma.orderLine.createMany({
    data: inventoryItems
      .filter((item) => item.locationId === hb.id)
      .map((item) => ({ orderRequestId: request.id, inventoryItemId: item.id, quantity: item.parLevel - item.currentQty + 2 })),
  });
}
