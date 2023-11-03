import { BrowserRouter, Route, Routes } from "react-router-dom";
import GlobalStyle from "./assets/style/GlobalStyle";

import {HomeController,SignUpController,SignInController} from "./controllers/index.js"
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
        <Route path="/signin" element={<SignInController />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
