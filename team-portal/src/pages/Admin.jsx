import { useState } from "react";

const teams = ["csk", "mi", "rcb"];

export default function Admin() {
  const [selectedTeam, setSelectedTeam] = useState("");

  const handleGiveFeedback = () => {
    if (!selectedTeam) {
      alert("Please select a team first");
      return;
    }

    // Redirect to Staff Feedback Form
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSdMLWYWUxD-Upx_EnXZca_2Fl0kWE80tWvdzLiZ63S6OeXJuw/viewform",
      "_blank"
    );
  };

  return (
    <div className="container">
      <h2>Admin Panel</h2>

      <label>Select Team</label>
      <select
        value={selectedTeam}
        onChange={(e) => setSelectedTeam(e.target.value)}
      >
        <option value="">-- Select Team --</option>
        {teams.map((team) => (
          <option key={team} value={team}>
            {team}
          </option>
        ))}
      </select>

      <br /><br />

      <button
        onClick={handleGiveFeedback}
        style={{ background: "green", color: "white" }}
      >
        Give Feedback
      </button>
    </div>
  );
}