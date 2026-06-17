import { prisma } from "@/lib/prisma"
import { verifyToken, signToken } from "@/lib/jwt"

export async function POST(req: Request) {
  const auth = req.headers.get("authorization")
  if (!auth) return Response.json({ message: "No token" }, { status: 401 })

  const token = auth.split(" ")[1]
  const decoded: any = verifyToken(token)

  const { roleId } = await req.json()

  const userRole = await prisma.userRole.findFirst({
    where: {
      userId: decoded.userId,
      roleId
    },
    include: { role: true }
  })

  if (!userRole) {
    return Response.json({ message: "Role invalid" }, { status: 403 })
  }

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
}