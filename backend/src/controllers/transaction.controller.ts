import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { userId, eventId, items } = req.body;

    if (!userId || !eventId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "userId, eventId, and items are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        ticketTypes: true,
      },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    let totalAmount = 0;

    const normalizedItems = items.map((item: { ticketTypeId: string; quantity: number }) => {
      const ticket = event.ticketTypes.find((t) => t.id === item.ticketTypeId);

      if (!ticket) {
        throw new Error(`Ticket type ${item.ticketTypeId} not found in this event`);
      }

      if (item.quantity <= 0) {
        throw new Error(`Quantity for ticket ${ticket.name} must be greater than 0`);
      }

      if (ticket.availableQuota < item.quantity) {
        throw new Error(`Not enough quota for ticket ${ticket.name}`);
      }

      const subtotal = ticket.price * item.quantity;
      totalAmount += subtotal;

      return {
        ticketTypeId: ticket.id,
        quantity: item.quantity,
        price: ticket.price,
        subtotal,
      };
    });

    const paymentDeadlineAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    const transaction = await prisma.$transaction(async (tx) => {
      const createdTransaction = await tx.transaction.create({
        data: {
          userId,
          eventId,
          totalAmount,
          finalAmount: totalAmount,
          status: "WAITING_PAYMENT",
          paymentDeadlineAt,
          items: {
            create: normalizedItems,
          },
        },
        include: {
          items: true,
          event: true,
          user: {
            include: {
              profile: true,
            },
          },
        },
      });

      for (const item of normalizedItems) {
        await tx.ticketType.update({
          where: { id: item.ticketTypeId },
          data: {
            availableQuota: {
              decrement: item.quantity,
            },
          },
        });
      }

      return createdTransaction;
    });

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("CREATE TRANSACTION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getTransactionHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string | undefined;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId query is required",
      });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
      },
      include: {
        event: true,
        items: {
          include: {
            ticketType: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Transaction history fetched successfully",
      data: transactions,
    });
  } catch (error) {
    console.error("GET TRANSACTION HISTORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};