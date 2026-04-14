import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventDetail } from "../services/event.service";
import type { Event } from "../../types/event";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchEventDetail = async () => {
      if (!id) {
        setError("Event id not found");
        setLoading(false);
        return;
      }

      try {
        const data = await getEventDetail(id);
        setEvent(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch event detail");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id]);

  if (loading) {
    return <p>Loading event detail...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!event) {
    return <p>Event not found</p>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1>{event.name}</h1>

      <img
        src={event.bannerUrl || "https://via.placeholder.com/500x300?text=No+Image"}
        alt={event.name}
        style={{ width: "100%", maxWidth: "500px", borderRadius: "8px" }}
      />

      <p>{event.description}</p>
      <p>Category: {event.category}</p>
      <p>Location: {event.location}</p>
      <p>Start: {new Date(event.startDate).toLocaleString()}</p>
      <p>End: {new Date(event.endDate).toLocaleString()}</p>

      <h2>Tickets</h2>
      {event.ticketTypes.length === 0 ? (
        <p>No ticket types available</p>
      ) : (
        event.ticketTypes.map((ticket) => (
          <div
            key={ticket.id}
            style={{
              border: "1px solid #ddd",
              marginBottom: "12px",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <p>Name: {ticket.name}</p>
            <p>Price: IDR {ticket.price.toLocaleString()}</p>
            <p>Available: {ticket.availableQuota}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default EventDetailPage;