import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react"; // Import useState for handling form input
const supabaseUrl = "https://swrxqpbfstnvhkymvmcc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3cnhxcGJmc3RudmhreW12bWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyNzEzMzIsImV4cCI6MjAxMzg0NzMzMn0.5b2Qxjwbovc0C405AefJZ2Duz9_WVG7WkF8-6djz9rs"; // Replace with your Supabase API Key
const supabase = createClient(supabaseUrl, supabaseKey);

export const SignInForm = () => {
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [user, setUser] = useState<any>();

  useEffect(() => {
    // Check if userData is in localStorage
    const userDataString = sessionStorage.getItem("userData");
    if (userDataString) {
      // If userData is found in localStorage, parse it and set it in your component state
      const userData = JSON.parse(userDataString);
      setUser(userData);
      console.log(userData);
      if (userData.userRole === "customer") {
        window.location.href = "/Booking";
      } else {
        window.location.href = "/Dashboard";
      }
    }
  }, []);

  const onSubmit = async (event: any) => {
    event.preventDefault(); // Prevent the default form submission
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("Sign in error:", error.message);
      } else {
        console.log("Signed in as:", data);
        setUser(data);
        let user: any = await supabase.from("user").select("*").eq("email", email);

        if (user.data?.length > 0) {
          sessionStorage.setItem(
            "userData",
            JSON.stringify({ userRole: "staff", ...data })
          );
          console.log(user.data)
          window.location.href = "/Dashboard";
          return;
        } else {
          sessionStorage.setItem(
            "userData",
            JSON.stringify({ userRole: "customer", ...data })
          );
          window.location.href = "/Booking";
        }
      }
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return (
    <>
      {user ? (
        <></>
      ) : (
        <div className="bg-[#F9FAFB] h-full w-full flex items-center">
          <div className="h-max mx-auto flex flex-col items-center">
            <h1 className="text-xl font-bold text-center pb-10">Sign In</h1>
            <form onSubmit={onSubmit}>
              <div>
                <label className="text-gray-600 font-bold inline-block pb-2">
                  Email
                </label>
                <input
                  className="border border-gray-400 focus:outline-slate-400 rounded-md w-full shadow-sm px-5 py-2"
                  type="email"
                  name="email"
                  placeholder="me@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-gray-600 font-bold inline-block pb-2">
                  Password
                </label>
                <input
                  className="border border-gray-400 focus:outline-slate-400 rounded-md w-full shadow-sm px-5 py-2"
                  type="password"
                  name="password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <input
                  className="bg-green-700 w-full my-10 py-2 rounded-md text-white font-bold cursor-pointer"
                  type="submit"
                  value="Login"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SignInForm;
