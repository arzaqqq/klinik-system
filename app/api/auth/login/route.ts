import { prisma } from "@/lib/prisma"
import { comparePassword } from "@/lib/hash"
import { signToken } from "@/lib/jwt"

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        userRoles: {
          include: { role: true }
        }
      }
    })

    if (!user) {
      return Response.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      )
    }

    const isValid = await comparePassword(password, user.password)

    if (!isValid) {
      return Response.json(
        { message: "Password salah" },
        { status: 401 }
      )
    }

    const roles = user.userRoles.map((r) => r.role)

    const token = signToken({
      userId: user.id,
      username: user.username
    })

    return Response.json({
      token,
      roles
    })
  } catch (err) {
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}