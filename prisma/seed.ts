import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  await prisma.userRole.deleteMany()
  await prisma.user.deleteMany()
  await prisma.role.deleteMany()

  const superAdmin = await prisma.role.create({ data: { name: "Super Admin" } })
  const doctor = await prisma.role.create({ data: { name: "Doctor" } })
  const nurse = await prisma.role.create({ data: { name: "Nurse" } })
  const patient = await prisma.role.create({ data: { name: "Patient" } })

  const hash = await bcrypt.hash("123456", 10)

  const adminUser = await prisma.user.create({
    data: { username: "admin", password: hash }
  })

  const doctorUser = await prisma.user.create({
    data: { username: "doctor", password: hash }
  })

  const nurseUser = await prisma.user.create({
    data: { username: "nurse", password: hash }
  })

  const patientUser = await prisma.user.create({
    data: { username: "patient", password: hash }
  })

  await prisma.userRole.createMany({
    data: [
      { userId: adminUser.id, roleId: superAdmin.id },
      { userId: doctorUser.id, roleId: doctor.id },
      { userId: nurseUser.id, roleId: nurse.id },
      { userId: patientUser.id, roleId: patient.id }
    ]
  })

  console.log("Seed sukses ✔")
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })