const fs = require('fs');

const html2plaintext = require('html2plaintext');
const TurndownService = require('turndown');

const request = require('./request.js');
const prompt = require('./cli-prompt.js');

const log = console.log;

// return a Map {'nameOfPost | by: Author | 20 ♥' => 'urlPost'}
function postsToMap(posts) {
  let mapPosts = new Map();

  posts.forEach( (post) => {
    let option = post.title + ' | by: ' +
                  post.user.username + ' | ' +
                  post.positive_reactions_count + ' ♥';

    mapPosts.set(option, 'https://dev.to'+post.path);
  });

  return mapPosts;
}

function toPlainText(articleBody) {
  return html2plaintext(articleBody);
}

function toMD(articleBody) {
  const turndown = new TurndownService();
  return turndown.turndown(articleBody);
}

async function exportToMD(namePost, bodyPost) {
  const exportConfirmed = await prompt.toBeExported();
  const path = namePost.replace(/[ \/\\|:"<>]/g, '_') + '.md';

  if (exportConfirmed) {
    fs.writeFileSync(path, toMD(bodyPost), 'utf8');
  }
}

async function show(getter, ...args) {
  const posts = await getter.apply(this, args);
  const postSelected = await prompt.showList(posts);
  const [namePost, bodyPost] = await request.getPost(postSelected);

  log(toPlainText(bodyPost));

  exportToMD(namePost, bodyPost);
}

exports.postsToMap = postsToMap;
exports.toPlainText = toPlainText;
exports.toMD = toMD;
exports.exportToMD = exportToMD;
exports.show = show;
