import { add, commit, init, log, status, statusMatrix } from "isomorphic-git";
import LightningFS from "@isomorphic-git/lightning-fs";

export class GitService {
  public readonly author = {
    name: "Sara Ramirez",
    email: "sara.ramirez@example.com",
  };
  public readonly dir: string = "/";
  public readonly fs: any;
  public readonly pfs: any;

  constructor(dir = "/") {
    this.dir = dir;
    this.fs = new LightningFS(this.dir);
    this.pfs = this.fs.promises;
  }

  async init() {
    const initResult = await init({ fs: this.fs, dir: this.dir });
    console.log("initResult", initResult);
    console.log(`Initialized empty Git repository in ${this.dir}`);

    const addFileResult = await this.pfs.writeFile(
      this.dir + "/README.md",
      "# README"
    );
    console.log("addFileResult", addFileResult);

    const addResult = await this.add("README.md");
    console.log("addResult", addResult);

    const commitResult = await this.commit(this.dir, "Initial commit");
    console.log("commitResult", commitResult);

    const logResult = await this.log(this.dir);
    console.log("logResult", JSON.stringify(logResult));
  }

  async add(filepath: string) {
    return await add({ fs: this.fs, dir: this.dir, filepath }).catch((err) =>
      console.log("GitService add err", err)
    );
  }

  async commit(dir: string, message: string) {
    try {
      return await commit({
        fs: this.fs,
        dir,
        message,
        author: this.author,
      });
    } catch (err) {
      console.log("GitService commit err", err);
    }
  }

  async status(dir: string, filepath: string) {
    try {
      return await status({ fs: this.fs, dir, filepath });
    } catch (err) {
      console.log("GitService status err", err);
    }
  }

  async statusMatrix(dir: string) {
    try {
      return await statusMatrix({ fs: this.fs, dir });
    } catch (err) {
      console.log("GitService statusMatrix err", err);
    }
  }

  async log(dir: string) {
    console.log("log dir", dir);
    return await log({ fs: this.fs, dir });
  }
}
