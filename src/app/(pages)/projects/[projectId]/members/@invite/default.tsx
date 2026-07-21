// src > app > (pages) > projects > [projectId] > members > @invite > default.tsx
// A fallback file for Next.js Parallel Routes (@slot).

export default function Default() {
  return null;
  // return <>Default</>;
}

/*
When a user navigates to the main page (/projects/123/members), Next.js looks for what to render inside the @invite slot. 
Since the user hasn't opened the modal yet, Next.js renders default.tsx. [ this component ]
*/
