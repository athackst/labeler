import * as github from '@actions/github';
import {ClientType} from './types';
import {MatchConfig} from './get-label-configs';

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

export type LabelConfigs = Map<string, MatchConfig[]>;

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
export const createLabels = async (
  client: ClientType,
  labels: string[],
  labelConfigs: LabelConfigs
) => {
  for (const label of labels) {
    const configs = labelConfigs.get(label);
    const metadata = configs?.find(config => config.meta)?.meta;
    const colorConfig = metadata?.color || 'ffffff';
    const descriptionConfig =
      metadata?.description || 'Created from labeler action';
    await client.rest.issues.createLabel({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      name: label,
      color: colorConfig,
      description: descriptionConfig
    });
  }
};
