---
name: react-rules
description: Best practices and architecture guidelines for building React applications with TypeScript, Zustand, Zod, React Hook Form, and TanStack Query / SWR. Use this skill whenever creating a new React project/component or modifying, refactoring, or extending React components, hooks, state management, forms, or UI logic.
---

# React & TypeScript Development Guidelines (`react-rules`)

Este documento establece los estándares de arquitectura, patrones y mejores prácticas para el desarrollo de aplicaciones en React con TypeScript.

## 1. Stack Tecnológico Estándar

- **React**: Versión `19.2.5` o superior disponible.
- **Lenguaje**: TypeScript obligatorio en lugar de JavaScript para garantizar tipado estático, seguridad de código y mantenibilidad.
- **Estado Global**: Zustand utilizando la función `create()`.
- **Validación de Datos**: Zod (`z.object`, `z.string`, etc.) evaluando esquemas con `.parse()` o `.safeParse()`.
- **Formularios**: React Hook Form integrado con Zod mediante `@hookform/resolvers/zod`.
- **Obtención de Datos de API**: TanStack Query (React Query) o SWR para almacenamiento en caché, sincronización y refetch automático entre componentes.
- **Estilos**: Tailwind CSS para maquetación y diseño UI mediante clases utilitarias de forma limpia y responsiva.

---

## 2. Estructura de Proyecto React + TypeScript

Un proyecto estándar React + TypeScript debe seguir una estructura modular por características o capas funcionales:

```text
src/
├── assets/          # Recurso estáticos (imágenes, fuentes, etc.)
├── components/      # Componentes UI reutilizables y atómicos
├── features/        # Módulos por dominio o funcionalidad (e.g. auth, dashboard)
├── hooks/           # Custom hooks reutilizables (useAuth, useFetch, etc.)
├── stores/          # Stores de Zustand para estado global
├── services/        # Cliente API, peticiones HTTP y adaptadores
├── schemas/         # Esquemas de validación con Zod
├── types/           # Definiciones e interfaces de TypeScript
└── utils/           # Funciones puras y utilidades de ayuda (cn / clsx)
```

---

## 3. Principios de Componentes y Pureza

- **Componentes Pequeños y Enfocados**: Diseña componentes simples con una sola responsabilidad (Single Responsibility Principle).
- **Componentes Puros**: Evita efectos secundarios (side effects) durante la fase de renderizado. Los componentes y hooks deben comportarse como funciones puras respecto a sus props y estado.
- **Reglas de Hooks**: Nunca llames hooks dentro de bucles, declaraciones condicionales o funciones anidadas. Siempre invócalos en el nivel superior del componente o custom hook.

---

## 4. Gestión del Estado e Inmutabilidad

- **Inmutabilidad Estricta**: Nunca mutes el estado directamente (`state.items.push()` está prohibido). Utiliza siempre copias inmutables utilizando la sintaxis spread (`...`) o métodos inmutables de array (`map`, `filter`, `concat`).
- **Estado Global con Zustand**:
  Define los stores globales creando hooks personalizados con `create()` que consoliden tanto el estado como sus acciones.
  ```typescript
  import { create } from 'zustand';

  interface UserStore {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
  }

  export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
  }));
  ```

---

## 5. Reglas para `useEffect` y Event Handlers

- **Uso Exclusivo de `useEffect`**: Utiliza `useEffect` **únicamente** para sincronizar con sistemas externos (APIs, interacción directa con el DOM, o librerías de terceros).
- **Cálculo en Renderizado**: No uses `useEffect` para calcular lógica derivada de props o estado. Procesa esos valores directamente en el cuerpo del render o dentro de event handlers.
- **Efectos Simples**: Mantén los efectos concisos y con dependencias explícitas y completas en el arreglo de dependencias.
- **Event Handlers para Interacciones del Usuario**: La lógica desencadenada por una acción directa del usuario (hacer clic, enviar un formulario) **debe** ir en un event handler, no dentro de un `useEffect`.
- **Comunicación con el Padre**: Para notificar cambios a un componente padre, pasa callbacks mediante props y ejecútalos desde el componente hijo cuando ocurra el cambio.
- **Ajuste o Reinicio de Estado**: Para reiniciar o ajustar el estado interno cuando cambie un identificador, utiliza la prop `key` en el componente para forzar su re-montado, o deriva el estado directamente.

---

## 6. Lógica Reutilizable y Custom Hooks

- **Extracción de Lógica**: Extrae la lógica reutilizable, compleja o de side-effects en Custom Hooks (e.g. `useAuth`, `useFetch`, `useDebounce`) para mantener los componentes UI limpios y orientados a presentación.
- **Funciones Reutilizables**: Comparte lógica común entre event handlers o efectos mediante funciones auxiliares puras o custom hooks dedicados.

---

## 7. Formularios con React Hook Form y Zod

Integra la validación de formularios definiendo un esquema Zod y pasándolo a React Hook Form:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    // Manejar envío de formulario
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}
```

---

## 8. Data Fetching con React Query / SWR

Cuando los componentes necesiten consumir APIs externas y compartir o reutilizar la información con almacenamiento en caché, estado de carga y refetch automático:

- Usa `@tanstack/react-query` o `swr`.
- Encapsula las consultas API dentro de custom hooks dedicados (ej: `useUserQuery`, `useProducts`).

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../services/api';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
}
```

---

## 9. Optimización de Rendimiento (`useMemo`)

- Utiliza `useMemo` para memorizar cálculos verdaderamente costosos o complejos que no deban reevaluarse en cada renderizado.
- Evita el sobreuso de `useMemo` para operaciones triviales (como concatenación de strings o filtrados de arrays pequeños).

---

## 10. Estilos y Diseño UI con Tailwind CSS

- **Clases Utilitarias**: Emplea clases utilitarias de Tailwind CSS para la maquetación y el estilizado de componentes UI.
- **Clases Condicionales Dinámicas**: Para combinar clases dinámicas o condicionales sin conflictos de especificidad o duplicados, utiliza la función de utilidad `cn` (con `clsx` y `tailwind-merge`):
  ```typescript
  import { clsx, type ClassValue } from 'clsx';
  import { twMerge } from 'tailwind-merge';

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }
  ```
- **Diseño Responsivo y Temas**: Utiliza los prefijos integrados de Tailwind (`sm:`, `md:`, `lg:`, `dark:`) para garantizar interfaces adaptables a distintos dispositivos y soporte para modo oscuro.
