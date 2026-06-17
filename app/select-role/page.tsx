"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function SelectRolePage() {
  const [roles, setRoles] = useState([])
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("roles")
    if (stored) {
      setRoles(JSON.parse(stored))
    }
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

    localStorage.setItem("token", data.token)

    // redirect berdasarkan role
    if (data.role === "Super Admin") {
      router.push("/dashboard/admin")
    } else if (data.role === "Doctor") {
      router.push("/dashboard/doctor")
    } else if (data.role === "Nurse") {
      router.push("/dashboard/nurse")
    } else {
      router.push("/dashboard/patient")
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Pilih Role</h2>

      {roles.map((r: any) => (
        <button
          key={r.id}
          onClick={() => selectRole(r.id)}
          style={{
            display: "block",
            margin: "10px 0",
            padding: 10
          }}
        >
          {r.name}
        </button>
      ))}
    </div>
  )
}