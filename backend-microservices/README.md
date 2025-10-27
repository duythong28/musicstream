# Music Streaming Microservices

Hệ thống streaming nhạc online sử dụng kiến trúc Microservices.

## Kiến trúc

```
                    API Gateway (Port 3000)
                           |
        +------------------+------------------+
        |                  |                  |
   User Service       Song Service      Album Service
    (Port 3001)        (Port 3002)        (Port 3003)
        |                  |                  |
      users_db           songs_db          albums_db
                           |
                      MongoDB (Port 27017)
```

## Services

### 1. User Service (Port 3001)
- Quản lý users, authentication, authorization
- Roles: admin, artist, user
- Database: `users_db`

### 2. Song Service (Port 3002)
- Quản lý songs, upload, visibility
- Database: `songs_db`

### 3. Album Service (Port 3003)
- Quản lý albums/playlists
- Database: `albums_db`

### 4. API Gateway (Port 3000)
- Single entry point cho tất cả requests
- Route requests đến các services tương ứng

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas hoặc Local)
- **Authentication**: Clerk
- **Containerization**: Docker, Docker Compose
- **Storage**: Cloudinary (cho images/audio)

## Cài đặt và Chạy

### Development (Local - không dùng Docker)

1. **Install dependencies cho tất cả services:**
```bash
cd user-service && npm install
cd ../song-service && npm install
cd ../album-service && npm install
cd ../api-gateway && npm install
```

2. **Chạy từng service (mở 4 terminal):**
```bash
# Terminal 1 - User Service
cd user-service && npm run dev

# Terminal 2 - Song Service
cd song-service && npm run dev

# Terminal 3 - Album Service
cd album-service && npm run dev

# Terminal 4 - API Gateway
cd api-gateway && npm run dev
```

3. **Access:**
- API Gateway: http://localhost:3000
- User Service: http://localhost:3001
- Song Service: http://localhost:3002
- Album Service: http://localhost:3003

### Production (Docker)

1. **Build và chạy tất cả services:**
```bash
docker-compose up --build
```

2. **Chạy background:**
```bash
docker-compose up -d
```

3. **Stop services:**
```bash
docker-compose down
```

4. **Xem logs:**
```bash
docker-compose logs -f
```

## API Routes

### Authentication
- `POST /api/auth/register` - Đăng ký user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:id` - Get user by ID

### Admin - Users
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/:id/block` - Block/unblock user
- `DELETE /api/admin/users/:id` - Delete user
- `PATCH /api/admin/users/:id/role` - Change user role

### Songs
- `GET /api/songs` - List all public songs
- `GET /api/songs/:id` - Get song by ID
- `POST /api/songs/batch` - Get multiple songs
- `POST /api/songs` - Upload song (Artist)
- `PATCH /api/songs/:id` - Update song (Artist)
- `DELETE /api/songs/:id` - Delete song (Artist)
- `PATCH /api/songs/:id/visibility` - Toggle public/private (Artist)
- `GET /api/songs/artist/my-songs` - Get artist's songs

### Admin - Songs
- `GET /api/admin/songs` - Get all songs
- `PATCH /api/admin/songs/:id/visible` - Toggle visible/hidden

### Albums
- `GET /api/albums` - List all public albums
- `GET /api/albums/:id` - Get album with songs
- `POST /api/albums` - Create album/playlist
- `PATCH /api/albums/:id` - Update album
- `DELETE /api/albums/:id` - Delete album
- `POST /api/albums/:id/songs` - Add song to album
- `DELETE /api/albums/:id/songs/:songId` - Remove song
- `PATCH /api/albums/:id/visibility` - Toggle public/private (Artist)
- `GET /api/albums/user/my-albums` - Get user's albums

### Admin - Albums
- `GET /api/admin/albums` - Get all albums
- `PATCH /api/admin/albums/:id/visible` - Toggle visible/hidden

## Database Schema

### Users Collection (users_db)
```javascript
{
  clerkId: String,
  fullName: String,
  email: String,
  imageUrl: String,
  role: "admin" | "artist" | "user",
  isBlocked: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Songs Collection (songs_db)
```javascript
{
  title: String,
  artistId: String,
  artistName: String,
  imageUrl: String,
  audioUrl: String,
  duration: Number,
  albumId: String,
  isPublic: Boolean,    // Artist control
  isVisible: Boolean,   // Admin control
  createdAt: Date,
  updatedAt: Date
}
```

### Albums Collection (albums_db)
```javascript
{
  title: String,
  creatorId: String,
  creatorName: String,
  imageUrl: String,
  songIds: [String],
  isPublic: Boolean,    // Artist: can toggle, User: always false
  isVisible: Boolean,   // Admin control
  createdAt: Date,
  updatedAt: Date
}
```

## Business Logic

### Roles & Permissions

**Admin:**
- Quản lý tất cả users (block, delete, change role)
- Quản lý visibility của songs và albums
- Xem tất cả content

**Artist:**
- Upload songs
- Tạo public/private albums
- Toggle visibility của songs/albums của mình
- Xem tất cả songs/albums của mình

**User:**
- Tạo private playlists
- Phát nhạc public
- Chỉ xem được nội dung public và visible

### Song Visibility Rules
- User chỉ nghe được: `isPublic=true AND isVisible=true`
- Artist thấy tất cả bài của mình
- Admin thấy tất cả

### Album/Playlist Rules
- User playlists: luôn `isPublic=false`
- Artist albums: có thể `isPublic=true/false`
- Khi get album: filter songs theo visibility rules

## Environment Variables

Mỗi service cần các env variables sau:

### User Service
```
PORT=3001
MONGODB_URI=mongodb+srv://...
CLERK_SECRET_KEY=sk_test_...
```

### Song Service
```
PORT=3002
MONGODB_URI=mongodb+srv://...
CLERK_SECRET_KEY=sk_test_...
USER_SERVICE_URL=http://localhost:3001
ALBUM_SERVICE_URL=http://localhost:3003
```

### Album Service
```
PORT=3003
MONGODB_URI=mongodb+srv://...
CLERK_SECRET_KEY=sk_test_...
USER_SERVICE_URL=http://localhost:3001
SONG_SERVICE_URL=http://localhost:3002
```

### API Gateway
```
PORT=3000
CLERK_SECRET_KEY=sk_test_...
USER_SERVICE_URL=http://localhost:3001
SONG_SERVICE_URL=http://localhost:3002
ALBUM_SERVICE_URL=http://localhost:3003
```

## Health Checks

- Gateway: `GET /health`
- Services health: `GET /health/services`
- Individual services: `GET http://localhost:{port}/health`

## Troubleshooting

### Service không kết nối được với nhau
- Check service URLs trong .env
- Verify services đang chạy: `docker-compose ps`
- Check logs: `docker-compose logs [service-name]`

### MongoDB connection error
- Verify MONGODB_URI đúng
- Check MongoDB Atlas whitelist IP (0.0.0.0/0 cho development)

### Clerk authentication error
- Verify CLERK_SECRET_KEY đúng
- Check Clerk dashboard settings

## Development Tips

1. **Chạy local development:** Dùng `npm run dev` cho mỗi service
2. **Test API:** Dùng Postman hoặc Thunder Client
3. **Monitor logs:** Terminal riêng cho mỗi service
4. **Database:** Dùng MongoDB Compass để xem data

## Project Structure
```
backend-microservices/
├── user-service/
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   └── Dockerfile
├── song-service/
├── album-service/
├── api-gateway/
├── shared/
│   └── utils/
├── k8s/
│   ├── secrets.yaml
│   ├── user-service-deployment.yaml
│   ├── song-service-deployment.yaml
│   ├── album-service-deployment.yaml
│   ├── api-gateway-deployment.yaml
├── docker-compose.yml
└── README.md
```
