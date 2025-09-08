import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

interface RequestWithUser extends Request {
    user: { email: string };
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    @ApiBearerAuth()
    @Get('profile')
    @UseGuards(AuthGuard)
    profile(
        @Request()
        req: RequestWithUser,
    ) {
        return req.user;
    }
}
