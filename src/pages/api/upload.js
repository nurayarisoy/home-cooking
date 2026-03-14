import fs from "node:fs/promises";
import path from "node:path";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseMultipart(req) {
  const form = formidable({
    multiples: false,
    keepExtensions: true,
    maxFileSize: 100 * 1024 * 1024,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ fields, files });
    });
  });
}

function pickFile(files) {
  const raw = files?.file;
  if (!raw) return null;
  return Array.isArray(raw) ? raw[0] : raw;
}

function detectMediaType(mimeType) {
  if (String(mimeType || "").startsWith("video/")) {
    return "video";
  }
  return "image";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { files } = await parseMultipart(req);
    const file = pickFile(files);

    if (!file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const mimeType = String(file.mimetype || "");
    if (!mimeType.startsWith("image/") && !mimeType.startsWith("video/")) {
      return res.status(400).json({ message: "Only image/video files are allowed." });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const extension =
      path.extname(file.originalFilename || "") || path.extname(file.filepath || "") || "";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${extension}`;
    const destination = path.join(uploadsDir, safeName);

    await fs.copyFile(file.filepath, destination);
    await fs.unlink(file.filepath).catch(() => undefined);

    return res.status(200).json({
      message: "File uploaded successfully.",
      url: `/uploads/${safeName}`,
      fileName: file.originalFilename || safeName,
      mediaType: detectMediaType(mimeType),
    });
  } catch (error) {
    if (error?.code === 1009 || error?.httpCode === 413) {
      return res.status(413).json({
        message: "Video dosyasi cok buyuk. Lutfen 100MB altinda bir dosya sec.",
      });
    }
    console.error("Upload API error:", error);
    return res.status(500).json({ message: "Upload failed." });
  }
}
