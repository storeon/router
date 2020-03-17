<script>
  import { getStore } from '@storeon/svelte'
  import { routerKey } from '../../../'

  const { [routerKey]: route } = getStore(routerKey)
</script>

You can access the router like default svelte store via $:
{$route.match.page}
