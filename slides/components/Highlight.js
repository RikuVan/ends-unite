import styled from "styled-components"

export const Hi = styled("span")`
  color: ${({ light }) => (light ? "#ff96ff" : "#ff00ff")};
`
