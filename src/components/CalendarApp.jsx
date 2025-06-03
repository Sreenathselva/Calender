import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

const CalendarApp = () => {

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
  const [events,setEvents] = useState([])
  const [eventTime, setEventTime] = useState({hours: '00', minutes: '00'})
  const [eventText, setEventText] = useState('')
  const [editingEvent, setEditingEvent] = useState(null);

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

    if(clickedDate >= today || isSameDay(clickedDate, today)){
      setSelectedDate(clickedDate)
      setShowEventPopup(true);
      setEventText("")
      setEventTime({hours: '00', minutes: '00'})
      setEditingEvent(null)
    }
  }

  const isSameDay = (date1, date2) => {
    return(
      date1.getFullYear() === date2.getFullYear() || date1.getFullYear() < date1.getFullYear() && 
      date1.getMonth() === date2.getMonth() || date1.getMonth() < date1.getMonth() && 
      date1.getDate() === date2.getDate() || date1.getDate() < date1.getDate()
    )
  }

  const handleEventSubmit = () => {
    const newEvent = {
      id: editingEvent ? editingEvent.id : Date.now(),
      date: selectedDate,
     time: `${eventTime.hours.padStart(2, '0')}:${eventTime.minutes.padStart(2, '0')}`,
      text: eventText,
    }

    let updatedEvents= [...events]

    if(editingEvent){
      updatedEvents = udpatedEvents.map((events) => event.id === editingEvent.id ? newEvent : event,
    )} else{
      updatedEvents.push(newEvent)
    }

    updatedEvents.sort((a, b)=> new Date(a.date - new Date(b.date)))

    setEvents([...events,newEvent])
    setEventTime({hours: '00', minutes: '00'})
    setEventText("")
    setShowEventPopup(false)
    setEditingEvent(null);
  } 

  const handleEditEvent = (event) => {
    setSelectedDate[new Date(event.date)]
    setEventTime({
      hours: event.time.split(":")[0],
      minutes: event.time.split(":")[1]
    })
    setEventText(event,text)
    setEditingEvent(event)
    setShowEventPopup(true)
  }


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
          {[...Array(daysInMonth).keys()].map((day) =>
            <span key={day + 1} className={
              day + 1 === currentDate.getDate() 
              && currentMonth === currentDate.getMonth() 
              && currentYear === currentDate.getFullYear() 
              ? 'current-day' : '' }
              onClick={()=> handleDayClick(day + 1)}
              >{day + 1}</span>
          )}
        </div>
      </div>
      <div className="events">
        {showEventPopup && 
        <div className="event-popup">
          <div className="time-input">
            <div className="event-popup-time">Time</div>
            <input type="number" name="hours" min={0} max={24} className="hours" 
            value={eventTime.hours} 
            onChange={(e) =>
              setEventTime({...eventTime, hours: e.target.value })
            } />
            <input type="number" name="minutes" min={0} max={60} className="minutes"  
            value={eventTime.minutes} 
            onChange={(e) =>
              setEventTime({...eventTime, minutes: e.target.value })
            }/>
          </div>
          <textarea placeholder="Enter Event Text (Maximum 60 Characters)"
          value={eventText} onChange={(e) => {
            if(e.target.value.length <= 60){
              setEventText(e.target.value)
            }
          }}
           name="" id=""></textarea>
          <button className="event-popup-btn" onClick={handleEventSubmit}>Add Event</button>
          <button className="close-event-popup" onClick={()=> setShowEventPopup(false)}>
            <span>x</span>
          </button>
        </div>}
        {events.map((event,  index) => (
          
        <div className="event" key={index}>
          <div className="event-date-wrapper">
            <div className="event-date">{`${monthOfYear[event.date.getMonth()]} ${event.date.getFullYear()}`}</div>
            <div className="event-time">{event.time}</div>
          </div>
          <div className="event-text">{event.text}</div>
          <div className="event-buttons">
            <FontAwesomeIcon className="edit-icon" icon={faPenToSquare} />
            
          </div>
        </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarApp;