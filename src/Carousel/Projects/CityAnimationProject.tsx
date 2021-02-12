import React, { useEffect } from "react";
import { runCityAnimation } from "./CityAnimation";
import { Project, ProjectWrapper } from "./styled";

export const CityAnimationProject = () => {
  useEffect(() => {
    runCityAnimation();
  }, []);

  return (
    <ProjectWrapper>
      <Project id="city"></Project>
    </ProjectWrapper>
  );
};
