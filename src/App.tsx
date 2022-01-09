import React, { useCallback } from "react";
import "./App.css";
import debounce from "lodash.debounce";
import { getFileSearchResult } from "./fileService";

const getFilesList = async (
  prefixQuery: string,
  resultCount: number,
  setIsLoading: (isLoading: boolean) => void,
  setIsErrored: (isErrored: boolean) => void,
  setFilesList: (filesList: string[]) => void
) => {
  setIsLoading(true);
  try {
    const result = await getFileSearchResult(prefixQuery, resultCount);
    setFilesList(result);
  } catch (error) {
    setIsErrored(true);
  }
  setIsLoading(false);
};

const debouncedGetFilesList = debounce(getFilesList, 300, {
  leading: false,
  trailing: true,
});

const getOnChangeResultsCountCallback = (setResultsCount: (resultsCount: number) => void) => (e: any) => {
  const parsedCount = parseInt(e?.currentTarget?.value);
  console.log({
    parsedCount,
    isNumber: !isNaN(parsedCount),
    remainder: parsedCount & 1,
    isWholeNumber: (parsedCount & 1) === 0,
  });
  !isNaN(parsedCount) && setResultsCount(parsedCount);
}

export const App: React.FC = () => {
  // TODO: Extract to a custom `useAppState` hook.
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isErrored, setIsErrored] = React.useState<boolean>(false);
  const [filesList, setFilesList] = React.useState<string[]>([]);
  const [prefixQuery, setPrefixQuery] = React.useState<string>("");
  const [resultCount, setResultsCount] = React.useState<number>(7);
  const [selectedFileIndex, setSelectedFileIndex] = React.useState<
    number | null
  >(null);


  /**
   * Ran out of time before I could diagnose the issue here!
   */
  // const keyHandler = (e: KeyboardEvent) => {
  //   console.log(`Pressed ${e.key}`);
  //   if (isLoading) {
  //     return;
  //   }
  //   console.log({ key: e.key });
  //   if (e.key === "ArrowDown") {
  //     (selectedFileIndex || 0) < filesList.length - 1 &&
  //       setSelectedFileIndex((selectedFileIndex || 0) + 1);
  //   }
  //   if (e.key === "ArrowUp") {
  //     selectedFileIndex !== 0 &&
  //       setSelectedFileIndex((selectedFileIndex || 0) - 1);
  //   }
  // };

  React.useEffect(() => {
    debouncedGetFilesList(
      prefixQuery,
      resultCount,
      setIsLoading,
      setIsErrored,
      setFilesList
    );
  }, [prefixQuery, resultCount]);

  /**
   * Full disclosure: I'm a little rusty on hooks since I've been stuck at React 16.3 for the last two years
   * Would be fun to debug how to get a global key handler working though!
   */
  // React.useEffect(() => {
  //   console.log("Registering binds");
  //   document.addEventListener("keydown", keyHandler);
  //   return document.removeEventListener("keydown", keyHandler);
  // }, []);

  return (
    <div className="app">
      <header className="app-header">
        <p>What's in my node modules?</p>
        <div className="inputs-container">
          <div>
            <label htmlFor="prefixQueryInput">Find by prefix: </label>
            <input
              id="prefixQueryInput"
              value={prefixQuery}
              onChange={(e) => setPrefixQuery(e.currentTarget.value)}
            />
          </div>
          <div>
            <label htmlFor="resultCountInput">Result count: </label>
            <input
              id="resultCountInput"
              type="number"
              value={resultCount}
              onChange={getOnChangeResultsCountCallback(setResultsCount)}
            />
          </div>
        </div>
        <div className="content-container">
          {isLoading ? (
            <div className="loading-spinner">💾</div>
          ) : isErrored ? (
            <div>Error loading file list!</div>
          ) : (
            <div className="files-list">
              {filesList &&
                filesList.map((filePath, index) => (
                  <div
                    key={`file-result-${index}`}
                    className={
                      "file-result" +
                      (index === selectedFileIndex ? " selected" : "")
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
