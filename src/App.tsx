import { useState } from "react";
import git from "isomorphic-git";
import LightningFS from "@isomorphic-git/lightning-fs";
import http from "isomorphic-git/http/web";

let fs = new LightningFS("fs");
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function App() {
  const dir = "/tutorial";
  // let fs: any;

  // useConstructor(async () => {
  //   fs = new LightningFS("fs");
  // });
  const [message, setMessage] = useState<any | undefined>();

  const handleInit = async () => {
    try {
      await fs.promises.mkdir(dir);
      setMessage("File system initialized!");
    } catch (error) {
      if (error) setMessage(error);
    }
  };

  const handleWrite = async () => {
    try {
      const file = {
        name: "/tutorial/textfile.txt",
        contents: "sample text file contents",
      };
      await fs.promises.writeFile(file.name, encoder.encode(file.contents));
      setMessage("File written!");
    } catch (error) {
      if (error) setMessage(error);
    }
  };

  const handleLs = async () => {
    try {
      const files = await fs.promises.readdir(dir);
      setMessage(files);
    } catch (error) {
      if (error) setMessage(error);
    }
  };

  const handleRead = async () => {
    try {
      const file = await fs.promises.readFile("/tutorial/textfile.txt");
      setMessage(decoder.decode(file));
    } catch (error) {
      if (error) setMessage(error);
    }
  };

  const handleClone = async () => {
    try {
      const options = {
        fs: new LightningFS("fs"),
        http,
        dir,
        corsProxy: "https://cors.isomorphic-git.org",
        url: "https://github.com/isomorphic-git/isomorphic-git",
        ref: "main",
        singleBranch: true,
        depth: 10,
      };
      await git.clone(options);
      setMessage("Repo cloned!");
    } catch (error) {
      if (error) {
        setMessage(error);
        console.error(error);
      }
    }
  };

  const handleLog = async () => {
    try {
      const logs = await git.log({ fs, dir });
      setMessage(logs);
    } catch (error) {
      setMessage(error);
    }
  };

  const handleStatus = async () => {
    try {
      const status = await git.status({ fs, dir, filepath: "README.md" });
      setMessage(status);
    } catch (error) {
      setMessage(error);
    }
  };

  const handleWipe = async () => {
    setMessage("IndexedDB Cleared");
    console.clear();
    // @ts-ignore
    fs = new LightningFS("fs", { wipe: true });
  };

  return (
    <div>
      <div style={{ marginTop: 20 }}>
        <button onClick={handleInit}>Initialize File System</button>
        <button onClick={handleWrite}>Write File</button>
        <button onClick={handleLs}>List Files</button>
        <button onClick={handleRead}>Read File</button>
        <button onClick={handleClone}>Clone Repo</button>
        <button onClick={handleLog}>Read Git Log</button>
        <button onClick={handleStatus}>README.md Status</button>
        <button onClick={handleWipe}>Clear IndexedDB</button>
      </div>
      <div>
        <pre>{message && JSON.stringify(message, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
