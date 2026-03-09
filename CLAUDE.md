# BoardArt — Project Conventions

## File Structure

- Each component lives in its own subfolder named after the component: `components/<ComponentName>/<ComponentName>.tsx`
- The CSS module lives alongside it: `components/<ComponentName>/<ComponentName>.module.css`
- Import directly from the file, not the folder: `import Foo from '~/components/Foo/Foo'`

## TypeScript

- Props interfaces must be named after their component: `<ComponentName>Props`
  - `interface SectionHeaderProps` — correct
  - `interface Props` — do not use
