const mock = jest.requireActual("react-router-dom");

module.exports = {
  ...mock,
  useNavigate: jest.fn(),
  useParams: jest.fn(),
  useLocation: jest.fn(),
  useHistory: jest.fn(),
};
