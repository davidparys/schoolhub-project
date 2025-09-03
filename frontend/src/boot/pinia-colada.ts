import { boot } from 'quasar/wrappers'
import { PiniaColada } from '@pinia/colada'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default boot(({ app }) => {
    // Install Pinia Colada plugin according to documentation
    // Global options can be configured here if needed
    app.use(PiniaColada, {})
})
