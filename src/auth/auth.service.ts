
import * as bcryptjs from "bcryptjs";
import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await bcryptjs.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async onModuleInit() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || 'admin@example.com';
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD') || 'adminpassword';

    const user = await this.usersService.findOneByEmail(adminEmail);

    if (!user) {
      const hashedPassword = await bcryptjs.hash(adminPassword, 10);
      try {
        await this.usersService.create({
          email: adminEmail,
          password: hashedPassword,
          name: 'Admin',
        });
        console.log('Admin user created successfully.');
      } catch (error) {
        console.error('Error creating admin user:', error.message);
      }
    }
  }
}