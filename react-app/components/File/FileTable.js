import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
// import OpenModalButton from "../OpenModalButton";
import { Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { getAllFiles, editFile, deleteFile } from "../../redux/model/fileSlice";

const FileTable = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const files = useSelector((state) =>
    Object.values(state.model.files).filter((value) => {
      return typeof value !== "boolean" && value.applicationId + "" === id;
    })
  );
  const application = useSelector((state) => state.model.applications[id]);

  useEffect(() => {
    dispatch(getAllFiles(id));
  }, [dispatch]);

  const handleDelete = (FileId) => {
    dispatch(deleteFile(FileId));
  };
  return (
    <Table sx={{ minWidth: 650 }}>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          {/*<TableCell align="right">Type</TableCell>*/}
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>

      {application && (
        <TableBody>
          {files.map((file) => (
            <TableRow
              key={file.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {file.name}
              </TableCell>
              <TableCell>
                <Button onClick={() => handleDelete(file.id)}>Delete</Button>
              </TableCell>
              {/*<TableCell align="right">{row.type}</TableCell>*/}
            </TableRow>
          ))}
          {/* <TableBody>
              <OpenModalButton
                modalComponent={() => (
                  <div>
                    <h3>Are you sure to delete {item.name} from your menu? </h3>
                    <button
                      className="primary"
                      onClick={() => handleDelete(item.id)}
                    >
                      Yes
                    </button>
                    <button onClick={closeModal}>No</button>
                  </div>
                )}
                buttonText={
                  <div>
                    <i className="fa-solid fa-trash" /> Delete
                  </div>
                }
              />
              </TableBody> */}
        </TableBody>
      )}
    </Table>
  );
};

export default FileTable;