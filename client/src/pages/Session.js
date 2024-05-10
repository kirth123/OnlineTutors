import Videoplayer from "./Videoplayer";
import Options from "./Options";
import { ContextProvider } from "./Context";
import { Checklogin } from "./Checklogin";
import Whiteboard from './Whiteboard';

function Session() {
  return (
      <div>
        <Checklogin/>
        <ContextProvider>
          <Videoplayer/>
          <Options/>
          <Whiteboard/>
        </ContextProvider> 
      </div>
  );
}
export default Session;