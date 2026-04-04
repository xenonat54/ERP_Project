import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin-dashboard.html'),
        student: resolve(__dirname, 'student-dashboard.html'),
        teacher: resolve(__dirname, 'teacher-dashboard.html')
      }
    }
  }
});