<script setup>
import { onMounted, ref, computed } from "vue";

const incidents = ref([]);
const title = ref("");
const priority = ref("Medium");
const loading = ref(false);

const openCount = computed(() => incidents.value.filter(i => i.status === "Open").length);
const highCount = computed(() => incidents.value.filter(i => i.priority === "High").length);

async function loadIncidents() {
  const response = await fetch("http://localhost:5000/api/incidents");
  incidents.value = await response.json();
}

async function createIncident() {
  if (!title.value.trim()) return;
  loading.value = true;
  await fetch("http://localhost:5000/api/incidents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: title.value, priority: priority.value })
  });
  title.value = "";
  priority.value = "Medium";
  await loadIncidents();
  loading.value = false;
}

onMounted(loadIncidents);
</script>

<template>
  <main class="container">
    <header>
      <div>
        <p class="eyebrow">ENTERPRISE IT OPERATIONS</p>
        <h1>ITOps360</h1>
        <p class="subtitle">IT service management & analytics platform</p>
      </div>
    </header>

    <section class="stats">
      <article><span>Open incidents</span><strong>{{ openCount }}</strong></article>
      <article><span>High priority</span><strong>{{ highCount }}</strong></article>
      <article><span>Total tickets</span><strong>{{ incidents.length }}</strong></article>
    </section>

    <section class="card">
      <h2>Create incident</h2>
      <div class="form">
        <input v-model="title" placeholder="Describe the issue" @keyup.enter="createIncident" />
        <select v-model="priority">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
        <button :disabled="loading" @click="createIncident">
          {{ loading ? "Creating..." : "Create ticket" }}
        </button>
      </div>
    </section>

    <section class="card">
      <div class="section-title">
        <h2>Incident queue</h2>
        <button class="secondary" @click="loadIncidents">Refresh</button>
      </div>
      <div v-if="!incidents.length" class="empty">No incidents yet.</div>
      <div v-for="incident in incidents" :key="incident.id" class="ticket">
        <div>
          <strong>#{{ incident.id }} — {{ incident.title }}</strong>
          <small>{{ incident.assignee }} · {{ incident.created_at }}</small>
        </div>
        <div class="badges">
          <span class="badge">{{ incident.priority }}</span>
          <span class="badge">{{ incident.status }}</span>
        </div>
      </div>
    </section>
  </main>
</template>
