import React from 'react';
import logo from './logo.svg';
import './App.css';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [filesList, setFilesList] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [resultCount, setResultsCount] = React.useState<number>(7);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          What's in my node modules?
        </p>
        {/* <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
      <div>
        
      </div>
    </div>
  );
}