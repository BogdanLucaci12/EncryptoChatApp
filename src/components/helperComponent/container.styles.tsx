import styled from 'styled-components'

export const FlexibleContainer=styled.div`
width:90vw;
height:90vh;
border-radius:2em;
box-shadow: 0px 3px 24px 14px rgba(0,0,0,0.1);
display: flex;
flex-direction: row;
`

export const SearchContainer=styled.div`
width:20vw;
min-height:7vh;
position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius:1em;
box-shadow: 0px 0px 20px 7px rgba(0,0,0,0.1);
z-index:30;
display: flex;
flex-direction: column;
align-items: center;
padding-top:.5em;
background-color:white;
`