import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class AuthService {
 constructor(private prisma: PrismaService) {}

  async guestLogin() {
    const guestNumber = Math.floor(Math.random() * 100000);
    const user = await this.prisma.user.create({
      data: {
        email: `guest${guestNumber}@example.com`,
        fullName: 'Guest User',
        isGuest: true,
      },
    });
    return user;
  }
}
