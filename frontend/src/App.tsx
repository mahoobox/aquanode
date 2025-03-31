import { Toaster } from "react-hot-toast";
import { Routes } from "./routes/routes";

function App() {
  return (
    <>
      <Routes />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          style: {
            backgroundColor: "matisse-950",
            color: "matisse-50",
            fontSize: "16px",
            fontWeight: "bold",
            padding: "8px",
          },
        }}
      />
    </>
  );
}

export default App;
