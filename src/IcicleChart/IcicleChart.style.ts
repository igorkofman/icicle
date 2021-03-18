import styled from "styled-components";

export const Container = styled.div`
  position: relative;
`;

export const StyledRect = styled.rect<{ $highlighted: boolean }>`
  ${(props) =>
    props.$highlighted
      ? `
  filter:url(#shadow);
  `
      : ""}
`;
