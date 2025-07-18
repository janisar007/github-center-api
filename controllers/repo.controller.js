// const { Octokit } = require("@octokit/rest");

import { Octokit } from "octokit";


export const getAllRepo = async (req, res) => {

    const pat = "";

  if (!pat) {
    return res.status(400).json({ error: "PAT is required" });
  }

  const octokit = new Octokit({ auth: pat });

  try {
    // Fetch all repos (paginated)
    const repos = await octokit.paginate(octokit.rest.repos.listForAuthenticatedUser);
    res.json({ repos });
  } catch (err) {
    res.status(401).json({ error: "Invalid PAT" });
  }



}