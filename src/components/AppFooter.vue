<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div>
        <p class="eyebrow">SHINSEKAI COMMUNITY</p>
        <h2>Shinsekai 插件市场</h2>
        <p>前端浏览壳，基于公开 registry JSON 展示插件信息。</p>
      </div>
      <div class="footer-links">
        <a v-if="registryForkUrl" :href="registryForkUrl" target="_blank" rel="noreferrer">Registry</a>
        <a href="https://github.com/RachelForster/Shinsekai-Plugin-Registry" target="_blank" rel="noreferrer">Upstream Registry</a>
        <a href="https://github.com/AstrBotDevs/Astrbot_Plugins_Market" target="_blank" rel="noreferrer">AstrBot Market Source</a>
      </div>
    </div>
    <p class="footer-license">
      &copy; {{ currentYear }} Shinsekai Community. Based on AstrBotDevs/Astrbot_Plugins_Market and distributed under GPL-3.0.
    </p>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
const registryForkUrl = import.meta.env.VITE_REGISTRY_FORK_URL || 'https://github.com/End0rph1nww/Shinsekai-Plugin-Registry'
</script>
