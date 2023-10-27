import { useState, useEffect } from "react";
import { Button, Stack, Grid } from "@mantine/core";
import { Link } from "react-router-dom";
import SignInForm from "./signInForm";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://vmwzmajqhmtuvfjkczdb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtd3ptYWpxaG10dXZmamtjemRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgzNjk0NTIsImV4cCI6MjAxMzk0NTQ1Mn0.LgUdiFzERf7u2kyFcDePy_FktXxbu-VVf_vALU-itxY"
);

const Layout = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<any>();
  const [isStaff, setIsStaff] = useState<any>();

  useEffect(() => {
    // Check if userData is in localStorage
    const userDataString = sessionStorage.getItem("userData");
    if (userDataString) {
      // If userData is found in localStorage, parse it and set it in your component state
      const userData = JSON.parse(userDataString);
      setUser(userData);
      supabase
        .from("staffmember")
        .select("*")
        .eq("email", userData.data.user.email)
        .then((value) => {
          if (value.error) console.log(value.error);
          if (value.data) {
            if (value.data.length > 0) {
              console.log(value.data);
              setIsStaff(true);
            }
          }
        });
    }
  }, []);
  return (
    <Grid>
      {user ? (
        <>
          <Grid.Col span={2}>
            {isStaff ? (
              <Stack>
                <Button
                  variant="transparent"
                  color="orange"
                  size="md"
                  radius="xs"
                >
                  <Link to="/Admin/Accounting">Accounting</Link>
                </Button>
                <Button
                  variant="transparent"
                  color="orange"
                  size="md"
                  radius="xs"
                >
                  <Link to="/Admin/LoanApplicationReview">Loan Review</Link>
                </Button>
              </Stack>
            ) : (
              <Stack>
                <Button
                  variant="transparent"
                  color="orange"
                  size="md"
                  radius="xs"
                >
                  <Link to="/Customer/LoanApplication">Loan Application</Link>
                </Button>
                <Button
                  variant="transparent"
                  color="orange"
                  size="md"
                  radius="xs"
                >
                  <Link to="/Customer/LoanApplicationTimeline">
                    Loan App Status
                  </Link>
                </Button>
                {/* <Button
                  variant="transparent"
                  color="orange"
                  size="md"
                  radius="xs"
                >
                  <Link to="/Customer/Rewards">Rewards</Link>
                </Button> */}
              </Stack>
            )}
          </Grid.Col>
          <Grid.Col span={10}>{children}</Grid.Col>
        </>
      ) : (
        <Grid.Col>
          <SignInForm />
        </Grid.Col>
      )}
    </Grid>
  );
};

export default Layout;
