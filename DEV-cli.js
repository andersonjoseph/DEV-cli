const cli = require('commander');
const chalk = require('chalk');

const request = require('./lib/request.js');
const helper = require('./lib/helpers.js');

const log = console.log;

cli
    .version('1.0.0')
    .option('-i, --index', 'get posts of dev.to index')
    .option('-u, --user <name>', 'get posts of given user')
    .option('-t, --tag <tag>', 'get posts tagged with the given tag')
    .option('-n, --number <num>', 'get a specific number of posts(default:10)')
    .option('-U, --url <url>', 'show the post of given url')
    .parse(process.argv);

// default number of posts: 10
const n = cli.number || 10;

if (cli.user) {
  log(chalk.green('[!] Requesting posts by: '+ cli.user));

  helper.show(request.getUserPosts, cli.user, n)
      .catch( (err) => {
        log(chalk.red(err));
      });
}

if (cli.tag) {
  log(chalk.green('[!] Requesting with tag: '+ cli.tag));

  helper.show(request.getTagPosts, cli.tag, n)
      .catch((err) => {
        log(chalk.red(err));
      });
}

if (cli.url) {
  log(chalk.green('[!] Requesting post from: '+ cli.url));

  (async function() {
    const [namePost, bodyPost] = await request.getPost(cli.url);
    log(helper.toPlainText(bodyPost));

    helper.exportToMD(namePost, bodyPost);
  })()
      .catch((err) => {
        log(chalk.red(err));
      });
}

// if none args were provided, get posts from dev.to index
if (cli.rawArgs.length == 2 || cli.index) {
  log(chalk.green('[!] Posts from index'));

  helper.show(request.getIndexPosts, n)
      .catch( (err) => {
        log(chalk.red(err));
      });
}
