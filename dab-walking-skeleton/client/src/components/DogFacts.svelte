<script>
    let fact = $state("");
    fact = fetchDogFact();

    async function fetchDogFact() {
        const response = await fetch("https://dogapi.dog/api/v2/facts");
        const data = await response.json();
        fact = data.data[0].attributes.body;
    } 
</script>

<button onclick={fetchDogFact}>Fetch a dog fact</button>

<p>{fact}</p>
  