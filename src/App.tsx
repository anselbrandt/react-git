import { useRef, useState } from "react";
import git from "isomorphic-git";
import LightningFS from "@isomorphic-git/lightning-fs";

const useConstructor = (callBack = () => {}) => {
  const hasBeenCalled = useRef(false);
  if (hasBeenCalled.current) return;
  callBack();
  hasBeenCalled.current = true;
};

const author = {
  name: "author name",
  email: "name@email.com",
};

function App() {
  const dir = "/";
  let fs: any;
  let pfs: any;

  async function add(filepath: string) {
    return await git
      .add({ fs: fs, dir: dir, filepath })
      .catch((err: any) => console.log("GitService add err", err));
  }

  async function commit(dir: string, message: string) {
    try {
      return await git.commit({
        fs: fs,
        dir,
        message,
        author: author,
      });
    } catch (err) {
      console.log("GitService commit err", err);
    }
  }

  async function log(dir: string) {
    console.log("log dir", dir);
    return await git.log({ fs: fs, dir });
  }

  useConstructor(async () => {
    fs = new LightningFS(dir);
    pfs = fs.promises;
  });
  const [message, setMessage] = useState<any | undefined>();

  const handleInit = async () => {
    const initResult = await git.init({ fs: fs, dir: dir });
    console.log("initResult", initResult);
    console.log(`Initialized empty Git repository in ${dir}`);

    const addFileResult = await pfs.writeFile(dir + "/README.md", "# README");
    console.log("addFileResult", addFileResult);

    const addResult = await add("README.md");
    console.log("addResult", addResult);

    const commitResult = await commit(dir, "Initial commit");
    console.log("commitResult", commitResult);

    const logResult = await log(dir);
    console.log("logResult", JSON.stringify(logResult));
  };

  const handleLog = async () => {
    try {
      const logs = await await git.log({ fs: fs, dir });
      console.log({ logs });
    } catch (error) {
      setMessage(error);
    }
  };
  return (
    <div>
      <div style={{ marginTop: 20 }}>
        <button onClick={handleInit}>Initialize Repo</button>
        <button onClick={handleLog}>Log Messages</button>
      </div>
      <div>
        <pre>{message && JSON.stringify(message, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
