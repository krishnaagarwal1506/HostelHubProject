import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TableComponent from "../Table";

describe("TableComponent", () => {
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", width: 200 },
  ];

  const rows = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ];

  const getDataMock = jest.fn();
  const setPaginationModelMock = jest.fn();
  const onRowClickMock = jest.fn();

  beforeEach(() => {
    render(
      <TableComponent
        columns={columns}
        rows={rows}
        getData={getDataMock}
        isLoading={false}
        paginationModel={{ page: 1, pageSize: 10 }}
        setPaginationModel={setPaginationModelMock}
        onRowClick={onRowClickMock}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("snapshot test", () => {
    const { asFragment } = render(
      <TableComponent
        columns={columns}
        rows={rows}
        getData={getDataMock}
        isLoading={false}
        paginationModel={{ page: 1, pageSize: 10 }}
        setPaginationModel={setPaginationModelMock}
        onRowClick={onRowClickMock}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders the table with correct columns and rows", () => {
    const idColumn = screen.getByText("ID");
    const nameColumn = screen.getByText("Name");
    const johnDoeRow = screen.getByText("John Doe");
    const janeSmithRow = screen.getByText("Jane Smith");

    expect(idColumn).toBeInTheDocument();
    expect(nameColumn).toBeInTheDocument();
    expect(johnDoeRow).toBeInTheDocument();
    expect(janeSmithRow).toBeInTheDocument();
  });

  it("calls getData on mount", () => {
    expect(getDataMock).toHaveBeenCalledWith(false, 1, "");
  });

  it("calls onRowClick with correct parameters when a row is clicked", () => {
    const johnDoeRow = screen.getByText("John Doe");
    fireEvent.click(johnDoeRow);

    expect(onRowClickMock).toHaveBeenCalledWith(expect.any(Object), {
      id: 1,
      name: "John Doe",
    });
  });

  it("renders the table with empty rows", () => {
    const emptyRows: { [key: string]: string | number | null }[] = [];

    render(
      <TableComponent
        columns={columns}
        rows={emptyRows}
        getData={getDataMock}
        isLoading={false}
        paginationModel={{ page: 1, pageSize: 10 }}
        setPaginationModel={setPaginationModelMock}
        onRowClick={onRowClickMock}
      />
    );
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });
});
