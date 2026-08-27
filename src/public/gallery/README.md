# OS-DPI Example Gallery

This folder powers the in-app **Example Gallery**. Each board is a folder:

```
gallery/
  index.json        generated manifest (not committed, do not edit by hand)
  <slug>/
    board.osdpi     the design, exported from OS-DPI
    meta.json       { title, description, tags, author }
```

`index.json` is generated from the folders, so it is not checked in. It is
rebuilt by `npm run gallery:index`, and automatically before `npm start` and
`npm run build`.

An entry may leave out `board.osdpi` and instead set `board` in `meta.json` to a
path the site already serves, which avoids committing a second copy of a board
that already lives in the repo:

```json
{ "title": "Single words", "board": "examples/updated/grid_ex_1.osdpi" }
```

## Contribute from inside OS-DPI

1. Build your board.
2. **File → Share to Gallery**, fill in the details, and click the button.
3. The app downloads `board.osdpi` and `meta.json`, then opens a GitHub page
   for a new folder. Drag the two files in and propose the change to open a
   pull request.
