import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateReferralCode } from '../utils/referral';
import { prisma } from '../lib/prisma';

import { ERROR_MESSAGES, JWT_CONFIG } from '../constants/constants';
import { RegisterDTOType } from '../dtos/auth/register.dto';
import { LoginDTOType } from '../dtos/auth/login.dto';

export class AuthService {
  async register(data: RegisterDTOType) {
    const { email, password, fullname, phone, referralCode } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error(ERROR_MESSAGES.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userReferralCode = generateReferralCode(fullname || 'USER');

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        referralCode: userReferralCode,
        profile: {
          create: {
            fullName: fullname || null,
            phone: phone || null
          }
        }
      },
      include: {
        profile: true
      }
    });

    if (referralCode) {
      await this.handleReferral(referralCode, user.id);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: JWT_CONFIG.EXPIRES_IN }
    );

    return { token, user };
  }

  async login(data: LoginDTOType) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: JWT_CONFIG.EXPIRES_IN }
    );

    return { token, user };
  }

  private async handleReferral(referralCode: string, newUserId: string) {
    const referrer = await prisma.user.findUnique({
      where: { referralCode }
    });

    if (!referrer) return;

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: referrer.id },
        data: { points: { increment: 10000 } }
      });

      const validUntil = new Date();
      validUntil.setMonth(validUntil.getMonth() + 3);

      const coupon = await tx.coupon.create({
        data: {
          code: `WELCOME${Date.now()}`,
          discountAmount: 20000,
          validUntil,
          userId: newUserId
        }
      });

      await tx.referralUsage.create({
        data: {
          referrerId: referrer.id,
          referredUserId: newUserId,
          couponId: coupon.id
        }
      });

      await tx.pointsHistory.create({
        data: {
          userId: referrer.id,
          amount: 10000,
          type: 'CREDIT',
          source: 'REFERRAL_REWARD',
          referenceType: 'REFERRAL_USAGE',
          referenceId: coupon.id,
          expiresAt: validUntil
        }
      });
    });
  }
}
