import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react"; // Import useState for handling form input
const supabaseUrl = "https://swrxqpbfstnvhkymvmcc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3cnhxcGJmc3RudmhreW12bWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyNzEzMzIsImV4cCI6MjAxMzg0NzMzMn0.5b2Qxjwbovc0C405AefJZ2Duz9_WVG7WkF8-6djz9rs"; // Replace with your Supabase API Key
const supabase = createClient(supabaseUrl, supabaseKey);

function getRandomInt(min: number, max: number) {
  // Use Math.random() to generate a random decimal between 0 (inclusive) and 1 (exclusive)
  // Multiply it by the range (max - min) and add min to shift the range
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const BookAppointment = () => {
  const [appointmentDateTime, setAppointmentDateTime] = useState("");
  const [selectedServices, setSelectedServices] = useState([""]);
  const [submitted, setSubmitted] = useState(false);

  const [userData, setUserData] = useState<any>();
  const [spaServices, setSpaServices] = useState<any>();

  const setServicesSpa = async () => {
    let { data, error } = await supabase.from("spaservice").select("*");
    setSpaServices(data);
    console.log(data);
  };

  useEffect(() => {
    // Check if userData is in localStorage
    const userDataString = sessionStorage.getItem("userData");
    if (userDataString) {
      setUserData(JSON.parse(userDataString));
      setServicesSpa();
    } else {
      window.location.href = "/SignIn";
    }
  }, []);

  const onSubmit = async (event: any) => {
    event.preventDefault(); // Prevent the default form submission
    // Process the form submission, e.g., send data to the server
    console.log("Submitted Date and Time:", appointmentDateTime);
    console.log("Selected Services:", selectedServices);

    let userQry = await supabase
      .from("user")
      .select("*")
      .eq("email", userData?.user?.identities[0]?.identity_data?.email);

    if (userQry.error) {
      console.log(userQry.error);
      return;
    }

    const users = await supabase.from("user").select("*");

    if (users.error) {
      console.log(userQry.error);
      return;
    }

    const booking = await supabase
      .from("booking")
      .insert([
        {
          appointmentdatetime: appointmentDateTime,
          user: getRandomInt(1, users?.data.length),
          customer: userQry.data[0]?.id,
        },
      ])
      .select();

    if (booking.error) {
      console.log(booking.error);
      return;
    }

    let bookingSpaservices: any[] = []

    selectedServices.forEach((selectedService) => console.log(bookingSpaservices.push({
        booking: booking.data[0]?.id,
        spaservice: parseInt(selectedService)
      })))

    const bookingSpaservice = await supabase
      .from("booking_spaservice")
      .insert(bookingSpaservices)
      .select();

    if (bookingSpaservice.error) {
      console.log(bookingSpaservice.error);
      return;
    }

    if (booking.data && bookingSpaservice.data) {
        window.location.href = '/Payment';
    }
  };
  return (
    <>
      {userData ? (
        <div className="bg-[#F9FAFB] h-screen w-screen flex items-center">
          <div className="h-max mx-auto flex flex-col items-center">
            <h1 className="text-xl font-bold text-center pb-10">
              Book an Appointment
            </h1>
            <form
              onSubmit={onSubmit}
              className="bg-white shadow-xl p-10 flex flex-col gap-4 text-sm"
            >
              <div>
                <label
                  className="text-gray-600 font-bold inline-block pb-2"
                  htmlFor="appointmentDateTime"
                >
                  Appointment Date and Time
                </label>
                <input
                  className="border border-gray-400 focus:outline-slate-400 rounded-md w-full shadow-sm px-5 py-2"
                  type="datetime-local"
                  id="appointmentDateTime"
                  name="appointmentDateTime"
                  value={appointmentDateTime}
                  onChange={(e) => setAppointmentDateTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  className="text-gray-600 font-bold inline-block pb-2"
                  htmlFor="bookingSpaServices"
                >
                  Select Spa Services
                </label>
                {spaServices ? (
                  <select
                    className="border border-gray-400 focus:outline-slate-400 rounded-md w-full shadow-sm px-5 py-2"
                    id="bookingSpaServices"
                    name="bookingSpaServices"
                    value={selectedServices}
                    onChange={(e) =>
                      setSelectedServices(
                        Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        )
                      )
                    }
                    multiple
                    required
                  >
                    {spaServices?.map((service: any) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  "loading..."
                )}
              </div>
              <div>
                <input
                  className="bg-green-700 w-full py-2 rounded-md text-white font-bold cursor-pointer"
                  type="submit"
                  value="Book Appointment"
                />
              </div>
            </form>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default BookAppointment;
