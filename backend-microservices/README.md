# Music Streaming Microservices - Backend Documentation

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway (Port 3000)                  │
│                  • Request Routing & Proxying                │
│                  • Health Check Aggregation                  │
└──────┬──────────────────┬──────────────────┬────────────────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ User Service │  │ Song Service │  │Album Service │
│  Port 3001   │  │  Port 3002   │  │  Port 3003   │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
┌──────────────┐                  ┌──────────────┐
│ MongoDB Atlas│                  │ Redis Cloud  │
│              │                  │              │
│ • users_db   │                  │ • Caching    │
│ • songs_db   │                  │ • TTL 5-10m  │
│ • albums_db  │                  │              │
└──────────────┘                  └──────────────┘

External Services:
• Clerk (Authentication)
• Cloudinary (Media Storage & Transcoding)
• Recombee (Recommendation Engine)
```

## 📊 Database Schemas

### User Schema (users_db)
```javascript
{
  clerkId: String (unique, required),
  fullName: String (required),
  email: String (unique, required),
  imageUrl: String (required),
  role: String (enum: ["admin", "artist", "user"], default: "user"),
  isBlocked: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Song Schema (songs_db)
```javascript
{
  title: String (required),
  artistId: String (required),
  artistName: String (required),
  imageUrl: String (required),
  audioUrl: String (required),
  duration: Number (required),
  albumId: String (nullable),
  isPublic: Boolean (default: true),
  isVisible: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Album Schema (albums_db)
```javascript
{
  title: String (required),
  creatorId: String (required),
  creatorName: String (required),
  imageUrl: String (required),
  songIds: [String] (default: []),
  isPublic: Boolean (required),
  isVisible: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### User Service (Port 3001)

#### Authentication
- `POST /auth/register` - Register new user
- `GET /auth/me` - Get current user (requires auth)

#### Users
- `GET /users/:id` - Get user by ID

#### Admin
- `GET /admin/users` - List all users (admin only)
- `PATCH /admin/users/:id/block` - Block/unblock user (admin only)
- `DELETE /admin/users/:id` - Delete user (admin only)
- `PATCH /admin/users/:id/role` - Change user role (admin only)

### Song Service (Port 3002)

#### Public
- `GET /songs` - List all public visible songs
- `GET /songs/trending` - Get trending songs
- `GET /songs/:id` - Get song by ID
- `GET /songs/:id/similar` - Get similar songs (Recombee)
- `POST /songs/batch` - Get songs by IDs array

#### Authenticated
- `POST /songs/:id/track/play` - Track song play
- `POST /songs/:id/track/complete` - Track song completion
- `POST /songs/:id/track/skip` - Track song skip
- `GET /songs/recommendations/for-you` - Get personalized recommendations

#### Artist
- `POST /songs` - Upload song (multipart/form-data)
- `PATCH /songs/:id` - Update song
- `DELETE /songs/:id` - Delete song
- `PATCH /songs/:id/visibility` - Toggle isPublic
- `GET /songs/artist/my-songs` - Get artist's songs

#### Admin
- `GET /admin/songs` - List all songs including hidden
- `PATCH /admin/songs/:id/visible` - Toggle isVisible

### Album Service (Port 3003)

#### Public
- `GET /albums` - List all public visible albums
- `GET /albums/:id` - Get album by ID with songs

#### Authenticated
- `POST /albums` - Create album/playlist (multipart/form-data)
- `PATCH /albums/:id` - Update album
- `DELETE /albums/:id` - Delete album
- `POST /albums/:id/songs` - Add song to album
- `DELETE /albums/:id/songs/:songId` - Remove song from album
- `GET /albums/user/my-albums` - Get user's albums

#### Artist
- `PATCH /albums/:id/visibility` - Toggle isPublic (artist only)

#### Admin
- `GET /admin/albums` - List all albums including hidden
- `PATCH /admin/albums/:id/visible` - Toggle isVisible

### API Gateway (Port 3000)

#### Health Checks
- `GET /health` - Gateway health status
- `GET /health/services` - All services health status

#### Routing
- `/api/auth/*` → User Service `/auth/*`
- `/api/users/*` → User Service `/users/*`
- `/api/admin/users/*` → User Service `/admin/users/*`
- `/api/songs/*` → Song Service `/songs/*`
- `/api/admin/songs/*` → Song Service `/admin/songs/*`
- `/api/albums/*` → Album Service `/albums/*`
- `/api/admin/albums/*` → Album Service `/admin/albums/*`

## 🎯 Core Features

### 1. Redis Caching
**Cache Keys:**
- `songs:all:public` - All public songs (TTL: 5 min)
- `song:{id}` - Individual song (TTL: 10 min)
- `artist:{id}:songs` - Artist's songs (TTL: 5 min)
- `albums:all:public` - All public albums (TTL: 5 min)
- `album:{id}` - Individual album (TTL: 10 min)
- `user:{id}:albums` - User's albums (TTL: 5 min)
- `recommendations:user:{id}` - User recommendations (TTL: 10 min)
- `recommendations:similar:{id}` - Similar songs (TTL: 10 min)
- `recommendations:trending` - Trending songs (TTL: 5 min)

**Cache Invalidation:**
- Pattern-based: `songs:*`, `albums:*`, `recommendations:*`
- Automatic on CREATE, UPDATE, DELETE operations

### 2. Cloudinary Adaptive Streaming
**Bitrate Options:**
- Low: 64 kbps (mobile data saving)
- Medium: 128 kbps (standard quality)
- High: 320 kbps (premium quality)

**Response Format:**
```json
{
  "_id": "song_id",
  "title": "Song Title",
  "audioUrl": "original_cloudinary_url",
  "streamingUrls": {
    "low": "https://res.cloudinary.com/.../64k.mp3",
    "medium": "https://res.cloudinary.com/.../128k.mp3",
    "high": "https://res.cloudinary.com/.../320k.mp3"
  }
}
```

### 3. Recombee Recommendation Engine
**Tracked Interactions:**
- **Play**: Tracked after 3 seconds of listening
- **Complete**: Tracked when user listens to 80%+ of song
- **Skip**: Tracked when changing songs before 50% completion

**Recommendation Types:**
- **Personalized**: Based on user's listening history
- **Similar Songs**: Collaborative filtering based on song
- **Trending**: Popular songs based on community engagement

**Algorithms:**
- Collaborative filtering
- Content-based filtering (genre, artist, mood)
- Hybrid approach combining both methods

### 4. Role-Based Access Control
**Roles:**
- **User**: Browse, play songs, create private playlists
- **Artist**: Upload songs, create public albums, manage own content
- **Admin**: Manage all users, songs, albums; toggle visibility

**Permissions:**
- `isPublic`: Artist controls (public vs private)
- `isVisible`: Admin controls (active vs hidden)
- User can only access: `isPublic=true AND isVisible=true`

## 📁 Project Structure

```
backend-microservices/
├── user-service/
│   ├── src/
│   │   ├── models/user.model.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── admin.controller.js
│   │   │   └── user.controller.js
│   │   ├── services/
│   │   │   ├── user.service.js
│   │   │   └── admin.service.js
│   │   ├── routes/
│   │   │   ├── auth.route.js
│   │   │   ├── user.route.js
│   │   │   └── admin.route.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── role.middleware.js
│   │   ├── config/db.js
│   │   └── app.js
│   ├── Dockerfile
│   └── package.json
│
├── song-service/
│   ├── src/
│   │   ├── models/song.model.js
│   │   ├── controllers/
│   │   │   ├── song.controller.js
│   │   │   └── admin.controller.js
│   │   ├── services/
│   │   │   ├── song.service.js
│   │   │   ├── recombee.service.js
│   │   │   └── httpClient.js
│   │   ├── routes/
│   │   │   ├── song.route.js
│   │   │   └── admin.route.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   └── upload.middleware.js
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── redis.js
│   │   └── app.js
│   ├── Dockerfile
│   └── package.json
│
├── album-service/
│   ├── src/
│   │   ├── models/album.model.js
│   │   ├── controllers/
│   │   │   ├── album.controller.js
│   │   │   └── admin.controller.js
│   │   ├── services/
│   │   │   ├── album.service.js
│   │   │   └── httpClient.js
│   │   ├── routes/
│   │   │   ├── album.route.js
│   │   │   └── admin.route.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   └── upload.middleware.js
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── redis.js
│   │   └── app.js
│   ├── Dockerfile
│   └── package.json
│
├── api-gateway/
│   ├── src/
│   │   └── app.js
│   ├── Dockerfile
│   └── package.json
│
├── k8s/
│   ├── namespace.yaml
│   ├── secrets.yaml
│   ├── user-service-deployment.yaml
│   ├── song-service-deployment.yaml
│   ├── album-service-deployment.yaml
│   └── api-gateway-deployment.yaml
│
├── docker-compose.yml
└── .env.example
```

## 🚀 Quick Start

### Local Development with Docker Compose

1. **Clone and setup:**
```bash
git clone <repository>
cd backend-microservices
cp .env.example .env
# Edit .env with your credentials
```

2. **Start services:**
```bash
docker-compose up -d
```

3. **Verify services:**
```bash
curl http://localhost:3000/health/services
```

### Manual Setup (Without Docker)

1. **Install dependencies for each service:**
```bash
# User Service
cd user-service
npm install

# Song Service
cd ../song-service
npm install

# Album Service
cd ../album-service
npm install

# API Gateway
cd ../api-gateway
npm install
```

2. **Start services in separate terminals:**
```bash
# Terminal 1
cd user-service && npm run dev

# Terminal 2
cd song-service && npm run dev

# Terminal 3
cd album-service && npm run dev

# Terminal 4
cd api-gateway && npm run dev
```

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (minikube, GKE, EKS, AKS)
- kubectl configured
- Docker images built and pushed to registry

### Deploy

1. **Create namespace:**
```bash
kubectl apply -f k8s/namespace.yaml
```

2. **Create secrets:**
```bash
kubectl apply -f k8s/secrets.yaml
```

3. **Deploy services:**
```bash
kubectl apply -f k8s/user-service-deployment.yaml
kubectl apply -f k8s/song-service-deployment.yaml
kubectl apply -f k8s/album-service-deployment.yaml
kubectl apply -f k8s/api-gateway-deployment.yaml
```

4. **Verify deployments:**
```bash
kubectl get pods -n music-streaming
kubectl get svc -n music-streaming
```

## 🔧 Service Communication

### Inter-Service Communication
Services communicate via HTTP REST APIs:

```javascript
// Example: Song Service calling User Service
const user = await callService("user", `/users/${userId}`);

// Example: Album Service calling Song Service
const songs = await callService("song", "/songs/batch", "POST", { 
  ids: songIds 
});
```

### Authentication Flow
1. Frontend → API Gateway (with Clerk token)
2. API Gateway → Microservice (forwards auth headers)
3. Microservice → Clerk SDK (verifies token)
4. Microservice → User Service (gets user data)
5. Microservice → Response

## 📦 Dependencies

### Common Dependencies
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables
- **@clerk/clerk-sdk-node**: Authentication

### Song Service Specific
- **redis**: Caching layer
- **cloudinary**: Media storage & transcoding
- **recombee-api-client**: Recommendation engine
- **multer**: File upload handling

### Album Service Specific
- **redis**: Caching layer
- **axios**: HTTP client for inter-service calls
- **multer**: File upload handling

### API Gateway Specific
- **http-proxy-middleware**: Request proxying

## 🔐 Security

### Authentication
- Clerk JWT tokens for all authenticated requests
- Token verification in each microservice
- Session ID forwarding for user context

### Authorization
- Role-based access control (RBAC)
- Middleware: `requireAuth`, `requireArtist`, `requireAdmin`
- Resource ownership validation

### Data Protection
- Secrets stored in Kubernetes Secrets
- Environment variables for sensitive data
- CORS configured for frontend origin only

## 📊 Data Flow Examples

### Upload Song (Artist)
1. Artist → API Gateway: `POST /api/songs` (multipart)
2. API Gateway → Song Service
3. Song Service → Cloudinary (upload files)
4. Song Service → MongoDB (save song)
5. Song Service → Recombee (add item)
6. Song Service → Redis (invalidate cache)
7. Song Service → Response

### Get Personalized Recommendations
1. User → API Gateway: `GET /api/songs/recommendations/for-you`
2. API Gateway → Song Service
3. Song Service → Redis (check cache)
4. If cache miss:
   - Song Service → Recombee (get recommendations)
   - Song Service → MongoDB (fetch song details)
   - Song Service → Redis (cache results)
5. Song Service → Response with streaming URLs

### Create Album
1. User/Artist → API Gateway: `POST /api/albums` (multipart)
2. API Gateway → Album Service
3. Album Service → Cloudinary (upload image)
4. Album Service → User Service (verify user)
5. Album Service → MongoDB (save album)
6. Album Service → Redis (invalidate cache)
7. Album Service → Response

## 🏥 Health Monitoring

### Service Health Endpoints
Each service exposes `/health`:
```json
{
  "status": "OK",
  "service": "song-service",
  "redis": true,
  "recombee": true,
  "timestamp": "2025-10-29T..."
}
```

### Gateway Health Aggregation
`GET /health/services` returns all services' status:
```json
{
  "gateway": "healthy",
  "services": [
    {
      "name": "user",
      "status": "healthy",
      "data": { ... }
    },
    {
      "name": "song",
      "status": "healthy",
      "data": { ... }
    },
    {
      "name": "album",
      "status": "healthy",
      "data": { ... }
    }
  ]
}
```

## 📝 License

MIT License