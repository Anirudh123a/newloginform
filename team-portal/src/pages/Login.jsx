import { useState } from "react";
import { useNavigate } from "react-router-dom";

const teams = [
  { name: "csk", password: "098765432" },
  { name: "mi", password: "123456789" },
  { name: "rcb", password: "987654321" }
];

// Admin credentials
const admin = {
  username: "admin",
  password: "admin123"
};

export default function Login() {
  const [team, setTeam] = useState("");
  const [pass, setPass] = useState("");
  const [role, setRole] = useState("team");

  const navigate = useNavigate();

  const handleLogin = () => {
    if (role === "admin") {
      if (team === admin.username && pass === admin.password) {
        localStorage.setItem("role", "admin");
        navigate("/admin");
      } else {
        alert("Invalid Admin Credentials");
      }
    } else {
      const valid = teams.find(
        (t) => t.name === team && t.password === pass
      );

      if (valid) {
        localStorage.setItem("team", team);
        localStorage.setItem("role", "team");
        navigate("/dashboard");
      } else {
        alert("Invalid Team Credentials");
      }
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="team">Team Member</option>
        <option value="admin">Admin</option>
      </select>

      <input
        type="text"
        placeholder={role === "admin" ? "Admin Username" : "Team Name"}
        onChange={(e) => setTeam(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPass(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}