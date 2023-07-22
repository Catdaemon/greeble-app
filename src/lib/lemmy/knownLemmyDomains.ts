import { useQuery } from '@tanstack/react-query'
import queryClient from './rqClient'

interface LemmyInstanceDetails {
  name: string
  domain: string
}

const knownLemmyDomains: LemmyInstanceDetails[] = [
  {
    name: 'lemmy.ml',
    domain: 'lemmy.ml'
  },
  {
    name: 'lemmy.world',
    domain: 'lemmy.world'
  },
  {
    name: 'beehaw.org',
    domain: 'beehaw.org'
  }
]

async function fetchLemmyInstances() {
  try {
    const url =
      'https://raw.githubusercontent.com/maltfield/awesome-lemmy-instances/main/awesome-lemmy-instances.csv'
    const result = await fetch(url)
    const text = await result.text()
    const extractDetails = /\[(.*)\]\((.*)\)/g
    const extracted = [...text.matchAll(extractDetails)]
    return extracted.map((match) => ({
      name: match[1],
      domain: new URL(match[2]).hostname
    }))
  } catch (e) {
    return knownLemmyDomains
  }
}

export default function useLemmyInstances() {
  return useQuery({
    queryKey: ['lemmyInstances'],
    queryFn: fetchLemmyInstances
  })
}

export async function getLemmyInstances() {
  const client = queryClient
  const data = client.getQueryData<LemmyInstanceDetails[]>(['lemmyInstances'])
  if (!data) {
    const result = await fetchLemmyInstances()
    client.setQueryData(['lemmyInstances'], result)
    return result
  }
  return data
}
