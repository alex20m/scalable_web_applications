<script>
	export let exerciseId;
  
	let text = '';
	let characters = 0;
	let ifs = 0;
  
	function updateStats() {
	  characters = text.length;
	  ifs = (text.match(/if/g) || []).length;
	}
  </script>
  
  <textarea bind:value={text} on:input={updateStats} />
  <button on:click={updateStats}>Submit</button>
  
  <p>Characters: {characters}</p>
  <p>ifs: {ifs}</p>