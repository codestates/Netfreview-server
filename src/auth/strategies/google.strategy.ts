import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'https://server.netfreview.com/users/google/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { displayName, emails, photos, id } = profile;
    const userProfile = {
      id: id,
      name: displayName,
      email: emails[0].value,
      profileUrl: photos[0].value,
    };
    const { user, tokens } = await this.authService.validateOAuthLogin(
      userProfile,
      'google',
    );
    return { user, tokens };
  }
}
