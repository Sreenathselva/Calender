import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import DashboardSidebar from "./DashboardSidebar";

const Dates = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/all-events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
      <Navbar />
      <DashboardSidebar />
      <div style={styles.container}>
        <h2 style={styles.heading}>All Calendar Events</h2>
        {events.length === 0 ? (
          <p style={styles.noData}>No events found.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>Event</th>
                <th style={styles.th}>Type</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td style={styles.td}>{event.date}</td>
                  <td style={styles.td}>{event.time || "-"}</td>
                  <td style={styles.td}>{event.text}</td>
                  <td style={styles.td}>{event.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    marginLeft: "25%",
    padding: "2rem",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
    fontFamily: "Montserrat, sans-serif",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "1rem",
    fontWeight: "bold",
  },
  noData: {
    fontSize: "1.2rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  th: {
    background: "#2563eb",
    color: "#fff",
    padding: "1rem",
    textAlign: "left",
    fontSize: "1rem",
  },
  td: {
    padding: "1rem",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "1rem",
  },
};

export default Dates;