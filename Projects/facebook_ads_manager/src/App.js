import { BrowserRouter, Routes, Route } from "react-router-dom"
import GlobalStyle from "./assets/GlobalStyle"
import { AdsManagerPage } from "./pages/AdsManagerPage";

function App() {
  return (
    <>
   <BrowserRouter>
   <GlobalStyle/>
   <Routes>
   <Route path="/" element={<AdsManagerPage/>}/>
   </Routes>
   </BrowserRouter>
    </>
  );
}

export default App;