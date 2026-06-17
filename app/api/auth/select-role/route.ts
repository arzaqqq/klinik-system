import { prisma } from "@/lib/prisma"
import { verifyToken, signToken } from "@/lib/jwt"

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return Response.json({ message: "No token" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded: any = verifyToken(token)

    const { roleId } = await req.json()

    // VALIDASI: pastikan role ini milik user
    const userRole = await prisma.userRole.findFirst({
      where: {
        userId: decoded.userId,
        roleId: roleId
      },
      include: {
        role: true
      }
    })

    if (!userRole) {
      return Response.json(
        { message: "Role tidak valid untuk user ini" },
        { status: 403 }
      )
    }

    // GENERATE TOKEN BARU (ROLE ACTIVE)
    const newToken = signToken({
      userId: decoded.userId,
      username: decoded.username,
      roleId: userRole.role.id,
      roleName: userRole.role.name
    })

    return Response.json({
      token: newToken,
      role: userRole.role.name
    })

  } catch (err) {
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}