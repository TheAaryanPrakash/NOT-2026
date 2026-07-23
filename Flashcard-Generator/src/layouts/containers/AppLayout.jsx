import React from "react";
import Navbar from "../../components/ui/navigation/Navbar";
import Container from "./Container";
import Logo from "../../assets/logo.png";

const AppLayout = () => {
  return (
    <div className="bg-black min-h-screen pb-10 text-white">
      <Navbar Logo={Logo} />
      <Container />
    </div>
  );
};

export default AppLayout;
