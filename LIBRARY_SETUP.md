# Library Development Guide

This project is set up to support Angular library development in the `libs` folder.

## Creating a New Library

To create a new library, use the Angular CLI:

```bash
ng generate library <library-name>
```

This will:
- Create a new folder under `libs/<library-name>`
- Add the library configuration to `angular.json`
- Set up the necessary TypeScript configuration files
- Add path mappings to `tsconfig.json` for easy imports

## Building Libraries

To build a specific library:

```bash
ng build <library-name>
```

To build all libraries:

```bash
ng build --configuration production
```

## Using Libraries in the Main Application

After creating and building a library, you can import from it using:

```typescript
import { SomeComponent } from 'library-name';
```

The path mappings in `tsconfig.json` will be automatically configured by the Angular CLI.

## Project Structure

```
libs/
├── <library-1>/
│   ├── src/
│   │   ├── lib/
│   │   └── public-api.ts
│   ├── ng-package.json
│   └── tsconfig.lib.json
└── <library-2>/
    └── ...
```

## Current State

The project has been cleaned up and all previous library references have been removed. The `libs` folder is empty and ready for new library creation.