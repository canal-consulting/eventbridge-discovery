import { ArrowParens, TrailingComma } from 'projen/lib/javascript/prettier';

const { awscdk, TextFile } = require('projen');

const cdkVersion = '2.46.0';
const projenVersion = 'v0.63.23';
const constructsVersion = '10.1.131';
const nodejsVersion = 'v16.17.1';
const commonIgnore = ['.idea', '.Rproj', '.vscode', 'cdk.context.json', '.DS_Store', 'data/events/', 'poetry.lock'];
const deps = [`aws-cdk-lib@${cdkVersion}`, `constructs@${constructsVersion}`];

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Bryan Galvin',
  authorAddress: 'bryan.galvin@bestegg.com',
  defaultReleaseBranch: 'main',
  name: 'eventbridge-discovery',
  repositoryUrl: 'https://github.com/canal-consulting/eventbridge-discovery.git',
  projenrcTs: true,
  // Deps
  cdkVersion: cdkVersion,
  projenVersion: projenVersion,
  constructsVersion: constructsVersion,
  deps: deps,
  devDeps: ['@types/jest', '@types/node', 'eslint-config-prettier', 'eslint-plugin-prettier', 'prettier', 'cdk-dia'],
  // Docs, Testing & Linting
  codeCov: true,
  eslint: true,
  docsDirectory: 'docs',
  // Config
  prettier: true,
  prettierOptions: {
    settings: {
      printWidth: 120,
      trailingComma: TrailingComma.ALL,
      arrowParens: ArrowParens.ALWAYS,
      singleQuote: true,
    },
  },
  pullRequestTemplate: false,
  githubOptions: {
    pullRequestLint: false,
  },

  release: false,
  dependabot: false,
  autoMerge: false,
  docgen: true,
  docgenFilePath: 'docs/API.md',
  catalog: { announce: false },
  // Ignore files
  gitignore: commonIgnore,
  npmignore: commonIgnore,
});

new TextFile(project, '.nvmrc', {
  lines: [nodejsVersion],
});

project.synth();
