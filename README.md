# ⚛️ React RAG Frontend (`react-frontend-agy-rag`)

Una interfaz web moderna e interactiva desarrollada con **React 19**, **TypeScript**, **Tailwind CSS**, **Zustand** y **TanStack Query** para conectarse al backend RAG de Spring Boot (`springai-agy-rag`).

---

## 💡 ¿De qué trata esta aplicación? (Resumen para todo público)

Esta aplicación es el **portal web (frontend)** que permite a los usuarios interactuar de forma intuitiva con su propio asistente de Inteligencia Artificial local:

### 🌟 Funcionalidades Principales:
1. **Subida de Documentos PDF:** Arrastra y suelta o selecciona archivos PDF para enviarlos a procesar e indexar vectorialmente en ChromaDB.
2. **Chat Inteligente RAG:** Realiza preguntas sobre los documentos cargados. El asistente recupera los fragmentos de texto exactos y responde basándose estrictamente en tu información.
3. **Visualización de Fuentes:** Muestra las referencias y fragmentos de contexto utilizados para generar cada respuesta.

---

## 🛠️ Resumen Técnico (Para Desarrolladores)

El proyecto sigue una arquitectura modular en React con TypeScript siguiendo los estándares estables de la skill `react-rules`:

```
[ Frontend: React + TS + Tailwind ] ──( HTTP Proxy /api )──> [ Backend: Spring Boot RAG (8080) ]
                                                                       │
                                                         [ Ollama (Qwen3) + ChromaDB ]
```

### 🧱 Arquitectura y Librerías:
- **Build Tool / Bundler:** Vite (con HMR ultra rápido)
- **UI Framework:** React 19 + TypeScript
- **Estilos:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Estado Global:** Zustand (`useStore`)
- **Formularios & Validaciones:** React Hook Form + Zod (`@hookform/resolvers/zod`)
- **Consumo de APIs & Caching:** TanStack Query (`@tanstack/react-query`)
- **Iconografía:** Lucide React (`lucide-react`)
- **Renderizado Markdown:** `react-markdown` + `remark-gfm`

---

## 📋 Requisitos Previos

1. **Node.js** (v18 o superior) y `npm`
2. **Backend RAG en ejecución:** El backend Spring Boot (`springai-agy-rag`) debe estar corriendo en `http://localhost:8080` (con ChromaDB en Docker y Ollama activos).

---

## 🚀 Guía de Inicio Rápido

### 1. Clonar e Instalar Dependencias

```bash
git clone https://github.com/andresguzf/react-frontend-agy-rag.git
cd react-frontend-agy-rag
npm install
```

### 2. Ejecutar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

### 3. Compilar para Producción

```bash
npm run build
```

---

## ⚙️ Configuración del Proxy API (`vite.config.ts`)

Las peticiones iniciadas hacia `/api/*` son redirigidas automáticamente al backend Spring Boot mediante el proxy de Vite:

```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

---

## 📁 Estructura del Proyecto

```text
10-appreact-rag/
├── .agents/skills/react-rules/ # Guías y reglas arquitectónicas de React + TypeScript
├── AGENTS.md                   # Documentación de reglas para agentes de IA
├── README.md                   # Documentación principal del proyecto
├── index.html                  # HTML principal
├── package.json                # Dependencias y scripts del proyecto
├── src/
│   ├── assets/                 # Recursos gráficos
│   ├── components/             # Componentes UI reutilizables
│   ├── features/               # Módulos del dominio (PDF Upload, Chat)
│   ├── hooks/                  # Custom hooks para React Query / Zustand
│   ├── stores/                 # Zustand stores para el estado global
│   ├── types/                  # Definiciones de TypeScript (DTOs del backend)
│   ├── App.tsx                 # Componente raíz
│   ├── main.tsx                # Punto de entrada
│   └── index.css               # Importación de Tailwind CSS
└── vite.config.ts              # Configuración de Vite y Proxy
```

---

## 📄 Licencia

Distribuido bajo la licencia **MIT**.
