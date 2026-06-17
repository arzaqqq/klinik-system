"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function SelectRolePage() {
  const [roles, setRoles] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    // ambil roles dari login
    const storedRoles = localStorage.getItem("roles")

    if (!storedRoles) {
      router.push("/login")
      return
    }

    setRoles(JSON.parse(storedRoles))
  }, [])

  const selectRole = async (roleId: number) => {
    const token = localStorage.getItem("token")

    const res = await fetch("/api/auth/select-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ roleId })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message)
      return
    }

    // simpan token BARU (role aktif)
    localStorage.setItem("token", data.token)

    // redirect sesuai role
    switch (data.role) {
      case "Super Admin":
        router.push("/dashboard/admin")
        break
      case "Doctor":
        router.push("/dashboard/doctor")
        break
      case "Nurse":
        router.push("/dashboard/nurse")
        break
      case "Patient":
        router.push("/dashboard/patient")
        break
      default:
        router.push("/login")
    }
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>Pilih Role Aktif</h2>

      <div style={{ marginTop: 20 }}>
        {roles.map((r) => (
          <button
            key={r.id}
            onClick={() => selectRole(r.id)}
            style={{
              display: "block",
              padding: 10,
              marginBottom: 10,
              width: 200,
              cursor: "pointer"
            }}
          >
            {r.name}
          </button>
        ))}
      </div>
    </div>
  )
}