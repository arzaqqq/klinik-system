import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/hash"

export async function POST(req: Request) {
  const { username, password } = await req.json()

  const hash = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      username,
      password: hash
    }
  })

  return Response.json(user)
}