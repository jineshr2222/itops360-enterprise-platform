<template>
  <div class="container">
    <header class="header">
      <h1>ITOps360 Enterprise Platform</h1>
      <p class="subtitle">ITSM Incident Management & Analytics</p>
    </header>

    <main class="content">
      <!-- Live Server Health Badge -->
      <section class="card">
        <h2>Backend System Status</h2>
        <div class="status-indicator">
          <span :class="['badge', isConnected ? 'online' : 'offline']">
            {{ isConnected ? '● Backend Live' : '○ Connecting...' }}
          </span>
        </div>
        <p style="margin-top: 10px; font-size: 0.9rem; opacity: 0.85;">
          {{ healthStatus }}
        </p>
      </section>

      <!-- Create Incident Form -->
      <section class="card" style="margin-top: 16px;">
        <h2>Report New Incident</h2>
        <form @submit.prevent="createIncident" style="display: flex; flex-direction: column; gap: 10px; margin-top: 12px;">
          <input 
            v-model="newTitle" 
            placeholder="Incident title (e.g. VPN down)" 
            required 
            style="padding: 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: white;"
          />
          <div style="display: flex; gap: 10px;">
            <select 
              v-model="newPriority" 
              style="padding: 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: #1e293b; color: white; flex: 1;"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <button 
              type="submit" 
              style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </section>

      <!-- Incidents Table from Backend -->
      <section class="card" style="margin-top: 16px;">
        <h2>Active Incidents (Live from API)</h2>
        <div style="overflow-x: auto; margin-top: 12px;">
          <table style="width: 100%; text-align: left; border-collapse: collapse; font-size: 0.85rem;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.15);">
                <th style="padding: 8px 4px;">ID</th>
                <th style="padding: 8px 4px;">Title</th>
                <th style="padding: 8px 4px;">Priority</th>
                <th style="padding: 8px 4px;">Status</th>
                <th style="padding: 8px 4px;">Assignee</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="inc in incidents" :key="inc.id" style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 8px 4px; font-weight: bold;">#{{ inc.id }}</td>
                <td style="padding: 8px 4px;">{{ inc.title }}</td>
                <td style="padding: 8px 4px;">
                  <span :style="{ color: inc.priority === 'High' ? '#f87171' : (inc.priority === 'Medium' ? '#fbbf24' : '#60a5fa'), fontWeight: 'bold' }">
                    {{ inc.priority }}
                  </span>
                </td>
                <td style="padding: 8px 4px;">{{ inc.status }}</td>
                <td style="padding: 8px 4px; opacity: 0.8;">{{ inc.assignee || 'Unassigned' }}</td>
              </tr>
              <tr v-if="incidents.length === 0">
                <td colspan="5" style="text-align: center; padding: 16px; opacity: 0.7;">No incidents found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
const BACKEND_URL = 'https://itops360-backend-api.onrender.com'

export default {
  name: 'App',
  data() {
    return {
      isConnected: false,
      healthStatus: 'Checking API health...',
      incidents: [],
      newTitle: '',
      newPriority: 'Medium'
    }
  },
  async mounted() {
    await this.fetchHealth()
    await this.fetchIncidents()
  },
  methods: {
    async fetchHealth() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/health`)
        if (res.ok) {
          const data = await res.json()
          this.healthStatus = `Connected: ${data.service} (Status: ${data.status})`
          this.isConnected = true
        } else {
          this.healthStatus = `API Error HTTP ${res.status}`
        }
      } catch (err) {
        this.healthStatus = 'Backend is starting up... Please wait a few seconds.'
        this.isConnected = false
      }
    },
    async fetchIncidents() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/incidents`)
        if (res.ok) {
          const data = await res.json()
          this.incidents = Array.isArray(data) ? data : [data]
        }
      } catch (err) {
        console.error('Error fetching incidents:', err)
      }
    },
    async createIncident() {
      if (!this.newTitle.trim()) return
      try {
        const res = await fetch(`${BACKEND_URL}/api/incidents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: this.newTitle,
            priority: this.newPriority,
            assignee: 'Support Team'
          })
        })
        if (res.ok) {
          this.newTitle = ''
          await this.fetchIncidents()
        }
      } catch (err) {
        console.error('Failed to create incident:', err)
      }
    }
  }
}
</script>
