// @ts-nocheck
import { Probot } from "probot";

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

    console.log(`New comment on issue #${issueNumber}: ${comment.body}`);

    if (comment.body.includes("@openfund-bot")) {
      console.log("Bot was mentioned in the comment");
      fetch("http://localhost:3001/api/bot/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
      })
    }
  });

  app.on("issues.closed", async (context) => {
    const issue = context.payload.issue;
    const repo = context.repo();

    // Get linked PRs through the search API
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
  });
};
