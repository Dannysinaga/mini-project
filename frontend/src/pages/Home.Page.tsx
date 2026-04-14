import { useEffect, useState } from "react";
import EventCard from "../components/Event.Card";
import { getEvents } from "../services/event.service";
import type { Event } from "../../types/event";

const HomePage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (events.length === 0) {
    return <p>No events available</p>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1>Event List</h1>

      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default HomePage;