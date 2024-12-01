import express from "express";
import { Octokit } from "@octokit/rest";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { createAppAuth } from "@octokit/auth-app";

// Initialize dotenv
dotenv.config();

// Initialize Express app
const app = express();
const PORT = 3002;

// Middleware
app.use(bodyParser.json());

// Initialize Octokit with your GitHub personal access token
const octokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: 1074374,
    privateKey: process.env.PRIVATE_KEY,
    installationId: 57821280,
  },
});

// Endpoint to add a comment to a GitHub issue
app.post("/add-comment", async (req, res) => {
  const { owner, repo, issue_number, comment } = req.body;

  if (!owner || !repo || !issue_number || !comment) {
    return res.status(400).json({
      error: "Please provide 'owner', 'repo', 'issue_number', and 'comment' in the request body.",
    });
  }

  try {
    const response = await octokit.issues.createComment({
      owner,
      repo,
      issue_number,
      body: comment,
    });

    return res.status(200).json({
      message: "Comment added successfully!",
      comment: response.data,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({
      error: "Failed to add comment. Please check your inputs and try again.",
    });
  }
});

// New endpoint to add labels to a GitHub issue
app.post("/add-labels", async (req, res) => {
  const { owner, repo, issue_number, labels } = req.body;

  if (!owner || !repo || !issue_number || !labels) {
    return res.status(400).json({
      error: "Please provide 'owner', 'repo', 'issue_number', and 'labels' in the request body.",
    });
  }

  try {
    const response = await octokit.rest.issues.addLabels({
      owner,
      repo,
      issue_number,
      labels,
    });

    return res.status(200).json({
      message: "Labels added successfully!",
      labels: response.data,
    });
  } catch (error) {
    console.error("Error adding labels:", error);
    return res.status(500).json({
      error: "Failed to add labels. Please check your inputs and try again.",
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
