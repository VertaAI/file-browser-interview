// @ts-ignore
import React, { useCallback } from "react";
import "./App.css";
import debounce from "lodash.debounce";
import { getFileSearchResult } from "./fileService";

const getFilesList = async (
  appState: Record<string, any>,
  setAppState: (appState: Record<string, any>) => void
) => {
  setAppState({...appState, isLoading: true });
  try {
    const result = await getFileSearchResult(appState.prefixQuery, appState.resultCount);
    setAppState({...appState, filesList: result, isLoading: false });
  } catch (error) {
    setAppState({...appState, filesList: [], isLoading: false, isErrored: true });
  }
};

const debouncedGetFilesList = debounce(getFilesList, 300, {
  leading: false,
  trailing: true,
});

const getOnChangeResultsCountCallback = (setAppState: (appState: Record<string, any>) => void) => (e: any) => {
  const parsedCount = parseInt(e?.currentTarget?.value);
  // @ts-ignore
  !isNaN(parsedCount) && setAppState((appState) => ({ ...appState, resultCount: parsedCount }));
}

export const App: React.FC = () => {
  const [appState, setAppState] = React.useState({
    isLoading: true,
    isErrored: false,
    filesList: [],
    prefixQuery: "",
    resultCount: 7,
    selectedFileIndex: 0
  })
  const isFirstLoadRef = React.useRef(true);
  const queryRef = React.useRef("");
  const resultCountRef = React.useRef(7);


  const keyHandler = (e: KeyboardEvent) => {
    // @ts-ignore
    setAppState((appState) => {
      const { isLoading, selectedFileIndex, filesList } = appState
      if (isLoading) {
        return;
      }
      if (e.key === "ArrowDown") {
        if (selectedFileIndex < filesList.length - 1) {
          return { ...appState, selectedFileIndex: selectedFileIndex + 1 };
        }
      }
      if (e.key === "ArrowUp") {
        if (selectedFileIndex > 0) {
          return { ...appState, selectedFileIndex: selectedFileIndex - 1 };
        }
      }
      return appState
    });
  };

  React.useEffect(() => {
    if (isFirstLoadRef.current || appState.prefixQuery !== queryRef.current || appState.resultCount !== resultCountRef.current) {
      isFirstLoadRef.current = false
      queryRef.current = appState.prefixQuery
      resultCountRef.current = appState.resultCount
      debouncedGetFilesList(
        appState,
        // @ts-ignore
        setAppState
      );
    }
  }, [appState]);

  /**
   * Full disclosure: I'm a little rusty on hooks since I've been stuck at React 16.3 for the last two years
   * Would be fun to debug how to get a global key handler working though!
   */
  React.useEffect(() => {
    document.addEventListener("keydown", keyHandler);
    return () => {document.removeEventListener("keydown", keyHandler)};
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <p>What's in my node modules?</p>
        <div className="inputs-container">
          <div>
            <label htmlFor="prefixQueryInput">Find by prefix: </label>
            <input
              id="prefixQueryInput"
              disabled={appState.isLoading}
              value={appState.prefixQuery}
              onChange={(e) => setAppState({...appState, prefixQuery: e.currentTarget.value})}
            />
          </div>
          <div>
            <label htmlFor="resultCountInput">Result count: </label>
            <input
              id="resultCountInput"
              type="number"
              value={appState.resultCount}
              disabled={appState.isLoading}
              // @ts-ignore
              onChange={getOnChangeResultsCountCallback(setAppState)}
            />
          </div>
        </div>
        <div className="content-container">
          {appState.isLoading ? (
            <div className="loading-spinner">💾</div>
          ) : appState.isErrored ? (
            <div>Error loading file list!</div>
          ) : (
            <div className="files-list">
              {appState.filesList &&
                appState.filesList.map((filePath, index) => (
                  <div
                    key={`file-result-${index}`}
                    className={
                      "file-result" +
                      (index === appState.selectedFileIndex ? " selected" : "")
                    }
                  >
                    {filePath}
                  </div>
                ))}
            </div>
          )}
        </div>
      </header>
    </div>
  );
};
