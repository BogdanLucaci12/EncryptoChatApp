import styled from "styled-components";
export const ReceiverMessage = styled.div`
  max-width: 50%;
  min-width:20%;
  height: auto;
  color: white;
  background-color: black;
  border-top-left-radius: 1em;
  border-bottom-right-radius: 1em;
  padding: 0.3em;
  margin-right: auto;
  diplat:flex;
  & img{
  max-width:15em;
  max-height:15em;
    }
`;


export const SenderMessage=styled(ReceiverMessage)`
color:black;
background-color:white;
border-top-right-radius:1em;
border-bottom-left-radius:1em;
border-top-left-radius:0em;
border-bottom-right-radius:0em;
margin-right: 0;
margin-left: auto; 
max-width: 50%;
`

