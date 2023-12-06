import { ChangeEvent } from "react";
import { IconButton, InputBase, Paper } from "@mui/material";
import { Search } from "@mui/icons-material";

type SearchBarType = {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  inputClassName?: string;
};

const SearchBar = ({
  value,
  onChange,
  className = "",
  inputClassName = "",
}: SearchBarType) => {
  return (
    <Paper className={className} component="form">
      <IconButton type="button" className="px-2" aria-label="search">
        <Search />
      </IconButton>
      <InputBase
        className={inputClassName}
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Student Name"
        value={value}
        onChange={onChange}
      />
    </Paper>
  );
};

export default SearchBar;
