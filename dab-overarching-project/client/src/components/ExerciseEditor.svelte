<script>
  import { onMount } from 'svelte';

  let source_code = "";
  let exercise = "";
  let gradingStatus = "";
  let grade = null;
  let submissionId = null; 
  let pollingInterval; 
  export let exerciseId;

  async function handleSubmit() {
    const response = await fetch(`/api/exercises/${exerciseId}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ source_code })
    }); 
    const data = await response.json();
    submissionId = data.id;
    source_code = "";
    pollingInterval = setInterval(getGradingStatus, 500);
  }

  async function fetchExercise() {
      const res = await fetch(`/api/exercises/${exerciseId}`);
      exercise = await res.json();
    }

  const getGradingStatus = async () => {
    const response = await fetch(`/api/submissions/${submissionId}/status`);
    const data = await response.json();
    
    if (data.grading_status !== gradingStatus) {
      gradingStatus = data.grading_status;
      grade = data.grade; 
    }

    if (gradingStatus === 'graded') {
      clearInterval(pollingInterval);
    }
  };

  onMount(fetchExercise);
</script>


<h1>{ exercise.title }</h1>
<p>{ exercise.description }</p>

<textarea bind:value={source_code}></textarea>
<button on:click={handleSubmit}>Submit</button>

<p id="grading-status">Grading status: {gradingStatus}</p>
<p id="grade">Grade: {grade}</p>


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