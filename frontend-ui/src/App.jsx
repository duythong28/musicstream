import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  useUser,
  useAuth,
} from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { AudioContextProvider } from "./contexts/AudioContext";

// Layout
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import AudioPlayer from "./components/layout/AudioPlayer";

// Pages
import HomePage from "./pages/HomePage";
import SongsPage from "./pages/SongsPage";
import AlbumsPage from "./pages/AlbumsPage";
import AlbumDetailPage from "./pages/AlbumDetailPage";
import MyLibraryPage from "./pages/MyLibraryPage";
import ArtistDashboard from "./pages/ArtistDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import SearchPage from "./pages/SearchPage";
import VisualizerPage from "./pages/VisualizerPage";
import ProfilePage from "./pages/ProfilePage";

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Protected Route Component
const ProtectedRoute = ({ children, requireRole }) => {
  const { user } = useAuthStore();

  if (requireRole && user?.role !== requireRole && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Auth Sync Component
const AuthSync = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { getToken, userId } = useAuth();
  const { fetchCurrentUser, registerUser, setUser } = useAuthStore();

  useEffect(() => {
    const syncUser = async () => {
      if (userId) {
        // Store token for API calls
        const token = await getToken();
        window.__clerk_token = token;
        window.__clerk_session_id = userId;

        try {
          // Try to get existing user
          const existingUser = await fetchCurrentUser();

          setUser(existingUser);
        } catch (error) {
          // Register new user
          try {
            const newUser = await registerUser({
              clerkId: clerkUser.id,
              fullName: clerkUser.fullName || "User",
              email: clerkUser.primaryEmailAddress?.emailAddress || "",
              imageUrl: clerkUser.imageUrl,
              role: "user", // Default role
            });
            setUser(newUser);
          } catch (regError) {
            console.error("Failed to register user:", regError);
          }
        }
      }
    };

    syncUser();
  }, [userId]);

  return children;
};

// Main Layout
const MainLayout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col bg-dark">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 pb-32">{children}</main>
      </div>
    </div>
  );
};

// Global Audio Player (outside layout)
const GlobalAudioPlayer = () => {
  const location = useLocation();
  const isVisualizerPage = location.pathname === "/visualizer";

  return (
    <div className={isVisualizerPage ? "hidden" : ""}>
      <AudioPlayer />
    </div>
  );
};

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_KEY}>
      <AudioContextProvider>
        <BrowserRouter>
          <AuthSync>
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#282828",
                  color: "#fff",
                },
              }}
            />

            <Routes>
              {/* Public Auth Routes */}
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />

              {/* Protected Routes */}
              <Route
                path="/*"
                element={
                  <SignedIn>
                    <Routes>
                      <Route path="/visualizer" element={<VisualizerPage />} />
                      <Route
                        path="/*"
                        element={
                          <MainLayout>
                            <Routes>
                              <Route path="/" element={<HomePage />} />
                              <Route path="/songs" element={<SongsPage />} />
                              <Route path="/albums" element={<AlbumsPage />} />
                              <Route
                                path="/albums/:id"
                                element={<AlbumDetailPage />}
                              />
                              <Route
                                path="/library"
                                element={<MyLibraryPage />}
                              />
                              <Route path="/search" element={<SearchPage />} />
                              <Route
                                path="/profile"
                                element={<ProfilePage />}
                              />
                              <Route
                                path="/artist"
                                element={
                                  <ProtectedRoute requireRole="artist">
                                    <ArtistDashboard />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/admin"
                                element={
                                  <ProtectedRoute requireRole="admin">
                                    <AdminDashboard />
                                  </ProtectedRoute>
                                }
                              />
                            </Routes>
                          </MainLayout>
                        }
                      />
                    </Routes>
                    {/* Global Audio Player - Always mounted */}
                    <GlobalAudioPlayer />
                  </SignedIn>
                }
              />

              {/* Redirect to sign-in if not authenticated */}
              <Route
                path="/*"
                element={
                  <SignedOut>
                    <Navigate to="/sign-in" replace />
                  </SignedOut>
                }
              />
            </Routes>
          </AuthSync>
        </BrowserRouter>
      </AudioContextProvider>
    </ClerkProvider>
  );
}

export default App;
