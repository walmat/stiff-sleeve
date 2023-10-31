import {defineCliConfig} from 'sanity/cli'
import {projectId, dataset} from './sanity.config'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  graphql: [
    {
      playground: true,
      tag: 'stiff-sleeve',
      id: 'schema-stiff-sleeve',
    }
  ]
})
