import { BrowserRouter, Route, Routes } from "react-router-dom";
import GlobalStyle from "./assets/style/GlobalStyle";
import Header from "./components/Header.js";
import { AuthProvider } from "./contexts/AuthContext.js";
import {
  HomeController,
  SignUpController,
  SignInController,
} from "./controllers/index.js";
import {NotFound} from "./pages/NotFound/NotFound.js"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <GlobalStyle />
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<HomeController />} />
          <Route path="/signup" element={<SignUpController />} />
          <Route path="/signin" element={<SignInController />} />
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
