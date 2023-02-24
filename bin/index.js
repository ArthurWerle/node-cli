#! /usr/bin/env node

import chalk from 'chalk'
import boxen from 'boxen'
import { translate } from '@vitalets/google-translate-api'
import yargs from 'yargs'
import figlet from 'figlet'

const ERROR_MESSAGES = {
  'TooManyRequestsError': '\n you reach the limit of requests',
  'BadRequest': '\n there was an error trying to translate your text, please check that the language you entered is valid or the spell is not right'
}

const usage = chalk.keyword('violet')("\nUsage: translate --text <sentence> --to <to-language>\n" +
  boxen(chalk.green("\n" + "Translates a sentence to specific language" + "\n"), {
    padding: 1,
    borderColor: 'green',
    dimBorder: true
  }) + "\n");

const buildArgs = () => {
  const argv = yargs(process.argv.slice(2)).argv;

  return () => argv
}

const getArgs = buildArgs()

const setOptions = () => {
  yargs()
    .usage(usage)
    .option("text", {
      describe: "Sentence to be translated",
      type: "string",
      demandOption: false
    })
    .option("to", {
      alias: "to-language",
      describe: "Translate to language",
      type: "string",
      demandOption: false
    })
    .help(true)
    .argv;
}

const validateArgs = () => {
  if (getArgs().language == null && getArgs().to == null) {
    console.log(
      chalk.yellow(
        figlet.textSync('CLI Translator', {
          horizontalLayout: 'full'
        })
      )
    )
  
    yargs().showHelp()
    return 
  }
  
  if (getArgs().text == null) {
    yargs().showHelp()
    return
  }
}

const translateText = async () => {
  const language = getArgs().to || getArgs().language
  const sentence = getArgs().text

  if (!sentence) return

  try {
    const response = await translate(sentence, { to: language.toLowerCase() })

    const { raw: { src }, text } = response
    console.log("\n" + boxen(chalk.green(src + ': ' + sentence + "\n\n" + language + ': ' + text), {
      padding: 1,
      borderColor: 'green',
      dimBorder: true
    }) + "\n");
    
  } catch (error) {
    console.log("\n" + 
      boxen(
        chalk.red(chalk.red(figlet.textSync('Error', { width: 60 })), ERROR_MESSAGES[error.name]), 
        {
          padding: 1,
          borderColor: 'red',
          dimBorder: false
        }
      ) + "\n");
  }
}

setOptions()
validateArgs()
translateText()