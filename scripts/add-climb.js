const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const prompts = require('prompts');
const isUrl = require('is-url');
const titlecase = require('lodash.startcase');
const { tickTypeEnum } = require('../src/constants');

const writeFile = promisify(fs.writeFile);

const filename = path.join(__dirname, '../src', 'climbs.json');

const climbs = require('../src/climbs.json');

(async () => {
  const climb = await prompts([
    {
      type: 'text',
      name: 'theCragUrl',
      message: 'Please enter thecrag url',
      validate: (value) => isUrl(value),
    },
    {
      type: 'date',
      name: 'date',
      message: 'When did you climb it?',
      initial: new Date(),
    },
    {
      type: 'select',
      name: 'type',
      message: 'Please select type of send',
      choices: tickTypeEnum.map((item) => ({
        title: titlecase(item),
        value: item,
      })),
    },
    {
      type: 'text',
      name: 'remark',
      message: 'Add a remark',
    },
  ]);

  console.log(JSON.stringify(climb, null, 2)); //eslint-disable-line
  const { confirm } = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: 'Add this climb?',
    initial: true,
  });

  if (confirm) {
    climbs.push(climb);
    climbs.sort((a, b) => new Date(a.date) - new Date(b.date));
    await writeFile(filename, JSON.stringify(climbs, null, 2));
  }
})();
