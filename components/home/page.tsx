import React from "react";
import AyandahaDigitalCarousel from "./carousel";
import NexusScholarships from "../scholarships/page";
import Services from "../services/page";

const Home = () => {
  return (
    <div>
      <AyandahaDigitalCarousel></AyandahaDigitalCarousel>
      <NexusScholarships></NexusScholarships>
      <Services></Services>
    </div>
  );
};

export default Home;
