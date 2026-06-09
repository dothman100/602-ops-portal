import { PrismaClient, Role, TrainingCategory, InventoryUnit, DocumentStatus, OrderStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const password = "Password123!";

async function main() {
  const passwordHash = await bcrypt.hash(password, 12);

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
    const user = await prisma.user.upsert({
      where: { email },
      update: { name: `${firstName} ${lastName}`, role, locationId, passwordHash },
      create: { name: `${firstName} ${lastName}`, email, role, locationId, passwordHash },
    });

    const employee = await prisma.employee.upsert({
      where: { email },
      update: { firstName, lastName, role, title, locationId, userId: user.id },
      create: {
        firstName,
        lastName,
        email,
        role,
        title,
        locationId,
        userId: user.id,
        phone: "602-555-0100",
        hireDate: new Date("2024-01-15T12:00:00Z"),
      },
    });
    employees.push(employee);
  }

  const docTemplates = await Promise.all(
    [
      ["I-9 Verification", "Federal employment eligibility verification."],
      ["W-4", "Federal withholding form."],
      ["Food Handler Card", "Current food safety certification."],
      ["Employee Handbook", "Signed handbook acknowledgement."],
      ["Direct Deposit", "Payroll deposit authorization."],
    ].map(([name, description]) =>
      prisma.hrDocumentTemplate.upsert({
        where: { id: name.toLowerCase().replaceAll(" ", "-") },
        update: { name, description },
        create: { id: name.toLowerCase().replaceAll(" ", "-"), name, description },
      }),
    ),
  );

  for (const employee of employees) {
    for (const [index, template] of docTemplates.entries()) {
      await prisma.employeeDocument.upsert({
        where: { employeeId_templateId: { employeeId: employee.id, templateId: template.id } },
        update: {},
        create: {
          employeeId: employee.id,
          templateId: template.id,
          status: index < 3 ? DocumentStatus.COMPLETE : DocumentStatus.MISSING,
          completedAt: index < 3 ? new Date() : null,
        },
      });
    }
  }

  const training = [
    {
      title: "Espresso Dial-In Standards",
      category: TrainingCategory.COFFEE,
      summary: "Dose, yield, time, sensory checks, and escalation steps for every bar.",
      contentUrl: "https://example.com/training/espresso",
      requiredFor: [Role.STAFF, Role.SHIFT_LEAD, Role.STORE_MANAGER],
      quiz: "Espresso Standards Quiz",
    },
    {
      title: "Guest Recovery Playbook",
      category: TrainingCategory.SERVICE,
      summary: "How to resolve missed drinks, wait times, refunds, and service escalations.",
      contentUrl: "https://example.com/training/service",
      requiredFor: [Role.STAFF, Role.SHIFT_LEAD, Role.STORE_MANAGER],
      quiz: "Guest Recovery Quiz",
    },
    {
      title: "Roast Batch Handoff",
      category: TrainingCategory.ROASTERY,
      summary: "Green lot checks, roast log notes, bagging, and transfer readiness.",
      contentUrl: "https://example.com/training/roastery-handoff",
      requiredFor: [Role.SHIFT_LEAD, Role.STORE_MANAGER, Role.AREA_MANAGER],
      quiz: "Roastery Handoff Quiz",
    },
  ];

  for (const item of training) {
    const { quiz: quizTitle, ...materialData } = item;
    const material = await prisma.trainingMaterial.upsert({
      where: { title: item.title },
      update: materialData,
      create: materialData,
    });

    const quiz = await prisma.quiz.upsert({
      where: { trainingMaterialId: material.id },
      update: { title: quizTitle, passingScore: 80 },
      create: { trainingMaterialId: material.id, title: quizTitle, passingScore: 80 },
    });

    await prisma.quizQuestion.createMany({
      data: [
        {
          quizId: quiz.id,
          prompt: `What should be checked first in ${item.title}?`,
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
      skipDuplicates: true,
    });
  }

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(14, 0, 0, 0);

  for (let day = 1; day <= 21; day += 3) {
    for (const employee of employees.slice(2)) {
      const startsAt = new Date(monthStart);
      startsAt.setDate(day);
      const endsAt = new Date(startsAt);
      endsAt.setHours(startsAt.getHours() + 8);
      await prisma.scheduleShift.upsert({
        where: {
          employeeId_startsAt_position: {
            employeeId: employee.id,
            startsAt,
            position: employee.role === Role.STAFF ? "Barista" : "Floor Lead",
          },
        },
        update: {
          locationId: employee.locationId,
          endsAt,
        },
        create: {
          employeeId: employee.id,
          locationId: employee.locationId,
          startsAt,
          endsAt,
          position: employee.role === Role.STAFF ? "Barista" : "Floor Lead",
        },
      });
    }
  }

  const inventorySeeds = [
    [hb.id, "Whole Milk", "Dairy", InventoryUnit.GALLON, 18, 9],
    [hb.id, "Cold Cups 16oz", "Packaging", InventoryUnit.CASE, 8, 5],
    [gw.id, "Vanilla Syrup", "Syrups", InventoryUnit.EACH, 10, 11],
    [cm.id, "Retail Bags", "Retail", InventoryUnit.EACH, 60, 22],
    [roastery.id, "Ethiopia Green Coffee", "Green Coffee", InventoryUnit.POUND, 300, 180],
    [roastery.id, "12oz Valve Bags", "Packaging", InventoryUnit.CASE, 12, 6],
  ] as const;

  const inventoryItems = [];
  for (const [locationId, name, category, unit, parLevel, currentQty] of inventorySeeds) {
    inventoryItems.push(
      await prisma.inventoryItem.upsert({
        where: { locationId_name: { locationId, name } },
        update: { category, unit, parLevel, currentQty },
        create: { locationId, name, category, unit, parLevel, currentQty },
      }),
    );
  }

  const request = await prisma.orderRequest.upsert({
    where: { requestNo: "REQ-1001" },
    update: {},
    create: {
      requestNo: "REQ-1001",
      locationId: hb.id,
      requestedBy: "Hannah Brooks",
      status: OrderStatus.SUBMITTED,
      notes: "Need before weekend rush.",
    },
  });

  await prisma.orderLine.createMany({
    data: inventoryItems
      .filter((item) => item.locationId === hb.id)
      .map((item) => ({ orderRequestId: request.id, inventoryItemId: item.id, quantity: item.parLevel - item.currentQty + 2 })),
    skipDuplicates: true,
  });

  console.log(`Seeded 602 Ops Portal. Demo password for all users: ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
