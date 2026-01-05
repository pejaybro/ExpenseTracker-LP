import { AppRouter } from "@/router/AppRouter";
import { Toaster } from "sonner";
import useAuthBootstrap from "./hooks/useAuthBootstrap";

const App = () => {
  useAuthBootstrap();
  return (
    <>
      <Toaster position="top-center" richColors /> {/* Add this line */}
      <AppRouter></AppRouter>
    </>
  );
};

export default App;
