@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-display: 'Aref Ruqaa', serif;
  --font-body: 'Cairo', sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  background-color: #FBF6F1;
  color: #2A211F;
}

.dark body {
  background-color: #1E1517;
  color: #F3E9E1;
}

::selection {
  background: #C97B84;
  color: white;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
