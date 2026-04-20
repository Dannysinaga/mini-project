import { prisma } from "../lib/prisma";

export class PointsService {
  async getPointsBalance(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        points: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}