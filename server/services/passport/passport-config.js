import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { userModal } from "../../models/user-modal.js";
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/user/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email from Google"), null);
        }
        let user = await userModal.findOne({ email });

        // 🆕 Create user if not exists
        if (!user) {
          user = await userModal.create({
            username: email.split("@")[0],
            fullname: profile.displayName,
            email,
            password: null,
            isVerified: true,
            profilePicture: null,
            provider: "google",
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
