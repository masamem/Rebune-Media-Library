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


## V3 viewer notes

- 3D model URLs now include the Google Drive `modifiedTime` as a version query (`?v=...`). Replacing a GLB in Drive changes the URL and avoids serving an older cached model.
- The default 3D camera is framed closer (`camera-orbit` radius 12%, 18deg field of view) so product models open larger.
