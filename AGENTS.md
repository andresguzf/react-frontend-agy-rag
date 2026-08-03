# Repository Agents & Skills Guide (`AGENTS.md`)

Este documento proporciona la visión general técnica, arquitectura y pautas para agentes de IA y desarrolladores que trabajen en la aplicación frontend `10-appreact-rag`.

## 📌 Descripción del Proyecto
`10-appreact-rag` es la interfaz de usuario web desarrollada con **React**, **TypeScript**, **Tailwind CSS**, **Zustand** y **TanStack Query** para interactuar con la API REST del backend `springai-agy-rag` (subida de PDFs y Chat RAG).

---

## 🛠️ Tecnologías y Dependencias
- **Framework UI:** React + TypeScript (Vite)
- **Estilos:** Tailwind CSS
- **Estado Global:** Zustand
- **Formularios & Validación:** React Hook Form + Zod (`@hookform/resolvers/zod`)
- **Peticiones HTTP / Caching:** TanStack Query (`@tanstack/react-query`)
- **Iconos:** Lucide React

---

## 🎯 Skills Disponibles

El proyecto cuenta con la habilidad copiada en `.agents/skills/`:

### 1. `react-rules`
- **Ubicación:** `.agents/skills/react-rules/SKILL.md`
- **Descripción:** Estándares de desarrollo y reglas de arquitectura para proyectos y componentes de React con TypeScript, Tailwind CSS, Zustand, Zod, React Hook Form y React Query / SWR.
- **Trigger / Cuándo invocar:** Debe invocarse **SIEMPRE** que el usuario pida:
  - Crear o modificar componentes de React y maquetación con Tailwind CSS.
  - Diseñar e implementar Custom Hooks (`useAuth`, `useFetch`, etc.).
  - Gestionar estado global utilizando Zustand (`create()`).
  - Crear esquemas de validación de datos utilizando Zod (`z.object`, `z.string`, `parse`, `safeParse`).
  - Implementar formularios utilizando React Hook Form con resolver de Zod.
  - Implementar lógica de UI o fetching de APIs utilizando TanStack Query (React Query) o SWR.

---

## 🚀 Comandos de Desarrollo

- **Instalar dependencias:**
  ```bash
  npm install
  ```
- **Ejecutar servidor de desarrollo:**
  ```bash
  npm run dev
  ```
- **Construir para producción:**
  ```bash
  npm run build
  ```
