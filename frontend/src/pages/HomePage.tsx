import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { getEvents } from "../services/event.service";
import type { Event } from "../types/event";

const HomePage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getEvents({
          search,
          category,
          location,
        });

        setEvents(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [search, category, location]);

  return (
    <div style={{ padding: "24px" }}>
      <h1>Event List</h1>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", minWidth: "220px" }}
        />

        <input
          type="text"
          placeholder="Filter category..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "8px", minWidth: "180px" }}
        />

        <input
          type="text"
          placeholder="Filter location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ padding: "8px", minWidth: "180px" }}
        />
      </div>

      {loading && <p>Loading events...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && events.length === 0 && <p>No events available</p>}

      {!loading &&
        !error &&
        events.map((event) => <EventCard key={event.id} event={event} />)}
    </div>
  );
};

export default HomePage;