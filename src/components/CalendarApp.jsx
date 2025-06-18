import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
// import ErrorBoundary from './ErrorBoundary';





const CalendarApp = ({ role }) => {
 const isAdmin = role === "admin";

 if (isAdmin) {
    // show buttons and call functions like handleEditEvent, etc.
  }

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const currentDate = new Date()

  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [events, setEvents] = useState([])
  const [eventTime, setEventTime] = useState({ hours: '00', minutes: '00' })
  const [eventText, setEventText] = useState('')
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventType, setEventType] = useState("holiday");

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1))
    setCurrentYear((prevYear) => currentMonth === 0 ? prevYear - 1 : prevYear)
  }

  const nextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1))
    setCurrentYear((prevYear) => currentMonth === 11 ? prevYear + 1 : prevYear)
  }

  const handleDayClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day)
    const today = new Date()

    if (clickedDate >= today || isSameDay(clickedDate, today)) {
      setSelectedDate(clickedDate)
      setShowEventPopup(true);
      setEventText("")
      setEventTime({ hours: '00', minutes: '00' })
      setEditingEvent(null)
    }
  }

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

// Fetch events when month/year changes
const fetchEvents = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/events`, {
      params: {
        month: currentMonth,
        year: currentYear
      }
    });
    setEvents(res.data);
  } catch (err) {
    console.error("Failed to fetch events", err);
  }
};

useEffect(() => {
  // const fetchEvents = async () => {
  //   try {
  //     const res = await axios.get(`http://localhost:5000/events`, {
  //       params: {
  //         month: currentMonth,
  //         year: currentYear
  //       }
  //     });
  //     setEvents(res.data);
  //   } catch (err) {
  //     console.error("Failed to fetch events", err);
  //   }
  // };

  fetchEvents();
}, [currentMonth, currentYear]);

const handleEventSubmit = async () => {
  const newEvent = {
    date: selectedDate,
    time: `${eventTime.hours.padStart(2, '0')}:${eventTime.minutes.padStart(2, '0')}`,
    text: eventText,
    type: eventType,
  };

  try {
    if (editingEvent) {
      await axios.put(`http://localhost:5000/events/${editingEvent.id}`, newEvent);
    } else {
      await axios.post("http://localhost:5000/events", newEvent);
    }

    fetchEvents(); // ⬅️ Always refresh after mutation

    setShowEventPopup(false);
    setEditingEvent(null);
    setEventText("");
    setEventTime({ hours: "00", minutes: "00" });
    setEventType("holiday");
  } catch (err) {
    console.error("Error saving event:", err);
  }
};


  const handleEditEvent = (event) => {
    if (!event || !event.time || !event.date) {
      console.error("Invalid event object:", event);
      return;
    }

    setSelectedDate(new Date(event.date));
    setEventTime({
      hours: event.time.split(":")[0],
      minutes: event.time.split(":")[1],
    });
    setEventText(event.text || "");
    setEditingEvent(event);
    setShowEventPopup(true);
  };

const handleDeleteEvent = async (eventId) => {
  try {
    await axios.delete(`http://localhost:5000/events/${eventId}`);
    fetchEvents(); // reload the fresh list from backend
  } catch (err) {
    console.error("Failed to delete event:", err);
  }
};


  return (
    <div className="calendar-app">
      <div className="calendar">
        <h1 className="heading">Traicon Calendar</h1>
        <div className="navigate-date">
          <h2 className="month">{monthOfYear[currentMonth]}</h2>
          <h2 className="year">{currentYear}</h2>
          <div className="buttons">
            <span onClick={prevMonth}>&lt;</span>
            <span onClick={nextMonth}>&gt;</span>
          </div>
        </div>
        <div className="weekdays">
          {daysOfWeek.map((day) => <span key={day}>{day}</span>)}
        </div>
        <div className="days">
          {[...Array(firstDayOfMonth).keys()].map((_, index) => (
            <span key={`empty-${index}`} />
          ))}
          {[...Array(daysInMonth).keys()].map((day) => {
            const thisDate = new Date(currentYear, currentMonth, day + 1);

            // Check if there’s an event on this date
            const eventOnThisDate = events.find(
              (event) =>
                new Date(event.date).getFullYear() === thisDate.getFullYear() &&
                new Date(event.date).getMonth() === thisDate.getMonth() &&
                new Date(event.date).getDate() === thisDate.getDate()
            );
          
            const dateClass = `
              ${day + 1 === currentDate.getDate()
                && currentMonth === currentDate.getMonth()
                && currentYear === currentDate.getFullYear()
                ? 'current-day' : ''}
              ${eventOnThisDate ? `day-${eventOnThisDate.type}` : ''}
            `;
              
            return (
              <span key={day + 1} className={dateClass.trim()} onClick={() => handleDayClick(day + 1)}>
                {day + 1}
              </span>
            );
          })}
        </div>
      </div>
      <div className="events">
        {isAdmin && showEventPopup &&
          <div className="event-popup">
            <div className="time-input">
              <div className="event-popup-time">Time</div>
              <input type="number" name="hours" min={0} max={24} className="hours"
                value={eventTime.hours}
                onChange={(e) =>{
                  let value = parseInt(e.target.value);
                  if (value > 24) value = 24;
                  if(value < 0 || isNaN(value)) value = 0;
                  setEventTime({ ...eventTime, hours: String(value).padStart(2, '0')})
                }} />
              <input type="number" name="minutes" min={0} max={50} className="minutes"
                value={eventTime.minutes}
                onChange={(e) => {
                    let value = parseInt(e.target.value);
                    if (value > 59) value = 59;
                    if (value < 0 || isNaN(value)) value = 0;
                    setEventTime({ ...eventTime, minutes: String(value).padStart(2, '0') });
                  }
                } />
            </div>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="event-type-select">
              <option value="holiday">Holiday</option>
              <option value="event">Event</option>
              <option value="birthday">Birthday</option>
            </select>
            <textarea placeholder="Enter Event Text (Maximum 60 Characters)"
              value={eventText} onChange={(e) => {
                if (e.target.value.length <= 60) {
                  setEventText(e.target.value)
                }
              }}
              name="" id=""></textarea>
            <button className="event-popup-btn" onClick={handleEventSubmit}>
            {editingEvent ? 'Update Event' : "Add Event"}
            </button>
            <button className="close-event-popup" onClick={() => setShowEventPopup(false)}>
              <span>x</span>
            </button>
          </div>}
        {events
          .filter((event) => {
            const dateObj = new Date(event.date);
            return (
              dateObj.getFullYear() === currentYear &&
              dateObj.getMonth() === currentMonth
            );
          })
          .map((event, index) => (
          <div className={`event ${event.type}`} key={index}>
            <div className="event-date-wrapper">
              <div className="event-date">
                {(() => {
                  const dateObj = event.date instanceof Date
                    ? event.date
                    : new Date(event.date);
                
                  return !isNaN(dateObj)
                    ? `${monthOfYear[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`
                    : "Invalid Date";
                })()}
              </div>
              <div className="event-time">{event.time}</div>
            </div>
            <div className="event-text">{event.text}</div>
            <div className="event-buttons">
               {isAdmin && (
                  <>
                    <FontAwesomeIcon className="edit-icon" onClick={() => handleEditEvent(event)} icon={faPenToSquare} />
                    <FontAwesomeIcon className="edit-icon" icon={faTrash} key={event.id}
                    onClick={() => handleDeleteEvent(event.id)} />
                  </>
                )}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default CalendarApp;