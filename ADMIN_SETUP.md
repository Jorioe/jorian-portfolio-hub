# Admin Authentication Setup

This project uses Supabase for admin authentication with a protected dashboard page that's only accessible to authenticated admin users.

## Setup Instructions

1. Create a Supabase account at [https://supabase.com](https://supabase.com) if you don't have one.
2. Create a new Supabase project.
3. In your Supabase dashboard, navigate to Authentication > Settings.
4. Make sure Email auth is enabled.
5. Create a `.env.local` file in the root of your project with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

6. Replace `your_supabase_url` and `your_supabase_anon_key` with your project's URL and anon key from the Supabase dashboard (Project Settings > API).

## Creating an Admin User

1. In your Supabase dashboard, go to Authentication > Users.
2. Click "Add User" or "Invite User".
3. Enter the admin email and password.
4. Once the user is created, they can log in through the `/admin/login` route.

## Accessing Admin Routes

The admin routes in this application are:

- `/admin/login` - Admin login page (accessible to anyone)
- `/admin/dashboard` - Protected admin dashboard (only accessible when logged in)

The admin dashboard is only directly accessible by typing the URL and can't be navigated to from the main site navigation.

## How It Works

1. The app uses a React Context (`AuthContext`) to manage authentication state.
2. Protected routes are wrapped in a `ProtectedRoute` component that redirects to login if not authenticated.
3. Login credentials are verified against Supabase authentication.
4. After successful login, the user is redirected to the admin dashboard.
5. The authentication state persists across page reloads.

## Security Considerations

- The admin dashboard can only be accessed with valid admin credentials.
- Routes are protected on the client-side. For production applications, you should also implement server-side authorization checks.
- Consider implementing role-based access control for more complex admin systems. 