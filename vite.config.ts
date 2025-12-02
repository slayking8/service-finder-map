import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl' // 1. Importe o plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    basicSsl() // 2. Adicione o plugin à lista de plugins
  ],
  server: {
    host: true, // 3. Garante que o servidor fica acessível na rede
    https: true // 4. Habilita o HTTPS
  },
})

