import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import DashboardSidebar from "./DashboardSidebar";
import { height } from "@fortawesome/free-solid-svg-icons/fa0";

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
      <div style={styles.container} className="fade-page dates-cont">
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
                <tr key={event.id} style={styles.tr}>
                  <td style={styles.td}>
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </td>
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
    margin: "12vw 0 0 0",
    padding: "2rem 4rem 0 0",
    backgroundColor: "transparent",
    height: "100vh",
    width: "75%",
    overflowX: "scroll",
    fontFamily: "Montserrat, sans-serif",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "#fff",
    fontWeight: "bold",
  },
  noData: {
    fontSize: "1.2rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "rgb(56, 74, 84)",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  th: {
    background: "#2563eb",
    color: "#fff",
    padding: "1rem",
    textAlign: "left",
    fontSize: "1.4rem",
  },
  tr:{
    height: "2vw",
    color: "#fff"
  },
  td: {
    padding: "2rem",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "1.3rem",
  },
};

export default Dates;