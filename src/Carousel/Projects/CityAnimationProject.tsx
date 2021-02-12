import React, { useEffect, useState } from "react";
import { runCityAnimation, stopCityAnimation } from "./CityAnimation";
import { Project, ProjectWrapper } from "./styled";

export const CityAnimationProject = () => {
  useEffect(() => {
    runCityAnimation("city");
  }, []);

  return (
    <ProjectWrapper>
      <Project id="city"></Project>
    </ProjectWrapper>
  );
};
