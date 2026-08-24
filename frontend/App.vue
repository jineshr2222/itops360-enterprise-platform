<script setup>
import { onMounted, ref, computed } from "vue";

const incidents = ref([]);
const title = ref("");
const priority = ref("Medium");
const loading = ref(false);

const openCount = computed(() => incidents.value.filter(i => i.status === "Open").length);
const highCount = computed(() => incidents.value.filter(i => i.priority === "High").length);

async function loadIncidents() {
  try {
    const response = await fetch("https://itops360-backend.onrender.com/api/incidents");
    incidents.value = await response.json();
  } catch (error) {
    console.error("Error loading incidents:", error);
  }
}

async function createIncident() {
  if (!title.value.trim()) return;
  loading.value = true;
  try {
    await fetch("https://itops360-backend.onrender.com/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.value, priority: priority.value })
    });
    title.value = "";
    priority.value = "Medium";
    await loadIncidents();
  } catch (error) {
    console.error("Error creating incident:", error);
  } finally {
    loading.value = false;
  }
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
          {{ loading ? "Creating..." : "Create Ticket" }}
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
          <strong>#{{ incident.id }} - {{ incident.title }}</strong>
          <small>{{ incident.assignee || 'Unassigned' }} • {{ incident.created_at }}</small>
        </div>
        <div class="badges">
          <span class="badge" :class="incident.priority">{{ incident.priority }}</span>
          <span class="badge" :class="incident.status">{{ incident.status }}</span>
        </div>
      </div>
    </section>
  </main>
</template>

