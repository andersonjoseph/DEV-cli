const request = require('request-promise');

// eslint-disable-next-line
const urlAPI = 'https://ye5y9r600c-3.algolianet.com/1/indexes/ordered_articles_production/query?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.20.3&x-algolia-application-id=YE5Y9R600C&x-algolia-api-key=OTU1YjU5MWNlZTk1MjQ0YmExOTRjZmY4NDM2ZTM2YWZiYTM2ODA2NThhMzNjMDkzYTEzYjFmNDY0MDcwNjRkOHJlc3RyaWN0SW5kaWNlcz1zZWFyY2hhYmxlc19wcm9kdWN0aW9uJTJDVGFnX3Byb2R1Y3Rpb24lMkNvcmRlcmVkX2FydGljbGVzX3Byb2R1Y3Rpb24lMkNvcmRlcmVkX2FydGljbGVzX2J5X3B1Ymxpc2hlZF9hdF9wcm9kdWN0aW9uJTJDb3JkZXJlZF9hcnRpY2xlc19ieV9wb3NpdGl2ZV9yZWFjdGlvbnNfY291bnRfcHJvZHVjdGlvbiUyQ29yZGVyZWRfY29tbWVudHNfcHJvZHVjdGlvbg%3D%3D';

let data = {
  params: undefined,
};

const options = {
  method: 'POST',
  url: urlAPI,
  body: data,
  json: true,
};

async function requestPosts() {
  const body = await request(options);
  let posts = JSON.stringify(body);
  posts = JSON.parse(posts);
  return posts.hits;
}

async function getIndexPosts(n) {
  // eslint-disable-next-line
  data.params = `query=*&hitsPerPage=${n}&page=0&attributesToHighlight=%5B%5D&tagFilters=%5B%5D&`;

  return requestPosts();
}

async function getUserPosts(username, n) {
  // scrap userID inside user profile
  const userpage = await request(`https://dev.to/${username}`);
  const userID = userpage.match(/user_\d+/)[0];

  // eslint-disable-next-line
  data.params = `query=*&hitsPerPage=${n}&page=0&attributesToHighlight=%5B%5D&tagFilters=%5B%22${userID}%22%5D`;

  return requestPosts();
}

async function getTagPosts(tag, n) {
  // eslint-disable-next-line
  data.params = `query=*&hitsPerPage=${n}&page=0&attributesToHighlight=%5B%5D&tagFilters=%5B%22${tag}%22%5D`;

  return requestPosts();
}

async function getPost(url) {
  const body = await request(url);

  // eslint-disable-next-line
  const bodyPost = body.match(/(<html><body>)[\s\S]*(article-reaction-actions)/)[0];
  const namePost = body.match(/>.+(?=<\/title>)/)[0];

  return [namePost, bodyPost];
}

exports.getIndexPosts = getIndexPosts;
exports.getUserPosts = getUserPosts;
exports.getTagPosts = getTagPosts;
exports.getPost = getPost;
