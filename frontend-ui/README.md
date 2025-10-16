# Frontend Setup - Music Streaming App

## 1. Create React App với Vite

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

## 2. Install Dependencies

```bash
npm install @clerk/clerk-react react-router-dom axios zustand react-hot-toast lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 3. Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── AudioPlayer.jsx
│   │   ├── songs/
│   │   │   ├── SongCard.jsx
│   │   │   ├── SongList.jsx
│   │   │   └── UploadSongModal.jsx
│   │   ├── albums/
│   │   │   ├── AlbumCard.jsx
│   │   │   ├── AlbumList.jsx
│   │   │   └── CreateAlbumModal.jsx
│   │   ├── admin/
│   │   │   ├── UserManagement.jsx
│   │   │   ├── SongManagement.jsx
│   │   │   └── AlbumManagement.jsx
│   │   └── common/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       └── Modal.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── SongsPage.jsx
│   │   ├── AlbumsPage.jsx
│   │   ├── AlbumDetailPage.jsx
│   │   ├── MyLibraryPage.jsx
│   │   ├── ArtistDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── SignInPage.jsx
│   │   └── SignUpPage.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── songService.js
│   │   ├── albumService.js
│   │   └── adminService.js
│   ├── store/
│   │   ├── useAuthStore.js
│   │   ├── usePlayerStore.js
│   │   └── useSongStore.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── usePlayer.js
│   ├── utils/
│   │   ├── formatTime.js
│   │   └── constants.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── tailwind.config.js
└── package.json
```

## 4. Tailwind Config

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DB954',
        dark: '#121212',
        'dark-secondary': '#181818',
        'dark-tertiary': '#282828',
      },
    },
  },
  plugins: [],
}
```

## 5. Environment Variables

```env
# .env
VITE_API_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

## 6. Features Implementation Checklist

### User Features
- [ ] Register/Login với Clerk
- [ ] Browse public songs
- [ ] Browse public albums
- [ ] Play songs với audio player
- [ ] Create private playlists
- [ ] Add/remove songs to playlists

### Artist Features
- [ ] Upload songs (image + audio)
- [ ] Create public/private albums
- [ ] Manage own songs (edit, delete)
- [ ] Toggle song visibility (public/private)
- [ ] Toggle album visibility
- [ ] View own songs/albums dashboard

### Admin Features
- [ ] User management (list, block, delete, change role)
- [ ] Song management (list all, toggle visible/hidden)
- [ ] Album management (list all, toggle visible/hidden)
- [ ] Dashboard với statistics

### Player Features
- [ ] Play/Pause
- [ ] Next/Previous
- [ ] Seek bar
- [ ] Volume control
- [ ] Current playlist queue
- [ ] Repeat/Shuffle

## Implementation Order

1. **Setup & Authentication** (Day 1)
   - Vite + Tailwind setup
   - Clerk integration
   - API services setup
   - Auth store

2. **Layout & Navigation** (Day 1-2)
   - Navbar with user menu
   - Sidebar navigation
   - Protected routes

3. **Songs Features** (Day 2-3)
   - Browse songs page
   - Song card component
   - Upload song (Artist)
   - Audio player component

4. **Albums/Playlists** (Day 3-4)
   - Browse albums
   - Album detail page
   - Create playlist
   - Add songs to album

5. **Artist Dashboard** (Day 4-5)
   - My songs management
   - My albums management
   - Upload interface
   - Edit/Delete functions

6. **Admin Dashboard** (Day 5-6)
   - User management table
   - Song management table
   - Album management table
   - Toggle visibility controls

7. **Audio Player** (Day 6-7)
   - Player UI
   - Playback controls
   - Queue management
   - Progress bar

8. **Polish & Testing** (Day 7)
   - Error handling
   - Loading states
   - Responsive design
   - Bug fixes