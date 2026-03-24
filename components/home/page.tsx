import React from "react";
import AyandahaDigitalCarousel from "./carousel";
import NexusScholarships from "../scholarships/page";
import AyandahaHome from "./ayandaha";

const Home = () => {
  return (
    <div>
      <AyandahaDigitalCarousel></AyandahaDigitalCarousel>
      <AyandahaHome></AyandahaHome>
      <NexusScholarships></NexusScholarships>
    </div>
  );
};

export default Home;
