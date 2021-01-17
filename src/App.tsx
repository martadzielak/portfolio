import React, { Component } from "react";
import {run} from "./AnimatedBackground/AnimatedBackground";
import "./App.css";

class App extends Component {

  public componentDidMount() {
    run();
  }


  public render() {
    return (
      <div className="helicopter-layout"></div>
    );
  }
}


export default App;
