import {
  Box,
  Button,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";
import UserCard from "./UserCard";
import AddIcon from "@mui/icons-material/Add";
import { EmptySearch } from "../components/EmptySearch";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function UserManagemnt() {
  const [users, setUsers] = useState<Array<any>>([]); // تعيين نوع البيانات كمصفوفة
  const [open, setOpen] = useState(false);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUser = (updatedUser: User) => {
    console.log("update users", updatedUser);
    fetchUsers();
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUser = {
      firstName: firstNameRef.current?.value,
      lastName: lastNameRef.current?.value,
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    };

    try {
      const response = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const result = await response.json();
      console.log(result);
      setUsers((prevUsers) => [...prevUsers, result]);
      setOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
    finally {
      fetchUsers();
      setOpen(false);
    }
  };

  const showDialog = () => {
    return (
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            fullWidth
            margin="dense"
            inputRef={firstNameRef}
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="dense"
            inputRef={lastNameRef}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            inputRef={emailRef}
          />
          <TextField
            label="Password"
            fullWidth
            margin="dense"
            inputRef={passwordRef}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      {users.length ? (
        <>
          {showDialog()}
          <Fab
            color="info"
            sx={(theme) => ({
              position: "absolute",
              bottom: theme.spacing(2),
              right: theme.spacing(2),
            })}
            onClick={() => setOpen(true)}
          >
            <AddIcon />
          </Fab>
          <Box
            key={users._id}
            sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}
          >
            {users.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onUpdateUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
              />
            ))}
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          flexWrap={"wrap"}
        >
          {[...Array(4)].map((_, index) => (
            <EmptySearch key={index} />
          ))}
        </Box>
      )}
    </>
  );
}
