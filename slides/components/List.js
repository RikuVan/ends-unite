import styled, { css } from "styled-components"

const listStyles = () => css`
  & > li {
    text-align: left;
  }
  font-size: 1.2em;
`

export const OrderedList = styled("ol")`
  ${listStyles}
`

export const UnorderedList = styled("ul")`
  ${listStyles}
  list-style-type:none;
`
