import React from "react";
import Navbar from "../../components/ui/navigation/Navbar";
import Container from "./Container";
import Logo from "../../assets/logo.png";

const AppLayout = () => {
  return (
    <div className="bg-slate-100 min-h-screen pb-10">
      <Navbar Logo={Logo} />
      <Container />
    </div>
  );
};

export default AppLayout;
