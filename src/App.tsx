import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import './store/singleton/authInfo'
import PrivateStateWithMST from './modules/PrivateStateWithMST';
import Demo from './Demo';
import Demo2 from './Demo2';
import Demo3 from './Demo3';
import Demo5 from './Demo5';

const contextValue = {a: 1};
const ScopeContext = React.createContext(contextValue);
setTimeout(() => {
  contextValue.a = 2;
}, 3 * 1000)

const ScopeContextProvider = ({children}: {children: React.ReactNode}) => {
  const [contextValue, setCC] = useState({a: 1});
  React.useEffect(() => {
    setTimeout(() => {
      setCC({a: 2})
    }, 3 * 1000)
  }, [contextValue])
  return <ScopeContext.Provider value={contextValue}>
    {children}
  </ScopeContext.Provider>
}


function Test() {
  const [_, refresh] = useState(0)
  const contextA = React.useContext(ScopeContext).a;
  return <div onClick={() => refresh(_ + 1)}>{contextA}</div>
}

function App() {
  
  return (
    <ScopeContextProvider>
      <div className="App">
        <header className="App-header">
          <Test />
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {/* <Demo />
          <Demo2 /> */}
          {/* <Demo3 /> */}
          <Demo5 />
        </header>
      </div>
    </ScopeContextProvider>
  );
}

export default App;
