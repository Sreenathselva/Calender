import CalendarApp from "./components/CalendarApp";
import "./components/CalendarApp.css";
import ErrorBoundary from './components/ErrorBoundary';


const App = () => {
  return (
    <div className="container">
     <ErrorBoundary>
      <CalendarApp />
    </ErrorBoundary>
    </div>
  );
};

export default App;