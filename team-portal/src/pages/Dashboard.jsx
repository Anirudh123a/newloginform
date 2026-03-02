import { useState } from "react";

export default function Dashboard() {
  const team = localStorage.getItem("team");

  const [repo, setRepo] = useState("");
  const [deploy, setDeploy] = useState("");
  const [ppt, setPpt] = useState(null);

  const [staffFeedback, setStaffFeedback] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(false);

  // ===============================
  // 🔹 Upload PPT to Drive
  // ===============================
  const handleSubmit = async () => {
    if (!repo || !ppt) {
      alert("Repo link and PPT required");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(ppt);

    reader.onload = async () => {
      const base64File = reader.result.split(",")[1];

      const data = {
        teamName: team,
        repoLink: repo,
        deployLink: deploy || "Not Provided",
        fileName: ppt.name,
        fileType: ppt.type,
        fileData: base64File
      };

      try {
        await fetch(
          "https://script.google.com/macros/s/AKfycbzO0Hz6Nfa3DY6_OEE0EF1s0QwY0KJOcsIfmnKtxbQ6PHiahIALBDCMUaRW8CALzOMcjA/exec",
          {
            method: "POST",
            body: JSON.stringify(data)
          }
        );

        alert("PPT Uploaded Successfully!");
        setRepo("");
        setDeploy("");
        setPpt(null);
      } catch (error) {
        console.error(error);
        alert("Upload Failed!");
      }
    };
  };

  // ===============================
  // 🔹 Fetch Staff Feedback (Apps Script)
  // ===============================
  const fetchStaffFeedback = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxNvFIVRS51JeLVkF89q3GrsvorOmSlM4JoQ1yUyU-r9op04t18r5k1Hp--qkmhI66C/exec"
      );

      const data = await response.json();

      const filtered = data.filter(
        (item) =>
          item["Team Names"] &&
          item["Team Names"].toLowerCase() === team?.toLowerCase()
      );

      setStaffFeedback(filtered);
      setShowFeedback(true);

    } catch (error) {
      console.error(error);
      alert("Error fetching feedback");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h2>Welcome {team}</h2>

      {/* 🎓 Student Feedback Form */}
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSfEkTGtQjAhZ_f3E5_bQQEvGWhguJ3jmWNYGRl3SRpdWVSzWw/viewform"
        target="_blank"
        rel="noreferrer"
        className="link-btn"
      >
        Fill Student Feedback
      </a>

      <br /><br />

      {/* 📂 Project Submission */}
      <input
        type="text"
        placeholder="Git Repo Link"
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
      />

      <input
        type="text"
        placeholder="Git Deployment Link (Optional)"
        value={deploy}
        onChange={(e) => setDeploy(e.target.value)}
      />

      <input
        type="file"
        accept=".ppt,.pptx"
        onChange={(e) => setPpt(e.target.files[0])}
      />

      <button onClick={handleSubmit}>Submit Project</button>

      <br /><br />

      {/* 🔵 Get Feedback */}
      <button
        onClick={fetchStaffFeedback}
        style={{ background: "blue", color: "white" }}
      >
        Get Feedback
      </button>

      {loading && <p>Loading feedback...</p>}

      {showFeedback && !loading && (
        <>
          <h3>Staff Feedback</h3>

          {staffFeedback.length === 0 ? (
            <p>No feedback available yet.</p>
          ) : (
            staffFeedback.map((item, index) => (
              <div key={index} className="feedback-box">
                <p><strong>Marks:</strong> {item.Marks}</p>
                <p><strong>Comments:</strong> {item.Comments}</p>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}