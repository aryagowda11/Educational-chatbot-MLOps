"use client";

import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Box,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import styles from "./index.module.css";

export default function StudentAdditionContainer({ courseId }) {
  const [studentList, setStudentList] = useState([]);
  const [studentIdMap, setStudentIdMap] = useState({});
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    // Filter students based on search query
    const filtered = studentList.filter((student) =>
      Object.values(student)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchQuery, studentList]);

  const fetchStudents = async () => {
    try {
      const token = sessionStorage.getItem("access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}courses/${courseId}/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      // Transform the data to match DataGrid requirements
      const formattedData = data.map((student) => {
        studentIdMap[student.user_id] = {
          id: student.user_id,
          username: student.username,
          email: student.email,
          status: student.enrollment_status,
        };
        return {
          id: student.user_id,
          username: student.username,
          email: student.email || "N/A",
          status: student.enrollment_status,
        };
      });
      setStudentIdMap(studentIdMap);
      setStudentList(formattedData);
      setFilteredStudents(formattedData);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudents = async () => {
    try {
      const token = sessionStorage.getItem("access_token");
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}courses/${courseId}/students`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_ids: selectedStudents.map((student) => student.id),
          }),
        }
      );
      // Refresh student list or show success message
      fetchStudents();
      setSelectedStudents([]);
    } catch (error) {
      console.error("Error adding students:", error);
    }
  };

  const handleRemoveStudents = async () => {
    try {
      const token = sessionStorage.getItem("access_token");
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}courses/${courseId}/students`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_ids: selectedStudents.map((student) => student.id),
          }),
        }
      );
      // Refresh student list after removing
      fetchStudents();
      setSelectedStudents([]);
    } catch (error) {
      console.error("Error removing students:", error);
    }
  };

  const columns = [
    { field: "username", headerName: "Username", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
  ];

  return (
    <div className={styles.container}>
      <Box sx={{ width: "100%", height: "100%" }}>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{
            color: "white",
            fontWeight: 500,
          }}
        >
          Add Students to Course
        </Typography>
        <div className={styles.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddStudents}
            disabled={
              selectedStudents.filter(
                (student) => student.status === "NOT ENROLLED"
              ).length === 0
            }
            sx={{
              margin: "2px",
              border: "solid 1px",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(59, 130, 246, 1)",
              },
              "&:disabled": {
                color: "rgba(255, 255, 255, 0.5)",
              },
            }}
          >
            Add Selected Students
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRemoveStudents}
            disabled={
              selectedStudents.filter(
                (student) => student.status === "ENROLLED"
              ).length === 0
            }
            sx={{
              margin: "2px",
              border: "solid 1px",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(59, 130, 246, 1)",
              },
              "&:disabled": {
                color: "rgba(255, 255, 255, 0.5)",
              },
            }}
          >
            Remove Selected Students
          </Button>
        </div>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiInputBase-input": {
              color: "white",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "rgba(255, 255, 255, 0.7)",
              opacity: 1,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
              </InputAdornment>
            ),
          }}
        />

        <DataGrid
          rows={filteredStudents}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick={false}
          rowSelectionModel={selectedStudents.map((student) => student.id)}
          onRowSelectionModelChange={(newSelectionModel) => {
            const newStudentList = [];
            if (newSelectionModel.length > 0) {
              newSelectionModel.forEach((id) => {
                if (studentIdMap[id]) newStudentList.push(studentIdMap[id]);
              });
            }
            setSelectedStudents(newStudentList);
          }}
          autoHeight
          loading={loading}
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
            border: "none",
            borderRadius: 2,
            p: 2,
            color: "white",
            "& .MuiDataGrid-main": {
              backgroundColor: "transparent !important",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: "transparent !important",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "transparent !important",
              borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
            },
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "transparent !important",
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "transparent !important",
              "&:hover": {
                backgroundColor: "transparent !important",
              },
              "&:focus": {
                backgroundColor: "transparent !important",
              },
              "&.MuiDataGrid-columnHeader--sorted": {
                backgroundColor: "transparent !important",
              },
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: "white",
            },
            "& .MuiDataGrid-cell": {
              backgroundColor: "transparent",
              color: "white",
              borderColor: "rgba(255, 255, 255, 0.2)",
            },
            "& .MuiDataGrid-row": {
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              backgroundColor: "transparent",
            },
            "& .MuiTablePagination-root": {
              color: "white",
            },
            "& .MuiCheckbox-root": {
              color: "rgba(255, 255, 255, 0.7)",
            },
            "& .MuiDataGrid-columnSeparator": {
              visibility: "hidden",
            },
            "& .MuiIconButton-root": {
              color: "white",
            },
            "& .MuiDataGrid-menuIcon": {
              color: "white",
            },
            "& .MuiDataGrid-sortIcon": {
              color: "white",
            },
            "& .MuiDataGrid-overlay": {
              backgroundColor: "transparent",
            },
          }}
        />
      </Box>
    </div>
  );
}
