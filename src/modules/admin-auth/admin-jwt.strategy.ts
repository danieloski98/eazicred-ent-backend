import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './schemas/admin.schema';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    const admin = await this.adminModel.findById(payload.sub);
    if (!admin) {
      throw new UnauthorizedException();
    }
    return {
      adminId: payload.sub,
      email: payload.email,
      name: admin.name,
    };
  }
}