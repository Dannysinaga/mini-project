import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const {
      organizerId,
      name,
      description,
      category,
      location,
      startDate,
      endDate,
      bannerUrl,
      ticketTypes,
    } = req.body;

    if (
      !organizerId ||
      !name ||
      !category ||
      !location ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "organizerId, name, category, location, startDate, and endDate are required",
      });
    }

    const organizer = await prisma.user.findUnique({
      where: { id: organizerId },
    });

    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: "Organizer not found",
      });
    }

    if (organizer.role !== "ORGANIZER") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not an organizer",
      });
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (parsedEndDate <= parsedStartDate) {
      return res.status(400).json({
        success: false,
        message: "endDate must be later than startDate",
      });
    }

    const event = await prisma.event.create({
      data: {
        organizerId,
        name,
        description,
        category,
        location,
        bannerUrl,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        status: "PUBLISHED",
        ticketTypes: {
          create:
            Array.isArray(ticketTypes) && ticketTypes.length > 0
              ? ticketTypes.map((ticket: any) => ({
                  name: ticket.name,
                  price: Number(ticket.price),
                  quota: Number(ticket.quota),
                  availableQuota: Number(ticket.quota),
                }))
              : [],
        },
      },
      include: {
        ticketTypes: true,
        organizer: {
          include: {
            profile: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getEvents = async (_req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        ticketTypes: true,
        organizer: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      data: events,
    });
  } catch (error) {
    console.error("GET EVENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getEventDetail = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Event id is required",
      });
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        ticketTypes: true,
        organizer: {
          include: {
            profile: true,
          },
        },
        reviews: true,
      },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event detail fetched successfully",
      data: event,
    });
  } catch (error) {
    console.error("GET EVENT DETAIL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};