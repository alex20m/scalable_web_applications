<script>  
    import { onMount } from 'svelte';
    let languages = [];
    
    async function fetchLanguages() {
        const res = await fetch('api/languages');
        languages = await res.json();
  }

    onMount(fetchLanguages);
</script>

<ul>
    {#each languages as lang}
        <li><a href={`/languages/${lang.id}`}>{lang.name}</a></li>
    {/each}
</ul>