import { createContext, useContext, useMemo, useState } from "react";

interface UserContextType {
  openDelete: boolean;
  setOpenDelete: React.Dispatch<React.SetStateAction<boolean>>;

  openEdit: boolean;
  setOpenEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext<UserContextType>({
  openDelete: false,
  setOpenDelete: () => {},
  openEdit: false,
  setOpenEdit: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const contextValue = useMemo(
    () => ({
      openDelete,
      setOpenDelete,
      openEdit,
      setOpenEdit,
    }),
    [openDelete, openEdit]
  );

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);
