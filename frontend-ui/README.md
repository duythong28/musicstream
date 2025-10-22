# MusicStream Frontend

React-based frontend for the MusicStream cloud-native music streaming application.

## Features Implemented

### User Features

- ✅ Authentication with Clerk (Sign In/Sign Up)
- ✅ Browse public songs and albums
- ✅ Search songs and albums
- ✅ Play songs with audio player
- ✅ Create private playlists
- ✅ Add/remove songs to/from playlists
- ✅ View and edit profile
- ✅ Queue management

### Artist Features

- ✅ Upload songs (image + audio via Cloudinary)
- ✅ Create public/private albums
- ✅ Edit songs and albums
- ✅ Delete songs and albums
- ✅ Toggle song/album visibility (public/private)
- ✅ View own songs/albums in dashboard
- ✅ Artist dashboard with statistics

### Admin Features

- ✅ User management (list, block/unblock, delete, change role)
- ✅ Song management (list all, toggle visible/hidden)
- ✅ Album management (list all, toggle visible/hidden)
- ✅ Admin dashboard with tabs

### Audio Player Features

- ✅ Play/Pause
- ✅ Next/Previous
- ✅ Seek bar with time display
- ✅ Volume control
- ✅ Repeat mode
- ✅ Shuffle mode
- ✅ Queue management modal
- ✅ Now playing display
- ✅ **Audio Visualization** (3 types: Bars, Wave, Circular)
- ✅ **Fullscreen Visualizer Mode**
- ✅ Toggle visualizer on/off
- ✅ Real-time frequency analysis

## Tech Stack

- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Authentication**: Clerk
- **State Management**: Zustand
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/         # Reusable components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── layout/         # Layout components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── AudioPlayer.jsx
│   │   ├── songs/          # Song components
│   │   │   ├── SongCard.jsx
│   │   │   ├── SongList.jsx
│   │   │   ├── UploadSongModal.jsx
│   │   │   ├── EditSongModal.jsx
│   │   │   └── AddToPlaylistModal.jsx
│   │   ├── albums/         # Album components
│   │   │   ├── AlbumCard.jsx
│   │   │   ├── AlbumList.jsx
│   │   │   ├── CreateAlbumModal.jsx
│   │   │   └── EditAlbumModal.jsx
│   │   ├── admin/          # Admin components
│   │   │   ├── UserManagement.jsx
│   │   │   ├── SongManagement.jsx
│   │   │   └── AlbumManagement.jsx
│   │   ├── player/         # Player components
│   │   │   ├── QueueModal.jsx
│   │   │   ├── AudioVisualizer.jsx
│   │   │   └── VisualizerControls.jsx
│   │   └── user/           # User components
│   │       └── EditProfileModal.jsx
│   ├── pages/              # Page components
│   │   ├── HomePage.jsx
│   │   ├── SongsPage.jsx
│   │   ├── AlbumsPage.jsx
│   │   ├── AlbumDetailPage.jsx
│   │   ├── MyLibraryPage.jsx
│   │   ├── ArtistDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── SearchPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── VisualizerPage.jsx
│   │   ├── SignInPage.jsx
│   │   └── SignUpPage.jsx
│   ├── services/           # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── songService.js
│   │   ├── albumService.js
│   │   └── adminService.js
│   ├── store/              # Zustand stores
│   │   ├── useAuthStore.js
│   │   ├── usePlayerStore.js
│   │   └── useSongStore.js
│   ├── utils/              # Utility functions
│   │   ├── constants.js
│   │   └── formatTime.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Installation

1. **Install dependencies**:

```bash
cd frontend
npm install
```

2. **Configure environment variables**:
   Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

3. **Start development server**:

```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Integration

The frontend connects to the backend API Gateway at `http://localhost:3000/api`.

### API Endpoints Used

**Authentication**:

- `POST /auth/register` - Register new user
- `GET /auth/me` - Get current user

**Songs**:

- `GET /songs` - Get all public songs
- `GET /songs/:id` - Get song by ID
- `POST /songs` - Upload song (Artist)
- `PATCH /songs/:id` - Update song (Artist)
- `DELETE /songs/:id` - Delete song (Artist)
- `PATCH /songs/:id/visibility` - Toggle visibility (Artist)

**Albums**:

- `GET /albums` - Get all public albums
- `GET /albums/:id` - Get album details with songs
- `POST /albums` - Create album/playlist
- `PATCH /albums/:id` - Update album
- `DELETE /albums/:id` - Delete album
- `POST /albums/:id/songs` - Add song to album
- `DELETE /albums/:id/songs/:songId` - Remove song from album

**Admin**:

- `GET /admin/users` - Get all users
- `PATCH /admin/users/:id/block` - Block/unblock user
- `DELETE /admin/users/:id` - Delete user
- `PATCH /admin/users/:id/role` - Change user role
- `GET /admin/songs` - Get all songs
- `PATCH /admin/songs/:id/visible` - Toggle song visibility
- `GET /admin/albums` - Get all albums
- `PATCH /admin/albums/:id/visible` - Toggle album visibility

## Authentication Flow

1. User signs in/up via Clerk
2. Clerk provides authentication token
3. Token is stored in `window.__clerk_token`
4. Token is automatically added to all API requests via Axios interceptor
5. Backend validates token and returns user data
6. If user doesn't exist in database, automatically register via `/auth/register`

## State Management

### Auth Store (useAuthStore)

- Current user data
- User registration
- Role checking (isAdmin, isArtist)

### Player Store (usePlayerStore)

- Current song
- Play/pause state
- Queue management
- Volume control
- Shuffle/repeat modes

### Song Store (useSongStore)

- Songs list
- Loading state
- CRUD operations

## Styling

- **TailwindCSS** for utility-first styling
- **Custom theme colors**:
  - Primary: `#1DB954` (Spotify green)
  - Dark: `#121212`
  - Dark Secondary: `#181818`
  - Dark Tertiary: `#282828`

## File Upload

Songs and albums use `multipart/form-data` for uploading files:

- Images: Album covers and song covers
- Audio: MP3/audio files

Files are processed by backend and uploaded to Cloudinary.

## Error Handling

- Global error boundary catches React errors
- API errors shown via toast notifications
- Loading states for all async operations
- Empty states for no data scenarios

## Development Tips

1. **Hot Reload**: Vite provides fast HMR
2. **Testing**: Use React DevTools and Zustand DevTools
3. **API Testing**: Backend must be running on port 3000
4. **Clerk Setup**: Configure Clerk dashboard with correct redirect URLs

## Production Build

```bash
npm run build
```

Output will be in `dist/` directory. Deploy to:

- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

## Environment Variables for Production

```env
VITE_API_URL=https://your-api-domain.com/api
VITE_CLERK_PUBLISHABLE_KEY=your_production_clerk_key
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Limitations

- Audio files must be hosted on Cloudinary (no streaming from local)
- Queue persistence not implemented (resets on page refresh)
- No offline mode
- No PWA support yet
