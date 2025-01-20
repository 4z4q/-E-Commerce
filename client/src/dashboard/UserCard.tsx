import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Divider,
} from "@mui/material";
import { useRef, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";
import downloadImage from "../../public/download.png";
import { User } from "./UserManagemnt";

interface UserCardProps {
  key: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  onUpdateUser: (updatedUser: User) => void;
  onDeleteUser: (deletedUserId: string) => void;
}

export default function UserCard({
  user,
  onUpdateUser,
  onDeleteUser,
}: UserCardProps) {
  const { firstName, lastName, email, _id } = user;
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUser = {
      _id,
      firstName: firstNameRef.current?.value || firstName,
      lastName: lastNameRef.current?.value || lastName,
      email: emailRef.current?.value || email,
    };

    try {
      const response = await fetch(`${BASE_URL}/user/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const result = await response.json();
      onUpdateUser(result); // استدعاء الدالة الممررة لتحديث المستخدمين
      setOpenEdit(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // const result = await response.json();
      onDeleteUser(_id);
      setOpenDelete(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            defaultValue={firstName}
            label="First Name"
            fullWidth
            margin="dense"
            inputRef={firstNameRef}
          />
          <TextField
            defaultValue={lastName}
            label="Last Name"
            fullWidth
            margin="dense"
            inputRef={lastNameRef}
          />
          <TextField
            defaultValue={email}
            label="Email"
            fullWidth
            margin="dense"
            inputRef={emailRef}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={handleDeleteSubmit} color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Card sx={{ width: 345 }}>
        <CardActionArea sx={{ width: "100%" }}>
          <CardMedia
            component="img"
            sx={{
              height: "150px",
              width: "150px",
              display: "block",
              margin: "0 auto",
            }}
            image={downloadImage}
            alt="User Avatar"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {firstName} {lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {email}
            </Typography>
          </CardContent>
        </CardActionArea>

        <Divider />

        <CardActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button size="small" color="success" onClick={handleEditOpen}>
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => setOpenDelete(true)}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
