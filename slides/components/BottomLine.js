import styled from "styled-components"

export const BottomLine = styled("div")`
  background: ${({ light }) => (light ? "#ff96ff" : "#ff00ff")};
  padding: 10px 20px;
  border-radius: 4px;
  p {
    color: white;
    font-size: 2rem;
  }
  width: 100%;
`
