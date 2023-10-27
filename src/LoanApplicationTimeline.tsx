import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Text,
  Title,
  Timeline,
  MantineStyleProp,
} from "@mantine/core";
import { SupabaseClient } from "@supabase/supabase-js";

const LoanApplicationTimeline = ({
  supabase,
}: {
  supabase: SupabaseClient;
}) => {
  const [loanApp, setLoanApp] = useState<any>(0);
  const findLoanApplication = async () => {
    const userDataString = sessionStorage.getItem("userData");
    if (userDataString) {
      // If userData is found in localStorage, parse it and set it in your component state
      const userData = JSON.parse(userDataString);
      let { data: loanapplication, error } = await supabase
        .from("loanapplication")
        .select("*")
        .eq("email", userData.data.user.email);

      if (error) {
        console.log(error);
      }

      if (loanapplication) {
        setLoanApp(loanapplication);
      }
    }
  };

  useEffect(() => {
    findLoanApplication();
  }, []);

  const containerStyle: MantineStyleProp = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  };
  return (
    <Container style={containerStyle}>
      <Paper p="md">
            <Text size="md">
              Your loan application {
                loanApp? (`is ${loanApp[0].status}`) : ("non existent")
              }.
            </Text>
      </Paper>
    </Container>
  );
};

export default LoanApplicationTimeline;
