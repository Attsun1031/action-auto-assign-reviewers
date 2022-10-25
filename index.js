module.exports = ({github, context, inputs}) => {
  console.log("Start Auto assing reviewers action. pull-request-number=${{ inputs.pull-request-number }}")

  const ignoreUsers = "${{ inputs.ignore-users }}".split(",").map(s => s.trim()).filter(x => x !== "")

  // Get PR
  const responseGetPr = await github.rest.pulls.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: ${{ inputs.pull-request-number }}
  })
  if (responseGetPr.status !== 200) {
    throw new Error(`Failed to get PR. Status is ${response.status}`)
  }
  const pr = responseGetPr.data
  console.log("Respose of github.rest.pulls.get")
  console.log(pr);
  if (pr.user !== null) {
    // Ignore PR author
    ignoreUsers.push(pr.user.login)
  }

  // List related commits
  const response = await github.rest.pulls.listCommits({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: ${{ inputs.pull-request-number }}
  })
  console.log("Respose of github.rest.pulls.listCommits")
  console.log(response)
  if (response.status !== 200) {
    throw new Error(`status is ${response.status}`)
  }

  // List commiters
  const commits = response.data
  const reviewerLogins = []
  for (const cm of commits) {
    const commiter = cm.author.login
    if (cm.author === undefined || cm.author === null || commiter === undefined || commiter === null) {
      continue
    }

    if (!reviewerLogins.includes(commiter) && !ignoreUsers.includes(commiter)) {
      reviewerLogins.push(commiter)
    }
  }
  console.log("Reviewers: ", reviewerLogins)

  if (reviewerLogins.length > 0) {
    // Assign commiters as reviewer
    const review_request_response = await github.rest.pulls.requestReviewers({
      owner: context.repo.owner,
      repo: context.repo.repo,
      reviewers: reviewerLogins,
      pull_number: ${{ inputs.pull-request-number }}
    })
    console.log(review_request_response)
  } else {
    console.log("No reviewers found")
  }
}

