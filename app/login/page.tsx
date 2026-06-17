"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message)
      return
    }

    // simpan token + roles
    localStorage.setItem("token", data.token)
    localStorage.setItem("roles", JSON.stringify(data.roles))

    // lanjut ke select role
    router.push("/select-role")
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login Klinik</h2>

      <input
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  )
}