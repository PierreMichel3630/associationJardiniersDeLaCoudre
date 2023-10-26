import {
  Box,
  Grid,
  IconButton,
  ImageListItem,
  ImageListItemBar,
  Typography,
} from "@mui/material";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { percent, px } from "csx";
import { style } from "typestyle";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { getUrlImage } from "../../api/storage";

const imageCss = style({
  maxWidth: percent(100),
  maxHeight: px(300),
});
interface Props {
  file: null | File | string;
  onDrop: (file: File | null) => void;
}
export const DropDragFile = ({ file, onDrop }: Props) => {
  const filterFiles = useCallback((acceptedFiles: Array<File>) => {
    const newFile = acceptedFiles[0];
    onDrop(newFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: filterFiles,
    accept: {
      "image/*": [".jpeg", ".png"],
    },
  });

  return (
    <Grid container spacing={1}>
      {file !== null && (
        <Grid item xs={12}>
          <ImageListItem>
            {typeof file === "string" ? (
              <img
                className={imageCss}
                alt="preview image"
                src={getUrlImage(file)}
              />
            ) : (
              <img
                className={imageCss}
                alt="preview image"
                src={URL.createObjectURL(file)}
              />
            )}
            <ImageListItemBar
              title={typeof file === "string" ? "" : file.name}
              actionIcon={
                <IconButton onClick={() => onDrop(null)}>
                  <DeleteIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        </Grid>
      )}
      <Grid item xs={12}>
        <Box
          sx={{
            p: 2,
            border: "1px dashed grey",
            cursor: "pointer",
            textAlign: "center",
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon fontSize="large" />
          <Typography variant="body1">
            {isDragActive
              ? "Déposer ici"
              : "Cliquer ou Glisser pour ajouter une image"}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};
