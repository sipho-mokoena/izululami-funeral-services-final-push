import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react"; // Import useState for handling form input
const supabaseUrl = "https://swrxqpbfstnvhkymvmcc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3cnhxcGJmc3RudmhreW12bWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyNzEzMzIsImV4cCI6MjAxMzg0NzMzMn0.5b2Qxjwbovc0C405AefJZ2Duz9_WVG7WkF8-6djz9rs"; // Replace with your Supabase API Key
const supabase = createClient(supabaseUrl, supabaseKey);

const SignUpForm = () => {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

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

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const user = await supabase.auth.signUp({
        email,
        password,
      });

      if (user.error) {
        // Handle the error, such as displaying a message to the user.
        console.error("Error signing up:", user.error.message);
      } else {
        // If sign-up is successful, you can now add additional user data to your 'user' table in the database.
        const { data, error } = await supabase
          .from("user")
          .insert([
            {
              firstname: firstName,
              surname: surname,
              email: email,
              phonenumber: phonenumber,
              role: role,
            },
          ])
          .select();

        if (error) {
          // Handle the error, such as displaying a message to the user.
          console.error("Error inserting user data:", error.message);
        } else {
          // If the user data insertion is successful, you can store the user data in your component's state or local storage for future reference.
          setUser(data);

          // You may also want to store user data in local storage to persist the user's session.
          sessionStorage.setItem("userData", JSON.stringify(data));

          // Redirect the user to the appropriate page based on their role.
          window.location.href = "/Dashboard";
        }
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
    }
  };

  return (
    <>
      {user ? (
        <div>Already signed in</div>
      ) : (
        <div className="bg-[#F9FAFB] h-full w-full flex items-center">
          <div className="h-max mx-auto flex flex-col items-center">
            <h1 className="text-xl font-bold text-center pb-10">Sign Up</h1>
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
                  Phonenumber
                </label>
                <input
                  className="border border-gray-400 focus:outline-slate-400 rounded-md w-full shadow-sm px-5 py-2"
                  type="tel"
                  name="Phonenumber"
                  placeholder="0789656320"
                  value={phonenumber}
                  onChange={(e) => setPhonenumber(e.target.value)}
                />
              </div>
              <div>
                <label className="text-gray-600 font-bold inline-block pb-2">
                  First Name
                </label>
                <input
                  className="border border-gray-400 focus:outline-slate-400 rounded-md w-full shadow-sm px-5 py-2"
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-gray-600 font-bold inline-block pb-2">
                  Surname
                </label>
                <input
                  className="border border-gray-400 focus:outline-slate-400 rounded-md w-full shadow-sm px-5 py-2"
                  type="text"
                  name="surname"
                  placeholder="Doe"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
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
                <label className="text-gray-600 font-bold inline-block pb-2">
                  Role
                </label>
                <input
                  className="border border-gray-400 focus:outline-slate-400 rounded-md w-full shadow-sm px-5 py-2"
                  type="text"
                  name="role"
                  placeholder="User role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="bg-green-500 text-white rounded-md py-2 px-4 mt-4"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUpForm;
