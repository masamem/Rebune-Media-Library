# Rebune 3D setup

The site now recognizes GLB/GLTF files from a dedicated 3D folder inside each Google Drive category.

Example:

```text
rebune-media-library/
├── منزلي/
│   ├── فيديوهات/
│   ├── تصاميم/
│   └── 3D/
│       └── RE-2-104.glb
└── تجميلي/
    ├── فيديوهات/
    ├── تصاميم/
    └── 3D/
```

Accepted 3D folder names: `3D`, `models`, `model`, `نماذج ثلاثية الأبعاد`, `ثلاثي الأبعاد`.

The filename must begin with the product code. For example `RE-2-104.glb` is associated automatically with product `RE-2-104`.

`/api/media` returns `fileType: "3d"` and `modelUrl`. `/api/file` serves `.glb` as `model/gltf-binary` and `.gltf` as `model/gltf+json`. The frontend opens the model with Google `<model-viewer>` in the existing preview modal.
