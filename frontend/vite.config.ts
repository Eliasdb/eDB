import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        host: '0.0.0.0', // Bind to all network interfaces
        port: 8080, // Ensure this matches the port you'll expose
        strictPort: true, // Exit if port is already in use
<<<<<<< HEAD
        watch: {
            usePolling: true, // Use polling for better compatibility in containerized environments
            interval: 100, // Adjust as needed
        },
=======
>>>>>>> ea02745 (Save untracked files before pull)
    },
});
