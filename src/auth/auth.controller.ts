import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

interface RequestWithUser extends Request {
    user: { email: string; role: string };
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
    ) {
        return this.authService.login(email, password);
    }

    @Get('profile')
    @UseGuards(AuthGuard)
    profile(
        @Request()
        req: RequestWithUser,
    ) {
        return req.user;
    }
}
