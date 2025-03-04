<script>  
    import { onMount } from 'svelte';
    let exercises = [];
    export let languageId;
    
    async function fetchExercises() {
        const res = await fetch(`/api/languages/${languageId}/exercises`);
        exercises = await res.json();
  }

    onMount(fetchExercises);
</script>

<ul>
    {#each exercises as exer}
        <li><a href={`/exercises/${exer.id}`}>{exer.title}</a></li>
    {/each}
</ul>