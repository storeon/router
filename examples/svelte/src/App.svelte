<script>
  import { setStore } from '@storeon/svelte'

  import { store } from './store'
  import Counter from './Child.svelte'

  setStore(store)
</script>

<Counter />
