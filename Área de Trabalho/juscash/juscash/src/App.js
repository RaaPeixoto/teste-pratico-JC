import { BrowserRouter, Route, Routes } from "react-router-dom";
import GlobalStyle from "./assets/style/GlobalStyle";
import { SignIn } from "./pages/index.js";
import {HomeController,SignUpController} from "./controllers/index.js"
import { ToastContainer } from 'react-toastify';

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
      
      <Routes>
        <Route path="/" element={<HomeController />} />
        <Route path="/signup" element={<SignUpController />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
