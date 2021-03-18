import React from "react";
import useFitText from "use-fit-text";
import { TextContainer } from "./TextBox.style";

const TextBox: React.FC<{ width: number; height: number; text: string }> = ({
  width,
  height,
  text,
}) => {
  const { fontSize, ref } = useFitText();

  if (height < 8) {
    return null;
  }

  return (
    <foreignObject width={width} height={height}>
      <TextContainer
        ref={ref}
        width={width}
        height={height}
        style={{ fontSize }}
      >
        {text}
      </TextContainer>
    </foreignObject>
  );
};

export default TextBox;
