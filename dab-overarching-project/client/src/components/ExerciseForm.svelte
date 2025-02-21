<script>
  let text = '';
  let charCount = 0;
  let ifCount = 0;

  function handleSubmit() {
    charCount = text.length;
    ifCount = (text.match(/if/g) || []).length;
  }
</script>

<div>
  <textarea bind:value={text}></textarea>
  <button on:click={handleSubmit}>Submit</button>
  
  {#if charCount > 0}
    <p>Characters: {charCount}</p>
    <p>ifs: {ifCount}</p>
  {/if}
</div>

<style>
  textarea {
    width: 100%;
    min-height: 200px;
    margin-bottom: 1rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
</style> 