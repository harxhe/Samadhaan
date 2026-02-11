import { useState, useEffect } from "react";
import "./styles.css";

const BACKEND_URL = "http://localhost:5000/api";

function App() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
    const interval = setInterval(fetchComplaints, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/complaints`);
      if (response.ok) {
        const data = await response.json();
        setComplaints(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <header className="header">
        <div className="logo">JanSeva Admin</div>
        <div className="status">Live Dashboard</div>
      </header>

      <section className="dashboard-content">
        <div className="stats-cards">
          <div className="card">
            <h3>Total Complaints</h3>
            <p className="large-number">{complaints.length}</p>
          </div>
          <div className="card">
            <h3>Pending</h3>
            <p className="large-number">{complaints.filter(c => c.status === "Pending").length}</p>
          </div>
        </div>

        <div className="complaints-list">
          <h2>Recent Reports</h2>
          {loading ? (
            <p>Loading...</p>
          ) : complaints.length === 0 ? (
            <div className="empty-state">No complaints yet. Waiting for citizens...</div>
          ) : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Confidence</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint.id}>
                      <td>{new Date(complaint.createdAt).toLocaleTimeString()}</td>
                      <td>
                        <span className={`badge category-${complaint.category.toLowerCase()}`}>
                          {complaint.category}
                        </span>
                      </td>
                      <td>{complaint.text}</td>
                      <td>{(complaint.confidence * 100).toFixed(1)}%</td>
                      <td>
                        <span className={`status-badge status-${complaint.status.toLowerCase()}`}>
                          {complaint.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
