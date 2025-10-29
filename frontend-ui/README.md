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
- ✅ Personalized recommendations powered by Recombee AI
- ✅ Trending songs feed
- ✅ Similar songs discovery

### Artist Features

- ✅ Upload songs (image + audio via Cloudinary)
- ✅ Create public/private albums
- ✅ Edit songs and albums
- ✅ Delete songs and albums
- ✅ Toggle song/album visibility (public/private)
- ✅ View own songs/albums in dashboard
- ✅ Artist dashboard with statistics
- ✅ Track performance metrics

### Admin Features

- ✅ User management (list, block/unblock, delete, change role)
- ✅ Song management (list all, toggle visible/hidden)
- ✅ Album management (list all, toggle visible/hidden)
- ✅ Admin dashboard with tabs
- ✅ Content moderation tools
- ✅ System analytics

### Audio Player Features

- ✅ Play/Pause
- ✅ Next/Previous
- ✅ Seek bar with time display
- ✅ Volume control
- ✅ Repeat mode
- ✅ Shuffle mode
- ✅ Queue management modal
- ✅ Now playing display
- ✅ Audio Visualization (3 types: Bars, Wave, Circular)
- ✅ Fullscreen Visualizer Mode with dynamic colors
- ✅ Toggle visualizer on/off
- ✅ Real-time frequency analysis
- ✅ Adaptive Streaming - Dynamic quality adjustment (64/128/320 kbps)
- ✅ Auto Quality - Network-based bitrate selection
- ✅ Manual Quality Control - User-selectable bitrates
- ✅ Seamless Quality Switching - No playback interruption
- ✅ Smart Recommendations - AI-powered song suggestions
- ✅ Playback Tracking - Play, complete, skip analytics

### Visualizer Features

- ✅ Dynamic Color Extraction - Colors from album art
- ✅ Spotify-style Gradients - Immersive backgrounds
- ✅ Auto-hide Controls - Clean viewing experience
- ✅ Keyboard Shortcuts - Space (play/pause), ESC (exit)
- ✅ Spinning Vinyl Effect - Animated album art
- ✅ Real-time Audio Bars - Now Playing indicator
- ✅ 3 Visualization Types:
  - Bars: Frequency bars with gradient
  - Wave: Smooth waveform display
  - Circular: 360° radial frequency

## Tech Stack

- Framework: React 18.2 with Vite 5
- Routing: React Router v6.20
- Authentication: Clerk 4.30
- State Management: Zustand 4.4
- Styling: TailwindCSS 3.3
- HTTP Client: Axios 1.6
- Notifications: React Hot Toast 2.4
- Icons: Lucide React 0.294
- Audio: Web Audio API
- Canvas: HTML5 Canvas API

## Project Structure

```
frontend-ui/
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── staticwebapp.config.json
├── tailwind.config.js
├── vite.config.ts
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── components/
    │   ├── admin/
    │   │   ├── AlbumManagement.jsx
    │   │   ├── SongManagement.jsx
    │   │   └── UserManagement.jsx
    │   ├── albums/
    │   │   ├── AlbumCard.jsx
    │   │   ├── AlbumList.jsx
    │   │   ├── CreateAlbumModal.jsx
    │   │   └── EditAlbumModal.jsx
    │   ├── common/
    │   │   ├── Button.jsx
    │   │   ├── EmptyState.jsx
    │   │   ├── ErrorBoundary.jsx
    │   │   ├── Input.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   └── Modal.jsx
    │   ├── layout/
    │   │   ├── AudioPlayer.jsx
    │   │   ├── Navbar.jsx
    │   │   └── Sidebar.jsx
    │   ├── player/
    │   │   ├── AudioVisualizer.jsx
    │   │   ├── QualitySelector.jsx
    │   │   ├── QueueModal.jsx
    │   │   └── VisualizerControls.jsx
    │   ├── songs/
    │   │   ├── AddToPlaylistModal.jsx
    │   │   ├── EditSongModal.jsx
    │   │   ├── SimilarSongs.jsx
    │   │   ├── SongCard.jsx
    │   │   ├── SongList.jsx
    │   │   └── UploadSongModal.jsx
    │   └── user/
    │       └── EditProfileModal.jsx
    ├── contexts/
    │   └── AudioContext.jsx
    ├── hooks/
    │   ├── useAdaptiveStreaming.js
    │   └── useColorExtractor.js
    ├── pages/
    │   ├── AdminDashboard.jsx
    │   ├── AlbumDetailPage.jsx
    │   ├── AlbumsPage.jsx
    │   ├── ArtistDashboard.jsx
    │   ├── ForYouPage.jsx
    │   ├── HomePage.jsx
    │   ├── MyLibraryPage.jsx
    │   ├── ProfilePage.jsx
    │   ├── SearchPage.jsx
    │   ├── SignInPage.jsx
    │   ├── SignUpPage.jsx
    │   ├── SongDetailPage.jsx
    │   ├── SongsPage.jsx
    │   └── VisualizerPage.jsx
    ├── services/
    │   ├── adminService.js
    │   ├── albumService.js
    │   ├── api.js
    │   ├── authService.js
    │   ├── recommendationService.js
    │   └── songService.js
    ├── store/
    │   ├── useAuthStore.js
    │   ├── usePlayerStore.js
    │   └── useSongStore.js
    └── utils/
        ├── constants.js
        └── formatTime.js
```

## Installation

1. Install dependencies:

```bash
cd frontend-ui
npm install
```

2. Configure environment variables:
   Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

3. Start development server:

```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Key Features

### Adaptive Streaming

- Monitors network speed using Network Information API
- Automatically switches between 64/128/320 kbps based on connection
- Manual override available for user preference
- Seamless transitions with preloading to prevent interruptions

Quality Levels:

- Low (64 kbps) - For 2G/slow connections, saves data
- Medium (128 kbps) - For 3G connections, balanced quality
- High (320 kbps) - For 4G+ connections, best quality

### Audio Visualization

- FFT size: 256 for optimal performance
- Real-time frequency data analysis
- 60 FPS canvas rendering
- Three visualization types: Bars, Wave, Circular
- Fullscreen immersive mode with dynamic colors from album art
- Auto-hide controls after 3 seconds of inactivity

### Smart Recommendations

Powered by Recombee AI:

- Personalized "For You" feed based on listening history
- Similar Songs using collaborative filtering
- Trending Songs driven by community
- Interaction Tracking: Play (3+ seconds), Complete (80%+), Skip (<50%)

### Color Extraction

- Extracts dominant color from album art
- Generates vibrant and muted color variations
- Applies to gradients, shadows, buttons, and UI elements
- Smooth color transitions between songs

## State Management

### Auth Store

```javascript
{
  user: User | null,
  isLoading: boolean,
  fetchCurrentUser(),
  registerUser(),
  setUser(),
  isAdmin(),
  isArtist()
}
```

### Player Store

```javascript
{
  currentSong: Song | null,
  isPlaying: boolean,
  queue: Song[],
  volume: number,
  currentTime: number,
  duration: number,
  repeat: boolean,
  shuffle: boolean,
  togglePlay(),
  playNext(),
  playPrevious(),
  setQueue()
}
```

## Styling

TailwindCSS with custom theme colors:

- Primary: `#1DB954` (Spotify green)
- Dark: `#121212`
- Dark Secondary: `#181818`
- Dark Tertiary: `#282828`

## Production Deployment

Build for production:

```bash
npm run build
```

Deploy the `dist/` directory to:

- Azure Static Web Apps (Recommended)
- Vercel
- Netlify
- AWS S3 + CloudFront

### Environment Variables

```env
VITE_API_URL=https://your-api-domain.com/api
VITE_CLERK_PUBLISHABLE_KEY=your_production_clerk_key
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Note: Network Information API not supported in Firefox/Safari (falls back to manual quality).

## License

MIT License
