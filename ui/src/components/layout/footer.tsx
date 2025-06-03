import { Container, Stack } from "@mui/material";

export default function Component() {
  return (
    <Container
      component="footer"
      sx={{
        borderTop: "1px solid #ffffff",
        mt: "auto",
        py: 3
      }}
    >
      <Stack sx={{ textAlign: "center" }}>Demo App</Stack>
    </Container>
  );
}
