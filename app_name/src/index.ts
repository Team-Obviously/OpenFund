// @ts-nocheck
import { Probot } from "probot";
const BASE_URL = "http://localhost:3001/api/bot"

const fetchFunction = (path,body) => {
  fetch(`${BASE_URL}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export default (app: Probot) => {

  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    await context.octokit.issues.createComment(issueComment);
  });

  app.on("issue_comment.created", async (context) => {
    let comment = context.payload.comment;
    comment['body']+= "Issue number: " + context.payload.issue.number;
    const issueNumber = context.payload.issue.number;
    const repo = context.repo();
    const issueTitle = context.payload.issue.title;

    console.log(`New comment on issue #${issueNumber}: ${comment.body}`);

    if (comment.body.includes("@openfund-bot")) {
      console.log("Bot was mentioned in the comment");
      fetchFunction("comment", {
        ...comment,
        repository: repo.repo,
        owner: repo.owner,
        issueTitle: issueTitle
      })
    }
  });

  app.on("issues.closed", async (context) => {
    const issue = context.payload.issue;
    
    

    const repo = context.repo();

    const searchResult = await context.octokit.search.issuesAndPullRequests({
      q: `${issue.number} type:pr repo:${repo.owner}/${repo.repo}`,
    });

    const linkedPRs = searchResult.data.items.filter(item => item.pull_request);

    // Get unique contributors from the linked PRs
    const contributors = new Set<string>();
    for (const pr of linkedPRs) {
      if (pr) {
        contributors.add(pr.user.login);

        // Get PR reviews to find additional contributors
        const reviews = await context.octokit.pulls.listReviews({
          ...repo,
          pull_number: pr.number,
        });

        reviews.data.forEach(review => {
          contributors.add(review.user.login);
        });
      }
    }

    console.log(`Issue #${issue.number} was closed`);
    console.log('Linked PRs:', linkedPRs.map(pr => `#${pr.number}`).join(', ') || 'None');
    console.log('Contributors:', Array.from(contributors).join(', ') || 'None');

    fetchFunction("closed",{
      issue: issue,
      contributors: Array.from(contributors),
      linkedPRs: Array.from(linkedPRs)
    })
  });
};
