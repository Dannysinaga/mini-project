import { Link } from "react-router-dom";
import type { Event } from "../types/event";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const imageUrl =
    event.bannerUrl || "https://via.placeholder.com/400x250?text=No+Image";

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      <img
        src={imageUrl}
        alt={event.name}
        style={{ width: "100%", maxWidth: "400px", borderRadius: "8px" }}
      />

      <h3>{event.name}</h3>
      <p>{event.category}</p>
      <p>{event.location}</p>
      <p>
        {new Date(event.startDate).toLocaleString()} -{" "}
        {new Date(event.endDate).toLocaleString()}
      </p>

      <Link to={`/events/${event.id}`}>
        <button>See Detail</button>
      </Link>
    </div>
  );
};

export default EventCard;