import { Alert, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';

function Toaster({ message }) {
  const [open, setOpen] = React.useState(true);

  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          severity="warning"
          onClose={handleClose}
          sx={{ width: '30vw' }}
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
export default Toaster;