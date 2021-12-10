module.exports = ({github, context, prNum}) => {
  // List related commits
  const response = await github.rest.pulls.listCommits({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: prNum
  })
  console.log(response)
  if (response.status !== 200) {
    throw new Error(`status is ${response.status}`)
  }

  // List commiters
  const commits = response.data
  const reviewer_logins = []
  for (const cm of commits) {
    if (!reviewer_logins.includes(cm.author.login)) {
      reviewer_logins.push(cm.author.login)
    }
  }
  console.log("Reviewers: ", reviewer_logins)

  // Assign commiters as reviewer
  const review_request_response = await github.rest.pulls.requestReviewers({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: prNum
    reviewers: reviewer_logins
  })
  console.log(review_request_response)
}

