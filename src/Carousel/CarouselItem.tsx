import React from "react";
import { ProjectGif, ProjectGifContainer } from "./styled";

export const CarouselItem = ({ src }) => {
  return (
    <ProjectGifContainer>
      <ProjectGif src={src} />
    </ProjectGifContainer>
  );
};
