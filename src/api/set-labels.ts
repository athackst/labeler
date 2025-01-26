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

// Function to update a list of labels
export const updateLabels = async (
  client: ClientType,
  labels: string[],
  labelConfigs: LabelConfigs
) => {
  for (const label of labels) {
    const configs = labelConfigs.get(label);
    const metadata = configs?.find(config => config.meta)?.meta;
    const colorConfig = metadata?.color;
    const descriptionConfig = metadata?.description;
    const params: Parameters<typeof client.rest.issues.updateLabel>[0] = {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      name: label
    };
    if (colorConfig) {
      params.color = colorConfig.replace('#', '');
    }
    if (descriptionConfig) {
      params.description = descriptionConfig;
    }
    await client.rest.issues.updateLabel(params);
  }
};
