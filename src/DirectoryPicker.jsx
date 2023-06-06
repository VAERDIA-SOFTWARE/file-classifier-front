import {
  Box,
  Button,
  CssBaseline,
  List,
  ListItem,
  ListItemText,
  Typography,
  Grid,
  makeStyles,
} from "@mui/material";
import React, { useEffect, useRef } from "react";

function DirectoryPicker() {
  const [processedFiles, setProcessedFiles] = React.useState([]);
  const scrollRef = useRef(null);

  const processFiles = async (dirHandle) => {
    for await (const entry of dirHandle.values()) {
      if (entry.kind === "file") {
        const file = await entry.getFile();

        if (file.type === "application/pdf") {
          setProcessedFiles((oldFiles) => [
            ...oldFiles,
            { file: file, color: "green" },
          ]);
          // Upload the file to your server
          const formData = new FormData();
          formData.append("file", file);
          const response = await fetch("https://your-server.com/upload", {
            method: "POST",
            body: formData,
          });
          if (response.ok) {
            console.log(`Uploaded ${file.name} successfully.`);
          } else {
            console.log(`Failed to upload ${file.name}.`);
          }
        }
        setProcessedFiles((oldFiles) => [
          ...oldFiles,
          { file: file, color: "red" },
        ]);
      } else if (entry.kind === "directory") {
        await processFiles(entry);
      }
    }
  };

  const handleClick = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      await processFiles(dirHandle);
    } catch {}
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [processedFiles]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <CssBaseline /> */}

      <Grid item xs={6} mt="2rem">
        <Button onClick={handleClick} sx={{ marginBottom: "2rem" }}>
          Pick a Directory
        </Button>
        <Box
          ref={scrollRef}
          sx={{
            bgcolor: "#cfe8fc",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            width: "70vw",
            height: "60vh",
            // scrol,
          }}
        >
          <List sx={{ flexGrow: 1 }}>
            {processedFiles.map((file) => (
              <ListItem key={file.file.name}>
                <ListItemText
                  style={{ color: file.color }}
                  primary={file.file.name}
                  secondary={new Date(file.file.lastModified).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Grid>
    </Box>
  );
}

export default DirectoryPicker;
