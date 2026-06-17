import { prisma } from "../lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
  // clear data (biar aman test ulang)
  await prisma.userRole.deleteMany()
  await prisma.user.deleteMany()
  await prisma.role.deleteMany()

  // 1. CREATE ROLES
  const superAdmin = await prisma.role.create({
    data: { name: "Super Admin" }
  })

  const doctor = await prisma.role.create({
    data: { name: "Doctor" }
  })

  const nurse = await prisma.role.create({
    data: { name: "Nurse" }
  })

  const patient = await prisma.role.create({
    data: { name: "Patient" }
  })

  // 2. HASH PASSWORD DEFAULT
  const hash = await bcrypt.hash("123456", 10)

  // 3. CREATE USERS

  const adminUser = await prisma.user.create({
    data: {
      username: "admin",
      password: hash
    }
  })

  const doctorUser = await prisma.user.create({
    data: {
      username: "doctor",
      password: hash
    }
  })

  const nurseUser = await prisma.user.create({
    data: {
      username: "nurse",
      password: hash
    }
  })

  const patientUser = await prisma.user.create({
    data: {
      username: "patient",
      password: hash
    }
  })

  // 4. ASSIGN ROLES

  await prisma.userRole.createMany({
    data: [
      { userId: adminUser.id, roleId: superAdmin.id },

      { userId: doctorUser.id, roleId: doctor.id },

      { userId: nurseUser.id, roleId: nurse.id },

      { userId: patientUser.id, roleId: patient.id }
    ]
  })

  console.log("Seed selesai ✔")
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })