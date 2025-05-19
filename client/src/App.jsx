import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import CreateEvent from "./pages/CreateEventPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import DashboardPage from "./pages/DashboardPage";
import TransparencyPage from "./pages/TransparencyPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { UpdateEventPage } from "./pages/UpdateEventPage";
import ThankYouPage from "./pages/ThankYouPage";


function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route
                path="create-event"
                element={
                  <ProtectedRoute>
                    <CreateEvent/>
                  </ProtectedRoute>
                }
              />
              <Route path="event/:eventId" element={<EventDetailsPage />} />
              <Route
                path="event/edit/:eventId"
                element={
                  <ProtectedRoute>
                    <UpdateEventPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/thank-you" element={<ThankYouPage />} />
              <Route
                path="transparency/:eventId"
                element={<TransparencyPage />}
              />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
