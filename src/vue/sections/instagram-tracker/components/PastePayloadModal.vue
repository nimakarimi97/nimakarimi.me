<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'import'])

const pastedText = ref('')
const localError = ref('')

watch(() => props.show, (newVal) => {
  if (newVal) {
    pastedText.value = ''
    localError.value = ''
  }
})

function handleImport() {
  localError.value = ''
  if (!pastedText.value.trim()) {
    localError.value = 'Please paste the JSON payload first.'
    return
  }

  try {
    const parsed = JSON.parse(pastedText.value.trim())
    if (!parsed || !parsed.followers || !parsed.following) {
      localError.value = 'Invalid payload structure: missing followers or following arrays.'
      return
    }
    emit('import', parsed)
  } catch {
    localError.value = 'Invalid JSON syntax. Please copy and paste the entire output.'
  }
}
</script>

<template>
  <div
    v-if="show"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5);"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content border-0 shadow">
        <div class="modal-header border-bottom">
          <h5 class="modal-title fw-bold">
            <i class="fas fa-paste text-primary me-2" />
            Paste Synced Data Payload
          </h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="emit('close')"
          />
        </div>

        <div class="modal-body">
          <p class="text-muted small">
            If the bookmarklet or console script copied the JSON to your clipboard, paste it below to import it into your tracker:
          </p>

          <div v-if="localError" class="alert alert-danger small py-2 mb-3">
            <i class="fas fa-exclamation-circle me-1" />
            {{ localError }}
          </div>

          <textarea
            v-model="pastedText"
            class="form-control font-monospace text-muted small"
            rows="8"
            placeholder="{&quot;timestamp&quot;: 1725..., &quot;followers&quot;: [...], &quot;following&quot;: [...]}"
          />
        </div>

        <div class="modal-footer border-top">
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="emit('close')"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="!pastedText.trim()"
            @click="handleImport"
          >
            Import Snapshot
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
