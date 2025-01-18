import * as github from '@actions/github';
import {ClientType} from './types';

export const setLabels = async (
  client: ClientType,
  prNumber: number,
  labels: string[]
) => {
  await client.rest.issues.setLabels({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: prNumber,
    labels: labels
  });
};

// Function to get missing labels that need to be created
export const getMissingLabels = async (
  client: ClientType,
  labels: string[]
) => {
  const {data: existingLabels} = await client.rest.issues.listLabelsForRepo({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo
  });

  return labels.filter(
    label => !existingLabels.some(existingLabel => existingLabel.name === label)
  );
};

// Function to create a list of labels
export const createLabels = async (client: ClientType, labels: string[]) => {
  for (const label of labels) {
    await client.rest.issues.createLabel({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      name: label
    });
  }
};
