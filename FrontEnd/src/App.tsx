import Routes from "./routes/Routes";
import { Toaster } from "sonner";
const App = () => {
  return (
    <>
      <Routes></Routes>
      <Toaster position="top-center" richColors closeButton duration={3000} />
    </>
  );
};

export default App;
