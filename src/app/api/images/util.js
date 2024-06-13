import fs from 'node:fs/promises'

async function upload(req, path) {
  const formData = await req.formData();
  const file = formData.get("file");
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  fs.writeFile(`./public${path}/${file.name}`, buffer);
}

async function getFile(dir, req) {
  const filenames = await fs.readdir(dir);
  let result = []
  const { searchParams } = new URL(req.url);
  for (let i = 0; i < filenames.length && result.length <= 20; i++) {
    if (searchParams.get('name')) {
      if (filenames[i].toLowerCase().includes(searchParams.get('name').toLowerCase())) {
        result.push(filenames[i])
      }
    } else {
      result.push(filenames[i])
    }
  }
  return result
}

export { upload, getFile }