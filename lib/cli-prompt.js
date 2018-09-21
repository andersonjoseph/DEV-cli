const inquirer = require('inquirer');
inquirer.registerPrompt('selectLine', require('inquirer-select-line'));

const helper = require('./helpers.js');


async function showList(posts) {
  const mapPosts = helper.postsToMap(posts);

  const list = await inquirer
      .prompt([{
        type: 'list',
        message: 'Select a post',
        name: 'postSelected',
        pagesize: 10,
        choices: [...mapPosts.keys()],
      }]);

  // returl url of selected post
  return mapPosts.get(list.postSelected);
}

async function toBeExported() {
  const confirm = await inquirer
      .prompt([{
        type: 'confirm',
        message: 'Export to Markdown?',
        name: 'answer',
        default: false,
      }]);

  return confirm.answer;
}

exports.showList = showList;
exports.toBeExported = toBeExported;
