import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import DashBoard from "@layout/Dashboard";
import AdminHome from "@pages/Admin";
import StudentInfo from "@pages/StudentInfo";
import Complaints from "@pages/Complaints";
import Canteen from "@pages/Canteen";
import StudentHome from "@pages/StudentHome";
//import Rooms from "@pages/Rooms";
import Login from "@pages/login";

import PageNotFound from "@components/PageNotFound";
import Forbidden from "@components/Forbidden";
import NetworkStatusBoundry from "@components/NetworkStatusBoundry";

import PrivateRoutes from "@routes/PrivateRoutes";
import PublicRoutes from "@routes/PublicRoutes";
import RouteWrapper from "@routes/RouteWrapper";

import AuthProvider from "@context/AuthContext";

import { appTheme } from "@themes/app.theme.ts";
import "@style/App.css";

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        retry: false,
        networkMode: "always",
        staleTime: 30 * 1000, // 30 Seconds
      },
    },
  });

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <Router>
          <NetworkStatusBoundry>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route
                  element={
                    <PrivateRoutes allowedRoles={["admin", "student"]} />
                  }
                >
                  <Route path="dashboard" element={<DashBoard />}>
                    <Route
                      path=""
                      element={
                        <RouteWrapper
                          components={{
                            admin: <AdminHome />,
                            student: <StudentHome />,
                          }}
                        />
                      }
                    />
                    <Route
                      path="complaints"
                      element={
                        <RouteWrapper
                          components={{
                            admin: <Complaints />,
                            student: <Complaints />,
                          }}
                        />
                      }
                    />
                    <Route
                      path="canteenMenu"
                      element={
                        <RouteWrapper
                          components={{
                            admin: <Canteen />,
                            student: <Canteen />,
                          }}
                        />
                      }
                    />
                  </Route>
                </Route>
                <Route element={<PrivateRoutes allowedRoles={["admin"]} />}>
                  <Route path="dashboard" element={<DashBoard />}>
                    <Route
                      path="students"
                      element={
                        <RouteWrapper
                          components={{
                            admin: <StudentInfo />,
                          }}
                        />
                      }
                    />
                    {/* <Route
                  path="rooms"
                  element={
                    <RouteWrapper
                      components={{
                        admin: <Rooms />,
                      }}
                    />
                  }
                /> */}
                  </Route>
                </Route>
                <Route element={<PublicRoutes />}>
                  <Route path="/login" element={<Login />} />
                </Route>

                <Route path="/forbidden" element={<Forbidden />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </AuthProvider>
          </NetworkStatusBoundry>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
