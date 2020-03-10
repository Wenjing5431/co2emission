import React from "react";

import Navigation from "./components/Navigation";
import Header from "./components/Header";
import ChartWrapper from "./components/ChartWrapper";

function App() {
  return (
    <div className="App">
      <Navigation />
      <Header />
      <ChartWrapper />
    </div>
  );
}

export default App;
