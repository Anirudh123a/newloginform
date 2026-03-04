import { useState } from "react";

export default function Dashboard() {
  const team = localStorage.getItem("team");

  const [repo, setRepo] = useState("");
  const [deploy, setDeploy] = useState("");
  const [ppt, setPpt] = useState(null);

  const [staffFeedback, setStaffFeedback] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(false);

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
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        const text = await response.text();
        const result = JSON.parse(text);

        if (result.result === "success") {
          alert("PPT Uploaded Successfully!");
          setRepo("");
          setDeploy("");
          setPpt(null);
        } else {
          alert("Upload Failed: " + result.message);
        }

      } catch (error) {
        console.error("Frontend Error:", error);
        alert("Upload Failed! Backend not running?");
      }
    };
  };

  const fetchStaffFeedback = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzO0Hz6Nfa3DY6_OEE0EF1s0QwY0KJOcsIfmnKtxbQ6PHiahIALBDCMUaRW8CALzOMcjA/exec"
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

      {/* 🔵 Student Feedback Redirect Button */}
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSfEkTGtQjAhZ_f3E5_bQQEvGWhguJ3jmWNYGRl3SRpdWVSzWw/viewform"
        target="_blank"
        rel="noreferrer"
      >
        <button style={{ background: "green", color: "white" }}>
          Fill Student Feedback
        </button>
      </a>

      <br /><br />

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

      <button
        onClick={fetchStaffFeedback}
        style={{ background: "blue", color: "white" }}
      >
        Get Staff Feedback
      </button>

      {loading && <p>Loading feedback...</p>}

      {showFeedback && !loading && (
        <>
          <h3>Staff Feedback</h3>

          {staffFeedback.length === 0 ? (
            <p>No feedback available yet.</p>
          ) : (
            staffFeedback.map((item, index) => (
              <div key={index}>
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