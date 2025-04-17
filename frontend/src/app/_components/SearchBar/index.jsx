import { useState, useEffect, useRef } from "react";
import {
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./index.module.css";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const searchRef = useRef(null);
  const containerRef = useRef(null);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Effect to handle API call with debounced search term
  useEffect(() => {
    const fetchData = async () => {
      if (debouncedSearchTerm) {
        // TODO: Implement your API call here
        const token = sessionStorage.getItem("access_token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}courses/search?query=${debouncedSearchTerm}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setSearchResults(data);
        if (data.length > 0) {
          setAnchorEl(searchRef.current);
        }
      } else {
        setSearchResults([]);
        setAnchorEl(null);
      }
    };
    fetchData();
  }, [debouncedSearchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMenuItemClick = (item) => {
    setSearchTerm(item.name);
    setAnchorEl(null);

    const roleId = sessionStorage.getItem("role_id");

    const queryParams = new URLSearchParams();

    if (item.type === "course") {
      queryParams.set("courseId", item.course_id);
    } else {
      queryParams.set("courseId", item.course_id);
      queryParams.set("videoId", item.video_id);
    }

    if (roleId === "3") {
      router.push(`/student/course?${queryParams.toString()}`);
    } else {
      router.push(`/instructor/course?${queryParams.toString()}`);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.searchContainer} ${
        Boolean(anchorEl)
          ? styles.searchContainerOpen
          : styles.searchContainerClosed
      }`}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearchChange}
        ref={searchRef}
        className={styles.searchInput}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className={styles.searchIcon} />
            </InputAdornment>
          ),
        }}
      />
      {Boolean(anchorEl) && (
        <Paper className={styles.dropdownContainer}>
          {searchResults.length > 0 &&
            searchResults.map((item) => (
              <MenuItem
                key={item.title}
                onClick={() => handleMenuItemClick(item)}
                className={styles.menuItem}
              >
                {item.title}
              </MenuItem>
            ))}
        </Paper>
      )}
    </div>
  );
};

export default SearchBar;
