/*
  This function computes the COMBINED weights of all the votes. In
  use, the upvotes's weights are added to a score, and the downvotes's
  weights are removed from a score. The higher the score, the higher
  the post will be in the "Top" section. Also, the post will not be
  displayed in the "Top" section if the score is less than 2.

  Weights for each vote are computed like so:
  - If the vote is older than 7 days, it is only given a weight of 1.
  - If the vote is less than a week old, the weight is somewhere
    between 1-5. The more recent that a vote was added, the higher
    the weight. Therefore, If a vote was just added, the weight is
    5. If a vote was added a week ago, the weight is 1. If a vote
    is from 3 days ago, the weight will be about 3.29.
*/

const recentTime = 1000 * 60 * 60 * 24 * 7; // // ms * minutes * hours * days * weeks
const maxWeight = 5;

module.exports = function getVoteWeights(votes) {
  const currDate = Date.now();
  
  const recentCutOff = currDate - recentTime;
  
  return votes.reduce((previousTotal, currentVote) => {      
    let weight = 0;

    weight = 1 + Math.max(
      0,
      ((currentVote.timestamp - recentCutOff) / recentTime) * 4
    )
  
    return previousTotal + weight;
  }, 0);
}