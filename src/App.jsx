import Home from "./pages/home";
// import App from "./App";
import Card from "./pages/card" // <-- CHANGED to capital 'C'
import Transfer from "./pages/Transfer";
import Donate from "./pages/Donate";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      {/* The path in the URL remains lowercase */}
      <Route path="/card" element={<Card />} /> 
      <Route path="/transfer" element={<Transfer />} />
      <Route path="/donate" element={<Donate />} />
    </Routes>
  );
}

export default App;
















// import Home from "./pages/home";
// import Card from "./pages/card";
// import { Routes, Route, useLocation } from "react-router-dom";

// function App() {
//   const location = useLocation();
//   const excludeComp = ['/home', '/card'];

//   const hideComponent = excludeComp.includes(location.pathname);

//   return (
//     <>
//       {!hideComponent && <Home />}
//       <Routes>
//         <Route path="/Home" element={<Home />} />
//         <Route path="/Card" element={<Card />} />
//       </Routes>
//     </>
//   );
// }

// export default App;