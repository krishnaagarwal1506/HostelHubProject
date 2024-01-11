import { AuthContext, AuthContextType } from "@src/context/AuthContext";

jest.mock("@src/utils/index.ts", () => ({
  fetchData: jest.fn().mockResolvedValue({
    id: 1,
    email: "johnDoe@gmail.com",
    role: { type: "admin" },
    username: "John Doe",
  }),
}));

type PropsWithChildren = {
  children: React.ReactNode;
  value: Partial<AuthContextType>;
};

const defaultValues = {
  user: {
    id: 1,
    email: "johnDoe@gmail.com",
    role: "admin",
    name: "John Doe",
  },
  updateUserDetails: jest.fn(),
  getUser: jest.fn().mockResolvedValue(true),
  isLoading: false,
  handleLogout: jest.fn(),
  handleLogin: jest.fn(),
  handleGoogleLogin: jest.fn(),
};

const AuthProviderMock = ({ children, value }: PropsWithChildren) => {
  return (
    <AuthContext.Provider value={{ ...defaultValues, ...value }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProviderMock;
